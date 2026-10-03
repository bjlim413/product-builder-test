(() => {
  'use strict';

  const PALETTES = [
    { id: 'mark3', name: '마크 3 레드', c1: '#c4161c', c2: '#5a0a0e' },
    { id: 'gold', name: '골드 티타늄', c1: '#d99a1e', c2: '#6b4407' },
    { id: 'arc', name: '아크 리액터', c1: '#1590c2', c2: '#0a2a46' },
    { id: 'warmachine', name: '워머신', c1: '#5b6470', c2: '#1d2228' },
    { id: 'stealth', name: '스텔스', c1: '#2a2f45', c2: '#0b0d18' },
    { id: 'hulkbuster', name: '헐크버스터', c1: '#a8321b', c2: '#3b1208' },
  ];

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  const items = (texts) => texts.map((text) => ({ id: uid(), text, done: false }));

  const SEED = () => ({
    books: [
      {
        id: uid(), title: '여행 & 출장', subtitle: '떠나기 전 빠짐없이 준비하는 출격 프로토콜',
        icon: '✈️', palette: 'mark3',
        chapters: [
          {
            id: uid(), title: '출발 1주 전 준비',
            guide: '여행이나 출장 일정이 확정되었을 때 사용하세요.\n항공권·숙소·서류처럼 미리 처리하지 않으면 당일에 해결할 수 없는 일들을 모아두었습니다. 일주일 전에 한 번 훑어보면 출발 직전에 허둥대는 일이 크게 줄어듭니다.',
            items: items(['여권/신분증 유효기간 확인', '항공권·숙소 예약 확인 메일 저장', '여행자 보험 가입', '환전 또는 해외 결제 카드 준비', '현지 교통편 알아보기']),
          },
          {
            id: uid(), title: '짐 싸기',
            guide: '출발 전날 밤, 가방을 쌀 때 사용하세요.\n하나씩 넣으면서 체크하면 충전기나 상비약처럼 꼭 빠뜨리기 쉬운 물건을 챙길 수 있습니다.',
            items: items(['충전기 & 보조배터리', '세면도구', '상비약', '갈아입을 옷', '우산 또는 우비', '멀티 어댑터']),
          },
          {
            id: uid(), title: '출발 당일',
            guide: '집을 나서기 직전에 사용하세요.\n문단속과 전기제품 확인처럼 나가고 나서 걱정되는 것들을 마지막으로 점검합니다.',
            items: items(['가스 밸브 잠금', '창문·현관 잠금', '전기 플러그 뽑기', '여권·지갑·휴대폰 소지 확인']),
          },
        ],
      },
      {
        id: uid(), title: '프로젝트 런칭', subtitle: '아이디어부터 출시까지, 스타크 인더스트리 방식으로',
        icon: '🚀', palette: 'gold',
        chapters: [
          {
            id: uid(), title: '기획 단계',
            guide: '새 프로젝트를 시작할 때 가장 먼저 사용하세요.\n목표와 범위를 처음에 분명히 정해 두면 진행 중에 방향을 잃지 않습니다. 팀원과 킥오프 미팅 전에 함께 보면 좋습니다.',
            items: items(['해결하려는 문제 한 문장으로 정의', '목표 사용자 정하기', '성공 지표(KPI) 정하기', '일정과 마일스톤 수립']),
          },
          {
            id: uid(), title: '출시 전 점검',
            guide: '출시 하루 이틀 전, 최종 점검할 때 사용하세요.\n기능이 다 만들어진 뒤에도 놓치기 쉬운 테스트·공지·모니터링 준비를 확인합니다.',
            items: items(['주요 기능 테스트 완료', '모바일 화면 확인', '공지/홍보 문구 준비', '장애 대응 담당자 지정', '모니터링 대시보드 확인']),
          },
        ],
      },
      {
        id: uid(), title: '건강 루틴', subtitle: '슈트보다 중요한 건 파일럿의 컨디션',
        icon: '💪', palette: 'arc',
        chapters: [
          {
            id: uid(), title: '아침 루틴',
            guide: '하루를 시작할 때 매일 사용하세요.\n작은 습관을 체크하며 시작하면 하루의 리듬이 잡힙니다. 모두 체크한 뒤에는 다음 날을 위해 체크를 해제해 두세요.',
            items: items(['물 한 잔 마시기', '5분 스트레칭', '오늘 할 일 3가지 적기', '아침 식사']),
          },
          {
            id: uid(), title: '잠들기 전',
            guide: '잠자리에 들기 30분 전에 사용하세요.\n수면의 질을 높이는 습관들입니다. 화면을 끄고 차분하게 하루를 마무리하세요.',
            items: items(['휴대폰 내려놓기', '내일 일정 확인', '방 온도·조명 조절', '감사한 일 한 가지 떠올리기']),
          },
        ],
      },
    ],
  });

  // ---------- State ----------
  // GitHub 저장소의 data.json 이 원본 DB입니다. localStorage 는 오프라인용 캐시와
  // 아직 GitHub 에 올라가지 않은 변경(pending)을 보관합니다.
  const CACHE_KEY = 'stark-checklist-cache-v2';
  const PENDING_KEY = 'stark-checklist-pending-v2';
  const CONFIG_KEY = 'stark-checklist-github-v1';
  const LEGACY_KEY = 'stark-checklist-v1';

  const DEFAULT_CONFIG = { owner: 'bjlim413', repo: 'product-builder-test', branch: '', path: 'data.json', token: '' };

  const readJSON = (key) => {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  };
  const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  };
  const isState = (s) => s && Array.isArray(s.books);
  const clone = (o) => JSON.parse(JSON.stringify(o));

  let config = { ...DEFAULT_CONFIG, ...(readJSON(CONFIG_KEY) || {}) };
  let pending = Array.isArray(readJSON(PENDING_KEY)) ? readJSON(PENDING_KEY) : [];
  let state = [readJSON(CACHE_KEY), readJSON(LEGACY_KEY)].find(isState) || SEED();
  let loaded = false; // GitHub 에서 한 번이라도 읽어왔는지

  function persistLocal() {
    writeJSON(CACHE_KEY, state);
    writeJSON(PENDING_KEY, pending);
  }

  // 변경은 모두 id 기반 "작업(op)"으로 기록합니다. 다른 사람이 먼저 저장해서 충돌이 나면
  // 최신 data.json 위에 내 작업들을 다시 적용(replay)한 뒤 저장합니다.
  function applyOp(s, op) {
    const book = op.bookId && s.books.find((b) => b.id === op.bookId);
    const chapter = book && op.chapterId && book.chapters.find((c) => c.id === op.chapterId);
    switch (op.type) {
      case 'addBook': if (!s.books.some((b) => b.id === op.book.id)) s.books.push(clone(op.book)); break;
      case 'updateBook': if (book) Object.assign(book, op.fields); break;
      case 'deleteBook': s.books = s.books.filter((b) => b.id !== op.bookId); break;
      case 'addChapter': if (book && !book.chapters.some((c) => c.id === op.chapter.id)) book.chapters.push(clone(op.chapter)); break;
      case 'updateChapter': if (chapter) Object.assign(chapter, op.fields); break;
      case 'deleteChapter': if (book) book.chapters = book.chapters.filter((c) => c.id !== op.chapterId); break;
      case 'addItem': if (chapter && !chapter.items.some((i) => i.id === op.item.id)) chapter.items.push(clone(op.item)); break;
      case 'updateItem': {
        const it = chapter && chapter.items.find((i) => i.id === op.itemId);
        if (it) Object.assign(it, op.fields);
        break;
      }
      case 'deleteItem': if (chapter) chapter.items = chapter.items.filter((i) => i.id !== op.itemId); break;
      case 'resetItems': if (chapter) chapter.items.forEach((i) => { i.done = false; }); break;
      default: break;
    }
    return s;
  }

  function commit(op) {
    if (!sync.canWrite()) {
      render();
      sync.askForToken();
      return false;
    }
    op.label = op.label || op.type;
    applyOp(state, op);
    pending.push(op);
    persistLocal();
    render();
    sync.schedule();
    return true;
  }

  // ---------- GitHub sync ----------
  const sync = (() => {
    let sha = null;      // 현재 data.json 의 blob sha
    let etag = null;
    let timer = null;
    let busy = false;
    let status = 'loading';
    let detail = '';

    const api = () => `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${config.path.split('/').map(encodeURIComponent).join('/')}`;

    function headers(extra = {}) {
      const h = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...extra };
      if (config.token) h.Authorization = `Bearer ${config.token}`;
      return h;
    }

    function b64encode(str) {
      const bytes = new TextEncoder().encode(str);
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(bin);
    }
    function b64decode(b64) {
      const bin = atob(b64.replace(/\s/g, ''));
      return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    }

    function setStatus(s, d = '') {
      status = s;
      detail = d;
      const el = document.getElementById('syncStatus');
      if (!el) return;
      const labels = {
        loading: 'GitHub 불러오는 중…',
        synced: 'GitHub 저장됨',
        saving: 'GitHub 저장 중…',
        pending: '저장 대기 중',
        readonly: '읽기 전용',
        offline: '오프라인 (이 기기에 보관 중)',
        error: '연결 오류',
      };
      el.dataset.state = s;
      el.querySelector('.sync-label').textContent = labels[s] || s;
      el.title = d || '클릭해서 GitHub DB 설정 열기';
    }

    function errorText(res) {
      if (res.status === 401) return '토큰이 올바르지 않거나 만료되었어요.';
      if (res.status === 403) {
        if (res.headers.get('x-ratelimit-remaining') === '0') return 'GitHub 요청 한도를 넘었어요. 토큰을 넣으면 한도가 크게 늘어나요.';
        return '토큰에 이 저장소의 Contents 쓰기 권한이 없어요.';
      }
      if (res.status === 404) return '저장소나 브랜치를 찾을 수 없어요. 비공개 저장소라면 토큰이 필요해요.';
      return `GitHub 응답 오류 (${res.status})`;
    }

    // data.json 읽기. 반환값: 'changed' | 'same' | 'missing'
    async function fetchRemote() {
      const url = api() + (config.branch ? `?ref=${encodeURIComponent(config.branch)}` : '');
      const res = await fetch(url, { headers: headers(etag ? { 'If-None-Match': etag } : {}), cache: 'no-store' });
      if (res.status === 304) return 'same';
      if (res.status === 404 && !(await repoExists())) throw Object.assign(new Error(errorText(res)), { fatal: true });
      if (res.status === 404) { sha = null; etag = null; return 'missing'; }
      if (!res.ok) throw Object.assign(new Error(errorText(res)), { fatal: res.status === 401 });
      const body = await res.json();
      etag = res.headers.get('etag');
      if (body.sha === sha) return 'same';
      const remote = JSON.parse(b64decode(body.content || ''));
      if (!isState(remote)) throw new Error('data.json 형식이 올바르지 않아요.');
      sha = body.sha;
      state = pending.reduce(applyOp, remote);
      persistLocal();
      return 'changed';
    }

    async function repoExists() {
      const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`, { headers: headers(), cache: 'no-store' });
      return res.ok;
    }

    async function push() {
      const ops = pending.slice();
      const names = [...new Set(ops.map((o) => o.label))];
      const message = `체크리스트 업데이트: ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` 외 ${names.length - 3}건` : ''}`;
      const body = { message, content: b64encode(JSON.stringify(state, null, 2) + '\n') };
      if (sha) body.sha = sha;
      if (config.branch) body.branch = config.branch;
      const res = await fetch(api(), { method: 'PUT', headers: headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
      if (res.status === 409 || res.status === 422) return 'conflict';
      if (!res.ok) throw Object.assign(new Error(errorText(res)), { fatal: true });
      const json = await res.json();
      sha = json.content.sha;
      etag = null;
      pending = pending.slice(ops.length);
      persistLocal();
      return 'ok';
    }

    async function flush() {
      if (busy || !pending.length || !config.token) return;
      busy = true;
      setStatus('saving');
      try {
        let saved = false;
        for (let attempt = 0; attempt < 4 && !saved; attempt += 1) {
          if (!loaded) { await fetchRemote(); loaded = true; }
          saved = (await push()) === 'ok';
          if (!saved) {
            // 다른 사람이 먼저 저장함 → 최신 데이터 위에 내 변경을 다시 적용하고 재시도
            etag = null;
            await fetchRemote();
            render();
          }
        }
        if (!saved) throw new Error('저장 충돌이 계속돼요. 잠시 후 다시 시도할게요.');
        setStatus(pending.length ? 'pending' : 'synced');
      } catch (e) {
        setStatus(e.fatal ? 'error' : 'offline', e.message);
        if (e.fatal) toast(e.message);
      } finally {
        busy = false;
      }
      if (pending.length && status !== 'error') schedule(5000);
    }

    function schedule(delay = 1200) {
      clearTimeout(timer);
      if (!config.token) { setStatus('readonly', '토큰이 없어서 GitHub 에 저장할 수 없어요.'); return; }
      setStatus('pending');
      timer = setTimeout(flush, delay);
    }

    async function refresh({ quiet = true } = {}) {
      if (busy) return;
      busy = true;
      try {
        const r = await fetchRemote();
        loaded = true;
        if (r === 'changed') render();
        if (r === 'missing' && config.token && !pending.length) pending.push({ type: 'init', label: 'data.json 생성' });
        if (!pending.length) setStatus(config.token ? 'synced' : 'readonly', config.token ? '' : '보기만 가능해요. 수정하려면 토큰을 등록하세요.');
      } catch (e) {
        setStatus(e.fatal ? 'error' : 'offline', e.message);
        if (!quiet) toast(e.message);
      } finally {
        busy = false;
      }
      if (pending.length && config.token && status !== 'error') flush();
      else if (pending.length && !config.token) setStatus('readonly', '이 기기에 저장되지 않은 변경이 있어요. 토큰을 등록하면 GitHub 에 올라가요.');
    }

    function start() {
      refresh({ quiet: false });
      // 다른 사람이 바꾼 내용을 주기적으로 반영 (탭이 보일 때만)
      setInterval(() => { if (!document.hidden && !pending.length) refresh(); }, config.token ? 30000 : 120000);
      window.addEventListener('focus', () => { if (!pending.length) refresh(); });
      window.addEventListener('online', () => (pending.length ? flush() : refresh()));
    }

    function reconnect() {
      sha = null;
      etag = null;
      loaded = false;
      setStatus('loading');
      refresh({ quiet: false });
    }

    return {
      start, schedule, reconnect,
      canWrite: () => Boolean(config.token),
      askForToken: () => openSettings('수정한 내용을 GitHub 에 저장하려면 토큰이 필요해요. 아래 안내를 따라 토큰을 등록해 주세요.'),
      status: () => ({ status, detail }),
    };
  })();

  const findBook = (id) => state.books.find((b) => b.id === id);
  const findChapter = (book, id) => book && book.chapters.find((c) => c.id === id);
  const paletteOf = (book) => PALETTES.find((p) => p.id === book.palette) || PALETTES[0];

  function progress(list) {
    const total = list.length;
    const done = list.filter((i) => i.done).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }
  const bookProgress = (book) => progress(book.chapters.flatMap((c) => c.items));

  // ---------- Helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const app = $('#app');

  function esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function bar(pct, cls = '') {
    const doneCls = pct === 100 ? ' done' : '';
    return `<div class="bar ${cls}${doneCls}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>`;
  }

  function ring(p, label) {
    return `<div class="ring${p.pct === 100 && p.total ? ' done' : ''}" style="--p:${p.pct}">
      <div class="ring-val">${p.pct}%<small>${esc(label)}</small></div>
    </div>`;
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 1800);
  }

  // ---------- Routing ----------
  function parseRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (parts[0] === 'book' && parts[1]) {
      return { bookId: parts[1], chapterId: parts[2] === 'ch' ? parts[3] : null };
    }
    return {};
  }

  function go(hash) {
    if (location.hash === hash) render(true);
    else location.hash = hash;
  }

  function render(scrollTop = false) {
    const { bookId, chapterId } = parseRoute();
    const book = bookId && findBook(bookId);
    if (bookId && !book) return go('#/');
    const chapter = chapterId && findChapter(book, chapterId);
    if (chapterId && !chapter) return go(`#/book/${book.id}`);

    renderBreadcrumb(book, chapter);
    if (chapter) renderChapter(book, chapter);
    else if (book) renderBook(book);
    else renderLibrary();
    if (scrollTop) window.scrollTo({ top: 0 });
  }

  function renderBreadcrumb(book, chapter) {
    const crumbs = [];
    if (book) {
      crumbs.push(`<button data-nav="#/">서재</button>`);
      crumbs.push('<span class="sep">▸</span>');
      if (chapter) {
        crumbs.push(`<button data-nav="#/book/${book.id}">${esc(book.title)}</button>`);
        crumbs.push('<span class="sep">▸</span>');
        crumbs.push(`<span class="current">${esc(chapter.title)}</span>`);
      } else {
        crumbs.push(`<span class="current">${esc(book.title)}</span>`);
      }
    }
    $('#breadcrumb').innerHTML = crumbs.join('');
  }

  // ---------- Views ----------
  function renderLibrary() {
    const all = progress(state.books.flatMap((b) => b.chapters.flatMap((c) => c.items)));
    const books = state.books.map((b) => {
      const pal = paletteOf(b);
      const p = bookProgress(b);
      return `<div class="book-wrap">
        <button class="book" data-nav="#/book/${b.id}" style="--c1:${pal.c1};--c2:${pal.c2}" aria-label="${esc(b.title)} 열기">
          <span class="book-pages"></span>
          <span class="book-cover">
            <span class="book-icon">${esc(b.icon || '📘')}</span>
            <span class="book-title">${esc(b.title)}</span>
            <span class="book-sub">${esc(b.subtitle)}</span>
            <span class="book-meta">
              <span class="label"><span>${b.chapters.length} CHAPTERS</span><span>${p.pct}%</span></span>
              ${bar(p.pct)}
            </span>
          </span>
        </button>
        <div class="book-tools">
          <button class="icon-btn" data-action="edit-book" data-id="${b.id}" title="책 수정" aria-label="책 수정">✎</button>
          <button class="icon-btn danger" data-action="delete-book" data-id="${b.id}" title="책 삭제" aria-label="책 삭제">🗑</button>
        </div>
      </div>`;
    }).join('');

    app.innerHTML = `<section class="fade-in">
      <div class="section-head">
        <div>
          <div class="eyebrow">// MISSION LIBRARY</div>
          <h1>체크리스트 서재</h1>
          <p>주제별로 정리된 책을 선택하세요. 전체 진행도 ${all.done}/${all.total} (${all.pct}%)</p>
        </div>
        <button class="btn primary" data-action="add-book">＋ 새 책 만들기</button>
      </div>
      <div class="shelf">
        ${books}
        <div class="book-wrap">
          <button class="book-new" data-action="add-book"><div><span>＋</span>NEW BOOK</div></button>
        </div>
      </div>
    </section>`;
  }

  function renderBook(book) {
    const p = bookProgress(book);
    const chapters = book.chapters.map((c, i) => {
      const cp = progress(c.items);
      const firstLine = (c.guide || '').split('\n')[0] || '설명이 아직 없습니다.';
      return `<li class="toc-item">
        <span class="toc-num">${String(i + 1).padStart(2, '0')}</span>
        <button class="toc-main" data-nav="#/book/${book.id}/ch/${c.id}">
          <h3>${esc(c.title)}</h3>
          <p>${esc(firstLine)}</p>
          <div class="toc-progress">${bar(cp.pct, 'cyan')}<span>${cp.done}/${cp.total} · ${cp.pct}%</span></div>
        </button>
        <div class="toc-tools">
          <button class="icon-btn" data-action="edit-chapter" data-id="${c.id}" title="목차 수정" aria-label="목차 수정">✎</button>
          <button class="icon-btn danger" data-action="delete-chapter" data-id="${c.id}" title="목차 삭제" aria-label="목차 삭제">🗑</button>
        </div>
      </li>`;
    }).join('');

    app.innerHTML = `<section class="fade-in">
      <div class="section-head">
        <div>
          <div class="eyebrow">// TABLE OF CONTENTS</div>
          <h1>${esc(book.icon || '📘')} ${esc(book.title)}</h1>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" data-action="edit-book" data-id="${book.id}">✎ 책 수정</button>
          <button class="btn primary" data-action="add-chapter">＋ 목차 추가</button>
        </div>
      </div>
      <div class="panel summary">
        ${ring(p, 'TOTAL')}
        <div class="summary-info">
          <h2>미션 개요</h2>
          <p>${esc(book.subtitle || '책 설명이 없습니다.')}</p>
          <div class="stat-row">
            <span><b>${book.chapters.length}</b>목차</span>
            <span><b>${p.done}</b>완료</span>
            <span><b>${p.total - p.done}</b>남음</span>
          </div>
        </div>
      </div>
      ${book.chapters.length
        ? `<ol class="toc">${chapters}</ol>`
        : '<div class="empty">아직 목차가 없습니다. “목차 추가” 버튼으로 첫 목차를 만들어 보세요.</div>'}
    </section>`;
  }

  function renderChapter(book, chapter) {
    const p = progress(chapter.items);
    const list = chapter.items.map((it) => `<li class="check-item${it.done ? ' done' : ''}">
        <label>
          <input type="checkbox" data-action="toggle-item" data-id="${it.id}" ${it.done ? 'checked' : ''}>
          <span class="check-box"></span>
          <span class="check-text">${esc(it.text)}</span>
        </label>
        <button class="icon-btn" data-action="edit-item" data-id="${it.id}" title="항목 수정" aria-label="항목 수정">✎</button>
        <button class="icon-btn danger" data-action="delete-item" data-id="${it.id}" title="항목 삭제" aria-label="항목 삭제">🗑</button>
      </li>`).join('');

    const guide = chapter.guide
      ? `<p class="guide-body">${esc(chapter.guide)}</p>`
      : '<p class="guide-empty">이 체크리스트를 언제 쓰면 좋은지 설명을 추가해 보세요.</p>';
    const guideTools = chapter.guide
      ? `<button class="icon-btn" data-action="edit-guide" title="설명 수정" aria-label="설명 수정">✎</button>
         <button class="icon-btn danger" data-action="delete-guide" title="설명 삭제" aria-label="설명 삭제">🗑</button>`
      : '<button class="btn" data-action="edit-guide">＋ 설명 추가</button>';

    app.innerHTML = `<section class="fade-in">
      <div class="section-head">
        <div>
          <div class="eyebrow">// ${esc(book.title)}</div>
          <h1>${esc(chapter.title)}</h1>
        </div>
        <button class="btn" data-nav="#/book/${book.id}">◂ 목차로</button>
      </div>

      <div class="panel summary">
        ${ring(p, 'PROGRESS')}
        <div class="summary-info">
          <h2>진행 상황</h2>
          <p>${p.total ? `${p.total}개 중 ${p.done}개 완료했습니다.` : '아직 체크 항목이 없습니다.'}</p>
          ${bar(p.pct)}
          ${p.total ? `<div style="margin-top:12px"><button class="btn ghost" data-action="reset-items">↺ 체크 모두 해제</button></div>` : ''}
        </div>
      </div>

      <div class="panel guide">
        <div class="guide-head">
          <h3>💡 이럴 때 사용하세요</h3>
          <div class="tools">${guideTools}</div>
        </div>
        ${guide}
      </div>

      <div class="panel">
        <div class="checklist-head">
          <h3>CHECKLIST</h3>
          <button class="btn primary" data-action="add-item">＋ 항목 추가</button>
        </div>
        ${chapter.items.length
          ? `<ul class="check-list">${list}</ul>`
          : '<div class="empty">체크할 항목이 없습니다. “항목 추가” 버튼을 눌러 보세요.</div>'}
        ${p.total && p.pct === 100 ? '<div class="mission-complete">MISSION COMPLETE · 모든 항목 완료!</div>' : ''}
      </div>
    </section>`;
  }

  // ---------- Modal ----------
  const modal = $('#modal');
  const modalForm = $('#modalForm');
  let modalSubmit = null;

  function openModal({ title, fields = [], text, submitText = '저장', danger = false, onSubmit }) {
    $('#modalTitle').textContent = title;
    const submit = $('#modalSubmit');
    submit.textContent = submitText;
    submit.className = `btn ${danger ? 'danger' : 'primary'}`;

    let html = text ? `<p class="modal-text">${esc(text)}</p>` : '';
    html += fields.map((f) => {
      const id = `f-${f.name}`;
      let input;
      if (f.type === 'textarea') {
        input = `<textarea id="${id}" name="${f.name}" placeholder="${esc(f.placeholder)}">${esc(f.value)}</textarea>`;
      } else if (f.type === 'palette') {
        input = `<div class="swatches" role="group" aria-label="${esc(f.label)}">${PALETTES.map((p) =>
          `<button type="button" class="swatch" data-swatch="${p.id}" title="${p.name}" aria-label="${p.name}" aria-pressed="${p.id === f.value}" style="--c1:${p.c1};--c2:${p.c2}"></button>`).join('')}</div>
          <input type="hidden" name="${f.name}" value="${esc(f.value)}">`;
      } else {
        const type = f.type === 'password' ? 'password' : 'text';
        input = `<input id="${id}" name="${f.name}" type="${type}" value="${esc(f.value)}" placeholder="${esc(f.placeholder)}" ${f.required ? 'required' : ''} maxlength="${f.maxlength || 200}" autocomplete="off" spellcheck="false">`;
      }
      return `<div class="field"><label for="${id}">${esc(f.label)}</label>${input}${f.hint ? `<div class="hint">${esc(f.hint)}</div>` : ''}</div>`;
    }).join('');
    $('#modalFields').innerHTML = html;

    modalSubmit = onSubmit;
    modal.hidden = false;
    const first = modalForm.querySelector('input:not([type=hidden]), textarea');
    (first || submit).focus();
  }

  function closeModal() {
    modal.hidden = true;
    modalSubmit = null;
  }

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(modalForm).entries());
    for (const k in data) data[k] = String(data[k]).trim();
    const handler = modalSubmit;
    closeModal();
    if (handler) handler(data);
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) return closeModal();
    const sw = e.target.closest('[data-swatch]');
    if (sw) {
      modal.querySelectorAll('[data-swatch]').forEach((b) => b.setAttribute('aria-pressed', String(b === sw)));
      modal.querySelector('input[name=palette]').value = sw.dataset.swatch;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  function confirmDelete(title, text, onConfirm) {
    openModal({ title, text, submitText: '삭제', danger: true, onSubmit: onConfirm });
  }

  // ---------- Actions ----------
  const bookFields = (b = {}) => [
    { name: 'title', label: '책 제목 (큰 주제)', value: b.title, placeholder: '예: 이사 준비', required: true, maxlength: 40 },
    { name: 'subtitle', label: '책 설명', value: b.subtitle, placeholder: '이 주제에 대한 짧은 설명', type: 'textarea' },
    { name: 'icon', label: '아이콘 (이모지)', value: b.icon || '📘', placeholder: '📘', maxlength: 4 },
    { name: 'palette', label: '표지 색상', value: b.palette || PALETTES[0].id, type: 'palette' },
  ];

  const chapterFields = (c = {}) => [
    { name: 'title', label: '목차 제목', value: c.title, placeholder: '예: 짐 싸기', required: true, maxlength: 60 },
    {
      name: 'guide', label: '이럴 때 사용하세요 (설명)', value: c.guide, type: 'textarea',
      placeholder: '이 체크리스트를 언제, 어떤 상황에서 쓰면 좋은지 적어주세요.',
      hint: '비워두면 나중에 체크리스트 화면에서 추가할 수 있어요.',
    },
  ];

  const bookData = (d) => ({ title: d.title, subtitle: d.subtitle, icon: d.icon || '📘', palette: d.palette });

  // 모든 액션은 id 로 대상을 찾는 op 를 만들어 commit 합니다.
  const actions = {
    'add-book'() {
      openModal({
        title: '새 책 만들기', fields: bookFields(), submitText: '만들기',
        onSubmit: (d) => {
          if (commit({ type: 'addBook', label: `책 추가 “${d.title}”`, book: { id: uid(), ...bookData(d), chapters: [] } })) toast('새 책이 서재에 추가되었습니다');
        },
      });
    },
    'edit-book'(id) {
      const b = findBook(id);
      openModal({
        title: '책 수정', fields: bookFields(b),
        onSubmit: (d) => {
          if (commit({ type: 'updateBook', label: `책 수정 “${d.title}”`, bookId: id, fields: bookData(d) })) toast('수정되었습니다');
        },
      });
    },
    'delete-book'(id) {
      const b = findBook(id);
      confirmDelete('책 삭제', `“${b.title}” 책과 안의 모든 목차·체크리스트가 삭제됩니다. 계속할까요?`, () => {
        if (!commit({ type: 'deleteBook', label: `책 삭제 “${b.title}”`, bookId: id })) return;
        toast('삭제되었습니다');
        if (parseRoute().bookId === id) location.hash = '#/';
      });
    },
    'add-chapter'(_, { book }) {
      openModal({
        title: '목차 추가', fields: chapterFields(), submitText: '추가',
        onSubmit: (d) => {
          const chapter = { id: uid(), title: d.title, guide: d.guide, items: [] };
          if (commit({ type: 'addChapter', label: `목차 추가 “${d.title}”`, bookId: book.id, chapter })) toast('목차가 추가되었습니다');
        },
      });
    },
    'edit-chapter'(id, { book }) {
      const c = findChapter(book, id);
      openModal({
        title: '목차 수정', fields: chapterFields(c),
        onSubmit: (d) => {
          const op = { type: 'updateChapter', label: `목차 수정 “${d.title}”`, bookId: book.id, chapterId: id, fields: { title: d.title, guide: d.guide } };
          if (commit(op)) toast('수정되었습니다');
        },
      });
    },
    'delete-chapter'(id, { book }) {
      const c = findChapter(book, id);
      confirmDelete('목차 삭제', `“${c.title}” 목차와 체크리스트가 삭제됩니다. 계속할까요?`, () => {
        if (commit({ type: 'deleteChapter', label: `목차 삭제 “${c.title}”`, bookId: book.id, chapterId: id })) toast('삭제되었습니다');
      });
    },
    'edit-guide'(_, { book, chapter }) {
      openModal({
        title: chapter.guide ? '설명 수정' : '설명 추가',
        fields: [chapterFields(chapter)[1]],
        onSubmit: (d) => {
          const op = { type: 'updateChapter', label: `설명 수정 “${chapter.title}”`, bookId: book.id, chapterId: chapter.id, fields: { guide: d.guide } };
          if (commit(op)) toast(d.guide ? '설명이 저장되었습니다' : '설명이 비워졌습니다');
        },
      });
    },
    'delete-guide'(_, { book, chapter }) {
      confirmDelete('설명 삭제', '“이럴 때 사용하세요” 설명을 삭제할까요?', () => {
        const op = { type: 'updateChapter', label: `설명 삭제 “${chapter.title}”`, bookId: book.id, chapterId: chapter.id, fields: { guide: '' } };
        if (commit(op)) toast('설명이 삭제되었습니다');
      });
    },
    'add-item'(_, { book, chapter }) {
      openModal({
        title: '체크 항목 추가', submitText: '추가',
        fields: [{ name: 'text', label: '항목 내용', placeholder: '예: 충전기 챙기기', required: true }],
        onSubmit: (d) => {
          const op = { type: 'addItem', label: `항목 추가 “${d.text}”`, bookId: book.id, chapterId: chapter.id, item: { id: uid(), text: d.text, done: false } };
          if (commit(op)) toast('항목이 추가되었습니다');
        },
      });
    },
    'edit-item'(id, { book, chapter }) {
      const it = chapter.items.find((x) => x.id === id);
      openModal({
        title: '체크 항목 수정',
        fields: [{ name: 'text', label: '항목 내용', value: it.text, required: true }],
        onSubmit: (d) => {
          const op = { type: 'updateItem', label: `항목 수정 “${d.text}”`, bookId: book.id, chapterId: chapter.id, itemId: id, fields: { text: d.text } };
          if (commit(op)) toast('수정되었습니다');
        },
      });
    },
    'delete-item'(id, { book, chapter }) {
      const it = chapter.items.find((x) => x.id === id);
      confirmDelete('항목 삭제', `“${it.text}” 항목을 삭제할까요?`, () => {
        const op = { type: 'deleteItem', label: `항목 삭제 “${it.text}”`, bookId: book.id, chapterId: chapter.id, itemId: id };
        if (commit(op)) toast('삭제되었습니다');
      });
    },
    'toggle-item'(id, { book, chapter }) {
      const it = chapter.items.find((x) => x.id === id);
      const done = !it.done;
      const op = { type: 'updateItem', label: `${done ? '체크' : '체크 해제'} “${it.text}”`, bookId: book.id, chapterId: chapter.id, itemId: id, fields: { done } };
      if (!commit(op)) return;
      const box = app.querySelector(`[data-action="toggle-item"][data-id="${id}"]`);
      if (box) box.focus({ preventScroll: true });
      if (chapter.items.every((x) => x.done)) toast('🎉 미션 완료! 모든 항목을 체크했습니다');
    },
    'reset-items'(_, { book, chapter }) {
      confirmDelete('체크 모두 해제', '모든 항목의 체크를 해제할까요? (항목은 삭제되지 않습니다)', () => {
        if (commit({ type: 'resetItems', label: `체크 모두 해제 “${chapter.title}”`, bookId: book.id, chapterId: chapter.id })) toast('체크가 모두 해제되었습니다');
      });
      $('#modalSubmit').textContent = '해제';
    },
  };

  // ---------- GitHub settings ----------
  function openSettings(notice) {
    const { status, detail } = sync.status();
    const lines = [
      notice || 'GitHub 저장소의 data.json 파일을 DB로 사용합니다. 보는 것은 누구나 가능하고, 수정하려면 이 저장소에 쓰기 권한이 있는 토큰이 필요해요.',
      detail && status !== 'synced' ? `현재 상태: ${detail}` : '',
    ].filter(Boolean).join('\n\n');
    openModal({
      title: '⚙ GitHub DB 연결',
      text: lines,
      submitText: '연결',
      fields: [
        { name: 'owner', label: '저장소 소유자 (owner)', value: config.owner, required: true },
        { name: 'repo', label: '저장소 이름 (repo)', value: config.repo, required: true },
        { name: 'branch', label: '브랜치', value: config.branch, placeholder: '비워두면 기본 브랜치', hint: '데이터를 저장할 브랜치입니다.' },
        { name: 'path', label: '데이터 파일 경로', value: config.path, required: true },
        {
          name: 'token', label: 'GitHub 토큰 (수정하려면 필요)', value: config.token, type: 'password', placeholder: 'github_pat_…', maxlength: 400,
          hint: 'GitHub → Settings → Developer settings → Fine-grained tokens 에서 이 저장소만 선택하고 Contents 권한을 "Read and write"로 만드세요. 토큰은 이 브라우저에만 저장되고 GitHub 에 올라가지 않아요.',
        },
      ],
      onSubmit: (d) => {
        config = { owner: d.owner, repo: d.repo, branch: d.branch, path: d.path.replace(/^\/+/, ''), token: d.token };
        writeJSON(CONFIG_KEY, config);
        sync.reconnect();
        toast(config.token ? 'GitHub 에 연결 중…' : '읽기 전용으로 연결 중…');
      },
    });
  }

  function context() {
    const { bookId, chapterId } = parseRoute();
    const book = bookId && findBook(bookId);
    return { book, chapter: chapterId && findChapter(book, chapterId) };
  }

  app.addEventListener('change', (e) => {
    const el = e.target.closest('[data-action="toggle-item"]');
    if (!el) return;
    if (!sync.canWrite()) { render(); sync.askForToken(); return; }
    actions['toggle-item'](el.dataset.id, context());
  });

  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) return go(nav.dataset.nav);
    const el = e.target.closest('button[data-action]');
    if (!el || !actions[el.dataset.action]) return;
    if (!sync.canWrite()) return sync.askForToken();
    actions[el.dataset.action](el.dataset.id, context());
  });

  $('#homeBtn').addEventListener('click', () => go('#/'));
  $('#syncStatus').addEventListener('click', () => openSettings());
  window.addEventListener('hashchange', () => render(true));

  render();
  sync.start();
})();
