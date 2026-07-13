# Marigold Akufo-Addo — Portfolio Site

Artist portfolio for **Marigold Akufo-Addo** (Ghanaian painter/mixed media artist).
Client: **Malcolm** (Upwork). Domain: `marigoldakufoaddo.art`

---

## Stack

| Tool | Version |
|------|---------|
| React | 18.3 |
| Vite | 5.4 |
| React Router | v7 |
| Tailwind CSS | 3.4 |
| GSAP | 3.12 |
| Lenis (smooth scroll) | 1.0 (`@studio-freight/lenis`) |
| Hammer.js | 2.0.8 (touch gestures) |
| Fonts | `portrait` (serif body), `apercu` (sans UI), `Jost` (fallback) — loaded via `@font-face` from `/fonts/` |

Dev: `npm run dev` · Build: `npm run build`

---

## Design System

| Token | Value |
|-------|-------|
| Background (dark) | `#0c0a08` / `#0e0c0b` |
| Background (white pages) | `#f0ebe2` (warm cream) |
| Text (on dark) | `#f0ebe2` |
| Text (on white) | `#0c0a08` |
| Body font | `portrait, serif` |
| UI font | `apercu, sans-serif` |
| Nav style | lowercase, `letter-spacing: 3px`, `font-size: 0.75rem` |

Design references: **sophiehustin.com** (primary), **kerrynlevyceramics.com** (secondary).
Principle: artwork IS the design. Never add decorative elements that compete with the work.

---

## Architecture

### Global layout (`src/App.jsx`)
- `SiteProvider` wraps everything — body class state lives here
- `PrimaryNav` + `CenterNav` + `CrossNav` are app-level (persist across routes)
- Page transitions: GSAP overlay (`app-overlay`) slides in/out; body class `is-transition` during transition
- `.page-view` is `position: fixed; overflow: hidden` — the entire site is a fixed viewport

### Body classes (drive most visual states via CSS)
| Class | Effect |
|-------|--------|
| `is-white` | Cream overlay slides in, nav turns dark, cursor turns dark — used on About & Contact |
| `is-section` | Artwork lightbox is open |
| `is-contact` | Contact page (partial overlay) |
| `is-loaded` | Initial load complete, nav animates in |
| `is-menu-open` | Mobile menu visible |
| `is-peintures` / `is-sculptures` | Paintings / Drawings gallery active |

### Overlay system
- `.overlay` — `position: absolute; background: #f0ebe2` — driven by `body.is-white`
- `app-overlay` — GSAP-controlled dark transition overlay (z-index: 50)
- These are the ONLY backgrounds. Pages themselves are transparent.

### Scroll
- All pages use **Lenis** for smooth scroll inside `.page--content` (the scroll wrapper)
- `.page--content` — `position: absolute; top: 0; height: 100%; overflow: hidden` (lenis-wrapper)
- Exception: Contact uses its own `.contact-scroll-wrapper`
- **About page**: scroll container starts at `top: var(--about-clip)` (CSS variable, default 150px) so text clips exactly at the nav/image-tip line. Adjust `--about-clip` on `.page-a-propos` to tune this.

---

## Pages & Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `Home.jsx` | Full-screen hero, works list, hero-to-works transition |
| `/paintings` | `Paintings.jsx` | Masonry/grid gallery |
| `/paintings/:id` | `Works.jsx` | Lightbox / single artwork detail |
| `/drawings` | `Drawings.jsx` | Masonry/grid gallery |
| `/drawings/:id` | `Works.jsx` | Lightbox / single artwork detail |
| `/about` | `About.jsx` | Bio text (left) + sticky photo (right), Lenis scroll |
| `/contact` | `Contact.jsx` | Contact form |

---

## Artwork Data (`src/data/artworks.js`)

Two collections exported: `paintings` (11 items) and `drawings` (5 items).
Each item: `{ id, slug, src, title, medium, year, dimensions, period }`.
Period values: `'early'` / `'intermediate'` / `'later'`.

Images live in `/public/images/`:
- `artwork-01.jpg` → `artwork-16.jpg` — the artworks
- `hero.jpg` — rusty/earth textured abstract (hero background)
- `Marigold.jpeg` — artist portrait photo (About page right column)
- `signature.jpeg` — artist signature (About page, appears after bio animates in)
- `WhatsApp Image 2026-07-01 at...` — raw client-supplied images (not yet sorted/used)

---

## Key Components

### `PrimaryNav` (`src/components/PrimaryNav.jsx`)
- CSS-based nav, NOT Tailwind. Uses `nav.primary-nav` class.
- Logo: `div.logo-main` (fixed, top-left, hidden on Home)
- Links: Home · Selected Work · About · Contact
- Staggered char animation via `SplitText` + `.nav-char` spans

### `About.jsx` — important details
- GSAP word-by-word reveal on mount (`SplitWords` → `.word-clip > .word-inner`)
- Signature image animates in after bio words finish
- Lenis wrapper: `contentRef` = `.page--content`, `content` = `.about-layout`
- Photo column: `position: sticky; top: 0` (sticks at top of scroll container = `--about-clip` from viewport top)
- **Clip line**: controlled by `--about-clip` CSS variable on `.page-a-propos`. Text disappears at this line, parallel to the image's top edge. Default is `150px`.

### Touch gestures (Hammer.js)
- Pan gesture on hero (mobile drag)
- Swipe on Works detail (prev/next navigation)

---

## Content — All Placeholder

All bio text, news, and exhibition info is **placeholder** — get final copy from Malcolm.
Instagram handle is also placeholder — get real handle from Malcolm.
The artist's royal title: *"Oyententu" Nana Abena Oye Okoboahene Dehye, Okuapeman* (enstooled 17 Aug 2023).

---

## CSS Conventions

- All layout state via **body classes** → CSS rules (never inline JS style for state)
- z-index hierarchy: page content (1–3) → nav elements (20) → transitions (50) → cursor (9999)
- Transitions: prefer `cubic-bezier(.19,1,.22,1)` (snappy) or `cubic-bezier(.86,0,.07,1)` (heavy ease)
- Never add decorative elements. Typography and spacing are the only design.
- Mobile breakpoints: `768px` and `480px` in `@media` blocks at bottom of `index.css`

---

## Things Still Needed from Client (Malcolm)

- Final bio copy
- Final news/exhibition content
- Real Instagram handle
- Confirm artwork titles, mediums, years, dimensions
- Any additional artworks to add
