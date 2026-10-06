import { assetBase, shared } from "../content/site.mjs";

const esc = (value = "") => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pathFor = (locale, key) => locale.paths[key];

function loader(locale, pageKey) {
  if (pageKey !== "home") return "";
  const label = locale.id === "es" ? "Cargando sitio de Crystal" : "Loading Crystal website";
  const word = [..."rystal"].map((letter) => letter === "t"
    ? `<span class="loader-letter loader-letter--stitched">${letter}<svg class="loader-stitch" viewBox="0 0 120 128" aria-hidden="true"><path class="loader-stitch__thread" d="M4 38 Q60 -2 116 38"/><path class="loader-stitch__needle" d="M60 1 C56 12 57 82 60 126 C63 82 64 12 60 1 Z"/><ellipse class="loader-stitch__eye" cx="60" cy="13" rx="2.2" ry="6"/></svg></span>`
    : `<span class="loader-letter">${letter}</span>`).join("");
  return `<div class="site-loader" data-loader role="status" aria-label="${label}">
    <div class="loader-stage" aria-hidden="true">
      <div class="loader-brand">
        <span class="loader-emblem"><svg viewBox="0 0 176 104" aria-hidden="true"><path class="loader-emblem__shape" d="M171 46 84 4 9 39C-3 44-3 57 9 63l75 37 87-43H30c-10 0-16-4-16-9s6-9 16-9h141Z" fill-rule="evenodd"/></svg></span>
        <strong class="loader-word" aria-label="Crystal">${word}</strong>
      </div>
      <span class="loader-origin">1938 / Medellín / Colombia</span>
      <div class="loader-weave">
        <div class="warp">${Array.from({ length: 17 }, () => "<i></i>").join("")}</div>
        <div class="weft">${Array.from({ length: 7 }, () => "<i></i>").join("")}</div>
        <svg class="loader-weave-thread" viewBox="0 0 900 220" preserveAspectRatio="none"><path d="M0 110 C75 78 125 142 200 110 S325 78 400 110 525 142 600 110 725 78 800 110 850 132 900 110"/></svg>
      </div>
    </div>
    <div class="loader-curtain loader-curtain--a"></div><div class="loader-curtain loader-curtain--b"></div>
  </div>`;
}

function header(locale, pageKey) {
  const items = ["company", "purpose", "business", "sustainability"];
  const menuItems = ["home", "company", "purpose", "business", "brands", "locations", "sustainability", "compliance", "contact"];
  const themeLabel = locale.id === "es" ? "Cambiar tema de color" : "Change color theme";
  return `<header class="site-header" data-header>
    <a class="brand" href="${pathFor(locale, "home")}" aria-label="Crystal — Home"><img src="${shared.logo}" alt="Crystal" width="166" height="52"></a>
    <nav class="desktop-nav" aria-label="${locale.id === "es" ? "Navegación principal" : "Primary navigation"}">
      ${items.map((key, i) => `<a ${pageKey === key ? 'aria-current="page"' : ""} href="${pathFor(locale, key)}"><span>0${i + 1}</span>${locale.nav[key]}</a>`).join("")}
    </nav>
    <div class="header-actions">
      <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false"><span class="sr-only">${themeLabel}</span><i aria-hidden="true"></i></button>
      <a class="language-link" href="${locale.alternatePaths[pageKey]}" hreflang="${locale.id === "es" ? "en" : "es"}">${locale.languageLabel}</a>
      <a class="contact-link" ${pageKey === "contact" ? 'aria-current="page"' : ""} href="${pathFor(locale, "contact")}">${locale.nav.contact}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-menu-toggle><span>${locale.menu}</span><i></i></button>
    </div>
    <div class="site-menu" id="site-menu" data-mobile-menu hidden>
      <div class="menu-top"><img src="${shared.logo}" alt="" width="166" height="52"><button type="button" data-menu-close>${locale.close} <span>×</span></button></div>
      <nav aria-label="${locale.menu}">${menuItems.map((key, i) => `<a href="${pathFor(locale, key)}" ${pageKey === key ? 'aria-current="page"' : ""}><span>${String(i + 1).padStart(2, "0")}</span><strong>${key === "home" ? (locale.id === "es" ? "Inicio" : "Home") : locale.nav[key]}</strong><i>↗</i></a>`).join("")}</nav>
      <p>${locale.footer.statement}</p>
    </div>
  </header>`;
}

