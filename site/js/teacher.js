/* 선생님 화면: 로그인, 문제 세트, 게임 열기, 대기실, 레이스(큰 화면), 결과, 다시 풀기, 반 기록 */
(function () {
  const C = window.APP_CONFIG, G = window.GAME, A = window.ART;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const X0 = 12, X1 = 96; // 트랙에서 출발선과 결승선 위치(%)

  let sets = {};
  let pickClass = null, pickSet = null;
  let room = null, meta = null, players = {}, states = {}, questions = [];
  let roomSubs = [];
  let tickTimer = null, finishing = false, lastCount = null, raceBuiltFor = '', lastRankSig = '';
  const seenFx = {}, revealUntil = {};
  let homeReady = false;

  // ---------- 공통 ----------
  function toast(msg, ms) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), ms || 2600);
  }
  function show(id) {
    $$('.view').forEach(v => v.classList.toggle('hidden', '#' + v.id !== id));
    window.scrollTo(0, 0);
  }
  function currentView() { const v = $$('.view').find(x => !x.classList.contains('hidden')); return v ? '#' + v.id : ''; }
  function playUrl(code) { return new URL('play.html?room=' + code, location.href).href; }
  function renderQR(el, text, cell) {
    if (window.qrcode) {
      const qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      el.innerHTML = qr.createSvgTag(cell || 6, 2);
    } else {
      el.innerHTML = '<p class="qr-missing">QR을 불러오지 못했어요. 입장 코드로 들어와 주세요.</p>';
    }
  }
  function eraLabel(id) { const e = G.era(id); return e.no + ' ' + e.name; }
  function denied(e) {
    console.warn(e);
    toast('저장소에 접근할 권한이 없어요. config.js의 teacherEmail과 Firebase 규칙의 이메일이 같은지 확인해 주세요.', 6000);
  }
  function fmtTime(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function fmtDate(t) {
    const d = new Date(t);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  function pct(r) { return r == null ? '기록 없음' : Math.round(r * 100) + '%'; }

  // ---------- 시작과 로그인 ----------
  async function boot() {
    if (DB.mode === 'demo') {
      $('#demoBanner').classList.remove('hidden');
      $('#btnLogout').textContent = '체험 기록 지우기';
    }
    const user = await DB.authReady();
    if (DB.mode === 'firebase' && !(user && !user.isAnonymous)) { show('#vLogin'); return; }
    enterHome();
  }

  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    $('#loginErr').textContent = '';
    try {
      const u = await DB.signInTeacher($('#loginEmail').value.trim(), $('#loginPw').value);
      if (C.teacherEmail && (u.email || '').toLowerCase() !== C.teacherEmail.toLowerCase()) {
        await DB.signOut();
        $('#loginErr').textContent = 'config.js에 적힌 선생님 이메일과 다른 계정이에요.';
        return;
      }
      enterHome();
    } catch (err) {
      const code = err && err.code || '';
      $('#loginErr').textContent =
        /invalid-credential|wrong-password|user-not-found|invalid-email/.test(code) ? '이메일 또는 비밀번호가 맞지 않아요.' :
        /too-many-requests/.test(code) ? '여러 번 틀려서 잠시 막혔어요. 몇 분 뒤에 다시 해 주세요.' :
        /network/.test(code) ? '인터넷 연결을 확인해 주세요.' : '로그인하지 못했어요. (' + code + ')';
    }
  });

  $('#btnLogout').addEventListener('click', async () => {
    if (DB.mode === 'demo') {
      if (!confirm('체험 모드에서 만든 문제 세트와 기록을 모두 지울까요?')) return;
      DB.resetDemo();
      localStorage.removeItem('hkr-teacher-room');
      toast('체험 기록을 지웠어요.');
      return;
    }
    await DB.signOut();
    location.reload();
  });

  // ---------- 홈 ----------
  async function enterHome() {
    show('#vHome');
    if (!homeReady) initHome();
    cleanupOldRooms();
    const saved = localStorage.getItem('hkr-teacher-room');
    if (saved) {
      const m = await DB.get(`rooms/${saved}/meta`).catch(() => null);
      if (m) { attachRoom(saved); return; }
      localStorage.removeItem('hkr-teacher-room');
    }
  }

  function initHome() {
    homeReady = true;
    $$('.tab').forEach(t => t.addEventListener('click', () => selectTab(t.dataset.tab)));
    renderClassChips($('#classPick'), n => { pickClass = n; renderClassChips($('#classPick'), null, pickClass); updateOpenBtn(); }, pickClass);
    renderClassChips($('#recClassPick'), n => loadRecords(n), null);
    DB.on('sets', v => { sets = v || {}; renderSetPick(); renderSetList(); }, denied);
    $('#btnOpenRoom').addEventListener('click', createRoom);
    $('#btnNewSet').addEventListener('click', () => openEditor(null));
    const demoLink = $('#demoPlayLink');
    if (demoLink) demoLink.href = 'play.html';
  }

  function selectTab(name) {
    $$('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === name)));
    ['open', 'sets', 'records'].forEach(n => $('#tab-' + n).classList.toggle('hidden', n !== name));
  }

  function renderClassChips(el, onPick, selected) {
    if (onPick) el._onPick = onPick;
    el.innerHTML = '';
    for (let n = 1; n <= C.classCount; n++) {
      const b = document.createElement('button');
      b.className = 'class-chip';
      b.textContent = n + '반';
      b.setAttribute('aria-pressed', String(selected === n));
      b.addEventListener('click', () => el._onPick(n));
      el.appendChild(b);
    }
  }

  function sortedSets() {
    return Object.entries(sets).map(([id, s]) => Object.assign({ id }, s)).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  function renderSetPick() {
    const el = $('#setPick');
    const list = sortedSets();
    if (!list.length) {
      el.innerHTML = '<div class="empty">아직 문제 세트가 없어요. <button class="btn small primary" id="goSets">문제 세트 만들기</button></div>';
      $('#goSets').addEventListener('click', () => { selectTab('sets'); openEditor(null); });
      return;
    }
    if (pickSet && !sets[pickSet]) pickSet = null;
    el.innerHTML = list.map(s => `
      <button class="set-card" data-id="${s.id}" aria-pressed="${s.id === pickSet}">
        <span class="era-chip">${esc(G.era(s.era).no)}</span>
        <span class="set-title">${esc(s.title)}</span>
        <span class="set-sub">${esc(G.era(s.era).name)} 배경, 문제 ${(s.questions || []).length}개</span>
      </button>`).join('');
    $$('#setPick .set-card').forEach(b => b.addEventListener('click', () => { pickSet = b.dataset.id; renderSetPick(); updateOpenBtn(); }));
    updateOpenBtn();
  }
  function updateOpenBtn() { $('#btnOpenRoom').disabled = !(pickClass && pickSet && sets[pickSet]); }

  function renderSetList() {
    const el = $('#setList');
    const list = sortedSets();
    if (!list.length) { el.innerHTML = '<div class="empty">아직 문제 세트가 없어요. 오른쪽 위 \'새 세트 만들기\'를 눌러 시작하세요.</div>'; return; }
    el.innerHTML = list.map(s => `
      <div class="set-row">
        <span class="era-chip">${esc(G.era(s.era).no)}</span>
        <div class="set-row-text"><strong>${esc(s.title)}</strong><span>${esc(G.era(s.era).name)} 배경, 문제 ${(s.questions || []).length}개</span></div>
        <button class="btn small" data-edit="${s.id}">고치기</button>
        <button class="btn small danger" data-del="${s.id}">지우기</button>
      </div>`).join('');
    $$('#setList [data-edit]').forEach(b => b.addEventListener('click', () => openEditor(b.dataset.edit)));
    $$('#setList [data-del]').forEach(b => b.addEventListener('click', () => {
      const s = sets[b.dataset.del];
      if (confirm(`'${s.title}' 세트를 지울까요?`)) DB.remove('sets/' + b.dataset.del).then(() => toast('세트를 지웠어요.'));
    }));
  }

  // ---------- 문제 세트 편집 ----------
  let edId = null, edRows = [];

  function openEditor(id) {
    edId = id;
    const s = id ? sets[id] : null;
    $('#edHeading').textContent = s ? '문제 세트 고치기' : '새 문제 세트';
    $('#edTitle').value = s ? s.title : '';
    $('#edEra').innerHTML = G.ERAS.map(e => `<option value="${e.id}">${esc(e.no + ' ' + e.name)}${A.hasArt(e.id) ? '' : ' (그림 준비 중)'}</option>`).join('');
    $('#edEra').value = s ? s.era : 'e7b';
    $('#edPaste').value = '';
    edRows = s ? (s.questions || []).map(q => G.validateRow({ type: q.type, q: q.q, choices: (q.choices || ['', '', '', '']).slice(), answer: q.answer })) : [];
    renderEdRows();
    $('#edMsg').textContent = '';
    show('#vEditor');
  }

  function renderEdRows() {
    const el = $('#edRows');
    if (!edRows.length) { el.innerHTML = '<div class="empty">붙여넣은 문제가 여기에 나타나요.</div>'; return; }
    el.innerHTML = edRows.map((r, i) => `
      <div class="ed-row ${r.error ? 'has-err' : ''}" data-i="${i}">
        <div class="ed-row-head">
          <strong>${i + 1}번</strong>
          <select data-f="type" aria-label="${i + 1}번 유형"><option value="ox" ${r.type === 'ox' ? 'selected' : ''}>O/X</option><option value="mc" ${r.type === 'mc' ? 'selected' : ''}>4지선다</option></select>
          <button class="btn small ghost" data-f="del">빼기</button>
        </div>
        <input type="text" data-f="q" value="${esc(r.q)}" placeholder="문제" aria-label="${i + 1}번 문제">
        ${r.type === 'mc' ? `<div class="ed-choices">${r.choices.map((c, k) => `<label class="ed-choice"><span>${'①②③④'[k]}</span><input type="text" data-f="c${k}" value="${esc(c)}" aria-label="${i + 1}번 보기 ${k + 1}"></label>`).join('')}</div>` : ''}
        <label class="ed-answer">정답
          <select data-f="answer">
            ${r.type === 'ox'
              ? ['O', 'X'].map(v => `<option value="${v}" ${r.answer === v ? 'selected' : ''}>${v}</option>`).join('')
              : [0, 1, 2, 3].map(k => `<option value="${k}" ${r.answer === k ? 'selected' : ''}>${'①②③④'[k]}</option>`).join('')}
            ${r.answer == null ? '<option value="" selected>고르기</option>' : ''}
          </select>
        </label>
        ${r.error ? `<p class="err">${esc(r.error)}</p>` : ''}
      </div>`).join('');
    $$('#edRows .ed-row').forEach(rowEl => {
      const i = +rowEl.dataset.i;
      rowEl.querySelectorAll('[data-f]').forEach(inp => {
        const f = inp.dataset.f;
        if (f === 'del') { inp.addEventListener('click', () => { edRows.splice(i, 1); renderEdRows(); }); return; }
        inp.addEventListener(inp.tagName === 'SELECT' ? 'change' : 'input', () => {
          const r = edRows[i];
          if (f === 'type') { r.type = inp.value; r.answer = null; G.validateRow(r); renderEdRows(); return; }
          if (f === 'q') r.q = inp.value;
          else if (f === 'answer') r.answer = inp.value === '' ? null : (r.type === 'ox' ? inp.value : +inp.value);
          else if (/^c\d$/.test(f)) r.choices[+f[1]] = inp.value;
          G.validateRow(r);
          rowEl.classList.toggle('has-err', !!r.error);
          const errEl = rowEl.querySelector('.err');
          if (r.error) { if (errEl) errEl.textContent = r.error; else rowEl.insertAdjacentHTML('beforeend', `<p class="err">${esc(r.error)}</p>`); }
          else if (errEl) errEl.remove();
          if (f === 'answer') renderEdRows();
        });
      });
    });
  }

  $('#edPaste').addEventListener('input', () => {
    const rows = G.parseSheet($('#edPaste').value);
    if (!rows.length) return;
    edRows = rows;
    renderEdRows();
    $('#edPaste').value = '';
    toast(`문제 ${rows.length}개를 불러왔어요.`);
  });
  $('#edCopyTpl').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(G.TEMPLATE);
      toast('양식을 복사했어요. 엑셀이나 구글 시트의 A1 칸에 붙여넣으세요.', 3500);
    } catch (e) {
      $('#edPaste').value = G.TEMPLATE;
      toast('자동 복사가 안 돼서 아래 칸에 양식을 넣었어요. 직접 복사해 주세요.', 3500);
    }
  });
  $('#edSample').addEventListener('click', () => {
    edRows = G.SAMPLE_7B.map(q => G.validateRow({ type: q.type, q: q.q, choices: (q.choices || ['', '', '', '']).slice(), answer: q.answer }));
    if (!$('#edTitle').value.trim()) $('#edTitle').value = '7-B 대중 운동과 민족 문화 수호';
    $('#edEra').value = 'e7b';
    renderEdRows();
  });
  $('#edAddRow').addEventListener('click', () => {
    edRows.push(G.validateRow({ type: 'mc', q: '', choices: ['', '', '', ''], answer: null }));
    renderEdRows();
  });
  $('#edBack').addEventListener('click', () => { show('#vHome'); selectTab('sets'); });
  $('#edSave').addEventListener('click', async () => {
    const title = $('#edTitle').value.trim();
    const msg = $('#edMsg');
    edRows.forEach(G.validateRow);
    if (!title) { msg.textContent = '세트 이름을 적어 주세요.'; return; }
    if (edRows.length !== C.questionsPerSet) { msg.textContent = `문제는 ${C.questionsPerSet}개여야 해요. 지금은 ${edRows.length}개예요.`; return; }
    const bad = edRows.findIndex(r => r.error);
    if (bad >= 0) { msg.textContent = `${bad + 1}번 문제를 확인해 주세요. ${edRows[bad].error}`; return; }
    const data = { title, era: $('#edEra').value, questions: edRows.map(G.cleanQuestion), updatedAt: DB.now() };
    try {
      if (edId) await DB.set('sets/' + edId, data);
      else await DB.push('sets', data);
      toast('저장했어요.');
      show('#vHome');
      selectTab('sets');
    } catch (e) { denied(e); }
  });

  // ---------- 반 기록 ----------
  async function loadRecords(n) {
    renderClassChips($('#recClassPick'), null, n);
    const el = $('#recList');
    el.innerHTML = '<p class="hint">불러오는 중…</p>';
    const recs = await DB.get('records/' + n).catch(e => { denied(e); return null; });
    const list = Object.values(recs || {}).sort((a, b) => b.at - a.at);
    if (!list.length) { el.innerHTML = `<div class="empty">${n}반은 아직 기록이 없어요.</div>`; return; }
    el.innerHTML = list.map(r => `
      <details class="rec">
        <summary><span class="rec-date">${fmtDate(r.at)}</span><strong>${esc(r.title)}</strong><span>${r.players}명 참여</span><span class="rec-rate">평균 정답률 ${pct(r.avgRate)}</span></summary>
        <ol class="rec-qs">${(r.questions || []).map(q => `
          <li><p>${esc(q.q)}</p><p class="hint">정답 ${esc(q.answerText)}</p>
            <div class="bar"><span style="width:${q.rate == null ? 0 : Math.round(q.rate * 100)}%"></span></div>
            <p class="bar-label">정답률 ${pct(q.rate)} (${q.total}번 풀어서 ${q.c}번 맞힘)</p></li>`).join('')}
        </ol>
      </details>`).join('');
  }

  // ---------- 게임 열기 ----------
  async function createRoom() {
    const set = sets[pickSet];
    if (!set || !pickClass) return;
    $('#btnOpenRoom').disabled = true;
    try {
      let code = null;
      for (let k = 0; k < 30; k++) {
        const c = String(1000 + Math.floor(Math.random() * 9000));
        if (!(await DB.get(`rooms/${c}/meta`))) { code = c; break; }
      }
      if (!code) throw new Error('no code');
      await DB.set('rooms/' + code, {
        meta: { classNo: pickClass, setId: pickSet, title: set.title, era: set.era, status: 'lobby', createdAt: DB.now() },
        questions: set.questions
      });
      attachRoom(code);
    } catch (e) {
      denied(e);
    } finally {
      updateOpenBtn();
    }
  }

  async function cleanupOldRooms() {
    try {
      const all = await DB.get('rooms');
      const cutoff = DB.now() - 6 * 3600 * 1000;
      Object.entries(all || {}).forEach(([code, r]) => {
        if (!r.meta || (r.meta.createdAt || 0) < cutoff) DB.remove('rooms/' + code);
      });
    } catch (e) { /* 권한 문제는 다른 곳에서 알려 줍니다 */ }
  }

  function attachRoom(code) {
    detachRoom();
    room = code;
    finishing = false;
    raceBuiltFor = '';
    localStorage.setItem('hkr-teacher-room', code);
    roomSubs.push(DB.on(`rooms/${code}/meta`, m => { meta = m; onMeta(); }, denied));
    roomSubs.push(DB.on(`rooms/${code}/players`, p => { players = p || {}; onPlayers(); }, denied));
    roomSubs.push(DB.on(`rooms/${code}/state`, s => { states = s || {}; onStates(); }, denied));
    roomSubs.push(DB.on(`rooms/${code}/questions`, q => { questions = q || []; }, denied));
    if (!tickTimer) tickTimer = setInterval(tick, 150);
  }
  function detachRoom() {
    roomSubs.forEach(off => off());
    roomSubs = [];
    room = null; meta = null; players = {}; states = {}; questions = [];
    clearInterval(tickTimer); tickTimer = null;
    SOUND.stopBgm();
  }
  async function closeRoom() {
    const code = room;
    detachRoom();
    localStorage.removeItem('hkr-teacher-room');
    if (code) await DB.remove('rooms/' + code);
    show('#vHome');
    selectTab('open');
  }

  function approvedList() {
    return Object.entries(players)
      .filter(([, p]) => p && p.status === 'approved')
      .map(([uid, p]) => ({ uid, nick: p.nick, car: p.car || 0, approvedAt: p.approvedAt || p.joinedAt || 0 }))
      .sort((a, b) => a.approvedAt - b.approvedAt);
  }
  function pendingList() {
    return Object.entries(players)
      .filter(([, p]) => p && p.status === 'pending')
      .map(([uid, p]) => ({ uid, nick: p.nick, car: p.car || 0, joinedAt: p.joinedAt || 0 }))
      .sort((a, b) => a.joinedAt - b.joinedAt);
  }

  function onMeta() {
    if (!meta) {
      if (room) { detachRoom(); localStorage.removeItem('hkr-teacher-room'); show('#vHome'); }
      return;
    }
    if (meta.status === 'lobby') { renderLobby(); if (currentView() !== '#vLobby') show('#vLobby'); }
    else if (meta.status === 'racing') { if (currentView() !== '#vRace') { show('#vRace'); buildRace(); } }
    else if (meta.status === 'finished') {
      if (!['#vResults', '#vReview'].includes(currentView())) showFinish();
    }
  }
  function onPlayers() {
    if (!meta) return;
    if (meta.status === 'lobby') renderLobby();
    if (meta.status === 'racing') { buildRace(); renderPendingPop(); }
    const p = pendingList().length;
    if (lastCount !== null && p > lastCount) SOUND.play('join');
    lastCount = p;
  }
  function onStates() {
    if (meta && meta.status === 'racing') updateRace();
  }

  // ---------- 대기실 ----------
  function renderLobby() {
    $('#lbClass').textContent = meta.classNo + '반';
    $('#lbTitle').textContent = meta.title;
    $('#lbCode').textContent = room;
    $('#lbUrl').textContent = playUrl(room);
    const qrEl = $('#lbQR');
    if (qrEl.dataset.code !== room) { renderQR(qrEl, playUrl(room), 8); qrEl.dataset.code = room; }
    const ap = approvedList();
    $('#lbCount').textContent = ap.length;
    $('#lbApproved').innerHTML = ap.length
      ? ap.map(p => `<div class="roster-item"><div class="mini-car">${A.carSVG(p.car)}</div><span>${esc(p.nick)}</span></div>`).join('')
      : '<p class="roster-empty">아직 아무도 없어요. QR을 찍고 들어와 주세요.</p>';
    renderPendingList($('#lbPending'));
    const pend = pendingList();
    $('#lbPendCount').textContent = pend.length;
    $('#lbApproveAll').disabled = !pend.length;
    $('#lbStart').disabled = !ap.length;
  }

  function renderPendingList(el) {
    const now = Date.now();
    const pend = pendingList();
    el.innerHTML = pend.length ? pend.map(p => {
      const shown = revealUntil[p.uid] > now;
      return `<li class="pending-item">
        <div class="mini-car">${A.carSVG(p.car)}</div>
        <button class="nick-mask ${shown ? 'revealed' : ''}" data-peek="${p.uid}" aria-label="닉네임 3초 동안 보기">${shown ? esc(p.nick) : '●●●'}</button>
        <button class="btn small primary" data-ok="${p.uid}">승인</button>
        <button class="btn small danger" data-no="${p.uid}">거절</button>
      </li>`;
    }).join('') : '<li class="pending-empty">기다리는 친구가 없어요.</li>';
    el.querySelectorAll('[data-peek]').forEach(b => b.addEventListener('click', () => {
      revealUntil[b.dataset.peek] = Date.now() + 3000;
      rerenderPending();
      setTimeout(rerenderPending, 3050);
    }));
    el.querySelectorAll('[data-ok]').forEach(b => b.addEventListener('click', () => approve(b.dataset.ok)));
    el.querySelectorAll('[data-no]').forEach(b => b.addEventListener('click', () => reject(b.dataset.no)));
  }
  function rerenderPending() {
    if (!meta) return;
    if (meta.status === 'lobby') renderPendingList($('#lbPending'));
    else renderPendingPop();
  }
  function approve(uid) {
    return DB.update(`rooms/${room}/players/${uid}`, { status: 'approved', approvedAt: DB.now() });
  }
  function reject(uid) {
    return DB.update(`rooms/${room}/players/${uid}`, { status: 'rejected' });
  }
  $('#lbApproveAll').addEventListener('click', () => {
    const t = DB.now();
    const upd = {};
    pendingList().forEach((p, i) => { upd[`${p.uid}/status`] = 'approved'; upd[`${p.uid}/approvedAt`] = t + i; });
    DB.update(`rooms/${room}/players`, upd);
  });
  $('#lbClose').addEventListener('click', () => {
    if (confirm('게임을 닫을까요? 들어온 학생들은 처음 화면으로 돌아가요.')) closeRoom();
  });
  $('#lbStart').addEventListener('click', async () => {
    SOUND.unlock();
    const startAt = DB.now() + 3600;
    await DB.update(`rooms/${room}/meta`, { status: 'racing', startAt, endAt: startAt + C.raceSeconds * 1000 });
  });

  // ---------- 레이스 (큰 화면) ----------
  function buildRace() {
    if (!meta) return;
    const ap = approvedList();
    const key = meta.era + '|' + ap.map(p => p.uid).join(',');
    $('#rcClass').textContent = meta.classNo + '반';
    $('#rcTitle').textContent = meta.title;
    $('#rcCode').textContent = room;
    const mini = $('#rcQR');
    if (mini.dataset.code !== room) { renderQR(mini, playUrl(room), 3); mini.dataset.code = room; }
    updateMuteBtn();
    renderPendingPop();
    if (key === raceBuiltFor) return;
    const eraChanged = !raceBuiltFor.startsWith(meta.era + '|');
    raceBuiltFor = key;
    const e = G.era(meta.era);
    if (eraChanged) {
      $('#horizon').innerHTML = e.scenes.map((name, k) => `
        <div class="scene">${A.sceneSVG(e.id, k)}<span class="scene-name">${'①②③④⑤'[k]} ${esc(name)}</span></div>`).join('');
      $('#zones').innerHTML = e.scenes.map(() => '<div class="zone"></div>').join('');
    }
    const n = Math.max(ap.length, 1);
    const lanes = $('#lanes');
    lanes.innerHTML = ap.map(p => `
      <div class="lane" data-uid="${p.uid}">
        <div class="racer" data-uid="${p.uid}">
          <span class="tag"><b class="rank-badge"></b>${esc(p.nick)}</span>
          <div class="car-box">${A.carSVG(p.car)}<span class="fx-bubble"></span><span class="fx-shield">🛡️</span><span class="fx-bolt">⚡</span></div>
        </div>
      </div>`).join('');
    lanes.style.setProperty('--n', n);
    lastRankSig = '';
    layoutRace();
    updateRace(true);
  }

  function layoutRace() {
    const track = $('#track'), course = $('#course');
    if (!track || currentView() !== '#vRace') return;
    const cw = course.clientWidth;
    const zoneW = cw * (X1 - X0) / 100 / 5;
    const horizonH = Math.min(zoneW / 1.45, window.innerHeight * 0.3);
    $('#horizon').style.height = horizonH + 'px';
    const n = Math.max(approvedList().length, 1);
    const laneH = track.clientHeight / n;
    const carH = Math.max(14, Math.min(laneH * 0.8, 70));
    course.style.setProperty('--car-w', (carH * 120 / 72) + 'px');
    course.style.setProperty('--tag-size', Math.max(11, Math.min(carH * 0.42, 24)) + 'px');
    $$('#lanes .lane').forEach((el, i) => { el.style.top = (i * laneH) + 'px'; el.style.height = laneH + 'px'; });
  }
  window.addEventListener('resize', () => { if (currentView() === '#vRace') layoutRace(); });

  const FX_TEXT = {
    boost1: () => C.items.boost1.icon + ' +1',
    boost2: () => C.items.boost2.icon + ' +2',
    shield: () => C.items.shield.icon + ' 방패!',
    block: () => C.items.shield.icon + ' 막았다!',
    balloon: () => C.items.balloon.icon + ' 갇혔다!',
    lightning: () => C.items.lightning.icon + ' 맞았다!',
    fuel: () => C.items.fuel.icon,
    ink: () => C.items.ink.icon,
    finish: () => '🏁 완주!'
  };

  function updateRace(initial) {
    if (!meta) return;
    const now = DB.now();
    const ap = approvedList();
    const ranked = G.ranking(ap, states);
    const rankOf = {};
    ranked.forEach(r => { rankOf[r.uid] = r.rank; });
    ap.forEach(p => {
      const racer = document.querySelector(`.racer[data-uid="${p.uid}"]`);
      if (!racer) return;
      const s = states[p.uid] || {};
      const pos = Math.min(s.pos || 0, C.finishCells);
      racer.style.left = `calc(${X0}% + ${(X1 - X0) * pos / C.finishCells}%)`;
      const fx = s.fx || {};
      const age = now - (fx.at || 0);
      racer.classList.toggle('trapped', now < (s.frozenUntil || 0) && (fx.type === 'balloon' || fx.type === 'lightning'));
      racer.classList.toggle('smoking', now < (s.frozenUntil || 0) && fx.type === 'fuel');
      racer.classList.toggle('inked', now < (s.blindUntil || 0));
      racer.classList.toggle('shielded', !!s.shield);
      racer.classList.toggle('boosting', (fx.type === 'boost1' || fx.type === 'boost2') && age < 900);
      racer.classList.toggle('struck', fx.type === 'lightning' && age < 800);
      racer.classList.toggle('done', !!s.finishedAt);
      const r = rankOf[p.uid];
      const badge = racer.querySelector('.rank-badge');
      badge.textContent = r <= 3 && (s.pos || s.finishedAt) ? r : '';
      badge.dataset.rank = r;
      if (fx.at && seenFx[p.uid] !== fx.at) {
        const fresh = seenFx[p.uid] !== undefined || !initial;
        seenFx[p.uid] = fx.at;
        if (fresh && age < 3000 && FX_TEXT[fx.type]) {
          const f = document.createElement('span');
          f.className = 'fx-float fx-' + fx.type;
          f.textContent = FX_TEXT[fx.type]();
          racer.querySelector('.car-box').appendChild(f);
          setTimeout(() => f.remove(), 1300);
          SOUND.play(fx.type);
        }
      }
    });
    const sig = ranked.slice(0, 10).map(r => r.uid + r.pos + (r.finishedAt ? 'f' : '')).join('|');
    if (sig === lastRankSig) return;
    lastRankSig = sig;
    $('#liveRank').innerHTML = ranked.slice(0, 10).map(r => `
      <li data-rank="${r.rank}"><span class="lr-rank">${r.rank}</span><span class="lr-car">${A.carSVG(r.car)}</span><span class="lr-nick">${esc(r.nick)}</span><span class="lr-pos">${r.finishedAt ? '🏁' : r.pos + '칸'}</span></li>`).join('');
  }

  let lastCountShown = null, lastTickSec = null;
  function tick() {
    if (!meta || !room) return;
    const now = DB.now();
    if (meta.status === 'racing') {
      const cd = $('#countdown');
      if (now < meta.startAt) {
        const n = Math.ceil((meta.startAt - now) / 1000);
        if (n !== lastCountShown) { lastCountShown = n; cd.textContent = n; cd.classList.remove('hidden', 'go'); SOUND.play('count'); }
        $('#rcTimer').textContent = fmtTime(C.raceSeconds * 1000);
      } else {
        if (now - meta.startAt < 900) {
          if (lastCountShown !== 0) { lastCountShown = 0; cd.textContent = '출발!'; cd.classList.remove('hidden'); cd.classList.add('go'); SOUND.play('go'); SOUND.startBgm(); }
        } else if (!cd.classList.contains('hidden')) {
          cd.classList.add('hidden');
          SOUND.startBgm();
        }
        const left = meta.endAt - now;
        $('#rcTimer').textContent = fmtTime(left);
        $('#rcTimer').classList.toggle('hurry', left < 30000);
        SOUND.setIntensity(left < 30000);
        const sec = Math.ceil(left / 1000);
        if (left > 0 && sec <= 10 && sec !== lastTickSec) { lastTickSec = sec; SOUND.play('tick'); }
      }
      updateRace();
      const ap = approvedList();
      const allDone = ap.length > 0 && ap.every(p => states[p.uid] && states[p.uid].finishedAt);
      if (now >= meta.endAt || (now > meta.startAt && allDone)) finishRace();
    }
  }

  async function finishRace() {
    if (finishing || !meta || meta.status !== 'racing') return;
    finishing = true;
    SOUND.stopBgm();
    SOUND.play('end');
    await DB.update(`rooms/${room}/meta`, { status: 'finished', endedAt: DB.now() });
    await saveRecord();
  }

  async function saveRecord() {
    const m = await DB.get(`rooms/${room}/meta`);
    if (!m || m.recordKey) return;
    const qs = questions || [];
    const stats = G.questionStats(qs, states);
    let c = 0, total = 0;
    stats.forEach(s => { c += s.c; total += s.total; });
    const rec = {
      at: DB.now(),
      title: m.title,
      era: m.era,
      setId: m.setId || '',
      players: approvedList().length,
      avgRate: total ? c / total : null,
      questions: qs.map((q, i) => ({ q: q.q, answerText: G.answerText(q), c: stats[i].c, w: stats[i].w, t: stats[i].t, total: stats[i].total, rate: stats[i].rate }))
    };
    try {
      const key = await DB.push('records/' + m.classNo, rec);
      await DB.update(`rooms/${room}/meta`, { recordKey: key });
    } catch (e) { denied(e); }
  }

  $('#rcStop').addEventListener('click', () => {
    if (confirm('지금 레이스를 끝내고 결과를 볼까요?')) finishRace();
  });
  function updateMuteBtn() { $('#rcMute').textContent = SOUND.isMuted() ? '소리 켜기' : '소리 끄기'; }
  $('#rcMute').addEventListener('click', () => { SOUND.toggle(); updateMuteBtn(); });

  // 레이스 중 승인
  function renderPendingPop() {
    const n = pendingList().length;
    $('#rcPendCount').textContent = n;
    $('#rcPending').classList.toggle('hidden', !n);
    if (!n) $('#pendingPop').classList.add('hidden');
    renderPendingList($('#ppList'));
  }
  $('#rcPending').addEventListener('click', () => $('#pendingPop').classList.toggle('hidden'));
  $('#ppClose').addEventListener('click', () => $('#pendingPop').classList.add('hidden'));

  // ---------- 결과 ----------
  function showFinish() {
    show('#vRace');
    const cd = $('#countdown');
    cd.textContent = '경기 끝!';
    cd.classList.remove('hidden');
    cd.classList.add('go');
    setTimeout(() => {
      cd.classList.add('hidden');
      if (meta && meta.status === 'finished') { renderResults(); show('#vResults'); }
    }, 1600);
  }

  function renderResults() {
    $('#rsClass').textContent = meta.classNo + '반';
    const ranked = G.ranking(approvedList(), states);
    const order = [1, 0, 2]; // 2위, 1위, 3위 순서로 놓기
    $('#podium').innerHTML = order.map(i => {
      const r = ranked[i];
      if (!r) return '<div class="podium-col empty"></div>';
      return `<div class="podium-col p${r.rank}">
        <div class="podium-car">${A.carSVG(r.car)}</div>
        <div class="podium-nick">${esc(r.nick)}</div>
        <div class="podium-block"><span>${r.rank}</span></div>
      </div>`;
    }).join('');
    $('#allRank').innerHTML = ranked.map(r => `
      <li class="${r.rank <= 3 ? 'top' : ''}">
        <span class="ar-rank">${r.rank}위</span>
        <span class="ar-car">${A.carSVG(r.car)}</span>
        <span class="ar-nick">${esc(r.nick)}</span>
        <span class="ar-pos">${r.finishedAt ? '완주' : r.pos + '칸'}</span>
        <span class="ar-acc">정답 ${r.correct}개, 정답률 ${r.correct + r.wrong ? Math.round(r.acc * 100) + '%' : '-'}</span>
      </li>`).join('') || '<li>참여한 학생이 없어요.</li>';
  }
  $('#rsReview').addEventListener('click', () => { renderReview(); show('#vReview'); });

  // ---------- 다시 풀어 보기 ----------
  function renderReview() {
    const stats = G.questionStats(questions, states);
    const rated = stats.filter(s => s.rate != null);
    const worst = rated.length ? rated.reduce((a, b) => (b.rate < a.rate ? b : a)) : null;
    $('#reviewList').innerHTML = (questions || []).map((q, i) => {
      const st = stats[i];
      const body = q.type === 'ox'
        ? `<div class="rv-ox"><span class="ox o" data-correct="${q.answer === 'O'}">O</span><span class="ox x" data-correct="${q.answer === 'X'}">X</span></div>`
        : `<ol class="rv-choices">${q.choices.map((c, k) => `<li data-correct="${q.answer === k}"><b>${'①②③④'[k]}</b> ${esc(c)}</li>`).join('')}</ol>`;
      return `<article class="rv-card ${worst && worst.i === i ? 'worst' : ''}">
        <div class="rv-head"><span class="rv-no">${i + 1}번</span>${worst && worst.i === i ? '<span class="rv-flag">가장 많이 틀린 문제</span>' : ''}</div>
        <p class="rv-q">${esc(q.q)}</p>
        ${body}
        <div class="bar"><span style="width:${st.rate == null ? 0 : Math.round(st.rate * 100)}%"></span></div>
        <p class="bar-label">정답률 ${pct(st.rate)} (${st.total}번 풀어서 ${st.c}번 맞힘)</p>
        <button class="btn small yellow" data-reveal>정답 보기</button>
      </article>`;
    }).join('');
    $$('#reviewList [data-reveal]').forEach(b => b.addEventListener('click', () => {
      const card = b.closest('.rv-card');
      card.classList.toggle('show-answer');
      b.textContent = card.classList.contains('show-answer') ? '정답 가리기' : '정답 보기';
    }));
  }
  $('#rvBack').addEventListener('click', () => show('#vResults'));
  $('#rvEnd').addEventListener('click', () => {
    if (confirm('끝낼까요? 닉네임과 이번 판 화면은 지워지고, 반 기록(문제별 정답률)은 남아요.')) closeRoom();
  });

  boot();
})();
