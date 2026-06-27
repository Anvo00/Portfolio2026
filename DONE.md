# DONE — Vito Giacobelli Portfolio (rebuild)

Handoff document. Describes the current state so another agent (or person)
can pick the project up cold.

## What this is
A single-page Astro site rebuilt from scratch in `Portfolio_Website_New`
(the previous `portfolio/` project was used only for assets, not code).

Sections, in order: **Hero → About → Projects → Footer**, behind a logo
intro preloader. Italian copy. Design tokens from the Phase-1 brief.

## Stack
- **Astro 6** (static output). No UI framework.
- The intro is plain CSS keyframes + a tiny vanilla-JS orchestrator.
- **GSAP** is installed but currently **unused** — the About scroll animation
  was built then reverted to static at the client's request. Kept as a
  dependency for likely future use (e.g. Projects).
- Fonts: **Gobold** (display) + **Sora** (body), self-hosted in `public/fonts`.

## Run it
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static build into dist/  (verified passing)
```

## Project layout
```
public/
  fonts/                     Gobold + Sora woff2 (copied from old project)
  images/                    hero & about & footer art + social icons
  images/projects/           turntable assets (renamed, space removed):
                             vinyl_turntable, testina, arrow,
                             button_2025, button_2026,
                             project_slider, project_folder
src/
  layouts/Base.astro         <html>/<head>, global css, font preload
  pages/index.astro          composes the page; adds body.intro-active
  components/
    Navbar.astro             fixed black pill; responsive hamburger (vanilla JS)
    Intro.astro              logo curtain preloader
    Footer.astro             blue contact section + giant CONTATTAMI wordmark
    home/Hero.astro          PORTFOLIO wordmark + layered decorations + scroll cue
    home/About.astro         "HI, I [photo] VITO" headline + tagline + CTA
    home/Projects.astro      turntable composition (data-driven, 1 project)
  styles/                    one stylesheet per component + global.css
  scripts/intro.js           intro timing / curtain lift / scroll unlock
```

## Design tokens (in `src/styles/global.css :root`)
- Colours: `--white #FFFAF6`, `--black #0E0E0E`, `--accent #0071CE`,
  `--pattern #CFE3F7` (hero tile), `--grey #D8D8D8`.
- Page is light (`--white` bg / `--black` fg); the **Footer inverts** to blue.
- Type: `--font-display` Gobold, `--font-body` Sora. Body 14px. Section titles
  `clamp(40,5vw,72)`. Mega headlines `clamp(72,15vw,220)`.
- Layout: max width 1440px, 12-col, 24px gutter & margin.
- `--section-gap: 128px` — used both between sections and between a section
  title and its content (per the brief).

## Section notes
- **Hero**: tiled monogram background (`hero-pattern.svg`). Wordmark is
  `portfolio_title.svg`; three decorations (`cat_jump`, `mouse_pointer`,
  `earphone` = earphone+wire+sun+notes cluster) absolutely positioned over it.
  Real `<h1>` text is screen-reader-only. Meta row pinned to the bottom.
- **About**: full-frame (100svh) **static** section (no animation). Final
  composition only: a single-line wordmark `.about_htext` "HI, I'M VITO"
  (~85vw) with the portrait overlapping its centre (covers the "'M"), sitting
  on two fanned blue CSS cards (`.about_card--left/right`, ±9°), then the
  tagline and "SCOPRI DI PIÚ" CTA. Title "ABOUT ME" removed.
  (A GSAP scroll animation was built here then reverted to static per the
  client.) NOTE: CSS `scroll-behavior: smooth` is intentionally NOT used;
  anchor smooth-scroll is handled by JS in `Base.astro`.
- **Projects**: turntable scene. Slider (`project_slider`) and folder
  (`project_folder`) are **inlined SVGs** so the project number and the
  "DETAILS OF THE PROJECT" card are templated from the `projects` data array.
  Vinyl / tonearm / arrow / year-flips are positioned `<img>`s. Only project
  **nº 01** is rendered (static).
- **Footer**: blue. Contatti (`tel:` + `mailto:`) + social icons + lying cat
  (`cat_lie.png`) + huge "CONTATTAMI" wordmark bleeding off the bottom edge.

## Verified
- `npm run build` passes.
- Rendered DOM checked via dev server: all sections present, no runtime errors.
- Layout geometry checked at desktop (1280) and mobile (375): Projects pieces
  positioned correctly with no off-screen elements; mobile stacks cleanly with
  **no horizontal overflow**; navbar collapses to a hamburger.
- Intro plays and correctly unlocks scrolling (`body.intro-active` removed).
- Note: automated screenshots were unavailable in the build environment
  (preview screenshot timed out), so visual fine-tuning of decoration offsets
  was done from geometry, not pixels — expect minor nudging once reviewed.

## Deferred / TODO (next passes)
- **GSAP animation pass**: scroll-reveal entrances, floating hero decorations.
- **Projects scroll-trigger**: as you scroll, the slider number should track the
  active project and the folder should swap per project. Structure is ready —
  `projects` array in `Projects.astro`, slider number + folder are templated.
  Add more entries to the array and wire a ScrollTrigger/IntersectionObserver.
- **New Logo.svg**: the current monogram (in `Navbar.astro` + `Intro.astro`)
  is the old one — swap when the new logo arrives.
- **Real social URLs**: Instagram / Behance / LinkedIn are `#` placeholders in
  `Footer.astro` (`socials` array).
- **About / Project-detail pages**: links are single-page anchors for now.

## Environment quirks (Windows)
- Project path contains spaces, which breaks the preview launcher. A directory
  junction `C:\portnew → D:\…\Portfolio_Website_New` was created so the preview
  tool (configured in the *old* project's `.claude/launch.json`) can run it.
  Safe to remove if not previewing: `cmd /c rmdir C:\portnew`.
