# TODO

Details for each item are in [HANDOFF.md](HANDOFF.md),
[audit/AUDIT.md](audit/AUDIT.md) and
[proposal/PROPOSAL.md](proposal/PROPOSAL.md).

## Quick wins (5–10 min each)
- [ ] Skip-to-content link as the first focusable element (A11Y-4)
- [ ] `aria-current="page"` on the active nav link (A11Y-6)
- [ ] Heading for the About section, visually hidden if needed (A11Y-5)
- [ ] JSON-LD `Person` schema with name, alumniOf and sameAs social links;
      add `url` once the domain is known (SEO-4)
- [ ] Use the full name in `<title>` (SEO-5)
- [ ] Make labels consistent: "Publication" vs "Publications",
      "Contact Me" vs "Contact me", "ROBOCUP" vs "RoboCup" (UI-7/8)

## Needs the owner or the live environment
- [ ] Confirm the host, the domain and that the build uses Node 20.19+ (HANDOFF Task 1)
- [ ] Security headers and CSP: Report-Only first, then enforce (Task 2, SEC-3)
- [ ] Canonical link, og:url, og:image, robots.txt, sitemap.xml (Task 3, SEO-2/3)
- [ ] Matomo: keep only one of tracker / Tag Manager; decide on cookieless
      mode and a privacy note (Task 4, SEC-4/5)
- [ ] Getform: enable the `_gotcha` honeypot and spam filtering (Task 5)
- [ ] Discord notifications through the relay
      ([SOP](SOP-discord-contact-notifications.md)) (Task 6)
- [ ] Archive the old Google Apps Script deployment; confirm the Discord
      webhook is revoked (SEC-1/2)
- [ ] Switch the ise.eng.chula.ac.th links to https if supported (SEC-9)
- [ ] Check that the public Nextcloud links and the CV contain no personal data (SEC-7)
- [ ] Owner approval, then open a PR from this branch to `main`

## Bigger work
- [ ] Prerender the page at build time so content exists without JS (SEO-1)
- [ ] Navbar: React state plus IntersectionObserver instead of DOM mutation
      and per-scroll layout reads (CQ-1/2)
- [ ] Move content into `src/data/`; deduplicate the nav, social and
      section lists and the 30 `imgStyle` copies (CQ-4/5/6)
- [ ] Self-host Inter and replace the icon font with inline SVG (PERF-2)
- [ ] CI (lint and build) and Dependabot (Task 8, CQ-12)
- [ ] Rename `imcSrc`→`imgSrc`, `Cousera`→`Coursera`, `protait`→`portrait`,
      and give components PascalCase file names (CQ-7/8)
- [ ] Design tokens in tailwind.config.js (colours, radii) (UI-1..6)

## Content decisions
- [ ] Skills section: add technical skills, or rename it to "Languages"
- [ ] Merge the two back-to-back contact calls-to-action
- [ ] Certificates: "Show all" toggle on mobile
- [ ] Publications: add an abstract line or image

## Proposal
- [ ] Verify every "approx." figure against TAT/MOTS and live quotes
- [ ] Confirm the official list of 55 secondary provinces and the 2026 tax incentive
- [ ] Interview 10 partners and 10 travellers per pilot province
- [ ] Choose 2 pilot provinces and a licensed tour-operator partner
