/* 학생 휴대폰 화면: 입장, 닉네임과 차 고르기, 승인 기다리기, 문제 풀기, 아이템, 결과 */
(function () {
  const C = window.APP_CONFIG, G = window.GAME, A = window.ART;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const HIT_TYPES = ['balloon', 'lightning', 'caltrop', 'thunder']; // 친구가 던져서 맞는 아이템

  let room = null, uid = null, meta = null, questions = [], players = {}, states = {}, myP = null;
  let metaLoaded = false, playersLoaded = false, statesLoaded = false;
  let me = null, phase = 'idle', cur = null, order = [], lastIdx = -1, phaseUntil = 0;
  let loop = null, hitsOff = null, carChoice = null, noChoice = null, joinBuilt = false;
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
    if (myP && myP.status === 'kicked') {
      stopAll();
      forgetLast();
      msg('이번 게임에서 나가게 되었어요', '선생님이 이 게임에서 내보냈어요. 궁금한 점은 선생님께 말씀드려 주세요.');
      return;
    }
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
      // 닉네임 글자 수는 config.js의 maxNick 하나로 맞춰요
      $('#nickInput').maxLength = C.maxNick;
      $('#nickLabel').textContent = `닉네임 (${C.maxNick}글자까지)`;
      // 탈것이 많아서 종류별 탭을 눌러 한 종류씩 봐요
      const groups = A.GROUPS.filter(g => A.CARS.some(c => c.group === g));
      $('#carPick').innerHTML = `<div class="car-tabs" role="tablist">${groups.map((g, k) => `<button type="button" class="car-tab" role="tab" data-g="${k}" aria-selected="${k === 0}">${g}</button>`).join('')}</div>` +
        A.CARS.map((c, i) => `<button type="button" class="car-opt" role="radio" aria-checked="false" data-car="${i}" data-g="${groups.indexOf(c.group)}" aria-label="${c.name}"${groups.indexOf(c.group) ? ' hidden' : ''}>${A.carSVG(i)}<span>${c.name}</span></button>`).join('');
      $$('#carPick .car-tab').forEach(t => t.addEventListener('click', () => {
        $$('#carPick .car-tab').forEach(x => x.setAttribute('aria-selected', String(x === t)));
        $$('#carPick .car-opt').forEach(o => { o.hidden = o.dataset.g !== t.dataset.g; });
        t.scrollIntoView({ inline: 'nearest', block: 'nearest' });
      }));
      $$('#carPick .car-opt').forEach(b => b.addEventListener('click', () => {
        carChoice = +b.dataset.car;
        $$('#carPick .car-opt').forEach(x => x.setAttribute('aria-checked', String(x === b)));
      }));
      const max = C.studentsPerClass || 30;
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

  // 닉네임 금칙어: 입력하는 동안 바로 알려 주고 입장 버튼을 막습니다
  const BANNED_MSG = '사용할 수 없는 말이 들어 있어요. 친구가 기분 나쁘지 않은 닉네임으로 바꿔 주세요.';
  $('#nickInput').addEventListener('input', () => {
    const bad = G.bannedWordIn($('#nickInput').value);
    $('#joinErr').textContent = bad ? BANNED_MSG : '';
    $('#nickInput').classList.toggle('bad', !!bad);
    $('#joinForm button[type=submit]').disabled = !!bad;
  });

  $('#joinForm').addEventListener('submit', async e => {
    e.preventDefault();
    const nick = $('#nickInput').value.trim();
    const err = $('#joinErr');
    if (!nick) { err.textContent = '닉네임을 적어 주세요.'; return; }
    if (Array.from(nick).length > C.maxNick) { err.textContent = `닉네임은 ${C.maxNick}글자까지 쓸 수 있어요.`; return; }
    if (G.bannedWordIn(nick)) { err.textContent = BANNED_MSG; $('#nickInput').focus(); return; }
    if (noChoice == null) { err.textContent = '내 출석번호를 골라 주세요.'; return; }
    if (takenNumbers().has(noChoice)) { err.textContent = `${noChoice}번은 이미 다른 친구가 골랐어요. 번호를 확인해 주세요.`; return; }
    if (carChoice == null) { err.textContent = '탈것을 하나 골라 주세요.'; return; }
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
  // 아직 덜 맞힌 문제부터 냅니다(맞힌 횟수가 적은 것 → 그중 나온 횟수가 적은 것).
  // 그래서 모든 문제를 한 번씩 맞혀야 같은 문제가 다시 나오고, 시간이 지나 넘어간 문제도 나중에 다시 나와요.
  function pickQuestion() {
    const n = questions.length;
    const score = k => { const s = me.q[k] || {}; return (s.c || 0) * 1000 + (s.s || 0); };
    const last = me.lastQ == null ? -1 : me.lastQ;
    const ks = [...Array(n).keys()].filter(k => n === 1 || k !== last);
    const min = Math.min(...ks.map(score));
    const cand = ks.filter(k => score(k) === min);
    return cand[Math.floor(Math.random() * cand.length)];
  }

  function nextQuestion(resume) {
    // 다시 연결된 경우, 화면에 떠 있던(아직 답하지 않은) 문제를 그대로 이어서 냅니다
    const i = resume != null ? resume : pickQuestion();
    lastIdx = i;
    // 새 문제면 틀린 기록(지운 선지, 틀린 횟수)을 비워요. 다시 연결돼서 이어 풀 때는 그대로 둬요.
    if (resume == null) { const st = stat(i); st.s = (st.s || 0) + 1; me.tried = []; me.miss = 0; }
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
    const tried = me.tried || [], miss = me.miss || 0;
    $('#qType').textContent = (q.type === 'ox' ? 'O/X 문제' : q.type === 'sa' ? '단답형 문제 · 직접 써요' : '4지선다 문제') + (miss ? ' · 다시 도전!' : '');
    $('#qText').textContent = q.q;
    // 그림: O/X·단답형은 문제 카드 오른쪽, 4지선다는 선지마다
    const qPic = q.type === 'mc' ? '' : window.PICS.forQuestion(q);
    $('#qPic').innerHTML = qPic;
    $('#qCard').classList.toggle('has-pic', !!qPic);
    const choicePics = q.type === 'mc' ? window.PICS.forChoices(q.choices) : [];
    const box = $('#answers');
    box.className = 'answers ' + (q.type === 'ox' ? 'is-ox' : q.type === 'sa' ? 'is-sa' : 'is-mc');
    if (q.type === 'sa') {
      const len = String(q.answer).replace(/\s/g, '').length;
      box.innerHTML = `<form class="sa-form" autocomplete="off">
        ${miss >= 2 ? `<p class="sa-hint reveal">정답은 <b>${escapeHtml(q.answer)}</b> <span>그대로 써 봐요</span></p>`
          : C.saHint !== false ? `<p class="sa-hint">힌트 <b>${escapeHtml(G.choHint(q.answer))}</b> <span>${len}글자</span></p>` : ''}
        <input class="sa-input" type="text" maxlength="30" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="정답을 써요" aria-label="정답 입력">
        <button class="ans sa-submit" type="submit">제출</button>
      </form>`;
      const input = box.querySelector('.sa-input');
      box.querySelector('.sa-form').addEventListener('submit', e => {
        e.preventDefault();
        if (!input.value.trim()) { input.focus(); return; }
        answer(input.value, input);
      });
      setTimeout(() => input.focus(), 50);
      updateStatus(true);
      return;
    }
    if (q.type === 'ox') {
      const off = v => (tried.includes(v) ? ' tried" disabled aria-disabled="true' : '');
      box.innerHTML = `<button class="ans ox-o${off('O')}" data-v="O" aria-label="O, 맞다">O</button><button class="ans ox-x${off('X')}" data-v="X" aria-label="X, 틀리다">X</button>`;
    } else {
      // 틀린 선지는 흐리게 지워 두고 남은 것 중에서 다시 골라요
      box.innerHTML = cur.order.map((k, pos) => `<button class="ans mc mc${pos}${tried.includes(k) ? ' tried" disabled aria-disabled="true' : ''}" data-v="${k}"><b>${pos + 1}</b><span>${escapeHtml(q.choices[k])}</span><i class="ch-pic" aria-hidden="true">${choicePics[k]}</i></button>`).join('');
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
    const ok = q.type === 'ox' ? v === q.answer : q.type === 'sa' ? G.checkShort(q, v) : Number(v) === q.answer;
    if (q.type === 'sa') btn.readOnly = true;
    const st = stat(cur.i);
    if (ok) {
      st.c++;
      me.openQ = null;
      me.correct++;
      const r = myRank();
      move(1, now);
      let sub = '앞으로 1칸';
      if (!me.finishedAt) sub = applyItem(G.rollGoodItem(r.rank, r.n, { holding: !!me.hold, hasShield: !!me.shield }), now);
      save();
      btn.classList.add('right');
      flash('good', '정답!', sub);
      renderItem();
      phase = 'feedback';
      phaseUntil = now + 900;
    } else {
      // 틀리면 다음 문제로 넘어가지 않고, 맞힐 때까지 같은 문제를 다시 풀어요(정답은 알려 주지 않아요)
      st.w++;
      me.wrong++;
      me.miss = (me.miss || 0) + 1;
      if (q.type !== 'sa') me.tried = (me.tried || []).concat(q.type === 'mc' ? Number(v) : v);
      me.openQ = cur.i;
      cur.retry = true;
      if (now < (me.guardUntil || 0)) {
        // 도깨비 부적: 벌칙 없이 바로 다시 풀어요
        save();
        btn.classList.add('wrong');
        flash('good', `${C.items.star.icon} 부적이 벌칙을 막았어요`, '다시 풀어 봐요');
        phase = 'penalty';
        phaseUntil = now + 1200;
        cur.deadline += 1200;
        updateStatus(true);
        return;
      }
      const bad = G.rollBadItem();
      const until = now + C.penaltySeconds * 1000;
      cur.deadline += C.penaltySeconds * 1000; // 벌칙 시간은 문제 푸는 시간에서 빼지 않아요
      if (bad === 'fuel') me.frozenUntil = Math.max(me.frozenUntil || 0, until);
      else me.blindUntil = Math.max(me.blindUntil || 0, until);
      me.fx = { type: bad, at: now };
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
    flash('time', '시간이 지났어요', '이 문제는 나중에 다시 나와요');
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
        const type = HIT_TYPES.includes(h.type) ? h.type : 'balloon';
        const it = C.items[type] || C.items.balloon;
        if (now < (me.guardUntil || 0)) {
          me.fx = { type: 'block', at: now };
          flash('good', `${C.items.star.icon} 부적 덕분에 끄떡없어요!`, `${h.nick || '친구'}의 ${it.name}`);
        } else if (me.shield) {
          me.shield = false;
          me.fx = { type: 'block', at: now };
          flash('good', `${C.items.shield.icon} 방패로 막았어요!`, `${h.nick || '친구'}의 ${it.name}`);
        } else {
          const before = Math.max(now, blockedUntil());
          me.frozenUntil = Math.max(me.frozenUntil || 0, now) + (type === 'thunder' ? 2 : C.hitSeconds) * 1000;
          const added = Math.max(0, blockedUntil() - before);
          if (phase === 'question' && cur) cur.deadline += added;
          me.fx = { type, at: now, by: h.nick || '친구' };
        }
        save();
        renderItem();
      });
    });
  }

  $('#itemBtn').addEventListener('click', async () => {
    if (!me || !me.hold || phase === 'over' || phase === 'done' || phase === 'idle') return;
    const type = me.hold, it = C.items[type], now = DB.now();
    if (type === 'turbo') {
      // 천리마 부스터: 3초 동안 1초마다 1칸씩, 모두 3칸 저절로 달려요
      me.hold = null;
      me.turboLeft = 3;
      me.turboNext = now + 250;
      me.turboUntil = now + 3250;
      me.fx = { type: 'turbo', at: now };
      save();
      renderItem();
      flash('good', `${it.icon} ${it.name}!`, '3초 동안 3칸 질주해요');
      return;
    }
    if (type === 'star') {
      me.hold = null;
      me.guardUntil = now + 8000;
      me.fx = { type: 'star', at: now };
      save();
      renderItem();
      flash('good', `${it.icon} ${it.name}!`, '8초 동안 무적이에요');
      return;
    }
    const r = myRank();
    const found = G.attackTarget(type, uid, r.ranked);
    const targets = Array.isArray(found) ? found : found ? [found] : [];
    if (!targets.length) { toast(type === 'caltrop' ? '지금은 뒤에 친구가 없어요. 조금 뒤에 다시 눌러 보세요.' : '지금은 맞힐 친구가 없어요. 조금 뒤에 다시 눌러 보세요.'); return; }
    me.hold = null;
    me.fx = { type: 'throw', at: now, item: type };
    save();
    renderItem();
    try {
      await Promise.all(targets.map(t => DB.push(`rooms/${room}/hits/${t.uid}`, { type, from: uid, nick: myP.nick, at: DB.now() })));
      flash('good', `${it.icon} ${it.name} 발사!`, targets.length > 1 ? `앞선 친구 ${targets.length}명에게 쾅!` : `${targets[0].nick}에게 날아갔어요`);
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
    renderMarks();
  }
  // 지금 걸려 있는 내 효과: 부적(무적), 부스터 질주, 방패
  let lastMarks = '';
  function renderMarks() {
    const now = DB.now(), marks = [];
    if (me && now < (me.guardUntil || 0)) marks.push(`${C.items.star.icon} 무적 ${Math.ceil((me.guardUntil - now) / 1000)}초`);
    if (me && me.turboLeft > 0) marks.push(`${C.items.turbo.icon} 질주 중 (${me.turboLeft}칸 남음)`);
    if (me && me.shield) marks.push(`${C.items.shield.icon} ${C.items.shield.name} 있음`);
    const text = marks.join(' · ');
    if (text === lastMarks) return;
    lastMarks = text;
    $('#shieldMark').classList.toggle('hidden', !text);
    $('#shieldMark').textContent = text;
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
    // 배경: 지금 지나는 곳의 단원 장면을 화면 가득(문제 카드는 그 위에)
    const key = e.id + G.sceneIndex(me.pos);
    const bg = $('#stuBg');
    if (bg.dataset.key !== key) {
      bg.dataset.key = key;
      bg.innerHTML = A.sceneSVG(e.id, G.sceneIndex(me.pos));
      bg.classList.remove('in');
      void bg.offsetWidth;
      bg.classList.add('in');
    }
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
    if (HIT_TYPES.includes(fx.type) && now < (me.frozenUntil || 0)) {
      const it = C.items[fx.type];
      kind = 'hit'; icon = it.icon;
      title = `${fx.by || '친구'}의 ${it.name}에 ${fx.type === 'balloon' ? '갇혔어요' : fx.type === 'caltrop' ? '바퀴가 찔렸어요' : '맞았어요'}!`;
      sub = '조금만 기다리면 풀려요';
    } else if (now < (me.blindUntil || 0)) {
      kind = 'ink'; icon = C.items.ink.icon; title = `${C.items.ink.name}! 앞이 안 보여요`; sub = '틀렸어요. 끝나면 같은 문제를 다시 풀어요';
    } else {
      kind = 'fuel'; icon = C.items.fuel.icon; title = `${C.items.fuel.name}! 엔진이 멈췄어요`; sub = '틀렸어요. 끝나면 같은 문제를 다시 풀어요';
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
    $('#doneCar').innerHTML = A.carSVG(myP.car || 0);
    $('#doneTitle').textContent = '골인! 🏁';
    $('#doneRank').textContent = '마지막 친구를 기다리고 있습니다';
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
    $('#doneRank').textContent = r && myP && myP.status === 'approved' ? '순위는 큰 화면 시상대에서 확인해요' : '';
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

    // 천리마 부스터: 문제를 푸는 동안에도 차가 저절로 달려요(맞아서 멈추면 그동안은 쉬어요)
    if (me.turboLeft > 0 && now >= (me.turboNext || 0) && !me.finishedAt) {
      if (now < (me.frozenUntil || 0)) me.turboNext = me.frozenUntil;
      else {
        me.turboLeft--;
        me.turboNext = now + 1000;
        me.turboUntil = Math.max(me.turboUntil || 0, me.turboLeft ? now + 1100 : now + 600);
        move(1, now);
        save();
        updateStatus(true);
        if (me.finishedAt) { me.fx = { type: 'finish', at: now }; save(); finished(); return; }
      }
    }

    renderMarks();

    const block = blockedUntil();
    if (now < block) showOverlay(now, block); else hideOverlay();

    if (phase === 'feedback' || phase === 'penalty') {
      if (now >= phaseUntil && now >= block) {
        if (me.finishedAt) finished();
        else if (cur && cur.retry) { cur.retry = false; phase = 'question'; renderQuestion(); } // 틀린 문제 다시 풀기
        else nextQuestion();
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
