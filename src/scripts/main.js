(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const splitWords = () => {
    document.querySelectorAll("[data-split]").forEach((element) => {
      const label = element.textContent.trim();
      element.setAttribute("aria-label", label);
      element.innerHTML = label.split(/\s+/).map((word) =>
        `<span class="word-wrap" aria-hidden="true"><span class="word">${word}</span></span>`
      ).join(" ");
    });
  };

  const openSite = () => {
    document.body.classList.remove("is-loading");
    const loader = document.querySelector("[data-loader]");
    if (loader) loader.remove();
  };

  const initLoader = () => {
    const loader = document.querySelector("[data-loader]");
    if (!loader || reduceMotion || !gsap) {
      openSite();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: openSite });
    gsap.set(".loader-mark--symbol img", { xPercent: 18, opacity: 0 });
    gsap.set(".loader-mark--word img", { clipPath: "inset(0 100% 0 0)", opacity: 1 });
    gsap.set([".loader-thread", ".loader-needle", ".loader-eye"], { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(".loader-index", { opacity: 0, y: 8 });

    tl.to(".loader-mark--symbol img", { xPercent: 0, opacity: 1, duration: .65 })
      .to(".loader-mark--word img", { clipPath: "inset(0 0% 0 0)", duration: .95 }, "-=.15")
      .to(".loader-needle", { strokeDashoffset: 0, duration: .48 }, "-=.55")
      .to(".loader-eye", { strokeDashoffset: 0, duration: .25 }, "-=.25")
      .to(".loader-thread", { strokeDashoffset: 0, duration: .7, ease: "power2.inOut" }, "-=.15")
      .to(".loader-index", { opacity: 1, y: 0, duration: .3 }, "-=.35")
      .to(".loader-stage", { scale: 1.025, duration: .45, ease: "power1.inOut" }, "+=.15")
      .to(loader, { yPercent: -100, duration: .9, ease: "power4.inOut" })
      .from(".site-header", { yPercent: -100, duration: .55 }, "-=.45")
      .from(".hero .word", { yPercent: 115, duration: .85, stagger: .035 }, "-=.42")
      .from(".hero [data-reveal]", { y: 24, opacity: 0, duration: .6, stagger: .08 }, "-=.55");
  };

  const initHeader = () => {
    const header = document.querySelector("[data-header]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!header) return;

    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        menu.hidden = expanded;
        header.classList.toggle("is-scrolled", !expanded || window.scrollY > 40);
      });
      menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      }));
    }
  };

  const initHero = () => {
    const frames = [...document.querySelectorAll("[data-hero-frame]")];
    const progress = document.querySelector("[data-hero-progress]");
    if (frames.length < 2 || reduceMotion || !gsap) return;
    let active = 0;
    let cycle;

    const schedule = () => {
      gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 5.6, ease: "none", onComplete: next });
    };
    const next = () => {
      const previous = frames[active];
      active = (active + 1) % frames.length;
      const current = frames[active];
      gsap.set(current, { autoAlpha: 1, zIndex: 1 });
      current.classList.add("is-active");
      gsap.fromTo(current.querySelector("img"), { scale: 1.06 }, { scale: 1, duration: 1.5, ease: "power2.out" });
      gsap.to(previous, { autoAlpha: 0, duration: .9, onComplete: () => {
        previous.classList.remove("is-active");
        gsap.set(previous, { zIndex: 0 });
      }});
      schedule();
    };
    schedule();
  };

  const initScrollMotion = () => {
    if (reduceMotion || !gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll("main [data-split]").forEach((title) => {
      if (title.closest(".hero")) return;
      gsap.from(title.querySelectorAll(".word"), {
        yPercent: 110,
        duration: .9,
        stagger: .025,
        ease: "power3.out",
        scrollTrigger: { trigger: title, start: "top 84%", once: true }
      });
    });

    document.querySelectorAll("main [data-reveal]").forEach((item) => {
      if (item.closest(".hero")) return;
      gsap.from(item, {
        y: 28,
        opacity: 0,
        duration: .75,
        ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 88%", once: true }
      });
    });

    gsap.from(".purpose-image--main", {
      clipPath: "inset(100% 0 0 0)",
      duration: 1.2,
      ease: "power4.inOut",
      scrollTrigger: { trigger: "[data-purpose-showcase]", start: "top 77%", once: true }
    });
    gsap.from(".purpose-image--detail", {
      clipPath: "inset(0 100% 0 0)",
      x: 60,
      duration: 1,
      delay: .25,
      ease: "power3.out",
      scrollTrigger: { trigger: "[data-purpose-showcase]", start: "top 75%", once: true }
    });

    const media = gsap.matchMedia();
    media.add("(min-width: 961px)", () => {
      const track = document.querySelector("[data-horizontal-track]");
      const wrap = document.querySelector("[data-horizontal-wrap]");
      if (!track || !wrap) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--page-pad")));
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 14%",
          end: () => `+=${distance() + window.innerHeight * .6}`,
          scrub: .75,
          pin: true,
          invalidateOnRefresh: true
        }
      });
    });

    gsap.from("[data-thread-path]", {
      strokeDasharray: 1,
      strokeDashoffset: 1,
      ease: "none",
      scrollTrigger: { trigger: ".ethics", start: "top 75%", end: "bottom 55%", scrub: true }
    });

    document.querySelectorAll("[data-stat]").forEach((stat, index) => {
      gsap.from(stat, {
        y: 34,
        opacity: 0,
        duration: .7,
        delay: index * .05,
        scrollTrigger: { trigger: stat, start: "top 90%", once: true }
      });
    });

    const video = document.querySelector("[data-sustainability-video]");
    if (video) {
      ScrollTrigger.create({
        trigger: video,
        start: "top 85%",
        end: "bottom 15%",
        onEnter: () => video.play().catch(() => {}),
        onEnterBack: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause()
      });
    }
  };

  const initFaq = () => {
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        document.querySelectorAll(".faq-item[open]").forEach((other) => {
          if (other !== item) other.removeAttribute("open");
        });
      });
    });
  };

  const init = () => {
    splitWords();
    initHeader();
    initLoader();
    initHero();
    initScrollMotion();
    initFaq();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