const arrowLink = (href, label, light = false) => `<a class="line-link${light ? " line-link--light" : ""}" href="${href}"><span>${label}</span><i aria-hidden="true">↗</i></a>`;

function homePage(locale, p) {
  const es = locale.id === "es";
  return `<section class="home-hero" data-hero>
    <figure class="home-hero__image" data-image-reveal><img src="${shared.media.home}" alt="${esc(p.heroAlt)}" width="1920" height="1080" fetchpriority="high"></figure>
    <div class="home-hero__veil"></div>
    <div class="home-hero__copy shell"><p class="eyebrow" data-reveal>${p.eyebrow}</p><h1 data-title>${p.title}</h1><p class="hero-lede" data-reveal>${p.intro}</p>${arrowLink(locale.paths.company, locale.common.discover, true)}</div>
    <p class="home-hero__index">${p.index}</p><span class="scroll-mark">${locale.common.scroll}<i></i></span>
  </section>
  <section class="opening-statement shell section"><span class="section-no">01 / 05</span><h2 data-title>${p.opening}</h2><p>${es ? "De la fibra al punto de venta, cada etapa comparte conocimiento, exigencia y una misma dirección." : "From fiber to point of sale, every stage shares knowledge, rigor and one direction."}</p></section>
  <section class="home-business section" aria-labelledby="home-business-title">
    <div class="shell section-heading"><span class="section-no">02 / 05</span><div><h2 id="home-business-title" data-title>${p.businessTitle}</h2><p>${p.businessIntro}</p></div></div>
    <div class="discipline-list shell">
      ${[
        ["01", es ? "Hilandería" : "Spinning", shared.media.yarn, es ? "Fibra / hilo / conocimiento" : "Fiber / yarn / knowledge"],
        ["02", es ? "Manufactura" : "Manufacturing", shared.media.fullPackage, es ? "Textil / confección / calcetería" : "Textiles / garments / hosiery"],
        ["03", es ? "Marcas" : "Brands", shared.media.brands, "Gef / Punto Blanco / Baby Fresh / Galax"]
      ].map(([n, title, img, note]) => `<a class="discipline" href="${locale.paths.business}" data-preview-row><span>${n}</span><h3>${title}</h3><p>${note}</p><figure><img src="${img}" alt="" width="760" height="520" loading="lazy"></figure><i>↗</i></a>`).join("")}
    </div>
  </section>
  <section class="purpose-band section" aria-labelledby="purpose-band-title"><figure data-image-reveal><img src="${shared.media.purpose}" alt="" width="1600" height="1000" loading="lazy"></figure><div class="purpose-band__copy"><span class="section-no">03 / 05</span><h2 id="purpose-band-title" data-title>${p.purposeTitle}</h2>${arrowLink(locale.paths.purpose, locale.common.discover, true)}</div></section>
  <section class="footprint section shell"><div class="section-heading"><span class="section-no">04 / 05</span><div><p class="eyebrow">${es ? "Presencia" : "Footprint"}</p><h2 data-title>${es ? "Hecho aquí. Presente allá." : "Made here. Present there."}</h2></div></div><dl class="stat-grid">${shared.stats.map((s) => `<div data-stat><dt>${s.value}</dt><dd>${s[locale.id]}</dd></div>`).join("")}</dl></section>
  <section class="impact-panel section"><div class="impact-panel__media"><video muted loop playsinline preload="metadata" poster="${shared.media.environment}" data-autoplay><source src="${shared.media.video}" type="video/mp4"></video></div><div class="impact-panel__copy"><span class="section-no">05 / 05</span><h2 data-title>${p.sustainabilityTitle}</h2><p>${p.sustainabilityBody}</p>${arrowLink(locale.paths.sustainability, locale.common.discover, true)}</div></section>
  ${faq(locale, p)}`;
}

