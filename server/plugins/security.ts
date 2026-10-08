import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
export async function security(app: FastifyInstance,dist: string): Promise<void> {
  await app.register(helmet,{contentSecurityPolicy:false,crossOriginEmbedderPolicy:false});
  await app.register(rateLimit,{global:false,errorResponseBuilder:() => ({statusCode:429,error:'request_failed'})});
  const hashes=new Map<string,string[]>();
  async function scan(dir:string):Promise<void> {
    let files;
    try { files=await readdir(dir,{withFileTypes:true}); } catch { return; }
    for (const file of files) {
      const path=join(dir,file.name);
      if (file.isDirectory()) { await scan(path);continue; }
      if (!file.name.endsWith('.html')) continue;
      const html=await readFile(path,'utf8');const values=new Set<string>();
      for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) if (match[1]) values.add("'sha256-"+createHash('sha256').update(match[1]).digest('base64')+"'");
      // Authorize exact source event handlers without broadly enabling inline JavaScript.
      for (const match of html.matchAll(/\son[a-z]+="([^"]*)"/gi)) {
        const decoded=match[1]!.replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
        values.add("'sha256-"+createHash('sha256').update(decoded).digest('base64')+"'");
      }
      hashes.set('/'+relative(dist,path).split(sep).join('/'),[...values]);
    }
  }
  await scan(dist);
  app.addHook('onSend',async(request,reply,payload) => {
    const path=request.url.split('?')[0]!;
    const file=path.endsWith('.html')?path:path.replace(/\/$/,'')+'/index.html';
    const localized=['/openEnd','/speciality','/ringSpun'].includes(path.replace(/\/$/,'')) && /(?:^|;\s*)django_language=en(?:;|$)/.test(request.headers.cookie || '');
    const englishHome=path==='/' && /(?:^|;\s*)django_language=en(?:;|$)/.test(request.headers.cookie || '');
    const scriptHashes=hashes.get(englishHome ? '/en/index.html' : localized ? '/_localized/en'+file : file) || [];
    reply.header('Content-Security-Policy',[
      "default-src 'self'", "script-src 'self' 'unsafe-hashes' "+scriptHashes.join(' ')+" https://www.googletagmanager.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'", "font-src 'self' data:", "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
      "media-src 'self'", "connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
      "frame-src https://www.google.com https://maps.google.com https://www.googletagmanager.com https://crm0003.wolkvox.com https://challenges.cloudflare.com",
      "worker-src 'self' blob:", "base-uri 'self'", "form-action 'self'", "object-src 'none'", "frame-ancestors 'none'"
    ].join('; '));
    return payload;
  });
}
