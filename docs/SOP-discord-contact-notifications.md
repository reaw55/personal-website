# SOP: Discord notifications for the contact form (without exposing the webhook)

**Audience:** a local Claude agent (or a person) with access to the owner's
Discord server and a Cloudflare account.
**Goal:** every contact form submission posts a message to a private Discord
channel, while the Discord webhook URL never appears in this repo, the built
site, or the browser.

---

## 0. Rules (read first)

1. **A Discord webhook URL is a password.** Anyone who has it can post to
   the channel, rename the webhook, or delete it.
2. **Never** put it in: this repo (it is **public**), `index.html`, any
   `src/` file, any `VITE_*` environment variable (Vite inlines those into the
   public JS bundle), a commit message, a PR, an issue, or a chat transcript.
3. It lives **only** in the relay's secret store
   (`wrangler secret put …`) and, for local testing, in a git-ignored
   `.dev.vars` file.
4. The browser never talks to Discord. It talks to the relay; the relay talks
   to Discord.
5. Ask the site owner before deploying, adding DNS records, or creating paid
   resources.

> History: an earlier `ContactForm.jsx` called Discord straight from the
> browser with the URL hardcoded. That webhook has been deleted by the owner
> and the file removed. Don't reintroduce that pattern.

---

## 1. Architecture

```
Visitor's browser
  │  POST multipart/form-data (name, email, message, _gotcha)
  ▼
contact-relay  (Cloudflare Worker, holds DISCORD_WEBHOOK_URL as a secret)
  │  1. Origin allow-list, size limits, honeypot, optional rate limit/Turnstile
  ├──► Discord webhook  (embed, mentions disabled)
  └──► Getform          (optional: keeps email notifications + archive)
```

Why a Worker: the site's host is static, a Worker is free for this
volume, works regardless of where the site is hosted, and has an encrypted
secret store. Any serverless platform with secrets works the same way
(Vercel/Netlify functions, a small server on the owner's box); adapt the
code if the owner prefers one of those.

### Alternative (simpler, if available): Getform → relay → Discord

If the owner's Getform plan has **Webhooks** (Getform dashboard → form →
Settings / Integrations), Getform itself can call the relay after its own
spam filtering. Then the website needs **no changes**:

- Protect the relay endpoint with a long random token stored as a secret
  (`GETFORM_WEBHOOK_TOKEN`) and configured in Getform's webhook URL
  (`https://<relay>/getform?token=…`), and reject requests without it.
