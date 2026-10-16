# Skinera

Ukrainian-language website + e-commerce for a beauty salon in Lviv. Two parts:
- **Salon services** (marketing pages): face care, laser hair removal, massage. Contact/consult forms.
- **Cosmetics shop**: product catalog w/ filters, favorites, cart, checkout w/ Nova Poshta delivery, user accounts.

Prod URL: https://skinera-web.vercel.app/ (Vercel). Site language `uk`; UI copy, validation messages, API errors are in Ukrainian. Keep new user-facing text Ukrainian.

## Stack

- Next.js 15.1.7 (App Router, Turbopack dev), React 19, TypeScript (strict)
- Tailwind CSS 3 (+ `@tailwindcss/forms`), framer-motion, react-icons, heroicons, react-toastify
- State: zustand (`persist` + `devtools`) — cart, favorites
- Forms: react-hook-form + zod (`@hookform/resolvers`), react-imask / react-input-mask for phone
- Auth: next-auth v4, Credentials provider, JWT sessions, bcryptjs
- DB/storage: **none** — Firebase removed; data API routes return 501 (`src/lib/no-backend.ts`), `lib/products.ts` returns empty, login disabled. New backend TBD
- External: Nova Poshta API (cities/departments), `xlsx` (data migration scripts)
- SVG via `@svgr/webpack` (webpack + turbo rules in `next.config.ts`, types in `svgr.d.ts`)
- Remote images allowed: `images.prom.ua`

## Commands

```
npm run dev            # next dev --turbopack
npm run build          # next build
npm run build:analyze  # ANALYZE=true bundle analyzer
npm run start
npm run lint / lint:fix
npm run type-check     # tsc --noEmit
npm run check-static   # src/scripts/check-static-generation.ts
```

No test framework configured. Validate changes with `type-check` + `lint`.

## Structure

```
src/
  app/                  # routes (App Router)
    page.tsx            # home
    services/{face-care,laser-hair-removal,massage}/
    products/, products/[id]/    # catalog + detail
    favorites/, checkout/, order-confirmation/[id]/, account/, contacts/
    api/
      auth/{[...nextauth],register,check-user,validate-credentials,update-user,user-info}
      products/{route,[id],filters,price-range}
      favorites/, orders/
    sitemap.ts, robots.ts, error.tsx, global-error.tsx, not-found.tsx, loading.tsx
  actions/checkout.ts   # 'use server' — Nova Poshta city/department lookups
  components/
    layout/ (Header, Footer, Navigation, ...)  common/ (Modal, DropDown, Swiper, ...)
    sections/ (page sections)  products/  forms/  auth/AuthModal  seo/StructuredData
    store/ (cartStore, favoritesStore — zustand)
  hooks/                # useDebounce, useFavorites
  interfaces/           # Order, NovaPoshtaResponse, Section
  lib/                  # auth.ts (authOptions), no-backend.ts, products.ts (Product type + stubs), utils.ts
  mockData/             # static content for service pages, Nova Poshta fav cities
  scripts/              # zod-schemas.ts (Register/SignIn), dev/maintenance scripts
```

Path alias: `@/*` → `src/*`.

## Data model (former Firestore, for new backend reference)

- `users/{email}` — doc ID is email; fields name, surname, email, bcrypt `password`
- `orders/{uuid}` — see `src/interfaces/Order.ts`; status `pending|confirmed|shipped|delivered|cancelled`; payment method label; delivery = Nova Poshta city/department + refs
- `favorites/{userId}`
- products — type in `src/lib/products.ts`. `Product.name` is `{ua, en}`; also price, image_url, category, brand, country, characteristics

## Env vars (`.env*` gitignored)

- `NEXT_PUBLIC_NOVAPOSHTA_API_KEY`, `NEXT_PUBLIC_NOVAPOSHTA_API_URL`
- `NEXTAUTH_SECRET` (+ `NEXTAUTH_URL`) for next-auth
- `config.ts` (zod env validation incl. WayForPay/merchant keys) is fully commented out; payment gateway not wired yet

## Conventions

- Prettier: 100 cols, 2 spaces, semicolons, single quotes, `trailingComma: es5`, `arrowParens: avoid`
- ESLint: flat config (`eslint.config.mjs`, next config)
- Client components marked `'use client'`; server actions `'use server'`
- API routes: `NextResponse.json({ error }, { status })`, validate input
- Bilingual product names: use `name.ua` for display
- Tailwind theme: brand pink palette (`brand-50..700`, `backgroundPink`, `backgroundYellow`, `pinkCustom`), custom `md` breakpoint = 800px, extra `maxWidth` up to `19xl`
- Fonts: Geist / Geist Mono (`next/font/google`)
- SEO: metadata in `app/layout.tsx`, JSON-LD in `components/seo/StructuredData.tsx`, `sitemap.ts` / `robots.ts`

## Gotchas

- Sitemap URLs build as `baseUrl` (trailing slash) + `/path` → double slash; also lists routes (`/services`, `/about`) that may not exist
- Google verification placeholder in `layout.tsx` metadata
- Auth code logged heavily with emoji `console.log`, including user emails
- Nova Poshta API key is `NEXT_PUBLIC_*` (exposed to client)
