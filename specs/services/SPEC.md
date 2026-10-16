# Services section — SPEC

Self-contained: a fresh session can rebuild this section from this file + project tokens.
All paths are relative to `/Users/yabko/WorkFront/skinera` (design prototype lives in `../skinera-redesign2/`; tokens: `../skinera-redesign2/css/tokens.css`, rules: `../skinera-redesign2/DESIGN.md`, `../skinera-redesign2/PRODUCT.md`).

## Goal & brief
- Show Skinera's 3 directions (laser epilation, facial care, massage) and route to booking.
- Each service: name, one-line copy, sub-list, placeholder "від … ₴*" price, CTA "Записатися".
- Mood: continuation of the hero — paper background, calm, airy; hero stays the dark/media moment.
- Mobile: stacked, full-width (photo → text → full-width CTA).
- No-gos: no invented ratings/testimonials; prices are **placeholders** and must stay visibly marked (`*` + footnote) until real prices are supplied (see `../skinera-redesign2/PRODUCT.md`).

## Approved variant & source files
- Approved: **C5** — `../skinera-redesign2/section-services-c5.html` (stacks on `../skinera-redesign2/css/section-services.css` + `../skinera-redesign2/css/section-services-c3.css` + `../skinera-redesign2/css/section-services-c4.css`; headline later changed, see Copy).
- Production: `../skinera-redesign2/home.html` (section `#services`, after the hero), `../skinera-redesign2/css/services.css` (clean, no variant classes), `../skinera-redesign2/js/services.js` (tabs), `../skinera-redesign2/css/home.css` (page flow fix: `main { flex-direction: column }`, since `../skinera-redesign2/css/hero-1.css` makes `<main>` a flex row).
- `../skinera-redesign2/home.html` `<head>` adds `<script>document.documentElement.classList.add('js')</script>` — tabs only activate with `.js`.
- Iteration history (kept): A triptych, B editorial rows, C index + floating white card, C2 side card, C3 paper notch, C4 no card, C5 shorter photos. Switcher: `../skinera-redesign2/preview-services.html`.

## Structure
```html
<section class="svc" id="services" aria-labelledby="svc-title">
  <div class="svc-wrap svc-split">
    <div class="svc-side">
      <header class="svc-head">
        <p class="kicker">Послуги</p>
        <h2 class="svc-title" id="svc-title">Три напрямки <em>догляду</em></h2>
        <p class="svc-intro">…</p>
      </header>
      <ul class="svc-tabs" role="tablist" aria-label="Напрямки послуг">
        <li role="presentation">
          <button class="svc-tab" role="tab" id="tab-laser" aria-controls="panel-laser" aria-selected="true">
            <span class="svc-num">01</span><b>Лазерна епіляція</b><small>від 450 ₴*</small>
          </button>
        </li>
        <!-- tab-facial (02), tab-massage (03): aria-selected="false" tabindex="-1" -->
      </ul>
      <p class="svc-note">* …</p>
    </div>
    <div class="svc-panels">
      <article class="svc-panel is-active" id="panel-laser" data-k="laser" role="tabpanel" aria-labelledby="tab-laser">
        <figure class="svc-photo"><picture><source type="image/webp" srcset="…webp"><img src="…jpg" width height loading="lazy" alt="…"></picture></figure>
        <div class="svc-info">
          <div class="svc-info-top"><h3 class="svc-name">…</h3><span class="svc-price"><small>від</small>450 ₴<sup>*</sup></span></div>
          <p class="svc-desc">…</p>
          <ul class="svc-list" aria-label="Зони"><li>…</li></ul>
          <a class="btn btn-ink btn-sm" href="#">Записатися <span class="arrow">→</span></a>
        </div>
      </article>
      <!-- panel-facial, panel-massage (no .is-active) -->
    </div>
  </div>
</section>
```

## Copy (uk, final)
- Kicker: **Послуги**
- H2: **Три напрямки *догляду*** (italic `<em>` on "догляду" per `../skinera-redesign2/DESIGN.md` headline rule)
- Intro: «Кожна процедура починається з консультації та проходить у вашому темпі, на сертифікованому обладнанні.»
- Footnote: «* Ціни орієнтовні — точну вартість назвемо на консультації.»

| # | Name | Price (placeholder) | Desc | Sub-list (`aria-label`) |
|---|------|------|------|------|
| 01 | Лазерна епіляція | від 450 ₴* | Гладка шкіра надовго — параметри підбираємо під ваш тип шкіри та волосся. | Зони: «Обличчя, пахви, бікіні» · «Ноги, руки, спина» |
| 02 | Догляд за обличчям | від 700 ₴* | Програма під стан вашої шкіри — від глибокого очищення до відновлення. | Процедури: Чистка обличчя · Пілінги · Масаж обличчя |
| 03 | Масаж | від 700 ₴* | Час, щоб видихнути: від м’якого релаксу до апаратного масажу тіла. | Види масажу: Релакс-масаж · Лімфодренаж · Масаж спини · Апаратний масаж тіла |

CTA: «Записатися» on every panel; `href="#"` until booking mechanism is decided.

