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
  // 음원 파일 없이 브라우저가 그 자리에서 만드는 EDM·댄스 창작곡이라 저작권 문제가 없습니다.
  //  - 대기실과 레이스 모두 신나는 EDM 10곡(118~130BPM): 쿵쿵 4박 킥, 빌드업 상승음과 스네어 연타, 드롭의 펌핑 화음과 후렴 멜로디
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
  // ---------- EDM 소리 재료 ----------
  // 펌핑 화음: 박자마다 소리가 '훅' 빨려 들었다가 부풀어 오르는 EDM 특유의 출렁임(사이드체인 느낌)
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
  // 드롭 시작을 알리는 심벌
  function crash(time) { noise(time, 1.4, 0.07, 4500); }

  // ---------- EDM 곡 ----------
  // 8마디 한 바퀴: 앞 4마디는 빌드업(아르페지오, 4마디째 스네어 연타와 상승음), 뒤 4마디는 드롭(펌핑 화음, 후렴 멜로디, 힘찬 베이스)
  // style: house(오프비트 베이스), electro(16분 굴러가는 베이스), bigroom(묵직한 리드), future(통통 튀는 베이스), tropical(마림바 같은 플럭)
  const BASS = {
    house: [2, 6, 10, 14],
    electro: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    bigroom: [0, 3, 6, 8, 11, 14],
    future: [0, 3, 6, 10, 12],
    tropical: [0, 3, 6, 8, 11, 14]
  };
  function makeSong(def) {
    const chords = def.prog.map(chordOf), bassSteps = BASS[def.style];
    const hook = makeHook(chords, def.seed, def.rhythm);
    const plk = def.style === 'tropical' ? 'triangle' : def.style === 'future' ? 'sine' : 'square';
    return {
      name: def.name, bpm: def.bpm, bpmHot: def.hot || def.bpm + 10,
      step(s, t, sd) {
        const bar8 = Math.floor(s / 16) % 8, i = s % 16, drop = bar8 >= 4, bar = chords[bar8 % 4], h = hook[s % 64];
        const lastBuild = bar8 === 3;
        // 북: 4박 킥(빌드업 마지막 반 마디는 킥을 빼고 스네어를 점점 촘촘하게)
        if (i % 4 === 0 && !(lastBuild && i >= 8)) kick(t, drop ? 0.6 : 0.48);
        if (drop || bar8 >= 1) { if (i === 4 || i === 12) clap(t, drop ? 0.22 : 0.15); }
        if (lastBuild && i === 0) riser(t, sd * 16);
        if (lastBuild && (i >= 8 || i % 2 === 0)) clap(t, 0.05 + (i / 16) * 0.12);
        if (drop && bar8 === 4 && i === 0) crash(t);
        // 하이햇: 오프비트 열린 소리 + 드롭에서는 16분 닫힌 소리
        if (i % 4 === 2) noise(t, 0.08, drop ? 0.07 : 0.05, 6500);
        else if (drop || hot) noise(t, 0.025, 0.03, 8500);
        if (hot && bar8 % 4 === 3 && i >= 12) clap(t, 0.12);   // 마지막 30초: 마디 끝 손뼉 연타
        // 베이스
        if (bassSteps.includes(i) && (drop || def.style === 'house' || bar8 >= 2)) {
          const up = def.style === 'electro' ? (i % 4 === 2 ? 12 : 0) : (i % 8 === 6 ? 12 : 0);
          at(m(bar.bass + up), t, sd * (def.style === 'electro' ? 0.9 : 1.6), def.style === 'electro' || def.style === 'bigroom' ? 'sawtooth' : 'square', drop ? 0.09 : 0.06);
        }
        if (drop) {
          // 펌핑 화음과 후렴 멜로디
          if (i % 4 === 0) pumpChord(bar.notes, t, sd, def.style === 'bigroom' ? 0.05 : 0.04, def.cutoff);
          if (h) {
            const w = def.lead || (def.style === 'bigroom' ? 'sawtooth' : 'square');
            at(m(h), t, sd * 1.7, w, def.style === 'bigroom' ? 0.04 : 0.032);
            at(m(h + 12), t, sd * 1.2, 'sine', 0.028);
          } else if (def.style === 'tropical' || def.style === 'future') pluck(bar.notes[(i >> 1) % bar.notes.length] + 12, t, 0.035, plk);
        } else {
          // 빌드업: 화음을 타고 오르내리는 아르페지오, 2마디째부터 멜로디 살짝 미리 듣기
          if (i % 2 === 0) pluck(bar.notes[(i >> 1) % bar.notes.length] + (i >= 8 ? 24 : 12), t, 0.04, plk);
          if (bar8 === 2 && h) bell(h, t, 0.04);
        }
      }
    };
  }

  // 신나는 EDM·댄스 창작곡 10곡. 대기실에서는 이 빠르기로, 레이스에서는 조금 더 빠르게(마지막 30초는 더더 빠르게) 틀어요.
  const SONGS = [
    { name: '네온 스타트',     style: 'house',    prog: ['Am', 'F', 'C', 'G'],     bpm: 124, seed: 101, rhythm: [0, 3, 6, 8, 10, 14] },
    { name: '레이저 점프',     style: 'electro',  prog: ['Fm', 'Db', 'Ab', 'Eb'],  bpm: 128, seed: 113, rhythm: [0, 2, 6, 8, 12], lead: 'sawtooth' },
    { name: '소다 팝',         style: 'future',   prog: ['D', 'A', 'Bm', 'G'],     bpm: 122, seed: 127, rhythm: [0, 3, 6, 10, 12, 14], lead: 'triangle' },
    { name: '은하수 질주',     style: 'bigroom',  prog: ['Em', 'C', 'G', 'D'],     bpm: 128, seed: 131, rhythm: [0, 4, 6, 8, 12], cutoff: 3000 },
    { name: '트로피컬 웨이브', style: 'tropical', prog: ['F', 'C', 'Dm', 'Bb'],    bpm: 118, seed: 149, rhythm: [0, 3, 6, 8, 11, 14], lead: 'triangle' },
    { name: '하이파이브',      style: 'house',    prog: ['Bbm', 'Gb', 'Db', 'Ab'], bpm: 126, seed: 157, rhythm: [0, 2, 6, 8, 10, 14] },
    { name: '펀치 라인',       style: 'electro',  prog: ['Gm', 'Eb', 'Bb', 'F'],   bpm: 130, seed: 163, rhythm: [0, 3, 6, 8, 11], lead: 'sawtooth' },
    { name: '별빛 비트',       style: 'future',   prog: ['A', 'E', 'F#m', 'D'],    bpm: 124, seed: 173, rhythm: [0, 2, 4, 8, 10, 12] },
    { name: '파워 업',         style: 'bigroom',  prog: ['Cm', 'Ab', 'Eb', 'Bb'],  bpm: 126, seed: 181, rhythm: [0, 3, 8, 11, 14], cutoff: 3200 },
    { name: '무지개 댄스',     style: 'tropical', prog: ['C', 'Am', 'F', 'G'],     bpm: 120, seed: 191, rhythm: [0, 2, 6, 8, 12, 14] }
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
