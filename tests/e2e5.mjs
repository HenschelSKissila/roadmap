/* Cinquième suite : application d'un correctif « roadmap-patch-v2 »
   (remplacement de la Masterarbeit IAT par celle de l'IALB). */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql = q => execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
sql('truncate courses,blocs,settings,study_log,projects,milestones,project_courses,work_hours,modules cascade');
const PATCH = process.env.PATCH || '/mnt/user-data/outputs/masterarbeit-ialb.json';

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fail = 0; const ok = (n, c, d = '') => { console.log(`  ${c ? '✓' : '✗'} ${n}${d ? ' — ' + d : ''}`); if (!c) fail++; };
const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 } });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => localStorage.setItem('rm.lang.v1', JSON.stringify('fr')));
await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
await p.fill('#email', 'a@b.com'); await p.fill('#pwd', 'motdepasse');
await p.locator('#btnUp').click(); await p.waitForTimeout(7000);

console.log("\n─── 1. on remet l'ancienne Masterarbeit IAT en base ───");
await p.evaluate(() => {
  const pr = projByCode('masterarbeit');
  write('projects', { id: pr.id, title: 'Masterarbeit + Kolloquium', institute: 'IAT',
    supervisor: null, topic: null, notes: 'Note : 75 % mémoire, 25 % Kolloquium.' }, { silent: true });
  msOf(pr).forEach(m => remove('milestones', { id: m.id }, { silent: true }));
  ['Recherche bibliographique', "Plan de travail validé par l'encadrant", 'Implémentation',
   'Évaluation des résultats', 'Rédaction', 'Dépôt du mémoire', 'Kolloquium']
    .forEach((title, i) => write('milestones', { id: uuid(), project_id: pr.id, title,
      due_date: null, done: false, done_at: null, sort_order: (i + 1) * 10, deleted: false }, { silent: true }));
  flush();
});
await p.waitForTimeout(3000);
const MA = () => sql("select id from projects where code='masterarbeit'");
ok('engagement IAT en place', sql("select institute from projects where code='masterarbeit'") === 'IAT');
ok('7 anciens jalons', sql(`select count(*) from milestones where project_id='${MA()}'`) === '7',
   sql(`select count(*) from milestones where project_id='${MA()}'`));
const coursesBefore = sql('select count(*) from courses');

console.log('\n─── 2. import du correctif ───');
await p.locator('nav.tabs button[data-tab=settings]').click(); await p.waitForTimeout(600);
await p.locator('#imp').setInputFiles(PATCH); await p.waitForTimeout(6000);

const id = MA();
ok('aucun engagement en double', sql('select count(*) from projects') === '3', sql('select count(*) from projects'));
ok('institut devenu IALB', sql("select institute from projects where code='masterarbeit'") === 'IALB',
   sql("select institute from projects where code='masterarbeit'"));
ok('encadrant renseigné', sql("select supervisor from projects where code='masterarbeit'") === 'Prof. Dr.-Ing. Amir Ebrahimi',
   sql("select supervisor from projects where code='masterarbeit'"));
ok('titre remplacé', /Reglerentwicklung/.test(sql("select title from projects where code='masterarbeit'")),
   sql("select title from projects where code='masterarbeit'").slice(0, 60));
ok('sujet renseigné', +sql("select length(topic) from projects where code='masterarbeit'") > 50,
   sql("select length(topic) from projects where code='masterarbeit'") + ' caractères');
ok('contact dans les notes', sql("select position('ebrahimi@ialb' in notes) from projects where code='masterarbeit'") !== '0');
ok("le correctif Masterarbeit ne touche pas au Projekt", /MPC/.test(sql("select coalesce(topic,'') from projects where code='projekt'")));

ok('15 jalons, pas 22', sql(`select count(*) from milestones where project_id='${id}'`) === '15',
   sql(`select count(*) from milestones where project_id='${id}'`));
ok('premier jalon daté au 24/09', sql(`select title||' | '||coalesce(due_date::text,'-') from milestones where project_id='${id}' order by sort_order limit 1`)
   === 'Répondre à Prof. Ebrahimi | 2026-09-24',
   sql(`select title||' | '||coalesce(due_date::text,'-') from milestones where project_id='${id}' order by sort_order limit 1`));
ok('dernier jalon = Kolloquium', sql(`select title from milestones where project_id='${id}' order by sort_order desc limit 1`) === 'Kolloquium');
ok('aucun ancien jalon restant', sql(`select count(*) from milestones where project_id='${id}' and title='Implémentation'`) === '0');

ok('8 liens de cours', sql(`select count(*) from project_courses where project_id='${id}'`) === '8',
   sql(`select count(*) from project_courses where project_id='${id}'`));
ok('4 indispensables', sql(`select count(*) from project_courses where project_id='${id}' and relevance='indispensable'`) === '4');
ok('le livre est bien lié', sql(`select count(*) from project_courses pc join courses c on c.id=pc.course_id
    where pc.project_id='${id}' and c.title like 'Schröder%'`) === '1');
