import { assetBase, media, shared } from "../content/site.mjs";

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function loader(locale) {
  return `
    <div class="site-loader" data-loader role="status" aria-live="polite" aria-label="${locale.code === "es-CO" ? "Cargando sitio de Crystal" : "Loading Crystal website"}">
      <div class="loader-stage" aria-hidden="true">
        <div class="loader-mark loader-mark--symbol">
          <img src="${media.logo}" alt="" width="560" height="190">
        </div>
        <div class="loader-mark loader-mark--word">
          <img src="${media.logo}" alt="" width="560" height="190">
        </div>
        <svg class="loader-stitch" viewBox="0 0 300 120" focusable="false">
          <path class="loader-thread" d="M18 67 C85 7 204 7 280 66" pathLength="1" />
          <path class="loader-needle" d="M160 15 C157 42 157 76 160 108" pathLength="1" />
          <ellipse class="loader-eye" cx="160" cy="16" rx="3.5" ry="9" />
        </svg>
      </div>
      <span class="loader-index">1938 — <span data-loader-year>2026</span></span>
    </div>`;
}

function header(locale) {
  const home = locale.path;
  return `
    <header class="site-header" data-header>
      <a class="brand" href="${home}" aria-label="Crystal — Home">
        <img src="${media.logo}" alt="Crystal" width="154" height="52">
      </a>
      <nav class="desktop-nav" aria-label="${locale.code === "es-CO" ? "Navegación principal" : "Primary navigation"}">
        <a href="#company">${locale.nav.company}</a>
        <a href="#purpose">${locale.nav.purpose}</a>
        <a href="#business">${locale.nav.business}</a>
        <a href="#sustainability">${locale.nav.sustainability}</a>
      </nav>
      <div class="header-actions">
        <a class="language-link" href="${locale.alternate}" hreflang="${locale.code === "es-CO" ? "en" : "es"}">${locale.languageLabel}</a>
        <a class="contact-link" href="${locale.code === "es-CO" ? "/ServicioAlCliente/" : "/CustomerService/"}">${locale.nav.contact}</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
          <span></span><span></span><span></span>
          <span class="sr-only">Menu</span>
        </button>
      </div>
      <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
        <a href="#company">${locale.nav.company}</a>
        <a href="#purpose">${locale.nav.purpose}</a>
        <a href="#business">${locale.nav.business}</a>
        <a href="#sustainability">${locale.nav.sustainability}</a>
        <a href="${locale.code === "es-CO" ? "/ServicioAlCliente/" : "/CustomerService/"}">${locale.nav.contact}</a>
      </div>
    </header>`;
}

function hero(locale) {
  return `
    <section class="hero" id="company" aria-labelledby="hero-title">
      <div class="hero-media" aria-hidden="true" data-hero-media>
        ${media.hero.map((item, index) => `
          <figure class="hero-frame${index === 0 ? " is-active" : ""}" data-hero-frame>
            <img src="${item.src}" alt="" width="1920" height="1080" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}>
          </figure>`).join("")}
      </div>
      <div class="hero-shade"></div>
      <div class="hero-copy page-grid">
        <p class="eyebrow hero-eyebrow" data-reveal>${locale.hero.eyebrow}</p>
        <h1 id="hero-title" class="hero-title" data-split>${locale.hero.title}</h1>
        <p class="hero-body" data-reveal>${locale.hero.body}</p>
        <div class="hero-links" data-reveal>
          <a class="text-link text-link--light" href="${locale.code === "es-CO" ? "/quienesSomos/" : "/WhoWeAre/"}">${locale.hero.primary}<span aria-hidden="true">↗</span></a>
          <a class="text-link text-link--light" href="#business">${locale.hero.secondary}<span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div class="hero-rail" aria-hidden="true">
        <span>01</span><span class="hero-rail-line"><i data-hero-progress></i></span><span>04</span>
      </div>
      <span class="scroll-cue" aria-hidden="true">Scroll</span>
    </section>`;
}

