/* 큰 화면 소리: 파일 없이 브라우저에서 바로 만드는 효과음과 배경 음악 */
(function () {
  let ctx = null, master = null, bgmTimer = null;
  let muted = false;
  try { muted = localStorage.getItem('hkr-muted') === '1'; } catch (e) { /* 저장 공간을 못 쓰면 소리 켬 */ }

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, vol) {
    const c = ensure();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, c.currentTime + start);
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, c.currentTime + start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    o.connect(g); g.connect(master);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.05);
  }
  function sweep(f1, f2, dur, type, vol) {
    const c = ensure();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sawtooth';
    o.frequency.setValueAtTime(f1, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(f2, c.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(master);
    o.start(); o.stop(c.currentTime + dur + 0.05);
  }

  const FX = {
    count: () => tone(660, 0, 0.18, 'square', 0.2),
    go: () => { tone(880, 0, 0.12); tone(1175, 0.12, 0.3); },
    boost1: () => sweep(300, 900, 0.25, 'triangle', 0.2),
    boost2: () => { sweep(300, 1200, 0.3, 'triangle', 0.22); sweep(400, 1400, 0.3, 'square', 0.06); },
    shield: () => { tone(988, 0, 0.1, 'triangle'); tone(1319, 0.08, 0.2, 'triangle'); },
    block: () => { tone(1568, 0, 0.08, 'square', 0.15); tone(1175, 0.06, 0.15, 'square', 0.12); },
    balloon: () => { sweep(900, 200, 0.18, 'sine', 0.3); tone(140, 0.12, 0.25, 'triangle', 0.25); },
    lightning: () => { sweep(2000, 80, 0.45, 'sawtooth', 0.25); },
    turbo: () => { sweep(200, 1600, 0.6, 'sawtooth', 0.12); sweep(300, 1800, 0.6, 'triangle', 0.2); },
    star: () => { [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, i * 0.06, 0.12, 'triangle', 0.14)); },
    caltrop: () => { tone(1800, 0, 0.05, 'square', 0.15); sweep(700, 150, 0.25, 'sawtooth', 0.15); },
    thunder: () => { sweep(120, 40, 0.6, 'sawtooth', 0.3); sweep(2400, 100, 0.35, 'square', 0.12); },
    fuel: () => sweep(220, 70, 0.4, 'sawtooth', 0.12),
    ink: () => sweep(500, 120, 0.3, 'sine', 0.2),
    finish: () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.1, 0.22, 'square', 0.16)); },
    end: () => { [1175, 988, 784, 1047].forEach((f, i) => tone(f, i * 0.16, 0.3, 'triangle', 0.22)); },
    join: () => tone(1047, 0, 0.12, 'triangle', 0.15),
    firework: () => { sweep(300, 1500, 0.22, 'triangle', 0.06); tone(1760 + Math.random() * 600, 0.22, 0.08, 'square', 0.04); },
    tick: () => { tone(1568, 0, 0.05, 'square', 0.12); tone(784, 0.06, 0.05, 'square', 0.08); }
  };

  // ---------- 배경 음악 (대기실, 레이스) ----------
  // 음원 파일 없이 브라우저가 그 자리에서 만드는 K-pop 걸그룹 댄스풍 창작곡이라 저작권 문제가 없습니다.
  //  - 대기실과 레이스 모두 10곡(118~130BPM): 묵직한 베이스, 탁 튀는 스네어, 금관 신스 후렴, "헤이!" 함성, 댄스 브레이크
  //  - 레이스는 6BPM 더 빠르게, 마지막 30초는 더 빨라지고 하이햇이 촘촘해지며 마디 끝에 손뼉 연타
  const m = n => 440 * Math.pow(2, (n - 69) / 12);
  let song = null, hot = 0, nextTime = 0, step = 0, noiseBuf = null, bus = null;

  function at(freq, time, dur, type, vol, attack) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + (attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g); g.connect(bus);
    o.start(time); o.stop(time + dur + 0.05);
  }
  function kick(time, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(150, time);
    o.frequency.exponentialRampToValueAtTime(42, time + 0.11);
    g.gain.setValueAtTime(vol || 0.55, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
    o.connect(g); g.connect(bus);
    o.start(time); o.stop(time + 0.22);
  }
  function noiseBuffer() {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }
  function noise(time, dur, vol, cutoff, type) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuffer();
    f.type = type || 'highpass'; f.frequency.value = cutoff;
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(time); s.stop(time + dur + 0.02);
  }
  function clap(time, vol) {
    [0, 0.012, 0.024].forEach(d => noise(time + d, 0.09, vol, 1200, 'bandpass'));
  }
  function bell(n, time, vol) {
    at(m(n), time, 0.5, 'sine', vol);
    at(m(n + 12), time, 0.25, 'sine', vol * 0.35);
  }

  // ---------- 곡 만들기 ----------
  // 화음 진행, 리듬(그루브), 베이스와 신스 자리, 멜로디 씨앗(seed)을 정하면 곡 하나가 됩니다.
  // 모두 이 프로그램이 만든 창작곡이라 저작권 걱정이 없습니다.
  const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  function chordOf(name) {
    const mt = /^([A-G][#b]?)(.*)$/.exec(name);
    const root = 48 + NOTE[mt[1]];
    const iv = { m: [0, 3, 7], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], 7: [0, 4, 7, 10], '': [0, 4, 7] }[mt[2]] || [0, 4, 7];
    return { bass: root - 12, notes: iv.map(x => root + 12 + x) };
  }
  function rng(seed) {
    return () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // 화음에 맞는 음으로 멜로디를 만들고, 3마디째는 1마디를 되풀이해 귀에 남게 합니다
  function makeHook(chords, seed, rhythm) {
    const r = rng(seed), hook = {}, bars = [];
    for (let b = 0; b < 4; b++) {
      const tones = chords[b].notes.map(n => n + 12);
      let last = tones[0];
      bars[b] = rhythm.map(() => {
        const n = r() < 0.72 ? tones[Math.floor(r() * tones.length)] : last + (r() < 0.5 ? 2 : -2);
        last = n;
        return n;
      });
    }
    bars[2] = bars[0].map(n => n + (chords[2].notes[0] - chords[0].notes[0]));
    bars.forEach((ns, b) => rhythm.forEach((st, k) => { hook[b * 16 + st] = ns[k]; }));
    return hook;
  }
  // ---------- K-pop 댄스 소리 재료 ----------
  // 펌핑 화음: 박자마다 소리가 '훅' 빨려 들었다가 부풀어 오르는 출렁임(사이드체인 느낌)
  function pumpChord(notes, time, sd, vol, cutoff) {
    const f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(cutoff || 2400, time); f.Q.value = 1.2;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + sd * 1.3);
    g.gain.exponentialRampToValueAtTime(vol * 0.5, time + sd * 3.2);
    g.gain.exponentialRampToValueAtTime(0.0001, time + sd * 3.95);
    f.connect(g); g.connect(bus);
    notes.forEach(n => [-12, 0, 12].forEach(det => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(m(n), time); o.detune.value = det;
      o.connect(f); o.start(time); o.stop(time + sd * 4);
    }));
  }
  // 톡톡 튀는 플럭(아르페지오용)
  function pluck(n, time, vol, wave) {
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = wave || 'square'; o.frequency.setValueAtTime(m(n), time);
    f.type = 'lowpass'; f.frequency.setValueAtTime(4200, time); f.frequency.exponentialRampToValueAtTime(500, time + 0.16);
    g.gain.setValueAtTime(vol, time); g.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    o.connect(f); f.connect(g); g.connect(bus);
    o.start(time); o.stop(time + 0.2);
  }
  // 빌드업 상승음: 쉬익- 하고 점점 높아지는 소리
  function riser(time, dur) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuffer(); s.loop = true;
    f.type = 'bandpass'; f.Q.value = 3;
    f.frequency.setValueAtTime(400, time); f.frequency.exponentialRampToValueAtTime(9000, time + dur);
    g.gain.setValueAtTime(0.0001, time); g.gain.exponentialRampToValueAtTime(0.09, time + dur * 0.95); g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(time); s.stop(time + dur + 0.02);
  }
  function crash(time) { noise(time, 1.4, 0.07, 4500); }
  // 묵직한 베이스: 아래를 받치는 사인파 + 살짝 거친(찌그러뜨린) 톱니파. glide: 808처럼 음이 미끄러져 내려가요
  let grit = null;
  function gritBus() {
    if (!grit) {
      grit = ctx.createWaveShaper();
      const c = new Float32Array(1024);
      for (let k = 0; k < c.length; k++) c[k] = Math.tanh((k / 511.5 - 1) * 3);
      grit.curve = c;
      const g = ctx.createGain(); g.gain.value = 0.55;
      grit.connect(g); g.connect(bus);
    }
    return grit;
  }
  function heavyBass(n, time, dur, vol, glide) {
    const sub = ctx.createOscillator(), sg = ctx.createGain();
    sub.type = 'sine'; sub.frequency.setValueAtTime(m(n), time);
    if (glide) sub.frequency.exponentialRampToValueAtTime(m(n - 5), time + dur);
    sg.gain.setValueAtTime(vol * 1.6, time); sg.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    sub.connect(sg); sg.connect(bus); sub.start(time); sub.stop(time + dur + 0.05);
    const saw = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    saw.type = 'sawtooth'; saw.frequency.setValueAtTime(m(n + 12), time);
    f.type = 'lowpass'; f.frequency.setValueAtTime(1400, time); f.frequency.exponentialRampToValueAtTime(260, time + dur);
    g.gain.setValueAtTime(vol, time); g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    saw.connect(f); f.connect(g); g.connect(gritBus()); saw.start(time); saw.stop(time + dur + 0.05);
  }
  // 탁 튀는 스네어: 몸통(짧은 톤) + 쉭 소리
  function snare(time, vol) {
    noise(time, 0.17, vol, 1800, 'bandpass');
    noise(time, 0.06, vol * 0.6, 5000);
    at(190, time, 0.08, 'triangle', vol * 0.9);
  }
  // 금관처럼 빵! 하고 터지는 신스 훅
  function brass(n, time, dur, vol, wave) {
    const f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'lowpass'; f.Q.value = 4;
    f.frequency.setValueAtTime(700, time); f.frequency.exponentialRampToValueAtTime(3800, time + 0.04); f.frequency.exponentialRampToValueAtTime(1300, time + dur);
    g.gain.setValueAtTime(0.0001, time); g.gain.exponentialRampToValueAtTime(vol, time + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    f.connect(g); g.connect(bus);
    [[wave || 'sawtooth', -7], ['square', 7]].forEach(([w, det]) => {
      const o = ctx.createOscillator();
      o.type = w; o.frequency.setValueAtTime(m(n), time); o.detune.value = det;
      o.connect(f); o.start(time); o.stop(time + dur + 0.05);
    });
  }
  // "헤이!" 하고 외치는 듯한 짧은 함성
  function hey(time, vol) {
    noise(time, 0.13, vol, 950, 'bandpass');
    noise(time + 0.005, 0.11, vol * 0.7, 2300, 'bandpass');
    at(330, time, 0.1, 'sawtooth', vol * 0.25);
  }

  // ---------- 곡 짜임(16마디) ----------
  // 1~4 벌스: 킥·스네어·묵직한 베이스로 그루브, 플럭이 살짝
  // 5~6 프리코러스: 4박 킥, 아르페지오, 상승음, 6마디째 스네어 연타
  // 7~14 코러스: 심벌과 함께 터지는 베이스, 펌핑 화음, 금관 신스 후렴, "헤이!" 함성
  // 15~16 댄스 브레이크: 반으로 느려진 북, 촘촘히 구르는 하이햇, 808처럼 미끄러지는 베이스, 신스 끊어 치기
  // groove(베이스 리듬): bounce, drive, swing, tropical
  const BASS = {
    bounce: [0, 3, 6, 10, 12],
    drive: [0, 2, 3, 6, 8, 10, 11, 14],
    swing: [0, 3, 7, 8, 11, 14],
    tropical: [0, 3, 6, 8, 11, 14]
  };
  function makeSong(def) {
    const chords = def.prog.map(chordOf), bassSteps = BASS[def.groove];
    const hook = makeHook(chords, def.seed, def.rhythm);
    const plk = def.groove === 'tropical' ? 'triangle' : 'square';
    return {
      name: def.name, bpm: def.bpm, bpmHot: def.hot || def.bpm + 10,
      step(s, t, sd) {
        const bar = Math.floor(s / 16) % 16, i = s % 16, ch = chords[bar % 4], h = hook[s % 64];
        const part = bar < 4 ? 'verse' : bar < 6 ? 'pre' : bar < 14 ? 'chorus' : 'break';
        if (part === 'break') {
          // 댄스 브레이크(반으로 느려진 느낌)
          if (i === 0 || i === 3 || i === 10) kick(t, 0.62);
          if (i === 8) { snare(t, 0.26); hey(t, 0.1); }
          noise(t, 0.025, 0.035, 8500);
          if (i >= 12 || (bar === 15 && i >= 8)) noise(t + sd / 2, 0.02, 0.03, 9000);   // 하이햇 구르기
          if (i === 0 || i === 10) heavyBass(ch.bass, t, sd * (i === 0 ? 9 : 6), 0.1, true);
          if (i === 0 || i === 6 || i === 11) ch.notes.forEach(n => brass(n + 12, t, 0.16, 0.022, def.lead));
          if (bar === 15 && i === 8) riser(t, sd * 8);
          return;
        }
        // 북
        const lastPre = bar === 5;
        if (part === 'verse') { if (i === 0 || i === 8 || i === def.kickExtra) kick(t, 0.55); }
        else if (i % 4 === 0 && !(lastPre && i >= 12)) kick(t, part === 'chorus' ? 0.62 : 0.5);
        if (i === 4 || i === 12) { snare(t, part === 'chorus' ? 0.24 : 0.18); if (part === 'chorus') clap(t, 0.16); }
        if (lastPre && i >= 8) snare(t, 0.05 + (i - 8) * 0.025);
        if (bar === 4 && i === 0) riser(t, sd * 32);
        if (bar === 6 && i === 0) crash(t);
        // 하이햇
        if (part === 'chorus') { if (i % 4 === 2) noise(t, 0.08, 0.07, 6500); else noise(t, 0.025, 0.03, 8500); }
        else if (i % 2 === 0) noise(t, 0.025, 0.035, 8500);
        if (hot && i >= 12 && bar % 2 === 1) clap(t, 0.12);   // 마지막 30초: 마디 끝 손뼉 연타
        // 베이스
        if (bassSteps.includes(i) && !(lastPre && i >= 8)) heavyBass(ch.bass + (i % 8 === 6 ? 12 : 0), t, sd * 1.7, part === 'chorus' ? 0.1 : 0.075);
        if (part === 'chorus') {
          if (i % 4 === 0) pumpChord(ch.notes, t, sd, 0.032, def.cutoff);
          if (h) { brass(h, t, sd * 1.6, 0.045, def.lead); at(m(h + 12), t, sd * 1.2, 'sine', 0.025); }
          if (def.chant && i === 14 && bar % 2 === 1) hey(t, 0.12);
        } else if (part === 'pre') {
          pluck(ch.notes[i % ch.notes.length] + (i >= 8 ? 24 : 12), t, 0.04, plk);
        } else if (i % 4 === 3) pluck(ch.notes[(i >> 2) % ch.notes.length] + 12, t, 0.035, plk);
      }
    };
  }

  // K-pop 걸그룹 댄스풍 창작곡 10곡. 대기실에서는 이 빠르기로, 레이스에서는 조금 더 빠르게(마지막 30초는 더더 빠르게) 틀어요.
  const SONGS = [
    { name: '네온 스타트',     groove: 'bounce',   prog: ['Am', 'F', 'C', 'G'],     bpm: 124, seed: 101, rhythm: [0, 3, 6, 8, 10, 14], chant: true, kickExtra: 10 },
    { name: '레이저 점프',     groove: 'drive',    prog: ['Fm', 'Db', 'Ab', 'Eb'],  bpm: 128, seed: 113, rhythm: [0, 2, 6, 8, 12], chant: true, kickExtra: 6 },
    { name: '소다 팝',         groove: 'swing',    prog: ['D', 'A', 'Bm', 'G'],     bpm: 122, seed: 127, rhythm: [0, 3, 6, 10, 12, 14], lead: 'square', kickExtra: 10 },
    { name: '은하수 질주',     groove: 'drive',    prog: ['Em', 'C', 'G', 'D'],     bpm: 128, seed: 131, rhythm: [0, 4, 6, 8, 12], chant: true, cutoff: 3000, kickExtra: 6 },
    { name: '트로피컬 웨이브', groove: 'tropical', prog: ['F', 'C', 'Dm', 'Bb'],    bpm: 118, seed: 149, rhythm: [0, 3, 6, 8, 11, 14], lead: 'square', kickExtra: 11 },
    { name: '하이파이브',      groove: 'bounce',   prog: ['Bbm', 'Gb', 'Db', 'Ab'], bpm: 126, seed: 157, rhythm: [0, 2, 6, 8, 10, 14], chant: true, kickExtra: 10 },
    { name: '펀치 라인',       groove: 'drive',    prog: ['Gm', 'Eb', 'Bb', 'F'],   bpm: 130, seed: 163, rhythm: [0, 3, 6, 8, 11], chant: true, kickExtra: 6 },
    { name: '별빛 비트',       groove: 'swing',    prog: ['A', 'E', 'F#m', 'D'],    bpm: 124, seed: 173, rhythm: [0, 2, 4, 8, 10, 12], kickExtra: 10 },
    { name: '파워 업',         groove: 'drive',    prog: ['Cm', 'Ab', 'Eb', 'Bb'],  bpm: 126, seed: 181, rhythm: [0, 3, 8, 11, 14], chant: true, cutoff: 3200, kickExtra: 6 },
    { name: '무지개 댄스',     groove: 'tropical', prog: ['C', 'Am', 'F', 'G'],     bpm: 120, seed: 191, rhythm: [0, 2, 6, 8, 12, 14], lead: 'square', kickExtra: 11 }
  ];
  const PLAYLIST = {
    lobby: SONGS,
    race: SONGS.map(s => Object.assign({}, s, { bpm: s.bpm + 6, hot: s.bpm + 16 }))
  };
  // 선생님이 켜 둔 곡만 무작위 재생에 넣습니다 (노트북에 기억)
  function enabledList(kind) {
    try {
      const v = JSON.parse(localStorage.getItem('hkr-songs-' + kind));
      if (Array.isArray(v)) return PLAYLIST[kind].map((_, k) => v[k] !== false);
    } catch (e) { /* 무시 */ }
    return PLAYLIST[kind].map(() => true);
  }
  function setSongEnabled(kind, k, on) {
    const en = enabledList(kind);
    en[k] = !!on;
    try { localStorage.setItem('hkr-songs-' + kind, JSON.stringify(en)); } catch (e) { /* 무시 */ }
  }
  function pickSong(kind, force) {
    const list = PLAYLIST[kind], en = enabledList(kind);
    let last = -1;
    try { last = +localStorage.getItem('hkr-last-song-' + kind); } catch (e) { /* 무시 */ }
    let pool = list.map((_, k) => k).filter(k => en[k]);
    if (!pool.length) pool = list.map((_, k) => k);
    const fresh = pool.filter(k => k !== last);
    const from = fresh.length ? fresh : pool;
    const k = force != null ? force : from[Math.floor(Math.random() * from.length)];
    try { localStorage.setItem('hkr-last-song-' + kind, String(k)); } catch (e) { /* 무시 */ }
    songIdx = k;
    return makeSong(list[k]);
  }

  let songKind = null, songIdx = -1;
  function pump() {
    const sd = 60 / (hot ? song.bpmHot : song.bpm) / 4;
    while (nextTime < ctx.currentTime + 0.12) {
      song.step(step, nextTime, sd);
      nextTime += sd;
      step++;
    }
  }
  function startBgm(kind, force) {
    kind = kind || 'race';
    if (bgmTimer && songKind === kind && force == null) return;
    if (!ensure()) return;
    stopBgm();
    if (!bus) { bus = ctx.createGain(); bus.gain.value = 0.8; bus.connect(master); }
    song = pickSong(kind, force); songKind = kind; hot = 0; step = 0;
    nextTime = ctx.currentTime + 0.05;
    bgmTimer = setInterval(pump, 25);
  }
  function stopBgm() { clearInterval(bgmTimer); bgmTimer = null; hot = 0; songKind = null; }
  window.SOUND = {
    play(name) { if (!muted && FX[name]) FX[name](); },
    unlock: ensure,
    startBgm, stopBgm,
    setIntensity(v) { hot = v ? 1 : 0; },
    nowPlaying: () => (bgmTimer && song ? song.name : null),
    // 선생님 화면의 음악 목록
    playlist: kind => {
      const en = enabledList(kind);
      return PLAYLIST[kind].map((s, k) => ({ name: s.name, bpm: s.bpm, enabled: en[k], playing: !!bgmTimer && songKind === kind && songIdx === k }));
    },
    setSongEnabled,
    playSong: (kind, k) => startBgm(kind, k),
    nextSong() {
      if (!bgmTimer || !songKind) return;
      const kind = songKind;
      stopBgm();
      startBgm(kind);
    },
    currentKind: () => (bgmTimer ? songKind : null),
    isMuted: () => muted,
    toggle() {
      muted = !muted;
      try { localStorage.setItem('hkr-muted', muted ? '1' : '0'); } catch (e) { /* 무시 */ }
      if (master) master.gain.value = muted ? 0 : 0.5;
      return muted;
    }
  };
})();
