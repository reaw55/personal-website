// Matomo analytics (self-hosted at analytics.reaw.me).
// Kept in a file rather than inline in index.html so the site can use a
// strict Content-Security-Policy (script-src 'self' https://analytics.reaw.me).
//
// NOTE: both the classic tracker AND Tag Manager are loaded. If the Tag
// Manager container also contains a "Matomo Analytics" tag, every page view
// is counted twice: keep only one of the two blocks below.

// --- Matomo tracker ---------------------------------------------------------
var _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "https://analytics.reaw.me/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "1"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = u + "matomo.js";
  s.parentNode.insertBefore(g, s);
})();

// --- Matomo Tag Manager -----------------------------------------------------
var _mtm = (window._mtm = window._mtm || []);
_mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
(function () {
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = "https://analytics.reaw.me/js/container_CZOdWKhK.js";
  s.parentNode.insertBefore(g, s);
})();
