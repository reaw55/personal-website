# Hand-off: personal-website → local Claude agent

**Repo:** `reaw55/personal-website` (**public**)
**Branch:** `claude/laughing-shannon-vl71kr` (not merged, no PR yet)
**App folder:** `personal-website/` (React 18 + Vite 8 + Tailwind 3)

A cloud session did a security, best-practice, design and responsiveness
review and fixed everything it could. The tasks below are left for you
because they need things the cloud session could not reach:

- the live site and its hosting
- `analytics.reaw.me` (Matomo)
- the Getform dashboard
- Discord and Cloudflare accounts
- `www.ise.eng.chula.ac.th`

Work through them in order and **ask the owner** whenever a step says so.

---

## Ground rules

- **The repo is public.** Never commit secrets: webhook URLs, API keys or
  Turnstile secrets. Never put them in `VITE_*` variables, because those end
  up in the public JS bundle.
- **Ask the owner before you:**
  - deploy
  - change DNS
  - change Matomo or Getform settings
  - delete anything on a server
  - open or merge a PR
- **Before every push**, from `personal-website/`: run `npm ci`, then
  `npm run lint`, then `npm run build`. Then run `npm run preview` and
  check the page in a browser at desktop and phone widths.
- Node **20.19+** is required (Vite 8). This is declared in `package.json`
  `engines`.

---

## Already done on this branch (don't redo)

**Security**
- Removed the unused `ContactForm.jsx`, which held a Discord webhook URL.
  The owner has already deleted that webhook in Discord.
- Added `rel="noopener noreferrer"` to every link that opens in a new tab;
  the ESLint rule for this is back on.
- Matomo now loads over `https` from `public/js/matomo.js`; there are no
  inline scripts or styles left.
- `npm audit` reports **0 vulnerabilities**.
- Added a `_gotcha` honeypot field and input length limits to the contact
  form.

**Build**
- Missing dependencies are now declared (`tailwindcss`,
  `tailwind-scrollbar`, `autoprefixer`, `postcss`, `prop-types`).
- PostCSS config fixed, so Autoprefixer actually runs.
- Upgraded Vite 5 → 8 and `@vitejs/plugin-react` 4 → 6.

**Bugs**
- `target="self"` opened new tabs ("Scroll down", "For Inquiries").
- The mobile menu didn't close after tapping a link.
- Image paths used backslashes.
- About-section link colours were changed by JS hover handlers.

**Accessibility**
- Icon-only links and the menu button now have accessible names, plus
  `aria-expanded` on the menu button.
- The hero name is the page `<h1>`.
- Duplicate card-overlay links are hidden from screen readers and keyboard
  focus.
- Text contrast now meets WCAG AA: footer text and three About links got
  lighter tints of their brand colours.
- "Reduce motion" is respected: no scroll-reveal animation and no smooth
  scrolling.

**Performance**
- Icon font subset to 6 icons (~544 KB → ~2 KB); unused Roboto removed.
- Images converted to WebP: hero 659 → 53 KB, awards about 1 MB → 255 KB.
  The RoboCup photographer credit is kept in its EXIF data.
- Deleted about 12.5 MB of unused images from `public/`. To recover any
  of them: `git checkout 7f4e233 -- personal-website/public/images/<path>`.

**Responsive and design**
- Hero:
  - fits on one screen on landscape phones (side-by-side layout) and on
    short laptops (photo capped to the screen height);
  - the photo is centred on tablets.
- Grids never force a column wider than the screen (280 px foldables work).
- Header aligned with the content width on ultrawide screens; it is more
  opaque, so content no longer shows through behind the logo.
- Certificate titles shown in full: truncation made the Kubernetes courses
  look like duplicates.
- Consistent spacing between certificate groups.
- Fixed the stray space before punctuation in About.
- Typos fixed.
- Verified with no sideways scrolling or clipped text at: 280×653,
  320×568, 360×740, 390×844, 430×932, 568×320, 667×375, 844×390,
  768×1024, 1024×768, 1024×1366, 1280×600, 1366×768, 1440×900, 1920×1080,
  2560×1080 and 3440×1440.

