// Run with: npm test   (Node 20.19+; no dependencies, no network)
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import worker, { LIMITS } from "../src/index.js";

const SITE = "https://example.test";
const WEBHOOK = "https://discord.invalid/api/webhooks/TEST/TEST";
const baseEnv = { ALLOWED_ORIGINS: `${SITE}, https://www.example.test`, DISCORD_WEBHOOK_URL: WEBHOOK };

let calls;
let responder;
const realFetch = globalThis.fetch;
const realError = console.error;

beforeEach(() => {
  calls = [];
  responder = () => new Response(null, { status: 204 });
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return responder(String(url), init);
  };
  console.error = () => {};
});
afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
});

function post(fields, { origin = SITE, method = "POST", headers = {} } = {}) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  return new Request("https://relay.test/", {
    method,
    headers: { Origin: origin, ...headers },
    body: method === "POST" ? body : undefined,
  });
}
const valid = { name: "Ada", email: "ada@example.com", message: "Hello there" };
const discordCalls = () => calls.filter((c) => c.url === WEBHOOK);

test("valid submission is sent to Discord as an embed with mentions disabled", async () => {
  const res = await worker.fetch(post(valid), baseEnv);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), SITE);
  assert.equal(discordCalls().length, 1);
  const payload = JSON.parse(discordCalls()[0].init.body);
  assert.deepEqual(payload.allowed_mentions, { parse: [] });
  assert.equal(payload.embeds[0].description, "Hello there");
  assert.deepEqual(
    payload.embeds[0].fields.map((f) => f.value),
    ["Ada", "ada@example.com"],
  );
});

test("second allowed origin is accepted", async () => {
  const res = await worker.fetch(post(valid, { origin: "https://www.example.test" }), baseEnv);
  assert.equal(res.status, 200);
});

test("filled honeypot returns ok but sends nothing", async () => {
  const res = await worker.fetch(post({ ...valid, _gotcha: "bot" }), baseEnv);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("unknown origin is refused and nothing is sent", async () => {
  const res = await worker.fetch(post(valid, { origin: "https://evil.example" }), baseEnv);
  assert.equal(res.status, 403);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), "null");
  assert.equal(calls.length, 0);
});

test("missing Origin header is refused", async () => {
  const req = post(valid);
  req.headers.delete("Origin");
  assert.equal((await worker.fetch(req, baseEnv)).status, 403);
});

test("invalid input is rejected", async () => {
  const cases = [
    { ...valid, email: "nope" },
    { ...valid, name: "" },
    { ...valid, message: "   " },
    { ...valid, name: "x".repeat(LIMITS.name + 1) },
    { ...valid, message: "x".repeat(LIMITS.message + 1) },
  ];
  for (const fields of cases) {
    assert.equal((await worker.fetch(post(fields), baseEnv)).status, 400);
  }
  assert.equal(calls.length, 0);
});

test("oversized body is rejected before parsing", async () => {
  const res = await worker.fetch(post(valid, { headers: { "Content-Length": "999999" } }), baseEnv);
  assert.equal(res.status, 413);
});

test("long message is truncated to fit a Discord embed", async () => {
  const message = "y".repeat(4500);
  await worker.fetch(post({ ...valid, message }), baseEnv);
  const { description } = JSON.parse(discordCalls()[0].init.body).embeds[0];
  assert.equal(description.length, 4001);
  assert.ok(description.endsWith("…"));
});

test("GET is refused and OPTIONS answers the preflight", async () => {
  assert.equal((await worker.fetch(post({}, { method: "GET" }), baseEnv)).status, 405);
  const res = await worker.fetch(post({}, { method: "OPTIONS" }), baseEnv);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
});

test("missing webhook secret gives a clear configuration error", async () => {
  const res = await worker.fetch(post(valid), { ALLOWED_ORIGINS: SITE });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { ok: false, error: "not_configured" });
});

test("Discord failure with no Getform fallback returns 502", async () => {
  responder = () => new Response("nope", { status: 500 });
  assert.equal((await worker.fetch(post(valid), baseEnv)).status, 502);
});

test("Discord network error with no Getform fallback returns 502", async () => {
  responder = () => {
    throw new Error("network down");
  };
  assert.equal((await worker.fetch(post(valid), baseEnv)).status, 502);
});

test("Getform forward still succeeds when Discord fails", async () => {
  const GETFORM = "https://getform.invalid/f/test";
  responder = (url) => new Response(null, { status: url === GETFORM ? 200 : 500 });
  const res = await worker.fetch(post(valid), { ...baseEnv, GETFORM_ENDPOINT: GETFORM });
  assert.equal(res.status, 200);
  const forwarded = calls.find((c) => c.url === GETFORM).init.body;
  assert.equal(forwarded.get("email"), "ada@example.com");
  assert.equal(forwarded.get("_gotcha"), null);
});

test("rate limiter blocks when the binding says so", async () => {
  const env = { ...baseEnv, RATE_LIMITER: { limit: async () => ({ success: false }) } };
  assert.equal((await worker.fetch(post(valid), env)).status, 429);
  assert.equal(calls.length, 0);
});

test("Turnstile failure blocks the message; success lets it through", async () => {
  const env = { ...baseEnv, TURNSTILE_SECRET: "test-secret" };
  responder = (url) =>
    url.includes("turnstile") ? Response.json({ success: false }) : new Response(null, { status: 204 });
  assert.equal((await worker.fetch(post(valid), env)).status, 400);
  assert.equal(discordCalls().length, 0);

  responder = (url) =>
    url.includes("turnstile") ? Response.json({ success: true }) : new Response(null, { status: 204 });
  assert.equal((await worker.fetch(post({ ...valid, "cf-turnstile-response": "tok" }), env)).status, 200);
  assert.equal(discordCalls().length, 1);
});

test("visitor data is never written to the log", async () => {
  const logged = [];
  console.error = (...args) => logged.push(args.join(" "));
  responder = () => new Response("nope", { status: 500 });
  await worker.fetch(post(valid), baseEnv);
  const all = logged.join("\n");
  for (const secret of [valid.name, valid.email, valid.message, WEBHOOK]) {
    assert.ok(!all.includes(secret), `log leaked: ${secret}`);
  }
});
