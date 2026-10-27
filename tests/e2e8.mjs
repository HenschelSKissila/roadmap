/* Huitième suite : nettoyage du catalogue (correctif auto), blocs repliés, tri et filtres. */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql = q => execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
sql('truncate courses,blocs,settings,study_log,projects,milestones,project_courses,work_hours,modules cascade');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fail = 0; const ok = (n, c, d = '') => { console.log(`  ${c ? '✓' : '✗'} ${n}${d ? ' — ' + d : ''}`); if (!c) fail++; };
const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { if (!localStorage.getItem('rm.lang.v1')) localStorage.setItem('rm.lang.v1', JSON.stringify('fr')); });
await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
await p.fill('#email', 'a@b.com'); await p.fill('#pwd', 'motdepasse'); await p.locator('#btnUp').click(); await p.waitForTimeout(7000);

console.log('\n─── installation neuve ───');
ok('11 blocs dont « Langues & rédaction »', sql('select count(*) from blocs') === '11' && sql("select count(*) from blocs where id='b10'") === '1');
ok('aucun non-cours', sql("select count(*) from courses where flag='non-cours'") === '0');
ok('langues + rédaction dans b10', sql("select string_agg(num::text, ',' order by num) from courses where bloc_id='b10'") === '279,307,308');

console.log('\n─── compte existant (ancien catalogue) → correctif automatique ───');
const U = sql('select user_id from blocs limit 1');
sql("update courses set bloc_id='b9' where num in (307,308)");
sql("update courses set bloc_id='b6' where num=279");
sql("delete from blocs where id='b10'");
sql(`insert into courses (user_id,num,title,bloc_id,flag) values ('${U}',309,'Proteus Professional v8.16 (logiciel, pas un cours)','b9','non-cours'),('${U}',310,'Siemens SIMATIC Step 7 / TIA Portal — Order Coupon','b9','non-cours')`);
// un deuxième appareil, cache vide : il découvre l'ancien état puis applique le correctif
const p2 = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
p2.on('pageerror', e => errs.push(e.message));
await p2.addInitScript(() => { if (!localStorage.getItem('rm.lang.v1')) localStorage.setItem('rm.lang.v1', JSON.stringify('fr')); });
await p2.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p2.waitForTimeout(500);
await p2.fill('#email', 'a@b.com'); await p2.fill('#pwd', 'motdepasse'); await p2.locator('#btnUp').click(); await p2.waitForTimeout(7000);
ok('bloc b10 recréé en base', sql("select count(*) from blocs where id='b10'") === '1');
ok('cours déplacés dans b10', sql("select string_agg(num::text, ',' order by num) from courses where bloc_id='b10'") === '279,307,308');
ok('non-cours supprimés (doux)', sql("select count(*) from courses where flag='non-cours' and not deleted") === '0'
  && sql("select count(*) from courses where flag='non-cours' and deleted") === '2');
ok('rien d\'autre supprimé', sql('select count(*) from courses where not deleted') === '147', sql('select count(*) from courses where not deleted'));
ok('pas de doublon de bloc', sql('select count(*) from blocs') === '11');
const q2 = await p2.evaluate(() => JSON.parse(localStorage.getItem(outboxKey()) || '[]').length);
ok('file d\'attente vide', q2 === 0, q2 + '');
// le premier appareil récupère le correctif sans le rejouer
await p.evaluate(() => syncNow(true)); await p.waitForTimeout(2500);
ok('appareil 1 à jour', await p.evaluate(() => state.blocs.some(b => b.id === 'b10') && !alive().some(c => c.flag === 'non-cours')));
await p.evaluate(() => applyAutoPatches()); await p.waitForTimeout(800);
ok('correctif non rejoué', sql('select count(*) from blocs') === '11' && sql('select count(*) from courses where not deleted') === '147');

