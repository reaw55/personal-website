# Hand-off: take over and put the site on its infrastructure

**For:** a local Claude agent (or a person) working on the owner's machine,
with access to the hosting, the domain, Matomo, Getform, Discord and
Cloudflare.

**Repo:** `reaw55/personal-website` (**public**)
**Branch:** `claude/laughing-shannon-vl71kr`. It is not merged and has no
pull request yet.

A cloud session reviewed and fixed the site, then packaged everything the
infrastructure work needs into `infra/`. That session could not reach the
live site or any of the owner's accounts, so nothing in `infra/` has been
applied. Your job is to apply it, in the order below.

---

## 1. What is in the package

| Path | What it does | How it was tested |
| --- | --- | --- |
| `infra/scripts/set-domain.mjs` | Writes the site's address into the page (canonical link, link-preview image, a "Person" block for search engines) and creates `robots.txt` and `sitemap.xml` | Run twice with test domains; the second run cleanly replaced the first. The page with those tags passed every check |
| `infra/headers/policy.mjs` | The one definition of the security headers and caching rules | The same policy is what `verify` tests |
| `infra/headers/generate.mjs` | Turns that policy into config for Cloudflare Pages, Netlify, Vercel, nginx or Caddy | nginx: served the built site through real nginx 1.24 with the generated config; all 26 checks passed in both report-only and enforcing mode. Cloudflare, Netlify and Vercel output was generated and format-checked but not deployed. Caddy output was not run |
| `infra/contact-relay/` | Cloudflare Worker that forwards the contact form to Discord, so the webhook stays secret | 16 unit tests, plus an end-to-end run: site form → relay → a stand-in Discord server. Never run on Cloudflare or against real Discord |
| `infra/analytics/` | Two ready replacements for the analytics file: tracker only, or Tag Manager only | Syntax-checked; the tracker code matches the live file. Not run against Matomo |
| `infra/github/` | CI workflow (lint, build, relay tests) and Dependabot config, inactive until copied to `.github/` | YAML syntax-checked. Never run on GitHub |
| `infra/verify/verify.cjs` | One command that checks layout at 17 screen sizes, the mobile menu, links, images, the security policy and, on a real address, the server's headers | Passes on the current build. A deliberately broken policy made it fail, as it should |

The website itself already supports the relay: `Contact.jsx` posts to it
when `VITE_CONTACT_ENDPOINT` is set at build time, and otherwise posts to
Getform exactly as before. Both paths were tested in a browser.

`infra/` is not part of the built site. Only `personal-website/dist/` is
deployed.

## 2. Ground rules

- **The repo is public.** Never commit a webhook URL, API key or other
  secret, and never put one in a `VITE_*` variable: Vite copies those into
  the public JavaScript.
- **Ask the owner before you:**
  - deploy anything;
  - change DNS;
  - change Matomo or Getform settings;
  - delete anything on a server;
  - turn on CI or Dependabot;
  - open or merge a pull request.
- **Before every push,** from `personal-website/`, run `npm run lint` and
  `npm run build`, then run the checks in step 0.
- Node **20.19 or newer** is required (Vite 8).

## 3. Questions for the owner

Get these answers first; most steps depend on them.

1. Which host serves the site: Cloudflare Pages, Netlify, Vercel, GitHub
   Pages, or your own server with nginx or Caddy?
2. What is the site's main address (for example `https://reaw.dev`)? Is
   there a `www.` version too?
3. Does the Matomo Tag Manager container (`CZOdWKhK`) have a Matomo
   Analytics tag in it, or is it empty?
4. Should analytics run without cookies?
5. Do you want Discord notifications for the contact form? If so, which
   private channel, and is there a Cloudflare account to deploy to?
6. Should CI and Dependabot be switched on?
7. Is the old Google Apps Script still needed? Its address is in the
   public git history.

---

## 4. Runbook

### Step 0: Set up and get a clean baseline

