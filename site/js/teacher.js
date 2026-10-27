/* 선생님 화면: 로그인, 문제 세트, 게임 열기, 대기실, 레이스(큰 화면), 결과, 다시 풀기, 반 기록 */
(function () {
  const C = window.APP_CONFIG, G = window.GAME, A = window.ART;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
  // QR은 항상 학생이 열 수 있는 실제 사이트 주소로 만듭니다(내 컴퓨터 시험 주소에서 열었더라도)
  function playUrl(code) {
    const local = location.protocol === 'file:' || /^(localhost|127.0.0.1)$/.test(location.hostname);
    const base = local && C.publicUrl ? C.publicUrl : location.href;
    return new URL('play.html?room=' + code, base).href;
  }
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
    $('#btnOpenRoom').addEventListener('click', () => { SOUND.unlock(); createRoom(); });
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

  // 세트 이름 앞의 책과 단원 번호로 묶어 정렬합니다. 기본은 내림차순.
  //  "한국사1 3-07 동학 농민 운동" → 한국사1 대단원 3, "2-10 4·19 혁명"(책 이름 없음) → 한국사2 대단원 2
  let setOrder = 'desc';
  try { setOrder = localStorage.getItem('hkr-set-order') || 'desc'; } catch (e) { /* 무시 */ }
  function setCode(title) {
    const m = /^\s*(?:한국사\s*([12])\s+)?(\d+)\s*-\s*(\d+)/.exec(title || '');
    return m ? [m[1] ? +m[1] : 2, +m[2], +m[3]] : null;
  }
  function sortedSets() {
    const dir = setOrder === 'asc' ? 1 : -1;
    return Object.entries(sets).map(([id, s]) => Object.assign({ id, code: setCode(s.title) }, s)).sort((a, b) => {
      if (a.code && b.code) return dir * ((a.code[0] - b.code[0]) || (a.code[1] - b.code[1]) || (a.code[2] - b.code[2]));
      if (a.code) return -1;
      if (b.code) return 1;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });
  }
  // 책·대단원 제목줄을 끼워 넣으며 목록을 만듭니다
  function groupedHtml(list, itemHtml) {
    let last = null, html = '';
    list.forEach(s => {
      const unit = s.code ? `한국사${s.code[0]} 대단원 ${s.code[1]}` : '단원 번호가 없는 세트';
      if (unit !== last) { html += `<h3 class="unit-head">${unit}</h3>`; last = unit; }
      html += itemHtml(s);
    });
    return html;
  }
  function orderBtnText() { return setOrder === 'asc' ? '단원 번호 작은 순' : '단원 번호 큰 순'; }
  $$('[data-set-order]').forEach(b => {
    b.textContent = orderBtnText();
    b.addEventListener('click', () => {
      setOrder = setOrder === 'asc' ? 'desc' : 'asc';
      try { localStorage.setItem('hkr-set-order', setOrder); } catch (e) { /* 무시 */ }
      $$('[data-set-order]').forEach(x => { x.textContent = orderBtnText(); });
      renderSetPick();
      renderSetList();
    });
  });

  function renderSetPick() {
    const el = $('#setPick');
    const list = sortedSets();
    if (!list.length) {
      el.innerHTML = '<div class="empty">아직 문제 세트가 없어요. <button class="btn small primary" id="goSets">문제 세트 만들기</button></div>';
      $('#goSets').addEventListener('click', () => { selectTab('sets'); openEditor(null); });
      return;
    }
    if (pickSet && !sets[pickSet]) pickSet = null;
    el.innerHTML = groupedHtml(list, s => `
      <button class="set-card" data-id="${s.id}" aria-pressed="${s.id === pickSet}">
        <span class="era-chip">${esc(G.era(s.era).no)}</span>
        <span class="set-title">${esc(s.title)}</span>
        <span class="set-sub">${esc(G.era(s.era).name)} 배경, 문제 ${(s.questions || []).length}개</span>
      </button>`);
    $$('#setPick .set-card').forEach(b => b.addEventListener('click', () => { pickSet = b.dataset.id; renderSetPick(); updateOpenBtn(); }));
    updateOpenBtn();
  }
  function updateOpenBtn() { $('#btnOpenRoom').disabled = !(pickClass && pickSet && sets[pickSet]); }

  function renderSetList() {
    const el = $('#setList');
    const list = sortedSets();
    if (!list.length) { el.innerHTML = '<div class="empty">아직 문제 세트가 없어요. 오른쪽 위 \'새 세트 만들기\'를 눌러 시작하세요.</div>'; return; }
    el.innerHTML = groupedHtml(list, s => `
      <div class="set-row">
        <span class="era-chip">${esc(G.era(s.era).no)}</span>
        <div class="set-row-text"><strong>${esc(s.title)}</strong><span>${esc(G.era(s.era).name)} 배경, 문제 ${(s.questions || []).length}개</span></div>
        <button class="btn small" data-edit="${s.id}">고치기</button>
        <button class="btn small danger" data-del="${s.id}">지우기</button>
      </div>`);
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
    edRows = s ? (s.questions || []).map(q => G.validateRow({ type: q.type, q: q.q, choices: (q.choices || ['', '', '', '']).slice(), answer: q.answer, alt: (q.alt || []).join(', ') })) : [];
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
          <select data-f="type" aria-label="${i + 1}번 유형"><option value="ox" ${r.type === 'ox' ? 'selected' : ''}>O/X</option><option value="mc" ${r.type === 'mc' ? 'selected' : ''}>4지선다</option><option value="sa" ${r.type === 'sa' ? 'selected' : ''}>단답형</option></select>
          <button class="btn small ghost" data-f="del">빼기</button>
        </div>
        <input type="text" data-f="q" value="${esc(r.q)}" placeholder="문제" aria-label="${i + 1}번 문제">
        ${r.type === 'mc' ? `<div class="ed-choices">${r.choices.map((c, k) => `<label class="ed-choice"><span>${'①②③④'[k]}</span><input type="text" data-f="c${k}" value="${esc(c)}" aria-label="${i + 1}번 보기 ${k + 1}"></label>`).join('')}</div>` : ''}
        ${r.type === 'sa' ? `<div class="ed-sa">
          <label class="ed-answer">정답 <input type="text" data-f="answer" value="${esc(r.answer || '')}" placeholder="예: 봉오동 전투" aria-label="${i + 1}번 정답"></label>
          <label class="ed-answer">함께 맞다고 할 답 <input type="text" data-f="alt" value="${esc(r.alt || '')}" placeholder="쉼표로 나눠요. 예: 봉오동" aria-label="${i + 1}번 다른 정답"></label>
          <p class="hint">띄어쓰기와 가운뎃점(·)은 달라도 맞다고 봐요.${C.saHint !== false && r.answer ? ` 학생 힌트: ${esc(G.choHint(r.answer))}` : ''}</p>
        </div>` : `<label class="ed-answer">정답
          <select data-f="answer">
            ${r.type === 'ox'
              ? ['O', 'X'].map(v => `<option value="${v}" ${r.answer === v ? 'selected' : ''}>${v}</option>`).join('')
              : [0, 1, 2, 3].map(k => `<option value="${k}" ${r.answer === k ? 'selected' : ''}>${'①②③④'[k]}</option>`).join('')}
            ${r.answer == null ? '<option value="" selected>고르기</option>' : ''}
          </select>
        </label>`}
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
          else if (f === 'answer') r.answer = inp.value === '' ? null : (r.type === 'mc' ? +inp.value : inp.value);
          else if (f === 'alt') r.alt = inp.value;
          else if (/^c\d$/.test(f)) r.choices[+f[1]] = inp.value;
          G.validateRow(r);
          rowEl.classList.toggle('has-err', !!r.error);
          const errEl = rowEl.querySelector('.err');
          if (r.error) { if (errEl) errEl.textContent = r.error; else rowEl.insertAdjacentHTML('beforeend', `<p class="err">${esc(r.error)}</p>`); }
          else if (errEl) errEl.remove();
          if (f === 'answer' && r.type !== 'sa') renderEdRows();
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
  let recClass = null, recList = [], recMode = 'q';
  $$('#recMode [data-mode]').forEach(b => b.addEventListener('click', () => {
    recMode = b.dataset.mode;
    $$('#recMode [data-mode]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderRecords();
  }));

  async function loadRecords(n) {
    recClass = n;
    renderClassChips($('#recClassPick'), null, n);
    $('#recMode').classList.remove('hidden');
    const el = $('#recList');
    el.innerHTML = '<p class="hint">불러오는 중…</p>';
    const recs = await DB.get('records/' + n).catch(e => { denied(e); return null; });
    recList = Object.values(recs || {}).sort((a, b) => b.at - a.at);
    renderRecords();
  }

  function renderRecords() {
    const el = $('#recList'), n = recClass, list = recList;
    if (!n) return;
    if (!list.length) { el.innerHTML = `<div class="empty">${n}반은 아직 기록이 없어요.</div>`; return; }
    if (recMode === 's') { renderStudents(); return; }
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

  // 학생별 추수지도: 출석번호마다 틀린 문제를 단원별로 모읍니다.
  function studentReview(no) {
    const byKey = {};
    recList.slice().reverse().forEach(r => {
      const s = r.students && r.students['n' + no];
      if (!s) return;
      (r.questions || []).forEach((q, i) => {
        const st = s[i];
        if (!st) return;
        const key = r.title + '\n' + q.q;
        const it = byKey[key] || (byKey[key] = { title: r.title, q: q.q, answerText: q.answerText, c: 0, w: 0, t: 0, last: 0 });
        it.c += st.c || 0; it.w += st.w || 0; it.t += st.t || 0; it.last = Math.max(it.last, r.at);
      });
    });
    const items = Object.values(byKey).filter(it => it.w > 0 || (it.c === 0 && it.t > 0));
    items.forEach(it => { it.missed = it.c === 0; });
    items.sort((a, b) => (b.missed - a.missed) || (b.w - a.w));
    const played = recList.some(r => r.students && r.students['n' + no]);
    return { items, played };
  }

  let pickedStudent = null;
  function renderStudents() {
    const el = $('#recList');
    const cards = [];
    for (let no = 1; no <= (C.studentsPerClass || 30); no++) {
      const { items, played } = studentReview(no);
      const missed = items.filter(i => i.missed).length, fixed = items.length - missed;
      cards.push(`<button class="stu-card ${pickedStudent === no ? 'on' : ''}" data-no="${no}" ${played ? '' : 'disabled'}>
        <strong>${no}번</strong>
        ${!played ? '<span class="stu-none">기록 없음</span>'
          : items.length ? `${missed ? `<span class="stu-miss">못 맞힘 ${missed}</span>` : ''}${fixed ? `<span class="stu-fix">다시 맞힘 ${fixed}</span>` : ''}`
          : '<span class="stu-ok">모두 맞힘</span>'}
      </button>`);
    }
    el.innerHTML = `<div class="row-between"><p class="hint">번호를 누르면 그 학생이 틀린 문제가 단원별로 나와요. 끝내 못 맞힌 문제가 맨 위에 와요.</p>
        <button class="btn small" id="classExcel">반 전체 엑셀로 저장</button></div>
      <div class="stu-grid">${cards.join('')}</div><div id="stuDetail"></div>`;
    $$('#recList .stu-card').forEach(b => b.addEventListener('click', () => { pickedStudent = +b.dataset.no; renderStudents(); }));
    $('#classExcel').addEventListener('click', saveClassExcel);
    if (pickedStudent) renderStudentDetail(pickedStudent);
  }

  // ---------- 파일로 저장 ----------
  function downloadFile(name, mime, content) {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast(`'${name}' 파일을 저장했어요. 다운로드 폴더를 확인하세요.`, 3500);
  }
  function today() { const d = new Date(); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`; }

  // 반 전체: 학생별 틀린 문제를 한 줄씩 (엑셀에서 열리는 CSV, 한글 깨짐 방지 BOM 포함)
  function saveClassExcel() {
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const rows = [['출석번호', '단원', '문제', '정답', '상태', '틀린 횟수', '시간 초과 횟수']];
    for (let no = 1; no <= (C.studentsPerClass || 30); no++) {
      const { items, played } = studentReview(no);
      if (!played) continue;
      if (!items.length) { rows.push([no, '', '틀린 문제 없음', '', '모두 맞힘', 0, 0]); continue; }
      items.forEach(it => rows.push([no, it.title, it.q, it.answerText, it.missed ? '끝내 못 맞힘' : '틀렸다가 맞힘', it.w, it.t]));
    }
    if (rows.length === 1) { toast('아직 저장할 기록이 없어요.'); return; }
    downloadFile(`${recClass}반_추수지도_${today()}.csv`, 'text/csv;charset=utf-8', '﻿' + rows.map(r => r.map(q).join(',')).join('\r\n'));
  }

  // 학생 한 명: 복습 쪽지를 워드 파일로 (한글 프로그램에서도 열 수 있어요)
  function saveStudentWord(no) {
    const body = `<h1>${recClass}반 ${no}번 한국사 복습</h1><p>다시 풀어 볼 문제와 정답이에요. 정답을 가리고 먼저 풀어 보세요.</p>${studentSheet(no)}`;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>복습</title>
      <style>body{font-family:'Malgun Gothic',sans-serif;font-size:11pt} h1{font-size:18pt} h4{font-size:12pt;color:#555;margin:14pt 0 4pt} .stu-q{font-weight:bold;margin:0} .stu-a{margin:2pt 0 0;color:#0066cc} .stu-meta{margin:2pt 0 8pt;color:#777;font-size:10pt} li.missed .stu-meta{color:#d70015}</style></head><body>${body}</body></html>`;
    downloadFile(`${recClass}반_${no}번_복습_${today()}.doc`, 'application/msword', '﻿' + html);
  }

  function studentSheet(no) {
    const { items } = studentReview(no);
    if (!items.length) return `<p class="hint">${no}번 학생은 틀린 문제가 없어요.</p>`;
    const groups = {};
    items.forEach(it => { (groups[it.title] = groups[it.title] || []).push(it); });
    return Object.entries(groups).map(([title, its]) => `
      <section class="stu-unit"><h4>${esc(title)}</h4>
        <ol>${its.map(it => `
          <li class="${it.missed ? 'missed' : ''}">
            <p class="stu-q">${esc(it.q)}</p>
            <p class="stu-a">정답 ${esc(it.answerText)}</p>
            <p class="stu-meta">${it.missed ? '끝내 못 맞힘' : '틀렸다가 맞힘'}, 틀린 횟수 ${it.w}번${it.t ? `, 시간 초과 ${it.t}번` : ''}</p>
          </li>`).join('')}</ol>
      </section>`).join('');
  }

  function renderStudentDetail(no) {
    $('#stuDetail').innerHTML = `<div class="stu-detail">
      <div class="row-between"><h3>${recClass}반 ${no}번 복습 목록</h3><div class="row-gap"><button class="btn small" id="stuWord">워드 파일로 저장</button><button class="btn small" id="stuPrint">인쇄하기</button></div></div>
      ${studentSheet(no)}</div>`;
    $('#stuWord').addEventListener('click', () => saveStudentWord(no));
    $('#stuPrint').addEventListener('click', () => {
      $('#printArea').innerHTML = `<h1>${recClass}반 ${no}번 한국사 복습</h1><p class="print-sub">다시 풀어 볼 문제와 정답이에요. 정답을 가리고 먼저 풀어 보세요.</p>${studentSheet(no)}`;
      window.print();
    });
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
        meta: { classNo: pickClass, setId: pickSet, title: set.title, era: set.era, track: TRACKS.pick(), status: 'lobby', createdAt: DB.now() },
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
      .map(([uid, p]) => ({ uid, nick: p.nick, car: p.car || 0, no: p.no || null, approvedAt: p.approvedAt || p.joinedAt || 0 }))
      .sort((a, b) => a.approvedAt - b.approvedAt);
  }
  // 같은 학생: 출석번호와 닉네임이 같으면 한 사람으로 봐요.
  // 와이파이가 약해 QR을 다시 찍거나 다른 앱(카메라→사파리·카카오톡)으로 열면 새 사람처럼 또 들어오기 때문이에요.
  const sameKey = p => (p && p.no ? p.no + '|' + String(p.nick || '').replace(/\s/g, '').toLowerCase() : null);
  const live = p => p && (p.status === 'pending' || p.status === 'approved');
  // uid와 같은 학생으로 들어온 다른 기록들
  function twinsOf(uid) {
    const key = sameKey(players[uid]);
    return key ? Object.keys(players).filter(id => id !== uid && live(players[id]) && sameKey(players[id]) === key) : [];
  }

  // 승인 대기·입장한 학생 중 출석번호가 겹치는 번호들 (같은 학생이 여러 번 들어온 것은 빼고, 닉네임이 다른 친구끼리만)
  function dupNumbers() {
    const keys = {}, dup = new Set();
    Object.values(players).forEach(p => {
      if (!live(p) || !p.no) return;
      (keys[p.no] = keys[p.no] || new Set()).add(sameKey(p));
    });
    Object.keys(keys).forEach(no => { if (keys[no].size > 1) dup.add(+no); });
    return dup;
  }
  const dupFlag = (no, dup) => (no && dup.has(no) ? `<b class="bad-flag dup-flag" title="같은 번호로 들어온 다른 친구가 있어요">번호 겹침</b>` : '');

  // 같은 학생이 여러 번 들어왔으면 가장 나중에 들어온 것 하나만 보여 줘요(again: 다시 들어온 횟수)
  function pendingList() {
    const all = Object.entries(players)
      .filter(([, p]) => p && p.status === 'pending')
      .map(([uid, p]) => ({ uid, nick: p.nick, car: p.car || 0, no: p.no || null, joinedAt: p.joinedAt || 0 }));
    const newer = (id, p) => { const j = players[id].joinedAt || 0; return j > p.joinedAt || (j === p.joinedAt && id > p.uid); };
    return all.filter(p => !twinsOf(p.uid).some(id => players[id].status === 'pending' && newer(id, p)))
      .map(p => Object.assign(p, { again: twinsOf(p.uid).length }))
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
    if (meta && meta.status === 'racing') { updateRace(); updateBackdrop(); }
  }

  // ---------- 대기실 ----------
  function renderLobby() {
    if (Object.keys(players).length) SOUND.startBgm('lobby');  // 학생이 처음 들어오면 음악 시작
    updateMuteBtn();
    $('#lbClass').textContent = meta.classNo + '반';
    $('#lbTitle').textContent = meta.title;
    $('#lbCode').textContent = room;
    $('#lbUrl').textContent = playUrl(room);
    const qrEl = $('#lbQR');
    if (qrEl.dataset.code !== room) { renderQR(qrEl, playUrl(room), 8); qrEl.dataset.code = room; }
    const ap = approvedList();
    $('#lbCount').textContent = ap.length;
    const dup = dupNumbers();
    $('#lbApproved').innerHTML = ap.length
      ? ap.map(p => `<div class="roster-item"><div class="mini-car">${A.carSVG(p.car)}</div><span class="roster-nick${Array.from(p.nick).length > 6 ? ' long' : ''}">${p.no ? `<small class="r-no">${p.no}</small>` : ''}${esc(p.nick)}</span>${dupFlag(p.no, dup)}<button class="kick-x" data-kick="${p.uid}" title="${esc(p.nick)} 강퇴" aria-label="${esc(p.nick)} 강퇴">강퇴</button></div>`).join('')
      : '<p class="roster-empty">아직 아무도 없어요. QR을 찍고 들어와 주세요.</p>';
    $$('#lbApproved [data-kick]').forEach(b => b.addEventListener('click', () => kick(b.dataset.kick)));
    renderPendingList($('#lbPending'));
    const pend = pendingList();
    $('#lbPendCount').textContent = pend.length;
    $('#lbApproveAll').disabled = !pend.length;
    $('#lbStart').disabled = !ap.length;
  }

  // 승인 대기: 닉네임은 선생님 화면에 그대로 보이고, 금칙어가 섞여 있으면 경고를 붙입니다
  function renderPendingList(el) {
    const pend = pendingList(), dup = dupNumbers();
    el.innerHTML = pend.length ? pend.map(p => {
      const bad = G.bannedWordIn(p.nick);
      return `<li class="pending-item ${bad ? 'is-bad' : ''}">
        <div class="mini-car">${A.carSVG(p.car)}</div>
        <span class="p-no">${p.no ? p.no + '번' : '번호 없음'}</span>
        <span class="nick-show">${esc(p.nick)}${bad ? '<b class="bad-flag">금칙어</b>' : ''}${dupFlag(p.no, dup)}${p.again ? `<b class="again-flag" title="같은 학생이 다시 접속했어요. 승인하면 예전 접속은 지워져요">다시 접속</b>` : ''}</span>
        <button class="btn small primary" data-ok="${p.uid}" ${bad ? 'disabled' : ''}>승인</button>
        <button class="btn small" data-no="${p.uid}" title="닉네임을 다시 입력하게 해요">거절</button>
        <button class="btn small danger" data-kick="${p.uid}" title="이번 게임에서 내보내요">강퇴</button>
      </li>`;
    }).join('') : '<li class="pending-empty">기다리는 친구가 없어요.</li>';
    el.querySelectorAll('[data-ok]').forEach(b => b.addEventListener('click', () => approve(b.dataset.ok)));
    el.querySelectorAll('[data-no]').forEach(b => b.addEventListener('click', () => reject(b.dataset.no)));
    el.querySelectorAll('[data-kick]').forEach(b => b.addEventListener('click', () => kick(b.dataset.kick)));
  }
  function rerenderPending() {
    if (!meta) return;
    if (meta.status === 'lobby') renderPendingList($('#lbPending'));
    else renderPendingPop();
  }
  // 승인할 때 같은 학생의 예전 접속 기록은 지워요. 이미 달리고 있었으면 그 기록(위치·정답)을 새 접속으로 옮겨요.
  function approveUpdates(uid, at) {
    const upd = { [`players/${uid}/status`]: 'approved', [`players/${uid}/approvedAt`]: at };
    const old = twinsOf(uid);
    const carry = old.filter(id => players[id].status === 'approved' && states && states[id])
      .sort((a, b) => (states[b].pos || 0) - (states[a].pos || 0))[0];
    if (carry && !(states && states[uid])) upd[`state/${uid}`] = states[carry];
    old.forEach(id => { upd[`players/${id}`] = null; upd[`state/${id}`] = null; });
    return upd;
  }
  function approve(uid) {
    return DB.update(`rooms/${room}`, approveUpdates(uid, DB.now()));
  }
  function reject(uid) {
    return DB.update(`rooms/${room}/players/${uid}`, { status: 'rejected' });
  }
  // 강퇴: 이번 게임에서 내보내고 다시 들어오지 못하게 합니다
  function kick(uid) {
    const p = players[uid];
    if (!p) return;
    if (!confirm(`'${p.nick}'${p.no ? ` (${p.no}번)` : ''} 학생을 이번 게임에서 강퇴할까요? 이 게임에는 다시 들어올 수 없어요.`)) return;
    return DB.update(`rooms/${room}/players/${uid}`, { status: 'kicked' }).then(() => toast(`${p.nick} 학생을 강퇴했어요.`));
  }
  $('#lbApproveAll').addEventListener('click', () => {
    const t = DB.now();
    const upd = {};
    pendingList().filter(p => !G.bannedWordIn(p.nick)).forEach((p, i) => Object.assign(upd, approveUpdates(p.uid, t + i)));
    DB.update(`rooms/${room}`, upd);
  });
  $('#lbClose').addEventListener('click', () => {
    if (confirm('게임을 닫을까요? 들어온 학생들은 처음 화면으로 돌아가요.')) closeRoom();
  });
  $('#lbStart').addEventListener('click', async () => {
    SOUND.unlock();
    SOUND.stopBgm();
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
    if (mini.dataset.code !== room) { renderQR(mini, playUrl(room), 6); mini.dataset.code = room; }
    $('#rcCode2').textContent = room;
    updateMuteBtn();
    renderPendingPop();
    if (key === raceBuiltFor) return;
    const eraChanged = !raceBuiltFor.startsWith(meta.era + '|');
    raceBuiltFor = key;
    if (eraChanged) updateBackdrop(true);
    $('#lanes').innerHTML = ap.map(p => `
      <div class="racer" data-uid="${p.uid}">
        <span class="tag"><b class="rank-badge"></b>${esc(p.nick)}</span>
        <div class="car-box"><span class="fx-flame"></span><span class="fx-aura"></span><span class="fx-hit"></span>${A.carSVG(p.car)}<span class="fx-bubble"></span><span class="fx-shield">🛡️</span><span class="fx-bolt">⚡</span></div>
      </div>`).join('');
    lastRankSig = '';
    layoutRace();
    if (geo && trackToastFor !== room) { trackToastFor = room; toast('🏁 이번 코스: ' + geo.name, 3000); }
    updateRace(true);
    startCarLoop();
  }

  // ---------- 레이스 코스 (코스 5종은 tracks.js) ----------
  // 게임을 열 때 정해진 코스(meta.track)를 그립니다. 길 뒤에는 단원 장면이 화면 가득 깔려요.
  let geo = null;
  function trackType() { return (meta && meta.track) || 'oval'; }

  // ---------- 배경: 학생들이 문제를 풀 때마다 단원의 주요 장면이 화면 가득 바뀌어요 ----------
  // 너무 자주 바뀌면 어지러워서 한 장면은 적어도 BG_HOLD 동안 보여 줍니다(①→②→…→⑤→① 차례로).
  const BG_HOLD = 5000;
  let bgIdx = -1, bgAt = 0, bgSolved = 0, bgFront = 0, bgRoom = null;
  function solvedCount() {
    return Object.values(states || {}).reduce((n, s) => n + ((s && ((s.correct || 0) + (s.wrong || 0))) || 0), 0);
  }
  function showBackdrop(k) {
    const e = G.era(meta.era);
    const layers = $$('#raceBg .bg-layer');
    bgFront = 1 - bgFront;
    const el = layers[bgFront];
    el.innerHTML = A.sceneSVG(e.id, k);
    el.classList.remove('kb');
    void el.offsetWidth; // 천천히 다가가는 움직임을 처음부터 다시
    el.classList.add('kb');
    layers.forEach((l, i) => l.classList.toggle('on', i === bgFront));
    const scr = $('#bgScreen');
    scr.innerHTML = A.sceneSVG(e.id, k);
    scr.classList.remove('flip');
    void scr.offsetWidth;
    scr.classList.add('flip');
    const cap = $('#bgCaption');
    cap.innerHTML = `<b>${'①②③④⑤'[k]}</b>${esc(e.scenes[k])}`;
    cap.classList.remove('pop');
    void cap.offsetWidth;
    cap.classList.add('pop');
    bgIdx = k;
    bgAt = DB.now();
  }
  // 경기장 서킷: 코스 안쪽에 대형 전광판을 세우고 장면을 잘리지 않게 크게 보여 줘요
  // (안쪽 모양 = 양 끝이 반원인 직사각형, 그 안에 들어가는 가장 큰 3:2 화면)
  function placeScreen(g) {
    const el = $('#bgScreen');
    if (!g) { el.classList.add('hidden'); return; }
    const ri = g.R - g.TW / 2 - 14;
    let best = null;
    for (let h = ri * 2; h > 20; h -= 2) {
      const w = h * 1.5, half = Math.sqrt(Math.max(0, ri * ri - (h / 2) * (h / 2)));
      if (w / 2 <= g.L / 2 + half) { best = { w, h }; break; }
    }
    if (!best) { el.classList.add('hidden'); return; }
    Object.assign(el.style, { left: (g.cx - best.w / 2) + 'px', top: (g.cy - best.h / 2) + 'px', width: best.w + 'px', height: best.h + 'px' });
    el.classList.remove('hidden');
    if (bgIdx >= 0 && !el.innerHTML) el.innerHTML = A.sceneSVG(G.era(meta.era).id, bgIdx);
  }
  function updateBackdrop(reset) {
    if (!meta) return;
    const n = solvedCount();
    if (reset || bgIdx < 0 || bgRoom !== room) { bgRoom = room; bgSolved = n; showBackdrop(0); return; }
    if (n < bgSolved) bgSolved = n; // 새 판이 시작됨
    if (n > bgSolved && DB.now() - bgAt >= BG_HOLD) { bgSolved = n; showBackdrop((bgIdx + 1) % 5); }
  }

  function layoutRace() {
    const circ = $('#circuit');
    if (!circ || currentView() !== '#vRace') return;
    const Wd = circ.clientWidth, Ht = circ.clientHeight;
    if (!Wd || !Ht) return;
    const n = Math.max(approvedList().length, 1), k = Math.min(n, 3);
    const type = trackType();
    const rect = { x: 0, y: 0, w: Wd, h: Ht };
    geo = TRACKS.build(type, Wd, Ht, rect);
    geo.k = k;
    const laneW = geo.TW * 0.86 / k;
    const carH = Math.max(18, Math.min(laneW * 1.05, geo.TW * 0.5, 92));
    geo.carW = carH * 120 / 86;
    // 한 줄로 끝까지 가는 코스는 출발선 뒤에 출발 대기 줄을 만들 자리를 둡니다
    const groups = Math.ceil(n / k);
    geo.startS = geo.closed ? 0 : Math.min(geo.P * 0.15, (groups - 1) * geo.carW * 0.95 + geo.carW * 0.6);
    const svg = $('#circuitSvg');
    svg.setAttribute('viewBox', `0 0 ${Wd} ${Ht}`);
    svg.innerHTML = geo.svg(k, { bare: true });
    placeScreen(type === 'oval' ? geo : null);
    circ.dataset.track = type;
    circ.style.setProperty('--car-w', geo.carW + 'px');
    circ.style.setProperty('--tag-size', Math.max(10, Math.min(carH * 0.3, 18)) + 'px');
  }
  window.addEventListener('resize', () => { if (currentView() === '#vRace') layoutRace(); });

  // 차 위치: 목표 지점(칸)을 향해 부드럽게 따라가며 길 방향으로 회전
  const carShown = {};
  let carLoop = null;
  function carTarget(i, uid) {
    const s = states[uid] || {};
    const pos = s.finishedAt ? C.finishCells : Math.min(s.pos || 0, C.finishCells);
    const lane = i % geo.k, grp = Math.floor(i / geo.k);
    return { s: geo.sAt(pos / C.finishCells) - grp * geo.carW * 0.95, off: ((lane + 0.5) / geo.k - 0.5) * geo.TW * 0.86 };
  }
  function moveCars() {
    if (!geo || currentView() !== '#vRace') { carLoop = null; return; }
    approvedList().forEach((p, i) => {
      const el = document.querySelector(`.racer[data-uid="${p.uid}"]`);
      if (!el) return;
      const tg = carTarget(i, p.uid);
      const cur = carShown[p.uid] || (carShown[p.uid] = { s: tg.s, off: tg.off });
      cur.s += (tg.s - cur.s) * 0.08;
      cur.off += (tg.off - cur.off) * 0.15;
      const pt = geo.at(cur.s, cur.off);
      el.style.left = pt.x.toFixed(1) + 'px';
      el.style.top = pt.y.toFixed(1) + 'px';
      const deg = pt.t * 180 / Math.PI;
      el.querySelector('.car-box').style.transform = `rotate(${deg.toFixed(1)}deg)` + (Math.cos(pt.t) < -0.01 ? ' scaleY(-1)' : '');
    });
    carLoop = requestAnimationFrame(moveCars);
  }
  function startCarLoop() { if (!carLoop) carLoop = requestAnimationFrame(moveCars); }

  const FX_TEXT = {
    boost1: () => C.items.boost1.icon + ' +1',
    boost2: () => C.items.boost2.icon + ' +2',
    shield: () => C.items.shield.icon + ' 방패!',
    block: () => C.items.shield.icon + ' 막았다!',
    balloon: () => C.items.balloon.icon + ' 갇혔다!',
    lightning: () => C.items.lightning.icon + ' 맞았다!',
    turbo: () => C.items.turbo.icon + ' 질주!',
    star: () => C.items.star.icon + ' 무적!',
    caltrop: () => C.items.caltrop.icon + ' 펑크!',
    thunder: () => C.items.thunder.icon + ' 쾅!',
    fuel: () => C.items.fuel.icon,
    ink: () => C.items.ink.icon,
    yut: f => C.items.yut.icon + ' ' + (['', '도', '개', '걸', '윷', '모'][f.n] || '윷') + '!',
    ginseng: () => C.items.ginseng.icon + ' 인삼!',
    warp: () => C.items.warp.icon + ' 순간 이동!',
    mapae: () => C.items.mapae.icon + ' 마패!',
    smoke: () => C.items.smoke.icon + ' 연기!',
    combo: f => '🔥 ' + (f.n || 2) + '연속!',
    finish: () => '🏁 완주!'
  };

  // 새 아이템은 비슷한 소리를 빌려 써요
  const FX_SOUND = { yut: 'boost2', warp: 'turbo', ginseng: 'shield', mapae: 'star', smoke: 'ink', combo: 'turbo' };

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
      const fx = s.fx || {};
      const age = now - (fx.at || 0);
      racer.classList.toggle('trapped', now < (s.frozenUntil || 0) && (fx.type === 'balloon' || fx.type === 'lightning'));
      const spiked = now < (s.frozenUntil || 0) && (fx.type === 'caltrop' || fx.type === 'thunder');
      racer.classList.toggle('spiked', spiked);
      if (spiked) racer.querySelector('.fx-hit').textContent = C.items[fx.type].icon;
      racer.classList.toggle('turbo', now < (s.turboUntil || 0));
      racer.classList.toggle('guarded', now < (s.guardUntil || 0));
      racer.classList.toggle('smoking', now < (s.frozenUntil || 0) && fx.type === 'fuel');
      racer.classList.toggle('inked', now < (s.blindUntil || 0));
      racer.classList.toggle('shielded', !!s.shield);
      racer.classList.toggle('boosting', ['boost1', 'boost2', 'yut', 'warp'].includes(fx.type) && age < 900);
      racer.classList.toggle('struck', (fx.type === 'lightning' || fx.type === 'thunder') && age < 800);
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
          f.textContent = FX_TEXT[fx.type](fx);
          racer.appendChild(f);
          setTimeout(() => f.remove(), 1300);
          SOUND.play(FX_SOUND[fx.type] || fx.type);
        }
      }
    });
    const sig = ranked.slice(0, 10).map(r => r.uid + r.pos + (r.finishedAt ? 'f' : '')).join('|');
    if (sig === lastRankSig) return;
    lastRankSig = sig;
    $('#liveRank').innerHTML = ranked.slice(0, 10).map(r => `
      <li data-rank="${r.rank}"><span class="lr-rank">${r.rank}</span><span class="lr-car">${A.carSVG(r.car)}</span><span class="lr-nick">${esc(r.nick)}</span><span class="lr-pos">${r.finishedAt ? '🏁' : r.pos + '칸'}</span></li>`).join('');
  }

  let lastCountShown = null, lastTickSec = null, finalOn = false, lastSongName = null, trackToastFor = null;
  function tick() {
    if (!meta || !room) return;
    const now = DB.now();
    const np = SOUND.nowPlaying();
    if (np && np !== lastSongName) { lastSongName = np; toast('♪ 지금 나오는 곡: ' + np, 2500); renderMusicPop(); }
    if (!np) lastSongName = null;
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
        // 막판 역전 구간: 시작할 때 큰 글자로 알리고, 끝날 때까지 위쪽에 띠를 띄워요
        const fin = !!C.finalSeconds && left > 0 && left <= C.finalSeconds * 1000;
        if (fin !== finalOn) {
          finalOn = fin;
          $('#vRace').classList.toggle('final', fin);
          if (fin) {
            const cd = $('#countdown');
            cd.innerHTML = `⚡ 역전 구간!<small>남은 ${C.finalSeconds}초, 정답 하나에 2칸</small>`;
            cd.className = 'countdown final-cd';
            setTimeout(() => cd.classList.add('hidden'), 2200);
            SOUND.play('go');
          }
        }
      }
      updateRace();
      updateBackdrop();
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

  function studentStats(qs) {
    const out = {};
    approvedList().forEach(p => {
      if (!p.no) return;
      const st = (states[p.uid] && states[p.uid].q) || {};
      const key = 'n' + p.no;
      const prev = out[key] || qs.map(() => ({ c: 0, w: 0, t: 0 }));
      out[key] = qs.map((q, i) => {
        const s = st[i] || {};
        return { c: prev[i].c + (s.c || 0), w: prev[i].w + (s.w || 0), t: prev[i].t + (s.t || 0) };
      });
    });
    return out;
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
      questions: qs.map((q, i) => ({ q: q.q, answerText: G.answerText(q), c: stats[i].c, w: stats[i].w, t: stats[i].t, total: stats[i].total, rate: stats[i].rate })),
      // 추수지도용: 출석번호별 문제마다 맞힘·틀림·시간 초과 횟수 (닉네임은 남기지 않음)
      students: studentStats(qs)
    };
    try {
      const key = await DB.push('records/' + m.classNo, rec);
      await DB.update(`rooms/${room}/meta`, { recordKey: key });
    } catch (e) { denied(e); }
  }

  $('#rcStop').addEventListener('click', () => {
    if (confirm('지금 레이스를 끝내고 결과를 볼까요?')) finishRace();
  });
  function updateMuteBtn() { const t = SOUND.isMuted() ? '소리 켜기' : '소리 끄기'; $('#rcMute').textContent = t; $('#lbMute').textContent = t; }
  $('#rcMute').addEventListener('click', () => { SOUND.toggle(); updateMuteBtn(); renderMusicPop(); });
  $('#lbMute').addEventListener('click', () => { SOUND.toggle(); updateMuteBtn(); renderMusicPop(); });

  // ---------- 음악 목록 (선생님 화면 전용) ----------
  function musicKindNow() { return currentView() === '#vRace' ? 'race' : 'lobby'; }
  function renderMusicPop() {
    const pop = $('#musicPop');
    if (pop.classList.contains('hidden')) return;
    const now = musicKindNow();
    const sec = (kind, label) => `<section class="mp-sec"><h4>${label}</h4><ul>${SOUND.playlist(kind).map((s, k) => `
      <li class="${s.playing ? 'playing' : ''}">
        <label><input type="checkbox" data-kind="${kind}" data-k="${k}" ${s.enabled ? 'checked' : ''}><span>${esc(s.name)}</span><small>${s.bpm} BPM</small></label>
        ${kind === now ? `<button class="btn small" data-play="${k}" ${s.playing ? 'disabled' : ''}>${s.playing ? '나오는 중' : '틀기'}</button>` : ''}
      </li>`).join('')}</ul></section>`;
    $('#mpBody').innerHTML = sec(now, now === 'race' ? '레이스 음악' : '대기실 음악') + sec(now === 'race' ? 'lobby' : 'race', now === 'race' ? '대기실 음악' : '레이스 음악');
    $('#mpMuted').classList.toggle('hidden', !SOUND.isMuted());
    $('#mpNext').disabled = SOUND.currentKind() !== now;
    $$('#mpBody input[type=checkbox]').forEach(cb => cb.addEventListener('change', () => {
      SOUND.setSongEnabled(cb.dataset.kind, +cb.dataset.k, cb.checked);
      if (!SOUND.playlist(cb.dataset.kind).some(s => s.enabled)) toast('모든 곡을 끄면 전체 곡에서 무작위로 골라요.');
    }));
    $$('#mpBody [data-play]').forEach(b => b.addEventListener('click', () => {
      SOUND.unlock();
      SOUND.playSong(now, +b.dataset.play);
      renderMusicPop();
    }));
  }
  function toggleMusicPop() {
    const pop = $('#musicPop');
    pop.classList.toggle('hidden');
    renderMusicPop();
  }
  $('#lbMusic').addEventListener('click', toggleMusicPop);
  // 재접속 QR: 마우스를 올리면 잠깐 보이고, 클릭하면 계속 띄워 둡니다
  $('#qrBtn').addEventListener('click', () => {
    const pinned = $('#qrWrap').classList.toggle('pinned');
    $('#qrBtn').setAttribute('aria-expanded', String(pinned));
    $('#qrPinNote').textContent = pinned ? '다시 클릭하면 닫혀요' : '클릭하면 계속 띄워 둬요';
  });
  $('#rcMusic').addEventListener('click', toggleMusicPop);
  $('#mpClose').addEventListener('click', () => $('#musicPop').classList.add('hidden'));
  $('#mpNext').addEventListener('click', () => { SOUND.unlock(); SOUND.nextSong(); renderMusicPop(); });

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
    cd.className = 'countdown';
    cd.textContent = '경기 끝!';
    cd.classList.remove('hidden');
    cd.classList.add('go');
    setTimeout(() => {
      cd.classList.add('hidden');
      if (meta && meta.status === 'finished') { renderResults(); show('#vResults'); startFireworks(); }
    }, 1600);
  }

  // 결과 화면 축하: 폭죽과 꽃가루 (약 8초)
  let fwRaf = null;
  function startFireworks() {
    if (fwRaf) cancelAnimationFrame(fwRaf);
    $$('.fireworks').forEach(c => c.remove());

    const cv = document.createElement('canvas');
    cv.className = 'fireworks';
    $('#vResults').appendChild(cv);
    const ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
    const Wd = innerWidth, Ht = innerHeight;
    cv.width = Wd * dpr; cv.height = Ht * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#ff3b30', '#ffd84a', '#34c759', '#2997ff', '#af52de', '#ff9f0a', '#ffffff', '#ff6fb5'];
    const parts = [];
    const burst = () => {
      const x = Wd * (0.12 + Math.random() * 0.76), y = Ht * (0.1 + Math.random() * 0.32);
      const c = colors[Math.floor(Math.random() * colors.length)], c2 = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 70; i++) {
        const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 4.5;
        parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: i % 3 ? c : c2, r: 1.6 + Math.random() * 2, kind: 'spark' });
      }
      SOUND.play('firework');
    };
    for (let i = 0; i < 140; i++) {
      parts.push({ x: Math.random() * Wd, y: -Math.random() * Ht * 0.6, vx: (Math.random() - 0.5) * 1.2, vy: 1.2 + Math.random() * 1.8, life: 1, c: colors[i % colors.length], r: 4 + Math.random() * 4, kind: 'confetti', rot: Math.random() * 6 });
    }
    const t0 = performance.now();
    let lastBurst = -1000;
    const loop = now => {
      const t = now - t0;
      if (t < 6500 && t - lastBurst > 380) { burst(); if (Math.random() < 0.45) burst(); lastBurst = t; }
      ctx.clearRect(0, 0, Wd, Ht);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (p.kind === 'spark') { p.vy += 0.05; p.vx *= 0.985; p.vy *= 0.985; p.life -= 0.013; }
        else { p.vx += (Math.random() - 0.5) * 0.08; p.rot += 0.1; if (p.y > Ht) p.life = 0; else if (t > 7000) p.life -= 0.01; }
        p.x += p.vx; p.y += p.vy;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = p.c;
        if (p.kind === 'spark') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); }
      }
      ctx.globalAlpha = 1;
      if ((t < 9000 || parts.length) && currentView() === '#vResults') fwRaf = requestAnimationFrame(loop);
      else { cv.remove(); fwRaf = null; }
    };
    fwRaf = requestAnimationFrame(loop);
  }

  function renderResults() {
    $('#rsClass').textContent = meta.classNo + '반';
    const ranked = G.ranking(approvedList(), states);
    const order = [1, 0, 2]; // 2위, 1위, 3위 순서로 놓기
    $('#podium').innerHTML = order.map(i => {
      const r = ranked[i];
      if (!r) return '<div class="podium-col empty"></div>';
      return `<div class="podium-col p${r.rank}" style="--d:${[0, 1.1, 0.6, 0.2][r.rank]}s">
        ${r.rank === 1 ? '<div class="podium-crown">👑</div>' : ''}
        <div class="podium-car">${A.carSVG(r.car)}</div>
        <div class="podium-nick${Array.from(r.nick).length > 6 ? ' long' : ''}">${esc(r.nick)}</div>
        <div class="podium-block"><span>${r.rank}</span><small>${['', '🥇', '🥈', '🥉'][r.rank]}</small></div>
      </div>`;
    }).join('');
    $('#allRank').innerHTML = ranked.map(r => `
      <li class="${r.rank <= 3 ? 'top' : ''}">
        <span class="ar-rank">${r.rank}위</span>
        <span class="ar-car">${A.carSVG(r.car)}</span>
        <span class="ar-nick">${esc(r.nick)}</span>
        <span class="ar-pos">${r.finishedAt ? '완주' : r.pos + '칸'}</span>
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
      const body = q.type === 'sa'
        ? `<div class="rv-sa"><span class="rv-sa-hint">힌트 ${esc(G.choHint(q.answer))}</span><span class="rv-sa-answer">${esc(q.answer)}</span></div>`
        : q.type === 'ox'
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

  // 새로고침 뒤에는 첫 클릭 때 소리를 켭니다(브라우저 자동 재생 제한)
  document.addEventListener('pointerdown', () => { SOUND.unlock(); if (meta && meta.status === 'lobby' && Object.keys(players).length) SOUND.startBgm('lobby'); }, { once: true });

  boot();
})();