function purpose(locale) {
  return `
    <section class="purpose section-space" id="purpose" aria-labelledby="purpose-title">
      <div class="page-grid purpose-grid">
        <div class="section-intro">
          <p class="eyebrow" data-reveal>${locale.purpose.eyebrow}</p>
          <h2 id="purpose-title" class="display-title" data-split>${locale.purpose.title}</h2>
          <a class="text-link" href="${locale.code === "es-CO" ? "/propositoyesencia/" : "/PurposeAndEssence/"}" data-reveal>${locale.purpose.link}<span aria-hidden="true">↗</span></a>
        </div>
        <div class="purpose-showcase" data-purpose-showcase>
          <figure class="purpose-image purpose-image--main">
            <img src="${media.purpose[0]}" alt="${locale.code === "es-CO" ? "Proceso creativo y de moda de Crystal" : "Crystal creative and fashion process"}" width="960" height="1200" loading="lazy">
          </figure>
          <figure class="purpose-image purpose-image--detail">
            <img src="${media.purpose[1]}" alt="${locale.code === "es-CO" ? "Detalle de la esencia de Crystal" : "Detail of Crystal's essence"}" width="720" height="900" loading="lazy">
          </figure>
          <span class="showcase-caption">Crystal / 1938—2026</span>
        </div>
      </div>
    </section>`;
}

function business(locale) {
  return `
    <section class="business section-space" id="business" aria-labelledby="business-title">
      <div class="page-grid business-heading">
        <p class="eyebrow" data-reveal>${locale.business.eyebrow}</p>
        <div>
          <h2 id="business-title" class="display-title display-title--compact" data-split>${locale.business.title}</h2>
          <p class="section-lede" data-reveal>${locale.business.intro}</p>
        </div>
      </div>
      <div class="business-track-wrap" data-horizontal-wrap>
        <div class="business-track" data-horizontal-track>
          ${locale.business.items.map(item => `
            <article class="business-card">
              <a href="${item.href}" class="business-card-link" aria-label="${esc(item.title)}">
                <figure><img src="${item.image}" alt="" width="1000" height="1250" loading="lazy"></figure>
                <div class="business-card-copy">
                  <span>${item.number}</span>
                  <h3>${item.title}</h3>
                  <p>${item.body}</p>
                  <i aria-hidden="true">↗</i>
                </div>
              </a>
            </article>`).join("")}
        </div>
      </div>
    </section>`;
}

function footprint(locale) {
  return `
    <section class="footprint section-space" aria-labelledby="footprint-title">
      <div class="page-grid footprint-grid">
        <div class="footprint-copy">
          <p class="eyebrow" data-reveal>${locale.footprint.eyebrow}</p>
          <h2 id="footprint-title" class="display-title display-title--compact" data-split>${locale.footprint.title}</h2>
          <p class="section-lede" data-reveal>${locale.footprint.body}</p>
          <a class="text-link" href="${locale.code === "es-CO" ? "/ubicacion/" : "/Location/"}" data-reveal>${locale.footprint.link}<span aria-hidden="true">↗</span></a>
        </div>
        <dl class="stat-list">
          ${shared.stats.map(stat => `<div class="stat" data-stat><dt>${stat.value}</dt><dd>${locale.code === "es-CO" ? stat.es : stat.en}</dd></div>`).join("")}
        </dl>
      </div>
    </section>`;
}

function sustainability(locale) {
  return `
    <section class="sustainability" id="sustainability" aria-labelledby="sustainability-title">
      <div class="sustainability-media">
        <video muted loop playsinline preload="metadata" data-sustainability-video poster="${media.purpose[1]}">
          <source src="${media.sustainabilityVideo}" type="video/mp4">
        </video>
      </div>
      <div class="sustainability-copy">
        <p class="eyebrow" data-reveal>${locale.sustainability.eyebrow}</p>
        <h2 id="sustainability-title" class="display-title display-title--compact" data-split>${locale.sustainability.title}</h2>
        <p class="section-lede" data-reveal>${locale.sustainability.body}</p>
        <a class="text-link text-link--light" href="${locale.code === "es-CO" ? "/sostenibilidad/" : "/Sustainability/"}" data-reveal>${locale.sustainability.link}<span aria-hidden="true">↗</span></a>
      </div>
    </section>`;
}

function ethics(locale) {
  return `
    <section class="ethics section-space" aria-labelledby="ethics-title">
      <div class="ethics-thread" aria-hidden="true"><svg viewBox="0 0 1200 300" preserveAspectRatio="none"><path data-thread-path d="M-30 210 C230 20 360 290 610 125 C825 -18 1000 250 1240 70" pathLength="1" /></svg></div>
      <div class="page-grid ethics-grid">
        <p class="eyebrow" data-reveal>${locale.ethics.eyebrow}</p>
        <div>
          <h2 id="ethics-title" class="display-title" data-split>${locale.ethics.title}</h2>
          <p class="section-lede" data-reveal>${locale.ethics.body}</p>
          <a class="text-link" href="${locale.code === "es-CO" ? "/asiSomos/" : "/ThisIsWhoWeAre/"}" data-reveal>${locale.ethics.link}<span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>`;
}

