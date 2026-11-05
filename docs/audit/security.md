# Security audit: personal-website

**Scope:** current code on branch `claude/laughing-shannon-vl71kr`, all git
history (`main` and this branch), the `personal-website/public` folder,
third-party scripts and dependencies. Audit date: 2026-11-05.
**Not reachable from the audit environment:** the live site and its host,
`analytics.reaw.me`, the Getform dashboard, Discord, and `nc.reaw.me`. Items
that depend on these are marked **Needs owner**.

## Summary

The code on this branch is in good shape:

- no secrets in the working tree
- no inline scripts or styles
- every `target="_blank"` link has `rel="noopener noreferrer"`
- `npm audit` reports 0 vulnerabilities

The main open risk is **git history and the `main` branch**. Two hard-coded
endpoints are still on the tip of the public `origin/main` branch until this
branch is merged, and they stay in history after that:

- a Discord webhook URL, which the owner reports is already revoked
- a Google Apps Script web-app URL

Security headers (CSP, HSTS and others) are drafted in `docs/HANDOFF.md`, but
they cannot be applied until the host is known. Secret values are masked in
this report.

## Findings

| ID | Severity | Status | Finding | Evidence | Recommendation |
|----|----------|--------|---------|----------|----------------|
| SEC-1 | High | Needs owner | A Discord webhook URL was hard-coded in client code. Anyone could read it, then post to the channel or delete the webhook. It was added in `c5f4e4c` (2024-12-12) and deleted on this branch in `d5e5875`. It is **still on the tip of `origin/main`** and stays in history permanently. The owner reports the webhook was deleted in Discord; this audit did not check that. | `git log --all -S'discord.com/api/webhooks'` finds `c5f4e4c`, `d5e5875` and `b2c5058` (the last only in SOP text). `git grep -c "discord.com/api/webhooks" origin/main` finds `personal-website/src/components/ContactForm.jsx`. Value: `https://discord.com/api/webhooks/<id>/***MASKED***` | Confirm the webhook is revoked: Discord, Channel → Integrations → Webhooks. Merge this branch so `main` no longer serves the file. Treat any webhook found in history as burned. A history rewrite is optional, because forks and clones keep the old commits. Use the server-side relay in `docs/SOP-discord-contact-notifications.md` for future webhooks. |
| SEC-2 | Medium | Needs owner | A Google Apps Script web-app endpoint is hard-coded in the same file. It is an unauthenticated write endpoint: anyone can POST junk to the linked Sheet or use up its quota. It is still on `origin/main` and in history. | `git log --all -S'script.google.com/macros'` finds `c5f4e4c` and `d5e5875`. `git grep -c "script.google.com/macros" origin/main` finds `ContactForm.jsx`. Value: `https://script.google.com/macros/s/***MASKED***/exec` | In script.google.com, go to the project, then Deploy → Manage deployments, and archive the deployment (HANDOFF task). If it must stay live, check for a shared secret in the script and rate-limit it. |
| SEC-3 | Medium | Needs owner | The repo sets no HTTP security headers: there is no `_headers`, `vercel.json`, `netlify.toml` or `wrangler.toml`. CSP, HSTS, `X-Content-Type-Options`, `frame-ancestors` (clickjacking) and `Permissions-Policy` all depend on the unknown host. | `ls personal-website/public` shows only `images/`, `js/` and `og-image.jpg`. No host config files exist in the repo. A draft policy is in `docs/HANDOFF.md:130-134`. | Find out who hosts the site, then apply the HANDOFF headers. Ship the CSP as `Content-Security-Policy-Report-Only` first, then enforce it. Raise HSTS to `max-age=63072000; includeSubDomains` once all subdomains serve HTTPS. |
| SEC-4 | Low | Needs owner | Matomo Tag Manager loads remote code (`container_*.js`) from `analytics.reaw.me` with full page privileges and no integrity pin. If the Matomo server or account is compromised, an attacker can run script on this site. If the container uses "Custom HTML" tags, they also need `'unsafe-inline'`, which breaks the drafted CSP. | `public/js/matomo.js:26-36` (MTM) and `:9-24` (tracker) | Keep Matomo patched and protect its admin with 2FA. Avoid Custom HTML tags. If MTM is not needed, remove it and keep only the classic tracker (this also fixes double counting, see the note in `matomo.js`). Test the container under the Report-Only CSP. |
| SEC-5 | Low | Needs owner | Matomo runs with cookies (`disableCookies` is never called) and the site shows no consent notice. This may matter under GDPR or Thailand's PDPA for EU or Thai visitors. | `public/js/matomo.js:9-24` | Either add `_paq.push(["disableCookies"])` before `trackPageView` to track without cookies, or add a consent mechanism. You can also turn on IP anonymisation in Matomo settings. |
| SEC-6 | Low | Open | Google Fonts (Inter and Material Symbols) load from Google. Every visitor's IP address and user agent go to Google, a third party. | `index.html:36-48` | Self-host both fonts in `public/fonts`. This also removes `fonts.googleapis.com` and `fonts.gstatic.com` from the CSP. |
| SEC-7 | Low | Needs owner | 14 public Nextcloud share links are in the bundle (CV, certificates, awards). Anyone with a link can open the file. If a link points to a folder, or allows upload or edit, it exposes more than intended. The CV may contain personal data such as a phone number or home address. | `src/components/Hero.jsx:25` (CV), `src/components/certsList.jsx` (11 links), `src/components/Awards.jsx:15,31` | In Nextcloud, check that each share is a single file, read-only and has no upload. Consider a password or expiry where it fits. Remove phone numbers and home addresses from the public CV, or host a redacted CV under `public/`. |
| SEC-8 | Low | Needs owner | The Getform endpoint is public by design and can be spammed or abused. Spam protection is only a honeypot. | `src/components/Contact.jsx:145` (form ID masked here), honeypot at `:197-206` | In Getform, turn on spam filtering and the reCAPTCHA/Turnstile option, and limit submissions to the site's domain if the plan supports it (HANDOFF Task 5). |
| SEC-9 | Low | Needs owner | Three outbound links use plain `http://`. They can be downgraded or tampered with in transit. `upgrade-insecure-requests` does not upgrade navigation to other origins. | `src/components/About.jsx:55`, `About.jsx:69`, `src/components/Awards.jsx:12` (`www.ise.eng.chula.ac.th`) | Switch the links to `https://` after checking that each page loads over HTTPS (HANDOFF task). |
| SEC-10 | Info | Open | Dependencies use caret ranges (`^`), so a fresh `npm install` can pull in newer minor or patch versions. The lockfile pins exact versions. | `personal-website/package.json` | Always build with `npm ci`, as the HANDOFF requires. Turn on Dependabot or Renovate security updates on GitHub. |
| SEC-11 | Info | Open | The contact email is in plain text, so address scrapers will collect it. | `src/components/Footer.jsx:68` (`mailto:`) | Accept this, or rely on the contact form only. Make sure the mail provider's spam filtering is on. |
| SEC-12 | Info | Fixed on branch | `ContactForm.jsx` (webhook and Apps Script) was deleted. All `target="_blank"` links got `rel="noopener noreferrer"`. The inline Matomo script moved to `/js/matomo.js` to make the CSP workable. Matomo now loads over HTTPS. The form got a honeypot and `maxLength` limits. | Commit `d5e5875`. `Button.jsx:26-28` adds `rel` automatically for `_blank`. `grep -rn 'target=' src` finds no `_blank` without `rel`. | None. Merge the branch. |

