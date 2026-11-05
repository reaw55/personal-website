# Performance and SEO audit

Branch `claude/laughing-shannon-vl71kr`, app in `personal-website/`. Date: 2026-11-05.

## Summary

- **Build (`npm run build`, Vite 8.3.6):** 43 modules, built in about 1 s.
  - One JS chunk: **313.46 kB (106.08 kB gzip)**.
  - One CSS file: 26.83 kB (5.41 kB gzip).
  - `index.html`: 2.43 kB.
  - `dist/` totals about 1.4 MB on disk, of which about 1.0 MB is images: 22 SVG, 6 WebP, 4 PNG and 1 ICO, plus the 60 kB `og-image.jpg`.
- **Lab measurement:** Playwright Chromium against `vite preview`, localhost, desktop 1280x800, no throttling.

  | Metric | Value |
  |---|---|
  | First paint (FP) | 388 ms |
  | First contentful paint (FCP) | 564 ms |
  | Largest contentful paint (LCP) | 616 ms. The element is the hero `<img>` `/images/protait/h-p-c-2.webp` |
  | DOMContentLoaded | 406 ms |
  | load | 879 ms |
  | Cumulative layout shift (CLS) on load | 0.0004 |

  The page made 26 resource requests. On localhost every first-party file arrives in about 30 ms. The slowest requests are the two render-blocking Google Fonts stylesheets, at about 350 ms each.
- **Biggest SEO problem:** the site renders only on the client. With JavaScript off, the whole body text is "This site needs JavaScript enabled to display its content." Crawlers and link-preview bots that do not run JavaScript see no name, publications or awards.
- **Missing SEO files and tags:** there is no canonical, `og:url`, `og:image`, `robots.txt`, `sitemap.xml` or JSON-LD. Most of these need the production domain (HANDOFF Task 3).

## Findings

