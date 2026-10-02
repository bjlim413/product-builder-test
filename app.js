(() => {
  'use strict';

  const STORAGE_KEY = 'stark-checklist-v1';

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
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.books)) return parsed;
      }
    } catch (e) { /* ignore and fall back to seed */ }
    return SEED();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

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
        input = `<input id="${id}" name="${f.name}" type="text" value="${esc(f.value)}" placeholder="${esc(f.placeholder)}" ${f.required ? 'required' : ''} maxlength="${f.maxlength || 200}">`;
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
    if (modalSubmit && modalSubmit(data) === false) return;
    closeModal();
    save();
    render();
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

  const actions = {
    'add-book'() {
      openModal({
        title: '새 책 만들기', fields: bookFields(), submitText: '만들기',
        onSubmit: (d) => {
          if (!d.title) return false;
          state.books.push({ id: uid(), title: d.title, subtitle: d.subtitle, icon: d.icon || '📘', palette: d.palette, chapters: [] });
          toast('새 책이 서재에 추가되었습니다');
        },
      });
    },
    'edit-book'(id) {
      const b = findBook(id);
      openModal({
        title: '책 수정', fields: bookFields(b),
        onSubmit: (d) => {
          if (!d.title) return false;
          Object.assign(b, { title: d.title, subtitle: d.subtitle, icon: d.icon || '📘', palette: d.palette });
          toast('수정되었습니다');
        },
      });
    },
    'delete-book'(id) {
      const b = findBook(id);
      confirmDelete('책 삭제', `“${b.title}” 책과 안의 모든 목차·체크리스트가 삭제됩니다. 계속할까요?`, () => {
        state.books = state.books.filter((x) => x.id !== id);
        toast('삭제되었습니다');
        if (parseRoute().bookId === id) location.hash = '#/';
      });
    },
    'add-chapter'(_, { book }) {
      openModal({
        title: '목차 추가', fields: chapterFields(), submitText: '추가',
        onSubmit: (d) => {
          if (!d.title) return false;
          book.chapters.push({ id: uid(), title: d.title, guide: d.guide, items: [] });
          toast('목차가 추가되었습니다');
        },
      });
    },
    'edit-chapter'(id, { book }) {
      const c = findChapter(book, id);
      openModal({
        title: '목차 수정', fields: chapterFields(c),
        onSubmit: (d) => {
          if (!d.title) return false;
          Object.assign(c, { title: d.title, guide: d.guide });
          toast('수정되었습니다');
        },
      });
    },
    'delete-chapter'(id, { book }) {
      const c = findChapter(book, id);
      confirmDelete('목차 삭제', `“${c.title}” 목차와 체크리스트가 삭제됩니다. 계속할까요?`, () => {
        book.chapters = book.chapters.filter((x) => x.id !== id);
        toast('삭제되었습니다');
      });
    },
    'edit-guide'(_, { chapter }) {
      openModal({
        title: chapter.guide ? '설명 수정' : '설명 추가',
        fields: [chapterFields(chapter)[1]],
        onSubmit: (d) => {
          chapter.guide = d.guide;
          toast(d.guide ? '설명이 저장되었습니다' : '설명이 비워졌습니다');
        },
      });
    },
    'delete-guide'(_, { chapter }) {
      confirmDelete('설명 삭제', '“이럴 때 사용하세요” 설명을 삭제할까요?', () => {
        chapter.guide = '';
        toast('설명이 삭제되었습니다');
      });
    },
    'add-item'(_, { chapter }) {
      openModal({
        title: '체크 항목 추가', submitText: '추가',
        fields: [{ name: 'text', label: '항목 내용', placeholder: '예: 충전기 챙기기', required: true }],
        onSubmit: (d) => {
          if (!d.text) return false;
          chapter.items.push({ id: uid(), text: d.text, done: false });
          toast('항목이 추가되었습니다');
        },
      });
    },
    'edit-item'(id, { chapter }) {
      const it = chapter.items.find((x) => x.id === id);
      openModal({
        title: '체크 항목 수정',
        fields: [{ name: 'text', label: '항목 내용', value: it.text, required: true }],
        onSubmit: (d) => {
          if (!d.text) return false;
          it.text = d.text;
          toast('수정되었습니다');
        },
      });
    },
    'delete-item'(id, { chapter }) {
      const it = chapter.items.find((x) => x.id === id);
      confirmDelete('항목 삭제', `“${it.text}” 항목을 삭제할까요?`, () => {
        chapter.items = chapter.items.filter((x) => x.id !== id);
        toast('삭제되었습니다');
      });
    },
    'toggle-item'(id, { chapter }) {
      const it = chapter.items.find((x) => x.id === id);
      it.done = !it.done;
      save();
      render();
      const box = app.querySelector(`[data-action="toggle-item"][data-id="${id}"]`);
      if (box) box.focus({ preventScroll: true });
      if (chapter.items.every((x) => x.done)) toast('🎉 미션 완료! 모든 항목을 체크했습니다');
    },
    'reset-items'(_, { chapter }) {
      confirmDelete('체크 모두 해제', '모든 항목의 체크를 해제할까요? (항목은 삭제되지 않습니다)', () => {
        chapter.items.forEach((x) => { x.done = false; });
        toast('체크가 모두 해제되었습니다');
      });
      $('#modalSubmit').textContent = '해제';
    },
  };

  function context() {
    const { bookId, chapterId } = parseRoute();
    const book = bookId && findBook(bookId);
    return { book, chapter: chapterId && findChapter(book, chapterId) };
  }

  app.addEventListener('change', (e) => {
    const el = e.target.closest('[data-action="toggle-item"]');
    if (el) actions['toggle-item'](el.dataset.id, context());
  });

  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) return go(nav.dataset.nav);
    const el = e.target.closest('button[data-action]');
    if (el && actions[el.dataset.action]) actions[el.dataset.action](el.dataset.id, context());
  });

  $('#homeBtn').addEventListener('click', () => go('#/'));
  window.addEventListener('hashchange', () => render(true));

  render();
})();
