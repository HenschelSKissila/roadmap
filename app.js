/* ═══════════════════════════════════════════════════════════════════════════
   Feuille de route — Automatisierungstechnik
   PWA vanilla + Supabase (auth par mot de passe, Realtime, file hors-ligne)
   Interface trilingue : français · English · Deutsch
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';

/* ── 0. constantes & état ────────────────────────────────────────────────── */
const CACHE_KEY  = 'rm.cache.v1';
const OUTBOX_KEY = 'rm.outbox.v1';
const OWNER_KEY  = 'rm.owner.v1';
const ORPHAN_KEY = 'rm.orphans.v1';
const APP_VERSION = '11';          // affiché dans Réglages : les trois appareils doivent montrer le même
/* Les données locales appartiennent à un compte : on les range sous son
   identifiant, sinon une seconde connexion hérite des lignes de la première
   et la RLS refuse de les réécrire. */
let owner = null;
const cacheKey  = () => owner ? CACHE_KEY  + '.' + owner : CACHE_KEY;
const outboxKey = () => owner ? OUTBOX_KEY + '.' + owner : OUTBOX_KEY;
const orphanKey = () => owner ? ORPHAN_KEY + '.' + owner : ORPHAN_KEY;
const UI_KEY     = 'rm.ui.v1';
const LANG_KEY   = 'rm.lang.v1';
const LEGACY_KEY = 'roadmap-iat-ialb-v1';     // ancienne PWA
const MIGR_KEY   = 'rm.migrated.v1';

const FLAGS = ['optionnel', 'si besoin', 'selon sujet', 'plus tard', 'à acquérir', 'non-cours'];
const SOFT_FLAGS = ['si besoin', 'plus tard', 'non-cours', 'optionnel'];  // hors périmètre prioritaire
const FOCUS_BLOCS = ['b0', 'b2', 'b5', 'b1', 'b4', 'b3', 'b8'];
const BLOC_COLORS = ['#ff5f5f', '#ffb020', '#f472b6', '#5b9dff', '#4ade80',
                     '#2dd4bf', '#c084fc', '#38bdf8', '#fbbf24', '#6b7280'];

let sb = null, user = null, channel = null;
const state = { blocs: [], courses: [], settings: null, log: [],
                projects: [], milestones: [], plinks: [], work: [], modules: [] };
let ui = { tab: 'week', bloc: 'all', status: 'all', flag: 'all', q: '', scope: 'focus', sort: 'prio', fold: null };

/* Tables synchronisées. `key` = tableau dans `state`. `v2` = ajoutée par la
   migration v2 : si elle manque encore côté Supabase, on l'ignore en silence. */
const TABLES = {
  blocs:           { key: 'blocs',      conflict: 'user_id,id' },
  courses:         { key: 'courses' },
  settings:        { key: null,         conflict: 'user_id', single: true },
  study_log:       { key: 'log' },
  projects:        { key: 'projects',   v2: true },
  milestones:      { key: 'milestones', v2: true },
  project_courses: { key: 'plinks',     v2: true, pk: ['project_id', 'course_id'] },
  work_hours:      { key: 'work',       v2: true },
  modules:         { key: 'modules',    v2: true }
};
/** Clé d'identité d'une ligne : l'id, ou la clé composite pour project_courses. */
const keyOf = (table, row) => {
  const pk = TABLES[table] && TABLES[table].pk;
  return pk ? pk.map(k => row[k]).join('|') : row.id;
};
/* Onglet → sections affichées. « Réglages » en regroupe deux. */
const TAB_SECTIONS = { week: ['week'], projects: ['projects'], list: ['list'],
                       dash: ['dash'], grades: ['grades'], settings: ['blocs', 'data'] };
/* Renderers, complétés par app-v2.js */
const RENDERERS = {};
let v2Ready = false;   // la migration v2 est-elle passée côté base ?

