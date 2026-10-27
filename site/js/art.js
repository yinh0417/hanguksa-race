/*
 * 그림: 탈것 102종과 시대별 배경 장면
 * 모든 그림은 코드로 그린 평면 그림입니다. 장면 하나를 바꾸려면
 * SCENE_ART의 해당 함수만 고치면 됩니다.
 */
(function () {
  const INK = '#22213A';
  const SKIN = '#F2C7A0';
  const W = 300, H = 200, GROUND = 150; // 장면 한 칸의 크기

  // 탈것 102종(10가지 종류): 실제 종류의 느낌만 살린 창작 디자인(상표·로고·국가 표식 없음), 운전자는 귀여운 동물
  // 순서를 바꾸면 이미 고른 학생의 차가 달라지니, 새 탈것은 맨 뒤에 붙여 주세요.
  const CARS = [
    { name: '전기차',   group: '육상 교통수단', kind: 'ev',     driver: 'rabbit',  body: '#E2412E', stripe: '#FFD9CF' },
    { name: 'SUV',      group: '육상 교통수단', kind: 'suv',    driver: 'bear',    body: '#F28C28', stripe: '#FFE6C2' },
    { name: '스포츠카', group: '육상 교통수단', kind: 'sport',  driver: 'cat',     body: '#F5C242', stripe: '#FFF6D2' },
    { name: '고급 세단', group: '육상 교통수단', kind: 'luxury', driver: 'hamster', body: '#2E9E5B', stripe: '#CDEFD9' },
    { name: '해치백',   group: '육상 교통수단', kind: 'hatch',  driver: 'puppy',   body: '#3FB6E8', stripe: '#D8F2FC' },
    { name: '픽업트럭', group: '육상 교통수단', kind: 'pickup', driver: 'penguin', body: '#2350B8', stripe: '#CFDBF7' },
    { name: '박스카',   group: '육상 교통수단', kind: 'box',    driver: 'panda',   body: '#8A55D6', stripe: '#E6D9F8' },
    { name: '레트로카', group: '육상 교통수단', kind: 'retro',  driver: 'chick',   body: '#F07AAE', stripe: '#FDE0EC' },
    { name: '돌바퀴 수레', group: '전통 교통수단', kind: 'stonecart', driver: 'bear',    body: '#A0703F', stripe: '#E9D2B0' },
    { name: '가마',       group: '전통 교통수단', kind: 'gama',      driver: 'cat',     body: '#B3262E', stripe: '#F5C242' },
    { name: '말마차',     group: '전통 교통수단', kind: 'carriage',  driver: 'rabbit',  body: '#2C5AA0', stripe: '#F5C242' },
    { name: '신기전 화차', group: '전통 교통수단', kind: 'hwacha',    driver: 'penguin', body: '#8B5A2B', stripe: '#E2412E' },
    { name: '인력거',     group: '전통 교통수단', kind: 'rickshaw',  driver: 'hamster', body: '#2A2A35', stripe: '#C9A227' },
    { name: '한성 전차',  group: '전통 교통수단', kind: 'tram',      driver: 'puppy',   body: '#C9A15A', stripe: '#7A4E2D' },
    { name: '증기 기관차', group: '전통 교통수단', kind: 'steam',     driver: 'panda',   body: '#34343F', stripe: '#E2412E' },
    { name: '경운기',     group: '농기계', kind: 'tiller',    driver: 'chick',   body: '#2F7FD1', stripe: '#D8E9FA' },
    { name: '전차(탱크)', group: '특수 차량', kind: 'tank',      driver: 'bear',    body: '#5E6B3A', stripe: '#8E9A5E' },
    { name: '자주포',     group: '특수 차량', kind: 'spg',       driver: 'puppy',   body: '#6E7550', stripe: '#9AA27A' },
    { name: '군용 지프',  group: '특수 차량', kind: 'jeep',      driver: 'cat',     body: '#5B6B33', stripe: '#AEB98A' },
    { name: '군용 트럭',  group: '특수 차량', kind: 'mtruck',    driver: 'panda',   body: '#56632F', stripe: '#A3AD7C' },
    { name: '구급차',     group: '특수 차량', kind: 'ambulance', driver: 'rabbit',  body: '#F4F5F7', stripe: '#E2412E' },
    { name: '경찰차',     group: '특수 차량', kind: 'police',    driver: 'penguin', body: '#1F3B8C', stripe: '#FFFFFF' },
    { name: '소방차',     group: '특수 차량', kind: 'fire',      driver: 'hamster', body: '#D7261E', stripe: '#FFD84A' },
    { name: '시내버스',   group: '특수 차량', kind: 'bus',       driver: 'chick',   body: '#2F9E44', stripe: '#D7F5DF' },
    { name: '택시',       group: '특수 차량', kind: 'taxi',      driver: 'puppy',   body: '#F7A11A', stripe: '#FFF0C8' },
    { name: '루돌프 썰매', group: '상상 교통수단', kind: 'x_rudolph',    driver: 'bear',    body: '#D7261E', stripe: '#F5C242' },
    { name: '호박 마차',   group: '상상 교통수단', kind: 'x_pumpkin',    driver: 'cat',     body: '#F28C28', stripe: '#D4A72C' },
    { name: '마법 양탄자', group: '상상 교통수단', kind: 'x_carpet',     driver: 'fox',     body: '#B3262E', stripe: '#F5C242' },
    { name: '마법 빗자루', group: '상상 교통수단', kind: 'x_broom',      driver: 'rabbit',  body: '#8A5A2B', stripe: '#6B3FA0' },
    { name: '둥실 구름',   group: '상상 교통수단', kind: 'x_cloud',      driver: 'hamster', body: '#FFFFFF', stripe: '#8FD3FF' },
    { name: '우주 로켓',   group: '상상 교통수단', kind: 'x_rocket',     driver: 'penguin', body: '#F4F5F7', stripe: '#E2412E' },
    { name: 'UFO',         group: '상상 교통수단', kind: 'x_ufo',        driver: 'koala',   body: '#A9B1BD', stripe: '#34C759' },
    { name: '종이비행기',  group: '상상 교통수단', kind: 'x_paperplane', driver: 'puppy',   body: '#FFFFFF', stripe: '#3FB6E8' },
    { name: '눈썰매',      group: '상상 교통수단', kind: 'x_sled',       driver: 'panda',   body: '#C98B55', stripe: '#D7261E' },
    { name: '거북이 등',   group: '상상 교통수단', kind: 'x_turtle',     driver: 'chick',   body: '#3E9A4D', stripe: '#FF8FA3' },
    { name: '여객기',      group: '항공 교통수단', kind: 'p_airliner',  driver: 'owl',     body: '#F4F5F7', stripe: '#0A6AD8' },
    { name: '전투기',      group: '항공 교통수단', kind: 'p_fighter',   driver: 'eagle',   body: '#8A95A8', stripe: '#5B6578' },
    { name: '경비행기',    group: '항공 교통수단', kind: 'p_light',     driver: 'sparrow', body: '#E2412E', stripe: '#FFFFFF' },
    { name: '복엽기',      group: '항공 교통수단', kind: 'p_biplane',   driver: 'tiger',   body: '#F5C242', stripe: '#D7261E' },
    { name: '헬리콥터',    group: '항공 교통수단', kind: 'p_heli',      driver: 'bear',    body: '#2F7FD1', stripe: '#FFFFFF' },
    { name: '열기구',      group: '항공 교통수단', kind: 'p_balloon',   driver: 'pig',     body: '#FF6B6B', stripe: '#FFD93B' },
    { name: '비행선',      group: '항공 교통수단', kind: 'p_blimp',     driver: 'duck',    body: '#C9CED8', stripe: '#0A84FF' },
    { name: '수상 비행기', group: '항공 교통수단', kind: 'p_seaplane',  driver: 'parrot',  body: '#2F9E44', stripe: '#FFFFFF' },
    { name: '글라이더',    group: '항공 교통수단', kind: 'p_glider',    driver: 'magpie',  body: '#FFFFFF', stripe: '#E2412E' },
    { name: '곡예 비행기', group: '항공 교통수단', kind: 'p_aerobatic', driver: 'cat',     body: '#0A3D91', stripe: '#FFFFFF' },
    { name: '거북선',      group: '해상 교통수단', kind: 's_turtle',    driver: 'tiger',   body: '#6B4A2B', stripe: '#D9A441' },
    { name: '판옥선',      group: '해상 교통수단', kind: 's_panokseon', driver: 'bear',    body: '#A0703F', stripe: '#E2412E' },
    { name: '황포 돛배',   group: '해상 교통수단', kind: 's_sailboat',  driver: 'rabbit',  body: '#8B5A2B', stripe: '#E8B04A' },
    { name: '요트',        group: '해상 교통수단', kind: 's_yacht',     driver: 'penguin', body: '#FFFFFF', stripe: '#0A84FF' },
    { name: '항공모함',    group: '해상 교통수단', kind: 's_carrier',   driver: 'eagle',   body: '#7C8594', stripe: '#5B6578' },
    { name: '잠수함',      group: '해상 교통수단', kind: 's_submarine', driver: 'koala',   body: '#F5C242', stripe: '#2B2B33' },
    { name: '크루즈선',    group: '해상 교통수단', kind: 's_cruise',    driver: 'hamster', body: '#1F3B8C', stripe: '#E2412E' },
    { name: '어선',        group: '해상 교통수단', kind: 's_fishing',   driver: 'puppy',   body: '#2F7FD1', stripe: '#FFD84A' },
    { name: '모터보트',    group: '해상 교통수단', kind: 's_motorboat', driver: 'fox',     body: '#E2412E', stripe: '#FFFFFF' },
    { name: '컨테이너선',  group: '해상 교통수단', kind: 's_container', driver: 'panda',   body: '#9C3B2B', stripe: '#FFFFFF' },
    { name: '병아리',      group: '조류 캐릭터', kind: 'b_chick',    driver: 'chick',    body: '#FFD84A', stripe: '#F5C21F' },
    { name: '오리',        group: '조류 캐릭터', kind: 'b_duck',     driver: 'duck',     body: '#FFFAF0', stripe: '#FF9F1C' },
    { name: '펭귄',        group: '조류 캐릭터', kind: 'b_penguin',  driver: 'penguin',  body: '#2C3550', stripe: '#E2412E' },
    { name: '부엉이',      group: '조류 캐릭터', kind: 'b_owl',      driver: 'owl',      body: '#A8774F', stripe: '#F3E2C8' },
    { name: '참새',        group: '조류 캐릭터', kind: 'b_sparrow',  driver: 'sparrow',  body: '#B07D52', stripe: '#F4E6D4' },
    { name: '앵무새',      group: '조류 캐릭터', kind: 'b_parrot',   driver: 'parrot',   body: '#3CC46B', stripe: '#1F8FD6' },
    { name: '까치',        group: '조류 캐릭터', kind: 'b_magpie',   driver: 'magpie',   body: '#26262E', stripe: '#2F5FB8' },
    { name: '독수리',      group: '조류 캐릭터', kind: 'b_eagle',    driver: 'eagle',    body: '#7A5232', stripe: '#FFC21A' },
    { name: '홍학',        group: '조류 캐릭터', kind: 'b_flamingo', driver: 'flamingo', body: '#FF9CBC', stripe: '#FF7FA6' },
    { name: '백조',        group: '조류 캐릭터', kind: 'b_swan',     driver: 'swan',     body: '#FFFFFF', stripe: '#FF8C1A' },
    { name: '강아지',      group: '포유류 캐릭터', kind: 'a_puppy',   driver: 'puppy',   body: '#FFFAF2', stripe: '#C98B55' },
    { name: '고양이',      group: '포유류 캐릭터', kind: 'a_cat',     driver: 'cat',     body: '#F8C27E', stripe: '#E08F3C' },
    { name: '토끼',        group: '포유류 캐릭터', kind: 'a_rabbit',  driver: 'rabbit',  body: '#FFFFFF', stripe: '#FFC2CF' },
    { name: '곰',          group: '포유류 캐릭터', kind: 'a_bear',    driver: 'bear',    body: '#C8946A', stripe: '#F1DCC4' },
    { name: '판다',        group: '포유류 캐릭터', kind: 'a_panda',   driver: 'panda',   body: '#FFFFFF', stripe: '#2B2633' },
    { name: '햄스터',      group: '포유류 캐릭터', kind: 'a_hamster', driver: 'hamster', body: '#F4CF9C', stripe: '#FFF7EA' },
    { name: '여우',        group: '포유류 캐릭터', kind: 'a_fox',     driver: 'fox',     body: '#F39A4C', stripe: '#FFF8EF' },
    { name: '호랑이',      group: '포유류 캐릭터', kind: 'a_tiger',   driver: 'tiger',   body: '#F6A13A', stripe: '#3A2A1E' },
    { name: '아기 돼지',   group: '포유류 캐릭터', kind: 'a_pig',     driver: 'pig',     body: '#F9BCCB', stripe: '#F28EA6' },
    { name: '코알라',      group: '포유류 캐릭터', kind: 'a_koala',   driver: 'koala',   body: '#B4BAC4', stripe: '#E8EAEE' },
    { name: '바다사자',    group: '해양 동물 캐릭터', kind: 'm_sealion', driver: 'sealion', body: '#9A7350', stripe: '#C8A67F' },
    { name: '독도 강치',   group: '해양 동물 캐릭터', kind: 'm_kangchi', driver: 'kangchi', body: '#66615D', stripe: '#8F8984' },
    { name: '바다표범',    group: '해양 동물 캐릭터', kind: 'm_seal',    driver: 'seal',    body: '#AAB5C3', stripe: '#DFE5EC' },
    { name: '해달',        group: '해양 동물 캐릭터', kind: 'm_otter',   driver: 'otter',   body: '#8B6545', stripe: '#D9C1A2' },
    { name: '돌고래',      group: '해양 동물 캐릭터', kind: 'm_dolphin', driver: 'puppy',   body: '#7FB6E6', stripe: '#F4F8FB' },
    { name: '상어',        group: '해양 동물 캐릭터', kind: 'm_shark',   driver: 'puppy',   body: '#8494A8', stripe: '#F4F8FB' },
    { name: '혹등고래',    group: '해양 동물 캐릭터', kind: 'm_whale',   driver: 'puppy',   body: '#4A6FA5', stripe: '#F4F8FB' },
    { name: '범고래',      group: '해양 동물 캐릭터', kind: 'm_orca',    driver: 'puppy',   body: '#26262E', stripe: '#FFFFFF' },
    { name: '시베리안 허스키', group: '포유류 캐릭터', kind: 'a_husky', driver: 'husky',   body: '#8C96A5', stripe: '#FDFDFD' },
    { name: '진돗개',      group: '포유류 캐릭터', kind: 'a_jindo',   driver: 'jindo',   body: '#E2B675', stripe: '#FBF1DE' },
    { name: '풍산개',      group: '포유류 캐릭터', kind: 'a_pungsan', driver: 'pungsan', body: '#FBFAF6', stripe: '#E4E0D8' },
    { name: '삽살개',      group: '포유류 캐릭터', kind: 'a_sapsal',  driver: 'sapsal',  body: '#A3988C', stripe: '#7D7268' },
    { name: '사자',        group: '포유류 캐릭터', kind: 'a_lion',    driver: 'lion',    body: '#F2B552', stripe: '#C9752A' },
    { name: '미어캣',      group: '포유류 캐릭터', kind: 'a_meerkat', driver: 'meerkat', body: '#DCB57E', stripe: '#F1DCBC' },
    { name: '닭',          group: '조류 캐릭터', kind: 'b_rooster', driver: 'rooster', body: '#FFFAF0', stripe: '#E2412E' },
    { name: '바나나보트',  group: '해상 교통수단', kind: 's_banana', driver: 'rabbit', body: '#FFD93B', stripe: '#E0B000' },
    { name: '지하철',      group: '특수 차량', kind: 't_subway',    driver: 'owl',     body: '#E9EDF2', stripe: '#34A853' },
    { name: '기차',        group: '특수 차량', kind: 't_train',     driver: 'eagle',   body: '#F4F5F7', stripe: '#1F3B8C' },
    { name: '포클레인',    group: '특수 차량', kind: 't_excavator', driver: 'bear',    body: '#F5B700', stripe: '#3A3A40' },
    { name: '덤프트럭',    group: '특수 차량', kind: 't_dump',      driver: 'tiger',   body: '#F28C28', stripe: '#9AA0AE' },
    { name: '레미콘',      group: '특수 차량', kind: 't_mixer',     driver: 'hamster', body: '#2F7FD1', stripe: '#E2412E' },
    { name: '지게차',      group: '특수 차량', kind: 't_forklift',  driver: 'koala',   body: '#F5C242', stripe: '#3A3A40' },
    { name: '크레인차',    group: '특수 차량', kind: 't_crane',     driver: 'fox',     body: '#E2412E', stripe: '#F5C242' },
    { name: '트랙터',      group: '농기계', kind: 'f_tractor',      driver: 'pig',     body: '#2F9E44', stripe: '#F5C242' },
    { name: '콤바인',      group: '농기계', kind: 'f_combine',      driver: 'rooster', body: '#E2412E', stripe: '#F5C242' },
    { name: '이앙기',      group: '농기계', kind: 'f_transplanter', driver: 'duck',    body: '#2F7FD1', stripe: '#FFFFFF' },
    { name: '농업용 드론', group: '농기계', kind: 'f_drone',        driver: 'jindo',   body: '#F4F5F7', stripe: '#34C759' }
  ];
  // 학생 화면 탭 순서(새 종류를 만들면 여기에도 넣어 주세요)
  const GROUPS = ['육상 교통수단', '전통 교통수단', '특수 차량', '농기계', '항공 교통수단', '해상 교통수단', '상상 교통수단', '조류 캐릭터', '포유류 캐릭터', '해양 동물 캐릭터'];

  // 차 모양: 몸체, 창문, 창문 아랫선(운전자가 보이는 높이), 운전자 위치, 바퀴 위치, 앞등 위치
  const SHAPES = {
    ev: {
      body: ['M8 48 C8 40 12 36 20 34 C30 22 40 15 56 14 L70 14 C84 15 96 24 104 32 C111 34 116 38 116 46 L116 50 C116 54 113 56 109 56 L12 56 C9 56 8 53 8 48 Z'],
      win: ['M34 33 C42 22 50 18 58 18 L69 18 C80 19 89 25 96 33 Z'], belt: 33,
      head: [76, 25, 9.5], wheels: [30, 92], light: 'bar', lx: 107, ly: 38
    },
    suv: {
      body: ['M8 52 L8 36 C8 33 10 31 14 31 L26 31 L34 14 C35 12 37 11 40 11 L96 11 C99 11 101 13 102 15 L108 31 L112 31 C115 31 117 34 117 38 L117 52 C117 55 115 57 112 57 L12 57 C10 57 8 55 8 52 Z'],
      win: ['M37 29 L43 15 L66 15 L66 29 Z', 'M70 29 L70 15 L95 15 L101 29 Z'], belt: 29,
      head: [84, 22, 9.5], wheels: [31, 94], light: 'square', lx: 109, ly: 35, rails: 'M42 9 H96'
    },
    sport: {
      body: ['M6 50 C6 44 10 42 18 41 L40 38 C50 26 58 22 68 22 L78 22 C86 23 92 30 96 36 L110 39 C115 40 118 43 118 48 L118 51 C118 54 116 56 112 56 L12 56 C8 56 6 54 6 50 Z', 'M5 40 L3 32 L17 32 L19 40 Z'],
      win: ['M50 37 C56 28 62 25 68 25 L76 25 C82 26 87 31 90 37 Z'], belt: 37,
      head: [72, 29, 8.8], wheels: [28, 96], light: 'slim', lx: 108, ly: 41
    },
    luxury: {
      body: ['M7 48 C7 42 10 39 16 38 L30 37 L40 20 C42 17 45 16 48 16 L74 16 C78 16 81 18 83 21 L92 36 L110 38 C115 39 117 42 117 47 L117 51 C117 54 115 56 112 56 L12 56 C9 56 7 54 7 51 Z'],
      win: ['M43 35 L49 20 L60 20 L60 35 Z', 'M64 35 L64 20 L77 20 L86 35 Z'], belt: 35,
      head: [73, 26, 9], wheels: [31, 93], light: 'round', lx: 110, ly: 41, grille: true
    },
    hatch: {
      body: ['M10 50 C10 42 12 36 18 33 C24 20 32 13 46 12 L66 12 C80 12 90 22 96 32 C106 34 112 38 112 46 L112 51 C112 54 110 56 107 56 L14 56 C11 56 10 53 10 50 Z'],
      win: ['M24 32 C29 22 36 16 46 16 L56 16 L56 32 Z', 'M60 32 L60 16 L66 16 C76 16 84 23 89 32 Z'], belt: 32,
      head: [71, 24, 9.5], wheels: [30, 90], light: 'round', lx: 105, ly: 39
    },
    pickup: {
      body: ['M6 34 L54 34 L54 57 L10 57 C7 57 6 55 6 52 Z', 'M52 57 L52 34 L60 34 L68 14 C69 12 71 11 74 11 L94 11 C97 11 99 13 100 15 L106 32 L111 33 C115 34 117 37 117 41 L117 52 C117 55 115 57 112 57 Z'],
      win: ['M71 30 L76 15 L95 15 L101 30 Z'], belt: 30,
      head: [86, 22, 9.5], wheels: [28, 94], light: 'square', lx: 110, ly: 37, bed: true
    },
    box: {
      body: ['M10 53 L10 18 C10 12 14 9 20 9 L92 9 C100 9 104 13 106 20 L112 34 C115 35 117 38 117 42 L117 53 C117 55 115 57 113 57 L14 57 C11 57 10 55 10 53 Z'],
      win: ['M16 30 L16 14 L48 14 L48 30 Z', 'M52 30 L52 14 L90 14 C95 14 98 17 100 21 L104 30 Z'], belt: 30,
      head: [79, 21, 10], wheels: [30, 93], light: 'round', lx: 111, ly: 40
    },
    retro: {
      body: ['M8 50 C8 44 12 42 16 41 C20 24 36 12 58 12 C80 12 96 24 102 40 C110 41 114 45 114 50 L114 52 C114 55 112 57 109 57 L13 57 C10 57 8 55 8 52 Z'],
      win: ['M28 38 C32 26 42 18 55 17 L56 38 Z', 'M60 38 L60 17 C74 18 84 26 89 38 Z'], belt: 38,
      head: [73, 28, 9.5], wheels: [30, 90], light: 'bigRound', lx: 106, ly: 43
    },
    // 특수 차량 (extra: 몸체 위에 덧그리는 장식)
    jeep: {
      body: ['M6 50 L6 33 C6 30 8 28 11 28 L104 28 C108 28 111 30 112 33 L117 40 L117 51 C117 54 115 56 112 56 L10 56 C8 56 6 54 6 50 Z'],
      win: ['M76 28 L82 11 L85 11 L79 28 Z'], belt: 28,
      head: [62, 19, 9.5], wheels: [28, 94], light: 'round', lx: 109, ly: 33,
      extra: P => `<circle cx="9" cy="40" r="8" fill="#2a2a30"/><circle cx="9" cy="40" r="3.6" fill="#8a8f80"/>` + camo(P, [[40, 40, 9, 4], [70, 46, 7, 3.5], [96, 38, 6, 3]])
    },
    mtruck: {
      body: ['M5 50 L5 18 C5 10 10 6 18 6 L66 6 C73 6 76 10 76 16 L76 50 Z', 'M5 48 L78 48 L78 22 L97 22 C100 22 102 24 103 27 L109 36 C114 37 117 40 117 44 L117 53 C117 55 115 57 113 57 L9 57 C6 57 5 55 5 53 Z'],
      win: ['M82 35 L82 26 L97 26 C99 26 100 27 101 29 L104 35 Z'], belt: 35,
      head: [91, 29, 7.5], wheels: [24, 50, 96], light: 'square', lx: 110, ly: 40,
      extra: P => [20, 36, 52, 66].map(x => `<path d="M${x} 8 V48" stroke="${P.deep}" stroke-width="1.6" opacity=".35"/>`).join('') + `<path d="M8 30 H74" stroke="${P.deep}" stroke-width="1" opacity=".3"/>`
    },
    ambulance: {
      body: ['M7 53 L7 11 C7 8 9 6 12 6 L78 6 L78 18 L96 18 C100 18 102 20 104 24 L111 34 C115 35 117 38 117 42 L117 53 C117 55 115 57 113 57 L11 57 C8 57 7 55 7 53 Z'],
      win: ['M82 32 L82 22 L97 22 C99 22 100 23 101 25 L105 32 Z', 'M12 22 L12 12 L26 12 L26 22 Z'], belt: 32,
      head: [91, 26, 7.5], wheels: [28, 96], light: 'square', lx: 110, ly: 38,
      extra: () => `<rect x="44" y="12" width="7" height="20" rx="1" fill="#E2412E"/><rect x="37.5" y="18.5" width="20" height="7" rx="1" fill="#E2412E"/>` +
        lightbar(56, 1, 18) + `<text x="66" y="53" font-size="7" font-weight="800" fill="#E2412E" text-anchor="middle" font-family="Pretendard Variable, sans-serif">119 구급</text>`
    },
    fire: {
      body: ['M6 53 L6 18 C6 15 8 13 11 13 L80 13 L80 16 L96 16 C100 16 102 18 104 22 L111 34 C115 35 117 38 117 42 L117 53 C117 55 115 57 113 57 L10 57 C7 57 6 55 6 53 Z'],
      win: ['M84 32 L84 20 L97 20 C99 20 100 21 101 23 L106 32 Z'], belt: 32,
      head: [93, 26, 7.5], wheels: [24, 50, 96], light: 'square', lx: 110, ly: 38,
      extra: P => {
        let g = `<path d="M14 10 V13 M74 10 V13" stroke="#9ea3b1" stroke-width="2"/><path d="M8 4.5 H84 M8 9.5 H84" stroke="#e3e5ec" stroke-width="1.8" stroke-linecap="round"/>`;
        for (let x = 12; x <= 82; x += 7) g += `<path d="M${x} 4.5 V9.5" stroke="#e3e5ec" stroke-width="1.2"/>`;
        g += `<path d="M30 18 V31 M54 18 V31" stroke="${P.deep}" stroke-width="1" opacity=".5"/>`;
        return g + lightbar(84, 11, 12) + `<text x="42" y="29" font-size="9" font-weight="800" fill="#fff" text-anchor="middle" font-family="Pretendard Variable, sans-serif">119</text>`;
      }
    },
    bus: {
      body: ['M6 53 L6 10 C6 7 8 5 11 5 L108 5 C113 5 116 9 117 14 L118 50 C118 54 116 57 112 57 L10 57 C7 57 6 55 6 53 Z'],
      win: ['M11 30 L11 11 L29 11 L29 30 Z', 'M33 30 L33 11 L51 11 L51 30 Z', 'M55 30 L55 11 L73 11 L73 30 Z', 'M77 30 L77 11 L95 11 L95 30 Z', 'M99 30 L99 11 L111 11 C113 11 114 13 114 15 L116 30 Z'], belt: 30,
      head: [107, 22, 7], wheels: [26, 94], light: 'square', lx: 111, ly: 40,
      extra: P => driver('bear', 20, 24, 5.5) + driver('cat', 42, 24, 5.5) + driver('rabbit', 64, 25, 5.5) +
        `<rect x="79" y="33" width="14" height="20" rx="1.5" fill="none" stroke="${P.dark}" stroke-width="1"/><path d="M86 33 V53" stroke="${P.dark}" stroke-width=".8"/>`
    }
  };
  // 경찰차·택시는 고급 세단 모양에 장식만 더해요
  SHAPES.police = Object.assign({}, SHAPES.luxury, {
    extra: P => lightbar(49, 10, 28) + `<rect x="34" y="37" width="54" height="12" rx="3" fill="#fff"/><text x="61" y="46.5" font-size="8.5" font-weight="800" fill="${P.c.body}" text-anchor="middle" font-family="Pretendard Variable, sans-serif">경찰</text>`
  });
  SHAPES.taxi = Object.assign({}, SHAPES.luxury, {
    extra: () => {
      let g = `<path d="M54 16 L56 8 L70 8 L72 16 Z" fill="#fff" stroke="#c9ccd6" stroke-width=".8"/><text x="63" y="14.5" font-size="5.6" font-weight="800" fill="#22213A" text-anchor="middle" font-family="Pretendard Variable, sans-serif">택시</text>`;
      for (let x = 30, k = 0; x < 92; x += 4, k++) g += `<rect x="${x}" y="${k % 2 ? 44 : 41}" width="4" height="3" fill="#22213A"/>`;
      return g;
    }
  });

  // 빨강·파랑 경광등
  function lightbar(x, y, w) {
    return `<rect x="${x}" y="${y}" width="${w}" height="5.5" rx="2" fill="#ff3b30"/><rect x="${x + w / 2}" y="${y}" width="${w / 2}" height="5.5" rx="2" fill="#0a84ff"/><rect x="${x + 1.5}" y="${y + 1}" width="${w - 3}" height="1.4" rx=".7" fill="#fff" opacity=".6"/>`;
  }
  // 얼룩무늬: [x, y, 가로 반지름, 세로 반지름]
  function camo(P, blobs) {
    return blobs.map(([x, y, rx, ry], i) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${i % 2 ? P.deep : P.c.stripe}" opacity=".55" transform="rotate(${(i * 23) % 40 - 20} ${x} ${y})"/>`).join('');
  }

  // 귀여운 동물 운전자 (창작 캐릭터)
  function driver(kind, x, y, r) {
    const eye = (dx, dy) => `<circle cx="${(x + dx).toFixed(1)}" cy="${(y + dy).toFixed(1)}" r="${(r * 0.14).toFixed(2)}" fill="#2b2633"/><circle cx="${(x + dx + r * 0.05).toFixed(1)}" cy="${(y + dy - r * 0.06).toFixed(1)}" r="${(r * 0.05).toFixed(2)}" fill="#fff"/>`;
    const face = (eyeY, dark) => {
      const ey = eyeY == null ? r * 0.05 : eyeY;
      let g = eye(-r * 0.38, ey) + eye(r * 0.38, ey);
      g += `<ellipse cx="${(x - r * 0.62).toFixed(1)}" cy="${(y + r * 0.32).toFixed(1)}" rx="${(r * 0.2).toFixed(1)}" ry="${(r * 0.12).toFixed(1)}" fill="#ff8fa3" opacity=".6"/><ellipse cx="${(x + r * 0.62).toFixed(1)}" cy="${(y + r * 0.32).toFixed(1)}" rx="${(r * 0.2).toFixed(1)}" ry="${(r * 0.12).toFixed(1)}" fill="#ff8fa3" opacity=".6"/>`;
      g += `<path d="M${(x - r * 0.16).toFixed(1)} ${(y + r * 0.34).toFixed(1)} q${(r * 0.08).toFixed(1)} ${(r * 0.12).toFixed(1)} ${(r * 0.16).toFixed(1)} 0 q${(r * 0.08).toFixed(1)} ${(r * 0.12).toFixed(1)} ${(r * 0.16).toFixed(1)} 0" fill="none" stroke="${dark || '#2b2633'}" stroke-width="${(r * 0.07).toFixed(2)}" stroke-linecap="round"/>`;
      return g;
    };
    const head = (fill, stroke) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke || 'rgba(0,0,0,.18)'}" stroke-width=".7"/>`;
    const f = n => n.toFixed(1);
    switch (kind) {
      case 'rabbit':
        return `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 1.25)}" rx="${f(r * 0.28)}" ry="${f(r * 0.75)}" fill="#fff" stroke="rgba(0,0,0,.15)" stroke-width=".7"/><ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 1.25)}" rx="${f(r * 0.13)}" ry="${f(r * 0.5)}" fill="#ffc2cf"/>
          <ellipse cx="${f(x + r * 0.4)}" cy="${f(y - r * 1.25)}" rx="${f(r * 0.28)}" ry="${f(r * 0.75)}" fill="#fff" stroke="rgba(0,0,0,.15)" stroke-width=".7"/><ellipse cx="${f(x + r * 0.4)}" cy="${f(y - r * 1.25)}" rx="${f(r * 0.13)}" ry="${f(r * 0.5)}" fill="#ffc2cf"/>` + head('#fff') + face();
      case 'bear':
        return `<circle cx="${f(x - r * 0.72)}" cy="${f(y - r * 0.72)}" r="${f(r * 0.34)}" fill="#b5835a"/><circle cx="${f(x + r * 0.72)}" cy="${f(y - r * 0.72)}" r="${f(r * 0.34)}" fill="#b5835a"/>` + head('#c8946a') +
          `<ellipse cx="${x}" cy="${f(y + r * 0.38)}" rx="${f(r * 0.42)}" ry="${f(r * 0.3)}" fill="#f1dcc4"/>` + face(null);
      case 'cat':
        return `<path d="M${f(x - r * 0.9)} ${f(y - r * 0.2)} L${f(x - r * 0.75)} ${f(y - r * 1.25)} L${f(x - r * 0.1)} ${f(y - r * 0.8)} Z M${f(x + r * 0.9)} ${f(y - r * 0.2)} L${f(x + r * 0.75)} ${f(y - r * 1.25)} L${f(x + r * 0.1)} ${f(y - r * 0.8)} Z" fill="#f6b46a" stroke="rgba(0,0,0,.15)" stroke-width=".7"/>` + head('#f8c27e') +
          `<path d="M${f(x - r * 0.3)} ${f(y - r * 0.85)} l${f(r * 0.1)} ${f(r * 0.35)} M${x} ${f(y - r * 0.95)} v${f(r * 0.38)} M${f(x + r * 0.3)} ${f(y - r * 0.85)} l${f(-r * 0.1)} ${f(r * 0.35)}" stroke="#e08f3c" stroke-width="${f(r * 0.1)}" stroke-linecap="round"/>` + face();
      case 'hamster':
        return `<circle cx="${f(x - r * 0.68)}" cy="${f(y - r * 0.78)}" r="${f(r * 0.26)}" fill="#e9b884"/><circle cx="${f(x + r * 0.68)}" cy="${f(y - r * 0.78)}" r="${f(r * 0.26)}" fill="#e9b884"/>` + head('#f4cf9c') +
          `<ellipse cx="${x}" cy="${f(y + r * 0.42)}" rx="${f(r * 0.7)}" ry="${f(r * 0.45)}" fill="#fff7ea"/>` + face();
      case 'puppy':
        return head('#fffaf2') + `<ellipse cx="${f(x - r * 0.92)}" cy="${f(y - r * 0.05)}" rx="${f(r * 0.3)}" ry="${f(r * 0.62)}" fill="#c98b55" transform="rotate(18 ${f(x - r * 0.92)} ${f(y)})"/><ellipse cx="${f(x + r * 0.92)}" cy="${f(y - r * 0.05)}" rx="${f(r * 0.3)}" ry="${f(r * 0.62)}" fill="#c98b55" transform="rotate(-18 ${f(x + r * 0.92)} ${f(y)})"/>` +
          `<ellipse cx="${f(x + r * 0.35)}" cy="${f(y - r * 0.15)}" rx="${f(r * 0.3)}" ry="${f(r * 0.26)}" fill="#e7c59f"/><ellipse cx="${x}" cy="${f(y + r * 0.2)}" rx="${f(r * 0.14)}" ry="${f(r * 0.1)}" fill="#2b2633"/>` + face();
      case 'penguin':
        return head('#2c3550', 'rgba(0,0,0,.3)') + `<ellipse cx="${x}" cy="${f(y + r * 0.15)}" rx="${f(r * 0.74)}" ry="${f(r * 0.7)}" fill="#fff"/>` + face(r * 0.02) +
          `<path d="M${f(x - r * 0.18)} ${f(y + r * 0.2)} L${f(x + r * 0.18)} ${f(y + r * 0.2)} L${x} ${f(y + r * 0.42)} Z" fill="#ffb02e"/>`;
      case 'panda':
        return `<circle cx="${f(x - r * 0.75)}" cy="${f(y - r * 0.72)}" r="${f(r * 0.32)}" fill="#2b2633"/><circle cx="${f(x + r * 0.75)}" cy="${f(y - r * 0.72)}" r="${f(r * 0.32)}" fill="#2b2633"/>` + head('#fff') +
          `<ellipse cx="${f(x - r * 0.38)}" cy="${f(y + r * 0.04)}" rx="${f(r * 0.26)}" ry="${f(r * 0.32)}" fill="#2b2633" transform="rotate(25 ${f(x - r * 0.38)} ${f(y)})"/><ellipse cx="${f(x + r * 0.38)}" cy="${f(y + r * 0.04)}" rx="${f(r * 0.26)}" ry="${f(r * 0.32)}" fill="#2b2633" transform="rotate(-25 ${f(x + r * 0.38)} ${f(y)})"/>` +
          `<circle cx="${f(x - r * 0.38)}" cy="${f(y + r * 0.02)}" r="${f(r * 0.1)}" fill="#fff"/><circle cx="${f(x + r * 0.38)}" cy="${f(y + r * 0.02)}" r="${f(r * 0.1)}" fill="#fff"/>` +
          `<ellipse cx="${x}" cy="${f(y + r * 0.3)}" rx="${f(r * 0.13)}" ry="${f(r * 0.09)}" fill="#2b2633"/>`;
      case 'chick':
        return `<path d="M${x} ${f(y - r * 0.95)} q${f(-r * 0.25)} ${f(-r * 0.5)} ${f(r * 0.05)} ${f(-r * 0.6)} M${x} ${f(y - r * 0.95)} q${f(r * 0.3)} ${f(-r * 0.4)} ${f(r * 0.4)} ${f(-r * 0.25)}" fill="none" stroke="#f2b600" stroke-width="${f(r * 0.14)}" stroke-linecap="round"/>` + head('#ffd84a') + face(null, '#c47a00') +
          `<path d="M${f(x - r * 0.16)} ${f(y + r * 0.22)} L${f(x + r * 0.16)} ${f(y + r * 0.22)} L${x} ${f(y + r * 0.4)} Z" fill="#ff9a1f"/>`;
      // ---- 새로 더한 동물 얼굴(동물 탈것과 운전자에 함께 써요) ----
      case 'fox':
        return `<path d="M${f(x - r * 0.95)} ${f(y - r * 0.1)} L${f(x - r * 0.75)} ${f(y - r * 1.3)} L${f(x - r * 0.05)} ${f(y - r * 0.85)} Z M${f(x + r * 0.95)} ${f(y - r * 0.1)} L${f(x + r * 0.75)} ${f(y - r * 1.3)} L${f(x + r * 0.05)} ${f(y - r * 0.85)} Z" fill="#f08a3c" stroke="rgba(0,0,0,.18)" stroke-width=".7"/>` +
          `<path d="M${f(x - r * 0.72)} ${f(y - r * 0.55)} L${f(x - r * 0.68)} ${f(y - r * 1.05)} L${f(x - r * 0.35)} ${f(y - r * 0.8)} Z M${f(x + r * 0.72)} ${f(y - r * 0.55)} L${f(x + r * 0.68)} ${f(y - r * 1.05)} L${f(x + r * 0.35)} ${f(y - r * 0.8)} Z" fill="#fff3e6"/>` +
          head('#f39a4c') + `<ellipse cx="${x}" cy="${f(y + r * 0.42)}" rx="${f(r * 0.78)}" ry="${f(r * 0.5)}" fill="#fff8ef"/>` + face() + `<ellipse cx="${x}" cy="${f(y + r * 0.18)}" rx="${f(r * 0.13)}" ry="${f(r * 0.09)}" fill="#2b2633"/>`;
      case 'tiger':
        return [-1, 1].map(s => `<circle cx="${f(x + s * r * 0.72)}" cy="${f(y - r * 0.72)}" r="${f(r * 0.3)}" fill="#f6a13a" stroke="rgba(0,0,0,.18)" stroke-width=".7"/><circle cx="${f(x + s * r * 0.72)}" cy="${f(y - r * 0.72)}" r="${f(r * 0.14)}" fill="#fff4e0"/>`).join('') + head('#f6a13a') +
          `<path d="M${x} ${f(y - r * 0.95)} v${f(r * 0.35)} M${f(x - r * 0.28)} ${f(y - r * 0.9)} l${f(r * 0.06)} ${f(r * 0.28)} M${f(x + r * 0.28)} ${f(y - r * 0.9)} l${f(-r * 0.06)} ${f(r * 0.28)} M${f(x - r)} ${f(y)} h${f(r * 0.28)} M${f(x + r)} ${f(y)} h${f(-r * 0.28)} M${f(x - r * 0.97)} ${f(y + r * 0.24)} h${f(r * 0.22)} M${f(x + r * 0.97)} ${f(y + r * 0.24)} h${f(-r * 0.22)}" stroke="#3a2a1e" stroke-width="${f(r * 0.1)}" stroke-linecap="round"/>` +
          `<ellipse cx="${x}" cy="${f(y + r * 0.4)}" rx="${f(r * 0.5)}" ry="${f(r * 0.32)}" fill="#fff8ef"/>` + face() + `<path d="M${f(x - r * 0.12)} ${f(y + r * 0.14)} h${f(r * 0.24)} l${f(-r * 0.12)} ${f(r * 0.12)} Z" fill="#ff8fa3"/>`;
      case 'pig':
        return `<path d="M${f(x - r * 0.85)} ${f(y - r * 0.4)} L${f(x - r * 0.75)} ${f(y - r * 1.15)} L${f(x - r * 0.25)} ${f(y - r * 0.85)} Z M${f(x + r * 0.85)} ${f(y - r * 0.4)} L${f(x + r * 0.75)} ${f(y - r * 1.15)} L${f(x + r * 0.25)} ${f(y - r * 0.85)} Z" fill="#f49cb0" stroke="rgba(0,0,0,.15)" stroke-width=".7"/>` + head('#f9bccb') + face(-r * 0.12) +
          `<ellipse cx="${x}" cy="${f(y + r * 0.32)}" rx="${f(r * 0.34)}" ry="${f(r * 0.24)}" fill="#f28ea6" stroke="#d96b86" stroke-width=".6"/><ellipse cx="${f(x - r * 0.12)}" cy="${f(y + r * 0.32)}" rx="${f(r * 0.06)}" ry="${f(r * 0.1)}" fill="#a8445f"/><ellipse cx="${f(x + r * 0.12)}" cy="${f(y + r * 0.32)}" rx="${f(r * 0.06)}" ry="${f(r * 0.1)}" fill="#a8445f"/>`;
      case 'koala':
        return [-1, 1].map(s => `<circle cx="${f(x + s * r * 0.88)}" cy="${f(y - r * 0.45)}" r="${f(r * 0.45)}" fill="#a3a9b4" stroke="rgba(0,0,0,.15)" stroke-width=".7"/><circle cx="${f(x + s * r * 0.88)}" cy="${f(y - r * 0.45)}" r="${f(r * 0.25)}" fill="#f1f1f4"/>`).join('') +
          head('#b4bac4') + face(-r * 0.05) + `<ellipse cx="${x}" cy="${f(y + r * 0.18)}" rx="${f(r * 0.2)}" ry="${f(r * 0.26)}" fill="#3a3640"/>`;
      case 'duck':
        return head('#fffaf0') + face(-r * 0.05) + `<ellipse cx="${x}" cy="${f(y + r * 0.32)}" rx="${f(r * 0.42)}" ry="${f(r * 0.17)}" fill="#ff9f1c" stroke="#e07f00" stroke-width=".6"/>`;
      case 'owl':
        return `<path d="M${f(x - r * 0.9)} ${f(y - r * 0.5)} L${f(x - r * 0.7)} ${f(y - r * 1.25)} L${f(x - r * 0.3)} ${f(y - r * 0.85)} Z M${f(x + r * 0.9)} ${f(y - r * 0.5)} L${f(x + r * 0.7)} ${f(y - r * 1.25)} L${f(x + r * 0.3)} ${f(y - r * 0.85)} Z" fill="#8a5d3b"/>` + head('#a8774f') +
          [-1, 1].map(s => `<circle cx="${f(x + s * r * 0.4)}" cy="${f(y - r * 0.02)}" r="${f(r * 0.34)}" fill="#fff8ec"/><circle cx="${f(x + s * r * 0.4)}" cy="${f(y)}" r="${f(r * 0.16)}" fill="#2b2633"/><circle cx="${f(x + s * r * 0.4 + r * 0.05)}" cy="${f(y - r * 0.06)}" r="${f(r * 0.06)}" fill="#fff"/>`).join('') +
          `<path d="M${f(x - r * 0.12)} ${f(y + r * 0.3)} L${f(x + r * 0.12)} ${f(y + r * 0.3)} L${x} ${f(y + r * 0.52)} Z" fill="#f2b13a"/>`;
      case 'sparrow':
        return head('#a0704a') + [-1, 1].map(s => `<ellipse cx="${f(x + s * r * 0.55)}" cy="${f(y + r * 0.25)}" rx="${f(r * 0.32)}" ry="${f(r * 0.26)}" fill="#fff6ea"/>`).join('') + face() +
          `<path d="M${f(x - r * 0.13)} ${f(y + r * 0.18)} L${f(x + r * 0.13)} ${f(y + r * 0.18)} L${x} ${f(y + r * 0.38)} Z" fill="#4a3a2a"/>`;
      case 'parrot':
        return `<path d="M${x} ${f(y - r * 0.95)} q${f(r * 0.1)} ${f(-r * 0.5)} ${f(r * 0.45)} ${f(-r * 0.55)} M${x} ${f(y - r * 0.95)} q${f(-r * 0.15)} ${f(-r * 0.45)} ${f(r * 0.1)} ${f(-r * 0.7)}" stroke="#e2412e" stroke-width="${f(r * 0.14)}" fill="none" stroke-linecap="round"/>` + head('#3cc46b') + face(-r * 0.08) +
          `<path d="M${f(x - r * 0.16)} ${f(y + r * 0.12)} q${f(r * 0.16)} ${f(-r * 0.1)} ${f(r * 0.32)} 0 q0 ${f(r * 0.28)} ${f(-r * 0.12)} ${f(r * 0.36)} q${f(-r * 0.2)} ${f(-r * 0.12)} ${f(-r * 0.2)} ${f(-r * 0.36)} Z" fill="#ffc93c" stroke="#d99a00" stroke-width=".6"/>`;
      case 'magpie':
        return head('#26262e', 'rgba(0,0,0,.3)') + [-1, 1].map(s => `<circle cx="${f(x + s * r * 0.38)}" cy="${f(y + r * 0.04)}" r="${f(r * 0.24)}" fill="#fff"/>`).join('') + face() +
          `<path d="M${f(x - r * 0.13)} ${f(y + r * 0.22)} L${f(x + r * 0.13)} ${f(y + r * 0.22)} L${x} ${f(y + r * 0.44)} Z" fill="#55565e"/>`;
      case 'eagle':
        return head('#7a5232') + `<ellipse cx="${x}" cy="${f(y + r * 0.2)}" rx="${f(r * 0.72)}" ry="${f(r * 0.6)}" fill="#f1dcc0"/>` + face(r * 0.02) +
          `<path d="M${f(x - r * 0.62)} ${f(y - r * 0.32)} l${f(r * 0.4)} ${f(r * 0.12)} M${f(x + r * 0.62)} ${f(y - r * 0.32)} l${f(-r * 0.4)} ${f(r * 0.12)}" stroke="#4a301c" stroke-width="${f(r * 0.1)}" stroke-linecap="round"/>` +
          `<path d="M${f(x - r * 0.18)} ${f(y + r * 0.16)} q${f(r * 0.18)} ${f(-r * 0.1)} ${f(r * 0.36)} 0 q0 ${f(r * 0.24)} ${f(-r * 0.18)} ${f(r * 0.34)} q${f(-r * 0.18)} ${f(-r * 0.1)} ${f(-r * 0.18)} ${f(-r * 0.34)} Z" fill="#ffc21a" stroke="#d99a00" stroke-width=".6"/>`;
      case 'flamingo':
        return head('#ff9cbc') + face(-r * 0.05) + `<path d="M${f(x - r * 0.1)} ${f(y + r * 0.2)} q${f(r * 0.45)} ${f(-r * 0.05)} ${f(r * 0.5)} ${f(r * 0.32)} l${f(-r * 0.2)} ${f(r * 0.12)} q${f(-r * 0.05)} ${f(-r * 0.2)} ${f(-r * 0.3)} ${f(-r * 0.2)} Z" fill="#fff0f4" stroke="#2b2633" stroke-width=".6"/>`;
      // 개: 시베리안 허스키, 진돗개(황구), 풍산개(흰 털), 삽살개(눈을 덮는 털)
      case 'husky':
      case 'jindo':
      case 'pungsan': {
        const C = { husky: ['#7f8a99', '#fdfdfd', '#6a7482'], jindo: ['#e2b675', '#fbf1de', '#c99a58'], pungsan: ['#fbfaf6', '#ffffff', '#e4e0d8'] }[kind];
        return [-1, 1].map(s => `<path d="M${f(x + s * r * 0.95)} ${f(y - r * 0.15)} L${f(x + s * r * 0.72)} ${f(y - r * 1.3)} L${f(x + s * r * 0.15)} ${f(y - r * 0.85)} Z" fill="${C[0]}" stroke="${C[2]}" stroke-width=".8"/><path d="M${f(x + s * r * 0.72)} ${f(y - r * 0.6)} L${f(x + s * r * 0.68)} ${f(y - r * 1.05)} L${f(x + s * r * 0.38)} ${f(y - r * 0.8)} Z" fill="#f7d6d6"/>`).join('') +
          head(C[0], C[2]) + `<ellipse cx="${x}" cy="${f(y + r * 0.35)}" rx="${f(r * 0.8)}" ry="${f(r * 0.56)}" fill="${C[1]}"/>` +
          (kind === 'husky' ? `<path d="M${x} ${f(y - r * 0.95)} L${f(x + r * 0.16)} ${f(y - r * 0.2)} L${x} ${f(y)} L${f(x - r * 0.16)} ${f(y - r * 0.2)} Z" fill="#fff"/>` : '') +
          face() + `<ellipse cx="${x}" cy="${f(y + r * 0.18)}" rx="${f(r * 0.14)}" ry="${f(r * 0.1)}" fill="#2b2633"/>`;
      }
      case 'sapsal':
        return [-1, 1].map(s => `<ellipse cx="${f(x + s * r * 0.95)}" cy="${f(y + r * 0.2)}" rx="${f(r * 0.32)}" ry="${f(r * 0.72)}" fill="#7d7268"/>`).join('') + head('#a3988c') + face(r * 0.12) +
          `<path d="M${f(x - r * 0.98)} ${f(y - r * 0.05)} q${f(r * 0.2)} ${f(-r * 0.1)} ${f(r * 0.3)} ${f(r * 0.12)} q${f(r * 0.15)} ${f(-r * 0.22)} ${f(r * 0.34)} 0 q${f(r * 0.18)} ${f(-r * 0.22)} ${f(r * 0.34)} 0 q${f(r * 0.18)} ${f(-r * 0.22)} ${f(r * 0.34)} 0 q${f(r * 0.15)} ${f(-r * 0.2)} ${f(r * 0.34)} ${f(-r * 0.12)} q${f(r * 0.1)} ${f(-r * 0.5)} ${f(-r * 0.3)} ${f(-r * 0.85)} q${f(-r * 0.7)} ${f(-r * 0.2)} ${f(-r * 1.36)} 0 q${f(-r * 0.4)} ${f(r * 0.35)} ${f(-r * 0.4)} ${f(r * 0.85)} Z" fill="#8e8378"/>` +
          `<ellipse cx="${x}" cy="${f(y + r * 0.32)}" rx="${f(r * 0.13)}" ry="${f(r * 0.09)}" fill="#2b2633"/>`;
      case 'lion':
        return `<circle cx="${x}" cy="${y}" r="${f(r * 1.32)}" fill="#c9752a"/>` + Array.from({ length: 12 }, (_, i) => { const t = i * Math.PI / 6; return `<circle cx="${f(x + Math.cos(t) * r * 1.22)}" cy="${f(y + Math.sin(t) * r * 1.22)}" r="${f(r * 0.32)}" fill="#c9752a"/>`; }).join('') +
          [-1, 1].map(s => `<circle cx="${f(x + s * r * 0.72)}" cy="${f(y - r * 0.72)}" r="${f(r * 0.26)}" fill="#f2b552"/>`).join('') + head('#f2b552') +
          `<ellipse cx="${x}" cy="${f(y + r * 0.38)}" rx="${f(r * 0.5)}" ry="${f(r * 0.32)}" fill="#fff3dc"/>` + face() + `<path d="M${f(x - r * 0.12)} ${f(y + r * 0.14)} h${f(r * 0.24)} l${f(-r * 0.12)} ${f(r * 0.12)} Z" fill="#7a4a22"/>`;
      case 'meerkat':
        return [-1, 1].map(s => `<circle cx="${f(x + s * r * 0.82)}" cy="${f(y - r * 0.2)}" r="${f(r * 0.2)}" fill="#6b4a2b"/>`).join('') + head('#dcb57e') +
          [-1, 1].map(s => `<ellipse cx="${f(x + s * r * 0.38)}" cy="${f(y + r * 0.04)}" rx="${f(r * 0.24)}" ry="${f(r * 0.3)}" fill="#6b4a2b" transform="rotate(${s * -20} ${f(x + s * r * 0.38)} ${f(y)})"/>`).join('') +
          `<ellipse cx="${x}" cy="${f(y + r * 0.42)}" rx="${f(r * 0.42)}" ry="${f(r * 0.3)}" fill="#f1dcbc"/>` + face() + `<ellipse cx="${x}" cy="${f(y + r * 0.28)}" rx="${f(r * 0.12)}" ry="${f(r * 0.08)}" fill="#2b2633"/>`;
      case 'rooster':
        return `<path d="M${f(x - r * 0.4)} ${f(y - r * 0.85)} q${f(r * 0.05)} ${f(-r * 0.55)} ${f(r * 0.3)} ${f(-r * 0.3)} q${f(r * 0.15)} ${f(-r * 0.55)} ${f(r * 0.32)} ${f(-r * 0.12)} q${f(r * 0.25)} ${f(-r * 0.45)} ${f(r * 0.32)} ${f(r * 0.08)} Z" fill="#e2412e"/>` + head('#fffaf0') + face(-r * 0.08) +
          `<path d="M${f(x - r * 0.14)} ${f(y + r * 0.14)} L${f(x + r * 0.14)} ${f(y + r * 0.14)} L${x} ${f(y + r * 0.36)} Z" fill="#f5b21b"/><ellipse cx="${x}" cy="${f(y + r * 0.52)}" rx="${f(r * 0.1)}" ry="${f(r * 0.18)}" fill="#e2412e"/>`;
      // 바다 동물: 바다표범, 바다사자, 독도 강치, 해달
      case 'seal':
      case 'sealion':
      case 'kangchi':
      case 'otter': {
        const C = { seal: ['#aab5c3', '#e9edf2'], sealion: ['#9a7350', '#d9bf9f'], kangchi: ['#66615d', '#a8a29c'], otter: ['#8b6545', '#ead8c0'] }[kind];
        const ears = kind === 'sealion' || kind === 'kangchi' ? [-1, 1].map(s => `<ellipse cx="${f(x + s * r * 0.82)}" cy="${f(y - r * 0.45)}" rx="${f(r * 0.12)}" ry="${f(r * 0.2)}" fill="${C[0]}"/>`).join('')
          : kind === 'otter' ? [-1, 1].map(s => `<circle cx="${f(x + s * r * 0.78)}" cy="${f(y - r * 0.62)}" r="${f(r * 0.2)}" fill="${C[0]}"/>`).join('') : '';
        const spots = kind === 'seal' ? `<circle cx="${f(x - r * 0.55)}" cy="${f(y - r * 0.5)}" r="${f(r * 0.08)}" fill="#7d8796"/><circle cx="${f(x + r * 0.5)}" cy="${f(y - r * 0.6)}" r="${f(r * 0.07)}" fill="#7d8796"/><circle cx="${f(x + r * 0.15)}" cy="${f(y - r * 0.78)}" r="${f(r * 0.06)}" fill="#7d8796"/>` : '';
        return ears + head(C[0]) + spots + `<ellipse cx="${x}" cy="${f(y + r * 0.38)}" rx="${f(r * 0.52)}" ry="${f(r * 0.34)}" fill="${C[1]}"/>` + face() +
          `<ellipse cx="${x}" cy="${f(y + r * 0.22)}" rx="${f(r * 0.14)}" ry="${f(r * 0.1)}" fill="#2b2633"/>` +
          [-1, 1].map(s => `<path d="M${f(x + s * r * 0.3)} ${f(y + r * 0.32)} l${f(s * r * 0.45)} ${f(-r * 0.06)} M${f(x + s * r * 0.3)} ${f(y + r * 0.42)} l${f(s * r * 0.45)} ${f(r * 0.04)}" stroke="#2b2633" stroke-width="${f(r * 0.04)}" stroke-linecap="round" opacity=".55"/>`).join('');
      }
      case 'swan':
        return head('#ffffff') + face(-r * 0.05) + `<path d="M${f(x - r * 0.15)} ${f(y + r * 0.18)} L${f(x + r * 0.15)} ${f(y + r * 0.18)} L${x} ${f(y + r * 0.46)} Z" fill="#ff8c1a"/><circle cx="${x}" cy="${f(y + r * 0.16)}" r="${f(r * 0.1)}" fill="#2b2633"/>`;
    }
    return head('#fff') + face();
  }

  // 색을 밝게(amt > 0) 또는 어둡게(amt < 0)
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    const ch = v => Math.round((t - v) * p + v);
    const r = ch(n >> 16), g = ch((n >> 8) & 255), b = ch(n & 255);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function wheel(cx, id, arch) {
    let g = `<path d="M${cx - 13} 56 A13 13 0 0 1 ${cx + 13} 56 Z" fill="${arch}"/>`;
    g += `<circle cx="${cx}" cy="56" r="10.5" fill="url(#${id}t)"/>`;
    g += `<circle cx="${cx}" cy="56" r="6" fill="url(#${id}r)" stroke="#9aa0ae" stroke-width=".8"/>`;
    for (let a = 0; a < 5; a++) {
      const rad = (a * 72 - 90) * Math.PI / 180;
      g += `<path d="M${cx} 56 L${(cx + Math.cos(rad) * 5.2).toFixed(2)} ${(56 + Math.sin(rad) * 5.2).toFixed(2)}" stroke="#b9bdc9" stroke-width="1.3" stroke-linecap="round"/>`;
    }
    g += `<circle cx="${cx}" cy="56" r="1.8" fill="#7c8291"/>`;
    return g;
  }

  // ---------- 따로 그리는 탈것 (전통 교통수단, 전차·자주포) ----------
  const f1 = n => (+n).toFixed(1);
  // 나무 바퀴(바큇살)
  function spokeWheel(cx, cy, r, rim, n) {
    let g = `<circle cx="${cx}" cy="${cy}" r="${f1(r * 0.9)}" fill="none" stroke="${rim}" stroke-width="${f1(r * 0.2)}"/>`;
    for (let a = 0; a < (n || 8); a++) {
      const t = a * Math.PI * 2 / (n || 8);
      g += `<path d="M${cx} ${cy} L${f1(cx + Math.cos(t) * r * 0.85)} ${f1(cy + Math.sin(t) * r * 0.85)}" stroke="${rim}" stroke-width="${f1(r * 0.1)}"/>`;
    }
    return g + `<circle cx="${cx}" cy="${cy}" r="${f1(r * 0.24)}" fill="${rim}"/><circle cx="${cx}" cy="${cy}" r="${f1(r * 0.1)}" fill="#d9c09a"/>`;
  }
  // 돌바퀴
  function stoneWheel(cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#8f8b84" stroke="#5c5852" stroke-width="1.6"/>
      <path d="M${f1(cx - r * 0.65)} ${f1(cy - r * 0.2)} q${f1(r * 0.25)} ${f1(-r * 0.45)} ${f1(r * 0.7)} ${f1(-r * 0.45)}" stroke="#bdb8ae" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <circle cx="${f1(cx + r * 0.45)}" cy="${f1(cy + r * 0.4)}" r="1.2" fill="#6e6a63"/><circle cx="${f1(cx - r * 0.35)}" cy="${f1(cy + r * 0.5)}" r="1" fill="#6e6a63"/>
      <circle cx="${cx}" cy="${cy}" r="${f1(r * 0.28)}" fill="#4a463f"/>`;
  }
  // 무한궤도(전차·자주포)
  function treads(x0, x1) {
    let g = `<rect x="${x0}" y="46" width="${x1 - x0}" height="20" rx="10" fill="#2f3229" stroke="#1b1d17" stroke-width="1.2"/>`;
    g += `<path d="M${x0 + 8} 46.8 H${x1 - 8} M${x0 + 8} 65.2 H${x1 - 8}" stroke="#5b5f52" stroke-width="1.6" stroke-dasharray="3 3"/>`;
    const n = Math.round((x1 - x0 - 12) / 16);
    for (let i = 0; i <= n; i++) {
      const cx = f1(x0 + 10 + i * (x1 - x0 - 20) / n);
      g += `<circle cx="${cx}" cy="56" r="6.5" fill="#4b4f43" stroke="#1b1d17" stroke-width="1"/><circle cx="${cx}" cy="56" r="2" fill="#8a8f80"/>`;
    }
    return g;
  }
  // 앉아 있는 운전자(몸통 + 얼굴)
  function seated(c, x, y, r, shirt) {
    return `<rect x="${f1(x - r * 0.85)}" y="${f1(y + r * 0.6)}" width="${f1(r * 1.7)}" height="${f1(r * 1.5)}" rx="${f1(r * 0.5)}" fill="${shirt}" stroke="rgba(0,0,0,.2)" stroke-width=".7"/>` + driver(c.driver, x, y, r);
  }
  // 창문 안에만 운전자가 보이게
  function inWindow(P, key, rects, inner) {
    return `<defs><clipPath id="${P.id}${key}">${rects.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`).join('')}</clipPath></defs>` +
      rects.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#${P.id}w)"/>`).join('') +
      `<g clip-path="url(#${P.id}${key})">${inner}</g>` +
      rects.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#${P.id}g)"/>`).join('');
  }
  const BODY = P => `fill="url(#${P.id}b)" stroke="${P.dark}" stroke-width="1.1" stroke-linejoin="round"`;
  const WOOD = '#5a3a1e';

  const SPECIAL = {
    // 선사 시대: 통나무 판자에 돌바퀴
    stonecart: P => `
      <path d="M92 46 L119 54" stroke="#6b4423" stroke-width="3" stroke-linecap="round"/>
      ${seated(P.c, 54, 17, 9, P.c.stripe)}
      <rect x="12" y="28" width="82" height="12" rx="2" ${BODY(P)}/>
      <path d="M30 28 V40 M50 28 V40 M70 28 V40" stroke="${P.dark}" stroke-width="1" opacity=".6"/>
      <rect x="8" y="40" width="90" height="7" rx="2" fill="${P.deep}"/>
      ${stoneWheel(32, 54, 12)}${stoneWheel(78, 54, 12)}`,
    // 조선: 가마꾼 두 사람이 메는 가마
    gama: P => `
      <path d="M2 45 H118" stroke="#6b4423" stroke-width="3" stroke-linecap="round"/>
      ${person(12, 66, { s: 0.72, body: '#f4efe2' })}${person(108, 66, { s: 0.72, body: '#f4efe2' })}
      <path d="M30 46 L30 18 L90 18 L90 46 Z" ${BODY(P)}/>
      ${inWindow(P, 'k', [[42, 22, 36, 18]], driver(P.c.driver, 60, 33, 9))}
      <rect x="42" y="22" width="36" height="18" rx="2" fill="none" stroke="${P.c.stripe}" stroke-width="2"/>
      <path d="M30 44 H90 M30 21 H90" stroke="${P.c.stripe}" stroke-width="1.6"/>
      <path d="M18 20 Q28 18 32 12 L88 12 Q92 18 102 20 L102 21.5 Q60 18 18 21.5 Z" fill="#2f2c3a"/>
      <path d="M40 12 Q60 3 80 12 Z" fill="#2f2c3a"/><circle cx="60" cy="5" r="2.2" fill="${P.c.stripe}"/>`,
    // 말이 끄는 마차
    carriage: P => `
      <path d="M8 46 L8 20 C8 14 12 12 18 12 L62 12 C68 12 70 16 70 20 L70 46 Z" ${BODY(P)}/>
      ${inWindow(P, 'k', [[16, 18, 42, 16]], driver(P.c.driver, 37, 29, 8.5))}
      <path d="M6 12 H72" stroke="${P.deep}" stroke-width="3" stroke-linecap="round"/>
      <path d="M8 38 H70" stroke="${P.c.stripe}" stroke-width="1.8"/>
      ${spokeWheel(22, 54, 12, WOOD)}${spokeWheel(58, 56, 10, WOOD)}
      <path d="M68 42 L94 39" stroke="#6b4423" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M81 34 q-9 2 -10 14" stroke="#3b2414" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M87 44 L85 64 M93 45 L93 64 M102 45 L104 64 M108 43 L110 64" stroke="#7a4a22" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M83.5 65 h3.5 M91.5 65 h3.5 M102.5 65 h3.5 M108.5 65 h3.5" stroke="#2b2633" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="96" cy="38" rx="16" ry="9" fill="#9a6331" stroke="#6b4423" stroke-width="1"/>
      <path d="M104 34 L109 19 L117 21 L114 30 L109 38 Z" fill="#9a6331" stroke="#6b4423" stroke-width="1" stroke-linejoin="round"/>
      <ellipse cx="115" cy="23" rx="5.5" ry="3.8" fill="#9a6331" stroke="#6b4423" stroke-width="1" transform="rotate(30 115 23)"/>
      <path d="M109 18 l1.5 -5 l2.5 5" fill="#9a6331" stroke="#6b4423" stroke-width=".8"/>
      <path d="M107 18 Q102 25 104 34" stroke="#3b2414" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <circle cx="113.5" cy="21" r="1.1" fill="#2b2633"/>
      <path d="M94 33.5 L104 33" stroke="${P.c.stripe}" stroke-width="1.6"/>`,
    // 조선 신기전 화차: 바퀴 수레에 로켓 화살 발사틀
    hwacha: P => {
      let rockets = '';
      [23, 30, 37].forEach(y => { rockets += `<path d="M93 ${y} H110" stroke="#e8d9b5" stroke-width="1.6"/><path d="M110 ${y - 2.2} L115.5 ${y} L110 ${y + 2.2} Z" fill="${P.c.stripe}"/>`; });
      let holes = '';
      for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) holes += `<circle cx="${43 + k * 7.5}" cy="${23 + r * 7}" r="2" fill="#3b2414"/>`;
      return `
      <path d="M2 37 L18 42" stroke="#6b4423" stroke-width="3" stroke-linecap="round"/>
      ${seated(P.c, 22, 21, 8.5, '#f4efe2')}
      <g transform="rotate(-16 66 34)"><rect x="38" y="17" width="56" height="25" rx="2" ${BODY(P)}/>${holes}${rockets}</g>
      <rect x="12" y="40" width="86" height="7" rx="2" fill="${P.deep}"/>
      ${spokeWheel(36, 54, 12, WOOD)}${spokeWheel(82, 54, 12, WOOD)}`;
    },
    // 개항기 인력거: 사람이 끄는 바퀴 두 개 수레
    rickshaw: P => `
      <path d="M58 46 L100 53" stroke="#3b2414" stroke-width="2.4" stroke-linecap="round"/>
      ${person(109, 66, { s: 0.6, body: '#f4efe2', arms: 'reach-l', hat: 'gat' })}
      <path d="M14 40 C12 22 22 8 40 8 L46 8 L44 14 C30 14 24 24 26 40 Z" ${BODY(P)}/>
      ${seated(P.c, 44, 23, 9, P.c.stripe)}
      <path d="M20 48 L22 34 L62 34 C66 34 66 38 64 42 L58 48 Z" ${BODY(P)}/>
      <path d="M22 37 H62" stroke="${P.c.stripe}" stroke-width="1.4"/>
      ${spokeWheel(38, 50, 16, '#2b2633', 12)}`,
    // 1899년 한성 전차: 지붕 위 전깃줄 막대
    tram: P => `
      <path d="M62 7 L92 -10" stroke="#55565e" stroke-width="1.6" stroke-linecap="round"/><circle cx="92" cy="-10" r="2" fill="#55565e"/>
      <rect x="4" y="5" width="112" height="7" rx="3" fill="${P.deep}"/>
      <rect x="8" y="12" width="104" height="42" rx="5" ${BODY(P)}/>
      ${inWindow(P, 'k', [[14, 17, 18, 16], [36, 17, 18, 16], [58, 17, 18, 16], [80, 17, 18, 16]],
        driver('bear', 23, 29, 6.5) + driver('cat', 45, 29, 6.5) + driver('rabbit', 67, 30, 6.5) + driver(P.c.driver, 89, 28, 7.5))}
      <rect x="8" y="38" width="104" height="16" rx="3" fill="${P.c.stripe}"/>
      <text x="60" y="49.5" font-size="7" font-weight="800" fill="#f5e7c6" text-anchor="middle" font-family="Pretendard Variable, sans-serif">1899</text>
      <circle cx="112" cy="44" r="2.6" fill="#fffbe6" stroke="${P.dark}" stroke-width=".6"/>
      <rect x="16" y="54" width="88" height="4" fill="#3a3a40"/>
      <circle cx="30" cy="58" r="8" fill="#2b2633"/><circle cx="30" cy="58" r="3" fill="#9aa0ae"/>
      <circle cx="90" cy="58" r="8" fill="#2b2633"/><circle cx="90" cy="58" r="3" fill="#9aa0ae"/>`,
    // 1899년 경인선 증기 기관차
    steam: P => {
      let wheels = '';
      [24, 54, 84].forEach(cx => { wheels += `<circle cx="${cx}" cy="56" r="10" fill="${P.c.stripe}" stroke="#1d1d22" stroke-width="2"/><circle cx="${cx}" cy="56" r="3" fill="#1d1d22"/>`; });
      return `
      <circle cx="99" cy="1" r="5" fill="#fff" opacity=".9"/><circle cx="107" cy="-6" r="6" fill="#fff" opacity=".8"/><circle cx="116" cy="-11" r="4" fill="#fff" opacity=".7"/>
      <path d="M93 26 L95 10 L91 6 L105 6 L101 10 L103 26 Z" fill="#2b2b33"/>
      <rect x="40" y="24" width="72" height="24" rx="11" ${BODY(P)}/>
      <path d="M62 24 V48 M84 24 V48" stroke="${P.c.stripe}" stroke-width="2"/>
      <path d="M68 24 Q75 13 82 24 Z" fill="#d4a72c" stroke="#9c7a1c" stroke-width=".8"/>
      <path d="M6 52 L6 12 L3 12 L3 7 L45 7 L45 12 L42 12 L42 52 Z" ${BODY(P)}/>
      ${inWindow(P, 'k', [[12, 16, 22, 16]], driver(P.c.driver, 23, 28, 8))}
      <circle cx="112" cy="32" r="3.6" fill="#fffbe6" stroke="#a9adba" stroke-width="1"/>
      <path d="M104 49 L119 61 L104 61 Z" fill="${P.c.stripe}" stroke="#1d1d22" stroke-width="1"/>
      <rect x="4" y="47" width="104" height="5" fill="#1d1d22"/>
      ${wheels}<path d="M24 53 L84 53" stroke="#c9ccd6" stroke-width="2.4" stroke-linecap="round"/>`;
    },
    // 새마을 시대의 경운기
    tiller: P => `
      <rect x="6" y="30" width="56" height="18" rx="2" fill="#b88a55" stroke="#7a5530" stroke-width="1.1"/>
      <path d="M6 36 H62 M6 42 H62" stroke="#7a5530" stroke-width=".8" opacity=".6"/>
      ${seated(P.c, 56, 19, 8.5, P.c.stripe)}
      <path d="M90 38 L63 26" stroke="#3a3a40" stroke-width="2.6" stroke-linecap="round"/><circle cx="63" cy="26" r="2" fill="#2b2633"/>
      <path d="M84 26 V10" stroke="#3a3a40" stroke-width="2.6" stroke-linecap="round"/><circle cx="83" cy="5" r="3.5" fill="#cfd2da" opacity=".85"/><circle cx="78" cy="0" r="2.6" fill="#cfd2da" opacity=".7"/>
      <path d="M62 46 L80 46" stroke="${P.dark}" stroke-width="2.2"/>
      <rect x="76" y="24" width="32" height="20" rx="4" ${BODY(P)}/>
      <path d="M102 28 V40 M105 28 V40" stroke="${P.deep}" stroke-width="1.2"/>
      ${wheel(30, P.id, '#7a5530')}
      <circle cx="96" cy="52" r="14" fill="#2a2a30"/><circle cx="96" cy="52" r="7.5" fill="${P.c.body}" stroke="#1d1d22" stroke-width="1"/><circle cx="96" cy="52" r="2.4" fill="#1d1d22"/>
      ${Array.from({ length: 10 }, (_, k) => { const t = k * Math.PI / 5; return `<path d="M${f1(96 + Math.cos(t) * 11)} ${f1(52 + Math.sin(t) * 11)} L${f1(96 + Math.cos(t) * 14.5)} ${f1(52 + Math.sin(t) * 14.5)}" stroke="#55565e" stroke-width="2.4"/>`; }).join('')}`,
    // 전차(탱크)
    tank: P => `
      ${driver(P.c.driver, 56, 10, 8)}
      ${treads(6, 114)}
      <path d="M8 46 L14 34 L104 34 L116 44 L116 46 Z" ${BODY(P)}/>
      <rect x="84" y="23" width="30" height="4.5" rx="1.5" fill="${P.deep}"/><rect x="112" y="21.8" width="6" height="7" rx="1" fill="${P.deep}"/>
      <path d="M34 34 L38 22 C39 19 42 18 46 18 L76 18 C80 18 83 20 85 24 L88 34 Z" ${BODY(P)}/>
      <ellipse cx="56" cy="18.5" rx="10" ry="2.4" fill="${P.deep}"/>
      ${camo(P, [[50, 26, 8, 3.5], [72, 28, 6, 3], [24, 40, 9, 3], [92, 40, 8, 3]])}`,
    // 자주포: 큰 포탑과 긴 포신
    spg: P => `
      ${driver(P.c.driver, 40, 3, 7.5)}
      ${treads(4, 116)}
      <path d="M6 46 L10 36 L108 36 L116 44 L116 46 Z" ${BODY(P)}/>
      <g transform="rotate(-10 90 20)"><rect x="88" y="17.5" width="29" height="5" rx="1.5" fill="${P.deep}"/><rect x="113" y="16" width="6" height="8" rx="1" fill="${P.deep}"/></g>
      <path d="M22 36 L24 14 C24 11 26 10 29 10 L84 10 C88 10 90 12 91 15 L94 36 Z" ${BODY(P)}/>
      <ellipse cx="40" cy="10.5" rx="9" ry="2.2" fill="${P.deep}"/>
      <path d="M28 22 H88" stroke="${P.deep}" stroke-width="1" opacity=".4"/>
      ${camo(P, [[46, 18, 9, 3.5], [74, 28, 8, 3], [20, 41, 8, 2.6], [100, 41, 7, 2.6]])}`
  };

  // ---------- 상상·항공·해상 교통수단, 조류·포유류 캐릭터 (각 10종) ----------
  const dk = (c, a) => shade(c, -(a || 0.3));
  const lt = (c, a) => shade(c, a || 0.4);
  // 바다 탈것 아래 물결
  function water(y) {
    let d = `M0 ${y}`;
    for (let x = 0; x < 120; x += 15) d += ` q7.5 -4 15 0`;
    return `<path d="${d} V72 H0 Z" fill="#5ab8e8" opacity=".9"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".85"/>`;
  }
  // 둥근 창(유리) 안에 운전자: d는 창 모양 path
  function bubble(P, d, inner) {
    return `<defs><clipPath id="${P.id}q"><path d="${d}"/></clipPath></defs><path d="${d}" fill="url(#${P.id}w)"/><g clip-path="url(#${P.id}q)">${inner}</g><path d="${d}" fill="url(#${P.id}g)"/>`;
  }
  // 프로펠러(빠르게 도는 모습)
  const prop = x => `<ellipse cx="${x}" cy="37" rx="2" ry="13" fill="#55565e" opacity=".45"/><circle cx="${x - 1}" cy="37" r="3" fill="#2b2b33"/>`;
  const sparkle = (x, y, s, c) => `<path d="M${x} ${y - s} L${x + s * 0.3} ${y - s * 0.3} L${x + s} ${y} L${x + s * 0.3} ${y + s * 0.3} L${x} ${y + s} L${x - s * 0.3} ${y + s * 0.3} L${x - s} ${y} L${x - s * 0.3} ${y - s * 0.3} Z" fill="${c || '#ffd60a'}"/>`;

  // 귀여운 네발 동물: 몸통, 달리는 다리, 꼬리 + 큰 얼굴
  function beast(P, kind, o) {
    const B = o.body, D = o.dark || dk(B, 0.25), L = o.legs || D;
    let tail;
    if (o.tail === 'bushy') tail = `<ellipse cx="18" cy="38" rx="13" ry="7" fill="${B}" stroke="${D}" stroke-width="1" transform="rotate(-25 18 38)"/><ellipse cx="8" cy="33" rx="5" ry="4" fill="${o.tip || '#fff8ef'}" transform="rotate(-25 8 33)"/>`;
    else if (o.tail === 'curl') tail = `<path d="M24 42 q-8 -2 -7 -8 q1 -5 5 -3 q3 2 -1 4" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`;
    else if (o.tail === 'long') tail = `<path d="M24 42 q-12 -2 -14 -14" fill="none" stroke="${B}" stroke-width="5" stroke-linecap="round"/>` + (o.stripes ? `<path d="M24 42 q-12 -2 -14 -14" fill="none" stroke="#3a2a1e" stroke-width="5" stroke-dasharray="2.5 4"/>` : '');
    else tail = `<circle cx="22" cy="40" r="6" fill="${o.tip || B}" stroke="${D}" stroke-width="1"/>`;
    const leg = (x, dy) => `<rect x="${x}" y="${50 + dy}" width="9" height="${14 - dy}" rx="4.5" fill="${L}"/><ellipse cx="${x + 5}" cy="64" rx="6" ry="2.6" fill="${L}"/>`;
    const stripes = o.stripes ? [38, 50, 62].map(x => `<path d="M${x} 30 q3 6 0 12" stroke="#3a2a1e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('') : '';
    return tail + leg(30, 2) + leg(64, 2) +
      `<ellipse cx="52" cy="44" rx="31" ry="15" fill="${B}" stroke="${D}" stroke-width="1.1"/><ellipse cx="55" cy="50" rx="20" ry="6.5" fill="${o.belly || lt(B, 0.5)}"/>` + stripes +
      leg(39, 0) + leg(73, 0) + driver(kind, 88, 27, 17);
  }
  // 귀여운 새: 둥근 몸, 날개, 꼬리깃, 가는 다리 + 큰 얼굴
  function bird(P, kind, o) {
    const B = o.body, D = dk(B, 0.25), lg = o.legs || '#f2a33a';
    return `<path d="M50 54 L48 64 M62 54 L64 64" stroke="${lg}" stroke-width="2.6" stroke-linecap="round"/><path d="M44 65 h8 M60 65 h8" stroke="${lg}" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="M32 40 L13 31 L18 42 L11 49 Z" fill="${o.tail || D}" stroke="${D}" stroke-width="1" stroke-linejoin="round"/>` +
      `<ellipse cx="54" cy="42" rx="26" ry="17" fill="${B}" stroke="${D}" stroke-width="1.1"/><ellipse cx="60" cy="48" rx="15" ry="8" fill="${o.belly || lt(B, 0.5)}"/>` +
      `<ellipse cx="47" cy="40" rx="15" ry="8.5" fill="${o.wing || D}" transform="rotate(-18 47 40)"/>` + driver(kind, 80, 24, 15);
  }

  Object.assign(SPECIAL, {
    // ===== 상상 교통수단 =====
    // 크리스마스: 빨간 썰매를 끄는 루돌프
    x_rudolph: P => `
      <path d="M66 40 L84 38" stroke="#7a4a22" stroke-width="1.6"/>
      <path d="M88 46 L86 63 M93 47 L93 63 M102 47 L104 63 M107 45 L109 63" stroke="#8a5a32" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="96" cy="40" rx="14" ry="8" fill="#a7743f" stroke="#7a4a22" stroke-width="1"/>
      <path d="M104 37 L108 26 L114 27 L111 38 Z" fill="#a7743f" stroke="#7a4a22" stroke-width="1" stroke-linejoin="round"/>
      <path d="M108 20 l-4 -8 M108 20 l-1 -9 M106 15 l-4 -2 M112 20 l3 -8 M113 16 l4 -2" stroke="#6b4423" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="111" cy="24" r="6.5" fill="#b9854f" stroke="#7a4a22" stroke-width="1"/><circle cx="113" cy="22.5" r="1.1" fill="#2b2633"/>
      <circle cx="118" cy="25" r="2.8" fill="#ff3b30"/><circle cx="118" cy="25" r="5" fill="#ff3b30" opacity=".25"/>
      <path d="M93 34.5 L104 33" stroke="${P.c.stripe}" stroke-width="2"/>
      <ellipse cx="18" cy="26" rx="9" ry="8" fill="#8b5a2b"/><path d="M14 19 q4 -4 8 0" stroke="#5a3a1e" stroke-width="1.6" fill="none"/>
      ${seated(P.c, 38, 22, 8.5, '#d7261e')}
      <path d="M30 18 Q38 2 48 16 Z" fill="#d7261e"/><path d="M29 18 H47" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="5" r="2.4" fill="#fff"/>
      <path d="M10 46 Q8 30 22 28 H60 Q66 28 66 36 V46 Z" ${BODY(P)}/>
      <path d="M12 34 H64" stroke="${P.c.stripe}" stroke-width="2"/>
      <path d="M18 46 V58 M56 46 V58" stroke="${P.c.stripe}" stroke-width="2"/>
      <path d="M4 58 H66 Q74 58 72 51" stroke="${P.c.stripe}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // 할로윈: 호박 마차
    x_pumpkin: P => `
      <path d="M24 52 H90" stroke="#9c7a1c" stroke-width="3"/>
      <ellipse cx="38" cy="32" rx="16" ry="21" fill="#e9781c"/><ellipse cx="76" cy="32" rx="16" ry="21" fill="#e9781c"/>
      <ellipse cx="57" cy="32" rx="26" ry="24" ${BODY(P)}/>
      <path d="M57 9 Q48 32 57 56 M57 9 Q66 32 57 56" stroke="${P.dark}" stroke-width="1" fill="none" opacity=".6"/>
      ${inWindow(P, 'k', [[46, 21, 22, 17]], driver(P.c.driver, 57, 32, 8.5))}
      <rect x="46" y="21" width="22" height="17" rx="2" fill="none" stroke="${P.c.stripe}" stroke-width="2"/>
      <path d="M57 9 q-1 -7 4 -10" stroke="#3e7a3a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M61 0 q8 -4 10 2 q-2 4 -6 2" stroke="#4f9a4a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      ${spokeWheel(28, 54, 11, P.c.stripe)}${spokeWheel(88, 54, 11, P.c.stripe)}`,
    // 알라딘처럼 하늘을 나는 마법 양탄자(창작)
    x_carpet: P => `
      ${sparkle(14, 20, 4)}${sparkle(104, 14, 3.5, '#fff')}${sparkle(96, 58, 3)}
      ${seated(P.c, 60, 26, 9, '#3a7bd5')}
      <path d="M8 46 Q24 40 40 46 T72 46 T104 46 L112 52 Q96 58 80 52 T48 52 T16 52 Z" ${BODY(P)}/>
      <path d="M14 49 Q26 45 40 49 T72 49 T104 49" stroke="${P.c.stripe}" stroke-width="1.6" fill="none" stroke-dasharray="4 3"/>
      <path d="M8 46 l-4 2 M9 49 l-4 3 M10 52 l-4 3 M112 52 l4 2 M110 55 l4 3" stroke="${P.c.stripe}" stroke-width="1.4" stroke-linecap="round"/>`,
    // 마법 빗자루
    x_broom: P => `
      ${sparkle(8, 24, 3)}${sparkle(16, 60, 2.5, '#fff')}${sparkle(30, 14, 2)}
      <path d="M20 44 L114 36" stroke="#8a5a2b" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M26 41 L2 30 L4 56 L26 47 Z" fill="#e8c26a" stroke="#b8902e" stroke-width="1"/><path d="M24 43 L6 36 M24 44 L5 44 M24 45 L6 52" stroke="#b8902e" stroke-width=".9"/>
      ${seated(P.c, 66, 22, 9, P.c.stripe)}
      <path d="M54 15 H78" stroke="#4a2a6b" stroke-width="3" stroke-linecap="round"/><path d="M58 15 L67 -5 L75 15 Z" fill="${P.c.stripe}"/>`,
    // 둥실 구름
    x_cloud: P => `
      <circle cx="44" cy="34" r="15" fill="#e2f0fc" stroke="#bcd7ef" stroke-width="1.2"/><circle cx="74" cy="32" r="16" fill="#e2f0fc" stroke="#bcd7ef" stroke-width="1.2"/>
      ${seated(P.c, 60, 14, 9, P.c.stripe)}
      ${[[26, 46, 12], [46, 42, 15], [70, 42, 16], [92, 46, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#bcd7ef" stroke-width="1.2"/>`).join("")}
      <rect x="22" y="44" width="76" height="14" rx="7" fill="#fff"/><path d="M26 56 H94" stroke="${P.c.stripe}" stroke-width="2" opacity=".6" stroke-linecap="round"/>`,
    // 우주 로켓
    x_rocket: P => `
      ${sparkle(30, 6, 2.5, '#fff')}${sparkle(100, 60, 2, '#fff')}
      <path d="M16 32 L-2 38 L16 44 Z" fill="#ff9f0a"/><path d="M16 35 L6 38 L16 41 Z" fill="#ffe066"/>
      <path d="M22 30 L8 16 L36 30 Z" fill="${P.c.stripe}"/><path d="M22 46 L8 60 L36 46 Z" fill="${P.c.stripe}"/>
      <path d="M14 30 H86 Q112 30 118 38 Q112 46 86 46 H14 Z" ${BODY(P)}/>
      <path d="M92 30.5 Q110 31 118 38 Q110 45 92 45.5 Z" fill="${P.c.stripe}"/>
      ${bubble(P, 'M66 38 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0', driver(P.c.driver, 66, 39, 6.5))}
      <circle cx="66" cy="38" r="7" fill="none" stroke="#9aa0ae" stroke-width="1.6"/>`,
    // 비행접시
    x_ufo: P => `
      <path d="M48 50 L36 64 H84 L72 50 Z" fill="#c8f7d4" opacity=".45"/>
      ${bubble(P, 'M38 38 Q60 8 82 38 Z', driver(P.c.driver, 60, 30, 9))}
      <ellipse cx="60" cy="42" rx="52" ry="10" ${BODY(P)}/><ellipse cx="60" cy="39" rx="40" ry="4" fill="#fff" opacity=".35"/>
      ${[18, 34, 50, 66, 82, 98].map((x, i) => `<circle cx="${x + 2}" cy="${i % 5 ? 45 : 43}" r="2.4" fill="${['#ff3b30', '#ffd60a', '#34c759', '#0a84ff'][i % 4]}"/>`).join('')}`,
    // 종이비행기
    x_paperplane: P => `
      <path d="M4 30 L118 36 L40 48 Z" fill="#fff" stroke="#c9ccd6" stroke-width="1"/>
      <path d="M40 48 L118 36 L52 41 Z" fill="#e6e9f0" stroke="#c9ccd6" stroke-width="1"/>
      <path d="M40 48 L52 41 L46 58 Z" fill="#d3d7e0" stroke="#c9ccd6" stroke-width="1"/>
      <path d="M16 33 L100 36" stroke="${P.c.stripe}" stroke-width="1.4" stroke-dasharray="3 3"/>
      ${seated(P.c, 64, 16, 8.5, P.c.stripe)}`,
    // 눈썰매
    x_sled: P => `
      <path d="M0 64 Q60 56 120 64 V72 H0 Z" fill="#f4f8ff"/>
      ${sparkle(14, 12, 2.5, '#cfe6ff')}${sparkle(100, 8, 3, '#cfe6ff')}${sparkle(108, 30, 2, '#cfe6ff')}
      ${seated(P.c, 56, 26, 9, '#3a7bd5')}
      <path d="M47 22 Q56 9 65 22 Z" fill="${P.c.stripe}"/><circle cx="56" cy="11" r="2.6" fill="#fff"/><path d="M47 33 H66 M64 33 l-4 8" stroke="${P.c.stripe}" stroke-width="3" stroke-linecap="round"/>
      <rect x="16" y="42" width="80" height="6" rx="2" ${BODY(P)}/>
      <path d="M24 48 V56 M84 48 V56" stroke="#7a5530" stroke-width="2.4"/>
      <path d="M10 58 H98 Q112 58 112 46" stroke="#b02a2a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // 거북이 등에 타고
    x_turtle: P => `
      ${[30, 46, 74, 90].map(x => `<ellipse cx="${x}" cy="58" rx="7" ry="6" fill="#5fae5f" stroke="#3e7a3a" stroke-width="1"/>`).join('')}
      <path d="M18 48 l-8 4" stroke="#5fae5f" stroke-width="4" stroke-linecap="round"/>
      <circle cx="106" cy="40" r="10" fill="#6fbe6a" stroke="#3e7a3a" stroke-width="1"/><circle cx="109" cy="37" r="1.8" fill="#2b2633"/><path d="M106 44 q3 2 6 0" stroke="#2b2633" stroke-width="1.2" fill="none" stroke-linecap="round"/><ellipse cx="103" cy="43" rx="2" ry="1.2" fill="#ff8fa3" opacity=".7"/>
      <path d="M20 50 Q60 0 100 50 Z" ${BODY(P)}/>
      <path d="M44 30 l8 -6 h16 l8 6 l-8 8 h-16 Z M30 46 l8 -8 M90 46 l-8 -8 M44 38 l-8 10 M76 38 l8 10" stroke="${lt(P.c.body, 0.35)}" stroke-width="1.6" fill="none"/>
      <path d="M18 50 H102" stroke="${dk(P.c.body, 0.3)}" stroke-width="3" stroke-linecap="round"/>
      ${seated(P.c, 60, 6, 8, P.c.stripe)}`,

    // ===== 항공 교통수단 =====
    p_airliner: P => `
      <path d="M50 38 L36 56 L48 56 L72 38 Z" fill="${dk(P.c.body, 0.15)}" stroke="#9aa0ae" stroke-width=".8"/>
      <ellipse cx="46" cy="47" rx="8" ry="3.6" fill="#c9ccd6" stroke="#9aa0ae" stroke-width=".8"/>
      <path d="M14 27 L8 8 L18 8 L30 27 Z" fill="${P.c.stripe}"/>
      <path d="M8 34 Q10 26 22 26 H96 Q114 26 118 34 Q114 42 96 42 H18 Q10 42 8 34 Z" ${BODY(P)}/>
      <rect x="18" y="36" width="96" height="2.4" fill="${P.c.stripe}"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${30 + i * 7}" cy="31.5" r="1.7" fill="#7fa4c0"/>`).join('')}
      ${inWindow(P, 'k', [[98, 27, 13, 8]], driver(P.c.driver, 104, 33, 6))}`,
    p_fighter: P => `
      <ellipse cx="3" cy="36" rx="6" ry="3" fill="#ff9f0a" opacity=".9"/>
      <path d="M10 31 L4 13 L14 13 L26 31 Z" fill="${dk(P.c.body, 0.15)}"/>
      <path d="M38 38 L80 38 L54 58 L32 58 Z" fill="${dk(P.c.body, 0.2)}"/>
      <path d="M6 36 L20 30 H84 L118 36 L84 42 H20 Z" ${BODY(P)}/>
      ${bubble(P, 'M66 31 Q78 16 96 31 Z', driver(P.c.driver, 80, 28, 7.5))}
      <path d="M100 36 H116" stroke="${P.c.stripe}" stroke-width="1.4"/>`,
    p_light: P => `
      <path d="M58 25 L52 40 M76 25 L80 40" stroke="#9aa0ae" stroke-width="1.6"/>
      <path d="M14 32 L8 18 L16 18 L26 32 Z" fill="${dk(P.c.body, 0.15)}"/>
      <path d="M52 46 L48 54 M86 46 L88 54" stroke="#55565e" stroke-width="1.8"/><circle cx="48" cy="56" r="4" fill="#2b2b33"/><circle cx="88" cy="56" r="4" fill="#2b2b33"/>
      <path d="M14 38 Q16 30 30 30 H82 Q100 30 104 38 Q100 46 82 46 H30 Q16 46 14 38 Z" ${BODY(P)}/>
      <path d="M20 40 H102" stroke="${P.c.stripe}" stroke-width="2.4"/>
      ${inWindow(P, 'k', [[64, 30.5, 18, 8]], driver(P.c.driver, 73, 37, 7))}
      <rect x="40" y="20" width="50" height="5" rx="2.5" fill="${dk(P.c.body, 0.1)}" stroke="${P.dark}" stroke-width=".8"/>
      ${prop(108)}`,
    p_biplane: P => `
      <path d="M52 21 V44 M80 21 V44" stroke="#8a5a32" stroke-width="1.8"/>
      <rect x="40" y="16" width="52" height="5" rx="2.5" fill="${dk(P.c.body, 0.1)}" stroke="${P.dark}" stroke-width=".8"/>
      <path d="M58 22 q-14 -2 -24 6" stroke="${P.c.stripe}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${driver(P.c.driver, 66, 23, 7.5)}
      <path d="M12 30 L8 18 L16 18 L24 30 Z" fill="${P.c.stripe}"/>
      <path d="M54 46 L50 54 M84 46 L86 54" stroke="#55565e" stroke-width="1.8"/><circle cx="50" cy="56" r="4" fill="#2b2b33"/><circle cx="86" cy="56" r="4" fill="#2b2b33"/>
      <path d="M12 34 Q14 28 26 28 H90 Q104 30 106 36 Q104 42 90 42 H26 Q14 42 12 34 Z" ${BODY(P)}/>
      <rect x="40" y="43" width="52" height="5" rx="2.5" fill="${dk(P.c.body, 0.1)}" stroke="${P.dark}" stroke-width=".8"/>
      ${prop(109)}`,
    p_heli: P => `
      <path d="M70 18 V24" stroke="#55565e" stroke-width="2.4"/><rect x="18" y="14" width="96" height="3" rx="1.5" fill="#55565e" opacity=".75"/><circle cx="70" cy="16" r="2.6" fill="#2b2b33"/>
      <path d="M46 34 L8 30 L8 36 L46 42 Z" fill="${dk(P.c.body, 0.1)}"/><circle cx="9" cy="31" r="7" fill="none" stroke="#55565e" stroke-width="1.6" opacity=".7"/>
      <path d="M52 50 V58 M88 50 V58 M44 58 H96" stroke="#55565e" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M44 48 Q40 24 70 22 Q92 22 96 40 Q96 50 84 50 H52 Q44 50 44 48 Z" ${BODY(P)}/>
      <path d="M48 44 H92" stroke="${P.c.stripe}" stroke-width="2.4"/>
      ${bubble(P, 'M70 26 Q90 25 92 40 H70 Z', driver(P.c.driver, 79, 35, 7.5))}`,
    p_balloon: P => `
      <defs><clipPath id="${P.id}e"><path d="M60 -12 C84 -12 96 6 90 24 C86 34 72 40 66 44 H54 C48 40 34 34 30 24 C24 6 36 -12 60 -12 Z"/></clipPath></defs>
      <path d="M60 -12 C84 -12 96 6 90 24 C86 34 72 40 66 44 H54 C48 40 34 34 30 24 C24 6 36 -12 60 -12 Z" fill="${P.c.body}"/>
      <g clip-path="url(#${P.id}e)"><path d="M48 -14 H56 V46 H48 Z M64 -14 H72 V46 H64 Z M30 -14 H38 V46 H30 Z M82 -14 H90 V46 H82 Z" fill="${P.c.stripe}"/></g>
      <path d="M60 -12 C84 -12 96 6 90 24 C86 34 72 40 66 44 H54 C48 40 34 34 30 24 C24 6 36 -12 60 -12 Z" fill="url(#${P.id}g)" stroke="${dk(P.c.body, 0.3)}" stroke-width="1"/>
      <path d="M54 44 L50 54 M66 44 L70 54" stroke="#7a5530" stroke-width="1.2"/>
      ${driver(P.c.driver, 60, 48, 7)}
      <rect x="47" y="52" width="26" height="12" rx="2" fill="#b07a3e" stroke="#7a5530" stroke-width="1"/><path d="M47 56 H73 M47 60 H73" stroke="#7a5530" stroke-width=".8"/>`,
    p_blimp: P => `
      <path d="M16 16 L4 2 L22 10 Z M16 28 L4 42 L22 34 Z" fill="${P.c.stripe}"/>
      <ellipse cx="62" cy="22" rx="52" ry="18" ${BODY(P)}/>
      <path d="M12 22 H112" stroke="${P.c.stripe}" stroke-width="3"/>
      <path d="M58 39 L56 44 M76 39 L78 44" stroke="#7c8291" stroke-width="1.4"/>
      <rect x="50" y="42" width="34" height="12" rx="5" fill="${P.c.stripe}"/>
      ${inWindow(P, 'k', [[54, 44, 26, 8]], driver(P.c.driver, 67, 50, 6))}`,
    p_seaplane: P => `
      ${water(62)}
      <path d="M58 25 L52 40 M76 25 L80 40" stroke="#9aa0ae" stroke-width="1.6"/>
      <path d="M46 46 L42 56 M84 46 L88 56" stroke="#55565e" stroke-width="1.8"/>
      <path d="M28 56 H98 Q106 56 104 60 H32 Q26 60 28 56 Z" fill="#f4f5f7" stroke="#9aa0ae" stroke-width="1"/>
      <path d="M14 32 L8 18 L16 18 L26 32 Z" fill="${dk(P.c.body, 0.15)}"/>
      <path d="M14 38 Q16 30 30 30 H82 Q100 30 104 38 Q100 46 82 46 H30 Q16 46 14 38 Z" ${BODY(P)}/>
      <path d="M20 40 H102" stroke="${P.c.stripe}" stroke-width="2.4"/>
      ${inWindow(P, 'k', [[64, 30.5, 18, 8]], driver(P.c.driver, 73, 37, 7))}
      <rect x="40" y="20" width="50" height="5" rx="2.5" fill="${dk(P.c.body, 0.1)}" stroke="${P.dark}" stroke-width=".8"/>
      ${prop(108)}`,
    p_glider: P => `
      <path d="M12 36 L8 18 L14 18 L20 36 Z" fill="${P.c.stripe}"/><path d="M3 18 H20" stroke="${P.c.stripe}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M10 36 Q30 32 80 32 Q104 33 112 37 Q104 41 80 41 Q30 40 10 38 Z" ${BODY(P)}/>
      ${bubble(P, 'M74 33 Q88 22 104 35 Z', driver(P.c.driver, 88, 31, 6.5))}
      <ellipse cx="62" cy="34" rx="56" ry="2.6" fill="${dk(P.c.body, 0.08)}" stroke="#9aa0ae" stroke-width=".8"/>
      <path d="M8 34 H116" stroke="${P.c.stripe}" stroke-width="1" opacity=".7"/>`,
    p_aerobatic: P => `
      ${[0, 8, 16, 24].map((x, i) => `<circle cx="${x}" cy="${36 + (i % 2 ? 2 : -2)}" r="${4 + i}" fill="${i % 2 ? '#fff' : P.c.stripe}" opacity="${0.35 + i * 0.12}"/>`).join('')}
      <path d="M18 31 L12 16 L22 16 L32 31 Z" fill="${P.c.stripe}"/>
      <path d="M44 40 L86 40 L80 48 L48 48 Z" fill="${dk(P.c.body, 0.1)}"/>
      <path d="M16 36 Q18 30 30 30 H86 Q102 31 106 36 Q102 41 86 42 H30 Q18 42 16 36 Z" ${BODY(P)}/>
      <path d="M30 36 H100" stroke="${P.c.stripe}" stroke-width="3"/>
      ${bubble(P, 'M60 31 Q70 20 86 31 Z', driver(P.c.driver, 73, 29, 7))}
      ${prop(109)}`,

    // ===== 해상 교통수단 =====
    // 거북선: 쇠못 박은 지붕과 용머리
    s_turtle: P => `
      ${driver(P.c.driver, 62, 22, 7)}
      <path d="M100 40 Q108 26 118 30 Q117 40 106 44 Z" fill="#d9a441" stroke="#9c7a1c" stroke-width="1"/><circle cx="110" cy="32" r="1.6" fill="#2b2633"/><circle cx="119" cy="30" r="3" fill="#e9eef5" opacity=".9"/>
      <path d="M14 46 Q60 14 104 46 Z" ${BODY(P)}/>
      <path d="M30 40 l6 -8 M46 32 l4 -8 M62 28 l0 -8 M78 32 l-4 -8 M94 40 l-6 -8" stroke="${P.c.stripe}" stroke-width="1.6"/>
      ${[24, 36, 48, 60, 72, 84, 96].map(x => { const t = (x - 14) / 90, y = 46 - 64 * t + 64 * t * t; return `<path d="M${x} ${f1(y - 4)} l-2 4 h4 Z" fill="#cfd2da"/>`; }).join('')}
      <path d="M10 46 H108 L100 58 H18 Z" fill="${dk(P.c.body, 0.15)}" stroke="${P.dark}" stroke-width="1"/>
      ${[28, 44, 60, 76, 92].map(x => `<path d="M${x} 54 l-6 12" stroke="#7a5530" stroke-width="2" stroke-linecap="round"/>`).join('')}
      ${water(60)}`,
    // 판옥선: 2층 갑판과 누각, 깃발
    s_panokseon: P => `
      <path d="M40 30 V6 M84 30 V8" stroke="#6b4423" stroke-width="2"/><path d="M40 6 l14 4 l-14 4 Z" fill="${P.c.stripe}"/><path d="M84 8 l12 4 l-12 4 Z" fill="#0a84ff"/>
      ${driver(P.c.driver, 30, 24, 6.5)}
      <rect x="20" y="28" width="80" height="16" fill="${lt(P.c.body, 0.25)}" stroke="${P.dark}" stroke-width="1"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${26 + i * 9} 28 V44" stroke="${P.dark}" stroke-width=".8"/>`).join('')}
      <path d="M52 28 L56 18 H84 L88 28 Z" fill="#3b3a4a"/><rect x="58" y="20" width="24" height="8" fill="#e9d9b5"/>
      <path d="M8 44 H112 L102 58 H18 Z" ${BODY(P)}/>
      ${[28, 44, 60, 76, 92].map(x => `<path d="M${x} 54 l-6 12" stroke="#7a5530" stroke-width="2" stroke-linecap="round"/>`).join('')}
      ${water(60)}`,
    // 황포 돛배(돛단배)
    s_sailboat: P => `
      <path d="M62 50 V-10" stroke="#6b4423" stroke-width="2.4"/>
      <path d="M34 -6 H90 L94 44 H30 Z" fill="${P.c.stripe}" stroke="#b8862e" stroke-width="1"/>
      ${[6, 18, 30].map(y => `<path d="M33 ${y} H92" stroke="#b8862e" stroke-width="1.2"/>`).join('')}
      ${driver(P.c.driver, 98, 40, 7)}
      <path d="M16 48 H108 L98 60 H26 Z" ${BODY(P)}/>
      ${water(60)}`,
    s_yacht: P => `
      <path d="M58 50 V-12" stroke="#9aa0ae" stroke-width="2"/>
      <path d="M60 -10 Q78 14 92 44 H60 Z" fill="${P.c.stripe}"/><path d="M56 -6 Q44 18 30 44 H56 Z" fill="#fff" stroke="#c9ccd6" stroke-width="1"/>
      ${driver(P.c.driver, 96, 41, 7)}
      <path d="M12 46 H112 Q108 56 96 58 H26 Q14 54 12 46 Z" ${BODY(P)}/>
      <path d="M18 51 H104" stroke="${P.c.stripe}" stroke-width="2"/>
      ${water(58)}`,
    s_carrier: P => `
      <path d="M4 44 H116 L110 58 H12 Z" ${BODY(P)}/>
      <rect x="2" y="40" width="116" height="5" fill="${dk(P.c.body, 0.15)}"/><path d="M8 42.5 H70" stroke="#fff" stroke-width="1" stroke-dasharray="5 4"/>
      <rect x="74" y="16" width="18" height="24" rx="2" fill="${lt(P.c.body, 0.15)}" stroke="${P.dark}" stroke-width="1"/><path d="M83 16 V8" stroke="#55565e" stroke-width="1.4"/><rect x="78" y="5" width="10" height="3" rx="1.5" fill="#55565e" transform="rotate(-12 83 6.5)"/>
      ${inWindow(P, 'k', [[76, 20, 14, 8]], driver(P.c.driver, 83, 26, 5.5))}
      ${[20, 42].map(x => `<path d="M${x} 38 L${x + 14} 36 L${x + 14} 40 Z M${x + 6} 37 L${x + 3} 33 L${x + 9} 37 Z" fill="#55565e"/>`).join('')}
      ${water(56)}`,
    s_submarine: P => `
      ${driver(P.c.driver, 62, 25, 7.5)}
      <path d="M72 30 V14 H80" stroke="#55565e" stroke-width="2" fill="none"/>
      <rect x="50" y="28" width="24" height="16" rx="4" fill="${dk(P.c.body, 0.1)}" stroke="${P.dark}" stroke-width="1"/>
      <ellipse cx="60" cy="50" rx="52" ry="11" ${BODY(P)}/>
      ${[38, 52, 66, 80].map(x => `<circle cx="${x}" cy="48" r="2.6" fill="#7fa4c0" stroke="${P.dark}" stroke-width=".8"/>`).join('')}
      <path d="M8 44 L2 40 M8 56 L2 60" stroke="${P.c.stripe}" stroke-width="2.4" stroke-linecap="round"/>
      ${water(52)}`,
    s_cruise: P => `
      <rect x="60" y="4" width="10" height="14" fill="${P.c.stripe}"/><rect x="60" y="4" width="10" height="3" fill="#2b2b33"/>
      <rect x="24" y="18" width="70" height="12" rx="2" fill="#fff" stroke="#c9ccd6" stroke-width="1"/>
      <rect x="14" y="30" width="92" height="14" rx="2" fill="#fff" stroke="#c9ccd6" stroke-width="1"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${18 + i * 7}" y="35" width="4" height="4" rx="1" fill="#7fa4c0"/>`).join('')}
      ${Array.from({ length: 8 }, (_, i) => `<rect x="${28 + i * 7}" y="22" width="4" height="4" rx="1" fill="#7fa4c0"/>`).join('')}
      ${inWindow(P, 'k', [[84, 20, 9, 8]], driver(P.c.driver, 88.5, 26, 4.5))}
      <path d="M4 44 H116 L108 60 H12 Z" ${BODY(P)}/>
      ${water(58)}`,
    s_fishing: P => `
      <path d="M34 44 V8 M34 10 L56 28" stroke="#6b4423" stroke-width="1.6"/>
      ${[0, 1, 2, 3].map(i => `<path d="M${37 + i * 5} ${13 + i * 4} l3 5 l-5 0 Z" fill="${['#ff3b30', '#ffd60a', '#34c759', '#0a84ff'][i]}"/>`).join('')}
      <rect x="54" y="26" width="28" height="18" rx="2" fill="#fff" stroke="#c9ccd6" stroke-width="1"/>
      ${inWindow(P, 'k', [[58, 29, 20, 9]], driver(P.c.driver, 68, 36, 7))}
      <path d="M12 44 H100 L110 40 L102 60 H24 Z" ${BODY(P)}/>
      <path d="M16 48 H102" stroke="${P.c.stripe}" stroke-width="2.4"/>
      <circle cx="20" cy="56" r="3" fill="#ff9f0a"/>
      ${water(58)}`,
    s_motorboat: P => `
      ${driver(P.c.driver, 54, 41, 7.5)}
      <path d="M60 48 L70 37 H78 L72 48 Z" fill="url(#${P.id}w)" stroke="#9aa0ae" stroke-width="1"/>
      <path d="M8 48 H96 Q112 44 118 40 L114 50 Q108 60 94 60 H16 Q8 56 8 48 Z" ${BODY(P)}/>
      <path d="M12 52 H108" stroke="${P.c.stripe}" stroke-width="2.4"/>
      <path d="M8 54 q-4 -4 -8 -2 M10 58 q-6 -2 -10 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${water(58)}`,
    s_container: P => `
      ${[['#e2412e', '#0a84ff', '#ffd60a', '#34c759', '#ff9f0a', '#8a55d6'], ['#34c759', '#ff9f0a', '#e2412e', '#0a84ff', '#8a55d6', '#ffd60a']].map((row, j) => row.map((c, i) => `<rect x="${30 + i * 13.5}" y="${j ? 36 : 26}" width="13" height="10" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width=".8"/>`).join('')).join('')}
      <rect x="8" y="16" width="16" height="30" rx="2" fill="#fff" stroke="#c9ccd6" stroke-width="1"/>
      ${inWindow(P, 'k', [[10, 20, 12, 8]], driver(P.c.driver, 16, 26, 5))}
      <path d="M2 46 H118 L112 60 H8 Z" ${BODY(P)}/>
      <path d="M6 50 H114" stroke="${P.c.stripe}" stroke-width="1.6"/>
      ${water(58)}`,

    // ===== 조류 캐릭터 =====
    b_chick: P => bird(P, 'chick', { body: '#ffd84a', wing: '#f5c21f', belly: '#fff2a8' }),
    b_duck: P => bird(P, 'duck', { body: '#fffaf0', wing: '#e6e1d6', legs: '#ff9f1c' }),
    b_penguin: P => `
      <path d="M52 64 h9 M64 64 h9" stroke="#ffb02e" stroke-width="3.2" stroke-linecap="round"/>
      <ellipse cx="62" cy="42" rx="19" ry="22" fill="#2c3550"/><ellipse cx="64" cy="46" rx="12" ry="16" fill="#fff"/>
      <ellipse cx="44" cy="44" rx="5" ry="12" fill="#2c3550" transform="rotate(25 44 44)"/><ellipse cx="80" cy="44" rx="5" ry="12" fill="#2c3550" transform="rotate(-25 80 44)"/>
      ${driver('penguin', 62, 18, 14)}<path d="M50 31 H74 M72 31 l3 9" stroke="#e2412e" stroke-width="4" stroke-linecap="round"/>`,
    b_owl: P => `
      <path d="M52 64 h7 M65 64 h7" stroke="#f2b13a" stroke-width="2.8" stroke-linecap="round"/>
      <ellipse cx="62" cy="45" rx="21" ry="19" fill="#a8774f" stroke="#7a5232" stroke-width="1.1"/><ellipse cx="62" cy="50" rx="13" ry="12" fill="#f3e2c8"/>
      ${[44, 50, 56].map(y => `<path d="M${57} ${y} l2.5 2.5 l2.5 -2.5 M${63} ${y + 2} l2.5 2.5 l2.5 -2.5" stroke="#a8774f" stroke-width="1" fill="none"/>`).join('')}
      <ellipse cx="42" cy="46" rx="6" ry="13" fill="#8a5d3b" transform="rotate(12 42 46)"/><ellipse cx="82" cy="46" rx="6" ry="13" fill="#8a5d3b" transform="rotate(-12 82 46)"/>
      ${driver('owl', 62, 22, 16)}`,
    b_sparrow: P => bird(P, 'sparrow', { body: '#b07d52', wing: '#7a5232', belly: '#f4e6d4', legs: '#c98b55' }),
    b_parrot: P => bird(P, 'parrot', { body: '#3cc46b', wing: '#1f8fd6', tail: '#e2412e', belly: '#bff0cf', legs: '#8a8f99' }),
    b_magpie: P => bird(P, 'magpie', { body: '#26262e', wing: '#2f5fb8', belly: '#ffffff', tail: '#1b2f6b', legs: '#3a3a40' }),
    b_eagle: P => bird(P, 'eagle', { body: '#7a5232', wing: '#5a3a22', belly: '#c9a57e', tail: '#f4efe6', legs: '#ffc21a' }),
    b_flamingo: P => `
      <path d="M52 46 L52 64 M60 46 L62 55 L55 57" stroke="#ff7fa6" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <path d="M38 36 L22 30 L28 40 Z" fill="#ff7fa6"/>
      <ellipse cx="54" cy="38" rx="20" ry="12" fill="#ff9cbc" stroke="#ff7fa6" stroke-width="1"/><ellipse cx="50" cy="37" rx="11" ry="6" fill="#ff7fa6" transform="rotate(-12 50 37)"/>
      <path d="M70 34 q10 -4 6 -14 q-4 -10 7 -14" stroke="#ff9cbc" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${driver('flamingo', 84, 4, 11)}`,
    b_swan: P => `
      <path d="M30 44 L16 36 L22 46 Z" fill="#f1f1f4" stroke="#d9d9df" stroke-width="1"/>
      <ellipse cx="54" cy="46" rx="26" ry="13" fill="#fff" stroke="#d9d9df" stroke-width="1.1"/>
      <path d="M36 44 q12 -12 30 -4 q-14 2 -30 4 Z" fill="#eef0f4" stroke="#d9d9df" stroke-width=".8"/>
      <path d="M72 42 q8 -6 4 -16 q-3 -10 7 -13" stroke="#cfd3dc" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M72 42 q8 -6 4 -16 q-3 -10 7 -13" stroke="#fff" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      ${driver('swan', 84, 10, 11.5)}
      ${water(54)}`,

    // ===== 포유류 캐릭터 =====
    a_puppy: P => beast(P, 'puppy', { body: '#fffaf2', dark: '#c98b55', legs: '#e7c59f', tail: 'curl' }),
    a_cat: P => beast(P, 'cat', { body: '#f8c27e', dark: '#e08f3c', tail: 'long' }),
    a_rabbit: P => beast(P, 'rabbit', { body: '#ffffff', dark: '#d9d4d0', legs: '#f1ece8', tail: 'round', tip: '#fff' }),
    a_bear: P => beast(P, 'bear', { body: '#c8946a', dark: '#9a6b45', tail: 'round', belly: '#f1dcc4' }),
    a_panda: P => beast(P, 'panda', { body: '#ffffff', dark: '#2b2633', legs: '#2b2633', tail: 'round', tip: '#2b2633', belly: '#fff' }),
    a_hamster: P => beast(P, 'hamster', { body: '#f4cf9c', dark: '#d9a868', tail: 'round', belly: '#fff7ea' }),
    a_fox: P => beast(P, 'fox', { body: '#f39a4c', dark: '#d0702a', tail: 'bushy', belly: '#fff8ef' }),
    a_tiger: P => beast(P, 'tiger', { body: '#f6a13a', dark: '#d07d1c', tail: 'long', stripes: true, belly: '#fff8ef' }),
    a_pig: P => beast(P, 'pig', { body: '#f9bccb', dark: '#e58da3', tail: 'curl', belly: '#fde0e7' }),
    a_koala: P => beast(P, 'koala', { body: '#b4bac4', dark: '#8d939e', tail: 'round', belly: '#e8eaee' })
  });

  // ---------- 해양 동물·새 개·농기계·지하철·산업 장비 ----------
  // 물에 누운 바다표범·바다사자·강치·해달: 긴 몸, 지느러미발 + 큰 얼굴
  function flipper(P, kind, o) {
    const B = o.body, D = dk(B, 0.25);
    return `<path d="M22 50 L4 42 L9 52 L4 62 Z" fill="${D}"/>` +
      (o.tail ? `<path d="M22 50 q-12 2 -18 -4" stroke="${B}" stroke-width="6" fill="none" stroke-linecap="round"/>` : '') +
      `<ellipse cx="52" cy="48" rx="34" ry="12.5" fill="${B}" stroke="${D}" stroke-width="1.1"/><ellipse cx="58" cy="53" rx="22" ry="5.5" fill="${o.belly || lt(B, 0.45)}"/>` +
      `<ellipse cx="70" cy="58" rx="9" ry="4" fill="${D}" transform="rotate(28 70 58)"/>` +
      driver(kind, 88, 32, 15) + water(58);
  }
  // 옆모습으로 헤엄치는 돌고래·상어·고래: 몸통 path, 지느러미, 눈과 웃는 입
  function swimmer(P, o) {
    const B = o.body, D = dk(B, 0.25);
    return (o.spout || '') +
      `<path d="${o.tail}" fill="${D}"/>` +
      `<path d="${o.d}" fill="${B}" stroke="${D}" stroke-width="1.1"/>` +
      `<path d="${o.belly}" fill="${o.bellyColor || '#f4f8fb'}"/>` + (o.extra || '') +
      `<path d="${o.fin}" fill="${D}"/>` +
      `<circle cx="${o.eye[0]}" cy="${o.eye[1]}" r="2.6" fill="#2b2633"/><circle cx="${o.eye[0] + 0.9}" cy="${o.eye[1] - 0.9}" r=".9" fill="#fff"/>` +
      `<ellipse cx="${o.eye[0] - 2}" cy="${o.eye[1] + 5}" rx="3" ry="1.8" fill="#ff8fa3" opacity=".6"/>` +
      `<path d="${o.mouth}" stroke="#2b2633" stroke-width="1.3" fill="none" stroke-linecap="round"/>` + water(56);
  }
  // 바나나보트에 앉은 친구(구명조끼)
  const rider = (kind, x, y) => `<rect x="${x - 7}" y="${y + 5}" width="14" height="11" rx="4" fill="#ff9f0a" stroke="#d97a00" stroke-width=".7"/>` + driver(kind, x, y, 7.5);
  // 철길
  const rails = () => `<rect x="0" y="63" width="120" height="3" fill="#7c8291"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${i * 12 + 2}" y="66" width="8" height="3" fill="#8a6a4a"/>`).join('');
  // 큰 트럭 바퀴 3개
  const truckWheels = (P, xs) => xs.map(x => wheel(x, P.id, dk(P.c.body, 0.5))).join('');

  Object.assign(SPECIAL, {
    // ===== 해양 동물 캐릭터 =====
    m_sealion: P => flipper(P, 'sealion', { body: '#9a7350', belly: '#c8a67f' }),
    m_kangchi: P => flipper(P, 'kangchi', { body: '#66615d', belly: '#8f8984' }),
    m_seal: P => flipper(P, 'seal', { body: '#aab5c3', belly: '#dfe5ec' }),
    m_otter: P => flipper(P, 'otter', { body: '#8b6545', belly: '#d9c1a2', tail: true }),
    m_dolphin: P => swimmer(P, { body: '#7fb6e6', d: 'M12 40 Q30 22 68 23 Q96 25 106 33 L118 36 L106 40 Q96 44 84 45 Q60 52 34 48 Q20 46 12 40 Z',
      belly: 'M36 46 Q60 50 84 44 Q96 42 106 40 L114 37 Q100 44 84 47 Q60 52 36 46 Z', tail: 'M16 40 L2 28 L8 40 L2 52 Z', fin: 'M56 24 Q62 10 72 23 Z M66 44 L58 56 L74 46 Z',
      eye: [96, 31], mouth: 'M104 38 q-6 4 -12 2' }),
    m_shark: P => swimmer(P, { body: '#8494a8', d: 'M10 40 Q28 24 64 24 Q98 25 116 38 Q100 46 84 46 Q60 52 32 48 Q18 46 10 40 Z',
      belly: 'M40 47 Q64 50 84 45 Q100 44 112 40 Q100 48 84 48 Q60 53 40 47 Z', tail: 'M14 40 L0 20 L8 40 L2 56 Z', fin: 'M54 25 L62 4 L74 25 Z M68 44 L60 58 L78 46 Z',
      eye: [98, 33], mouth: 'M108 40 l-3 2 l-3 -2 l-3 2 l-3 -2 l-3 2', extra: '<path d="M82 32 v8 M86 32 v8 M90 33 v7" stroke="#5d6b7e" stroke-width="1.1" stroke-linecap="round"/>' }),
    m_whale: P => swimmer(P, { body: '#4a6fa5', d: 'M14 38 Q26 16 70 16 Q108 18 114 38 Q108 50 80 52 Q48 54 28 48 Q16 44 14 38 Z',
      belly: 'M40 49 Q70 54 92 50 Q108 46 112 40 Q104 44 86 46 Q62 48 40 49 Z', tail: 'M18 36 L2 18 L8 32 L0 40 Z', fin: 'M62 46 Q56 58 46 62 Q58 60 70 48 Z',
      eye: [100, 33], mouth: 'M112 40 q-10 5 -20 4', extra: '<path d="M60 49 h30 M58 51 h30" stroke="#33507e" stroke-width=".9"/>',
      spout: '<path d="M78 16 q-2 -8 -8 -12 M78 16 q2 -9 8 -12 M78 16 v-12" stroke="#bfe6ff" stroke-width="2.4" stroke-linecap="round" fill="none"/>' }),
    m_orca: P => swimmer(P, { body: '#26262e', d: 'M12 40 Q28 22 66 22 Q100 24 114 38 Q100 46 84 46 Q60 52 32 48 Q18 46 12 40 Z',
      belly: 'M38 46 Q62 52 86 46 Q100 44 110 40 Q98 50 84 50 Q58 54 38 46 Z', tail: 'M16 40 L2 26 L8 40 L2 54 Z', fin: 'M54 23 L60 0 L70 23 Z M64 44 L56 56 L74 46 Z',
      eye: [97, 32], mouth: 'M108 40 q-7 4 -14 2', extra: '<ellipse cx="88" cy="30" rx="6" ry="3" fill="#fff" transform="rotate(-10 88 30)"/>' }),

    // ===== 포유류 캐릭터(추가) =====
    a_husky: P => beast(P, 'husky', { body: '#8c96a5', dark: '#6a7482', legs: '#e9edf2', tail: 'curl', belly: '#fdfdfd' }),
    a_jindo: P => beast(P, 'jindo', { body: '#e2b675', dark: '#c99a58', tail: 'curl', belly: '#fbf1de' }),
    a_pungsan: P => beast(P, 'pungsan', { body: '#fbfaf6', dark: '#d8d3ca', legs: '#f3efe8', tail: 'curl', belly: '#fff' }),
    a_sapsal: P => beast(P, 'sapsal', { body: '#a3988c', dark: '#7d7268', tail: 'bushy', tip: '#8e8378', belly: '#b8aea3' }),
    a_lion: P => beast(P, 'lion', { body: '#f2b552', dark: '#c9752a', tail: 'long', belly: '#fff3dc' }) + `<circle cx="10" cy="28" r="3.6" fill="#c9752a"/>`,
    a_meerkat: P => `
      <path d="M52 62 q-22 2 -30 -10" stroke="#b88d5a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="54" y="52" width="8" height="12" rx="4" fill="#b88d5a"/><rect x="64" y="52" width="8" height="12" rx="4" fill="#b88d5a"/>
      <ellipse cx="63" cy="44" rx="14" ry="19" fill="#dcb57e" stroke="#b88d5a" stroke-width="1.1"/><ellipse cx="63" cy="47" rx="8" ry="13" fill="#f1dcbc"/>
      <ellipse cx="57" cy="38" rx="3.2" ry="6" fill="#c9a06a" transform="rotate(30 57 38)"/><ellipse cx="69" cy="38" rx="3.2" ry="6" fill="#c9a06a" transform="rotate(-30 69 38)"/>
      ${driver('meerkat', 63, 18, 13)}`,

    // ===== 조류 캐릭터(추가) =====
    b_rooster: P => bird(P, 'rooster', { body: '#fffaf0', wing: '#efe4d2', tail: '#2f6b3a', legs: '#f2a33a', belly: '#ffffff' }),

    // ===== 해상 교통수단(추가): 바나나보트 =====
    s_banana: P => `
      ${water(56)}
      <path d="M8 42 Q60 62 112 38 Q116 46 108 52 Q60 68 10 52 Q4 48 8 42 Z" fill="${P.c.body}" stroke="${dk(P.c.body, 0.25)}" stroke-width="1.2"/>
      <path d="M112 38 l4 -3 l1 4 Z M8 42 l-5 -1 l2 4 Z" fill="#6b4a2b"/>
      <path d="M20 47 Q60 60 104 44" stroke="#fff" stroke-width="2" fill="none" opacity=".55"/>
      ${rider(P.c.driver, 34, 30)}${rider('cat', 58, 34)}${rider('pig', 82, 31)}
      <path d="M2 56 q4 -6 10 -2 M112 54 q4 -6 8 -1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`,

    // ===== 특수 차량(추가): 지하철·기차·산업 장비 =====
    t_subway: P => `
      ${rails()}
      <rect x="4" y="12" width="112" height="46" rx="7" ${BODY(P)}/>
      <rect x="4" y="42" width="112" height="5" fill="${P.c.stripe}"/>
      ${[10, 46, 82].map(x => `<rect x="${x}" y="18" width="18" height="14" rx="2" fill="url(#${P.id}w)"/>`).join('')}
      ${[30, 66].map(x => `<rect x="${x}" y="17" width="12" height="38" rx="1.5" fill="none" stroke="${P.dark}" stroke-width="1"/><path d="M${x + 6} 17 V55" stroke="${P.dark}" stroke-width=".8"/>`).join('')}
      ${inWindow(P, 'k', [[100, 18, 12, 14]], driver(P.c.driver, 106, 26, 6))}
      <circle cx="112" cy="51" r="2" fill="#fffbe6"/>
      ${[22, 34, 86, 98].map(x => `<circle cx="${x}" cy="60" r="4.5" fill="#3a3a40"/>`).join('')}`,
    t_train: P => `
      ${rails()}
      <path d="M4 14 H82 Q110 16 118 48 V56 H4 Z" ${BODY(P)}/>
      <path d="M4 42 H116 L117 47 H4 Z" fill="${P.c.stripe}"/>
      ${[10, 30, 50, 70].map(x => `<rect x="${x}" y="20" width="14" height="10" rx="2" fill="url(#${P.id}w)"/>`).join('')}
      ${bubble(P, 'M90 20 Q104 22 110 36 H90 Z', driver(P.c.driver, 98, 29, 6.5))}
      <circle cx="113" cy="50" r="2" fill="#fffbe6"/>
      ${[18, 30, 84, 96].map(x => `<circle cx="${x}" cy="60" r="4.5" fill="#3a3a40"/>`).join('')}`,
    t_excavator: P => `
      ${treads(8, 74)}
      <path d="M60 32 L86 6 L108 28" stroke="${P.c.body}" stroke-width="7" fill="none" stroke-linejoin="round"/>
      <path d="M64 30 L84 12" stroke="#55565e" stroke-width="2"/><path d="M90 10 L104 24" stroke="#55565e" stroke-width="2"/>
      <path d="M100 26 L118 30 L114 44 L98 38 Z" fill="#55565e"/><path d="M114 44 l-2 3 M110 43 l-2 3 M106 42 l-2 3" stroke="#3a3a40" stroke-width="1.6"/>
      <rect x="10" y="30" width="16" height="16" rx="3" fill="${dk(P.c.body, 0.15)}"/>
      <path d="M14 46 V32 Q14 26 20 26 H62 V46 Z" ${BODY(P)}/>
      ${inWindow(P, 'k', [[40, 28, 18, 14]], driver(P.c.driver, 49, 37, 7))}`,
    t_dump: P => `
      <path d="M4 50 L8 18 L76 30 L74 50 Z" fill="${P.c.stripe}" stroke="${dk(P.c.stripe, 0.3)}" stroke-width="1.1" transform="rotate(-8 74 50)"/>
      <path d="M10 22 Q30 10 54 24 Z" fill="#a0703f" transform="rotate(-8 74 50)"/>
      <path d="M76 52 L76 22 L96 22 C100 22 102 24 103 27 L109 36 C114 37 117 40 117 44 L117 53 C117 55 115 57 113 57 L74 57 Z" ${BODY(P)}/>
      ${inWindow(P, 'k', [[80, 26, 16, 9]], driver(P.c.driver, 88, 33, 6.5))}
      <rect x="4" y="50" width="76" height="5" fill="#3a3a40"/>
      ${truckWheels(P, [20, 46, 96])}`,
    t_mixer: P => `
      <rect x="4" y="50" width="76" height="5" fill="#3a3a40"/>
      <g transform="rotate(-12 42 34)"><ellipse cx="42" cy="34" rx="34" ry="15" fill="#f4f5f7" stroke="#9aa0ae" stroke-width="1.2"/>
      ${[20, 34, 48, 62].map(x => `<path d="M${x} 20 L${x + 10} 48" stroke="${P.c.stripe}" stroke-width="4"/>`).join('')}</g>
      <path d="M72 30 L84 24" stroke="#55565e" stroke-width="3"/>
      <path d="M80 52 L80 22 L96 22 C100 22 102 24 103 27 L109 36 C114 37 117 40 117 44 L117 53 C117 55 115 57 113 57 L78 57 Z" ${BODY(P)}/>
      ${inWindow(P, 'k', [[84, 26, 13, 9]], driver(P.c.driver, 90.5, 33, 6))}
      ${truckWheels(P, [20, 46, 98])}`,
    t_forklift: P => `
      <rect x="98" y="4" width="4" height="56" fill="#55565e"/><rect x="104" y="4" width="3" height="56" fill="#7c8291"/>
      <path d="M100 40 H120" stroke="#3a3a40" stroke-width="3"/>
      <rect x="104" y="22" width="16" height="17" fill="#b88a55" stroke="#7a5530" stroke-width="1"/><path d="M104 30 H120 M112 22 V39" stroke="#7a5530" stroke-width=".9"/>
      <path d="M40 14 V36 M78 14 V36 M38 14 H82" stroke="#3a3a40" stroke-width="2.4" stroke-linecap="round"/>
      ${seated(P.c, 62, 24, 8, P.c.stripe)}
      <path d="M20 54 V40 Q20 34 26 34 H94 V54 Z" ${BODY(P)}/>
      <rect x="14" y="36" width="10" height="18" rx="2" fill="${dk(P.c.body, 0.2)}"/>
      ${wheel(36, P.id, '#3a3a40')}${wheel(84, P.id, '#3a3a40')}`,
    t_crane: P => `
      <path d="M44 34 L114 -10" stroke="${P.c.stripe}" stroke-width="6" stroke-linecap="round"/>
      <path d="M46 34 L114 -8" stroke="${dk(P.c.stripe, 0.3)}" stroke-width="1" stroke-dasharray="4 4"/>
      <path d="M113 -9 V22" stroke="#3a3a40" stroke-width="1.2"/><path d="M109 22 h8 l-2 6 q-2 3 -4 0" stroke="#3a3a40" stroke-width="2" fill="none"/>
      <rect x="30" y="28" width="28" height="14" rx="3" fill="${dk(P.c.body, 0.1)}"/>
      <path d="M6 50 L6 38 H74 V22 H96 C100 22 102 24 103 27 L109 36 C114 37 117 40 117 44 L117 53 C117 55 115 57 113 57 H6 Z" ${BODY(P)}/>
      ${inWindow(P, 'k', [[80, 26, 16, 9]], driver(P.c.driver, 88, 33, 6.5))}
      <path d="M8 58 V64 H16 M66 58 V64 H74" stroke="#3a3a40" stroke-width="2"/>
      ${truckWheels(P, [24, 50, 96])}`,

    // ===== 농기계 =====
    f_tractor: P => `
      <path d="M22 6 H58 M24 6 V32 M56 6 V32" stroke="#3a3a40" stroke-width="2.4" stroke-linecap="round"/><rect x="18" y="2" width="44" height="5" rx="2" fill="${P.c.stripe}"/>
      ${seated(P.c, 42, 20, 8.5, P.c.stripe)}
      <path d="M96 34 V16" stroke="#3a3a40" stroke-width="3" stroke-linecap="round"/>
      <path d="M54 50 V36 Q54 32 58 32 H108 Q114 32 114 38 V50 Z" ${BODY(P)}/>
      <path d="M106 36 V48 M110 36 V48" stroke="${P.dark}" stroke-width="1"/>
      <circle cx="34" cy="48" r="17" fill="#2a2a30"/><circle cx="34" cy="48" r="9" fill="${P.c.stripe}" stroke="#1d1d22" stroke-width="1"/><circle cx="34" cy="48" r="3" fill="#1d1d22"/>
      ${Array.from({ length: 12 }, (_, k) => { const t = k * Math.PI / 6; return `<path d="M${f1(34 + Math.cos(t) * 13.5)} ${f1(48 + Math.sin(t) * 13.5)} L${f1(34 + Math.cos(t) * 17.5)} ${f1(48 + Math.sin(t) * 17.5)}" stroke="#55565e" stroke-width="2.6"/>`; }).join('')}
      <path d="M14 36 Q34 22 54 36" stroke="${P.c.body}" stroke-width="5" fill="none"/>
      <circle cx="98" cy="58" r="8" fill="#2a2a30"/><circle cx="98" cy="58" r="4" fill="${P.c.stripe}"/>`,
    f_combine: P => `
      ${treads(8, 84)}
      <path d="M40 18 L58 6 H66" stroke="#55565e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="12" y="18" width="70" height="28" rx="3" ${BODY(P)}/>
      <path d="M16 28 H60" stroke="${P.c.stripe}" stroke-width="2.4"/>
      <rect x="62" y="12" width="20" height="18" rx="2" fill="${lt(P.c.body, 0.15)}" stroke="${P.dark}" stroke-width="1"/>
      ${inWindow(P, 'k', [[65, 15, 14, 11]], driver(P.c.driver, 72, 22, 6))}
      <path d="M84 50 H118 L114 42 H88 Z" fill="#55565e"/>
      <circle cx="102" cy="34" r="11" fill="none" stroke="${P.c.stripe}" stroke-width="2"/>${[0, 1, 2, 3].map(k => { const t = k * Math.PI / 4; return `<path d="M${f1(102 - Math.cos(t) * 11)} ${f1(34 - Math.sin(t) * 11)} L${f1(102 + Math.cos(t) * 11)} ${f1(34 + Math.sin(t) * 11)}" stroke="${P.c.stripe}" stroke-width="1.6"/>`; }).join('')}
      <path d="M84 40 L92 34" stroke="#55565e" stroke-width="2"/>`,
    f_transplanter: P => `
      <path d="M4 22 L40 34 L40 46 L4 34 Z" fill="#7a5530"/>
      ${[8, 16, 24, 32].map((x, i) => `<path d="M${x} ${24 + i * 2.6} q-1 -8 -4 -10 M${x} ${24 + i * 2.6} q1 -8 4 -9 M${x + 4} ${25 + i * 2.6} q0 -7 2 -9" stroke="#4caf50" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('')}
      ${seated(P.c, 62, 22, 8.5, P.c.stripe)}
      <path d="M40 48 V38 Q40 34 44 34 H96 Q104 34 106 42 V48 Z" ${BODY(P)}/>
      <path d="M96 34 L110 22 L114 24" stroke="#3a3a40" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${spokeWheel(50, 54, 11, '#3a3a40', 10)}${spokeWheel(94, 54, 11, '#3a3a40', 10)}`,
    f_drone: P => `
      <path d="M40 66 L46 52 M60 66 L60 52 M80 66 L74 52" stroke="#bfe6ff" stroke-width="2" stroke-dasharray="2 3" stroke-linecap="round"/>
      <path d="M22 30 L98 30 M36 22 L84 38" stroke="#3a3a40" stroke-width="3" stroke-linecap="round"/>
      ${[[22, 30], [98, 30], [36, 22], [84, 38]].map(([x, y]) => `<ellipse cx="${x}" cy="${y - 3}" rx="13" ry="2.4" fill="#55565e" opacity=".5"/><circle cx="${x}" cy="${y}" r="2.6" fill="#2b2b33"/>`).join('')}
      <rect x="44" y="34" width="32" height="14" rx="5" ${BODY(P)}/>
      <rect x="50" y="48" width="20" height="5" rx="2" fill="${P.c.stripe}"/>
      ${driver(P.c.driver, 60, 24, 8)}`
  });

  // 그림마다 색 id를 따로 둡니다(숨겨진 화면의 그림을 참조하면 색이 사라지는 문제 방지)
  let carUid = 0;
  // 광택 있는 귀여운 탈것 (오른쪽을 보고 달림)
  function carSVG(i) {
    const n = CARS.length, k = ((i % n) + n) % n, c = CARS[k], id = 'car' + k + '_' + (++carUid);
    const dark = shade(c.body, -0.38), lite = shade(c.body, 0.42), deep = shade(c.body, -0.6);
    const P = { c, id, dark, lite, deep };
    const top = `<svg class="car-svg" viewBox="0 -14 120 86" aria-hidden="true">
      <defs>
        <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lite}"/><stop offset=".42" stop-color="${c.body}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
        <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f5fc"/><stop offset=".5" stop-color="#b9d9ec"/><stop offset="1" stop-color="#7fa4c0"/></linearGradient>
        <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <radialGradient id="${id}s"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}t" cx=".45" cy=".4" r=".6"><stop offset=".6" stop-color="#34343b"/><stop offset="1" stop-color="#121216"/></radialGradient>
        <radialGradient id="${id}r" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ccd6"/></radialGradient>
        <radialGradient id="${id}l"><stop offset="0" stop-color="#fffbe0"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="65" rx="57" ry="6.5" fill="url(#${id}s)"/>`;
    if (SPECIAL[c.kind]) return top + SPECIAL[c.kind](P) + '</svg>';

    const s = SHAPES[c.kind];
    const [hx, hy, hr] = s.head;
    const w0 = s.wheels[0], wN = s.wheels[s.wheels.length - 1];
    const lights = {
      bar: `<path d="M${s.lx} ${s.ly} L${s.lx + 8} ${s.ly + 2}" stroke="#fffbe6" stroke-width="2.4" stroke-linecap="round"/>`,
      square: `<rect x="${s.lx}" y="${s.ly}" width="7" height="5" rx="1.5" fill="#fffbe6" stroke="${dark}" stroke-width=".6"/>`,
      slim: `<path d="M${s.lx} ${s.ly} L${s.lx + 8} ${s.ly + 1.5} L${s.lx + 8} ${s.ly + 3.5} L${s.lx} ${s.ly + 2.5} Z" fill="#fffbe6" stroke="${dark}" stroke-width=".5"/>`,
      round: `<circle cx="${s.lx + 3}" cy="${s.ly + 2}" r="3" fill="#fffbe6" stroke="${dark}" stroke-width=".6"/>`,
      bigRound: `<circle cx="${s.lx + 2}" cy="${s.ly}" r="4.2" fill="#fffbe6" stroke="#a9adba" stroke-width="1"/>`
    };
    const light = `<circle cx="${s.lx + 5}" cy="${s.ly + 2}" r="7" fill="url(#${id}l)"/>` + lights[s.light];
    return top + `
      <defs><clipPath id="${id}c"><rect x="0" y="-30" width="120" height="${s.belt + 30}"/></clipPath></defs>
      ${s.body.map(d => `<path d="${d}" fill="url(#${id}b)" stroke="${dark}" stroke-width="1.1" stroke-linejoin="round"/>`).join('')}
      ${s.rails ? `<path d="${s.rails}" stroke="${deep}" stroke-width="2.2" stroke-linecap="round"/>` : ''}
      ${s.win.map(d => `<path d="${d}" fill="url(#${id}w)"/>`).join('')}
      <g clip-path="url(#${id}c)">${driver(c.driver, hx, hy, hr)}</g>
      ${s.win.map(d => `<path d="${d}" fill="url(#${id}g)"/>`).join('')}
      <path d="M${w0 - 16} ${s.belt + 5} H${wN + 14}" stroke="#fff" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>
      <rect x="${w0 - 14}" y="${s.belt + 10}" width="${wN - w0 + 26}" height="3" rx="1.5" fill="${c.stripe}" opacity=".9"/>
      ${s.bed ? `<path d="M8 36 H52" stroke="${deep}" stroke-width="1.6" stroke-linecap="round"/><path d="M8 40 H52" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` : ''}
      ${s.grille ? `<rect x="113.5" y="40" width="4" height="9" rx="1" fill="#e9ebf1" stroke="#9ea3b1" stroke-width=".6"/><path d="M114.5 41.5 H117 M114.5 43.5 H117 M114.5 45.5 H117 M114.5 47.5 H117" stroke="#9ea3b1" stroke-width=".5"/>` : ''}
      ${s.extra ? s.extra(P) : ''}
      ${light}
      <rect x="6.6" y="${s.belt + 6}" width="3" height="5" rx="1.2" fill="#ff5b4f"/>
      <rect x="${wN + 9}" y="50.5" width="${Math.max(6, 118 - wN - 9)}" height="4" rx="2" fill="#e3e5ec" stroke="#a9adba" stroke-width=".6"/>
      <rect x="4" y="50.5" width="${w0 - 15}" height="4" rx="2" fill="#e3e5ec" stroke="#a9adba" stroke-width=".6"/>
      ${s.wheels.map(w => wheel(w, id, deep)).join('')}
    </svg>`;
  }

  // ---------- 그림 도구 ----------
  function person(x, y, o) {
    o = o || {};
    const s = o.s || 1;
    const b = o.body || '#FAF7EE';
    const p = (px, py) => `${(x + px * s).toFixed(1)},${(y + py * s).toFixed(1)}`;
    const sw = n => (n * s).toFixed(2);
    let g = `<path d="M${p(-4, -10)} L${p(-4, 0)} M${p(4, -10)} L${p(4, 0)}" stroke="${o.legs || INK}" stroke-width="${sw(3)}" stroke-linecap="round"/>`;
    g += `<path d="M${p(-6, -30)} L${p(6, -30)} L${p(9, -9)} L${p(-9, -9)} Z" fill="${b}" stroke="${INK}" stroke-width="${sw(2)}" stroke-linejoin="round"/>`;
    const arms = {
      down: [[-6, -27, -10, -14], [6, -27, 10, -14]],
      up: [[-6, -27, -12, -43], [6, -27, 12, -43]],
      one: [[-6, -27, -10, -14], [6, -27, 13, -42]],
      'reach-r': [[-6, -27, -10, -14], [6, -26, 17, -20]],
      'reach-l': [[-6, -26, -17, -20], [6, -27, 10, -14]]
    }[o.arms || 'down'];
    arms.forEach(a => {
      g += `<path d="M${p(a[0], a[1])} L${p(a[2], a[3])}" stroke="${INK}" stroke-width="${sw(2.5)}" stroke-linecap="round"/>`;
    });
    g += `<circle cx="${x}" cy="${(y - 37 * s).toFixed(1)}" r="${sw(6.5)}" fill="${SKIN}" stroke="${INK}" stroke-width="${sw(2)}"/>`;
    // 얼굴: 눈과 볼
    g += `<circle cx="${(x - 2.3 * s).toFixed(1)}" cy="${(y - 36.5 * s).toFixed(1)}" r="${sw(0.9)}" fill="#2b2633"/><circle cx="${(x + 2.3 * s).toFixed(1)}" cy="${(y - 36.5 * s).toFixed(1)}" r="${sw(0.9)}" fill="#2b2633"/>`;
    g += `<circle cx="${(x - 3.8 * s).toFixed(1)}" cy="${(y - 34.2 * s).toFixed(1)}" r="${sw(1.2)}" fill="#f29a8a" opacity=".55"/><circle cx="${(x + 3.8 * s).toFixed(1)}" cy="${(y - 34.2 * s).toFixed(1)}" r="${sw(1.2)}" fill="#f29a8a" opacity=".55"/>`;
    if (o.hat === 'cap') {
      g += `<path d="M${p(-7, -39)} Q${p(0, -50)} ${p(7, -39)} Z" fill="${INK}"/><path d="M${p(3, -40)} L${p(11, -39)}" stroke="${INK}" stroke-width="${sw(2.5)}" stroke-linecap="round"/>`;
    } else if (o.hat === 'gat') {
      g += `<path d="M${p(-12, -42)} L${p(12, -42)}" stroke="${INK}" stroke-width="${sw(2)}" stroke-linecap="round"/><rect x="${(x - 4.5 * s).toFixed(1)}" y="${(y - 50 * s).toFixed(1)}" width="${sw(9)}" height="${sw(8)}" rx="${sw(2)}" fill="${INK}"/>`;
    } else if (o.hat === 'fedora') {
      g += `<path d="M${p(-10, -41)} L${p(10, -41)}" stroke="${INK}" stroke-width="${sw(2.5)}" stroke-linecap="round"/><path d="M${p(-6, -41)} L${p(-5, -49)} Q${p(0, -51)} ${p(5, -49)} L${p(6, -41)} Z" fill="${o.hatColor || '#5B4636'}" stroke="${INK}" stroke-width="${sw(1.5)}"/>`;
    } else {
      g += `<path d="M${p(-6.5, -38)} Q${p(0, -48)} ${p(6.5, -38)} Z" fill="${INK}"/>`;
    }
    return g;
  }

  function hanok(x, y, w, h, wall, roof) {
    const top = y - h;
    return `<rect x="${x + 8}" y="${top}" width="${w - 16}" height="${h}" fill="${wall}" stroke="${INK}" stroke-width="2"/>
      <path d="M${x + 22} ${top} V${y} M${x + w - 22} ${top} V${y} M${x + w / 2} ${top} V${y}" stroke="#7A5B43" stroke-width="2"/>
      <path d="M${x - 9} ${top - 6} Q${x + w / 2} ${top + 10} ${x + w + 9} ${top - 6} L${x + w - 12} ${top - 18} Q${x + w / 2} ${top - 22} ${x + 12} ${top - 18} Z" fill="${roof}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M${x + 10} ${top - 19} Q${x + w / 2} ${top - 24} ${x + w - 10} ${top - 19}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }

  // 장면마다 다른 그라디언트 id를 쓰려고 sceneSVG가 바꿔 주는 접두사
  let P = 'z_', uid = 0;

  // 하늘: 위는 짙고 지평선은 옅은 그라디언트 + 오른쪽 위 햇빛
  function sky(color) {
    return `<defs>
        <linearGradient id="${P}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, -0.16)}"/><stop offset=".6" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, 0.45)}"/></linearGradient>
        <radialGradient id="${P}sun" cx=".82" cy=".08" r=".75"><stop offset="0" stop-color="#fffbe8" stop-opacity=".75"/><stop offset=".35" stop-color="#fffbe8" stop-opacity=".18"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></radialGradient>
      </defs>
      <rect x="-200" y="-200" width="${W + 400}" height="${GROUND + 200}" fill="url(#${P}sky)"/>
      <rect x="-200" y="-200" width="${W + 400}" height="${GROUND + 200}" fill="url(#${P}sun)"/>
      <g fill="#fff" opacity=".55"><ellipse cx="62" cy="34" rx="26" ry="7"/><ellipse cx="80" cy="30" rx="16" ry="7"/><ellipse cx="214" cy="52" rx="22" ry="5.5"/><ellipse cx="228" cy="48" rx="12" ry="5"/></g>`;
  }
  // 땅: 위는 밝고 아래로 갈수록 짙게, 지평선은 부드러운 그림자
  function ground(color) {
    return `<defs><linearGradient id="${P}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, 0.12)}"/><stop offset="1" stop-color="${shade(color, -0.2)}"/></linearGradient></defs>
      <rect x="-200" y="${GROUND}" width="${W + 400}" height="${H - GROUND + 200}" fill="url(#${P}gr)"/>
      <rect x="-200" y="${GROUND}" width="${W + 400}" height="3" fill="#000" opacity=".08"/>
      <g stroke="#fff" stroke-opacity=".18" stroke-linecap="round"><path d="M-10 ${GROUND + 14} H60 M110 ${GROUND + 24} H190 M230 ${GROUND + 12} H310 M20 ${GROUND + 36} H90 M170 ${GROUND + 42} H260" stroke-width="1.6"/></g>`;
  }
  // 언덕: 먼 언덕(옅게)과 가까운 언덕을 겹쳐 깊이감
  function hills(color, base) {
    base = base || GROUND;
    const far = shade(color, 0.38);
    return `<defs><linearGradient id="${P}hl${base}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, 0.14)}"/><stop offset="1" stop-color="${shade(color, -0.12)}"/></linearGradient></defs>
      <path d="M-200 ${base - 34} Q-10 ${base - 78} 80 ${base - 46} Q160 ${base - 86} 250 ${base - 50} Q330 ${base - 70} ${W + 200} ${base - 44} V${base} H-200 Z" fill="${far}" opacity=".85"/>
      <path d="M-200 ${base - 22} Q40 ${base - 62} 110 ${base - 30} Q190 ${base - 70} 300 ${base - 34} Q400 ${base - 50} ${W + 200} ${base - 30} V${base} H-200 Z" fill="url(#${P}hl${base})"/>`;
  }

  // 마무리: 외곽선을 가늘고 부드럽게, 종이 질감과 아래쪽 그늘을 더합니다.
  function finish(inner) {
    inner = inner.replace(/<(path|rect|circle|ellipse|polygon|polyline|line)\b[^>]*>/g, tag => {
      const isLine = /stroke-linecap="round"/.test(tag) && (!/\bfill="/.test(tag) || /fill="none"/.test(tag));
      tag = tag.replace(/stroke-width="([\d.]+)"/, (m, v) => `stroke-width="${(+v * (isLine ? 0.85 : 0.55)).toFixed(2)}"`);
      if (!isLine) tag = tag.replace(/stroke="#22213A"/, 'stroke="#2c2840" stroke-opacity=".72"');
      return tag;
    });
    return inner + `<defs>
        <filter id="${P}grain" filterUnits="userSpaceOnUse" x="-200" y="-200" width="700" height="600"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
        <linearGradient id="${P}vig" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
      </defs>
      <rect x="-200" y="-200" width="700" height="600" filter="url(#${P}grain)"/>
      <rect x="-200" y="-200" width="700" height="600" fill="url(#${P}vig)"/>`;
  }
  function label(x, y, text, size, fill, extra) {
    return `<text x="${x}" y="${y}" font-family="Jua, 'Malgun Gothic', sans-serif" font-size="${size}" fill="${fill}" text-anchor="middle" ${extra || ''}>${text}</text>`;
  }

  // ---------- 7-B 대중 운동과 민족 문화 수호 ----------
  const art7b = [
    // ① 물산 장려 운동 장터
    function () {
      let g = sky('#BFE3F2') + `<circle cx="262" cy="34" r="15" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += hills('#9CCB9A') + ground('#E8CC94');
      g += `<path d="M8 22 Q150 44 292 22" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<rect x="72" y="30" width="156" height="26" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`;
      g += label(150, 49, '조선 사람 조선 것', 15, '#E2412E');
      // 왼쪽 가게: 무명 옷감
      g += awning(18, 80, 104, '#2350B8');
      g += `<rect x="20" y="96" width="4" height="54" fill="${INK}"/><rect x="116" y="96" width="4" height="54" fill="${INK}"/>`;
      g += `<rect x="18" y="124" width="104" height="10" rx="2" fill="#A9744F" stroke="${INK}" stroke-width="2"/>`;
      [30, 56, 82].forEach(x => {
        g += `<rect x="${x}" y="106" width="22" height="18" rx="5" fill="#FFFDF4" stroke="${INK}" stroke-width="2"/><path d="M${x + 7} 106 V124 M${x + 15} 106 V124" stroke="#D9D2BE" stroke-width="1.5"/>`;
      });
      // 오른쪽 가게: 그릇과 고무신
      g += awning(184, 80, 104, '#E2412E');
      g += `<rect x="186" y="96" width="4" height="54" fill="${INK}"/><rect x="282" y="96" width="4" height="54" fill="${INK}"/>`;
      g += `<rect x="184" y="124" width="104" height="10" rx="2" fill="#A9744F" stroke="${INK}" stroke-width="2"/>`;
      g += `<ellipse cx="204" cy="116" rx="11" ry="9" fill="#8A5A3C" stroke="${INK}" stroke-width="2"/><ellipse cx="230" cy="114" rx="12" ry="11" fill="#9E6B47" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M250 122 q8 -8 16 0 z M266 122 q8 -8 16 0 z" fill="${INK}"/>`;
      g += person(140, 176, { body: '#FAF7EE' }) + person(162, 176, { body: '#3B4A6B', hat: 'fedora' }) + person(124, 178, { s: 0.72, body: '#F5C242' });
      return g;
    },
    // ② 6·10 만세 운동 (1926)
    function () {
      let g = sky('#F6E6C4') + ground('#D9C9A8');
      g += hanok(-6, 132, 118, 34, '#F3E7CF', '#4B5068');
      g += `<rect x="196" y="58" width="100" height="74" fill="#C9B193" stroke="${INK}" stroke-width="2"/><rect x="190" y="52" width="112" height="9" fill="#A89070" stroke="${INK}" stroke-width="2"/>`;
      [208, 232, 256, 280].forEach(x => { g += `<rect x="${x}" y="70" width="12" height="16" fill="#F7E7B4" stroke="${INK}" stroke-width="1.5"/><rect x="${x}" y="98" width="12" height="16" fill="#F7E7B4" stroke="${INK}" stroke-width="1.5"/>`; });
      g += `<path d="M120 132 H196" stroke="${INK}" stroke-width="2"/>`;
      // 하늘을 나는 격문
      [[40, 30, -15], [86, 52, 20], [128, 22, 8], [170, 44, -25], [214, 26, 12], [150, 70, -8], [62, 76, 30]].forEach(([x, y, r]) => {
        g += `<rect x="${x}" y="${y}" width="13" height="9" fill="#FFFFFF" stroke="${INK}" stroke-width="1.2" transform="rotate(${r} ${x + 6} ${y + 4})"/>`;
      });
      const crowd = [[62, INK, 'cap'], [86, '#FAF7EE'], [110, INK, 'cap'], [134, INK, 'cap'], [158, '#FAF7EE'], [182, INK, 'cap'], [206, INK, 'cap'], [230, '#FAF7EE']];
      crowd.forEach(([x, body, hat], i) => { g += person(x, 178 - (i % 2) * 3, { body, hat, arms: 'up' }); });
      return g;
    },
    // ③ 신간회 창립 (1927)
    function () {
      let g = sky('#CDE7F0') + ground('#CBB79A');
      g += `<rect x="58" y="44" width="184" height="106" fill="#B4553E" stroke="${INK}" stroke-width="2"/><rect x="52" y="36" width="196" height="11" fill="#8E3F2E" stroke="${INK}" stroke-width="2"/>`;
      for (let r = 0; r < 4; r++) for (let x = 64; x < 240; x += 16) g += `<path d="M${x} ${60 + r * 22} h10" stroke="#9B4532" stroke-width="1.2"/>`;
      g += `<rect x="84" y="54" width="132" height="24" rx="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`;
      g += label(150, 72, '신간회 창립 대회', 14, INK);
      [72, 102, 178, 208].forEach(x => { g += `<path d="M${x} 112 V94 Q${x + 10} 82 ${x + 20} 94 V112 Z" fill="#F6DE9A" stroke="${INK}" stroke-width="2"/>`; });
      g += `<path d="M134 150 V122 Q150 106 166 122 V150 Z" fill="#5A3426" stroke="${INK}" stroke-width="2"/>`;
      g += person(40, 172, { s: 0.75 }) + person(262, 172, { s: 0.75, body: '#3B4A6B' });
      g += person(134, 180, { body: '#FAF7EE', hat: 'gat', arms: 'reach-r' });
      g += person(166, 180, { body: '#3B4A6B', hat: 'fedora', arms: 'reach-l' });
      g += `<circle cx="150" cy="160" r="3.5" fill="${SKIN}" stroke="${INK}" stroke-width="1.5"/>`;
      return g;
    },
    // ④ 광주 학생 항일 운동 (1929)
    function () {
      let g = sky('#D6E9F5') + hills('#A9C3D9', 132) + ground('#C9B99A');
      g += `<rect x="8" y="88" width="84" height="44" fill="#EADBC0" stroke="${INK}" stroke-width="2"/><path d="M0 90 L50 66 L100 90 Z" fill="#6B4E3D" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<rect x="22" y="98" width="56" height="16" rx="2" fill="#FFFFFF" stroke="${INK}" stroke-width="1.5"/>` + label(50, 110, '통학 열차', 10, INK);
      g += `<path d="M-200 141 H500 M-200 147 H500" stroke="#5E5A6E" stroke-width="2"/>`;
      // 증기 기관차
      g += `<circle cx="262" cy="64" r="9" fill="#FFFFFF" stroke="${INK}" stroke-width="1.5"/><circle cx="248" cy="50" r="11" fill="#EDEDF3" stroke="${INK}" stroke-width="1.5"/><circle cx="228" cy="40" r="9" fill="#FFFFFF" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<rect x="256" y="76" width="12" height="20" fill="${INK}"/>`;
      g += `<rect x="170" y="94" width="112" height="38" rx="10" fill="#2B2A3F" stroke="${INK}" stroke-width="2"/><rect x="172" y="76" width="34" height="56" rx="3" fill="#E2412E" stroke="${INK}" stroke-width="2"/><rect x="179" y="84" width="20" height="14" fill="#CFEAFB" stroke="${INK}" stroke-width="1.5"/>`;
      [194, 226, 258].forEach(x => { g += `<circle cx="${x}" cy="138" r="8" fill="#E2412E" stroke="${INK}" stroke-width="2"/>`; });
      // 행진하는 학생들과 펼침막
      g += `<rect x="84" y="128" width="78" height="17" fill="#FFFFFF" stroke="${INK}" stroke-width="1.5"/>` + label(123, 141, '민족 차별 반대', 10, '#E2412E');
      g += person(78, 186, { body: INK, hat: 'cap', arms: 'up' }) + person(168, 186, { body: INK, hat: 'cap', arms: 'up' });
      g += person(104, 190, { body: '#FAF7EE', arms: 'down', legs: INK }) + person(128, 190, { body: INK, hat: 'cap', arms: 'one' }) + person(150, 190, { body: '#FAF7EE' });
      return g;
    },
    // ⑤ 조선어 학회와 우리말 큰사전 원고
    function () {
      let g = sky('#E4E0F5') + ground('#D8CDB8');
      g += hanok(14, 140, 150, 46, '#F3E7CF', '#4B5068');
      g += `<rect x="54" y="98" width="70" height="17" rx="2" fill="${INK}"/>` + label(89, 111, '조선어 학회', 11, '#FFF6D2');
      // 펼친 큰사전
      g += label(226, 92, '우리말 큰사전', 13, INK);
      g += `<path d="M226 104 L172 98 L172 150 L226 156 Z" fill="#FFF8E7" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M226 104 L280 98 L280 150 L226 156 Z" fill="#FFF8E7" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += label(199, 132, '한', 20, '#2350B8') + label(253, 132, '글', 20, '#E2412E');
      g += `<path d="M180 140 L218 144 M234 144 L272 140" stroke="#C9BFA6" stroke-width="2"/>`;
      // 묶어 둔 원고 더미
      [[24, 0], [54, 6], [36, -12]].forEach(([x, dy]) => {
        g += `<rect x="${x}" y="${164 + dy}" width="34" height="18" fill="#FFFDF4" stroke="${INK}" stroke-width="2"/><path d="M${x + 17} ${164 + dy} V${182 + dy} M${x} ${173 + dy} H${x + 34}" stroke="#B5523B" stroke-width="2"/>`;
      });
      [['ㄱ', 120, 40, 24, '#2350B8'], ['ㄴ', 160, 26, 20, '#E2412E'], ['ㅏ', 196, 48, 22, '#2E9E5B'], ['ㄷ', 240, 30, 24, '#F28C28'], ['ㅎ', 266, 60, 20, '#8A55D6'], ['ㅑ', 40, 34, 20, '#2E9E5B']].forEach(([t, x, y, s, c]) => { g += label(x, y, t, s, c); });
      g += person(140, 186, { body: '#3B4A6B', hat: 'fedora', arms: 'one' });
      return g;
    }
  ];

  function awning(x, y, w, color) {
    let g = '';
    const n = 6, sw = w / n;
    for (let i = 0; i < n; i++) {
      g += `<path d="M${x + i * sw} ${y} h${sw} v12 q${-sw / 2} 8 ${-sw} 0 Z" fill="${i % 2 ? '#FFFFFF' : color}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
    }
    return g;
  }

  // 아직 그리지 않은 장면: 시대 색과 장면 이름으로 대신 보여 줍니다
  const ERA_TONES = {
    e1: ['#F3DDB3', '#C8A26B', '#E3C795'], e2: ['#D7E8F3', '#9EB7A4', '#D9C7A1'],
    e3: ['#DDEFE6', '#8FB8A8', '#C9D8C6'], e4: ['#E5ECF8', '#9AA9C9', '#D6CDB8'],
    e5: ['#F7E8CF', '#B9A27E', '#E3D2AE'], e6: ['#E9E4F2', '#A79CC0', '#D3CAB9'],
    e7a: ['#F5E2D3', '#B99B87', '#D8C3AE'], e7b: ['#E4E0F5', '#A6A0C7', '#D8CDB8'],
    e8: ['#DCEFFA', '#8CB9D6', '#CFD6DE'], e9: ['#E2F0FF', '#94B4E6', '#D2DAE6']
  };
  function wrap(text, n) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(w => {
      if ((line + ' ' + w).trim().length > n && line) { lines.push(line); line = w; }
      else line = (line + ' ' + w).trim();
    });
    if (line) lines.push(line);
    return lines.slice(0, 3);
  }
  function placeholder(eraId, k, name) {
    const [skyC, hillC, groundC] = ERA_TONES[eraId] || ERA_TONES.e7b;
    let g = sky(skyC) + hills(hillC) + ground(groundC);
    const lines = wrap(name, 9);
    const y0 = 86 - (lines.length - 1) * 12;
    lines.forEach((l, i) => { g += label(150, y0 + i * 24, l, 21, INK); });
    g += label(150, 182, '그림 준비 중', 11, '#5D5C78');
    return g;
  }

  // ---------- 태극기·깃발 도구 ----------
  function taeguk(cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2350B8"/>` +
      `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} A${r / 2} ${r / 2} 0 0 1 ${cx} ${cy} A${r / 2} ${r / 2} 0 0 0 ${cx - r} ${cy} Z" fill="#E2412E"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
  }
  // 태극기 한 폭 (px: 깃대 왼쪽 x, topY: 천 위쪽, baseY: 깃대 아래 끝)
  function flag(px, topY, baseY, w, h) {
    w = w || 46; h = h || 30;
    const fx = px + 3, fy = topY;
    let s = `<rect x="${px}" y="${topY}" width="3" height="${baseY - topY}" fill="#8A6B4A" stroke="${INK}" stroke-width="1"/>`;
    s += `<rect x="${fx}" y="${fy}" width="${w}" height="${h}" fill="#FFFDF4" stroke="${INK}" stroke-width="2"/>`;
    s += taeguk(fx + w / 2, fy + h / 2, Math.min(h, w) * 0.24);
    const bl = Math.max(5, w * 0.14);
    const bar = (bx, by) => `<path d="M${bx} ${by} h${bl} M${bx} ${by + 2.5} h${bl} M${bx} ${by + 5} h${bl}" stroke="${INK}" stroke-width="1"/>`;
    s += bar(fx + w * 0.11, fy + h * 0.18) + bar(fx + w * 0.75, fy + h * 0.18) + bar(fx + w * 0.11, fy + h * 0.66) + bar(fx + w * 0.75, fy + h * 0.66);
    return s;
  }

  // ---------- 8 대한민국의 발전 ----------
  const art8 = [
    // ① 1945 광복의 기쁨
    function () {
      let g = sky('#BFE3F2') + `<circle cx="252" cy="32" r="16" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += hills('#9CCB9A') + ground('#E8CC94');
      g += flag(70, 60, 150) + flag(190, 60, 150);
      g += `<rect x="92" y="98" width="116" height="22" rx="4" fill="#E2412E" stroke="${INK}" stroke-width="2"/>` + label(150, 114, '대한 독립 만세', 14, '#FFF6D2');
      const crowd = [[40, '#FAF7EE'], [62, INK], [108, '#3B4A6B'], [130, '#FAF7EE'], [172, INK], [214, '#FAF7EE'], [238, '#3B4A6B'], [260, INK]];
      crowd.forEach(([x, body], i) => { g += person(x, 180 - (i % 2) * 3, { body, arms: 'up' }); });
      return g;
    },
    // ② 1948 정부 수립
    function () {
      let g = sky('#DCEFFA') + ground('#CFD6DE');
      g += `<rect x="70" y="60" width="160" height="78" fill="#E8E2D4" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="58" y="138" width="184" height="12" fill="#C9C2B0" stroke="${INK}" stroke-width="2"/>`;
      [84, 110, 136, 162, 188, 214].forEach(x => { g += `<rect x="${x}" y="84" width="10" height="54" fill="#F3EFE3" stroke="${INK}" stroke-width="1.5"/>`; });
      g += `<path d="M62 60 L150 34 L238 60 Z" fill="#B9B2A0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += flag(149, 10, 34, 28, 18);
      g += `<rect x="84" y="64" width="132" height="18" rx="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` + label(150, 78, '대한민국 정부 수립', 12, INK);
      g += person(42, 176, { s: 0.8 }) + person(258, 176, { s: 0.8, body: '#3B4A6B', hat: 'fedora' });
      return g;
    },
    // ③ 4·19 혁명 (시민·학생이 이룬 밝은 장면)
    function () {
      let g = sky('#E2F0FF') + hills('#A9C3D9', 132) + ground('#C9B99A');
      g += `<rect x="16" y="84" width="78" height="48" fill="#EADBC0" stroke="${INK}" stroke-width="2"/>`;
      [22, 38, 54, 70].forEach(x => { g += `<rect x="${x}" y="92" width="8" height="40" fill="#F3EFE3" stroke="${INK}" stroke-width="1.5"/>`; });
      g += `<path d="M10 84 L55 62 L100 84 Z" fill="#B9B2A0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += flag(110, 74, 150, 34, 22) + flag(214, 74, 150, 34, 22);
      g += `<rect x="104" y="100" width="118" height="22" rx="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` + label(163, 117, '민주주의', 16, '#2350B8');
      const crowd = [[118, INK, 'cap'], [140, '#FAF7EE'], [162, INK, 'cap'], [184, '#3B4A6B'], [206, '#FAF7EE'], [230, INK, 'cap'], [252, '#FAF7EE']];
      crowd.forEach(([x, body, hat], i) => { g += person(x, 184 - (i % 2) * 3, { body, hat, arms: 'up' }); });
      g += person(44, 180, { body: '#FAF7EE', arms: 'up' });
      return g;
    },
    // ④ 경제 개발 5개년 계획과 경부 고속 도로
    function () {
      let g = sky('#DCEFFA') + `<circle cx="252" cy="30" r="13" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += hills('#8CB9D6', 118) + hills('#7FB08A', 150) + ground('#7FB08A');
      g += `<path d="M86 150 L138 96 L182 96 L244 150 Z" fill="#6E6A78" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<line x1="161" y1="100" x2="158" y2="150" stroke="#FFF6D2" stroke-width="3" stroke-dasharray="6 7"/>`;
      g += `<rect x="30" y="72" width="88" height="34" rx="5" fill="#2E7D4F" stroke="${INK}" stroke-width="2"/>` + label(74, 94, '경부 고속 도로', 11, '#FFFFFF');
      g += `<rect x="72" y="106" width="4" height="44" fill="${INK}"/>`;
      g += `<rect x="148" y="116" width="20" height="10" rx="3" fill="#E2412E" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<rect x="170" y="132" width="28" height="13" rx="3" fill="#2350B8" stroke="${INK}" stroke-width="2"/><rect x="176" y="126" width="16" height="7" rx="2" fill="#CFEAFB" stroke="${INK}" stroke-width="1.5"/>`;
      return g;
    },
    // ⑤ 수출 100억 달러 달성과 조선소
    function () {
      let g = sky('#CDE7F0') + `<circle cx="46" cy="34" r="14" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="-200" y="130" width="700" height="100" fill="#8FC3DE"/><path d="M-200 130 H500" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M-200 142 q18 -6 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0" fill="none" stroke="#6FB0CE" stroke-width="2"/>`;
      // 갠트리 크레인
      g += `<rect x="60" y="56" width="180" height="8" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="64" y="64" width="8" height="74" fill="#F5C242" stroke="${INK}" stroke-width="2"/><rect x="228" y="64" width="8" height="74" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M72 70 L120 120 M228 70 L180 120" stroke="#F5C242" stroke-width="3"/>`;
      g += `<rect x="146" y="64" width="2" height="26" fill="${INK}"/><rect x="141" y="90" width="12" height="7" fill="#2B2A3F"/>`;
      // 건조 중인 배
      g += `<path d="M78 138 L222 138 L206 168 L94 168 Z" fill="#E2412E" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<rect x="100" y="116" width="100" height="22" fill="#D9DEE6" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="150" y="100" width="30" height="18" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/><rect x="186" y="94" width="6" height="24" fill="${INK}"/>`;
      g += `<rect x="88" y="34" width="124" height="20" rx="4" fill="#E2412E" stroke="${INK}" stroke-width="2"/>` + label(150, 49, '수출 100억 달러', 13, '#FFF6D2');
      return g;
    }
  ];

  // ---------- 9 오늘날의 대한민국 ----------
  const art9 = [
    // ① 1987 6월 민주 항쟁 (시민이 이룬 밝은 장면)
    function () {
      let g = sky('#E2F0FF') + ground('#C9B99A');
      [[6, 70], [40, 54], [78, 84], [206, 60], [242, 44], [276, 76]].forEach(([x, top]) => {
        g += `<rect x="${x}" y="${top}" width="28" height="${150 - top}" fill="#B9C3D2" stroke="${INK}" stroke-width="2"/>`;
        for (let wy = top + 8; wy < 146; wy += 16) for (let wx = x + 5; wx < x + 24; wx += 10) g += `<rect x="${wx}" y="${wy}" width="6" height="8" fill="#F7E7B4" stroke="${INK}" stroke-width="1"/>`;
      });
      g += flag(104, 70, 150, 34, 22) + flag(214, 70, 150, 34, 22);
      g += `<rect x="100" y="98" width="126" height="22" rx="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` + label(163, 115, '민주 헌법', 16, '#2350B8');
      const crowd = [[112, '#E2412E'], [134, '#FAF7EE'], [156, '#2350B8'], [178, '#FAF7EE'], [200, '#E2412E'], [222, '#3B4A6B'], [244, '#FAF7EE']];
      crowd.forEach(([x, body], i) => { g += person(x, 184 - (i % 2) * 3, { body, arms: 'up' }); });
      g += person(44, 180, { body: '#FAF7EE', arms: 'up' });
      return g;
    },
    // ② 1988 서울 올림픽
    function () {
      let g = sky('#DCEFFA') + `<circle cx="256" cy="30" r="13" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += hills('#9CCB9A') + ground('#CFD6DE');
      const rings = [[122, 80, '#2350B8'], [150, 80, '#22213A'], [178, 80, '#E2412E'], [136, 94, '#F5C242'], [164, 94, '#2E9E5B']];
      rings.forEach(([cx, cy, c]) => { g += `<circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${c}" stroke-width="5"/>`; });
      // 성화
      g += `<rect x="54" y="96" width="10" height="44" rx="3" fill="#C9B38A" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M48 96 Q44 86 59 88 Q74 86 70 96 Z" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M53 92 Q50 76 59 70 Q68 78 65 92 Z" fill="#F28C28" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<path d="M57 88 Q55 80 59 76 Q63 81 61 88 Z" fill="#E2412E"/>`;
      g += `<rect x="92" y="116" width="116" height="22" rx="4" fill="#2350B8" stroke="${INK}" stroke-width="2"/>` + label(150, 132, '서울 1988', 14, '#FFF6D2');
      g += person(226, 176, { body: '#E2412E', arms: 'up' }) + person(250, 176, { body: '#F5C242', arms: 'up' });
      return g;
    },
    // ③ 외환 위기 금 모으기 운동
    function () {
      let g = sky('#F7E8CF') + ground('#E3D2AE');
      g += `<rect x="86" y="118" width="128" height="10" fill="#A9744F" stroke="${INK}" stroke-width="2"/><rect x="92" y="128" width="4" height="22" fill="${INK}"/><rect x="204" y="128" width="4" height="22" fill="${INK}"/>`;
      g += `<rect x="118" y="90" width="64" height="28" rx="3" fill="#C79A5B" stroke="${INK}" stroke-width="2"/><path d="M134 90 h32 v4 h-32 Z" fill="${INK}"/>` + label(150, 110, '금 모으기', 11, '#4A3417');
      // 금반지·금붙이
      [[100, 112], [112, 110], [196, 112], [206, 108]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="5.5" fill="none" stroke="#E8B923" stroke-width="3.5"/>`; });
      g += `<rect x="188" y="130" width="22" height="9" rx="2" fill="#F5C242" stroke="${INK}" stroke-width="1.5"/><rect x="94" y="130" width="20" height="9" rx="2" fill="#F5C242" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<rect x="96" y="40" width="108" height="20" rx="4" fill="#E2412E" stroke="${INK}" stroke-width="2"/>` + label(150, 55, '함께 이겨내요', 12, '#FFF6D2');
      g += person(60, 182, { body: '#3B4A6B', arms: 'reach-r' }) + person(238, 182, { body: '#FAF7EE', arms: 'reach-l' });
      return g;
    },
    // ④ 2002 월드컵 거리 응원
    function () {
      let g = sky('#E2F0FF') + ground('#C9B99A');
      g += `<rect x="92" y="34" width="116" height="24" rx="5" fill="#E2412E" stroke="${INK}" stroke-width="2"/>` + label(150, 52, '대~한민국', 15, '#FFFFFF');
      // 축구공
      g += `<circle cx="150" cy="86" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M150 74 l9 7 -4 11 h-10 l-4 -11 Z" fill="${INK}"/>`;
      [[150, 70], [137, 82], [163, 82], [142, 98], [158, 98]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="1.6" fill="${INK}"/>`; });
      g += flag(60, 92, 150, 30, 20) + flag(220, 92, 150, 30, 20);
      const crowd = [[96, '#E2412E'], [118, '#E2412E'], [140, '#E2412E'], [162, '#E2412E'], [184, '#E2412E'], [206, '#E2412E']];
      crowd.forEach(([x, body], i) => { g += person(x, 184 - (i % 2) * 3, { body, arms: 'up' }); });
      return g;
    },
    // ⑤ 오늘날의 서울과 한류
    function () {
      let g = sky('#E2F0FF') + `<circle cx="252" cy="30" r="13" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += ground('#CFD6DE');
      // 빌딩 숲
      [[30, 84, '#8CB9D6'], [58, 66, '#A7C7DE'], [84, 96, '#9FB7CC'], [198, 72, '#A7C7DE'], [224, 90, '#8CB9D6'], [250, 60, '#B7D2E6']].forEach(([x, top, c]) => {
        g += `<rect x="${x}" y="${top}" width="24" height="${150 - top}" fill="${c}" stroke="${INK}" stroke-width="2"/>`;
        for (let wy = top + 8; wy < 146; wy += 14) for (let wx = x + 5; wx < x + 20; wx += 9) g += `<rect x="${wx}" y="${wy}" width="5" height="7" fill="#DCEFFA" stroke="${INK}" stroke-width="0.8"/>`;
      });
      // 전망 타워
      g += `<rect x="146" y="70" width="8" height="80" fill="#C2C8D2" stroke="${INK}" stroke-width="2"/><ellipse cx="150" cy="70" rx="15" ry="9" fill="#9FB7CC" stroke="${INK}" stroke-width="2"/><rect x="148" y="46" width="4" height="22" fill="${INK}"/><circle cx="150" cy="44" r="3" fill="#E2412E"/>`;
      // 한류 글자와 하트·음표
      g += `<rect x="108" y="96" width="84" height="22" rx="6" fill="#F07AAE" stroke="${INK}" stroke-width="2"/>` + label(150, 112, '한류 K', 14, '#FFFFFF');
      g += `<path d="M96 84 q-5 -7 -10 0 q-5 -7 -10 0 q0 7 10 13 q10 -6 10 -13 Z" fill="#E2412E" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<path d="M210 70 v16 M210 70 q8 -3 8 3 q0 5 -8 2" fill="none" stroke="#8A55D6" stroke-width="2.5"/><circle cx="207" cy="88" r="3" fill="#8A55D6"/>`;
      return g;
    }
  ];

  // ---------- 7-A 3·1 운동과 무장 독립 전쟁 ----------
  const art7a = [
    // ① 3·1 운동 만세 거리 (1919)
    function () {
      let g = sky('#F5E2D3') + ground('#D8C3AE');
      g += hanok(-6, 132, 116, 34, '#F3E7CF', '#4B5068');
      g += `<rect x="196" y="56" width="104" height="76" fill="#C9B193" stroke="${INK}" stroke-width="2"/><rect x="190" y="50" width="116" height="9" fill="#A89070" stroke="${INK}" stroke-width="2"/>`;
      [206, 230, 254, 278].forEach(x => { g += `<rect x="${x}" y="68" width="12" height="16" fill="#F7E7B4" stroke="${INK}" stroke-width="1.5"/><rect x="${x}" y="96" width="12" height="16" fill="#F7E7B4" stroke="${INK}" stroke-width="1.5"/>`; });
      g += `<path d="M110 132 H196" stroke="${INK}" stroke-width="2"/>`;
      g += flag(74, 60, 150, 30, 20) + flag(206, 60, 150, 30, 20);
      g += `<rect x="92" y="94" width="116" height="22" rx="4" fill="#E2412E" stroke="${INK}" stroke-width="2"/>` + label(150, 110, '대한 독립 만세', 14, '#FFF6D2');
      const crowd = [[62, '#FAF7EE', 'gat'], [86, '#FAF7EE'], [110, '#FAF7EE', 'gat'], [134, '#FAF7EE'], [158, '#FAF7EE', 'gat'], [182, '#FAF7EE'], [206, '#FAF7EE', 'gat'], [230, '#FAF7EE']];
      crowd.forEach(([x, body, hat], i) => { g += person(x, 180 - (i % 2) * 3, { body, hat, arms: 'up' }); });
      return g;
    },
    // ② 상하이 대한민국 임시 정부 (1919)
    function () {
      let g = sky('#D6E9F5') + ground('#CBB79A');
      g += `<rect x="64" y="46" width="172" height="104" fill="#C06A4A" stroke="${INK}" stroke-width="2"/><rect x="58" y="38" width="184" height="11" fill="#9B4E37" stroke="${INK}" stroke-width="2"/>`;
      for (let r = 0; r < 4; r++) for (let x = 70; x < 232; x += 14) g += `<path d="M${x} ${58 + r * 20} h8" stroke="#A85A40" stroke-width="1"/>`;
      [78, 110, 142, 174, 206].forEach(x => { g += `<rect x="${x}" y="62" width="16" height="22" fill="#CFE3EF" stroke="${INK}" stroke-width="1.5"/><rect x="${x}" y="96" width="16" height="22" fill="#CFE3EF" stroke="${INK}" stroke-width="1.5"/>`; });
      g += `<rect x="136" y="122" width="28" height="28" fill="#5A3426" stroke="${INK}" stroke-width="2"/>`;
      // 걸린 태극기
      g += flag(104, 48, 108, 34, 22);
      g += `<rect x="80" y="130" width="140" height="18" rx="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` + label(150, 144, '대한민국 임시 정부', 12, INK);
      g += person(40, 174, { s: 0.78 }) + person(262, 174, { s: 0.78, body: '#3B4A6B' });
      return g;
    },
    // ③ 봉오동 골짜기 (독립군의 승리, 밝은 장면)
    function () {
      let g = sky('#CDE7F0') + `<circle cx="150" cy="38" r="14" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M-200 150 L60 70 L120 118 L200 60 L260 110 L500 150 Z" fill="#7FB08A" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<path d="M-200 150 L40 104 L110 140 L190 98 L260 138 L500 150 Z" fill="#9CCB9A"/>`;
      g += ground('#8FB08A');
      // 깃발 꽂은 능선 + 환호하는 독립군
      g += flag(196, 36, 70, 30, 20);
      g += person(150, 150, { s: 0.9, body: '#6E7A52', hat: 'cap', arms: 'up' });
      const line = [[100, '#6E7A52'], [124, '#FAF7EE'], [176, '#6E7A52'], [200, '#FAF7EE'], [224, '#6E7A52']];
      line.forEach(([x, body], i) => { g += person(x, 184 - (i % 2) * 3, { body, hat: 'cap', arms: 'up' }); });
      return g;
    },
    // ④ 청산리 숲 (독립군의 승리, 밝은 장면)
    function () {
      let g = sky('#DDEFE6') + hills('#8FB8A8', 132) + ground('#8FB08A');
      const tree = (x, h) => `<rect x="${x - 4}" y="${150 - h}" width="8" height="${h}" fill="#7A5B43" stroke="${INK}" stroke-width="2"/>` +
        `<circle cx="${x}" cy="${150 - h - 14}" r="22" fill="#4E9E6A" stroke="${INK}" stroke-width="2"/><circle cx="${x - 14}" cy="${150 - h - 2}" r="15" fill="#5FAE78" stroke="${INK}" stroke-width="2"/><circle cx="${x + 14}" cy="${150 - h - 2}" r="15" fill="#5FAE78" stroke="${INK}" stroke-width="2"/>`;
      g += tree(44, 56) + tree(262, 56) + tree(150, 64);
      g += flag(120, 70, 150, 30, 20);
      const line = [[88, '#6E7A52'], [112, '#FAF7EE'], [176, '#6E7A52'], [200, '#FAF7EE'], [224, '#6E7A52']];
      line.forEach(([x, body], i) => { g += person(x, 184 - (i % 2) * 3, { body, hat: 'cap', arms: 'up' }); });
      return g;
    },
    // ⑤ 한국광복군 (1940)
    function () {
      let g = sky('#E4E6F0') + hills('#A7A0C0') + ground('#CFD6DE');
      g += flag(146, 36, 150, 44, 28);
      g += `<rect x="92" y="98" width="116" height="22" rx="4" fill="#2B2A3F" stroke="${INK}" stroke-width="2"/>` + label(150, 114, '한국광복군', 14, '#FFF6D2');
      const line = [[44, 0], [74, 0], [104, 0], [196, 0], [226, 0], [256, 0]];
      line.forEach(([x], i) => { g += person(x, 184 - (i % 2) * 3, { body: '#6E7A52', hat: 'cap' }); });
      return g;
    }
  ];

  // ---------- 6 개항기와 대한제국 ----------
  const art6 = [
    // ① 제물포 개항장
    function () {
      let g = sky('#D7E8F3') + `<circle cx="252" cy="30" r="13" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="-200" y="128" width="700" height="100" fill="#8FC3DE"/><path d="M-200 128 H500" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="10" y="78" width="70" height="52" fill="#D9C9A8" stroke="${INK}" stroke-width="2"/><path d="M4 78 L45 58 L86 78 Z" fill="#7A5B43" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      [18, 40, 62].forEach(x => { g += `<rect x="${x}" y="92" width="12" height="16" fill="#CFE3EF" stroke="${INK}" stroke-width="1.5"/>`; });
      // 증기선
      g += `<path d="M150 114 L256 114 L244 138 L162 138 Z" fill="#3A4252" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<rect x="176" y="96" width="60" height="18" fill="#D9DEE6" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="188" y="78" width="9" height="18" fill="#E2412E" stroke="${INK}" stroke-width="2"/><rect x="214" y="78" width="9" height="18" fill="#E2412E" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="233" y="62" width="2" height="34" fill="${INK}"/>`;
      [[196, 72], [205, 66], [218, 70]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="6" fill="#E9E7F2" stroke="${INK}" stroke-width="1"/>`; });
      g += `<rect x="96" y="122" width="40" height="14" fill="#A9744F" stroke="${INK}" stroke-width="2"/>`;
      return g;
    },
    // ② 동학 농민군 황토현 (밝은 장면)
    function () {
      let g = sky('#F3DDB3') + hills('#C89B6B', 130) + ground('#C8884F');
      g += `<rect x="92" y="40" width="116" height="20" rx="4" fill="#2E9E5B" stroke="${INK}" stroke-width="2"/>` + label(150, 55, '보국안민', 14, '#FFF6D2');
      g += pennant(70, 70, 150, '#2E9E5B') + pennant(214, 70, 150, '#F5C242');
      // 농민군 깃발 (흰 깃발 '동학')
      g += `<rect x="146" y="70" width="3" height="80" fill="#8A6B4A"/><rect x="149" y="70" width="40" height="26" fill="#FFFDF4" stroke="${INK}" stroke-width="2"/>` + label(169, 88, '동학', 13, '#2350B8');
      const crowd = [[100, '#FAF7EE'], [122, '#EADBC0'], [176, '#FAF7EE'], [200, '#EADBC0'], [224, '#FAF7EE']];
      crowd.forEach(([x, body], i) => { g += person(x, 184 - (i % 2) * 3, { body, arms: 'up' }); });
      return g;
    },
    // ③ 독립문과 만민 공동회
    function () {
      let g = sky('#DDEFE6') + hills('#8FB8A8', 130) + ground('#C9D8C6');
      g += `<rect x="104" y="52" width="92" height="86" fill="#EDE7D8" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M126 138 V92 Q150 68 174 92 V138 Z" fill="#DDEFE6" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="98" y="44" width="104" height="12" fill="#CFC7B4" stroke="${INK}" stroke-width="2"/>` + label(150, 64, '독립문', 12, INK);
      const crowd = [[60, '#FAF7EE'], [82, '#3B4A6B'], [210, '#FAF7EE'], [232, '#3B4A6B'], [254, '#FAF7EE']];
      crowd.forEach(([x, body], i) => { g += person(x, 184 - (i % 2) * 3, { body, hat: 'gat', arms: 'up' }); });
      return g;
    },
    // ④ 환구단과 덕수궁 석조전
    function () {
      let g = sky('#D7E8F3') + ground('#D9C7A1');
      // 황궁우 (3층 탑)
      g += `<rect x="40" y="96" width="52" height="42" fill="#E3D6B8" stroke="${INK}" stroke-width="2"/>`;
      [[30, 96, 72], [38, 74, 56], [46, 54, 40]].forEach(([x, y, w]) => { g += `<path d="M${x} ${y} q${w / 2} 14 ${w} 0 l-8 -12 q${-(w / 2 - 8)} 8 ${-(w - 16)} 0 Z" fill="#3E6E8E" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`; });
      g += `<path d="M62 42 L70 42 L66 32 Z" fill="#F5C242" stroke="${INK}" stroke-width="1.5"/>`;
      // 석조전 (서양식 건물)
      g += `<rect x="150" y="76" width="128" height="62" fill="#EDEAE0" stroke="${INK}" stroke-width="2"/><rect x="144" y="68" width="140" height="10" fill="#CFC7B4" stroke="${INK}" stroke-width="2"/>`;
      [160, 182, 204, 226, 248].forEach(x => { g += `<rect x="${x}" y="82" width="10" height="56" fill="#F6F3EB" stroke="${INK}" stroke-width="1.5"/>`; });
      g += `<path d="M150 76 L214 56 L278 76 Z" fill="#C9C2B0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      return g;
    },
    // ⑤ 한성 전차와 전등
    function () {
      let g = sky('#E9E4F2') + ground('#D3CAB9');
      g += hanok(-6, 134, 96, 30, '#F3E7CF', '#4B5068');
      // 전선·전등 기둥
      g += `<rect x="40" y="52" width="4" height="98" fill="#6E6652"/><path d="M42 58 H256" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<path d="M30 60 h24 l-6 -8 h-12 Z" fill="#F5C242" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<path d="M26 50 L58 50 M34 44 L50 44" stroke="#F5C242" stroke-width="2" stroke-linecap="round"/>`;
      // 전차
      g += `<path d="M150 70 V58" stroke="${INK}" stroke-width="1.5"/><circle cx="150" cy="56" r="2.5" fill="${INK}"/>`;
      g += `<rect x="120" y="70" width="128" height="56" rx="6" fill="#2E7D4F" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="126" y="78" width="12" height="4" rx="2" fill="#F5C242"/>`;
      [132, 160, 188, 216].forEach(x => { g += `<rect x="${x}" y="86" width="22" height="22" fill="#CFEAFB" stroke="${INK}" stroke-width="1.5"/>`; });
      g += `<rect x="120" y="126" width="128" height="8" fill="#5A5468"/>`;
      g += `<circle cx="146" cy="138" r="8" fill="${INK}"/><circle cx="222" cy="138" r="8" fill="${INK}"/>`;
      g += `<path d="M-200 148 H500" stroke="#7A7362" stroke-width="2"/>`;
      return g;
    }
  ];

  // ---------- 5 조선 후기 ----------
  const art5 = [
    // ① 장시와 보부상
    function () {
      let g = sky('#F7E8CF') + `<circle cx="258" cy="32" r="14" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += hills('#B9A27E', 134) + ground('#E3D2AE');
      g += awning(20, 82, 104, '#2E9E5B');
      g += `<rect x="22" y="98" width="4" height="52" fill="${INK}"/><rect x="118" y="98" width="4" height="52" fill="${INK}"/><rect x="20" y="124" width="104" height="10" rx="2" fill="#A9744F" stroke="${INK}" stroke-width="2"/>`;
      [[40, '#E2412E'], [66, '#F5C242'], [92, '#2E9E5B']].forEach(([x, c]) => { g += `<ellipse cx="${x}" cy="116" rx="11" ry="8" fill="${c}" stroke="${INK}" stroke-width="2"/>`; });
      // 보부상 (지게 짐꾼)
      g += `<path d="M186 150 L182 112 M202 150 L206 112 M184 120 H204 M184 132 H204" stroke="#8A6B4A" stroke-width="3" stroke-linecap="round"/>`;
      g += `<rect x="182" y="96" width="26" height="20" rx="3" fill="#C79A5B" stroke="${INK}" stroke-width="2"/>`;
      g += person(174, 150, { body: '#EADBC0', hat: 'gat' });
      g += person(60, 176, { body: '#FAF7EE', hat: 'gat' }) + person(240, 174, { s: 0.8, body: '#3B4A6B' });
      return g;
    },
    // ② 서당과 씨름판 (김홍도 풍속화)
    function () {
      let g = sky('#F7E8CF') + ground('#E3D2AE');
      g += hanok(6, 138, 120, 42, '#F3E7CF', '#7A5B43');
      g += `<rect x="40" y="108" width="54" height="16" rx="2" fill="${INK}"/>` + label(67, 121, '서당', 11, '#FFF6D2');
      // 씨름판 두 사람
      g += `<ellipse cx="206" cy="150" rx="56" ry="10" fill="#D8C49A" stroke="${INK}" stroke-width="2"/>`;
      g += person(196, 148, { body: '#FAF7EE', arms: 'reach-r' });
      g += person(218, 148, { body: '#EADBC0', arms: 'reach-l' });
      // 둘러앉은 구경꾼
      [[150, 0.6], [252, 0.6], [172, 0.55], [240, 0.55]].forEach(([x, s]) => { g += person(x, 158, { s, body: '#D9C9A8' }); });
      return g;
    },
    // ③ 수원 화성과 거중기
    function () {
      let g = sky('#F7E8CF') + hills('#B9A27E', 132) + ground('#D8C49A');
      // 성곽과 문루
      g += `<rect x="-6" y="110" width="312" height="40" fill="#D6C2A0" stroke="${INK}" stroke-width="2"/>`;
      for (let x = 2; x < 300; x += 20) g += `<rect x="${x}" y="104" width="12" height="8" fill="#D6C2A0" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<rect x="36" y="78" width="60" height="34" fill="#C9A878" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M26 78 Q66 66 106 78 L96 64 Q66 58 36 64 Z" fill="#8E6A45" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      // 거중기 (도르래 장치)
      g += `<rect x="196" y="56" width="8" height="54" fill="#8A6B4A" stroke="${INK}" stroke-width="2"/><rect x="236" y="56" width="8" height="54" fill="#8A6B4A" stroke="${INK}" stroke-width="2"/><rect x="190" y="50" width="60" height="8" fill="#8A6B4A" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M196 58 L240 90 M244 58 L200 90" stroke="#8A6B4A" stroke-width="2"/>`;
      g += `<circle cx="220" cy="60" r="5" fill="#CFC7B4" stroke="${INK}" stroke-width="1.5"/><rect x="214" y="64" width="2" height="30" fill="${INK}"/><rect x="224" y="64" width="2" height="30" fill="${INK}"/>`;
      g += `<rect x="210" y="94" width="20" height="14" fill="#B8A884" stroke="${INK}" stroke-width="2"/>`;
      g += person(150, 150, { s: 0.8, body: '#EADBC0', hat: 'gat' });
      return g;
    },
    // ④ 대동여지도
    function () {
      let g = sky('#EFE6CE') + ground('#D8CDB8');
      g += `<rect x="78" y="34" width="144" height="116" rx="4" fill="#FBF4DF" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="70" y="34" width="10" height="116" rx="3" fill="#A9744F" stroke="${INK}" stroke-width="2"/><rect x="220" y="34" width="10" height="116" rx="3" fill="#A9744F" stroke="${INK}" stroke-width="2"/>`;
      // 한반도 윤곽
      g += `<path d="M150 44 Q136 54 140 66 Q128 72 134 84 Q122 92 132 104 Q126 116 140 124 Q148 136 150 144 Q154 134 164 126 Q176 118 168 106 Q180 96 170 86 Q178 74 166 68 Q172 56 158 50 Z" fill="#CDE3C8" stroke="#2E7D4F" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<path d="M140 70 Q150 74 160 70 M138 92 Q150 98 162 92 M142 112 Q150 116 158 112" stroke="#8FB08A" stroke-width="1.5" fill="none"/>`;
      g += label(150, 146, '대동여지도', 11, INK);
      g += person(50, 176, { s: 0.8, body: '#EADBC0', hat: 'gat' });
      return g;
    },
    // ⑤ 판소리 마당
    function () {
      let g = sky('#F7E8CF') + hills('#B9A27E', 134) + ground('#E3D2AE');
      g += `<ellipse cx="150" cy="146" rx="120" ry="14" fill="#D8C49A" stroke="${INK}" stroke-width="2"/>`;
      // 소리꾼 (부채)
      g += person(132, 142, { body: '#FAF7EE', hat: 'gat', arms: 'one' });
      g += `<path d="M145 104 L168 92 L170 112 Z" fill="#E2412E" stroke="${INK}" stroke-width="1.5"/>`;
      // 고수 (북)
      g += `<ellipse cx="188" cy="134" rx="16" ry="12" fill="#C79A5B" stroke="${INK}" stroke-width="2"/><ellipse cx="188" cy="134" rx="8" ry="6" fill="#E8D7B0"/>`;
      g += person(206, 140, { s: 0.85, body: '#EADBC0', hat: 'gat', arms: 'reach-l' });
      // 구경꾼
      [[64, '#D9C9A8'], [92, '#C7B89A'], [248, '#D9C9A8']].forEach(([x, body]) => { g += person(x, 150, { s: 0.6, body }); });
      return g;
    }
  ];

  // ---------- 4 조선 전기 ----------
  const art4 = [
    // ① 한양 경복궁과 숭례문
    function () {
      let g = sky('#E5ECF8') + hills('#9AA9C9', 128) + ground('#D6CDB8');
      // 숭례문 (2층 문루)
      g += `<rect x="40" y="96" width="92" height="44" fill="#CBB79A" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M72 140 V110 Q86 98 100 110 V140 Z" fill="#5A3426" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="44" y="72" width="84" height="22" fill="#C9A878" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M30 72 Q86 58 142 72 L130 60 Q86 50 42 60 Z" fill="#8E6A45" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<path d="M34 96 Q86 84 138 96 L128 86 Q86 78 44 86 Z" fill="#8E6A45" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      // 경복궁 근정전 (뒤)
      g += `<rect x="168" y="100" width="118" height="40" fill="#D6C2A0" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M158 100 Q227 84 296 100 L284 86 Q227 76 170 86 Z" fill="#9B4E37" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      [178, 204, 230, 256].forEach(x => { g += `<rect x="${x}" y="110" width="14" height="30" fill="#B8945F" stroke="${INK}" stroke-width="1.5"/>`; });
      return g;
    },
    // ② 집현전과 훈민정음
    function () {
      let g = sky('#E5ECF8') + ground('#D6CDB8');
      g += hanok(10, 140, 150, 46, '#F3E7CF', '#4B5068');
      g += `<rect x="50" y="100" width="70" height="16" rx="2" fill="${INK}"/>` + label(85, 113, '집현전', 11, '#FFF6D2');
      // 훈민정음 글자
      g += `<rect x="178" y="56" width="108" height="92" rx="4" fill="#FBF4DF" stroke="${INK}" stroke-width="2"/>`;
      g += label(232, 76, '훈민정음', 13, INK);
      [['ㄱ', 200, 98, '#2350B8'], ['ㄴ', 232, 98, '#E2412E'], ['ㄷ', 264, 98, '#2E9E5B'], ['ㅏ', 200, 128, '#F28C28'], ['ㅑ', 232, 128, '#8A55D6'], ['ㅓ', 264, 128, '#2350B8']].forEach(([t, x, y, c]) => { g += label(x, y, t, 20, c); });
      g += person(130, 184, { body: '#FAF7EE', hat: 'gat', arms: 'one' });
      return g;
    },
    // ③ 측우기와 앙부일구
    function () {
      let g = sky('#E5ECF8') + hills('#9AA9C9', 132) + ground('#D6CDB8');
      // 측우기 (기둥 위 원통)
      g += `<rect x="78" y="118" width="26" height="30" fill="#CFC7B4" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="74" y="80" width="34" height="40" rx="4" fill="#8A8D9A" stroke="${INK}" stroke-width="2"/><ellipse cx="91" cy="80" rx="17" ry="5" fill="#B7BAC6" stroke="${INK}" stroke-width="2"/>`;
      g += label(91, 70, '측우기', 10, INK);
      // 앙부일구 (반구 해시계)
      g += `<rect x="170" y="120" width="96" height="28" rx="4" fill="#CFC7B4" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M178 118 A40 40 0 0 1 258 118 Z" fill="#3E4A63" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M190 118 A28 28 0 0 1 246 118" fill="none" stroke="#9FB0CC" stroke-width="1.5"/>`;
      g += `<path d="M218 118 L224 102" stroke="#F5C242" stroke-width="2"/><circle cx="224" cy="102" r="2.5" fill="#F5C242"/>`;
      g += label(218, 70, '앙부일구', 10, INK);
      return g;
    },
    // ④ 한산도 대첩 거북선 (밝은 승리)
    function () {
      let g = sky('#D6E9F5') + `<circle cx="252" cy="30" r="13" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="-200" y="124" width="700" height="100" fill="#7FB7D6"/><path d="M-200 124 H500" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M-200 138 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#5FA0C2" stroke-width="2"/>`;
      // 거북선
      g += `<path d="M78 128 L222 128 L206 150 L94 150 Z" fill="#6E4A2E" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<path d="M96 128 Q150 92 204 128 Z" fill="#4E7A3E" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      for (let x = 112; x < 200; x += 16) g += `<path d="M${x} 126 l5 -5 l5 5 Z" fill="#3C5E30" stroke="${INK}" stroke-width="1"/>`;
      g += `<path d="M78 128 Q66 120 60 128 Q66 134 78 132 Z" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<circle cx="66" cy="126" r="2" fill="${INK}"/>`;
      g += `<rect x="146" y="78" width="3" height="22" fill="#8A6B4A"/><rect x="149" y="78" width="30" height="20" fill="#FFFDF4" stroke="${INK}" stroke-width="1.5"/>` + label(164, 92, '수군', 10, '#2350B8');
      return g;
    },
    // ⑤ 행주산성 (밝은 승리)
    function () {
      let g = sky('#E5ECF8') + hills('#9AA9C9', 128) + ground('#8FA66E');
      g += `<path d="M30 150 Q60 96 150 86 Q240 96 270 150 Z" fill="#A6BE82" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      // 성벽
      g += `<path d="M70 118 Q150 100 230 118 L230 132 Q150 114 70 132 Z" fill="#CBB79A" stroke="${INK}" stroke-width="2"/>`;
      for (let x = 80; x < 224; x += 18) g += `<rect x="${x}" y="${104 - Math.round(Math.sin((x - 80) / 40) * 2)}" width="10" height="8" fill="#CBB79A" stroke="${INK}" stroke-width="1.2"/>`;
      g += pennant(118, 62, 116, '#E2412E') + pennant(178, 62, 116, '#2350B8');
      g += person(110, 116, { s: 0.7, body: '#FAF7EE', hat: 'gat', arms: 'up' }) + person(150, 112, { s: 0.7, body: '#EADBC0', hat: 'gat', arms: 'up' }) + person(190, 116, { s: 0.7, body: '#FAF7EE', hat: 'gat', arms: 'up' });
      return g;
    }
  ];

  // 전근대용 일반 군기 (태극기가 아직 없던 시대)
  function pennant(px, topY, baseY, color, text) {
    const w = 30;
    let s = `<rect x="${px}" y="${topY}" width="3" height="${baseY - topY}" fill="#8A6B4A" stroke="${INK}" stroke-width="1"/>`;
    s += `<path d="M${px + 3} ${topY} h${w} l-7 9 l7 9 h${-w} Z" fill="${color}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    if (text) s += label(px + 3 + w * 0.42, topY + 13, text, 11, '#FFF6D2');
    return s;
  }

  // ---------- 3 고려 ----------
  const art3 = [
    // ① 개경 만월대
    function () {
      let g = sky('#DDEFE6') + hills('#8FB8A8', 122) + ground('#C9D8C6');
      g += `<rect x="36" y="130" width="228" height="20" fill="#CBC3B0" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="60" y="112" width="180" height="20" fill="#D6CEBB" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="86" y="94" width="128" height="20" fill="#CBC3B0" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M138 150 V94 M150 150 V94 M162 150 V94" stroke="#A89C84" stroke-width="2"/>`;
      g += hanok(104, 94, 92, 30, '#F3E7CF', '#4B5068');
      g += pennant(96, 48, 64, '#2350B8') + pennant(196, 48, 64, '#E2412E');
      return g;
    },
    // ② 서희 담판과 귀주 대첩
    function () {
      let g = sky('#E5ECF8') + hills('#9AA9C9', 132) + ground('#CBB79A');
      g += `<path d="M66 92 L150 70 L234 92 Z" fill="#D8CDB8" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<rect x="78" y="90" width="4" height="46" fill="#8A6B4A"/><rect x="218" y="90" width="4" height="46" fill="#8A6B4A"/>`;
      g += `<rect x="124" y="118" width="52" height="10" fill="#A9744F" stroke="${INK}" stroke-width="2"/><rect x="134" y="106" width="32" height="12" rx="2" fill="#F6E7B4" stroke="${INK}" stroke-width="1.5"/>`;
      g += person(112, 138, { body: '#EADBC0', hat: 'gat', arms: 'reach-r' });
      g += person(188, 138, { body: '#3B4A6B', hat: 'fedora', arms: 'reach-l' });
      g += `<rect x="96" y="54" width="108" height="18" rx="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` + label(150, 68, '서희의 담판', 12, INK);
      g += pennant(44, 60, 150, '#2E9E5B', '귀주');
      return g;
    },
    // ③ 벽란도 국제 무역항
    function () {
      let g = sky('#D7E8F3') + `<circle cx="254" cy="30" r="13" fill="#F5C242" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="-200" y="126" width="700" height="100" fill="#8FC3DE"/><path d="M-200 126 H500" stroke="${INK}" stroke-width="2"/>`;
      // 무역선
      g += `<path d="M150 112 L250 112 L238 134 L162 134 Z" fill="#7A5B43" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<rect x="196" y="56" width="3" height="56" fill="${INK}"/>`;
      g += `<path d="M199 60 Q232 68 230 104 L199 104 Z" fill="#E8DFC6" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M199 60 Q168 68 170 104 L199 104 Z" fill="#F3ECD6" stroke="${INK}" stroke-width="2"/>`;
      // 부두 물건
      g += `<rect x="96" y="120" width="52" height="14" fill="#A9744F" stroke="${INK}" stroke-width="2"/>`;
      [[36, '#8A5A3C'], [58, '#9E6B47']].forEach(([x, c]) => { g += `<ellipse cx="${x}" cy="124" rx="11" ry="12" fill="${c}" stroke="${INK}" stroke-width="2"/><path d="M${x - 11} 120 h22" stroke="${INK}" stroke-width="1.2"/>`; });
      g += `<rect x="76" y="112" width="20" height="20" fill="#C79A5B" stroke="${INK}" stroke-width="2"/>`;
      g += person(118, 134, { s: 0.75, body: '#EADBC0', hat: 'gat' }) + person(258, 132, { s: 0.75, body: '#5A3426', hat: 'fedora' });
      return g;
    },
    // ④ 상감 청자 가마
    function () {
      let g = sky('#DDEFE6') + hills('#8FB8A8', 132) + ground('#C9D8C6');
      // 오름 가마
      g += `<path d="M18 150 Q40 104 120 100 Q150 100 150 122 L150 150 Z" fill="#9E6B47" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<path d="M30 150 Q48 118 96 116" fill="none" stroke="#7A4F32" stroke-width="2"/>`;
      g += `<path d="M30 150 L30 132 Q40 126 50 132 L50 150 Z" fill="#2B2A3F" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M34 140 Q40 126 46 140 Q44 132 40 128 Q36 132 34 140 Z" fill="#F28C28"/><path d="M37 138 Q40 130 43 138 Z" fill="#E2412E"/>`;
      [[96, 70], [108, 62], [120, 70]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="6" fill="#C9C3B6" stroke="${INK}" stroke-width="1"/>`; });
      // 청자 매병
      g += `<rect x="196" y="130" width="76" height="12" fill="#A9744F" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M234 68 Q214 72 218 96 Q210 112 226 128 L242 128 Q258 112 250 96 Q254 72 234 68 Z" fill="#7FB8A0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<ellipse cx="234" cy="70" rx="7" ry="3" fill="#6AA48C" stroke="${INK}" stroke-width="1.5"/>`;
      [[226, 100], [242, 100], [234, 114]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="3.5" fill="#FBF4DF" stroke="${INK}" stroke-width="1"/>`; });
      return g;
    },
    // ⑤ 팔만대장경과 직지
    function () {
      let g = sky('#EFE6CE') + ground('#D8CDB8');
      g += `<rect x="20" y="58" width="150" height="92" fill="#C9B79A" stroke="${INK}" stroke-width="2"/>`;
      g += `<rect x="12" y="50" width="166" height="10" fill="#9B7F5E" stroke="${INK}" stroke-width="2"/>`;
      for (let r = 0; r < 3; r++) { g += `<rect x="28" y="${70 + r * 26}" width="134" height="20" fill="#B8945F" stroke="${INK}" stroke-width="1.5"/>`; for (let x = 32; x < 160; x += 7) g += `<path d="M${x} ${72 + r * 26} v16" stroke="#8A6B4A" stroke-width="1"/>`; }
      // 직지
      g += `<rect x="202" y="92" width="72" height="56" rx="2" fill="#E8D7A8" stroke="${INK}" stroke-width="2"/><path d="M238 92 V148" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M212 102 V138 M248 102 V138 M258 102 V138" stroke="#7A5B43" stroke-width="1.2"/>`;
      g += label(238, 84, '직지', 13, INK);
      return g;
    }
  ];

  // ---------- 2 삼국·남북국 ----------
  const art2 = [
    // ① 고구려 무용총 수렵도
    function () {
      let g = `<rect x="-200" y="-200" width="700" height="600" fill="#C8A06A"/>`;
      g += `<path d="M-200 150 H500" stroke="#7A5A38" stroke-width="2"/>`;
      g += `<path d="M20 70 l16 -20 l16 20 Z M44 74 l14 -18 l14 18 Z" fill="none" stroke="#8A5A3C" stroke-width="2"/>`;
      // 사슴
      const deer = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="9" fill="#6E4A2E" stroke="${INK}" stroke-width="2"/>` +
        `<path d="M${x - 15} ${y + 7} l-4 14 M${x - 4} ${y + 9} l-3 14 M${x + 6} ${y + 9} l3 14 M${x + 16} ${y + 7} l5 13" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>` +
        `<path d="M${x + 18} ${y - 2} q12 -2 16 -16" fill="none" stroke="#6E4A2E" stroke-width="6"/>` +
        `<circle cx="${x + 35}" cy="${y - 20}" r="5" fill="#6E4A2E" stroke="${INK}" stroke-width="1.5"/>` +
        `<path d="M${x + 34} ${y - 24} l-3 -10 m3 10 l3 -10 m-4 6 l-6 -3 m7 3 l6 -3" stroke="#6E4A2E" stroke-width="2" stroke-linecap="round"/>`;
      g += deer(78, 108);
      // 말 탄 사람
      const hx = 196, hy = 120;
      g += `<ellipse cx="${hx}" cy="${hy}" rx="26" ry="11" fill="#2E2A33" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M${hx - 20} ${hy + 8} l-6 16 M${hx - 7} ${hy + 10} l-4 16 M${hx + 7} ${hy + 10} l4 16 M${hx + 20} ${hy + 8} l6 16" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      g += `<path d="M${hx - 24} ${hy - 2} q-12 -2 -16 -14" fill="none" stroke="#2E2A33" stroke-width="7"/><circle cx="${hx - 42}" cy="${hy - 18}" r="6" fill="#2E2A33"/>`;
      g += `<path d="M${hx + 24} ${hy + 2} q10 4 14 14" fill="none" stroke="#2E2A33" stroke-width="3"/>`;
      // 기수 + 활
      g += person(hx + 4, hy - 4, { s: 0.74, body: '#8A2B2B', arms: 'reach-l' });
      g += `<path d="M${hx - 26} ${hy - 30} Q${hx - 44} ${hy - 14} ${hx - 26} ${hy + 2}" fill="none" stroke="#2B2A3F" stroke-width="2"/><path d="M${hx - 26} ${hy - 30} L${hx - 26} ${hy + 2}" stroke="#2B2A3F" stroke-width="1"/>`;
      return g;
    },
    // ② 백제 금동 대향로와 정림사지 5층 석탑
    function () {
      let g = sky('#D7E8F3') + hills('#9EB7A4', 132) + ground('#D9C7A1');
      // 5층 석탑
      let py = 136;
      for (let i = 0; i < 5; i++) {
        const w = 70 - i * 10, x = 150 - w / 2;
        g += `<rect x="${x + 6}" y="${py - 12}" width="${w - 12}" height="12" fill="#CFC7B4" stroke="${INK}" stroke-width="1.5"/>`;
        g += `<path d="M${x - 4} ${py - 12} L${150} ${py - 22} L${x + w + 4} ${py - 12} Z" fill="#B7AE98" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
        py -= 22;
      }
      g += `<rect x="146" y="${py}" width="8" height="8" fill="#B7AE98" stroke="${INK}" stroke-width="1.5"/>`;
      // 금동 대향로
      const bx = 66;
      g += `<path d="M${bx - 16} 148 Q${bx} 132 ${bx + 16} 148 Z" fill="#C7912E" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M${bx - 20} 128 Q${bx} 150 ${bx + 20} 128 Z" fill="#E0B347" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M${bx - 16} 128 Q${bx - 10} 104 ${bx} 108 Q${bx + 10} 104 ${bx + 16} 128 Z" fill="#E7C65E" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M${bx - 8} 112 l3 -6 m5 6 l0 -8 m5 8 l3 -6" stroke="#C7912E" stroke-width="2" stroke-linecap="round"/>`;
      g += `<circle cx="${bx}" cy="96" r="5" fill="#E7C65E" stroke="${INK}" stroke-width="1.5"/><path d="M${bx} 91 q-7 -6 -2 -12 q6 4 2 12" fill="#E0B347" stroke="${INK}" stroke-width="1.5"/>`;
      return g;
    },
    // ③ 신라 첨성대
    function () {
      let g = sky('#2E3A5E');
      [[40, 36], [72, 56], [120, 30], [230, 40], [262, 64], [200, 26]].forEach(([x, y]) => { g += `<path d="M${x} ${y - 3} l1.5 2.5 l-1.5 2.5 l-1.5 -2.5 Z" fill="#FFF6D2"/>`; });
      g += `<circle cx="252" cy="36" r="12" fill="#F3ECCB" stroke="${INK}" stroke-width="1.5"/>`;
      g += hills('#3A4668', 134) + ground('#4A4466');
      // 첨성대
      g += `<rect x="124" y="60" width="52" height="8" fill="#B7AE98" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M118 134 Q150 118 182 134 L172 68 Q150 60 128 68 Z" fill="#CBC3B0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      for (let y = 78; y < 132; y += 10) g += `<path d="M${124 + (y - 78) * 0.08} ${y} Q150 ${y - 4} ${176 - (y - 78) * 0.08} ${y}" fill="none" stroke="#A89C84" stroke-width="1.3"/>`;
      g += `<rect x="142" y="92" width="16" height="16" fill="#6E6652" stroke="${INK}" stroke-width="1.5"/>`;
      return g;
    },
    // ④ 통일 신라 불국사와 석굴암
    function () {
      let g = sky('#D7E8F3') + hills('#9EB7A4', 128) + ground('#C9B98E');
      // 불국사 석단과 계단
      g += `<rect x="14" y="110" width="150" height="30" fill="#CBB79A" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M70 140 L70 110 M108 140 L108 110" stroke="#A89070" stroke-width="2"/>`;
      g += `<rect x="20" y="84" width="138" height="26" fill="#D6C2A0" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M10 84 Q89 70 168 84 L156 72 Q89 62 22 72 Z" fill="#9B4E37" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      // 석가탑·다보탑
      g += `<rect x="40" y="92" width="14" height="18" fill="#CFC7B4" stroke="${INK}" stroke-width="1.5"/><path d="M38 92 h18 M40 86 h14" stroke="${INK}" stroke-width="1.5"/>`;
      g += `<rect x="120" y="92" width="14" height="18" fill="#CFC7B4" stroke="${INK}" stroke-width="1.5"/><path d="M118 100 h18 M120 94 h14 M122 88 h10" stroke="${INK}" stroke-width="1.5"/>`;
      // 석굴암
      g += `<path d="M198 138 A42 42 0 0 1 282 138 Z" fill="#8A8172" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M210 138 A30 30 0 0 1 270 138 Z" fill="#2E2A33"/>`;
      g += `<circle cx="240" cy="118" r="9" fill="#F2C7A0" stroke="${INK}" stroke-width="1.5"/><circle cx="240" cy="118" r="14" fill="none" stroke="#E7C65E" stroke-width="1.5"/>`;
      g += `<path d="M228 138 Q240 122 252 138 Z" fill="#E8DFC6" stroke="${INK}" stroke-width="1.5"/>`;
      return g;
    },
    // ⑤ 발해 상경성
    function () {
      let g = sky('#E5ECF8') + hills('#9AA9C9', 128) + ground('#D6CDB8');
      g += `<rect x="-6" y="118" width="312" height="32" fill="#C9B79A" stroke="${INK}" stroke-width="2"/>`;
      for (let x = 2; x < 300; x += 22) g += `<rect x="${x}" y="110" width="14" height="10" fill="#C9B79A" stroke="${INK}" stroke-width="1.3"/>`;
      // 성문 문루
      g += `<rect x="112" y="92" width="76" height="30" fill="#C9A878" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M150 150 V122 Q150 108 150 122 Z"/>`;
      g += `<path d="M134 150 V118 Q150 104 166 118 V150 Z" fill="#5A3426" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M100 92 Q150 76 200 92 L188 78 Q150 68 112 78 Z" fill="#8E6A45" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += pennant(118, 50, 92, '#8A55D6') + pennant(176, 50, 92, '#2350B8');
      return g;
    }
  ];

  // ---------- 1 선사·고조선·여러 나라 ----------
  const art1 = [
    // ① 구석기 동굴 사냥터
    function () {
      let g = sky('#F3DDB3') + hills('#C8A26B', 128) + ground('#C8A878');
      // 바위와 동굴
      g += `<path d="M6 150 Q0 86 60 82 Q120 86 112 150 Z" fill="#A89070" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<path d="M40 150 Q40 112 60 110 Q80 112 80 150 Z" fill="#4A4234" stroke="${INK}" stroke-width="2"/>`;
      // 사슴
      g += `<ellipse cx="232" cy="118" rx="18" ry="8" fill="#8A5A3C" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M220 124 l-4 13 M228 126 l-3 13 M238 126 l4 13 M246 124 l5 12" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
      g += `<path d="M248 112 q10 -2 13 -14" fill="none" stroke="#8A5A3C" stroke-width="5"/><circle cx="263" cy="96" r="4.5" fill="#8A5A3C" stroke="${INK}" stroke-width="1.5"/><path d="M262 92 l-2 -8 m2 8 l3 -8" stroke="#8A5A3C" stroke-width="2" stroke-linecap="round"/>`;
      // 사냥꾼 (창)
      g += person(150, 176, { body: '#8A6B4A', arms: 'reach-r' });
      g += `<path d="M160 150 L186 120" stroke="#8A6B4A" stroke-width="3" stroke-linecap="round"/><path d="M186 120 l-6 2 l4 -6 Z" fill="#9A9486" stroke="${INK}" stroke-width="1"/>`;
      g += person(120, 178, { s: 0.82, body: '#9E8A6A', arms: 'up' });
      return g;
    },
    // ② 신석기 움집 마을
    function () {
      let g = sky('#D7E8F3') + hills('#9EB7A4', 130) + ground('#D9C7A1');
      const hut = (x, s) => `<path d="M${x - 34 * s} 150 Q${x} ${150 - 72 * s} ${x + 34 * s} 150 Z" fill="#B88A52" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
        `<path d="M${x - 24 * s} 150 Q${x} ${150 - 52 * s} ${x + 24 * s} 150 M${x - 13 * s} 150 Q${x} ${150 - 34 * s} ${x + 13 * s} 150" fill="none" stroke="#8A6B4A" stroke-width="1.5"/>` +
        `<path d="M${x - 8 * s} 150 V${150 - 20 * s} Q${x} ${150 - 26 * s} ${x + 8 * s} ${150 - 20 * s} V150 Z" fill="#4A4234" stroke="${INK}" stroke-width="1.5"/>`;
      g += hut(60, 1) + hut(214, 0.82);
      // 빗살무늬 토기
      g += `<path d="M132 150 L122 108 Q150 100 178 108 L168 150 Z" fill="#C08A54" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += `<path d="M126 116 l48 0 M128 124 l44 0" stroke="#6E4F30" stroke-width="1.2"/>`;
      for (let x = 126; x < 174; x += 8) g += `<path d="M${x} 130 l4 8 l4 -8" fill="none" stroke="#6E4F30" stroke-width="1.2"/>`;
      g += person(104, 176, { s: 0.85, body: '#C7B89A' });
      return g;
    },
    // ③ 청동기 고인돌 언덕
    function () {
      let g = sky('#DDEFE6') + hills('#8FB8A8', 120) + ground('#A6BE82');
      const dolmen = (x, s) => `<path d="M${x - 40 * s} ${150 - 44 * s} Q${x} ${150 - 58 * s} ${x + 40 * s} ${150 - 44 * s} L${x + 34 * s} ${150 - 34 * s} Q${x} ${150 - 46 * s} ${x - 34 * s} ${150 - 34 * s} Z" fill="#A89C86" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
        `<rect x="${x - 28 * s}" y="${150 - 34 * s}" width="${14 * s}" height="${34 * s}" fill="#9A8E78" stroke="${INK}" stroke-width="2"/>` +
        `<rect x="${x + 14 * s}" y="${150 - 34 * s}" width="${14 * s}" height="${34 * s}" fill="#9A8E78" stroke="${INK}" stroke-width="2"/>`;
      g += dolmen(96, 1) + dolmen(214, 0.74);
      g += person(150, 176, { s: 0.82, body: '#C7B89A' });
      return g;
    },
    // ④ 고조선 왕검성
    function () {
      let g = sky('#F3DDB3') + hills('#C8A26B', 126) + ground('#D6B98A');
      g += `<rect x="-6" y="116" width="312" height="34" fill="#C9B18A" stroke="${INK}" stroke-width="2"/>`;
      for (let x = 2; x < 300; x += 24) g += `<rect x="${x}" y="108" width="14" height="10" fill="#C9B18A" stroke="${INK}" stroke-width="1.3"/>`;
      g += `<rect x="116" y="90" width="68" height="26" fill="#BFA574" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M132 150 V116 Q150 102 168 116 V150 Z" fill="#5A3426" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M104 90 Q150 74 196 90 L184 78 Q150 68 116 78 Z" fill="#8E6A45" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      g += label(150, 108, '왕검성', 11, '#3A2E20');
      // 비파형 동검
      g += `<path d="M44 128 Q36 100 44 64 Q52 100 44 128 Z" fill="#6E8E6A" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect x="42" y="128" width="4" height="16" fill="#5A3426" stroke="${INK}" stroke-width="1.5"/><path d="M34 132 h20" stroke="#5A3426" stroke-width="3" stroke-linecap="round"/>`;
      return g;
    },
    // ⑤ 여러 나라의 제천 행사
    function () {
      let g = sky('#3A4668');
      [[36, 34], [82, 52], [220, 36], [262, 58]].forEach(([x, y]) => { g += `<path d="M${x} ${y - 3} l1.5 2.5 l-1.5 2.5 l-1.5 -2.5 Z" fill="#FFF6D2"/>`; });
      g += hills('#3E6E8E', 132) + ground('#5A4E3A');
      // 모닥불
      g += `<path d="M138 148 l24 0 l-6 -8 l-12 0 Z" fill="#8A6B4A" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M138 142 Q132 118 150 102 Q168 118 162 142 Z" fill="#F28C28" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M144 142 Q142 124 150 112 Q158 124 156 142 Z" fill="#E2412E"/><path d="M148 140 Q147 128 150 122 Q153 128 152 140 Z" fill="#F5C242"/>`;
      // 춤추는 사람들
      g += person(78, 176, { body: '#D9C9A8', arms: 'up' }) + person(104, 178, { body: '#C7B89A', arms: 'one' });
      g += person(196, 176, { body: '#D9C9A8', arms: 'up' }) + person(222, 178, { body: '#C7B89A', arms: 'reach-l' });
      // 북
      g += `<ellipse cx="46" cy="150" rx="16" ry="20" fill="#9E6B47" stroke="${INK}" stroke-width="2"/><ellipse cx="46" cy="150" rx="9" ry="13" fill="#E8D7B0"/>`;
      return g;
    }
  ];

  const SCENE_ART = { e7b: art7b, e8: art8, e9: art9, e7a: art7a, e6: art6, e5: art5, e4: art4, e3: art3, e2: art2, e1: art1 };

  function sceneSVG(eraId, k) {
    const e = GAME.era(eraId);
    const fn = SCENE_ART[e.id] && SCENE_ART[e.id][k];
    P = 's' + (++uid) + '_';
    const inner = finish(fn ? fn() : placeholder(e.id, k, e.scenes[k]));
    return `<svg class="scene-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" role="img" aria-label="${e.scenes[k]}">${inner}</svg>`;
  }
  function hasArt(eraId) { return !!SCENE_ART[eraId]; }

  window.ART = { CARS, GROUPS, carSVG, sceneSVG, hasArt };
})();
