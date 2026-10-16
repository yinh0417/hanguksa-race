/*
 * 데이터 저장소
 * - config.js에 Firebase 설정이 있으면 Firebase 실시간 데이터베이스를 씁니다.
 * - 없으면 '체험 모드': 이 브라우저 안의 저장 공간(localStorage)을 써서
 *   같은 노트북의 탭끼리만 실시간으로 주고받습니다.
 */
(function () {
  const cfg = window.APP_CONFIG || {};
  const fb = cfg.firebase || {};
  const useFirebase = !!(fb.apiKey && fb.databaseURL);

  function clone(v) { return v == null ? null : JSON.parse(JSON.stringify(v)); }

  if (useFirebase && window.firebase) {
    firebase.initializeApp(fb);
    const fdb = firebase.database();
    const fauth = firebase.auth();
    let offset = 0;
    fdb.ref('.info/serverTimeOffset').on('value', s => { offset = s.val() || 0; });

    window.DB = {
      mode: 'firebase',
      now: () => Date.now() + offset,
      get: p => fdb.ref(p).get().then(s => s.val()),
      set: (p, v) => fdb.ref(p).set(v),
      update: (p, v) => fdb.ref(p).update(v),
      remove: p => fdb.ref(p).remove(),
      push(p, v) { const r = fdb.ref(p).push(); return r.set(v).then(() => r.key); },
      on(p, cb, onErr) {
        const r = fdb.ref(p);
        const h = s => cb(s.val());
        r.on('value', h, e => { if (onErr) onErr(e); else console.warn(p, e); });
        return () => r.off('value', h);
      },
      onConnection(cb) { fdb.ref('.info/connected').on('value', s => cb(!!s.val())); },
      authReady: () => new Promise(res => { const off = fauth.onAuthStateChanged(u => { off(); res(u); }); }),
      user: () => fauth.currentUser,
      signInStudent: () => fauth.currentUser
        ? Promise.resolve(fauth.currentUser)
        : fauth.signInAnonymously().then(c => c.user),
      signInTeacher: (email, pw) => fauth.signInWithEmailAndPassword(email, pw).then(c => c.user),
      signOut: () => fauth.signOut(),
      isTeacher: () => !!(fauth.currentUser && !fauth.currentUser.isAnonymous)
    };
    return;
  }

  // ---------- 체험 모드 ----------
  const KEY = 'hkr-demo-db';
  const listeners = new Set();

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function parts(p) { return String(p).split('/').filter(Boolean); }
  function getAt(tree, p) {
    let n = tree;
    for (const k of parts(p)) {
      if (n == null || typeof n !== 'object') return null;
      n = n[k];
    }
    return n === undefined ? null : n;
  }
  function setAt(tree, p, v) {
    const ks = parts(p);
    const stack = [tree];
    let n = tree;
    for (let i = 0; i < ks.length - 1; i++) {
      if (n[ks[i]] == null || typeof n[ks[i]] !== 'object') n[ks[i]] = {};
      n = n[ks[i]];
      stack.push(n);
    }
    const last = ks[ks.length - 1];
    if (v == null) delete n[last]; else n[last] = clone(v);
    // Firebase처럼 빈 칸은 지웁니다
    for (let i = ks.length - 2; i >= 0; i--) {
      const child = stack[i][ks[i]];
      if (child && typeof child === 'object' && !Object.keys(child).length) delete stack[i][ks[i]];
      else break;
    }
  }
  function write(mutate) {
    const t = load();
    mutate(t);
    localStorage.setItem(KEY, JSON.stringify(t));
    notifySoon();
    return Promise.resolve();
  }
  let queued = false;
  function notifySoon() {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; notify(); }, 0);
  }
  function notify() {
    const t = load();
    listeners.forEach(l => {
      const v = getAt(t, l.path);
      const s = JSON.stringify(v);
      if (s !== l.last) { l.last = s; l.cb(clone(v)); }
    });
  }
  window.addEventListener('storage', e => { if (e.key === KEY || e.key === null) notify(); });

  function newKey() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function demoUser() {
    let id = sessionStorage.getItem('hkr-demo-uid');
    if (!id) { id = 'u' + newKey(); sessionStorage.setItem('hkr-demo-uid', id); }
    return { uid: id, isAnonymous: true };
  }

  window.DB = {
    mode: 'demo',
    now: () => Date.now(),
    get: p => Promise.resolve(clone(getAt(load(), p))),
    set: (p, v) => write(t => setAt(t, p, v)),
    update: (p, obj) => write(t => Object.keys(obj).forEach(k => setAt(t, p + '/' + k, obj[k]))),
    remove: p => write(t => setAt(t, p, null)),
    push(p, v) { const k = newKey(); return write(t => setAt(t, p + '/' + k, v)).then(() => k); },
    on(p, cb) {
      const l = { path: p, cb, last: undefined };
      listeners.add(l);
      setTimeout(() => {
        if (!listeners.has(l)) return;
        const v = getAt(load(), p);
        l.last = JSON.stringify(v);
        cb(clone(v));
      }, 0);
      return () => listeners.delete(l);
    },
    onConnection(cb) {
      cb(navigator.onLine !== false);
      window.addEventListener('online', () => cb(true));
      window.addEventListener('offline', () => cb(false));
    },
    authReady: () => Promise.resolve(demoUser()),
    user: () => demoUser(),
    signInStudent: () => Promise.resolve(demoUser()),
    signInTeacher: () => Promise.resolve({ uid: 'teacher', email: 'demo' }),
    signOut: () => Promise.resolve(),
    isTeacher: () => true,
    resetDemo() { localStorage.removeItem(KEY); notifySoon(); }
  };
})();