```bash
git fetch origin && git checkout claude/laughing-shannon-vl71kr
```

From `personal-website/`:

```bash
npm ci && npm run lint && npm run build
```

Install the checker once, from `infra/verify/`:

```bash
npm run setup
```

That installs Playwright and its browser. This one command was not run in
the cloud session, which had its own copy of Playwright.

Then, with `npm run preview` running in `personal-website/`:

```bash
node infra/verify/verify.cjs
```

**Done when:** it prints `15 of 15 checks passed`.

### Step 1: Apply the domain

```bash
node infra/scripts/set-domain.mjs https://SITE
```

Use the main address from question 2, with no path. Then lint, build and
commit.

**Done when:** `personal-website/index.html` has a block between the
`site-url:start` and `site-url:end` comments, and `robots.txt` and
`sitemap.xml` exist in `personal-website/public/`.

### Step 2: Check the host's build settings

| Setting | Value |
| --- | --- |
| Base directory | `personal-website` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 22 |

### Step 3: Security headers

Generate the config in report-only mode first. Nothing is blocked in this
mode; the browser only reports what would be.

| Host | Command | Result |
| --- | --- | --- |
| Cloudflare Pages | `node infra/headers/generate.mjs cloudflare --write` | writes `personal-website/public/_headers` |
| Netlify | `node infra/headers/generate.mjs netlify --write` | writes `personal-website/public/_headers` |
| Vercel | `node infra/headers/generate.mjs vercel --write` | writes `personal-website/vercel.json` |
| nginx | `node infra/headers/generate.mjs nginx` | prints a snippet and a server block to paste |
| Caddy | `node infra/headers/generate.mjs caddy` | prints a site block to paste |
| GitHub Pages | none | It cannot send custom headers. Suggest putting Cloudflare in front, or moving host, and ask the owner |

Deploy, then check the live site:

```bash
node infra/verify/verify.cjs https://SITE
```

- If it reports policy violations, they most likely come from the Matomo
  Tag Manager container, which the cloud session could not load. Add the
  missing origin to `infra/headers/policy.mjs`, regenerate, and repeat.
- When the run is clean, generate again with `--enforce`, deploy, and run
  the check once more.

For nginx or Caddy, you can try the config on your own machine before it
goes live:

```bash
node infra/verify/verify.cjs http://localhost:PORT/ --server
```

`Strict-Transport-Security` is sent without `includeSubDomains`. Add that
in `policy.mjs` only if every subdomain (`nc.`, `analytics.` and any
others) is HTTPS-only. Confirm with the owner.

**Done when:** the check passes against the live site with the enforcing
policy, and its header lines all say `PASS`.

### Step 4: Analytics

The page loads both the Matomo tracker and Matomo Tag Manager. If the
container also has a Matomo tag, each visit is counted twice.

1. Open `https://analytics.reaw.me` → Tag Manager → the container → Tags,
   and look at the published version.
2. Copy the matching file over the live one:
   - container has a Matomo tag:
     ```bash
     cp infra/analytics/matomo.tag-manager-only.js personal-website/public/js/matomo.js
     ```
   - container is empty or unused:
     ```bash
     cp infra/analytics/matomo.tracker-only.js personal-website/public/js/matomo.js
     ```
3. For cookieless tracking, follow the comment at the top of the file you
   copied.
4. If cookies stay on, add a short privacy note to the footer. Visitors
   may be covered by GDPR or Thailand's PDPA.

**Done when:** one visit shows exactly one page view in Matomo's Visits
Log.

### Step 5: Contact form

1. **Getform spam settings.** The form already sends a hidden `_gotcha`
   field. In the Getform dashboard, open the form's spam settings, make sure
   the honeypot is on and its field name is `_gotcha`, and turn on
   reCAPTCHA or spam filtering if the plan has it.
