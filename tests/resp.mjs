import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
let fail=0; const errs=[];
const sizes=[['téléphone',390,844],['tablette 12" P',1024,1366],['tablette 12" L',1366,1024],
             ['portable',1512,945],['écran 27"',2560,1440],['écran 43"',3840,2160]];
let first=true;
for (const [nm,w,h] of sizes) for (const L of ['fr','de','en']) {
  const ctx=await b.newContext({viewport:{width:w,height:h}});
  const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(`${nm}/${L}: ${e.message}`));
  await p.addInitScript(l=>localStorage.setItem('rm.lang.v1',JSON.stringify(l)),L);
  await p.goto(`http://localhost:8765/?x=${w}${L}`,{waitUntil:'networkidle'}); await p.waitForTimeout(700);
  await p.fill('#email','a@b.com'); await p.fill('#pwd','motdepasse');
  await p.locator('#btnUp').click(); await p.waitForTimeout(first?6000:2500); first=false;
  let maxOv=0;
  for (const tab of ['week','projects','list','dash','grades','settings']) {
    await p.locator(`nav.tabs button[data-tab=${tab}]`).click(); await p.waitForTimeout(280);
    const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    if(ov>maxOv) maxOv=ov;
  }
  const bad = maxOv>0;
  if(bad) fail++;
  if(L==='de') console.log(`  ${bad?'✗':'✓'} ${nm.padEnd(16)} ${String(w).padStart(4)}px  débordement max = ${maxOv}px  (6 onglets × fr/de/en)`);
  await ctx.close();
}
console.log(`\n  exceptions JS : ${errs.length?errs.slice(0,3).join(' | '):'aucune'}`);
console.log('══ ' + (fail?fail+' CONFIGURATION(S) EN DÉBORDEMENT':'AUCUN DÉBORDEMENT SUR 18 CONFIGURATIONS') + ' ══');
await b.close(); process.exit(fail?1:0);
