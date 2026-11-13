/*
 * 큰 화면 레이스의 3D 화면: 왼쪽 뒤 위에서 45도로 내려다보며 무리를 따라가는 시점
 * - 탈것 그림(art.js quarterSVG)과 길을 같은 45도 각도로 그려서, 차가 길 방향 그대로 달려요.
 * - 길은 화면 오른쪽 아래에서 왼쪽 위로 비스듬히 뻗어요. 맨 뒤 차는 오른쪽 아래, 1등은 왼쪽 위예요.
 * - 사이가 벌어지면 길을 접듯이 당겨서(칸 사이를 좁혀) 1등부터 꼴찌까지 한 화면에 담아요. 크기는 거의 그대로라 모두 잘 보여요.
 * - 이름표는 맨 위 층에 따로 두어 앞차에 가려지지 않고, 겹치면 위로 비켜 올라가 선으로 차와 이어져요.
 * - 위쪽 진행 막대에 모두의 자리와 지금 큰 화면에 담긴 범위가 나와요.
 * 땅과 길은 canvas 한 장에 그리고, 차와 이름표는 transform만 바꿔서 학교 노트북에서도 가볍게 움직여요.
 */
(function () {
  // 코스별 색과 굽이(k: 칸마다 길이 휘는 정도)
  const THEMES = {
    oval:  { grass: ['#6fb35d', '#64a853'], road: ['#5a5e69', '#61656f'], rumble: ['#e2412e', '#ffffff'], lane: true, side: 'board',
             k: c => { const m = ((c % 100) + 100) % 100; return (m > 12 && m < 38) || (m > 62 && m < 88) ? 0.006 : 0; } },
    snake: { grass: ['#8cc96d', '#80be62'], road: ['#5c6069', '#646871'], rumble: ['#f5f5f7', '#5c6069'], lane: true, side: 'tree',
             k: c => 0.009 * Math.sin(c * Math.PI * 2 / 24) },
    dirt:  { grass: ['#b38a59', '#a87f4f'], road: ['#cfa36d', '#c69a64'], rumble: ['#9c7147', '#8d6540'], ruts: 'rgba(90,60,30,.28)', side: 'pine',
             k: c => 0.011 * Math.pow(Math.sin(c * Math.PI * 2 / 18), 3) },
    coast: { grass: ['#ecd59b', '#e4cb8e'], road: ['#5a5f6b', '#616672'], rumble: ['#f5f5f7', '#5a5f6b'], lane: true, sea: true, side: 'palm',
             k: c => 0.006 * Math.sin(c * Math.PI * 2 / 30) + 0.003 * Math.sin(c * Math.PI * 2 / 11) },
    rally: { grass: ['#e8cf96', '#dfc489'], road: ['#c29660', '#b98d58'], rumble: ['#a77c48', '#96703f'], ruts: 'rgba(90,60,30,.22)', side: 'cactus',
             k: c => 0.006 * Math.sin(c * Math.PI * 2 / 40) + 0.004 * Math.sin(c * Math.PI * 2 / 17 + 1) }
  };
  const FONT = "'Pretendard Variable', Pretendard, 'Malgun Gothic', sans-serif";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  // 탈것 그림과 같은 각도: 옆으로 45도, 위에서 32도 내려다봐요
  const QS = Math.sin(32 * Math.PI / 180), QC = Math.cos(32 * Math.PI / 180), QK = Math.SQRT1_2;
  const SPR = 170, AY = 125 / 170;     // 탈것 그림 틀(170단위), 바닥 한가운데는 위에서 73.5%
  const LANE = 96, CAR_LEN = 120;      // 차선 폭, 차 길이(그림 단위)
  const C0 = -80, STEP = 0.25;         // 굽이 표: C0칸부터 STEP칸마다

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
    let G = null, cc = 0, zs = 40, dpr = 1, first = true, drawnKey = '';
    let HX = null, XX = null; // 굽이 표: 길 방향(HX)과 길 가운데의 옆 위치(XX)

    // W·H: 코스 영역 크기(px), n: 학생 수, o.cells: 결승선 칸 수, o.track: 코스 종류
    function layout(W, H, n, o) {
      const L = clamp(Math.ceil(n / 5), 2, 6);          // 30명이면 6줄
      const miniH = clamp(H * 0.065, 38, 64), miniBottom = H * 0.012 + miniH;
      const carW = clamp(Math.min(H * 0.17, W * 0.095), 80, 170);
      const S = carW / SPR;                              // 그림 1단위 = S px
      const HW = L * LANE / 2;                           // 길 폭의 절반(그림 단위)
      const lanes = Array.from({ length: L }, (_, j) => ((j + 0.5) / L * 2 - 1) * HW * 0.9);
      G = { W, H, L, n, cells: o.cells, theme: THEMES[o.track] || THEMES.oval, miniH, miniBottom, carW, S, HW, lanes,
            OX: W * 0.5, OY: H * 0.6, D: 3600, along: Math.hypot(W, H) * 0.5 };
      const N = Math.ceil((o.cells + 400 - C0) / STEP);
      HX = new Float32Array(N + 1);
      XX = new Float32Array(N + 1);
      for (let i = 1; i <= N; i++) {
        const c = C0 + i * STEP;
        HX[i] = HX[i - 1] + G.theme.k(c) * STEP;
        XX[i] = XX[i - 1] + HX[i] * STEP;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      first = true;
      drawnKey = '';
      shown.clear();
      buildMini();
      // 역사 장면 전광판: 오른쪽 위(길이 지나가지 않는 곳)
      const bw = W * 0.3, bh = bw / 1.5;
      return { miniBottom, carW, carH: carW, tagSize: clamp(carW * 0.17, 16, 28), board: { x: W - bw - W * 0.012, y: miniBottom + 10, w: bw, h: bh } };
    }
    const tab = (A, c) => {
      const f = (c - C0) / STEP, i = clamp(Math.floor(f), 0, A.length - 2), t = clamp(f - i, 0, 1);
      return A[i] + (A[i + 1] - A[i]) * t;
    };
    // 길 가운데가 옆으로 휜 만큼(그림 단위): 카메라가 보는 곳(cc) 기준
    const bendX = c => { const dx = tab(XX, c) - tab(XX, cc) - tab(HX, cc) * (c - cc); return G.HW * 2.2 * Math.tanh(dx * 0.6); };
    // 세상 → 화면: x 옆(그림 단위), y 위, c 칸. 아주 약한 원근(가까운 쪽이 조금 커요)
    function proj(x, y, c) {
      const z = (c - cc) * zs, d = Math.max(-0.6 * G.D, (x + z) * QK * QC - y * QS), s = G.D / (G.D + d), k = G.S * s;
      return { x: G.OX + k * (x - z) * QK, y: G.OY - k * (QK * QS * (x + z) + QC * y), s, d };
    }
    const road = (u, c) => proj(bendX(c) + u, 0, c); // 길 위 옆자리 u(그림 단위)

    // cars: [{ el, c(지금 보이는 칸), i(들어온 차례), color, rank(1~3, 비밀이면 0), moving }]
    // o.jump: 결승선에 한꺼번에 모일 때처럼 달려가는 모습 없이 바로 옮겨요. o.secret: 순위 비공개
    function frame(cars, dt, o) {
      if (!G) return;
      o = o || {};
      const { L } = G;
      const snap = first || o.jump;
      // 같은 줄에서 겹치는 차는 줄을 세워요. 달리는 차는 뒤로(앞선 칸 순서, 같은 칸이면 들어온 차례),
      // 결승선에 닿은 차는 결승선 너머로 들어온 차례대로(앞뒤 자리로 순위를 알 수 없게)
      const gap = CAR_LEN * 1.04 / zs, end = G.cells;
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
      // 카메라: 무리 한가운데를 보고, 사이가 벌어지면 칸 사이를 좁혀 모두 담아요
      const tz = clamp(G.along / (G.S * 0.8 * (hi - lo + CAR_LEN * 1.6 / zs)), 10, 64);
      const kk = snap ? 1 : 1 - Math.exp(-dt * 2.5);
      zs += (tz - zs) * kk;
      cc += ((lo + hi) / 2 - cc) * kk;
      first = false;

      const live = new Set(), labels = [];
      cars.forEach(k => {
        const p = road(G.lanes[k.i % L], k.qx);
        const zi = Math.round(20000 - p.d * 4);
        k.el.style.transform = `translate3d(${(p.x - G.carW / 2).toFixed(1)}px,${(p.y - G.carW * AY).toFixed(1)}px,0) scale(${p.s.toFixed(3)})`;
        k.el.style.zIndex = zi;
        k.el.classList.toggle('moving', !!k.moving);
        // 이름표: 맨 위 층으로 옮겨서 차 위에 띄워요
        let tg = tags.get(k.el);
        if (!tg || !tg.isConnected) {
          tg = k.el.querySelector('.tag');
          if (tg) { tagsEl.appendChild(tg); tags.set(k.el, tg); }
        }
        if (tg) labels.push({ tg, x: p.x, y: p.y - G.carW * 0.6 * p.s, tk: clamp(Math.sqrt(p.s), 0.75, 1.1), zi });
        live.add(k.el);
      });
      placeLabels(labels, snap);
      tags.forEach((tg, el) => { if (!live.has(el)) { if (el.isConnected) el.appendChild(tg); else tg.remove(); tags.delete(el); } });
      placeGates(hi);
      draw();
      updateMini(cars, o.secret, lo, hi);
    }

    // 출발·결승 문: 길을 가로지르는 판(문의 앞면이 우리 쪽을 봐요). 출발 문은 출발한 뒤에는 걷어요
    function placeGates(hi) {
      [0, G.cells].forEach((c, gi) => {
        const g = gates[gi];
        if (!g.isConnected) carsEl.appendChild(g); // 차 목록을 새로 그리면 다시 붙여요
        const p = proj(bendX(c), 0, c);
        if ((gi === 0 && hi > 1.5) || p.x < -G.W || p.x > G.W * 2 || p.y < -G.H || p.y > G.H * 2) { g.style.display = 'none'; return; }
        const x0 = bendX(c) - G.HW * 1.12, wd = G.HW * 2.24, ht = 150, k = G.S * p.s;
        const z = (c - cc) * zs, e = G.OX + k * QK * (x0 - z), f = G.OY - k * (QK * QS * (x0 + z) + QC * ht);
        g.style.display = '';
        g.style.width = wd.toFixed(0) + 'px';
        g.style.height = ht + 'px';
        g.style.transform = `matrix(${(k * QK).toFixed(4)},${(-k * QK * QS).toFixed(4)},0,${(k * QC).toFixed(4)},${e.toFixed(1)},${f.toFixed(1)})`;
        g.style.zIndex = Math.round(20000 - p.d * 4);
      });
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

    // ---------- 땅과 길 ----------
    function draw() {
      const { W, H, theme: T, cells, HW, L } = G;
      const key = cc.toFixed(3) + '|' + zs.toFixed(3);
      if (key === drawnKey) return;
      drawnKey = key;
      const c = ctx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = T.grass[0];
      c.fillRect(0, 0, W, H);
      // 보이는 칸 범위와 칸 간격(화면에서 8px쯤 되게)
      const perCell = G.S * 0.8 * zs, span = Math.hypot(W, H) / perCell;
      const c0 = Math.floor(cc - span * 0.75), c1 = Math.ceil(cc + span * 0.75);
      const st = [0.25, 0.5, 1, 2, 4].find(s => s * perCell >= 7) || 4;
      const cs = [];
      for (let k = Math.floor(c0 / st) * st; k <= c1; k += st) cs.push(k);
      const quad = (a0, a1, b1, b0) => { c.moveTo(a0.x, a0.y); c.lineTo(a1.x, a1.y); c.lineTo(b1.x, b1.y); c.lineTo(b0.x, b0.y); c.closePath(); };
      const strip = (u0, u1, col) => { c.fillStyle = col; c.beginPath(); cs.forEach((k, i) => { const p = road(u0, k); (i ? c.lineTo : c.moveTo).call(c, p.x, p.y); }); for (let i = cs.length - 1; i >= 0; i--) { const p = road(u1, cs[i]); c.lineTo(p.x, p.y); } c.closePath(); c.fill(); };
      const band = (size, u0, u1, col, alt) => { c.fillStyle = col; c.beginPath(); for (let k = Math.floor(c0 / size) * size; k <= c1; k += size) { if (((Math.round(k / size) % 2) + 2) % 2 !== alt) continue; quad(road(u0, k), road(u1, k), road(u1, k + size), road(u0, k + size)); } c.fill(); };
      // 풀밭 줄무늬, 바다(해안 도로는 먼 쪽에)
      band(4, -HW * 6, HW * 6, T.grass[1], 1);
      if (T.sea) strip(HW * 2.2, HW * 9, '#4fb3e0');
      // 길
      strip(-HW, HW, T.road[0]);
      band(2, -HW, HW, T.road[1], 1);
      if (T.ruts) [-0.55, -0.35, 0.35, 0.55].forEach(u => strip(u * HW - 3, u * HW + 3, T.ruts));
      // 연석
      strip(-HW * 1.08, -HW, T.rumble[0]); strip(HW, HW * 1.08, T.rumble[0]);
      band(1, -HW * 1.08, -HW, T.rumble[1], 1); band(1, HW, HW * 1.08, T.rumble[1], 1);
      // 차선 점선
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
      // 5칸 눈금, 장면이 바뀌는 곳(노란 점선), 출발선·결승선(체크무늬)
      const across = (k, d, col) => { c.fillStyle = col; c.beginPath(); quad(road(-HW, k), road(HW, k), road(HW, k + d), road(-HW, k + d)); c.fill(); };
      const dpc = 6 / zs; // 화면에서 일정한 두께가 되게(칸 단위)
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
      // 길가 물건: 먼 쪽(오른쪽)은 나무처럼 높게, 가까운 쪽(왼쪽)은 낮게. 먼 것부터
      const B = { sh: new Path2D(), trunk: new Path2D(), leaf: new Path2D(), leaf2: new Path2D(), rock: new Path2D(), board: SIDE.board.map(() => new Path2D()) };
      for (let k = Math.floor(c1); k >= Math.floor(c0); k--) {
        const h = hash(k);
        if (h >= 0.55) continue;
        const right = hash(k + 3) < 0.6, u = (right ? 1 : -1) * HW * (1.35 + hash(k + 5) * 1.4);
        const p = road(u, k + hash(k + 7) * 0.8);
        if (p.x < -80 || p.x > W + 80 || p.y < -80 || p.y > H + 120) continue;
        addProp(B, right ? T.side : 'bush', p.x, p.y, G.S * p.s * (right ? 48 + h * 30 : 26), h);
      }
      const col = SIDE[T.side];
      c.fillStyle = 'rgba(0,0,0,.14)'; c.fill(B.sh);
      if (T.side === 'board') { c.fillStyle = '#7c808b'; c.fill(B.trunk); B.board.forEach((p, i) => { c.fillStyle = SIDE.board[i]; c.fill(p); }); }
      else { c.fillStyle = col[0]; c.fill(B.trunk); }
      c.fillStyle = col[1]; c.fill(B.leaf);
      c.fillStyle = col[2]; c.fill(B.leaf2);
      c.fillStyle = '#8d8a86'; c.fill(B.rock);
      // 장면 번호 표지판 ①~⑤(먼 쪽 길가)
      for (let z = 0; z < 5; z++) {
        const k = cells * z / 5 + (z ? 0 : 1.2);
        if (k < c0 || k > c1) continue;
        const p = road(HW * 1.25, k), cw = G.carW * p.s, ht = cw * 0.75, r = cw * 0.2;
        c.strokeStyle = '#3a3a40'; c.lineWidth = Math.max(2, cw * 0.04);
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x, p.y - ht); c.stroke();
        c.fillStyle = '#1d1d1f'; c.beginPath(); c.arc(p.x, p.y - ht - r * 0.7, r, 0, Math.PI * 2); c.fill();
        c.strokeStyle = '#ffd84a'; c.lineWidth = Math.max(1.5, r * 0.16); c.stroke();
        c.fillStyle = '#fff'; c.font = `800 ${Math.max(8, Math.round(r * 1.2))}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(z + 1, p.x, p.y - ht - r * 0.62);
      }
      // 가장자리를 살짝 어둡게(화면 한가운데로 눈이 가게)
      const vg = c.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.45, W / 2, H * 0.55, Math.max(W, H) * 0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,.18)');
      c.fillStyle = vg;
      c.fillRect(0, 0, W, H);
    }

    // 길가 물건 모양: [줄기 색, 잎 색, 밝은 잎 색], 경기장은 광고판 색
    const SIDE = { tree: ['#7a5638', '#3e9a4d', '#5bb565'], pine: ['#6d4a30', '#3c7a4a', '#4f8f5c'], palm: ['#8a6440', '#3f9a52', '#5bb565'], cactus: ['#4f9a5a', '#4f9a5a', '#6bb576'],
      bush: ['#5c8f45', '#4fa457', '#5bb565'], board: ['#0066cc', '#ffd84a', '#ff3b30', '#34c759', '#ffffff'] };
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
