(function () {
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (!open) {
        document.querySelectorAll(".nav-dropdown.is-open").forEach(function (dd) {
          closeDropdown(dd);
        });
      }
    });
  }

  function closeDropdown(dd) {
    dd.classList.remove("is-open");
    var btn = dd.querySelector(".nav-dropdown-toggle");
    var menu = dd.querySelector(".nav-dropdown-menu");
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (menu) menu.hidden = true;
  }

  function openDropdown(dd) {
    dd.classList.add("is-open");
    var btn = dd.querySelector(".nav-dropdown-toggle");
    var menu = dd.querySelector(".nav-dropdown-menu");
    if (btn) btn.setAttribute("aria-expanded", "true");
    if (menu) menu.hidden = false;
  }

  document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
    var btn = dd.querySelector(".nav-dropdown-toggle");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = dd.classList.contains("is-open");
      document.querySelectorAll(".nav-dropdown.is-open").forEach(function (other) {
        if (other !== dd) closeDropdown(other);
      });
      if (isOpen) closeDropdown(dd);
      else openDropdown(dd);
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".nav-dropdown")) return;
    document.querySelectorAll(".nav-dropdown.is-open").forEach(closeDropdown);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".nav-dropdown.is-open").forEach(closeDropdown);
    }
  });

  var root = document.querySelector("[data-slideshow]");
  if (!root) return;

  window.initSlideshow = function () {
    if (root.getAttribute("data-slideshow-ready") === "true") return;

    var slides = root.querySelectorAll("[data-slide]");
    var dotsContainer = root.querySelector(".slideshow-dots");
    var prevBtn = root.querySelector("[data-prev]");
    var nextBtn = root.querySelector("[data-next]");
    var total = slides.length;
    if (!total) return;

    root.setAttribute("data-slideshow-ready", "true");
    if (dotsContainer) dotsContainer.innerHTML = "";

    var index = 0;
    var timer = null;
    var intervalMs = 6000;

    function show(i) {
      index = ((i % total) + total) % total;
      slides.forEach(function (el, j) {
        el.classList.toggle("is-active", j === index);
      });
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll("button");
        dots.forEach(function (d, j) {
          d.setAttribute("aria-selected", j === index ? "true" : "false");
        });
      }
    }

    if (dotsContainer) {
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Go to slide " + (i + 1));
        b.addEventListener("click", function () {
          stop();
          show(i);
          start();
        });
        dotsContainer.appendChild(b);
      });
      show(0);
    }

    function next() {
      show(index + 1);
    }

    function prev() {
      show(index - 1);
    }

    function start() {
      stop();
      timer = window.setInterval(next, intervalMs);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        stop();
        next();
        start();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        stop();
        prev();
        start();
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    start();
  };

  window.initSlideshow();
})();
