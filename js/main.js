(function () {
  "use strict";

  var exploreBtn = document.getElementById("explore-btn");
  var natureSoundsBtn = document.getElementById("nature-sounds-btn");
  var menuBtn = document.getElementById("menu-btn");
  var lenis = null;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= Smooth scroll (Lenis) ================= */

  function initLenis() {
    if (reduceMotion || typeof Lenis === "undefined") return;

    lenis = new Lenis({ lerp: 0.085, autoRaf: false });

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }

    if (typeof gsap !== "undefined") {
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /* ================= Parallax hero (GSAP ScrollTrigger) ================= */

  function initParallax() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    var hero = document.querySelector(".hero");
    if (!hero) return;

    gsap.registerPlugin(ScrollTrigger);

    var bg = hero.querySelector('[data-parallax-hero="1"]');
    var content = hero.querySelector('[data-parallax-hero="2"]');
    var explore = hero.querySelector('[data-parallax-hero="3"]');
    var image = hero.querySelector(".hero-bg__img");

    if (reduceMotion) {
      gsap.set([bg, content, explore], { clearProps: "transform" });
      return;
    }

    var timeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.55,
        invalidateOnRefresh: true
      }
    });

    timeline
      .to(image, { yPercent: 18, scale: 1.08, ease: "none" }, 0)
      .to(bg, { yPercent: 7, ease: "none" }, 0)
      .to(content, { yPercent: -15, autoAlpha: 0.18, ease: "none" }, 0)
      .to(explore, { yPercent: 25, autoAlpha: 0, ease: "none" }, 0);
  }

  /* ================= Header: tombol ================= */

  if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
      if (lenis) {
        lenis.scrollTo(window.innerHeight);
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    });
  }

  if (natureSoundsBtn) {
    natureSoundsBtn.addEventListener("click", function () {
      var enabled = natureSoundsBtn.getAttribute("aria-pressed") === "true";
      natureSoundsBtn.setAttribute("aria-pressed", String(!enabled));
      natureSoundsBtn.setAttribute(
        "aria-label",
        enabled ? "Nyalakan suara alam" : "Matikan suara alam"
      );
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
    });
  }

  initLenis();
  initParallax();
})();