console.log('\n─── cours du dossier ajoutés (correctif catalogue-ajouts) ───');
ok('installation neuve : 147 cours dont 401 à 412', sql('select count(*) from courses where num between 401 and 412 and not deleted') === '12');
// retour à l'ancien catalogue : ajouts absents, anciens titres ; #306 renommé par l'utilisateur
sql('delete from courses where num between 401 and 412');
sql("update courses set title='Siemens G120 & G120C — AC VFD', hours=3, hours_verified=false, flag='à acquérir' where num=93");
sql("update courses set title='Python for Deep Learning', hours=5 where num=296");
sql("update courses set title='Master German with 900 Real-Life Conversations', hours=10 where num=307");
sql("update courses set title='Mon titre à moi' where num=306");
const p3 = await (await b.newContext({ viewport: { width: 1024, height: 768 } })).newPage();
p3.on('pageerror', e => errs.push(e.message));
await p3.addInitScript(() => { if (!localStorage.getItem('rm.lang.v1')) localStorage.setItem('rm.lang.v1', JSON.stringify('fr')); });
await p3.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p3.waitForTimeout(500);
await p3.fill('#email', 'a@b.com'); await p3.fill('#pwd', 'motdepasse'); await p3.locator('#btnUp').click(); await p3.waitForTimeout(7000);
ok('12 cours ajoutés en base', sql('select count(*) from courses where num between 401 and 412 and not deleted') === '12');
ok('SCL Part 1 dans « Différenciation », avant la Part 2', sql("select bloc_id||':'||sort_order from courses where num=406") === 'b3:35'
  && +sql('select sort_order from courses where num=255') > 35);
ok('G120 : titre, 1,2 h vérifiée, plus « à acquérir »', sql("select title||'|'||hours||'|'||hours_verified||'|'||coalesce(flag,'-') from courses where num=93")
  === 'Siemens G120 & G120C — AC VFD Driver Training|1.2|true|-', sql("select title||'|'||hours||'|'||hours_verified||'|'||coalesce(flag,'-') from courses where num=93"));
ok('PyTorch 17 h', sql("select title||'|'||hours from courses where num=296") === 'PyTorch for Deep Learning with Python Bootcamp|17');
ok('allemand : 800 conversations', /800 Real-Life/.test(sql('select title from courses where num=307')));
ok('titre renommé par toi conservé', sql('select title from courses where num=306') === 'Mon titre à moi');
ok('total 147 cours actifs', sql('select count(*) from courses where not deleted') === '147', sql('select count(*) from courses where not deleted'));
ok('pas d\'erreur de sync', await p3.evaluate(() => lastError) === '', await p3.evaluate(() => lastError));
await p3.evaluate(() => applyAutoPatches()); await p3.waitForTimeout(800);
ok('correctif non rejoué', sql('select count(*) from courses where num between 401 and 412') === '12');
// suppression d'un ajout : il ne revient pas
await p3.evaluate(() => { const c = alive().find(c => c.num === 406); write('courses', { id: c.id, deleted: true }); });
await p3.waitForTimeout(1200); await p3.evaluate(() => applyAutoPatches()); await p3.waitForTimeout(800);
ok('un ajout supprimé ne revient pas', sql('select count(*) from courses where num=406 and not deleted') === '0');
await p3.evaluate(() => { const c = state.courses.find(c => c.num === 406); write('courses', { id: c.id, deleted: false }); });
await p3.waitForTimeout(1200);
await p.evaluate(() => syncNow(true)); await p.waitForTimeout(2500);

console.log('\n─── blocs repliés ───');
await p.locator('nav.tabs button[data-tab=list]').click(); await p.waitForTimeout(600);
const folded = () => p.evaluate(() => [...document.querySelectorAll('#tab-list .bloc-h.folded [data-fold]')].map(e => e.dataset.fold));
ok('b9 et b10 repliés par défaut', JSON.stringify(await folded()) === '["b9","b10"]', JSON.stringify(await folded()));
const inB10 = () => p.evaluate(() => alive().filter(c => c.bloc_id === 'b10').filter(c => document.querySelector(`#tab-list .c[data-id="${c.id}"]`)).length);
ok('leurs cours ne sont pas listés', await inB10() === 0);
ok('note « 3 cours masqués »', await p.evaluate(() => /3 cours masqués/.test(document.querySelector('#tab-list .folded-note[data-fold=b10]').textContent)));
await p.locator('#tab-list .bloc-h [data-fold=b10]').click(); await p.waitForTimeout(400);
ok('déplier b10 affiche ses 3 cours', await inB10() === 3);
ok('choix mémorisé sur l\'appareil', await p.evaluate(() => JSON.parse(localStorage.getItem('rm.ui.v1') || '{}').fold?.b10 === false
  || Object.values(localStorage).some(v => /"fold":\{[^}]*"b10":false/.test(v))));
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
await p.locator('nav.tabs button[data-tab=list]').click(); await p.waitForTimeout(600);
ok('toujours déplié après rechargement', await inB10() === 3);
await p.locator('#tab-list .bloc-h [data-fold=b10]').click(); await p.waitForTimeout(400);
ok('replié à nouveau', await inB10() === 0);
// un cours en cours d'un bloc replié reste visible en tête
await p.evaluate(() => { const c = alive().find(c => c.num === 307); write('courses', { id: c.id, status: 'en_cours', progress_pct: 20, started_at: '2026-09-20' }); });
await p.waitForTimeout(600);
ok('cours en cours d\'un bloc replié affiché en tête', await p.evaluate(() => !!document.querySelector('#tab-list .clist.pinned .c[data-id="' + alive().find(c => c.num === 307).id + '"]')));

