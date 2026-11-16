# infra: the hand-off package

Everything needed to put the site on its real infrastructure. Nothing here
has been applied yet, and nothing here is deployed with the site.

**Start with [`../docs/HANDOFF.md`](../docs/HANDOFF.md).** It gives the
order, the commands and what "done" looks like for each step.

| Folder | Purpose | Used in hand-off step |
| --- | --- | --- |
| `scripts/` | `set-domain.mjs` writes the site's address into the page and creates `robots.txt` and `sitemap.xml` | 1 |
| `headers/` | `policy.mjs` defines the security headers; `generate.mjs` turns them into config for each host | 3 |
| `analytics/` | Two ready versions of the Matomo file: tracker only, or Tag Manager only | 4 |
| `contact-relay/` | Cloudflare Worker that forwards the contact form to Discord without exposing the webhook | 5 |
| `github/` | CI workflow and Dependabot config, inactive until copied to `.github/` | 6 |
| `verify/` | `verify.cjs` checks the site in a browser; run it after every step | all |

## Quick reference

```bash
node infra/scripts/set-domain.mjs https://SITE
```

```bash
node infra/headers/generate.mjs cloudflare --write
```

```bash
node infra/verify/verify.cjs https://SITE
```

From `infra/contact-relay/`:

```bash
npm test
```

## Rules

- This repository is public. No secret goes in any file here. The Discord
  webhook goes only into Cloudflare's secret store
  (`npx wrangler secret put DISCORD_WEBHOOK_URL`) and into a git-ignored
  `.dev.vars` for local testing.
- Change the security policy in `headers/policy.mjs` only, then
  regenerate. Do not edit generated config by hand.