2. **Discord notifications** (if the owner wants them). Follow
   [`SOP-discord-contact-notifications.md`](SOP-discord-contact-notifications.md).
   You handle the webhook key; it never goes in the repo.

**Done when:** a normal message arrives, a message with `_gotcha` filled in
does not, and (if set up) the message appears in the Discord channel.

### Step 6: CI and Dependabot (if the owner agrees)

```bash
mkdir -p .github/workflows && cp infra/github/workflows/ci.yml .github/workflows/ci.yml && cp infra/github/dependabot.yml .github/dependabot.yml
```

Pushing a workflow file needs a token that is allowed to change workflows.

**Done when:** the CI run on the pull request is green.

### Step 7: Small checks

1. **University links.** Three links use `http://www.ise.eng.chula.ac.th`:
   two in `src/components/About.jsx` and one in `src/components/Awards.jsx`.
   Run:
   ```bash
   curl -sI https://www.ise.eng.chula.ac.th/
   ```
   If it answers over HTTPS, change them to `https://`.
2. **Google Apps Script.** If the owner no longer needs it (question 7),
   archive the deployment: script.google.com → the project → Deploy →
   Manage deployments.
3. **Public file links.** The CV and certificate links (`nc.reaw.me/s/…`)
   are public on purpose. Ask the owner whether the CV shows a phone number
   or home address they would rather not publish.

### Step 8: Finish

1. Run the check against the live site one last time.
2. Run the leak checks in section 7 of the SOP.
3. With the owner's approval, open a pull request from
   `claude/laughing-shannon-vl71kr` to `main`. Merging also removes the old
   webhook and Apps Script addresses from the tip of `main`; they remain in
   history, which is why the webhook had to be deleted in Discord.

---

## 5. What is already done on this branch

Details are in [`audit/AUDIT.md`](audit/AUDIT.md) and its four reports.

- **Security:** the leaked webhook file is gone; every new-tab link is
  protected; no inline scripts or styles remain; dependencies have no
  known vulnerabilities.
- **Bugs:** "Scroll down" no longer opens a new tab; the mobile menu closes
  after a tap, on Escape, on a tap outside, and when keyboard focus leaves
  it.
- **Build:** a clean install builds; Vite 5 → 8.
- **Accessibility:** names on icon-only links and buttons, one `<h1>`,
  contrast at AA, reduced motion respected.
- **Performance:** icon font 544 KB → 2 KB; images in WebP; 12.5 MB of
  unused files removed; the hero image is preloaded.
- **Responsive:** checked at 17 sizes from 280 px to 3440 px.
- **Contact form:** honeypot, length limits, and relay support with a
  status message.

To recover a deleted image:
`git checkout 7f4e233 -- personal-website/public/images/<path>`.

## 6. Still open, not part of the infrastructure work

[`TODO.md`](TODO.md) is the full checklist. The larger items:

- Build the page as HTML ahead of time, so search engines can read it
  without running JavaScript.
- Rework how the navbar tracks scrolling.
- Move content into one data folder and remove the duplicates.
- Self-host the fonts.

Content decisions for the owner:

1. The "Skills" section only lists languages. Add technical skills, or
   rename it "Languages".
2. "Let's Connect" is followed at once by the footer's "Questions? Reach
   Out Here", so the contact prompt appears twice.
3. The certificates take up about a third of the page on phones. A "Show
   all" button would shorten it.
4. The Publications section is one card with no image or description.

Also in this repo: a business proposal in
[`proposal/PROPOSAL.md`](proposal/PROPOSAL.md), based on the owner's paper.
Its figures marked "approx." are unverified.

## 7. Definition of done

- [ ] Questions in section 3 answered.
- [ ] Steps 0 to 5 and 7 done, or declined by the owner.
- [ ] `node infra/verify/verify.cjs https://SITE` passes with the enforcing
      policy.
- [ ] Leak checks print nothing.
- [ ] Owner approved; pull request opened.
