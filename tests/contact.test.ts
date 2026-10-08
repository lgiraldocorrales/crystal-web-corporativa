import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../server/app.js';
import { loadConfig } from '../server/services/config.js';
import type { Mail } from '../server/services/mail.js';
const config=loadConfig({CONTACT_ALLOWED_ORIGINS:'https://www.crystal.com.co',MASTERBASE_SMTP_HOST:'smtp.test',MASTERBASE_SMTP_USERNAME:'test',MASTERBASE_SMTP_PASSWORD:'test',MASTERBASE_FROM_EMAIL:'contact@crystal.test',MASTERBASE_INTERNAL_RECIPIENTS:'one@crystal.test,two@crystal.test'});
const body={nombre:'Lucas',apellido:'Giraldo',email:'visitor@example.com',empresa:'Crystal',mensaje:'Mensaje de prueba <script>alert(1)</script>',dirigido:'Hilanderia',idioma:'es',datosPers:true,website:'',turnstileToken:''};
const headers={origin:'https://www.crystal.com.co'};
test('health works independently of SMTP',async()=>{
  const app=await buildApp({config:loadConfig({})});
  try { const r=await app.inject({method:'GET',url:'/health'});assert.equal(r.statusCode,200);assert.deepEqual(r.json(),{status:'ok'}); } finally { await app.close(); }
});
test('mock SMTP receives all source fields, two recipients, HTML and text and localized confirmation',async()=>{
  const mail:Mail[]=[];const app=await buildApp({config,mailer:{async sendMail(message){mail.push(message);}}});
  try {
    const r=await app.inject({method:'POST',url:'/api/contact',headers,payload:body});assert.equal(r.statusCode,200);assert.equal(mail.length,2);assert.deepEqual(mail[0]!.to,config.smtp.recipients);assert.match(mail[0]!.text,/Apellido: Giraldo/);assert.match(mail[0]!.text,/Hilanderia/);assert.match(mail[0]!.html,/&lt;script&gt;/);assert.equal(mail[0]!.replyTo,body.email);assert.match(mail[1]!.text,/Recibimos/);
  } finally { await app.close(); }
});
test('origin, invalid fields, consent, oversized bodies, honeypot and rate limit',async()=>{
  let count=0;const app=await buildApp({config:{...config,limit:8},mailer:{async sendMail(){count++;}}});
  try {
    for (const origin of [undefined,'https://evil.example']) assert.equal((await app.inject({method:'POST',url:'/api/contact',headers:origin?{origin}:{},payload:body})).statusCode,403);
    for (const payload of [{...body,email:'bad'},{...body,datosPers:false},{...body,nombre:'x'.repeat(31)},{...body,unexpected:'x'}]) assert.equal((await app.inject({method:'POST',url:'/api/contact',headers,payload})).statusCode,400);
    assert.equal((await app.inject({method:'POST',url:'/api/contact',headers,payload:{...body,mensaje:'x'.repeat(34000)}})).statusCode,413);
    const trap=await app.inject({method:'POST',url:'/api/contact',headers,payload:{...body,website:'bot'}});assert.equal(trap.statusCode,202);assert.equal(count,0);
    // Validation failures consume rate-limit slots; separate app below proves exact window limit.
  } finally { await app.close(); }
  const limited=await buildApp({config:{...config,limit:2},mailer:{async sendMail(){}}});
  try { for(let i=0;i<2;i++)assert.equal((await limited.inject({method:'POST',url:'/api/contact',headers,payload:body})).statusCode,200);assert.equal((await limited.inject({method:'POST',url:'/api/contact',headers,payload:body})).statusCode,429); } finally { await limited.close(); }
});
test('verification and SMTP failures return generic errors without secrets',async()=>{
  const invalid=await buildApp({config,verify:async()=>false,mailer:{async sendMail(){throw Error('secret');}}});
  try {assert.equal((await invalid.inject({method:'POST',url:'/api/contact',headers,payload:body})).statusCode,400);}finally{await invalid.close();}
  const failing=await buildApp({config,mailer:{async sendMail(){throw Error('secret');}}});
  try {const r=await failing.inject({method:'POST',url:'/api/contact',headers,payload:body});assert.equal(r.statusCode,502);assert.deepEqual(r.json(),{error:'request_failed'});}finally{await failing.close();}
});
test('missing production configuration fails without printing values',()=>{assert.throws(()=>loadConfig({NODE_ENV:'production'}),/Required production configuration is missing/);});
