/* ═══════════════════════════════════════════════════════════════════════════
   v2 — engagements (HiWi, Projekt, Masterarbeit), heures de travail,
   modules du Master et règles de la Prüfungsordnung (MPO 22.04.2020).
   S'appuie sur les fonctions et l'état déclarés dans app.js.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';

/* ── dates ───────────────────────────────────────────────────────────────── */
const midnight = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const todayD   = () => midnight(new Date());
const dstr     = d => { const x = midnight(d); return new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const parseD   = s => s ? midnight(new Date(s + 'T00:00:00')) : null;
const addDays  = (d, n) => { const x = midnight(d); x.setDate(x.getDate() + n); return x; };
const addWeeks = (d, n) => addDays(d, n * 7);
const daysTo   = s => { const d = parseD(s); return d ? Math.round((d - todayD()) / 864e5) : null; };

function whenTxt(dateStr) {
  const n = daysTo(dateStr);
  if (n === null) return { txt: t('week.noDated'), cls: '' };
  if (n < 0)  return { txt: t('week.late', { n: fmtN(-n) }), cls: 'late' };
  if (n === 0) return { txt: t('week.today'), cls: 'soon' };
  if (n === 1) return { txt: t('week.tomorrow'), cls: 'soon' };
  return { txt: t('week.inDays', { n: fmtN(n) }), cls: n <= RULES().alertDays ? 'soon' : '' };
}
const RULES = () => (window.SEED2 && window.SEED2.rules) || {};
/** Note allemande : toujours une décimale (1,0 et non 1) ; moyenne : deux. */
const fmtG  = g => Number(g).toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtG2 = g => Number(g).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── accès ───────────────────────────────────────────────────────────────── */
const projectsAll = () => [...state.projects].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
const projByCode  = c => state.projects.find(p => p.code === c);
const msOf        = p => state.milestones.filter(m => m.project_id === p.id && !m.deleted)
                          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
const linksOf     = p => state.plinks.filter(l => l.project_id === p.id);
const courseById  = id => state.courses.find(c => c.id === id);
const workOf      = p => state.work.filter(w => w.project_id === p.id && !w.deleted)
                          .sort((a, b) => String(a.day).localeCompare(String(b.day)));
/** Guillemets de la langue courante, pour les listes citées. */
const QUOTES = { fr: ['\u00ab\u202f', '\u202f\u00bb'], en: ['\u201c', '\u201d'], de: ['\u201e', '\u201c'] };
const quo = x => { const q = QUOTES[lang] || QUOTES.fr; return q[0] + x + q[1]; };
const modulesAll  = () => [...state.modules].filter(m => !m.deleted)
                          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

/** Cours liés à un engagement, avec leur pertinence, cours introuvables ignorés. */
function linkedCourses(p) {
  return linksOf(p).map(l => ({ link: l, course: courseById(l.course_id) }))
    .filter(x => x.course && !x.course.deleted)
    .sort((a, b) => (a.link.relevance === b.link.relevance ? 0 : a.link.relevance === 'indispensable' ? -1 : 1)
                 || (a.course.sort_order - b.course.sort_order));
}
/** Prochain jalon non fait ; les jalons datés passent avant les non datés. */
function nextMilestone(p) {
  const open = msOf(p).filter(m => !m.done);
  const dated = open.filter(m => m.due_date).sort((a, b) => a.due_date.localeCompare(b.due_date));
  return dated[0] || open[0] || null;
}
/** Engagement le plus urgent = jalon daté le plus proche (retards compris). */
function urgentProject() {
  let best = null, bestD = Infinity;
  projectsAll().forEach(p => {
    if (p.status === 'termine') return;
    const m = nextMilestone(p);
    if (!m || !m.due_date) return;
    const d = daysTo(m.due_date);
    if (d < bestD) { bestD = d; best = { project: p, milestone: m, days: d }; }
  });
  if (best) return best;
  const p = projectsAll().find(x => x.status !== 'termine' && linksOf(x).length);
  return p ? { project: p, milestone: nextMilestone(p), days: null } : null;
}
function prepStats(p) {
  const ess = linkedCourses(p).filter(x => x.link.relevance === 'indispensable').map(x => x.course);
  return stats(ess);
}
const workTotal = p => workOf(p).reduce((s, w) => s + (+w.hours || 0), 0);

/* ── données initiales v2 ────────────────────────────────────────────────── */
window.seedV2 = function seedV2() {
  const S2 = window.SEED2; if (!S2 || state.projects.length) return;
  const byNum = {}; state.courses.forEach(c => { if (!c.deleted) byNum[c.num] = c; });

  S2.projects.forEach(p => {
    const row = { id: uuid(), user_id: user.id, ...p, updated_at: nowISO() };
    localApply('projects', row); enqueue({ table: 'projects', row });

    (S2.milestones[p.code] || []).forEach((m, i) => {
      const mr = { id: uuid(), user_id: user.id, project_id: row.id, title: m.title,
        due_date: m.due_date || null, done: false, done_at: null,
        sort_order: (i + 1) * 10, deleted: false, updated_at: nowISO() };
      localApply('milestones', mr); enqueue({ table: 'milestones', row: mr });
    });

    const lk = S2.links[p.code] || {};
    ['indispensable', 'utile'].forEach(rel => (lk[rel] || []).forEach(num => {
      const c = byNum[num]; if (!c) return;
      const lr = { user_id: user.id, project_id: row.id, course_id: c.id, relevance: rel, updated_at: nowISO() };
      localApply('project_courses', lr); enqueue({ table: 'project_courses', row: lr });
    }));
  });

  S2.modules.forEach((m, i) => {
    const row = { id: uuid(), user_id: user.id, code: m.code, title: m.title, type: m.type,
      cp: m.cp, graded: m.graded !== false, grade: m.grade ?? null, status: m.status || 'prevu',
      semester: m.semester || null, count_in_final: true, notes: m.notes || null,
      sort_order: (i + 1) * 10, deleted: false, updated_at: nowISO() };
    localApply('modules', row); enqueue({ table: 'modules', row });
  });
  saveCache();
};

/* ═══ 1. Écran « Cette semaine » ═════════════════════════════════════════ */
function renderWeek() {
  const R = RULES();
  const hiwi = projByCode('hiwi');
  const urgent = urgentProject();
  const wm = weekMinutes();

  // Prochain jalon de chaque engagement
  const nextCards = projectsAll().map(p => {
    const m = nextMilestone(p);
    const w = m && m.due_date ? whenTxt(m.due_date) : { txt: t('week.noDated'), cls: '' };
    return `<div class="ms" data-open="${p.id}" style="cursor:pointer">
      <span class="chip" style="background:var(--amber);margin-top:6px"></span>
      <div class="m">
        <b>${esc(p.title)}</b>
        <div class="sub" style="margin-top:2px">${m ? esc(m.title) : t('c.none')}</div>
      </div>
      <div class="d ${w.cls}">${esc(w.txt)}${m && m.due_date ? '<br>' + esc(fmtD(m.due_date)) : ''}</div>
    </div>`;
  }).join('');

  // Trois cours à attaquer
  let focus = [], focusName = '';
  if (urgent) {
    focusName = urgent.project.title;
    focus = linkedCourses(urgent.project).filter(x => x.course.status !== 'termine').slice(0, 3);
  }
  const focusHtml = !urgent ? `<div class="empty">${esc(t('week.noLink'))}</div>`
    : focus.length ? focus.map(x => {
        const c = x.course;
        return `<div class="c" data-course="${c.id}">
          <button class="tri ${c.status === 'en_cours' ? 'p' : ''}" data-cycle="${c.id}"
            title="${esc(t('a11y.cycle'))}">${c.status === 'en_cours' ? '◐' : ''}</button>
          <div class="main"><div class="ttl" data-open-course="${c.id}">${esc(c.title)}</div>
            <div class="meta"><span class="tag mono">${fmtH(+c.hours || 0)}</span>
              <span class="pill ${x.link.relevance === 'indispensable' ? 'ess' : ''}">${esc(t('proj.' + (x.link.relevance === 'indispensable' ? 'essential' : 'useful')))}</span>
            </div></div></div>`;
      }).join('')
    : `<div class="empty">${esc(t('week.allDone'))}</div>`;

  // Alertes : cours indispensable non fini à moins de N jours d'un jalon
  const alerts = [];
  projectsAll().forEach(p => {
    if (p.status === 'termine') return;
    const m = nextMilestone(p); if (!m || !m.due_date) return;
    const d = daysTo(m.due_date); if (d > R.alertDays) return;
    // Une seule ligne par jalon : les cours concernés y sont listés ensemble,
    // sinon un jalon proche remplit la carte de lignes quasi identiques.
    const cs = linkedCourses(p)
      .filter(x => x.link.relevance === 'indispensable' && x.course.status !== 'termine')
      .map(x => x.course.title);
    if (!cs.length) return;
    alerts.push(t1n('week.alertGrp', cs.length, {
      k: fmtN(cs.length), m: esc(m.title), n: fmtN(Math.max(0, d)),
      c: cs.map(x => quo(esc(x))).join(', ')
    }));
  });

  const doing = doingNow(alive());                 // ce que tu fais en ce moment, en tête
  const hiwiDone = hiwi ? workTotal(hiwi) : 0;
  const hiwiTot  = hiwi ? (+hiwi.contract_hours || 0) : 0;

  $('#tab-week').innerHTML = `
  <div class="dash">
  ${!v2Ready ? `<div class="card wide"><div class="alert">${t('week.needMigration')}</div></div>` : ''}

  ${doing.length ? `<div class="card wide"><h2>${esc(t('week.doing'))}</h2>
    <div class="clist pinned">${doing.slice(0, 5).map(c => courseRow(c, { showBloc: true })).join('')}</div>
    ${doing.length > 5 ? `<div class="sub" style="margin:8px 0 0">${esc(t('week.doingMore', { n: fmtN(doing.length - 5) }))}</div>` : ''}
  </div>` : ''}

  <div class="card wide"><h2>${esc(t('week.next'))}</h2>
    ${nextCards || `<div class="empty">${esc(t('c.none'))}</div>`}</div>

  <div class="card">
    <h2>${esc(t('week.focus'))}</h2>
    ${urgent ? `<div class="sub" style="margin:-6px 0 10px">${esc(t('week.focusFor', { p: focusName }))}</div>` : ''}
    ${focusHtml}
  </div>

  <div class="card">
    <h2>${esc(t('week.hiwi'))}</h2>
    <div class="kpis">
      <div class="kpi hero"><div class="v">${esc(t('week.hoursDone', { a: fmtN(hiwiDone), b: fmtN(hiwiTot) }))}</div>
        <div class="l">${esc(t('proj.hours'))}</div>
        <div class="s">${hiwiTot && hiwiDone >= hiwiTot ? esc(t('proj.complete'))
                       : esc(t('proj.remaining', { h: fmtH(Math.max(0, hiwiTot - hiwiDone)) }))}</div></div>
      <div class="kpi"><div class="v">${fmtH(wm / 60)}</div>
        <div class="l">${esc(t('week.study'))}</div><div class="s">${esc(t('dash.weekMin', { n: fmtN(wm) }))}</div></div>
    </div>
    <div class="bar" style="margin-top:12px"><i style="width:${hiwiTot ? Math.min(100, hiwiDone / hiwiTot * 100) : 0}%;background:var(--amber)"></i></div>
    ${hiwi ? `<div class="row" style="margin-top:12px"><button class="btn sm" data-open="${hiwi.id}">${esc(t('week.open'))}</button></div>` : ''}
  </div>

  <div class="card wide"><h2>${esc(t('week.alerts'))}</h2>
    ${alerts.length ? alerts.slice(0, 8).map(a => `<div class="alert">${a}</div>`).join('')
      : `<div class="sub" style="margin:0">${esc(t('week.noAlert', { n: fmtN(R.alertDays) }))}</div>`}
  </div>
  </div>`;

  $$('#tab-week [data-open]').forEach(el => el.onclick = () => {
    const p = state.projects.find(x => x.id === el.dataset.open); if (p) openProject(p);
  });
  $$('#tab-week [data-cycle]').forEach(el => el.onclick = e => {
    e.stopPropagation(); cycle(courseById(el.dataset.cycle));
  });
  $$('#tab-week [data-open-course]').forEach(el => el.onclick = () => openCourse(courseById(el.dataset.openCourse)));
  $$('#tab-week .clist.pinned .c').forEach(el => {
    const c = courseById(el.dataset.id);
    $('[data-act=cycle]', el).onclick = () => cycle(c);
    $('[data-act=open]', el).onclick = () => openCourse(c);
  });
}

/* ═══ 2. Onglet « Engagements » ══════════════════════════════════════════ */
function renderProjects() {
  const list = projectsAll();
  $('#tab-projects').innerHTML = `<div class="dash">${list.map(p => {
    const ms = msOf(p), done = ms.filter(m => m.done).length;
    const prep = prepStats(p);
    const m = nextMilestone(p);
    const w = m && m.due_date ? whenTxt(m.due_date) : null;
    return `<div class="card" data-p="${p.id}" style="cursor:pointer">
      <div class="row" style="justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div style="flex:1;min-width:0">
          <b style="font-size:15px">${esc(p.title)}</b>
          <div class="sub" style="margin-top:3px">${esc([p.institute, p.cp ? p.cp + ' CP' : null]
            .filter(Boolean).join(' · '))}</div>
        </div>
        <span class="pill">${esc(t('ps.' + p.status))}</span>
      </div>
      ${p.topic ? `<div class="sub" style="margin:0 0 10px">${esc(p.topic)}</div>` : ''}
      <div class="sub" style="margin-bottom:6px">${esc(t('proj.prep'))} — ${fmtH(prep.done)} / ${fmtH(prep.total)}</div>
      <div class="bar"><i style="width:${prep.pct}%;background:var(--amber)"></i></div>
      <div class="meta" style="margin-top:10px">
        <span class="tag mono">${esc(t('proj.milestones'))} ${fmtN(done)}/${fmtN(ms.length)}</span>
        ${w ? `<span class="tag mono ${w.cls === 'late' ? 'est' : ''}">${esc(w.txt)}</span>` : ''}
        ${p.code === 'hiwi' ? `<span class="tag mono">${fmtN(workTotal(p))} / ${fmtN(+p.contract_hours || 0)} h</span>` : ''}
      </div>
    </div>`;
  }).join('')}</div>`;
  $('#tab-projects .dash').insertAdjacentHTML('beforeend',
    `<div class="card wide"><div class="row"><button class="btn" id="pAdd">${esc(t('proj.add'))}</button></div></div>`);
  $$('#tab-projects [data-p]').forEach(el => el.onclick = () =>
    openProject(state.projects.find(x => x.id === el.dataset.p)));
  $('#pAdd').onclick = addProject;
}

/* ═══ 3. Fiche engagement ════════════════════════════════════════════════ */
function openProject(p) {
  const ms = msOf(p), lc = linkedCourses(p), prep = prepStats(p);
  const isHiwi = p.code === 'hiwi', isMA = p.code === 'masterarbeit';

  openSheet(`
    <div class="sheet-h">
      <div style="flex:1">
        <div class="meta" style="margin:0 0 6px">
          <span class="pill">${esc(t('ps.' + p.status))}</span>
          ${p.institute ? `<span>${esc(p.institute)}</span>` : ''}
          ${p.cp ? `<span>${fmtN(p.cp)} CP</span>` : ''}
        </div>
        <h3>${esc(p.title)}</h3>
      </div>
      <button class="icon-btn" data-x>✕</button>
    </div>
    ${p.topic ? `<p style="margin:0 0 12px;color:var(--txt-2);font-size:14px">${esc(p.topic)}</p>` : ''}
    ${p.notes ? `<div class="why">${esc(p.notes)}</div>` : ''}

    <div class="hr"></div>
    <label class="f">${esc(t('proj.prep'))}</label>
    <div class="bar" style="height:9px"><i style="width:${prep.pct}%;background:var(--amber)"></i></div>
    <div class="sub">${fmtH(prep.done)} / ${fmtH(prep.total)} — ${esc(t('proj.prepSub'))}</div>

    <div class="hr"></div>
    <div class="row" style="justify-content:space-between;align-items:center">
      <label class="f" style="margin:0">${esc(t('proj.milestones'))}</label>
      <button class="btn sm" id="addMs">${esc(t('proj.addMilestone'))}</button>
    </div>
    <div style="margin-top:8px">${ms.length ? ms.map(m => {
      const w = m.due_date ? whenTxt(m.due_date) : null;
      return `<div class="ms ${m.done ? 'done' : ''}">
        <button class="box ${m.done ? 'on' : ''}" data-ms="${m.id}">✓</button>
        <div class="m"><b data-msedit="${m.id}" style="cursor:pointer">${esc(m.title)}</b>
          ${m.due_date ? `<div class="sub" style="margin-top:1px">${esc(fmtD(m.due_date))}</div>` : ''}</div>
        ${w && !m.done ? `<div class="d ${w.cls}">${esc(w.txt)}</div>` : ''}
      </div>`;
    }).join('') : `<div class="empty">${esc(t('c.none'))}</div>`}</div>

    ${isMA ? maCalendarHtml() : ''}
    ${isHiwi ? hoursHtml(p) : ''}

    <div class="hr"></div>
    <div class="row" style="justify-content:space-between;align-items:center">
      <label class="f" style="margin:0">${esc(t('proj.courses'))}</label>
      <button class="btn sm" id="linkC">${esc(t('proj.link'))}</button>
    </div>
    <div style="margin-top:8px">${lc.length ? lc.map(x => {
      const c = x.course, f = Math.round(frac(c) * 100);
      return `<div class="ms">
        <span class="box ${c.status === 'termine' ? 'on' : ''}">${c.status === 'termine' ? '✓' : ''}</span>
        <div class="m"><b data-oc="${c.id}" style="cursor:pointer">${esc(c.title)}</b>
          <div class="meta" style="margin-top:3px">
            <span class="pill ${x.link.relevance === 'indispensable' ? 'ess' : ''}"
              data-rel="${c.id}" style="cursor:pointer">${esc(t('proj.' + (x.link.relevance === 'indispensable' ? 'essential' : 'useful')))}</span>
            <span class="tag mono">${fmtH(+c.hours || 0)}</span>
            <span class="tag mono">${fmtN(f)} %</span>
          </div></div>
        <button class="btn sm dgr" data-unlink="${c.id}">✕</button>
      </div>`;
    }).join('') : `<div class="empty">${esc(t('proj.noCourses'))}</div>`}</div>

    <div class="hr"></div>
    <div class="row">
      <div style="flex:1;min-width:140px"><label class="f">${esc(t('proj.status'))}</label>
        <select id="pSt">${['prevu', 'en_cours', 'termine'].map(s =>
          `<option value="${s}" ${p.status === s ? 'selected' : ''}>${esc(t('ps.' + s))}</option>`).join('')}</select></div>
      <div style="flex:1;min-width:140px"><label class="f">${esc(t('proj.supervisor'))}</label>
        <input type="text" id="pSup" value="${esc(p.supervisor || '')}"></div>
    </div>
    <div class="row" style="margin-top:2px">
      <div style="flex:1;min-width:140px"><label class="f">${esc(t('proj.start'))}</label>
        <input type="date" id="pS" value="${esc(p.start_date || '')}"></div>
      <div style="flex:1;min-width:140px"><label class="f">${esc(t('proj.end'))}</label>
        <input type="date" id="pE" value="${esc(p.end_date || '')}"></div>
    </div>
    <div class="fld"><label class="f">${esc(t('proj.topic'))}</label>
      <input type="text" id="pT" value="${esc(p.topic || '')}"></div>
    <div class="fld"><label class="f">${esc(t('c.notes'))}</label>
      <textarea id="pN">${esc(p.notes || '')}</textarea></div>
    <div class="row"><button class="btn pri" id="pOk" style="flex:1">${esc(t('c.save'))}</button>
      <button class="btn dgr" id="pDel">${esc(t('proj.delete'))}</button></div>`, sheet => {

    // jalons
    $$('[data-ms]', sheet).forEach(b => b.onclick = () => {
      const m = state.milestones.find(x => x.id === b.dataset.ms);
      write('milestones', { id: m.id, project_id: m.project_id, done: !m.done,
        done_at: !m.done ? dstr(new Date()) : null }, { silent: true });
      closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
    });
    $$('[data-msedit]', sheet).forEach(b => b.onclick = () =>
      editMilestone(state.milestones.find(x => x.id === b.dataset.msedit), p));
    $('#addMs', sheet).onclick = () => editMilestone(null, p);

    // cours liés
    $$('[data-oc]', sheet).forEach(b => b.onclick = () => { closeSheet(); openCourse(courseById(b.dataset.oc)); });
    $$('[data-rel]', sheet).forEach(b => b.onclick = () => {
      const l = state.plinks.find(x => x.project_id === p.id && x.course_id === b.dataset.rel);
      write('project_courses', { project_id: p.id, course_id: l.course_id,
        relevance: l.relevance === 'indispensable' ? 'utile' : 'indispensable' }, { silent: true });
      closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
    });
    $$('[data-unlink]', sheet).forEach(b => b.onclick = () => {
      remove('project_courses', { project_id: p.id, course_id: b.dataset.unlink }, { silent: true });
      closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
    });
    $('#linkC', sheet).onclick = () => linkCourse(p);

    if (isHiwi) bindHours(p, sheet);
    if (isMA) bindMaCalendar(p, sheet);

    $('#pOk', sheet).onclick = () => {
      write('projects', { id: p.id, status: $('#pSt', sheet).value,
        supervisor: $('#pSup', sheet).value.trim() || null,
        start_date: $('#pS', sheet).value || null, end_date: $('#pE', sheet).value || null,
        topic: $('#pT', sheet).value.trim() || null, notes: $('#pN', sheet).value.trim() || null });
      closeSheet(); toast(t('c.saved'));
    };
    // Suppression définitive : la base cascade sur les jalons, les heures et
    // les liens ; on aligne l'état local sur le même résultat.
    $('#pDel', sheet).onclick = () => {
      if (!confirm(t('proj.delQ', { t: p.title }))) return;
      state.milestones = state.milestones.filter(x => x.project_id !== p.id);
      state.work       = state.work.filter(x => x.project_id !== p.id);
      state.plinks     = state.plinks.filter(x => x.project_id !== p.id);
      remove('projects', { id: p.id });
      closeSheet(); toast(t('proj.deleted'));
    };
  });
}

/** Nouvel engagement : indispensable une fois qu'on en a supprimé un. */
function addProject() {
  const code = 'p' + Date.now().toString(36);
  const row = { id: uuid(), code, title: t('proj.newTitle'), institute: null, topic: null,
    supervisor: null, cp: null, start_date: null, end_date: null, status: 'prevu',
    contract_hours: null, hourly_rate: null, notes: null,
    sort_order: Math.max(0, ...projectsAll().map(x => x.sort_order || 0)) + 10 };
  write('projects', row);
  openProject(state.projects.find(x => x.id === row.id));
}

function editMilestone(m, p) {
  const isNew = !m;
  openSheet(`<div class="sheet-h"><h3>${esc(isNew ? t('proj.addMilestone') : t('c.edit'))}</h3>
      <button class="icon-btn" data-x>✕</button></div>
    <div class="fld"><label class="f">${esc(t('c.title'))}</label>
      <input type="text" id="mT" value="${esc(m ? m.title : '')}"></div>
    <div class="fld"><label class="f">${esc(t('proj.mDue'))}</label>
      <input type="date" id="mD" value="${esc(m && m.due_date ? m.due_date : '')}"></div>
    <div class="row"><button class="btn pri" id="mOk" style="flex:1">${esc(t('c.save'))}</button>
      ${isNew ? '' : `<button class="btn dgr" id="mDel">${esc(t('c.delete'))}</button>`}</div>`, sh => {
    $('#mOk', sh).onclick = () => {
      const title = $('#mT', sh).value.trim(); if (!title) return toast(t('new.needTitle'));
      const due = $('#mD', sh).value || null;
      if (isNew) {
        const mx = Math.max(0, ...msOf(p).map(x => x.sort_order || 0));
        write('milestones', { id: uuid(), project_id: p.id, title, due_date: due,
          done: false, done_at: null, sort_order: mx + 10, deleted: false }, { silent: true });
      } else {
        write('milestones', { id: m.id, project_id: m.project_id, title, due_date: due }, { silent: true });
      }
      closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
    };
    if (!isNew) $('#mDel', sh).onclick = () => {
      write('milestones', { id: m.id, project_id: m.project_id, deleted: true }, { silent: true });
      closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
    };
  });
}

function linkCourse(p) {
  const already = new Set(linksOf(p).map(l => l.course_id));
  const pool = alive().filter(c => !already.has(c.id));
  openSheet(`<div class="sheet-h"><h3>${esc(t('proj.link'))}</h3><button class="icon-btn" data-x>✕</button></div>
    <div class="fld"><label class="f">${esc(t('list.search'))}</label>
      <input type="text" id="lq" placeholder="${esc(t('list.searchPh'))}"></div>
    <div class="fld"><label class="f">${esc(t('proj.essential'))} / ${esc(t('proj.useful'))}</label>
      <select id="lr"><option value="indispensable">${esc(t('proj.essential'))}</option>
        <option value="utile" selected>${esc(t('proj.useful'))}</option></select></div>
    <div id="lres" style="max-height:44vh;overflow-y:auto"></div>`, sh => {
    const paint = () => {
      const q = $('#lq', sh).value.trim().toLowerCase();
      const res = (q ? pool.filter(c => c.title.toLowerCase().includes(q)) : pool).slice(0, 40);
      $('#lres', sh).innerHTML = res.map(c =>
        `<div class="ms"><div class="m"><b>${esc(c.title)}</b>
          <div class="meta" style="margin-top:2px"><span class="tag mono">${fmtH(+c.hours || 0)}</span>
          <span style="color:var(--txt-3)">#${c.num}</span></div></div>
          <button class="btn sm" data-pick="${c.id}">+</button></div>`).join('')
        || `<div class="empty">${esc(t('list.empty'))}</div>`;
      $$('[data-pick]', sh).forEach(b => b.onclick = () => {
        write('project_courses', { project_id: p.id, course_id: b.dataset.pick,
          relevance: $('#lr', sh).value }, { silent: true });
        closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
      });
    };
    $('#lq', sh).oninput = paint; paint();
  });
}

/* ═══ 4. Heures HiWi et Stundennachweis ══════════════════════════════════ */
function nachweisDue(p) {
  return p.end_date ? addDays(parseD(p.end_date), RULES().nachweisDays || 14) : null;
}
function hoursHtml(p) {
  const rows = workOf(p), total = workTotal(p);
  const contract = +p.contract_hours || 0, rate = +p.hourly_rate || 0;
  const due = nachweisDue(p), dDays = due ? Math.round((due - todayD()) / 864e5) : null;
  return `
  <div class="hr"></div>
  <label class="f">${esc(t('proj.hours'))}</label>
  <div class="kpis" style="margin-bottom:12px">
    <div class="kpi hero"><div class="v">${fmtN(total)}</div>
      <div class="l">${esc(t('c.total'))} / ${fmtN(contract)} h</div>
      <div class="s">${contract && total >= contract
        ? esc(t('proj.complete')) + (total > contract ? ' · ' + esc(t('proj.over', { h: fmtH(total - contract) })) : '')
        : esc(t('proj.remaining', { h: fmtH(Math.max(0, contract - total)) }))}</div></div>
    <div class="kpi"><div class="v">${(total * rate).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
      <div class="l">${esc(t('proj.gross'))}</div>
      <div class="s">${fmtN(rate)} €/h</div></div>
  </div>
  <div class="row" style="align-items:flex-end;gap:8px">
    <div style="flex:1.2;min-width:130px"><label class="f">${esc(t('hours.day'))}</label>
      <input type="date" id="wD" value="${esc(dstr(new Date()))}"></div>
    <div style="flex:.7;min-width:78px"><label class="f">${esc(t('hours.h'))}</label>
      <input type="number" id="wH" step="0.25" min="0.25" placeholder="4"></div>
    <div style="flex:1;min-width:110px"><label class="f">${esc(t('hours.kind'))}</label>
      <select id="wK"><option value="travail">${esc(t('hours.kWork'))}</option>
        <option value="conge">${esc(t('hours.kLeave'))}</option>
        <option value="maladie">${esc(t('hours.kSick'))}</option></select></div>
  </div>
  <div class="row" style="margin-top:8px">
    <input type="text" id="wA" placeholder="${esc(t('hours.activity'))}" style="flex:1;min-width:150px">
    <button class="btn" id="wAdd">${esc(t('c.add'))}</button>
  </div>
  <div style="margin-top:12px;overflow-x:auto">${rows.length ? `<table class="tbl">
    <thead><tr><th>${esc(t('hours.day'))}</th><th>${esc(t('hours.kind'))}</th>
      <th>${esc(t('hours.activity'))}</th><th class="num">${esc(t('hours.h'))}</th><th></th></tr></thead>
    <tbody>${rows.map(w => `<tr>
      <td class="mono">${esc(fmtD(w.day))}</td>
      <td>${esc(t('hours.k' + { travail: 'Work', conge: 'Leave', maladie: 'Sick' }[w.kind]))}</td>
      <td>${esc(w.activity || '')}</td>
      <td class="num">${fmtN(w.hours)}</td>
      <td><button class="btn sm dgr" data-wdel="${w.id}">✕</button></td></tr>`).join('')}</tbody>
    <tfoot><tr><td colspan="3">${esc(t('c.total'))}</td><td class="num">${fmtN(total)}</td><td></td></tr></tfoot>
  </table>` : `<div class="empty">${esc(t('hours.none'))}</div>`}</div>
  <div class="sub" style="margin-top:10px">${esc(t('hours.rule5'))}<br>${esc(t('hours.rule7'))}</div>
  ${due ? `<div class="alert" style="margin-top:10px">${esc(dDays !== null && dDays >= 0 && dDays <= 30
      ? t('hours.dueSoon', { n: fmtN(dDays), d: fmtD(due) })
      : t('hours.due', { d: fmtD(due) }))}</div>` : ''}
  <div class="row" style="margin-top:8px">
    <button class="btn" id="wCsv">${esc(t('hours.csv'))}</button>
    <button class="btn" id="wPrint">${esc(t('hours.print'))}</button>
  </div>`;
}
function bindHours(p, sheet) {
  $('#wAdd', sheet).onclick = () => {
    const h = parseFloat($('#wH', sheet).value);
    if (!h || h <= 0) return toast(t('hours.needHours'));
    write('work_hours', { id: uuid(), project_id: p.id, day: $('#wD', sheet).value || dstr(new Date()),
      hours: h, kind: $('#wK', sheet).value, activity: $('#wA', sheet).value.trim() || null,
      deleted: false }, { silent: true });
    closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
  };
  $$('[data-wdel]', sheet).forEach(b => b.onclick = () => {
    const w = state.work.find(x => x.id === b.dataset.wdel);
    write('work_hours', { id: w.id, project_id: w.project_id, deleted: true }, { silent: true });
    closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
  });
  $('#wCsv', sheet).onclick = () => {
    const kl = { travail: t('hours.kWork'), conge: t('hours.kLeave'), maladie: t('hours.kSick') };
    const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const head = [t('hours.day'), t('hours.kind'), t('hours.activity'), t('hours.h')];
    const body = workOf(p).map(w => [w.day, kl[w.kind], w.activity || '', String(w.hours).replace('.', ',')]);
    body.push([t('c.total'), '', '', String(workTotal(p)).replace('.', ',')]);
    dl('stundennachweis-' + dstr(new Date()) + '.csv',
       '﻿' + [head, ...body].map(r => r.map(q).join(';')).join('\n'), 'text/csv');
  };
  $('#wPrint', sheet).onclick = () => printNachweis(p);
}
function printNachweis(p) {
  const kl = { travail: t('hours.kWork'), conge: t('hours.kLeave'), maladie: t('hours.kSick') };
  const rows = workOf(p), total = workTotal(p), due = nachweisDue(p);
  const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8">
    <title>${esc(t('hours.sheet'))}</title><style>
    body{font-family:system-ui,Arial,sans-serif;color:#111;margin:28px;font-size:12pt}
    h1{font-size:17pt;margin:0 0 4px} .meta{color:#555;font-size:10pt;margin-bottom:18px;line-height:1.6}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th,td{border:1px solid #999;padding:6px 8px;text-align:left}
    th{background:#eee;font-size:10pt} td.n{text-align:right;white-space:nowrap}
    tfoot td{font-weight:bold} .sign{margin-top:46px;display:flex;gap:40px}
    .sign div{flex:1;border-top:1px solid #333;padding-top:5px;font-size:10pt;color:#444}
    @media print{body{margin:12mm}}</style></head><body>
    <h1>${esc(t('hours.sheet'))}</h1>
    <div class="meta">
      ${esc(p.title)}${p.institute ? ' — ' + esc(p.institute) : ''}<br>
      ${esc(t('proj.start'))} : ${esc(fmtD(p.start_date))} · ${esc(t('proj.end'))} : ${esc(fmtD(p.end_date))}<br>
      ${esc(t('proj.contract'))} : ${fmtN(+p.contract_hours || 0)} h · ${esc(t('proj.rate'))} : ${fmtN(+p.hourly_rate || 0)} €/h
      ${due ? '<br>' + esc(t('hours.due', { d: fmtD(due) })) : ''}
    </div>
    <table><thead><tr><th>${esc(t('hours.day'))}</th><th>${esc(t('hours.kind'))}</th>
      <th>${esc(t('hours.activity'))}</th><th>${esc(t('hours.h'))}</th></tr></thead>
    <tbody>${rows.map(w => `<tr><td>${esc(fmtD(w.day))}</td><td>${esc(kl[w.kind])}</td>
      <td>${esc(w.activity || '')}</td><td class="n">${fmtN(w.hours)}</td></tr>`).join('')
      || `<tr><td colspan="4">${esc(t('hours.none'))}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="3">${esc(t('c.total'))}</td><td class="n">${fmtN(total)} h</td></tr></tfoot></table>
    <div class="sign"><div>Datum, Unterschrift — ${esc(t('nav.logout') === 'Abmelden' ? 'Hilfskraft' : 'Hilfskraft')}</div>
      <div>Datum, Unterschrift — Betreuer / Institut</div></div>
    </body></html>`;
  const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(f);
  f.srcdoc = html;
  f.onload = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) {}
    setTimeout(() => f.remove(), 60000); };
}

/* ═══ 5. Calendrier Masterarbeit ═════════════════════════════════════════ */
function maCalendarHtml() {
  const R = RULES();
  const reg = state.settings && state.settings.ma_start ? state.settings.ma_start : '';
  const hand = reg ? addWeeks(parseD(reg), R.maWeeks) : null;
  const ext  = reg ? addWeeks(parseD(reg), R.maWeeks + R.maExtraWeeks) : null;
  return `
  <div class="hr"></div>
  <label class="f">${esc(t('ma.reg'))}</label>
  <div class="row" style="align-items:flex-end">
    <input type="date" id="maR" value="${esc(reg)}" style="flex:1;min-width:150px">
    <button class="btn" id="maApply" ${reg ? '' : 'disabled'}>${esc(t('ma.apply'))}</button>
  </div>
  ${reg ? `<div class="kpis" style="margin-top:12px">
    <div class="kpi hero"><div class="v" style="font-size:20px">${esc(fmtD(hand))}</div>
      <div class="l">${esc(t('ma.hand'))}</div><div class="s">${esc(t('ma.weeks', { n: fmtN(R.maWeeks) }))}</div></div>
    <div class="kpi"><div class="v" style="font-size:20px">${esc(fmtD(ext))}</div>
      <div class="l">${esc(t('ma.ext'))}</div><div class="s">${esc(t('ma.weeks', { n: fmtN(R.maWeeks + R.maExtraWeeks) }))}</div></div>
  </div>` : `<div class="sub" style="margin-top:8px">${esc(t('ma.fill'))}</div>`}
  <div class="sub" style="margin-top:8px">${esc(t('ma.split'))}</div>`;
}
function bindMaCalendar(p, sheet) {
  const R = RULES();
  $('#maR', sheet).onchange = e => {
    if (v2Ready) write('settings', { user_id: user.id, ma_start: e.target.value || null }, { silent: true });
    else { state.settings = { ...state.settings, ma_start: e.target.value || null }; saveCache(); }
    closeSheet(); render(); openProject(state.projects.find(x => x.id === p.id));
  };
  const btn = $('#maApply', sheet);
  if (btn) btn.onclick = () => {
    const reg = $('#maR', sheet).value; if (!reg) return;
    const defs = (window.SEED2.milestones.masterarbeit || []);
    msOf(p).forEach(m => {
      const d = defs.find(x => x.title === m.title);
      if (!d || d.week == null) return;
      write('milestones', { id: m.id, project_id: p.id, due_date: dstr(addWeeks(parseD(reg), d.week)) }, { silent: true });
    });
    write('projects', { id: p.id, start_date: reg,
      end_date: dstr(addWeeks(parseD(reg), R.maWeeks)) }, { silent: true });
    closeSheet(); render(); toast(t('ma.applied'));
    openProject(state.projects.find(x => x.id === p.id));
  };
}

/* ═══ 6. Notes du Master ═════════════════════════════════════════════════ */
/** §7 : moyenne pondérée par les CP, modules non notés exclus.
 *  §2(6) : au plus `wahlCapCp` CP du Wahlbereich entrent dans la note. */
function gradeAvg(scope) {
  const R = RULES(), all = modulesAll();
  const keep = m => m.graded && m.grade != null &&
    (scope === 'confirmed' ? m.status === 'valide' : ['valide', 'provisoire'].includes(m.status));
  let wahl = all.filter(m => m.type === 'W' && keep(m));
  const others = all.filter(m => m.type !== 'W' && keep(m));

  const cap = R.wahlCapCp || 30;
  const wahlCp = wahl.reduce((s, m) => s + (+m.cp || 0), 0);
  let counted = wahl;
  if (wahlCp > cap) {
    const mode = (state.settings && state.settings.wahl_mode) || 'best';
    if (mode === 'manual') counted = wahl.filter(m => m.count_in_final !== false);
    else {
      counted = []; let acc = 0;
      [...wahl].sort((a, b) => a.grade - b.grade).forEach(m => {
        if (acc + m.cp <= cap) { counted.push(m); acc += m.cp; }
      });
    }
  }
  const used = others.concat(counted);
  const cp = used.reduce((s, m) => s + (+m.cp || 0), 0);
  const avg = cp ? used.reduce((s, m) => s + (+m.cp || 0) * (+m.grade), 0) / cp : null;
  return { avg, cp, n: used.length, wahlCp, wahlCap: cap, capped: wahlCp > cap,
           prov: used.filter(m => m.status === 'provisoire').length };
}
function mention(g) {
  if (g == null) return '';
  if (g <= 1.5) return 'sehr gut';
  if (g <= 2.5) return 'gut';
  if (g <= 3.5) return 'befriedigend';
  if (g <= 4.0) return 'ausreichend';
  return 'nicht bestanden';
}
/** §6(2) : conditions d'inscription, sur les modules VALIDÉS uniquement. */
function maConditions() {
  const R = RULES(), ok = modulesAll().filter(m => m.status === 'valide');
  const cp = ok.reduce((s, m) => s + (+m.cp || 0), 0);
  const pflicht = ok.filter(m => m.type === 'P').length;
  const wp = ok.filter(m => m.type === 'WP').length;
  const wahlCp = ok.filter(m => m.type === 'W').reduce((s, m) => s + (+m.cp || 0), 0);
  const projekt = ok.some(m => m.type === 'PROJEKT');
  return [
    { ok: cp >= R.reqTotalCp, label: t('gr.chkCp', { b: fmtN(R.reqTotalCp) }), val: `${fmtN(cp)} / ${fmtN(R.reqTotalCp)} CP` },
    { ok: projekt, label: t('gr.chkProjekt'), val: projekt ? t('c.yes') : t('c.no') },
    { ok: pflicht >= R.reqPflicht, label: t('gr.chkPflicht'), val: `${fmtN(pflicht)} / ${fmtN(R.reqPflicht)}` },
    { ok: wp >= R.reqWahlpflicht, label: t('gr.chkWp'), val: `${fmtN(wp)} / ${fmtN(R.reqWahlpflicht)}` },
    { ok: wahlCp >= R.reqWahlCp, label: t('gr.chkWahl', { b: fmtN(R.reqWahlCp) }), val: `${fmtN(wahlCp)} / ${fmtN(R.reqWahlCp)} CP` }
  ];
}
function renderGrades() {
  const conf = gradeAvg('confirmed'), proj = gradeAvg('projected');
  const conds = maConditions();
  const mode = (state.settings && state.settings.wahl_mode) || 'best';
  const mods = modulesAll();

  const card = (ttl, g, extra) => `<div class="kpi ${g.avg != null ? 'hero' : ''}">
    <div class="v">${g.avg != null ? esc(fmtG2(g.avg)) : '—'}</div>
    <div class="l">${esc(ttl)}</div>
    <div class="s">${g.avg != null ? esc(mention(g.avg)) + ' · ' + esc(t('gr.nMod', { n: fmtN(g.n), c: fmtN(g.cp) }))
                                    : esc(t('gr.noGrade'))}${extra || ''}</div></div>`;

  $('#tab-grades').innerHTML = `<div class="dash">
  <div class="card wide"><h2>${esc(t('gr.avg'))}</h2>
    <div class="kpis">
      ${card(t('gr.confirmed'), conf)}
      ${card(t('gr.projected'), proj, proj.prov ? ' · ' + esc(t('gr.provCount', { n: fmtN(proj.prov) })) : '')}
    </div>
    <div class="sub" style="margin-top:10px">${esc(t('gr.scale'))}</div>
    <div class="sub">${esc(t('gr.sim'))}</div>
  </div>

  <div class="card"><h2>${esc(t('gr.check'))}</h2>
    ${conds.map(c => `<div class="chk"><i class="${c.ok ? 'ok' : 'no'}">${c.ok ? '✓' : '✕'}</i>
      <span style="flex:1">${esc(c.label)}</span>
      <span class="mono" style="color:var(--txt-3);font-size:12px">${esc(c.val)}</span></div>`).join('')}
  </div>

  <div class="card"><h2>${esc(t('gr.wahl'))}</h2>
    <div class="sub" style="margin:0 0 10px">${esc(conf.capped
      ? t('gr.wahlTxt', { t: fmtN(conf.wahlCp), c: fmtN(conf.wahlCap) })
      : t('gr.wahlOk', { t: fmtN(proj.wahlCp), c: fmtN(conf.wahlCap) }))}</div>
    <label class="f">${esc(t('gr.wahlMode'))}</label>
    <div class="seg">
      <button data-wm="best" class="${mode === 'best' ? 'on' : ''}">${esc(t('gr.wahlBest'))}</button>
      <button data-wm="manual" class="${mode === 'manual' ? 'on' : ''}">${esc(t('gr.wahlManual'))}</button>
    </div>
    <div class="alert" style="margin-top:12px">${esc(t('gr.wahlWarn'))}</div>
  </div>

  <div class="card wide">
    <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:10px">
      <h2 style="margin:0">${esc(t('gr.modules'))}</h2>
      <button class="btn sm" id="addMod">${esc(t('gr.addModule'))}</button>
    </div>
    <div style="overflow-x:auto"><table class="tbl mods">
      <thead><tr><th>${esc(t('gr.code'))}</th><th>${esc(t('c.title'))}</th><th>${esc(t('gr.type'))}</th>
        <th class="num">CP</th><th class="num">${esc(t('gr.grade'))}</th><th>${esc(t('proj.status'))}</th></tr></thead>
      <tbody>${mods.map(m => `<tr data-mod="${m.id}" style="cursor:pointer">
        <td class="mono c-code">${esc(m.code)}</td>
        <td class="c-title">${esc(m.title)}${m.semester ? ` <span class="pill">${esc(m.semester)}</span>` : ''}</td>
        <td class="c-type">${esc(t('mt.' + m.type))}</td>
        <td class="num c-cp">${fmtN(m.cp)}</td>
        <td class="num grade c-grade">${m.graded ? (m.grade != null ? esc(fmtG(m.grade)) : '—') : `<span class="pill">${esc(t('gr.passedShort'))}</span>`}</td>
        <td class="c-status"><span class="pill ${m.status === 'valide' ? 'ok' : m.status === 'provisoire' ? 'prov' : ''}">${esc(t('ms.' + m.status))}</span></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>
  </div>`;

  $$('#tab-grades [data-wm]').forEach(b => b.onclick = () => {
    if (v2Ready) write('settings', { user_id: user.id, wahl_mode: b.dataset.wm });
    else { state.settings = { ...state.settings, wahl_mode: b.dataset.wm }; saveCache(); render(); }
  });
  $$('#tab-grades [data-mod]').forEach(tr => tr.onclick = () =>
    editModule(state.modules.find(m => m.id === tr.dataset.mod)));
  $('#addMod').onclick = () => editModule(null);
}

function editModule(m) {
  const isNew = !m;
  const TYPES = ['P', 'WP', 'W', 'PROJEKT', 'MA'];
  const STATUS = ['prevu', 'en_cours', 'valide', 'provisoire'];
  openSheet(`<div class="sheet-h"><h3>${esc(isNew ? t('gr.addModule') : t('gr.editModule'))}</h3>
      <button class="icon-btn" data-x>✕</button></div>
    <div class="row">
      <div style="flex:.8;min-width:110px"><label class="f">${esc(t('gr.code'))}</label>
        <input type="text" id="gC" value="${esc(m ? m.code : '')}"></div>
      <div style="flex:2;min-width:180px"><label class="f">${esc(t('c.title'))}</label>
        <input type="text" id="gT" value="${esc(m ? m.title : '')}"></div>
    </div>
    <div class="row" style="margin-top:8px">
      <div style="flex:1;min-width:130px"><label class="f">${esc(t('gr.type'))}</label>
        <select id="gY">${TYPES.map(x => `<option value="${x}" ${m && m.type === x ? 'selected' : ''}>${esc(t('mt.' + x))}</option>`).join('')}</select></div>
      <div style="flex:.6;min-width:80px"><label class="f">${esc(t('gr.cpField'))}</label>
        <input type="number" id="gP" step="1" min="0" value="${m ? m.cp : 6}"></div>
      <div style="flex:1;min-width:130px"><label class="f">${esc(t('proj.status'))}</label>
        <select id="gS">${STATUS.map(x => `<option value="${x}" ${m && m.status === x ? 'selected' : ''}>${esc(t('ms.' + x))}</option>`).join('')}</select></div>
    </div>
    <div class="row" style="margin-top:8px">
      <div style="flex:1;min-width:140px"><label class="f">${esc(t('gr.graded'))}</label>
        <select id="gG"><option value="1" ${!m || m.graded ? 'selected' : ''}>${esc(t('gr.graded'))}</option>
          <option value="0" ${m && !m.graded ? 'selected' : ''}>${esc(t('gr.notGraded'))}</option></select></div>
      <div style="flex:.7;min-width:100px"><label class="f">${esc(t('gr.grade'))}</label>
        <input type="number" id="gN" step="0.1" min="1" max="5" value="${m && m.grade != null ? m.grade : ''}"></div>
      <div style="flex:1;min-width:120px"><label class="f">${esc(t('gr.countIn'))}</label>
        <select id="gF"><option value="1" ${!m || m.count_in_final !== false ? 'selected' : ''}>${esc(t('c.yes'))}</option>
          <option value="0" ${m && m.count_in_final === false ? 'selected' : ''}>${esc(t('c.no'))}</option></select></div>
    </div>
    <div class="fld" style="margin-top:8px"><label class="f">${esc(t('c.notes'))}</label>
      <input type="text" id="gO" value="${esc(m && m.notes ? m.notes : '')}"></div>
    <div class="row"><button class="btn pri" id="gOk" style="flex:1">${esc(t('c.save'))}</button>
      ${isNew ? '' : `<button class="btn dgr" id="gDel">${esc(t('c.delete'))}</button>`}</div>`, sh => {
    $('#gOk', sh).onclick = () => {
      const code = $('#gC', sh).value.trim(), title = $('#gT', sh).value.trim();
      if (!code || !title) return toast(t('gr.needCode'));
      const graded = $('#gG', sh).value === '1';
      const gv = parseFloat($('#gN', sh).value);
      const row = { code, title, type: $('#gY', sh).value, cp: +$('#gP', sh).value || 0,
        graded, grade: graded && !isNaN(gv) ? gv : null, status: $('#gS', sh).value,
        count_in_final: $('#gF', sh).value === '1', notes: $('#gO', sh).value.trim() || null };
      if (isNew) {
        row.id = uuid(); row.deleted = false;
        row.sort_order = Math.max(0, ...modulesAll().map(x => x.sort_order || 0)) + 10;
      } else row.id = m.id;
      write('modules', row); closeSheet(); toast(t('c.saved'));
    };
    if (!isNew) $('#gDel', sh).onclick = () => {
      write('modules', { id: m.id, deleted: true }); closeSheet(); toast(t('c.saved'));
    };
  });
}

/* ── enregistrement des écrans ───────────────────────────────────────────── */
RENDERERS.week     = renderWeek;
RENDERERS.projects = renderProjects;
RENDERERS.grades   = renderGrades;