## Verified OK

- `cd personal-website && npm audit` reports **found 0 vulnerabilities**.
- **Lockfile:** `package-lock.json` is present (lockfileVersion 2). All 616
  `resolved` URLs point to `registry.npmjs.org`, and all 616 entries have an
  `integrity` hash.
- **Working tree:** no Discord webhook or Apps Script URL in the tree on this
  branch (`git grep` on HEAD outside `docs/`).
- **History:** no `.env`, key, `.pem` or credential files in any commit.
- **Ignored files:** `dist/` and `*.local` are git-ignored and not tracked.
- **Client code:** no `dangerouslySetInnerHTML`, `innerHTML`, `eval`,
  `new Function` or `document.write` in `src/`.
- **Network calls and env vars:** no `fetch`, `localStorage` or
  `import.meta.env` / `VITE_*` use in `src/`, so no secrets end up in the
  bundle.
- **Built HTML:** `dist/index.html` has no inline `<script>` or `<style>`. It
  loads only `/js/matomo.js` and the hashed Vite entry, so it is ready for the
  drafted CSP.
- **Source maps:** Vite's default (`sourcemap: false`) is in effect
  (`vite.config.js`).
- **Public files:**
  - The 35 files in `public/` are images, icons, `og-image.jpg` and
    `matomo.js`, with nothing unexpected.
  - No SVG contains `<script>`, event handlers, `javascript:` or
    `foreignObject`.
  - A byte search found no GPS or EXIF location tags.
  - Only `icon-ICE.png` carries an XMP block; the search did not flag its
    contents.
- **Referrer policy:** `index.html:16` sets
  `strict-origin-when-cross-origin`.
