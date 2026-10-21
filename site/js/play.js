/* 학생 휴대폰 화면: 입장, 닉네임과 차 고르기, 승인 기다리기, 문제 풀기, 아이템, 결과 */
(function () {
  const C = window.APP_CONFIG, G = window.GAME, A = window.ART;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const CIRCLED = '①②③④';

  let room = null, uid = null, meta = null, questions = [], players = {}, states = {}, myP = null;
  let metaLoaded = false, playersLoaded = false, statesLoaded = false;
  let me = null, phase = 'idle', cur = null, order = [], lastIdx = -1, phaseUntil = 0;
  let loop = null, hitsOff = null, carChoice = null, noChoice = null, lastWrongAnswer = '', joinBuilt = false;
  const handled = new Set();

  // ---------- 도구 ----------
  function show(id) { $$('.screen').forEach(s => s.classList.toggle('hidden', '#' + s.id !== id)); }
  function toast(msg, ms) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), ms || 2200);
  }
  function msg(title, text) {
    $('#msgTitle').textContent = title;
    $('#msgText').textContent = text;
    show('#sMsg');
  }
  function josa(word, withBatchim, without) {
    const c = word.charCodeAt(word.length - 1);
    if (c < 0xAC00 || c > 0xD7A3) return word + without;
    return word + ((c - 0xAC00) % 28 ? withBatchim : without);
  }
  function fmt(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function rememberLast(code) { try { localStorage.setItem('hkr-last-room', JSON.stringify({ code, at: Date.now() })); } catch (e) { /* 무시 */ } }
  function forgetLast() { try { localStorage.removeItem('hkr-last-room'); } catch (e) { /* 무시 */ } }
  function readLast() {
    try {
      const v = JSON.parse(localStorage.getItem('hkr-last-room'));
      if (v && Date.now() - v.at < 3 * 3600 * 1000) return v.code;
    } catch (e) { /* 무시 */ }
    return null;
  }
  function approved() {
    return Object.entries(players)
      .filter(([, p]) => p && p.status === 'approved')
      .map(([id, p]) => ({ uid: id, nick: p.nick, car: p.car || 0 }));
  }
  function myRank() {
    const list = approved();
    const ranked = G.ranking(list, Object.assign({}, states, me ? { [uid]: me } : {}));
    const r = ranked.find(x => x.uid === uid);
    return { rank: r ? r.rank : list.length, n: list.length, ranked };
  }
  function blockedUntil() { return me ? Math.max(me.frozenUntil || 0, me.blindUntil || 0) : 0; }
  function save() {
    if (!me || !room) return;
    DB.set(`rooms/${room}/state/${uid}`, JSON.parse(JSON.stringify(me))).catch(e => console.warn(e));
  }

  // ---------- 입장 ----------
  async function init() {
    DB.onConnection(ok => $('#offline').classList.toggle('hidden', ok));
    const params = new URLSearchParams(location.search);
    const fromUrl = (params.get('room') || '').trim();
    const code = fromUrl || readLast();
    if (!code) { show('#sCode'); $('#codeInput').focus(); return; }
    enterRoom(code, !fromUrl);
  }

  $('#codeForm').addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#codeInput').value.replace(/\D/g, '');
    if (code.length !== 4) { $('#codeErr').textContent = '숫자 4자리를 넣어 주세요.'; return; }
    $('#codeErr').textContent = '';
    enterRoom(code, false);
  });

  async function enterRoom(code, quiet) {
    try {
      const u0 = await DB.authReady();
      if (DB.mode === 'firebase' && u0 && !u0.isAnonymous) {
        msg('선생님 계정이 로그인된 브라우저예요', '학생 화면은 학생 휴대폰이나 다른 브라우저(시크릿 창)에서 열어 주세요.');
        return;
      }
      const user = await DB.signInStudent();
      uid = user.uid;
      const m = await DB.get(`rooms/${code}/meta`);
      if (!m) {
        forgetLast();
        show('#sCode');
        if (!quiet) $('#codeErr').textContent = '이 코드로 열린 게임이 없어요. 큰 화면의 숫자 4자리를 다시 확인해 주세요.';
        return;
      }
      room = code;
      rememberLast(code);
      if (history.replaceState) history.replaceState(null, '', 'play.html?room=' + code);
      questions = (await DB.get(`rooms/${code}/questions`)) || [];
      DB.on(`rooms/${code}/meta`, v => { meta = v; metaLoaded = true; route(); });
      DB.on(`rooms/${code}/players`, v => { players = v || {}; myP = players[uid] || null; playersLoaded = true; route(); });
      DB.on(`rooms/${code}/state`, v => { states = v || {}; statesLoaded = true; route(); });
      if (!loop) loop = setInterval(tick, 100);
    } catch (e) {
      console.warn(e);
      const code = e && e.code || '';
      msg('들어가지 못했어요', /admin-restricted|operation-not-allowed/.test(code)
        ? '선생님께 알려 주세요: Firebase에서 익명 로그인이 꺼져 있어요.'
        : '인터넷 연결을 확인하고 다시 해 주세요.');
    }
  }

  function route() {
    if (!room || !metaLoaded || !playersLoaded) return;
    if (!meta) {
      stopAll();
      forgetLast();
      msg('게임이 닫혔어요', '선생님이 게임을 닫았어요. 다음 게임에서 만나요!');
      return;
    }
    if (phase === 'over') return;
    if (!myP) { showJoin(); return; }
    if (myP.status === 'rejected') { showJoin('선생님이 닉네임을 바꿔 달라고 했어요. 다른 닉네임으로 다시 입장해 주세요.'); return; }
    if (myP.status === 'pending') { showWait('pending'); return; }
    if (meta.status === 'lobby') { showWait('ready'); return; }
    if (meta.status === 'racing') {
      if (!statesLoaded) return;
      if (DB.now() < meta.startAt) { showWait('count'); return; }
      if (phase === 'idle') startRace();
      return;
    }
    if (meta.status === 'finished') endRace();
  }

  // 이 판에서 다른 친구가 이미 고른 출석번호
  function takenNumbers() {
    const s = new Set();
    Object.entries(players).forEach(([id, p]) => {
      if (id !== uid && p && p.no && (p.status === 'pending' || p.status === 'approved')) s.add(p.no);
    });
    return s;
  }
  function markTakenNumbers() {
    const taken = takenNumbers();
    $$('#noPick .no-opt').forEach(b => {
      const t = taken.has(+b.dataset.no);
      b.disabled = t;
      if (t && noChoice === +b.dataset.no) { noChoice = null; b.setAttribute('aria-checked', 'false'); }
    });
  }

  function showJoin(note) {
    if (!joinBuilt) {
      joinBuilt = true;
      $('#carPick').innerHTML = A.CARS.map((c, i) => `
        <button type="button" class="car-opt" role="radio" aria-checked="false" data-car="${i}" aria-label="${c.name} 차">${A.carSVG(i)}<span>${c.name}</span></button>`).join('');
      $$('#carPick .car-opt').forEach(b => b.addEventListener('click', () => {
        carChoice = +b.dataset.car;
        $$('#carPick .car-opt').forEach(x => x.setAttribute('aria-checked', String(x === b)));
      }));
      const max = C.studentsPerClass || 24;
      $('#noPick').innerHTML = Array.from({ length: max }, (_, i) => `<button type="button" class="no-opt" role="radio" aria-checked="false" data-no="${i + 1}">${i + 1}</button>`).join('');
      $$('#noPick .no-opt').forEach(b => b.addEventListener('click', () => {
        if (b.disabled) return;
        noChoice = +b.dataset.no;
        $$('#noPick .no-opt').forEach(x => x.setAttribute('aria-checked', String(x === b)));
      }));
    }
    markTakenNumbers();
    const noteEl = $('#joinNote');
    noteEl.textContent = note || '';
    noteEl.classList.toggle('hidden', !note);
    if ($('#sJoin').classList.contains('hidden')) {
      if (note && myP) $('#nickInput').value = '';
      show('#sJoin');
    }
  }

  $('#joinForm').addEventListener('submit', async e => {
    e.preventDefault();
    const nick = $('#nickInput').value.trim();
    const err = $('#joinErr');
    if (!nick) { err.textContent = '닉네임을 적어 주세요.'; return; }
    if (Array.from(nick).length > C.maxNick) { err.textContent = `닉네임은 ${C.maxNick}글자까지 쓸 수 있어요.`; return; }
    if (noChoice == null) { err.textContent = '내 출석번호를 골라 주세요.'; return; }
    if (takenNumbers().has(noChoice)) { err.textContent = `${noChoice}번은 이미 다른 친구가 골랐어요. 번호를 확인해 주세요.`; return; }
    if (carChoice == null) { err.textContent = '차를 하나 골라 주세요.'; return; }
    err.textContent = '';
    try {
      await DB.set(`rooms/${room}/players/${uid}`, { nick, no: noChoice, car: carChoice, status: 'pending', joinedAt: DB.now() });
    } catch (ex) {
      console.warn(ex);
      err.textContent = '입장하지 못했어요. 다시 눌러 주세요.';
    }
  });

  function showWait(kind) {
    $('#waitCar').innerHTML = A.carSVG(myP.car || 0);
    $('#waitNick').textContent = myP.nick;
    const t = {
      pending: ['선생님 승인을 기다리고 있어요', '큰 화면에 내 차가 나타나면 승인된 거예요.'],
      ready: ['승인됐어요!', '큰 화면을 보며 출발 신호를 기다려요.'],
      count: ['곧 출발해요!', '정답을 맞히면 앞으로 가고, 아이템을 받아요.']
    }[kind];
    $('#waitTitle').textContent = t[0];
    $('#waitText').textContent = t[1];
    $('#waitCount').classList.toggle('hidden', kind !== 'count');
    show('#sWait');
  }

  // ---------- 레이스 ----------
  function startRace() {
    const saved = states[uid] || {};
    me = Object.assign({ pos: 0, correct: 0, wrong: 0, timeouts: 0, shield: false, hold: null, finishedAt: null, movedAt: null, frozenUntil: 0, blindUntil: 0 }, saved);
    const q = {};
    if (saved.q) Object.keys(saved.q).forEach(k => { if (saved.q[k]) q[k] = saved.q[k]; });
    me.q = q;
    if (!questions.length) { msg('문제가 없어요', '선생님께 문제 세트를 확인해 달라고 말해 주세요.'); return; }
    show('#sRace');
    listenHits();
    renderItem();
    if (!states[uid]) save();
    if (me.finishedAt) { finished(); return; }
    const open = me.openQ;
    nextQuestion(open != null && questions[open] ? open : null);
  }

  // 가장 적게 나온 문제부터 냅니다. 나온 횟수(s)를 내 기록에 저장하므로
  // 휴대폰이 다시 연결되거나 새로고침되어도 5문제가 골고루 나옵니다.
  function pickQuestion() {
    const n = questions.length;
    const seen = k => (me.q[k] && me.q[k].s) || 0;
    const last = me.lastQ == null ? -1 : me.lastQ;
    let min = Infinity;
    for (let k = 0; k < n; k++) min = Math.min(min, seen(k));
    let cand = [];
    for (let k = 0; k < n; k++) if (seen(k) === min && (n === 1 || k !== last)) cand.push(k);
    if (!cand.length) for (let k = 0; k < n; k++) if (k !== last) cand.push(k);
    return cand[Math.floor(Math.random() * cand.length)];
  }

  function nextQuestion(resume) {
    // 다시 연결된 경우, 화면에 떠 있던(아직 답하지 않은) 문제를 그대로 이어서 냅니다
    const i = resume != null ? resume : pickQuestion();
    lastIdx = i;
    if (resume == null) { const st = stat(i); st.s = (st.s || 0) + 1; }
    me.lastQ = i;
    me.openQ = i;
    save();
    const q = questions[i];
    const limit = G.timeLimit(q);
    const start = Math.max(DB.now(), blockedUntil());
    cur = { i, q, limit, deadline: start + limit, order: q.type === 'mc' ? G.shuffle([0, 1, 2, 3]) : null };
    phase = 'question';
    renderQuestion();
  }

  function renderQuestion() {
    const q = cur.q;
    $('#qType').textContent = q.type === 'ox' ? 'O/X 문제' : '4지선다 문제';
    $('#qText').textContent = q.q;
    const box = $('#answers');
    box.className = 'answers ' + (q.type === 'ox' ? 'is-ox' : 'is-mc');
    if (q.type === 'ox') {
      box.innerHTML = '<button class="ans ox-o" data-v="O" aria-label="O, 맞다">O</button><button class="ans ox-x" data-v="X" aria-label="X, 틀리다">X</button>';
    } else {
      box.innerHTML = cur.order.map((k, pos) => `<button class="ans mc mc${pos}" data-v="${k}"><b>${pos + 1}</b><span>${escapeHtml(q.choices[k])}</span></button>`).join('');
    }
    box.querySelectorAll('.ans').forEach(b => b.addEventListener('click', () => answer(b.dataset.v, b)));
    updateStatus(true);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function stat(i) { return me.q[i] || (me.q[i] = { c: 0, w: 0, t: 0 }); }

  function move(n, now) {
    if (me.finishedAt) return;
    me.pos = Math.min(C.finishCells, (me.pos || 0) + n);
    me.movedAt = now;
    if (me.pos >= C.finishCells) { me.finishedAt = now; me.fx = { type: 'finish', at: now }; }
  }

  function applyItem(item, now) {
    const it = C.items[item];
    me.fx = { type: item, at: now };
    if (item === 'boost1') { move(1, now); return `${it.icon} ${it.name}! 1칸 더 가요`; }
    if (item === 'boost2') { move(2, now); return `${it.icon} ${it.name}! 2칸 더 가요`; }
    if (item === 'shield') { me.shield = true; return `${it.icon} ${josa(it.name, '을', '를')} 얻었어요`; }
    me.hold = item;
    return `${it.icon} ${josa(it.name, '을', '를')} 얻었어요. 아래 버튼을 눌러요!`;
  }

  function answer(v, btn) {
    if (phase !== 'question' || !cur) return;
    const now = DB.now();
    if (now < blockedUntil()) return;
    const q = cur.q;
    const ok = q.type === 'ox' ? v === q.answer : Number(v) === q.answer;
    const st = stat(cur.i);
    if (ok) {
      st.c++;
      me.openQ = null;
      me.correct++;
      const r = myRank();
      move(1, now);
      let sub = '앞으로 1칸';
      if (!me.finishedAt) sub = applyItem(G.rollGoodItem(r.rank, r.n, { holdingAttack: !!me.hold, hasShield: !!me.shield }), now);
      save();
      btn.classList.add('right');
      flash('good', '정답!', sub);
      renderItem();
      phase = 'feedback';
      phaseUntil = now + 900;
    } else {
      st.w++;
      me.openQ = null;
      me.wrong++;
      const bad = G.rollBadItem();
      const until = now + C.penaltySeconds * 1000;
      if (bad === 'fuel') me.frozenUntil = Math.max(me.frozenUntil || 0, until);
      else me.blindUntil = Math.max(me.blindUntil || 0, until);
      me.fx = { type: bad, at: now };
      lastWrongAnswer = q.type === 'ox' ? q.answer : CIRCLED[cur.order.indexOf(q.answer)] + ' ' + q.choices[q.answer];
      save();
      btn.classList.add('wrong');
      phase = 'penalty';
      phaseUntil = until;
    }
    updateStatus(true);
  }

  function timeout(now) {
    stat(cur.i).t++;
    me.openQ = null;
    me.timeouts++;
    save();
    flash('time', '시간이 지났어요', '다음 문제로 넘어가요');
    phase = 'feedback';
    phaseUntil = now + 700;
  }

  function listenHits() {
    if (hitsOff) return;
    hitsOff = DB.on(`rooms/${room}/hits/${uid}`, hits => {
      if (!hits || !me) return;
      Object.keys(hits).forEach(k => {
        if (handled.has(k)) return;
        handled.add(k);
        const h = hits[k] || {};
        DB.remove(`rooms/${room}/hits/${uid}/${k}`);
        if (me.finishedAt || phase === 'over') return;
        const now = DB.now();
        const it = C.items[h.type] || C.items.balloon;
        if (me.shield) {
          me.shield = false;
          me.fx = { type: 'block', at: now };
          flash('good', `${C.items.shield.icon} 방패로 막았어요!`, `${h.nick || '친구'}의 ${it.name}`);
        } else {
          const before = Math.max(now, blockedUntil());
          me.frozenUntil = Math.max(me.frozenUntil || 0, now) + C.hitSeconds * 1000;
          const added = Math.max(0, blockedUntil() - before);
          if (phase === 'question' && cur) cur.deadline += added;
          me.fx = { type: h.type === 'lightning' ? 'lightning' : 'balloon', at: now, by: h.nick || '친구' };
        }
        save();
        renderItem();
      });
    });
  }

  $('#itemBtn').addEventListener('click', async () => {
    if (!me || !me.hold || phase === 'over' || phase === 'done' || phase === 'idle') return;
    const r = myRank();
    const target = G.attackTarget(me.hold, uid, r.ranked);
    if (!target) { toast('지금은 맞힐 친구가 없어요. 조금 뒤에 다시 눌러 보세요.'); return; }
    const type = me.hold, it = C.items[type];
    me.hold = null;
    me.fx = { type: 'throw', at: DB.now(), item: type };
    save();
    renderItem();
    try {
      await DB.push(`rooms/${room}/hits/${target.uid}`, { type, from: uid, nick: myP.nick, at: DB.now() });
      flash('good', `${it.icon} ${it.name} 발사!`, `${target.nick}에게 날아갔어요`);
    } catch (e) { console.warn(e); }
  });

  function renderItem() {
    const btn = $('#itemBtn');
    if (me && me.hold) {
      const it = C.items[me.hold];
      btn.innerHTML = `<span class="ib-icon">${it.icon}</span><span><b>${it.name} 쓰기</b><small>${it.desc}</small></span>`;
      btn.dataset.item = me.hold;
      btn.classList.remove('hidden');
    } else btn.classList.add('hidden');
    $('#shieldMark').classList.toggle('hidden', !(me && me.shield));
    $('#shieldMark').textContent = `${C.items.shield.icon} ${C.items.shield.name} 있음`;
  }

  let lastStatus = '';
  function updateStatus(force) {
    if (!me) return;
    const r = myRank();
    const e = G.era(meta && meta.era);
    const s = `${me.pos}|${r.rank}|${r.n}|${G.sceneIndex(me.pos)}`;
    if (!force && s === lastStatus) return;
    lastStatus = s;
    // 왼쪽 위: 참여 인원 중 지금 몇 등인지
    $('#stPos').textContent = `${r.rank}등 / ${r.n}명`;
    $('#stScene').textContent = `지금 지나는 곳: ${e.scenes[G.sceneIndex(me.pos)]} (${me.pos}/${C.finishCells}칸)`;
  }

  let flashTimer = null;
  function flash(kind, title, sub) {
    const el = $('#flash');
    el.className = 'flash ' + kind;
    el.innerHTML = `<b>${escapeHtml(title)}</b>${sub ? `<span>${escapeHtml(sub)}</span>` : ''}`;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => el.classList.add('hidden'), 1500);
  }

  function showOverlay(now, until) {
    const ov = $('#overlay');
    const fx = me.fx || {};
    let kind, icon, title, sub;
    if ((fx.type === 'balloon' || fx.type === 'lightning') && now < (me.frozenUntil || 0)) {
      const it = C.items[fx.type];
      kind = 'hit'; icon = it.icon;
      title = `${fx.by || '친구'}의 ${it.name}에 ${fx.type === 'balloon' ? '갇혔어요' : '맞았어요'}!`;
      sub = '조금만 기다리면 풀려요';
    } else if (now < (me.blindUntil || 0)) {
      kind = 'ink'; icon = C.items.ink.icon; title = `${C.items.ink.name}! 앞이 안 보여요`; sub = '정답은 ' + lastWrongAnswer;
    } else {
      kind = 'fuel'; icon = C.items.fuel.icon; title = `${C.items.fuel.name}! 엔진이 멈췄어요`; sub = '정답은 ' + lastWrongAnswer;
    }
    ov.className = 'overlay ' + kind;
    $('#ovIcon').textContent = icon;
    $('#ovTitle').textContent = title;
    $('#ovSub').textContent = sub;
    $('#ovCount').textContent = Math.ceil((until - now) / 1000);
  }
  function hideOverlay() { $('#overlay').classList.add('hidden'); }

  function finished() {
    phase = 'done';
    cur = null;
    hideOverlay();
    const r = myRank();
    $('#doneCar').innerHTML = A.carSVG(myP.car || 0);
    $('#doneTitle').textContent = '완주했어요! 🏁';
    $('#doneRank').textContent = `${r.rank}위로 들어왔어요`;
    $('#doneStat').textContent = `정답 ${me.correct}개, 오답 ${me.wrong}개`;
    show('#sDone');
  }

  function endRace() {
    if (phase === 'over') return;
    phase = 'over';
    hideOverlay();
    const r = me ? myRank() : null;
    $('#doneCar').innerHTML = A.carSVG((myP && myP.car) || 0);
    $('#doneTitle').textContent = '레이스 끝!';
    $('#doneRank').textContent = r && myP && myP.status === 'approved' ? `${r.rank}위` : '';
    $('#doneStat').textContent = me ? `정답 ${me.correct}개, 오답 ${me.wrong}개` : '이번 레이스는 끝났어요.';
    show('#sDone');
  }

  function stopAll() {
    clearInterval(loop);
    loop = null;
    if (hitsOff) { hitsOff(); hitsOff = null; }
    phase = 'over';
  }

  function tick() {
    if (!meta || !myP) return;
    const now = DB.now();
    if (meta.status === 'racing' && now < meta.startAt) {
      if (myP.status === 'approved') {
        if ($('#sWait').classList.contains('hidden') || $('#waitCount').classList.contains('hidden')) showWait('count');
        $('#waitCount').textContent = Math.ceil((meta.startAt - now) / 1000);
      }
      return;
    }
    if (meta.status === 'racing' && phase === 'idle' && myP.status === 'approved' && statesLoaded) startRace();
    if (phase === 'idle' || phase === 'over') return;
    if (meta.status === 'finished' || (meta.endAt && now >= meta.endAt)) { endRace(); return; }
    $('#stTime').textContent = fmt(meta.endAt - now);
    if (phase === 'done') return;

    const block = blockedUntil();
    if (now < block) showOverlay(now, block); else hideOverlay();

    if (phase === 'feedback' || phase === 'penalty') {
      if (now >= phaseUntil && now >= block) {
        if (me.finishedAt) finished(); else nextQuestion();
      }
      return;
    }
    if (phase === 'question' && cur) {
      const left = cur.deadline - now;
      const bar = $('#qBar');
      bar.style.width = Math.max(0, Math.min(1, left / cur.limit)) * 100 + '%';
      bar.classList.toggle('hurry', left < 5000);
      if (now >= block && left <= 0) timeout(now);
    }
    updateStatus();
  }

  init();
})();
