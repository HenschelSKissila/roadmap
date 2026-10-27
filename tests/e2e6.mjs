/* Sixième suite : un compte, trois appareils.
   Ce que hks a constaté : téléphone et PC connectés au même compte n'affichent
   pas les mêmes notes (60/78 CP contre 27/78). Chaque « appareil » est ici un
   contexte de navigateur séparé, avec son propre stockage local. */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql = q => execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
sql('truncate courses,blocs,settings,study_log,projects,milestones,project_courses,work_hours,modules cascade');

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fail = 0; const ok = (n, c, d = '') => { console.log(`  ${c ? '✓' : '✗'} ${n}${d ? ' — ' + d : ''}`); if (!c) fail++; };
const errs = [];
async function device(name) {
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(name + ': ' + e.message));
  await p.addInitScript(() => localStorage.setItem('rm.lang.v1', JSON.stringify('fr')));
  await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.fill('#email', 'hks@uni-bremen.de'); await p.fill('#pwd', 'motdepasse');
  await p.locator('#btnUp').click(); await p.waitForTimeout(6500);
  return p;
}
const sync = p => p.evaluate(() => (typeof syncNow === 'function' ? syncNow(true) : pull()).then(() => new Promise(r => setTimeout(r, 600))));
// ce que l'écran « Noten » affiche, réduit à une empreinte comparable
const view = p => p.evaluate(() => {
  const mods = state.modules.filter(m => !m.deleted).map(m => m.code + ':' + m.status + ':' + m.grade).sort();
  const cp = maConditions()[0].val;
  return JSON.stringify({ cp, mods, projects: state.projects.map(x => x.code).sort(),
    ms: state.milestones.filter(m => !m.deleted).length, links: state.plinks.length,
    courses: state.courses.filter(c => !c.deleted).length });
});
const cpOf = async p => JSON.parse(await view(p)).cp;

console.log('\n─── 1. deux appareils se connectent au même compte ───');
const A = await device('PC');
const B = await device('téléphone');
ok('une seule installation en base', sql('select count(*) from courses') === '147' && sql('select count(*) from projects') === '3',
   sql('select count(*) from courses') + ' cours, ' + sql('select count(*) from projects') + ' engagements');
ok('les deux affichent la même chose', await view(A) === await view(B));

console.log('\n─── 2. une modification sur le PC arrive sur le téléphone ───');
await A.evaluate(() => { const m = state.modules.find(x => x.code === 'LEA'); write('modules', { id: m.id, grade: 1.0 }); });
await A.waitForTimeout(1500); await sync(B);
ok('téléphone : note LEA reçue', await B.evaluate(() => state.modules.find(m => m.code === 'LEA').grade) === 1);
ok('PC et téléphone : 60 / 78 CP', await cpOf(B) === '60 / 78 CP' && await cpOf(A) === '60 / 78 CP', await cpOf(B) + ' · ' + await cpOf(A));

console.log('\n─── 3. une suppression sur le PC disparaît du téléphone ───');
await A.evaluate(() => { const p = projByCode('projekt');
  state.milestones = state.milestones.filter(x => x.project_id !== p.id);
  state.plinks = state.plinks.filter(x => x.project_id !== p.id);
  remove('projects', { id: p.id }); });
await A.waitForTimeout(1500); await sync(B);
ok('engagement supprimé en base', sql('select count(*) from projects') === '2');
ok('…et sur le téléphone', await B.evaluate(() => state.projects.length) === 2,
   (await B.evaluate(() => state.projects.map(p => p.code).join(', '))));
ok('ses jalons aussi', await B.evaluate(() => state.milestones.filter(m => !m.deleted).length) === +sql('select count(*) from milestones'),
   await B.evaluate(() => state.milestones.length) + ' contre ' + sql('select count(*) from milestones') + ' en base');
ok("pas pris pour une ligne « orpheline »", await B.evaluate(() => Object.values(orphans()).flat().length) === 0);

console.log('\n─── 4. hors ligne sur le téléphone, puis retour du réseau ───');
await B.context().setOffline(true); await B.waitForTimeout(300);
await B.evaluate(() => { const m = state.modules.find(x => x.code === 'NLS'); write('modules', { id: m.id, grade: 1.7 }); });
await B.waitForTimeout(800);
ok('modification gardée en file hors ligne', await B.evaluate(() => outbox().length) >= 1, await B.evaluate(() => outbox().length) + ' en attente');
ok('rien en base pour l\'instant', sql("select grade from modules where code='NLS'") === '1');
// pendant ce temps, le PC modifie autre chose
await A.evaluate(() => { const m = state.modules.find(x => x.code === 'CTh3'); write('modules', { id: m.id, grade: 1.3 }); });
await A.waitForTimeout(1200);
await B.context().setOffline(false); await B.waitForTimeout(4500);   // l'événement « online » suffit
ok('file vidée au retour du réseau', await B.evaluate(() => outbox().length) === 0, await B.evaluate(() => outbox().length) + ' restant');
ok('la note du téléphone est en base', sql("select grade from modules where code='NLS'") === '1.7',
   sql("select grade from modules where code='NLS'"));
