#!/usr/bin/env node
// Applies the site's public address everywhere it is needed:
//   - canonical link, Open Graph / Twitter image tags and a JSON-LD
//     "Person" block in personal-website/index.html
//   - personal-website/public/robots.txt and sitemap.xml
//
//   node infra/scripts/set-domain.mjs https://example.com
//
// Safe to run again with a different address: it replaces its own block.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
let site;
try {
  site = new URL(input);
} catch {
  console.error("Usage: node infra/scripts/set-domain.mjs https://your-domain.example");
  process.exit(1);
}
if (site.protocol !== "https:" || site.pathname !== "/" || site.search || site.hash) {
  console.error("Give the bare https address of the site, for example https://example.com");
  process.exit(1);
}
const base = site.origin; // no trailing slash
const file = (relative) => fileURLToPath(new URL(`../../personal-website/${relative}`, import.meta.url));

const START = "    <!-- site-url:start (written by infra/scripts/set-domain.mjs) -->";
const END = "    <!-- site-url:end -->";

// Search engines read this to connect the page to the person and profiles.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kritchavit Thippayajindakul",
  alternateName: "Reaw",
  url: `${base}/`,
  image: `${base}/og-image.jpg`,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Chulalongkorn University" },
  sameAs: [
    "https://github.com/reaw55",
    "https://www.linkedin.com/in/kritchavit-thippayajindakul",
    "https://www.researchgate.net/profile/Kritchavit-Thippayajindakul",
    "https://www.instagram.com/reaw5555",
    "https://www.facebook.com/reaw.kritchavit",
  ],
};
// "<" is escaped so the JSON can never close its own <script> tag.
const personJson = JSON.stringify(person, null, 2)
  .replace(/</g, "\\u003c")
  .split("\n")
  .map((line) => `      ${line}`)
  .join("\n");

const block = [
  START,
  `    <link rel="canonical" href="${base}/" />`,
  `    <meta property="og:url" content="${base}/" />`,
  `    <meta property="og:image" content="${base}/og-image.jpg" />`,
  `    <meta property="og:image:width" content="1200" />`,
  `    <meta property="og:image:height" content="630" />`,
  `    <meta property="og:image:alt" content="Kritchavit (Reaw) Thippayajindakul – portfolio" />`,
  `    <meta name="twitter:image" content="${base}/og-image.jpg" />`,
  `    <script type="application/ld+json">`,
  personJson,
  `    </script>`,
  END,
].join("\n");

const indexPath = file("index.html");
let html = readFileSync(indexPath, "utf8");

if (html.includes(START)) {
  const from = html.indexOf(START);
  const to = html.indexOf(END, from);
  if (to === -1) {
    console.error("index.html has the start marker but not the end marker; fix it by hand first.");
    process.exit(1);
  }
  html = html.slice(0, from) + block + html.slice(to + END.length);
} else {
  const anchor = "    <!-- Favicon -->";
  if (!html.includes(anchor)) {
    console.error(`Could not find "${anchor.trim()}" in index.html to place the tags before.`);
    process.exit(1);
  }
  html = html.replace(anchor, `${block}\n\n${anchor}`);
}
// A large preview image needs the large card type.
html = html.replace(
  /<meta name="twitter:card" content="summary(?:_large_image)?" \/>/,
  '<meta name="twitter:card" content="summary_large_image" />',
);
writeFileSync(indexPath, html);

writeFileSync(file("public/robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
writeFileSync(
  file("public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
  </url>
</urlset>
`,
);

console.log(`Set site address to ${base}/`);
console.log("Updated: personal-website/index.html, public/robots.txt, public/sitemap.xml");
console.log("Next: npm run lint && npm run build in personal-website/, then commit.");