- Check Getform's docs for the exact webhook payload shape before writing the
  parser (this SOP's author could not reach docs.getform.io to confirm it).
- Steps 2–5 below still apply (secret handling, test, deploy). Skip step 6.

Use whichever the owner prefers; the rest of this SOP describes the default
(browser → relay).

---

## 2. Create a new Discord webhook

1. Discord → the owner's server → a **private** channel (e.g. `#portfolio-inbox`)
   → Edit Channel → Integrations → Webhooks → **New Webhook**.
2. Name it `Portfolio contact form`. Click **Copy Webhook URL**.
3. Keep it only in your clipboard. You will paste it into the
   `wrangler secret put` prompt in step 4. Do not paste it anywhere else.

---

## 3. Create the relay (in this repo, no secrets in files)

Create a folder at the repo root:

```
contact-relay/
  .gitignore
  wrangler.toml
  src/index.js
```

### `contact-relay/.gitignore`

```gitignore
node_modules
.wrangler
.dev.vars
```

### `contact-relay/wrangler.toml`

```toml
name = "contact-relay"
main = "src/index.js"
compatibility_date = "YYYY-MM-DD"   # use the date you deploy

[vars]
# Exact origins of the live site (scheme + host, no trailing slash).
ALLOWED_ORIGINS = "https://SITE_DOMAIN,https://www.SITE_DOMAIN"
# Optional: also forward to Getform so email notifications/archive keep working.
# GETFORM_ENDPOINT = "https://getform.io/f/<form-id>"

# Optional per-IP rate limit. The Workers Rate Limiting binding's config
# syntax has changed over time: check Cloudflare's current docs
# ("Rate Limiting binding") before enabling.
# [[ratelimits]]
# name = "RATE_LIMITER"
# namespace_id = "1001"
#   [ratelimits.simple]
#   limit = 5
#   period = 60
```

### `contact-relay/src/index.js`

```js
// Receives the portfolio contact form and forwards it to Discord (and
// optionally Getform). Secrets are set with `wrangler secret put`, never
// committed:
//   DISCORD_WEBHOOK_URL  (required)
//   TURNSTILE_SECRET     (optional: enables Cloudflare Turnstile verification)
// Plain vars (wrangler.toml): ALLOWED_ORIGINS, GETFORM_ENDPOINT (optional)

const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    const reply = (status, body) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
      });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });

    // Stops other websites from using the relay. (Scripts can fake Origin;
    // that's what the honeypot, limits, rate limit and Turnstile are for.)
    if (!allowed.includes(origin)) return reply(403, { ok: false, error: "forbidden" });

    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return reply(429, { ok: false, error: "rate_limited" });
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return reply(400, { ok: false, error: "bad_request" });
    }

    // Honeypot filled in => bot. Pretend success so it doesn't retry.
    if (form.get("_gotcha")) return reply(200, { ok: true });

    const field = (k) => String(form.get(k) ?? "").trim();
    const name = field("name");
    const email = field("email");
    const message = field("message");
    if (
      !name || !email || !message ||
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      message.length > LIMITS.message ||
      !EMAIL_RE.test(email)
    ) {
      return reply(400, { ok: false, error: "invalid_input" });
    }

    if (env.TURNSTILE_SECRET) {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: field("cf-turnstile-response"),
          remoteip: request.headers.get("CF-Connecting-IP") || "",
        }),
      });
      const outcome = await res.json();
      if (!outcome.success) return reply(400, { ok: false, error: "captcha_failed" });
    }

    const toDiscord = fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Portfolio contact form",
        allowed_mentions: { parse: [] }, // never ping @everyone/@here/roles/users
        embeds: [
          {
            title: "New message from the portfolio",
            color: 0xfbbf24,
            fields: [
              { name: "Name", value: name, inline: true },
              { name: "Email", value: email, inline: true },
            ],
            // Discord embed description limit is 4096 chars
            description: message.length > 4000 ? message.slice(0, 4000) + "…" : message,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    let toGetform = Promise.resolve(null);
    if (env.GETFORM_ENDPOINT) {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("email", email);
      fd.set("message", message);
      toGetform = fetch(env.GETFORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
    }

    const [discord, getform] = await Promise.allSettled([toDiscord, toGetform]);
    const delivered = (r) => r.status === "fulfilled" && r.value && r.value.ok;

    // Log status codes only: never log the visitor's message or email.
    if (!delivered(discord)) {
      console.error("discord_failed", discord.status === "fulfilled" ? discord.value.status : "network");
    }
    if (env.GETFORM_ENDPOINT && !delivered(getform)) {
      console.error("getform_failed", getform.status === "fulfilled" ? getform.value.status : "network");
    }

    return delivered(discord) || delivered(getform)
      ? reply(200, { ok: true })
      : reply(502, { ok: false, error: "delivery_failed" });
  },
};
```

---

## 4. Secrets and local test

From `contact-relay/` (wrangler is run via `npx`, no global install needed):

```bash
npx wrangler login
```

```bash
npx wrangler secret put DISCORD_WEBHOOK_URL
```

Paste the webhook URL at the prompt. It is encrypted at Cloudflare and not
readable afterwards, not even by you.

For local testing, create `contact-relay/.dev.vars` (git-ignored; confirm
with `git check-ignore contact-relay/.dev.vars` before writing it):

```ini
DISCORD_WEBHOOK_URL=<paste here, local only>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

```bash
npx wrangler dev
```

Test matrix (relay on `http://localhost:8787`):

| Case | Command | Expect |
| --- | --- | --- |
| Valid | `curl -i -H "Origin: http://localhost:5173" -F name=Test -F email=t@example.com -F message=Hello http://localhost:8787` | `200`, message appears in Discord |
| Honeypot | add `-F _gotcha=x` | `200`, **nothing** in Discord |
| Wrong origin | `-H "Origin: https://evil.example"` | `403` |
| Bad email | `-F email=nope` | `400` |
| Too long | `-F message="$(head -c 6000 /dev/zero \| tr '\0' a)"` | `400` |
| Mention spam | `-F message="@everyone hi"` | `200`, message shows text but **no ping** |
| GET | `curl -i http://localhost:8787` | `405` |

Delete `.dev.vars` when done if the machine is shared.

---

## 5. Deploy

```bash
npx wrangler deploy
```

Note the URL it prints (e.g. `https://contact-relay.<account>.workers.dev`).
Optionally (with the owner's OK) attach a custom domain such as
`contact.SITE_DOMAIN` in the Cloudflare dashboard → Worker → Settings → Domains.

Re-run the "Valid", "Wrong origin" and "Honeypot" tests against the deployed
URL, with `Origin` set to the live site.

---

## 6. Wire up the website

The relay URL is **not** a secret (it is useless without passing the checks),
so it can be a public `VITE_` variable.

1. In `personal-website/.env.production` (or the host's build environment):

   ```ini
   VITE_CONTACT_ENDPOINT=https://contact-relay.<account>.workers.dev
   ```

2. In `personal-website/src/components/Contact.jsx`, submit with `fetch`
   when the endpoint is configured, and keep the plain Getform POST as a
   fallback when it isn't:

   ```jsx
   import { useState } from "react";

   // Public URL of the contact relay (not a secret). Unset => plain Getform POST.
   const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

   function Contact() {
     const [status, setStatus] = useState("idle"); // idle | sending | sent | error

     const handleSubmit = async (e) => {
       if (!CONTACT_ENDPOINT) return; // fall back to the form's action
       e.preventDefault();
       const form = e.currentTarget;
       setStatus("sending");
       try {
         // multipart/form-data is a CORS "simple" request: no preflight needed
         const res = await fetch(CONTACT_ENDPOINT, { method: "POST", body: new FormData(form) });
         if (!res.ok) throw new Error(String(res.status));
         form.reset();
         setStatus("sent");
       } catch {
         setStatus("error");
       }
     };

     // ...existing JSX, with:
     // <form action="https://getform.io/f/…" method="POST" onSubmit={handleSubmit} …>
     // <button type="submit" disabled={status === "sending"} …>
     //   {status === "sending" ? "Sending…" : "Send Message"}
     // </button>
     // <p role="status" aria-live="polite" className="mt-3 text-sm text-zinc-400">
     //   {status === "sent" && "Thanks! Your message has been sent."}
     //   {status === "error" && "Sorry, that didn't go through. Please email contact@reaw.dev."}
     // </p>
   }
   ```

3. Content-Security-Policy (see `HANDOFF.md`): add the relay origin to
   `connect-src`. If Turnstile is used, also add
   `https://challenges.cloudflare.com` to `script-src` and `frame-src`.

4. `npm run lint && npm run build`, then test a real submission from
   `npm run preview` (add `http://localhost:4173` to `ALLOWED_ORIGINS` in
   `.dev.vars` only) and again on the live site.

### Optional: Cloudflare Turnstile (stronger bot protection)

Create a Turnstile widget for the site domain in Cloudflare. The **site key**
is public and goes in the form's widget (`<div class="cf-turnstile"
data-sitekey="…">` plus Turnstile's script). The **secret key** goes in the
relay: `npx wrangler secret put TURNSTILE_SECRET`. The relay code above
already verifies it when the secret is set.

---

## 7. Final leak checks (must all pass before pushing)

```bash
git grep -n "discord.com/api/webhooks" -- . ':!docs'
```

```bash
git grep -n "discordapp.com/api/webhooks" -- . ':!docs'
```

```bash
grep -rn "discord" personal-website/dist/
```

All three must print nothing. Also confirm `contact-relay/.dev.vars` is
untracked:

```bash
git status --short contact-relay/
```

---

## 8. If the webhook ever leaks

1. Discord → channel → Integrations → Webhooks → delete the leaked webhook
   (this immediately disables the URL).
2. Create a new one (step 2).
3. `npx wrangler secret put DISCORD_WEBHOOK_URL` with the new URL. No
   redeploy of the website is needed.
4. If it was committed: removing it from the latest commit is not enough
   (git history is public), which is why step 1 comes first.
