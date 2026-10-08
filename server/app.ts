import 'dotenv/config';
import Fastify, { type FastifyError } from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadConfig, type AppConfig } from './services/config.js';
import { createMailer, type MailService } from './services/mail.js';
import { contactRoutes, turnstileVerifier, type Verify } from './routes/contact.js';
import { security } from './plugins/security.js';

export async function buildApp(options:{config?:AppConfig;mailer?:MailService;verify?:Verify;dist?:string;logging?:boolean}={}) {
  const config=options.config || loadConfig();
  const dist=options.dist || resolve('dist');
  const app=Fastify({bodyLimit:32*1024,trustProxy:(_address,hop)=>hop===0,logController:new Fastify.LogController({disableRequestLogging:true}),logger:options.logging ? {level:'info'} : false,ajv:{customOptions:{removeAdditional:false,coerceTypes:false}}});
  await security(app,dist);
  app.setErrorHandler((error,request,reply) => {
    const failure=error as FastifyError;
    const code=(failure.statusCode && failure.statusCode>=400 && failure.statusCode<500)?failure.statusCode:500;
    if (code===500) request.log.error({event:'request_failed',requestId:request.id});
    reply.code(code).send({error:'request_failed'});
  });
  app.get('/health',{schema:{response:{200:{type:'object',required:['status'],additionalProperties:false,properties:{status:{type:'string',const:'ok'}}}}}},async()=>({status:'ok'}));
  await contactRoutes(app,config,options.mailer || createMailer(config),options.verify || turnstileVerifier(config));
  app.addHook('onRequest',async(request,reply)=>{
    const path=request.url.split('?')[0]!.replace(/\/$/,'');
    const english=/(?:^|;\s*)django_language=en(?:;|$)/.test(request.headers.cookie || '');
    if (request.method==='GET' && path==='' && english) return reply.sendFile('en/index.html');
    if (request.method==='GET' && ['/openEnd','/speciality','/ringSpun'].includes(path) && english) {
      return reply.sendFile('_localized/en'+path+'/index.html');
    }
  });
  await app.register(fastifyStatic,{root:dist,index:['index.html'],redirect:false});
  app.setNotFoundHandler(async(request,reply) => {
    const pathname=request.url.split('?')[0]!;
    if (request.method==='GET' && pathname.endsWith('/index.html')) return reply.redirect(pathname.slice(0,-11) || '/',301);
    return reply.code(404).send({error:'request_failed'});
  });
  return app;
}
if (process.argv[1] && fileURLToPath(import.meta.url)===resolve(process.argv[1])) {
  try {
    const config=loadConfig();
    if (process.argv.includes('--dev')) {
      // One Node application: compile static Astro before starting the backend watcher.
      const { execFileSync }=await import('node:child_process');
      execFileSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'inherit'});
    }
    const app=await buildApp({config,logging:true});
    await app.listen({host:'0.0.0.0',port:config.port});
    for (const signal of ['SIGTERM','SIGINT'] as const) process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
  } catch {
    // Never log environment values, SMTP failures, request fields or raw errors.
    console.error('Application could not start. Check required configuration and build.');
    process.exitCode=1;
  }
}
