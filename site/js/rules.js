/* 게임 규칙: 순위, 아이템, 출제 순서, 시트 붙여넣기 해석 */
(function () {
  const C = window.APP_CONFIG;
  const ITEMS = C.items;

  // 2022 개정 교육과정 한국사1·2 기준 10개 시대, 시대마다 5장면(시간 순서)
  const ERAS = [
    { id: 'e1', no: '1', name: '선사·고조선·여러 나라', scenes: ['구석기 동굴 사냥터', '신석기 움집 마을', '청동기 고인돌 언덕', '고조선 왕검성', '여러 나라의 제천 행사'] },
    { id: 'e2', no: '2', name: '삼국·남북국', scenes: ['고구려 무용총 수렵도', '백제 금동 대향로와 정림사지 5층 석탑', '신라 첨성대', '통일 신라 불국사와 석굴암', '발해 상경성'] },
    { id: 'e3', no: '3', name: '고려', scenes: ['개경 만월대', '서희 담판과 귀주 대첩', '벽란도 국제 무역항', '상감 청자 가마', '팔만대장경과 직지'] },
    { id: 'e4', no: '4', name: '조선 전기', scenes: ['한양 경복궁과 숭례문', '집현전과 훈민정음', '측우기와 앙부일구', '한산도 대첩 거북선', '행주산성'] },
    { id: 'e5', no: '5', name: '조선 후기', scenes: ['장시와 보부상', '김홍도 풍속화 속 서당과 씨름판', '수원 화성과 거중기', '대동여지도', '판소리 마당'] },
    { id: 'e6', no: '6', name: '개항기와 대한제국', scenes: ['제물포 개항장', '동학 농민군 황토현', '독립문과 만민 공동회', '환구단과 덕수궁 석조전', '한성 전차와 전등'] },
    { id: 'e7a', no: '7-A', name: '3·1 운동과 무장 독립 전쟁', scenes: ['3·1 운동 만세 거리', '상하이 대한민국 임시 정부', '봉오동 골짜기', '청산리 숲', '한국광복군'] },
    { id: 'e7b', no: '7-B', name: '대중 운동과 민족 문화 수호', scenes: ['물산 장려 운동 장터', '6·10 만세 운동', '신간회 창립', '광주 학생 항일 운동', '조선어 학회와 우리말 큰사전 원고'] },
    { id: 'e8', no: '8', name: '대한민국의 발전', scenes: ['1945 광복의 기쁨', '1948 정부 수립', '4·19 혁명', '경제 개발 5개년 계획과 경부 고속 도로', '수출 100억 달러 달성과 조선소'] },
    { id: 'e9', no: '9', name: '오늘날의 대한민국', scenes: ['1987 6월 민주 항쟁', '1988 서울 올림픽', '외환 위기 금 모으기 운동', '2002 월드컵 거리 응원', '오늘날의 서울과 한류'] }
  ];
  function era(id) { return ERAS.find(e => e.id === id) || ERAS[7]; }

  function shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  // 한 바퀴 출제 순서. 바퀴가 바뀔 때 같은 문제가 연달아 나오지 않게 합니다.
  function nextOrder(n, lastIdx) {
    const o = shuffle([...Array(n).keys()]);
    if (n > 1 && o[0] === lastIdx) [o[0], o[1]] = [o[1], o[0]];
    return o;
  }

  function pick(table) {
    const total = table.reduce((s, r) => s + r[1], 0);
    let r = Math.random() * total;
    for (const [k, w] of table) { if ((r -= w) < 0) return k; }
    return table[table.length - 1][0];
  }

  // 정답을 맞혔을 때 받는 좋은 아이템. 뒤쪽 절반일수록 강한 아이템이 잘 나옵니다(마리오카트처럼).
  // self = 바로 효과, use·attack = 손에 들고 있다가 버튼을 눌러 씀(한 번에 하나만, 안 누르면 몇 초 뒤 저절로)
  const AHEAD_ATTACKS = ['balloon', 'lightning', 'thunder', 'smoke', 'warp']; // 1위에게는 쓸모없는 아이템
  function rollGoodItem(rank, n, opts) {
    const lower = n > 1 && (rank - 1) / (n - 1) >= 0.5;
    let table = lower
      ? [['turbo', 16], ['boost2', 13], ['warp', 13], ['yut', 12], ['balloon', 10], ['lightning', 8], ['thunder', 6], ['smoke', 6], ['star', 9], ['boost1', 9], ['mapae', 8], ['ginseng', 6]]
      : [['boost1', 22], ['yut', 14], ['shield', 15], ['caltrop', 13], ['ginseng', 11], ['mapae', 10], ['balloon', 7], ['smoke', 4], ['star', 6], ['turbo', 6]];
    table = table.filter(([k]) => ITEMS[k]);
    if (opts.holding) table = table.filter(([k]) => ITEMS[k].kind === 'self');
    if (n < 2) table = table.filter(([k]) => ITEMS[k].kind !== 'attack' && k !== 'warp');
    if (rank === 1) table = table.filter(([k]) => !AHEAD_ATTACKS.includes(k));
    if (opts.hasShield) table = table.filter(([k]) => k !== 'shield');
    if (opts.hasGinseng) table = table.filter(([k]) => k !== 'ginseng');
    if (!table.length) table = [['boost1', 1]];
    return pick(table);
  }
  function rollBadItem() { return Math.random() < 0.5 ? 'fuel' : 'ink'; }
  // 윷 던지기: 도 1칸, 개 2칸, 걸 3칸, 윷 4칸, 모 5칸
  function rollYut() {
    return pick([[['도', 1], 25], [['개', 2], 34], [['걸', 3], 25], [['윷', 4], 11], [['모', 5], 5]]);
  }
  // 연속 정답 보너스 칸 (2연속 +2, 3연속부터 +3)
  function comboBonus(streak) {
    const b = C.comboBonus || [];
    return b.length ? (b[Math.min(streak, b.length - 1)] || 0) : 0;
  }

  function accuracy(s) {
    const c = s.correct || 0, w = s.wrong || 0;
    return c + w ? c / (c + w) : 0;
  }

  // players: [{uid, nick, car}] (승인된 학생), states: {uid: 상태}
  function ranking(players, states) {
    const list = players.map(p => {
      const s = (states && states[p.uid]) || {};
      return Object.assign({}, p, {
        pos: s.pos || 0,
        finishedAt: s.finishedAt || null,
        correct: s.correct || 0,
        wrong: s.wrong || 0,
        acc: accuracy(s),
        movedAt: s.movedAt || Infinity
      });
    });
    list.sort((a, b) => {
      if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt;
      if (a.finishedAt) return -1;
      if (b.finishedAt) return 1;
      if (b.pos !== a.pos) return b.pos - a.pos;
      if (b.acc !== a.acc) return b.acc - a.acc;
      return a.movedAt - b.movedAt;
    });
    list.forEach((x, i) => { x.rank = i + 1; });
    return list;
  }

  // 공격 대상: 물풍선은 바로 앞 친구(내가 1위면 바로 뒤 친구), 신기전은 아직 달리는 친구 중 1위
  function attackTarget(type, myUid, ranked) {
    const alive = ranked.filter(r => !r.finishedAt && r.uid !== myUid);
    if (!alive.length) return null;
    if (type === 'lightning' || type === 'smoke') return alive[0];
    const me = ranked.find(r => r.uid === myUid);
    const myRank = me ? me.rank : Infinity;
    const ahead = alive.filter(r => r.rank < myRank);
    if (type === 'thunder') return ahead.length ? ahead : null;      // 앞선 친구 모두
    if (type === 'caltrop') return alive.find(r => r.rank > myRank) || null; // 바로 뒤 친구
    if (ahead.length) return ahead[ahead.length - 1];
    return alive.find(r => r.rank > myRank) || null;
  }

  // 레이스 시계: 쿨링 타임(meta.coolAt~coolUntil) 동안은 멈춘 것으로 셈해요
  //  paused: 지금 쉬는 중, coolLeft: 쉬는 시간이 얼마나 남았는지,
  //  left: 실제로 달릴 수 있는 남은 시간, elapsed·total: 달린 시간과 전체 달리는 시간(쉬는 시간 빼고)
  function raceClock(meta, now) {
    const cs = meta.coolAt || 0, ce = meta.coolUntil || 0;
    const breakLeft = cs ? Math.max(0, ce - Math.max(now, cs)) : 0;
    const breakPassed = cs ? Math.max(0, Math.min(now, ce) - cs) : 0;
    const paused = !!cs && now >= cs && now < ce;
    return {
      paused,
      coolLeft: paused ? ce - now : 0,
      left: meta.endAt - now - breakLeft,
      elapsed: now - meta.startAt - breakPassed,
      total: meta.endAt - meta.startAt - (cs ? ce - cs : 0)
    };
  }
  // 쿨링 타임에 다시 보는 핵심 개념: 문제마다 '문제 → 정답' 한 줄
  function conceptCards(questions) {
    return (questions || []).map(q => ({
      q: q.q,
      a: q.type === 'ox' ? (q.answer === 'O' ? '맞아요 (O)' : '틀려요 (X)') : q.type === 'sa' ? q.answer : q.choices[q.answer]
    }));
  }

  function sceneIndex(pos) { return Math.min(4, Math.floor((pos || 0) / C.cellsPerScene)); }

  // 문제별 정답률: 정답 / (정답 + 오답 + 시간 초과)
  function questionStats(questions, states) {
    return questions.map((q, i) => {
      let c = 0, w = 0, t = 0;
      Object.values(states || {}).forEach(s => {
        const st = s && s.q && s.q[i];
        if (st) { c += st.c || 0; w += st.w || 0; t += st.t || 0; }
      });
      const total = c + w + t;
      return { i, c, w, t, total, rate: total ? c / total : null };
    });
  }

  function answerText(q) {
    if (q.type === 'ox') return q.answer;
    if (q.type === 'sa') return q.answer;
    return '①②③④'[q.answer] + ' ' + q.choices[q.answer];
  }

  // ---------- 단답형 채점 ----------
  // 띄어쓰기·가운뎃점·기호는 무시합니다 (예: "3.1운동" = "3·1 운동")
  function normalizeAnswer(s) {
    return String(s || '').toLowerCase().replace(/[\s.,·•ㆍ\-_'"「」『』()!?~]/g, '');
  }
  function checkShort(q, typed) {
    const t = normalizeAnswer(typed);
    if (!t) return false;
    return [q.answer].concat(q.alt || []).some(a => normalizeAnswer(a) === t);
  }
  // 초성 힌트: "봉오동 전투" → "ㅂㅇㄷ ㅈㅌ"
  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  function choHint(s) {
    return String(s || '').replace(/[가-힣]/g, ch => CHO[Math.floor((ch.charCodeAt(0) - 0xAC00) / 588)]);
  }

  // ---------- 엑셀·구글 시트 붙여넣기 ----------
  const TEMPLATE = [
    ['유형', '문제', '보기1', '보기2', '보기3', '보기4', '정답'],
    ['OX', '물산 장려 운동은 우리 기업이 만든 물건을 쓰자는 운동이었다.', '', '', '', '', 'O'],
    ['4지선다', '1927년 민족주의 세력과 사회주의 세력이 함께 만든 단체는?', '신민회', '독립 협회', '신간회', '의열단', '3'],
    ['단답형', '한글 맞춤법 통일안을 만든 단체 이름은? (보기 칸에는 함께 맞다고 할 답을 적어요)', '조선어학회', '', '', '', '조선어 학회']
  ].map(r => r.join('\t')).join('\n');

  function parseType(raw) {
    const s = String(raw || '').replace(/\s/g, '').toLowerCase();
    if (/^(ox|o\/x|o·x|오엑스|ㅇㅌ)$/.test(s)) return 'ox';
    if (/4|사지|선다|객관/.test(s)) return 'mc';
    if (/단답|주관|입력|서술|빈칸/.test(s)) return 'sa';
    return null;
  }
  function parseOX(raw) {
    const s = String(raw || '').trim().toUpperCase();
    if (['O', '○', 'ㅇ', '맞음', '참'].includes(s)) return 'O';
    if (['X', '×', '✕', 'ㅌ', '틀림', '거짓'].includes(s)) return 'X';
    return null;
  }
  function parseMC(raw, choices) {
    const s = String(raw || '').trim();
    const circled = '①②③④'.indexOf(s);
    if (circled >= 0) return circled;
    const n = parseInt(s.replace(/[번)]/g, ''), 10);
    if (n >= 1 && n <= 4 && /^\d/.test(s)) return n - 1;
    const byText = choices.findIndex(c => c && c === s);
    return byText >= 0 ? byText : null;
  }

  // 반환: [{type, q, choices, answer, error}]
  function parseSheet(text) {
    const lines = String(text || '').replace(/\r/g, '').split('\n').filter(l => l.trim());
    const rows = [];
    lines.forEach(line => {
      const cells = line.split('\t').map(c => c.trim());
      if (/^유형/.test(cells[0])) return; // 머리글 줄
      rows.push(rowFromCells(cells));
    });
    return rows;
  }
  function rowFromCells(cells) {
    const type = parseType(cells[0]);
    const q = cells[1] || '';
    const choices = [cells[2] || '', cells[3] || '', cells[4] || '', cells[5] || ''];
    const row = { type: type || 'mc', q, choices, answer: null, error: null };
    if (!type) row.error = '유형은 OX, 4지선다, 단답형 중 하나로 적어 주세요.';
    if (type === 'ox') row.answer = parseOX(cells[6]);
    if (type === 'mc') row.answer = parseMC(cells[6], choices);
    if (type === 'sa') { row.answer = (cells[6] || '').trim() || null; row.choices = ['', '', '', '']; row.alt = choices.filter(c => c.trim()).join(', '); }
    return validateRow(row);
  }
  function validateRow(row) {
    row.error = null;
    if (!row.q.trim()) row.error = '문제가 비어 있어요.';
    else if (row.type === 'sa' && !String(row.answer || '').trim()) row.error = '단답형 정답을 적어 주세요.';
    else if (row.type === 'sa') return row;
    else if (row.type === 'mc' && row.choices.some(c => !String(c).trim())) row.error = '보기 4개를 모두 채워 주세요.';
    else if (row.type === 'ox' && !['O', 'X'].includes(row.answer)) row.error = '정답은 O 또는 X로 적어 주세요.';
    else if (row.type === 'mc' && !(typeof row.answer === 'number' && row.answer >= 0 && row.answer <= 3)) row.error = '정답은 1~4 중 하나로 적어 주세요.';
    return row;
  }
  function cleanQuestion(row) {
    if (row.type === 'ox') return { type: 'ox', q: row.q.trim(), answer: row.answer };
    if (row.type === 'sa') {
      const alt = (Array.isArray(row.alt) ? row.alt : String(row.alt || '').split(',')).map(a => String(a).trim()).filter(Boolean);
      return alt.length ? { type: 'sa', q: row.q.trim(), answer: String(row.answer).trim(), alt } : { type: 'sa', q: row.q.trim(), answer: String(row.answer).trim() };
    }
    return { type: 'mc', q: row.q.trim(), choices: row.choices.map(c => String(c).trim()), answer: row.answer };
  }

  // 7-B 예시 문제 (선생님이 고쳐서 쓰는 출발점)
  const SAMPLE_7B = [
    { type: 'ox', q: '물산 장려 운동은 "조선 사람 조선 것"을 내세우며 우리 기업이 만든 물건을 쓰자는 운동이었다.', answer: 'O' },
    { type: 'mc', q: '1926년 순종의 장례일에 학생들이 중심이 되어 일으킨 만세 운동은?', choices: ['3·1 운동', '6·10 만세 운동', '광주 학생 항일 운동', '물산 장려 운동'], answer: 1 },
    { type: 'mc', q: '1927년 민족주의 세력과 사회주의 세력이 힘을 합쳐 만든 단체는?', choices: ['신민회', '독립 협회', '신간회', '의열단'], answer: 2 },
    { type: 'ox', q: '광주 학생 항일 운동은 1929년 한국 학생과 일본 학생의 충돌을 계기로 일어나 전국으로 퍼졌다.', answer: 'O' },
    { type: 'mc', q: '한글 맞춤법 통일안을 만들고 「우리말 큰사전」을 펴내려 한 단체는?', choices: ['조선어 학회', '신간회', '근우회', '조선 교육회'], answer: 0 }
  ];

  // ---------- 닉네임 금칙어 ----------
  // 욕설, 조롱·비하, 패드립, 성적인 말을 막습니다. config.js의 bannedWords로 더할 수 있어요.
  const BANNED_DEFAULT = [
    // 욕설
    '시발', '씨발', '씨바', '시바', '씨빨', '시빨', '쉬발', '슈발', '씹', '십새', '좆', '존나', '졸라', '존니', '좃', '개새', '개색', '개세', '새끼', '색기', '섀끼', '쌔끼', '병신', '븅신', '빙신', '병쉰', '지랄', '염병', '옘병', '썅', '쌍놈', '쌍년', '개년', '년아', '놈아', '미친', '미췬', '미틴', '또라이', '돌아이', '꺼져', '닥쳐', '뒤져', '뒈져', '디져', '죽어', '죽을래', '엿먹', '개같', '개빡', '빡대가리', '대가리', '꼴통', '등신', '멍청', '찐따', '찌질',
    // 초성 욕설
    'ㅅㅂ', 'ㅆㅂ', 'ㅂㅅ', 'ㅄ', 'ㅈㄴ', 'ㅈㄹ', 'ㄲㅈ', 'ㄷㅊ', 'ㅁㅊ', 'ㅅㄲ', 'ㅗ',
    // 패드립
    '느금', '니애미', '니엄마', '니어미', '니애비', '니아빠', '애미', '애비', '에미', '에비', '니미', '엠창', '엄창', '느개비', '느그애미', '부모없',
    // 조롱·비하
    '장애', '애자', '틀딱', '급식충', '한남', '한녀', '김치녀', '맘충', '충이', '일베', '홍어', '짱깨', '쪽바리', '흑형', '깜둥', '뚱땡', '돼지새', '거지새', '난쟁이', '정신병',
    // 성적인 말
    '섹스', '섹시', '야동', '자위', '보지', '자지', '꼬추', '가슴', '젖', '빨통', '창녀', '창년', '걸레',
    // 영어
    'fuck', 'shit', 'bitch', 'sex', 'dick', 'pussy', 'porn', 'asshole', 'fck', 'sibal', 'ssibal', 'tlqkf', 'qudtls'
  ];
  // 띄어쓰기·숫자·기호를 지우고 비교합니다 (예: "시 1 발" → "시발")
  function normalizeNick(s) {
    return String(s || '').toLowerCase().replace(/[\s0-9!-/:-@[-`{-~·•ㆍ_*~^]/g, '');
  }
  function bannedWordIn(nick) {
    const n = normalizeNick(nick);
    if (!n) return null;
    const list = BANNED_DEFAULT.concat((C.bannedWords || []).map(String));
    return list.find(w => w && n.includes(normalizeNick(w))) || null;
  }

  window.GAME = {
    bannedWordIn, normalizeNick,
    ITEMS, ERAS, era, shuffle, nextOrder, rollGoodItem, rollBadItem, rollYut, comboBonus, ranking, attackTarget,
    accuracy, sceneIndex, raceClock, conceptCards, questionStats, answerText, TEMPLATE, parseSheet, validateRow,
    cleanQuestion, SAMPLE_7B, checkShort, choHint,
    timeLimit: q => (q.type === 'ox' ? C.timeLimit.ox : q.type === 'sa' ? (C.timeLimit.sa || 40) : C.timeLimit.mc) * 1000
  };
})();
