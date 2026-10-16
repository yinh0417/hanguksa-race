/*
 * 한국사 레이스 설정 파일
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

  // ③ 게임 숫자 (시범 수업 뒤 여기서 조정)
  classCount: 7,          // 반 개수
  questionsPerSet: 5,     // 세트당 문제 수
  raceSeconds: 180,       // 한 판 시간(초)
  finishCells: 15,        // 결승선까지 칸 수
  cellsPerScene: 3,       // 몇 칸마다 배경 장면이 바뀌는지
  timeLimit: { ox: 20, mc: 30 },  // 문제별 제한 시간(초)
  penaltySeconds: 3,      // 오답 벌칙 시간(초)
  hitSeconds: 3,          // 물풍선·신기전에 맞았을 때 멈추는 시간(초)
  maxNick: 6,             // 닉네임 최대 글자 수

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