/* ── 1. utilitaires ──────────────────────────────────────────────────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const nowISO = () => new Date().toISOString();
const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    }));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
function lsGet(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

/* ── 2. langue ───────────────────────────────────────────────────────────── */
let lang = 'fr';
function detectLang() {
  const saved = lsGet(LANG_KEY, null);
  if (saved && I18N.meta[saved]) return saved;
  const prefs = (navigator.languages && navigator.languages.length ? navigator.languages
                : [navigator.language || 'fr']).map(x => String(x).slice(0, 2).toLowerCase());
  return prefs.find(x => I18N.meta[x]) || 'fr';
}
function t(key, vars) {
  const tbl = I18N.ui[lang] || I18N.ui.fr;
  let s = tbl[key] ?? I18N.ui.fr[key] ?? key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
/** Variante singulier / pluriel : t1n('list.count', n, {…}) → list.count1 ou list.countN */
function t1n(key, n, vars) { return t(key + (Number(n) === 1 ? '1' : 'N'), { ...vars, n }); }
const locale = () => (I18N.meta[lang] || I18N.meta.fr).locale;

const fmtH = h => (Math.round(h * 10) / 10).toLocaleString(locale()) + ' h';
const fmtN = n => Number(n).toLocaleString(locale());
const fmtD = d => d ? new Date(d).toLocaleDateString(locale(), { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/** Nom / sous-titre d'un bloc : traduit tant que l'utilisateur ne l'a pas renommé. */
function blocText(b, i) {
  const seed = (window.SEED.blocs || []).find(x => x.id === b.id);
  const tr = (I18N.blocs[lang] || I18N.blocs.fr)[b.id];
  const own = i === 0 ? b.name : b.subtitle;
  const seedVal = seed ? (i === 0 ? seed.name : seed.subtitle) : null;
  if (tr && seedVal && own === seedVal) return tr[i];          // jamais renommé → traduction
  return own || (tr ? tr[i] : '') || '';
}
const blocName = b => blocText(b, 0);
const blocSub  = b => blocText(b, 1);
const flagLabel = f => f ? ((I18N.flags[lang] || I18N.flags.fr)[f] || f) : '';

let toastT;
function toast(msg, ms = 2600) {
  const el = $('#toast');
  el.innerHTML = `<div class="toast">${esc(msg)}</div>`;
  clearTimeout(toastT); toastT = setTimeout(() => el.innerHTML = '', ms);
}

/* ── 3. cache local & file d'attente ─────────────────────────────────────── */
/* Le cache pèse ~90 Ko : on regroupe les écritures au lieu d'en faire une par
   ligne modifiée, sinon l'amorçage sérialise 50 fois le même objet. */
let cacheT = null;
function saveCacheNow() {
  cacheT = null;
  lsSet(cacheKey(), { blocs: state.blocs, courses: state.courses, settings: state.settings,
    log: state.log.slice(-400), projects: state.projects, milestones: state.milestones,
    plinks: state.plinks, work: state.work, modules: state.modules });
}
function saveCache() { if (cacheT === null) cacheT = setTimeout(saveCacheNow, 120); }
addEventListener('pagehide', () => { if (cacheT !== null) saveCacheNow(); });
addEventListener('visibilitychange', () => { if (document.hidden && cacheT !== null) saveCacheNow(); });
/** Vide toutes les données locales (état, cache, file d'attente). */
function resetLocal() {
  ['blocs', 'courses', 'log', 'projects', 'milestones', 'plinks', 'work', 'modules']
    .forEach(k => state[k] = []);
  state.settings = null;
  lsSet(outboxKey(), []);
  saveCacheNow();
}
/** Rattache les données locales au compte connecté. Un cache laissé par un
 *  autre compte n'est pas réutilisable : ses identifiants lui appartiennent
 *  déjà en base, et la RLS rejetterait toute réécriture. */
function adoptOwner(uid) {
  if (owner === uid) return;
  const prev = lsGet(OWNER_KEY, null);
  owner = uid;
  if (lsGet(cacheKey(), null)) loadCache();              // cache propre à ce compte
  else if (!prev || prev === uid) {                       // cache global hérité : on l'adopte
    const g = lsGet(CACHE_KEY, null), q = lsGet(OUTBOX_KEY, []);
    if (g) lsSet(cacheKey(), g);
    if (q.length) lsSet(outboxKey(), q);
    loadCache();
  } else resetLocal();                                    // cache d'un autre compte
  lsSet(OWNER_KEY, uid);
  try { localStorage.removeItem(CACHE_KEY); localStorage.removeItem(OUTBOX_KEY); } catch {}
}
function loadCache() {
  const c = lsGet(cacheKey(), null);
  if (!c) return false;
  ['blocs', 'courses', 'log', 'projects', 'milestones', 'plinks', 'work', 'modules']
    .forEach(k => state[k] = c[k] || []);
  state.settings = c.settings || null;
  return state.courses.length > 0;
}
const outbox = () => lsGet(outboxKey(), []);
function enqueue(op) { const q = outbox(); q.push({ ...op, _id: uuid(), _ts: nowISO() }); lsSet(outboxKey(), q); paintSync(); }
function dequeue(id) { lsSet(outboxKey(), outbox().filter(o => o._id !== id)); paintSync(); }

/* ── 4. indicateur de synchronisation ────────────────────────────────────── */
let syncState = 'ok', lastError = '';
function paintSync() {
  const n = outbox().length, el = $('#sync'), txt = $('#syncTxt');
  if (!el) return;
  el.className = 'sync';
  if (syncState === 'busy') { el.classList.add('busy'); txt.textContent = t('sync.busy'); return; }
  if (!navigator.onLine || syncState === 'off') {
    el.classList.add('off');
    txt.textContent = n ? t1n('sync.offline', n) : t('sync.offline');
    return;
  }
  if (syncState === 'err') {
    el.classList.add('err');
    txt.textContent = n ? t('sync.errN', { n: fmtN(n) }) : t('sync.err');
    el.title = lastError || '';
    return;
  }
  txt.textContent = n ? t('sync.pendingN', { n: fmtN(n) }) : t('sync.ok');
  if (n) el.classList.add('off');
}

/* ── 5. écritures (optimistes + file) ────────────────────────────────────── */
function localApply(table, row) {
  const def = TABLES[table]; if (!def) return;
  if (def.single) { state.settings = { ...state.settings, ...row }; saveCache(); return; }
  const arr = state[def.key]; if (!arr) return;
  const k = keyOf(table, row);
  const i = arr.findIndex(x => keyOf(table, x) === k);
  if (i >= 0) arr[i] = { ...arr[i], ...row }; else arr.push(row);
  saveCache();
}
function localRemove(table, match) {
  const def = TABLES[table]; if (!def || !state[def.key]) return;
  state[def.key] = state[def.key].filter(x => !Object.keys(match).every(k => x[k] === match[k]));
  saveCache();
}

/** Ligne complète depuis l'état local, après application du correctif.
 *  Indispensable : PostgREST fait un INSERT ... ON CONFLICT, et PostgreSQL
 *  vérifie les contraintes NOT NULL sur le tuple proposé AVANT de détecter le
 *  conflit. Envoyer un correctif partiel fait donc échouer la mise à jour avec
 *  « null value in column "title" violates not-null constraint ». */
function fullRow(table, patch) {
  const def = TABLES[table]; if (!def) return patch;
  if (def.single) return { ...state.settings };
  const arr = state[def.key]; if (!arr) return patch;
  const k = keyOf(table, patch);
  return arr.find(x => keyOf(table, x) === k) || patch;
}
/** Colonnes ajoutées par la migration v2 : à ne pas envoyer si elle n'a pas été passée. */
const V2_SETTINGS_COLS = ['wahl_mode', 'ma_start'];

function write(table, row, opts = {}) {
  row.updated_at = nowISO();
  localApply(table, row);
  const out = { ...fullRow(table, row) };
  if (table === 'settings' && !v2Ready) V2_SETTINGS_COLS.forEach(c => delete out[c]);
  enqueue({ table, row: out });
  if (!opts.silent) render();
  flush();
}
/** Suppression réelle (project_courses n'a pas de colonne « deleted »). */
function remove(table, match, opts = {}) {
  localRemove(table, match);
  enqueue({ table, del: match });
  if (!opts.silent) render();
  flush();
}

/* Une ligne dont l'identifiant appartient déjà à un autre compte fait échouer
   l'upsert : PostgreSQL vérifie la clause USING de la RLS sur la ligne
   existante, qui n'est pas la nôtre. On réattribue alors un identifiant neuf. */
const RLS_RE = /row-level security|42501/i;
/** Lignes filles à réaligner quand une ligne mère change d'identifiant. */
const CHILD_FK = {
  projects: [['milestones', 'project_id'], ['work_hours', 'project_id'], ['project_courses', 'project_id']],
  courses:  [['project_courses', 'course_id'], ['study_log', 'course_id']],
  blocs:    [['courses', 'bloc_id']]
};
let rekeyBudget = 40;
function rekey(table, oldId) {
  const def = TABLES[table];
  if (!def || !def.key || def.single || !oldId) return null;
  const nid = uuid();
  let changed = false;
  const row = (state[def.key] || []).find(x => x.id === oldId);
  if (row) { row.id = nid; changed = true; }
  (CHILD_FK[table] || []).forEach(([ct, col]) => {
    const cd = TABLES[ct], arr = cd && state[cd.key];
    if (arr) arr.forEach(c => { if (c[col] === oldId) { c[col] = nid; changed = true; } });
  });
  if (!changed) return null;
  const cols = o => {
    const out = o.table === table ? ['id'] : [];
    (CHILD_FK[table] || []).forEach(([ct, col]) => { if (ct === o.table) out.push(col); });
    return out;
  };
  lsSet(outboxKey(), outbox().map(o => {
    const cs = cols(o); if (!cs.length) return o;
    const fix = r => { const x = { ...r }; cs.forEach(c => { if (x[c] === oldId) x[c] = nid; }); return x; };
    if (o.del)  return { ...o, del:  fix(o.del) };
    if (o.rows) return { ...o, rows: o.rows.map(fix) };
    if (o.row)  return { ...o, row:  fix(o.row) };
    return o;
  }));
  saveCacheNow();
  return nid;
}

/** Après un envoi réussi : ces lignes existent désormais en base. Si elles en
 *  disparaissent plus tard, c'est qu'un autre appareil les a supprimées. */
function markSynced(table, rows) {
  const def = TABLES[table]; if (!def) return;
  if (def.single) { if (state.settings) state.settings._s = 1; saveCache(); return; }
  const arr = state[def.key]; if (!arr) return;
  const keys = new Set(rows.map(r => keyOf(table, r)));
  arr.forEach(x => { if (keys.has(keyOf(table, x))) x._s = 1; });
  saveCache();
}

async function flush() {
  if (!sb || !user || !navigator.onLine) { paintSync(); return; }
  const q = outbox();
  if (!q.length) { syncState = 'ok'; paintSync(); return; }
  syncState = 'busy'; paintSync();
  for (const op of q) {
    try {
      const def = TABLES[op.table] || {};
      if (op.del) {
        const { error } = await sb.from(op.table).delete().match({ ...op.del, user_id: user.id });
        if (error) throw error;
        dequeue(op._id); continue;
      }
      const rows = (op.rows || [op.row]).map(r => {
        const x = { ...r, user_id: user.id };
        delete x.updated_at;                       // laissé au trigger serveur
        Object.keys(x).forEach(k => { if (k[0] === '_') delete x[k]; });   // champs purement locaux
        return x;
      });
      const conflict = { onConflict: def.conflict || (def.pk ? def.pk.join(',') : 'id') };
      const { error } = await sb.from(op.table).upsert(rows, conflict);
      if (error) throw error;
      markSynced(op.table, rows);
      dequeue(op._id);
    } catch (e) {
      // Table v2 absente : la migration n'a pas été passée, on n'insiste pas.
      if (TABLES[op.table] && TABLES[op.table].v2 && /does not exist|schema cache|PGRST205/i.test(e.message || '')) {
        console.warn('table v2 absente, opération abandonnée :', op.table);
        dequeue(op._id); v2Ready = false; continue;
      }
      const emsg = (e && (e.message || e.details || e.hint)) || String(e);
      // Identifiant déjà pris par un autre compte : on en attribue un neuf et on réessaie.
      const isRls = RLS_RE.test(emsg) || (e && e.code === '42501');
      // Deux essais par opération : au-delà, ce n'est pas une collision
      // d'identifiant mais une politique réellement en défaut — on remonte l'erreur.
      if (!op.del && isRls && rekeyBudget > 0 && (op._rk || 0) < 2) {
        // Un refus RLS peut aussi venir d'une session expirée : dans ce cas
        // auth.uid() est vide et TOUTES les lignes sont refusées. Changer leurs
        // identifiants créerait des doublons. On ne réattribue donc que si la
        // session est bien la nôtre et que la ligne est invisible pour nous.
        const { data: sd } = await sb.auth.getSession();
        if (!sd || !sd.session || sd.session.user.id !== user.id) {
          lastError = t('sync.session'); syncState = 'err'; paintSync(); return;
        }
        let done = false;
        for (const r of (op.rows || [op.row])) {
          if (!r) continue;
          const tb = r.id ? op.table : 'projects', rid = r.id || r.project_id;
          if (!rid) continue;
          const vis = await sb.from(tb).select('id').eq('id', rid);
          if ((vis.data || []).some(x => x.id === rid)) continue;   // la ligne est à nous : pas une collision
          done = !!rekey(tb, rid) || done;
        }
        if (done) {
          rekeyBudget--;
          lsSet(outboxKey(), outbox().map(o => o._id === op._id ? { ...o, _rk: (o._rk || 0) + 1 } : o));
          console.warn('identifiant repris par un autre compte, réattribué :', op.table);
          return flush();
        }
      }
      console.warn('flush', op.table, e);
      if (!navigator.onLine || /failed to fetch|networkerror|load failed|network:/i.test(emsg)) {
        syncState = 'off'; paintSync(); return;          // coupure : on réessaiera au retour du réseau
      }
      lastError = emsg;
      syncState = 'err'; paintSync(); return;
    }
  }
  syncState = 'ok'; lastError = ''; paintSync();
}

/* ── 6. fusion : le serveur fait foi ─────────────────────────────────────
   Chaque appareil garde une copie locale. Au chargement, cette copie est
   REMPLACÉE par le contenu du serveur, à une exception près : les lignes
   encore dans la file d'attente, qui n'y sont pas encore arrivées.
   L'ancienne règle gardait tout ce qui était local : une suppression faite
   sur le PC ne quittait jamais le téléphone, une ligne jamais envoyée restait
   invisible des autres appareils. Trois appareils divergeaient sans jamais
   se rejoindre.
   Une ligne locale absente du serveur n'est pas jetée à l'aveugle :
   · déjà passée par le serveur (`_s`) → elle a été supprimée ailleurs, on la retire ;
   · jamais envoyée → elle est mise de côté (« orphelin ») et Réglages propose
     de la renvoyer ou de l'abandonner. Rien ne se perd sans ton accord. */
const NATKEY = {                       // identité « naturelle », la même que dedupe()
  projects: r => r.code,
  courses: r => (r.num != null ? 'n' + r.num : null),
  milestones: r => r.project_id + '|' + r.title,
  modules: r => r.code
};
function pendingSets(table) {
  const up = new Set(), del = new Set();
  outbox().forEach(o => {
    if (o.table !== table) return;
    if (o.del) del.add(keyOf(table, o.del));
    else (o.rows || (o.row ? [o.row] : [])).forEach(r => up.add(keyOf(table, r)));
  });
  return { up, del };
}
const orphans = () => lsGet(orphanKey(), {});
function keepOrphans(table, rows) {
  const all = orphans(), cur = new Map((all[table] || []).map(r => [keyOf(table, r), r]));
  rows.forEach(r => cur.set(keyOf(table, r), r));
  all[table] = [...cur.values()];
  lsSet(orphanKey(), all);
}
const NUM_COLS = ['cp', 'grade', 'hours', 'progress_pct', 'weekly_hours', 'practice_factor',
  'contract_hours', 'hourly_rate', 'minutes', 'sort_order', 'num', 'priority'];
function numify(r) {
  const x = { ...r };
  NUM_COLS.forEach(k => { if (typeof x[k] === 'string' && x[k] !== '' && !isNaN(x[k])) x[k] = +x[k]; });
  return x;
}
function merge(localArr, serverArr, table = 'courses', track = true) {
  const { up, del } = pendingSets(table);
  const out = new Map();
  serverArr.forEach(s => { const k = keyOf(table, s); if (!del.has(k)) out.set(k, { ...numify(s), _s: 1 }); });
  const nat = NATKEY[table], natSeen = nat ? new Set(serverArr.map(nat).filter(x => x != null)) : null;
  const lost = [];
  localArr.forEach(l => {
    const k = keyOf(table, l);
    if (up.has(k)) { out.set(k, l); return; }             // pas encore envoyée : elle reste
    if (out.has(k) || del.has(k) || l._s || l.deleted) return;
    if (natSeen && nat(l) != null && natSeen.has(nat(l))) return;   // copie d'une ligne déjà en base
    lost.push(l);
  });
  if (track && lost.length) keepOrphans(table, lost);
  return [...out.values()];
}

/* ── 7. chargement depuis Supabase ───────────────────────────────────────── */
let lastPullAt = 0;
async function pull() {
  if (!sb || !user || !navigator.onLine) return false;
  syncState = 'busy'; paintSync();
  const v2 = Object.keys(TABLES).filter(t => TABLES[t].v2);
  let ok = true;
  try {
    const [b, c, s, l] = await Promise.all([
      sb.from('blocs').select('*'),
      sb.from('courses').select('*'),
      sb.from('settings').select('*').maybeSingle(),
      sb.from('study_log').select('*').order('day', { ascending: false }).limit(400)
    ]);
    const err = b.error || c.error || l.error || s.error;
    if (err) throw err;
    state.blocs   = merge(state.blocs,   b.data || [], 'blocs');
    state.courses = merge(state.courses, c.data || [], 'courses');
    state.log     = merge(state.log,     l.data || [], 'study_log', false);
    const settingsPending = outbox().some(o => o.table === 'settings');
    if (s.data && !settingsPending) state.settings = { ...numify(s.data), _s: 1 };
  } catch (e) {
    console.warn('pull', e); lastError = (e && e.message) || String(e);
    syncState = 'err'; paintSync(); return false;
  }

  // Tables v2 : une table absente = migration pas passée ; une autre erreur = réseau.
  const res = await Promise.all(v2.map(t => sb.from(t).select('*').then(r => r, e => ({ error: e }))));
  let missing = false;
  res.forEach((r, i) => {
    const t = v2[i], key = TABLES[t].key;
    if (r.error) {
      if (/does not exist|schema cache|PGRST205|42P01/i.test(r.error.message || '')) missing = true;
      else ok = false;
      return;
    }
    state[key] = merge(state[key], r.data || [], t);
  });
  if (missing) v2Ready = false; else if (ok) v2Ready = true;
  if (ok) { lastPullAt = Date.now(); syncState = 'ok'; if (!outbox().length) lastError = ''; }
  saveCache(); paintSync(); render();
  return ok;
}

/* ── 7 bis. « la base a-t-elle changé ? » ─────────────────────────────────
   Plutôt que de retélécharger ~100 Ko toutes les 90 s, on demande à chaque
   table deux nombres : combien de lignes, et la date de la plus récente.
   Une modification change la date, une suppression change le compte. Si
   l'empreinte n'a pas bougé depuis le dernier téléchargement, on s'arrête là ;
   sinon on télécharge tout. Neuf requêtes d'une ligne chacune. */
const STAMP_COL = { study_log: 'created_at' };
let lastFingerprint = null, lastCheckAt = 0;
async function remoteFingerprint() {
  const tables = Object.keys(TABLES).filter(t => !TABLES[t].v2 || v2Ready);
  const parts = await Promise.all(tables.map(async t => {
    const col = STAMP_COL[t] || 'updated_at';
    const r = await sb.from(t).select(col, { count: 'exact' }).order(col, { ascending: false }).limit(1);
    if (r.error) throw r.error;
    const rows = r.data || [];
    const max = rows.reduce((m, x) => (x[col] > m ? x[col] : m), '');
    return t + ':' + (r.count ?? rows.length) + ':' + max;
  }));
  return parts.join('|');
}

/** Envoie ce qui attend, puis télécharge seulement si la base a changé.
 *  Appelée au retour du réseau, au retour sur l'application, et toutes les 90 s. */
let syncing = null, lastSyncTry = 0;
function syncNow(force = false) {
  if (!sb || !user || !navigator.onLine) return Promise.resolve(false);
  if (syncing) return syncing;
  if (!force && Date.now() - lastSyncTry < 8000) return Promise.resolve(false);
  lastSyncTry = Date.now();
  syncing = (async () => {
    try {
      if (outbox().length) await flush();
      let fp = null;
      try { fp = await remoteFingerprint(); lastCheckAt = Date.now(); }
      catch (e) { console.warn('empreinte', e); }
      // Filet de sécurité : même si l'empreinte n'a pas bougé, on retélécharge
      // tout au moins toutes les 10 minutes (au cas où un trigger updated_at
      // manquerait côté base, l'empreinte ne verrait pas une modification).
      const fresh = Date.now() - lastPullAt < 10 * 60 * 1000;
      if (!force && fp && fp === lastFingerprint && fresh) { if (!outbox().length) syncState = 'ok'; paintSync(); return false; }
      const ok = await pull();
      if (ok) {
        // l'empreinte est reprise APRÈS le téléchargement : elle décrit ce qu'on vient de lire
        try { lastFingerprint = await remoteFingerprint(); lastCheckAt = Date.now(); } catch { lastFingerprint = fp; }
      }
      return ok;
    } finally { syncing = null; }
  })();
  return syncing;
}

/** Renvoie au serveur les lignes mises de côté. Seulement celles qui manquent
 *  vraiment : une ligne dont l'équivalent est déjà en base (même code, même
 *  numéro…) ou dont le parent n'existe plus est laissée de côté. */
function restoreOrphans() {
  const o = orphans(); let n = 0;
  const has = (key, r) => { const f = NATKEY[key]; return f && f(r) != null &&
    (state[TABLES[key].key] || []).some(x => !x.deleted && f(x) === f(r)); };
  ['blocs', 'courses', 'projects', 'milestones', 'work_hours', 'project_courses', 'modules', 'study_log']
    .forEach(t => (o[t] || []).forEach(r => {
      if (has(t, r)) return;
      if (r.project_id && !state.projects.some(p => p.id === r.project_id)) return;
      if (r.course_id && !state.courses.some(c => c.id === r.course_id)) return;
      if (t === 'courses' && r.bloc_id && !state.blocs.some(b => b.id === r.bloc_id)) return;
      const row = { ...r }; delete row._s;
      write(t, row, { silent: true }); n++;
    }));
  lsSet(orphanKey(), {});
  render();
  return n;
}

/* ── 8. données initiales & migration ────────────────────────────────────── */
async function seedIfEmpty() {
  if (state.courses.length) return false;
  const S = window.SEED;
  state.blocs = S.blocs.map(b => ({ ...b, user_id: user.id, updated_at: nowISO() }));
  state.courses = S.courses.map(c => ({
    id: uuid(), user_id: user.id, num: c.num, title: c.title, bloc_id: c.bloc,
    hours: c.hours, hours_verified: c.hours_verified, url: c.url, objective: c.objective,
    skills: c.skills || [], why: c.why, flag: c.flag,
    status: 'a_faire', progress_pct: 0, started_at: null, completed_at: null,
    notes: null, sort_order: c.sort_order, deleted: false, updated_at: nowISO()
  }));
  state.settings = { user_id: user.id, ...S.settings, updated_at: nowISO() };
  saveCache();
  enqueue({ table: 'blocs', rows: state.blocs });
  for (let i = 0; i < state.courses.length; i += 40)
    enqueue({ table: 'courses', rows: state.courses.slice(i, i + 40) });
  enqueue({ table: 'settings', row: state.settings });
  await flush();
  if (window.seedV2) window.seedV2();
  await flush();
  return true;
}

function legacyIds() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY); if (!raw) return null;
    const v = JSON.parse(raw);
    const arr = Array.isArray(v) ? v : (Array.isArray(v?.done) ? v.done : null);
    return arr && arr.length ? arr : null;
  } catch { return null; }
}
function maybeMigrate() {
  if (lsGet(MIGR_KEY, false)) return;
  const ids = legacyIds(); if (!ids) { lsSet(MIGR_KEY, true); return; }
  openSheet(`
    <h3>${esc(t('migr.title'))}</h3>
    <p class="sub" style="margin:10px 0 0">${t('migr.text', {
      n: fmtN(ids.length), k: `<span class="mono">${esc(LEGACY_KEY)}</span>` })}</p>
    <div class="hr"></div>
    <div class="row"><button class="btn pri" id="mYes">${esc(t('migr.yes'))}</button>
    <button class="btn" id="mNo">${esc(t('migr.no'))}</button></div>`, sheet => {
    $('#mNo', sheet).onclick = () => { lsSet(MIGR_KEY, true); closeSheet(); };
    $('#mYes', sheet).onclick = () => {
      let n = 0;
      ids.forEach(id => {
        const m = String(id).match(/^b\d+-(\d+)$/); if (!m) return;
        const c = state.courses.find(x => x.num === +m[1] && !x.deleted);
        if (c && c.status !== 'termine') {
          write('courses', { id: c.id, status: 'termine', progress_pct: 100,
            completed_at: new Date().toISOString().slice(0, 10) }, { silent: true });
          n++;
        }
      });
      lsSet(MIGR_KEY, true); closeSheet(); render(); toast(t('migr.done', { n: fmtN(n) }));
    };
  });
}

