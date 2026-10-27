/* Quatrième suite : collision d'identifiants entre comptes (erreur RLS vue par
   hks), boutons de suppression, réinitialisation d'usine, alertes groupées. */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql = q => execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
const wipe = () => sql('truncate courses,blocs,settings,study_log,projects,milestones,project_courses,work_hours,modules cascade');
const A = '22222222-2222-4222-8222-222222222222';
const B = '33333333-3333-4333-8333-333333333333';

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fail = 0; const ok = (n, c, d = '') => { console.log(`  ${c ? '✓' : '✗'} ${n}${d ? ' — ' + d : ''}`); if (!c) fail++; };
const errs = [];
async function newPage() {
  const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => localStorage.setItem('rm.lang.v1', JSON.stringify('fr')));
  return p;
}
async function signUp(p) {
  await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.fill('#email', 'a@b.com'); await p.fill('#pwd', 'motdepasse');
  await p.locator('#btnUp').click(); await p.waitForTimeout(6000);
}

/* ═══ 1. cache marqué à un autre compte : on repart proprement ═══════════ */
wipe();
console.log('\n─── 1. changement de compte : le cache ne suit pas ───');
let p = await newPage();
await signUp(p);
ok('amorçage sous le compte A', sql(`select count(*) from modules where user_id='${A}'`) === '16');
// second compte sur le même appareil, cache de A correctement marqué
await p.evaluate(() => localStorage.setItem('stub.uid', '33333333-3333-4333-8333-333333333333'));
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(7000);
ok('aucune erreur de synchronisation', await p.evaluate(() => lastError) === '', await p.evaluate(() => lastError));
ok('file vidée', await p.evaluate(() => JSON.parse(localStorage.getItem(outboxKey()) || '[]').length) === 0);
ok('B a son propre catalogue', sql(`select count(*) from courses where user_id='${B}'`) === '147',
   sql(`select count(*) from courses where user_id='${B}'`));
ok('les données de A sont intactes', sql(`select count(*) from courses where user_id='${A}'`) === '147');
ok('cache rangé sous le compte', await p.evaluate(() => localStorage.getItem('rm.cache.v1') === null && !!localStorage.getItem(cacheKey())));
await p.context().close();

/* ═══ 2. cache hérité sans marque : réattribution des identifiants ═══════ */
wipe();
console.log("\n─── 2. file héritée d'un autre compte : identifiant réattribué ───");
p = await newPage();
await signUp(p);
// l'état exact de hks : une modification de module restée EN FILE, dont
// l'identifiant appartient à un autre compte ; cache global sans propriétaire
const oldId = await p.evaluate(() => state.modules[0].id);
await p.evaluate(() => {
  const own = JSON.parse(localStorage.getItem('rm.owner.v1'));
  const m = { ...state.modules[0], code: 'ZZ-TEST', grade: 4.0 }; delete m._s;   // code unique : dedupe() n'y touche pas
  localStorage.setItem('rm.cache.v1', localStorage.getItem('rm.cache.v1.' + own));
  localStorage.setItem('rm.outbox.v1', JSON.stringify([{ table: 'modules', row: m, _id: 'x1', _ts: '' }]));
  localStorage.removeItem('rm.cache.v1.' + own);
  localStorage.removeItem('rm.outbox.v1.' + own);
  localStorage.removeItem('rm.owner.v1');
  localStorage.setItem('stub.uid', '33333333-3333-4333-8333-333333333333');
});
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(7000);
ok('aucune erreur résiduelle', await p.evaluate(() => lastError) === '', await p.evaluate(() => lastError));
ok('file vidée', await p.evaluate(() => JSON.parse(localStorage.getItem(outboxKey()) || '[]').length) === 0,
   String(await p.evaluate(() => JSON.parse(localStorage.getItem(outboxKey()) || '[]').length)));
ok('la modification en file est arrivée sous B', sql(`select count(*) from modules where user_id='${B}' and grade=4.0`) === '1',
   sql(`select count(*) from modules where user_id='${B}' and grade=4.0`));
ok("le module de A n'a pas bougé", sql(`select count(*) from modules where user_id='${A}' and grade=4.0`) === '0');
ok('identifiant réattribué', sql(`select count(*) from modules where user_id='${B}' and id='${oldId}'`) === '0' &&
   sql(`select count(*) from modules where user_id='${A}' and id='${oldId}'`) === '1');
ok('aucune ligne de A perdue', sql(`select count(*) from modules where user_id='${A}'`) === '16');
ok("les autres lignes de A ne sont pas copiées chez B", sql(`select count(*) from courses where user_id='${B}' and id in (select id from courses where user_id='${A}')`) === '0');
await p.context().close();

/* ═══ 3. suppressions ════════════════════════════════════════════════════ */
wipe();
console.log('\n─── 3. boutons de suppression ───');
p = await newPage();
await signUp(p);
// engagement
await p.locator('nav.tabs button[data-tab=projects]').click(); await p.waitForTimeout(600);
p.once('dialog', d => d.accept());
await p.locator('#tab-projects .card[data-p]').first().click(); await p.waitForTimeout(600);
const pid = await p.evaluate(() => projectsAll()[0].id);
await p.locator('.sheet #pDel').click(); await p.waitForTimeout(2500);
ok('engagement supprimé en base', sql('select count(*) from projects') === '2', sql('select count(*) from projects'));
ok('jalons supprimés en cascade', sql(`select count(*) from milestones where project_id='${pid}'`) === '0');
ok('liens supprimés en cascade', sql(`select count(*) from project_courses where project_id='${pid}'`) === '0');
ok('disparu de l\'écran', await p.evaluate(() => state.projects.length) === 2);
// nouvel engagement
await p.locator('#pAdd').click(); await p.waitForTimeout(1800);
await p.locator('.sheet [data-x]').click(); await p.waitForTimeout(800);
ok('nouvel engagement créé', sql('select count(*) from projects') === '3', sql('select count(*) from projects'));
// bloc
await p.locator('nav.tabs button[data-tab=settings]').click(); await p.waitForTimeout(700);
const before = +sql("select count(*) from courses where bloc_id='b9'");
await p.locator('#tab-blocs .blocrow[data-b=b9] [data-ed]').click(); await p.waitForTimeout(500);
p.once('dialog', d => d.accept());
await p.locator('.sheet #bDel').click(); await p.waitForTimeout(3000);
ok('bloc supprimé en base', sql("select count(*) from blocs where id='b9'") === '0');
ok('aucun cours perdu', sql('select count(*) from courses') === '147', sql('select count(*) from courses'));
ok('cours replacés ailleurs', sql("select count(*) from courses where bloc_id='b9'") === '0', before + ' déplacé(s)');
ok('pas d\'erreur', await p.evaluate(() => lastError) === '', await p.evaluate(() => lastError));

