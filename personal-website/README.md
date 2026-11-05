# Reaw's portfolio

Single-page portfolio for Kritchavit (Reaw) Thippayajindakul.

**Stack:** React 18 · Vite 8 · Tailwind CSS 3 · GSAP (scroll reveal) · Lenis (smooth scroll)
**Node:** 20.19+ or 22.12+ (required by Vite 8)

## Commands

Run from this folder (`personal-website/`):

```bash
npm ci            # install exact locked dependencies
npm run dev       # local dev server (http://localhost:5173)
npm run lint      # ESLint
npm run build     # production build -> dist/
npm run preview   # serve dist/ locally (http://localhost:4173)
```

Deploy the contents of `dist/`.

## Where things live

| What | Where |
| --- | --- |
| Page sections | `src/components/*.jsx`, assembled in `src/App.jsx` |
| Certificates data | `src/components/certsList.jsx` |
| Awards / publications data | top of `Awards.jsx` / `Papers.jsx` |
| Global styles, buttons, hero portrait sizing | `src/index.css` |
| Analytics (Matomo) | `public/js/matomo.js` |
| Static images | `public/images/` (use WebP; keep photos ≤ ~1200 px) |
| Link-preview image (1200×630) | `public/og-image.jpg` |

## Conventions

- **Icons:** Material Symbols is loaded *subset* to only the icons in use
  (`icon_names=` in `index.html`). When you use a new icon name, add it to
  that list (alphabetical) or it renders as plain text.
- **New tab links:** `target="_blank"` always needs `rel="noopener noreferrer"`
  (enforced by ESLint).
- **Secrets:** this repo is public. Never commit API keys or webhook URLs, and
  never put them in `VITE_*` variables — those are embedded in the public JS
  bundle. See `../docs/SOP-discord-contact-notifications.md`.
- **Motion:** scroll-reveal and smooth scrolling are disabled automatically
  for visitors with "reduce motion" enabled; keep new animations behind
  `prefers-reduced-motion: no-preference` too.
- **Responsive:** check new sections at 280 px wide, landscape phones
  (e.g. 844×390), tablets, short laptops (1280×600) and ultrawide.
