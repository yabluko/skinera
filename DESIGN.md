---
name: Skinera
description: Calm beauty studio in Lviv — laser epilation, facial care, massage.
colors:
  corinthian-pink: "#e9a9a4"
  pink-deep: "#c97a76"
  pink-soft: "#f6deda"
  lavender: "#bfb6c9"
  lavender-soft: "#e6e1ec"
  lavender-deep: "#7d7290"
  warm-ink: "#3a3330"
  warm-gray: "#8a817a"
  warm-gray-mid: "#d6cfc8"
  paper: "#efebe7"
  warm-white: "#fffdfb"
typography:
  display:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(84px, 17vw, 248px)"
    fontWeight: 300
    lineHeight: 0.82
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(44px, 6vw, 84px)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(30px, 2.8vw, 40px)"
    fontWeight: 400
    lineHeight: 1.05
  brand:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.02em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.18em"
  button:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  sm: "18px"
  card: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 3.5vw, 48px)"
  section: "clamp(72px, 10vw, 140px)"
  header: "64px"
components:
  button-primary:
    backgroundColor: "{colors.warm-ink}"
    textColor: "{colors.warm-white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.pink-deep}"
  button-primary-sm:
    backgroundColor: "{colors.warm-ink}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "42px"
  button-pink:
    backgroundColor: "{colors.corinthian-pink}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  button-pink-hover:
    backgroundColor: "{colors.pink-deep}"
    textColor: "{colors.warm-white}"
  chip-glass:
    textColor: "{colors.warm-white}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
  hero-card:
    backgroundColor: "{colors.pink-soft}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.card}"
  service-photo:
    backgroundColor: "{colors.pink-soft}"
    rounded: "{rounded.card}"
---

# Design System: Skinera

## Overview

**Creative North Star: "The Quiet Studio"**

Skinera should feel like stepping into a warm, softly lit treatment room where nobody is rushing you. The palette is skin-adjacent and powdery (Corinthian pink, warm paper, grayish lavender) anchored by a warm near-black ink rather than pure black. Real studio footage and photography carry the emotion; the interface sits calmly on top of it.

Type pairs a light, high-contrast Cormorant Garamond display (whispered, large, editorial) with a sturdy Manrope sans for everything functional. Depth comes from the media itself — warm photo and video, film grain, a soft vignette, frosted glass chips — and from soft light on paper (the blush wash), not from shadowed UI. Components are soft and confident: full pills, solid ink or pink fills, a white arrow disc, a 1px lift on hover. Sections below the hero return to paper: calm, airy, generous space; the hero stays the one dark, media-heavy moment.

**Key Characteristics:**
- Warm, powdery palette; ink is warm brown-black, never pure black.
- Light serif display at very large sizes; sans for all UI text.
- Media-first hero inside a large rounded card inset from the viewport; paper sections after it.
- Flat UI; glass and grain live on media.
- Pill shapes for every interactive control.
- Slow, gentle motion: staggered rise-in, slow image zoom, one-time scroll reveals; reduced motion respected.

## Colors

Skin-toned and powdery: one warm pink accent, a lavender companion, and warm neutrals.

### Primary
- **Corinthian Pink** (`corinthian-pink`): the signature accent — CTA fill on dark media, short hairline rules beside kickers, the warm core of the blush wash. Used sparingly.
- **Dusk Rose** (`pink-deep`): hover state for primary and pink buttons; the active-tab underline. The only "active" color.
- **Blush Veil** (`pink-soft`): kicker text on dark media, hero-card and photo fallback background, the body of the blush wash.

### Secondary
- **Grayish Lavender** (`lavender`): secondary accent surfaces.
- **Lavender Mist** (`lavender-soft`): soft tinted surfaces.
- **Deep Heather** (`lavender-deep`): focus ring outline.