/* ── 9. calculs ──────────────────────────────────────────────────────────── */
const blocOf = id => state.blocs.find(b => b.id === id) || { id, name: id, color: '#666', priority: 99, subtitle: '' };
const alive  = () => state.courses.filter(c => !c.deleted);
const isFocus = c => FOCUS_BLOCS.includes(c.bloc_id) && !SOFT_FLAGS.includes(c.flag);
const scoped = () => ui.scope === 'focus' ? alive().filter(isFocus) : alive();

const frac = c => c.status === 'termine' ? 1 : c.status === 'en_cours' ? clamp(c.progress_pct, 0, 100) / 100 : 0;
function stats(list) {
  const total = list.reduce((s, c) => s + (+c.hours || 0), 0);
  const done  = list.reduce((s, c) => s + (+c.hours || 0) * frac(c), 0);
  return { total, done, left: Math.max(0, total - done), pct: total ? done / total * 100 : 0,
           fin: list.filter(c => c.status === 'termine').length,
           run: list.filter(c => c.status === 'en_cours').length, n: list.length };
}
function weekMinutes() {
  const d = new Date(), day = (d.getDay() + 6) % 7;
  const mon = new Date(d); mon.setHours(0, 0, 0, 0); mon.setDate(d.getDate() - day);
  return state.log.filter(l => new Date(l.day + 'T00:00:00') >= mon).reduce((s, l) => s + (+l.minutes || 0), 0);
}
function endDate(leftHours) {
  const w = +(state.settings?.weekly_hours || 8), f = +(state.settings?.practice_factor || 1.8);
  if (w <= 0) return { weeks: Infinity, date: null };
  const weeks = leftHours * f / w;
  const d = new Date(); d.setDate(d.getDate() + Math.ceil(weeks * 7));
  return { weeks, date: d };
}

/* ── 10. rendu : tableau de bord ─────────────────────────────────────────── */
function renderDash() {
  const list = scoped(), st = stats(list), e = endDate(st.left), wm = weekMinutes();
  const w = +(state.settings?.weekly_hours || 8), f = +(state.settings?.practice_factor || 1.8);
  const verified = alive().filter(c => c.hours_verified).length;

  const blocCards = [...state.blocs].sort((a, b) => a.priority - b.priority).map(b => {
    const l = list.filter(c => c.bloc_id === b.id); if (!l.length) return '';
    const s = stats(l);
    return `<div class="blocrow">
      <div class="t"><span class="chip" style="background:${esc(b.color)}"></span><b>${esc(blocName(b))}</b>
        <span class="pc">${fmtN(s.pct.toFixed(0))} %</span></div>
      <div class="bar"><i style="width:${s.pct}%;background:${esc(b.color)}"></i></div>
      <div class="sub">${t('dash.blocLine', { done: fmtN(s.fin), n: fmtN(s.n), h: fmtH(s.done), total: fmtH(s.total) })}${
        s.run ? t('dash.blocRun', { n: fmtN(s.run) }) : ''}</div>
    </div>`;
  }).join('');

  $('#tab-dash').innerHTML = `
  <div class="dash">
  <div class="card wide">
    <div class="row" style="justify-content:space-between;margin-bottom:12px">
      <h2 style="margin:0">${esc(t('dash.progress'))}</h2>
      <div class="seg">
        <button data-scope="focus" class="${ui.scope === 'focus' ? 'on' : ''}">${esc(t('dash.focus'))}</button>
        <button data-scope="all" class="${ui.scope === 'all' ? 'on' : ''}">${esc(t('dash.all'))}</button>
      </div>
    </div>
    <div class="kpis">
      <div class="kpi hero"><div class="v">${fmtN(st.pct.toFixed(1))} %</div>
        <div class="l">${esc(t('dash.advance'))}</div><div class="s">${esc(t('dash.weighted'))}</div></div>
      <div class="kpi"><div class="v">${fmtH(st.done)}</div>
        <div class="l">${esc(t('dash.hoursDone'))}</div><div class="s">${esc(t('dash.outOf', { h: fmtH(st.total) }))}</div></div>
      <div class="kpi"><div class="v">${fmtN(st.fin)}/${fmtN(st.n)}</div>
        <div class="l">${esc(t('dash.modules'))}</div><div class="s">${esc(t('dash.running', { n: fmtN(st.run) }))}</div></div>
      <div class="kpi"><div class="v">${fmtH(wm / 60)}</div>
        <div class="l">${esc(t('dash.week'))}</div><div class="s">${esc(t('dash.weekMin', { n: fmtN(wm) }))}</div></div>
    </div>
    <div class="bar" style="margin-top:14px;height:9px"><i style="width:${st.pct}%;background:linear-gradient(90deg,#ffb020,#ffd27a)"></i></div>
  </div>

  <div class="card">
    <h2>${esc(t('dash.end'))}</h2>
    <div class="kpis">
      <div class="kpi hero"><div class="v" style="font-size:24px">${e.date ? esc(fmtD(e.date)) : '—'}</div>
        <div class="l">${esc(t('dash.endWhen'))}</div>
        <div class="s">${esc(isFinite(e.weeks) ? t1n('dash.weeksLeft', Math.ceil(e.weeks), { n: fmtN(Math.ceil(e.weeks)) }) : t('dash.setRhythm'))}</div></div>
      <div class="kpi"><div class="v">${fmtH(st.left)}</div>
        <div class="l">${esc(t('dash.videoLeft'))}</div>
        <div class="s">${esc(t('dash.withPractice', { h: fmtH(st.left * f) }))}</div></div>
    </div>
    <div class="row" style="margin-top:14px">
      <div style="flex:1;min-width:150px"><label class="f">${esc(t('dash.weekly'))}</label>
        <input type="number" id="setW" value="${w}" min="1" max="60" step="0.5"></div>
      <div style="flex:1;min-width:150px"><label class="f">${esc(t('dash.factor'))}</label>
        <input type="number" id="setF" value="${f}" min="1" max="4" step="0.1"></div>
    </div>
    <div class="sub">${esc(t('dash.formula', { f: fmtN(f) }))}</div>
  </div>

  <div class="card tall"><h2>${esc(t('dash.perBloc'))}</h2>
    ${blocCards || `<div class="empty">${esc(t('dash.noCourse'))}</div>`}</div>

  <div class="card wide">
    <h2>${esc(t('dash.reliab'))}</h2>
    <div class="sub" style="margin:0">${t('dash.reliabTxt', {
      v: fmtN(verified), e: fmtN(alive().length - verified),
      tag: `<span class="tag est mono">${esc(t('tag.estimated'))}</span>` })}</div>
  </div>
  </div>`;

  $$('#tab-dash [data-scope]').forEach(b => b.onclick = () => { ui.scope = b.dataset.scope; saveUI(); render(); });
  const push = () => write('settings', { user_id: user.id,
    weekly_hours: +$('#setW').value || 8, practice_factor: +$('#setF').value || 1.8 });
  $('#setW').onchange = push; $('#setF').onchange = push;
}

