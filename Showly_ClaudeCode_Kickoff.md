# Showly — Claude Code Kickoff Prompt

Copy and paste everything below this line into Claude Code.

---

You are building **Showly** — a portfolio and discovery platform for Vietnamese beauty artists (nail artists, makeup artists, hairstylists). Think Linktree meets Behance, built for Vietnam.

I am attaching the full PRD (`Showly_PRD.md`). Read it completely before writing a single line of code.

## Your job in this session

Follow **Section 16.2 — Recommended Build Order** from the PRD exactly, one step at a time. Do not skip ahead. After each step, tell me what you built, what decisions you made, and what the next step is — then wait for me to say "continue" before moving on.

## Before you write any code, do these three things

1. **Read the entire PRD** (`Showly_PRD.md`) from top to bottom.
2. **Confirm you understand** the most important page in the product: the public artist profile at `showly.vn/@username`. Every architectural decision should optimize for this page loading fast, looking beautiful, and sharing perfectly on TikTok and Instagram.
3. **List any blockers**: tell me if any environment variables or credentials are missing before you start.

## Tech stack (follow this exactly)

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **i18n**: next-intl (Vietnamese default, English toggle)
- **Backend**: Supabase (auth + database + storage)
- **Auth**: Supabase Auth — Google OAuth + Facebook OAuth only. No email/password.
- **Hosting target**: Vercel
- **Fonts**: Be Vietnam Pro (body) + Playfair Display (headings) — both from Google Fonts. Vietnamese diacritic support is non-negotiable.

## Non-negotiable rules — never break these

1. **SSR is mandatory** for all `showly.vn/@username` profile pages. Use Next.js server components + `generateMetadata`. Client-side-only rendering is not acceptable — Google and TikTok/Instagram link previews must work.
2. **Contact info (phone, Zalo) must never appear in raw HTML source.** Only reveal via JavaScript on button click to prevent scraping.
3. **Every image needs two versions**: full size (max 1920px) and thumbnail (400px wide). Store both URLs in the database.
4. **Discovery grid must paginate** — 24 artists per page maximum. Never load all artists at once.
5. **Username uniqueness** must be enforced at both the database level (unique constraint) AND validated in real-time as the user types.
6. **Vietnamese fonts must render correctly** — test with: ắ ệ ươ ổ ỡ ặ ừ before considering any screen done.
7. **Mobile-first always** — design every screen for 375px width first. Desktop is an enhancement.

## Design direction (follow this closely)

The platform must feel like an editorial beauty magazine — premium, aesthetic, image-forward. Artists should feel proud to share their Showly link.

- Primary color: `#C9A96E` (warm gold)
- Background: `#FAFAF8` (soft cream)
- Text: `#1C1C1C` (near-black)
- Accent: `#F2EDE8` (soft blush)
- Specialty badge colors:
  - Nail Art → Rose Gold `#E8C4B8` / text `#7A3F30`
  - Makeup → Mauve `#D4B8D4` / text `#5A3060`
  - Hair → Sage `#B8D4C0` / text `#2D5A3A`
- No heavy borders. Let photos breathe. Rounded corners (8–16px). Clean whitespace.

## Database schema

Implement the exact schema from **Section 8.3 of the PRD** including all indexes. Run it as a migration in Supabase. Do not invent your own schema.

## Environment variables needed

Ask me for these before starting if they are not already set:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
NEXT_PUBLIC_SITE_URL
ADMIN_PASSWORD
```

## Step 1 — start here

Once you have read the PRD and confirmed your environment variables, begin with:

> **Step 1**: Scaffold the Next.js 14+ project with Tailwind CSS, shadcn/ui, next-intl (vi/en), and Google Fonts (Be Vietnam Pro + Playfair Display). Set up the folder structure from Section 16.5 of the PRD. Connect Supabase and run the full database migration from Section 8.3.

Tell me when Step 1 is complete and show me the folder structure before moving on.