console.log('\n─── recherche ───');
await p.fill('#q', 'German'); await p.waitForTimeout(500);
ok('la recherche ouvre les blocs repliés', await p.evaluate(() => document.querySelectorAll('#tab-list .bloc-h.folded').length) === 0);
await p.fill('#q', '#258'); await p.waitForTimeout(500);
const r258 = await p.evaluate(() => [...document.querySelectorAll('#tab-list .c')].map(e => state.courses.find(c => c.id === e.dataset.id).num));
ok('recherche par numéro « #258 »', JSON.stringify(r258) === '[258]', JSON.stringify(r258));
await p.fill('#q', 'CAO électrique'); await p.waitForTimeout(500);
ok('recherche par nom de bloc', await p.evaluate(() => [...document.querySelectorAll('#tab-list .c')].every(e => state.courses.find(c => c.id === e.dataset.id).bloc_id === 'b8')
  && document.querySelectorAll('#tab-list .c').length > 5));
ok('bouton « Effacer les filtres » visible', await p.locator('#fReset').isVisible());
await p.locator('#fReset').click(); await p.waitForTimeout(400);
ok('filtres effacés', await p.evaluate(() => ui.q === '' && ui.bloc === 'all' && ui.sort === 'prio') && !(await p.locator('#fReset').count()));

console.log('\n─── tri ───');
await p.evaluate(() => { const a = alive().filter(c => c.status === 'a_faire' && c.bloc_id === 'b2');
  write('courses', { id: a[0].id, status: 'termine', progress_pct: 100, completed_at: '2026-09-21' }); });
await p.waitForTimeout(500);
await p.selectOption('#fSort', 'left'); await p.waitForTimeout(500);
const flat = await p.evaluate(() => [...document.querySelectorAll('#tab-list .clist.flat .c')].map(e => { const c = state.courses.find(x => x.id === e.dataset.id); return { h: hoursLeft([c]), s: c.status, b: c.bloc_id }; }));
const todo = flat.filter(x => x.s !== 'termine');
ok('liste à plat triée par temps restant', todo.every((x, i) => !i || todo[i - 1].h <= x.h) && flat.length > 100, flat.length + ' cours');
ok('cours terminés en fin de liste', flat.findIndex(x => x.s === 'termine') >= todo.length);
ok('blocs repliés exclus + note', !flat.some(x => x.b === 'b9' || x.b === 'b10') && await p.evaluate(() => /blocs repliés/.test(document.querySelector('#tab-list .folded-note').textContent)));
await p.selectOption('#fSort', 'recent'); await p.waitForTimeout(500);
ok('tri « modifiés récemment » : le cours terminé en premier', await p.evaluate(() => state.courses.find(c => c.id === document.querySelector('#tab-list .clist.flat .c').dataset.id).status === 'termine'));
await p.selectOption('#fSort', 'prio'); await p.waitForTimeout(400);
ok('retour au tri par bloc', await p.evaluate(() => document.querySelectorAll('#tab-list .clist.flat').length === 0 && document.querySelectorAll('#tab-list .bloc-h').length >= 9));

console.log('\n─── langues ───');
for (const [l, re] of [['en', /Languages & writing/], ['de', /Sprachen & Schreiben/]]) {
  await p.evaluate(l => { localStorage.setItem('rm.lang.v1', JSON.stringify(l)); }, l);
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  await p.locator('nav.tabs button[data-tab=list]').click(); await p.waitForTimeout(500);
  ok(`bloc b10 traduit (${l})`, re.test(await p.locator('#tab-list').textContent()));
}

console.log('\n─── état final ───');
ok('aucune exception JS', errs.length === 0, errs.join(' | '));
console.log(fail ? `\n══ ${fail} ÉCHEC(S) ══` : '\n══ TOUS LES TESTS PASSENT ══');
await b.close(); process.exit(fail ? 1 : 0);
