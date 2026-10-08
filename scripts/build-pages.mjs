import { execFileSync } from 'node:child_process';
const base = process.env.PAGES_BASE_PATH || '/crystal-web-corporativa';
const env = {...process.env, CRYSTAL_PAGES_PREVIEW:'1', PAGES_BASE_PATH:base, PUBLIC_TURNSTILE_SITE_KEY:''};
// Explicit environment also works on Windows; the ordinary Azure build is unchanged.
execFileSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{env,stdio:'inherit'});
