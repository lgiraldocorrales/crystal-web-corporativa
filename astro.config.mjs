import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { preparePages } from './scripts/pages-preview.mjs';
const preview = process.env.CRYSTAL_PAGES_PREVIEW === '1';
const base = process.env.PAGES_BASE_PATH || '/crystal-web-corporativa';
export default defineConfig({
  output:'static', site:process.env.PUBLIC_SITE_URL || 'https://www.crystal.com.co',
  base:preview ? base : '/', trailingSlash:'never', build:{format:'directory'}, compressHTML:false,
  integrations:preview ? [{name:'crystal-pages-preview',hooks:{'astro:build:done':async ({dir}) => {
    await preparePages(fileURLToPath(dir),base,process.env.PAGES_VIDEO_ORIGIN || 'https://www.crystal.com.co');
  }}}] : [],
});
