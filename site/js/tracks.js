/*
 * 레이스 코스 5종
 * 코스는 가운데 선(점들을 부드럽게 이은 곡선)으로 정의하고, 그 위를 차가 달립니다.
 *  - oval   경기장 서킷: 한 바퀴 도는 타원형, 장면은 코스 안쪽
 *  - snake  꼬불꼬불 시골길: S자로 굽이치는 길
 *  - dirt   비포장 산길: 지그재그로 내려오는 흙길
 *  - coast  해안 도로: 바닷가를 따라 구불구불
 *  - rally  사막 랠리: 모래 위 자갈길 순환 코스
 */
(function () {
  const LIST = [
    { id: 'oval', name: '경기장 서킷' },
    { id: 'snake', name: '꼬불꼬불 시골길' },
    { id: 'dirt', name: '비포장 산길' },
    { id: 'coast', name: '해안 도로' },
    { id: 'rally', name: '사막 랠리' }
  ];

  // 코스 모양: 0~1 좌표의 점들 (closed = 한 바퀴 도는 코스)
  const SHAPES = {
    snake: { closed: false, pts: [[0.03, 0.55], [0.14, 0.18], [0.27, 0.16], [0.38, 0.78], [0.52, 0.84], [0.63, 0.22], [0.77, 0.16], [0.88, 0.74], [0.97, 0.5]] },
    dirt: { closed: false, tw: 0.12, pts: [[0.04, 0.14], [0.5, 0.1], [0.86, 0.14], [0.95, 0.31], [0.84, 0.48], [0.5, 0.5], [0.16, 0.48], [0.05, 0.66], [0.16, 0.85], [0.55, 0.88], [0.96, 0.84]] },
    coast: { closed: false, pts: [[0.03, 0.3], [0.17, 0.58], [0.32, 0.26], [0.48, 0.56], [0.63, 0.22], [0.79, 0.52], [0.97, 0.28]] },
    rally: { closed: true, pts: [[0.1, 0.55], [0.18, 0.14], [0.42, 0.18], [0.52, 0.48], [0.66, 0.14], [0.9, 0.22], [0.92, 0.76], [0.66, 0.88], [0.48, 0.68], [0.28, 0.9]] }
  };

  const THEMES = {
    oval:  { bg: ['#8cc97a', '#83c271'], road: '#5c606c', edge: 'curb', lanes: true },
    snake: { bg: ['#9ed27f', '#94ca75'], road: '#62666f', edge: '#f5f5f7', lanes: true, center: '#ffd84a', deco: ['tree', 'tree', 'bush'] },
    dirt:  { bg: ['#b9905f', '#b28859'], road: '#d2a873', edge: '#9c7147', lanes: false, tracks: true, deco: ['rock', 'rock', 'pine'] },
    coast: { bg: ['#f1dca6', '#ecd59b'], road: '#5f6470', edge: '#f5f5f7', lanes: true, sea: true, deco: ['palm', 'palm', 'bush'] },
    rally: { bg: ['#ecd39a', '#e5c98c'], road: '#c49a63', edge: '#a77c48', lanes: false, tracks: true, deco: ['cactus', 'rock', 'cactus'] }
  };

  function rng(seed) {
    return () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function catmull(pts, closed, per) {
    const out = [], n = pts.length;
    const get = i => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      for (let j = 0; j < per; j++) {
        const t = j / per, t2 = t * t, t3 = t2 * t;
        const f = a => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3);
        out.push([f(0), f(1)]);
      }
    }
    if (!closed) out.push(pts[n - 1]);
    return out;
  }

  // 점들로 이은 길: 길이 표, 위치·방향 찾기, 옆으로 비켜 선 선 만들기
  function polyline(pts, closed) {
    const P = pts.slice();
    if (closed) P.push(pts[0]);
    const cum = [0];
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const total = cum[cum.length - 1];
    function at(s, off) {
      off = off || 0;
      if (closed) s = ((s % total) + total) % total;
      let x, y, t;
      if (!closed && s <= 0) {
        t = Math.atan2(P[1][1] - P[0][1], P[1][0] - P[0][0]);
        x = P[0][0] + Math.cos(t) * s; y = P[0][1] + Math.sin(t) * s;
      } else {
        if (s >= total) s = total - 0.001;
        let lo = 0, hi = cum.length - 1;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
        const a = P[lo], b = P[hi], f = (s - cum[lo]) / ((cum[hi] - cum[lo]) || 1);
        x = a[0] + (b[0] - a[0]) * f; y = a[1] + (b[1] - a[1]) * f;
        t = Math.atan2(b[1] - a[1], b[0] - a[0]);
      }
      return { x: x - Math.sin(t) * off, y: y + Math.cos(t) * off, t };
    }
    function offsetPath(off) {
      let d = '';
      for (let i = 0; i < P.length; i++) {
        const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
        const t = Math.atan2(b[1] - a[1], b[0] - a[0]);
        d += (i ? 'L' : 'M') + (P[i][0] - Math.sin(t) * off).toFixed(1) + ' ' + (P[i][1] + Math.cos(t) * off).toFixed(1);
      }
      return d + (closed ? 'Z' : '');
    }
    function dist(x, y) {
      let best = Infinity;
      for (let i = 0; i < P.length; i += 2) best = Math.min(best, Math.hypot(P[i][0] - x, P[i][1] - y));
      return best;
    }
    return { at, offsetPath, dist, total, closed, d: offsetPath(0) };
  }

  // ---------- 장식 ----------
  function deco(kind, x, y, s) {
    const f = n => n.toFixed(1);
    switch (kind) {
      case 'tree': return `<ellipse cx="${f(x)}" cy="${f(y + s * 0.9)}" rx="${f(s * 0.8)}" ry="${f(s * 0.25)}" fill="#000" opacity=".12"/><rect x="${f(x - s * 0.12)}" y="${f(y)}" width="${f(s * 0.24)}" height="${f(s * 0.8)}" fill="#7a5638"/><circle cx="${f(x)}" cy="${f(y - s * 0.15)}" r="${f(s * 0.62)}" fill="#3e9a4d"/><circle cx="${f(x - s * 0.2)}" cy="${f(y - s * 0.35)}" r="${f(s * 0.28)}" fill="#5bb565"/>`;
      case 'pine': return `<path d="M${f(x)} ${f(y - s)} L${f(x + s * 0.55)} ${f(y + s * 0.5)} L${f(x - s * 0.55)} ${f(y + s * 0.5)} Z" fill="#3c7a4a"/><rect x="${f(x - s * 0.1)}" y="${f(y + s * 0.5)}" width="${f(s * 0.2)}" height="${f(s * 0.35)}" fill="#6d4a30"/>`;
      case 'bush': return `<circle cx="${f(x - s * 0.3)}" cy="${f(y)}" r="${f(s * 0.35)}" fill="#4fa457"/><circle cx="${f(x + s * 0.25)}" cy="${f(y)}" r="${f(s * 0.4)}" fill="#5bb565"/>`;
      case 'rock': return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s * 0.55)}" ry="${f(s * 0.38)}" fill="#8d8a86"/><ellipse cx="${f(x - s * 0.15)}" cy="${f(y - s * 0.12)}" rx="${f(s * 0.22)}" ry="${f(s * 0.12)}" fill="#b3b0ab"/>`;
      case 'cactus': return `<rect x="${f(x - s * 0.14)}" y="${f(y - s * 0.8)}" width="${f(s * 0.28)}" height="${f(s * 1.2)}" rx="${f(s * 0.14)}" fill="#4f9a5a"/><path d="M${f(x - s * 0.14)} ${f(y - s * 0.2)} h${f(-s * 0.3)} v${f(-s * 0.35)}" stroke="#4f9a5a" stroke-width="${f(s * 0.2)}" fill="none" stroke-linecap="round"/><path d="M${f(x + s * 0.14)} ${f(y - s * 0.35)} h${f(s * 0.28)} v${f(-s * 0.3)}" stroke="#4f9a5a" stroke-width="${f(s * 0.2)}" fill="none" stroke-linecap="round"/>`;
      case 'palm': return `<path d="M${f(x)} ${f(y + s * 0.6)} Q${f(x + s * 0.2)} ${f(y)} ${f(x + s * 0.05)} ${f(y - s * 0.7)}" stroke="#8a6440" stroke-width="${f(s * 0.16)}" fill="none" stroke-linecap="round"/>` +
        [[-1, -0.2], [1, -0.3], [-0.7, 0.25], [0.8, 0.2]].map(([dx, dy]) => `<path d="M${f(x + s * 0.05)} ${f(y - s * 0.7)} q${f(dx * s * 0.4)} ${f(-s * 0.25 + dy * s)} ${f(dx * s * 0.75)} ${f(dy * s + s * 0.1)}" stroke="#3f9a52" stroke-width="${f(s * 0.14)}" fill="none" stroke-linecap="round"/>`).join('');
    }
    return '';
  }

  // ---------- 코스 만들기 ----------
  // rect: 코스를 그릴 영역(px), W·H: 전체 그림 크기
  function build(type, W, H, rect) {
    const theme = THEMES[type] || THEMES.oval;
    const g = { type, name: (LIST.find(t => t.id === type) || LIST[0]).name, theme };
    if (type === 'oval') {
      const m = 38;
      const TW = Math.max(60, Math.min(Math.min(W, H) * 0.2, 220));
      let R = (H - TW - 2 * m) / 2;
      R = Math.min(R, (W - TW - 2 * m) / 3);
      const L = Math.max(0, W - 2 * R - TW - 2 * m), cx = W / 2, cy = H / 2;
      const pts = [];
      const N = 240, Pn = 2 * L + 2 * Math.PI * R;
      for (let i = 0; i < N; i++) {
        let s = i / N * Pn, x, y;
        const a = L / 2, b = Math.PI * R;
        if (s < a) { x = cx + s; y = cy + R; }
        else if (s < a + b) { const f = Math.PI / 2 - (s - a) / R; x = cx + L / 2 + R * Math.cos(f); y = cy + R * Math.sin(f); }
        else if (s < a + b + L) { x = cx + L / 2 - (s - a - b); y = cy - R; }
        else if (s < a + 2 * b + L) { const f = -Math.PI / 2 - (s - a - b - L) / R; x = cx - L / 2 + R * Math.cos(f); y = cy + R * Math.sin(f); }
        else { x = cx - L / 2 + (s - a - 2 * b - L); y = cy + R; }
        pts.push([x, y]);
      }
      Object.assign(g, { TW, R, L, cx, cy, path: polyline(pts, true) });
    } else {
      const sh = SHAPES[type];
      const TW = Math.max(42, Math.min(rect.h * (sh.tw || 0.17), rect.w * 0.09, 130));
      const pad = TW * 0.75 + 16;
      const iw = rect.w - pad * 2, ih = rect.h - pad * 2;
      const raw = sh.pts.map(([u, v]) => [rect.x + pad + u * iw, rect.y + pad + v * ih]);
      Object.assign(g, { TW, path: polyline(catmull(raw, sh.closed, 24), sh.closed) });
    }
    g.P = g.path.total;
    g.closed = g.path.closed;
    g.at = (s, off) => g.path.at(s, off);
    // 진행 비율(0~1)을 길 위 거리로: 한 줄 코스는 출발 대기 자리(startS) 다음부터 셉니다
    g.startS = 0;
    g.sAt = f => (g.closed ? f * g.P : g.startS + f * (g.P - g.startS - 1));
    g.svg = (k, opts) => drawTrack(g, W, H, rect, k, opts || {});
    return g;
  }

  // opts.bare: 잔디·장식 없이 길만 그려요(뒤에 장면 그림을 크게 깔 때)
  function drawTrack(g, W, H, rect, k, opts) {
    const th = g.theme, TW = g.TW, p = g.path, P = g.P;
    const r = rng(g.type.length * 977 + Math.round(W) + Math.round(H));
    let s = `<defs>
        <pattern id="bgp" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="${th.bg[0]}"/><rect width="40" height="80" fill="${th.bg[1]}"/></pattern>
        <pattern id="checker" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><rect width="4" height="4" fill="#1d1d1f"/><rect x="4" y="4" width="4" height="4" fill="#1d1d1f"/></pattern>
      </defs>${opts.bare ? "" : `<rect width="${W}" height="${H}" fill="url(#bgp)"/>`}`;
    if (th.sea) {
      const y0 = rect.y + rect.h * 0.8;
      let wave = `M0 ${y0}`;
      for (let x = 0; x <= W + 40; x += 40) wave += ` Q${x + 20} ${y0 - 10} ${x + 40} ${y0}`;
      s += `<path d="${wave} V${H} H0 Z" fill="#4fb3e0"/><path d="${wave}" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`;
      for (let i = 0; i < 6; i++) s += `<path d="M${(W * (i + 0.3) / 6).toFixed(0)} ${(y0 + 26 + (i % 2) * 14).toFixed(0)} q14 -8 28 0" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`;
    }
    // 장식: 길에서 떨어진 곳에만
    if (th.deco && !opts.bare) {
      for (let i = 0, placed = 0; i < 160 && placed < 34; i++) {
        const x = rect.x + r() * rect.w, y = rect.y + r() * rect.h;
        if (th.sea && y > rect.y + rect.h * 0.78) continue;
        if (p.dist(x, y) < TW * 0.95) continue;
        s += deco(th.deco[Math.floor(r() * th.deco.length)], x, y, Math.max(10, TW * (0.22 + r() * 0.12)));
        placed++;
      }
    }
    const d = p.d;
    const join = 'stroke-linejoin="round" stroke-linecap="round" fill="none"';
    if (th.edge === 'curb') {
      s += `<path d="${d}" ${join} stroke="#e2412e" stroke-width="${TW + 12}"/><path d="${d}" ${join} stroke="#fff" stroke-width="${TW + 12}" stroke-dasharray="18 18"/>`;
      s += `<path d="${d}" ${join} stroke="#f5f5f7" stroke-width="${TW}"/><path d="${d}" ${join} stroke="${th.road}" stroke-width="${TW - 6}"/>`;
    } else {
      s += `<path d="${d}" ${join} stroke="rgba(0,0,0,.14)" stroke-width="${TW + 12}"/>`;
      s += `<path d="${d}" ${join} stroke="${th.edge}" stroke-width="${TW + 6}"/><path d="${d}" ${join} stroke="${th.road}" stroke-width="${TW - (th.tracks ? 0 : 4)}"/>`;
    }
    if (th.lanes) {
      for (let j = 1; j < k; j++) s += `<path d="${p.offsetPath((j / k - 0.5) * TW * 0.86)}" ${join} stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="14 16"/>`;
      if (th.center && k === 1) s += `<path d="${d}" ${join} stroke="${th.center}" stroke-width="2" stroke-dasharray="14 12"/>`;
    }
    if (th.tracks) {
      [-0.3, -0.12, 0.12, 0.3].forEach(f => { s += `<path d="${p.offsetPath(f * TW)}" ${join} stroke="rgba(90,60,30,.28)" stroke-width="${Math.max(3, TW * 0.07)}" stroke-dasharray="${TW * 0.5} ${TW * 0.18}"/>`; });
      for (let i = 0; i < 70; i++) {
        const pt = p.at(r() * P, (r() - 0.5) * TW * 0.85);
        s += `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${(1.5 + r() * 2.5).toFixed(1)}" fill="rgba(80,55,30,.35)"/>`;
      }
    }
    // 칸 눈금
    const cells = (window.APP_CONFIG && window.APP_CONFIG.finishCells) || 15;
    for (let i = 1; i < cells; i++) {
      const a = p.at(g.sAt(i / cells), -TW / 2 + 3), b = p.at(g.sAt(i / cells), -TW / 2 + 13);
      s += `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`;
    }
    // 장면이 바뀌는 곳: ①~⑤ 표지
    for (let z = 0; z < 5; z++) {
      const sp = g.sAt(z / 5) + (z === 0 ? P * 0.02 : 0);
      const a = p.at(sp, -TW / 2), b = p.at(sp, TW / 2), o = p.at(sp, TW / 2 + 22);
      if (z) s += `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}" stroke="#ffd84a" stroke-width="3" stroke-dasharray="6 6"/>`;
      s += `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="14" fill="#1d1d1f"/><text x="${o.x.toFixed(1)}" y="${(o.y + 6).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="700" fill="#fff" font-family="Pretendard Variable, sans-serif">${z + 1}</text>`;
    }
    // 출발선, 결승선
    const line = (sp, label, dy) => {
      const a = p.at(sp, -TW / 2), b = p.at(sp, TW / 2);
      const deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      let t = `<rect x="${(mx - TW / 2).toFixed(1)}" y="${(my - 7).toFixed(1)}" width="${TW}" height="14" fill="url(#checker)" transform="rotate(${deg.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)})"/>`;
      const lp = p.at(sp, dy);
      t += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 6).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="700" fill="#1d1d1f" stroke="#fff" stroke-width="4" paint-order="stroke" font-family="Pretendard Variable, sans-serif">${label}</text>`;
      return t;
    };
    if (g.closed) s += line(0, '출발 / 결승', g.type === 'oval' ? -TW / 2 - 16 : TW / 2 + 20);
    else { s += line(g.sAt(0), '출발', -TW / 2 - 18); s += line(g.sAt(1), '결승', -TW / 2 - 18); }
    return s;
  }

  // 무작위 코스 (바로 전 코스는 피함)
  function pick() {
    let last = '';
    try { last = localStorage.getItem('hkr-last-track') || ''; } catch (e) { /* 무시 */ }
    const pool = LIST.filter(t => t.id !== last);
    const t = pool[Math.floor(Math.random() * pool.length)].id;
    try { localStorage.setItem('hkr-last-track', t); } catch (e) { /* 무시 */ }
    return t;
  }

  window.TRACKS = { LIST, build, pick };
})();
