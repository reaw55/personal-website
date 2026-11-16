// Matomo analytics: Tag Manager only (no separate tracker).
//
// Use this file when the Tag Manager container already has a
// "Matomo Analytics" tag, so the container does the page-view tracking:
//   cp infra/analytics/matomo.tag-manager-only.js personal-website/public/js/matomo.js
//
// Cookieless tracking is then switched on inside Matomo, not here:
// Tag Manager > Variables > the Matomo Configuration variable >
// "Disable cookies".
//
// Loaded from a file, not inline, so the site can use a strict
// Content-Security-Policy (script-src 'self' https://analytics.reaw.me).
// A container that uses Custom HTML tags injects inline scripts, which
// that policy blocks: check with infra/verify after switching.
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
