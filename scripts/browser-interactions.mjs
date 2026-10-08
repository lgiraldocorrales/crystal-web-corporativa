/** Compare source captures against Fastify at three original responsive sizes. */
import { chromium } from 'playwright';
import { readFile, mkdir, writeFile, open, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { buildApp } from '../server/app.ts';
const root=resolve('.');const out=resolve(process.env.PARITY_OUTPUT || '../audit/visual');await mkdir(out,{recursive:true});
const routes=JSON.parse(await readFile('src/data/routes.json','utf8')).filter(page=>page.source==='zip' && (!process.env.PARITY_ROUTE || page.route===process.env.PARITY_ROUTE));
const types={'.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'};
const { loadConfig }=await import('../server/services/config.ts');
const mail=[];const config=loadConfig({CONTACT_ALLOWED_ORIGINS:'http://127.0.0.1:8000',MASTERBASE_SMTP_HOST:'smtp.test',MASTERBASE_SMTP_USERNAME:'test',MASTERBASE_SMTP_PASSWORD:'test',MASTERBASE_FROM_EMAIL:'contact@crystal.test',MASTERBASE_INTERNAL_RECIPIENTS:'one@crystal.test,two@crystal.test'});
const app=await buildApp({config,mailer:{async sendMail(message){mail.push(message);}}});
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
const checks=[];
for(const [width,motion] of [[1440,"no-preference"],[390,"no-preference"],[390,"reduce"]]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:motion});
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
   if(route.request().resourceType()==='document' || u.pathname==='/api/contact') {
    const response=await app.inject({method:route.request().method(),url:u.pathname,headers:route.request().headers(),payload:route.request().postData() || undefined});
    return route.fulfill({status:response.statusCode,headers:response.headers,body:response.rawPayload});
   }
   try { return await route.fulfill({path:join(root,'dist',decodeURIComponent(u.pathname)),contentType:types[u.pathname.slice(u.pathname.lastIndexOf('.'))]||'application/octet-stream'}); } catch { return route.abort(); }
  }
  return route.continue();
 });

 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/',{waitUntil:'load'});
 await page.waitForTimeout(300);
 await page.keyboard.press('Tab');
 const skip=await page.locator('.skip-link').evaluate(e=>e===document.activeElement);
 if(!skip)throw new Error('Skip link is not first keyboard destination');
 if(width===390){
  await page.locator('.sidenav-trigger:visible').click();
  await page.waitForTimeout(400);
  const submenu=page.locator('#mobile-demo #submenu1');await submenu.focus();await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  if(!await page.locator('#mobile-demo #sobre').isVisible())throw new Error('Mobile hierarchy inaccessible from keyboard');
  const language=page.locator('#mobile-demo button[value="en"]');await language.click();await page.waitForLoadState('load');
  if(await page.locator('html').getAttribute('lang')!=='en')throw new Error('Mobile English selection failed');
 }
 if(motion==='reduce'){
  await page.goto('http://127.0.0.1:8000/BusinessUnits');await page.waitForTimeout(400);
  const readSlides=()=>[...document.querySelectorAll('.slider')].map(e=>window.M.Slider.getInstance(e)?.activeIndex);
  const before=await page.evaluate(readSlides);await page.waitForTimeout(3000);const after=await page.evaluate(readSlides);
  const active=JSON.stringify(before)!==JSON.stringify(after);
  const playing=await page.evaluate(()=>[...document.querySelectorAll('video')].filter(e=>!e.paused).length);
  if(active||playing)throw new Error('Reduced motion still autoplays');
 }
 for(const [contactRoute,expected] of [['/ServicioAlCliente','Mensaje enviado'],['/CustomerService','Message sent']]){
  await page.goto('http://127.0.0.1:8000'+contactRoute);await page.locator('#dirigido').selectOption('Hilanderia');
  for(const [id,value] of Object.entries({nombre:'Lucas',apellido:'Giraldo',email:'visitor@example.com',empresa:'Crystal',mensaje:'Browser form verification'}))await page.locator('#'+id).fill(value);
  await page.locator('#datosPers').check({force:true});const previous=mail.length;
  await page.locator('#form-button').click();await page.waitForFunction(text=>document.querySelector('#contact-status')?.textContent===text,expected);
  if(mail.length!==previous+2)throw new Error('Browser form did not deliver internal mail and confirmation');
 }
 if(errors.length)throw new Error(errors.join('; '));
 checks.push({width,motion,skipLinkFirst:true,mobileKeyboardMenu:width===390,mobileLanguageSwitch:width===390,autoplayDisabled:motion==='reduce',contactSpanishAndEnglish:true,runtimeErrors:errors});
 await page.close();await context.close();
}
await browser.close();await app.close();await writeFile('docs/browser-interactions.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));
