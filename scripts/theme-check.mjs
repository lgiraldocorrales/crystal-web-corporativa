import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../src/scripts/theme.js", import.meta.url), "utf8");

function execute({ stored = null, systemDark = false } = {}) {
  const values = new Map(stored ? [["crystal-color-theme", stored]] : []);
  const buttonListeners = {};
  const mediaListeners = {};
  const button = {
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { buttonListeners[name] = callback; }
  };
  const meta = { content: null, setAttribute(_name, value) { this.content = value; } };
  const media = { matches: systemDark, addEventListener(name, callback) { mediaListeners[name] = callback; } };
  const document = {
    readyState: "complete",
    documentElement: { dataset: {} },
    querySelectorAll(selector) { return selector === "[data-theme-toggle]" ? [button] : []; },
    querySelector(selector) { return selector === 'meta[name="theme-color"]' ? meta : null; }
  };
  const context = {
    document,
    localStorage: { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) },
    matchMedia: () => media,
    window: { matchMedia: () => media },
    console
  };
  vm.runInNewContext(source, context);
  return { root: document.documentElement, button, buttonListeners, mediaListeners, meta, values };
}

const followsSystem = execute({ systemDark: true });
assert.equal(followsSystem.root.dataset.theme, "dark");
assert.equal(followsSystem.meta.content, "#151515");
assert.equal(followsSystem.button.attributes["aria-pressed"], "true");

const honorsSaved = execute({ stored: "light", systemDark: true });
assert.equal(honorsSaved.root.dataset.theme, "light");
assert.equal(honorsSaved.meta.content, "#f0eee8");

honorsSaved.buttonListeners.click();
assert.equal(honorsSaved.root.dataset.theme, "dark");
assert.equal(honorsSaved.values.get("crystal-color-theme"), "dark");
assert.equal(honorsSaved.button.attributes["aria-pressed"], "true");

const reactsToSystem = execute({ systemDark: false });
reactsToSystem.mediaListeners.change({ matches: true });
assert.equal(reactsToSystem.root.dataset.theme, "dark");

console.log("Theme behavior: 10 checks passed");
