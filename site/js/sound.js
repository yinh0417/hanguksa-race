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
  // 음원 파일 없이 브라우저가 그 자리에서 만드는 K-pop 풍 창작 음악이라 저작권 문제가 없습니다.
  //  - 대기실: 100BPM, 부드러운 시티팝풍 화음(Dmaj7 - C#m7 - Bm7 - E7), 손가락 튕기는 소리, 종소리 멜로디
  //  - 레이스: 128BPM 댄스팝, 쿵쿵 4박 킥, 손뼉, 오프비트 하이햇, 신스 화음(C#m - A - E - B), 따라 부르기 쉬운 후렴 멜로디
  //  - 레이스 마지막 30초: 138BPM으로 빨라지고 하이햇이 촘촘해지며 마디 끝에 손뼉 연타
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
  function noise(time, dur, vol, cutoff, type) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = type || 'highpass'; f.frequency.value = cutoff;
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(time); s.stop(time + dur + 0.02);
  }
  function clap(time, vol) {
    [0, 0.012, 0.024].forEach(d => noise(time + d, 0.09, vol, 1200, 'bandpass'));
  }
  // 신스 화음: 톱니파 3개를 살짝 어긋나게 겹쳐 반짝이는 K-pop 신스 소리
  function stab(notes, time, dur, vol, cutoff) {
    const f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(cutoff || 2600, time); f.Q.value = 2;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    f.connect(g); g.connect(bus);
    notes.forEach(n => [-9, 0, 9].forEach(det => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(m(n), time); o.detune.value = det;
      o.connect(f); o.start(time); o.stop(time + dur + 0.05);
    }));
  }
  function pad(notes, time, dur, vol) {
    notes.forEach(n => at(m(n), time, dur, 'triangle', vol, 0.08));
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
  const GROOVES = {
    four:   { kick: [0, 4, 8, 12], clap: [4, 12], open: [2, 6, 10, 14], closed: [1, 3, 5, 7, 9, 11, 13, 15] },
    dembow: { kick: [0, 4, 8, 12], clap: [3, 6, 11, 14], open: [], closed: [0, 2, 4, 6, 8, 10, 12, 14] },
    half:   { kick: [0, 7, 10], clap: [8], open: [6, 14], closed: [0, 2, 4, 6, 8, 10, 12, 14] },
    bounce: { kick: [0, 6, 10], clap: [4, 12], open: [14], closed: [2, 6, 10] },
    chill:  { kick: [0, 10], clap: [4, 12], open: [], closed: [2, 6, 10, 14] }
  };
  function makeSong(def) {
    const chords = def.prog.map(chordOf), g = GROOVES[def.groove];
    const hook = makeHook(chords, def.seed, def.rhythm);
    return {
      name: def.name, bpm: def.bpm, bpmHot: def.hot || def.bpm,
      step(s, t, sd) {
        const barNo = Math.floor(s / 16) % 4, bar = chords[barNo], i = s % 16, h = hook[s % 64];
        if (def.race) {
          if (g.kick.includes(i)) kick(t);
          if (g.clap.includes(i)) clap(t, 0.2);
          if (hot && barNo === 3 && i >= 12) clap(t, 0.12);                 // 마지막 30초: 마디 끝 손뼉 연타
          if (g.open.includes(i)) noise(t, 0.09, 0.065, 6000);
          else if (hot || g.closed.includes(i)) noise(t, 0.025, 0.035, 8000);
          if (def.bass.includes(i)) at(m(bar.bass + ((def.oct || []).includes(i) ? 12 : 0)), t, sd * 1.6, def.bassWave || 'square', 0.085);
          if (def.stab.includes(i)) stab(bar.notes, t, i === 0 ? 0.3 : 0.13, 0.045, def.cutoff);
          if (h) { at(m(h), t, sd * 1.8, def.lead || 'square', 0.03); at(m(h), t, sd * 1.8, 'sine', 0.055); }
          else if (def.arp && i % 2 === 1) at(m(bar.notes[(i >> 1) % bar.notes.length] + 12), t, sd * 0.9, 'triangle', 0.025);
        } else {
          if (g.kick.includes(i)) kick(t, 0.3);
          if (g.clap.includes(i)) noise(t, 0.05, 0.11, 2500, 'bandpass');  // 손가락 튕기는 소리
          if (g.closed.includes(i)) noise(t, 0.03, 0.03, 8000);
          if (i === 0) pad(bar.notes, t, sd * 15, 0.028);
          if (def.stab.includes(i)) stab(bar.notes, t, 0.16, 0.032, 1600);
          if (def.bass.includes(i)) at(m(bar.bass + ((def.oct || []).includes(i) ? 12 : 0)), t, sd * 2.5, 'triangle', 0.14);
          if (h) bell(h, t, 0.055);
        }
      }
    };
  }

  // 대기실 5곡, 레이스 6곡. 게임마다 바로 전과 다른 곡이 무작위로 나옵니다.
  const PLAYLIST = {
    lobby: [
      { name: '대기실 산책', prog: ['Dmaj7', 'C#m7', 'Bm7', 'E7'], bpm: 100, groove: 'chill', bass: [0, 7, 10], oct: [7], stab: [3, 7, 11, 14], seed: 5, rhythm: [0, 6, 10] },
      { name: '오후의 교실', prog: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], bpm: 96, groove: 'chill', bass: [0, 6, 10], oct: [6], stab: [2, 6, 10, 14], seed: 9, rhythm: [0, 4, 10] },
      { name: '창가 햇살', prog: ['Cmaj7', 'Am7', 'Dm7', 'G7'], bpm: 104, groove: 'bounce', bass: [0, 3, 8, 11], oct: [3, 11], stab: [2, 6, 10, 14], seed: 15, rhythm: [0, 6, 8, 12] },
      { name: '두근두근 출발 전', prog: ['Ebmaj7', 'Dm7', 'Cm7', 'Bb'], bpm: 108, groove: 'bounce', bass: [0, 6, 10, 14], oct: [6, 14], stab: [3, 7, 11, 15], seed: 19, rhythm: [0, 3, 8, 11] },
      { name: '레트로 시티', prog: ['Amaj7', 'F#m7', 'Bm7', 'E'], bpm: 98, groove: 'chill', bass: [0, 3, 7, 10], oct: [7], stab: [2, 7, 10, 15], seed: 27, rhythm: [0, 6, 10, 14] }
    ],
    race: [
      { name: '출발 신호', race: true, prog: ['C#m', 'A', 'E', 'B'], bpm: 128, hot: 138, groove: 'four', bass: [0, 3, 6, 8, 10, 11, 14], oct: [6, 11], stab: [0, 3, 6, 10, 12], seed: 11, rhythm: [0, 2, 4, 6, 8, 10, 12, 14] },
      { name: '질주 본능', race: true, prog: ['Am', 'F', 'C', 'G'], bpm: 132, hot: 142, groove: 'four', bass: [0, 2, 4, 6, 8, 10, 12, 14], oct: [2, 6, 10, 14], stab: [0, 6, 12], seed: 23, rhythm: [0, 3, 6, 8, 11, 14], lead: 'sawtooth' },
      { name: '시간 여행', race: true, prog: ['Dm', 'Bb', 'F', 'C'], bpm: 124, hot: 134, groove: 'dembow', bass: [0, 3, 7, 8, 11, 15], oct: [7, 15], stab: [2, 6, 10, 14], seed: 37, rhythm: [0, 4, 6, 10, 12] },
      { name: '황금 레이스', race: true, prog: ['F#m', 'D', 'A', 'E'], bpm: 136, hot: 146, groove: 'four', bass: [0, 4, 8, 12], stab: [0, 8], seed: 41, rhythm: [0, 2, 6, 8, 10, 14], arp: true },
      { name: '마지막 질주', race: true, prog: ['Gm', 'Eb', 'Bb', 'F'], bpm: 130, hot: 140, groove: 'half', bass: [0, 3, 6, 10, 13], oct: [6, 13], stab: [0, 7, 10], seed: 53, rhythm: [0, 3, 6, 8, 12], bassWave: 'sawtooth', cutoff: 2000 },
      { name: '무지개 드라이브', race: true, prog: ['C', 'G', 'Am', 'F'], bpm: 128, hot: 138, groove: 'bounce', bass: [0, 6, 8, 14], oct: [6, 14], stab: [2, 6, 10, 14], seed: 67, rhythm: [0, 2, 6, 8, 12, 14], arp: true }
    ]
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
