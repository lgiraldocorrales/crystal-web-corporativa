import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { locales } from "../src/content/site.mjs";
import { renderSite } from "../src/templates/home.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const pages = ["home", "company", "purpose", "business", "brands", "locations", "sustainability", "compliance", "contact"];

await rm(dist, { recursive: true, force: true });
for (const path of ["assets/css", "assets/js", "assets/vendor", "assets/fonts"]) await mkdir(resolve(dist, path), { recursive: true });

await copyFile(resolve(root, "src/styles/main.css"), resolve(dist, "assets/css/main.css"));
await copyFile(resolve(root, "src/scripts/main.js"), resolve(dist, "assets/js/main.js"));
await copyFile(resolve(root, "src/scripts/theme.js"), resolve(dist, "assets/js/theme.js"));
await copyFile(resolve(root, "src/assets/favicon.svg"), resolve(dist, "favicon.svg"));
await copyFile(resolve(root, "src/assets/site.webmanifest"), resolve(dist, "site.webmanifest"));

for (const file of ["gsap.min.js", "ScrollTrigger.min.js"]) {
  const source = resolve(root, `node_modules/gsap/dist/${file}`);
  if (!existsSync(source)) throw new Error(`Missing ${file}. Run npm install before npm run build.`);
  await copyFile(source, resolve(dist, `assets/vendor/${file}`));
}

for (const file of ["raleway-latin-ext-wght-normal.woff2", "raleway-latin-ext-wght-italic.woff2"]) {
  const source = resolve(root, `node_modules/@fontsource-variable/raleway/files/${file}`);
  if (!existsSync(source)) throw new Error(`Missing ${file}. Run npm install before npm run build.`);
  await copyFile(source, resolve(dist, `assets/fonts/${file}`));
}

const written = [];
for (const locale of Object.values(locales)) {
  for (const page of pages) {
    const route = locale.paths[page];
    const target = route === "/" ? resolve(dist, "index.html") : resolve(dist, route.slice(1), "index.html");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, renderSite(locale, page));
    written.push({ route, target });
  }
}

await writeFile(resolve(dist, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://www.crystal.com.co/sitemap.xml\n");
const sitemapUrls = pages.flatMap((page) => [locales.es.paths[page], locales.en.paths[page]]).map((route) => `  <url><loc>https://www.crystal.com.co${route}</loc></url>`).join("\n");
await writeFile(resolve(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);
await writeFile(resolve(dist, "404.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Página no encontrada | Crystal</title><link rel="stylesheet" href="/assets/css/main.css"></head><body><main class="contact-page shell"><p class="eyebrow">Error 404</p><h1>Página no encontrada.</h1><a class="line-link" href="/">Volver al inicio <i>↗</i></a></main></body></html>`);

const home = await readFile(resolve(dist, "index.html"), "utf8");
console.log(`Built ${written.length} bilingual pages. Home: ${home.length.toLocaleString()} bytes.`);
