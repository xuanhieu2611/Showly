# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## What is Showly?

**Showly** is a Vietnamese-first portfolio and discovery platform for beauty artists — nail artists, makeup artists, and hairstylists. Think Linktree meets Behance, built for Vietnam's beauty industry.

Every artist gets a dedicated URL at `showly.vn/@username` to share on TikTok/Instagram bios instead of linking to a messy social feed. Clients discover artists by specialty, city/district, and rating.

**The single most important page is `app/[locale]/[username]/page.tsx`** — the public artist profile. Every architecture and performance decision should optimize for this page loading fast, looking stunning, and previewing beautifully when shared on TikTok, Instagram, and Zalo.

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npm start        # Start production server
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui (`components/ui/`) |
| State | Zustand (`lib/onboarding-store.ts`) |
| i18n | next-intl — Vietnamese default (`vi`), English (`en`) |
| Backend | Supabase (Postgres + Auth + Storage) |
| Hosting | Vercel |

---

## Architecture

### Routing & i18n

All pages live under `app/[locale]/` — the locale segment is always present in the URL path (`/vi/...` or `/en/...`). The `routing` config in `i18n/routing.ts` defines `locales: ["vi", "en"]` with `defaultLocale: "vi"`. `next-intl` middleware handles locale negotiation. Translation strings live in `messages/vi.json` and `messages/en.json`.

### Supabase clients

Two clients — never mix them:
- `lib/supabase/server.ts` — for Server Components, Server Actions, and Route Handlers (uses cookies)
- `lib/supabase/client.ts` — for Client Components only

All DB types are generated in `lib/supabase/types.ts`. Use `Tables<"table_name">` for row types.

### Server Actions

Business logic lives in `app/actions/`:
- `auth.ts` — account type selection post-OAuth
- `dashboard.ts` — profile and portfolio mutations
- `onboarding.ts` — 4-step onboarding flow

### Public profile page

`app/[locale]/[username]/page.tsx` must use SSR (server component + `generateMetadata`). Never client-fetch-only — Google, TikTok, and Zalo link previews all require server-rendered HTML and Open Graph tags.

---

## Database Schema (Supabase)

```
users               — extends auth.users; has account_type ('artist' | 'client')
artist_profiles     — username, bio, city, district, price_range, is_published
specialties         — one-to-many: artist_id + specialty ('nail' | 'makeup' | 'hair')
portfolio_photos    — image_url (full), thumbnail_url (400px), sort_order, is_cover
photo_tags          — tag_slug + specialty per photo
reviews             — rating 1–5, review_text ≤150 chars, unique per artist+reviewer
profile_views       — viewer_ip_hash (never raw IP), for analytics
```

Full schema with RLS policies: `lib/supabase/schema.sql`

RLS summary: published profiles are publicly readable; owner can edit own rows; `contact_info` is in DB but must **never** be rendered in raw HTML — only inject via JS on button click to block scrapers.

---

## Design System

**Aesthetic**: editorial beauty magazine meets clean tech. Every screen should make an artist proud to share their URL.

| Token | Value |
|-------|-------|
| Primary | Warm Gold `#C9A96E` |
| Background | Soft Cream `#FAFAF8` |
| Text | Near-Black `#1C1C1C` |
| Accent | Soft Blush `#F2EDE8` |
| Heading font | Playfair Display |
| Body font | Be Vietnam Pro (designed for Vietnamese — verify diacritics render: ắ ệ ươ ổ ỡ ặ ừ) |
| Border radius | 8–16px |

**Specialty badge colors:**
- Nail: Rose Gold pill `#E8C4B8` / text `#7A3F30`
- Makeup: Mauve pill `#D4B8D4` / text `#5A3060`
- Hair: Sage pill `#B8D4C0` / text `#2D5A3A`

**Mobile-first.** Primary viewport is 375px (client clicking a TikTok bio link). Desktop is an enhancement.

---

## Critical Implementation Rules

**Contact info protection** — `contact_info` (phone/Zalo) must never appear in raw HTML source. Only reveal on a button click that injects via JavaScript. Scrapers must not be able to harvest it.

**Cover photo** — only one `is_cover = TRUE` per artist at a time. DB trigger `enforce_single_cover` handles this, but also enforce in application logic when setting a new cover.

**SSR on profile pages** — `app/[locale]/[username]/page.tsx` must be a server component using `generateMetadata` for OG tags. No client-only fetching.

**Image pipeline** — on upload: resize to max 1920px (full), generate 400px thumbnail. Store both `image_url` and `thumbnail_url` in `portfolio_photos`. Serve via Supabase CDN + Next.js `<Image sizes=...>`.

**Username rules** — lowercase, alphanumeric + underscores, 3–30 chars. Unique constraint at DB level. Validate in real-time during onboarding (green checkmark / red X as user types).

**Discovery pagination** — 24 artists per page. Infinite scroll or "Tải thêm" button. Filter/sort changes reset to page 1.

**i18n scope** — translate all UI labels, navigation, buttons, errors, empty states, and style tag taxonomy. Do NOT translate artist-generated content (bio, photo descriptions).

---

## URL Structure

| URL | Page |
|-----|------|
| `/` | Homepage — featured artist grid |
| `/discover` | Browse & search with filters |
| `/@username` | Public artist profile (the shareable link) |
| `/join` | Artist onboarding entry |
| `/login` | Google / Facebook OAuth |
| `/dashboard` | Artist private dashboard |
| `/dashboard/edit` | Edit profile |
| `/dashboard/portfolio` | Manage photos (drag-and-drop reorder) |
| `/dashboard/analytics` | Profile view stats |
| `/admin` | Internal moderation panel (env-var password protected, not linked publicly) |

All URLs are prefixed with `[locale]` in the actual file structure.

---

## MVP Scope (what's in, what's out)

**In scope for MVP:**
- Google + Facebook OAuth, account type selection, 4-step artist onboarding
- Artist profile with custom URL, portfolio gallery (≤50 photos), drag-and-drop reorder, style tags
- Public artist profile page (SSR, OG tags, Schema.org)
- Discovery page: masonry grid, search + specialty/city/district filters, sort
- Star rating + short review system (logged-in clients only, one per artist)
- Artist dashboard: edit profile, manage photos, view analytics
- Bilingual UI (Vietnamese default, English toggle)
- SEO: sitemap.xml, robots.txt, structured data
- Admin panel for flagged review moderation

**Out of scope for MVP:** messaging, booking, video upload, before/after slider, paid tiers, mobile app.

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://showly.vn
ADMIN_PASSWORD=          # for /admin basic auth
```

---

## Style Tag Taxonomy (pre-defined, no free-text tags)

| Specialty | Tags |
|-----------|------|
| Nail | Gel Nails, Ombre/Gradient, Nail Stamping, 3D Nail Art, French Tips, Minimalist, Floral, Y2K, Korean Style, Soft Girl, Dark/Goth, Abstract |
| Makeup | Natural/No-Makeup, Korean Makeup, Bridal, Glam/Evening, Editorial, Airbrush, SFX/Special Effects, Contouring, Eye-focused |
| Hair | Balayage, Highlights, Keratin/Straightening, Perms, Braids, Updo/Bridal Hair, Korean Hair, Bob Cut, Layers, Color Transformation |