function internalHero(locale, p, image, pageKey) {
  return `<section class="internal-hero internal-hero--${pageKey}"><div class="shell internal-hero__copy"><p class="eyebrow" data-reveal>${p.eyebrow}</p><h1 data-title>${p.title}</h1><p class="hero-lede" data-reveal>${p.intro}</p></div><figure data-image-reveal><img src="${image}" alt="${esc(p.heroAlt || "")}" width="1800" height="1080" fetchpriority="high"></figure><span class="internal-hero__code">CR / ${pageKey.toUpperCase()}</span></section>`;
}

function companyPage(locale, p) {
  return `${internalHero(locale, p, shared.media.company, "company")}
  <section class="history section shell"><div class="section-heading"><span class="section-no">01</span><h2 data-title>${p.historyTitle}</h2></div><ol class="timeline">${p.history.map(([year, title, body]) => `<li><time>${year}</time><div><h3>${title}</h3><p>${body}</p></div></li>`).join("")}</ol></section>
  <section class="company-footprint section"><div class="shell company-footprint__grid"><div><span class="section-no">02</span><h2 data-title>${p.footprintTitle}</h2><p>${p.footprintBody}</p></div><dl class="stat-grid stat-grid--stacked">${shared.stats.map((s) => `<div data-stat><dt>${s.value}</dt><dd>${s[locale.id]}</dd></div>`).join("")}</dl></div></section>
  <section class="governance section shell" id="governance"><span class="section-no">03</span><div><h2 data-title>${p.governanceTitle}</h2><p>${p.governanceBody}</p><div class="document-links"><a href="${assetBase}/pdf/Politica_de_tratamiento_de_datos_personales.pdf" target="_blank" rel="noopener">${p.governanceLink}<i>↓</i></a><a href="${locale.paths.contact}">${locale.nav.contact}<i>↗</i></a></div></div></section>`;
}

function purposePage(locale, p) {
  return `${internalHero(locale, p, shared.media.purpose, "purpose")}
  <section class="purpose-quote section"><div class="shell"><span aria-hidden="true">“</span><h2 data-title>${p.statement}</h2></div></section>
  <section class="values section shell"><div class="section-heading"><span class="section-no">01</span><h2 data-title>${p.valuesTitle}</h2></div><ol class="values-list">${p.values.map(([title, body], i) => `<li><span>0${i + 1}</span><h3>${title}</h3><p>${body}</p></li>`).join("")}</ol></section>
  <section class="essence-closing section"><figure data-image-reveal><img src="${shared.media.essence}" alt="" width="1600" height="1000" loading="lazy"></figure><p data-title>${p.closing}</p></section>`;
}

function businessPage(locale, p) {
  return `${internalHero(locale, p, shared.media.fullPackage, "business")}
  <section class="business-system section shell"><div class="section-heading"><span class="section-no">01</span><h2 data-title>${p.processTitle}</h2></div><div class="unit-list">${p.units.map((u) => `<article class="unit" data-unit><div class="unit__head"><span>${u.number}</span><h3>${u.title}</h3><p>${u.subtitle}</p><button type="button" aria-expanded="false" aria-label="${locale.common.explore} ${esc(u.title)}">+</button></div><div class="unit__body"><figure><img src="${u.image}" alt="" width="1000" height="720" loading="lazy"></figure><div><p>${u.body}</p><ul>${u.facts.map((f) => `<li>${f}</li>`).join("")}</ul></div></div></article>`).join("")}</div></section>
  <section class="full-package section"><div class="shell"><span class="section-no">02</span><h2 data-title>${p.closingTitle}</h2><p>${p.closingBody}</p></div></section>`;
}

