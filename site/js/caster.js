/*
 * 큰 화면 레이스 중계 해설: 스포츠 캐스터처럼 순위·역전·아이템·골인을 목소리로 알려 줘요
 *  - 브라우저에 들어 있는 한국어 목소리(speechSynthesis)를 써요. 인터넷이 없어도 윈도우 기본 목소리로 나와요
 *  - 말하는 동안 배경 음악을 줄이고, 화면 아래에 자막을 띄워요(소리를 꺼도 자막은 나와요)
 *  - 순위 비공개 동안에는 순위·역전·골인을 말하지 않아요(순위가 새지 않게)
 * teacher.js가 tick마다 CASTER.update(지금 상태)를 불러 주면, 앞의 상태와 비교해 일어난 일을 골라 말해요.
 */
(function () {
  const KEY = 'hkr-caster';
  let on = true;
  try { on = localStorage.getItem(KEY) !== '0'; } catch (e) { /* 저장 공간을 못 쓰면 켬 */ }
  const synth = window.speechSynthesis || null;
  let voice = null;
  function pickVoice() {
    if (!synth) return;
    const ko = synth.getVoices().filter(v => /^ko/i.test(v.lang));
    // 남자 캐스터 목소리를 먼저, 없으면 있는 한국어 목소리
    const pref = [/InJoon/i, /Hyunsu/i, /Google/i, /SunHi/i, /Heami/i, /Yuna/i];
    voice = null;
    for (const re of pref) { voice = ko.find(v => re.test(v.name)) || null; if (voice) break; }
    if (!voice) voice = ko[0] || null;
  }
  if (synth) { pickVoice(); if (synth.addEventListener) synth.addEventListener('voiceschanged', pickVoice); }

  // 같은 말을 연달아 하지 않게: 목록마다 최근에 쓴 문장은 건너뛰어요
  const used = new Map();
  const pick = a => {
    const last = used.get(a) || [], fresh = a.filter(s => !last.includes(s)), list = fresh.length ? fresh : a;
    const s = list[Math.floor(Math.random() * list.length)];
    used.set(a, [s].concat(last).slice(0, Math.max(1, Math.floor(a.length / 2))));
    return s;
  };
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : ''));
  // 목소리로 읽을 이름: 이모지·기호는 빼요
  const spoken = s => String(s || '').replace(/[^\p{L}\p{N}\s.,!?~]/gu, '').trim() || '이름 없는';

  // ---------- 말하기·자막 ----------
  let cap = null, capText = null, capTimer = 0, guard = 0, speaking = false, queue = [], muted = () => false;
  function attach(host, opt) {
    if (opt && opt.muted) muted = opt.muted;
    if (cap && cap.isConnected) return;
    cap = document.createElement('div');
    cap.className = 'caster-cap';
    cap.setAttribute('aria-live', 'polite');
    cap.innerHTML = '<b>🎙 중계</b><span></span>';
    capText = cap.querySelector('span');
    host.appendChild(cap);
  }
  function caption(text) {
    if (!cap) return;
    clearTimeout(capTimer);
    capText.textContent = text;
    cap.classList.add('show');
  }
  function captionOff(ms) {
    clearTimeout(capTimer);
    capTimer = setTimeout(() => { if (cap) cap.classList.remove('show'); }, ms);
  }
  // prio: 1 보통(순위 소식·아이템), 2 중요(역전·2·3등 골인), 3 꼭(출발·1등 골인·역전 구간·순위 비밀·종료)
  function say(text, prio) {
    if (!on || !text) return;
    prio = prio || 1;
    const now = Date.now();
    if (speaking) {
      const item = { text, prio, at: now };
      if (prio >= 3 && current && current.prio < 3) { queue.unshift(item); stopNow(); return; } // 꼭 할 말은 끊고 바로
      // 기다리는 말은 둘까지: 중요한 것부터, 같으면 먼저 생긴 것부터
      queue.push(item);
      queue = queue.filter(q => fresh(q, now)).sort((a, b) => b.prio - a.prio || a.at - b.at).slice(0, 2);
      return;
    }
    speak({ text, prio, at: now });
  }
  let current = null;
  // 기다리는 말의 유효 시간: 보통 6초, 중요한 말은 12초, 꼭 할 말은 20초
  const fresh = (q, now) => now - q.at < (q.prio >= 3 ? 20000 : q.prio >= 2 ? 12000 : 6000);
  function speak(item) {
    current = item;
    speaking = true;
    caption(item.text);
    const len = item.text.length;
    clearTimeout(guard);
    if (!synth || muted()) { guard = setTimeout(done, 1600 + len * 85); return; } // 소리가 꺼져 있으면 자막만
    const u = new SpeechSynthesisUtterance(spoken(item.text));
    u.lang = 'ko-KR';
    if (voice) u.voice = voice;
    u.rate = 1.12;
    u.pitch = 1.05;
    u.onend = u.onerror = done;
    if (window.SOUND && SOUND.duck) SOUND.duck(true);
    try { synth.cancel(); synth.speak(u); } catch (e) { /* 목소리를 못 쓰면 자막만 */ }
    guard = setTimeout(done, 3000 + len * 170); // 끝났다는 알림이 안 와도 다음으로
  }
  function stopNow() {
    try { if (synth) synth.cancel(); } catch (e) { /* 무시 */ }
    done();
  }
  function done() {
    if (!speaking) return;
    speaking = false;
    current = null;
    clearTimeout(guard);
    if (window.SOUND && SOUND.duck) SOUND.duck(false);
    const now = Date.now();
    queue = queue.filter(q => fresh(q, now));
    const nx = queue.shift();
    if (nx) setTimeout(() => { if (!speaking) speak(nx); }, 250);
    else captionOff(1800);
  }

  // ---------- 해설 문장(캐스터 말투) ----------
  const L = {
    ready: ['자, 곧 출발합니다! 모든 선수들 출발선에 섰습니다!', '드디어 경기 시작을 앞두고 있습니다! 준비됐나요!'],
    start: ['출발했습니다! 모든 선수들 힘차게 튀어 나갑니다!', '경기 시작합니다! 자, 누가 먼저 치고 나갈까요!', '출발! 출발합니다! 첫 문제부터 승부가 시작됩니다!'],
    ranks: ['현재 순위 전해 드립니다! 1위 {a}, 2위 {b}, 3위 {c} 선수!', '지금 선두 그룹입니다! {a} 선수가 1위, 그 뒤로 {b}, {c} 선수가 바짝 따라붙습니다!', '순위 정리해 드립니다! 1위 {a}, 2위 {b}, 3위 {c}! 아직 모릅니다!'],
    ranksDone: ['지금까지 순위입니다! 1위 {a}, 2위 {b}, 3위 {c} 선수!', '{a} 선수가 1위로 들어왔고, 2위 {b}, 3위 {c} 선수입니다!'],
    ranks2: ['현재 1위 {a}, 2위 {b} 선수입니다!'],
    lead: ['역전! 역전입니다! {a} 선수가 1위로 올라섭니다!', '아, {a} 선수! 선두를 빼앗습니다!', '이게 웬일입니까! {a} 선수가 맨 앞으로 치고 나옵니다!', '말씀드리는 순간 {a} 선수가 1위! 1위로 올라섭니다!'],
    climb: ['{a} 선수, 무서운 기세입니다! 어느새 {r}위까지 올라왔습니다!', '{a} 선수 쭉쭉 치고 올라옵니다! 지금 {r}위!'],
    win: ['들어옵니다! 들어옵니다! {a} 선수, 1등으로 결승선 통과!', '결승선 통과! {a} 선수가 가장 먼저 들어옵니다! 대단합니다!'],
    place: ['{a} 선수, {r}등으로 들어옵니다!', '{a} 선수도 결승선 통과! {r}등입니다!'],
    finish: ['{a} 선수도 결승선을 통과합니다!', '{a} 선수 골인! 수고했습니다!'],
    hit: ['아! {a} 선수, {b}에 맞았습니다! 잠시 멈춰 섭니다!', '아이고! {a} 선수가 {b}에 걸렸습니다!'],
    hitBy: ['아! {a} 선수, {c} 선수의 {b}에 맞았습니다!', '{c} 선수가 {b}를 날립니다! {a} 선수, 잠시 멈춥니다!'],
    thunder: ['{c} 선수의 비격진천뢰! 앞서 가던 선수들이 줄줄이 멈춥니다!', '쾅! 비격진천뢰가 터졌습니다! {c} 선수, 승부수를 던집니다!'],
    thunderS: ['쾅! 비격진천뢰가 터졌습니다! 여러 선수가 멈춰 섭니다!'],
    block: ['{a} 선수, 방패로 막아냅니다! 노련합니다!', '막았습니다! {a} 선수 끄떡없습니다!'],
    turbo: ['{a} 선수, 천리마 부스터 점화! 쭉쭉 치고 나갑니다!', '{a} 선수 부스터! 엄청난 속도입니다!'],
    warp: ['{a} 선수 축지법! 눈 깜짝할 새 앞으로 갑니다!'],
    star: ['{a} 선수 도깨비 부적! 이제 아무도 못 막습니다!'],
    yut: ['{a} 선수 윷 던지기! {y} 나왔습니다!'],
    combo: ['{a} 선수, 연속 정답 {n}개! 불이 붙었습니다!', '{a} 선수 {n}문제 연속 정답! 오늘 컨디션 최고입니다!'],
    cool: ['잠시 쉬어 가는 시간입니다! 숨 고르고 다시 달립니다!'],
    resume: ['다시 경기 재개합니다! 자, 다시 달려 볼까요!'],
    final: ['역전 구간 돌입! 이제 정답 하나에 두 칸! 아직 끝나지 않았습니다!', '마지막 1분, 역전 구간입니다! 정답 하나에 두 칸씩! 끝까지 모릅니다!'],
    secret: ['자, 지금부터 순위는 비밀입니다! 누가 이길지 끝까지 아무도 모릅니다!'],
    secretFinal: ['역전 구간 돌입, 그리고 지금부터 순위는 비밀입니다! 정답 하나에 두 칸! 끝까지 모릅니다!'],
    hype: ['치열합니다! 한 문제 한 문제가 승부를 가릅니다!', '끝까지 집중해 주세요! 아직 시간 있습니다!', '마지막까지 알 수 없는 승부입니다!', '{a} 선수도 힘을 냅니다! 포기하지 않습니다!', '{a} 선수, 침착하게 문제를 풀어 나갑니다!'],
    ten: ['10초 남았습니다! 마지막 힘을 내세요!'],
    end: ['경기 종료! 과연 우승은 누구일까요! 시상대에서 확인합니다!'],
    endAll: ['모든 선수가 결승선을 통과했습니다! 경기 종료!']
  };
  const ITEM_NAME = { balloon: '물풍선', lightning: '신기전', caltrop: '마름쇠', thunder: '비격진천뢰', smoke: '봉화 연기' };
  const YUT = ['도가', '개가', '걸이', '윷이', '모가'];

  // ---------- 상태 비교 ----------
  let S = null; // 한 판의 기억
  function reset(key, snap) {
    S = {
      key, said: 0, rankAt: 0, itemAt: 0, leadAt: 0, climbAt: 0, finAt: 0, hypeAt: 0,
      leader: null, paused: !!snap.paused, secret: !!snap.secret, final: !!snap.final,
      ready: false, start: false, ten: false, ended: false,
      fx: {}, done: new Set(), hist: []
    };
    // 레이스 중간에 화면을 다시 열었으면 지난 일은 다시 말하지 않아요
    snap.players.forEach(p => { if (p.fx && p.fx.at) S.fx[p.uid] = p.fx.at; if (p.done) S.done.add(p.uid); });
    if (snap.now - snap.startAt > 4000) { S.start = true; S.ready = true; }
    if (snap.left <= 10000) S.ten = true;
    const top = snap.players.find(p => p.rank === 1);
    S.leader = top ? top.uid : null;
  }
  function sayAt(text, prio, now) { say(text, prio); S.said = now; }

  // snap: { key, now, startAt, left, paused, secret, final, players: [{ uid, nick, rank, pos, done, fx }] } (rank 순으로)
  function update(snap) {
    if (!snap || !snap.players) return;
    if (!S || S.key !== snap.key) reset(snap.key, snap);
    const now = snap.now, P = snap.players, byUid = {};
    P.forEach(p => { byUid[p.uid] = p; });
    const name = p => (p ? p.nick : '');
    if (!on) { syncQuiet(snap); return; }

    // 출발 전·출발
    if (now < snap.startAt) {
      if (!S.ready && snap.startAt - now < 5000) { S.ready = true; sayAt(pick(L.ready), 3, now); }
      return;
    }
    if (!S.start) { S.start = true; sayAt(pick(L.start), 3, now); }

    // 쉬는 시간
    if (snap.paused !== S.paused) {
      S.paused = snap.paused;
      sayAt(pick(snap.paused ? L.cool : L.resume), 3, now);
    }
    if (snap.paused) return;

    // 역전 구간·순위 비밀(같이 시작하면 한 번에)
    if (snap.final && !S.final && snap.secret && !S.secret) { S.final = S.secret = true; sayAt(pick(L.secretFinal), 3, now); }
    if (snap.final && !S.final) { S.final = true; sayAt(pick(L.final), 3, now); }
    if (snap.secret && !S.secret) { S.secret = true; sayAt(pick(L.secret), 3, now); }
    if (!S.ten && snap.left > 0 && snap.left <= 10000) { S.ten = true; sayAt(pick(L.ten), 3, now); }

    // 골인(비밀이 아닐 때만)
    P.forEach(p => {
      if (!p.done || S.done.has(p.uid)) return;
      S.done.add(p.uid);
      if (snap.secret) return;
      if (p.rank === 1) sayAt(fill(pick(L.win), { a: name(p) }), 3, now);
      else if (p.rank <= 3) sayAt(fill(pick(L.place), { a: name(p), r: p.rank }), 2, now);
      else if (now - S.finAt > 9000) { S.finAt = now; sayAt(fill(pick(L.finish), { a: name(p) }), 1, now); }
    });

    // 선두가 바뀜(출발하고 10초 뒤부터, 너무 잦지 않게)
    const top = P[0] && P[0].rank === 1 && (P[0].pos > 0 || P[0].done) ? P[0] : null;
    if (top && top.uid !== S.leader) {
      const prev = S.leader;
      S.leader = top.uid;
      if (!snap.secret && prev && !top.done && now - snap.startAt > 10000 && now - S.leadAt > 12000) {
        S.leadAt = now;
        sayAt(fill(pick(L.lead), { a: name(top) }), 2, now);
      }
    }

    // 아이템
    const seen = {};
    P.forEach(p => {
      const fx = p.fx;
      if (!fx || !fx.at || S.fx[p.uid] === fx.at) return;
      S.fx[p.uid] = fx.at;
      if (now - fx.at > 5000) return;
      itemLine(p, fx, snap, seen, now);
    });

    // 순위가 크게 오른 선수(10초 사이 4계단 이상, 10위 안)
    if (!S.hist.length || now - S.hist[S.hist.length - 1].at > 2000) {
      const r = {};
      P.forEach(p => { r[p.uid] = p.rank; });
      S.hist.push({ at: now, r });
      while (S.hist.length && now - S.hist[0].at > 12000) S.hist.shift();
    }
    if (!snap.secret && now - snap.startAt > 30000 && now - S.climbAt > 15000 && now - S.said > 5000 && S.hist.length > 3) {
      const old = S.hist[0].r;
      const c = P.find(p => p.rank <= 10 && p.rank > 1 && !p.done && old[p.uid] && old[p.uid] - p.rank >= 4);
      if (c) { S.climbAt = now; sayAt(fill(pick(L.climb), { a: name(c), r: c.rank }), 1, now); }
    }

    // 순위 소식(30초마다), 비밀일 때는 응원(20초마다)
    const quiet = now - S.said;
    if (!snap.secret) {
      if (now - snap.startAt > 18000 && now - S.rankAt > 30000 && quiet > 3000) {
        S.rankAt = now;
        const a = P[0], b = P[1], c = P[2];
        if (a && b && c) sayAt(fill(pick(a.done ? L.ranksDone : L.ranks), { a: name(a), b: name(b), c: name(c) }), 2, now);
        else if (a && b) sayAt(fill(pick(L.ranks2), { a: name(a), b: name(b) }), 2, now);
      }
    } else if (quiet > 20000 && now - S.hypeAt > 20000) {
      S.hypeAt = now;
      const run = P.filter(p => !p.done);
      const any = run.length ? run[Math.floor(Math.random() * run.length)] : P[0];
      sayAt(fill(pick(L.hype), { a: name(any) }), 1, now);
    }
  }
  function itemLine(p, fx, snap, seen, now) {
    const t = fx.type, a = p.nick;
    if (t === 'thunder') { // 한 번에 여러 명이 맞아요: 한 번만 말해요
      const k = 'th' + fx.at;
      if (seen[k] || now - S.itemAt < 3000) return;
      seen[k] = 1; S.itemAt = now;
      sayAt(fill(pick(snap.secret || !fx.by ? L.thunderS : L.thunder), { c: fx.by }), 2, now);
      return;
    }
    if (now - S.itemAt < 5000) return; // 아이템 소식은 5초에 하나
    let line = null;
    if (ITEM_NAME[t]) line = fill(pick(fx.by && !snap.secret ? L.hitBy : L.hit), { a, b: ITEM_NAME[t], c: fx.by });
    else if (t === 'block') line = fill(pick(L.block), { a });
    else if (t === 'turbo') line = fill(pick(L.turbo), { a });
    else if (t === 'warp') line = fill(pick(L.warp), { a });
    else if (t === 'star') line = fill(pick(L.star), { a });
    else if (t === 'yut' && fx.n >= 1 && fx.n <= 5) line = fill(pick(L.yut), { a, y: YUT[fx.n - 1] });
    else if (t === 'combo' && fx.n >= 5 && fx.n % 5 === 0) line = fill(pick(L.combo), { a, n: fx.n });
    if (!line) return;
    S.itemAt = now;
    sayAt(line, 1, now);
  }
  // 해설을 꺼 둔 동안에도 지난 일을 기억해서, 다시 켰을 때 밀린 말을 쏟아내지 않아요
  function syncQuiet(snap) {
    snap.players.forEach(p => { if (p.fx && p.fx.at) S.fx[p.uid] = p.fx.at; if (p.done) S.done.add(p.uid); });
    const top = snap.players[0];
    if (top) S.leader = top.uid;
    S.paused = !!snap.paused; S.secret = !!snap.secret; S.final = !!snap.final;
    if (snap.now >= snap.startAt) { S.ready = S.start = true; }
    if (snap.left <= 10000) S.ten = true;
  }
  function end(allDone, secret) {
    if (!S || S.ended) return;
    S.ended = true;
    say(pick(allDone && !secret ? L.endAll : L.end), 3);
  }

  window.CASTER = {
    attach, update, end, say,
    isOn: () => on,
    toggle() {
      on = !on;
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) { /* 무시 */ }
      if (!on) { queue = []; stopNow(); if (cap) cap.classList.remove('show'); }
      return on;
    },
    stop() { queue = []; stopNow(); if (cap) cap.classList.remove('show'); }
  };
})();
