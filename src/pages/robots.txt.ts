import type { APIRoute } from 'astro';
export const GET: APIRoute = () => new Response('User-agent: *\nAllow: /\nSitemap: '+(import.meta.env.PUBLIC_SITE_URL || 'https://www.crystal.com.co')+'/sitemap.xml\n',{headers:{'Content-Type':'text/plain'}});
