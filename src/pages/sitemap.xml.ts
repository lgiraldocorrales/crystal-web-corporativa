import type { APIRoute } from 'astro';
import routes from '../data/routes.json';
export const GET: APIRoute = () => {
  const site = (import.meta.env.PUBLIC_SITE_URL || 'https://www.crystal.com.co').replace(/\/$/,'');
  const escape = (text: string) => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.filter(route=>!route.route.startsWith('/_localized/')).map(route => '<url><loc>'+escape(site+route.route)+'</loc></url>').join('')+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml'}});
};
