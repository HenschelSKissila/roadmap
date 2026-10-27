import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql = q => execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport:{width:1500,height:1000} });
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let fail=0; const ok=(n,c,d='')=>{console.log(`  ${c?'✓':'✗'} ${n}${d?' — '+d:''}`); if(!c) fail++;};

await p.addInitScript(()=>localStorage.setItem('rm.lang.v1',JSON.stringify('fr')));
await p.goto('http://localhost:8765/?e2e=1',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
await p.fill('#email','a@b.com'); await p.fill('#pwd','motdepasse');
await p.locator('#btnUp').click(); await p.waitForTimeout(6000);

console.log('\n─── 1. amorçage écrit bien en base ───');
ok('cours',        sql('select count(*) from courses')==='147',   sql('select count(*) from courses')+' lignes');
ok('blocs',        sql('select count(*) from blocs')==='11',      sql('select count(*) from blocs'));
ok('réglages',     sql('select count(*) from settings')==='1');
ok('engagements',  sql('select count(*) from projects')==='3',    sql('select count(*) from projects'));
ok('jalons',       sql('select count(*) from milestones')==='33', sql('select count(*) from milestones'));
ok('liens cours',  sql('select count(*) from project_courses')==='25', sql('select count(*) from project_courses'));
ok('modules',      sql('select count(*) from modules')==='16',    sql('select count(*) from modules'));
ok("file d'attente vide", await p.evaluate(()=>JSON.parse(localStorage.getItem(outboxKey())||'[]').length)===0,
   'reste '+await p.evaluate(()=>JSON.parse(localStorage.getItem(outboxKey())||'[]').length));
ok('aucune erreur de sync', await p.evaluate(()=>lastError)==='', await p.evaluate(()=>lastError));

console.log('\n─── 2. mise à jour partielle : cocher un cours ───');
await p.locator('nav.tabs button[data-tab=list]').click(); await p.waitForTimeout(600);
await p.locator('#tab-list .tri').first().click(); await p.waitForTimeout(400);
await p.locator('#tab-list .tri').first().click(); await p.waitForTimeout(1200);
ok('statut écrit en base', sql("select count(*) from courses where status='termine'")==='1',
   sql("select status||' '||progress_pct from courses where status='termine'"));
ok('titre préservé', sql("select title from courses where status='termine'").length>5,
   sql("select title from courses where status='termine'").slice(0,44));
ok('pas d\'erreur', await p.evaluate(()=>lastError)==='', await p.evaluate(()=>lastError));

console.log('\n─── 3. jalon, engagement, module, heures ───');
await p.locator('nav.tabs button[data-tab=projects]').click(); await p.waitForTimeout(600);
await p.locator('#tab-projects .card').first().click(); await p.waitForTimeout(600);
await p.locator('.sheet [data-ms]').first().click(); await p.waitForTimeout(1200);
ok('jalon coché en base', sql('select count(*) from milestones where done')==='1');
await p.fill('.sheet #wH','12'); await p.fill('.sheet #wA','TwinCAT');
await p.locator('.sheet #wAdd').click(); await p.waitForTimeout(1200);
ok('heure saisie en base', sql('select count(*) from work_hours')==='1', sql('select hours||\' h\' from work_hours'));
await p.locator('.sheet #pSt').selectOption('en_cours');
await p.locator('.sheet #pOk').click(); await p.waitForTimeout(1200);
ok('statut engagement en base', sql("select count(*) from projects where status='en_cours'")==='1');
ok('code engagement préservé', sql("select code from projects where status='en_cours'")==='hiwi');

await p.locator('nav.tabs button[data-tab=grades]').click(); await p.waitForTimeout(600);
await p.locator('#tab-grades [data-mod]').first().click(); await p.waitForTimeout(500);
await p.fill('.sheet #gN','1.7'); await p.locator('.sheet #gOk').click(); await p.waitForTimeout(1200);
ok('note module en base', sql("select grade from modules where code='ATP'")==='1.7', sql("select grade from modules where code='ATP'"));

console.log('\n─── 4. suppression douce et déliage ───');
await p.locator('nav.tabs button[data-tab=projects]').click(); await p.waitForTimeout(500);
await p.locator('#tab-projects .card').first().click(); await p.waitForTimeout(600);
await p.locator('.sheet [data-unlink]').first().click(); await p.waitForTimeout(1200);
ok('lien supprimé en base', sql('select count(*) from project_courses')==='24', sql('select count(*) from project_courses'));

console.log('\n─── 5. état final ───');
const q = await p.evaluate(()=>JSON.parse(localStorage.getItem(outboxKey())||'[]').length);
ok("file d'attente vide", q===0, 'reste '+q);
ok('lastError vide', await p.evaluate(()=>lastError)==='', await p.evaluate(()=>lastError));
ok('aucune exception JS', errs.length===0, errs.join(' | '));
console.log('\n══ ' + (fail? fail+' TEST(S) EN ÉCHEC':'TOUS LES TESTS PASSENT') + ' ══');
await b.close(); process.exit(fail?1:0);
