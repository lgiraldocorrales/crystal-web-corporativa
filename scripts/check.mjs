import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const files = [
  "dist/index.html", "dist/compania/index.html", "dist/proposito/index.html",
  "dist/modelo-de-negocio/index.html", "dist/marcas/index.html", "dist/ubicaciones/index.html",
  "dist/sostenibilidad/index.html", "dist/cumplimiento/index.html", "dist/contacto/index.html",
  "dist/en/index.html", "dist/en/company/index.html", "dist/en/purpose/index.html",
  "dist/en/business-model/index.html", "dist/en/brands/index.html", "dist/en/locations/index.html",
  "dist/en/sustainability/index.html", "dist/en/compliance/index.html", "dist/en/contact/index.html"
];
for (const relative of files) {
  const html = await readFile(resolve(relative), "utf8");
  const checks = [
    ["single H1", (html.match(/<h1\b/g) || []).length === 1],
    ["canonical", html.includes('rel="canonical"')],
    ["hreflang", html.includes('rel="alternate"') && html.includes('hreflang="x-default"')],
    ["description", html.includes('name="description"')],
    ["Organization schema", html.includes('"@type":"Organization"')],
    ["local Raleway", html.includes('/assets/css/main.css')],
    ["favicon", html.includes('rel="icon" href="/favicon.svg"')],
    ["web manifest", html.includes('rel="manifest" href="/site.webmanifest"')]
  ];
  const failed = checks.filter(([, pass]) => !pass);
  if (failed.length) throw new Error(`${relative}: ${failed.map(([name]) => name).join(", ")}`);
  console.log(`${relative}: ${checks.length} checks passed`);
}
