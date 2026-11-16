// Contact relay (Cloudflare Worker).
//
// Receives the portfolio's contact form and forwards it to Discord, and
// optionally to Getform, so the Discord webhook URL never reaches the
// browser or the repository.
//
// Secrets (set with `wrangler secret put`, never committed):
//   DISCORD_WEBHOOK_URL   required
//   TURNSTILE_SECRET      optional; turns on Cloudflare Turnstile checks
// Plain variables (wrangler.toml):
//   ALLOWED_ORIGINS       comma-separated site origins allowed to post
//   GETFORM_ENDPOINT      optional; also forward to this Getform form
// Optional binding:
//   RATE_LIMITER          Workers Rate Limiting binding (per-IP)

export const LIMITS = { name: 100, email: 254, message: 5000, bodyBytes: 20_000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const origin = request.headers.get("Origin") || "";
    const originAllowed = allowed.includes(origin);

    const cors = {
      "Access-Control-Allow-Origin": originAllowed ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    const reply = (status, body) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" },
      });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });

    // Stops other websites from using the relay. A script can fake the
    // Origin header, which is what the checks below are for.
    if (!originAllowed) return reply(403, { ok: false, error: "forbidden" });

    if (!env.DISCORD_WEBHOOK_URL) {
      console.error("config_error: DISCORD_WEBHOOK_URL is not set");
      return reply(500, { ok: false, error: "not_configured" });
    }

    if (Number(request.headers.get("Content-Length") || 0) > LIMITS.bodyBytes) {
      return reply(413, { ok: false, error: "too_large" });
    }

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

    // A filled-in honeypot means a bot. Answer "ok" so it does not retry.
    if (form.get("_gotcha")) return reply(200, { ok: true });

    const field = (key) => {
      const value = form.get(key);
      return typeof value === "string" ? value.trim() : "";
    };
    const name = field("name");
    const email = field("email");
    const message = field("message");
    if (
      !name ||
      !email ||
      !message ||
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      message.length > LIMITS.message ||
      !EMAIL_RE.test(email)
    ) {
      return reply(400, { ok: false, error: "invalid_input" });
    }

    if (env.TURNSTILE_SECRET) {
      let passed = false;
      try {
        const res = await fetch(TURNSTILE_VERIFY_URL, {
          method: "POST",
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET,
            response: field("cf-turnstile-response"),
            remoteip: request.headers.get("CF-Connecting-IP") || "",
          }),
        });
        passed = (await res.json()).success === true;
      } catch {
        passed = false;
      }
      if (!passed) return reply(400, { ok: false, error: "captcha_failed" });
    }

    const toDiscord = fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Portfolio contact form",
        // Never ping @everyone, @here, roles or users from visitor text.
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "New message from the portfolio",
            color: 0xfbbf24,
            fields: [
              { name: "Name", value: name, inline: true },
              { name: "Email", value: email, inline: true },
            ],
            // Discord caps an embed description at 4096 characters.
            description: message.length > 4000 ? message.slice(0, 4000) + "…" : message,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    let toGetform = Promise.resolve(null);
    if (env.GETFORM_ENDPOINT) {
      const forward = new FormData();
      forward.set("name", name);
      forward.set("email", email);
      forward.set("message", message);
      toGetform = fetch(env.GETFORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: forward,
      });
    }

    const [discord, getform] = await Promise.allSettled([toDiscord, toGetform]);
    const delivered = (result) => result.status === "fulfilled" && Boolean(result.value?.ok);

    // Log status codes only. Never log the visitor's name, email or message.
    if (!delivered(discord)) {
      console.error("discord_failed", discord.status === "fulfilled" ? discord.value?.status : "network");
    }
    if (env.GETFORM_ENDPOINT && !delivered(getform)) {
      console.error("getform_failed", getform.status === "fulfilled" ? getform.value?.status : "network");
    }

    return delivered(discord) || delivered(getform)
      ? reply(200, { ok: true })
      : reply(502, { ok: false, error: "delivery_failed" });
  },
};
