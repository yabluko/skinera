# Section: Результати клієнток (`results`)

Self-contained spec. Implemented in `home.html` (after `#services`), CSS `css/results.css`, JS `js/results.js`.

## Goal & brief
- Trust via visible proof → push to booking/consultation.
- Real client before/after photos (laser epilation), published with client consent.
- Interaction: draggable before/after comparison slider (mouse, touch, keyboard).
- CTA: ink pill «Записатися на консультацію».
- Mood: continuation of paper background; Cormorant headline, Manrope UI; tokens only.
- No invented stats: no session counts shown until real numbers supplied.

## Approved variant & sources
- Approved: **A · Feature + pair** — `section-results-a.html` (preview: `preview-results.html`).
- Rejected (kept for reference): `section-results-b.html` (rail), `section-results-c.html` (arch + index).
- Variant sources: `css/section-results.css`, `js/section-results.js`. Final: `css/results.css`, `js/results.js` (A-only, no variant classes).

## Structure
```html
<section class="res" id="results" aria-labelledby="res-title">
  <div class="res-wrap">
    <header class="res-head">
      <div>
        <p class="kicker">Результати</p>
        <h2 class="res-title" id="res-title">Результати <em>клієнток</em></h2>
      </div>
      <div>
        <p class="res-intro">…</p>
        <a class="btn btn-ink" href="#">Записатися на консультацію <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </header>
    <div class="res-grid">
      <figure class="res-fig res-fig-lead">           <!-- chin, spans 2 rows -->
        <div class="ba" data-hint>
          <div class="ba-layer ba-before"><img …><span class="ba-tag">До</span></div>
          <div class="ba-layer ba-after"><img …><span class="ba-tag">Після</span></div>
          <span class="ba-line" aria-hidden="true"></span>
          <span class="ba-knob" aria-hidden="true"><svg …/></span>
          <input type="range" min="0" max="100" value="50" aria-label="Порівняти до і після: підборіддя">
        </div>
        <figcaption class="res-cap">
          <div><span class="kicker res-cap-svc">Лазерна епіляція</span><h3 class="res-cap-name">Підборіддя</h3></div>
        </figcaption>
      </figure>
      <figure class="res-fig"> … armpit (style="--focus: 50% 30%") … </figure>
      <figure class="res-fig"> … bikini … </figure>
    </div>
    <div class="res-foot"><p class="res-note">…</p></div>
  </div>
</section>
```
- `--focus` (inline, optional): `object-position` for the photo inside the frame.
- `data-hint`: slider does one gentle 50→32→66→50 swing when first 60% in view.

## Copy (uk)
- Kicker: «Результати»
- H2: «Результати *клієнток*» (italic «клієнток»)
- Intro: «Потягніть повзунок, щоб порівняти шкіру до курсу і після нього. Фото публікуємо лише за згодою клієнток.»
- CTA: «Записатися на консультацію»
- Cases (kicker / name): «Лазерна епіляція» / «Підборіддя», «Пахви», «Зона бікіні»
- Tags: «До», «Після»
- Note: «Результат індивідуальний і залежить від типу шкіри та волосся.»
- Alt: «<Зона>: до курсу лазерної епіляції» / «<Зона>: після курсу лазерної епіляції»

## Tokens & typography
- Colors: `--ink`, `--paper` (bg via body), `--pink` (kicker rule), `--pink-soft` (slider fallback bg), `--white` (tags, line, knob), `--warm-gray-mid` (foot rule), `--lavender-deep` (focus ring), `--res-mute` = `color-mix(in srgb, var(--ink) 74%, var(--paper))`.
- Radii: `--r-card` (lead + mobile frames), `--r-sm` (side frames ≥601px). Spacing: `--gutter`. Easing: `--ease`.
- H2: `--font-display` 300, `clamp(44px, 6vw, 84px)`, lh 1, ls -.01em.
- Case name: `--font-display` 400, `clamp(24px, 2.2vw, 30px)`; lead `clamp(28px, 2.8vw, 40px)`.
- Kicker: `.kicker` (Manrope 12px/600/.18em uppercase), forced `color: var(--ink)` (hero CSS sets `.kicker` pink). Case kicker 11px, muted.
- Tags: Manrope 11px/600/.14em uppercase, warm-white 88% pill.
- Section padding: `clamp(72px, 10vw, 140px)` block, `--gutter` inline; wrap max 1344px (same rhythm as services).

