/*
 * 큰 화면 레이스의 3D 화면: 뒤에서 따라가는 시점
 * - 카메라는 맨 뒤 차 바로 뒤에서 앞을 봐요. 길은 화면 안쪽으로 뻗고, 코스마다 굽이가 달라요.
 * - 1등이 멀리 앞서 나가면 카메라가 멀리서 당겨 찍어서(망원) 1등도 너무 작아지지 않아요.
 * - 차는 뒷모습 그림(art.js rearSVG)을 세워 둔 판이고, 이름표는 맨 위 층에 따로 두어 앞차에 가려지지 않아요.
 * - 위쪽 진행 막대에 모두의 자리와 지금 큰 화면에 담긴 범위가 나와요.
 * 땅과 길은 canvas 한 장에 그리고, 차와 이름표는 transform만 바꿔서 학교 노트북에서도 가볍게 움직여요.
 */
(function () {
  // 코스별 색과 굽이(k: 칸마다 길이 휘는 정도)
  const THEMES = {
    oval:  { grass: ['#6fb35d', '#64a853'], road: ['#5a5e69', '#61656f'], rumble: ['#e2412e', '#ffffff'], lane: '#ffffff', side: 'board',
             k: c => { const m = ((c % 100) + 100) % 100; return (m > 12 && m < 38) || (m > 62 && m < 88) ? 0.006 : 0; } },
    snake: { grass: ['#8cc96d', '#80be62'], road: ['#5c6069', '#646871'], rumble: ['#f5f5f7', '#5c6069'], lane: '#ffffff', center: '#ffd84a', side: 'tree',
             k: c => 0.009 * Math.sin(c * Math.PI * 2 / 24) },
    dirt:  { grass: ['#b38a59', '#a87f4f'], road: ['#cfa36d', '#c69a64'], rumble: ['#9c7147', '#8d6540'], ruts: 'rgba(90,60,30,.28)', side: 'pine',
             k: c => 0.011 * Math.pow(Math.sin(c * Math.PI * 2 / 18), 3) },
    coast: { grass: ['#ecd59b', '#e4cb8e'], road: ['#5a5f6b', '#616672'], rumble: ['#f5f5f7', '#5a5f6b'], lane: '#ffffff', sea: true, side: 'palm',
             k: c => 0.006 * Math.sin(c * Math.PI * 2 / 30) + 0.003 * Math.sin(c * Math.PI * 2 / 11) },
    rally: { grass: ['#e8cf96', '#dfc489'], road: ['#c29660', '#b98d58'], rumble: ['#a77c48', '#96703f'], ruts: 'rgba(90,60,30,.22)', side: 'cactus',
             k: c => 0.006 * Math.sin(c * Math.PI * 2 / 40) + 0.004 * Math.sin(c * Math.PI * 2 / 17 + 1) }
  };
  const FONT = "'Pretendard Variable', Pretendard, 'Malgun Gothic', sans-serif";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const C0 = -60, STEP = 0.25; // 굽이 표: C0칸부터 STEP칸마다

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
    let G = null, cam = 0, Z0 = 8, dpr = 1, first = true, drawnKey = '';
    let HX = null, XX = null; // 굽이 표: 길 방향(HX)과 길 가운데의 옆 위치(XX)

    // W·H: 코스 영역 크기(px), n: 학생 수, o.cells: 결승선 칸 수, o.track: 코스 종류
    function layout(W, H, n, o) {
      const L = clamp(Math.ceil(n / 5), 2, 6);          // 30명이면 6줄
      const miniH = clamp(H * 0.065, 38, 64);
      const yHor = H * 0.4, yBot = H * 1.02;
      const RW = W * 0.48;                               // 카메라 바로 앞 길 폭의 절반
      const lanes = Array.from({ length: L }, (_, j) => ((j + 0.5) / L * 2 - 1) * 0.86);
      const carW = Math.min(2 * RW / L * 0.64, W * 0.12, 190);
      const sLast = (H * 0.955 - yHor) / (yBot - yHor);  // 맨 뒤 차가 서는 자리(화면 아래)
      G = { W, H, L, n, cells: o.cells, theme: THEMES[o.track] || THEMES.oval, miniH, yHor, yBot, RW, lanes, carW, carH: carW * 100 / 120, back: 1 / sLast - 1 };
      // 굽이 표 만들기
      const N = Math.ceil((o.cells + 400 - C0) / STEP);
      HX = new Float32Array(N + 1);
      XX = new Float32Array(N + 1);
      for (let i = 1; i <= N; i++) {
        const c = C0 + i * STEP;
        HX[i] = HX[i - 1] + G.theme.k(c) * STEP;
        XX[i] = XX[i - 1] + HX[i] * STEP;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 1.25); // 땅 그림은 부드러워서 너무 촘촘하게 그리지 않아요
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      first = true;
      drawnKey = '';
      shown.clear();
      buildMini();
      return { skyBottom: yHor, miniBottom: H * 0.012 + miniH, carW, carH: G.carH, tagSize: clamp(carW * 0.17, 16, 28) };
    }
    const tab = (A, c) => {
      const f = (c - C0) / STEP, i = clamp(Math.floor(f), 0, A.length - 2), t = clamp(f - i, 0, 1);
      return A[i] + (A[i + 1] - A[i]) * t;
    };
    // 카메라에서 z칸 앞의 길 가운데가 옆으로 얼마나 휘었는지(px)
    function bend(z, s) {
      const dx = tab(XX, cam + z) - tab(XX, cam) - tab(HX, cam) * z;
      const lim = 0.32;
      return G.RW * lim * Math.tanh(s * dx * 6 / lim) ; // 멀리서도 화면 밖으로 크게 휘지 않게
    }
    const sAt = z => Z0 / (Z0 + Math.max(z, -Z0 * 0.5));
    const yAt = s => G.yHor + (G.yBot - G.yHor) * s;

    // cars: [{ el, c(지금 보이는 칸), i(들어온 차례), color, rank(1~3, 비밀이면 0), moving }]
    // o.jump: 결승선에 한꺼번에 모일 때처럼 달려가는 모습 없이 바로 옮겨요. o.secret: 순위 비공개
    function frame(cars, dt, o) {
      if (!G) return;
      o = o || {};
      const { L, W } = G;
      const snap = first || o.jump;
      // 같은 줄에서 겹치는 차는 줄을 세워요. 달리는 차는 뒤로(앞선 칸 순서, 같은 칸이면 들어온 차례),
      // 결승선에 닿은 차는 결승선 너머로 들어온 차례대로(앞뒤 자리로 순위를 알 수 없게)
      const gap = Math.max(1, Z0 * 0.08), end = G.cells;
      const byLane = Array.from({ length: L }, () => []);
      cars.forEach(k => byLane[k.i % L].push(k));
      let lo = Infinity, hi = -Infinity;
      byLane.forEach(list => {
        const done = list.filter(k => k.c >= end - 1e-6).sort((p, q) => p.i - q.i);
        const run = list.filter(k => k.c < end - 1e-6).sort((p, q) => (q.c - p.c) || (p.i - q.i));
        done.forEach((k, m) => { k.want = end + 0.6 + (done.length - 1 - m) * gap; });
        let prev = end + gap * 0.4;
        run.forEach(k => { k.want = Math.min(k.c, prev - gap); prev = k.want; });
        list.forEach(k => {
          const x = k.want;
          let st = shown.get(k.el);
          if (!st || snap) { st = { qx: x }; shown.set(k.el, st); }
          st.qx += (x - st.qx) * Math.min(1, dt * 7);
          k.qx = st.qx;
          if (k.qx < lo) lo = k.qx;
          if (k.qx > hi) hi = k.qx;
        });
      });
      if (!cars.length) { lo = 0; hi = 0; }
      // 카메라: 맨 뒤 차 바로 뒤. 1등이 멀면 멀리서 당겨 찍어요(1등이 맨 뒤 차의 절반쯤보다 작아지지 않게)
      const tZ = Math.max(7, (hi - lo) * 0.85);
      const kk = snap ? 1 : 1 - Math.exp(-dt * 2.5);
      Z0 += (tZ - Z0) * kk;
      const tc = lo - G.back * Z0;
      cam += (tc - cam) * kk;
      first = false;

      const live = new Set(), labels = [];
      cars.forEach(k => {
        const z = k.qx - cam, s = sAt(z), y = yAt(s);
        const x = W / 2 + bend(z, s) + G.RW * G.lanes[k.i % L] * s;
        const zi = Math.round(20000 - z * 40);
        k.el.style.transform = `translate3d(${(x - G.carW / 2).toFixed(1)}px,${(y - G.carH * 0.96).toFixed(1)}px,0) scale(${s.toFixed(3)})`;
        k.el.style.zIndex = zi;
        k.el.classList.toggle('moving', !!k.moving);
        // 이름표: 맨 위 층으로 옮겨서 차 위에 띄워요
        let tg = tags.get(k.el);
        if (!tg || !tg.isConnected) {
          tg = k.el.querySelector('.tag');
          if (tg) { tagsEl.appendChild(tg); tags.set(k.el, tg); }
        }
        if (tg) labels.push({ tg, x, y: y - G.carH * 0.96 * s - 4, tk: clamp(Math.sqrt(s), 0.6, 1), zi });
        live.add(k.el);
      });
      placeLabels(labels, snap);
      tags.forEach((tg, el) => { if (!live.has(el)) { if (el.isConnected) el.appendChild(tg); else tg.remove(); tags.delete(el); } });
      [0, G.cells].forEach((cc, gi) => {
        const g = gates[gi], z = cc - cam;
        if (!g.isConnected) carsEl.appendChild(g); // 차 목록을 새로 그리면 다시 붙여요
        // 출발 문은 출발한 뒤에는 걷어요(맨 뒤 차를 따라가는 카메라 앞을 오래 가리지 않게)
        if (z < 0.3 || z > Z0 * 25 || (gi === 0 && hi > 1.5)) { g.style.display = 'none'; return; }
        const s = sAt(z), y = yAt(s), x = W / 2 + bend(z, s);
        g.style.display = '';
        g.style.width = (G.RW * 2.24).toFixed(0) + 'px';
        g.style.height = (G.carH * 2.1).toFixed(0) + 'px';
        g.style.transform = `translate3d(${(x - G.RW * 1.12).toFixed(1)}px,${(y - G.carH * 2.1).toFixed(1)}px,0) scale(${s.toFixed(3)})`;
        g.style.zIndex = Math.round(20000 - z * 40);
      });
      draw();
      updateMini(cars, o.secret, lo, hi);
    }

    // 이름표가 겹치면 먼 차의 이름표를 위로 비켜 올리고, 차까지 가는 가는 선을 그어요
    const lift = new Map(); // 이름표 → 지금 올라가 있는 만큼(px)
    function placeLabels(list, snap) {
      list.sort((a, b) => b.zi - a.zi); // 가까운 차부터 제자리
      const placed = [];
      list.forEach(L => {
        const tg = L.tg;
        let m = tg._m;
        if (!m || m.t !== tg.textContent) { m = tg._m = { t: tg.textContent, w: tg.offsetWidth, h: tg.offsetHeight }; }
        const w = m.w * L.tk + 6, h = m.h * L.tk + 3;
        let bot = L.y;
        for (let n = 0; n < 12; n++) {
          const hit = placed.find(p => L.x - w / 2 < p.r && L.x + w / 2 > p.l && bot - h < p.b && bot > p.t);
          if (!hit) break;
          bot = hit.t;
        }
        placed.push({ l: L.x - w / 2, r: L.x + w / 2, t: bot - h, b: bot });
        const want = L.y - bot;
        const cur = snap || !lift.has(tg) ? want : lift.get(tg) + (want - lift.get(tg)) * 0.25;
        lift.set(tg, cur);
        tg.style.transform = `translate3d(${L.x.toFixed(1)}px,${(L.y - cur).toFixed(1)}px,0) translate(-50%,-100%) scale(${L.tk.toFixed(3)})`;
        tg.style.setProperty('--lead', (cur / L.tk).toFixed(1) + 'px');
        tg.style.zIndex = L.zi;
      });
    }

    // ---------- 땅과 길 ----------
    function draw() {
      const { W, H, theme: T, cells, RW, L } = G;
      const key = cam.toFixed(3) + '|' + Z0.toFixed(3);
      if (key === drawnKey) return;
      drawnKey = key;
      const c = ctx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H);
      const yH = G.yHor;
      // 땅(하늘은 비워 두어 뒤의 역사 장면이 보여요)
      c.fillStyle = T.grass[0];
      c.fillRect(0, yH, W, H - yH);
      if (T.sea) {
        c.fillStyle = '#4fb3e0';
        c.fillRect(0, yH, W, (H - yH) * 0.035);
      }
      // 길 조각: 먼 곳부터 가까운 곳으로
      const zFar = Z0 * 22; // 이보다 먼 길은 지평선에 거의 붙어서 그리지 않아요
      const segs = [];
      let z = -G.back * Z0 * 0.4;
      while (z < zFar) {
        const st = z < 30 ? 0.5 : z < 90 ? 1 : z < 240 ? 2 : 6;
        segs.push(z);
        z = Math.floor((cam + z + st) / st) * st - cam + 1e-6;
      }
      segs.push(zFar);
      const P = segs.map(zz => { const s = sAt(zz); return { z: zz, c: cam + zz, s, y: yAt(s), x: W / 2 + bend(zz, s), w: RW * s }; });
      const quad = (p, a, b, u0, u1) => { p.moveTo(a.x + u0 * a.w, a.y); p.lineTo(a.x + u1 * a.w, a.y); p.lineTo(b.x + u1 * b.w, b.y); p.lineTo(b.x + u0 * b.w, b.y); p.closePath(); };
      // 길 한 줄(u0~u1)을 처음부터 끝까지 한 도형으로
      const strip = (u0, u1) => { c.beginPath(); P.forEach((p, i) => (i ? c.lineTo : c.moveTo).call(c, p.x + u0 * p.w, p.y)); for (let i = P.length - 1; i >= 0; i--) c.lineTo(P[i].x + u1 * P[i].w, P[i].y); c.closePath(); c.fill(); };
      // 번갈아 칠하는 띠: 같은 칸 묶음끼리 이어 붙여 조각 수를 줄여요
      const bands = (size, zLim, fn) => {
        let start = null, cur = -1;
        for (let i = 0; i < P.length; i++) {
          const p = P[i], id = p.z < zLim ? Math.floor((p.c + 1e-4) / size) : -9;
          if (id !== cur) { if (start && (cur & 1)) fn(start, P[i]); start = p; cur = id; }
        }
      };
      const zAlt = Math.min(90, Z0 * 7);
      // 풀밭 줄무늬
      c.fillStyle = T.grass[1];
      c.beginPath();
      bands(2, zAlt, (a, b) => c.rect(0, b.y, W, a.y - b.y + 0.5));
      c.fill();
      // 길, 진한 띠
      c.fillStyle = T.road[0]; strip(-1, 1);
      c.fillStyle = T.road[1];
      c.beginPath();
      bands(2, zAlt, (a, b) => quad(c, a, b, -1, 1));
      c.fill();
      if (T.ruts) { c.fillStyle = T.ruts; [-0.55, -0.35, 0.35, 0.55].forEach(u => strip(u - 0.03, u + 0.03)); }
      // 길 가장자리(연석)
      c.fillStyle = T.rumble[0]; strip(-1.09, -1); strip(1, 1.09);
      c.fillStyle = T.rumble[1];
      c.beginPath();
      bands(1, zAlt, (a, b) => { quad(c, a, b, -1.09, -1); quad(c, a, b, 1, 1.09); });
      c.fill();
      // 차선 점선
      if (T.lane) {
        c.fillStyle = 'rgba(255,255,255,.55)';
        c.beginPath();
        const at0 = cc => { const zz = cc - cam, s = sAt(zz); return { y: yAt(s), x: W / 2 + bend(zz, s), w: RW * s }; };
        for (let k = Math.floor(cam); k < cam + Math.min(60, Z0 * 3); k++) { // 먼 점선은 너무 작아 보이지 않아요
          if (k - cam < 0) continue;
          const a = at0(k), b = at0(k + 0.5);
          for (let j = 1; j < L; j++) { const u = (j / L * 2 - 1) * 0.86; quad(c, a, b, u - 0.012, u + 0.012); }
        }
        c.fill();
      }
      // 가로 표시: 출발선·결승선(체크무늬), 장면이 바뀌는 곳(노란 점선), 5칸 눈금
      const at = cc => { const zz = cc - cam; if (zz < -G.back * Z0 * 0.4 || zz > zFar) return null; const s = sAt(zz); return { z: zz, s, y: yAt(s), x: W / 2 + bend(zz, s), w: RW * s }; };
      const cross = (cc, depth) => { const a = at(cc), b = at(cc + depth); return a && b ? [a, b] : null; };
      c.fillStyle = 'rgba(255,255,255,.25)';
      c.beginPath();
      for (let k = Math.ceil(cam / 5) * 5; k < cam + Math.min(zFar, 160); k += 5) {
        if (k <= 0 || k >= cells || k % (cells / 5) === 0) continue;
        const s2 = cross(k, 0.12);
        if (s2) quad(c, s2[0], s2[1], -1, 1);
      }
      c.fill();
      for (let zz = 1; zz < 5; zz++) {
        const s2 = cross(cells * zz / 5, 0.3);
        if (!s2) continue;
        c.fillStyle = '#ffd84a';
        c.beginPath();
        for (let m = 0; m < 10; m += 2) quad(c, s2[0], s2[1], -1 + m * 0.2, -1 + (m + 1) * 0.2);
        c.fill();
      }
      [0, cells].forEach(cc => {
        const s2 = cross(cc, 0.5);
        if (!s2) return;
        const [a, b] = s2;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, w: (a.w + b.w) / 2 };
        c.fillStyle = '#ffffff'; c.beginPath(); quad(c, a, b, -1, 1); c.fill();
        c.fillStyle = '#1d1d1f'; c.beginPath();
        for (let m = 0; m < 12; m++) { if (m % 2) quad(c, a, mid, -1 + m / 6, -1 + (m + 1) / 6); else quad(c, mid, b, -1 + m / 6, -1 + (m + 1) / 6); }
        c.fill();
      });
      // 길가 물건: 같은 색끼리 모아 한 번에 칠해요(학교 노트북에서도 가볍게)
      const kind = T.side, B = { sh: new Path2D(), trunk: new Path2D(), leaf: new Path2D(), leaf2: new Path2D(), rock: new Path2D(), board: SIDE.board.map(() => new Path2D()) };
      const zMax = Math.min(zFar, Z0 * 8, 120);
      for (let k = Math.floor(cam) - 1; k < cam + zMax; k++) {
        const h = hash(k);
        if (h >= 0.5) continue;
        const a = at(k + hash(k + 7) * 0.8);
        if (!a || a.s < 0.06) continue;
        const side = hash(k + 3) < 0.5 ? -1 : 1, x = a.x + side * a.w * (1.35 + h * 1.6), y = a.y, zz = G.carW * a.s * (0.55 + h * 0.5);
        if (x < -zz * 2 || x > W + zz * 2) continue;
        addProp(B, kind, x, y, zz, h);
      }
      const col = SIDE[kind];
      c.fillStyle = 'rgba(0,0,0,.14)'; c.fill(B.sh);
      if (kind === 'board') { c.fillStyle = '#7c808b'; c.fill(B.trunk); B.board.forEach((p, i) => { c.fillStyle = SIDE.board[i]; c.fill(p); }); }
      else {
        c.fillStyle = col[0]; c.fill(B.trunk);
        c.fillStyle = col[1]; c.fill(B.leaf);
        c.fillStyle = col[2]; c.fill(B.leaf2);
        c.fillStyle = '#8d8a86'; c.fill(B.rock);
      }
      // 장면 번호 표지판 ①~⑤(오른쪽 길가)
      for (let zz = 0; zz < 5; zz++) {
        const a = at(cells * zz / 5 + (zz ? 0 : 1.2));
        if (!a || a.s < 0.05) continue;
        const cw = G.carW * a.s, x = a.x + a.w * 1.22, y = a.y, h = cw * 0.9, r = cw * 0.24;
        if (x > W + cw) continue;
        c.strokeStyle = '#3a3a40'; c.lineWidth = Math.max(1.5, cw * 0.05);
        c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.stroke();
        c.fillStyle = '#1d1d1f'; c.beginPath(); c.arc(x, y - h - r * 0.7, r, 0, Math.PI * 2); c.fill();
        c.strokeStyle = '#ffd84a'; c.lineWidth = Math.max(1.5, r * 0.16); c.stroke();
        c.fillStyle = '#fff'; c.font = `800 ${Math.max(7, Math.round(r * 1.2))}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(zz + 1, x, y - h - r * 0.62);
      }
    }

    // 길가 물건 모양: [줄기 색, 잎 색, 밝은 잎 색], 경기장은 광고판 색
    const SIDE = { tree: ['#7a5638', '#3e9a4d', '#5bb565'], pine: ['#6d4a30', '#3c7a4a', '#4f8f5c'], palm: ['#8a6440', '#3f9a52', '#5bb565'], cactus: ['#4f9a5a', '#4f9a5a', '#6bb576'],
      board: ['#0066cc', '#ffd84a', '#ff3b30', '#34c759', '#ffffff'] };
    function oval(p, x, y, rx, ry, rot) { p.moveTo(x + rx * Math.cos(rot || 0), y + rx * Math.sin(rot || 0)); p.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); }
    function addProp(B, kind, x, y, zz, h) {
      oval(B.sh, x, y, zz * 0.5, zz * 0.1);
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
          if (h < 0.12) oval(B.rock, x + zz * 0.6, y - zz * 0.15, zz * 0.32, zz * 0.2); // 산길: 가끔 바위
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
      }
    }

    // ---------- 진행 막대 ----------
    function buildMini() {
      mini.style.setProperty('--mini-h', G.miniH + 'px');
      mini.innerHTML = `<span class="r3m-end">출발</span><div class="r3m-track"><div class="r3m-line"></div>` +
        [0, 1, 2, 3, 4].map(z => `<i class="r3m-sec" style="left:${z * 20}%"><b>${z + 1}</b></i>`).join('') +
        `<div class="r3m-view"></div><div class="r3m-dots"></div></div><span class="r3m-end">🏁</span><p class="r3m-secret">🤫 순위는 비밀! 모두 결승선에서 기다려요</p>`;
      dots.clear();
    }
    function updateMini(cars, secret, lo, hi) {
      mini.classList.toggle('secret', !!secret);
      const view = mini.querySelector('.r3m-view');
      const l = clamp((lo - 0.5) / G.cells, 0, 1), r = clamp((hi + 0.5) / G.cells, 0, 1);
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
      tags.forEach((tg, el) => { tg.style.transform = ''; tg.style.zIndex = ''; tg.style.removeProperty('--lead'); if (el.isConnected) el.insertBefore(tg, el.firstChild); else tg.remove(); });
      tags.clear();
      gates.forEach(g => g.remove());
      cv.remove();
      tagsEl.remove();
      mini.remove();
      shown.clear();
      dots.clear();
      G = null;
    }

    return { layout, frame, destroy };
  }

  window.RACE3D = { create, THEMES };
})();
