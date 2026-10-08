import { defineConfig } from 'astro/config';
export default defineConfig({output:'static', site:process.env.PUBLIC_SITE_URL || 'https://www.crystal.com.co', trailingSlash:'never', build:{format:'directory'}, compressHTML:false});
