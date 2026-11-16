// Single source of truth for the site's security and caching headers.
// generate.mjs turns this into each host's config format, and
// ../verify/verify.cjs tests the same policy against the built site.
//
// When the site starts loading something from a new origin (a font, a
// script, an API), add the origin here, regenerate, and re-run verify.

/**
 * @param {object} [options]
 * @param {string} [options.relayOrigin]  origin of the contact relay, e.g. https://contact-relay.x.workers.dev
 * @param {boolean} [options.turnstile]   allow Cloudflare Turnstile
 * @param {boolean} [options.upgradeInsecure] add upgrade-insecure-requests (ignored by browsers in Report-Only mode)
 */
export function buildCsp({ relayOrigin, turnstile = false, upgradeInsecure = true } = {}) {
  const directives = {
    "default-src": ["'self'"],
    // analytics.reaw.me: Matomo tracker and Tag Manager container
    "script-src": ["'self'", "https://analytics.reaw.me"],
    "style-src": ["'self'", "https://fonts.googleapis.com"],
    "font-src": ["https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https://analytics.reaw.me"],
    "connect-src": ["'self'", "https://analytics.reaw.me"],
    // The contact form's no-relay fallback is a normal POST to Getform.
    "form-action": ["https://getform.io"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
  };
  if (relayOrigin) directives["connect-src"].push(relayOrigin);
  if (turnstile) {
    directives["script-src"].push("https://challenges.cloudflare.com");
    directives["frame-src"] = ["https://challenges.cloudflare.com"];
  }
  const parts = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (upgradeInsecure) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

/**
 * Headers for every response.
 * enforce=false sends the policy as Report-Only: nothing is blocked, and
 * violations show in the browser console. Start there, then enforce.
 */
export function buildSecurityHeaders({ enforce = false, relayOrigin, turnstile = false } = {}) {
  const cspName = enforce ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";
  return {
    [cspName]: buildCsp({ relayOrigin, turnstile, upgradeInsecure: enforce }),
    // Add "; includeSubDomains" only once every subdomain is HTTPS-only.
    "Strict-Transport-Security": "max-age=31536000",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "X-Frame-Options": "DENY",
    "Cross-Origin-Opener-Policy": "same-origin",
  };
}

// Vite puts a content hash in every /assets/ filename, so those can be
// cached for a year. Files in /images/ keep their names, so cache briefly.
export const cacheRules = {
  assets: "public, max-age=31536000, immutable",
  images: "public, max-age=86400",
  html: "no-cache",
};
