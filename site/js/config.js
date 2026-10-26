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
  publicUrl: "https://hanguksa-race.netlify.app/",

  // ③ 게임 숫자 (시범 수업 뒤 여기서 조정)
  classCount: 7,          // 반 개수
  studentsPerClass: 24,   // 한 반 최대 학생 수(출석번호 1~이 숫자)
  questionsPerSet: 5,     // 세트당 문제 수
  raceSeconds: 180,       // 한 판 시간(초)
  finishCells: 15,        // 결승선까지 칸 수
  cellsPerScene: 3,       // 몇 칸마다 배경 장면이 바뀌는지
  timeLimit: { ox: 20, mc: 30 },  // 문제별 제한 시간(초)
  penaltySeconds: 3,      // 오답 벌칙 시간(초)
  hitSeconds: 3,          // 물풍선·신기전에 맞았을 때 멈추는 시간(초)
  maxNick: 6,             // 닉네임 최대 글자 수

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
    fuel:      { kind: "bad",    icon: "🛢️", name: "오염 연료",   desc: "3초 동안 멈춰요" },
    ink:       { kind: "bad",    icon: "🖌️", name: "먹물",        desc: "3초 동안 문제가 가려져요" }
  }
};
