# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Women 18–55 from anywhere in Ukraine. The salon is physically only in Lviv, so many visitors are local, others are not. They look for face care, hair removal or massage, and book by phone. The cosmetics shop is a secondary path, mostly used after a visit. Mobile web is the likely main device (inferred, not confirmed).

## Product Purpose

Ukrainian-language site for the Skinera beauty salon in Lviv (пр. Червоної калини, 36в). Two parts: salon services (face care, laser hair removal, massage) with contact/consult forms, and a cosmetics shop (catalog, filters, favorites, cart, Nova Poshta checkout, user accounts). Primary success: bookings for salon services. The shop is secondary.

## Positioning

Salon services and a curated cosmetics shop in one place: procedures in the salon, products delivered nationwide via Nova Poshta.

## Operating Context

Bookings happen by phone (+38 096 518 0956), not through an online booking system. Hours Mo–Sa 10:00–20:00 (Sunday by appointment per structured data; verify). Orders ship via Nova Poshta. Payment gateway is not wired yet.

## Capabilities and Constraints

- Site and all user-facing copy are Ukrainian (`uk`). New text stays Ukrainian.
- Stack is fixed: Next.js App Router, Tailwind, Firebase, next-auth (see CLAUDE.md).
- Undecided: online booking, payment gateway.
- Unverified: opening hours on Sunday, email `info@skinera.com.ua`, postal code, social URLs (marked "update" in code).

## Brand Commitments

Name: Skinera. Existing logo at `public/icon`. No further brand commitments recorded.

## Evidence on Hand

Real, confirmed by the owner: salon photos, photos of equipment, photos of procedures, model photos of real people, and genuine customer reviews. Source files are in `public/images` and review content in the sections/mockData; locate before use. The `AggregateRating` 4.8 / 127 reviews in `StructuredData.tsx` was not independently verified; the owner says reviews are real, but confirm the numbers before relying on them.

## Product Principles

1. Booking first: every services page makes calling or requesting a consult the clearest next step.
2. Real over stock: use the salon's own photos, equipment, and reviews; never fabricate proof.
3. Ukrainian-first, plain language: clear procedure info, prices, and contraindications over marketing talk.
4. Shop supports the salon: it never competes with the booking path.
5. Work for visitors from all over Ukraine, even though service is Lviv-only; make the location obvious.
