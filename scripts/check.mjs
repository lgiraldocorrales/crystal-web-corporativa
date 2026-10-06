import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const files = ["dist/index.html", "dist/en/index.html"];
for (const relative of files) {
  const html = await readFile(resolve(relative), "utf8");
  const checks = [
    ["single H1", (html.match(/<h1\b/g) || []).length === 1],
    ["canonical", html.includes('rel="canonical"')],
    ["hreflang", html.includes('hreflang="es-CO"') && html.includes('hreflang="en"')],
    ["description", html.includes('name="description"')],
    ["FAQ schema", html.includes('"@type":"FAQPage"')],
    ["Organization schema", html.includes('"@type":"Organization"')]
  ];
  const failed = checks.filter(([, pass]) => !pass);
  if (failed.length) throw new Error(`${relative}: ${failed.map(([name]) => name).join(", ")}`);
  console.log(`${relative}: ${checks.length} checks passed`);
}
