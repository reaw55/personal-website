# Accessibility audit (WCAG 2.2 AA)

Audited 2026-11-05 against the current branch build (`npm run build` + `vite preview`), using Playwright/Chromium at 1280x800, 390x844, 640px (200% zoom of 1280) and 320px widths, plus a read of `src/components/*.jsx`.

## Summary

The page is in good shape: `lang="en"`, one `<h1>`, header/nav/main/footer landmarks, named icon-only controls, `alt` on every image, a labelled contact form, visible focus rings, 320px reflow without horizontal scroll, and a working reduced-motion mode. The remaining issues are mainly in the mobile menu: Escape does not close it, and it stays open over content that keyboard focus moves into. The inactive nav links also fall just below 4.5:1 contrast. Everything else listed is low-severity polish.

| ID | Severity | WCAG criterion | Status | Finding | Evidence | Recommendation |
|---|---|---|---|---|---|---|
| A11Y-1 | Medium | 2.4.11 Focus Not Obscured (Minimum) | Open | At mobile width the open menu stays open when keyboard focus leaves it. The next focused control sits underneath the dropdown and is hidden. | 390px: open menu, Tab past "Contact". Focus lands on "Scroll down", and `elementFromPoint` at its centre returns `A.nav-link` inside `NAV`. `aria-expanded` is still `true`. | Close the menu when focus leaves `#primary-navigation` and the menu button (`focusout` handler in `Header.jsx`), or trap focus inside the menu while it is open. |
| A11Y-2 | Medium | 2.1.1 Keyboard (expected disclosure pattern); 1.4.13 by analogy | Open | Escape does not close the mobile menu. | 390px: click menu button, press Escape. `aria-expanded` stays `true` and the nav stays `visibility: visible`. | Add a `keydown` Escape handler that closes the menu and returns focus to the menu button. |
| A11Y-3 | Medium | 1.4.3 Contrast (Minimum) | Open | Inactive nav links (`text-zinc-50/50`) measure about 4.45:1, just under 4.5:1. The header is translucent with a backdrop blur, so the real ratio changes with the content behind it. | Computed `rgba(250,250,250,0.5)` on a blended background of about `rgb(47,47,49)` gives 4.45:1 (14px, weight 500). Applies to "About", "Publication", "Awards", "Skills" and "Certificates". | Use `text-zinc-50/60` or `text-zinc-400`, which is well above 4.5:1 on this background. |
| A11Y-4 | Low | 2.4.1 Bypass Blocks (best practice; landmarks already satisfy the minimum) | Open | There is no skip link. The first Tab stop is the logo, then 7 nav links. | Tab order: logo, Home, About, Publication, Awards, Skills, Certificates, Contact Me, Download CV... | Add a visually hidden "Skip to content" link targeting `<main>` that appears on focus. |
| A11Y-5 | Low | 1.3.1 Info and Relationships / 2.4.6 Headings and Labels | Open | The About section has no heading, so the heading outline jumps from the H1 straight to "Publications". | Heading list: `H1 Kritchavit Thippayajindakul`, `H2 Publications`, ... In `About.jsx` the `<section id="about">` contains no `h2`. | Add an `h2` "About" (it can be visually hidden). |
| A11Y-6 | Low | 1.3.1 / 4.1.2 (best practice) | Open | The active nav item is shown only by a CSS class and the sliding `.active-box`. There is no `aria-current`. | `Navbar.jsx` toggles `classList.add('active')` only. | Set `aria-current="true"` on the active link (add or remove it alongside the `active` class). |
| A11Y-7 | Low | 3.2.5 Change on Request (AAA, advisory G201) | Open | 79 links open in a new tab with no warning. | `a[target=_blank]` count = 79. | Add visually hidden "(opens in new tab)" text, or an icon with that label. |
| A11Y-8 | Low | 3.3.2 Labels or Instructions | Open | Every contact field is required, but the labels do not say so. Errors come only from native browser validation: there is no `aria-invalid` or inline message. | Label text is "Name" with no indicator. Submitting an empty form focuses `#name` with "Please fill out this field." and 0 `[aria-invalid]` elements. | Add "(required)" or a "All fields are required" note. Native validation is acceptable for 3.3.1. |
| A11Y-9 | Low | 2.4.3 Focus Order (mobile) | Open | Choosing a link in the mobile menu closes the menu, and focus falls to `<body>`, not to the target section. The next Tab does continue from the target section, so this is not a blocker. | After clicking "Awards": `aria-expanded=false`, and `document.activeElement` is `BODY`. | Optionally give the section headings `tabindex="-1"` and move focus to them on navigation. |

## Fixed on this branch (verified now)

- Icon-only links and the menu button have accessible names. The menu button has `aria-expanded` and `aria-controls="primary-navigation"`, and its label switches between "Open menu" and "Close menu". There are no unnamed focusable links or buttons.
- The hero name is the single `<h1>`.
- Duplicate card-overlay links are kept out of the accessibility tree and the tab order. No duplicate stops appeared in the Tab sequence.
- Footer and About link contrast pass. The automated scan flagged nothing outside the nav links in A11Y-3.
- Reduced motion works: with `reducedMotion: 'reduce'`, 0 of 100 `.reveal-up` elements are hidden, `scroll-behavior` is `auto`, and Lenis is not loaded.

## Verified OK

- `<html lang="en">`, and `<title>` "Reaw's Portfolio".
- Landmarks: `header`, `nav[aria-label="Primary"]`, a single `main`, and `footer`.
- Heading levels never skip (H1 → H2 → H3 → H4), apart from the missing About heading (A11Y-5).
- All 70 `<img>` have an `alt`. Decorative logos use `alt=""`. The portrait, award photos and flags have descriptive alt text.
- No duplicate `id`s.
- Material Symbols icon ligature spans are `aria-hidden="true"` (`Button.jsx`, `Header.jsx`).
- Focus is visible on every stop tested. Chromium's default two-tone ring shows on the dark background (screenshot checked), and the header does not cover focused elements on desktop.
- The closed mobile menu is out of the tab order (`visibility: hidden`): Tab goes logo → menu button → Download CV.
- Contact form: `name`, `email` and `message` each have a `<label for>`, and `autocomplete="name"` / `"email"` are set. The honeypot `_gotcha` has `aria-hidden="true"` and `tabindex="-1"`.
- Reflow (1.4.10): `scrollWidth` equals the viewport at 320px and at 640px (200% zoom), with no horizontal scroll.
- Text spacing (1.4.12): with the WCAG override styles at 390px, nothing overflows and no text is clipped.
- Target size (2.5.8): the only controls under 24px are inline links inside the About paragraph ("Institute of Science Tokyo", "ACAP program", 20px high). These fall under the inline exception.
- Not tested: screen-reader announcement in a real assistive technology, and contrast of placeholder text.
