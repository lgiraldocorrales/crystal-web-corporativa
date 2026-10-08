export interface AppConfig {
  port: number;
  production: boolean;
  siteUrl: string;
  allowedOrigins: Set<string>;
  limit: number;
  smtp: { host: string; port: number; username: string; password: string; from: string; recipients: string[] };
  turnstileSecret: string;
  turnstileSiteKey: string;
}
const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const integer = (key: string, fallback: number, max: number): number => {
    const value = Number(env[key] || fallback);
    if (!Number.isInteger(value) || value < 1 || value > max) throw new Error(`Invalid configuration: ${key}`);
    return value;
  };
  const list = (key: string): string[] => (env[key] || '').split(',').map(value => value.trim()).filter(Boolean);
  const production = env.NODE_ENV === 'production';
  const smtp = { host:env.MASTERBASE_SMTP_HOST || '',port:integer('MASTERBASE_SMTP_PORT',587,65535),username:env.MASTERBASE_SMTP_USERNAME || '',password:env.MASTERBASE_SMTP_PASSWORD || '',from:env.MASTERBASE_FROM_EMAIL || '',recipients:list('MASTERBASE_INTERNAL_RECIPIENTS') };
  const origins = list('CONTACT_ALLOWED_ORIGINS');
  for (const origin of origins) {
    let parsed: URL;
    try { parsed = new URL(origin); } catch { throw new Error('Invalid configuration: CONTACT_ALLOWED_ORIGINS'); }
    if (parsed.origin !== origin || !['http:','https:'].includes(parsed.protocol)) throw new Error('Invalid configuration: CONTACT_ALLOWED_ORIGINS');
  }
  if ((smtp.from && !email.test(smtp.from)) || smtp.recipients.some(recipient => !email.test(recipient))) throw new Error('Invalid SMTP address configuration');
  if (production && (!smtp.host || !smtp.username || !smtp.password || !smtp.from || !smtp.recipients.length || !origins.length || !env.PUBLIC_SITE_URL)) throw new Error('Required production configuration is missing');
  return { port:integer('PORT',8000,65535),production,siteUrl:env.PUBLIC_SITE_URL || 'http://localhost:8000',allowedOrigins:new Set(origins),limit:integer('CONTACT_MAX_REQUESTS_PER_HOUR',8,10000),smtp,turnstileSecret:env.TURNSTILE_SECRET_KEY || '',turnstileSiteKey:env.PUBLIC_TURNSTILE_SITE_KEY || '' };
}
