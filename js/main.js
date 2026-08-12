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

    // Satu timeline scrubbed untuk mencegah tiap elemen bergerak dengan ritme berbeda.
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

/* ================= Peta interaktif (MapTiler + Leaflet) ================= */

var MAPTILER_KEY = (document.querySelector('meta[name="maptiler-api-key"]') || {}).content || "";
var queryKey = new URLSearchParams(window.location.search).get("maptilerKey");
if (queryKey) MAPTILER_KEY = queryKey;

var TILE_SOURCES = [];
if (MAPTILER_KEY) {
  TILE_SOURCES.push({
    name: "maptiler",
    url: "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=" + encodeURIComponent(MAPTILER_KEY),
    options: { maxZoom: 20, maxNativeZoom: 18, tileSize: 256 }
  });
}
TILE_SOURCES.push(
  {
    name: "carto",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    options: { subdomains: "abcd", maxZoom: 19, maxNativeZoom: 18 }
  },
  {
    name: "osm",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: { maxZoom: 19, maxNativeZoom: 18 }
  },
  {
    name: "esri",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    options: { maxZoom: 18 }
  }
);

var tileSourceIndex = 0;
var tileLayer = null;

function attachTiles() {
  if (!map) return;
  if (tileLayer) map.removeLayer(tileLayer);

  var loading = document.getElementById("map-loading");
  var src = TILE_SOURCES[tileSourceIndex];

  if (!src) {
    if (loading) loading.textContent = "Peta tidak dapat dimuat — periksa koneksi internet.";
    return;
  }

  tileLayer = L.tileLayer(src.url, Object.assign({}, src.options, {
    attribution: src.name === "maptiler" ? "© MapTiler © OpenStreetMap contributors" : "© OpenStreetMap © CARTO"
  }));
  var failed = false;

  tileLayer.on("tileerror", function () {
    if (failed) return;
    failed = true;
    // Jika key MapTiler salah atau tile service gagal, tetap tampilkan peta cadangan.
    tileSourceIndex += 1;
    if (tileSourceIndex < TILE_SOURCES.length) attachTiles();
    else if (loading) loading.textContent = "Peta tidak dapat dimuat — periksa koneksi internet.";
  });

  tileLayer.on("load", function () {
    if (loading) loading.style.display = "none";
    var credit = document.getElementById("map-credit");
    if (credit) {
      credit.textContent = src.name === "maptiler"
        ? "© MapTiler · © OpenStreetMap contributors"
        : "© OpenStreetMap · © CARTO";
    }
  });

  tileLayer.addTo(map);
}

function initMap() {
  var mapEl = document.getElementById("map");
  if (!mapEl || !card) return;

  if (typeof L === "undefined") {
    mapEl.textContent = "Peta tidak dapat dimuat — pastikan koneksi internet tersedia.";
    return;
  }

  map = L.map(mapEl, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false
  });

  attachTiles();

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