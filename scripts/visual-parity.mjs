/** Compare source captures against Fastify at three original responsive sizes. */
import { chromium } from 'playwright';
import { readFile, mkdir, writeFile, open, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { buildApp } from '../server/app.ts';
const root=resolve('.');const out=resolve(process.env.PARITY_OUTPUT || '../audit/visual');await mkdir(out,{recursive:true});
const routes=JSON.parse(await readFile('src/data/routes.json','utf8')).filter(page=>page.source==='zip' && (!process.env.PARITY_ROUTE || page.route===process.env.PARITY_ROUTE));
const types={'.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'};
const app=await buildApp();
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
for(const width of process.env.PARITY_ROUTE ? [1440] : [1440,768,390]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'no-preference'});
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.pathname.startsWith('/assets/vendor/')) {
   try { return await route.fulfill({path:join(root,'public',u.pathname),headers:{'Access-Control-Allow-Origin':'*'},contentType:types[u.pathname.slice(u.pathname.lastIndexOf('.'))]||'application/octet-stream'}); } catch { return route.abort(); }
  }
  if(u.pathname.endsWith('.mp4')) {
   const path=join(root,'public',decodeURIComponent(u.pathname));
   try {
    const info=await stat(path);const requested=route.request().headers().range || 'bytes=0-';
    const start=Number(requested.match(/bytes=(\d+)/)?.[1] || 0);const end=Math.min(start+1024*1024-1,info.size-1);
    const file=await open(path);const buffer=Buffer.alloc(end-start+1);await file.read(buffer,0,buffer.length,start);await file.close();
    return route.fulfill({status:206,headers:{'content-type':'video/mp4','accept-ranges':'bytes','content-range':`bytes ${start}-${end}/${info.size}`},body:buffer});
   } catch { return route.abort(); }
  }
  if(/googletagmanager|google-analytics|crm0003|challenges.cloudflare|www.google.com/.test(u.hostname))return route.abort();
  if(u.pathname.startsWith('/static/')){
   try{return await route.fulfill({path:join(root,'public',decodeURIComponent(u.pathname)),contentType:types[u.pathname.slice(u.pathname.lastIndexOf('.'))]||'application/octet-stream'});}catch{return route.abort();}
  }
  if(['cdnjs.cloudflare.com','ajax.googleapis.com','unpkg.com','fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'].includes(u.hostname)){
   const suffix=u.hostname==='fonts.googleapis.com'?'.css':u.pathname.slice(u.pathname.lastIndexOf('.'));
   const p=join(root,'public/assets/vendor',createHash('sha256').update(u.href).digest('hex').slice(0,16)+(suffix.includes('/')?'':suffix));
   try{return await route.fulfill({body:await readFile(p),contentType:types[suffix]||'text/css'});}catch{return route.abort();}
  }
  if(u.hostname==='127.0.0.1'&&u.port==='8001'&&u.pathname.endsWith('.html')){
   const path=join(root,'tests/reference',decodeURIComponent(u.pathname));
   let html=await readFile(path,'utf8');
   html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,script=>/tmDropbox|InsightJs/.test(script)?'':script);
   return route.fulfill({body:html,contentType:'text/html'});
  }
  if(u.hostname==='127.0.0.1'&&u.port==='8000') {
   if(route.request().resourceType()==='document') {
    const response=await app.inject({method:'GET',url:u.pathname});
    return route.fulfill({status:response.statusCode,headers:response.headers,body:response.rawPayload});
   }
   try { return await route.fulfill({path:join(root,'dist',decodeURIComponent(u.pathname)),contentType:types[u.pathname.slice(u.pathname.lastIndexOf('.'))]||'application/octet-stream'}); } catch { return route.abort(); }
  }
  return route.continue();
 });
 for(const r of routes){
  const name=(r.route==='/'?'home':r.route.slice(1).replaceAll('/','_'))+'-'+width;
  const record={route:r.route,width,errors:{source:[],astro:[]}};
  for(const variant of ['source','astro']){
   const page=await context.newPage();page.on('pageerror',error=>record.errors[variant].push(error.message));
   page.on('console',message=>{if(message.type()==='error') record.errors[variant].push(message.text());});
   await page.clock.install({time:new Date('2026-10-08T00:00:00Z')});
   await page.clock.pauseAt(new Date('2026-10-08T00:00:01Z'));
   const sourcePath=r.route==='/'?'/index.html':r.route+'/index.html';
   await page.goto('http://127.0.0.1:'+(variant==='source'?'8001'+sourcePath:'8000'+r.route),{waitUntil:'load',timeout:45000});
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));document.querySelectorAll('video').forEach(video=>video.pause());});
   await page.clock.runFor(1000);
   await page.clock.runFor(1000);
   await page.clock.runFor(1000);
   await page.screenshot({path:join(out,name+'-'+variant+'.png'),fullPage:true,animations:'disabled'});
   record[variant]={height:await page.evaluate(()=>document.documentElement.scrollHeight),h1:await page.locator('h1').count(),missingImages:await page.evaluate(()=>[...document.images].filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.src))};
   await page.close();
  }
  results.push(record);await writeFile(join(out,'results.json'),JSON.stringify(results,null,2));
  console.log('Compared',r.route,width);
 }
 await context.close();
}
await browser.close();
await app.close();
