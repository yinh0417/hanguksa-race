/*
 * 큰 화면 레이스의 3D 화면: 중계 방송처럼 여러 카메라로 보여 줘요
 *  - main  메인 카메라: 왼쪽 뒤 위에서 45도로 내려다봐요(art.js quarterSVG). 줌 인·줌 아웃
 *          front를 켜면 결승선 쪽 위에서 다가오는 차를 비춰 앞모습(art.js frontSVG)이 보여요(중계 화면)
 *  - chase 추격 카메라: 뒤에서 따라가며 뒷모습을 보여 줘요(art.js rearSVG)
 *  - side  측면 카메라: 길 옆에서 나란히 따라가며 옆모습을 보여 줘요(art.js carSVG)
 *  (항공 카메라는 teacher.js가 지금의 2D 지도 화면으로 보여 줘요)
 * 카메라마다 '전체'(1등부터 꼴찌까지)나 '선두'(앞선 무리)를 담아요. 위쪽 진행 막대에는 늘 모두의 자리가 나와요.
 * 이름표는 맨 위 층에 따로 두어 앞차에 가려지지 않고, 겹치면 위로 비켜 올라가 선으로 차와 이어져요.
 * 땅과 길은 canvas 한 장에 그리고, 차와 이름표는 transform만 바꿔서 학교 노트북에서도 가볍게 움직여요.
 */
