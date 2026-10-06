(() => {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const splitTitles = () => {
    document.querySelectorAll("[data-title]").forEach((title) => {
      const text = title.textContent.trim();
      title.setAttribute("aria-label", text);
      title.innerHTML = text.split(/\s+/).map((word) => `<span class="word-clip" aria-hidden="true"><span class="word">${word}</span></span>`).join(" ");
    });
  };

  const unlock = () => {
    document.body.classList.remove("is-loading");
    document.querySelector("[data-loader]")?.remove();
  };

  const initLoader = () => {
    const loader = document.querySelector("[data-loader]");
    if (!loader || reduceMotion || !gsap) return unlock();

    gsap.set(".warp i", { scaleY: 0 });
    gsap.set(".weft i", { scaleX: 0 });
    gsap.set(".loader-needle", { xPercent: -70, opacity: 0 });
    gsap.set(".loader-thread", { width: 0 });
    gsap.set(".loader-signature > *", { y: 20, opacity: 0 });
    gsap.set(".home-hero__copy .word", { yPercent: 115 });
    gsap.set(".home-hero__copy [data-reveal]", { y: 18, opacity: 0 });

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(".warp i", { scaleY: 1, duration: .42, stagger: { each: .025, from: "center" } })
      .to(".weft i", { scaleX: 1, duration: .48, stagger: .035, ease: "power2.inOut" }, "-=.25")
      .to(".loader-needle", { xPercent: 690, opacity: 1, duration: .72, ease: "power2.inOut" }, "-=.18")
      .to(".loader-thread", { width: "91%", duration: .72, ease: "power2.inOut" }, "<")
      .to(".loader-signature > *", { y: 0, opacity: 1, duration: .38, stagger: .08 }, "-=.35")
      .to([".loader-weave", ".loader-signature"], { opacity: 0, duration: .28, delay: .16 })
      .to(".loader-curtain", { scaleX: 1, duration: .48, ease: "power4.inOut" }, "-=.05")
      .add(() => { document.body.classList.remove("is-loading"); })
      .to(loader, { opacity: 0, duration: .01 })
      .from(".home-hero__image img", { scale: 1.14, duration: 1.2, ease: "power3.out" })
      .to(".home-hero__copy .word", { yPercent: 0, duration: .78, stagger: .035 }, "-=.95")
      .to(".home-hero__copy [data-reveal]", { y: 0, opacity: 1, duration: .55, stagger: .08 }, "-=.65")
      .add(() => loader.remove());
  };

  const initHeader = () => {
    const header = document.querySelector("[data-header]");
    const menu = document.querySelector("[data-mobile-menu]");
    const open = document.querySelector("[data-menu-toggle]");
    const close = document.querySelector("[data-menu-close]");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 36);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const showMenu = () => {
      menu.hidden = false;
      open.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (gsap && !reduceMotion) gsap.fromTo(menu.querySelectorAll("nav a"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .045, ease: "power3.out" });
    };
    const hideMenu = () => {
      menu.hidden = true;
      open.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    open?.addEventListener("click", showMenu);
    close?.addEventListener("click", hideMenu);
    addEventListener("keydown", (event) => { if (event.key === "Escape" && !menu.hidden) hideMenu(); });
  };

  const initScrollMotion = () => {
    if (reduceMotion || !gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll("main [data-title]").forEach((title) => {
      if (title.closest(".home-hero")) return;
      gsap.from(title.querySelectorAll(".word"), { yPercent: 112, duration: .8, stagger: .025, ease: "power3.out", scrollTrigger: { trigger: title, start: "top 88%", once: true } });
    });
    document.querySelectorAll("[data-image-reveal]").forEach((frame) => {
      gsap.from(frame, { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: "power4.inOut", scrollTrigger: { trigger: frame, start: "top 88%", once: true } });
      const img = frame.querySelector("img");
      if (img) gsap.from(img, { scale: 1.12, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: frame, start: "top 88%", once: true } });
    });
    document.querySelectorAll("[data-stat]").forEach((stat, index) => gsap.from(stat, { y: 28, opacity: 0, duration: .65, delay: (index % 4) * .05, scrollTrigger: { trigger: stat, start: "top 92%", once: true } }));
    document.querySelectorAll(".timeline li,.values-list li,.pillars li").forEach((row) => gsap.from(row, { y: 24, opacity: 0, duration: .65, scrollTrigger: { trigger: row, start: "top 91%", once: true } }));
    document.querySelectorAll("[data-reveal]").forEach((el) => { if (!el.closest(".home-hero")) gsap.from(el, { y: 18, opacity: 0, duration: .65, scrollTrigger: { trigger: el, start: "top 90%", once: true } }); });

    const homeImage = document.querySelector(".home-hero__image img");
    if (homeImage) gsap.to(homeImage, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: true } });
    document.querySelectorAll(".commitments figure img,.essence-closing figure img").forEach((img) => gsap.fromTo(img, { yPercent: -6, scale: 1.08 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  };

  const initUnits = () => {
    document.querySelectorAll("[data-unit]").forEach((unit, index) => {
      const button = unit.querySelector("button");
      const body = unit.querySelector(".unit__body");
      const toggle = (open) => {
        unit.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
        if (gsap && !reduceMotion) gsap.to(body, { maxHeight: open ? body.scrollHeight + 80 : 0, duration: .65, ease: "power3.inOut" });
        else body.style.maxHeight = open ? `${body.scrollHeight + 80}px` : "0";
      };
      button?.addEventListener("click", () => toggle(!unit.classList.contains("is-open")));
      if (index === 0) toggle(true);
    });
  };

  const initFaq = () => {
    document.querySelectorAll(".faq-list details").forEach((item) => item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".faq-list details[open]").forEach((other) => { if (other !== item) other.removeAttribute("open"); });
    }));
  };

  const initVideo = () => {
    const video = document.querySelector("[data-autoplay]");
    if (!video) return;
    if (!ScrollTrigger || reduceMotion) return;
    ScrollTrigger.create({ trigger: video, start: "top 85%", end: "bottom 15%", onEnter: () => video.play().catch(() => {}), onEnterBack: () => video.play().catch(() => {}), onLeave: () => video.pause(), onLeaveBack: () => video.pause() });
  };

  const initContact = () => {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const status = form.querySelector("[data-form-status]");
    const button = form.querySelector("button[type=submit] span");
    const language = document.body.dataset.language || "es";
    const labels = language === "en" ? { idle: "Send message", busy: "Sending…", ok: "We received your message and will reply as soon as possible.", error: "We could not send your message. Please try again." } : { idle: "Enviar mensaje", busy: "Enviando…", ok: "Recibimos tu mensaje. Te responderemos lo antes posible.", error: "No fue posible enviar el mensaje. Intenta nuevamente." };
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      button.textContent = labels.busy;
      status.textContent = "";
      try {
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `${data.get("name")} ${data.get("lastName")}`.trim(), email: data.get("email"), company: data.get("company"), message: `[${data.get("area")}]\n\n${data.get("message")}`, website: data.get("website"), language }) });
        if (!response.ok) throw new Error("delivery");
        form.reset();
        status.textContent = labels.ok;
      } catch (_) { status.textContent = labels.error; }
      finally { button.textContent = labels.idle; }
    });
  };

  const init = () => {
    splitTitles();
    initHeader();
    initLoader();
    initScrollMotion();
    initUnits();
    initFaq();
    initVideo();
    initContact();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