/* ── 11. rendu : liste des cours ─────────────────────────────────────────── */
function filtered() {
  const q = ui.q.trim().toLowerCase(), qn = q.replace(/^#/, '');
  return alive().filter(c =>
    (ui.bloc === 'all' || c.bloc_id === ui.bloc) &&
    (ui.status === 'all' || c.status === ui.status) &&
    (ui.flag === 'all' || (ui.flag === 'none' ? !c.flag : c.flag === ui.flag)) &&
    (!q || (c.title || '').toLowerCase().includes(q) || (c.objective || '').toLowerCase().includes(q)
        || (c.skills || []).join(' ').toLowerCase().includes(q)
        || (/^\d+$/.test(qn) && String(c.num) === qn)
        || blocName(blocOf(c.bloc_id)).toLowerCase().includes(q))
  );
}
/* Blocs repliés par défaut : ce qui sort du parcours technique. L'état est
   propre à chaque appareil (préférence d'affichage, pas une donnée). */
const FOLD_DEFAULT = { b9: true, b10: true };
const SORTS = ['prio', 'left', 'progress', 'recent'];
const isFolded = id => !!(ui.fold || FOLD_DEFAULT)[id] && !ui.q.trim() && ui.bloc !== id;
const filtersOn = () => !!ui.q.trim() || ui.bloc !== 'all' || ui.flag !== 'all' || ui.status !== 'all' || ui.sort !== 'prio';
function toggleFold(id) {
  ui.fold = { ...(ui.fold || FOLD_DEFAULT) };
  ui.fold[id] = !ui.fold[id]; saveUI(); renderList();
}
/** Cours commencés mais pas finis : le plus récemment touché d'abord. */
const byRecent = (a, b) => String(b.updated_at || b.started_at || '').localeCompare(String(a.updated_at || a.started_at || ''));
const doingNow = list => list.filter(c => c.status === 'en_cours').sort(byRecent);
const hoursLeft = l => l.reduce((s, c) => s + (+c.hours || 0) * (1 - (+c.progress_pct || 0) / 100), 0);

function courseRow(c, opts = {}) {
  const b = blocOf(c.bloc_id);
  const mark = c.status === 'termine' ? '✓' : c.status === 'en_cours' ? '◐' : '';
  const cls  = c.status === 'termine' ? 'd' : c.status === 'en_cours' ? 'p' : '';
  return `<div class="c ${c.status === 'termine' ? 'done' : ''}" data-id="${c.id}">
    <button class="tri ${cls}" data-act="cycle" title="${esc(t('a11y.cycle'))}">${mark}</button>
    <div class="main">
      <div class="ttl" data-act="open">${esc(c.title)}</div>
      <div class="meta">
        <span class="tag mono">${fmtH(+c.hours || 0)}</span>
        <span class="tag ${c.hours_verified ? 'ver' : 'est'} mono">${esc(c.hours_verified ? t('tag.verified') : t('tag.estimated'))}</span>
        ${c.flag ? `<span class="tag fl">${esc(flagLabel(c.flag))}</span>` : ''}
        ${c.num ? `<span style="color:var(--txt-3)">#${c.num}</span>` : ''}
        ${opts.showBloc ? `<span class="tag blocTag" title="${esc(blocName(b))}"><span class="chip" style="background:${esc(b.color)}"></span>${esc(blocName(b).split(' — ')[0])}</span>` : ''}
      </div>
      ${c.status === 'en_cours' ? `<div class="bar mini"><i style="width:${c.progress_pct}%;background:${esc(b.color)}"></i></div>` : ''}
    </div>
    ${c.status === 'en_cours' ? `<div class="pct">${c.progress_pct}%</div>` : ''}
  </div>`;
}
function renderList() {
  const list = filtered();
  if (!SORTS.includes(ui.sort)) ui.sort = 'prio';
  // Les cours en cours passent en tête, dans une section à part, et ne sont
  // pas répétés plus bas (même quand leur bloc est replié).
  const doing = doingNow(list);
  const pinned = doing.length ? `<div class="bloc-h pin"><span class="chip" style="background:var(--amber)"></span>
      <b>${esc(t('list.pinned'))}</b><span class="n">${esc(t1n('list.pinnedSub', doing.length, { n: fmtN(doing.length), h: fmtH(hoursLeft(doing)) }))}</span></div>
      <div class="clist pinned">${doing.map(c => courseRow(c, { showBloc: true })).join('')}</div>` : '';
  const rest = list.filter(c => c.status !== 'en_cours');
  const blocs = [...state.blocs].sort((a, b) => a.priority - b.priority);
  const prio = Object.fromEntries(blocs.map((b, i) => [b.id, i]));
  let body;

  if (ui.sort === 'prio') {
    const byBloc = {};
    rest.forEach(c => (byBloc[c.bloc_id] ||= []).push(c));
    body = pinned + blocs.map(b => {
      const l = (byBloc[b.id] || []).sort((x, y) => (x.sort_order - y.sort_order) || (x.num - y.num));
      if (!l.length) return '';
      const s = stats(l), fold = isFolded(b.id);
      const canFold = !ui.q.trim() && ui.bloc !== b.id;
      return `<div class="bloc-h${fold ? ' folded' : ''}"><span class="chip" style="background:${esc(b.color)}"></span>
        <b>${esc(blocName(b))}</b><span class="n">${fmtN(s.fin)}/${fmtN(s.n)} · ${fmtH(s.total)}</span>
        ${canFold ? `<button class="fold" data-fold="${esc(b.id)}" aria-expanded="${!fold}"
          title="${esc(t(fold ? 'list.unfold' : 'list.fold'))}">${fold ? '▸' : '▾'}</button>` : ''}</div>
        ${fold
          ? `<div class="sub folded-note" data-fold="${esc(b.id)}">${esc(t1n('list.folded', l.length, { n: fmtN(l.length) }))} — ${esc(t('list.unfold'))}</div>`
          : `<div class="sub" style="margin:-4px 0 10px">${esc(blocSub(b))}</div>
             <div class="clist">${l.map(c => courseRow(c)).join('')}</div>`}`;
    }).join('');
  } else {
    // Liste à plat : utile pour « ce que je peux finir vite » ou « où j'en étais ».
    const shown = rest.filter(c => !isFolded(c.bloc_id));
    const hidden = rest.length - shown.length;
    const tie = (x, y) => (prio[x.bloc_id] - prio[y.bloc_id]) || (x.sort_order - y.sort_order) || (x.num - y.num);
    const doneLast = (x, y) => (x.status === 'termine') - (y.status === 'termine');
    const cmp = {
      left: (x, y) => doneLast(x, y) || (hoursLeft([x]) - hoursLeft([y])) || tie(x, y),
      progress: (x, y) => doneLast(x, y) || ((+y.progress_pct || 0) - (+x.progress_pct || 0)) || tie(x, y),
      recent: (x, y) => byRecent(x, y) || tie(x, y)
    }[ui.sort];
    body = pinned + (shown.length ? `<div class="clist flat">${shown.sort(cmp).map(c => courseRow(c, { showBloc: true })).join('')}</div>` : '')
      + (hidden ? `<div class="sub folded-note" style="margin-top:12px">${esc(t1n('list.hiddenFold', hidden, { n: fmtN(hidden) }))}</div>` : '');
  }

  $('#tab-list').innerHTML = `
  <div class="card">
    <div class="filters">
      <div class="fld f-q"><label class="f" for="q">${esc(t('list.search'))}</label>
        <input type="search" id="q" placeholder="${esc(t('list.searchPh'))}" value="${esc(ui.q)}"></div>
      <div class="fld f-sel"><label class="f" for="fBloc">${esc(t('list.bloc'))}</label>
        <select id="fBloc"><option value="all">${esc(t('list.allBlocs'))}</option>
          ${blocs.map(b => `<option value="${esc(b.id)}" ${ui.bloc === b.id ? 'selected' : ''}>${esc(blocName(b))}</option>`).join('')}</select></div>
      <div class="fld f-sel"><label class="f" for="fFlag">${esc(t('list.flag'))}</label>
        <select id="fFlag"><option value="all">${esc(t('list.allFlags'))}</option>
          <option value="none" ${ui.flag === 'none' ? 'selected' : ''}>${esc(t('list.noFlag'))}</option>
          ${FLAGS.filter(f => f !== 'non-cours' || state.courses.some(c => !c.deleted && c.flag === f))
            .map(f => `<option value="${esc(f)}" ${ui.flag === f ? 'selected' : ''}>${esc(flagLabel(f))}</option>`).join('')}</select></div>
      <div class="fld f-sel"><label class="f" for="fSort">${esc(t('list.sort'))}</label>
        <select id="fSort">${SORTS.map(v => `<option value="${v}" ${ui.sort === v ? 'selected' : ''}>${esc(t('sort.' + v))}</option>`).join('')}</select></div>
      <div class="f-seg">
        <div class="seg" style="flex:1;min-width:0;flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px">
          ${[['all', 'list.all'], ['a_faire', 'list.todo'], ['en_cours', 'list.doing'], ['termine', 'list.done']]
            .map(([v, k]) => `<button data-st="${v}" class="${ui.status === v ? 'on' : ''}">${esc(t(k))}</button>`).join('')}
        </div>
        <button class="btn sm" id="addC" style="flex:none">${esc(t('list.add'))}</button>
      </div>
    </div>
    <div class="sub list-sum" style="margin-top:10px"><span>${esc(t1n('list.count', list.length, { n: fmtN(list.length), h: fmtH(stats(list).total) }))}</span>
      ${filtersOn() ? `<button class="linkbtn" id="fReset">${esc(t('list.reset'))}</button>` : ''}</div>
  </div>
  ${body || `<div class="empty">${esc(t('list.empty'))}</div>`}`;

  const qi = $('#q');
  qi.oninput = () => { ui.q = qi.value; saveUI(); const p = qi.selectionStart; renderList(); const n = $('#q'); n.focus(); try { n.setSelectionRange(p, p); } catch (_) {} };
  $('#fBloc').onchange = e => { ui.bloc = e.target.value; saveUI(); renderList(); };
  $('#fFlag').onchange = e => { ui.flag = e.target.value; saveUI(); renderList(); };
  $('#fSort').onchange = e => { ui.sort = e.target.value; saveUI(); renderList(); };
  $$('#tab-list [data-st]').forEach(b => b.onclick = () => { ui.status = b.dataset.st; saveUI(); renderList(); });
  $$('#tab-list [data-fold]').forEach(b => b.onclick = () => toggleFold(b.dataset.fold));
  const rb = $('#fReset');
  if (rb) rb.onclick = () => { Object.assign(ui, { q: '', bloc: 'all', flag: 'all', status: 'all', sort: 'prio' }); saveUI(); renderList(); };
  $('#addC').onclick = () => newCourse();

  $$('#tab-list .c').forEach(el => {
    const c = state.courses.find(x => x.id === el.dataset.id);
    $('[data-act=cycle]', el).onclick = () => cycle(c);
    $('[data-act=open]', el).onclick = () => openCourse(c);
  });
}
function cycle(c) {
  const today = new Date().toISOString().slice(0, 10);
  if (c.status === 'a_faire')
    write('courses', { id: c.id, status: 'en_cours', progress_pct: c.progress_pct || 10, started_at: c.started_at || today, completed_at: null });
  else if (c.status === 'en_cours')
    write('courses', { id: c.id, status: 'termine', progress_pct: 100, completed_at: today });
  else
    write('courses', { id: c.id, status: 'a_faire', progress_pct: 0, started_at: null, completed_at: null });
}

/* ── 12. fiche cours ─────────────────────────────────────────────────────── */
function openCourse(c) {
  const b = blocOf(c.bloc_id);
  const mins = state.log.filter(l => l.course_id === c.id).reduce((s, l) => s + l.minutes, 0);
  openSheet(`
    <div class="sheet-h">
      <div style="flex:1">
        <div class="meta" style="margin:0 0 6px"><span class="chip" style="background:${esc(b.color)}"></span>
          <span>${esc(blocName(b))}</span>${c.flag ? `<span class="tag fl">${esc(flagLabel(c.flag))}</span>` : ''}</div>
        <h3>${esc(c.title)}</h3>
      </div>
      <button class="icon-btn" data-x>✕</button>
    </div>
    ${c.objective ? `<p style="margin:0 0 14px;color:var(--txt-2);font-size:14px">${esc(c.objective)}</p>` : ''}
    ${c.why ? `<div class="why"><b style="color:var(--amber)">${esc(t('sheet.why'))}</b> ${esc(c.why)}</div>` : ''}
    ${(c.skills || []).length ? `<div style="margin-top:14px"><label class="f">${esc(t('sheet.skills'))}</label>
      <ul class="skills">${c.skills.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
    ${c.url ? `<div style="margin-top:12px"><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(t('sheet.open'))}</a></div>` : ''}

    <div class="hr"></div>
    <label class="f">${esc(t('sheet.status'))}</label>
    <div class="seg" style="margin-bottom:14px">
      ${[['a_faire', 'st.todo'], ['en_cours', 'st.doing'], ['termine', 'st.done']]
        .map(([v, k]) => `<button data-s="${v}" class="${c.status === v ? 'on' : ''}">${esc(t(k))}</button>`).join('')}
    </div>
    <div id="pctWrap" class="${c.status === 'en_cours' ? '' : 'hide'}" style="margin-bottom:14px">
      <label class="f">${esc(t('sheet.progress'))} — <span id="pv" class="mono" style="color:var(--amber)">${c.progress_pct}%</span></label>
      <input type="range" id="pct" min="0" max="100" step="5" value="${c.progress_pct}">
    </div>

    <div class="row">
      <div style="flex:1;min-width:120px"><label class="f">${esc(t('sheet.hours'))}</label>
        <input type="number" id="eH" value="${+c.hours || 0}" step="0.25" min="0"></div>
      <div style="flex:1;min-width:150px"><label class="f">${esc(t('sheet.bloc'))}</label>
        <select id="eB">${[...state.blocs].sort((a, z) => a.priority - z.priority)
          .map(x => `<option value="${x.id}" ${x.id === c.bloc_id ? 'selected' : ''}>${esc(blocName(x))}</option>`).join('')}</select></div>
    </div>
    <div class="row" style="margin-top:2px">
      <div style="flex:1;min-width:150px"><label class="f">${esc(t('sheet.flag'))}</label>
        <select id="eF"><option value="">—</option>${FLAGS.map(f =>
          `<option value="${esc(f)}" ${c.flag === f ? 'selected' : ''}>${esc(flagLabel(f))}</option>`).join('')}</select></div>
      <div style="flex:1;min-width:150px"><label class="f">${esc(t('sheet.dur'))}</label>
        <select id="eV"><option value="0" ${!c.hours_verified ? 'selected' : ''}>${esc(t('sheet.durEst'))}</option>
          <option value="1" ${c.hours_verified ? 'selected' : ''}>${esc(t('sheet.durVer'))}</option></select></div>
    </div>
    <div class="fld"><label class="f">${esc(t('sheet.title'))}</label><input type="text" id="eT" value="${esc(c.title)}"></div>
    <div class="fld"><label class="f">${esc(t('sheet.objective'))}</label><textarea id="eO">${esc(c.objective || '')}</textarea></div>
    <div class="fld"><label class="f">${esc(t('sheet.notes'))}</label>
      <textarea id="eN" placeholder="${esc(t('sheet.notesPh'))}">${esc(c.notes || '')}</textarea></div>

    <div class="hr"></div>
    <label class="f">${esc(t('sheet.session', { h: fmtH(mins / 60) }))}</label>
    <div class="row"><input type="number" id="mi" placeholder="${esc(t('sheet.minutes'))}" min="1" style="flex:1;min-width:110px">
      <button class="btn" id="addLog">${esc(t('sheet.add'))}</button></div>
    <div class="sub">${esc(t('sheet.dates', { a: fmtD(c.started_at), b: fmtD(c.completed_at) }))}</div>

    <div class="hr"></div>
    <div class="row"><button class="btn pri" id="save" style="flex:1">${esc(t('sheet.save'))}</button>
      <button class="btn dgr" id="del">${esc(t('sheet.delete'))}</button></div>`, sheet => {

    $$('[data-s]', sheet).forEach(btn => btn.onclick = () => {
      const v = btn.dataset.s, today = new Date().toISOString().slice(0, 10);
      const patch = { id: c.id, status: v };
      if (v === 'termine') { patch.progress_pct = 100; patch.completed_at = today; patch.started_at = c.started_at || today; }
      if (v === 'en_cours') { patch.completed_at = null; patch.started_at = c.started_at || today; if (!c.progress_pct) patch.progress_pct = 10; }
      if (v === 'a_faire') { patch.progress_pct = 0; patch.started_at = null; patch.completed_at = null; }
      write('courses', patch); closeSheet();
      openCourse(state.courses.find(x => x.id === c.id));
    });
    const pr = $('#pct', sheet);
    if (pr) pr.oninput = () => $('#pv', sheet).textContent = pr.value + '%';

    $('#addLog', sheet).onclick = () => {
      const m = parseInt($('#mi', sheet).value, 10);
      if (!m || m <= 0) return toast(t('sheet.needMin'));
      write('study_log', { id: uuid(), course_id: c.id, day: new Date().toISOString().slice(0, 10), minutes: m });
      toast(t('sheet.minAdded', { n: fmtN(m) })); closeSheet();
    };
    $('#save', sheet).onclick = () => {
      write('courses', {
        id: c.id, title: $('#eT', sheet).value.trim() || c.title, hours: +$('#eH', sheet).value || 0,
        hours_verified: $('#eV', sheet).value === '1', bloc_id: $('#eB', sheet).value,
        flag: $('#eF', sheet).value || null, objective: $('#eO', sheet).value.trim() || null,
        notes: $('#eN', sheet).value.trim() || null,
        progress_pct: pr ? +pr.value : c.progress_pct
      });
      closeSheet(); toast(t('sheet.saved'));
    };
    $('#del', sheet).onclick = () => {
      if (!confirm(t('sheet.delQ', { t: c.title }))) return;
      write('courses', { id: c.id, deleted: true }); closeSheet(); toast(t('sheet.deleted'));
    };
  });
}

