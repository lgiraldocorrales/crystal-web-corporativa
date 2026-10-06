(() => {
  "use strict";

  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const storageKey = "crystal-color-theme";

  const savedTheme = () => {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch (_) {
      return null;
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#151515" : "#f0eee8");
  };

  applyTheme(savedTheme() || (media.matches ? "dark" : "light"));

  const bind = () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const theme = root.dataset.theme === "dark" ? "light" : "dark";
        try { localStorage.setItem(storageKey, theme); } catch (_) {}
        applyTheme(theme);
      });
    });
  };

  media.addEventListener?.("change", (event) => {
    if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, { once: true });
  else bind();
})();
