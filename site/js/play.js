/* 학생 휴대폰 화면: 입장, 닉네임과 차 고르기, 승인 기다리기, 문제 풀기, 아이템, 결과 */
(function () {
  const C = window.APP_CONFIG, G = window.GAME, A = window.ART;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const HIT_TYPES = ['balloon', 'lightning', 'caltrop', 'thunder', 'smoke']; // 친구가 던져서 맞는 아이템

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
  // retry: '다시 연결하기' 버튼을 눌렀을 때 할 일(없으면 버튼을 숨겨요)
  let msgRetryFn = null;
  function msg(title, text, retry) {
    $('#msgTitle').textContent = title;
    $('#msgText').textContent = text;
    msgRetryFn = retry || null;
    $('#msgRetry').classList.toggle('hidden', !retry);
    show('#sMsg');
  }
  $('#msgRetry').addEventListener('click', () => { if (msgRetryFn) msgRetryFn(); });
  // 와이파이가 약하면 대답 없이 멈춰 있을 수 있어서, 정해진 시간까지만 기다려요
  function timed(p, ms) { return Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), ms))]); }
  const pause = ms => new Promise(r => setTimeout(r, ms));
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
  // ---------- 연결 지키기 ----------
  // 휴대폰 화면이 꺼지거나 다른 앱에 다녀오면 연결이 끊긴 채 오래 머물러서:
  //  - 레이스 동안 화면이 꺼지지 않게 붙잡고(지원하는 휴대폰만)
  //  - 다시 돌아오면 연결을 새로 이어 붙이고
  //  - 끊긴 채 8초가 지나도 돌아오지 않으면 다시 이어 붙여요
  let online = true, lostAt = 0, hiddenAt = 0, wake = null;
  function keepAwake() {
    if (!navigator.wakeLock || wake || document.visibilityState !== 'visible') return;
    navigator.wakeLock.request('screen').then(w => { wake = w; w.addEventListener('release', () => { wake = null; }); }).catch(() => { /* 지원하지 않으면 그냥 둬요 */ });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); return; }
    if (hiddenAt && Date.now() - hiddenAt > 3000) DB.reconnect();
    hiddenAt = 0;
    if (room) keepAwake();
  });
  setInterval(() => {
    if (!online && document.visibilityState === 'visible' && Date.now() - lostAt > 8000) { lostAt = Date.now(); DB.reconnect(); }
  }, 2000);

  async function init() {
    DB.onConnection(ok => {
      if (online && !ok) lostAt = Date.now();
      online = ok;
      $('#offline').classList.toggle('hidden', ok);
    });
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

  // 연결이 느리면 저절로 두 번 더 해 보고, 그래도 안 되면 '다시 연결하기' 버튼을 보여 줘요
  let listening = false;
  async function enterRoom(code, quiet, tries) {
    tries = tries || 1;
    if (tries === 1) msg('게임에 연결하는 중…', '잠시만 기다려 주세요.');
    try {
      const u0 = await timed(DB.authReady(), 8000).catch(() => null);
      if (DB.mode === 'firebase' && u0 && !u0.isAnonymous) {
        msg('선생님 계정이 로그인된 브라우저예요', '학생 화면은 학생 휴대폰이나 다른 브라우저(시크릿 창)에서 열어 주세요.');
        return;
      }
      const user = await timed(DB.signInStudent(), 12000);
      uid = user.uid;
      const m = await timed(DB.get(`rooms/${code}/meta`), 12000);
      if (!m) {
        forgetLast();
        show('#sCode');
        if (!quiet) $('#codeErr').textContent = '이 코드로 열린 게임이 없어요. 큰 화면의 숫자 4자리를 다시 확인해 주세요.';
        return;
      }
      room = code;
      rememberLast(code);
      if (history.replaceState) history.replaceState(null, '', 'play.html?room=' + code);
      questions = (await timed(DB.get(`rooms/${code}/questions`), 12000)) || [];
      if (!listening) {
        listening = true;
        DB.on(`rooms/${code}/meta`, v => { meta = v; metaLoaded = true; route(); });
        DB.on(`rooms/${code}/players`, v => { players = v || {}; myP = players[uid] || null; playersLoaded = true; route(); });
        DB.on(`rooms/${code}/state`, v => { states = v || {}; statesLoaded = true; route(); });
      }
      if (!loop) loop = setInterval(tick, 100);
      keepAwake();
      route(); // 다시 연결한 경우에는 새 소식을 기다리지 않고 바로 알맞은 화면으로
    } catch (e) {
      console.warn(e);
      const why = e && (e.code || e.message) || '';
      if (/admin-restricted|operation-not-allowed/.test(why)) { msg('들어가지 못했어요', '선생님께 알려 주세요: Firebase에서 익명 로그인이 꺼져 있어요.'); return; }
      if (tries < 3) {
        DB.reconnect();
        msg('연결이 느려요', `다시 연결하는 중이에요… (${tries + 1}/3)`);
        setTimeout(() => enterRoom(code, quiet, tries + 1), 1500);
        return;
      }
      msg('연결이 되지 않아요', '와이파이가 약한 것 같아요. 와이파이를 껐다 켜거나 데이터로 바꾼 뒤 아래 버튼을 눌러 주세요.', () => enterRoom(code, quiet));
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
  // 이미 고른 친구가 있는 번호는 표시만 하고 막지 않아요.
  // (QR을 다른 앱으로 다시 찍으면 같은 학생이 새 사람으로 들어와, 막으면 자기 번호로 못 들어가요.
  //  겹친 번호는 선생님 화면에 '번호 겹침'으로 보여서 선생님이 정리해요.)
  function markTakenNumbers() {
    const taken = takenNumbers();
    $$('#noPick .no-opt').forEach(b => b.classList.toggle('taken', taken.has(+b.dataset.no)));
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
      // 누르면 크게 보여 주고, '이걸로 할래요'를 눌러야 골라져요
      $$('#carPick .car-opt').forEach(b => b.addEventListener('click', () => openCarView(+b.dataset.car)));
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

  // ---------- 탈것 크게 보기 ----------
  let viewCar = null;
  function openCarView(i) {
    viewCar = i;
    const c = A.CARS[i];
    $('#cvGroup').textContent = c.group;
    $('#cvName').textContent = c.name;
    $('#cvCar').innerHTML = A.carSVG(i);
    $('#cvPick').textContent = carChoice === i ? '골랐어요 ✓' : '이걸로 할래요';
    $('#carView').classList.remove('hidden');
    $('#cvPick').focus({ preventScroll: true });
  }
  function closeCarView() { $('#carView').classList.add('hidden'); viewCar = null; }
  // 같은 종류 안에서 앞뒤로 넘겨 봐요
  function stepCarView(d) {
    const same = A.CARS.map((c, i) => i).filter(i => A.CARS[i].group === A.CARS[viewCar].group);
    openCarView(same[(same.indexOf(viewCar) + d + same.length) % same.length]);
  }
  $('#cvPrev').addEventListener('click', () => stepCarView(-1));
  $('#cvNext').addEventListener('click', () => stepCarView(1));
  $('#cvBack').addEventListener('click', closeCarView);
  $('#cvPick').addEventListener('click', () => {
    carChoice = viewCar;
    $$('#carPick .car-opt').forEach(x => x.setAttribute('aria-checked', String(+x.dataset.car === carChoice)));
    // 다른 종류에서 넘겨 고른 경우에도 그 종류 탭을 보여 줘요
    const pick = $(`#carPick .car-opt[data-car="${carChoice}"]`);
    if (pick && pick.hidden) $(`#carPick .car-tab[data-g="${pick.dataset.g}"]`).click();
    closeCarView();
  });
  $('#carView').addEventListener('click', e => { if (e.target === $('#carView')) closeCarView(); });
  document.addEventListener('keydown', e => {
    if (viewCar == null) return;
    if (e.key === 'Escape') closeCarView();
    if (e.key === 'ArrowLeft') stepCarView(-1);
    if (e.key === 'ArrowRight') stepCarView(1);
  });

  // 닉네임 금칙어: 입력하는 동안 바로 알려 주고 입장 버튼을 막습니다
  const BANNED_MSG = '사용할 수 없는 말이 들어 있어요. 친구가 기분 나쁘지 않은 닉네임으로 바꿔 주세요.';
  $('#nickInput').addEventListener('input', () => {
    const bad = G.bannedWordIn($('#nickInput').value);
    $('#joinErr').textContent = bad ? BANNED_MSG : '';
    $('#nickInput').classList.toggle('bad', !!bad);
    $('#joinForm button[type=submit]').disabled = !!bad;
  });

  // 입장이 안 되는 까닭을 크게 보여 주고, 고쳐야 할 칸으로 화면을 옮겨 줘요
  function joinError(text, target) {
    const err = $('#joinErr');
    err.textContent = text;
    err.classList.remove('shake');
    void err.offsetWidth;
    err.classList.add('shake');
    (target || err).scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (target) { target.classList.remove('need'); void target.offsetWidth; target.classList.add('need'); }
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(120);
  }
  let joining = false;
  $('#joinForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (joining) return;
    const nick = $('#nickInput').value.trim();
    if (!nick) { joinError('닉네임을 적어 주세요.', $('#nickInput')); return; }
    if (Array.from(nick).length > C.maxNick) { joinError(`닉네임은 ${C.maxNick}글자까지 쓸 수 있어요.`, $('#nickInput')); return; }
    if (G.bannedWordIn(nick)) { joinError(BANNED_MSG, $('#nickInput')); return; }
    if (noChoice == null) { joinError('내 출석번호를 골라 주세요.', $('#noPick')); return; }
    if (carChoice == null) { joinError('탈것을 하나 골라 주세요.', $('#carPick')); return; }
    $('#joinErr').textContent = '';
    const btn = $('#joinForm button[type=submit]');
    joining = true;
    btn.disabled = true;
    btn.textContent = '들어가는 중…';
    keepAwake();
    const entry = { nick, no: noChoice, car: carChoice, status: 'pending', joinedAt: DB.now() };
    // 와이파이가 약하면 저장이 끝나지 않고 멈춰 있을 수 있어서 10초까지만 기다려요
    const save = () => timed(DB.set(`rooms/${room}/players/${uid}`, entry), 10000);
    const denied = ex => /permission/i.test(ex && (ex.code || ex.message) || '');
    let done = false, lastErr = null;
    // 느려서 실패하면 연결을 새로 이어 붙이고 저절로 두 번 더 해 봐요(같은 자리에 다시 쓰니 두 번 들어가지 않아요)
    for (let k = 1; k <= 3 && !done; k++) {
      if (k > 1) { btn.textContent = `연결이 느려서 다시 시도하는 중… (${k}/3)`; DB.reconnect(); await pause(1200); }
      try {
        // 휴대폰이 잠깐 잠겼다 깨면 로그인이 바뀌거나 만료될 수 있어서, 지금 로그인으로 다시 맞춰요
        uid = (await timed(DB.signInStudent(), 10000)).uid;
        try { await save(); }
        catch (ex) {
          if (!denied(ex)) throw ex;
          await timed(DB.refreshAuth(), 8000);
          try { await save(); }
          catch (ex2) {
            // 그래도 거절되면 로그인이 망가진 것이라, 새 접속 번호로 다시 로그인해서 한 번 더 해 봐요
            if (!denied(ex2)) throw ex2;
            await timed(DB.signOut(), 5000);
            uid = (await timed(DB.signInStudent(), 10000)).uid;
            await save();
          }
        }
        done = true;
      } catch (ex) {
        console.warn(ex);
        lastErr = ex;
        if (!/timeout|network|disconnect/i.test(ex && (ex.code || ex.message) || '')) break;
      }
    }
    if (done) {
      // 저장은 됐는데 목록 소식이 늦게 오면 멈춘 것처럼 보여서, 내 자리를 바로 반영해 기다리기 화면으로 넘어가요
      players[uid] = entry;
      myP = entry;
      route();
    } else {
      const why = lastErr && (lastErr.code || lastErr.message) || '';
      joinError(why === 'timeout'
        ? '인터넷 연결이 약해서 들어가지 못했어요. 와이파이를 껐다 켜거나 데이터로 바꾼 뒤 다시 눌러 주세요.'
        : `입장하지 못했어요. 다시 눌러 주세요. 계속 안 되면 선생님께 알려 주세요. (${why || '알 수 없는 오류'})`);
    }
    joining = false;
    btn.disabled = !!G.bannedWordIn($('#nickInput').value);
    btn.textContent = '입장하기';
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
    buildMini();
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
    if (resume == null) { const st = stat(i); st.s = (st.s || 0) + 1; me.tried = []; me.miss = 0; me.peek = false; }
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
          : me.peek ? `<p class="sa-hint">${C.items.mapae.icon} 힌트 <b>${escapeHtml(String(q.answer).charAt(0) + G.choHint(String(q.answer).slice(1)))}</b> <span>${len}글자</span></p>`
          : C.saHint !== false ? `<p class="sa-hint">힌트 <b>${escapeHtml(G.choHint(q.answer))}</b> <span>${len}글자</span></p>` : ''}
        <input class="sa-input" type="text" maxlength="30" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="정답을 써요" aria-label="정답 입력">
        <button class="ans sa-submit" type="submit">제출</button>
      </form>`;
      const input = box.querySelector('.sa-input');
      typeOnly(input);
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
  // 단답형은 직접 쳐서 낱말을 익히도록 붙여넣기·끌어다 놓기를 막아요.
  // 키보드의 클립보드 추천처럼 여러 글자가 한꺼번에 들어오는 것도 되돌려요(한글 조합 입력은 그대로).
  function typeOnly(input) {
    let prev = input.value;
    const block = e => { e.preventDefault(); toast('단답형은 직접 입력해 주세요. 붙여넣기는 할 수 없어요.'); };
    input.addEventListener('paste', block);
    input.addEventListener('drop', block);
    input.addEventListener('beforeinput', e => { if (/^insertFrom(Paste|Drop|Yank)/.test(e.inputType || '')) block(e); });
    input.addEventListener('input', e => {
      if (!e.isComposing && e.inputType === 'insertText' && input.value.length - prev.length >= 4) {
        input.value = prev;
        toast('단답형은 직접 입력해 주세요. 붙여넣기는 할 수 없어요.');
        return;
      }
      prev = input.value;
    });
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function stat(i) { return me.q[i] || (me.q[i] = { c: 0, w: 0, t: 0 }); }

  // 막판 역전 구간: 끝나기 finalSeconds초 전부터
  function inFinal(now) {
    if (!C.finalSeconds || !meta || !meta.endAt) return false;
    const left = G.raceClock(meta, now).left;
    return left > 0 && left <= C.finalSeconds * 1000;
  }
  // 쿨링 타임 중인지
  function paused(now) { return !!(meta && meta.startAt && G.raceClock(meta, now).paused); }
  // 선두 맞바람: 시간이 흐른 만큼의 칸 + leadCells까지만 갈 수 있어요(1등이 너무 일찍 골인해 기다리지 않게, 쉬는 시간은 빼고 셈)
  function paceCap(now) {
    if (!C.leadCells || !meta || !meta.startAt || !meta.endAt) return C.finishCells;
    const clock = G.raceClock(meta, now);
    const f = Math.max(0, Math.min(1, clock.elapsed / clock.total));
    return Math.floor(C.finishCells * f) + C.leadCells;
  }
  // 실제로 간 칸 수를 돌려줘요
  function move(n, now) {
    if (me.finishedAt) return 0;
    const before = me.pos || 0;
    me.pos = Math.min(C.finishCells, before + n, Math.max(before, paceCap(now)));
    if (me.pos < Math.min(C.finishCells, before + n)) me.windAt = now;
    if (me.pos > before) me.movedAt = now;
    if (me.pos >= C.finishCells) { me.finishedAt = now; me.fx = { type: 'finish', at: now }; }
    return me.pos - before;
  }
  // 아이템·부스터로 받은 n칸: 지금 갈 수 있는 만큼 가고, 맞바람에 막힌 나머지는 버리지 않고
  // 맞바람이 그치면 1초에 1칸씩 저절로 가요. 화면에 보여 줄 말을 돌려줘요
  function gain(n, now) {
    const went = move(n, now), rest = me.finishedAt ? 0 : n - went;
    if (rest > 0) {
      me.turboLeft = (me.turboLeft || 0) + rest;
      if (!(me.turboNext > now)) me.turboNext = now + 1000;
    }
    if (!rest) return `앞으로 ${went}칸 더 가요`;
    return `${went ? went + '칸 가고, 나머지 ' : '🌬️ '}${rest}칸은 맞바람이 그치면 저절로 가요`;
  }

  // 아이템을 쓰면 1초 동안 화면 가득 큰 글자와 내 탈것이 달려 나가는 장면을 보여 줘요
  // 장면이 떠 있는 동안과 닫힌 뒤 잠깐(FX_GRACE)은 답 버튼을 누른 것으로 치지 않아요(가려진 채 잘못 눌러 오답 벌칙을 받지 않게)
  const FX_SHOW = 1100, FX_GRACE = 400;
  let fxTimer = null, fxBusyUntil = 0;
  // opt.kind 'block': 방패·부적이 친구 공격을 막아 내는 장면(opt.incoming: 날아온 아이템 아이콘)
  function itemFx(type, sub, opt) {
    opt = opt || {};
    const it = C.items[type] || {};
    const kind = opt.kind || (type === 'shield' ? 'shield' : ['star', 'ginseng', 'mapae'].includes(type) ? 'star' : ['boost1', 'boost2', 'turbo', 'yut', 'warp'].includes(type) ? 'boost' : 'throw');
    const pop = $('#fxPop');
    pop.className = `fx-pop ${kind} fx-${type}`;
    $('#fxTitle').textContent = opt.title || `${it.icon || ''} ${it.name || ''} ${kind === 'throw' ? '발사!' : '사용!'}`;
    $('#fxSub').textContent = sub || it.desc || '';
    $('#fxCar').innerHTML = A.carSVG((myP && myP.car) || 0) + (kind === 'shield' || kind === 'block' ? '<i class="dome"></i>' : '');
    $('#fxProj').innerHTML = projHTML(kind, type, opt.incoming);
    $('#fxLines').innerHTML = kind === 'boost' ? Array.from({ length: 9 }, (_, i) => `<i style="top:${8 + i * 10}%;width:${30 + (i * 37) % 45}%;animation-delay:${(i * 0.07).toFixed(2)}s"></i>`).join('') : '';
    void pop.offsetWidth; // 애니메이션을 처음부터 다시
    pop.classList.add('go');
    clearTimeout(fxTimer);
    fxTimer = setTimeout(() => pop.classList.add('hidden'), FX_SHOW);
    fxBusyUntil = Date.now() + FX_SHOW + FX_GRACE;
    // 휴대폰 진동(화면을 한 번이라도 누른 뒤에만 브라우저가 허락해요)
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(kind === 'throw' ? [40, 30, 40] : 60);
  }

  // 아이템마다 날아가는 모습: 신기전(불꼬리 로켓 3발과 폭발), 물풍선(포물선을 그리며 날아가 터짐),
  // 마름쇠(뒤로 흩뿌림), 비격진천뢰(큰 충격파), 막기(날아온 아이템이 방패에 튕겨 나감)
  function projHTML(kind, type, incoming) {
    if (kind === 'block') return `<span class="incoming">${incoming || ''}</span>`;
    if (kind !== 'throw') return '';
    const icon = (C.items[type] || {}).icon || '';
    if (type === 'lightning') return [0, 1, 2].map(i => `<span class="rk" style="--i:${i}">${icon}</span>`).join('') + '<i class="boom"></i>';
    if (type === 'balloon') return '<span class="wb"></span>' + Array.from({ length: 8 }, (_, i) => `<b class="drop" style="--a:${i * 45}deg"></b>`).join('') + '<i class="splash"></i>';
    if (type === 'caltrop') return Array.from({ length: 5 }, (_, i) => `<span class="sp" style="--x:${-34 - i * 18}px;--y:${18 + (i % 2) * 16}px;--r:${i * 80 + 40}deg;--d:${(i * 0.06).toFixed(2)}s">${icon}</span>`).join('');
    if (type === 'thunder') return '<i class="shock"></i><i class="shock s2"></i><span class="bang">' + icon + '</span>';
    if (type === 'smoke') return Array.from({ length: 6 }, (_, i) => `<span class="puff" style="--i:${i}">${icon}</span>`).join('');
    return `<span class="wb"></span>`;
  }

  let lastGain = ''; // 방금 아이템으로 간 칸을 알려 주는 말(아이템 장면 아래 글씨)
  function applyItem(item, now) {
    const it = C.items[item];
    me.fx = { type: item, at: now };
    if (item === 'boost1' || item === 'boost2') { lastGain = gain(item === 'boost1' ? 1 : 2, now); return `${it.icon} ${it.name}! ${lastGain}`; }
    if (item === 'shield') { me.shield = true; return `${it.icon} ${josa(it.name, '을', '를')} 얻었어요`; }
    if (item === 'ginseng') { me.ginseng = true; return `${it.icon} ${josa(it.name, '을', '를')} 먹었어요. 다음 오답 벌칙이 없어요`; }
    if (item === 'yut') {
      const [name, n] = G.rollYut();
      lastGain = `${josa(name, '이', '가')} 나왔어요! ${gain(n, now)}`;
      me.fx = { type: item, at: now, n };
      return `${it.icon} ${lastGain}`;
    }
    me.hold = item;
    me.holdAt = now;
    return `${it.icon} ${josa(it.name, '을', '를')} 얻었어요. 아래 버튼을 눌러요!`;
  }

  // 부스터로 n칸을 1초에 1칸씩 저절로 달려요(천리마 부스터, 연속 정답 보너스)
  function startRun(n, now) {
    me.turboLeft = (me.turboLeft || 0) + n;
    if (!(me.turboNext > now)) me.turboNext = now + 250;
    me.turboUntil = Math.max(me.turboUntil || 0, now) + n * 1000;
  }

  function answer(v, btn) {
    if (phase !== 'question' || !cur) return;
    const now = DB.now();
    if (now < blockedUntil() || paused(now) || Date.now() < fxBusyUntil) return;
    const q = cur.q;
    const ok = q.type === 'ox' ? v === q.answer : q.type === 'sa' ? G.checkShort(q, v) : Number(v) === q.answer;
    if (q.type === 'sa') btn.readOnly = true;
    const st = stat(cur.i);
    if (ok) {
      st.c++;
      me.openQ = null;
      me.correct++;
      // 한 번에 맞힌 문제가 이어지면 연속 정답 보너스(2연속 +2칸, 3연속부터 +3칸)
      const first = !(me.miss > 0);
      me.streak = first ? (me.streak || 0) + 1 : 0;
      const bonus = first ? G.comboBonus(me.streak) : 0;
      const r = myRank();
      const step = inFinal(now) ? 2 : 1; // 역전 구간에서는 정답 하나에 2칸
      const went = move(step, now);
      let sub = went ? `앞으로 ${went}칸${step > 1 ? ' (역전 구간)' : ''}` : '🌬️ 선두 맞바람! 친구들이 따라올 때까지 제자리예요';
      // 선두 맞바람에 걸리면 연속 정답 부스터와 달리는 장면은 쉬어요(연속 기록은 이어져요)
      const windy = !me.finishedAt && (me.pos || 0) >= paceCap(now);
      if (!me.finishedAt) {
        const got = G.rollGoodItem(r.rank, r.n, { holding: !!me.hold, hasShield: !!me.shield, hasGinseng: !!me.ginseng });
        sub = applyItem(got, now);
        if (windy) { if (!went && !sub.includes('그치면')) sub = '친구들이 따라올 때까지 제자리예요 · ' + sub; }
        else if (bonus) {
          startRun(bonus, now);
          me.fx = { type: 'combo', at: now, n: me.streak };
          itemFx('turbo', `부스터로 ${bonus}칸 더 달려요`, { kind: 'boost', title: `🔥 ${me.streak}연속 정답!` });
        }
        // 바로 효과가 나는 아이템은 쓰는 장면을 보여 줘요(연속 정답 장면이 먼저)
        else if (got === 'boost1' || got === 'boost2') itemFx(got, lastGain);
        else if (got === 'shield') itemFx(got, '친구의 공격을 1번 막아요');
        else if (got === 'ginseng') itemFx(got, '다음 오답 벌칙을 1번 막아요');
        else if (got === 'yut') itemFx(got, lastGain, { title: `${C.items.yut.icon} 윷 던지기!` });
      }
      save();
      btn.classList.add('right');
      flash('good', windy ? '정답! 🌬️ 선두 맞바람' : bonus ? `정답! 🔥 ${me.streak}연속` : '정답!', sub);
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
      me.streak = 0;
      cur.retry = true;
      const guard = now < (me.guardUntil || 0);
      if (guard || me.ginseng) {
        // 도깨비 부적·인삼: 벌칙 없이 바로 다시 풀어요
        if (!guard) me.ginseng = false;
        save();
        btn.classList.add('wrong');
        renderMarks();
        flash('good', guard ? `${C.items.star.icon} 부적이 벌칙을 막았어요` : `${C.items.ginseng.icon} 인삼 덕분에 벌칙이 없어요`, '다시 풀어 봐요');
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
    me.streak = 0;
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
          itemFx('star', `${h.nick || '친구'}의 ${josa(it.name, '을', '를')} 막아 냈어요`, { kind: 'block', title: `${C.items.star.icon} 부적 덕분에 끄떡없어요!`, incoming: it.icon });
        } else if (me.shield) {
          me.shield = false;
          me.fx = { type: 'block', at: now };
          itemFx('shield', `${h.nick || '친구'}의 ${josa(it.name, '을', '를')} 막아 냈어요`, { kind: 'block', title: `${C.items.shield.icon} 방패로 막았어요!`, incoming: it.icon });
        } else {
          const before = Math.max(now, blockedUntil());
          if (type === 'smoke') me.blindUntil = Math.max(me.blindUntil || 0, now) + C.hitSeconds * 1000; // 봉화 연기: 문제가 가려져요
          else me.frozenUntil = Math.max(me.frozenUntil || 0, now) + (type === 'thunder' ? 2 : C.hitSeconds) * 1000;
          const added = Math.max(0, blockedUntil() - before);
          if (phase === 'question' && cur) cur.deadline += added;
          me.fx = { type, at: now, by: h.nick || '친구' };
        }
        save();
        renderItem();
      });
    });
  }

  $('#itemBtn').addEventListener('click', () => useItem(false));

  // 들고 있는 아이템 쓰기. auto = 시간이 지나 저절로 쓰는 경우(쓸 수 없으면 조용히 조금 뒤 다시 해 봐요)
  // 쓰지 못하면 false를 돌려줘요
  function useItem(auto) {
    if (!me || !me.hold || phase === 'over' || phase === 'done' || phase === 'idle' || paused(DB.now())) return false;
    const type = me.hold, now = DB.now();
    const done = () => { me.hold = null; me.holdAt = null; save(); renderItem(); };
    if (type === 'turbo') {
      // 천리마 부스터: 3초 동안 1초마다 1칸씩, 모두 3칸 저절로 달려요
      startRun(3, now);
      me.fx = { type: 'turbo', at: now };
      done();
      itemFx('turbo', '3초 동안 3칸 질주해요');
      return true;
    }
    if (type === 'star') {
      me.guardUntil = now + 8000;
      me.fx = { type: 'star', at: now };
      done();
      itemFx('star', '8초 동안 무적이에요');
      return true;
    }
    if (type === 'warp') {
      // 축지법: 나보다 앞에 있는 친구 중 가장 가까운 친구 자리까지 순간 이동(최대 6칸)
      const ahead = myRank().ranked.filter(x => x.uid !== uid && x.pos > (me.pos || 0));
      // 저절로 쓸 때 앞에 아무도 없으면(내가 1등) 2칸만 앞으로 가요
      if (!ahead.length && !auto) { toast('지금은 앞에 친구가 없어요. 조금 뒤에 다시 눌러 보세요.'); return false; }
      const t = ahead.length ? ahead.reduce((a, b) => (b.pos < a.pos ? b : a)) : null;
      const gap = t ? Math.min(6, t.pos - (me.pos || 0)) : 2;
      const g = gain(gap, now);
      me.fx = { type: 'warp', at: now };
      done();
      itemFx('warp', t ? `${t.nick} 쪽으로 순간 이동! ${g}` : `앞에 아무도 없어요. ${g}`);
      updateStatus(true);
      if (me.finishedAt) finished();
      return true;
    }
    if (type === 'mapae') {
      // 암행어사 마패: 지금 문제의 틀린 보기를 지워요(4지선다 2개, O/X 1개, 단답형은 첫 글자 공개)
      if (phase !== 'question' || !cur) { if (!auto) toast('문제가 나오면 눌러 주세요.'); return false; }
      const q = cur.q;
      if (q.type === 'sa') me.peek = true;
      else {
        const wrong = (q.type === 'ox' ? ['O', 'X'] : [0, 1, 2, 3]).filter(v => v !== q.answer && !(me.tried || []).includes(v));
        me.tried = (me.tried || []).concat(G.shuffle(wrong).slice(0, q.type === 'ox' ? 1 : 2));
      }
      me.fx = { type: 'mapae', at: now };
      done();
      itemFx('mapae', q.type === 'sa' ? '정답 첫 글자를 알려 줘요' : '틀린 보기를 지웠어요');
      renderQuestion();
      return true;
    }
    const r = myRank();
    const found = G.attackTarget(type, uid, r.ranked);
    const targets = Array.isArray(found) ? found : found ? [found] : [];
    if (!targets.length && !auto) { toast(type === 'caltrop' ? '지금은 뒤에 친구가 없어요. 조금 뒤에 다시 눌러 보세요.' : '지금은 맞힐 친구가 없어요. 조금 뒤에 다시 눌러 보세요.'); return false; }
    if (!targets.length) {
      // 저절로 쓸 때 맞힐 친구가 없으면 버리지 않고 1칸 앞으로 가요
      const g = gain(1, now);
      me.fx = { type: 'boost1', at: now };
      done();
      itemFx(type, `맞힐 친구가 없어요. ${g}`, { kind: 'boost' });
      updateStatus(true);
      if (me.finishedAt) finished();
      return true;
    }
    me.fx = { type: 'throw', at: now, item: type };
    done();
    Promise.all(targets.map(t => DB.push(`rooms/${room}/hits/${t.uid}`, { type, from: uid, nick: myP.nick, at: DB.now() })))
      .then(() => itemFx(type, targets.length > 1 ? `앞선 친구 ${targets.length}명에게 쾅!` : `${targets[0].nick}에게 날아갔어요`))
      .catch(e => console.warn(e));
    return true;
  }

  function renderItem() {
    const btn = $('#itemBtn');
    if (me && me.hold) {
      const it = C.items[me.hold];
      // 누르지 않으면 몇 초 뒤 저절로 써요. 아래 막대가 줄어들며 남은 시간을 보여 줘요
      const auto = (C.autoItemSeconds || 0) * 1000;
      const left = auto ? Math.max(0, (me.holdAt || DB.now()) + auto - DB.now()) : 0;
      btn.innerHTML = `<span class="ib-icon">${it.icon}</span><span><b>${it.name} 쓰기</b><small>${it.desc}${auto ? ' · 안 누르면 저절로 써요' : ''}</small></span>${auto ? `<i class="ib-auto" style="--d:${(left / 1000).toFixed(1)}s"></i>` : ''}`;
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
    if (me && me.ginseng) marks.push(`${C.items.ginseng.icon} ${C.items.ginseng.name} 있음`);
    if (me && me.streak >= 2) marks.push(`🔥 ${me.streak}연속 정답 중`);
    if (me && inFinal(now)) marks.push('⚡ 역전 구간: 정답 2칸');
    if (me && now - (me.windAt || 0) < 5000) marks.push('🌬️ 선두 맞바람');
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
    renderMini();
    const e = G.era(meta && meta.era);
    const s = `${me.pos}|${r.rank}|${r.n}|${G.sceneIndex(me.pos)}`;
    if (!force && s === lastStatus) return;
    lastStatus = s;
    // 오른쪽 위: 참여 인원 중 지금 몇 등인지. 올라서면 가운데에 크게 알려 줘요
    $('#stRank').textContent = r.rank;
    $('#stN').textContent = `/ ${r.n}명`;
    const box = $('#rankBox');
    box.dataset.rank = r.rank <= 3 ? r.rank : '';
    if (lastRank && r.rank !== lastRank && phase !== 'done' && phase !== 'over') {
      box.classList.remove('up', 'down');
      void box.offsetWidth;
      box.classList.add(r.rank < lastRank ? 'up' : 'down');
      rankPop(lastRank, r.rank);
    }
    lastRank = r.rank;
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

  // 순위가 오르거나 떨어지면 위쪽에 얇은 띠로 잠깐 보여 줘요(문제를 가리지 않게). 잇달아 바뀌면 처음 순위와 비교해 합쳐서 보여 줘요
  let lastRank = 0, lastFinal = false, popTimer = null, popBase = 0, popRank = 0, popWaiting = false;
  function rankPop(from, to) {
    const el = $('#rankPop');
    if (el.classList.contains('hidden') && !popWaiting) popBase = from;
    popRank = to;
    if (popWaiting) return;
    popWaiting = true;
    // 아이템·연속 정답 장면이 떠 있으면 끝난 뒤에 보여 줘요
    setTimeout(() => {
      popWaiting = false;
      const d = popBase - popRank;
      if (!d) return;
      $('#rankPopTag').textContent = d > 0 ? '순위 상승!' : '순위 하락';
      $('#rankPopNo').textContent = `${popRank}등${d > 0 ? '!' : ''}`;
      $('#rankPopUp').textContent = d > 0 ? `▲ ${d}계단 올라섰어요` : `▼ ${-d}계단 밀렸어요`;
      el.dataset.rank = d > 0 && popRank <= 3 ? popRank : '';
      el.className = 'rank-pop' + (d < 0 ? ' down' : '');
      void el.offsetWidth;
      el.classList.add('go');
      clearTimeout(popTimer);
      popTimer = setTimeout(() => el.classList.add('hidden'), 1800);
    }, $('#fxPop').classList.contains('hidden') ? 0 : 1000);
  }

  // 왼쪽 위 작은 화면: 큰 화면과 같은 코스에 모든 친구의 위치를 점으로 보여 줘요(영상 통화 작은 창처럼)
  const MINI_W = 480, MINI_H = 300;
  let miniGeo = null, miniSig = '';
  function buildMini() {
    if (!window.TRACKS) return;
    miniGeo = TRACKS.build((meta && meta.track) || 'oval', MINI_W, MINI_H, { x: 0, y: 0, w: MINI_W, h: MINI_H });
    miniSig = '';
    // 친구들까지 다 보이면 정신없어서 내 위치만: 깜빡이는 빨간 점 위에 내가 고른 탈것이 통통 달려요
    const car = A.carSVG((myP && myP.car) || 0).replace('<svg class="car-svg"', '<svg class="mini-car" x="-56" y="-70" width="112" height="80"');
    $('#mini').innerHTML = `<svg viewBox="0 0 ${MINI_W} ${MINI_H}" preserveAspectRatio="xMidYMid slice">${miniGeo.svg(1)}` +
      `<g class="mini-me" id="miniMe"><circle r="24" class="mini-me-ring"/><circle r="15" class="mini-me-dot"/><g class="mini-me-flip"><g class="mini-bob">${car}</g></g></g></svg><span class="mini-live">내 위치</span>`;
  }
  function renderMini() {
    if (!miniGeo || !me) return;
    const pos = me.finishedAt ? C.finishCells : Math.min(me.pos || 0, C.finishCells);
    if (pos === miniSig) return;
    miniSig = pos;
    const pt = miniGeo.at(miniGeo.sAt(pos / C.finishCells), 0);
    const el = document.getElementById('miniMe');
    el.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px)`;
    // 길이 왼쪽으로 가는 곳에서는 탈것도 왼쪽을 보게 뒤집어요
    el.querySelector('.mini-me-flip').style.transform = Math.cos(pt.t) < -0.2 ? 'scaleX(-1)' : '';
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
    if (fx.type === 'smoke' && now < (me.blindUntil || 0)) {
      kind = 'smoke'; icon = C.items.smoke.icon;
      title = `${fx.by || '친구'}의 ${C.items.smoke.name}에 앞이 안 보여요!`;
      sub = '연기가 걷히면 이어서 풀어요';
    } else if (HIT_TYPES.includes(fx.type) && now < (me.frozenUntil || 0)) {
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
    // 내 탈것이 연기를 뿜으며 멈추고(오염 연료), 먹물을 뒤집어쓰고(먹물), 맞은 아이템마다 다르게 당해요
    // (물풍선: 물방울 막에 갇혀 둥둥, 신기전·비격진천뢰: 폭발에 빙글 돌며 어질어질, 마름쇠: 바퀴가 찔려 덜컹)
    const fxKey = kind === 'hit' ? fx.type : kind;
    if (ov.dataset.fx !== fxKey || !$('#ovCar').innerHTML) { ov.dataset.fx = fxKey; $('#ovCar').innerHTML = A.carSVG((myP && myP.car) || 0); }
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
    $('#coolPop').classList.add('hidden');
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

  // ---------- 쿨링 타임 ----------
  let lastTickAt = 0, coolShown = false;
  // 쉬는 동안 흐른 시간(span)만큼 문제 시간·벌칙·부적·부스터·아이템 자동 사용 시계를 뒤로 미뤄요
  function holdTimers(span, now) {
    if (!me) return;
    const from = now - span;
    ['frozenUntil', 'blindUntil', 'guardUntil', 'turboNext', 'turboUntil'].forEach(k => { if (me[k] > from) me[k] += span; });
    if (me.hold && me.holdAt) me.holdAt += span;
    if (cur) cur.deadline += span;
    if (phaseUntil > from) phaseUntil += span;
  }
  function showCool(clock) {
    if (!coolShown) {
      coolShown = true;
      $('#coolCards').innerHTML = G.conceptCards(questions).map(c => `<li><p>${escapeHtml(c.q)}</p><strong>${escapeHtml(c.a)}</strong></li>`).join('');
      $('#coolPop').classList.remove('hidden');
      $('#coolPop').scrollTop = 0;
      if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(80);
    }
    $('#coolCount').textContent = Math.ceil(clock.coolLeft / 1000);
  }
  function hideCool() {
    coolShown = false;
    $('#coolPop').classList.add('hidden');
    if (me) save();
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
    const clock = G.raceClock(meta, now);
    $('#stTime').textContent = fmt(clock.left);
    // 쿨링 타임: 게임을 멈추고(문제 시간·벌칙·부스터·아이템 시계도 함께 멈춤) 핵심 개념을 다시 봐요
    const span = meta.coolAt && lastTickAt ? Math.max(0, Math.min(now, meta.coolUntil) - Math.max(lastTickAt, meta.coolAt)) : 0;
    lastTickAt = now;
    if (span) holdTimers(span, now);
    if (clock.paused) { showCool(clock); return; }
    if (coolShown) hideCool();
    // 막판 역전 구간이 시작되면 크게 알리고, 시간을 빨갛게
    const fin = inFinal(now);
    if (fin !== lastFinal) {
      lastFinal = fin;
      $('#sRace').classList.toggle('final', fin);
      if (fin && phase !== 'done') itemFx('turbo', `남은 ${C.finalSeconds}초! 정답 하나에 2칸씩 가요`, { kind: 'boost', title: '⚡ 역전 구간 시작!' });
    }
    if (phase === 'done') return;

    // 천리마 부스터: 문제를 푸는 동안에도 차가 저절로 달려요(맞아서 멈추면 그동안은 쉬어요)
    if (me.turboLeft > 0 && now >= (me.turboNext || 0) && !me.finishedAt) {
      if (now < (me.frozenUntil || 0)) me.turboNext = me.frozenUntil;
      else if ((me.pos || 0) >= paceCap(now)) me.turboNext = now + 1000; // 맞바람: 남은 칸은 그대로 두고 1초 뒤에 다시
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

    // 받은 아이템을 한동안 누르지 않으면 저절로 써요(못 쓰면 2초 뒤 다시)
    if (me.hold && C.autoItemSeconds > 0) {
      if (!me.holdAt) me.holdAt = now;
      if (now >= me.holdAt + C.autoItemSeconds * 1000 && !useItem(true)) { me.holdAt = now - (C.autoItemSeconds - 2) * 1000; renderItem(); }
    }

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
