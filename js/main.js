(function () {
  "use strict";

  /* ================= Data 3 kabupaten ================= */

  var KABUPATEN = [
    {
      id: "kapuas-hulu",
      nama: "Kabupaten Kapuas Hulu",
      ibu: "Ibu kota: Putussibau",
      label: "KAPUAS HULU",
      cat: "Pintu Gerbang Hulu",
      desk: "Pusat jejak sejarah di hulu sungai — gerbang menuju Taman Nasional Betung Kerihun dan Danau Sentarum.",
      x: 73.3,
      y: 40.4
    },
    {
      id: "sintang",
      nama: "Kabupaten Sintang",
      ibu: "Ibu kota: Sintang",
      label: "SINTANG",
      cat: "Persimpangan Budaya",
      desk: "Titik pertemuan aliran sungai dan tradisi Dayak kuno, tempat dua arus bersatu.",
      x: 55.3,
      y: 52.9
    },
    {
      id: "sanggau",
      nama: "Kabupaten Sanggau",
      ibu: "Ibu kota: Sanggau",
      label: "SANGGAU",
      cat: "Warisan Hilir",
      desk: "Permukiman tua di aliran tengah Kapuas yang menjadi saksi perdagangan sungai.",
      x: 42.3,
      y: 60.4
    }
  ];

  /* ================= Elemen ================= */

  var exploreBtn = document.getElementById("explore-btn");
  var natureSoundsBtn = document.getElementById("nature-sounds-btn");
  var menuBtn = document.getElementById("menu-btn");
  var pinWrap = document.getElementById("map-pins");
  var card = document.getElementById("map-card");
  var lenis = null;
  var activeIndex = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= Smooth scroll (Lenis) ================= */

  function initLenis() {
    if (reduceMotion || typeof Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.09 });
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

  /* ================= Parallax map (GSAP ScrollTrigger) ================= */

  function initParallax() {
    if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    var section = document.querySelector(".map-section");
    var visual = document.querySelector(".map-visual");
    var layersEl = document.querySelector("[data-parallax-layers]");
    if (!section || !visual || !layersEl) return;

    gsap.registerPlugin(ScrollTrigger);

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0
      }
    });

    var layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 }
    ];

    layers.forEach(function (layerObj, idx) {
      tl.to(
        layersEl.querySelectorAll('[data-parallax-layer="' + layerObj.layer + '"]'),
        { yPercent: layerObj.yPercent, ease: "none" },
        idx === 0 ? undefined : "<"
      );
    });
  }

  /* ================= Peta: penanda + kartu ================= */

  function renderPins() {
    if (!pinWrap) return;
    var html = "";
    KABUPATEN.forEach(function (item, idx) {
      html +=
        '<button type="button" class="map-pin' + (idx === 0 ? " is-active" : "") +
        '" data-id="' + item.id + '" style="left:' + item.x + "%;top:" + item.y +
        '%" aria-label="Tampilkan detail ' + item.nama + '" aria-pressed="' + (idx === 0) + '">' +
        '<span class="map-pin__halo" aria-hidden="true"></span>' +
        '<span class="map-pin__dot" aria-hidden="true"></span>' +
        '<span class="map-pin__name">' + item.label + "</span>" +
        "</button>";
    });
    pinWrap.innerHTML = html;
  }

  function renderCard(item, idx) {
    if (!card) return;
    var num = String(idx + 1).padStart(2, "0");
    card.innerHTML =
      '<span class="map-card__index">' + num + "</span>" +
      '<p class="map-card__cat">' + item.cat + "</p>" +
      '<h3 class="map-card__name">' + item.nama + "</h3>" +
      '<p class="map-card__city">' + item.ibu + "</p>" +
      '<p class="map-card__desc">' + item.desk + "</p>";
  }

  function select(id) {
    var idx = -1;
    KABUPATEN.forEach(function (item, i) {
      if (item.id === id) idx = i;
    });
    if (idx < 0) return;
    activeIndex = idx;

    var pins = pinWrap ? pinWrap.querySelectorAll(".map-pin") : [];
    pins.forEach(function (pin, i) {
      var active = i === idx;
      pin.classList.toggle("is-active", active);
      pin.setAttribute("aria-pressed", String(active));
    });

    renderCard(KABUPATEN[idx], idx);
  }

  function initMap() {
    if (!pinWrap || !card) return;
    renderPins();
    renderCard(KABUPATEN[0], 0);

    pinWrap.addEventListener("click", function (e) {
      var pin = e.target.closest("[data-id]");
      if (pin) select(pin.getAttribute("data-id"));
    });
  }

  /* ================= Header: tombol ================= */

  if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
      var target = Math.ceil(window.innerHeight);
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
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

  /* ================= Init ================= */

  initLenis();
  initMap();
  initParallax();
})();