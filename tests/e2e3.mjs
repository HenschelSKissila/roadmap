import { chromium } from 'playwright';
import { execSync } from 'child_process';
const sql=q=>execSync(`PATH=/usr/lib/postgresql/16/bin:$PATH psql -h /var/tmp -p 55432 -U postgres -tAc "${q}"`).toString().trim();
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
let fail=0; const ok=(n,c,d='')=>{console.log(`  ${c?'✓':'✗'} ${n}${d?' — '+d:''}`); if(!c)fail++;};
const ctx=await b.newContext({viewport:{width:1500,height:1000}});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>localStorage.setItem('rm.lang.v1',JSON.stringify('fr')));
await p.goto('http://localhost:8765/?r=1',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
await p.fill('#email','a@b.com'); await p.fill('#pwd','motdepasse');
await p.locator('#btnUp').click(); await p.waitForTimeout(6000);

console.log('\n─── reprise d\'une file héritée de l\'ancienne version ───');
// on fabrique exactement la situation de hks : 5 correctifs partiels bloqués
await p.evaluate(()=>{
  const cs = state.courses.slice(0,3), ms = state.milestones[0],
        pr = state.projects[0];
  const q = [
    {table:'courses', row:{id:cs[0].id, status:'termine', progress_pct:100}, _id:'1',_ts:''},
    {table:'courses', row:{id:cs[1].id, status:'en_cours', progress_pct:30}, _id:'2',_ts:''},
    {table:'courses', row:{id:cs[2].id, deleted:true}, _id:'3',_ts:''},
    {table:'milestones', row:{id:ms.id, project_id:ms.project_id, done:true}, _id:'4',_ts:''},
    {table:'projects', row:{id:pr.id, status:'en_cours'}, _id:'5',_ts:''},
  ];
  localStorage.setItem(outboxKey(), JSON.stringify(q));
});
const q0 = await p.evaluate(()=>JSON.parse(localStorage.getItem(outboxKey())).length);
ok('5 opérations partielles en file', q0===5, q0+'');
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(5000);
const q1 = await p.evaluate(()=>JSON.parse(localStorage.getItem(outboxKey())||'[]').length);
ok('file vidée après rechargement', q1===0, q1+' restant');
ok('pas d\'erreur résiduelle', await p.evaluate(()=>lastError)==='', await p.evaluate(()=>lastError));
ok('cours terminé en base', sql("select count(*) from courses where status='termine'")==='1');
ok('cours en cours en base', sql("select count(*) from courses where status='en_cours'")==='1');
ok('cours supprimé (doux) en base', sql("select count(*) from courses where deleted")==='1');
ok('jalon coché en base', sql("select count(*) from milestones where done")==='1');
ok('engagement en cours en base', sql("select count(*) from projects where status='en_cours'")==='1');
ok('titres préservés', sql("select count(*) from courses where title is null")==='0');
ok('aucune exception JS', errs.length===0, errs.slice(0,2).join(' | '));
console.log('\n══ ' + (fail? fail+' ÉCHEC(S)':'REPRISE DE FILE : OK') + ' ══');
await b.close(); process.exit(fail?1:0);