function newCourse() {
  const blocs = [...state.blocs].sort((a, b) => a.priority - b.priority);
  openSheet(`<div class="sheet-h"><h3>${esc(t('new.title'))}</h3><button class="icon-btn" data-x>✕</button></div>
    <div class="fld"><label class="f">${esc(t('new.name'))}</label>
      <input type="text" id="nT" placeholder="${esc(t('new.namePh'))}"></div>
    <div class="row"><div style="flex:1;min-width:120px"><label class="f">${esc(t('new.hours'))}</label>
        <input type="number" id="nH" value="4" step="0.25" min="0"></div>
      <div style="flex:1;min-width:150px"><label class="f">${esc(t('sheet.bloc'))}</label><select id="nB">
        ${blocs.map(b => `<option value="${b.id}">${esc(blocName(b))}</option>`).join('')}</select></div></div>
    <div class="fld" style="margin-top:12px"><label class="f">${esc(t('sheet.objective'))}</label><textarea id="nO"></textarea></div>
    <button class="btn pri" id="nOk" style="width:100%">${esc(t('new.add'))}</button>`, sheet => {
    $('#nOk', sheet).onclick = () => {
      const title = $('#nT', sheet).value.trim(); if (!title) return toast(t('new.needTitle'));
      const bid = $('#nB', sheet).value;
      const mx = Math.max(0, ...alive().filter(c => c.bloc_id === bid).map(c => c.sort_order || 0));
      write('courses', {
        id: uuid(), num: Math.max(0, ...alive().map(c => c.num || 0)) + 1, title,
        bloc_id: bid, hours: +$('#nH', sheet).value || 0, hours_verified: false, url: null,
        objective: $('#nO', sheet).value.trim() || null, skills: [], why: null, flag: null,
        status: 'a_faire', progress_pct: 0, started_at: null, completed_at: null,
        notes: null, sort_order: mx + 10, deleted: false
      });
      closeSheet(); toast(t('new.added'));
    };
  });
}

