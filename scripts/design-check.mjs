import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/styles/main.css", import.meta.url), "utf8");
const rootBlock = css.match(/:root\{([^}]+)\}/)?.[1] || "";
const darkBlock = css.match(/html\[data-theme="dark"\]\{([^}]+)\}/)?.[1] || "";
const outsideTokens = css.replace(/:root\{[^}]+\}/, "").replace(/html\[data-theme="dark"\]\{[^}]+\}/, "");
const required = ["surface", "surface-alt", "surface-elevated", "surface-strong", "ink", "muted", "line", "header-glass", "loader-grid", "accent-red", "accent-blue", "logo-on-surface"];

for (const token of required) {
  assert.match(rootBlock, new RegExp(`--color-${token}:|--${token}:`), `missing light token ${token}`);
  assert.match(darkBlock, new RegExp(`--color-${token}:|--${token}:`), `missing dark token ${token}`);
}
assert.doesNotMatch(outsideTokens, /#[0-9a-f]{3,8}|rgba?\(/i, "component CSS contains hardcoded colors");
assert.doesNotMatch(css, /font-family:\s*(Inter|Arial)([,;}])/i, "generic primary font detected");
assert.match(css, /font-family:Raleway,/, "Raleway is not the primary font");
assert.ok((css.match(/border-radius:(?!0)/g) || []).length <= 3, "excessive rounded UI detected");
assert.ok((css.match(/linear-gradient/g) || []).length <= 6, "excessive gradient usage detected");
assert.ok((css.match(/box-shadow/g) || []).length <= 1, "excessive shadow usage detected");
assert.doesNotMatch(css, /backdrop-filter/, "glassmorphism detected");
assert.match(css, /:focus-visible\{/, "keyboard focus treatment is missing");
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/, "reduced-motion treatment is missing");
assert.match(css, /\.theme-toggle\{width:40px;height:40px/, "theme control target is too small");

const definitions = new Set([...css.matchAll(/(--[a-z0-9-]+):/gi)].map((match) => match[1]));
const references = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/gi)].map((match) => match[1]));
const undefinedVariables = [...references].filter((name) => !definitions.has(name));
assert.deepEqual(undefinedVariables, [], `undefined CSS variables: ${undefinedVariables.join(", ")}`);

const luminance = (hex) => {
  const channels = hex.match(/\w\w/g).map((value) => parseInt(value, 16) / 255).map((value) => value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
};
for (const [background, foreground] of [["f0eee8", "161616"], ["f0eee8", "686763"], ["151515", "f1efe9"], ["151515", "aaa8a1"], ["1464d2", "ffffff"], ["0f4fa8", "ffffff"]]) {
  assert.ok(contrast(background, foreground) >= 4.5, `insufficient contrast: ${background}/${foreground}`);
}
for (const [background, foreground] of [["ee4035", "ffffff"], ["d9473d", "ffffff"]]) assert.ok(contrast(background, foreground) >= 3, `insufficient large-text contrast: ${background}/${foreground}`);

const routes = ["index.html", "compania/index.html", "proposito/index.html", "modelo-de-negocio/index.html", "sostenibilidad/index.html", "contacto/index.html", "en/index.html", "en/company/index.html", "en/purpose/index.html", "en/business-model/index.html", "en/sustainability/index.html", "en/contact/index.html"];
for (const route of routes) {
  const html = await readFile(new URL(`../dist/${route}`, import.meta.url), "utf8");
  assert.match(html, /data-theme-toggle/, `${route}: missing theme control`);
  assert.match(html, /\/assets\/js\/theme\.js/, `${route}: missing early theme script`);
}

console.log(`Design system: ${required.length + 25} checks passed across ${routes.length} routes`);