## Layout per breakpoint
- **≥1200 / 901–1199**: head grid 7fr/5fr (title left; intro + CTA right, bottom-aligned). Grid 7fr/5fr: lead fig spans 2 rows, `.ba` flex-fills height (min 420px); side frames 16:9, radius `--r-sm`.
- **601–900**: head single column. Grid 2 cols: lead full width, 4:3; two side figs side by side, 16:9.
- **≤600 (390)**: single column. Lead 4:5, sides 4:3, all radius `--r-card`.

## Assets
- `assets/before-after/{chin,armpit,bikini}-{before,after}.webp` (quality 84).
- chin, armpit: 1122×1402 (4:5). Chin before scaled/cropped to match after framing; armpit before scaled 1.03 + shifted to align. Source PNGs kept next to them.
- bikini: 1101×535 (landscape, low-res) — **replace** with 4:5 pair ≥1200×1500 when available.
- Photo requirements for new cases: separate before/after files, 4:5, ≥1200×1500 (ideally 1600×2000), same angle/distance/light, shot 30–40 cm (zone ≈60–70% of frame), no text/watermarks. Real clients with consent only.
- `<img>` attrs: `width`/`height`, `loading="lazy"`, `decoding="async"`, `draggable="false"`.

## Interactions / motion
- Drag anywhere on `.ba` (pointer events + capture); `touch-action: pan-y` keeps vertical page scroll. Pointerdown jumps divider with ease; move follows 1:1.
- Divider position = `--pos` (registered `@property`, so it transitions .7s `--ease` when `.is-ease`).
- Keyboard: visually hidden `<input type="range">` (arrows/Home/End); `aria-valuetext` «Після: N%»; focus ring on `.ba:has(input:focus-visible)`.
- Knob scales 1.08 on hover/drag.
- `prefers-reduced-motion`: no hint swing, no transitions.

## A11y
- Section labelled by H2; case names are H3.
- Each slider has range input with zone-specific `aria-label`; line/knob `aria-hidden`.
- Descriptive uk alt on every image.
- Tag text ink on 88% warm-white — passes contrast on any photo.
- Focus ring 2px `--lavender-deep`, 3px offset.

## Acceptance checklist
- [ ] Section appears after Послуги in `home.html`; `css/results.css` + `js/results.js` linked.
- [ ] Kicker ink (not pink), pink 40px rule before it.
- [ ] 3 sliders render; drag/tap moves divider; vertical swipe still scrolls on mobile.
- [ ] Keyboard Tab focuses each slider, arrows move it, ring visible.
- [ ] Lead slider swings once on first view; none with reduced motion.
- [ ] Layout matches breakpoints above at 1440, 1024, 768, 390; no horizontal scroll.
- [ ] No console errors (serve over http — module scripts don't run on file://).
- [ ] No invented numbers (sessions etc.) shown.

## Open items
- CTA `href="#"` — booking mechanism undecided (PRODUCT.md).
- Real session counts per zone (then re-add `.res-cap-meta` on the right of caption).
- Higher-res 4:5 bikini pair.
- Facial care / massage cases once real photos exist.

## Inspo refs
- daydream1820-com — floating card over split image (used in C).
- menkind-co--haarverlies — asymmetric editorial head, thin-rule lists.
- wenatal-com — calm serif over warm media.
- Source concept: `../skinera-redisign/redesign-variants.html` (v1 big + 2 side sliders).
