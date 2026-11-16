// Matomo analytics: classic tracker only (no Tag Manager).
//
// Use this file when the Tag Manager container is empty or unused:
//   cp infra/analytics/matomo.tracker-only.js personal-website/public/js/matomo.js
//
// Loaded from a file, not inline, so the site can use a strict
// Content-Security-Policy (script-src 'self' https://analytics.reaw.me).
var _paq = (window._paq = window._paq || []);

// Cookieless tracking: uncomment so Matomo sets no cookies. Visitors are
// then not recognised across visits, and no cookie notice is needed for
// analytics. Must come before trackPageView.
// _paq.push(["disableCookies"]);

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