### Neutral
- **Warm Ink** (`warm-ink`): body text, primary buttons, shade gradients (as rgba(58,51,48,α)).
- **Warm Gray** (`warm-gray`): decorative only on paper — it fails AA for small text there (~3.3:1).
- **Muted Ink** (warm ink mixed 74% into paper, `color-mix(in srgb, var(--ink) 74%, var(--paper))`): small secondary text on paper (prices' «від», sub-lists, inactive tabs, numerals); passes ≥4.5:1.
- **Linen** (`warm-gray-mid`): dividers and borders (tab rules, mobile menu rule, dropdown border).
- **Paper** (`paper`): page background.
- **Warm White** (`warm-white`): text on media/dark, button text, arrow disc, dropdown surface.

### Named Rules
**The Warm Black Rule.** Darks are always derived from Warm Ink (rgba(58,51,48,α) or rgba(38,28,26,α)); never pure black or cool grays.

**The One Blush Rule.** Corinthian Pink is the single accent per view; lavender supports, never competes in the same element.

**The Legacy Palette Rule.** The old magenta palette (Tailwind `brand-50…700`, `backgroundPink`, `backgroundYellow`, `pinkCustom`, `grayCustom`) is legacy. Never use it in new or touched UI; migrate to the `skin-*` / CSS-variable palette when a legacy screen is edited.

## Typography

**Display Font:** Cormorant Garamond (with Times New Roman, serif) — `--font-display`, Tailwind `font-display`
**Body Font:** Manrope (with system-ui, sans-serif) — `--font-body`, Tailwind `font-body`

**Character:** A whisper-light editorial serif against a warm, rounded geometric sans — elegant voice, practical hands.

### Hierarchy
- **Display** (300, clamp(84px, 17vw, 248px), 0.82): the Skinera wordmark in the hero only.
- **Headline** (300, clamp(44px, 6vw, 84px), 1): section headings; italic (`<em>`) on the one emotive word («Три напрямки *догляду*»).
- **Title** (400, clamp(30px, 2.8vw, 40px), 1.05): service names; tab-list names run larger and lighter (300, clamp(32px, 3.2vw, 46px)).
- **Brand** (500, 26px, 0.02em): header logotype.
- **Body** (400, 15px, 1.55): lead and descriptive copy, measure ~420–520px.
- **Label** (600, 12px, 0.18em, uppercase): kickers («Студія краси · Львів», «Послуги»).
- **Button / Nav** (600 / 500, 13.5–14px): controls and links.
- **Price** (Cormorant 400, 28px) with a Manrope 12px/600 «від» prefix and a half-size `*` marker.

### Named Rules
**The Serif Speaks, Sans Works Rule.** Cormorant only for wordmark, headlines, service names, prices and numerals; every control, label and paragraph is Manrope.

## Layout

Fixed 64px header (`--header-h`) over the page; the hero card sits below it with `gutter` inset on the sides and bottom (`min-height: min(720px, 100svh − header − gutter)`). Content sections are full-width with `gutter` side padding and generous block padding (clamp(72px, 10vw, 140px)), content capped at 1344px and centered.

The services section is a 5fr | 7fr split (gap clamp(32px, 5vw, 88px)): heading + tab list on the left, a single photo stage on the right; photo full column width at its natural ratio, info in two columns beneath. Gutter scales clamp(16px, 3.5vw, 48px).

Breakpoints: 800px (Tailwind `md`: nav collapses to burger), 768px (hero restacks, CTA full-width), 900px (services: tabs off, panels stack), 600px (services info single column, CTA full-width). Mobile is media-first portrait.

## Elevation & Depth

Flat by default. Depth comes from media layers — a sharp photo with blurred edges, warm ink shade gradients for legibility, a radial vignette, animated SVG grain at ~16% overlay — and, on paper, from light rather than shadow: the **blush wash**, a radial pink-soft glow centered just under the hero card that fades into paper behind the services heading (masked at its top edge so no seam shows). Glass (`backdrop-filter: blur(10–12px)`, white 14% fill, 32–45% white border) is for controls on media. The header is the one frosted-paper surface (paper at 90% + blur) so content stays legible when it scrolls beneath.

### Shadow Vocabulary
- **Media tile** (`box-shadow: 0 24px 50px -20px rgba(38, 28, 26, .6)`): the floating video tile over the hero photo. The only shadow.

### Named Rules
**The Glass-On-Media Rule.** Frosted glass appears only over photo/video; the fixed header is the single exception.

**The Light-Not-Shadow Rule.** On paper, separation comes from space and soft light (the blush wash), not from drop shadows or heavy rules.

## Shapes

Soft and round throughout. Hero card and service photos 28px, inner tiles 18px, every control a full pill (999px), icon buttons perfect circles. 1px hairlines only for tab dividers (Linen) and glass/ghost edges. Photos are never cropped by CSS (`width: 100%; height: auto`); any reframing is done in the image file, and photos in one group share one ratio.

## Components

### Buttons
- **Shape:** full pill (999px), min-height 46px, 0 24px padding; compact variant 42px / 0 20px / 13.5px.
- **Primary (ink):** Warm Ink fill, Warm White text — header CTA, service «Записатися».
- **Pink:** Corinthian Pink fill, Warm Ink text — the CTA on dark media.
- **Arrow disc:** 28px Warm White circle with "→", tucked into the right padding (−14px margin).
- **Hover / Focus:** fill shifts to Dusk Rose, `translateY(-1px)`, .25s; focus ring 2px Deep Heather, 3px offset (global `:focus-visible`).
- **Mobile:** section CTAs go full-width below 600–768px.

### Chips
- **Style:** glass pill on media — white 14% fill, 32% white border, blur 12px, 12.5px/600 Warm White text; hover to 30% fill. Hero service links.

### Cards / Containers
- **Hero card:** 28px corners, overflow hidden, Blush Veil fallback, photo + shade + vignette + grain layered inside.
- **Video tile:** 18px corners, 9:15 portrait, 1px white-45% border, media tile shadow, rotating procedure label, glass pause toggle.
- **Service photo:** 28px corners, Blush Veil fallback, uncropped image at a shared ~4:3 ratio.

### Navigation
- Logo mark + Cormorant «Skinera»; Manrope 13.5px links in ink at 80% → 100% on hover, active link on a Blush Veil pill; «Послуги» opens a Warm White dropdown (18px corners, Linen border). Phone + ink pill CTA on the right. Below 800px collapses to a 44px circular outlined burger.

### Service Index (signature)
- Left: kicker, headline, intro, then a tab list — each row a numeral, a light Cormorant name and a «від … ₴*» price, separated by Linen hairlines. Inactive rows Muted Ink → Warm Ink on hover/selected; the selected row grows a 1px Dusk Rose underline (0 → 100%, .5s).
- Right: one photo stage; panels crossfade (.6s) and hidden panels are `visibility: hidden`. Arrow keys move between tabs (roving tabindex).
- Without JS or below 901px: all panels stack, tabs hidden.

### Media Toggle
- 34px glass circle with pause/play glyph; required on any autoplaying video.

## Do's and Don'ts

### Do:
- **Do** let real studio media carry the hero; overlay copy on a warm ink shade gradient.
- **Do** use Cormorant at weight 300 for display and headline sizes and Manrope for all functional text.
- **Do** keep every control a pill and every icon button a circle.
- **Do** use Muted Ink, not Warm Gray, for small text on paper.
- **Do** mark placeholder prices with `*` and a visible footnote until real prices exist.
- **Do** keep motion slow and gentle: hero `rise` stagger (0.9s, 90ms steps); one-time scroll reveals (700ms ease-out, 14px rise, 110ms steps; photos wipe in with clip-path over 1100ms). Fire reveals once, gate them on the `.js` class, and fall back to a plain fade under `prefers-reduced-motion`.
- **Do** use the easing tokens: `--ease` (general), `--ease-out` (entrances), `--ease-in-out` (wipes / on-screen movement).

### Don't:
- **Don't** use pure black, cool grays, or saturated non-palette hues.
- **Don't** use the legacy `brand-*` magenta palette or `backgroundPink` / `pinkCustom` in new or touched UI.
- **Don't** add drop shadows to flat UI; depth belongs to media and soft light.
- **Don't** separate paper sections with heavy rules or boxes; use space and the blush wash.
- **Don't** crop photos with `object-fit: cover` outside the hero; reframe in the file.
- **Don't** present placeholder stats, ratings or prices as real (see PRODUCT.md).
