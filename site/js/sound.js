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

  // ---------- 레이스 배경 음악 ----------
  // 음원 파일 없이 브라우저가 그 자리에서 만드는 소리라 저작권 문제가 없습니다.
  // 단조 4마디(Am - F - G - E)를 반복하는 레이싱 음악:
  // 쿵쿵 울리는 북, 달리는 베이스, 찰칵이는 하이햇, 위에서 도는 아르페지오.
  // 마지막 30초에는 빨라지고(150 → 172BPM) 하이햇이 촘촘해져 긴장감이 커집니다.
  const BARS = [
    { bass: 110.00, arp: [440.00, 523.25, 659.25, 880.00] },   // Am
    { bass: 87.31,  arp: [349.23, 440.00, 523.25, 698.46] },   // F
    { bass: 98.00,  arp: [392.00, 493.88, 587.33, 783.99] },   // G
    { bass: 82.41,  arp: [329.63, 415.30, 493.88, 659.25] }    // E (화성 단음계로 긴장)
  ];
  const BASS_STEPS = [0, 2, 3, 6, 8, 10, 11, 14];
  let intensity = 0, nextTime = 0, step = 0, noiseBuf = null;

  function at(freq, time, dur, type, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g); g.connect(master);
    o.start(time); o.stop(time + dur + 0.02);
  }
  function kick(time) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(140, time);
    o.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    g.gain.setValueAtTime(0.5, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    o.connect(g); g.connect(master);
    o.start(time); o.stop(time + 0.2);
  }
  function noise(time, dur, vol, cutoff) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = 'highpass'; f.frequency.value = cutoff;
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(time); s.stop(time + dur + 0.02);
  }
  function scheduleStep(s, time) {
    const bar = BARS[Math.floor(s / 16) % 4], i = s % 16;
    if (i % 4 === 0) kick(time);
    if (i === 4 || i === 12) noise(time, 0.12, 0.18, 1500);                       // 손뼉
    if (intensity ? true : i % 2 === 0) noise(time, 0.03, i % 4 === 2 ? 0.08 : 0.04, 7000); // 하이햇
    if (BASS_STEPS.includes(i)) at(bar.bass, time, 0.11, 'square', 0.09);
    if (i % 2 === 0) {
      const n = bar.arp[(i / 2) % 4] * (intensity ? 2 : 1);
      at(n, time, 0.09, 'triangle', 0.06);
    }
    if (intensity && i === 15) at(bar.arp[3] * 2, time, 0.06, 'square', 0.03);  // 마디 끝 경고음
  }
  function pump() {
    const bpm = intensity ? 172 : 150;
    const stepDur = 60 / bpm / 4;
    while (nextTime < ctx.currentTime + 0.12) {
      scheduleStep(step, nextTime);
      nextTime += stepDur;
      step++;
    }
  }
  function startBgm() {
    if (bgmTimer || !ensure()) return;
    intensity = 0;
    step = 0;
    nextTime = ctx.currentTime + 0.05;
    bgmTimer = setInterval(pump, 25);
  }
  function stopBgm() { clearInterval(bgmTimer); bgmTimer = null; intensity = 0; }

  window.SOUND = {
    play(name) { if (!muted && FX[name]) FX[name](); },
    unlock: ensure,
    startBgm, stopBgm,
    setIntensity(v) { intensity = v ? 1 : 0; },
    isMuted: () => muted,
    toggle() {
      muted = !muted;
      try { localStorage.setItem('hkr-muted', muted ? '1' : '0'); } catch (e) { /* 무시 */ }
      if (master) master.gain.value = muted ? 0 : 0.5;
      return muted;
    }
  };
})();