/* ── 13. gestion des blocs ───────────────────────────────────────────────── */
function renderBlocs() {
  const blocs = [...state.blocs].sort((a, b) => a.priority - b.priority);
  $('#tab-blocs').innerHTML = `<div class="dash"><div class="card wide"><h2>${esc(t('blocs.order'))}</h2>
    <div class="bgrid">${blocs.map((b, i) => {
      const n = alive().filter(c => c.bloc_id === b.id).length;
      return `<div class="blocrow" data-b="${b.id}">
        <div class="t"><span class="chip" style="background:${esc(b.color)}"></span><b>${esc(blocName(b))}</b>
          <span class="pc">${esc(t('blocs.count', { n: fmtN(n) }))}</span></div>
        <div class="sub" style="margin-top:2px">${esc(blocSub(b))}</div>
        <div class="row" style="margin-top:8px">
          <button class="btn sm" data-up ${i === 0 ? 'disabled' : ''}>↑</button>
          <button class="btn sm" data-dn ${i === blocs.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="btn sm" data-ed>${esc(t('blocs.edit'))}</button>
        </div></div>`;
    }).join('')}</div></div>
    <div class="card wide"><h2>${esc(t('blocs.flags'))}</h2><div class="sub" style="margin:0">
      ${(I18N.flagHelp[lang] || I18N.flagHelp.fr).join(' · ')}</div></div></div>`;

  $$('#tab-blocs .blocrow').forEach(el => {
    const b = state.blocs.find(x => x.id === el.dataset.b);
    const i = blocs.indexOf(b);
    $('[data-up]', el).onclick = () => swap(blocs[i], blocs[i - 1]);
    $('[data-dn]', el).onclick = () => swap(blocs[i], blocs[i + 1]);
    $('[data-ed]', el).onclick = () => editBloc(b);
  });
}
function swap(a, b) {
  if (!a || !b) return;
  const pa = a.priority, pb = b.priority;
  write('blocs', { id: a.id, name: a.name, priority: pb }, { silent: true });
  write('blocs', { id: b.id, name: b.name, priority: pa });
}
function editBloc(b) {
  openSheet(`<div class="sheet-h"><h3>${esc(t('blocs.editTitle'))}</h3><button class="icon-btn" data-x>✕</button></div>
    <div class="fld"><label class="f">${esc(t('blocs.name'))}</label>
      <input type="text" id="bN" value="${esc(blocName(b))}"></div>
    <div class="fld"><label class="f">${esc(t('blocs.subtitle'))}</label>
      <input type="text" id="bS" value="${esc(blocSub(b))}"></div>
    <div class="fld"><label class="f">${esc(t('blocs.color'))}</label><div class="row">
      ${BLOC_COLORS.map(c => `<button class="btn sm" data-c="${c}" style="background:${c};width:34px;height:30px;border-color:${b.color === c ? '#fff' : 'transparent'}"></button>`).join('')}
    </div></div>
    <div class="row"><button class="btn pri" id="bOk" style="flex:1">${esc(t('blocs.save'))}</button>
      <button class="btn dgr" id="bDel">${esc(t('blocs.delete'))}</button></div>`, sheet => {
    let color = b.color;
    $$('[data-c]', sheet).forEach(x => x.onclick = () => {
      color = x.dataset.c; $$('[data-c]', sheet).forEach(y => y.style.borderColor = 'transparent'); x.style.borderColor = '#fff';
    });
    $('#bOk', sheet).onclick = () => {
      write('blocs', { id: b.id, name: $('#bN', sheet).value.trim() || b.name,
        subtitle: $('#bS', sheet).value.trim() || null, color, priority: b.priority });
      closeSheet(); toast(t('blocs.updated'));
    };
    // Supprimer : les cours du bloc sont replacés dans le bloc suivant, jamais perdus.
    $('#bDel', sheet).onclick = () => {
      const others = state.blocs.filter(x => x.id !== b.id).sort((a, z) => a.priority - z.priority);
      if (!others.length) return toast(t('blocs.last'));
      const dest = others[others.length - 1];
      const moved = state.courses.filter(c => c.bloc_id === b.id);
      if (!confirm(t('blocs.delQ', { t: blocName(b), n: fmtN(moved.length), d: blocName(dest) }))) return;
      moved.forEach(c => write('courses', { id: c.id, bloc_id: dest.id }, { silent: true }));
      remove('blocs', { id: b.id });
      closeSheet(); toast(t('blocs.deleted'));
    };
  });
}

/* ── 14. sauvegarde / export / import ────────────────────────────────────── */
function exportObj() {
  return { version: 1, exported_at: nowISO(), settings: state.settings,
    blocs: state.blocs, courses: state.courses, study_log: state.log };
}
function dl(name, text, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: mime }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function csv() {
  const cols = ['num', 'title', 'bloc_id', 'hours', 'hours_verified', 'flag', 'status', 'progress_pct',
                'started_at', 'completed_at', 'objective', 'why', 'skills', 'url', 'notes'];
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  return '﻿' + [cols.join(';')].concat(alive()
    .sort((a, b) => (blocOf(a.bloc_id).priority - blocOf(b.bloc_id).priority) || (a.sort_order - b.sort_order))
    .map(c => cols.map(k => q(k === 'skills' ? (c.skills || []).join(' | ') : c[k])).join(';'))).join('\n');
}
/** Lignes gardées sur cet appareil mais absentes du serveur. */
function orphHtml() {
  const o = orphans(), rows = Object.values(o).flat();
  if (!rows.length) return '';
  const names = rows.map(r => r.code || r.title || r.day || '').filter(Boolean);
  const list = names.slice(0, 8).map(x => quoteList(x)).join(', ') + (names.length > 8 ? ', …' : '');
  return `<div class="alert">${t1n('orph.txt', rows.length, { n: fmtN(rows.length) })}
      ${list ? `<div class="sub" style="margin:6px 0 0">${esc(list)}</div>` : ''}</div>
    <div class="row" style="margin-bottom:10px"><button class="btn pri" id="orS">${esc(t('orph.send'))}</button>
      <button class="btn dgr" id="orD">${esc(t('orph.drop'))}</button></div>`;
}
const quoteList = x => (typeof quo === 'function' ? quo(x) : '"' + x + '"');

function renderData() {
  const n = outbox().length;
  $('#tab-data').innerHTML = `
  <div class="dash">
  <div class="card"><h2>${esc(t('data.export'))}</h2>
    <div class="row"><button class="btn" id="eJ">${esc(t('data.expJson'))}</button>
      <button class="btn" id="eC">${esc(t('data.expCsv'))}</button></div>
    <div class="sub">${esc(t('data.expSub'))}</div>
  </div>
  <div class="card"><h2>${esc(t('data.import'))}</h2>
    <input type="file" id="imp" accept="application/json,.json">
    <div class="sub">${esc(t('data.impSub'))}</div>
  </div>
  <div class="card wide"><h2>${esc(t('data.sync'))}</h2>
    <div class="sub" style="margin:0 0 10px">${n ? t1n('data.sync', n, { n: fmtN(n) }) : esc(t('data.sync0'))}</div>
    <div class="sub mono" style="margin:0 0 10px;font-size:12px">${esc(t('acct.line', {
      e: (user && user.email) || '—', id: user ? String(user.id).slice(0, 8) : '—', v: APP_VERSION,
      c: lastCheckAt ? new Date(lastCheckAt).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' }) : '—',
      d: lastPullAt ? new Date(lastPullAt).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' }) : '—' }))}</div>
    ${lastError ? `<div class="alert">${esc(t('diag.err', { e: lastError }))}</div>` : ''}
    ${orphHtml()}
    <div class="row"><button class="btn" id="fl">${esc(t('data.push'))}</button>
      <button class="btn" id="pl">${esc(t('data.pull'))}</button>
      <button class="btn" id="dd">${esc(t('dedup.run'))}</button>
      <button class="btn" id="dg">${esc(t('diag.run'))}</button>
      ${n ? `<button class="btn dgr" id="dc">${esc(t('diag.clear'))}</button>` : ''}</div>
    <div id="dgres" style="margin-top:10px"></div>
  </div>
  <div class="card"><h2>${esc(t('data.legacy'))}</h2>
    <div class="row"><button class="btn" id="mg">${esc(t('data.legacyBtn'))}</button></div>
    <div class="sub">${t('data.legacySub', { k: `<span class="mono">${esc(LEGACY_KEY)}</span>` })}</div>
  </div>
  <div class="card"><h2>${esc(t('data.catalog'))}</h2>
    <div class="row"><button class="btn" id="rs">${esc(t('data.catalogBtn'))}</button></div>
    <div class="sub">${esc(t('data.catalogSub'))}</div>
  </div>
  <div class="card wide"><h2>${esc(t('reset.title'))}</h2>
    <div class="sub" style="margin:0 0 10px">${t('reset.warn')}</div>
    <div class="row"><button class="btn dgr" id="rz">${esc(t('reset.btn'))}</button></div>
  </div>
  </div>`;

  $('#eJ').onclick = () => dl('feuille-de-route-' + new Date().toISOString().slice(0, 10) + '.json',
    JSON.stringify(exportObj(), null, 2), 'application/json');
  $('#eC').onclick = () => dl('cours-' + new Date().toISOString().slice(0, 10) + '.csv', csv(), 'text/csv');
  $('#fl').onclick = () => { flush(); toast(t('data.pushing')); };
  $('#pl').onclick = () => { syncNow(true); toast(t('data.pulling')); };
  $('#mg').onclick = () => { lsSet(MIGR_KEY, false); maybeMigrate(); };
  $('#rs').onclick = () => reseedMissing();
  $('#dd').onclick = async () => {
    const k = dedupe();
    if (!k) return toast(t('dedup.none'));
    await flush(); render(); toast(t('dedup.done', { n: fmtN(k) }));
  };
  $('#rz').onclick = () => askReset();
  if ($('#orS')) $('#orS').onclick = () => { const k = restoreOrphans(); toast(t('orph.sent', { n: fmtN(k) })); };
  if ($('#orD')) $('#orD').onclick = () => {
    if (!confirm(t('orph.dropQ'))) return;
    lsSet(orphanKey(), {}); render(); toast(t('orph.dropped'));
  };
  $('#dg').onclick = async () => {
    const box = $('#dgres'); box.innerHTML = '…';
    if (!sb || !user) { box.textContent = '—'; return; }
    const out = [];
    for (const tb of Object.keys(TABLES)) {
      let r; try { r = await sb.from(tb).select('*', { count: 'exact', head: true }); }
      catch (e) { r = { error: e }; }
      out.push(`<div class="chk"><i class="${r.error ? 'no' : 'ok'}">${r.error ? '✕' : '✓'}</i>
        <span class="mono" style="flex:1">${esc(tb)}</span>
        <span style="color:var(--txt-3);font-size:12px">${esc(r.error ? (r.error.message || t('diag.ko')).slice(0, 90) : t('diag.ok'))}</span></div>`);
    }
    box.innerHTML = out.join('');
  };
  if ($('#dc')) $('#dc').onclick = () => {
    const k = outbox().length;
    if (!confirm(t('diag.clearQ', { n: fmtN(k) }))) return;
    lsSet(outboxKey(), []); lastError = ''; syncState = 'ok'; render(); toast(t('diag.cleared'));
  };
  $('#imp').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { importObj(JSON.parse(r.result)); } catch { toast(t('data.badJson')); } };
    r.readAsText(f);
  };
}
/** Réinitialisation d'usine : efface les données du compte en ligne et sur
 *  l'appareil, puis recharge — l'amorçage réinstalle le catalogue d'origine.
 *  L'ordre de suppression respecte les clés étrangères. */
const WIPE_ORDER = ['study_log', 'project_courses', 'milestones', 'work_hours',
                    'modules', 'projects', 'courses', 'blocs', 'settings'];
function askReset() {
  const w = t('reset.word');
  openSheet(`<div class="sheet-h"><h3>${esc(t('reset.title'))}</h3><button class="icon-btn" data-x>✕</button></div>
    <div class="sub">${t('reset.warn')}</div>
    <div class="fld" style="margin-top:10px"><label class="f">${esc(t('reset.ask', { w }))}</label>
      <input type="text" id="rzW" autocapitalize="characters" autocomplete="off" placeholder="${esc(w)}"></div>
    <div class="row"><button class="btn dgr" id="rzOk" style="flex:1">${esc(t('reset.btn'))}</button></div>`, sh => {
    $('#rzW', sh).focus();
    $('#rzOk', sh).onclick = async () => {
      if ($('#rzW', sh).value.trim().toUpperCase() !== w.toUpperCase()) return toast(t('reset.cancel'));
      $('#rzOk', sh).disabled = true;
      await factoryReset();
    };
  });
}
async function factoryReset() {
  lsSet(outboxKey(), []);                       // rien ne doit repartir après coup
  if (sb && user && navigator.onLine) {
    for (const tb of WIPE_ORDER) {
      try { await sb.from(tb).delete().match({ user_id: user.id }); }
      catch (e) { console.warn('reset', tb, e); }
    }
  }
  [cacheKey(), outboxKey(), CACHE_KEY, OUTBOX_KEY, OWNER_KEY, MIGR_KEY, UI_KEY]
    .forEach(k => { try { localStorage.removeItem(k); } catch {} });
  cacheT = null;
  closeSheet(); toast(t('reset.done'));
  setTimeout(() => location.reload(), 900);
}