ok('le téléphone a reçu celle du PC', await B.evaluate(() => state.modules.find(m => m.code === 'CTh3').grade) === 1.3);
await sync(A);
ok('les deux appareils identiques', await view(A) === await view(B));

console.log('\n─── 5. « la base a-t-elle changé ? » ───');
const t0 = await B.evaluate(() => lastPullAt);
await B.evaluate(() => { lastSyncTry = 0; return syncNow(); }); await B.waitForTimeout(500);
ok('rien de changé : pas de téléchargement', await B.evaluate(() => lastPullAt) === t0);
await A.evaluate(() => { const m = state.modules.find(x => x.code === 'ATP'); write('modules', { id: m.id, notes: 'modifié sur le PC' }); });
await A.waitForTimeout(1500);
await B.evaluate(() => { lastSyncTry = 0; return syncNow(); }); await B.waitForTimeout(500);
ok('changement détecté : téléchargement', await B.evaluate(() => lastPullAt) > t0);
ok('et la modification est là', await B.evaluate(() => state.modules.find(m => m.code === 'ATP').notes) === 'modifié sur le PC');

console.log("\n─── 6. une ligne jamais envoyée n'est ni perdue ni imposée ───");
// le téléphone garde un module que le serveur n'a jamais reçu (file vidée à la main, par exemple)
await B.evaluate(() => {
  localApply('modules', { id: uuid(), code: 'MPC(a)', title: 'Model Predictive Control',
    type: 'W', cp: 6, graded: true, grade: 2.7, status: 'valide', count_in_final: true, notes: null,
    sort_order: 999, deleted: false, updated_at: nowISO() });
});
await sync(B);
ok('mis de côté, pas effacé', await B.evaluate(() => (orphans().modules || []).length) === 1);
await B.locator('nav.tabs button[data-tab=settings]').click(); await B.waitForTimeout(600);
ok('Réglages le signale', await B.locator('#orS').count() === 1);
await B.locator('#orS').click(); await B.waitForTimeout(2500);
ok('envoyé en base sur demande', sql("select count(*) from modules where code='MPC(a)'") === '1');
await sync(A);
ok('le PC le reçoit', await A.evaluate(() => state.modules.some(m => m.code === 'MPC(a)')));

console.log('\n─── 7. un troisième appareil ───');
const C = await device('tablette');
await sync(A); await sync(B);
const [va, vb, vc] = [await view(A), await view(B), await view(C)];
ok('PC = téléphone = tablette', va === vb && vb === vc, JSON.parse(vc).cp + ' · ' + JSON.parse(vc).mods.length + ' modules');
ok('toujours une seule installation', sql('select count(*) from courses') === '147' && sql('select count(*) from modules') === '17',
   sql('select count(*) from courses') + ' cours, ' + sql('select count(*) from modules') + ' modules');

console.log('\n─── 8. caches d\'une version antérieure, déjà divergents ───');
// on refabrique l'état de hks : le PC garde des lignes sans marque de synchronisation
// dont une copie en double d'un module déjà en base, et une vraie ligne jamais envoyée
await A.evaluate(() => {
  const dup = { ...state.modules.find(m => m.code === 'DS(a)'), id: uuid() };
  const lone = { id: uuid(), code: 'SAMS', title: 'Sensor and Mesurement Systems', type: 'W', cp: 6, graded: true,
    grade: 3.3, status: 'valide', count_in_final: true, notes: null, sort_order: 998, deleted: false, updated_at: nowISO() };
  state.modules.forEach(m => delete m._s);
  state.modules.push(dup, lone); saveCacheNow();
});
await A.reload({ waitUntil: 'networkidle' }); await A.waitForTimeout(6000);
const orph = await A.evaluate(() => (orphans().modules || []).map(m => m.code));
ok("la copie en double n'est pas proposée", !orph.includes('DS(a)'), orph.join(', '));
ok('la vraie ligne jamais envoyée est proposée', orph.includes('SAMS'), orph.join(', '));
ok("l'écran suit la base, pas le cache", await view(A) === await view(C));

console.log('\n─── 9. état final ───');
for (const [n, p] of [['PC', A], ['téléphone', B], ['tablette', C]]) {
  ok(n + ' : file vide, aucune erreur', await p.evaluate(() => outbox().length === 0 && !lastError),
     await p.evaluate(() => outbox().length + ' / ' + lastError));
}
ok('aucune exception JS', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();
console.log('\n══ ' + (fail ? fail + ' ÉCHEC(S)' : 'UN COMPTE, TROIS APPAREILS : OK') + ' ══');
process.exit(fail ? 1 : 0);
