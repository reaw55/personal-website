#!/usr/bin/env node
// Browser checks for the portfolio. Exits 1 if anything fails.
//
//   node infra/verify/verify.cjs [url] [--relay=https://…] [--turnstile] [--server]
//
// url defaults to http://localhost:4173/ (run `npm run build && npm run
// preview` in personal-website/ first).
//
// Against localhost the security policy from ../headers/policy.mjs is
// injected, so the policy that gets tested is the policy that gets shipped.
// Against a real address the script reads the headers the server sends.
// --server forces that second mode on localhost, for trying an nginx or
// Caddy config on your own machine before it goes live.
const { chromium } = require("playwright");

const args = process.argv.slice(2);
const target = new URL(args.find((a) => !a.startsWith("--")) || "http://localhost:4173/");
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const isLocal = ["localhost", "127.0.0.1"].includes(target.hostname) && !args.includes("--server");

const VIEWPORTS = [
  [280, 653], [320, 568], [360, 740], [390, 844], [430, 932], [568, 320], [667, 375], [844, 390],
  [768, 1024], [1024, 768], [1024, 1366], [1280, 600], [1366, 768], [1440, 900], [1920, 1080],
  [2560, 1080], [3440, 1440],
];
const EXPECTED_HEADERS = [
  "strict-transport-security", "x-content-type-options", "referrer-policy",
  "permissions-policy", "x-frame-options",
];

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const note = (text) => console.log(`      ${text}`);

