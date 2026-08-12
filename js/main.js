(function () {
  "use strict";

  var exploreBtn = document.getElementById("explore-btn");
  var natureSoundsBtn = document.getElementById("nature-sounds-btn");
  var menuBtn = document.getElementById("menu-btn");

  if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
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
})();