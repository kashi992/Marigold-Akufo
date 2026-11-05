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
| Font | **Jost only** (client-approved) — Google Fonts link in `index.html` (weights 400/500/600). Set once as `--site-font` at top of `src/index.css`; every `font-family` uses `var(--site-font)`. Normal = 400, bold = 600. Never add another font. (`public/fonts/` portrait/apercu files are unused leftovers.) |

Dev: `npm run dev` · Build: `npm run build`

---

## Design System

| Token | Value |
|-------|-------|
| Background (dark) | `#0c0a08` / `#0e0c0b` |
| Background (white pages) | `#f0ebe2` (warm cream) |
| Text (on dark) | `#f0ebe2` |
| Text (on white) | `#0c0a08` |
| Font (everything) | `Jost` via `var(--site-font)` |
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

Two collections exported: `paintings` (9 items) and `drawings` (7 items).
Each item: `{ id, slug, src, title, medium, year, dimensions, period }`.
Period values: `'early'` / `'intermediate'` / `'later'` (drives the Early/Intermediate/Later headings on the Selected Work list; undated works use a guessed period until Malcolm confirms).

**Artwork details** come from Malcolm's WhatsApp captions (TITLE / DATE / MEDIA / MEASUREMENT). Sizes are kept exactly as he wrote them (feet/inches, e.g. `2′6″ × 4′7″`) — don't convert. Unknown values are left as `''` and are simply hidden by the UI (list caption, gallery caption, single-artwork view). Eight works still have **placeholder titles and no details** (Girl with Flower, Woman on Rock, Earth and Sky, Forest, Vertical Composition, The Dancers, Red Procession, Blue Composition) — waiting on Malcolm.
Match client screenshots to site images by eye (file names don't map); `artwork-NN.jpg` is the join key.

Images live in `/public/images/`:
- `artwork-01.jpg` → `artwork-16.jpg` — the artworks (`artwork-09` is only 228px wide — ask Malcolm for a bigger original)
- `hero.jpg` — rusty/earth textured abstract (hero background)
- `Marigold.jpeg` — artist portrait photo (About page right column)
- `home-signature.png` (cream) / `home-signature-dark.png` (dark ink) — transparent signature, made from a Gemini-cleaned version of the ribbon photo; **client-approved**. Used on: Home hero, navbar logo (cream on dark pages, dark on cream pages), About page (under the bio), and the name slot on the Selected Work list
- `signature.jpeg` / `signature.webp` — original ribbon photo (no longer used on the site)
- `WhatsApp Image 2026-07-01 at...` — raw client-supplied images (not yet sorted/used)

---

## Key Components

### `PrimaryNav` (`src/components/PrimaryNav.jsx`)
- CSS-based nav, NOT Tailwind. Uses `nav.primary-nav` class.
- Logo: `div.logo-main` (fixed, top-left, hidden on Home) — two signature `<img>`s (`.logo-sig--light` / `.logo-sig--dark`) swapped by `body.is-white`; height scales down at 1024/768/480px
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

## Mobile / touch notes

- Lenis only smooths the mouse wheel; on touch it leaves scrolling to the browser. Its wrappers are `overflow: hidden`, so a media query at the end of `index.css` (`hover: none` / `pointer: coarse` / ≤1024px) makes `.lenis-wrapper`, About and News scroll natively. Don't remove it or About/Paintings/Drawings stop scrolling on phones.
- Single-artwork view (`Works.jsx`): prev/title/next are grouped in the centre so they never collide with the social icons (bottom-right). Don't add a local "is leaving" lock to `goTo` — `navigateTo` already blocks during transitions, and a local lock gets stuck and kills next/prev/swipe.
- Test on a phone with `npm run dev -- --host` (use `http://`, not https, on the LAN address).

---

## Things Still Needed from Client (Malcolm)

- Final bio copy
- Final news/exhibition content
- Real Instagram handle
- Title/date/medium/size for the 8 placeholder works listed above
- Original image files (not screenshots) for works he sent details for that aren't on the site yet: Profile, Three Four Five, Akuaba, Camouflage IV, Cyclist, Generations, Nude (pencil), and the Untitled pieces (1968 lithograph, 1970 silk screen, 1970 pen & ink)
- Any additional artworks to add