/* ── correctif « roadmap-patch-v2 » ───────────────────────────────────────
   Un fichier de correctif ne restaure pas une sauvegarde : il remplace des
   morceaux précis (un engagement, ses jalons, ses liens de cours) sans toucher
   au reste. Les cours y sont désignés par leur numéro ou leur titre ; c'est
   l'application qui les résout en identifiants internes. Réappliquer deux fois
   le même fichier donne le même résultat qu'une fois. */
const norm = s => String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();

function findCourse(ref) {
  if (ref.course_id) { const c = state.courses.find(x => x.id === ref.course_id); if (c) return c; }
  if (ref.course_num != null) {
    const c = state.courses.find(x => x.num === ref.course_num && !x.deleted); if (c) return c;
  }
  if (ref.course_title) {
    const k = norm(ref.course_title);
    const c = state.courses.find(x => norm(x.title) === k && !x.deleted); if (c) return c;
  }
  return null;
}

function importPatch(o, opts = {}) {
  if (!v2Ready) { toast(t('data.needV2')); return; }
  let n = 0;

  // 1. cours ajoutés par le correctif (livres, références) — jamais en double
  (o.courses_to_add || []).forEach(c => {
    if (!c.title) return;
    const k = norm(c.title);
    if (state.courses.some(x => norm(x.title) === k && !x.deleted)) return;
    const num = c.num != null ? c.num : Math.max(400, ...state.courses.map(x => +x.num || 0)) + 1;
    const bloc = state.blocs.some(b => b.id === c.bloc) ? c.bloc : (state.blocs[0] || {}).id;
    write('courses', {
      id: uuid(), user_id: user.id, num, title: c.title, bloc_id: bloc,
      hours: +c.hours || 0, hours_verified: false, url: c.url || null,
      objective: c.objective || null, skills: c.skills || [], why: c.why || null,
      flag: FLAGS.includes(c.flag) ? c.flag : null,
      status: 'a_faire', progress_pct: 0, started_at: null, completed_at: null,
      notes: null, deleted: false,
      sort_order: c.sort_order != null ? c.sort_order
        : Math.max(0, ...state.courses.filter(x => x.bloc_id === bloc).map(x => +x.sort_order || 0)) + 10
    }, { silent: true });
    n++;
  });

  // 2. engagements — mise à jour sur le code, création sinon
  (o.projects || []).forEach(p => {
    if (!p.code) return;
    const ex = state.projects.find(x => x.code === p.code);
    const row = { ...p };
    if (ex) { row.id = ex.id; }
    else {
      row.id = uuid(); row.status = row.status || 'prevu';
      row.sort_order = row.sort_order != null ? row.sort_order
        : Math.max(0, ...state.projects.map(x => +x.sort_order || 0)) + 10;
    }
    write('projects', row, { silent: true }); n++;
  });

  // 3. jalons — on remplace ceux de l'engagement visé, on ne les cumule pas
  const byProject = (arr, f) => {
    const m = new Map();
    (arr || []).forEach(x => { const k = x.project || x.project_code;
      if (!m.has(k)) m.set(k, []); m.get(k).push(x); });
    return m;
  };
  byProject(o.milestones).forEach((rows, code) => {
    const pr = state.projects.find(x => x.code === code); if (!pr) return;
    state.milestones.filter(m => m.project_id === pr.id)
      .forEach(m => remove('milestones', { id: m.id }, { silent: true }));
    rows.forEach((m, i) => {
      write('milestones', { id: uuid(), project_id: pr.id, title: m.title,
        due_date: m.due_date || null, done: !!m.done, done_at: m.done_at || null,
        sort_order: (m.sort_order != null ? m.sort_order : i + 1) * 10,
        deleted: false }, { silent: true });
      n++;
    });
  });

  // 4. liens de cours — même logique de remplacement
  const missing = [];
  byProject(o.project_courses).forEach((rows, code) => {
    const pr = state.projects.find(x => x.code === code); if (!pr) return;
    state.plinks.filter(l => l.project_id === pr.id)
      .forEach(l => remove('project_courses', { project_id: l.project_id, course_id: l.course_id }, { silent: true }));
    rows.forEach(l => {
      const c = findCourse(l);
      if (!c) { missing.push(l.course_title || ('#' + l.course_num)); return; }
      write('project_courses', { project_id: pr.id, course_id: c.id,
        relevance: l.relevance === 'indispensable' ? 'indispensable' : 'utile' }, { silent: true });
      n++;
    });
  });

  // 5. modules — mise à jour sur le code
  (o.modules || []).forEach(m => {
    if (!m.code) return;
    const ex = state.modules.find(x => x.code === m.code && !x.deleted);
    const row = { ...m };
    if (ex) row.id = ex.id;
    else {
      row.id = uuid(); row.deleted = false; row.graded = m.graded !== false;
      row.status = m.status || 'prevu'; row.count_in_final = m.count_in_final !== false;
      row.sort_order = Math.max(0, ...state.modules.map(x => +x.sort_order || 0)) + 10;
    }
    write('modules', row, { silent: true }); n++;
  });

  if (o.settings) write('settings', { user_id: user.id, ...o.settings }, { silent: true });

  render(); flush();
  if (!opts.quiet) toast(missing.length ? t('data.patchPartial', { n: fmtN(n), m: missing.join(', ') })
                                        : t('data.patchDone', { n: fmtN(n) }), 5200);
  return n;
}

/** Correctifs livrés avec l'application (data-v2.js → patches). */
function applyAutoPatches() {
  let done = 0;
  const msgs = [];
  ((window.SEED2 && window.SEED2.patches) || []).forEach(pt => {
    try {
      if (typeof pt.when === 'function') {
        if (!pt.when(state)) return;
        pt.apply({ state, write, uuid, importPatch, user });
      } else {
        const w = pt.when || {}, pr = state.projects.find(x => x.code === w.project);
        if (!pr || pr[w.field] !== w.equals) return;
        importPatch(pt.patch, { quiet: true });
      }
      if (pt.toast) msgs.push(t(pt.toast));
      done++;
    } catch (e) { console.warn('correctif', pt.id, e); }
  });
  if (msgs.length) { render(); toast(msgs.join(' '), 7000); }
  return done;
}

function importObj(o) {
  if (o && o.meta && o.meta.format === 'roadmap-patch-v2') return importPatch(o);
  let n = 0;
  (o.blocs || []).forEach(b => {
    write('blocs', { id: b.id, name: b.name, subtitle: b.subtitle, color: b.color, priority: b.priority }, { silent: true }); n++;
  });
  (o.courses || []).forEach(c => {
    const ex = state.courses.find(x => x.id === c.id) || state.courses.find(x => x.num === c.num && x.title === c.title);
    const row = { ...c, id: ex ? ex.id : (c.id || uuid()), user_id: user.id };
    delete row.updated_at; write('courses', row, { silent: true }); n++;
  });
  if (o.settings) write('settings', { user_id: user.id,
    weekly_hours: o.settings.weekly_hours, practice_factor: o.settings.practice_factor }, { silent: true });
  (o.study_log || []).forEach(l => write('study_log',
    { id: l.id || uuid(), course_id: l.course_id, day: l.day, minutes: l.minutes }, { silent: true }));
  render(); toast(t('data.imported', { n: fmtN(n) }));
}
function reseedMissing() {
  let n = 0;
  window.SEED.blocs.forEach(b => {
    if (!state.blocs.find(x => x.id === b.id)) { write('blocs', { ...b, user_id: user.id }, { silent: true }); n++; }
  });
  window.SEED.courses.forEach(c => {
    if (state.courses.find(x => x.num === c.num || x.title === c.title)) return;
    write('courses', { id: uuid(), user_id: user.id, num: c.num, title: c.title, bloc_id: c.bloc,
      hours: c.hours, hours_verified: c.hours_verified, url: c.url, objective: c.objective,
      skills: c.skills || [], why: c.why, flag: c.flag, status: 'a_faire', progress_pct: 0,
      started_at: null, completed_at: null, notes: null, sort_order: c.sort_order, deleted: false }, { silent: true });
    n++;
  });
  render();
  toast(n ? t('data.addedN', { n: fmtN(n) }) : t('data.nothing'));
}

/* ── 15. sheet générique ─────────────────────────────────────────────────── */
function openSheet(html, after) {
  const m = $('#modal');
  m.innerHTML = `<div class="ovl"><div class="sheet"><div class="grab"></div>${html}</div></div>`;
  const ovl = $('.ovl', m), sheet = $('.sheet', m);
  ovl.onclick = e => { if (e.target === ovl) closeSheet(); };
  const x = $('[data-x]', sheet); if (x) x.onclick = closeSheet;
  document.body.style.overflow = 'hidden';
  after && after(sheet);
}
function closeSheet() { $('#modal').innerHTML = ''; document.body.style.overflow = ''; }

/* ── 16. rendu global, onglets, langue ───────────────────────────────────── */
function saveUI() { lsSet(UI_KEY, ui); }

/** Applique les traductions au balisage statique (attributs data-i18n*). */
function paintStatic() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-html]').forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $$('[data-i18n-title]').forEach(el => el.title = t(el.dataset.i18nTitle));
  document.title = t('app.name') + ' — ' + t('app.sub');
  ['#langbar', '#langbarMobile', '#langbarAuth'].forEach(sel => {
    const bar = $(sel); if (!bar) return;
    bar.innerHTML = Object.keys(I18N.meta).map(k =>
      `<button data-lang="${k}" class="${k === lang ? 'on' : ''}" title="${esc(I18N.meta[k].name)}"
        lang="${k}">${esc(I18N.meta[k].label)}</button>`).join('');
    $$('button', bar).forEach(b => b.onclick = () => setLang(b.dataset.lang));
  });
}
function setLang(l) {
  if (!I18N.meta[l] || l === lang) return;
  lang = l; lsSet(LANG_KEY, l);
  paintStatic(); render();
  if ($('#modal').innerHTML) closeSheet();   // une feuille ouverte serait à moitié traduite
}

