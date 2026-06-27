# TODO — Vito Giacobelli Portfolio (rebuild)

Single-page site, sections in order: **Hero → About → Projects → Footer**.
Design tokens & references locked in Phase 1.

## Setup
- [x] Scaffold new Astro repo in `Portfolio_Website_New`
- [x] Copy `public/` (fonts, images, favicons) from old project
- [x] Add Projects SVG assets to `public/images/projects/`
- [x] `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- [x] `npm install`

## Foundations
- [x] `styles/global.css` — reset, design tokens, @font-face, `.container`/`.grid`
- [x] `layouts/Base.astro` — html/head/meta/font preload

## Components
- [x] `Navbar.astro` — fixed black pill (logo · HOME/ABOUT/PROGETTI · CONTATTAMI)
- [x] `Intro.astro` + `scripts/intro.js` — logo preloader (CSS + vanilla JS, no GSAP)
- [x] `home/Hero.astro` — PORTFOLIO title + layered decorations + scroll cue + meta row
- [x] `home/About.astro` — ABOUT ME + "HI, I [photo] VITO" + tagline + SCOPRI DI PIÚ
- [x] `home/Projects.astro` — PROGETTI + turntable composition + slider + folder (single project nº 01, data-driven)
- [x] `Footer.astro` — blue section: CONTATTI + SOCIAL + cat_lie + giant CONTATTAMI
- [x] `pages/index.astro` — compose all sections

## Responsive
- [x] Desktop (1440) → tablet → mobile breakpoints for every section

## Wrap-up
- [x] Build passes (`npm run build`)
- [x] Write `DONE.md` (handoff doc, incl. deferred items)

## Deferred (next pass)
- [ ] GSAP animations (scroll reveals, hero decoration float)
- [ ] Projects scroll-trigger: slider number tracks active project across multiple projects
- [ ] Multiple projects + per-project folder content
- [ ] New Logo.svg (swap when provided)
- [ ] Real social URLs (currently `#` placeholders)
- [ ] About / Project-detail pages