(function () {
  // 코스별 색과 굽이(k: 칸마다 길이 휘는 정도)
  const THEMES = {
    oval:  { grass: ['#6fb35d', '#64a853'], road: ['#5a5e69', '#61656f'], rumble: ['#e2412e', '#ffffff'], lane: true, side: 'board', sky: ['#7cc4f0', '#d6eefb'],
             k: c => { const m = ((c % 100) + 100) % 100; return (m > 12 && m < 38) || (m > 62 && m < 88) ? 0.006 : 0; } },
    snake: { grass: ['#8cc96d', '#80be62'], road: ['#5c6069', '#646871'], rumble: ['#f5f5f7', '#5c6069'], lane: true, side: 'tree', sky: ['#8ccdf2', '#e3f4fc'],
             k: c => 0.009 * Math.sin(c * Math.PI * 2 / 24) },
    dirt:  { grass: ['#b38a59', '#a87f4f'], road: ['#cfa36d', '#c69a64'], rumble: ['#9c7147', '#8d6540'], ruts: 'rgba(90,60,30,.28)', side: 'pine', sky: ['#9fc6dc', '#efe2cf'],
             k: c => 0.011 * Math.pow(Math.sin(c * Math.PI * 2 / 18), 3) },
    coast: { grass: ['#ecd59b', '#e4cb8e'], road: ['#5a5f6b', '#616672'], rumble: ['#f5f5f7', '#5a5f6b'], lane: true, sea: true, side: 'palm', sky: ['#6fc0ee', '#dff3fd'],
             k: c => 0.006 * Math.sin(c * Math.PI * 2 / 30) + 0.003 * Math.sin(c * Math.PI * 2 / 11) },
    rally: { grass: ['#e8cf96', '#dfc489'], road: ['#c29660', '#b98d58'], rumble: ['#a77c48', '#96703f'], ruts: 'rgba(90,60,30,.22)', side: 'cactus', sky: ['#f0b46a', '#fbe7c2'],
             k: c => 0.006 * Math.sin(c * Math.PI * 2 / 40) + 0.004 * Math.sin(c * Math.PI * 2 / 17 + 1) }
  };
  const FONT = "'Pretendard Variable', Pretendard, 'Malgun Gothic', sans-serif";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  // 메인 카메라는 탈것 그림과 같은 각도: 옆으로 45도, 위에서 32도
  const QS = Math.sin(32 * Math.PI / 180), QC = Math.cos(32 * Math.PI / 180), QK = Math.SQRT1_2;
  const LANE = 96, CAR_LEN = 120;      // 메인 카메라: 차선 폭, 차 길이(그림 단위)
  const C0 = -80, STEP = 0.25;         // 굽이 표: C0칸부터 STEP칸마다
  // 카메라마다 탈것 그림 틀의 가로·세로 비와 바닥 자리(위에서 몇 %)
  const BOX = { main: { h: 1, ay: 125 / 170 }, front: { h: 100 / 120, ay: 0.96 }, chase: { h: 100 / 120, ay: 0.96 }, side: { h: 86 / 120, ay: 0.92 } };
  // 길가 물건 모양: [줄기 색, 잎 색, 밝은 잎 색], 경기장은 광고판 색
  const SIDE = { tree: ['#7a5638', '#3e9a4d', '#5bb565'], pine: ['#6d4a30', '#3c7a4a', '#4f8f5c'], palm: ['#8a6440', '#3f9a52', '#5bb565'], cactus: ['#4f9a5a', '#4f9a5a', '#6bb576'],
    bush: ['#5c8f45', '#4fa457', '#5bb565'], board: ['#0066cc', '#ffd84a', '#ff3b30', '#34c759', '#ffffff'] };

  function create(host, opt) {
    const carsEl = opt.carsEl;
    const cv = document.createElement('canvas');
    cv.className = 'r3-ground';
    cv.setAttribute('aria-hidden', 'true');
    host.insertBefore(cv, carsEl);
    const tagsEl = document.createElement('div');
    tagsEl.className = 'r3-tags';
    tagsEl.setAttribute('aria-hidden', 'true');
    carsEl.after(tagsEl);
    const mini = document.createElement('div');
    mini.className = 'r3-mini';
    mini.setAttribute('aria-hidden', 'true');
    host.appendChild(mini);
    // 출발·결승 문: 차와 같은 층에 두어 가까운 차는 문 앞에, 먼 차는 문 뒤에 보여요
    const gates = [['출발', 'start'], ['결승', 'goal']].map(([label, kind]) => {
      const g = document.createElement('div');
      g.className = 'r3-gate r3-gate-' + kind;
      g.innerHTML = `<i></i><b><span>${label}</span></b><i></i>`;
      carsEl.appendChild(g);
      return g;
    });
    const ctx = cv.getContext('2d');
    const shown = new Map(); // 차 요소 → { qx: 줄 선 뒤 보이는 칸 }
    const dots = new Map();  // 차 요소 → 진행 막대의 점
    const tags = new Map();  // 차 요소 → 이름표(맨 위 층으로 옮겨 둔 것)
    const lift = new Map();  // 이름표 → 지금 비켜 올라가 있는 만큼(px)
    let G = null, dpr = 1, first = true, drawnKey = '', shot = 'main', focus = 'all', zoomTo = 1;
    let HX = null, XX = null; // 굽이 표: 길 방향(HX)과 길 가운데의 옆 위치(XX)
    const tab = (A, c) => {
      const f = (c - C0) / STEP, i = clamp(Math.floor(f), 0, A.length - 2), t = clamp(f - i, 0, 1);
      return A[i] + (A[i + 1] - A[i]) * t;
    };

    // W·H: 코스 영역 크기(px), n: 학생 수, o.cells: 결승선 칸 수, o.track: 코스 종류
    function layout(W, H, n, o) {
      const L = clamp(Math.ceil(n / 5), 2, 6);          // 30명이면 6줄
      const miniH = clamp(H * 0.065, 38, 64), miniBottom = H * 0.012 + miniH;
      G = { W, H, L, n, cells: o.cells, theme: THEMES[o.track] || THEMES.oval, miniH, miniBottom };
      const N = Math.ceil((o.cells + 400 - C0) / STEP);
      HX = new Float32Array(N + 1);
      XX = new Float32Array(N + 1);
      for (let i = 1; i <= N; i++) {
        const c = C0 + i * STEP;
        HX[i] = HX[i - 1] + G.theme.k(c) * STEP;
        XX[i] = XX[i - 1] + HX[i] * STEP;
      }
      Object.values(SHOTS).forEach(s => s.layout());
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      first = true;
      drawnKey = '';
      shown.clear();
      buildMini();
      applyShotVars();
      // 역사 장면 전광판: 오른쪽 위(길이 지나가지 않는 곳)
      const bw = W * 0.3, bh = bw / 1.5;
      return { miniBottom, carW: SHOTS[shot].carW, tagSize: tagSize(), board: { x: W - bw - W * 0.012, y: miniBottom + 10, w: bw, h: bh } };
    }
    const tagSize = () => clamp(SHOTS[shot].carW * 0.17, 16, 28);
    // 메인 카메라가 앞에서 비출 때는 그림(앞모습)과 효과 자리가 달라서 'front'로 따로 불러요
    const face = () => (shot === 'main' && MAIN.front ? 'front' : shot);
    function applyShotVars() {
      host.dataset.shot = face();
      host.style.setProperty('--car-w', SHOTS[shot].carW + 'px');
      host.style.setProperty('--tag-size', tagSize() + 'px');
    }
    // 카메라 바꾸기: name(main·chase·side), o.focus('all' 전체·'lead' 선두), o.zoom(메인 카메라의 줌, 1이 기본),
    // o.front(메인 카메라를 결승선 쪽에서 비춰 차가 다가오고 앞모습이 보여요)
    function setShot(name, o) {
      o = o || {};
      if (!SHOTS[name]) name = 'main';
      let changed = name !== shot;
      shot = name;
      focus = o.focus || 'all';
      if (o.zoom != null) zoomTo = o.zoom;
      if (o.zoomFrom != null) SHOTS.main.zoom = o.zoomFrom;
      if (o.front != null && !!o.front !== MAIN.front) {
        MAIN.front = !!o.front;
        MAIN.dir = MAIN.front ? -1 : 1;
        if (G) MAIN.size();
        changed = true;
      }
      if (G) applyShotVars();
      if (changed || o.cut) { first = true; drawnKey = ''; lift.clear(); }
    }
    function setZoom(z) { zoomTo = z; }

    // ---------- 메인 카메라(45도) ----------
    // dir: 1이면 왼쪽 뒤 위에서 앞으로 달려 나가는 차를, -1이면 결승선 쪽 위에서 다가오는 차를 비춰요(길 모양은 같고 달리는 방향만 반대)
    const MAIN = {
      cc: 0, zs: 40, zoom: 1, dir: 1, front: false,
      size() {
        const { W, H } = G;
        this.carQ = clamp(Math.min(H * 0.17, W * 0.095), 80, 170); // 45도 그림 틀(170) 기준
        this.carW = this.front ? this.carQ * 0.92 : this.carQ;     // 앞모습 그림 틀(120)은 조금 작게
        this.S = this.carQ / 170;
        this.OY = H * (this.front ? 0.52 : 0.6); // 앞에서 비출 때는 선두(화면 아래쪽)가 자막에 가리지 않게 조금 위로
      },
      layout() {
        const { W, H, L } = G;
        this.size();
        this.HW = L * LANE / 2;
        this.lanes = Array.from({ length: L }, (_, j) => ((j + 0.5) / L * 2 - 1) * this.HW * 0.9);
        this.OX = W * 0.5; this.D = 3600; this.along = Math.hypot(W, H) * 0.5;
      },
      gap() { return CAR_LEN * 1.04 / this.zs; },
      bendX(c) { const dx = tab(XX, c) - tab(XX, this.cc) - tab(HX, this.cc) * (c - this.cc); return this.HW * 2.2 * Math.tanh(dx * 0.6); },
      proj(x, y, c) {
        const z = (c - this.cc) * this.zs * this.dir, d = Math.max(-0.6 * this.D, (x + z) * QK * QC - y * QS), s = this.D / (this.D + d), k = this.S * this.zoom * s;
        return { x: this.OX + k * (x - z) * QK, y: this.OY - k * (QK * QS * (x + z) + QC * y), s: s * this.zoom, d };
      },
      road(u, c) { return this.proj(this.bendX(c) + u, 0, c); },
      cam(lo, hi, dt, snap) {
        const kk = snap ? 1 : 1 - Math.exp(-dt * 2.5);
        this.zoom += (zoomTo - this.zoom) * (snap ? 0 : 1 - Math.exp(-dt * 0.9)); // 줌은 천천히
        const tz = clamp(this.along / (this.S * this.zoom * 0.8 * (hi - lo + CAR_LEN * 1.6 / this.zs)), 10, 64);
        this.zs += (tz - this.zs) * kk;
        this.cc += ((lo + hi) / 2 - this.cc) * kk;
      },
      place(k) {
        const p = this.road(this.lanes[k.i % G.L], k.qx);
        return { x: p.x, y: p.y, s: p.s, zi: Math.round(20000 - p.d * 4), tagY: p.y - this.carW * (this.front ? 0.8 : 0.6) * p.s };
      },
      gates(hi) {
        [0, G.cells].forEach((c, gi) => {
          const g = gates[gi], p = this.proj(this.bendX(c), 0, c);
          if ((gi === 0 && hi > 1.5) || p.x < -G.W || p.x > G.W * 2 || p.y < -G.H || p.y > G.H * 2) { g.style.display = 'none'; return; }
          const x0 = this.bendX(c) - this.HW * 1.12, wd = this.HW * 2.24, ht = 150, k = this.S * p.s;
          const z = (c - this.cc) * this.zs * this.dir, e = this.OX + k * QK * (x0 - z), f = this.OY - k * (QK * QS * (x0 + z) + QC * ht);
          g.style.display = '';
          g.style.width = wd.toFixed(0) + 'px';
          g.style.height = ht + 'px';
          g.style.transform = `matrix(${(k * QK).toFixed(4)},${(-k * QK * QS).toFixed(4)},0,${(k * QC).toFixed(4)},${e.toFixed(1)},${f.toFixed(1)})`;
          g.style.zIndex = Math.round(20000 - p.d * 4);
        });
      },
      key() { return this.dir + '|' + this.cc.toFixed(3) + '|' + this.zs.toFixed(3) + '|' + this.zoom.toFixed(3); },
      draw(c) {
        const { W, H, theme: T, cells, L } = G, HW = this.HW;
        c.fillStyle = T.grass[0];
        c.fillRect(0, 0, W, H);
        const perCell = this.S * this.zoom * 0.8 * this.zs, span = Math.hypot(W, H) / perCell;
        const c0 = Math.floor(this.cc - span * 0.75), c1 = Math.ceil(this.cc + span * 0.75);
        const st = [0.25, 0.5, 1, 2, 4].find(s => s * perCell >= 7) || 4;
        const cs = [];
        for (let k = Math.floor(c0 / st) * st; k <= c1; k += st) cs.push(k);
        const road = (u, k) => this.road(u, k);
        const quad = (a0, a1, b1, b0) => { c.moveTo(a0.x, a0.y); c.lineTo(a1.x, a1.y); c.lineTo(b1.x, b1.y); c.lineTo(b0.x, b0.y); c.closePath(); };
        const strip = (u0, u1, col) => { c.fillStyle = col; c.beginPath(); cs.forEach((k, i) => { const p = road(u0, k); (i ? c.lineTo : c.moveTo).call(c, p.x, p.y); }); for (let i = cs.length - 1; i >= 0; i--) { const p = road(u1, cs[i]); c.lineTo(p.x, p.y); } c.closePath(); c.fill(); };
        const band = (size, u0, u1, col) => { c.fillStyle = col; c.beginPath(); for (let k = Math.floor(c0 / size) * size; k <= c1; k += size) { if (((Math.round(k / size) % 2) + 2) % 2 !== 1) continue; quad(road(u0, k), road(u1, k), road(u1, k + size), road(u0, k + size)); } c.fill(); };
        band(4, -HW * 6, HW * 6, T.grass[1]);
        if (T.sea) strip(HW * 2.2, HW * 9, '#4fb3e0');
        strip(-HW, HW, T.road[0]);
        band(2, -HW, HW, T.road[1]);
        if (T.ruts) [-0.55, -0.35, 0.35, 0.55].forEach(u => strip(u * HW - 3, u * HW + 3, T.ruts));
        strip(-HW * 1.08, -HW, T.rumble[0]); strip(HW, HW * 1.08, T.rumble[0]);
        band(1, -HW * 1.08, -HW, T.rumble[1]); band(1, HW, HW * 1.08, T.rumble[1]);
        if (T.lane) {
          c.fillStyle = 'rgba(255,255,255,.55)';
          c.beginPath();
          const ds = perCell < 14 ? 2 : 1; // 칸이 촘촘하면 점선을 듬성듬성
          for (let k = Math.floor(c0 / ds) * ds; k <= c1; k += ds) for (let j = 1; j < L; j++) {
            const u = (j / L * 2 - 1) * HW;
            quad(road(u - 1.6, k), road(u + 1.6, k), road(u + 1.6, k + 0.45), road(u - 1.6, k + 0.45));
          }
          c.fill();
        }
        const across = (k, d, col) => { c.fillStyle = col; c.beginPath(); quad(road(-HW, k), road(HW, k), road(HW, k + d), road(-HW, k + d)); c.fill(); };
        const dpc = 6 / this.zs;
        for (let k = Math.ceil(c0 / 5) * 5; k <= c1; k += 5) if (k > 0 && k < cells && k % (cells / 5)) across(k, dpc * 0.5, 'rgba(255,255,255,.28)');
        for (let z = 1; z < 5; z++) {
          const k = cells * z / 5;
          if (k < c0 || k > c1) continue;
          c.fillStyle = '#ffd84a';
          c.beginPath();
          for (let m = 0; m < 10; m += 2) { const u0 = -HW + m * HW / 5, u1 = u0 + HW / 5; quad(road(u0, k), road(u1, k), road(u1, k + dpc), road(u0, k + dpc)); }
          c.fill();
        }
        [0, cells].forEach(k => {
          if (k < c0 || k > c1) return;
          const d = dpc * 2.2;
          across(k, d, '#ffffff');
          c.fillStyle = '#1d1d1f';
          c.beginPath();
          for (let m = 0; m < 12; m++) {
            const u0 = -HW + m * HW / 6, u1 = u0 + HW / 6, h = m % 2 ? 0 : d / 2;
            quad(road(u0, k + h), road(u1, k + h), road(u1, k + h + d / 2), road(u0, k + h + d / 2));
          }
          c.fill();
        });
        const B = propBag();
        for (let m = 0, n = Math.floor(c1) - Math.floor(c0); m <= n; m++) { // 먼 것부터
          const k = this.dir > 0 ? Math.floor(c1) - m : Math.floor(c0) + m, h = hash(k);
          if (h >= 0.55) continue;
          const right = hash(k + 3) < 0.6, u = (right ? 1 : -1) * HW * (1.35 + hash(k + 5) * 1.4);
          const p = road(u, k + hash(k + 7) * 0.8);
          if (p.x < -80 || p.x > W + 80 || p.y < -80 || p.y > H + 120) continue;
          addProp(B, right ? T.side : 'bush', p.x, p.y, this.S * p.s * (right ? 48 + h * 30 : 26), h);
        }
        fillProps(c, B, T.side);
        for (let z = 0; z < 5; z++) {
          const k = cells * z / 5 + (z ? 0 : 1.2);
          if (k < c0 || k > c1) continue;
          const p = road(HW * 1.25, k);
          sign(c, p.x, p.y, this.carW * p.s, z + 1);
        }
        vignette(c);
      }
    };

    // ---------- 추격 카메라(뒤에서) ----------
    const CHASE = {
      pos: 0, Z0: 8,
      layout() {
        const { W, H, L } = G;
        this.yHor = H * 0.38; this.yBot = H * 1.02; this.RW = W * 0.48;
        this.lanes = Array.from({ length: L }, (_, j) => ((j + 0.5) / L * 2 - 1) * 0.86);
        this.carW = Math.min(2 * this.RW / L * 0.64, W * 0.12, 190);
        this.carH = this.carW * BOX.chase.h;
        const sLast = (H * 0.955 - this.yHor) / (this.yBot - this.yHor);
        this.back = 1 / sLast - 1;
      },
      gap() { return Math.max(1, this.Z0 * 0.08); },
      sAt(z) { return this.Z0 / (this.Z0 + Math.max(z, -this.Z0 * 0.5)); },
      yAt(s) { return this.yHor + (this.yBot - this.yHor) * s; },
      bend(z, s) { const dx = tab(XX, this.pos + z) - tab(XX, this.pos) - tab(HX, this.pos) * z; return this.RW * 0.32 * Math.tanh(s * dx * 6 / 0.32); },
      cam(lo, hi, dt, snap) {
        const kk = snap ? 1 : 1 - Math.exp(-dt * 2.5);
        this.Z0 += (Math.max(7, (hi - lo) * 0.85) - this.Z0) * kk;
        this.pos += (lo - this.back * this.Z0 - this.pos) * kk;
      },
      place(k) {
        const z = k.qx - this.pos;
        if (z < this.back * this.Z0 * 0.35) return null; // 카메라 뒤(선두만 찍을 때 뒤처진 차)
        const s = this.sAt(z), y = this.yAt(s);
        return { x: G.W / 2 + this.bend(z, s) + this.RW * this.lanes[k.i % G.L] * s, y, s, zi: Math.round(20000 - z * 40), tagY: y - this.carH * 0.96 * s - 4 };
      },
      gates(hi) {
        [0, G.cells].forEach((c, gi) => {
          const g = gates[gi], z = c - this.pos;
          if (z < 0.3 || z > this.Z0 * 25 || (gi === 0 && hi > 1.5)) { g.style.display = 'none'; return; }
          const s = this.sAt(z), y = this.yAt(s), x = G.W / 2 + this.bend(z, s);
          g.style.display = '';
          g.style.width = (this.RW * 2.24).toFixed(0) + 'px';
          g.style.height = (this.carH * 2.1).toFixed(0) + 'px';
          g.style.transform = `translate3d(${(x - this.RW * 1.12 * s).toFixed(1)}px,${(y - this.carH * 2.1 * s).toFixed(1)}px,0) scale(${s.toFixed(3)})`;
          g.style.zIndex = Math.round(20000 - z * 40);
        });
      },
      key() { return this.pos.toFixed(3) + '|' + this.Z0.toFixed(3); },
      draw(c) {
        const { W, H, theme: T, cells, L } = G, RW = this.RW, yH = this.yHor;
        sky(c, yH);
        c.fillStyle = T.grass[0];
        c.fillRect(0, yH, W, H - yH);
        const zFar = this.Z0 * 22, segs = [];
        let z = 0;
        while (z < zFar) {
          const st = z < 30 ? 0.5 : z < 90 ? 1 : z < 240 ? 2 : 6;
          segs.push(z);
          z = Math.floor((this.pos + z + st) / st) * st - this.pos + 1e-6;
        }
        segs.push(zFar);
        const P = segs.map(zz => { const s = this.sAt(zz); return { z: zz, c: this.pos + zz, s, y: this.yAt(s), x: W / 2 + this.bend(zz, s), w: RW * s }; });
        const quad = (p, a, b, u0, u1) => { p.moveTo(a.x + u0 * a.w, a.y); p.lineTo(a.x + u1 * a.w, a.y); p.lineTo(b.x + u1 * b.w, b.y); p.lineTo(b.x + u0 * b.w, b.y); p.closePath(); };
        const strip = (u0, u1) => { c.beginPath(); P.forEach((p, i) => (i ? c.lineTo : c.moveTo).call(c, p.x + u0 * p.w, p.y)); for (let i = P.length - 1; i >= 0; i--) c.lineTo(P[i].x + u1 * P[i].w, P[i].y); c.closePath(); c.fill(); };
        const bands = (size, zLim, fn) => {
          let start = null, cur = -1;
          for (let i = 0; i < P.length; i++) {
            const p = P[i], id = p.z < zLim ? Math.floor((p.c + 1e-4) / size) : -9;
            if (id !== cur) { if (start && (cur & 1)) fn(start, P[i]); start = p; cur = id; }
          }
        };
        const zAlt = Math.min(90, this.Z0 * 7);
        c.fillStyle = T.grass[1]; c.beginPath(); bands(2, zAlt, (a, b) => c.rect(0, b.y, W, a.y - b.y + 0.5)); c.fill();
        if (T.sea) { c.fillStyle = '#4fb3e0'; strip(2.2, 60); c.fillStyle = 'rgba(255,255,255,.7)'; strip(2.2, 2.32); } // 해안 도로: 오른쪽은 바다
        c.fillStyle = T.road[0]; strip(-1, 1);
        c.fillStyle = T.road[1]; c.beginPath(); bands(2, zAlt, (a, b) => quad(c, a, b, -1, 1)); c.fill();
        if (T.ruts) { c.fillStyle = T.ruts; [-0.55, -0.35, 0.35, 0.55].forEach(u => strip(u - 0.03, u + 0.03)); }
        c.fillStyle = T.rumble[0]; strip(-1.09, -1); strip(1, 1.09);
        c.fillStyle = T.rumble[1]; c.beginPath(); bands(1, zAlt, (a, b) => { quad(c, a, b, -1.09, -1); quad(c, a, b, 1, 1.09); }); c.fill();
        const at = cc => { const zz = cc - this.pos; if (zz < 0 || zz > zFar) return null; const s = this.sAt(zz); return { z: zz, s, y: this.yAt(s), x: W / 2 + this.bend(zz, s), w: RW * s }; };
        if (T.lane) {
          c.fillStyle = 'rgba(255,255,255,.55)';
          c.beginPath();
          for (let k = Math.ceil(this.pos); k < this.pos + Math.min(60, this.Z0 * 3); k++) {
            const a = at(k), b = at(k + 0.5);
            if (!a || !b) continue;
            for (let j = 1; j < L; j++) { const u = (j / L * 2 - 1) * 0.86; quad(c, a, b, u - 0.012, u + 0.012); }
          }
          c.fill();
        }
        const cross = (cc, depth) => { const a = at(cc), b = at(cc + depth); return a && b ? [a, b] : null; };
        c.fillStyle = 'rgba(255,255,255,.25)';
        c.beginPath();
        for (let k = Math.ceil(this.pos / 5) * 5; k < this.pos + Math.min(zFar, 160); k += 5) {
          if (k <= 0 || k >= cells || k % (cells / 5) === 0) continue;
          const s2 = cross(k, 0.12);
          if (s2) quad(c, s2[0], s2[1], -1, 1);
        }
        c.fill();
        for (let zz = 1; zz < 5; zz++) {
          const s2 = cross(cells * zz / 5, 0.3);
          if (!s2) continue;
          c.fillStyle = '#ffd84a'; c.beginPath();
          for (let m = 0; m < 10; m += 2) quad(c, s2[0], s2[1], -1 + m * 0.2, -1 + (m + 1) * 0.2);
          c.fill();
        }
        [0, cells].forEach(cc => {
          const s2 = cross(cc, 0.5);
          if (!s2) return;
          const [a, b] = s2, mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, w: (a.w + b.w) / 2 };
          c.fillStyle = '#ffffff'; c.beginPath(); quad(c, a, b, -1, 1); c.fill();
          c.fillStyle = '#1d1d1f'; c.beginPath();
          for (let m = 0; m < 12; m++) { if (m % 2) quad(c, a, mid, -1 + m / 6, -1 + (m + 1) / 6); else quad(c, mid, b, -1 + m / 6, -1 + (m + 1) / 6); }
          c.fill();
        });
        const B = propBag();
        for (let k = Math.floor(this.pos) - 1; k < this.pos + Math.min(zFar, this.Z0 * 8, 120); k++) {
          const h = hash(k);
          if (h >= 0.5) continue;
          const a = at(k + hash(k + 7) * 0.8);
          if (!a || a.s < 0.06) continue;
          const side = hash(k + 3) < 0.5 ? -1 : 1, x = a.x + side * a.w * (T.sea && side > 0 ? 1.3 + h * 0.7 : 1.35 + h * 1.6), zz = this.carW * a.s * (0.55 + h * 0.5);
          if (x < -zz * 2 || x > W + zz * 2) continue;
          addProp(B, T.side, x, a.y, zz, h);
        }
        fillProps(c, B, T.side);
        for (let zz = 0; zz < 5; zz++) {
          const a = at(cells * zz / 5 + (zz ? 0 : 1.2));
          if (a && a.s > 0.05) sign(c, a.x + a.w * 1.22, a.y, this.carW * a.s, zz + 1);
        }
      }
    };

    // ---------- 측면 카메라(길 옆에서 나란히) ----------
    const SIDECAM = {
      pos: 0, ppc: 40,
      layout() {
        const { W, H, L } = G;
        const yNear = H * 0.95, yFar = H * 0.5, wFar = 0.78, a = 1 / wFar - 1, yHor = (yFar - yNear * wFar) / (1 - wFar);
        Object.assign(this, { a, yHor, yNear });
        this.laneT = j => (j + 0.5) / L;
        const dy = this.y(this.laneT(0)) - this.y(this.laneT(1));
        this.carW = clamp(dy * 2, 64, Math.min(W * 0.11, 170)); // 앞줄 차가 뒷줄 차를 조금 가려도 크게
        this.carH = this.carW * BOX.side.h;
        this.pad = this.carW * 1.05 + 30;
        this.ppcMax = (W - 2 * this.pad) / 13;
        if (!this.ppc || this.ppc > this.ppcMax) this.ppc = this.ppcMax;
        this.tWall = 1.16;
      },
      w(t) { return 1 / (1 + this.a * t); },
      y(t) { return this.yHor + (this.yNear - this.yHor) * this.w(t); },
      gap() { return this.carW * 1.02 / Math.max(this.ppc, this.ppcMax * 0.45); }, // 너무 멀리 빠지면 차 사이를 칸 수로 고정(줌 아웃이 끝없이 이어지지 않게)
      cam(lo, hi, dt, snap) {
        const kk = snap ? 1 : 1 - Math.exp(-dt * 2.4);
        const tp = Math.min(this.ppcMax, (G.W - 2 * this.pad) / Math.max(hi - lo, 0.01));
        this.ppc += (tp - this.ppc) * kk;
        this.pos += ((lo + hi) / 2 - this.pos) * kk;
      },
      place(k) {
        const j = k.i % G.L, t = this.laneT(j), s = this.w(t), x = G.W / 2 + (k.qx - this.pos) * this.ppc * s, y = this.y(t);
        if (x < -this.carW * 2 || x > G.W + this.carW * 2) return null;
        return { x, y, s, zi: 10 + (G.L - j) * 100, tagY: y - this.carH * 0.92 * s - 4 };
      },
      gates() { gates.forEach(g => { g.style.display = 'none'; }); }, // 옆에서는 문을 땅 그림에 그려요
      key() { return this.pos.toFixed(3) + '|' + this.ppc.toFixed(2); },
      draw(c) {
        const { W, H, theme: T, cells, L } = G, X = (cell, t) => W / 2 + (cell - this.pos) * this.ppc * this.w(t), Y = t => this.y(t);
        const span = t => { const h = W / 2 / (this.ppc * this.w(t)); return [Math.floor(this.pos - h) - 1, Math.ceil(this.pos + h) + 1]; };
        const quad = (c0, c1, t0, t1) => { c.moveTo(X(c0, t0), Y(t0)); c.lineTo(X(c1, t0), Y(t0)); c.lineTo(X(c1, t1), Y(t1)); c.lineTo(X(c0, t1), Y(t1)); c.closePath(); };
        const yW = Y(this.tWall), y1 = Y(1), y0 = Y(0);
        sky(c, yW);
        const gr = c.createLinearGradient(0, yW, 0, H);
        gr.addColorStop(0, T.grass[1]); gr.addColorStop(1, T.grass[0]);
        c.fillStyle = gr; c.fillRect(0, yW, W, H - yW);
        if (T.sea) { c.fillStyle = '#4fb3e0'; c.fillRect(0, yW, W, Y(1.1) - yW); }
        // 먼 길가 물건
        const B = propBag(), [s0, s1] = span(1.12);
        for (let k = s0; k <= s1; k++) {
          if (hash(k) > 0.42) continue;
          const t = 1.07 + hash(k + 3) * 0.06, sc = this.w(t) * (0.75 + hash(k + 11) * 0.5);
          addProp(B, T.side, X(k + hash(k + 7) * 0.7, t), Y(t), this.carW * 0.5 * sc, hash(k));
        }
        fillProps(c, B, T.side);
        // 길
        const [r0, r1] = span(1);
        c.fillStyle = T.road[0]; c.fillRect(0, y1, W, y0 - y1);
        c.fillStyle = T.road[1]; c.beginPath();
        for (let k = Math.floor(r0 / 10) * 10; k <= r1; k += 10) quad(k, k + 5, 0, 1);
        c.fill();
        if (T.ruts) { c.fillStyle = T.ruts; [0.18, 0.34, 0.66, 0.82].forEach(t => { const yy = Y(t); c.fillRect(0, yy - 2 * this.w(t), W, 4 * this.w(t)); }); }
        [[1, 1.04], [-0.04, 0]].forEach(([t0, t1]) => {
          c.fillStyle = T.rumble[0]; c.fillRect(0, Y(t1), W, Y(t0) - Y(t1));
          c.fillStyle = T.rumble[1]; c.beginPath();
          for (let k = r0; k <= r1; k++) if (k % 2 === 0) quad(k, k + 1, t0, t1);
          c.fill();
        });
        if (T.lane) {
          c.strokeStyle = 'rgba(255,255,255,.55)'; c.beginPath();
          for (let j = 1; j < L; j++) {
            const t = j / L, yy = Y(t), [d0, d1] = span(t);
            c.lineWidth = Math.max(1.5, 3 * this.w(t));
            for (let k = d0; k <= d1; k++) { c.moveTo(X(k, t), yy); c.lineTo(X(k + 0.5, t), yy); }
          }
          c.stroke();
        }
        c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 2; c.beginPath();
        for (let k = Math.ceil(r0 / 5) * 5; k <= r1; k += 5) { if (k <= 0 || k >= cells) continue; c.moveTo(X(k, 0), y0); c.lineTo(X(k, 1), y1); }
        c.stroke();
        c.strokeStyle = '#ffd84a'; c.lineWidth = 4; c.setLineDash([10, 9]); c.beginPath();
        for (let z = 1; z < 5; z++) { const k = cells * z / 5; c.moveTo(X(k, 0), y0); c.lineTo(X(k, 1), y1); }
        c.stroke(); c.setLineDash([]);
        [0, cells].forEach(cell => { // 체크무늬 선
          const wd = Math.max(0.3, 14 / this.ppc), m = 8;
          c.fillStyle = '#fff'; c.beginPath(); quad(cell - wd, cell + wd, 0, 1); c.fill();
          c.fillStyle = '#1d1d1f'; c.beginPath();
          for (let q = 0; q < m; q++) { const [a, b] = q % 2 ? [cell - wd, cell] : [cell, cell + wd]; quad(a, b, q / m, (q + 1) / m); }
          c.fill();
        });
        for (let z = 0; z < 5; z++) { const cell = cells * z / 5 + (z === 0 ? 0.6 : 0), t = 1.08; sign(c, X(cell, t), Y(t), this.carW * this.w(t), z + 1); }
        [[0, '출발', '#0066cc'], [cells, '결승', '#1d1d1f']].forEach(([cell, label, col]) => { // 출발·결승 기둥과 이름판
          const t = 1.08, x = X(cell, t), y = Y(t), s = this.w(t), h = this.carH * 1.9 * s;
          if (x < -100 || x > W + 100) return;
          c.strokeStyle = '#c9ccd6'; c.lineWidth = Math.max(3, this.carW * 0.06 * s); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.stroke();
          const fs = Math.round(this.carW * 0.24 * s); c.font = `800 ${fs}px ${FONT}`;
          const bw = c.measureText(label).width + fs * 1.1, bh = fs * 1.6;
          c.fillStyle = col; c.beginPath(); if (c.roundRect) c.roundRect(x - bw / 2, y - h - bh * 0.85, bw, bh, bh * 0.3); else c.rect(x - bw / 2, y - h - bh * 0.85, bw, bh); c.fill();
          c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(label, x, y - h - bh * 0.35 + 1);
        });
      }
    };
    const SHOTS = { main: MAIN, chase: CHASE, side: SIDECAM };

    // ---------- 같이 쓰는 그림 도구 ----------
    function sky(c, yH) {
      const T = G.theme, g = c.createLinearGradient(0, 0, 0, yH);
      g.addColorStop(0, T.sky[0]); g.addColorStop(1, T.sky[1]);
      c.fillStyle = g; c.fillRect(0, 0, G.W, yH + 1);
      c.fillStyle = 'rgba(255,255,255,.7)'; // 구름 몇 점
      [[0.16, 0.5, 1], [0.42, 0.32, 0.8], [0.78, 0.55, 1.2]].forEach(([fx, fy, k]) => { const x = G.W * fx, y = yH * fy, r = G.H * 0.03 * k; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.arc(x + r * 1.1, y + r * 0.2, r * 0.8, 0, Math.PI * 2); c.arc(x - r * 1.1, y + r * 0.25, r * 0.7, 0, Math.PI * 2); c.fill(); });
    }
    function vignette(c) {
      const { W, H } = G, vg = c.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.45, W / 2, H * 0.55, Math.max(W, H) * 0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.18)');
      c.fillStyle = vg; c.fillRect(0, 0, W, H);
    }
    function sign(c, x, y, cw, no) {
      if (x < -60 || x > G.W + 60) return;
      const ht = cw * 0.75, r = cw * 0.2;
      c.strokeStyle = '#3a3a40'; c.lineWidth = Math.max(2, cw * 0.04);
      c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - ht); c.stroke();
      c.fillStyle = '#1d1d1f'; c.beginPath(); c.arc(x, y - ht - r * 0.7, r, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#ffd84a'; c.lineWidth = Math.max(1.5, r * 0.16); c.stroke();
      c.fillStyle = '#fff'; c.font = `800 ${Math.max(8, Math.round(r * 1.2))}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(no, x, y - ht - r * 0.62);
    }
    const propBag = () => ({ sh: new Path2D(), trunk: new Path2D(), leaf: new Path2D(), leaf2: new Path2D(), rock: new Path2D(), board: SIDE.board.map(() => new Path2D()) });
    function fillProps(c, B, kind) {
      const col = SIDE[kind] || SIDE.tree;
      c.fillStyle = 'rgba(0,0,0,.14)'; c.fill(B.sh);
      if (kind === 'board') { c.fillStyle = '#7c808b'; c.fill(B.trunk); B.board.forEach((p, i) => { c.fillStyle = SIDE.board[i]; c.fill(p); }); }
      else { c.fillStyle = col[0]; c.fill(B.trunk); }
      c.fillStyle = col[1]; c.fill(B.leaf);
      c.fillStyle = col[2]; c.fill(B.leaf2);
      c.fillStyle = '#8d8a86'; c.fill(B.rock);
      c.fillStyle = SIDE.bush[1];
    }
    function oval(p, x, y, rx, ry, rot) { p.moveTo(x + rx * Math.cos(rot || 0), y + rx * Math.sin(rot || 0)); p.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); }
    function addProp(B, kind, x, y, zz, h) {
      oval(B.sh, x, y, zz * 0.5, zz * 0.16);
      switch (kind) {
        case 'board':
          B.trunk.rect(x - zz * 0.04, y - zz * 0.5, zz * 0.08, zz * 0.5);
          B.board[Math.floor(h * 10) % B.board.length].rect(x - zz * 0.5, y - zz * 0.85, zz, zz * 0.4);
          break;
        case 'tree':
          B.trunk.rect(x - zz * 0.07, y - zz * 0.6, zz * 0.14, zz * 0.6);
          oval(B.leaf, x, y - zz * 0.85, zz * 0.42, zz * 0.42);
          oval(B.leaf2, x - zz * 0.12, y - zz * 0.98, zz * 0.18, zz * 0.18);
          break;
        case 'pine':
          B.trunk.rect(x - zz * 0.06, y - zz * 0.25, zz * 0.12, zz * 0.25);
          B.leaf.moveTo(x, y - zz * 1.3); B.leaf.lineTo(x + zz * 0.4, y - zz * 0.2); B.leaf.lineTo(x - zz * 0.4, y - zz * 0.2); B.leaf.closePath();
          if (h < 0.12) oval(B.rock, x + zz * 0.6, y - zz * 0.15, zz * 0.32, zz * 0.2);
          break;
        case 'palm':
          B.trunk.moveTo(x - zz * 0.05, y); B.trunk.lineTo(x + zz * 0.05, y); B.trunk.quadraticCurveTo(x + zz * 0.22, y - zz * 0.6, x + zz * 0.08, y - zz * 1.15);
          B.trunk.lineTo(x, y - zz * 1.15); B.trunk.quadraticCurveTo(x + zz * 0.13, y - zz * 0.6, x - zz * 0.05, y); B.trunk.closePath();
          [[-0.34, -1.22, -0.35], [0.34, -1.25, 0.3], [-0.26, -1.08, 0.5], [0.3, -1.06, -0.5]].forEach(([dx, dy, r]) => oval(B.leaf, x + zz * (0.04 + dx), y + zz * dy, zz * 0.36, zz * 0.08, r));
          break;
        case 'cactus':
          B.leaf.rect(x - zz * 0.1, y - zz, zz * 0.2, zz);
          B.leaf.rect(x - zz * 0.36, y - zz * 0.62, zz * 0.28, zz * 0.12);
          B.leaf.rect(x - zz * 0.36, y - zz * 0.85, zz * 0.12, zz * 0.32);
          B.leaf.rect(x + zz * 0.08, y - zz * 0.5, zz * 0.26, zz * 0.12);
          B.leaf.rect(x + zz * 0.23, y - zz * 0.76, zz * 0.12, zz * 0.36);
          break;
        default: // 낮은 덤불(가까운 쪽)
          oval(B.leaf, x - zz * 0.2, y - zz * 0.22, zz * 0.3, zz * 0.24);
          oval(B.leaf2, x + zz * 0.15, y - zz * 0.26, zz * 0.32, zz * 0.26);
      }
    }

    // cars: [{ el, c(지금 보이는 칸), i(들어온 차례), color, rank(1~3, 비밀이면 0), moving }]
    // o.jump: 결승선에 한꺼번에 모일 때처럼 달려가는 모습 없이 바로 옮겨요. o.secret: 순위 비공개
    function frame(cars, dt, o) {
      if (!G) return;
      o = o || {};
      const { L } = G, sh = SHOTS[shot];
      const snap = first || o.jump;
      // 같은 줄에서 겹치는 차는 줄을 세워요. 달리는 차는 뒤로(앞선 칸 순서, 같은 칸이면 들어온 차례),
      // 결승선에 닿은 차는 결승선 너머로 들어온 차례대로(앞뒤 자리로 순위를 알 수 없게)
      const gap = sh.gap(), end = G.cells;
      const byLane = Array.from({ length: L }, () => []);
      cars.forEach(k => byLane[k.i % L].push(k));
      let lo = Infinity, hi = -Infinity;
      byLane.forEach(list => {
        const done = list.filter(k => k.c >= end - 1e-6).sort((p, q) => p.i - q.i);
        const run = list.filter(k => k.c < end - 1e-6).sort((p, q) => (q.c - p.c) || (p.i - q.i));
        done.forEach((k, m) => { k.want = end + gap * 0.6 + (done.length - 1 - m) * gap; });
        let prev = end + gap * 0.4;
        run.forEach(k => { k.want = Math.min(k.c, prev - gap); prev = k.want; });
        list.forEach(k => {
          let st = shown.get(k.el);
          if (!st || snap) { st = { qx: k.want }; shown.set(k.el, st); }
          st.qx += (k.want - st.qx) * Math.min(1, dt * 7);
          k.qx = st.qx;
          if (k.qx < lo) lo = k.qx;
          if (k.qx > hi) hi = k.qx;
        });
      });
      if (!cars.length) { lo = 0; hi = 0; }
      // 선두만 담을 때: 앞에서 여섯째 차까지
      let flo = lo;
      if (focus === 'lead' && cars.length > 6) flo = cars.map(k => k.qx).sort((a, b) => b - a)[5];
      sh.cam(flo, hi, dt, snap);
      first = false;

      const live = new Set(), labels = [], bx = BOX[face()];
      cars.forEach(k => {
        const p = sh.place(k);
        let tg = tags.get(k.el);
        if (!tg || !tg.isConnected) {
          tg = k.el.querySelector('.tag');
          if (tg) { tagsEl.appendChild(tg); tags.set(k.el, tg); }
        }
        live.add(k.el);
        if (!p) { k.el.style.visibility = 'hidden'; if (tg) tg.style.visibility = 'hidden'; return; }
        k.el.style.visibility = '';
        if (tg) tg.style.visibility = '';
        k.el.style.transform = `translate3d(${(p.x - sh.carW / 2).toFixed(1)}px,${(p.y - sh.carW * bx.h * bx.ay).toFixed(1)}px,0) scale(${p.s.toFixed(3)})`;
        k.el.style.zIndex = p.zi;
        k.el.classList.toggle('moving', !!k.moving);
        if (tg) labels.push({ tg, x: p.x, y: p.tagY, tk: clamp(Math.sqrt(p.s), 0.7, 1.15), zi: p.zi });
      });
      placeLabels(labels, snap);
      tags.forEach((tg, el) => { if (!live.has(el)) { if (el.isConnected) el.appendChild(tg); else tg.remove(); tags.delete(el); } });
      gates.forEach(g => { if (!g.isConnected) carsEl.appendChild(g); }); // 차 목록을 새로 그리면 다시 붙여요
      sh.gates(hi);
      const key = shot + '|' + sh.key();
      if (key !== drawnKey) {
        drawnKey = key;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, G.W, G.H);
        sh.draw(ctx);
      }
      updateMini(cars, o.secret, lo, hi, flo);
    }

    // 이름표가 겹치면 먼 차의 이름표를 위로 비켜 올리고, 차까지 가는 가는 선을 그어요
    function placeLabels(list, snap) {
      list.sort((a, b) => b.zi - a.zi); // 가까운 차부터 제자리
      const placed = [];
      list.forEach(Lb => {
        const tg = Lb.tg;
        let m = tg._m;
        if (!m || m.t !== tg.textContent) { m = tg._m = { t: tg.textContent, w: tg.offsetWidth, h: tg.offsetHeight }; }
        const w = m.w * Lb.tk + 6, h = m.h * Lb.tk + 3;
        let bot = Lb.y;
        for (let n = 0; n < 12; n++) {
          const hit = placed.find(p => Lb.x - w / 2 < p.r && Lb.x + w / 2 > p.l && bot - h < p.b && bot > p.t);
          if (!hit) break;
          bot = hit.t;
        }
        placed.push({ l: Lb.x - w / 2, r: Lb.x + w / 2, t: bot - h, b: bot });
        const want = Lb.y - bot;
        const cur = snap || !lift.has(tg) ? want : lift.get(tg) + (want - lift.get(tg)) * 0.25;
        lift.set(tg, cur);
        tg.style.transform = `translate3d(${Lb.x.toFixed(1)}px,${(Lb.y - cur).toFixed(1)}px,0) translate(-50%,-100%) scale(${Lb.tk.toFixed(3)})`;
        tg.style.setProperty('--lead', (cur / Lb.tk).toFixed(1) + 'px');
        tg.style.zIndex = Lb.zi;
      });
    }

    // ---------- 진행 막대 ----------
    function buildMini() {
      mini.style.setProperty('--mini-h', G.miniH + 'px');
      mini.innerHTML = `<span class="r3m-end">출발</span><div class="r3m-track"><div class="r3m-line"></div>` +
        [0, 1, 2, 3, 4].map(z => `<i class="r3m-sec" style="left:${z * 20}%"><b>${z + 1}</b></i>`).join('') +
        `<div class="r3m-view"></div><div class="r3m-dots"></div></div><span class="r3m-end">🏁</span><p class="r3m-secret">🤫 순위는 비밀! 모두 결승선에서 기다려요</p>`;
      dots.clear();
    }
    function updateMini(cars, secret, lo, hi, flo) {
      mini.classList.toggle('secret', !!secret);
      const view = mini.querySelector('.r3m-view'), from = focus === 'lead' ? flo : lo;
      const l = clamp((from - 0.5) / G.cells, 0, 1), r = clamp((hi + 0.5) / G.cells, 0, 1);
      view.style.left = (l * 100).toFixed(2) + '%';
      view.style.width = (Math.max(0.006, r - l) * 100).toFixed(2) + '%';
      if (secret) return;
      const box = mini.querySelector('.r3m-dots');
      const live = new Set();
      cars.forEach(k => {
        let d = dots.get(k.el);
        if (!d) { d = document.createElement('i'); d.className = 'r3m-dot'; box.appendChild(d); dots.set(k.el, d); }
        live.add(k.el);
        const j = k.i % G.L;
        d.style.left = (clamp(k.c / G.cells, 0, 1) * 100).toFixed(2) + '%';
        d.style.top = (G.L > 1 ? j / (G.L - 1) * 100 : 50).toFixed(1) + '%';
        d.style.background = k.color || '#fff';
        const rk = k.rank && k.rank <= 3 ? String(k.rank) : '';
        if (d.textContent !== rk) { d.textContent = rk; d.dataset.rank = rk; }
      });
      dots.forEach((d, el) => { if (!live.has(el)) { d.remove(); dots.delete(el); } });
    }

    // 2D로 돌아갈 때: 옮겨 둔 이름표를 차에 돌려놓고 3D 층을 걷어요
    function destroy() {
      tags.forEach((tg, el) => { tg.style.transform = ''; tg.style.zIndex = ''; tg.style.visibility = ''; tg.style.removeProperty('--lead'); if (el.isConnected) el.insertBefore(tg, el.firstChild); else tg.remove(); });
      tags.clear();
      gates.forEach(g => g.remove());
      cv.remove();
      tagsEl.remove();
      mini.remove();
      shown.clear();
      dots.clear();
      delete host.dataset.shot;
      host.style.removeProperty('--car-w');
      host.style.removeProperty('--tag-size');
      G = null;
    }

    return { layout, frame, destroy, setShot, setZoom, get shot() { return shot; } };
  }

  window.RACE3D = { create, THEMES };
})();
