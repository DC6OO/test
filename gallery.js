(function () {
  function renderGallery() {
    var grid = document.querySelector("[data-gallery-grid]");
    if (!grid || !window.ShopData) return;

    function escapeHtml(s) {
      var div = document.createElement("div");
      div.textContent = s;
      return div.innerHTML;
    }

    var items = window.ShopData.getGallery();
    grid.innerHTML = "";

    if (!items.length) {
      grid.innerHTML = '<p class="muted">Gallery photos coming soon.</p>';
      return;
    }

    items.forEach(function (item) {
      var figure = document.createElement("figure");
      figure.className = "gallery-item";
      figure.innerHTML =
        '<img src="' +
        item.image +
        '" alt="' +
        escapeHtml(item.alt || item.caption || "Connie's Cake Shop creation") +
        '" />' +
        "<figcaption>" +
        escapeHtml(item.caption || "Connie's Cake Shop") +
        "</figcaption>";
      grid.appendChild(figure);
    });
  }

  if (window.ShopData && typeof window.ShopData.whenReady === "function") {
    window.ShopData.whenReady().then(renderGallery);
  } else {
    renderGallery();
  }
})();