ok('le livre n\'a pas été dupliqué', sql("select count(*) from courses where title like 'Schröder%'") === '1');
ok('aucun cours perdu ni ajouté en double', sql('select count(*) from courses') === coursesBefore,
   coursesBefore + ' → ' + sql('select count(*) from courses'));
ok('note du module NLS posée', /modes glissants/.test(sql("select coalesce(notes,'') from modules where code='NLS'")));

console.log('\n─── 3. réappliquer le même fichier ne change rien ───');
await p.locator('#imp').setInputFiles(PATCH); await p.waitForTimeout(6000);
ok('toujours 3 engagements', sql('select count(*) from projects') === '3', sql('select count(*) from projects'));
ok('toujours 15 jalons', sql(`select count(*) from milestones where project_id='${MA()}'`) === '15',
   sql(`select count(*) from milestones where project_id='${MA()}'`));
ok('toujours 8 liens', sql(`select count(*) from project_courses where project_id='${MA()}'`) === '8');
ok('toujours un seul livre', sql("select count(*) from courses where title like 'Schröder%'") === '1');

console.log("\n─── 4. application automatique au démarrage (sans import) ───");
// on remet la base dans l'état de hks : Masterarbeit IAT, 7 anciens jalons
const ma = MA();
sql(`update projects set institute='IAT', title='Masterarbeit + Kolloquium', supervisor=null, topic=null where id='${ma}'`);
sql(`delete from milestones where project_id='${ma}'`);
sql(`insert into milestones (user_id, project_id, title, sort_order) select user_id, id, t.title, t.o
     from projects, (values ('Recherche bibliographique',10),('Implémentation',20),('Rédaction',30),('Kolloquium',40)) as t(title,o)
     where id='${ma}'`);
ok('base remise en IAT', sql(`select institute from projects where id='${ma}'`) === 'IAT');
// premier appareil : il démarre, voit IAT, applique
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(7000);
ok('IALB appliqué sans rien importer', sql("select institute from projects where code='masterarbeit'") === 'IALB',
   sql("select institute from projects where code='masterarbeit'"));
ok('15 jalons en base', sql(`select count(*) from milestones where project_id='${MA()}'`) === '15',
   sql(`select count(*) from milestones where project_id='${MA()}'`));
ok("l'écran le montre", await p.evaluate(() => projByCode('masterarbeit').supervisor) === 'Prof. Dr.-Ing. Amir Ebrahimi');
// second appareil, avec un vieux cache IAT : il ne doit ni réappliquer ni garder l'ancien
const ctx2 = await b.newContext({ viewport: { width: 400, height: 850 } });
const p2 = await ctx2.newPage(); p2.on('pageerror', e => errs.push('2: ' + e.message));
await p2.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p2.waitForTimeout(500);
await p2.fill('#email', 'a@b.com'); await p2.fill('#pwd', 'motdepasse');
await p2.locator('#btnUp').click(); await p2.waitForTimeout(7000);
ok('le téléphone montre aussi IALB', await p2.evaluate(() => projByCode('masterarbeit').institute) === 'IALB');
ok('et les 15 mêmes jalons', await p2.evaluate(() => msOf(projByCode('masterarbeit')).length) === 15,
   String(await p2.evaluate(() => msOf(projByCode('masterarbeit')).length)));
ok('pas appliqué deux fois', sql(`select count(*) from milestones where project_id='${MA()}'`) === '15');
await ctx2.close();

console.log("\n─── 5. modules : tout validé sauf S3 et S4 ───");
// l'état divergent vu sur le PC : modules passés non validés, REE(a) absent,
// SAMS saisi deux fois, et EEA (S3) marqué validé par erreur
sql("update modules set status='prevu' where code in ('ATP','CTh1(a)','PAut(a)','LEA','CTh2(a)','STPA')");
sql("delete from modules where code='REE(a)'");
sql("update modules set status='valide' where code='EEA'");
sql(`insert into modules (user_id, code, title, type, cp, graded, grade, status)
     select user_id, 'SAMS', 'Sensor and Mesurement Systems', 'W', 6, true, 3.3, 'valide' from modules limit 1`);
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(7000);
const cond = await p.evaluate(() => maConditions().map(c => c.val));
ok('Mindestens 78 CP : 60 / 78', cond[0] === '60 / 78 CP', cond[0]);
ok('Wahlbereich : 18 / 24', cond[4] === '18 / 24 CP', cond[4]);
ok('Pflicht 6 / 5 · Wahlpflicht 2 / 2', cond[2] === '6 / 5' && cond[3] === '2 / 2', cond[2] + ' · ' + cond[3]);
ok('S3 pas validé', sql("select status from modules where code='EEA'") === 'provisoire');
ok('REE(a) en base, 2,7', sql("select grade from modules where code='REE(a)' and not deleted") === '2.7');
ok('SAMS une seule fois', sql("select count(*) from modules where code in ('SAMS','SAMS(a)') and not deleted") === '1');
const avg = await p.evaluate(() => gradeAvg('confirmed'));
ok('moyenne confirmée sur 9 modules / 54 CP', avg.n === 9 && avg.cp === 54, avg.n + ' modules, ' + avg.cp + ' CP, ' + (avg.avg || 0).toFixed(2));
// plus tard, il passe EEA : le correctif ne doit PAS le remettre en « voraussichtlich »
sql("update modules set status='valide' where code='NLS'");
await p.evaluate(() => { const m = state.modules.find(x => x.code === 'NLS'); m.status = 'valide'; });
const again = await p.evaluate(() => window.SEED2.patches.find(x => x.id === 'modules-valides-2026-09').when(state));
ok('pas de nouvel essai tant que rien ne cloche', again === (Date.now() < Date.parse('2026-11-01')),
   'condition = ' + again + ' (garde-fou date : S3 validé avant les examens)');

