(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var heroMedia = document.querySelector(".hero-media");
  var dialog = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCap = document.getElementById("lightbox-caption");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (!reduceMotion && heroMedia) {
    var ticking = false;
    var parallax = function () {
      ticking = false;
      var shift = Math.min(window.scrollY * 0.16, 56);
      heroMedia.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(parallax);
        }
      },
      { passive: true }
    );
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-ready");
    var reveals = document.querySelectorAll(".reveal");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (dialog && lightboxImg) {
    document.querySelectorAll("[data-lightbox]").forEach(function (button) {
      button.addEventListener("click", function () {
        var full = button.getAttribute("data-full");
        var fallback = button.getAttribute("data-fallback");
        var label = button.getAttribute("data-label") || "Concept art";
        lightboxImg.alt = label;
        lightboxImg.src = full;
        lightboxImg.onerror = function () {
          if (fallback && lightboxImg.src.indexOf(fallback) === -1) lightboxImg.src = fallback;
        };
        if (lightboxCap) lightboxCap.textContent = "Concept art";
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      });
    });

    dialog.querySelectorAll("[data-close]").forEach(function (closer) {
      closer.addEventListener("click", function () {
        dialog.close();
      });
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      lightboxImg.removeAttribute("src");
    });
  }
})();