/* ═══ 4. doublons ════════════════════════════════════════════════════════ */
console.log('\n─── 4. bouton « supprimer les doublons » ───');
await p.evaluate(() => {
  const m = state.modules[0];
  write('modules', { ...m, id: uuid() });
  const pr = state.projects[0];
  write('projects', { ...pr, id: uuid() });
});
await p.waitForTimeout(2500);
ok('doublons bien créés', sql('select count(*) from modules') === '17' && sql('select count(*) from projects') === '4',
   sql('select count(*) from modules') + ' modules, ' + sql('select count(*) from projects') + ' engagements');
await p.locator('nav.tabs button[data-tab=settings]').click(); await p.waitForTimeout(600);
await p.locator('#dd').click(); await p.waitForTimeout(3000);
ok('doublons supprimés en base', sql('select count(*) from modules') === '16' && sql('select count(*) from projects') === '3',
   sql('select count(*) from modules') + ' modules, ' + sql('select count(*) from projects') + ' engagements');
ok('pas d\'erreur', await p.evaluate(() => lastError) === '', await p.evaluate(() => lastError));

/* ═══ 5. alertes groupées ════════════════════════════════════════════════ */
console.log('\n─── 5. une alerte par jalon, pas une par cours ───');
await p.evaluate(() => {
  const pr = projectsAll().find(x => linksOf(x).length >= 4 && msOf(x).length);
  const d = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  msOf(pr).forEach(m => write('milestones', { id: m.id, project_id: m.project_id, done: false, due_date: d }, { silent: true }));
  linksOf(pr).slice(0, 4).forEach(l => write('project_courses',
    { project_id: l.project_id, course_id: l.course_id, relevance: 'indispensable' }, { silent: true }));
  render();
});
await p.waitForTimeout(1500);
await p.locator('nav.tabs button[data-tab=week]').click(); await p.waitForTimeout(800);
const al = await p.evaluate(() => [...document.querySelectorAll('#tab-week .card.wide .alert')].map(x => x.textContent.trim()));
// une ligne par jalon en alerte, quel que soit le nombre de cours concernés
const jalons = await p.evaluate(() => {
  const R = RULES();
  return projectsAll().filter(p => {
    if (p.status === 'termine') return false;
    const m = nextMilestone(p); if (!m || !m.due_date || daysTo(m.due_date) > R.alertDays) return false;
    return linkedCourses(p).some(x => x.link.relevance === 'indispensable' && x.course.status !== 'termine');
  }).length;
});
ok('une ligne par jalon, pas une par cours', al.length === jalons, al.length + ' ligne(s) pour ' + jalons + ' jalon(s)');
const grouped = al.find(x => /,/.test(x));
ok('la ligne groupée liste bien les cours', !!grouped && /^\d+ cours indispensables/.test(grouped) && grouped.split('»,').length >= 2, (grouped || al[0] || '').slice(0, 110));

/* ═══ 6. réinitialisation d'usine ════════════════════════════════════════ */
console.log("\n─── 6. réinitialisation d'usine ───");
await p.locator('nav.tabs button[data-tab=settings]').click(); await p.waitForTimeout(600);
await p.locator('#rz').click(); await p.waitForTimeout(500);
await p.fill('.sheet #rzW', 'nimporte');
await p.locator('.sheet #rzOk').click(); await p.waitForTimeout(800);
ok('mot de confirmation exigé', sql('select count(*) from courses') === '147', sql('select count(*) from courses'));
const idBefore = await p.evaluate(() => state.courses[0].id);
await p.fill('.sheet #rzW', 'EFFACER');
await p.locator('.sheet #rzOk').click(); await p.waitForTimeout(1100);
ok('données effacées en base', sql('select count(*) from courses') === '0' && sql('select count(*) from modules') === '0',
   sql('select count(*) from courses') + ' cours, ' + sql('select count(*) from modules') + ' modules');
await p.waitForTimeout(9000);          // rechargement + réamorçage
ok('catalogue réinstallé', sql('select count(*) from courses') === '147', sql('select count(*) from courses'));
ok('lignes réellement neuves', sql(`select count(*) from courses where id='${idBefore}'`) === '0');
ok('engagements réinstallés', sql('select count(*) from projects') === '3', sql('select count(*) from projects'));
ok('progression repartie de zéro', sql("select count(*) from courses where status<>'a_faire'") === '0');
ok('pas d\'erreur', await p.evaluate(() => lastError) === '', await p.evaluate(() => lastError));

ok('aucune exception JS', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();
console.log('\n══ ' + (fail ? fail + ' ÉCHEC(S)' : 'SUPPRESSIONS, RÉINITIALISATION ET RLS : OK') + ' ══');
process.exit(fail ? 1 : 0);
