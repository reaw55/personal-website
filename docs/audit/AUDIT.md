# Website audit: personal-website

**Date:** 2026-11-05
**Branch audited:** `claude/laughing-shannon-vl71kr`
**Scope:** `personal-website/` (React 18, Vite 8, Tailwind 3, GSAP, Lenis; static single-page site)

The audit was split into four parallel reviews, one file each:

| Area | File |
| --- | --- |
| Security and privacy | [security.md](security.md) |
| Accessibility (WCAG 2.2 AA) | [accessibility.md](accessibility.md) |
| Performance and SEO | [performance-seo.md](performance-seo.md) |
| Code quality and UI consistency | [code-quality-design.md](code-quality-design.md) |

A section file that is missing means that review didn't finish within the
time box. Re-run it with the same scope.

## Summary of what was already fixed on this branch

- **Secrets:** removed the leaked Discord webhook. The owner had already
  deleted it in Discord.
- **Security:** `rel="noopener noreferrer"` on every new-tab link; the
  analytics snippet moved into a file so the page can use a strict CSP.
- **Dependencies:** 0 known vulnerabilities after `npm audit`. Vite 8, with
  Node 20.19 or newer required.
- **Build:** a clean install builds again (missing dependencies declared,
  PostCSS fixed).
- **Bugs:** "Scroll down" opened a new tab; the mobile menu didn't close
  after tapping a link.
- **Accessibility:**
  - names on icon-only links and buttons;
  - the hero name is the page `<h1>`;
  - contrast meets AA;
  - "reduce motion" is respected.
- **Performance:**
  - icon font cut from 544 KB to 2 KB;
  - images converted to WebP;
  - 12.5 MB of unused files removed.
- **Responsive:** checked at 17 screen sizes from 280 px to 3440 px; the
  hero fits on one screen in landscape.

## Open items requiring the owner or the live environment

Full steps for each are in [`../HANDOFF.md`](../HANDOFF.md).

1. **Security headers and CSP:** set at the host, Report-Only first.
2. **Domain:** canonical link, `og:url`, `og:image`, `robots.txt` and
   `sitemap.xml`.
3. **Matomo:** loaded twice, so page views are likely double-counted;
   decide on cookieless tracking and a privacy note.
4. **Getform:** enable honeypot and spam filtering in the dashboard.
5. **Discord:** set up form notifications through the server-side relay
   ([SOP](../SOP-discord-contact-notifications.md)).
6. **Content decisions:**
   - the Skills section only lists languages;
   - the contact call-to-action appears twice in a row;
   - the certificates section is very long on phones.
7. **Quality gates:** CI (lint and build) and Dependabot.