(async () => {
  const { buildCsp } = await import("../headers/policy.mjs");
  const localCsp = buildCsp({
    relayOrigin: option("relay") ? new URL(option("relay")).origin : undefined,
    turnstile: args.includes("--turnstile"),
    upgradeInsecure: false, // would break plain-http localhost
  });
  const browser = await chromium.launch();

  async function open(viewport, extra = {}) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", ...extra });
    const page = await context.newPage();
    const log = { csp: [], errors: [] };
    page.on("console", (m) => {
      const text = m.text();
      if (/Content Security Policy/i.test(text)) log.csp.push(text.slice(0, 200));
      // Network failures are reported separately by the image and header checks.
      else if (m.type() === "error" && !/Failed to load resource|net::ERR_/.test(text)) log.errors.push(text.slice(0, 200));
    });
    page.on("pageerror", (e) => log.errors.push(String(e).slice(0, 200)));
    if (isLocal) {
      await page.route(target.href, async (route) => {
        const response = await route.fetch();
        await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": localCsp } });
      });
    }
    await page.goto(target.href, { waitUntil: "load" });
    await page.waitForTimeout(900);
    return { context, page, log };
  }

  // 1. Layout at every screen size -------------------------------------
  const layoutProblems = [];
  for (const [width, height] of VIEWPORTS) {
    const { context, page } = await open({ width, height });
    const found = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const problems = [];
      if (document.documentElement.scrollWidth > vw) problems.push("page scrolls sideways");
      const clipped = [...document.querySelectorAll("h1,h2,h3,h4,p,a,button,label")].filter(
        (e) => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX !== "visible",
      );
      if (clipped.length) problems.push(`clipped text: ${clipped[0].textContent.trim().slice(0, 30)}`);
      const h1 = document.querySelector("h1")?.getBoundingClientRect();
      const header = document.querySelector("header")?.getBoundingClientRect();
      if (h1 && header && h1.top < header.bottom) problems.push("name hidden under the header");
      return problems;
    });
    if (found.length) layoutProblems.push(`${width}x${height}: ${found.join(", ")}`);
    await context.close();
  }
  check(`layout holds at ${VIEWPORTS.length} screen sizes`, layoutProblems.length === 0, layoutProblems.join("; "));

  // 2. Page structure, links, images, security policy (desktop) ----------
  {
    const { context, page, log } = await open({ width: 1280, height: 900 });
    for (let i = 0; i < 14; i++) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(500);
    const facts = await page.evaluate(() => {
      const links = [...document.querySelectorAll("a")];
      const visible = (e) => e.getAttribute("aria-hidden") !== "true";
      const named = (e) =>
        e.textContent.trim() || e.getAttribute("aria-label") || e.querySelector('img[alt]:not([alt=""])');
      return {
        h1: document.querySelectorAll("h1").length,
        unsafeBlank: links.filter((a) => a.target === "_blank" && !/noopener/.test(a.rel)).length,
        badTarget: links.filter((a) => a.target && !a.target.startsWith("_")).length,
        unnamed: [...links, ...document.querySelectorAll("button")].filter((e) => visible(e) && !named(e)).length,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")),
        hiddenContent: [...document.querySelectorAll(".reveal-up")].filter((e) => getComputedStyle(e).opacity === "0").length,
        form: Boolean(document.querySelector('#contact form input[name="_gotcha"]')),
        lang: document.documentElement.lang,
      };
    });
    check("exactly one main heading (h1)", facts.h1 === 1, `found ${facts.h1}`);
    check("new-tab links are protected (rel=noopener)", facts.unsafeBlank === 0 && facts.badTarget === 0);
    check("every link and button has a name", facts.unnamed === 0, `${facts.unnamed} unnamed`);
    check("no broken images", facts.broken.length === 0, facts.broken.join(", "));
    check("content is visible with reduced motion", facts.hiddenContent === 0, `${facts.hiddenContent} hidden`);
    check("contact form and honeypot are present", facts.form);
    check("page language is set", facts.lang === "en");

    const pagesBefore = context.pages().length;
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click("text=Scroll down");
    await page.waitForTimeout(700);
    check('"Scroll down" stays in the same tab', context.pages().length === pagesBefore);

    check("no JavaScript errors", log.errors.length === 0, log.errors.join(" | "));
    check(
      isLocal ? "packaged security policy causes no violations" : "live security policy reports no violations",
      log.csp.length === 0,
      log.csp.join(" | "),
    );
    await context.close();
  }

  // 3. Mobile menu -------------------------------------------------------
  {
    const { context, page } = await open({ width: 390, height: 844 });
    const isOpen = () => page.evaluate(() => document.querySelector("nav").classList.contains("active"));
    const expanded = () => page.getAttribute("button.menu-btn", "aria-expanded");
    await page.click("button.menu-btn");
    await page.waitForTimeout(250);
    const opened = (await isOpen()) && (await expanded()) === "true";
    await page.click('nav a[href="#awards"]');
    await page.waitForTimeout(700);
    const closedAfterLink = !(await isOpen());
    await page.click("button.menu-btn");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const closedOnEscape = !(await isOpen());
    const focusBack = await page.evaluate(() => document.activeElement.classList.contains("menu-btn"));
    await page.click("button.menu-btn");
    await page.waitForTimeout(250);
    await page.mouse.click(100, 600);
    await page.waitForTimeout(250);
    const closedOutside = !(await isOpen());
    check("mobile menu opens and announces it", opened);
    check("mobile menu closes after choosing a link", closedAfterLink);
    check("Escape closes the menu and returns focus to its button", closedOnEscape && focusBack);
    check("tapping outside closes the menu", closedOutside);
    await context.close();
  }
  await browser.close();

  // 4. Server checks (real address only) ---------------------------------
  if (!isLocal) {
    const response = await fetch(target.href, { redirect: "follow" });
    const headers = response.headers;
    for (const name of EXPECTED_HEADERS) check(`header ${name}`, headers.has(name), headers.get(name) || "missing");
    const enforced = headers.get("content-security-policy");
    const reportOnly = headers.get("content-security-policy-report-only");
    check("a Content-Security-Policy is sent", Boolean(enforced || reportOnly));
    if (!enforced && reportOnly) note("policy is Report-Only: nothing is blocked yet. Enforce it once this run is clean.");
    for (const path of ["robots.txt", "sitemap.xml", "og-image.jpg"]) {
      const res = await fetch(new URL(path, target), { method: "GET" });
      check(`/${path} is served`, res.ok, `HTTP ${res.status}`);
    }
    const html = await response.text();
    check("canonical link is set", /<link rel="canonical" href="https:\/\//.test(html));
    check("link-preview image is set", /property="og:image" content="https:\/\//.test(html));
  } else {
    note("local run: server headers, robots.txt and sitemap.xml are only checked against a real address");
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length} of ${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(2);
});
