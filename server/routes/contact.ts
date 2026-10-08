import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../services/config.js';
import type { MailService } from '../services/mail.js';
import { mailTemplates } from '../services/mail.js';
import { contactSchema, sanitize, type ContactBody } from '../schemas/contact.js';
export type Verify = (token: string) => Promise<boolean>;
export function turnstileVerifier(config: AppConfig): Verify {
  return async token => {
    if (!config.turnstileSecret || !config.turnstileSiteKey) return true;
    if (!token) return false;
    try {
      const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:config.turnstileSecret,response:token}),signal:AbortSignal.timeout(5000)});
      const payload=await response.json() as {success?:boolean};
      return response.ok && payload.success===true;
    } catch { return false; }
  };
}
export async function contactRoutes(app: FastifyInstance,config: AppConfig,mailer: MailService,verify: Verify): Promise<void> {
  app.post<{Body:ContactBody}>('/api/contact',{schema:contactSchema,config:{rateLimit:{max:config.limit,timeWindow:'1 hour'}},onRequest:async(request,reply) => {
    const origin=request.headers.origin;
    if (!origin || !config.allowedOrigins.has(origin)) return reply.code(403).send({error:'request_failed'});
  }},async(request,reply) => {
    if (request.body.website) return reply.code(202).send({status:'accepted'});
    const body=sanitize(request.body);
    if (![body.nombre,body.apellido,body.empresa,body.mensaje].every(Boolean) || /[\r\n]/.test(body.email)) return reply.code(400).send({error:'request_failed'});
    if (!await verify(body.turnstileToken || '')) return reply.code(400).send({error:'request_failed'});
    if (!config.smtp.host || !config.smtp.username || !config.smtp.password || !config.smtp.from || !config.smtp.recipients.length) return reply.code(503).send({error:'request_failed'});
    try {
      for (const message of mailTemplates(body,config)) await mailer.sendMail(message);
      request.log.info({event:'contact_delivery',requestId:request.id,status:'sent'});
      return reply.send({status:'sent'});
    } catch {
      request.log.error({event:'contact_delivery',requestId:request.id,status:'failed'});
      return reply.code(502).send({error:'request_failed'});
    }
  });
}
