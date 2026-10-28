/*
 * 이동규 선생님과 함께하는 한국사 복습 퀴즈 레이스 설정 파일
 * 선생님이 고치는 곳은 이 파일 하나뿐입니다. 자세한 방법은 설정안내.md를 보세요.
 */
window.APP_CONFIG = {
  // ① Firebase 웹 앱 설정을 붙여넣는 곳입니다.
  //    비워 두면 '체험 모드'로 돌아갑니다(노트북 한 대에서 탭 여러 개로만 동작).
  firebase: {
    apiKey: "AIzaSyAKyrbnmhFthP2vST1o7SiMezdXyjm1gKs",
    authDomain: "hanguksa-race.firebaseapp.com",
    databaseURL: "https://hanguksa-race-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hanguksa-race",
    storageBucket: "hanguksa-race.firebasestorage.app",
    messagingSenderId: "627838958190",
    appId: "1:627838958190:web:33fef8799950d27179447f"
  },

  // ② 선생님 로그인 이메일 (Firebase 규칙에 넣은 이메일과 똑같이, 소문자로)
  teacherEmail: "yinh0417@gmail.com",

  // 학생들이 접속하는 실제 사이트 주소 (QR에 들어가는 주소)
  publicUrl: "https://yinh0417.github.io/hanguksa-race/",

  // ③ 게임 숫자 (시범 수업 뒤 여기서 조정)
  classCount: 7,          // 반 개수
  studentsPerClass: 30,   // 한 반 최대 학생 수(출석번호 1~이 숫자, 전학생까지 넉넉하게)
  questionsPerSet: 6,     // 세트당 문제 수 (O/X·4지선다 5개 + 단답형 1개)
  raceSeconds: 300,       // 한 판 시간(초) = 5분
  finishCells: 40,        // 결승선까지 칸 수 (5분 + 연속 정답 부스터에 맞춰 늘림. 너무 빨리 골인하면 더 늘려요)
  cellsPerScene: 8,       // 몇 칸마다 배경 장면이 바뀌는지 (결승선 칸 수 ÷ 5)
  timeLimit: { ox: 30, mc: 30, sa: 50 },  // 문제별 제한 시간(초), sa = 단답형. 틀려서 다시 풀어도 이 시간 안에서 이어져요
  saHint: true,           // 단답형에 초성 힌트(예: ㅂㅇㄷ ㅈㅌ)를 보여 줄지
  penaltySeconds: 3,      // 오답 벌칙 시간(초)
  hitSeconds: 3,          // 물풍선·신기전에 맞았을 때 멈추는 시간(초)
  coolBreak: { left: 120, seconds: 25 }, // 쿨링 타임: 남은 시간이 2분일 때 25초 동안 게임을 멈추고 핵심 개념을 정리해요 (seconds를 0으로 하면 끔). 멈춘 시간만큼 경기가 늘어나요
  finalSeconds: 60,      // 막판 역전 구간: 남은 시간이 이만큼일 때부터 정답 하나에 2칸씩 (0이면 끔)
  leadCells: 6,           // 선두 맞바람: 시간에 맞춘 속도보다 이 칸 수 넘게 앞서면 더 못 가요 → 1등이 너무 일찍 골인하지 않아요
  comboBonus: [0, 0, 2, 3], // 한 번에 맞힌 연속 정답 보너스 칸: 2연속 +2칸, 3연속부터 매번 +3칸 (부스터로 달려요)
  autoItemSeconds: 6,     // 받은 아이템을 누르지 않으면 이 시간(초) 뒤 저절로 써요. 0이면 저절로 쓰지 않아요
  maxNick: 10,           // 닉네임 최대 글자 수(바꾸면 firebase-rules.json의 닉네임 길이 규칙도 함께)

  // ⑤ 닉네임 금칙어: 기본 목록에 더해 막고 싶은 말을 여기에 따옴표로 적어 넣으세요. 예: ["바보", "멍청이"]
  //    띄어쓰기·숫자·기호를 끼워 넣어도(예: "바 1 보") 걸러냅니다.
  bannedWords: [
    // 씨발 변형
    "씨팔", "시팔", "씨펄", "시펄", "씨벌", "시벌", "씨블", "시블", "쓰발", "쓰벌", "씌발", "쒸발", "씨부랄", "시부랄", "씨부럴", "ㅅㅍ", "ㅆㅍ",
    // 니미·패드립 변형
    "니기미", "니미럴", "니미랄", "늬애미", "늬미", "앰창", "ㄴㄱㅁ", "호로새", "호로자식", "후레자식",
    // 그 밖의 욕설
    "상놈", "상년", "잡놈", "잡년", "개놈", "개쌍", "개잡", "개쉐", "개섀", "개시키", "ㄱㅅㄲ", "ㅆㄹㄱ",
    "존내", "졸나", "줫", "좇", "조까", "ㅈ같", "ㅈㄲ", "병딱", "빙딱", "븅딱", "지롤", "즤랄", "쥐랄",
    "쳐죽", "디질", "뒤질", "뒈질", "닥치", "아가리", "주둥이", "머저리", "멍충", "쓰레기", "개돼지"
  ],

  // ④ 아이템 이름 (원하는 이름으로 바꿔도 됩니다)
  items: {
    boost1:    { kind: "self",   icon: "🐎", name: "파발마",      desc: "앞으로 1칸 더" },
    boost2:    { kind: "self",   icon: "🗺️", name: "지름길 지도", desc: "앞으로 2칸 더" },
    shield:    { kind: "self",   icon: "🛡️", name: "거북선 방패", desc: "친구의 공격을 1번 막아요" },
    balloon:   { kind: "attack", icon: "💦", name: "물풍선",      desc: "바로 앞 친구를 3초 멈춰요" },
    lightning: { kind: "attack", icon: "🚀", name: "신기전",      desc: "1위를 3초 멈춰요" },
    turbo:     { kind: "use",    icon: "🔥", name: "천리마 부스터", desc: "3초 동안 저절로 3칸 질주" },
    star:      { kind: "use",    icon: "✨", name: "도깨비 부적", desc: "8초 동안 공격도 벌칙도 안 받아요" },
    caltrop:   { kind: "attack", icon: "✳️", name: "마름쇠",      desc: "바로 뒤 친구를 3초 멈춰요" },
    thunder:   { kind: "attack", icon: "💥", name: "비격진천뢰", desc: "나보다 앞선 친구 모두 2초 멈춰요" },
    yut:       { kind: "self",   icon: "🎲", name: "윷 던지기",   desc: "도·개·걸·윷·모만큼 앞으로" },
    ginseng:   { kind: "self",   icon: "🌿", name: "인삼",        desc: "다음 오답 벌칙을 1번 막아요" },
    warp:      { kind: "use",    icon: "🌀", name: "축지법",      desc: "바로 앞 친구 자리로 순간 이동(최대 6칸)" },
    mapae:     { kind: "use",    icon: "📜", name: "암행어사 마패", desc: "지금 문제의 틀린 보기를 지워요" },
    smoke:     { kind: "attack", icon: "🌫️", name: "봉화 연기",   desc: "1위의 문제를 3초 동안 가려요" },
    fuel:      { kind: "bad",    icon: "🛢️", name: "오염 연료",   desc: "3초 동안 멈춰요" },
    ink:       { kind: "bad",    icon: "🖌️", name: "먹물",        desc: "3초 동안 문제가 가려져요" }
  }
};