Alts:
- laser: «Майстриня проводить лазерну епіляцію пахвової зони, клієнтка у захисних окулярах»
- facial: «Косметологиня наносить пілінг пензлем на обличчя клієнтки»
- massage: «Масажистка робить масаж спини клієнтці, яка розслаблено лежить на кушетці»

## Tokens & typography
- Colors: `--paper` (bg), `--ink` (text, kicker, CTA fill), `--pink` (kicker rule), `--pink-deep` (active tab underline; CTA hover via `.btn-ink`), `--warm-gray-mid` (tab dividers), `--pink-soft` (photo fallback bg).
- Muted text: local `--svc-mute: color-mix(in srgb, var(--ink) 74%, var(--paper))` — replaces `--warm-gray`, which fails AA on paper (~3.3:1) for small text.
- Radius: `--r-card` (photos). Ease: `--ease`. Gutter: `--gutter`.
- Type: `--font-display` (Cormorant) for H2 (300, clamp(44px, 6vw, 84px), lh 1), tab names (300, clamp(32px, 3.2vw, 46px)), panel name (400, clamp(30px, 2.8vw, 40px)), price (400, 28px), numerals. `--font-body` (Manrope) for kicker (`.kicker` 12px/600/.18em uppercase), intro/desc 15px, list 13.5px/500, note 12.5px, button `.btn-sm` 13.5px/42px.

## Layout per breakpoint
- Section: `padding-block: clamp(72px, 10vw, 140px)`, `padding-inline: var(--gutter)`, wrap max 1344px centered.
- **≥1200 / 901–1199** (JS on): grid 5fr | 7fr, gap clamp(32px, 5vw, 88px). Left: head + tab list + note. Right: one panel visible (panels stacked in `grid-area: 1/1`, `align-self: start`). Photo full column width (~742px at 1440, ~557px tall), natural ratio. Info below photo in 2 cols: [name / price / desc] | [sub-list / CTA].
- **768–900 / 601–767**: single column; tabs hidden; all 3 panels stacked (gap 48px), info in 2 cols under each photo.
- **≤600 / 390**: single column; info one column (name + price in a row); CTA full-width.
- Without JS at any width: stacked panels (same as tablet).

## Assets
- Next app (current): `public/media/svc-{laser,facial,massage}4.jpg` 1146×860 (facial 1145×860), ~4:3, JPG q88; `next/image` serves WebP/AVIF. Shorter so photo + info fit one viewport at 1440×900 (photo ~557px, panel ~712px). Crop top offsets from source: laser 10%, facial 8%, massage 0% (keeps masseuse's head).
- Prototype (older, taller): `../skinera-redesign2/assets/media/svc-{laser,facial,massage}3.{jpg,webp}` 1146×1098 — top 80% of source. JPG q88, WebP q90 (`cwebp -m 6 -sharp_yuv`).
- Sources: `../skinera-redesign2/images/laser-epilation2.png`, `../skinera-redesign2/images/skin-care2.png`, `../skinera-redesign2/images/massage-2.png` (1146×1373, 5:6), **cropped in the file**.
- **Rule (user): no `object-fit: cover` / CSS cropping** — `img { width:100%; height:auto }`. Any reframing is done in the files. All three must share one ratio so the stage doesn't jump between tabs.
- Ideal future source: 1500px wide (retina at 742 CSS px).

## Interactions / motion
- Tabs (≥901 + `.js`): click or ←/→/↑/↓ (wraps); roving `tabindex`; `aria-selected` toggled; active panel `.is-active`.
- Panel crossfade: opacity .6s `var(--ease)`; hidden panels `visibility: hidden` (not focusable).
- Tab: inactive `--svc-mute` → hover/active `--ink`; 1px `--pink-deep` underline grows 0 → 100% (.5s).
- `prefers-reduced-motion`: transitions off.

## A11y
- `section[aria-labelledby]`, h2 → h3 order; tablist/tab/tabpanel roles wired (`aria-controls` / `aria-labelledby`).
- Small text uses `--svc-mute` / `--ink` (≥4.5:1 on paper). Focus ring from tokens (`:focus-visible` lavender-deep).
- Descriptive Ukrainian alts; images have width/height (no CLS); `loading="lazy"`.
- Placeholder prices marked `*` with visible footnote.

## Acceptance checklist
- [ ] Section follows hero in `../skinera-redesign2/home.html`; nav «Послуги» → `#services`.
- [ ] 1440: 2-col; laser active by default; tabs switch with mouse and keyboard; no layout jump between tabs.
- [ ] 900 and below: tabs hidden, 3 stacked panels; 390: CTA full-width, no horizontal scroll.
- [ ] Photos uncropped by CSS, not upscaled beyond source.
- [ ] No console errors (serve over http — `type="module"` scripts are blocked on `file://`).
- [ ] Only project tokens; no new hex values.

## Inspo refs
- daydream1820-com — https://daydream1820.com/en (card over photo → later removed)
- knoll-com — https://knoll.com (photo + label beneath)
- functionhealth-com--about — https://functionhealth.com (serif headline w/ italic phrase, split head)
