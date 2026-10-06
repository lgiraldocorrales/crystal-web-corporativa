import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locales } from "../src/content/site.mjs";
import { renderHome } from "../src/templates/home.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await mkdir(resolve(dist, "assets/css"), { recursive: true });
await mkdir(resolve(dist, "assets/js"), { recursive: true });
await mkdir(resolve(dist, "assets/vendor"), { recursive: true });
await mkdir(resolve(dist, "en"), { recursive: true });

await cp(resolve(root, "src/styles/main.css"), resolve(dist, "assets/css/main.css"));
await cp(resolve(root, "src/scripts/main.js"), resolve(dist, "assets/js/main.js"));

const vendorFiles = ["gsap.min.js", "ScrollTrigger.min.js"];
for (const file of vendorFiles) {
  const source = resolve(root, `node_modules/gsap/dist/${file}`);
  if (!existsSync(source)) {
    throw new Error(`Missing ${file}. Run npm install before npm run build.`);
  }
  await cp(source, resolve(dist, `assets/vendor/${file}`));
}

await writeFile(resolve(dist, "index.html"), renderHome(locales.es));
await writeFile(resolve(dist, "en/index.html"), renderHome(locales.en));
await writeFile(resolve(dist, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://www.crystal.com.co/sitemap.xml\n");
await writeFile(resolve(dist, "404.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Página no encontrada | Crystal</title><link rel="stylesheet" href="/assets/css/main.css"></head><body><main class="not-found page-grid"><p class="eyebrow">Error 404</p><h1 class="display-title display-title--compact">Esta página no está disponible.</h1><a class="text-link" href="/">Volver al inicio <span aria-hidden="true">↗</span></a></main></body></html>`);
await writeFile(resolve(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n  <url><loc>https://www.crystal.com.co/</loc><xhtml:link rel="alternate" hreflang="es-CO" href="https://www.crystal.com.co/"/><xhtml:link rel="alternate" hreflang="en" href="https://www.crystal.com.co/en/"/></url>\n  <url><loc>https://www.crystal.com.co/en/</loc><xhtml:link rel="alternate" hreflang="es-CO" href="https://www.crystal.com.co/"/><xhtml:link rel="alternate" hreflang="en" href="https://www.crystal.com.co/en/"/></url>\n</urlset>\n`);

const html = await readFile(resolve(dist, "index.html"), "utf8");
console.log(`Built Crystal prototype: ${html.length.toLocaleString()} bytes`);
