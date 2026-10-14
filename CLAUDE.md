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
- DB/storage: Firebase — Firestore + Storage. `firebase-admin` server-side, `firebase` client SDK
- External: Nova Poshta API (cities/departments), `xlsx` (data migration scripts)
- SVG via `@svgr/webpack` (webpack + turbo rules in `next.config.ts`, types in `svgr.d.ts`)
- Remote images allowed: `firebasestorage.googleapis.com`, `images.prom.ua`

## Commands

```
npm run dev            # next dev --turbopack
npm run build          # next build
npm run build:analyze  # ANALYZE=true bundle analyzer
npm run start
npm run lint / lint:fix
npm run type-check     # tsc --noEmit
npm run check-static   # src/scripts/check-static-generation.ts
npm run test-firestore # src/scripts/test-firestore-connection.ts
```

No test framework configured. Validate changes with `type-check` + `lint`.

Note: `init-db`, `migrate-*`, `test-firebase` scripts in package.json point to files not in repo (only `check-static-generation`, `test-firestore-connection`, `zod-schemas` exist in `src/scripts/`).

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
  lib/                  # auth.ts (authOptions), firebase.ts, firebase-admin.ts, products.ts, utils.ts
  mockData/             # static content for service pages, Nova Poshta fav cities
  scripts/              # zod-schemas.ts (Register/SignIn), dev/maintenance scripts
```

Path alias: `@/*` → `src/*`.

## Data model (Firestore)

- `users/{email}` — doc ID is email; fields name, surname, email, bcrypt `password`
- `orders/{uuid}` — see `src/interfaces/Order.ts`; status `pending|confirmed|shipped|delivered|cancelled`; payment method label; delivery = Nova Poshta city/department + refs
- `favorites/{userId}`
- products — read via `src/lib/products.ts` (client SDK). `Product.name` is `{ua, en}`; also price, image_url, category, brand, country, characteristics

## Env vars (`.env*` gitignored)

- `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID` — client SDK
- `FIREBASE_SERVICE_ACCOUNT` — service account JSON string (prod). Dev fallback: file in gitignored `config/`, else Application Default Credentials
- `NEXT_PUBLIC_NOVAPOSHTA_API_KEY`, `NEXT_PUBLIC_NOVAPOSHTA_API_URL`
- `NEXTAUTH_SECRET` (+ `NEXTAUTH_URL`) for next-auth
- `VERCEL_BUILD` — when set, Firebase Admin init and auth/favorites routes are skipped (build-time safety); `adminDb` can be `null` → always guard
- `config.ts` (zod env validation incl. WayForPay/merchant keys) is fully commented out; payment gateway not wired yet

## Conventions

- Prettier: 100 cols, 2 spaces, semicolons, single quotes, `trailingComma: es5`, `arrowParens: avoid`
- ESLint: flat config (`eslint.config.mjs`, next config)
- Client components marked `'use client'`; server actions `'use server'`
- API routes: `NextResponse.json({ error }, { status })`, validate input, check `adminDb` null first
- Bilingual product names: use `name.ua` for display
- Tailwind theme: brand pink palette (`brand-50..700`, `backgroundPink`, `backgroundYellow`, `pinkCustom`), custom `md` breakpoint = 800px, extra `maxWidth` up to `19xl`
- Fonts: Geist / Geist Mono (`next/font/google`)
- SEO: metadata in `app/layout.tsx`, JSON-LD in `components/seo/StructuredData.tsx`, `sitemap.ts` / `robots.ts`

## Gotchas

- Sitemap URLs build as `baseUrl` (trailing slash) + `/path` → double slash; also lists routes (`/services`, `/about`) that may not exist
- Google verification placeholder in `layout.tsx` metadata
- Auth/Firebase code logs heavily with emoji `console.log`, including user emails
- Nova Poshta API key is `NEXT_PUBLIC_*` (exposed to client)
- Order API falls back to fake email `user-<ts>@skinera.com` for guests; trusts client-sent `total` (no server-side price check)
