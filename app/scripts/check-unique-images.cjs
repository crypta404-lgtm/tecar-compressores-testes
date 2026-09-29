const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const crypto=require("node:crypto");
const base=process.env.TECAR_BASE_URL||"http://127.0.0.1:4173";
const routes=["/","/empresa","/produtos","/compressores","/secadores","/linhas-de-ar","/acessorios","/safety-air","/servicos","/manutencao","/engenharia","/locacao","/tecar-connect","/diagnostico","/trabalhe-conosco"];
const out=process.env.TECAR_QA_OUTPUT||"/tmp/tecar-unique-qa";
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
 const errors=[],assets=new Map(),snapshots=[];
 page.on("pageerror",e=>errors.push(e.message));
 async function scan(route){
  await page.locator("main img").evaluateAll(imgs=>imgs.forEach(i=>i.loading="eager"));
  await page.waitForFunction(()=>[...document.querySelectorAll("main img")].every(i=>i.complete),{},{timeout:25000});
  const imgs=await page.locator("main img").evaluateAll(imgs=>imgs.map(i=>({
   src:i.currentSrc||i.src,alt:i.alt,loaded:i.naturalWidth>0,
   owner:i.closest(".v2-product-cards")?"product:"+document.querySelector(".v2-product-explorer-head h2").textContent+":"+i.alt:i.closest(".tc-motion")?"motion":i.alt,
   visible:!!(i.offsetWidth&&i.offsetHeight)&&getComputedStyle(i).visibility!=="hidden"
  })).filter(i=>i.visible&&!/logo/i.test(i.src)));
  const local=new Set();
  for(const i of imgs){
   assert.ok(i.loaded,route+" broken image "+i.src);
   assert.ok(!local.has(i.src),route+" duplicated image in same view "+i.src);local.add(i.src);
   const owner=route+"::"+i.owner,prior=assets.get(i.src);
   assert.ok(!prior||prior.owner===owner,"Image reused: "+i.src+" "+prior?.owner+" / "+owner);
   assets.set(i.src,{owner,alt:i.alt});
  }
  snapshots.push({route,images:imgs.length});
 }
 try{
  for(const route of routes){
   await page.goto(base+route,{waitUntil:"networkidle"});
   await scan(route);
   const tabs=page.locator(".v2-product-tabs>button");
   for(let t=1;t<await tabs.count();t++){await tabs.nth(t).click();await scan(route);}
   const cards=page.locator(".v2-product-cards>button");
   for(let p=0;p<await cards.count();p++){
    await cards.nth(p).click();await page.locator(".v2-product-detail").waitFor();
    assert.equal(await page.locator(".v2-product-detail img").count(),0,"Detail duplicates catalog image");
    assert.ok(await page.locator(".v2-product-detail h2").innerText());
    await page.getByRole("button",{name:"Fechar resumo",exact:true}).click();
   }
   if(["/empresa","/manutencao","/locacao","/safety-air","/servicos","/produtos","/diagnostico"].includes(route))await page.screenshot({path:out+"/"+route.slice(1)+"-desktop.png",fullPage:route==="/servicos"});
  }
  const byteHashes=new Map();
  for(const [src,item] of assets){
   const response=await page.request.get(src);assert.ok(response.ok(),"asset HTTP "+src);
   const hash=crypto.createHash("sha256").update(await response.body()).digest("hex");
   assert.ok(!byteHashes.has(hash),"Identical bytes under different URLs: "+src+" / "+byteHashes.get(hash));
   byteHashes.set(hash,src);
  }
  await page.setViewportSize({width:390,height:844});
  for(const route of ["/empresa","/compressores","/servicos","/locacao","/diagnostico"]){
   await page.goto(base+route,{waitUntil:"networkidle"});
   await page.screenshot({path:out+"/"+route.slice(1)+"-mobile.png"});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"overflow "+route);
  }
  assert.equal(errors.length,0,errors.join("; "));
  const report={uniqueContentImages:assets.size,snapshots,errors,assets:[...assets].map(([src,item])=>({src,...item})),catalogDetails:"passed"};
  fs.writeFileSync(out+"/results.json",JSON.stringify(report,null,2));
  console.log(JSON.stringify({uniqueContentImages:assets.size,views:snapshots.length,errors,catalogDetails:"passed"}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
