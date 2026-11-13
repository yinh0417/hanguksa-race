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
      head: [62, 19, 9.5], wheels: [28, 94], light: 'round', lx: 109, ly: 33, eyes: [97, 33, 5.5], // 지붕이 없어 눈은 보닛 위에
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
  const BODY = P => P.toy
    ? `fill="url(#${P.id}b)" stroke="${shade(P.c.body, -0.08)}" stroke-width="2.8" stroke-linejoin="round" class="tb" filter="url(#${P.id}p)"`
    : `fill="url(#${P.id}b)" stroke="${P.dark}" stroke-width="1.1" stroke-linejoin="round"`;
  // 장난감 입체 효과: 몸통 모양을 부풀린 것처럼 위쪽은 반짝, 아래쪽은 그늘(동물 캐릭터에는 쓰지 않아요)
  const TOY_FILTER = id => `<filter id="${id}p" x="-8%" y="-12%" width="116%" height="128%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3.4" result="b"/>
      <feDiffuseLighting in="b" surfaceScale="6" diffuseConstant="1.18" lighting-color="#fff" result="d"><feDistantLight azimuth="240" elevation="58"/></feDiffuseLighting>
      <feSpecularLighting in="b" surfaceScale="6" specularConstant=".95" specularExponent="13" lighting-color="#fff" result="s"><feDistantLight azimuth="240" elevation="58"/></feSpecularLighting>
      <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.05" result="lit"/>
      <feComposite in="lit" in2="s" operator="arithmetic" k2="1" k3=".55" result="shine"/>
      <feComposite in="shine" in2="SourceAlpha" operator="in"/>
    </filter>`;
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
      ${filmHoofed({ body: '#b5773f', dark: '#8a5428', light: '#f0d2ad', mane: '#4a2c18', lash: true })}
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
      ${filmHoofed({ body: '#a7743f', dark: '#7a4f28', light: '#f3e2c8', antler: '#6b4423', redNose: true, iris: '#5a3a1e' })}
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
      ${lampGenie(60)}
      <path d="M8 46 Q24 40 40 46 T72 46 T104 46 L112 52 Q96 58 80 52 T48 52 T16 52 Z" ${BODY(P)}/>
      <path d="M14 49 Q26 45 40 49 T72 49 T104 49" stroke="${P.c.stripe}" stroke-width="1.6" fill="none" stroke-dasharray="4 3"/>
      <path d="M8 46 l-4 2 M9 49 l-4 3 M10 52 l-4 3 M112 52 l4 2 M110 55 l4 3" stroke="${P.c.stripe}" stroke-width="1.4" stroke-linecap="round"/>`,
    // 마법 빗자루
    x_broom: P => `
      ${sparkle(8, 24, 3)}${sparkle(16, 60, 2.5, '#fff')}${sparkle(30, 14, 2)}
      <path d="M20 44 L114 36" stroke="#8a5a2b" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M26 41 L2 30 L4 56 L26 47 Z" fill="#e8c26a" stroke="#b8902e" stroke-width="1"/><path d="M24 43 L6 36 M24 44 L5 44 M24 45 L6 52" stroke="#b8902e" stroke-width=".9"/>
      ${littleWizard(66, 22)}`,
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
      ${filmTurtleHead()}
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
  // ===== 동물 캐릭터: 앞을 보는 동글동글한 털 뭉치(보송 털 질감) =====
  // 몸은 가운데(60, 37)의 털 뭉치, 눈은 (49, 34)·(71, 34). o의 항목으로 동물마다 귀·얼굴·팔다리·꼬리를 고릅니다.
  // 둘레를 따라 작은 물결이 이는 털 테두리 (amp가 0이면 매끈한 몸)
  function fuzz(cx, cy, rx, ry, n, amp) {
    let d = '';
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2, a2 = ((i + 0.5) / n) * Math.PI * 2;
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      const qx = cx + Math.cos(a2) * (rx + amp), qy = cy + Math.sin(a2) * (ry + amp);
      d += i ? ` Q${f1(qx)} ${f1(qy)} ${f1(x)} ${f1(y)}` : `M${f1(x)} ${f1(y)}`;
    }
    return d + 'Z';
  }
  const FUR_INK = '#1e1619';

  function fluffEars(o, F) {
    const E = o.earColor || F, IN = o.earIn || '#f4a7a0';
    switch (o.ears) {
      case 'round': return [39, 81].map(x => `<circle cx="${x}" cy="14" r="${o.earR || 8}" fill="${E}"/><circle cx="${x}" cy="15" r="${(o.earR || 8) * 0.52}" fill="${IN}"/>`).join('');
      case 'koala': return [33, 87].map(x => `<path d="${fuzz(x, 18, 12, 11, 16, 1.6)}" fill="${E}"/><circle cx="${x}" cy="19" r="6.5" fill="${IN}"/>`).join('');
      case 'long': return [[47, -9], [73, 9]].map(([x, r]) => `<g transform="rotate(${r} ${x} 10)"><ellipse cx="${x}" cy="0" rx="6.5" ry="14" fill="${E}"/><ellipse cx="${x}" cy="1" rx="3.2" ry="10" fill="${IN}"/></g>`).join('');
      case 'cat': case 'fox': {
        const big = o.ears === 'fox' ? 4 : 0;
        const tip = o.earTip ? `<path d="M${36 - big / 2} ${3 - big} l2.2 7 l4.6 -3.2 Z" fill="${o.earTip}"/><path d="M${84 + big / 2} ${3 - big} l-2.2 7 l-4.6 -3.2 Z" fill="${o.earTip}"/>` : '';
        return `<path d="M33 24 L${36 - big / 2} ${3 - big} L52 13 Z" fill="${E}" stroke-linejoin="round"/><path d="M37.5 18 L${38.5 - big / 3} ${8 - big / 1.5} L46 13 Z" fill="${IN}"/>` +
          `<path d="M87 24 L${84 + big / 2} ${3 - big} L68 13 Z" fill="${E}"/><path d="M82.5 18 L${81.5 + big / 3} ${8 - big / 1.5} L74 13 Z" fill="${IN}"/>` + tip;
      }
      case 'pig': return `<path d="M36 20 L38 6 L50 13 Z" fill="${E}"/><path d="M84 20 L82 6 L70 13 Z" fill="${E}"/><path d="M38 6 L44 14 L50 13 Z" fill="${shade(E, -0.12)}"/><path d="M82 6 L76 14 L70 13 Z" fill="${shade(E, -0.12)}"/>`;
      case 'tuft': return `<path d="M34 20 L35 2 L47 13 Z" fill="${E}"/><path d="M86 20 L85 2 L73 13 Z" fill="${E}"/>`;
      case 'side': return [30, 90].map(x => `<ellipse cx="${x}" cy="30" rx="4.5" ry="5" fill="${E}"/><ellipse cx="${x}" cy="30.5" rx="2.2" ry="2.6" fill="${IN}"/>`).join('');
    }
    return '';
  }
  // 늘어진 귀는 얼굴 앞에
  function flopEars(o) {
    if (o.ears !== 'flop') return '';
    const E = o.earColor, sh = o.shaggy ? 2.2 : 1.2;
    return `<path d="${fuzz(0, 0, 7.5, 14, 14, sh)}" fill="${E}" transform="translate(33 30) rotate(24)"/><path d="${fuzz(0, 0, 7.5, 14, 14, sh)}" fill="${E}" transform="translate(87 30) rotate(-24)"/>`;
  }

  function fluffFace(o, id) {
    const M = o.muzzle;
    let f = '';
    if (o.eyePatch) f += `<ellipse cx="48" cy="35" rx="${o.patchR || 7}" ry="${(o.patchR || 7) * 1.2}" fill="${o.eyePatch}" transform="rotate(30 48 35)"/><ellipse cx="72" cy="35" rx="${o.patchR || 7}" ry="${(o.patchR || 7) * 1.2}" fill="${o.eyePatch}" transform="rotate(-30 72 35)"/>`;
    if (o.patch) f += `<ellipse cx="72" cy="31" rx="9" ry="8" fill="${o.patch}" opacity=".85"/>`;
    if (o.eyeDisc) f += `<circle cx="48.5" cy="34" r="9.5" fill="${o.eyeDisc}"/><circle cx="71.5" cy="34" r="9.5" fill="${o.eyeDisc}"/>`;
    if (o.eyeSpot) f += `<ellipse cx="45" cy="29" rx="7" ry="4.5" fill="${o.eyeSpot}" transform="rotate(-15 45 29)"/><ellipse cx="75" cy="29" rx="7" ry="4.5" fill="${o.eyeSpot}" transform="rotate(15 75 29)"/>`;
    if (o.stripes) f += `<path d="M60 12 v7 M53 13 l1.5 6 M67 13 l-1.5 6" stroke="${o.stripes}" stroke-width="2.6" stroke-linecap="round"/>` +
      (o.cheekStripes ? `<path d="M30 36 l7 1.5 M30.5 42 l6.5 0 M90 36 l-7 1.5 M89.5 42 l-6.5 0" stroke="${o.stripes}" stroke-width="2.2" stroke-linecap="round"/>` : '');
    // 입 둘레 흰 털 / 부리 / 돼지 코
    if (o.face === 'beak' || o.face === 'fish') {
      if (M) f += `<ellipse cx="60" cy="44" rx="11" ry="7" fill="${M}" opacity=".9"/>`;
    } else if (M) f += `<ellipse cx="53" cy="44" rx="8.5" ry="6.5" fill="${M}"/><ellipse cx="67" cy="44" rx="8.5" ry="6.5" fill="${M}"/><ellipse cx="60" cy="48" rx="7" ry="4.5" fill="${M}"/>`;
    // 눈: 까맣고 반짝이는 구슬 눈
    const er = o.eye || 4.6;
    [[49, 34], [71, 34]].forEach(([x, y]) => {
      f += `<ellipse cx="${x}" cy="${y}" rx="${er}" ry="${f1(er * 1.12)}" fill="url(#${id}e)"/>`;
      f += `<circle cx="${f1(x - er * 0.35)}" cy="${f1(y - er * 0.42)}" r="${f1(er * 0.38)}" fill="#fff"/><circle cx="${f1(x + er * 0.35)}" cy="${f1(y + er * 0.4)}" r="${f1(er * 0.16)}" fill="#fff" opacity=".9"/>`;
    });
    if (o.brows) f += `<path d="M44 26.5 L53 29 M76 26.5 L67 29" stroke="${o.brows}" stroke-width="2" stroke-linecap="round"/>`;
    if (o.shaggy) f += `<path d="${fuzz(60, 22, 26, 9, 22, 2.4)}" fill="${o.shaggy}"/>`; // 삽살개: 눈을 덮는 앞머리
    // 볼터치
    f += [42, 78].map(x => `<ellipse cx="${x}" cy="42" rx="6" ry="3.6" fill="#ff7f99" opacity="${o.blush || 0.3}"/>`).join('');
    // 코·입
    if (o.face === 'beak') {
      const b = o.beak || '#ffa62b', bd = shade(b, -0.25);
      if (o.beakShape === 'duck') f += `<path d="M50 41 Q60 37 70 41 Q71 47 60 48 Q49 47 50 41 Z" fill="${b}"/><path d="M51 44.5 Q60 46.5 69 44.5" stroke="${bd}" stroke-width="1" fill="none"/><circle cx="57" cy="41.5" r=".7" fill="${bd}"/><circle cx="63" cy="41.5" r=".7" fill="${bd}"/>`;
      else if (o.beakShape === 'hook') f += `<path d="M54.5 39 Q60 36 65.5 39 Q65 45 60 49 Q59 46 57 44 Q54.5 42 54.5 39 Z" fill="${b}"/><path d="M60 49 Q58.5 46 57 44" stroke="${bd}" stroke-width=".9" fill="none"/>`;
      else if (o.beakShape === 'flamingo') f += `<path d="M55 39 Q60 37 65 39 L63 45 Q60 50 57 45 Z" fill="${b}"/><path d="M57.6 45.5 Q60 50 62.4 45.5 Q61 44 60 44 Q59 44 57.6 45.5 Z" fill="#2b2633"/>`;
      else f += `<path d="M55.5 39.5 Q60 37.5 64.5 39.5 L60 46 Z" fill="${b}" stroke="${bd}" stroke-width=".6" stroke-linejoin="round"/>`;
      if (o.wattle) f += `<ellipse cx="60" cy="49.5" rx="2.6" ry="3.4" fill="${o.wattle}"/>`;
      return f;
    }
    if (o.face === 'snout') {
      return f + `<ellipse cx="60" cy="43" rx="7.5" ry="5.2" fill="${o.nose}"/><ellipse cx="57.4" cy="43" rx="1.3" ry="1.9" fill="${shade(o.nose, -0.35)}"/><ellipse cx="62.6" cy="43" rx="1.3" ry="1.9" fill="${shade(o.nose, -0.35)}"/>` +
        `<path d="M57 50 q3 2 6 0" stroke="${FUR_INK}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    }
    if (o.face === 'fish') { // 돌고래·고래·상어: 활짝 웃는 입
      f += `<path d="M52 43.5 Q60 50 68 43.5" stroke="${FUR_INK}" stroke-width="1.3" fill="${o.teeth ? '#7a2a35' : 'none'}" stroke-linecap="round"/>`;
      if (o.teeth) f += `<path d="M54 44.8 l1.5 2 l1.5 -1.6 l1.5 2 l1.5 -1.8 l1.5 2 l1.5 -1.8 l1.5 2 l1.5 -1.6 l1.5 2" stroke="#fff" stroke-width=".9" fill="none" stroke-linejoin="round"/>`;
      return f;
    }
    if (o.bigNose) f += `<ellipse cx="60" cy="42" rx="5" ry="6" fill="${o.bigNose}"/><ellipse cx="58.6" cy="39.6" rx="1.4" ry="1" fill="#fff" opacity=".45"/>`;
    else f += `<path d="M57.4 41.2 Q60 39.4 62.6 41.2 Q61.4 43.4 60 43.6 Q58.6 43.4 57.4 41.2 Z" fill="${o.nose || '#e8888a'}"/><path d="M58.6 41.4 q1 -.6 1.8 0" stroke="#fff" stroke-width=".6" opacity=".7" fill="none"/>`;
    f += `<path d="M55.8 ${o.bigNose ? 49.5 : 44.6} q2.1 2.6 4.2 0 q2.1 2.6 4.2 0" stroke="${FUR_INK}" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (o.whisk) f += `<path d="M46 45 L34 43 M46 47 L35 48 M74 45 L86 43 M74 47 L85 48" stroke="${o.whisk}" stroke-width=".6" opacity=".85" stroke-linecap="round"/>`;
    if (o.dots) f += [[50, 45], [48, 47.5], [70, 45], [72, 47.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${o.dots}"/>`).join('');
    return f;
  }

  // 뒤쪽(몸 뒤에 그려요): 꼬리, 갈기, 지느러미, 물줄기
  function fluffBack(o, F) {
    let g = '';
    if (o.mane) g += `<path d="${fuzz(60, 34, 37, 33, 26, 4.5)}" fill="${o.mane}"/>`;
    switch (o.tail) {
      case 'bushy': g += `<ellipse cx="96" cy="44" rx="9" ry="16" fill="${F}" transform="rotate(35 96 44)"/><ellipse cx="103" cy="33" rx="5" ry="6" fill="${o.tailTip || '#fff'}" transform="rotate(35 103 33)"/>`; break;
      case 'long': g += `<path d="M86 52 Q104 52 104 36 Q104 28 98 30" fill="none" stroke="${o.tailColor || o.body}" stroke-width="5" stroke-linecap="round"/>` + (o.stripes ? `<path d="M86 52 Q104 52 104 36 Q104 28 98 30" fill="none" stroke="${o.stripes}" stroke-width="5" stroke-dasharray="2.5 5"/>` : '') + (o.tailTip ? `<circle cx="98" cy="29" r="4" fill="${o.tailTip}"/>` : ''); break;
      case 'curl': g += `<path d="M88 46 q10 -2 9 -10 q-1 -6 -6 -3 q-3 3 1 5" fill="none" stroke="${o.tailColor || o.body}" stroke-width="4.2" stroke-linecap="round"/>`; break;
      case 'thin': g += `<path d="M84 56 Q102 58 104 42" fill="none" stroke="${o.tailColor || o.body}" stroke-width="3" stroke-linecap="round"/>`; break;
      case 'feather': g += `<path d="M84 46 L104 36 L100 46 L106 52 Z" fill="${o.tailColor}" stroke-linejoin="round"/>`; break;
      case 'rooster': g += `<path d="M84 44 Q100 20 108 30 Q98 30 92 46 Z M86 48 Q106 34 110 46 Q100 42 90 52 Z" fill="${o.tailColor}"/>`; break;
      case 'fish': g += `<path d="M86 48 Q98 44 102 32 Q108 38 114 34 Q110 44 104 50 Q96 56 86 54 Z" fill="${F}"/>`; break;
      case 'otter': g += `<path d="M86 56 Q104 60 108 48" fill="none" stroke="${shade(o.body, -0.15)}" stroke-width="6" stroke-linecap="round"/>`; break;
    }
    if (o.fin) g += `<path d="M54 14 Q62 ${o.fin === 'tall' ? -10 : -2} 70 ${o.fin === 'tall' ? -8 : -1} Q66 6 68 14 Z" fill="${shade(o.body, -0.15)}"/>`;
    if (o.spout) g += `<path d="M60 10 Q58 0 52 -4 M60 10 Q60 -2 60 -8 M60 10 Q62 0 68 -4" stroke="#8fd3ff" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="51" cy="-5" r="2.2" fill="#8fd3ff"/><circle cx="60" cy="-9.5" r="2.4" fill="#8fd3ff"/><circle cx="69" cy="-5" r="2.2" fill="#8fd3ff"/>`;
    if (o.comb) g += `<path d="M50 14 Q50 2 56 6 Q58 -2 63 4 Q67 -1 69 8 Q72 8 70 14 Z" fill="${o.comb}"/>`;
    if (o.tuft) g += `<path d="M58 12 Q55 2 60 3 Q58 7 62 6 Q61 10 62 12 Z" fill="${o.tuft}"/>`;
    if (o.crest) g += `<path d="M54 13 Q50 -2 58 2 Q60 -4 64 2 Q70 0 66 13 Z" fill="${o.crest}"/>`;
    return g;
  }

  function fluff(P, o) {
    if (FLUFF_REAR) return fluffRear(P, o);
    const id = P.id + 'm', B = o.body, F = `url(#${id}f)`;
    const amp = o.smooth ? 0.5 : o.shaggy ? 2.8 : 1.9;
    const defs = `<defs>
      <radialGradient id="${id}f" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="${shade(B, 0.45)}"/><stop offset=".55" stop-color="${B}"/><stop offset="1" stop-color="${shade(B, -0.22)}"/></radialGradient>
      <radialGradient id="${id}e" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#3a3340"/><stop offset=".7" stop-color="#0d0b10"/><stop offset="1" stop-color="#000"/></radialGradient>
    </defs>`;
    const limb = o.limb || shade(B, 0.12);
    // 발: 털 발(분홍 발바닥), 새 발, 물결(헤엄치는 동물)
    let feet = '';
    if (o.feet === 'bird') feet = [52, 68].map(x => `<path d="M${x} 58 V64 M${x} 64 l-3.5 1.5 M${x} 64 l3.5 1.5" stroke="${o.legs || '#f2a33a'}" stroke-width="2.4" stroke-linecap="round"/>`).join('');
    else if (o.feet === 'flipper') feet = `<path d="M44 60 Q36 66 46 66 Q52 65 52 61 Z M76 60 Q84 66 74 66 Q68 65 68 61 Z" fill="${shade(B, -0.2)}"/>`;
    else if (o.feet !== 'none') feet = [49, 71].map(x => `<ellipse cx="${x}" cy="63.5" rx="7" ry="3.4" fill="${o.limb || shade(B, -0.08)}"/><ellipse cx="${x}" cy="63.8" rx="3" ry="1.4" fill="#f4a7a0" opacity="${o.limb ? 0 : 0.8}"/>`).join('');
    // 몸과 무늬
    let body = `<path d="${fuzz(60, 37, 31.5, 26.5, 34, amp)}" fill="${F}"/><path d="${fuzz(60, 37, 25, 20, 26, amp * 0.6)}" fill="${shade(B, 0.18)}" opacity=".35"/>`;
    if (o.cap) body += `<path d="M30 37 C29 18 42 10 60 10 C78 10 91 18 90 37 C85 30 75 25 67 28 L60 34 L53 28 C45 25 35 30 30 37 Z" fill="${o.cap}"/>`;
    if (o.capDots) body += `<circle cx="49" cy="25" r="2" fill="${o.capDots}"/><circle cx="71" cy="25" r="2" fill="${o.capDots}"/>`;
    if (o.facePatch) body += `<path d="M60 20 C70 13 86 20 84 36 C83 48 72 54 60 54 C48 54 37 48 36 36 C34 20 50 13 60 20 Z" fill="${o.facePatch}"/>`;
    if (o.belly) body += `<ellipse cx="60" cy="54" rx="${o.bellyW || 15}" ry="${o.bellyH || 8}" fill="${o.belly}" opacity=".85"/>`;
    if (o.grooves) body += [52, 56, 60, 64, 68].map(x => `<path d="M${x} 52 V61" stroke="${o.grooves}" stroke-width="1" opacity=".5" stroke-linecap="round"/>`).join('');
    if (o.spots) body += [[38, 24], [84, 28], [36, 48], [86, 50], [44, 58]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.6" fill="${o.spots}" opacity=".7"/>`).join('');
    if (o.bodyStripes) body += `<path d="M31 46 l7 -1 M32 52 l6 0 M89 46 l-7 -1 M88 52 l-6 0" stroke="${o.bodyStripes}" stroke-width="2.2" stroke-linecap="round"/>`;
    // 앞발(주먹 불끈), 날개, 물갈퀴
    let arms;
    if (o.arms === 'wing') arms = [[30, 44, 20], [90, 44, -20]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="6.5" ry="11" fill="${o.wing || shade(B, -0.12)}"/><path d="M${x - 2.5} ${y + 3} q2.5 3 5 0 M${x - 2.5} ${y + 7} q2.5 3 5 0" stroke="${shade(o.wing || B, -0.25)}" stroke-width=".8" fill="none"/></g>`).join('');
    else if (o.arms === 'flipper' || o.arms === 'fin') arms = [[31, 50, 35], [89, 50, -35]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${o.arms === 'fin' ? 4.5 : 5}" ry="${o.arms === 'fin' ? 9 : 10}" fill="${o.limb || shade(B, -0.18)}" transform="rotate(${r} ${x} ${y})"/>`).join('');
    else arms = [38, 82].map(x => `<ellipse cx="${x}" cy="50" rx="5.4" ry="4.8" fill="${limb}"/><path d="M${x - 2} 48.5 v2.5 M${x + 1} 48.2 v2.5" stroke="${shade(o.limb || B, -0.3)}" stroke-width=".7" stroke-linecap="round" opacity=".6"/>`).join('');
    // 해달: 배 위에 조개를 들고 있어요
    const shell = o.shell ? `<path d="M53 50 Q60 42 67 50 Z" fill="#f6d7b8"/><path d="M56 50 L60 45 M60 50 V44.5 M64 50 L60 45" stroke="#d9a878" stroke-width=".7"/>` : '';
    const water = o.feet === 'water' ? `<path d="M22 58 Q30 53 38 58 T54 58 T70 58 T86 58 T102 58 V66 H22 Z" fill="#5fb8f0" opacity=".9"/><path d="M22 58 Q30 53 38 58 T54 58 T70 58 T86 58 T102 58" stroke="#fff" stroke-width="1.6" fill="none" opacity=".85"/>` : '';
    if (FLUFF_TURN) { // 큰 화면 3D: 고개를 왼쪽 뒤로 살짝 돌려 우리를 봐요(얼굴은 조금 좁게, 왼쪽으로)
      const turn = 'translate(-7 0) translate(60 0) scale(.86 1) translate(-60 0)';
      return defs + fluffBack(o, F) + `<g transform="translate(-4 0)">${fluffEars(o, F)}</g>` + (o.feet === 'water' ? '' : feet) + body +
        `<g transform="${turn}">${flopEars(o)}${fluffFace(o, id)}${shell}</g>` + arms + water;
    }
    return defs + fluffBack(o, F) + fluffEars(o, F) + (o.feet === 'water' ? '' : feet) + body + flopEars(o) + fluffFace(o, id) + shell + arms + water;
  }

  // 동물마다 털 색과 생김새
  Object.assign(SPECIAL, {
    // 포유류
    a_puppy:   P => fluff(P, { body: '#fffaf2', muzzle: '#ffffff', ears: 'flop', earColor: '#c98b55', patch: '#e4b07c', nose: '#3b2a24', tail: 'curl', tailColor: '#f3e3cf' }),
    a_cat:     P => fluff(P, { body: '#f8c27e', muzzle: '#fff6e8', ears: 'cat', earIn: '#ffb3a7', stripes: '#dd8a3a', tail: 'long', whisk: '#fff' }),
    a_rabbit:  P => fluff(P, { body: '#fff9f0', muzzle: '#ffffff', ears: 'long', earIn: '#ffc2cf', nose: '#f29aac', whisk: '#e6dccf' }),
    a_bear:    P => fluff(P, { body: '#c8946a', muzzle: '#f1dcc4', ears: 'round', earIn: '#e9c3a0', nose: '#4a3328' }),
    a_panda:   P => fluff(P, { body: '#ffffff', muzzle: '#ffffff', ears: 'round', earColor: '#2b2633', earIn: '#2b2633', nose: '#2b2633', eyePatch: '#2b2633', limb: '#2b2633' }),
    a_hamster: P => fluff(P, { body: '#f2b77a', muzzle: '#fff3e2', ears: 'round', earColor: '#c98a5a', earIn: '#f4a7a0', belly: '#fff3e2', whisk: '#fff' }),
    a_fox:     P => fluff(P, { body: '#f39a4c', muzzle: '#fff8ef', ears: 'fox', earIn: '#fff1e2', earTip: '#4a3328', nose: '#3b2a24', belly: '#fff8ef', tail: 'bushy', limb: '#5a3a28' }),
    a_tiger:   P => fluff(P, { body: '#f6a13a', muzzle: '#fff8ef', ears: 'round', earColor: '#f6a13a', earIn: '#fff1e2', stripes: '#3a2a1e', cheekStripes: true, bodyStripes: '#3a2a1e', belly: '#fff8ef', tail: 'long', nose: '#e8888a' }),
    a_pig:     P => fluff(P, { body: '#f9bccb', ears: 'pig', earColor: '#f6a8bb', face: 'snout', nose: '#f48aa6', tail: 'curl', tailColor: '#f48aa6', blush: 0.4 }),
    a_koala:   P => fluff(P, { body: '#b4bac4', muzzle: '#e8eaee', ears: 'koala', earColor: '#b4bac4', earIn: '#eef0f3', bigNose: '#2f2a33', belly: '#e8eaee' }),
    a_husky:   P => fluff(P, { body: '#fdfdfd', muzzle: '#ffffff', ears: 'cat', earColor: '#6f7987', earIn: '#f1d9d6', cap: '#7c8695', capDots: '#ffffff', nose: '#2f2a33', tail: 'curl', tailColor: '#8c96a5' }),
    a_jindo:   P => fluff(P, { body: '#e2b675', muzzle: '#fbf1de', ears: 'cat', earIn: '#f6d7b8', nose: '#3b2a24', belly: '#fbf1de', tail: 'curl' }),
    a_pungsan: P => fluff(P, { body: '#fbfaf6', muzzle: '#ffffff', ears: 'cat', earColor: '#efeae1', earIn: '#f6d7d0', nose: '#3b2a24', tail: 'curl', tailColor: '#efeae1' }),
    a_sapsal:  P => fluff(P, { body: '#a3988c', muzzle: '#c2b8ad', ears: 'flop', earColor: '#8e8378', shaggy: '#8e8378', nose: '#2f2a33', tail: 'bushy', tailTip: '#8e8378' }),
    a_lion:    P => fluff(P, { body: '#f2b552', muzzle: '#fff3dc', mane: '#c9752a', ears: 'round', earColor: '#f2b552', earIn: '#fbe1b4', nose: '#8a4a2a', belly: '#fff3dc', tail: 'long', tailTip: '#c9752a' }),
    a_meerkat: P => fluff(P, { body: '#dcb57e', muzzle: '#f1dcbc', ears: 'side', earColor: '#6b4a30', earIn: '#b48a5a', eyePatch: '#6b4a30', patchR: 5.5, nose: '#3b2a24', belly: '#f1dcbc', tail: 'thin' }),
    // 조류
    b_chick:   P => fluff(P, { body: '#ffd84a', face: 'beak', beak: '#ff9f1c', arms: 'wing', wing: '#f5c21f', feet: 'bird', tuft: '#f5c21f', blush: 0.4 }),
    b_duck:    P => fluff(P, { body: '#fffaf0', face: 'beak', beak: '#ff9f1c', beakShape: 'duck', arms: 'wing', wing: '#ece6da', feet: 'bird', legs: '#ff9f1c', tuft: '#ece6da' }),
    b_penguin: P => fluff(P, { body: '#2c3550', smooth: true, facePatch: '#ffffff', face: 'beak', beak: '#ffa62b', arms: 'wing', wing: '#232a40', feet: 'bird', legs: '#ffa62b', blush: 0.45 }),
    b_owl:     P => fluff(P, { body: '#a8774f', ears: 'tuft', earColor: '#8a5d3a', eyeDisc: '#f3e2c8', eye: 4.4, face: 'beak', beak: '#e0a43a', beakShape: 'hook', belly: '#f3e2c8', bellyW: 16, bellyH: 9, arms: 'wing', wing: '#8a5d3a', feet: 'bird', legs: '#e0a43a' }),
    b_sparrow: P => fluff(P, { body: '#b07d52', cap: '#8a5a35', muzzle: '#f4e6d4', face: 'beak', beak: '#3a2a22', belly: '#f4e6d4', arms: 'wing', wing: '#7a5232', feet: 'bird', legs: '#c98b55', tail: 'feather', tailColor: '#7a5232' }),
    b_parrot:  P => fluff(P, { body: '#3cc46b', muzzle: '#bff0cf', face: 'beak', beak: '#f2f2f2', beakShape: 'hook', crest: '#2aa457', arms: 'wing', wing: '#1f8fd6', feet: 'bird', legs: '#8a8f99', tail: 'feather', tailColor: '#e2412e' }),
    b_magpie:  P => fluff(P, { body: '#26262e', smooth: true, face: 'beak', beak: '#2b2b33', belly: '#ffffff', bellyW: 17, bellyH: 9, arms: 'wing', wing: '#2f5fb8', feet: 'bird', legs: '#3a3a40', tail: 'feather', tailColor: '#1b2f6b', blush: 0.45 }),
    b_eagle:   P => fluff(P, { body: '#7a5232', cap: '#f4efe6', face: 'beak', beak: '#ffc21a', beakShape: 'hook', brows: '#4a3020', arms: 'wing', wing: '#5a3a22', feet: 'bird', legs: '#ffc21a', tail: 'feather', tailColor: '#f4efe6' }),
    b_flamingo: P => fluff(P, { body: '#ff9cbc', face: 'beak', beak: '#fff1e6', beakShape: 'flamingo', arms: 'wing', wing: '#ff7fa6', feet: 'bird', legs: '#ff7fa6', blush: 0.45 }),
    b_swan:    P => fluff(P, { body: '#ffffff', face: 'beak', beak: '#ff8c1a', arms: 'wing', wing: '#eef1f5', feet: 'water', tuft: '#eef1f5' }),
    b_rooster: P => fluff(P, { body: '#fffaf0', face: 'beak', beak: '#f2a33a', comb: '#e2412e', wattle: '#e2412e', arms: 'wing', wing: '#efe4d2', feet: 'bird', legs: '#f2a33a', tail: 'rooster', tailColor: '#2f6b3a' }),
    // 해양 동물
    m_sealion: P => fluff(P, { body: '#9a7350', smooth: true, muzzle: '#c8a67f', nose: '#3b2a24', dots: '#3b2a24', whisk: '#f4e6d4', arms: 'flipper', feet: 'flipper' }),
    m_kangchi: P => fluff(P, { body: '#66615d', smooth: true, muzzle: '#8f8984', nose: '#26222a', dots: '#26222a', whisk: '#d8d3ce', arms: 'flipper', feet: 'flipper', belly: '#8f8984' }),
    m_seal:    P => fluff(P, { body: '#aab5c3', smooth: true, muzzle: '#dfe5ec', nose: '#3a3540', dots: '#3a3540', whisk: '#ffffff', spots: '#6f7c8c', arms: 'flipper', feet: 'flipper', belly: '#dfe5ec' }),
    m_otter:   P => fluff(P, { body: '#8b6545', muzzle: '#e8d6bd', ears: 'side', earColor: '#7a5638', earIn: '#b48a5a', nose: '#2f2a33', whisk: '#f4e6d4', belly: '#d9c1a2', tail: 'otter', shell: true }),
    m_dolphin: P => fluff(P, { body: '#7fb6e6', smooth: true, face: 'fish', muzzle: '#cfe6f8', belly: '#f4f8fb', fin: 'short', tail: 'fish', arms: 'fin', feet: 'water' }),
    m_shark:   P => fluff(P, { body: '#8494a8', smooth: true, face: 'fish', teeth: true, belly: '#f4f8fb', fin: 'tall', tail: 'fish', arms: 'fin', feet: 'water' }),
    m_whale:   P => fluff(P, { body: '#4a6fa5', smooth: true, face: 'fish', belly: '#cfdcef', bellyW: 18, bellyH: 9, grooves: '#7f9cc6', spout: true, tail: 'fish', arms: 'fin', feet: 'water' }),
    m_orca:    P => fluff(P, { body: '#2a2a33', smooth: true, face: 'fish', eyeSpot: '#ffffff', belly: '#ffffff', bellyW: 17, fin: 'tall', tail: 'fish', arms: 'fin', feet: 'water', blush: 0.45 })
  });

  // ===== 애니메이션 자동차 얼굴: 앞 유리에 큰 눈, 앞 범퍼에 웃는 입 =====
  // 눈은 앞(오른쪽)을 바라보고, 위 눈꺼풀 선이 있어요. (x, y): 앞 유리 가운데, r: 크기
  function toonEyes(x, y, r, id) {
    const rx = r * 0.56, ry = r * 0.74;
    return [-0.6, 0.6].map(k => {
      const ex = x + k * r, ey = y + 1;
      return `<ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#fff" stroke="#2a2430" stroke-width=".9"/>` +
        `<ellipse cx="${f1(ex + rx * 0.28)}" cy="${f1(ey + ry * 0.08)}" rx="${f1(rx * 0.58)}" ry="${f1(ry * 0.62)}" fill="url(#${id}m)"/>` +
        `<circle cx="${f1(ex + rx * 0.12)}" cy="${f1(ey - ry * 0.22)}" r="${f1(rx * 0.24)}" fill="#fff"/>` +
        `<path d="M${f1(ex - rx * 1.05)} ${f1(ey - ry * 0.55)} Q${f1(ex)} ${f1(ey - ry * 1.35)} ${f1(ex + rx * 1.05)} ${f1(ey - ry * 0.55)}" fill="none" stroke="#2a2430" stroke-width="1.2" stroke-linecap="round"/>`;
    }).join('') + `<defs><radialGradient id="${id}m" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a4256"/><stop offset=".7" stop-color="#16121c"/><stop offset="1" stop-color="#000"/></radialGradient></defs>`;
  }
  // 앞 범퍼의 웃는 입과 볼(전조등 아래)
  function toonMouth(lx, ly, dark) {
    const x = lx + 1, y = ly + 7.5;
    return `<ellipse cx="${f1(lx - 4)}" cy="${f1(ly + 6.5)}" rx="4" ry="2.2" fill="#ff7f99" opacity=".45"/>` +
      `<path d="M${x - 7} ${y} Q${x} ${y + 7.5} ${x + 7} ${y} Q${x} ${y + 2.4} ${x - 7} ${y} Z" fill="#5a1d2c" stroke="#2a2430" stroke-width="1" stroke-linejoin="round"/>` +
      `<path d="M${x - 3} ${y + 3.4} Q${x} ${y + 5.6} ${x + 3} ${y + 3.4}" fill="#ff8fa0"/><path d="M${x - 5.5} ${y + 0.6} H${x + 5.5}" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>`;
  }

  // 따로 그린 탈것의 얼굴 자리: [눈 가운데 x, y, 크기]. 몸통 앞쪽(오른쪽)에 눈과 웃는 입을 그려요.
  // (말마차·루돌프 썰매처럼 동물이 끄는 것, 얼굴이 이미 있는 거북이 등, 램프 요정이 탄 양탄자, 창이 꽉 찬 가마, 마법 빗자루는 얼굴을 넣지 않아요)
  // 탄 동물의 얼굴 바로 옆이라 얼굴이 두 개로 겹쳐 보이는 탈것도 넣지 않아요
  // (인력거, 한성 전차, 전투기, 헬리콥터, 수상 비행기, 글라이더, 황포 돛배, 요트, 어선, 지하철, 기차, 포클레인, 덤프트럭, 레미콘, 크레인차, 콤바인, 농업용 드론)
  const FACES = {
    stonecart: [73, 34, 4.6], hwacha: [79, 28, 6.7], steam: [88, 33, 6],
    tiller: [100, 32, 3.8], tank: [82, 26, 4.5], spg: [75, 21, 8], x_rocket: [91, 37, 5.4], x_ufo: [85, 40, 6.8],
    x_cloud: [80, 42, 5.5], p_balloon: [60, 16, 8], s_banana: [98, 47, 4.5], x_paperplane: [75, 38, 4.5],
    x_sled: [75, 45, 3.5], p_airliner: [76, 33, 5.4], p_light: [95, 37, 5],
    p_biplane: [92, 36, 4.8], p_blimp: [87, 19, 8],
    p_aerobatic: [100, 36, 4], s_turtle: [81, 37, 5.4], s_panokseon: [85, 47, 5],
    s_carrier: [87, 48, 4.5], s_submarine: [85, 48, 7.5], s_cruise: [87, 51, 5.4], s_motorboat: [89, 48, 6.8],
    s_container: [88, 50, 4.5], t_forklift: [75, 42, 6.8], f_tractor: [98, 40, 6.1], f_transplanter: [89, 40, 4.8]
  };
  function objFace(kind, id) {
    const f = FACES[kind];
    if (!f) return '';
    const [x, y, r] = f, mx = x + r * 0.15, my = y + r * 1.05, w = r * 0.75;
    return toonEyes(x, y, r, id + 'o') +
      `<ellipse cx="${f1(x - r * 1.35)}" cy="${f1(my - r * 0.1)}" rx="${f1(r * 0.42)}" ry="${f1(r * 0.24)}" fill="#ff7f99" opacity=".5"/><ellipse cx="${f1(x + r * 1.35)}" cy="${f1(my - r * 0.1)}" rx="${f1(r * 0.42)}" ry="${f1(r * 0.24)}" fill="#ff7f99" opacity=".5"/>` +
      `<path d="M${f1(mx - w)} ${f1(my)} Q${f1(mx)} ${f1(my + w * 1.1)} ${f1(mx + w)} ${f1(my)} Q${f1(mx)} ${f1(my + w * 0.35)} ${f1(mx - w)} ${f1(my)} Z" fill="#5a1d2c" stroke="#2a2430" stroke-width=".7" stroke-linejoin="round"/>`;
  }

  // ===== 애니메이션 영화처럼 표정이 풍부한 캐릭터 (모두 직접 그린 캐릭터예요) =====
  // 큰 눈: 흰자, 색이 있는 눈동자, 반짝임 두 개, 속눈썹(lash)
  function filmEye(x, y, r, iris, lash) {
    return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 0.82)}" ry="${f1(r)}" fill="#fff" stroke="#3a2a22" stroke-width=".55"/>` +
      `<circle cx="${f1(x + r * 0.14)}" cy="${f1(y + r * 0.12)}" r="${f1(r * 0.6)}" fill="${iris}"/>` +
      `<circle cx="${f1(x + r * 0.18)}" cy="${f1(y + r * 0.16)}" r="${f1(r * 0.32)}" fill="#140c08"/>` +
      `<circle cx="${f1(x - r * 0.06)}" cy="${f1(y - r * 0.18)}" r="${f1(r * 0.22)}" fill="#fff"/><circle cx="${f1(x + r * 0.36)}" cy="${f1(y + r * 0.4)}" r="${f1(r * 0.1)}" fill="#fff"/>` +
      (lash ? `<path d="M${f1(x + r * 0.3)} ${f1(y - r * 0.92)} l${f1(r * 0.35)} ${f1(-r * 0.45)} M${f1(x + r * 0.62)} ${f1(y - r * 0.7)} l${f1(r * 0.45)} ${f1(-r * 0.3)} M${f1(x + r * 0.78)} ${f1(y - r * 0.38)} l${f1(r * 0.45)} ${f1(-r * 0.08)}" stroke="#2a1c16" stroke-width=".7" stroke-linecap="round"/>` : '');
  }

  // 말·순록: 오른쪽을 보는 통통한 몸, 큰 머리, 웃는 주둥이 (o.mane: 갈기 색, o.antler: 뿔, o.redNose: 빨간 코)
  function filmHoofed(o) {
    const B = o.body, D = o.dark, L = o.light;
    let g = o.mane
      ? `<path d="M85 34 Q71 33 73 51 Q78 44 87 40 Z" fill="${o.mane}"/><path d="M80 37 Q75 41 76 48" stroke="${shade(o.mane, 0.25)}" stroke-width=".8" fill="none"/>`
      : `<ellipse cx="83" cy="34" rx="3.2" ry="2.6" fill="#fff8ee"/>`;
    // 뒤쪽 다리는 진하게, 앞쪽 다리는 밝게
    [[86, D], [100, D], [91, B], [106, B]].forEach(([x, c]) => {
      g += `<rect x="${x}" y="43" width="5" height="17" rx="2.5" fill="${c}"/><rect x="${x - 0.4}" y="58.5" width="5.8" height="4.2" rx="1.4" fill="#3b2a22"/>`;
    });
    g += `<ellipse cx="95" cy="39" rx="14.5" ry="10.5" fill="${B}"/><ellipse cx="96" cy="44" rx="9" ry="4.5" fill="${L}" opacity=".75"/>` +
      `<ellipse cx="91" cy="35" rx="7" ry="3" fill="#fff" opacity=".18"/>`;
    // 목과 머리
    g += `<path d="M100 37 Q101 24 106 17 L115 20 Q111 28 110 41 Z" fill="${B}"/>`;
    if (o.mane) g += `<path d="M106 10 Q101 12 103 16 Q98 18 101 22 Q96 25 100 28 Q96 32 100 36 L104 34 Q104 24 108 15 Z" fill="${o.mane}"/>`;
    // 귀
    g += `<path d="M105.5 12.5 L102.5 4.5 L109 9 Z" fill="${B}"/><path d="M110 10.5 L111 3 L114.6 9.5 Z" fill="${B}"/><path d="M111.2 9 L111.6 5.2 L113.4 8.8 Z" fill="#f4a7a0"/>`;
    if (o.antler) g += `<path d="M106 9 Q103 3 98 0 M101.5 2 L100 -2.5 M104 5 L100.5 5.5 M112 8 Q114 1 119 -1 M116 0 L117 -4 M113.5 4 L117 4.5" stroke="${o.antler}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
    g += `<ellipse cx="111" cy="18" rx="8" ry="7.4" fill="${B}" transform="rotate(10 111 18)"/>`;
    if (o.mane) g += `<path d="M106.5 11 Q109 7 112 10.5 Q110 10 109.5 13 Q108 11 106.5 13 Z" fill="${o.mane}"/>`; // 앞머리
    // 주둥이, 콧구멍, 웃는 입
    g += `<ellipse cx="115.5" cy="23.5" rx="4.8" ry="4" fill="${L}"/><ellipse cx="117.6" cy="22.4" rx=".7" ry=".5" fill="${D}"/>` +
      `<path d="M112.6 25.4 Q115 27.8 117.6 25.2" stroke="#3a2a22" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
    if (o.redNose) g += `<circle cx="119" cy="22.2" r="5" fill="#ff3b30" opacity=".22"/><circle cx="119" cy="22.2" r="2.7" fill="#ff3b30"/><circle cx="118.2" cy="21.4" r=".8" fill="#fff" opacity=".8"/>`;
    // 큰 눈과 눈썹, 볼
    g += filmEye(109.6, 16.4, 2.6, o.iris || '#7a4a22', o.lash) + filmEye(114.6, 16, 2.3, o.iris || '#7a4a22', o.lash) +
      `<path d="M107.6 12.2 q2 -1.2 3.8 -.2 M113.2 11.9 q1.7 -.9 3.2 .1" stroke="${D}" stroke-width=".8" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="110" cy="21.3" rx="2" ry="1.1" fill="#ff7f99" opacity=".55"/>`;
    return `<g transform="translate(-3 0)">${g}</g>`; // 주둥이가 그림 밖으로 잘리지 않게 조금 왼쪽으로
  }

  // 거북이 등: 표정이 살아 있는 거북이 머리
  function filmTurtleHead() {
    return `<path d="M96 46 Q102 44 104 37" stroke="#6fbe6a" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="108" cy="33" rx="10" ry="9" fill="#7cc874"/><ellipse cx="110" cy="38" rx="6.5" ry="4" fill="#bfe8b4"/>` +
      `<path d="M101 26 q2 -1 3 0 M107 24.5 q2 -1 3 0" stroke="#4f9a4a" stroke-width=".7" fill="none"/>` +
      filmEye(105.2, 31, 2.9, '#5a7a2a') + filmEye(111.6, 30.6, 2.7, '#5a7a2a') +
      `<path d="M102.6 26.6 q2.2 -1.3 4.2 -.2 M109.4 26.2 q2 -1.1 3.8 .1" stroke="#3e7a3a" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
      `<path d="M105.6 36.4 Q109.5 41.6 114 36" fill="#6a2234" stroke="#3a2a22" stroke-width=".7"/><path d="M107.6 38.6 Q109.5 40.6 111.8 38.4" fill="#ff8fa0"/>` +
      `<ellipse cx="103.4" cy="35.4" rx="2" ry="1.1" fill="#ff7f99" opacity=".55"/><ellipse cx="115.4" cy="34.8" rx="1.6" ry="1" fill="#ff7f99" opacity=".55"/>`;
  }

  // 양탄자: 황금 램프에서 연기를 타고 나온 보라색 램프 요정(직접 그린 캐릭터)
  function lampGenie(x) {
    const S = '#b99af5', SD = '#8f6fd6';
    return `<path d="M${x - 3} 37 C${x - 11} 30 ${x + 6} 28 ${x - 4} 21 L${x + 4} 21 C${x + 10} 28 ${x - 2} 31 ${x + 3} 37 Z" fill="${S}" opacity=".92"/>` +
      // 몸통과 조끼
      `<ellipse cx="${x}" cy="15" rx="9" ry="7.5" fill="${S}"/><path d="M${x - 8} 12 Q${x - 6} 21 ${x - 2} 22 L${x - 3} 9 Z M${x + 8} 12 Q${x + 6} 21 ${x + 2} 22 L${x + 3} 9 Z" fill="#e2412e"/>` +
      `<path d="M${x - 8} 19 H${x + 8}" stroke="#f2c14e" stroke-width="2.2" stroke-linecap="round"/>` +
      // 팔: 왼손은 허리, 오른손은 번쩍
      `<path d="M${x - 8} 11 Q${x - 14} 14 ${x - 10} 19" stroke="${S}" stroke-width="3.6" fill="none" stroke-linecap="round"/>` +
      `<path d="M${x + 8} 10 Q${x + 14} 6 ${x + 14} 0" stroke="${S}" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="${x + 14}" cy="-1" r="2.6" fill="${S}"/>` +
      `<path d="M${x + 13} 5 h3 M${x - 13} 15 h3" stroke="#f2c14e" stroke-width="1.6" stroke-linecap="round"/>` +
      // 머리, 뾰족한 귀, 터번
      `<path d="M${x - 7} 0 L${x - 10} -3 L${x - 7} 2 Z M${x + 7} 0 L${x + 10} -3 L${x + 7} 2 Z" fill="${SD}"/>` +
      `<circle cx="${x}" cy="1" r="7.5" fill="${S}"/>` +
      `<path d="M${x - 8} -3 Q${x - 8} -12 ${x} -12.5 Q${x + 8} -12 ${x + 8} -3 Q${x} -5.5 ${x - 8} -3 Z" fill="#f6a623"/><path d="M${x - 6} -7 Q${x} -9 ${x + 6} -7 M${x - 7} -4.6 Q${x} -7 ${x + 7} -4.6" stroke="#d4861a" stroke-width=".7" fill="none"/>` +
      `<circle cx="${x}" cy="-5.6" r="1.8" fill="#e2412e"/><circle cx="${x - .5}" cy="-6.1" r=".6" fill="#fff" opacity=".8"/>` +
      // 얼굴: 큰 눈, 굵은 눈썹, 활짝 웃는 입
      filmEye(x - 2.9, 0.6, 2.3, '#3a2a6b') + filmEye(x + 2.9, 0.6, 2.3, '#3a2a6b') +
      `<path d="M${x - 5.4} -2.6 q2.2 -1.4 4.2 -.3 M${x + 1.2} -2.9 q2 -1.1 4.2 .3" stroke="#3a2470" stroke-width="1" fill="none" stroke-linecap="round"/>` +
      `<path d="M${x - 3.6} 4.2 Q${x} 8.6 ${x + 3.6} 4.2 Z" fill="#5a1d2c"/><path d="M${x - 3.2} 4.5 H${x + 3.2}" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` +
      `<ellipse cx="${x - 5}" cy="3.6" rx="1.5" ry=".9" fill="#ff7f99" opacity=".6"/><ellipse cx="${x + 5}" cy="3.6" rx="1.5" ry=".9" fill="#ff7f99" opacity=".6"/>` +
      // 황금 램프
      `<path d="M${x + 7} 41 Q${x + 15} 40 ${x + 19} 35 Q${x + 15} 42 ${x + 8} 45 Z" fill="#e0a83a"/>` +
      `<path d="M${x - 8} 40 Q${x - 14} 39 ${x - 13} 43 Q${x - 12} 46 ${x - 8} 44" stroke="#c48a2a" stroke-width="1.6" fill="none"/>` +
      `<ellipse cx="${x}" cy="42" rx="9" ry="4.6" fill="#f2c14e" stroke="#b8862a" stroke-width=".8"/><ellipse cx="${x - 2}" cy="40.6" rx="4" ry="1.4" fill="#fff" opacity=".45"/>` +
      `<ellipse cx="${x}" cy="37.8" rx="4" ry="1.6" fill="#e0a83a"/><circle cx="${x}" cy="36.3" r="1.2" fill="#e0a83a"/>`;
  }

  // 빗자루: 별 모자와 줄무늬 목도리를 한 꼬마 마법사(직접 그린 캐릭터), 마법 지팡이 끝에 별
  function littleWizard(x, y) {
    const skin = '#ffdcbf';
    return `<path d="M${x - 8} ${y} Q${x - 17} ${y + 12} ${x - 13} ${y + 19} L${x + 11} ${y + 16} Q${x + 13} ${y + 8} ${x + 8} ${y} Z" fill="#3a2470"/>` + // 망토
      `<path d="M${x - 3} ${y + 12} L${x - 6} ${y + 24} M${x + 3} ${y + 12} L${x + 4} ${y + 24}" stroke="#2c2a3a" stroke-width="3.2" stroke-linecap="round"/>` +
      `<ellipse cx="${x - 6.5}" cy="${y + 25}" rx="2.8" ry="1.6" fill="#6b3a1e"/><ellipse cx="${x + 4.5}" cy="${y + 25}" rx="2.8" ry="1.6" fill="#6b3a1e"/>` +
      `<path d="M${x - 6} ${y} Q${x - 8} ${y + 12} ${x - 5} ${y + 15} H${x + 5} Q${x + 8} ${y + 12} ${x + 6} ${y} Z" fill="#5b3a8c"/>` + // 옷
      // 목도리(주황·보라 줄무늬)가 뒤로 휘날려요
      `<path d="M${x - 5} ${y} Q${x - 15} ${y + 1} ${x - 22} ${y - 4} L${x - 21} ${y + 1} Q${x - 13} ${y + 5} ${x - 4} ${y + 3} Z" fill="#f39a1c"/>` +
      `<path d="M${x - 10} ${y + 0.5} l-1 3.6 M${x - 15} ${y - 0.6} l-1 3.6 M${x - 19.5} ${y - 2.6} l-.6 3.6" stroke="#6b3fa0" stroke-width="1.6"/>` +
      `<rect x="${x - 6.5}" y="${y - 1.6}" width="13" height="3.6" rx="1.8" fill="#f39a1c"/><path d="M${x - 2} ${y - 1.6} v3.6 M${x + 2.5} ${y - 1.6} v3.6" stroke="#6b3fa0" stroke-width="1.6"/>` +
      // 지팡이를 든 팔과 별
      `<path d="M${x + 6} ${y + 3} Q${x + 11} ${y + 3} ${x + 13} ${y - 1}" stroke="#5b3a8c" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="${x + 13.5}" cy="${y - 1.6}" r="1.9" fill="${skin}"/>` +
      `<path d="M${x + 13.5} ${y - 1.6} L${x + 22} ${y - 9}" stroke="#6b4423" stroke-width="1.4" stroke-linecap="round"/>` + sparkle(x + 23, y - 10, 3.6, '#ffe066') +
      // 얼굴
      `<circle cx="${x}" cy="${y - 9}" r="7.5" fill="${skin}"/><ellipse cx="${x - 7.3}" cy="${y - 8.5}" rx="1.4" ry="2" fill="${skin}"/>` +
      `<path d="M${x - 7} ${y - 11} Q${x - 6} ${y - 16.5} ${x} ${y - 16.5} Q${x + 6.5} ${y - 16.5} ${x + 7} ${y - 11} L${x + 4} ${y - 13} L${x + 2.5} ${y - 11.5} L${x} ${y - 13.5} L${x - 2.5} ${y - 11.5} L${x - 4.5} ${y - 13.5} Z" fill="#7a4a2a"/>` + // 앞머리
      filmEye(x - 2.6, y - 8.6, 2.2, '#6b4a2a') + filmEye(x + 2.8, y - 8.6, 2.1, '#6b4a2a') +
      `<path d="M${x - 5} ${y - 11.6} q2 -1 3.6 0 M${x + 1.2} ${y - 11.6} q2 -1 3.6 0" stroke="#5a3a22" stroke-width=".8" fill="none" stroke-linecap="round"/>` +
      `<path d="M${x - 2.2} ${y - 4.6} Q${x} ${y - 2.4} ${x + 2.4} ${y - 4.6}" stroke="#6a2234" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="${x - 4.8}" cy="${y - 5.6}" rx="1.5" ry=".9" fill="#ff7f99" opacity=".6"/><ellipse cx="${x + 5}" cy="${y - 5.6}" rx="1.5" ry=".9" fill="#ff7f99" opacity=".6"/>` +
      // 별 모자
      `<path d="M${x - 9} ${y - 14} Q${x - 2} ${y - 22} ${x - 1} ${y - 35} Q${x + 3} ${y - 22} ${x + 9} ${y - 14} Z" fill="#4a2a6b"/>` +
      `<path d="M${x - 12} ${y - 14} H${x + 12}" stroke="#3a1f5c" stroke-width="3" stroke-linecap="round"/><path d="M${x - 7.5} ${y - 16} Q${x} ${y - 18} ${x + 7.5} ${y - 16}" stroke="#f2c14e" stroke-width="1.6" fill="none"/>` +
      `<path d="M${x + 1} ${y - 25} l.9 1.9 l2 .2 l-1.5 1.3 l.5 2 l-1.9 -1.1 l-1.9 1.1 l.5 -2 l-1.5 -1.3 l2 -.2 Z" fill="#ffe066"/>`;
  }

  // ===== 뒷모습: 큰 화면 3D(뒤에서 따라가는 시점)에 써요 =====
  // 그림 틀은 가로 120, 세로 -30~70, 땅은 y=66, 가운데는 x=60.
  // 탈것 무리마다 공통 틀(승용차·상자차·궤도차·비행기·배·상상 탈것·동물)에 몸 색과 줄무늬 색을 입히고,
  // 탄 동물은 뒤돌아보는 얼굴로 창문에 보여요. 동물 캐릭터는 같은 털·귀·꼬리로 등을 그려요.
  let rearUid = 0, FLUFF_REAR = false;
  const rearDefs = (id, c) => `<defs>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.body, 0.35)}"/><stop offset=".45" stop-color="${c.body}"/><stop offset="1" stop-color="${shade(c.body, -0.3)}"/></linearGradient>
      <linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
      <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f5fc"/><stop offset=".6" stop-color="#a9cde3"/><stop offset="1" stop-color="#7fa4c0"/></linearGradient>
      <radialGradient id="${id}s"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>`;
  const rShadow = (id, rx, y) => `<ellipse cx="60" cy="${y || 66}" rx="${rx}" ry="${f1(rx * 0.1 + 2.5)}" fill="url(#${id}s)"/>`;
  const rTire = (x, top, w) => `<rect x="${f1(x - w / 2)}" y="${top}" width="${w}" height="${66 - top}" rx="${f1(w * 0.36)}" fill="#26262b"/>` +
    `<path d="M${f1(x - w / 2 + 2)} ${top + 4} H${f1(x + w / 2 - 2)} M${f1(x - w / 2 + 2)} ${top + 9} H${f1(x + w / 2 - 2)}" stroke="#4a4a52" stroke-width="1.4"/>`;
  const rTail = (x, y, w, h, round) => round
    ? `<circle cx="${x}" cy="${y}" r="${w / 2}" fill="#ff4b3e" stroke="#9c1c14" stroke-width=".8"/><circle cx="${f1(x - w * 0.15)}" cy="${f1(y - w * 0.15)}" r="${f1(w * 0.15)}" fill="#ffd0c8"/>`
    : `<rect x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${w}" height="${h}" rx="${f1(Math.min(w, h) * 0.35)}" fill="#ff4b3e" stroke="#9c1c14" stroke-width=".8"/><rect x="${f1(x - w / 2 + 1.2)}" y="${f1(y - h / 2 + 1)}" width="${f1(w * 0.45)}" height="${f1(h * 0.35)}" rx="1" fill="#ffd0c8" opacity=".8"/>`;
  const rPlate = (y, c) => `<rect x="50" y="${y}" width="20" height="7" rx="1.5" fill="#fff" stroke="${shade(c.stripe, -0.25)}" stroke-width="1"/><path d="M53 ${y + 3.5} H67" stroke="#8a8f99" stroke-width="1.4" stroke-dasharray="2 1.4"/>`;
  const rBumper = (L, R, y) => `<rect x="${L - 1}" y="${y}" width="${R - L + 2}" height="6" rx="3" fill="#e3e5ec" stroke="#a9adba" stroke-width=".6"/>`;
  // 옆면이 붙는 탈것은 옆 창문에 얼굴이 보이니, 뒤에서는 뒤통수만(얼굴이 두 개로 보이지 않게)
  const rFace = (P, x, y, r) => (P.back ? driverBack(P.c.driver, x, y, r) : driver(P.c.driver, x, y, r));
  function driverBack(kind, x, y, r) {
    const s = driver(kind, x, y, r), key = `<circle cx="${x}" cy="${y}" r="${r}" fill="`, at = s.indexOf(key);
    const col = at >= 0 ? s.slice(at + key.length, s.indexOf('"', at + key.length)) : SKIN;
    return s + `<circle cx="${x}" cy="${y}" r="${f1(r * 0.94)}" fill="${col}"/><ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.42)}" rx="${f1(r * 0.36)}" ry="${f1(r * 0.2)}" fill="#fff" opacity=".28"/>`;
  }
  const rBodyAttr = (P) => `fill="url(#${P.id}b)" stroke="${P.dark}" stroke-width="1.1" stroke-linejoin="round"`;
  // 창문 안에 뒤돌아보는 운전자
  function rWin(P, d, x, y, r) {
    const k = P.id + 'v' + (++rearUid);
    return `<defs><clipPath id="${k}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="url(#${P.id}w)" stroke="${P.deep}" stroke-width=".8"/>` +
      `<g clip-path="url(#${k})">${rFace(P, x, y, r)}<path d="${d}" fill="#fff" opacity=".1"/></g>`;
  }
  const rRect = (x, y, w, h) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
  const rOval = (x, y, rx, ry) => `M${x - rx} ${y} A${rx} ${ry} 0 1 0 ${x + rx} ${y} A${rx} ${ry} 0 1 0 ${x - rx} ${y} Z`;
  // 물 위(배·돌고래): 물결과 하얀 물살
  const rWater = () => `<path d="M0 60 Q15 55 30 60 T60 60 T90 60 T120 60 V70 H0 Z" fill="#5fb8f0"/><path d="M0 60 Q15 55 30 60 T60 60 T90 60 T120 60" stroke="#fff" stroke-width="1.6" fill="none" opacity=".85"/>` +
    `<path d="M40 68 L60 61 L80 68" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>`;

  // 승용차: 뒷유리에 운전자 얼굴, 뒷등, 번호판, 범퍼
  function rCar(P, o) {
    const { c, id } = P, w = o.w, rw = o.rw, top = o.top, belt = o.belt, bot = o.bot || 60;
    const L = 60 - w, R = 60 + w;
    let g = rShadow(id, w + 8) + rTire(L + 7, bot - 8, 13) + rTire(R - 7, bot - 8, 13);
    const body = `M${L} ${bot - 3} V${belt + 6} Q${L} ${belt} ${L + 4} ${belt - 1} L${60 - rw} ${top + 5} Q${60 - rw + 1} ${top} ${60 - rw + 6} ${top} H${60 + rw - 6} Q${60 + rw - 1} ${top} ${60 + rw} ${top + 5} L${R - 4} ${belt - 1} Q${R} ${belt} ${R} ${belt + 6} V${bot - 3} Q${R} ${bot} ${R - 3} ${bot} H${L + 3} Q${L} ${bot} ${L} ${bot - 3} Z`;
    g += `<path d="${body}" ${rBodyAttr(P)}/><path d="${body}" fill="url(#${id}h)"/>`;
    const fr = Math.min((belt - top) * 0.36, rw * 0.42);
    g += rWin(P, `M${60 - rw + 4} ${top + 4} H${60 + rw - 4} L${R - 8} ${belt - 2} H${L + 8} Z`, 60, (top + belt) / 2 + fr * 0.4, fr);
    g += `<path d="M${L + 2} ${belt + 3} H${R - 2}" stroke="${c.stripe}" stroke-width="2.4" stroke-linecap="round"/>`;
    const ly = belt + 8;
    if (o.lights === 'bar') g += `<rect x="${L + 4}" y="${ly - 2}" width="${2 * w - 8}" height="4.5" rx="2.2" fill="#ff4b3e" stroke="#9c1c14" stroke-width=".7"/>`;
    else if (o.lights === 'round') g += rTail(L + 9, ly + 1, 8, 8, true) + rTail(R - 9, ly + 1, 8, 8, true);
    else if (o.lights === 'tall') g += rTail(L + 5, ly + 3, 5, 12) + rTail(R - 5, ly + 3, 5, 12);
    else g += rTail(L + 9, ly, 11, 6) + rTail(R - 9, ly, 11, 6);
    if (!o.noPlate) g += rPlate(bot - 13, c);
    g += rBumper(L, R, bot - 5);
    if (o.exhaust) [R - 14, L + 14].slice(0, o.exhaust).forEach(x => { g += `<ellipse cx="${x}" cy="${bot + 1.5}" rx="3" ry="2" fill="#4a4a50" stroke="#c9ccd6" stroke-width="1"/>`; });
    return g + (o.extra ? o.extra(P, o) : '');
  }
  const rSpare = (P, o) => `<circle cx="60" cy="${o.belt + 14}" r="9" fill="#26262b"/><circle cx="60" cy="${o.belt + 14}" r="4.4" fill="#c9ccd6" stroke="#8a8f99" stroke-width=".8"/>`;
  const rSpoiler = (P, o) => `<path d="M${64 - o.w} ${o.belt - 5} H${56 + o.w}" stroke="${P.deep}" stroke-width="3.6" stroke-linecap="round"/><path d="M${74 - o.w} ${o.belt - 4} V${o.belt + 1} M${46 + o.w} ${o.belt - 4} V${o.belt + 1}" stroke="${P.deep}" stroke-width="2.2"/>`;
  const rSiren = (y) => `<rect x="44" y="${y}" width="16" height="6" rx="2.5" fill="#ff3b30"/><rect x="60" y="${y}" width="16" height="6" rx="2.5" fill="#0a84ff"/><rect x="46" y="${y + 1}" width="5" height="2" rx="1" fill="#fff" opacity=".7"/><rect x="62" y="${y + 1}" width="5" height="2" rx="1" fill="#fff" opacity=".7"/>`;
  const rTaxi = (P, o) => `<rect x="48" y="${o.top - 8}" width="24" height="8.5" rx="2" fill="#ffd84a" stroke="#b8860b" stroke-width=".8"/><text x="60" y="${o.top - 1.6}" text-anchor="middle" font-size="6" font-weight="800" fill="#3a2a00" font-family="sans-serif">TAXI</text>`;

  // 상자처럼 높은 차(버스·트럭·기차): 뒷창이 있으면 그 안에, 없으면 옆으로 고개를 내민 운전자
  function rBox(P, o) {
    const { c, id } = P, w = o.w, top = o.top, bot = o.bot || 60, L = 60 - w, R = 60 + w, rr = o.round || 5;
    let g = rShadow(id, w + 8) + rTire(L + 8, bot - 8, o.tw || 14) + rTire(R - 8, bot - 8, o.tw || 14);
    if (o.peek) g += rFace(P, L + 1, top + 10, 8);
    g += `<rect x="${L}" y="${top}" width="${2 * w}" height="${bot - top}" rx="${rr}" ${rBodyAttr(P)}/><rect x="${L}" y="${top}" width="${2 * w}" height="${bot - top}" rx="${rr}" fill="url(#${id}h)"/>`;
    if (o.win) {
      const [wy, wh] = o.win;
      g += rWin(P, rRect(L + 7, wy, 2 * w - 14, wh), 60, wy + wh * 0.6, Math.min(wh * 0.38, 9));
    }
    const doorTop = o.win ? o.win[0] + o.win[1] + 3 : top + 4;
    if (o.doors) g += `<path d="M60 ${doorTop} V${bot - 7}" stroke="${P.deep}" stroke-width="1.2"/><path d="M56 ${(doorTop + bot) / 2} h-3 M64 ${(doorTop + bot) / 2} h3" stroke="#c9ccd6" stroke-width="2" stroke-linecap="round"/>`;
    if (o.band) g += `<rect x="${L}" y="${o.band}" width="${2 * w}" height="5" fill="${c.stripe}"/>`;
    if (o.cross) g += `<path d="M56 ${top + 12} h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6 Z" fill="#e2412e" stroke="#fff" stroke-width="1.2"/>`;
    if (o.ribs) for (let y = top + 6; y < bot - 10; y += 7) g += `<path d="M${L + 4} ${y} H${R - 4}" stroke="${P.deep}" stroke-width="1.2" opacity=".55"/>`;
    g += rTail(L + 5, bot - 12, 5, 11) + rTail(R - 5, bot - 12, 5, 11) + rPlate(bot - 13, c) + rBumper(L, R, bot - 5);
    if (o.siren) g += rSiren(top - 6);
    return g + (o.extra ? o.extra(P, o) : '');
  }
  // 무한궤도 차(전차·자주포·포클레인·콤바인)
  function rTreads(L, R, top) {
    let g = '';
    [L, R - 16].forEach(x => {
      g += `<rect x="${x}" y="${top}" width="16" height="${66 - top}" rx="5" fill="#2f3229" stroke="#1b1d17" stroke-width="1"/>`;
      for (let y = top + 4; y < 64; y += 5) g += `<path d="M${x + 2} ${y} H${x + 14}" stroke="#5b5f52" stroke-width="1.6"/>`;
    });
    return g;
  }
  function rCamo(P, pts) { return pts.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * 0.6)}" fill="${P.c.stripe}" opacity=".75"/>`).join(''); }
  // 큰 뒷바퀴 둘(트랙터·경운기)
  const rBigTire = (x, top, w) => `<rect x="${f1(x - w / 2)}" y="${top}" width="${w}" height="${66 - top}" rx="${f1(w * 0.42)}" fill="#26262b"/>` +
    Array.from({ length: Math.floor((66 - top - 6) / 6) }, (_, i) => `<path d="M${f1(x - w / 2 + 2)} ${top + 6 + i * 6} l${f1(w / 2 - 2)} 3 l${f1(w / 2 - 2)} -3" stroke="#4a4a52" stroke-width="1.6" fill="none"/>`).join('');
  // 옆에서 본 바퀴(얇은 타원): 마차·수레
  const rEdgeWheel = (x, y, ry, col) => `<ellipse cx="${x}" cy="${y}" rx="${f1(ry * 0.26)}" ry="${ry}" fill="${col || '#6b4423'}" stroke="#3a2412" stroke-width="1"/>`;

  // 비행기: 날개·몸통·꼬리날개, 몸통 뒤 동그란 창에 운전자
  function rPlane(P, o) {
    const { c, id } = P, B = rBodyAttr(P);
    let g = rShadow(id, o.shadow || 30);
    const wy = o.wingY, sp = o.span || 54, th = o.thick || 5;
    if (o.fin2) g += `<path d="M54 ${o.fy} L44 ${o.fy - 26} L49 ${o.fy - 26} L58 ${o.fy} Z M66 ${o.fy} L76 ${o.fy - 26} L71 ${o.fy - 26} L62 ${o.fy} Z" fill="${c.stripe}" stroke="${P.deep}" stroke-width=".8"/>`;
    else g += `<path d="M57 ${o.fy} L58.5 ${o.fy - (o.finH || 30)} H61.5 L63 ${o.fy} Z" fill="${c.stripe}" stroke="${P.deep}" stroke-width=".8"/>`;
    if (o.tStab) g += `<rect x="44" y="${o.fy - (o.finH || 30) - 1}" width="32" height="3" rx="1.5" fill="${c.body}" stroke="${P.dark}" stroke-width=".7"/>`;
    else g += `<path d="M42 ${o.fy + 1} H78" stroke="${P.dark}" stroke-width="3" stroke-linecap="round"/>`;
    const wing = y => `<path d="M60 ${y - th / 2} L${60 - sp} ${y + 1} L${60 - sp} ${y + th / 2 + 1} L60 ${y + th / 2} L${60 + sp} ${y + th / 2 + 1} L${60 + sp} ${y + 1} Z" ${B}/>`;
    if (o.wing2 != null) g += wing(o.wing2) + `<path d="M${60 - sp * 0.6} ${o.wing2} V${wy} M${60 + sp * 0.6} ${o.wing2} V${wy}" stroke="${P.deep}" stroke-width="1.4"/>`;
    if (!o.lowWing) g += wing(wy);
    g += `<ellipse cx="60" cy="${o.fusY}" rx="${o.fusR}" ry="${f1(o.fusR * (o.fusRy || 1))}" ${B}/><ellipse cx="60" cy="${o.fusY}" rx="${o.fusR}" ry="${f1(o.fusR * (o.fusRy || 1))}" fill="url(#${id}h)"/>`;
    if (o.lowWing) g += wing(wy);
    if (o.struts) g += `<path d="M${60 - sp * 0.45} ${wy + 2} L52 ${o.fusY + 4} M${60 + sp * 0.45} ${wy + 2} L68 ${o.fusY + 4}" stroke="${P.deep}" stroke-width="1.4"/>`;
    if (o.engines) [60 - o.engines, 60 + o.engines].forEach(x => { g += `<circle cx="${x}" cy="${wy + 7}" r="5.5" fill="#c9ccd6" stroke="#7c8291" stroke-width="1"/><circle cx="${x}" cy="${wy + 7}" r="3" fill="#3a3a40"/>`; });
    if (o.nozzle) g += `<circle cx="60" cy="${o.fusY + 2}" r="5.5" fill="#3a3a40" stroke="#7c8291" stroke-width="1.2"/><circle cx="60" cy="${o.fusY + 2}" r="3.2" fill="#ff9f0a" opacity=".9"/>`;
    if (o.gear) g += rTire(50, o.gear, 6) + rTire(70, o.gear, 6) + `<path d="M50 ${o.gear} L54 ${o.fusY + 6} M70 ${o.gear} L66 ${o.fusY + 6}" stroke="#7c8291" stroke-width="1.4"/>`;
    if (o.floats) g += [40, 80].map(x => `<path d="M${x} ${o.fusY + 8} V52" stroke="${P.deep}" stroke-width="1.4"/><ellipse cx="${x}" cy="55" rx="7" ry="5" fill="#f4f5f7" stroke="#8a8f99" stroke-width="1"/>`).join('') + rWater();
    const cy = o.canopyY != null ? o.canopyY : o.fusY, cr = o.canopyR || 6.5;
    g += rWin(P, rOval(60, cy, cr, cr * 0.95), 60, cy + cr * 0.15, cr * 0.82);
    return g;
  }
  // 배: 물결 위에 배 뒤쪽(선미), 위에 갑판·돛·굴뚝
  const rHull = (P, w, top, col) => `<path d="M${60 - w} ${top} H${60 + w} L${60 + w * 0.72} 63 H${60 - w * 0.72} Z" fill="${col || `url(#${P.id}b)`}" stroke="${P.deep}" stroke-width="1.1" stroke-linejoin="round"/><path d="M${60 - w} ${top + 1.5} H${60 + w}" stroke="${P.c.stripe}" stroke-width="3"/>`;

  const REAR = {
    // 승용차
    ev:     P => rCar(P, { w: 40, belt: 34, top: 12, rw: 30, lights: 'bar' }),
    suv:    P => rCar(P, { w: 42, belt: 33, top: 4, rw: 36, lights: 'tall', noPlate: true, extra: rSpare }),
    sport:  P => rCar(P, { w: 45, belt: 38, top: 20, rw: 27, exhaust: 2, extra: rSpoiler }),
    luxury: P => rCar(P, { w: 41, belt: 34, top: 10, rw: 31, lights: 'bar', exhaust: 2 }),
    hatch:  P => rCar(P, { w: 39, belt: 35, top: 8, rw: 33 }),
    pickup: P => rCar(P, { w: 42, belt: 30, top: 6, rw: 30, lights: 'tall' }),
    box:    P => rCar(P, { w: 38, belt: 32, top: -2, rw: 37, lights: 'tall' }),
    retro:  P => rCar(P, { w: 37, belt: 37, top: 12, rw: 25, lights: 'round' }),
    jeep:   P => rCar(P, { w: 41, belt: 32, top: 6, rw: 38, noPlate: true, extra: rSpare }),
    taxi:   P => rCar(P, { w: 40, belt: 34, top: 10, rw: 31, extra: rTaxi }),
    police: P => rCar(P, { w: 41, belt: 34, top: 10, rw: 31, lights: 'bar', extra: (P2, o) => rSiren(o.top - 6) }),
    // 큰 차
    ambulance: P => rBox(P, { w: 41, top: -6, win: [0, 10], doors: true, cross: false, siren: true, band: 30, extra: () => `<path d="M56 34 h8 v4 h4 v6 h-4 v4 h-8 v-4 h-4 v-6 h4 Z" fill="#e2412e"/>` }),
    fire:   P => rBox(P, { w: 44, top: -2, peek: true, siren: true, band: 22, extra: () =>
      `<rect x="22" y="-10" width="76" height="8" rx="2" fill="none" stroke="#c9ccd6" stroke-width="2"/>` + [30, 42, 54, 66, 78, 90].map(x => `<path d="M${x} -10 v8" stroke="#c9ccd6" stroke-width="1.6"/>`).join('') +
      `<circle cx="46" cy="38" r="7" fill="#f5f5f7" stroke="#8a8f99" stroke-width="1.2"/><circle cx="46" cy="38" r="3" fill="#8a8f99"/><circle cx="74" cy="38" r="7" fill="#f5f5f7" stroke="#8a8f99" stroke-width="1.2"/><circle cx="74" cy="38" r="3" fill="#8a8f99"/>` }),
    bus:    P => rBox(P, { w: 44, top: -16, win: [-10, 20], band: 16, extra: () => `<rect x="34" y="26" width="52" height="8" rx="2" fill="#2b2b33" opacity=".7"/>` }),
    mtruck: P => rBox(P, { w: 44, top: -4, extra: (P2) =>
      `<path d="M17 18 Q17 -12 60 -12 Q103 -12 103 18 V40 H17 Z" fill="${shade(P2.c.body, -0.12)}" stroke="${P2.deep}" stroke-width="1"/><path d="M26 40 V16 Q26 -2 60 -2 Q94 -2 94 16 V40 Z" fill="#26271f"/>` + rFace(P2, 60, 22, 9) +
      rCamo(P2, [[30, 4, 6], [84, 8, 7], [46, -6, 5]]) }),
    dump:   P => rBox(P, { w: 44, top: 4, ribs: true, extra: (P2) => `<path d="M14 4 L22 -8 H98 L106 4 Z" fill="${shade(P2.c.body, -0.15)}" stroke="${P2.deep}" stroke-width="1"/><path d="M28 -6 Q40 -16 52 -8 Q64 -18 78 -8 Q88 -14 94 -6 Z" fill="#8a6a48"/>` + rFace(P2, 16, 0, 7.5) }),
    t_dump: P => REAR.dump(P),
    t_mixer: P => rBox(P, { w: 40, top: 30, peek: false, extra: (P2) => {
      let g = `<ellipse cx="60" cy="10" rx="34" ry="28" fill="url(#${P2.id}b)" stroke="${P2.dark}" stroke-width="1.1"/><ellipse cx="60" cy="10" rx="34" ry="28" fill="url(#${P2.id}h)"/>`;
      for (let i = -2; i <= 2; i++) g += `<path d="M${46 + i * 12} -16 Q${66 + i * 12} 10 ${46 + i * 12} 36" stroke="${P2.c.stripe}" stroke-width="3.2" fill="none" opacity=".9"/>`;
      return g + `<path d="M54 34 L60 44 L66 34 Z" fill="#9aa0ae"/>` + rFace(P2, 22, 24, 7);
    } }),
    t_subway: P => rBox(P, { w: 42, top: -18, round: 12, win: [-10, 22], doors: true, band: 18, tw: 8 }),
    t_train:  P => rBox(P, { w: 42, top: -16, round: 16, win: [-8, 20], band: 16, tw: 8, extra: P2 => `<path d="M30 -16 Q60 -26 90 -16" stroke="${P2.c.stripe}" stroke-width="3" fill="none"/>` }),
    tram:   P => rBox(P, { w: 40, top: -12, round: 10, win: [-6, 18], doors: true, band: 18, tw: 8, extra: () => `<path d="M60 -12 L50 -24 L66 -30" stroke="#4a4a52" stroke-width="1.8" fill="none"/><path d="M40 -30 H90" stroke="#4a4a52" stroke-width="1"/>` }),
    steam:  P => rBox(P, { w: 42, top: 0, round: 6, tw: 9, extra: (P2) => `<path d="M22 0 Q30 -12 40 -4 Q50 -14 60 -5 Q72 -15 80 -4 Q90 -12 98 0 Z" fill="#26262b"/>` + rFace(P2, 60, -6, 7.5) +
      `<circle cx="44" cy="-20" r="7" fill="#f4f5f7" opacity=".9"/><circle cx="56" cy="-26" r="9" fill="#e9ebf1" opacity=".85"/><circle cx="72" cy="-22" r="6" fill="#f4f5f7" opacity=".8"/>` }),
    // 궤도 차
    tank: P => rShadow(P.id, 52) + rTreads(10, 110, 36) +
      `<path d="M24 60 V40 Q24 32 32 32 H88 Q96 32 96 40 V60 Z" ${rBodyAttr(P)}/>` + rCamo(P, [[38, 44, 7], [80, 50, 8], [60, 40, 5]]) +
      rFace(P, 60, 6, 8) + `<path d="M36 32 Q38 12 60 10 Q82 12 84 32 Z" ${rBodyAttr(P)}/><ellipse cx="60" cy="12" rx="10" ry="3" fill="${P.deep}"/>` + rCamo(P, [[48, 24, 6], [72, 20, 5]]) +
      `<path d="M78 12 L84 -16" stroke="#3a3a40" stroke-width="1.2"/>`,
    spg: P => rShadow(P.id, 52) + rTreads(10, 110, 36) + `<path d="M60 4 L62 -26" stroke="${P.deep}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M24 60 V38 H96 V60 Z" ${rBodyAttr(P)}/>` + rFace(P, 80, 0, 7.5) + `<path d="M30 38 L34 6 H86 L90 38 Z" ${rBodyAttr(P)}/>` + rCamo(P, [[44, 20, 7], [76, 28, 6], [56, 50, 8]]) +
      `<rect x="40" y="14" width="16" height="10" rx="2" fill="${P.deep}" opacity=".5"/>`,
    t_excavator: P => rShadow(P.id, 50) + rTreads(12, 108, 44) + `<rect x="24" y="44" width="72" height="14" rx="3" fill="#3a3a40"/>` +
      `<path d="M66 20 L80 -24 L88 -22 L76 22 Z" ${rBodyAttr(P)}/><path d="M80 -24 L96 -18 L92 -10 L84 -14 Z" fill="${P.deep}"/>` +
      `<rect x="24" y="0" width="38" height="44" rx="5" ${rBodyAttr(P)}/>` + rWin(P, rRect(29, 5, 28, 20), 43, 17, 8) + `<rect x="62" y="20" width="34" height="24" rx="8" ${rBodyAttr(P)}/>` +
      `<path d="M66 30 H92" stroke="${P.c.stripe}" stroke-width="3"/>`,
    t_forklift: P => rShadow(P.id, 40) + `<rect x="34" y="-22" width="6" height="58" fill="#7c8291"/><rect x="80" y="-22" width="6" height="58" fill="#7c8291"/>` +
      rTire(30, 46, 13) + rTire(90, 46, 13) + rFace(P, 60, 14, 9) +
      `<path d="M28 38 Q28 24 40 24 H80 Q92 24 92 38 V58 H28 Z" ${rBodyAttr(P)}/><path d="M32 24 V-4 M88 24 V-4 M30 -4 H90" stroke="#3a3a40" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M30 46 H90" stroke="${P.c.stripe}" stroke-width="5" stroke-dasharray="6 6"/>`,
    t_crane: P => rBox(P, { w: 44, top: 22, extra: (P2) => `<path d="M52 24 L44 -26 M68 24 L52 -26" stroke="${P2.c.stripe}" stroke-width="3.4"/><path d="M50 14 L64 6 M48 2 L60 -6 M46 -10 L56 -16" stroke="${P2.c.stripe}" stroke-width="1.8"/>` +
      `<path d="M14 54 H4 M106 54 H116" stroke="#3a3a40" stroke-width="4" stroke-linecap="round"/>` + rWin(P2, rRect(70, 0, 22, 18), 81, 10, 7.5) }),
    // 농기계
    f_tractor: P => rShadow(P.id, 52) + rBigTire(20, 22, 22) + rBigTire(100, 22, 22) +
      `<path d="M8 24 Q20 12 32 24 M88 24 Q100 12 112 24" stroke="url(#${P.id}b)" stroke-width="6" fill="none"/>` +
      `<rect x="36" y="-4" width="48" height="50" rx="5" ${rBodyAttr(P)}/><rect x="32" y="-10" width="56" height="7" rx="3" fill="${P.deep}"/>` + rWin(P, rRect(41, 0, 38, 26), 60, 15, 10) +
      `<rect x="40" y="46" width="40" height="12" rx="3" ${rBodyAttr(P)}/><path d="M54 58 h12 v6 h-12 Z" fill="#3a3a40"/>`,
    tiller: P => rShadow(P.id, 46) + rBigTire(24, 34, 18) + rBigTire(96, 34, 18) +
      `<rect x="40" y="28" width="40" height="22" rx="4" ${rBodyAttr(P)}/><path d="M48 50 L34 64 M72 50 L86 64" stroke="#3a3a40" stroke-width="3" stroke-linecap="round"/>` +
      `<rect x="50" y="18" width="20" height="12" rx="4" fill="${P.c.stripe}"/>` + rFace(P, 60, 8, 9),
    f_combine: P => rShadow(P.id, 52) + rTreads(12, 108, 44) + `<rect x="20" y="-10" width="80" height="62" rx="6" ${rBodyAttr(P)}/><rect x="20" y="-10" width="80" height="62" rx="6" fill="url(#${P.id}h)"/>` +
      `<path d="M26 -6 L10 -24" stroke="${P.c.stripe}" stroke-width="6" stroke-linecap="round"/>` + rWin(P, rRect(62, -4, 30, 18), 77, 7, 8) +
      `<path d="M28 20 H92 M28 28 H92" stroke="${P.deep}" stroke-width="1.4" opacity=".6"/><path d="M28 36 H92" stroke="${P.c.stripe}" stroke-width="4"/>`,
    f_transplanter: P => rShadow(P.id, 50) + rTire(30, 44, 12) + rTire(90, 44, 12) +
      `<rect x="8" y="40" width="104" height="8" rx="3" fill="#3a3a40"/>` + [16, 30, 44, 58, 72, 86, 100].map(x => `<path d="M${x} 40 q-3 -10 0 -16 M${x} 40 q3 -9 5 -13" stroke="#34c759" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('') +
      `<rect x="38" y="6" width="44" height="34" rx="6" ${rBodyAttr(P)}/>` + rFace(P, 60, 0, 9) + `<path d="M38 26 H82" stroke="${P.c.stripe}" stroke-width="3"/>`,
    f_drone: P => rShadow(P.id, 26, 66) + `<path d="M14 18 L106 18 M34 8 L86 8" stroke="#3a3a40" stroke-width="3" stroke-linecap="round"/>` +
      [[14, 18], [106, 18], [34, 8], [86, 8]].map(([x, y]) => `<ellipse cx="${x}" cy="${y - 4}" rx="13" ry="2.2" fill="#9aa0ae" opacity=".75"/><rect x="${x - 2}" y="${y - 4}" width="4" height="5" fill="#3a3a40"/>`).join('') +
      `<rect x="40" y="10" width="40" height="22" rx="8" ${rBodyAttr(P)}/>` + rWin(P, rOval(60, 20, 8, 7), 60, 21, 6.5) +
      `<path d="M44 32 L40 46 M76 32 L80 46 M36 46 H46 M74 46 H84" stroke="#3a3a40" stroke-width="2" stroke-linecap="round"/><rect x="52" y="32" width="16" height="8" rx="2" fill="${P.c.stripe}"/>`,
    // 전통 탈것
    stonecart: P => rShadow(P.id, 42) + `<ellipse cx="22" cy="48" rx="6" ry="17" fill="#8f8b84" stroke="#5c5852" stroke-width="1.4"/><ellipse cx="98" cy="48" rx="6" ry="17" fill="#8f8b84" stroke="#5c5852" stroke-width="1.4"/>` +
      rFace(P, 60, 16, 10) + `<rect x="26" y="24" width="68" height="26" rx="3" fill="#8b5a2b" stroke="#4a2c12" stroke-width="1.2"/><path d="M26 32 H94 M26 41 H94" stroke="#5a3a1e" stroke-width="1.2"/>`,
    gama: P => rShadow(P.id, 40) + `<path d="M40 46 V62 M48 46 V64 M72 46 V64 M80 46 V62" stroke="#3a2412" stroke-width="2.6" stroke-linecap="round"/>` +
      `<rect x="34" y="4" width="52" height="44" rx="3" ${rBodyAttr(P)}/>` + rWin(P, rRect(44, 12, 32, 22), 60, 25, 9.5) +
      `<path d="M44 12 H76 V22 Q60 28 44 22 Z" fill="${P.c.stripe}" opacity=".9"/><path d="M26 6 Q60 -14 94 6 L88 8 Q60 -4 32 8 Z" fill="#3a2a22"/>` +
      `<circle cx="28" cy="44" r="4" fill="#6b4423"/><circle cx="92" cy="44" r="4" fill="#6b4423"/><path d="M28 44 H40 M80 44 H92" stroke="#6b4423" stroke-width="3"/>`,
    carriage: P => rShadow(P.id, 46) + rEdgeWheel(20, 44, 20) + rEdgeWheel(100, 44, 20) + `<path d="M24 44 H96" stroke="#3a2412" stroke-width="3"/>` +
      `<path d="M30 54 V8 Q30 -6 60 -8 Q90 -6 90 8 V54 Z" ${rBodyAttr(P)}/>` + rWin(P, `M42 6 Q60 -2 78 6 V26 H42 Z`, 60, 17, 9.5) +
      `<path d="M30 34 H90" stroke="${P.c.stripe}" stroke-width="3"/><rect x="40" y="38" width="40" height="12" rx="2" fill="${P.deep}" opacity=".4"/>`,
    hwacha: P => rShadow(P.id, 46) + rEdgeWheel(18, 46, 18) + rEdgeWheel(102, 46, 18) + `<path d="M22 46 H98" stroke="#3a2412" stroke-width="3"/>` +
      `<rect x="26" y="0" width="68" height="40" rx="3" fill="#8b5a2b" stroke="#4a2c12" stroke-width="1.2"/>` +
      Array.from({ length: 20 }, (_, i) => `<circle cx="${33 + (i % 5) * 13.5}" cy="${7 + Math.floor(i / 5) * 9}" r="3.6" fill="#2a1a10" stroke="${P.c.stripe}" stroke-width="1.2"/>`).join('') +
      rFace(P, 102, 14, 8) + `<path d="M40 40 L36 60 M80 40 L84 60" stroke="#5a3a1e" stroke-width="3"/>`,
    rickshaw: P => rShadow(P.id, 44) + rEdgeWheel(22, 44, 20, '#2a2a35') + rEdgeWheel(98, 44, 20, '#2a2a35') +
      `<path d="M30 44 V10 Q30 -10 60 -10 Q90 -10 90 10 V44 Z" fill="#2a2a35" stroke="#111" stroke-width="1.2"/><path d="M38 44 V12 Q38 -2 60 -2 Q82 -2 82 12 V44 Z" fill="#4a1c22"/>` +
      rFace(P, 60, 18, 10) + `<rect x="32" y="40" width="56" height="12" rx="3" fill="${P.c.stripe}"/><path d="M30 0 H90" stroke="${P.c.stripe}" stroke-width="2"/>`,
    // 상상 탈것
    x_rudolph: P => rShadow(P.id, 44) + `<path d="M44 -14 L40 -26 M40 -20 L32 -24 M44 -14 L48 -24 M76 -14 L80 -26 M80 -20 L88 -24 M76 -14 L72 -24" stroke="#8b5a2b" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="60" cy="-8" rx="16" ry="9" fill="#a0703f"/>` +
      `<path d="M26 60 Q18 60 18 50 M94 60 Q102 60 102 50" stroke="#f5c242" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M24 62 H96" stroke="#f5c242" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M68 14 Q66 -2 80 -2 Q94 0 90 16 Z" fill="#8b5a2b"/>` + rFace(P, 46, 12, 9) +
      `<path d="M26 56 V26 Q26 18 34 18 H86 Q94 18 94 26 V56 Z" ${rBodyAttr(P)}/><path d="M26 26 H94" stroke="${P.c.stripe}" stroke-width="3"/>`,
    x_pumpkin: P => rShadow(P.id, 46) + rEdgeWheel(16, 46, 18, '#d4a72c') + rEdgeWheel(104, 46, 18, '#d4a72c') +
      `<ellipse cx="60" cy="26" rx="40" ry="32" ${rBodyAttr(P)}/>` + [36, 48, 72, 84].map(x => `<path d="M60 -6 Q${x} 26 60 58" stroke="${P.dark}" stroke-width="1.4" fill="none" opacity=".5"/>`).join('') +
      rWin(P, rOval(60, 24, 13, 11), 60, 26, 9.5) + `<path d="M60 -6 q-2 -8 6 -12" stroke="#3e9a4d" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    x_carpet: P => rShadow(P.id, 34) + rFace(P, 60, 14, 10) + `<rect x="46" y="22" width="28" height="18" rx="7" fill="${P.c.stripe}"/>` +
      `<path d="M16 50 L30 36 H90 L104 50 Z" ${rBodyAttr(P)}/><path d="M20 49 L32 38 H88 L100 49" stroke="${P.c.stripe}" stroke-width="2" fill="none"/>` +
      [20, 32, 44, 56, 68, 80, 92, 100].map(x => `<path d="M${x} 50 v5" stroke="${P.c.stripe}" stroke-width="2" stroke-linecap="round"/>`).join(''),
    x_broom: P => rShadow(P.id, 26) + `<path d="M60 40 L62 4" stroke="#8a5a2b" stroke-width="3.2" stroke-linecap="round"/>` +
      `<path d="M50 20 Q60 10 70 20 L74 38 H46 Z" fill="${P.c.stripe}"/>` + rFace(P, 60, 8, 9) + `<path d="M48 2 L60 -24 L72 2 Z" fill="${P.c.stripe}"/><path d="M44 2 H76" stroke="${shade(P.c.stripe, -0.3)}" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M60 40 L42 58 Q60 64 78 58 Z" fill="#d9a441" stroke="#8a6a28" stroke-width="1"/>` + [48, 54, 60, 66, 72].map(x => `<path d="M60 42 L${x} 59" stroke="#8a6a28" stroke-width=".8"/>`).join(''),
    x_cloud: P => rShadow(P.id, 30) + rFace(P, 60, 8, 10) + `<path d="${fuzz(60, 36, 44, 20, 16, 6)}" fill="#ffffff" stroke="#dbe9f5" stroke-width="1.2"/><path d="${fuzz(60, 40, 30, 10, 12, 3)}" fill="${P.c.stripe}" opacity=".25"/>`,
    x_rocket: P => rShadow(P.id, 22) + [0, 120, 240].map(a => `<path d="M60 24 L${f1(60 + Math.sin(a * Math.PI / 180) * 34)} ${f1(24 - Math.cos(a * Math.PI / 180) * 34)}" stroke="${P.c.stripe}" stroke-width="9" stroke-linecap="round"/>`).join('') +
      `<circle cx="60" cy="24" r="22" ${rBodyAttr(P)}/><circle cx="60" cy="24" r="17" fill="none" stroke="${P.c.stripe}" stroke-width="3"/>` +
      `<circle cx="60" cy="24" r="10" fill="#3a3a40"/><circle cx="60" cy="24" r="7" fill="#ff9f0a"/><circle cx="60" cy="24" r="4" fill="#fff6c2"/>` + rWin(P, rOval(60, -4, 7, 7), 60, -3, 6),
    x_ufo: P => rShadow(P.id, 30) + rWin(P, `M38 22 Q38 -6 60 -6 Q82 -6 82 22 Z`, 60, 10, 11) + `<ellipse cx="60" cy="28" rx="54" ry="11" ${rBodyAttr(P)}/>` +
      [16, 32, 48, 60, 72, 88, 104].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 31 : 29}" r="2.4" fill="${P.c.stripe}"/>`).join('') + `<path d="M48 39 L40 56 H80 L72 39 Z" fill="#fff6a8" opacity=".35"/>`,
    x_paperplane: P => rShadow(P.id, 30) + rFace(P, 60, 4, 9) + `<path d="M60 30 L6 12 L60 22 Z" fill="#ffffff" stroke="#c9ccd6" stroke-width="1"/><path d="M60 30 L114 12 L60 22 Z" fill="#f2f4f7" stroke="#c9ccd6" stroke-width="1"/>` +
      `<path d="M60 22 L56 42 L60 40 L64 42 Z" fill="#e3e6ec" stroke="#c9ccd6" stroke-width="1"/><path d="M60 22 V40" stroke="${P.c.stripe}" stroke-width="1.6"/>`,
    x_sled: P => rShadow(P.id, 40) + `<path d="M26 62 Q16 62 18 50 M94 62 Q104 62 102 50" stroke="#d7261e" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M24 62 H96" stroke="#d7261e" stroke-width="3" stroke-linecap="round"/>` +
      rFace(P, 60, 18, 10) + `<rect x="28" y="30" width="64" height="24" rx="5" ${rBodyAttr(P)}/><path d="M28 38 H92 M28 46 H92" stroke="${P.dark}" stroke-width="1.1"/>`,
    x_turtle: P => rShadow(P.id, 44) + `<ellipse cx="34" cy="58" rx="9" ry="6" fill="#4f9a5a"/><ellipse cx="86" cy="58" rx="9" ry="6" fill="#4f9a5a"/><path d="M60 54 L56 64 L64 64 Z" fill="#4f9a5a"/>` +
      rFace(P, 60, 2, 9) + `<path d="M16 52 Q16 6 60 6 Q104 6 104 52 Z" ${rBodyAttr(P)}/>` +
      `<path d="M60 10 L48 22 L54 36 H66 L72 22 Z M36 22 L48 22 M72 22 L84 22 M54 36 L46 50 M66 36 L74 50" stroke="${P.deep}" stroke-width="1.4" fill="none" opacity=".7"/><path d="M16 52 H104" stroke="${P.c.stripe}" stroke-width="3"/>`,
    // 비행기
    p_airliner:  P => rPlane(P, { fy: 18, finH: 34, wingY: 32, span: 56, fusY: 30, fusR: 14, engines: 28, canopyY: 30, canopyR: 7.5, shadow: 40 }),
    p_fighter:   P => rPlane(P, { fy: 28, fin2: true, wingY: 36, span: 46, thick: 4, fusY: 34, fusR: 11, fusRy: 0.85, nozzle: true, canopyY: 20, canopyR: 7, shadow: 34 }),
    p_light:     P => rPlane(P, { fy: 26, finH: 30, wingY: 14, span: 56, thick: 6, fusY: 34, fusR: 12, struts: true, gear: 52, canopyY: 26, canopyR: 6.5, shadow: 30 }),
    p_biplane:   P => rPlane(P, { fy: 24, finH: 26, wingY: 40, wing2: 12, span: 50, thick: 5, fusY: 32, fusR: 11, gear: 52, canopyY: 22, canopyR: 7, shadow: 32 }),
    p_aerobatic: P => rPlane(P, { fy: 26, finH: 30, wingY: 40, lowWing: true, span: 48, thick: 5, fusY: 34, fusR: 11, gear: 54, canopyY: 22, canopyR: 7.5, shadow: 32 }),
    p_glider:    P => rPlane(P, { fy: 26, finH: 34, tStab: true, wingY: 30, span: 60, thick: 2.6, fusY: 32, fusR: 7, canopyY: 25, canopyR: 6.5, shadow: 30 }),
    p_seaplane:  P => rPlane(P, { fy: 22, finH: 30, wingY: 10, span: 54, thick: 6, fusY: 30, fusR: 12, struts: true, floats: true, canopyY: 22, canopyR: 6.5, shadow: 1 }),
    p_heli: P => rShadow(P.id, 32) + `<ellipse cx="60" cy="-12" rx="58" ry="3" fill="#3a3a40" opacity=".75"/><rect x="58" y="-12" width="4" height="12" fill="#3a3a40"/>` +
      `<path d="M38 56 H82 M44 56 L48 44 M76 56 L72 44" stroke="#3a3a40" stroke-width="2.4" stroke-linecap="round"/>` +
      `<ellipse cx="60" cy="22" rx="24" ry="22" ${rBodyAttr(P)}/><ellipse cx="60" cy="22" rx="24" ry="22" fill="url(#${P.id}h)"/>` + rWin(P, rOval(60, 14, 11, 9), 60, 16, 8.5) +
      `<circle cx="60" cy="38" r="7" fill="${P.c.stripe}" stroke="${P.deep}" stroke-width="1"/><ellipse cx="70" cy="36" rx="1.6" ry="10" fill="#3a3a40" opacity=".8"/>`,
    p_balloon: P => rShadow(P.id, 18) + `<path d="M40 22 L52 46 M80 22 L68 46" stroke="#6b4423" stroke-width="1.2"/>` +
      [[-1, 0], [0, 1], [1, 0]].map(([k, s]) => `<path d="M60 -30 Q${60 + k * 44 - 12} -6 ${60 + k * 14} 24 Q${60 + k * 44 + 12} -6 60 -30 Z" fill="${s ? P.c.stripe : P.c.body}"/>`).join('') +
      `<path d="M60 -30 Q22 -28 22 -4 Q22 14 46 26 H74 Q98 14 98 -4 Q98 -28 60 -30 Z" fill="none" stroke="${P.dark}" stroke-width="1.2"/>` +
      rFace(P, 60, 40, 8) + `<rect x="46" y="44" width="28" height="16" rx="3" fill="#a0703f" stroke="#5a3a1e" stroke-width="1.2"/><path d="M46 50 H74 M53 44 V60 M60 44 V60 M67 44 V60" stroke="#7a5230" stroke-width=".8"/>`,
    p_blimp: P => rShadow(P.id, 26) + `<path d="M60 -6 L52 -30 H68 Z M60 42 L52 60 H68 Z M34 18 L8 10 V26 Z M86 18 L112 10 V26 Z" fill="${P.c.stripe}" stroke="${P.deep}" stroke-width=".8"/>` +
      `<circle cx="60" cy="18" r="28" ${rBodyAttr(P)}/><circle cx="60" cy="18" r="28" fill="url(#${P.id}h)"/><circle cx="60" cy="18" r="20" fill="none" stroke="${P.c.stripe}" stroke-width="2.4" opacity=".7"/>` +
      `<rect x="48" y="42" width="24" height="12" rx="5" fill="#e3e5ec" stroke="#8a8f99" stroke-width="1"/>` + rWin(P, rOval(60, 48, 6, 4.6), 60, 49, 5.5),
    // 배
    s_turtle: P => rWater() + rHull(P, 42, 36) + `<path d="M22 38 Q60 -6 98 38 Z" fill="#3b2a1e" stroke="#1d140c" stroke-width="1.2"/>` +
      Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (0.12 + i * 0.095), x = 60 - Math.cos(a) * 34, y = 38 - Math.sin(a) * 30; return `<path d="M${f1(x - 2)} ${f1(y + 1)} L${f1(x)} ${f1(y - 5)} L${f1(x + 2)} ${f1(y + 1)} Z" fill="#c9ccd6"/>`; }).join('') +
      `<path d="M34 30 Q60 12 86 30" stroke="${P.c.stripe}" stroke-width="2" fill="none"/>` + rWin(P, rRect(52, 42, 16, 12), 60, 49, 6),
    s_panokseon: P => rWater() + `<path d="M60 4 V-28" stroke="#5a3a1e" stroke-width="2.4"/><path d="M60 -28 L80 -22 L60 -16 Z" fill="#e2412e"/>` + rHull(P, 44, 34) +
      `<rect x="24" y="14" width="72" height="20" fill="#a0703f" stroke="#5a3a1e" stroke-width="1"/><rect x="36" y="2" width="48" height="12" fill="#a0703f" stroke="#5a3a1e" stroke-width="1"/>` +
      `<path d="M24 14 H96 M36 2 H84" stroke="${P.c.stripe}" stroke-width="2.4"/>` + rFace(P, 60, -4, 7) + [30, 42, 54, 66, 78, 90].map(x => `<rect x="${x - 3}" y="20" width="6" height="8" fill="#5a3a1e"/>`).join(''),
    s_sailboat: P => rWater() + `<path d="M60 40 V-28" stroke="#5a3a1e" stroke-width="2.4"/><path d="M34 -24 H86 L92 30 H28 Z" fill="${P.c.stripe}" stroke="#a0703f" stroke-width="1.2"/>` +
      [-12, 0, 12].map(y => `<path d="M${33 - y * 0.02} ${y} H${87 + y * 0.02}" stroke="#a0703f" stroke-width="1.4"/>`).join('') + rHull(P, 34, 40) + rFace(P, 60, 34, 7),
    s_yacht: P => rWater() + `<path d="M60 44 V-28" stroke="#9aa0ae" stroke-width="2"/><path d="M62 -26 L84 40 H62 Z" fill="#ffffff" stroke="#c9ccd6" stroke-width="1"/><path d="M62 10 L74 10" stroke="${P.c.stripe}" stroke-width="3"/>` +
      rHull(P, 36, 42) + rFace(P, 48, 36, 7) + `<path d="M28 50 H92" stroke="${P.c.stripe}" stroke-width="2.4"/>`,
    s_carrier: P => rWater() + rHull(P, 50, 38) + `<path d="M2 32 H118 L114 40 H6 Z" fill="#5b6578" stroke="#3a4250" stroke-width="1"/><path d="M14 36 H106" stroke="#fff" stroke-width="1" stroke-dasharray="6 4"/>` +
      `<rect x="84" y="2" width="14" height="30" rx="2" fill="#8a95a8" stroke="#5b6578" stroke-width="1"/><path d="M91 2 V-14 M86 -8 H96" stroke="#5b6578" stroke-width="1.6"/>` + rWin(P, rRect(86, 8, 10, 9), 91, 13, 4.5) +
      `<path d="M30 30 L40 26 L50 30 M38 26 V22" stroke="#3a4250" stroke-width="2.2" fill="none"/>`,
    s_submarine: P => `<path d="M52 4 V-14 M52 -14 H58" stroke="#3a3a40" stroke-width="2"/>` + rFace(P, 60, -2, 7.5) + `<path d="M50 30 V6 Q50 0 56 0 H64 Q70 0 70 6 V30 Z" ${rBodyAttr(P)}/>` +
      `<circle cx="60" cy="44" r="26" ${rBodyAttr(P)}/><circle cx="60" cy="44" r="26" fill="url(#${P.id}h)"/><path d="M60 30 V58 M46 44 H74" stroke="${P.c.stripe}" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="44" r="4" fill="#3a3a40"/>` + rWater(),
    s_cruise: P => rWater() + rHull(P, 48, 34) + `<rect x="18" y="20" width="84" height="14" fill="#ffffff" stroke="#c9ccd6" stroke-width="1"/><rect x="26" y="8" width="68" height="12" fill="#ffffff" stroke="#c9ccd6" stroke-width="1"/><rect x="36" y="-2" width="48" height="10" fill="#ffffff" stroke="#c9ccd6" stroke-width="1"/>` +
      [[22, 25, 11], [30, 12, 9], [40, 1, 6]].map(([x0, y, n]) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * 7}" y="${y}" width="4.4" height="4" rx="1" fill="#5fb8f0"/>`).join('')).join('') +
      `<path d="M50 -2 L52 -20 H68 L70 -2 Z" fill="${P.c.stripe}"/><path d="M52 -20 H68 V-15 H51.5 Z" fill="#26262b"/>` + rWin(P, rRect(54, 0, 12, 7), 60, 5, 4.6),
    s_fishing: P => rWater() + `<path d="M84 40 V-20 M84 -20 L60 10 M84 -14 L100 4" stroke="#5a3a1e" stroke-width="1.8"/>` + [[70, -4, '#ffd84a'], [92, -6, '#e2412e']].map(([x, y, col]) => `<path d="M${x} ${y} l6 3 l-6 3 Z" fill="${col}"/>`).join('') +
      rHull(P, 36, 40) + `<rect x="40" y="16" width="34" height="24" rx="2" fill="#ffffff" stroke="#c9ccd6" stroke-width="1"/>` + rWin(P, rRect(45, 20, 24, 12), 57, 27, 6.5) + `<circle cx="96" cy="48" r="4" fill="#ff9f0a"/>`,
    s_motorboat: P => rWater() + rHull(P, 38, 40) + rWin(P, `M40 40 L46 20 H74 L80 40 Z`, 60, 30, 8.5) + `<rect x="54" y="42" width="12" height="16" rx="2" fill="#26262b"/><rect x="52" y="38" width="16" height="8" rx="3" fill="#3a3a40"/>` +
      `<path d="M30 62 Q22 54 14 60 M90 62 Q98 54 106 60" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    s_container: P => rWater() + rHull(P, 50, 38) + [['#2f7fd1', 16, 26], ['#f5c242', 30, 26], ['#34c759', 76, 26], ['#e2412e', 90, 26], ['#ff9f0a', 16, 16], ['#8a55d6', 90, 16]].map(([col, x, y]) => `<rect x="${x}" y="${y}" width="14" height="10" fill="${col}" stroke="rgba(0,0,0,.25)" stroke-width=".8"/>`).join('') +
      `<rect x="46" y="-6" width="28" height="44" rx="2" fill="#ffffff" stroke="#c9ccd6" stroke-width="1"/>` + [6, 16, 26].map(y => `<rect x="50" y="${y}" width="20" height="5" rx="1" fill="#5fb8f0"/>`).join('') + rWin(P, rRect(50, -3, 20, 8), 60, 2, 4.8),
    s_banana: P => rWater() + `<circle cx="34" cy="52" r="8" fill="#f5c21f" stroke="#c49a00" stroke-width="1"/><circle cx="86" cy="52" r="8" fill="#f5c21f" stroke="#c49a00" stroke-width="1"/>` +
      rFace(P, 60, 10, 6) + rFace(P, 60, 22, 7.5) + `<path d="M44 46 Q44 30 60 30 Q76 30 76 46 Q76 60 60 60 Q44 60 44 46 Z" ${rBodyAttr(P)}/>` + rFace(P, 60, 32, 9) + `<ellipse cx="60" cy="50" rx="6" ry="4" fill="#5a4a10" opacity=".7"/>`
  };

  // 동물 캐릭터의 등: 같은 털·귀를 쓰고 얼굴 대신 꼬리와 등 무늬
  function fluffRear(P, o) {
    const id = P.id + 'm', B = o.body, F = `url(#${id}f)`;
    const amp = o.smooth ? 0.5 : o.shaggy ? 2.8 : 1.9;
    const blob = fuzz(60, 37, 31.5, 26.5, 34, amp);
    let g = `<defs><radialGradient id="${id}f" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="${shade(B, 0.4)}"/><stop offset=".55" stop-color="${B}"/><stop offset="1" stop-color="${shade(B, -0.25)}"/></radialGradient>` +
      `<radialGradient id="${id}e" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#3a3340"/><stop offset=".7" stop-color="#0d0b10"/><stop offset="1" stop-color="#000"/></radialGradient>` +
      `<clipPath id="${id}c"><path d="${blob}"/></clipPath></defs>`;
    const ear = o.earColor || B;
    if (o.mane) g += `<path d="${fuzz(60, 32, 38, 30, 26, 4.5)}" fill="${o.mane}"/>`;
    g += fluffEars(Object.assign({}, o, { earIn: shade(ear, -0.1), earTip: o.earTip }), o.earColor ? ear : F);
    if (o.feet === 'bird') g += [52, 68].map(x => `<path d="M${x} 58 V65 M${x} 65 l-3.5 1.5 M${x} 65 l3.5 1.5" stroke="${o.legs || '#f2a33a'}" stroke-width="2.4" stroke-linecap="round"/>`).join('');
    else if (o.feet === 'flipper') g += `<path d="M44 60 Q36 66 46 66 Q52 65 52 61 Z M76 60 Q84 66 74 66 Q68 65 68 61 Z" fill="${shade(B, -0.2)}"/>`;
    else if (o.feet !== 'water' && o.feet !== 'none') g += [49, 71].map(x => `<ellipse cx="${x}" cy="63.5" rx="7" ry="3.4" fill="${o.limb || shade(B, -0.08)}"/><ellipse cx="${x}" cy="64.2" rx="3.4" ry="1.6" fill="#f4a7a0" opacity="${o.limb ? 0.5 : 0.85}"/>`).join('');
    g += `<path d="${blob}" fill="${F}"/>`;
    // 등 무늬: 머리 뒤 색, 줄무늬, 점
    if (o.cap) g += `<path d="M30 37 C29 18 42 10 60 10 C78 10 91 18 90 37 C80 30 40 30 30 37 Z" fill="${o.cap}"/>`;
    if (o.b_back) g += `<path d="${fuzz(60, 40, 24, 20, 22, amp * 0.6)}" fill="${o.b_back}"/>`;
    if (o.stripes) g += `<path d="M47 14 q5 6 1 13 M60 11 v13 M73 14 q-5 6 -1 13 M33 34 q8 1 11 8 M87 34 q-8 1 -11 8 M38 50 q7 -2 11 4 M82 50 q-7 -2 -11 4" stroke="${o.stripes}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    if (o.spots) g += [[44, 22], [76, 26], [54, 46], [70, 50], [38, 40], [84, 44]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.7" fill="${o.spots}" opacity=".7"/>`).join('');
    if (o.shaggy) g += `<path d="${fuzz(60, 20, 26, 10, 22, 2.4)}" fill="${o.shaggy}"/>`;
    g += `<ellipse cx="58" cy="20" rx="10" ry="5" fill="#fff" opacity=".22"/>`; // 머리 뒤 반짝
    // 비스듬히 뒤에서 보면 얼굴이 왼쪽 가장자리로 살짝 보여요(옆으로 눌러 그린 얼굴)
    g += `<g clip-path="url(#${id}c)"><g transform="translate(38 1) scale(.42 1) translate(-60 0)">${fluffFace(o, id)}</g></g>`;
    g += flopEars(o);
    // 날개·지느러미
    if (o.arms === 'wing') g += [[30, 44, 20], [90, 44, -20]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="6.5" ry="11" fill="${o.wing || shade(B, -0.12)}"/></g>`).join('');
    else if (o.arms === 'flipper' || o.arms === 'fin') g += [[31, 50, 35], [89, 50, -35]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${o.arms === 'fin' ? 4.5 : 5}" ry="${o.arms === 'fin' ? 9 : 10}" fill="${o.limb || shade(B, -0.18)}" transform="rotate(${r} ${x} ${y})"/>`).join('');
    // 꼬리(가운데 아래쪽)
    const TC = o.tailColor || B;
    switch (o.tail) {
      case 'bushy': g += `<ellipse cx="66" cy="52" rx="9" ry="15" fill="${F}" transform="rotate(-28 66 52)"/><ellipse cx="72" cy="63" rx="5" ry="5.5" fill="${o.tailTip || '#fff'}"/>`; break;
      case 'long': g += `<path d="M60 56 Q74 56 72 44 Q70 32 80 28" fill="none" stroke="${TC}" stroke-width="5" stroke-linecap="round"/>` + (o.stripes ? `<path d="M60 56 Q74 56 72 44 Q70 32 80 28" fill="none" stroke="${o.stripes}" stroke-width="5" stroke-dasharray="2.5 5"/>` : '') + (o.tailTip ? `<circle cx="80" cy="28" r="4.2" fill="${o.tailTip}"/>` : ''); break;
      case 'curl': g += `<path d="M60 56 q8 -2 7 -10 q-1 -6 -6 -3 q-3 3 1 5" fill="none" stroke="${TC}" stroke-width="4.4" stroke-linecap="round"/>`; break;
      case 'thin': g += `<path d="M60 56 Q64 64 74 62" fill="none" stroke="${TC}" stroke-width="3" stroke-linecap="round"/>`; break;
      case 'feather': g += `<path d="M53 54 L46 67 L56 63 L60 69 L64 63 L74 67 L67 54 Z" fill="${TC}" stroke-linejoin="round"/>`; break;
      case 'rooster': g += `<path d="M60 54 Q42 34 48 10 Q56 24 60 40 Q64 24 72 10 Q78 34 60 54 Z" fill="${TC}"/>`; break;
      case 'fish': g += `<path d="M60 50 Q48 55 36 50 Q40 60 60 60 Q80 60 84 50 Q72 55 60 50 Z" fill="${F}"/>`; break;
      case 'otter': g += `<path d="M60 54 Q62 64 70 66" fill="none" stroke="${shade(B, -0.15)}" stroke-width="7" stroke-linecap="round"/>`; break;
      default:
        if (o.face === 'beak') g += `<path d="M53 54 Q60 63 67 54 Q60 58 53 54 Z" fill="${o.wing || shade(B, -0.12)}"/>`;
        else if (!o.smooth) g += `<circle cx="60" cy="56" r="5" fill="${shade(B, 0.3)}"/>`;
    }
    if (o.fin) g += `<path d="M55 13 Q60 ${o.fin === 'tall' ? -12 : -2} 65 13 Z" fill="${shade(B, -0.18)}"/>`;
    if (o.spout) g += `<path d="M60 10 Q58 0 52 -4 M60 10 Q60 -2 60 -8 M60 10 Q62 0 68 -4" stroke="#8fd3ff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    if (o.comb) g += `<path d="M50 14 Q50 2 56 6 Q58 -2 63 4 Q67 -1 69 8 Q72 8 70 14 Z" fill="${o.comb}"/>`;
    if (o.tuft) g += `<path d="M58 12 Q55 2 60 3 Q58 7 62 6 Q61 10 62 12 Z" fill="${o.tuft}"/>`;
    if (o.crest) g += `<path d="M54 13 Q50 -2 58 2 Q60 -4 64 2 Q70 0 66 13 Z" fill="${o.crest}"/>`;
    if (o.feet === 'water') g += `<path d="M22 58 Q30 53 38 58 T54 58 T70 58 T86 58 T102 58 V66 H22 Z" fill="#5fb8f0" opacity=".9"/><path d="M22 58 Q30 53 38 58 T54 58 T70 58 T86 58 T102 58" stroke="#fff" stroke-width="1.6" fill="none" opacity=".85"/>`;
    return g;
  }

  // 비스듬한 뒤 시점: 뒷모습 왼쪽 가장자리(뒷모습 그림의 x)에 옆모습 그림을 비스듬히 붙여요.
  // 동물 캐릭터·열기구·구름은 옆모습이 앞을 보는 얼굴이라 붙이지 않고, 대신 얼굴이 옆으로 살짝 보여요
  const SIDE_X = {
    ev: 20, suv: 18, sport: 15, luxury: 19, hatch: 21, pickup: 18, box: 22, retro: 23, jeep: 19, taxi: 20, police: 19,
    ambulance: 19, fire: 16, bus: 16, mtruck: 16, t_dump: 16, t_mixer: 20, t_subway: 18, t_train: 18, tram: 20, steam: 18, t_crane: 16,
    tank: 10, spg: 10, t_excavator: 12, t_forklift: 24, f_tractor: 9, tiller: 15, f_combine: 12, f_transplanter: 38, f_drone: 40,
    stonecart: 16, gama: 34, carriage: 16, hwacha: 15, rickshaw: 22,
    x_rudolph: 26, x_pumpkin: 20, x_carpet: 30, x_broom: 50, x_rocket: 40, x_ufo: 30, x_paperplane: 54, x_sled: 28, x_turtle: 16,
    p_airliner: 46, p_fighter: 49, p_light: 48, p_biplane: 49, p_aerobatic: 49, p_glider: 53, p_seaplane: 48, p_heli: 36, p_blimp: 32,
    s_turtle: 18, s_panokseon: 16, s_sailboat: 26, s_yacht: 24, s_carrier: 10, s_submarine: 34, s_cruise: 12, s_fishing: 24, s_motorboat: 22, s_container: 10, s_banana: 44
  };
  function rearSide(i) {
    const n = CARS.length, c = CARS[((i % n) + n) % n];
    return SIDE_X[c.kind] == null ? null : SIDE_X[c.kind];
  }

  function rearSVG(i) {
    const n = CARS.length, k = ((i % n) + n) % n, c = CARS[k], id = 'rr' + k + '_' + (++rearUid);
    const P = { c, id, dark: shade(c.body, -0.38), lite: shade(c.body, 0.42), deep: shade(c.body, -0.6), toy: false, back: SIDE_X[c.kind] != null };
    let inner;
    if (REAR[c.kind]) inner = REAR[c.kind](P);
    else if (/^[abm]_/.test(c.kind) && SPECIAL[c.kind]) {
      FLUFF_REAR = true;
      try { inner = rShadow(id, 34) + SPECIAL[c.kind](P); } finally { FLUFF_REAR = false; }
    } else inner = rCar(P, { w: 40, belt: 34, top: 10, rw: 31 });
    return `<svg class="car-svg rear" viewBox="0 -30 120 100" aria-hidden="true">${rearDefs(id, c)}${inner}</svg>`;
  }

  // ===== 45도 비스듬한 뒷모습: 큰 화면 3D(왼쪽 뒤 위에서 45도로 내려다보는 카메라) =====
  // 탈것을 몸통·창문·지붕·바퀴로 조립해서 한 시점으로 그려요(정사영, 길과 같은 각도).
  // 탈것 좌표: x 오른쪽, y 위, z 앞. 바닥 한가운데가 (0, 0, 0)이고, 그림 틀은 viewBox "-85 -125 170 170"이에요.
  const QS = Math.sin(32 * Math.PI / 180), QC = Math.cos(32 * Math.PI / 180), QK = Math.SQRT1_2;
  const QL = (() => { const v = [-0.55, 0.78, 0.05], n = Math.hypot(v[0], v[1], v[2]); return v.map(a => a / n); })(); // 빛이 오는 쪽
  const f3 = n => (+n).toFixed(3);
  const qu = (x, y, z) => (x - z) * QK, qv = (x, y, z) => -(QK * QS * (x + z) + QC * y);
  const qp = p => f1(qu(p[0], p[1], p[2])) + ' ' + f1(qv(p[0], p[1], p[2]));
  const qPoly = pts => 'M' + pts.map(qp).join(' L') + 'Z';
  // 면 방향(n)에 따라 밝기: 윗면은 밝고, 왼쪽 옆면은 조금 밝고, 뒷면은 조금 어두워요
  const qTone = (col, n) => { const L = Math.hypot(n[0], n[1], n[2]) || 1, d = (n[0] * QL[0] + n[1] * QL[1] + n[2] * QL[2]) / L; return shade(col, d > 0.3 ? (d - 0.3) * 0.45 : (d - 0.3) * 0.5); };
  // 평면 위에 2D로 그리는 변환: x면(a=z, b=-y), z면(a=x, b=-y), y면(a=x, b=z)
  const qMx = x0 => `matrix(${f3(-QK)} ${f3(-QK * QS)} 0 ${f3(QC)} ${f3(x0 * QK)} ${f3(-QK * QS * x0)})`;
  const qMz = z0 => `matrix(${f3(QK)} ${f3(-QK * QS)} 0 ${f3(QC)} ${f3(-z0 * QK)} ${f3(-QK * QS * z0)})`;
  const qMy = y0 => `matrix(${f3(QK)} ${f3(-QK * QS)} ${f3(-QK)} ${f3(-QK * QS)} 0 ${f3(-QC * y0)})`;
  let QID = '', QSHADOW = ''; // 지금 그리는 그림의 id, 바닥 그림자(외곽선 밖에 따로 그려요)
  const qFace = (pts, col, n, sw) => { const t = qTone(col, n), d = qPoly(pts); return `<path d="${d}" fill="${t}" stroke="${shade(t, -0.18)}" stroke-width="${sw || 1.4}" stroke-linejoin="round"/><path d="${d}" fill="url(#${QID}h)"/>`; };
  // 사각형 면 안쪽 자리(쌍선형): p0(0,0) p1(1,0) p2(1,1) p3(0,1)
  const qIn = (q, u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => [0, 1, 2].map(k =>
    q[0][k] * (1 - u) * (1 - v) + q[1][k] * u * (1 - v) + q[2][k] * u * v + q[3][k] * (1 - u) * v));
  function qHull(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    pts.forEach(p => { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
    pts.slice().reverse().forEach(p => { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); });
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  const qHullPath = pts => 'M' + qHull(pts).map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + 'Z';
  // 상자: 보이는 면은 뒤(z0)·왼쪽(x0)·위(y1)
  function qBox(x0, x1, y0, y1, z0, z1, col, o) {
    o = o || {};
    let g = '';
    if (!o.noRear) g += qFace([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col, [0, 0, -1], o.sw);
    if (!o.noLeft) g += qFace([[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], col, [-1, 0, 0], o.sw);
    if (!o.noTop) g += qFace([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], o.topCol || col, [0, 1, 0], o.sw);
    return g;
  }
  // 모서리를 깎은 상자(장난감처럼 둥근 느낌): 보이는 세 모서리와 꼭짓점을 c만큼 깎아요
  function qBoxB(x0, x1, y0, y1, z0, z1, col, c, o) {
    o = o || {};
    const t = o.topCol || col;
    return qFace([[x0 + c, y0, z0], [x1, y0, z0], [x1, y1 - c, z0], [x0 + c, y1 - c, z0]], col, [0, 0, -1]) +
      qFace([[x0, y0, z0 + c], [x0, y1 - c, z0 + c], [x0, y1 - c, z1], [x0, y0, z1]], col, [-1, 0, 0]) +
      qFace([[x0, y0, z0 + c], [x0 + c, y0, z0], [x0 + c, y1 - c, z0], [x0, y1 - c, z0 + c]], col, [-1, 0, -1]) +
      qFace([[x0 + c, y1 - c, z0], [x1, y1 - c, z0], [x1, y1, z0 + c], [x0 + c, y1, z0 + c]], t, [0, 1, -1]) +
      qFace([[x0, y1 - c, z0 + c], [x0 + c, y1, z0 + c], [x0 + c, y1, z1], [x0, y1 - c, z1]], t, [-1, 1, 0]) +
      qFace([[x0, y1 - c, z0 + c], [x0 + c, y1 - c, z0], [x0 + c, y1, z0 + c]], t, [-1, 1, -1]) +
      qFace([[x0 + c, y1, z0 + c], [x1, y1, z0 + c], [x1, y1, z1], [x0 + c, y1, z1]], t, [0, 1, 0]);
  }
  // 위가 좁아지는 몸통(지붕 있는 칸): 아래 ±b(z0~z1), 위 ±t(z0+sr~z1-sf)
  function qCab(o) {
    const B = [[-o.b, o.y0, o.z0], [o.b, o.y0, o.z0], [o.b, o.y0, o.z1], [-o.b, o.y0, o.z1]];
    const T = [[-o.t, o.y1, o.z0 + o.sr], [o.t, o.y1, o.z0 + o.sr], [o.t, o.y1, o.z1 - o.sf], [-o.t, o.y1, o.z1 - o.sf]];
    const h = o.y1 - o.y0;
    return { rear: [B[0], B[1], T[1], T[0]], left: [B[0], T[0], T[3], B[3]], top: [T[0], T[1], T[2], T[3]], nRear: [0, o.sr, -h], nLeft: [-h, o.b - o.t, 0] };
  }
  // 바퀴(축이 x 방향): x0 쪽 바깥 면과 타이어 두께
  function qWheel(x0, x1, yc, zc, r, o) {
    o = o || {};
    const pts = [];
    for (let i = 0; i < 28; i++) {
      const t = i / 28 * Math.PI * 2, y = yc + Math.sin(t) * r, z = zc + Math.cos(t) * r;
      pts.push([qu(x0, y, z), qv(x0, y, z)], [qu(x1, y, z), qv(x1, y, z)]);
    }
    return `<path d="${qHullPath(pts)}" fill="${o.tire || '#2a2a30'}"/>` +
      `<g transform="${qMx(x0)}"><circle cx="${f1(zc)}" cy="${f1(-yc)}" r="${f1(r)}" fill="${o.face || '#3a3a42'}"/>` +
      (o.plain ? '' : `<circle cx="${f1(zc)}" cy="${f1(-yc)}" r="${f1(r * 0.6)}" fill="${o.rim || '#e4e6ec'}" stroke="#9aa0ae" stroke-width="1"/><circle cx="${f1(zc)}" cy="${f1(-yc)}" r="${f1(r * 0.22)}" fill="#8a8f9c"/>`) + '</g>';
  }
  // 둥근 몸(타원체) → 화면에서는 타원
  function qBall(cx, cy, cz, a, b, c, fill, extra) {
    const r1 = [QK, 0, -QK], r2 = [-QK * QS, -QC, -QK * QS], d = [a * a, b * b, c * c];
    const s = (u, v) => u[0] * v[0] * d[0] + u[1] * v[1] * d[1] + u[2] * v[2] * d[2];
    const p = s(r1, r1), q = s(r1, r2), r = s(r2, r2), m = (p + r) / 2, dd = Math.sqrt(((p - r) / 2) ** 2 + q * q);
    const ang = 0.5 * Math.atan2(2 * q, p - r) * 180 / Math.PI, x = qu(cx, cy, cz), y = qv(cx, cy, cz);
    return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(Math.sqrt(m + dd))}" ry="${f1(Math.sqrt(Math.max(0.01, m - dd)))}" transform="rotate(${f1(ang)} ${f1(x)} ${f1(y)})" fill="${fill}"${extra || ''}/>`;
  }
  const qShadow = (id, rx, rz, cz) => { QSHADOW = `<ellipse cx="0" cy="${cz || 0}" rx="${rx}" ry="${rz}" transform="${qMy(0)}" fill="url(#${id}s)"/>`; return ''; };
  const qDefs = (id, c) => `<defs>
      <radialGradient id="${id}s"><stop offset=".55" stop-color="#000" stop-opacity=".32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf6fd"/><stop offset=".55" stop-color="#a9cde3"/><stop offset="1" stop-color="#7fa4c0"/></linearGradient>
      <radialGradient id="${id}b" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${shade(c.body, 0.45)}"/><stop offset=".5" stop-color="${c.body}"/><stop offset="1" stop-color="${shade(c.body, -0.32)}"/></radialGradient>
      <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>
      <filter id="${id}o" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="1.3" result="d"/><feFlood flood-color="#231d2a" flood-opacity=".6"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  // 창문: 유리 → 운전석 창에는 우리를 보는 운전자 얼굴, 뒷유리에는 머리받침 → 유리 반사
  function qWindows(P, side, rear) {
    let g = side.concat(rear ? [rear] : []).map(w => `<path d="${qPoly(w)}" fill="url(#${P.id}w)" stroke="${shade(P.c.body, -0.45)}" stroke-width="1.2" stroke-linejoin="round"/>`).join('');
    const box = w => { const us = w.map(p => qu(...p)), vs = w.map(p => qv(...p)); return { x: (Math.min(...us) + Math.max(...us)) / 2, y: (Math.min(...vs) + Math.max(...vs)) / 2, h: Math.max(...vs) - Math.min(...vs), wd: Math.max(...us) - Math.min(...us) }; };
    const clip = (w, inner) => { const k = P.id + 'g' + (++rearUid); return `<defs><clipPath id="${k}"><path d="${qPoly(w)}"/></clipPath></defs><g clip-path="url(#${k})">${inner}</g>`; };
    if (rear) { const b = box(rear); g += clip(rear, `<rect x="${f1(b.x - b.wd * 0.22)}" y="${f1(b.y - b.h * 0.05)}" width="${f1(b.wd * 0.44)}" height="${f1(b.h * 0.8)}" rx="${f1(b.wd * 0.12)}" fill="${shade(P.c.body, -0.55)}" opacity=".75"/>`); }
    const dw = side[side.length - 1], b = box(dw), r = Math.min(b.h * 0.4, b.wd * 0.36);
    g += clip(dw, driver(P.c.driver, +b.x.toFixed(1), +(b.y + r * 0.25).toFixed(1), +r.toFixed(1)));
    g += side.concat(rear ? [rear] : []).map(w => `<path d="${qPoly(qIn(w, 0.06, 0.55, 0.62, 0.94))}" fill="#fff" opacity=".2"/>`).join('');
    return g;
  }

  // 승용차: 아래 몸통 + 위가 좁은 지붕 칸 + 바퀴 넷 + 뒷등·번호판
  function qCar(P, o) {
    const { c, id } = P, w = o.w, L = o.L, zr = -L / 2, zf = L / 2, yb = o.yb || 10, bt = o.belt, R = o.R || 12;
    const wz = [zr + (o.wr || 22), zf - (o.wf || 20)];
    let g = qShadow(id, w + 10, L / 2 + 8);
    g += qWheel(w - 9, w + 1, R, wz[0], R) + qWheel(w - 9, w + 1, R, wz[1], R);
    g += qBoxB(-w, w, yb, bt, zr, zf, c.body, 5);
    // 바퀴집(옆면에 어두운 반원), 옆 줄무늬와 문 선·손잡이
    const ak = P.id + 'a' + (++rearUid);
    g += `<defs><clipPath id="${ak}"><path d="${qPoly([[-w, yb, zr + 5], [-w, bt - 5, zr + 5], [-w, bt - 5, zf], [-w, yb, zf]])}"/></clipPath></defs>` +
      `<g clip-path="url(#${ak})"><g transform="${qMx(-w)}">${wz.map(z => `<circle cx="${f1(z)}" cy="${-R}" r="${R + 3.5}" fill="${shade(c.body, -0.55)}"/>`).join('')}</g></g>`;
    const mid = (o.cz0 + o.cz1) / 2;
    g += `<g transform="${qMx(-w)}"><rect x="${f1(zr + 6)}" y="${f1(-(bt - 9))}" width="${f1(L - 12)}" height="3.2" rx="1.6" fill="${c.stripe}"/>` +
      `<path d="M${f1(mid)} ${f1(-bt + 5)} V${f1(-yb - 4)}" stroke="${shade(c.body, -0.3)}" stroke-width="1"/>` +
      `<rect x="${f1(mid - 9)}" y="${f1(-bt + 11)}" width="6" height="2" rx="1" fill="${shade(c.body, -0.35)}"/></g>`;
    const ly = bt - 7;
    g += `<g transform="${qMz(zr)}">` +
      (o.lights === 'round' ? [-w + 9, w - 9].map(x => `<circle cx="${x}" cy="${-ly}" r="4" fill="#ff4b3e" stroke="#9c1c14" stroke-width=".8"/>`).join('')
        : o.lights === 'bar' ? `<rect x="${-w + 4}" y="${-ly - 2.5}" width="${2 * w - 8}" height="5" rx="2.5" fill="#ff4b3e" stroke="#9c1c14" stroke-width=".7"/>`
          : [-w + 4, w - 15].map(x => `<rect x="${x}" y="${-ly - 3}" width="11" height="6" rx="2" fill="#ff4b3e" stroke="#9c1c14" stroke-width=".8"/>`).join('')) +
      `<rect x="-10" y="${-(yb + 13)}" width="20" height="7" rx="1.5" fill="#fff" stroke="${shade(c.stripe, -0.25)}" stroke-width="1"/>` +
      `<rect x="${-w - 1}" y="${-(yb + 4)}" width="${2 * w + 2}" height="6" rx="3" fill="#e3e5ec" stroke="#a9adba" stroke-width=".6"/></g>`;
    if (o.extraLow) g += o.extraLow(P, o);
    // 지붕 칸
    const cab = qCab({ b: o.b, t: o.t, y0: bt, y1: o.roof, z0: o.cz0, z1: o.cz1, sr: o.sr, sf: o.sf });
    g += qFace(cab.rear, c.body, cab.nRear) + qFace(cab.left, c.body, cab.nLeft);
    const side = o.split ? [qIn(cab.left, 0.14, 0.86, 0.08, 0.47), qIn(cab.left, 0.14, 0.86, 0.53, 0.9)] : [qIn(cab.left, 0.14, 0.86, 0.08, 0.9)];
    g += qWindows(P, side, qIn(cab.rear, 0.1, 0.9, 0.12, 0.86));
    g += qFace(cab.top, c.body, [0, 1, 0]);
    if (o.extra) g += o.extra(P, o, cab);
    g += qBox(-o.b - 5, -o.b, bt + 2, bt + 7, o.cz1 - 7, o.cz1 - 2, shade(c.body, -0.15)); // 옆 거울
    g += qWheel(-w - 2, -w + 8, R, wz[0], R) + qWheel(-w - 2, -w + 8, R, wz[1], R);
    return g;
  }
  const qSpare = (P, o) => `<g transform="${qMz(-o.L / 2 - 3)}"><circle cx="0" cy="${-(o.belt - 4)}" r="11" fill="#2a2a30"/><circle cx="0" cy="${-(o.belt - 4)}" r="5.5" fill="#d9dce4" stroke="#8a8f99" stroke-width="1"/></g>`;
  const qSpoiler = (P, o) => qBox(-o.w + 3, o.w - 3, o.belt + 9, o.belt + 12, -o.L / 2 + 2, -o.L / 2 + 10, shade(P.c.body, -0.25)) +
    [-o.w + 10, o.w - 10].map(x => qBox(x - 1.5, x + 1.5, o.belt, o.belt + 9, -o.L / 2 + 5, -o.L / 2 + 8, shade(P.c.body, -0.35))).join('');
  const qRoofBox = (o, cab, col, h, wd, ln) => qBox(-wd, wd, o.roof, o.roof + h, (o.cz0 + o.sr + o.cz1 - o.sf) / 2 - ln / 2, (o.cz0 + o.sr + o.cz1 - o.sf) / 2 + ln / 2, col);
  const qSiren = (P, o) => { const z = (o.cz0 + o.sr + o.cz1 - o.sf) / 2; return qBox(-14, 0, o.roof, o.roof + 5, z - 4, z + 4, '#ff3b30') + qBox(0, 14, o.roof, o.roof + 5, z - 4, z + 4, '#0a84ff'); };
  const qTaxi = (P, o) => { const z = (o.cz0 + o.sr + o.cz1 - o.sf) / 2; return qBox(-11, 11, o.roof, o.roof + 7, z - 5, z + 5, '#ffd84a') +
    `<g transform="${qMz(z - 5)}"><text x="0" y="${-(o.roof + 1.6)}" text-anchor="middle" font-size="5.6" font-weight="800" fill="#3a2a00" font-family="sans-serif">TAXI</text></g>`; };
  const qBed = (P, o) => { // 픽업트럭 짐칸: 뚫린 칸 안쪽
    const zr = -o.L / 2;
    return `<path d="${qPoly([[-o.w + 4, o.belt, zr + 4], [o.w - 4, o.belt, zr + 4], [o.w - 4, o.belt, o.cz0 - 2], [-o.w + 4, o.belt, o.cz0 - 2]])}" fill="${shade(P.c.body, -0.45)}"/>`; };

  const Q45 = {
    ev:     P => qCar(P, { w: 40, L: 104, belt: 30, roof: 54, b: 36, t: 28, cz0: -32, cz1: 26, sr: 12, sf: 18, lights: 'bar' }),
    suv:    P => qCar(P, { w: 42, L: 108, belt: 31, roof: 62, b: 39, t: 35, cz0: -50, cz1: 24, sr: 4, sf: 14, split: true, R: 13, extraLow: qSpare }),
    sport:  P => qCar(P, { w: 45, L: 114, belt: 25, roof: 44, b: 38, t: 27, cz0: -24, cz1: 22, sr: 14, sf: 18, R: 12, extraLow: qSpoiler }),
    luxury: P => qCar(P, { w: 41, L: 118, belt: 30, roof: 54, b: 37, t: 29, cz0: -28, cz1: 28, sr: 12, sf: 16, split: true, lights: 'bar' }),
    hatch:  P => qCar(P, { w: 39, L: 98, belt: 30, roof: 57, b: 36, t: 31, cz0: -44, cz1: 20, sr: 6, sf: 16 }),
    pickup: P => qCar(P, { w: 42, L: 118, belt: 31, roof: 60, b: 39, t: 34, cz0: -6, cz1: 30, sr: 3, sf: 12, R: 13, extraLow: qBed }),
    box:    P => qCar(P, { w: 38, L: 100, belt: 28, roof: 68, b: 37, t: 35, cz0: -48, cz1: 30, sr: 2, sf: 10, split: true }),
    retro:  P => qCar(P, { w: 37, L: 96, belt: 31, roof: 55, b: 33, t: 24, cz0: -26, cz1: 18, sr: 13, sf: 13, lights: 'round' }),
    jeep:   P => qCar(P, { w: 41, L: 100, belt: 31, roof: 60, b: 40, t: 37, cz0: -44, cz1: 22, sr: 2, sf: 8, R: 13, extraLow: qSpare }),
    taxi:   P => qCar(P, { w: 40, L: 112, belt: 30, roof: 54, b: 37, t: 29, cz0: -28, cz1: 26, sr: 12, sf: 16, split: true, extra: qTaxi }),
    police: P => qCar(P, { w: 41, L: 116, belt: 30, roof: 54, b: 37, t: 29, cz0: -28, cz1: 28, sr: 12, sf: 16, split: true, lights: 'bar', extra: qSiren })
  };

  // ---------- 45도 부품: 기둥(z·x 방향으로 뽑은 모양), 원기둥, 판, 탄 사람 ----------
  // prof: (x, y) 점들(시계 반대 방향), z0(뒤)~z1(앞)로 뽑아요. 뒷면과 보이는 옆·윗면을 칠해요
  function qPrismZ(prof, z0, z1, col) {
    let g = '';
    prof.forEach((a, i) => {
      const b = prof[(i + 1) % prof.length], ex = b[0] - a[0], ey = b[1] - a[1], n = [ey, -ex, 0];
      if (n[0] * QK * QC + n[1] * -QS >= 0) return;
      g += qFace([[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], col, n);
    });
    return g + qFace(prof.map(p => [p[0], p[1], z0]), col, [0, 0, -1]);
  }
  // prof: (z, y) 점들(시계 반대 방향), x0(왼쪽)~x1로 뽑아요. 왼쪽 면과 보이는 윗·뒷면을 칠해요
  function qPrismX(prof, x0, x1, col) {
    let g = '';
    prof.forEach((a, i) => {
      const b = prof[(i + 1) % prof.length], ez = b[0] - a[0], ey = b[1] - a[1], n = [0, -ez, ey];
      if (n[1] * -QS + n[2] * QK * QC >= 0) return;
      g += qFace([[x0, a[1], a[0]], [x0, b[1], b[0]], [x1, b[1], b[0]], [x1, a[1], a[0]]], col, n);
    });
    return g + qFace(prof.map(p => [x0, p[1], p[0]]), col, [-1, 0, 0]);
  }
  const qRing = (f, n) => Array.from({ length: n || 28 }, (_, i) => f(i / (n || 28) * Math.PI * 2));
  // 원기둥: z 방향(뒤 원판이 보여요), y 방향(윗 원판이 보여요)
  function qCylZ(x, y, z0, z1, r, col, cap) {
    const pts = qRing(t => [[x + Math.cos(t) * r, y + Math.sin(t) * r, z0], [x + Math.cos(t) * r, y + Math.sin(t) * r, z1]]).flat().map(p => [qu(...p), qv(...p)]);
    return `<path d="${qHullPath(pts)}" fill="${qTone(col, [-0.4, 0.6, 0])}" stroke="${shade(col, -0.3)}" stroke-width="1.1"/><path d="${qHullPath(pts)}" fill="url(#${QID}h)"/>` +
      `<g transform="${qMz(z0)}"><circle cx="${f1(x)}" cy="${f1(-y)}" r="${f1(r)}" fill="${cap || qTone(col, [0, 0, -1])}" stroke="${shade(col, -0.3)}" stroke-width="1"/></g>`;
  }
  function qCylY(x, z, y0, y1, r, col, cap) {
    const pts = qRing(t => [[x + Math.cos(t) * r, y0, z + Math.sin(t) * r], [x + Math.cos(t) * r, y1, z + Math.sin(t) * r]]).flat().map(p => [qu(...p), qv(...p)]);
    return `<path d="${qHullPath(pts)}" fill="${qTone(col, [-1, 0, -1])}" stroke="${shade(col, -0.3)}" stroke-width="1.1"/>` +
      `<g transform="${qMy(y1)}"><circle cx="${f1(x)}" cy="${f1(z)}" r="${f1(r)}" fill="${cap || qTone(col, [0, 1, 0])}" stroke="${shade(col, -0.3)}" stroke-width="1"/></g>`;
  }
  // 우리를 보는 얼굴(어느 쪽에서 봐도 둥글어요)
  const qHead = (P, x, y, z, r) => driver(P.c.driver, +qu(x, y, z).toFixed(1), +qv(x, y, z).toFixed(1), +r.toFixed(1));
  // 앉아 있는 운전자: 둥근 몸 + 얼굴
  const qRider = (P, x, y, z, r, shirt) => qBall(x, y + r * 0.9, z, r * 0.95, r * 1.05, r * 0.85, shirt || shade(P.c.stripe, -0.05), ` stroke="${shade(shirt || P.c.stripe, -0.3)}" stroke-width="1"`) + qHead(P, x, y + r * 2.25, z, r);
  // 상자 면 위 창문 하나에 얼굴: 창문 사각형(3D 점 넷)
  function qFaceWin(P, win, head) {
    const k = P.id + 'g' + (++rearUid), us = win.map(p => qu(...p)), vs = win.map(p => qv(...p));
    const cx = (Math.min(...us) + Math.max(...us)) / 2, cy = (Math.min(...vs) + Math.max(...vs)) / 2, h = Math.max(...vs) - Math.min(...vs), wd = Math.max(...us) - Math.min(...us);
    const r = Math.min(h * 0.4, wd * 0.38);
    return `<path d="${qPoly(win)}" fill="url(#${P.id}w)" stroke="${shade(P.c.body, -0.45)}" stroke-width="1.2" stroke-linejoin="round"/>` +
      (head === false ? '' : `<defs><clipPath id="${k}"><path d="${qPoly(win)}"/></clipPath></defs><g clip-path="url(#${k})">${driver(P.c.driver, +cx.toFixed(1), +(cy + r * 0.25).toFixed(1), +r.toFixed(1))}</g>`) +
      `<path d="${qPoly(qIn(win, 0.06, 0.55, 0.62, 0.94))}" fill="#fff" opacity=".2"/>`;
  }
  const qGlass = (P, win) => qFaceWin(P, win, false);
  // x면·z면 위 사각형(3D 점 넷)
  const qXRect = (x, z0, z1, y0, y1) => [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]];
  const qZRect = (z, x0, x1, y0, y1) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
  const qTails = (z, w, y, h) => `<g transform="${qMz(z)}">` + [-w + 3, w - 9].map(x => `<rect x="${x}" y="${-y - h}" width="6" height="${h}" rx="2" fill="#ff4b3e" stroke="#9c1c14" stroke-width=".8"/>`).join('') + '</g>';
  const qPlate = (z, y, c) => `<g transform="${qMz(z)}"><rect x="-10" y="${-y - 7}" width="20" height="7" rx="1.5" fill="#fff" stroke="${shade(c.stripe, -0.25)}" stroke-width="1"/></g>`;
  const qWheels = (zs, w, R, wd, o) => ({ far: zs.map(z => qWheel(w - wd, w, R, z, R, o)).join(''), near: zs.map(z => qWheel(-w, -w + wd, R, z, R, o)).join('') });

  // 큰 차: 통으로 긴 몸통(버스·전철) 또는 짐칸(뒤) + 운전칸(앞)
  function qTruck(P, o) {
    const { c, id } = P, w = o.w, L = o.L, zr = -L / 2, zf = L / 2, yb = o.yb || 10, R = o.R || 13, body = o.bodyCol || c.body;
    qShadow(id, w + 12, L / 2 + 10);
    const W = qWheels(o.wheels, w + 2, R, 11, o.wheelOpt);
    let g = W.far;
    if (o.single) {
      g += qBoxB(-w, w, yb, o.top, zr, zf, body, o.bevel || 6);
      const n = o.win || 4, z0 = zr + 8, z1 = zf - 8, step = (z1 - z0) / n;
      g += `<g transform="${qMx(-w)}"><rect x="${zr + 4}" y="${-(o.wy0 - 5)}" width="${L - 8}" height="4" fill="${c.stripe}"/></g>`;
      g += `<g transform="${qMz(zr)}"><rect x="${-w + 2}" y="${-(o.wy0 - 5)}" width="${2 * w - 4}" height="4" fill="${c.stripe}"/></g>`;
      for (let i = 0; i < n - 1; i++) g += qGlass(P, qXRect(-w, z0 + i * step + 2, z0 + (i + 1) * step - 2, o.wy0, o.wy1));
      g += qFaceWin(P, qXRect(-w, z0 + (n - 1) * step + 2, z1, o.wy0, o.wy1));
      g += qGlass(P, qZRect(zr, -w + 7, w - 7, o.wy0, o.wy1));
      g += qTails(zr, w, yb + 6, 10) + qPlate(zr, yb + 4, c);
    } else {
      const zc = o.zc, wc = o.wc || w - 2;
      g += qBoxB(-wc, wc, yb, o.cabTop, zc, zf, body, 5);
      g += qFaceWin(P, qXRect(-wc, zc + 5, zf - 9, o.cabTop - 18, o.cabTop - 5));
      g += o.cargo ? o.cargo(P, o) : qBoxB(-w, w, yb, o.top, zr, zc, o.cargoCol || body, 5);
      g += qTails(zr, w, yb + 6, 10) + qPlate(zr, yb + 4, c);
    }
    if (o.extra) g += o.extra(P, o);
    return g + W.near;
  }
  // 궤도(무한궤도): 왼쪽 것은 앞에, 오른쪽 것은 뒤에
  function qTrack(x0, x1, z0, z1, h) {
    let g = qBoxB(x0, x1, 2, h, z0, z1, '#3a3d33', 3);
    g += `<g transform="${qMx(x0)}">` + Array.from({ length: Math.floor((z1 - z0) / 8) }, (_, i) => `<circle cx="${f1(z0 + 6 + i * 8)}" cy="${f1(-h / 2 - 1)}" r="${f1(h * 0.28)}" fill="#5b5f52" stroke="#1b1d17" stroke-width=".8"/>`).join('') + '</g>';
    return g;
  }
  function qTank(P, o) {
    const { c, id } = P, w = o.w || 46, L = o.L || 120, zr = -L / 2, zf = L / 2;
    qShadow(id, w + 10, L / 2 + 8);
    let g = qTrack(w - 14, w, zr + 4, zf - 4, 20);
    g += qBoxB(-w + 10, w - 10, 12, 30, zr, zf - 6, c.body, 5);
    g += o.top(P, o);
    g += qTrack(-w, -w + 14, zr + 4, zf - 4, 20);
    return g;
  }
  const qCamo = (P, pts) => pts.map(([x, y, z, r]) => qBall(x, y, z, r, 0.5, r * 0.8, P.c.stripe, ' opacity=".7"')).join('');

  Object.assign(Q45, {
    // 큰 차
    bus:       P => qTruck(P, { single: true, w: 42, L: 150, top: 72, wy0: 40, wy1: 62, win: 5, wheels: [-48, 46], R: 14 }),
    t_subway:  P => qTruck(P, { single: true, w: 40, L: 150, top: 72, wy0: 38, wy1: 62, win: 5, wheels: [-50, -36, 36, 50], R: 9, bevel: 10, extra: (P2, o) => qBox(-6, 6, o.top, o.top + 3, -10, 10, '#4a4a52') }),
    t_train:   P => qTruck(P, { single: true, w: 40, L: 150, top: 70, wy0: 38, wy1: 60, win: 5, wheels: [-50, -36, 36, 50], R: 9, bevel: 12 }),
    tram:      P => qTruck(P, { single: true, w: 38, L: 118, top: 66, wy0: 36, wy1: 58, win: 4, wheels: [-34, 34], R: 10, bevel: 8,
      extra: (P2, o) => qBox(-20, 20, o.top, o.top + 6, -30, 30, shade(P2.c.body, -0.2)) + qCylY(0, 0, o.top + 6, o.top + 30, 1.4, '#4a4a52') }),
    ambulance: P => qTruck(P, { w: 41, L: 124, top: 66, zc: 22, cabTop: 54, wheels: [-36, 40], cargoCol: P.c.body,
      extra: (P2, o) => `<g transform="${qMx(-o.w)}"><path d="M-22 -38 h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6 Z" fill="#e2412e"/></g>` +
        `<g transform="${qMz(-o.L / 2)}"><path d="M-4 -46 h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6 Z" fill="#e2412e"/></g>` +
        qBox(-14, 0, 54, 59, 32, 40, '#ff3b30') + qBox(0, 14, 54, 59, 32, 40, '#0a84ff') }),
    fire:      P => qTruck(P, { w: 44, L: 140, top: 56, zc: 30, cabTop: 58, wheels: [-50, -30, 46], R: 14,
      extra: (P2, o) => [-16, 16].map(x => qBox(x - 2, x + 2, o.top + 4, o.top + 7, -66, 30, '#c9ccd6')).join('') +
        Array.from({ length: 9 }, (_, i) => qBox(-16, 16, o.top + 4, o.top + 6, -62 + i * 11, -60 + i * 11, '#c9ccd6')).join('') +
        `<g transform="${qMx(-o.w)}">${[-40, -14].map(z => `<circle cx="${z}" cy="-34" r="8" fill="#f5f5f7" stroke="#8a8f99" stroke-width="1.2"/><circle cx="${z}" cy="-34" r="3" fill="#8a8f99"/>`).join('')}</g>` +
        qBox(-14, 0, 58, 63, 44, 52, '#ff3b30') + qBox(0, 14, 58, 63, 44, 52, '#0a84ff') }),
    mtruck:    P => qTruck(P, { w: 44, L: 136, top: 34, zc: 26, cabTop: 54, wheels: [-46, -28, 44], R: 14,
      cargo: (P2, o) => { const arch = [[-44, 34], [44, 34], ...Array.from({ length: 9 }, (_, i) => { const t = (i + 1) / 10 * Math.PI; return [Math.cos(t) * 44, 34 + Math.sin(t) * 34]; })];
        return qBoxB(-44, 44, 10, 34, -68, 26, shade(P2.c.body, -0.05), 4) + qPrismZ(arch, -66, 24, shade(P2.c.body, -0.12)) +
          `<path d="${qPoly([[-34, 34, -66], [34, 34, -66], [30, 58, -66], [-30, 58, -66]])}" fill="#26271f"/>` + qHead(P2, 0, 42, -64, 9) +
          qCamo(P2, [[-20, 66, -30, 9], [10, 62, 0, 8], [-34, 50, -50, 6]]); } }),
    t_dump:    P => qTruck(P, { w: 44, L: 132, top: 30, zc: 26, cabTop: 56, wheels: [-44, -26, 44], R: 14,
      cargo: (P2, o) => qPrismZ([[-38, 26], [38, 26], [46, 58], [-46, 58]], -66, 24, P2.c.body) + qBall(0, 58, -22, 34, 8, 36, '#8a6a48') }),
    t_mixer:   P => qTruck(P, { w: 40, L: 132, top: 26, zc: 28, cabTop: 56, wheels: [-44, -26, 44], R: 13,
      cargo: (P2, o) => qBoxB(-34, 34, 12, 24, -66, 28, '#5b6070', 3) + qBall(0, 50, -20, 32, 28, 46, `url(#${P2.id}b)`, ` stroke="${shade(P2.c.body, -0.35)}" stroke-width="1.2"`) +
        qBall(-24, 62, -24, 10, 12, 22, '#fff', ' opacity=".25"') }),
    t_crane:   P => qTruck(P, { w: 44, L: 140, top: 26, zc: 34, cabTop: 54, wheels: [-48, -30, 46], R: 14,
      cargo: (P2, o) => qBoxB(-40, 40, 12, 26, -68, 34, '#5b6070', 3) + qBoxB(-16, 16, 26, 44, -50, -20, P2.c.body, 4) +
        qPrismX([[-40, 40], [-36, 40], [60, 110], [56, 112]], -6, 6, P2.c.stripe) }),
    steam:     P => { const { c } = P; qShadow(P.id, 52, 76); const W = qWheels([-46, -20, 6, 32], 40, 12, 9, { rim: '#d7261e' });
      return W.far + qBoxB(-38, 38, 10, 22, -70, 66, '#26262b', 3) + qCylZ(0, 42, -24, 66, 24, c.body, shade(c.body, -0.25)) + qCylY(0, 50, 60, 84, 8, '#26262b') +
        qBall(0, 96, 50, 10, 6, 10, '#e9ebf1', ' opacity=".9"') + qBoxB(-38, 38, 22, 74, -70, -26, c.body, 5) + qFaceWin(P, qXRect(-38, -62, -36, 46, 66)) +
        qGlass(P, qZRect(-70, -26, 26, 46, 64)) + `<g transform="${qMx(-38)}"><rect x="-70" y="-26" width="136" height="4" fill="${c.stripe}"/></g>` + W.near; },
    // 궤도 차
    tank:      P => qTank(P, { top: (P2) => qCamo(P2, [[-30, 30, -20, 9], [20, 30, 20, 10]]) + qBall(0, 40, -6, 30, 14, 34, `url(#${P2.id}b)`, ` stroke="${shade(P2.c.body, -0.35)}" stroke-width="1.2"`) +
      qCylZ(0, 42, 26, 92, 4, shade(P2.c.body, -0.15)) + qCamo(P2, [[-12, 50, -14, 8], [12, 46, 10, 6]]) + qCylY(-10, -10, 50, 54, 8, shade(P2.c.body, -0.25)) + qHead(P2, -10, 62, -10, 9) }),
    spg:       P => qTank(P, { top: (P2) => qBoxB(-34, 34, 30, 60, -50, 16, P2.c.body, 6) + qCamo(P2, [[-34, 46, -30, 9], [0, 60, -10, 10]]) +
      qPrismX([[0, 52], [10, 52], [86, 92], [80, 96]], -4, 4, shade(P2.c.body, -0.2)) + qHead(P2, -18, 68, -36, 9) }),
    t_excavator: P => qTank(P, { w: 44, top: (P2) => qBoxB(-34, 34, 30, 46, -50, 40, '#3a3a40', 3) + qBoxB(-34, 34, 46, 62, -50, -16, P2.c.body, 5) +
      qPrismX([[10, 60], [20, 60], [70, 116], [62, 120]], -4, 6, P2.c.body) + qPrismX([[62, 120], [70, 116], [90, 80], [84, 76]], -4, 6, P2.c.body) +
      qBoxB(-34, -4, 46, 90, -14, 22, P2.c.body, 5) + qFaceWin(P2, qXRect(-34, -10, 18, 58, 84)) }),
    f_combine: P => qTank(P, { w: 44, top: (P2) => qBoxB(-38, 38, 30, 88, -54, 40, P2.c.body, 6) + qFaceWin(P2, qXRect(-38, 14, 36, 64, 84)) +
      `<g transform="${qMx(-38)}"><rect x="-50" y="-56" width="60" height="5" fill="${P2.c.stripe}"/></g>` + qCylZ(-30, 92, -50, 10, 5, P2.c.stripe) + qBoxB(-46, 46, 12, 30, 44, 60, '#5b6070', 3) }),
    // 농기계
    f_tractor: P => { const { c } = P; qShadow(P.id, 56, 60);
      const far = qWheel(34, 48, 26, -24, 26) + qWheel(30, 40, 14, 40, 14);
      return far + qBoxB(-24, 24, 18, 44, -10, 58, c.body, 5) + qBoxB(-30, 30, 22, 90, -46, -8, c.body, 5) + qBox(-34, 34, 90, 94, -50, -4, shade(c.body, -0.3)) +
        qFaceWin(P, qXRect(-30, -40, -14, 54, 82)) + qGlass(P, qZRect(-46, -24, 24, 54, 82)) + qCylY(18, 48, 44, 64, 3, '#3a3a40') +
        qWheel(-48, -34, 26, -24, 26) + qWheel(-40, -30, 14, 40, 14); },
    tiller:    P => { const { c } = P; qShadow(P.id, 50, 58);
      return qWheel(30, 42, 18, 30, 18) + qBoxB(-22, 22, 26, 50, 10, 54, c.body, 5) + qBoxB(-12, 12, 50, 62, 20, 44, c.stripe, 3) +
        qPrismX([[10, 40], [14, 42], [-50, 60], [-54, 56]], -18, -14, '#3a3a40') + qPrismX([[10, 40], [14, 42], [-50, 60], [-54, 56]], 14, 18, '#3a3a40') +
        qBoxB(-30, 30, 14, 26, -56, 6, '#8b5a2b', 3) + qRider(P, 0, 26, -24, 9) + qWheel(-42, -30, 18, 30, 18); },
    f_transplanter: P => { const { c } = P; qShadow(P.id, 56, 56);
      return qWheel(28, 38, 13, 30, 13) + qWheel(28, 38, 13, -20, 13) + qBoxB(-56, 56, 12, 20, -60, -46, '#3a3a40', 2) +
        Array.from({ length: 8 }, (_, i) => qPrismZ([[-50 + i * 14, 20], [-46 + i * 14, 20], [-48 + i * 14, 34]], -58, -50, '#34c759')).join('') +
        qBoxB(-26, 26, 18, 44, -40, 50, c.body, 5) + qRider(P, 0, 44, -10, 10) + qWheel(-38, -28, 13, 30, 13) + qWheel(-38, -28, 13, -20, 13); },
    f_drone:   P => { const { c } = P; qShadow(P.id, 40, 40);
      const arm = (x, z) => qBox(Math.min(0, x) - 2, Math.max(0, x) + 2, 58, 62, Math.min(0, z) - 2, Math.max(0, z) + 2, '#3a3a40') + qCylY(x, z, 62, 66, 3, '#3a3a40') + qBall(x, 68, z, 20, 0.8, 20, '#9aa0ae', ' opacity=".6"');
      return arm(38, 38) + arm(38, -38) + qBoxB(-18, 18, 44, 66, -22, 22, c.body, 6) + arm(-38, 38) + arm(-38, -38) + qFaceWin(P, qXRect(-18, -12, 12, 50, 64)) +
        qBox(-3, 3, 30, 44, -3, 3, '#3a3a40') + qBox(-12, 12, 30, 34, -14, 14, c.stripe); },
    // 전통 탈것
    stonecart: P => { qShadow(P.id, 48, 56);
      const sw = x => qCylX(x, 18, 0, 20, 9, '#8f8b84');
      return sw(36) + qBoxB(-36, 36, 22, 30, -46, 46, '#8b5a2b', 3) + qBoxB(-32, 32, 30, 46, -40, -10, '#a0703f', 3) + qRider(P, 0, 30, 14, 10) +
        qPrismZ([[-4, 26], [4, 26], [4, 30], [-4, 30]], 46, 86, '#6b4423') + sw(-45); },
    gama:      P => { const { c } = P; qShadow(P.id, 40, 64);
      return qBoxB(26, 32, 26, 31, -76, 76, '#6b4423', 2) + qBoxB(-30, 30, 30, 80, -32, 32, c.body, 4) + qFaceWin(P, qXRect(-30, -18, 18, 48, 72)) +
        qGlass(P, qZRect(-32, -18, 18, 50, 72)).replace(/url\(#[^)]*w\)/, c.stripe) + qPrismZ([[-42, 80], [42, 80], [26, 98], [-26, 98]], -44, 44, '#3a2a22') +
        qBoxB(-32, -26, 26, 31, -76, 76, '#6b4423', 2) + [-60, 60].map(z => `<path d="M${qp([-29, 26, z])} L${qp([-29, 2, z])}" stroke="#3a2412" stroke-width="3" stroke-linecap="round"/>`).join(''); },
    carriage:  P => { const { c } = P; qShadow(P.id, 46, 80);
      const wl = x => qWheel(x, x + 5, 22, -22, 22, { tire: '#3a2412', face: '#6b4423', rim: '#a0703f' });
      return wl(36) + qHorse(4, 70) + qBoxB(-32, 32, 26, 88, -48, 20, c.body, 8) +
        qFaceWin(P, qXRect(-32, -30, 8, 52, 78)) + qGlass(P, qZRect(-48, -20, 20, 52, 78)) + `<g transform="${qMx(-32)}"><rect x="-48" y="-40" width="68" height="4" fill="${c.stripe}"/></g>` + wl(-41); },
    hwacha:    P => { const { c } = P; qShadow(P.id, 46, 56);
      const wl = x => qWheel(x, x + 5, 20, -6, 20, { tire: '#3a2412', face: '#6b4423', rim: '#a0703f' });
      let rack = qPrismX([[-40, 40], [30, 40], [30, 88], [-40, 66]], -32, 32, '#8b5a2b');
      for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) rack += `<g transform="${qMz(-40)}"><circle cx="${-24 + j * 12}" cy="${-(46 + i * 5)}" r="2.4" fill="#2a1a10"/></g>`;
      return wl(36) + qBoxB(-36, 36, 28, 40, -46, 40, '#6b4423', 3) + rack + qRider(P, -20, 40, -42, 9) + wl(-41); },
    rickshaw:  P => { const { c } = P; qShadow(P.id, 44, 60);
      const wl = x => qWheel(x, x + 4, 24, -10, 24, { tire: '#2a2a35', face: '#3a3a45', rim: '#c9ccd6' });
      return wl(34) + qBoxB(-28, 28, 26, 40, -40, 24, '#2a2a35', 4) + qPrismZ([[-30, 40], [30, 40], [26, 70], [0, 78], [-26, 70]], -40, -26, '#4a1c22') + qRider(P, -4, 40, -6, 11) +
        [-20, 20].map(x => qPrismZ([[x - 2, 32], [x + 2, 32], [x + 2, 35], [x - 2, 35]], 24, 84, '#2a2a35')).join('') + wl(-38); }
  });
  // 말(마차를 끌어요): 다리 넷, 몸통, 목, 머리, 갈기, 꼬리
  function qHorse(x, z) {
    const col = '#9a6a3f', dk = '#6b4423', leg = (lx, lz) => qBox(x + lx - 3, x + lx + 3, 0, 30, z + lz - 3, z + lz + 3, col);
    return leg(8, 18) + leg(8, -16) + `<path d="M${qp([x, 40, z - 22])} Q${qp([x, 30, z - 34])} ${qp([x, 18, z - 30])}" stroke="${dk}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      qBall(x, 40, z, 11, 12, 26, col, ` stroke="${dk}" stroke-width="1"`) + qBall(x, 56, z + 22, 6, 13, 7, col, ` stroke="${dk}" stroke-width="1"`) +
      qBall(x, 66, z + 30, 6, 7, 11, col, ` stroke="${dk}" stroke-width="1"`) + qBall(x - 1, 60, z + 18, 3, 12, 6, dk) +
      `<path d="M${qp([x - 2, 72, z + 26])} L${qp([x - 3, 79, z + 25])} M${qp([x + 2, 72, z + 26])} L${qp([x + 3, 79, z + 25])}" stroke="${dk}" stroke-width="2.6" stroke-linecap="round"/>` +
      qBall(x - 5, 68, z + 34, 1.6, 1.6, 1.6, '#1d1d1f') + leg(-8, 18) + leg(-8, -16);
  }
  // ---------- 하늘을 나는 탈것 ----------
  // 날개판: 뿌리(x=xr, z zr0~zr1) → 끝(x=xt, z zt0~zt1), 두께 th
  function qWing(xr, xt, y, zr0, zr1, zt0, zt1, th, col) {
    let g = qFace([[xr, y - th, zr0], [xt, y - th, zt0], [xt, y, zt0], [xr, y, zr0]], col, [0, 0, -1]);
    if (xt < xr) g += qFace([[xt, y - th, zt0], [xt, y - th, zt1], [xt, y, zt1], [xt, y, zt0]], col, [-1, 0, 0]);
    return g + qFace([[xr, y, zr0], [xt, y, zt0], [xt, y, zt1], [xr, y, zr1]], col, [0, 1, 0]);
  }
  // 둥근 창(몸통 옆 가까운 쪽) 안에 얼굴
  function qPort(P, x, y, z, r) {
    const k = P.id + 'g' + (++rearUid), e = qBall(x, y, z, 0.4, r, r, `url(#${P.id}w)`, ` stroke="${shade(P.c.body, -0.45)}" stroke-width="1.6"`);
    return e + `<defs><clipPath id="${k}">${e}</clipPath></defs><g clip-path="url(#${k})">${qHead(P, x, y - r * 0.15, z, r * 0.82)}</g>`;
  }
  // 유리 덮개(조종석) 안에 얼굴
  function qCanopy(P, x, y, z, a, b, c) {
    const k = P.id + 'g' + (++rearUid), e = qBall(x, y, z, a, b, c, `url(#${P.id}w)`, ` stroke="${shade(P.c.body, -0.45)}" stroke-width="1.2"`);
    return e + `<defs><clipPath id="${k}">${e}</clipPath></defs><g clip-path="url(#${k})">${qHead(P, x, y - b * 0.1, z, Math.min(b, c) * 0.85)}</g>` + qBall(x - a * 0.3, y + b * 0.35, z - c * 0.2, a * 0.35, b * 0.25, c * 0.35, '#fff', ' opacity=".35"');
  }
  function qPlaneQ(P, o) {
    const { c, id } = P, Y = o.y || 34, fr = o.fr, h = o.len / 2, sp = o.span;
    qShadow(id, sp * 0.55, h * 0.75);
    const wy = Y + (o.high ? fr * 0.9 : -fr * 0.3), wz0 = o.wz - o.chord / 2, wz1 = o.wz + o.chord / 2, sw = o.sweep || 0;
    const tz0 = -h + 2, tz1 = -h + o.tail;
    let g = '';
    if (o.prop) g += qBall(0, Y, h + 4, 22, 22, 0.6, '#c9ccd6', ' opacity=".5"');
    g += qWing(fr * 0.7, sp, wy, wz0, wz1, wz0 - sw, wz1 - sw - o.chord * 0.35, 3, c.body);        // 오른쪽 날개(멀리)
    if (o.wing2) g += qWing(fr * 0.7, sp * 0.95, wy + o.wing2, wz0, wz1, wz0 - sw, wz1 - sw - o.chord * 0.35, 3, c.body);
    g += qWing(fr * 0.5, o.stab, Y + fr * 0.2, tz0, tz1, tz0 - 4, tz0 + 6, 2.5, c.body);              // 오른쪽 꼬리날개
    if (o.engines) g += qCylZ(o.engines, wy - 9, wz0 + 4, wz1 + 4, 6, '#c9ccd6', '#3a3a40');
    g += qBall(0, Y, 0, fr, fr * (o.fy || 1), h, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`);   // 몸통
    if (o.ports) for (let z = -h * 0.45; z < h * 0.55; z += 9) g += qBall(-fr * 0.92, Y + fr * 0.25, z, 0.3, 2.2, 2.2, '#5a7a96');
    g += qBall(-fr * 0.3, Y - fr * 0.05, 0, fr * 0.72, 2.4, h * 0.92, c.stripe, ' opacity=".85"');                                // 띠
    if (o.fin2) [-1, 1].forEach(s => { g += qFace([[s * 5, Y + fr * 0.6, tz0], [s * 5, Y + fr * 0.6, tz1], [s * 12, Y + fr + o.finH, tz0 + o.tail * 0.4], [s * 12, Y + fr + o.finH, tz0 + 4]], c.stripe, [-1, 0.2, 0]); });
    else g += qFace([[0, Y + fr * 0.6, tz0], [0, Y + fr * 0.6, tz1], [0, Y + fr + o.finH, tz0 + o.tail * 0.35], [0, Y + fr + o.finH, tz0 + 3]], c.stripe, [-1, 0, 0]);
    if (o.tstab) g += qWing(0, o.stab, Y + fr + o.finH, tz0 + 2, tz0 + 12, tz0, tz0 + 8, 2, c.body) + qWing(0, -o.stab, Y + fr + o.finH, tz0 + 2, tz0 + 12, tz0, tz0 + 8, 2, c.body);
    if (o.engines) g += qCylZ(-o.engines, wy - 9, wz0 + 4, wz1 + 4, 6, '#c9ccd6', '#3a3a40');
    if (o.nozzle) g += `<g transform="${qMz(-h + 1)}"><circle cx="0" cy="${-Y}" r="5" fill="#ff9f0a"/><circle cx="0" cy="${-Y}" r="2.6" fill="#fff6c2"/></g>`;
    g += qWing(-fr * 0.5, -o.stab, Y + fr * 0.2, tz0, tz1, tz0 - 4, tz0 + 6, 2.5, c.body);              // 왼쪽 꼬리날개
    if (o.wing2) g += qWing(-fr * 0.7, -sp * 0.95, wy + o.wing2, wz0, wz1, wz0 - sw, wz1 - sw - o.chord * 0.35, 3, c.body) +
      [-1, 1].map(s => qBox(s * sp * 0.55 - 1, s * sp * 0.55 + 1, wy, wy + o.wing2, o.wz - 1, o.wz + 1, '#6b4423')).join('');
    g += o.port ? qPort(P, -fr * 0.95, Y + fr * 0.15, -h * 0.25, fr * 0.55) : qCanopy(P, 0, Y + fr * 0.75, o.cz || h * 0.25, fr * 0.55, fr * 0.6, fr * 0.95);
    g += qWing(-fr * 0.7, -sp, wy, wz0, wz1, wz0 - sw, wz1 - sw - o.chord * 0.35, 3, c.body);          // 왼쪽 날개(가까이)
    if (o.floats) g += [-1, 1].map(s => qBall(s * 20, 7, 4, 6, 5, h * 0.8, '#f4f5f7', ' stroke="#8a8f99" stroke-width="1"')).join('');
    return g;
  }
  // ---------- 물 위의 탈것 ----------
  const qSea = (rx, rz, cz) => `<ellipse cx="0" cy="${cz || 0}" rx="${rx}" ry="${rz}" transform="${qMy(0)}" fill="#5fb8f0" opacity=".9"/>` +
    `<path d="M${qp([-16, 0, -rz * 0.6])} L${qp([-40, 0, -rz * 1.15])} M${qp([16, 0, -rz * 0.6])} L${qp([40, 0, -rz * 1.15])}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
  const qFoam = (rx, rz, cz) => `<ellipse cx="0" cy="${cz || 0}" rx="${rx}" ry="${rz}" transform="${qMy(0)}" fill="none" stroke="#fff" stroke-width="3" opacity=".75"/>`;
  // 배 몸통: 갑판(y=deck)의 윤곽이 뱃머리로 좁아지고, 물(y=0)까지 내려와요
  function qHullQ(P, w, deck, zr, zb, zf, col, deckCol) {
    const k = 0.78, A = [-w, deck, zr], B = [w, deck, zr], C = [w, deck, zb], D = [0, deck, zf], E = [-w, deck, zb];
    const a = [-w * k, 0, zr + 4], b = [w * k, 0, zr + 4], e = [-w * k, 0, zb], d = [0, 0, zf - 8];
    return qFace([A, B, b, a], col, [0, 0.3, -1]) + qFace([A, a, e, E], col, [-1, 0.2, 0]) + qFace([E, e, d, D], col, [-1, 0.2, 0.7]) +
      qFace([A, B, C, D, E], deckCol || '#c49a63', [0, 1, 0]) + `<path d="M${qp(B)} L${qp(A)} L${qp(E)} L${qp(D)}" fill="none" stroke="${P.c.stripe}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  function qShip(P, o) {
    qShadow(P.id, 1, 1);
    QSHADOW = qSea(o.w + 18, (o.zf - o.zr) / 2 + 14, (o.zf + o.zr) / 2);
    let g = (o.back ? o.back(P, o) : '') + qHullQ(P, o.w, o.deck, o.zr, o.zb, o.zf, o.hull || P.c.body, o.deckCol) + (o.top ? o.top(P, o) : '');
    return g + qFoam(o.w * 0.85, (o.zf - o.zr) / 2 + 2, (o.zf + o.zr) / 2);
  }

  Object.assign(Q45, {
    p_airliner:  P => qPlaneQ(P, { fr: 13, len: 124, span: 62, chord: 26, wz: 4, sweep: 16, stab: 24, tail: 22, finH: 26, engines: 28, ports: true, port: true }),
    p_fighter:   P => qPlaneQ(P, { fr: 10, len: 110, span: 44, chord: 34, wz: -8, sweep: 18, stab: 20, tail: 20, finH: 18, fin2: true, nozzle: true, cz: 24 }),
    p_light:     P => qPlaneQ(P, { fr: 11, len: 92, span: 58, chord: 18, wz: 10, high: true, stab: 20, tail: 18, finH: 20, prop: true, cz: 16 }),
    p_biplane:   P => qPlaneQ(P, { fr: 11, len: 88, span: 52, chord: 18, wz: 12, wing2: 18, stab: 18, tail: 18, finH: 18, prop: true, cz: 0 }),
    p_aerobatic: P => qPlaneQ(P, { fr: 11, len: 92, span: 50, chord: 20, wz: 6, stab: 20, tail: 18, finH: 20, prop: true, cz: 14 }),
    p_glider:    P => qPlaneQ(P, { fr: 7, len: 96, span: 76, chord: 12, wz: 8, stab: 16, tail: 16, finH: 22, tstab: true, cz: 24 }),
    p_seaplane:  P => { const g = qPlaneQ(P, { fr: 11, len: 92, span: 56, chord: 18, wz: 10, high: true, stab: 20, tail: 18, finH: 20, prop: true, floats: true, y: 26, cz: 16 }); QSHADOW = qSea(48, 56); return g; },
    p_heli: P => { const { c, id } = P, Y = 34; qShadow(id, 36, 48);
      return qCylZ(0, Y + 4, -72, -16, 4, c.body) + qFace([[0, Y + 4, -72], [0, Y + 4, -60], [0, Y + 24, -66], [0, Y + 24, -72]], c.stripe, [-1, 0, 0]) +
        [16].map(x => qCylZ(x, 6, -24, 26, 2, '#3a3a40')).join('') + qBall(0, Y, 0, 22, 20, 30, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`) +
        qCanopy(P, -6, Y + 4, 14, 16, 14, 16) + qCylY(0, 0, Y + 18, Y + 26, 2.5, '#3a3a40') + `<ellipse cx="0" cy="0" rx="64" ry="64" transform="${qMy(Y + 26)}" fill="#9aa0ae" opacity=".28"/>` +
        `<g transform="${qMy(Y + 26)}"><rect x="-64" y="-2.5" width="128" height="5" rx="2.5" fill="#3a3a40" transform="rotate(25)"/></g>` + qCylZ(-16, 6, -24, 26, 2, '#3a3a40') +
        [-16, 16].map(x => `<path d="M${qp([x, 6, -10])} L${qp([x * 0.6, Y - 14, -10])} M${qp([x, 6, 12])} L${qp([x * 0.6, Y - 14, 12])}" stroke="#3a3a40" stroke-width="2"/>`).join(''); },
    p_balloon: P => { const { c, id } = P; qShadow(id, 22, 22);
      return `<path d="M${qp([-24, 70, 0])} L${qp([-12, 34, 0])} M${qp([24, 70, 0])} L${qp([12, 34, 0])} M${qp([0, 66, -20])} L${qp([0, 34, -10])}" stroke="#6b4423" stroke-width="1.2"/>` +
        qBall(0, 100, 0, 40, 44, 40, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`) + qBall(0, 100, 0, 14, 44, 40, c.stripe, ' opacity=".9"') +
        qBall(0, 100, 0, 40, 44, 14, c.stripe, ' opacity=".55"') + qHead(P, 0, 42, 0, 9) + qBoxB(-12, 12, 18, 36, -12, 12, '#a0703f', 2); },
    p_blimp: P => { const { c, id } = P, Y = 64; qShadow(id, 34, 60);
      const fin = s => qFace([[s * 4, Y, -50], [s * 30, Y, -66], [s * 30, Y, -58], [s * 4, Y, -36]], c.stripe, [0, 1, 0]);
      return fin(1) + qFace([[0, Y + 4, -50], [0, Y + 32, -66], [0, Y + 32, -58], [0, Y + 4, -36]], c.stripe, [-1, 0, 0]) +
        qBall(0, Y, 0, 28, 28, 66, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`) + qBall(-6, Y - 2, 0, 24, 2.5, 60, c.stripe, ' opacity=".85"') + fin(-1) +
        qBoxB(-10, 10, Y - 40, Y - 26, -14, 18, '#e3e5ec', 4) + qFaceWin(P, qXRect(-10, -8, 12, Y - 38, Y - 28)); },
    // 배
    s_turtle:    P => qShip(P, { w: 34, deck: 24, zr: -56, zb: 24, zf: 64, deckCol: '#8b5a2b',
      top: (P2, o) => qPrismZ(Array.from({ length: 11 }, (_, i) => { const t = Math.PI - i / 10 * Math.PI; return [Math.cos(t) * 32, 24 + Math.sin(t) * 26]; }).concat([[32, 24]]).reverse(), -50, 30, '#3b2a1e') +
        Array.from({ length: 6 }, (_, i) => qFace([[-14, 50, -44 + i * 13], [-6, 50, -44 + i * 13], [-10, 58, -42 + i * 13]], '#c9ccd6', [-0.3, 1, -0.3])).join('') +
        qBall(0, 40, 56, 8, 9, 10, '#d9a441') + qFaceWin(P2, qZRect(-50, -10, 10, 28, 40)) }),
    s_panokseon: P => qShip(P, { w: 38, deck: 24, zr: -56, zb: 26, zf: 66, deckCol: '#a0703f',
      top: (P2, o) => qBoxB(-32, 32, 24, 42, -48, 30, '#a0703f', 3) + qBoxB(-24, 24, 42, 56, -40, 16, '#8b5a2b', 3) + `<path d="M${qp([-32, 42, -48])} L${qp([32, 42, -48])}" stroke="${P2.c.stripe}" stroke-width="2.5"/>` +
        qRider(P2, -8, 56, -24, 8) + qCylY(0, 0, 56, 110, 2, '#5a3a1e') + qFace([[0, 110, 0], [0, 98, 0], [0, 104, 18]], '#e2412e', [-1, 0, 0]) }),
    s_sailboat:  P => qShip(P, { w: 28, deck: 20, zr: -48, zb: 20, zf: 56, deckCol: '#a0703f',
      top: (P2, o) => qCylY(0, 6, 20, 118, 2, '#5a3a1e') + qFace([[-32, 40, 4], [32, 40, 4], [26, 112, 4], [-26, 112, 4]], P2.c.stripe, [0, 0, -1]) +
        [56, 72, 88].map(y => `<path d="M${qp([-31, y, 4])} L${qp([31, y, 4])}" stroke="#a0703f" stroke-width="1.6"/>`).join('') + qRider(P2, 0, 20, -34, 8) }),
    s_yacht:     P => qShip(P, { w: 30, deck: 20, zr: -50, zb: 18, zf: 60, deckCol: '#f4f5f7',
      top: (P2, o) => qBoxB(-18, 18, 20, 32, -14, 22, '#ffffff', 4) + qCylY(0, 0, 20, 120, 1.6, '#9aa0ae') + qFace([[0, 26, -40], [0, 118, -2], [0, 26, -2]], '#ffffff', [-1, 0, 0]) +
        qFace([[0, 30, 2], [0, 104, 2], [0, 30, 40]], P2.c.stripe, [-1, 0, 0]) + qRider(P2, -10, 20, -36, 8) }),
    s_carrier:   P => qShip(P, { w: 44, deck: 22, zr: -70, zb: 40, zf: 80, hull: '#6b7484', deckCol: '#5b6578',
      top: (P2, o) => `<path d="M${qp([0, 22.2, -64])} L${qp([0, 22.2, 60])}" stroke="#fff" stroke-width="1.5" stroke-dasharray="6 4"/>` + qBoxB(22, 38, 22, 58, -10, 20, '#8a95a8', 3) +
        qFaceWin(P2, qXRect(22, -6, 14, 44, 54)) + qCylY(30, 4, 58, 76, 1.5, '#5b6578') + qWing(0, 12, 26, -40, -30, -44, -38, 2, '#c9ccd6') + qWing(0, -12, 26, -40, -30, -44, -38, 2, '#c9ccd6') }),
    s_submarine: P => { const { c, id } = P; QSHADOW = qSea(40, 66); return qBall(0, 6, 0, 26, 22, 64, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`) +
      qBoxB(-9, 9, 18, 46, -10, 16, c.body, 5) + qHead(P, 0, 50, 0, 8) + qCylY(5, 10, 46, 62, 1.5, '#3a3a40') + `<g transform="${qMz(-62)}"><path d="M0 -12 V0 M-8 -6 H8" stroke="${c.stripe}" stroke-width="4" stroke-linecap="round"/></g>` +
      `<ellipse cx="0" cy="0" rx="30" ry="66" transform="${qMy(4)}" fill="#5fb8f0" opacity=".55"/>` + qFoam(28, 64); },
    s_cruise:    P => qShip(P, { w: 42, deck: 26, zr: -68, zb: 34, zf: 78, hull: P.c.body, deckCol: '#f4f5f7',
      top: (P2, o) => [[36, 26, 40, -60, 30], [30, 40, 54, -54, 20], [22, 54, 66, -46, 6]].map(([w2, y0, y1, z0, z1]) => qBoxB(-w2, w2, y0, y1, z0, z1, '#ffffff', 3) +
          `<g transform="${qMx(-w2)}">${Array.from({ length: Math.floor((z1 - z0 - 8) / 8) }, (_, i) => `<rect x="${z0 + 5 + i * 8}" y="${-(y1 - 4)}" width="4.5" height="5" rx="1" fill="#5fb8f0"/>`).join('')}</g>`).join('') +
        qCylY(0, -24, 66, 88, 8, P2.c.stripe) + qFaceWin(P2, qZRect(-46, -8, 8, 57, 64)) }),
    s_fishing:   P => qShip(P, { w: 30, deck: 20, zr: -50, zb: 18, zf: 58, deckCol: '#c49a63',
      top: (P2, o) => qBoxB(-18, 18, 20, 48, -8, 22, '#ffffff', 4) + qFaceWin(P2, qXRect(-18, -2, 16, 30, 44)) + qCylY(0, -30, 20, 84, 1.6, '#5a3a1e') +
        qFace([[0, 84, -30], [0, 76, -30], [0, 80, -18]], '#ffd84a', [-1, 0, 0]) + `<path d="M${qp([0, 80, -30])} L${qp([-20, 20, -46])}" stroke="#5a3a1e" stroke-width="1.2"/>` }),
    s_motorboat: P => qShip(P, { w: 28, deck: 18, zr: -48, zb: 10, zf: 58, deckCol: '#f4f5f7',
      top: (P2, o) => qBoxB(-6, 6, 4, 26, -56, -46, '#26262b', 3) + qRider(P2, 0, 18, -20, 9) + qFace([[-20, 18, 4], [20, 18, 4], [16, 34, 10], [-16, 34, 10]], '#bfe3f5', [0, 0.4, -1]) }),
    s_container: P => qShip(P, { w: 44, deck: 22, zr: -70, zb: 40, zf: 80, deckCol: '#5b6578',
      top: (P2, o) => qBoxB(-26, 26, 22, 74, -66, -42, '#ffffff', 3) + qFaceWin(P2, qZRect(-66, -10, 10, 58, 68)) +
        [['#2f7fd1', -36, -38], ['#f5c242', 2, -38], ['#34c759', -36, -10], ['#e2412e', 2, -10], ['#ff9f0a', -36, 18], ['#8a55d6', 2, 18], ['#2f7fd1', -17, 44]].map(([col, x, z]) => qBoxB(x, x + 34, 22, 38, z, z + 26, col, 2)).join('') }),
    s_banana:    P => { const { c, id } = P; QSHADOW = qSea(40, 72);
      return [26, -26].map(x => qBall(x, 8, 0, 7, 7, 48, c.body, ` stroke="${shade(c.body, -0.3)}" stroke-width="1"`))[0] + qBall(0, 14, 0, 14, 13, 66, `url(#${id}b)`, ` stroke="${shade(c.body, -0.3)}" stroke-width="1.2"`) +
        [30, 6, -18].map(z => qRider(P, 0, 22, z, 7)).join('') + qBall(-26, 8, 0, 7, 7, 48, c.body, ` stroke="${shade(c.body, -0.3)}" stroke-width="1"`) + qFoam(30, 66); },
    // 상상 탈것
    x_rudolph: P => { const { c, id } = P; qShadow(id, 40, 70);
      const runner = x => `<path d="M${qp([x, 4, -40])} L${qp([x, 4, 30])} Q${qp([x, 4, 44])} ${qp([x, 18, 40])}" stroke="#f5c242" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      return runner(22) + qBall(0, 34, 70, 12, 14, 24, '#a0703f') + qBall(0, 56, 92, 7, 9, 10, '#a0703f') + `<path d="M${qp([-4, 64, 94])} L${qp([-12, 82, 90])} M${qp([4, 64, 94])} L${qp([12, 82, 90])} M${qp([-9, 76, 92])} L${qp([-16, 76, 88])} M${qp([9, 76, 92])} L${qp([16, 76, 88])}" stroke="#8b5a2b" stroke-width="2.4" stroke-linecap="round"/>` +
        qBall(0, 58, 101, 2.5, 2.5, 2.5, '#ff3b30') + qBoxB(-26, 26, 10, 34, -44, 26, c.body, 6) + qBall(14, 44, -26, 14, 14, 14, '#8b5a2b') + qRider(P, -6, 34, -6, 10) + runner(-26); },
    x_pumpkin: P => { const { c, id } = P; qShadow(id, 44, 46);
      const wl = x => qWheel(x, x + 5, 18, -10, 18, { tire: '#8a6a10', face: '#d4a72c', rim: '#f5d76e' });
      return wl(40) + qBall(0, 48, 0, 42, 38, 42, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`) + [12, 26].map(a => qBall(0, 48, 0, a, 38, 42, 'none', ` stroke="${shade(c.body, -0.3)}" stroke-width="1.2"`)).join('') +
        qPort(P, -36, 50, -8, 13) + `<path d="M${qp([0, 86, 0])} Q${qp([4, 96, 4])} ${qp([10, 94, 8])}" stroke="#3e9a4d" stroke-width="4" fill="none" stroke-linecap="round"/>` + wl(-45); },
    x_carpet: P => { const { c, id } = P; qShadow(id, 38, 50);
      return qBox(-34, 34, 22, 25, -46, 46, c.body) + `<path d="${qPoly([[-30, 25.1, -42], [30, 25.1, -42], [30, 25.1, 42], [-30, 25.1, 42]])}" fill="none" stroke="${c.stripe}" stroke-width="2.4"/>` +
        [-30, -15, 0, 15, 30].map(x => `<path d="M${qp([x, 22, -46])} L${qp([x, 16, -48])}" stroke="${c.stripe}" stroke-width="2" stroke-linecap="round"/>`).join('') + qRider(P, 0, 25, -6, 11); },
    x_broom: P => { const { c, id } = P; qShadow(id, 18, 56);
      return qCylZ(0, 34, -30, 62, 2.4, '#8a5a2b') + qBall(0, 34, -40, 12, 12, 20, '#d9a441', ' stroke="#8a6a28" stroke-width="1"') + qRider(P, 0, 34, 4, 10, c.stripe) +
        qFace([[-11, 81, 4], [11, 81, 4], [0, 104, 4]], c.stripe, [0, 0.2, -1]); },
    x_cloud: P => { qShadow(P.id, 40, 34);
      return [[18, 30, 10, 18], [-14, 26, 14, 18], [10, 26, -18, 18], [-10, 34, -10, 20], [0, 40, 14, 18]].map(([x, y, z, r]) => qBall(x, y, z, r, r * 0.85, r, '#ffffff', ' stroke="#dbe9f5" stroke-width="1.2"')).join('') + qHead(P, -2, 58, 0, 11); },
    x_rocket: P => { const { c, id } = P, Y = 40; qShadow(id, 26, 60);
      const fin = (x, y) => qFace([[x * 0.4, Y + y * 0.4, -40], [x, Y + y, -62], [x, Y + y, -50], [x * 0.4, Y + y * 0.4, -24]], c.stripe, [x < 0 ? -1 : 0.3, y > 0 ? 1 : -0.2, -0.3]);
      return fin(18, -14) + qBall(0, Y, -66, 10, 10, 12, '#ff9f0a', ' opacity=".9"') + qBall(0, Y, -72, 6, 6, 8, '#fff6c2') + qBall(0, Y, 0, 16, 16, 60, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`) +
        qBall(-2, Y, 0, 15, 15, 3, c.stripe, ' opacity=".9"') + fin(0, 26) + fin(-18, -14) + qPort(P, -15, Y + 3, 18, 9); },
    x_ufo: P => { const { c, id } = P, Y = 36; qShadow(id, 40, 40);
      return qBall(0, Y, 0, 56, 12, 56, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.2"`) +
        Array.from({ length: 8 }, (_, i) => { const t = i / 8 * Math.PI * 2; return qBall(Math.cos(t) * 50, Y - 2, Math.sin(t) * 50, 3, 3, 3, c.stripe); }).join('') + qCanopy(P, 0, Y + 14, 0, 24, 18, 24); },
    x_paperplane: P => { const { c, id } = P, Y = 34; qShadow(id, 34, 54);
      return qFace([[0, Y, 60], [40, Y + 10, -40], [4, Y, -40]], '#f2f4f7', [0.2, 1, 0]) + qFace([[0, Y, 60], [0, Y - 14, -36], [0, Y, -40]], '#e3e6ec', [-1, 0, 0]) + qRider(P, -6, Y, -6, 9) +
        qFace([[0, Y, 60], [-4, Y, -40], [-40, Y + 10, -40]], '#ffffff', [-0.2, 1, 0]) + `<path d="M${qp([0, Y + 0.5, 60])} L${qp([0, Y + 0.5, -40])}" stroke="${c.stripe}" stroke-width="1.6"/>`; },
    x_sled: P => { const { c, id } = P; qShadow(id, 34, 52);
      const runner = x => `<path d="M${qp([x, 3, -44])} L${qp([x, 3, 30])} Q${qp([x, 3, 44])} ${qp([x, 16, 42])}" stroke="#d7261e" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      return runner(20) + qBoxB(-24, 24, 10, 22, -44, 32, c.body, 4) + `<g transform="${qMx(-24)}">${[-34, -14, 6, 26].map(z => `<path d="M${z} -11 V-21" stroke="${shade(c.body, -0.35)}" stroke-width="1.2"/>`).join('')}</g>` + qRider(P, 0, 22, -10, 10) + runner(-24); },
    x_turtle: P => { const { c, id } = P; qShadow(id, 44, 54);
      const leg = (x, z) => qBall(x, 8, z, 9, 7, 10, '#4f9a5a');
      return leg(26, 26) + leg(26, -26) + qBall(0, 26, 50, 11, 10, 14, '#4f9a5a') + qBall(0, 22, 0, 40, 30, 46, `url(#${id}b)`, ` stroke="${shade(c.body, -0.35)}" stroke-width="1.4"`) +
        [[-14, 40, -10], [10, 46, 6], [-6, 44, 22], [14, 40, -24]].map(([x, y, z]) => qBall(x, y, z, 9, 4, 9, shade(c.body, -0.15), ' opacity=".8"')).join('') +
        leg(-26, 26) + leg(-26, -26) + qBall(0, 12, -48, 4, 4, 6, '#4f9a5a') + qRider(P, 0, 50, 0, 9); }
  });
  // 원기둥(x 방향): 왼쪽 원판이 보여요(돌바퀴)
  function qCylX(x0, y, z, len, r, col) {
    const x1 = x0 + len, pts = qRing(t => [[x0, y + Math.sin(t) * r * 2, z + Math.cos(t) * r * 2], [x1, y + Math.sin(t) * r * 2, z + Math.cos(t) * r * 2]]).flat().map(p => [qu(...p), qv(...p)]);
    return `<path d="${qHullPath(pts)}" fill="${shade(col, -0.25)}"/><g transform="${qMx(x0)}"><circle cx="${f1(z)}" cy="${f1(-y)}" r="${f1(r * 2)}" fill="${col}" stroke="${shade(col, -0.35)}" stroke-width="1.4"/><circle cx="${f1(z)}" cy="${f1(-y)}" r="${f1(r * 0.6)}" fill="${shade(col, -0.4)}"/></g>`;
  }

  // 동물 캐릭터: 정면 그림 그대로 두되 얼굴을 왼쪽으로 살짝 돌려 뒤를 돌아보는 모습
  let FLUFF_TURN = false;
  function quarterSVG(i) {
    const n = CARS.length, k = ((i % n) + n) % n, c = CARS[k], id = 'q' + k + '_' + (++rearUid);
    const P = { c, id, dark: shade(c.body, -0.38), lite: shade(c.body, 0.42), deep: shade(c.body, -0.6), toy: false, back: true };
    let inner = null;
    QID = id;
    QSHADOW = '';
    if (Q45[c.kind]) { // 그림자는 외곽선 밖에. 비행기는 날개가 가늘어서 크게
      const body = Q45[c.kind](P), k = /^p_/.test(c.kind) && c.kind !== 'p_balloon' ? 1.35 : 1;
      inner = `<g transform="scale(${k})">${QSHADOW}<g filter="url(#${id}o)">${body}</g></g>`;
    }
    else if (/^[abm]_/.test(c.kind) && SPECIAL[c.kind]) {
      FLUFF_TURN = true;
      try { qShadow(id, 40, 34); inner = QSHADOW + `<g transform="scale(1.4) translate(-60 -65)">${SPECIAL[c.kind](P)}</g>`; } finally { FLUFF_TURN = false; }
    }
    if (inner == null) inner = `<g transform="translate(-60 -66)">${rearSVG(i).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>`; // 아직 45도 그림이 없는 탈것은 뒷모습
    return `<svg class="car-svg q" viewBox="-85 -125 170 170" aria-hidden="true">${qDefs(id, c)}${inner}</svg>`;
  }

  function carSVG(i) {
    const n = CARS.length, k = ((i % n) + n) % n, c = CARS[k], id = 'car' + k + '_' + (++carUid);
    const dark = shade(c.body, -0.38), lite = shade(c.body, 0.42), deep = shade(c.body, -0.6);
    // 동물 캐릭터가 아닌 탈것은 장난감처럼 통통한 입체로: 몸통에 빛과 그림자, 테두리는 몸 색의 부드러운 선
    const toy = !/캐릭터/.test(c.group);
    const P = { c, id, dark, lite, deep, toy };
    const top = `<svg class="car-svg${toy ? ' toy' : ''}" viewBox="0 -14 120 86" aria-hidden="true">
      <defs>${toy ? TOY_FILTER(id) : ''}
        <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lite}"/><stop offset=".42" stop-color="${c.body}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
        <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f5fc"/><stop offset=".5" stop-color="#b9d9ec"/><stop offset="1" stop-color="#7fa4c0"/></linearGradient>
        <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <radialGradient id="${id}s"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}t" cx=".45" cy=".4" r=".6"><stop offset=".6" stop-color="#34343b"/><stop offset="1" stop-color="#121216"/></radialGradient>
        <radialGradient id="${id}r" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ccd6"/></radialGradient>
        <radialGradient id="${id}l"><stop offset="0" stop-color="#fffbe0"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="65" rx="${/캐릭터/.test(c.group) ? 36 : 57}" ry="6.5" fill="url(#${id}s)"/>`;
    if (SPECIAL[c.kind]) return top + SPECIAL[c.kind](P) + objFace(c.kind, id) + '</svg>';

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
    // 애니메이션 자동차처럼: 몸은 짧고 통통하게(가로 0.84배, 세로 1.1배), 바퀴는 크게
    const tx = x => 60 + (x - 60) * 0.84;
    return top + `<g transform="translate(60 57) scale(.84 1.1) translate(-60 -57)">
      <defs><clipPath id="${id}c"><rect x="0" y="-30" width="120" height="${s.belt + 30}"/></clipPath><clipPath id="${id}v">${s.win.map(d => `<path d="${d}"/>`).join("")}</clipPath></defs>
      ${s.body.map(d => `<path d="${d}" ${BODY(P)}/>`).join('')}
      ${s.rails ? `<path d="${s.rails}" stroke="${deep}" stroke-width="2.2" stroke-linecap="round"/>` : ''}
      ${s.win.map(d => `<path d="${d}" fill="url(#${id}w)"/>`).join('')}
      ${s.eyes ? `<g clip-path="url(#${id}c)">${driver(c.driver, hx, hy, hr)}</g>${toonEyes(s.eyes[0], s.eyes[1], s.eyes[2], id)}` : `<g clip-path="url(#${id}v)">${toonEyes(hx, hy, hr, id)}</g>`}
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
      ${toonMouth(s.lx, s.ly, dark)}</g>
      ${s.wheels.map(w => `<g transform="translate(${f1(tx(w))} 56) scale(1.15) translate(${-w} -56)">${wheel(w, id, deep)}</g>`).join('')}
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
    return `<text x="${x}" y="${y}" font-family="'Gowun Batang', 'Noto Serif KR', serif" font-weight="700" font-size="${size}" fill="${fill}" text-anchor="middle" ${extra || ''}>${text}</text>`;
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

  window.ART = { CARS, GROUPS, carSVG, rearSVG, rearSide, quarterSVG, sceneSVG, hasArt };
})();
