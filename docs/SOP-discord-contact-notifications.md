# SOP: Discord notifications for the contact form

**Goal:** every contact-form message also appears in a private Discord
channel, and the Discord webhook URL never appears in this repo, in the
built site or in the browser.

**Who this is for:** a local Claude agent, or a person, with access to the
owner's Discord server and a Cloudflare account.

The code is already written and tested. This SOP only covers the steps
that need the real key and real accounts.

| Piece | Where | State |
| --- | --- | --- |
| Relay (Cloudflare Worker) | `infra/contact-relay/` | Written; 16 tests pass; never deployed |
| Website form | `personal-website/src/components/Contact.jsx` | Already uses the relay when `VITE_CONTACT_ENDPOINT` is set at build time; otherwise posts to Getform as before |
| Security policy | `infra/headers/generate.mjs --relay=…` | Adds the relay to the allowed connections |

---

## 0. Rules

1. **A Discord webhook URL is a password.** Anyone who has it can post to
   the channel, rename the webhook or delete it.
2. **Never** put it in:
   - this repo, which is **public**;
   - any `VITE_*` variable, because Vite copies those into the public
     JavaScript;
   - a commit message, pull request, issue or chat.
3. It lives in exactly two places: Cloudflare's secret store, and a
   git-ignored `infra/contact-relay/.dev.vars` on your machine while
   testing.
4. Ask the owner before deploying or adding a custom domain.

An earlier `ContactForm.jsx` called Discord straight from the browser with
the URL in the code. The owner has deleted that webhook. Create a new one;
do not look for the old one.

## 1. How it works

```
Visitor's browser
  │  POST form fields (name, email, message, _gotcha)
  ▼
contact-relay  (holds DISCORD_WEBHOOK_URL as a secret)
  │  checks: allowed origin, size, honeypot, field limits,
  │          optional rate limit and Turnstile
  ├──► Discord webhook   (an embed; mentions switched off)
  └──► Getform           (optional, keeps the email notification)
```

The relay's public address is not a secret. Without the checks above
passing, a request to it sends nothing.

## 2. Create the Discord webhook

1. In Discord, open the owner's server and pick a **private** channel, for
   example `#portfolio-inbox`.
2. Edit Channel → Integrations → Webhooks → **New Webhook**. Name it
   `Portfolio contact form`.
3. Click **Copy Webhook URL**. Keep it in the clipboard only.

## 3. Try it on your machine first

From `infra/contact-relay/`:

```bash
npm test
```

All 16 tests should pass. They use no network and no real key.

Create the local settings file, then paste the webhook URL into it:

```bash
cp .dev.vars.example .dev.vars
```

```bash
git check-ignore .dev.vars
```

The second command must print `.dev.vars`. If it prints nothing, stop: the
file is not ignored.

Start the relay locally. This runs the same code on plain Node, with no
Cloudflare account needed:

```bash
npm run local
```

In a second terminal, send one real message:

```bash
curl -i -H "Origin: http://localhost:5173" -F name=Test -F email=t@example.com -F message="Hello from the SOP" http://localhost:8787
```

Expect `HTTP/1.1 200` and the message in the Discord channel. Then check
the refusals:

| Case | Change to the command | Expect |
| --- | --- | --- |
| Honeypot | add `-F _gotcha=x` | `200`, and **nothing** in Discord |
| Wrong origin | `-H "Origin: https://evil.example"` | `403` |
| Bad email | `-F email=nope` | `400` |
| Mention spam | replace the message with `--form-string "message=@everyone hi"` | `200`; the text shows, but nobody is pinged |
| Wrong method | `curl -i http://localhost:8787` | `405` |

The mention case needs `--form-string` because curl treats a `-F` value
that starts with `@` as a file to upload.

To try the whole path with the site, keep the relay running and, from
`personal-website/`, start the dev server with the relay address set:

```bash
VITE_CONTACT_ENDPOINT=http://localhost:8787 npm run dev
```

Submit the form at `http://localhost:5173`. The page should say "Thanks!
Your message has been sent." without leaving the page.

## 4. Deploy the relay

Edit `infra/contact-relay/wrangler.toml`:

- set `ALLOWED_ORIGINS` to the live site's exact origins, for example
  `https://example.com,https://www.example.com`;
- to keep Getform's email notification, uncomment `GETFORM_ENDPOINT` and
  set it to the form's address (the `action` URL in `Contact.jsx`).

Then, from `infra/contact-relay/`:

```bash
npx wrangler login
```

```bash
npx wrangler secret put DISCORD_WEBHOOK_URL
```

Paste the webhook URL at the prompt. Cloudflare encrypts it; nobody can
read it back afterwards.

```bash
npx wrangler deploy
```

Note the address it prints, such as
`https://contact-relay.ACCOUNT.workers.dev`. Repeat the "valid", "wrong
origin" and "honeypot" tests from step 3 against that address, with
`Origin` set to the live site.

The Worker has not been run on Cloudflare yet. If `wrangler deploy`
rejects `compatibility_date`, set it to today's date.

## 5. Point the website at the relay

1. Set the relay address where the site is built. Either create
   `personal-website/.env.production`:

   ```ini
   VITE_CONTACT_ENDPOINT=https://contact-relay.ACCOUNT.workers.dev
   ```

   or set the same variable in the host's build settings. This value is
   public, so committing it is fine.
2. Regenerate the security headers with the relay allowed (see the
   hand-off, step 4):

   ```bash
   node infra/headers/generate.mjs HOST --relay=https://contact-relay.ACCOUNT.workers.dev --write
   ```

3. Build, deploy, and submit the form on the live site. Then run the
   checks:

   ```bash
   node infra/verify/verify.cjs https://SITE --relay=https://contact-relay.ACCOUNT.workers.dev
   ```

## 6. Optional hardening

- **Rate limit:** uncomment the `[[ratelimits]]` block in `wrangler.toml`.
  Check Cloudflare's current "Rate Limiting binding" docs first, because
  the config syntax has changed over time. The Worker already uses the
  binding when it exists.
- **Turnstile (bot check):** create a widget for the site in Cloudflare.
  - Put the *secret key* in the relay:
    `npx wrangler secret put TURNSTILE_SECRET`. The Worker then requires a
    valid token.
  - Add the widget to the form in `Contact.jsx` with the public *site key*.
    This part is not built yet.
  - Regenerate the headers with `--turnstile`.
- **Getform-only alternative:** if the owner's Getform plan has webhooks,
  Getform can call a relay itself and the website needs no relay address.
  That variant is not built; the Worker would need a token check and a
  parser for Getform's payload.

## 7. Leak checks before every push

```bash
git grep -nE "discord(app)?\.com/api/webhooks/[0-9]" -- .
```

```bash
git ls-files infra/contact-relay/.dev.vars
```

```bash
grep -rn "discord" personal-website/dist/
```

All three must print nothing. The second one shows whether the local
settings file was ever added to git.

## 8. If the webhook ever leaks

1. In Discord, delete the webhook. That disables the URL at once.
2. Create a new one (step 2).
3. Run `npx wrangler secret put DISCORD_WEBHOOK_URL` with the new URL. The
   website does not need a redeploy.

Deleting it from a later commit is not enough, because git history is
public. That is why step 1 comes first.
