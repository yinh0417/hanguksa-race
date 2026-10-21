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
    fuel: () => sweep(220, 70, 0.4, 'sawtooth', 0.12),
    ink: () => sweep(500, 120, 0.3, 'sine', 0.2),
    finish: () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.1, 0.22, 'square', 0.16)); },
    end: () => { [1175, 988, 784, 1047].forEach((f, i) => tone(f, i * 0.16, 0.3, 'triangle', 0.22)); },
    join: () => tone(1047, 0, 0.12, 'triangle', 0.15),
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

  const SONGS = {
    lobby: {
      bpm: 100, bpmHot: 100,
      bars: [
        { bass: 38, chord: [62, 66, 69, 73] },  // Dmaj7
        { bass: 37, chord: [61, 64, 68, 71] },  // C#m7
        { bass: 35, chord: [59, 62, 66, 69] },  // Bm7
        { bass: 40, chord: [64, 68, 71, 74] }   // E7
      ],
      melody: { 0: 81, 6: 85, 10: 83, 16: 80, 22: 76, 26: 78, 32: 74, 38: 78, 42: 81, 48: 80, 52: 76, 58: 83 },
      step(s, t, sd) {
        const bar = this.bars[Math.floor(s / 16) % 4], i = s % 16;
        if (i === 0 || i === 10) kick(t, 0.32);
        if (i === 4 || i === 12) noise(t, 0.05, 0.12, 2500, 'bandpass');   // 손가락 튕기는 소리
        if (i % 4 === 2) noise(t, 0.03, 0.035, 8000);
        if (i === 0) pad(bar.chord, t, sd * 15, 0.03);
        if (i === 3 || i === 7 || i === 11 || i === 14) stab(bar.chord, t, 0.16, 0.035, 1600);
        if (i === 0 || i === 7 || i === 10) at(m(bar.bass + (i === 7 ? 12 : 0)), t, sd * 2.5, 'triangle', 0.14);
        const mel = this.melody[s % 64];
        if (mel) bell(mel, t, 0.06);
      }
    },
    race: {
      bpm: 128, bpmHot: 138,
      bars: [
        { bass: 37, chord: [61, 64, 68] },  // C#m
        { bass: 33, chord: [57, 61, 64] },  // A
        { bass: 40, chord: [64, 68, 71] },  // E
        { bass: 35, chord: [59, 63, 66] }   // B
      ],
      hook: { 0: 80, 2: 83, 4: 85, 6: 83, 8: 80, 10: 78, 12: 76, 14: 78, 16: 80, 18: 80, 20: 83, 22: 78, 24: 76, 28: 73, 30: 76 },
      step(s, t, sd) {
        const bar = this.bars[Math.floor(s / 16) % 4], i = s % 16, barNo = Math.floor(s / 16) % 4;
        if (i % 4 === 0) kick(t);
        if (i === 4 || i === 12) clap(t, 0.22);
        if (hot && barNo === 3 && i >= 12) clap(t, 0.12);                    // 마지막 30초: 마디 끝 손뼉 연타
        if (i % 4 === 2) noise(t, 0.09, 0.07, 6000);                          // 오프비트 열린 하이햇
        else if (hot || i % 2 === 1) noise(t, 0.025, 0.035, 8000);             // 닫힌 하이햇
        if ([0, 3, 6, 8, 10, 11, 14].includes(i)) at(m(bar.bass + (i === 6 || i === 11 ? 12 : 0)), t, sd * 1.6, 'square', 0.085);
        if ([0, 3, 6, 10, 12].includes(i)) stab(bar.chord.map(n => n + 12), t, i === 0 ? 0.3 : 0.13, 0.05);
        const h = this.hook[s % 32];
        if (h) { at(m(h), t, sd * 1.8, 'square', 0.035); at(m(h), t, sd * 1.8, 'sine', 0.06); }
      }
    }
  };

  function pump() {
    const sd = 60 / (hot ? song.bpmHot : song.bpm) / 4;
    while (nextTime < ctx.currentTime + 0.12) {
      song.step(step, nextTime, sd);
      nextTime += sd;
      step++;
    }
  }
  function startBgm(name) {
    const next = SONGS[name || 'race'];
    if (bgmTimer && song === next) return;
    if (!ensure()) return;
    stopBgm();
    if (!bus) { bus = ctx.createGain(); bus.gain.value = 0.8; bus.connect(master); }
    song = next; hot = 0; step = 0;
    nextTime = ctx.currentTime + 0.05;
    bgmTimer = setInterval(pump, 25);
  }
  function stopBgm() { clearInterval(bgmTimer); bgmTimer = null; hot = 0; }
  window.SOUND = {
    play(name) { if (!muted && FX[name]) FX[name](); },
    unlock: ensure,
    startBgm, stopBgm,
    setIntensity(v) { hot = v ? 1 : 0; },
    playing: () => !!bgmTimer && song,
    isMuted: () => muted,
    toggle() {
      muted = !muted;
      try { localStorage.setItem('hkr-muted', muted ? '1' : '0'); } catch (e) { /* 무시 */ }
      if (master) master.gain.value = muted ? 0 : 0.5;
      return muted;
    }
  };
})();
