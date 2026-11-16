// Runs the Worker's fetch handler on a plain Node HTTP server, so the relay
// can be tried end to end without a Cloudflare account or wrangler.
//
//   npm run local          reads .dev.vars, listens on http://localhost:8787
//
// Settings come from environment variables first, then from .dev.vars.
import http from "node:http";
import { readFileSync, existsSync } from "node:fs";
import worker from "../src/index.js";

const env = {};
const varsFile = new URL("../.dev.vars", import.meta.url);
if (existsSync(varsFile)) {
  for (const line of readFileSync(varsFile, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2];
  }
}
for (const key of ["DISCORD_WEBHOOK_URL", "ALLOWED_ORIGINS", "GETFORM_ENDPOINT", "TURNSTILE_SECRET"]) {
  if (process.env[key]) env[key] = process.env[key];
}
const port = Number(process.env.PORT || 8787);

http
  .createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const request = new Request(`http://localhost:${port}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: hasBody ? Buffer.concat(chunks) : undefined,
    });
    const response = await worker.fetch(request, env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  })
  .listen(port, () => console.log(`contact-relay listening on http://localhost:${port}`));