function brandsPage(locale, p) {
  return `${internalHero(locale, p, shared.media.brands, "brands")}
  <section class="brand-portfolio section shell"><div class="section-heading"><span class="section-no">01</span><h2 data-title>${p.listTitle}</h2></div><ol>${p.brands.map(([name, body], i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><h3>${name}</h3><p>${body}</p></li>`).join("")}</ol></section>
  <section class="brand-bridge section"><div class="shell"><span class="section-no">02</span><h2 data-title>${p.closingTitle}</h2><p>${p.closingBody}</p>${arrowLink(locale.paths.business, locale.nav.business, true)}</div></section>`;
}

function locationsPage(locale, p) {
  return `${internalHero(locale, p, shared.media.company, "locations")}
  <section class="location-network section shell"><div class="section-heading"><span class="section-no">01</span><h2 data-title>${p.networkTitle}</h2></div><ol>${p.locations.map(([place, figure, body], i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><p>${place}</p><h3>${figure}</h3><p>${body}</p></li>`).join("")}</ol></section>`;
}

function sustainabilityPage(locale, p) {
  return `${internalHero(locale, p, shared.media.environment, "sustainability")}
  <section class="pillars section shell"><div class="section-heading"><span class="section-no">01</span><h2 data-title>${locale.id === "es" ? "Tres pilares, una misma ruta." : "Three pillars, one path."}</h2></div><ol>${p.pillars.map(([n, title, body]) => `<li><span>${n}</span><h3>${title}</h3><p>${body}</p></li>`).join("")}</ol></section>
  <section class="commitments section"><article><figure data-image-reveal><img src="${shared.media.social}" alt="" width="1200" height="900" loading="lazy"></figure><div><span>02 / SOCIAL</span><h2 data-title>${p.socialTitle}</h2><p>${p.socialBody}</p></div></article><article><figure data-image-reveal><img src="${shared.media.water}" alt="" width="1200" height="900" loading="lazy"></figure><div><span>03 / PLANETA</span><h2 data-title>${p.environmentTitle}</h2><p>${p.environmentBody}</p></div></article></section>
  <section class="reports section shell" id="reports"><div><span class="section-no">04</span><h2 data-title>${p.reportsTitle}</h2><p>${p.reportsBody}</p><small>${p.certification}</small></div><div class="report-list">${p.reports.map((year) => `<div><span>${locale.footer.reports}</span><strong>${year}</strong><i>—</i></div>`).join("")}</div></section>`;
}

function compliancePage(locale, p) {
  return `${internalHero(locale, p, shared.media.essence, "compliance")}
  <section class="compliance-governance section shell"><span class="section-no">01</span><div><h2 data-title>${p.governanceTitle}</h2><p>${p.governanceBody}</p></div></section>
  <section class="principles section"><div class="shell"><div class="section-heading"><span class="section-no">02</span><h2 data-title>${p.principlesTitle}</h2></div><ol>${p.principles.map((principle, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><strong>${principle}</strong></li>`).join("")}</ol><div class="policy-action">${arrowLink(`${assetBase}/pdf/Politica_de_tratamiento_de_datos_personales.pdf`, p.policyLabel)}</div></div></section>`;
}

function contactPage(locale, p) {
  return `<section class="contact-page"><div class="shell contact-intro"><p class="eyebrow">${p.eyebrow}</p><h1 data-title>${p.title}</h1><p>${p.intro}</p></div><div class="shell contact-layout"><aside><span>${p.customerLine}</span><a href="tel:+5718000517536">${p.phone}</a><a href="mailto:proteccionbasedatos@crystal.com.co">proteccionbasedatos@crystal.com.co</a></aside><form class="contact-form" data-contact-form novalidate>
    <label class="field field--wide"><span>${p.fields.area}</span><select name="area" required><option value=""></option>${p.areas.map((a) => `<option>${a}</option>`).join("")}</select></label>
    <label class="field"><span>${p.fields.name}</span><input name="name" autocomplete="given-name" maxlength="100" required></label><label class="field"><span>${p.fields.lastName}</span><input name="lastName" autocomplete="family-name" maxlength="100" required></label>
    <label class="field"><span>${p.fields.email}</span><input type="email" name="email" autocomplete="email" maxlength="254" required></label><label class="field"><span>${p.fields.company}</span><input name="company" autocomplete="organization" maxlength="120"></label>
    <label class="field field--wide"><span>${p.fields.message}</span><textarea name="message" rows="6" minlength="10" maxlength="3000" required></textarea></label><input class="trap" name="website" tabindex="-1" autocomplete="off">
    <p class="form-privacy">${p.privacy}</p><button class="submit-button" type="submit"><span>${p.fields.submit}</span><i>↗</i></button><p class="form-status" role="status" data-form-status></p>
  </form></div></section>`;
}

function faq(locale, p) {
  return `<section class="faq section shell"><div class="section-heading"><span class="section-no">FAQ</span><h2>${p.faqTitle}</h2></div><div class="faq-list">${p.faqs.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary><span>0${i + 1}</span>${q}<i></i></summary><p>${a}</p></details>`).join("")}</div></section>`;
}

function nextPage(locale, pageKey) {
  const order = ["home", "company", "purpose", "business", "brands", "locations", "sustainability", "compliance", "contact"];
  const next = order[(order.indexOf(pageKey) + 1) % order.length];
  const label = next === "home" ? (locale.id === "es" ? "Inicio" : "Home") : locale.nav[next];
  return `<a class="next-page" href="${locale.paths[next]}"><span>${locale.common.next}</span><strong>${label}</strong><i>↗</i></a>`;
}

function footer(locale) {
  return `<footer class="site-footer"><div class="shell footer-main"><div><img src="${shared.logo}" alt="Crystal" width="210" height="70" loading="lazy"><p>${locale.footer.statement}</p></div><nav>${["company", "purpose", "business", "brands", "locations", "sustainability", "compliance", "contact"].map((k) => `<a href="${locale.paths[k]}">${locale.nav[k]}</a>`).join("")}</nav><nav>${Object.entries(shared.socials).map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}<i>↗</i></a>`).join("")}</nav></div><div class="shell footer-bottom"><span>© ${new Date().getUTCFullYear()} Crystal S.A.S. ${locale.footer.rights}</span><span>Medellín / Colombia</span></div></footer>`;
}

function pageBody(locale, pageKey) {
  const p = locale.pages[pageKey];
  if (pageKey === "home") return homePage(locale, p);
  if (pageKey === "company") return companyPage(locale, p);
  if (pageKey === "purpose") return purposePage(locale, p);
  if (pageKey === "business") return businessPage(locale, p);
  if (pageKey === "brands") return brandsPage(locale, p);
  if (pageKey === "locations") return locationsPage(locale, p);
  if (pageKey === "sustainability") return sustainabilityPage(locale, p);
  if (pageKey === "compliance") return compliancePage(locale, p);
  return contactPage(locale, p);
}

export function renderSite(locale, pageKey) {
  const p = locale.pages[pageKey];
  const canonical = `https://www.crystal.com.co${locale.paths[pageKey]}`;
  const alternate = `https://www.crystal.com.co${locale.alternatePaths[pageKey]}`;
  const faqSchema = pageKey === "home" ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } : null;
  const orgSchema = { "@context": "https://schema.org", "@type": "Organization", name: "Crystal S.A.S.", url: "https://www.crystal.com.co/", logo: `${assetBase}/images/Logos/Logo-crystal-transparente.png`, foundingDate: "1938", address: { "@type": "PostalAddress", addressLocality: "Medellín", addressCountry: "CO" }, sameAs: Object.values(shared.socials) };
  return `<!doctype html><html lang="${locale.code}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${p.metaTitle}</title><meta name="description" content="${p.metaDescription}"><meta name="theme-color" content="#f0eee8"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="manifest" href="/site.webmanifest"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${locale.id === "es" ? "en" : "es-CO"}" href="${alternate}"><link rel="alternate" hreflang="x-default" href="https://www.crystal.com.co/"><meta property="og:type" content="website"><meta property="og:title" content="${p.metaTitle}"><meta property="og:description" content="${p.metaDescription}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${shared.media.home}"><link rel="preconnect" href="https://crystal.com.co" crossorigin><script src="/assets/js/theme.js"></script><link rel="stylesheet" href="/assets/css/main.css"><script type="application/ld+json">${JSON.stringify(orgSchema)}</script>${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : ""}</head><body class="page-${pageKey}${pageKey === "home" ? " is-loading" : ""}" data-language="${locale.id}"><a class="skip-link" href="#main">${locale.skip}</a>${loader(locale, pageKey)}${header(locale, pageKey)}<main id="main">${pageBody(locale, pageKey)}${pageKey !== "contact" ? nextPage(locale, pageKey) : ""}</main>${footer(locale)}<script src="/assets/vendor/gsap.min.js" defer></script><script src="/assets/vendor/ScrollTrigger.min.js" defer></script><script src="/assets/js/main.js" defer></script></body></html>`;
}