function render() {
  paintSync();
  if (!user) return;
  if (!TAB_SECTIONS[ui.tab]) ui.tab = 'week';
  const shown = TAB_SECTIONS[ui.tab];
  Object.values(TAB_SECTIONS).flat().forEach(x => {
    const el = $('#tab-' + x); if (el) el.classList.toggle('hide', !shown.includes(x));
  });
  $$('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === ui.tab));
  shown.forEach(x => { const f = RENDERERS[x]; if (f) f(); });
}
RENDERERS.dash  = () => renderDash();
RENDERERS.list  = () => renderList();
RENDERERS.blocs = () => renderBlocs();
RENDERERS.data  = () => renderData();

/* ── 17. Realtime ────────────────────────────────────────────────────────── */
function subscribe() {
  if (!sb || channel) return;
  channel = sb.channel('roadmap');
  Object.keys(TABLES).forEach(t => {
    if (TABLES[t].v2 && !v2Ready) return;
    channel.on('postgres_changes', { event: '*', schema: 'public', table: t }, p => applyRT(t, p));
  });
  channel.subscribe();
}
function applyRT(table, p) {
  const def = TABLES[table]; if (!def) return;
  if (p.eventType === 'DELETE') {
    const old = p.old; if (!old) return;
    if (def.key && state[def.key]) {
      const k = keyOf(table, old);
      state[def.key] = state[def.key].filter(x => keyOf(table, x) !== k);
    }
  } else {
    let row = p.new; if (!row || row.user_id !== user.id) return;
    row = { ...numify(row), _s: 1 };
    if (def.single) {
      if (!state.settings || new Date(row.updated_at) >= new Date(state.settings.updated_at || 0)) state.settings = row;
    } else {
      const arr = state[def.key]; if (!arr) return;
      const k = keyOf(table, row);
      const i = arr.findIndex(x => keyOf(table, x) === k);
      if (i < 0) arr.push(row);
      else if (!arr[i].updated_at || new Date(row.updated_at) >= new Date(arr[i].updated_at)) arr[i] = row;
    }
  }
  saveCache();
  if (!$('#modal').innerHTML) render();
}

/* ── 18. authentification & démarrage ────────────────────────────────────── */
function showAuth(html) {
  $('#authView').classList.remove('hide'); $('#appView').classList.add('hide');
  if (html) $('#authMsg').innerHTML = html;
}
/** Répare la file d'attente héritée d'une version antérieure : les opérations
 *  y étaient stockées comme correctifs partiels, que PostgreSQL rejette.
 *  On les complète depuis le cache ; celles qu'on ne peut pas compléter sont
 *  abandonnées plutôt que de bloquer la file indéfiniment. */
function repairOutbox() {
  const q = outbox(); if (!q.length) return;
  let fixed = 0, dropped = 0;
  const out = [];
  for (const op of q) {
    if (op.del || op.rows) { out.push(op); continue; }
    if (!op.row) { dropped++; continue; }
    const full = fullRow(op.table, op.row);
    const def = TABLES[op.table];
    if (!def) { dropped++; continue; }
    if (!def.single && full === op.row && !state[def.key].some(x => keyOf(op.table, x) === keyOf(op.table, op.row))) {
      dropped++; continue;                       // ligne introuvable localement
    }
    const merged = { ...full, ...op.row };
    if (Object.keys(merged).length > Object.keys(op.row).length) fixed++;
    out.push({ ...op, row: merged });
  }
  lsSet(outboxKey(), out);
  if (fixed || dropped) console.info('file d\'attente réparée :', fixed, 'complétée(s),', dropped, 'abandonnée(s)');
}

/** Supprime les lignes créées en double, en base comme en local.
 *  On garde l'identifiant le plus petit : choix déterministe, donc les deux
 *  appareils suppriment la même ligne et convergent sans se contredire.
 *  Les liens et le journal qui pointaient sur la copie supprimée sont
 *  réalignés sur celle qu'on garde, pour ne rien perdre. */
function dedupe() {
  const groupsOf = (arr, keyFn) => {
    const m = new Map();
    arr.forEach(r => { const k = keyFn(r); if (k == null) return;
      if (!m.has(k)) m.set(k, []); m.get(k).push(r); });
    return [...m.values()].filter(v => v.length > 1)
      .map(v => v.sort((a, b) => String(a.id).localeCompare(String(b.id))));
  };
  let removed = 0;
  const drop = (table, row) => { remove(table, { id: row.id }, { silent: true }); removed++; };

  // 1. Engagements, par code ('hiwi', 'projekt', 'masterarbeit')
  const goneProjects = new Set();
  groupsOf(state.projects, p => p.code).forEach(rows => rows.slice(1).forEach(p => {
    goneProjects.add(p.id); drop('projects', p);
  }));
  // Les lignes rattachées suivent (le serveur cascade, on aligne le local).
  if (goneProjects.size) {
    ['milestones', 'work'].forEach(k =>
      state[k] = state[k].filter(r => !goneProjects.has(r.project_id)));
    state.plinks = state.plinks.filter(l => !goneProjects.has(l.project_id));
  }

  // 2. Cours, par numéro : on réaligne d'abord les liens et le journal
  groupsOf(state.courses, c => (c.num != null ? 'n' + c.num : null)).forEach(rows => {
    const keep = rows[0].id;
    rows.slice(1).forEach(c => {
      state.plinks.forEach(l => { if (l.course_id === c.id) l.course_id = keep; });
      state.log.forEach(g => { if (g.course_id === c.id) g.course_id = keep; });
      drop('courses', c);
    });
  });

  // 3. Jalons (même engagement + même titre) et modules (même code)
  groupsOf(state.milestones, m => m.project_id + '|' + m.title)
    .forEach(rows => rows.slice(1).forEach(m => drop('milestones', m)));
  groupsOf(state.modules, m => m.code)
    .forEach(rows => rows.slice(1).forEach(m => drop('modules', m)));

  // 4. Liens en double sur la même paire (la clé primaire les interdit côté base)
  const seen = new Set();
  state.plinks = state.plinks.filter(l => {
    const k = l.project_id + '|' + l.course_id;
    if (seen.has(k)) return false; seen.add(k); return true;
  });

  if (removed) { saveCache(); console.info('doublons supprimés :', removed); }
  return removed;
}

async function boot() {
  lang = detectLang();
  ui = { ...ui, ...lsGet(UI_KEY, {}) };
  paintStatic();
  loadCache();
  repairOutbox();

  const cfg = window.SUPABASE_CONFIG || {};
  if (!cfg.url || cfg.url.includes('XXXX') || !cfg.anonKey || cfg.anonKey.includes('COLLE_ICI'))
    return showAuth(t('auth.noConfig'));

  sb = window.supabase.createClient(cfg.url, cfg.anonKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  const msg = (txt, colour) => $('#authMsg').innerHTML =
    colour ? `<span style="color:var(--${colour})">${esc(txt)}</span>` : esc(txt);
  const creds = () => {
    const email = $('#email').value.trim(), password = $('#pwd').value;
    if (!email) { msg(t('auth.needEmail'), 'err'); return null; }
    if (password.length < 6) { msg(t('auth.pwShort'), 'err'); return null; }
    return { email, password };
  };
  const busy = b => { $('#btnIn').disabled = b; $('#btnUp').disabled = b; };

  $('#btnIn').onclick = async () => {
    const c = creds(); if (!c) return;
    busy(true); msg(t('auth.signingIn'));
    const { error } = await sb.auth.signInWithPassword(c);
    busy(false);
    if (error) msg(/invalid login/i.test(error.message) ? t('auth.bad') : error.message, 'err');
  };
  $('#btnUp').onclick = async () => {
    const c = creds(); if (!c) return;
    busy(true); msg(t('auth.creating'));
    const { data, error } = await sb.auth.signUp(c);
    busy(false);
    if (error) return msg(/already registered|already exists/i.test(error.message) ? t('auth.exists') : error.message, 'err');
    if (!data.session) msg(t('auth.confirm'), 'warn');
  };
  $('#email').onkeydown = e => { if (e.key === 'Enter') $('#pwd').focus(); };
  $('#pwd').onkeydown   = e => { if (e.key === 'Enter') $('#btnIn').click(); };

  const { data: { session } } = await sb.auth.getSession();
  await onSession(session);
  sb.auth.onAuthStateChange((_e, s) => onSession(s));

  $('#btnOut').onclick = async () => {
    if (!confirm(t('auth.logoutQ'))) return;
    await sb.auth.signOut(); location.reload();
  };
  $$('nav.tabs button').forEach(b => b.onclick = () => { ui.tab = b.dataset.tab; saveUI(); render(); });

  // Hors ligne : l'application tourne sur sa copie locale et met les
  // modifications en file. Dès que le réseau revient, ou qu'on revient sur
  // l'application, on envoie puis on vérifie si la base a changé.
  addEventListener('online',  () => { syncState = 'ok'; paintSync(); syncNow(true); });
  addEventListener('offline', () => { syncState = 'off'; paintSync(); });
  addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
  addEventListener('focus', () => syncNow());
  setInterval(() => { if (navigator.onLine && outbox().length) flush(); }, 20000);
  setInterval(() => { if (!document.hidden) syncNow(); }, 90000);
}
/* Supabase émet plusieurs événements d'authentification au démarrage
   (INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED). Sans sérialisation, deux
   initialisations se chevauchaient pendant leurs `await` : chacune voyait un
   état encore vide et réinstallait les données — d'où les engagements en
   double. On enchaîne donc les appels, et on n'initialise qu'une fois par
   utilisateur. */
let sessionChain = Promise.resolve(), initialisedFor = null;
function onSession(session) {
  sessionChain = sessionChain
    .then(() => onSessionOnce(session))
    .catch(e => console.warn('session', e));
  return sessionChain;
}
async function onSessionOnce(session) {
  if (!session) { user = null; initialisedFor = null; return showAuth(''); }
  const pw = $('#pwd'); if (pw) pw.value = '';
  $('#authView').classList.add('hide'); $('#appView').classList.remove('hide');
  if (initialisedFor === session.user.id) { render(); return; }
  initialisedFor = session.user.id;
  user = session.user;
  adoptOwner(user.id);                      // le cache suit le compte connecté
  repairOutbox();
  render();
  // Ordre voulu : ce qui attend sur cet appareil part d'abord, puis on lit la
  // base, qui fait foi. Lire d'abord écraserait des modifications pas encore envoyées.
  if (outbox().length) await flush();
  const pulled = await pull();
  if (pulled) { try { lastFingerprint = await remoteFingerprint(); lastCheckAt = Date.now(); } catch {} }
  // On n'installe le catalogue que si la base a bien été lue ET qu'elle est vide.
  // Une lecture ratée (réseau) ne doit jamais déclencher une seconde installation.
  const seeded = pulled ? await seedIfEmpty() : false;
  if (seeded) toast(t('seed.done', { n: fmtN(state.courses.length) }));
  // v1 déjà installée, v2 pas encore : on ne réinstalle que les engagements.
  if (pulled && !seeded && v2Ready && !state.projects.length && window.seedV2) { window.seedV2(); await flush(); }
  if (pulled) {
    const additions = window.CATALOG_ADDITIONS || [];
    const key = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const live = new Set(state.courses.filter(c => !c.deleted).map(c => key(c.title)));
    let added = 0;
    additions.forEach(c => { if (live.has(key(c.title)) || state.courses.some(x => +x.num === +c.num)) return;
      const bloc_id = state.blocs.some(b => b.id === c.bloc) ? c.bloc : (state.blocs[0] || {}).id;
      const row = { id: uuid(), user_id: user.id, num: c.num, title: c.title, bloc_id, hours: +c.hours || 0,
        hours_verified: false, url: c.url || null, objective: c.objective || null, skills: c.skills || [], why: c.why || null,
        flag: c.flag || null, status: 'a_faire', progress_pct: 0, started_at: null, completed_at: null, notes: null,
        sort_order: c.sort_order || c.num, deleted: false, updated_at: nowISO() };
      write('courses', row, { silent: true }); live.add(key(c.title)); added++;
    });
    if (added) await flush();
  }
  if (pulled) {
    const additions = window.CATALOG_ADDITIONS || [];
    const key = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const live = new Set(state.courses.filter(c => !c.deleted).map(c => key(c.title)));
    let added = 0;
    additions.forEach(c => { if (live.has(key(c.title)) || state.courses.some(x => +x.num === +c.num)) return;
      const bloc_id = state.blocs.some(b => b.id === c.bloc) ? c.bloc : (state.blocs[0] || {}).id;
      const row = { id: uuid(), user_id: user.id, num: c.num, title: c.title, bloc_id, hours: +c.hours || 0,
        hours_verified: false, url: c.url || null, objective: c.objective || null, skills: c.skills || [], why: c.why || null,
        flag: c.flag || null, status: 'a_faire', progress_pct: 0, started_at: null, completed_at: null, notes: null,
        sort_order: c.sort_order || c.num, deleted: false, updated_at: nowISO() };
      write('courses', row, { silent: true }); live.add(key(c.title)); added++;
    });
    if (added) await flush();
  }
  if (pulled && v2Ready && applyAutoPatches()) await flush();
  const n = dedupe();                       // rattrape les doublons déjà créés
  if (n) { await flush(); toast(t('dedup.done', { n: fmtN(n) })); }
  subscribe();
  render();
  maybeMigrate();
}

boot();

if ('serviceWorker' in navigator)
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
