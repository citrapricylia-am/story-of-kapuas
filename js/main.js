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
      lat: -0.8348,
      lng: 112.9369
    },
    {
      id: "sintang",
      nama: "Kabupaten Sintang",
      ibu: "Ibu kota: Sintang",
      label: "SINTANG",
      cat: "Persimpangan Budaya",
      desk: "Titik pertemuan aliran sungai dan tradisi Dayak kuno, tempat dua arus bersatu.",
      lat: -0.064,
      lng: 111.4948
    },
    {
      id: "sanggau",
      nama: "Kabupaten Sanggau",
      ibu: "Ibu kota: Sanggau",
      label: "SANGGAU",
      cat: "Warisan Hilir",
      desk: "Permukiman tua di aliran tengah Kapuas yang menjadi saksi perdagangan sungai.",
      lat: 0.1287,
      lng: 110.597
    }
  ];

  /* ================= Elemen ================= */

  var exploreBtn = document.getElementById("explore-btn");
  var natureSoundsBtn = document.getElementById("nature-sounds-btn");
  var menuBtn = document.getElementById("menu-btn");
  var card = document.getElementById("map-card");
  var lenis = null;
  var map = null;
  var markers = [];
  var activeIndex = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= Smooth scroll (Lenis) ================= */

  function initLenis() {
    if (reduceMotion || typeof Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.085 });
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
        scrub: 0.8
      }
    });

    var layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 }
    ];

    layers.forEach(function (layerObj, idx) {
      tl.to(
        layersEl.querySelectorAll('[data-parallax-layer="' + layerObj.layer + '"]'),
        { yPercent: layerObj.yPercent, ease: "none" },
        idx === 0 ? undefined : "<"
      );
    });
  }

/* ================= Peta interaktif (Leaflet tile map) ================= */

function initMap() {
  var mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined" || !card) return;

  map = L.map(mapEl, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    maxNativeZoom: 18
  }).addTo(map);

  var bounds = [];

  KABUPATEN.forEach(function (item, idx) {
    var icon = L.divIcon({
      className: "map-marker" + (idx === 0 ? " is-active" : ""),
      html:
        '<span class="map-marker__dot"></span>' +
        '<span class="map-marker__halo" aria-hidden="true"></span>' +
        '<span class="map-marker__name">' + item.label + "</span>",
      iconSize: [150, 46],
      iconAnchor: [75, 23]
    });

    var marker = L.marker([item.lat, item.lng], {
      icon: icon,
      title: item.nama,
      riseOnHover: true
    });
    marker.on("click", function () {
      select(item.id);
    });
    marker.addTo(map);

    markers.push({ item: item, marker: marker });
    bounds.push([item.lat, item.lng]);
  });

  map.fitBounds(bounds, { padding: [110, 110] });

  function fit() {
    if (map) map.invalidateSize();
  }
  setTimeout(fit, 300);
  window.addEventListener("resize", fit);
}

function select(id) {
  var idx = -1;
  KABUPATEN.forEach(function (item, i) {
    if (item.id === id) idx = i;
  });
  if (idx < 0) return;
  activeIndex = idx;

  markers.forEach(function (entry, i) {
    var el = entry.marker.getElement();
    if (!el) return;
    var active = i === idx;
    if (active) {
      el.classList.add("is-active");
    } else {
      el.classList.remove("is-active");
    }
  });

  renderCard(KABUPATEN[idx], idx);
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

  function initMapData() {
    if (!card) return;
    renderCard(KABUPATEN[0], 0);
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
  initMapData();
  initMap();
  initParallax();
})();