**SEO**
- Meta description, `theme-color`, Open Graph title/description,
  `noscript` message, and a ready-made 1200×630 preview image at
  `public/og-image.jpg`.

---

## Task 1: Find out where the site is hosted and its domain

Ask the owner:

1. Which host serves the site? (Cloudflare Pages, Netlify, Vercel, GitHub
   Pages, or their own server with nginx or Caddy?)
2. Which URL is canonical? (`reaw.me`, `reaw.dev`, `www.`?)
3. Does the deploy build run on Node 20.19 or newer? If not, raise it to
   Node 22 LTS in the host's settings.

Build settings for any host: base directory `personal-website`, build
command `npm run build`, output directory `dist`.

Tasks 2, 3 and the Discord SOP depend on these answers.

## Task 2: Security headers

These must be set by the host as HTTP headers; meta tags can't do this.
This Content-Security-Policy was tested against the built site with
Playwright and caused **zero violations**:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://analytics.reaw.me; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://analytics.reaw.me; connect-src 'self' https://analytics.reaw.me; form-action https://getform.io; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
```

Steps:

1. Ship the CSP first as **`Content-Security-Policy-Report-Only`** (same
   value). Load the live site with DevTools open, browse every section and
   submit the contact form, then check the console for violations. The
   cloud session couldn't load the Matomo Tag Manager container. If it
   contains custom HTML or JS tags, they will need additions, such as a
   script hash or the extra host.
2. Once the console is clean, switch the header to the enforcing
   `Content-Security-Policy`.
3. Add `includeSubDomains` to HSTS only if **every** subdomain is
   HTTPS-only (`nc.`, `analytics.` and so on). Confirm with the owner.
4. Caching: `/assets/*` gets `Cache-Control: public, max-age=31536000,
   immutable` (the filenames are hashed). `index.html` gets
   `Cache-Control: no-cache`.

Where the headers go:

- **Cloudflare Pages or Netlify:** create `personal-website/public/_headers`:
  ```
  /*
    Content-Security-Policy: <value above>
    Strict-Transport-Security: max-age=31536000
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
    X-Frame-Options: DENY
    Cross-Origin-Opener-Policy: same-origin
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  ```
- **Vercel:** use `headers` in `personal-website/vercel.json`.
- **nginx:** use `add_header <Name> "<value>" always;` in the server block.
- **Caddy:** use a `header { … }` block.
- **GitHub Pages:** it can't set custom headers. Suggest putting
  Cloudflare in front or moving hosts, and ask the owner.

Verify with `curl -sI https://<domain>/`, and optionally
securityheaders.com.

## Task 3: Domain-dependent SEO

Once you have the domain, add the following to `personal-website/index.html`
next to the existing Open Graph tags, and change the existing
`twitter:card` value to `summary_large_image`:

```html
<link rel="canonical" href="https://SITE/" />
<meta property="og:url" content="https://SITE/" />
<meta property="og:image" content="https://SITE/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Kritchavit (Reaw) Thippayajindakul – portfolio" />
```

Then create:

- `personal-website/public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://SITE/sitemap.xml
  ```
- `personal-website/public/sitemap.xml` with the single URL `https://SITE/`.

Check the result with LinkedIn Post Inspector or opengraph.xyz after
deploying.

## Task 4: Matomo loaded twice, plus privacy

`public/js/matomo.js` loads **both** the classic tracker and Tag Manager
(container `CZOdWKhK`). If the container also has a Matomo Analytics tag,
every page view is counted twice.

1. Open `https://analytics.reaw.me` → Tag Manager → the container → Tags
   (and check the published version).
2. If it has a Matomo tag, delete the "Matomo tracker" block from
   `matomo.js`. If the container is empty or unused, delete the "Tag Manager"
   block instead. Confirm the choice with the owner.
3. Check in Visits Log that one visit records exactly one page view.
4. Privacy: ask the owner whether to run cookieless. If yes, add
   `_paq.push(["disableCookies"]);` before `trackPageView`, or enable
   "Disable cookies" in the container's Matomo Configuration variable. If
   cookies stay, add a short privacy note in the footer (visitors may be
   covered by GDPR or Thailand's PDPA).

## Task 5: Getform spam settings

The form now sends a hidden `_gotcha` field, which is Getform's default
honeypot name.

1. Getform dashboard → the form → Settings → Spam filtering: make sure the
   honeypot is enabled and its field name is `_gotcha`. Enable reCAPTCHA or
   other spam filtering if the plan has it.
2. Test it:
   - a normal submission arrives;
   - a submission with `_gotcha` filled in (set it in DevTools) is
     filtered.

## Task 6: Discord notifications for the contact form

Follow **[`SOP-discord-contact-notifications.md`](SOP-discord-contact-notifications.md)**.
You will handle the webhook key. The SOP covers secret handling, the relay
code, tests, deployment, the frontend change, the CSP update and leak checks.

## Task 7: Small verifications

1. **HTTPS for the university links.** Run:
   ```bash
   curl -sI https://www.ise.eng.chula.ac.th/
   ```
   If it serves HTTPS, change the three `http://www.ise.eng.chula.ac.th…`
   links to `https://`. Two are in `src/components/About.jsx` and one is in
   `src/components/Awards.jsx`.
2. **Google Apps Script.** The deleted `ContactForm.jsx` also posted to a
   Google Apps Script web app, and its URL is in the public git history.
   Ask the owner whether that deployment is still needed. If not, archive it:
   script.google.com → project → Deploy → Manage deployments.
3. **Public file links.** The Nextcloud share links (`nc.reaw.me/s/…`) for
   the CV and certificates are public by design. Ask the owner whether the
   CV contains a phone number or home address they'd rather not publish.

## Task 8 (optional): CI and Dependabot

If the owner agrees:

- Add `.github/workflows/ci.yml`: on push and pull request, use Node 22,
  set the working directory to `personal-website`, then run `npm ci`,
  `npm run lint` and `npm run build`.
- Add `.github/dependabot.yml`: npm ecosystem, directory
  `/personal-website`, weekly.

---

## Design notes that need the owner's decision

These are content or taste calls, so they weren't changed:

1. **"Skills" only lists languages.** Either add technical skills (the
   design already supports icon cards) or rename the section to
   "Languages".
2. **Two contact calls-to-action in a row.** The "Let's Connect" section is
   followed immediately by the footer's "Questions? Reach Out Here". Consider
   a simpler footer.
3. **The Certificates section is very long on phones** (~30 cards, about a
   third of the page). Consider showing about 6 per group with a "Show all"
   button, or moving the Coursera list to a separate page.
4. **Copy polish.**
   - The About paragraph ("I am eager to learn more about those topics…")
     could be tighter.
   - The award titles mix styles ("First place of the scholarship fund" vs
     "Second Place ROBOCUP@Home 2022").
   - The ICE course link points to the department page; consider linking a
     project or thesis.
5. **Publications** has a single card with no image or description. A short
   abstract line would make it look less sparse.

---

## Definition of done

- [ ] Tasks 1–7 done, or explicitly declined by the owner.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] No CSP violations on the live site with enforcement on.
- [ ] Leak checks from the SOP (section 7) print nothing.
- [ ] Owner approved; PR opened from `claude/laughing-shannon-vl71kr` to
      `main`.

---

## Added later: audit and proposal

- **Full audit:** [`audit/AUDIT.md`](audit/AUDIT.md) is the index for the
  security, accessibility, performance/SEO and code-quality/design section
  files. Turn their "Open" findings into tasks.
- **Business proposal:**
  [`proposal/PROPOSAL.md`](proposal/PROPOSAL.md) is a trip-planning service
  for Thailand's lesser-known destinations, based on the owner's NIC-NIDA
  2023 paper. Research appendices sit in the same folder.
- These were produced in a short time box by parallel research agents.
  **If a section or research file is missing or marked incomplete, re-run
  that piece.** Treat every price and statistic marked "approx." as
  unverified until you've checked its source.