| ID | Impact | Status | Finding | Evidence | Recommendation |
|---|---|---|---|---|---|
| SEO-1 | High | Open | All content is rendered on the client, so the HTML has no indexable text. | With JavaScript disabled, Playwright's `body.innerText` is only the `<noscript>` message. `index.html` has an empty `<div id="root">`. | The page is static, so prerender it at build time, for example with `vite-react-ssg` or a small `renderToString` build step plus `hydrateRoot`. This puts the full HTML in `dist/index.html`. |
| SEO-2 | High | Needs domain | There is no `<link rel="canonical">`, `og:url` or `og:image`, and `twitter:card` is `summary`. `public/og-image.jpg` (1200x630, 60 kB) is shipped but no tag references it. | `grep` finds no `canonical`, `og:url` or `og:image` in `index.html`. | Add the tags in HANDOFF Task 3 once the domain is known. Switch to `summary_large_image`. |
| SEO-3 | Medium | Needs domain | There is no `robots.txt` and no `sitemap.xml`. | Neither file is in `public/` or `dist/`. | Create both as described in HANDOFF Task 3. |
| SEO-4 | Medium | Open | There is no structured data. The JSON-LD `Person` schema is missing. | No `application/ld+json` in `index.html` or `src/`. | Add a static `<script type="application/ld+json">` with `@type: Person`. Include `name`, `alternateName: "Reaw"`, `alumniOf` (Chulalongkorn University) and `sameAs` (LinkedIn, GitHub, Scholar/ORCID). Add `url` once the domain is known. This needs no JavaScript, so it also helps before SEO-1 is fixed. Under the strict CSP in HANDOFF Task 2, an inline JSON-LD block is data, not a script, so it is allowed. |
| SEO-5 | Low | Open | The `<title>` is "Reaw's Portfolio" and does not contain the full name people search for. | `index.html` line 9. | Change it to something like `Kritchavit (Reaw) Thippayajindakul – Portfolio`. |
| PERF-1 | Medium | Open | The LCP image is found late. The hero `<img>` exists only after React runs, so the browser cannot request it until the 106 kB gzip bundle has downloaded and executed. | LCP is the hero image. The `<img>` is in `Hero.jsx`, not in `index.html`. | Add `<link rel="preload" as="image" href="/images/protait/h-p-c-2.webp" fetchpriority="high">` to `index.html`. Prerendering (SEO-1) also fixes this. |
| PERF-2 | Medium | Open | Two cross-origin Google Fonts stylesheets block rendering. Material Symbols uses `display=block`, so icons stay invisible until the font arrives. | `renderBlockingStatus: "blocking"` for both `fonts.googleapis.com` CSS requests, about 345 and 357 ms in the lab. Each then needs a second request to `fonts.gstatic.com`. | Self-host Inter as one subset `woff2`, for example via `@fontsource/inter`, and preload it. Replace the 6 Material Symbols icons with inline SVGs. This removes both third-party origins and simplifies the CSP. |
| PERF-3 | Medium | Open | The single JS chunk is 313 kB (106 kB gzip). It includes GSAP core, ScrollTrigger, `@gsap/react` and Lenis. These are used only for the `.reveal-up` scroll fade-in and smooth scrolling. | `App.jsx` lines 2-8 and 29-45. Build output above. The size of each library was not measured. | Run `rollup-plugin-visualizer` once to confirm the split. Consider an `IntersectionObserver` plus a CSS transition for the reveal, and dropping Lenis or loading it with `import()` after first paint. |
| PERF-4 | Low | Open | Below-the-fold images in About and LangCard load eagerly. They have no `loading="lazy"`. | Fetched on first load: 5 university logos in About (`icon-ICE.png` 29.8 kB, `ISE_Logo.svg` 14.9 kB and others) and 3 flag PNGs (`uk.png` 19.5 kB, `japan.png` 17.8 kB on disk, `thailand.png` 16.1 kB), about 108 kB in total. The flags are shown at 60x60. | Add `loading="lazy" decoding="async"`. Convert the flag PNGs and `icon-ICE.png` to SVG or small WebP. |
| PERF-5 | Low | Open | Most `<img>` elements have no `width` and `height` attributes, a CLS risk. | Only 6 rendered images have dimensions: the header and footer logos, the hero and the 3 flags. The rest have none, including the About logos and the Award, Paper and Cert card images. Measured CLS on load is 0.0004, because the containers are sized (`aspect-square`, fixed figure sizes). CLS while scrolling, as lazy images arrive, was not measured. | Add intrinsic `width`/`height` to the card images, or make sure every wrapping figure has a fixed aspect ratio. |
| PERF-6 | Medium | Needs domain | Caching and compression depend on the host. The images in `public/images/` have no content hash, so they cannot be cached as immutable. | There is no hosting config in the repo: no `_headers`, `vercel.json`, `netlify.toml` or similar. | Follow HANDOFF Task 2: `/assets/*` gets `max-age=31536000, immutable` and `index.html` gets `no-cache`. Give `/images/*` a moderate `max-age` such as 1 week, or import the images through Vite so they get hashed names. Make sure the host serves Brotli or gzip. |
| PERF-7 | Low | Needs domain | Matomo loads two third-party scripts: the classic tracker and the Tag Manager container. | `analytics.reaw.me/matomo.js` and `container_CZOdWKhK.js` were both requested. Both are non-blocking because `public/js/matomo.js` uses `defer`. | Keep only one, as described in HANDOFF Task 4. |

## Verified OK

- **Hero (LCP) image, done on this branch:**
  - `width={565} height={844}` matches the file's real 565x844.
  - It has `fetchpriority="high"` and is not lazy.
  - It does not have the `.reveal-up` class, so GSAP does not hide it with opacity 0.
  - It is WebP, 54.5 kB.
- **Lazy loading:** Award, Cert and Paper card images use `loading="lazy"`. Award and Cert also have `decoding="async"`; PaperCard does not, which is minor.
- **Image formats:** photos are WebP and logos are SVG.
- **Render-blocking resources:** the only ones are the app CSS (5.4 kB gzip) and the two font stylesheets. The app bundle is `type="module"` (deferred) and `/js/matomo.js` uses `defer`.
- **Font loading:**
  - `preconnect` is set for `fonts.googleapis.com` and `fonts.gstatic.com`, with `crossorigin` on gstatic.
  - Inter uses `display=swap`.
  - Material Symbols is subset with `icon_names` to 6 icons; its CSS is 780 B.
- **Head tags:** `lang="en"`, `meta description`, `author`, `theme-color`, `og:type`, `og:title` and `og:description` are present. A `<noscript>` fallback exists.
- **Reduced motion:** `gsap.matchMedia` runs the reveal animations only for `prefers-reduced-motion: no-preference`, and Lenis is skipped entirely for users who prefer reduced motion.
- **Layout stability:** lab CLS on load is 0.0004, well under the 0.1 "good" threshold.
- **Build:** clean, with no warnings.