function faq(locale) {
  return `
    <section class="faq section-space" aria-labelledby="faq-title">
      <div class="page-grid faq-grid">
        <div>
          <p class="eyebrow">${locale.faq.eyebrow}</p>
          <h2 id="faq-title" class="display-title display-title--compact">${locale.faq.title}</h2>
        </div>
        <div class="faq-list">
          ${locale.faq.items.map((item, index) => `
            <details class="faq-item" ${index === 0 ? "open" : ""}>
              <summary><span>${String(index + 1).padStart(2, "0")}</span>${item.q}<i aria-hidden="true"></i></summary>
              <p>${item.a}</p>
            </details>`).join("")}
        </div>
      </div>
    </section>`;
}

function footer(locale) {
  const es = locale.code === "es-CO";
  return `
    <footer class="site-footer">
      <div class="page-grid footer-grid">
        <div class="footer-brand">
          <img src="${media.logo}" alt="Crystal" width="200" height="68" loading="lazy">
          <p>${locale.footer.statement}</p>
        </div>
        <div class="footer-column">
          <h2>${locale.footer.company}</h2>
          <a href="${es ? "/quienesSomos/" : "/WhoWeAre/"}">${es ? "Quiénes somos" : "Who we are"}</a>
          <a href="${es ? "/historiaC/1938-1948/" : "/OurHistory/1938-1948/"}">${es ? "Historia" : "History"}</a>
          <a href="${es ? "/gobiernoCorp/" : "/CorporateGovernance/"}">${es ? "Gobierno corporativo" : "Corporate governance"}</a>
          <a href="${es ? "/ServicioAlCliente/" : "/CustomerService/"}">${locale.nav.contact}</a>
        </div>
        <div class="footer-column">
          <h2>${locale.footer.resources}</h2>
          <a href="${es ? "/politicas/" : "/Policies/"}">${es ? "Políticas" : "Policies"}</a>
          <a href="${es ? "/certificaciones/" : "/Certifications/"}">${es ? "Certificaciones" : "Certifications"}</a>
          <a href="${es ? "/informesDeSostenibilidad/" : "/sustainabilityReports/"}">${es ? "Informes de sostenibilidad" : "Sustainability reports"}</a>
        </div>
        <div class="footer-column footer-social">
          <h2>Social</h2>
          ${Object.entries(shared.socials).map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}<span aria-hidden="true">↗</span></a>`).join("")}
        </div>
      </div>
      <div class="page-grid footer-bottom">
        <span>© ${new Date().getUTCFullYear()} Crystal S.A.S. ${locale.footer.rights}</span>
        <span>Medellín, Colombia</span>
      </div>
    </footer>`;
}

export function renderHome(locale) {
  const es = locale.code === "es-CO";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: locale.faq.items.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Crystal S.A.S.",
    url: "https://www.crystal.com.co/",
    logo: `${assetBase}/images/Logos/Logo-crystal-transparente.png`,
    foundingDate: "1938",
    address: { "@type": "PostalAddress", addressLocality: "Medellín", addressCountry: "CO" },
    sameAs: Object.values(shared.socials)
  };
  return `<!doctype html>
<html lang="${locale.code}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${locale.meta.title}</title>
  <meta name="description" content="${locale.meta.description}">
  <meta name="theme-color" content="#f4f1eb">
  <link rel="canonical" href="https://www.crystal.com.co${locale.path}">
  <link rel="alternate" hreflang="es-CO" href="https://www.crystal.com.co/">
  <link rel="alternate" hreflang="en" href="https://www.crystal.com.co/en/">
  <link rel="alternate" hreflang="x-default" href="https://www.crystal.com.co/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${locale.meta.title}">
  <meta property="og:description" content="${locale.meta.description}">
  <meta property="og:url" content="https://www.crystal.com.co${locale.path}">
  <meta property="og:image" content="${media.hero[0].src}">
  <meta property="og:locale" content="${es ? "es_CO" : "en_US"}">
  <link rel="preconnect" href="https://crystal.com.co" crossorigin>
  <link rel="stylesheet" href="/assets/css/main.css">
  <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body class="is-loading">
  <a class="skip-link" href="#main">${locale.skip}</a>
  ${loader(locale)}
  ${header(locale)}
  <main id="main">
    ${hero(locale)}
    ${purpose(locale)}
    ${business(locale)}
    ${footprint(locale)}
    ${sustainability(locale)}
    ${ethics(locale)}
    ${faq(locale)}
  </main>
  ${footer(locale)}
  <script src="/assets/vendor/gsap.min.js" defer></script>
  <script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
  <script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}
