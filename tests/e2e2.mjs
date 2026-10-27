import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql=q=>execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
let fail=0; const ok=(n,c,d='')=>{console.log(`  ${c?'✓':'✗'} ${n}${d?' — '+d:''}`); if(!c)fail++;};
const ctx=await b.newContext({viewport:{width:1500,height:1000}});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>localStorage.setItem('rm.lang.v1',JSON.stringify('fr')));
await p.goto('http://localhost:8765/?a=1',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
await p.fill('#email','a@b.com'); await p.fill('#pwd','motdepasse');
await p.locator('#btnUp').click(); await p.waitForTimeout(6000);

console.log('\n─── critères d\'acceptation du brief v2 ───');
await p.locator('nav.tabs button[data-tab=grades]').click(); await p.waitForTimeout(600);
const g=await p.evaluate(()=>[...document.querySelectorAll('#tab-grades .kpi')].slice(0,2).map(x=>x.querySelector('.v').textContent));
ok('moyenne confirmée = 1,84', g[0]==='1,84', g[0]);
ok('projection = 1,61', g[1]==='1,61', g[1]);
const chk=await p.evaluate(()=>[...document.querySelectorAll('#tab-grades .chk')].map(c=>c.querySelector('i').className));
ok('checklist §6(2) : ✗✗✓✓✗', chk.join(',')==='no,no,ok,ok,no', chk.join(','));

// 36 h -> contrat complet
await p.locator('nav.tabs button[data-tab=projects]').click(); await p.waitForTimeout(500);
await p.locator('#tab-projects .card').first().click(); await p.waitForTimeout(600);
await p.fill('.sheet #wH','36'); await p.locator('.sheet #wAdd').click(); await p.waitForTimeout(1500);
const st=await p.evaluate(()=>[...document.querySelectorAll('.sheet .kpi .s')].map(x=>x.textContent).join('|'));
ok('36 h -> contrat complet', st.includes('Contrat complet'), st.slice(0,60));
ok('36 h en base', sql('select sum(hours) from work_hours')==='36.00'||sql('select sum(hours) from work_hours')==='36', sql('select sum(hours) from work_hours'));
await p.locator('.sheet [data-x]').click(); await p.waitForTimeout(300);

// cours prioritaires réactifs
await p.locator('nav.tabs button[data-tab=week]').click(); await p.waitForTimeout(600);
// l'écran suit l'engagement dont le prochain jalon tombe le plus tôt
const focusOf=()=>p.evaluate(()=>{const u=urgentProject();
  return ((u&&u.project.code)||'—')+' · '+(([...document.querySelectorAll('#tab-week .ttl')].map(x=>x.textContent)[0])||'—');});
const before=await focusOf();
await p.evaluate(()=>{const h=state.projects.find(x=>x.code==='hiwi');
  // les autres jalons datés sont repoussés : le test ne dépend plus de la date du jour
  const far=new Date(); far.setDate(far.getDate()+90);
  state.milestones.filter(m=>m.project_id!==h.id&&m.due_date).forEach(m=>write('milestones',{id:m.id,project_id:m.project_id,due_date:far.toISOString().slice(0,10)},{silent:true}));
  const m=msOf(h)[0]; const d=new Date(); d.setDate(d.getDate()+1);
  write('milestones',{id:m.id,project_id:h.id,due_date:d.toISOString().slice(0,10)});});
await p.waitForTimeout(1500);
const after=await focusOf();
ok('3 cours prioritaires réactifs', before!==after && after.startsWith('hiwi'),
   `${before.slice(0,34)} -> ${after.slice(0,34)}`);
ok('jalon daté en base', sql("select count(*) from milestones where due_date is not null")>='6');

// hors-ligne -> file -> retour réseau
console.log('\n─── hors-ligne, file d\'attente, reprise ───');
await ctx.setOffline(true);
await p.locator('nav.tabs button[data-tab=list]').click(); await p.waitForTimeout(500);
await p.locator('#tab-list .tri').nth(1).click(); await p.waitForTimeout(200);
await p.locator('#tab-list .tri').nth(2).click(); await p.waitForTimeout(800);
const qOff=await p.evaluate(()=>JSON.parse(localStorage.getItem(outboxKey())||'[]').length);
ok('modifications mises en file hors-ligne', qOff>=2, qOff+' en attente');
await ctx.setOffline(false);
await p.evaluate(()=>dispatchEvent(new Event('online'))); await p.waitForTimeout(2500);
const qOn=await p.evaluate(()=>JSON.parse(localStorage.getItem(outboxKey())||'[]').length);
ok('file vidée au retour du réseau', qOn===0, qOn+' restant');
ok('les 2 cours sont en base', sql("select count(*) from courses where status<>'a_faire'")>='2',
   sql("select count(*) from courses where status<>'a_faire'"));

// import / export
console.log('\n─── export / import ───');
const exp=await p.evaluate(()=>{const o=exportObj();return {b:o.blocs.length,c:o.courses.length};});
ok('export JSON complet', exp.c===147 && exp.b===11, JSON.stringify(exp));
ok('aucune exception JS', errs.length===0, errs.slice(0,2).join(' | '));
console.log('\n══ ' + (fail? fail+' ÉCHEC(S)':'TOUS LES CRITÈRES PASSENT') + ' ══');
await b.close(); process.exit(fail?1:0);
