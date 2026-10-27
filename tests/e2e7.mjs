/* Septième suite : les cours « en cours » s'affichent en tête (Kurse et Cette semaine). */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql = q => execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
sql('truncate courses,blocs,settings,study_log,projects,milestones,project_courses,work_hours,modules cascade');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fail = 0; const ok = (n, c, d = '') => { console.log(`  ${c ? '✓' : '✗'} ${n}${d ? ' — ' + d : ''}`); if (!c) fail++; };
const p = await (await b.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => localStorage.setItem('rm.lang.v1', JSON.stringify('fr')));
await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
await p.fill('#email', 'a@b.com'); await p.fill('#pwd', 'motdepasse'); await p.locator('#btnUp').click(); await p.waitForTimeout(7000);

console.log('\n─── cours en cours affichés en tête ───');
// deux cours commencés, pris loin dans la liste ; le second touché en dernier
const ids = await p.evaluate(async () => {
  const pick = alive().filter(c => c.status === 'a_faire').slice(-2);
  write('courses', { id: pick[0].id, status: 'en_cours', progress_pct: 30, started_at: '2026-09-01' });
  await new Promise(r => setTimeout(r, 30));
  write('courses', { id: pick[1].id, status: 'en_cours', progress_pct: 60, started_at: '2026-09-10' });
  return pick.map(c => c.id);
});
await p.waitForTimeout(1500);
await p.locator('nav.tabs button[data-tab=list]').click(); await p.waitForTimeout(600);
const first = await p.evaluate(() => [...document.querySelectorAll('#tab-list .clist')][0].classList.contains('pinned'));
ok('la première section de « Cours » est « En cours »', first);
const order = await p.evaluate(() => [...document.querySelectorAll('#tab-list .clist.pinned .c')].map(e => e.dataset.id));
ok('les deux cours y sont', order.length === 2, order.length + ' cours');
ok('le plus récemment touché en premier', order[0] === ids[1]);
const dup = await p.evaluate(ids => ids.map(id => document.querySelectorAll(`#tab-list .c[data-id="${id}"]`).length), ids);
ok('pas répétés plus bas dans leur bloc', dup.every(n => n === 1), dup.join(','));
ok('le bloc est indiqué sur chaque ligne', await p.evaluate(() => document.querySelectorAll('#tab-list .clist.pinned .tag .chip').length) === 2);
const head = await p.evaluate(() => document.querySelector('#tab-list .bloc-h.pin').textContent.replace(/\s+/g, ' ').trim());
ok('en-tête avec le nombre et les heures restantes', /2 cours/.test(head) && /restantes/.test(head), head);

console.log('\n─── écran « Cette semaine » ───');
await p.locator('nav.tabs button[data-tab=week]').click(); await p.waitForTimeout(600);
const wk = await p.evaluate(() => { const c = document.querySelector('#tab-week .card'); return { h: c.querySelector('h2').textContent, n: c.querySelectorAll('.c').length }; });
ok('première carte : « En cours »', wk.h === 'En cours' && wk.n === 2, JSON.stringify(wk));
await p.locator('#tab-week .clist.pinned .c [data-act=cycle]').first().click(); await p.waitForTimeout(1200);
ok('le bouton termine le cours depuis l’accueil', sql(`select status from courses where id='${ids[1]}'`) === 'termine');
ok('la carte se met à jour', await p.evaluate(() => document.querySelectorAll('#tab-week .clist.pinned .c').length) === 1);

console.log('\n─── filtre « À faire » : pas de section en cours ───');
await p.locator('nav.tabs button[data-tab=list]').click(); await p.waitForTimeout(400);
await p.locator('#tab-list [data-st=a_faire]').click(); await p.waitForTimeout(400);
ok('section absente quand on filtre « À faire »', await p.locator('#tab-list .clist.pinned').count() === 0);
await p.locator('#tab-list [data-st=all]').click();
ok('aucune exception JS', errs.length === 0, errs.slice(0, 2).join(' | '));
await b.close();
console.log('\n══ ' + (fail ? fail + ' ÉCHEC(S)' : 'COURS EN COURS EN TÊTE : OK') + ' ══');
process.exit(fail ? 1 : 0);