console.log("\n─── 6. Master Projekt : MPC d'un moteur biphasé ───");
// on remet l'ancien Projekt en base : titre générique, 5 jalons, anciens liens, cours MPC hors bloc
const pj = () => sql("select id from projects where code='projekt'");
sql(`update projects set title='Master Projekt', topic='Proposé : phase préparatoire', notes=null where id='${pj()}'`);
sql(`delete from milestones where project_id='${pj()}'`);
sql(`insert into milestones (user_id, project_id, title, sort_order) select user_id, id, t.x, t.o from projects,
     (values ('Sujet arrêté',10),('Inscription du Projekt',20),('Revue intermédiaire',30),('Rapport rendu',40),('Présentation',50)) as t(x,o)
     where id='${pj()}'`);
sql(`delete from project_courses where project_id='${pj()}'`);
sql("update courses set bloc_id='b3', flag='selon sujet' where num=258");
sql("update courses set bloc_id='b3' where num in (69,257)");
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(7500);
ok('titre du Projekt', /Modellprädiktive Regelung eines zweiphasigen Motors/.test(sql("select title from projects where code='projekt'")),
   sql("select title from projects where code='projekt'"));
ok('sujet : PI remplacé par MPC', /PI-Regler.*MPC-Regler/.test(sql("select topic from projects where code='projekt'")));
ok('13 jalons', sql(`select count(*) from milestones where project_id='${pj()}' and not deleted`) === '13',
   sql(`select count(*) from milestones where project_id='${pj()}' and not deleted`));
ok('premier : sujet validé ; dernier : présentation',
   sql(`select title from milestones where project_id='${pj()}' order by sort_order limit 1`).startsWith('Sujet validé') &&
   sql(`select title from milestones where project_id='${pj()}' order by sort_order desc limit 1`) === 'Présentation');
ok('10 liens, dont 5 indispensables', sql(`select count(*) from project_courses where project_id='${pj()}'`) === '10' &&
   sql(`select count(*) from project_courses where project_id='${pj()}' and relevance='indispensable'`) === '5',
   sql(`select count(*) from project_courses where project_id='${pj()}'`) + ' liens');
ok('MPC700 et PID+MPC sont indispensables', sql(`select string_agg(c.num::text, ',' order by c.num) from project_courses pc join courses c on c.id=pc.course_id
   where pc.project_id='${pj()}' and pc.relevance='indispensable'`) === '14,65,69,258,400');
ok('cours MPC rangés dans le bloc Regelungstechnik', sql("select string_agg(bloc_id, ',' order by num) from courses where num in (69,257,258)") === 'b1,b1,b1',
   sql("select string_agg(num||':'||bloc_id, ' ' order by num) from courses where num in (69,257,258)"));
ok('« selon sujet » retiré : le sujet est connu', sql("select coalesce(flag,'∅') from courses where num=258") === '∅');
ok('MPC700 reste « à acquérir »', sql("select flag from courses where num=69") === 'à acquérir');
ok('la Masterarbeit n\'a pas été touchée', sql("select institute from projects where code='masterarbeit'") === 'IALB' &&
   sql(`select count(*) from milestones where project_id='${MA()}'`) === '15');
const idsBefore = sql(`select string_agg(id::text, ',' order by id) from milestones where project_id='${pj()}'`);
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(6000);
ok('pas réappliqué au démarrage suivant', sql(`select string_agg(id::text, ',' order by id) from milestones where project_id='${pj()}'`) === idsBefore);

console.log('\n─── 7. état final ───');
ok('file vidée', await p.evaluate(() => JSON.parse(localStorage.getItem(outboxKey()) || '[]').length) === 0,
   String(await p.evaluate(() => JSON.parse(localStorage.getItem(outboxKey()) || '[]').length)));
ok('aucune erreur de sync', await p.evaluate(() => lastError) === '', await p.evaluate(() => lastError));
ok('aucune exception JS', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();
console.log('\n══ ' + (fail ? fail + ' ÉCHEC(S)' : 'CORRECTIF MASTERARBEIT IALB : OK') + ' ══');
process.exit(fail ? 1 : 0);
