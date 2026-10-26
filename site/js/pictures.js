/*
 * 문제 그림: 선지·문제 속 핵심어마다 보여 줄 사진, 사진을 못 찾은 낱말은 대한민국 임시 정부 태극기
 * - 사진은 위키미디어 공용의 자유 이용 자료(대부분 퍼블릭 도메인)만 작게 줄여 씁니다. 출처는 credits.html
 * - 새 사진을 넣으려면 img/photo 폴더에 파일을 넣고 PHOTOS에 한 줄 더하면 됩니다.
 *   keys: 이 사진을 보여 줄 낱말(선지 글자와 같거나, 문제 글 속에 들어 있으면 보여 줌)
 *   choiceOnly: 나라 국기처럼 선지에만 쓰고 문제 글에서는 찾지 않을 때
 * - 날짜·도시 이름은 keys에 넣지 마세요. 정답만 사진이 나와 답이 드러날 수 있어요.
 */
(function () {
  const C0 = 'https://commons.wikimedia.org/wiki/File:';
  const PD = '퍼블릭 도메인';
  const PHOTOS = [
    // 무장 독립 투쟁
    { src: 'img/photo/hong-beomdo-1921.jpg', note: '봉오동 전투를 이끈 홍범도(1921)', keys: ['봉오동 전투', '봉오동', '홍범도', '대한 독립군'], page: C0 + 'Hong_Beom-do_1921.jpg', license: PD },
    { src: 'img/photo/cheongsanri-1920.jpg', note: '청산리 전투에서 독립군이 빼앗은 일본군 무기(1920)', keys: ['청산리 대첩', '청산리 전투', '청산리', '북로 군정서'], page: C0 + 'Battle_of_Qingshanli.JPG', license: PD },
    { src: 'img/photo/ji-cheongcheon-1945.jpg', note: '한국 독립군을 이끈 지청천(가운데, 1945)', keys: ['쌍성보 전투', '대전자령 전투', '쌍성보', '대전자령', '지청천', '한국 독립군'], page: C0 + 'General_Ji_Cheong-cheon.jpg', license: PD },
    { src: 'img/photo/yang-sebong.jpg', note: '조선 혁명군을 이끈 양세봉', keys: ['영릉가 전투', '흥경성 전투', '영릉가', '흥경성', '양세봉', '조선 혁명군'], page: C0 + 'Photo_of_Yang_Se-bong.jpg', license: PD },
    { src: 'img/photo/jeamni-1919.png', note: '일본군의 학살 뒤 남은 제암리 마을(1919)', keys: ['제암리 사건', '제암리 학살', '제암리'], page: C0 + 'JeamniMassacre.png', license: PD },
    { src: 'img/photo/liberation-army.jpg', note: '한국 광복군', keys: ['한국 광복군', '국내 진공 작전'], page: C0 + 'Korean_Liberation_Army.JPG', license: PD },
    { src: 'img/photo/volunteer-corps.jpg', note: '조선 의용대', keys: ['조선 의용대'], page: C0 + 'Korean_Volunteers.jpg', license: PD },
    { src: 'img/photo/sinhanchon-1920.jpg', note: '연해주 신한촌의 3·1 운동 기념 시위(1920)', keys: ['신한촌'], page: C0 + 'Shinhanchon_March_1st_Movement_Anniversary_Protest_(1920)_01_(cropped).jpg', license: PD },
    // 사람
    { src: 'img/photo/kim-gu-1949.jpg', note: '김구(1949)', keys: ['김구', '한인 애국단', '한국 독립당'], page: C0 + 'Kim_Gu_in_1949.jpg', license: PD },
    { src: 'img/photo/yun-bonggil-1932.jpg', note: '한인 애국단에 들며 선서하는 윤봉길(1932)', keys: ['윤봉길', '훙커우 공원'], page: C0 + '%EC%82%AC%EC%A7%841(%EC%9C%A4%EB%B4%89%EA%B8%B8_%EC%84%A0%EC%84%9C%EC%9E%A5%EB%A9%B4).jpg', license: PD },
    { src: 'img/photo/lee-bongchang-1931.jpg', note: '태극기 앞에 선 이봉창(1931)', keys: ['이봉창'], page: C0 + '%ED%83%9C%EA%B7%B9%EA%B8%B0_%EC%95%9E%EC%97%90_%EC%84%A0_%EC%9D%B4%EB%B4%89%EC%B0%BD.jpg', license: PD },
    { src: 'img/photo/kim-wonbong-1932.png', note: '의열단을 이끈 김원봉(1931)', keys: ['김원봉', '의열단'], page: C0 + 'Kim_Won-bong_1932.PNG', license: PD },
    { src: 'img/photo/shin-chaeho.jpg', note: '신채호', keys: ['신채호', '조선 혁명 선언'], page: C0 + 'Danjae_Shin_Chae-ho.jpg', license: PD },
    { src: 'img/photo/ahn-changho-1919.jpg', note: '안창호', keys: ['안창호', '대한인 국민회', '신민회'], page: C0 + 'Dosan_Ahn_Chang-ho_in_1919.jpg', license: PD },
    { src: 'img/photo/bang-jeonghwan.jpg', note: '방정환', keys: ['방정환', '천도교 소년회', '소년 운동', '어린이날'], page: C0 + '%EB%B0%A9%EC%A0%95%ED%99%98.JPG', license: PD },
    { src: 'img/photo/yuh-woonhyung.jpg', note: '여운형(가운데, 1930년대)', keys: ['여운형', '조선 건국 동맹', '조선 건국 준비 위원회', '건국 준비 위원회', '좌우 합작 위원회', '좌우 합작'], page: C0 + 'Yuh_Woon-Hyung(1934).jpg', license: PD },
    { src: 'img/photo/kim-kyusik.jpg', note: '김규식', keys: ['김규식'], page: C0 + 'Kim_Kyu-sik.JPG', license: PD },
    { src: 'img/photo/rhee-syngman-1948.jpg', note: '이승만(1948)', keys: ['이승만', '이승만 정부', '독립 촉성 중앙 협의회', '발췌 개헌', '사사오입 개헌', '단독 정부'], page: C0 + 'Rhee_Syng-man_1948.jpg', license: PD },
    { src: 'img/photo/chang-myon-1955.jpg', note: '장면(1955)', keys: ['장면 내각', '장면', '내각제 개헌'], page: C0 + 'Chang_Myon_1955.jpg', license: PD },
    { src: 'img/photo/park-chunghee-1963.png', note: '박정희', keys: ['박정희', '박정희 정부', '10월 유신', '유신 헌법', '유신 체제'], page: C0 + 'Park_Chung-hee_1963%27s.png', license: PD },
    { src: 'img/photo/chun-doohwan-1983.jpg', note: '전두환(1983)', keys: ['전두환', '전두환 정부', '12·12 군사 반란', '12·12 사태', '신군부'], page: C0 + 'Chun_Doo-hwan_1983_(cropped).JPEG', license: PD },
    { src: 'img/photo/gojong.jpg', note: '대한 제국 고종 황제', keys: ['대한 제국', '고종', '헤이그 특사'], page: C0 + 'Gojong_of_the_Korean_Empire.jpg', license: PD },
    // 국권 피탈과 조약
    { src: 'img/photo/russo-japanese-1904.jpg', note: '러일 전쟁 때 제물포의 일본군(1904)', keys: ['러일 전쟁'], page: C0 + 'Japanese_soldiers_near_Chemulpo_Korea_August_September_1904_Russo_Japanese_War.jpg', license: PD },
    { src: 'img/photo/eulsa-1905.png', note: '을사늑약', keys: ['을사늑약', '을사조약'], page: C0 + 'Eulsa_treaty_photo.png', license: PD },
    { src: 'img/photo/portsmouth-1905.jpg', note: '포츠머스 조약이 맺어진 곳(1905)', keys: ['포츠머스 조약'], page: C0 + 'Treaty_of_Portsmouth_postcard_-_Hotel_Wentworth_ppmsca.08184.jpg', license: PD },
    { src: 'img/photo/ganghwa-1876.jpg', note: '강화도 조약 체결(1876)', keys: ['강화도 조약'], page: C0 + 'GanghwaTreaty.jpg', license: PD },
    { src: 'img/photo/annexation-1910.jpg', note: '한·일 병합 조약 문서(1910)', keys: ['한·일 병탄', '국권 피탈', '병합 조약'], page: C0 + 'Japan%E2%80%93Korea_Annexation_Treaty_1.jpg', license: PD },
    { src: 'img/photo/resident-general.jpg', note: '통감부의 초대 통감 이토 히로부미', keys: ['통감부'], page: C0 + 'Ito_general_resident.jpg', license: PD },
    { src: 'img/photo/government-general.jpg', note: '짓고 있는 조선 총독부 건물', keys: ['조선 총독부'], page: C0 + 'Government-General_of_Ch%C5%8Dsen_Building_under_construction.jpg', license: PD },
    // 민족 운동
    { src: 'img/photo/feb8-declaration-1919.jpg', note: '2·8 독립 선언서(1919)', keys: ['2·8 독립 선언'], page: C0 + 'February_8_Declaration_of_Independence.jpg', license: PD },
    { src: 'img/photo/june10-1926.jpg', note: '6·10 만세 운동(1926)', keys: ['6·10 만세 운동'], page: C0 + '6.10_%EB%A7%8C%EC%84%B8%EC%9A%B4%EB%8F%99.jpg', license: PD },
    { src: 'img/photo/gwangju-student-1929.png', note: '광주 학생 항일 운동', keys: ['광주 학생 항일 운동', '광주 학생 운동'], page: C0 + '%EA%B4%91%EC%A3%BC%ED%95%99%EC%83%9D%EC%9A%B4%EB%8F%99_%EC%82%AC%EA%B1%B41.PNG', license: PD },
    { src: 'img/photo/wonsan-1929.png', note: '원산 총파업 기사(조선일보, 1929)', keys: ['원산 총파업'], page: C0 + 'The_Chosun_Ilbo,_1_Feburary_1929,_p.2,_Wonsan_Strike_(cropped_1).png', license: PD },
    { src: 'img/photo/dong-a-1920.jpg', note: '동아일보 창간호(1920)', keys: ['동아일보'], page: C0 + 'Dong_a-ilbo_19200401.jpg', license: PD },
    { src: 'img/photo/hwangseong.jpg', note: '황성신문 창간호', keys: ['황성신문', '시일야방성대곡'], page: C0 + 'Hwangseong_sinmun.jpg', license: PD },
    { src: 'img/photo/independence-gate-1923.jpg', note: '독립문(1923 무렵)', keys: ['독립문', '독립 협회', '만민 공동회'], page: C0 + 'Independence_Gate,_Seoul,_1923_photograph_by_Keystone_View.jpg', license: PD },
    { src: 'img/photo/deoksugung.jpg', note: '덕수궁', keys: ['덕수궁'], page: C0 + 'Deoksugungpalacefromthebuilding.jpg', license: PD },
    { src: 'img/photo/gyeongbokgung.jpg', note: '경복궁 경회루', keys: ['경복궁'], page: C0 + 'Gyeonghoeru_(Royal_Banquet_Hall)_at_Gyeongbokgung_Palace,_Seoul.jpg', license: 'CC BY-SA 4.0, 사진 Frank Schulenburg' },
    // 광복과 국제 회담
    { src: 'img/photo/paris-1919.jpg', note: '파리 강화 회의(1919)', keys: ['파리 강화 회의'], page: C0 + 'Big_four.jpg', license: PD },
    { src: 'img/photo/cairo-1943.jpg', note: '카이로 회담(1943)', keys: ['카이로 회담', '카이로 선언'], page: C0 + 'Cairo_Conference_group_portrait.jpg', license: PD },
    { src: 'img/photo/yalta-1945.jpg', note: '얄타 회담(1945)', keys: ['얄타 회담'], page: C0 + 'Yalta_Conference_(Churchill,_Roosevelt,_Stalin)_(B%26W).jpg', license: PD },
    { src: 'img/photo/potsdam-1945.jpg', note: '포츠담 회담(1945)', keys: ['포츠담 회담', '포츠담 선언'], page: C0 + 'Churchill,_Truman,_Stalin_(Potsdam).jpg', license: PD },
    { src: 'img/photo/joint-commission-1946.jpg', note: '제1차 미·소 공동 위원회(1946, 덕수궁)', keys: ['미·소 공동 위원회'], page: C0 + '1946-03-20_the_1st_Joint_US-Soviet_Commission_meetings_in_Seoul.jpg', license: PD },
    // 대한민국 정부 수립과 6·25 전쟁
    { src: 'img/photo/election-1948.jpg', note: '5·10 총선거에서 투표하는 사람들(1948)', keys: ['5·10 총선거', '제헌 국회'], page: C0 + '1948SKelection.jpg', license: PD },
    { src: 'img/photo/government-1948.jpg', note: '대한민국 정부 수립 기념식(1948)', keys: ['정부 수립'], page: C0 + 'Ceremony_inaugurating_the_government_of_the_Republic_of_Korea_(colored).jpg', license: PD },
    { src: 'img/photo/korean-war-seoul-1950.jpg', note: '6·25 전쟁 때 서울 시가지 전투(1950)', keys: ['6·25 전쟁'], page: C0 + 'Seoul_Battle-_Korean_War.jpg', license: PD },
    { src: 'img/photo/inchon-1950.jpg', note: '인천 상륙 작전(1950)', keys: ['인천 상륙 작전'], page: C0 + 'Lopez_scaling_seawall.jpg', license: PD },
    { src: 'img/photo/hungnam-1950.jpg', note: '흥남 철수 작전(1950)', keys: ['흥남 철수 작전', '흥남 철수'], page: C0 + 'USS_Begor_(APD-127)_off_Hungnam_on_24_December_1950_(80-G-K-11769).jpg', license: PD },
    { src: 'img/photo/armistice-1953.jpg', note: '정전 협정 서명(1953)', keys: ['정전 협정'], page: C0 + 'General_Clark_signs_the_Korean_Armistice_Agreement.jpg', license: PD },
    { src: 'img/photo/mutual-defense-1953.png', note: '한·미 상호 방위 조약 서명(1953)', keys: ['한·미 상호 방위 조약'], page: C0 + 'The_Sigining_ceremony_of_the_ROK-U.S._Mutual_Defense_Agreement.png', license: PD },
    // 민주주의의 시련과 발전
    { src: 'img/photo/coup-516-1961.jpg', note: '5·16 군사 정변(1961)', keys: ['5·16 군사 정변', '국가 재건 최고 회의'], page: C0 + '5.16_Coup_Park_Chung-hee.jpg', license: PD },
    { src: 'img/photo/basic-relations-1965.jpg', note: '한·일 기본 조약 문서(1965)', keys: ['한·일 협정', '한·일 기본 조약'], page: C0 + 'The-Treaty-on-Basic-Relations-Between-Japan-and-the-Republic-of-Korea-1.jpg', license: PD },
    { src: 'img/photo/masan-1979.jpg', note: '부·마 민주 항쟁 때 마산(1979)', keys: ['부·마 민주 항쟁'], page: C0 + 'Koreas_Masan1979-10-20.jpg', license: 'CC0' },
    { src: 'img/photo/may18-monument.jpg', note: '국립 5·18 민주 묘지 추모탑', keys: ['5·18 민주화 운동', '광주 민주화 운동'], page: C0 + 'May_18th_Memorial_Monument.jpg', license: PD },
    // 나라 국기(선지에만)
    { src: 'img/photo/flag-us.png', note: '미국 국기', keys: ['미국'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_the_United_States.svg', license: PD },
    { src: 'img/photo/flag-ussr.png', note: '소련 국기', keys: ['소련'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_the_Soviet_Union.svg', license: PD },
    { src: 'img/photo/flag-uk.png', note: '영국 국기', keys: ['영국'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_the_United_Kingdom_(3-5).svg', license: PD },
    { src: 'img/photo/flag-roc.png', note: '중국(중화민국) 국기', keys: ['중국'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_the_Republic_of_China.svg', license: PD },
    { src: 'img/photo/flag-france.png', note: '프랑스 국기', keys: ['프랑스'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_France.svg', license: PD },
    { src: 'img/photo/flag-germany.png', note: '독일 국기', keys: ['독일'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_Germany.svg', license: PD },
    { src: 'img/photo/flag-japan.png', note: '일본 국기', keys: ['일본'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_Japan.svg', license: PD },
    { src: 'img/photo/flag-russia.png', note: '러시아 국기', keys: ['러시아'], choiceOnly: true, flagLike: true, page: C0 + 'Flag_of_Russia.svg', license: PD }
  ];

  const norm = s => String(s || '').replace(/[\s·ㆍ.,()「」'"]/g, '');

  function photoHTML(p) { return `<img class="pic-photo${p.flagLike ? ' pic-flag' : ''}" src="${p.src}" alt="" loading="lazy" decoding="async">`; }

  // 사진을 못 찾은 낱말: 대한민국 임시 정부가 실제로 쓴 태극기
  const FALLBACK = { src: 'img/photo/flag-provisional-government.png', note: '대한민국 임시 정부가 쓴 태극기(사진을 못 찾은 낱말에 보여 줘요)', keys: [], flagLike: true, page: 'https://commons.wikimedia.org/wiki/File:Flag_of_the_Provisional_Government_of_the_Republic_of_Korea.svg', license: '퍼블릭 도메인' };

  // 선지 글자와 딱 맞는 사진 → 선지 글자 안에 든 낱말의 사진(국기 제외) → 없으면 임시 정부 태극기
  function forChoice(text) {
    const n = norm(text);
    const p = PHOTOS.find(ph => ph.keys.some(k => norm(k) === n)) ||
      PHOTOS.find(ph => !ph.choiceOnly && ph.keys.some(k => n.includes(norm(k))));
    return photoHTML(p || FALLBACK);
  }
  // O/X·단답형: 문제 글 속 낱말의 사진(단답형은 정답과 이어진 사진은 빼요), 없으면 임시 정부 태극기
  function forQuestion(q) {
    const text = norm(q.q);
    const banned = q.type === 'sa' ? [q.answer].concat(q.alt || []).map(norm) : [];
    const p = PHOTOS.find(ph => !ph.choiceOnly && ph.keys.some(k => text.includes(norm(k))) && !ph.keys.some(k => banned.includes(norm(k))));
    return photoHTML(p || FALLBACK);
  }

  // 4지선다 선지 4개: 사진이 딱 하나만 있으면 그 선지만 눈에 띄어 답처럼 보이니 모두 태극기로
  function forChoices(choices) {
    const pics = choices.map(forChoice);
    const fb = photoHTML(FALLBACK);
    return pics.filter(p => p !== fb).length === 1 ? pics.map(() => fb) : pics;
  }

  window.PICS = { forChoice, forChoices, forQuestion, PHOTOS, FALLBACK };
})();
