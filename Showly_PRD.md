# Showly — Product Requirements Document

**Behance for Beauty | Vietnam-First Platform**
`v1.0 | June 2026 | Confidential`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Personas](#3-user-personas)
4. [MVP Feature Specification](#4-mvp-feature-specification)
5. [Out of Scope for MVP](#5-out-of-scope-for-mvp)
6. [Information Architecture & URL Structure](#6-information-architecture--url-structure)
7. [Design System & Visual Direction](#7-design-system--visual-direction)
8. [Technical Architecture](#8-technical-architecture)
9. [Bilingual Support](#9-bilingual-support-vietnamese--english)
10. [SEO Strategy](#10-seo--discoverability-strategy)
11. [Go-to-Market Strategy](#11-go-to-market-strategy)
12. [Future Monetization Paths](#12-future-monetization-paths-post-launch)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Phased Roadmap](#14-phased-roadmap)
15. [Open Questions for Founder](#15-open-questions-for-founder)
16. [Instructions for Claude Code](#16-instructions-for-claude-code)

---

## 1. Executive Summary

**Showly** is a Vietnamese-first, web-based portfolio and discovery platform built exclusively for beauty artists — nail artists, makeup artists, and hairstylists.

It gives every beauty professional a stunning, dedicated URL (`showly.vn/@username`) they can attach to their Instagram bio or TikTok profile — replacing the chaos of mixed social feeds with a curated, professional showcase of their best work.

For clients, Showly is the fastest way to find a local beauty artist whose style matches their vision, searchable by specialty, city/district, and rating.

### The Problem

Beauty artists in Vietnam have no professional home for their work. TikTok and Instagram mix lifestyle content with professional portfolios, burying their best work under unrelated posts. There is no Vietnam-built platform dedicated to beauty artistry.

### The Solution

A visually stunning, mobile-responsive web platform where beauty artists own a permanent, organized portfolio at a custom URL — and clients can discover them by specialty, location, and style.

### The Market

Vietnam's beauty industry is growing rapidly. Nail art, makeup, and hair are the three dominant freelance beauty verticals. The target artist is 18–35, smartphone-native, active on TikTok and Instagram, and currently has no professional portfolio home.

### The Name

**Showly** — short, invented, modern. Same brand energy as Linktree. "Check my Showly" is natural to say. `showly.vn/@artist` looks clean in any bio.

---

## 2. Goals & Success Metrics

### 2.1 Product Goals

- Give beauty artists a beautiful, professional portfolio URL they are proud to share
- Make client discovery fast — find the right artist by specialty, location, and rating in under 60 seconds
- Build the largest Vietnamese database of beauty artist portfolios within 12 months of launch
- Establish Showly as the standard link-in-bio destination for Vietnamese beauty professionals

### 2.2 Launch Success Metrics (0–3 months)


| Metric                            | Target                               |
| --------------------------------- | ------------------------------------ |
| Artist sign-ups                   | 500 verified artist profiles         |
| Cities covered                    | Ho Chi Minh City + Hanoi at minimum  |
| Profiles with 5+ portfolio photos | 70% of signed-up artists             |
| Avg. session time (client browse) | > 2 minutes                          |
| Profile link click-through        | Artists report clients citing Showly |


### 2.3 Growth Success Metrics (3–12 months)


| Metric                            | Target                |
| --------------------------------- | --------------------- |
| Total artist profiles             | 5,000+                |
| Monthly active client visitors    | 50,000+               |
| Artist profile completion rate    | > 80%                 |
| Organic (social referral) traffic | > 60% of total visits |
| Return visitor rate               | > 35%                 |


---

## 3. User Personas

### 3.1 Persona A — The Beauty Artist (Primary User)


| Attribute          | Detail                                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name               | Linh Nguyễn                                                                                                                                         |
| Age / Location     | 24 years old, Ho Chi Minh City                                                                                                                      |
| Specialty          | Nail artist — freelance + home studio                                                                                                               |
| Platforms          | TikTok (10k followers), Instagram (3k)                                                                                                              |
| Pain Points        | Her TikTok mixes nail tutorials with vlogs. New clients can't find her best nail sets. She has no professional link to share — just her messy feed. |
| Goals              | Look professional. Show off her best work organized by style. Get new clients without running ads.                                                  |
| Motivation to join | A beautiful custom URL for her TikTok bio that instantly shows her full portfolio. "Check my Showly."                                               |


### 3.2 Persona B — The Client (Secondary User)


| Attribute            | Detail                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Name                 | Trang Phạm                                                                                                                            |
| Age / Location       | 28 years old, Hanoi                                                                                                                   |
| Behavior             | Browses TikTok and Instagram for beauty inspo. Struggling to find a nail artist in her district who does soft-girl style.             |
| Pain Points          | Can't compare multiple artists easily. Scrolling through feeds is time-consuming. Unsure if an artist's style matches what she wants. |
| Goals                | Find a nearby artist whose portfolio she loves, then contact them directly.                                                           |
| How she finds Showly | Clicks a link in a nail artist's TikTok bio.                                                                                          |


---

## 4. MVP Feature Specification

The MVP covers three core modules: **Artist Accounts**, **Artist Portfolios**, and **Client Discovery**. Booking and messaging are out of scope for v1.

---

### 4.1 Authentication

#### 4.1.1 Social Login

- Sign up / Log in via **Google OAuth 2.0**
- Sign up / Log in via **Facebook OAuth**
- No email+password signup required at launch — reduces friction significantly
- On first login, user selects account type: **Artist** or **Client/Visitor**
- Session persistence: stay logged in for 30 days

---

### 4.2 Artist Profile

#### 4.2.1 Onboarding Flow (4 Steps)

After social login as an Artist, the user is guided through a 4-step onboarding:

1. **Choose username** → sets their custom URL: `showly.vn/@username`
2. **Select specialty**: Nail Art / Makeup / Hair (multi-select allowed)
3. **Enter location**: Province/City + District (dropdown)
4. **Upload first 3 portfolio photos** (required to publish profile)

> Profile is set to **Draft** until step 4 is complete. Artists can save progress and return.

#### 4.2.2 Profile Fields


| Field                  | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| Display name           | Artist's name or studio name. Required.                                        |
| Username / URL handle  | `showly.vn/@handle` — unique, lowercase, alphanumeric + underscores. Required. |
| Avatar / profile photo | Single image upload. Required.                                                 |
| Bio                    | Free text, max 300 characters. Optional.                                       |
| Specialty tags         | Nail Art, Makeup, Hair — multi-select. Required.                               |
| City & District        | Dropdown — all Vietnamese provinces + districts. Required.                     |
| Price range            | Optional. Options: Liên hệ / Under 200k / 200k–500k / 500k–1M / 1M+            |
| Instagram URL          | Optional link. Displayed on profile.                                           |
| TikTok URL             | Optional link. Displayed on profile.                                           |
| Contact method         | Phone number or Zalo ID. Optional but recommended.                             |
| Years of experience    | Under 1 year / 1–3 years / 3–5 years / 5+ years. Optional.                     |


#### 4.2.3 Portfolio Gallery

- Artists upload individual photos to their gallery
- Each photo can have: a **Title** (optional), **Description** (optional, max 200 chars), and **Style Tags**
- Gallery displays in a **masonry/Pinterest-style grid** on the artist's public profile
- Artists can **reorder photos** via drag-and-drop
- Max photo size: **10MB** per image. Accepted formats: JPG, PNG, WEBP
- Max photos at launch (free tier): **50 photos**
- Photos stored and served via **CDN** for fast loading on mobile
- Artist can mark any photo as **Cover Photo** — displayed as hero image on their profile and in discovery grid cards

#### 4.2.4 Style Tag Taxonomy

Artists tag each photo with pre-defined style tags. No free-text tags at launch — keeps quality and searchability high.


| Specialty | Available Tags                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Nail Art  | Gel Nails, Ombre/Gradient, Nail Stamping, 3D Nail Art, French Tips, Minimalist, Floral, Y2K, Korean Style, Soft Girl, Dark/Goth, Abstract |
| Makeup    | Natural/No-Makeup, Korean Makeup, Bridal, Glam/Evening, Editorial, Airbrush, SFX/Special Effects, Contouring, Eye-focused                 |
| Hair      | Balayage, Highlights, Keratin/Straightening, Perms, Braids, Updo/Bridal Hair, Korean Hair, Bob Cut, Layers, Color Transformation          |


---

### 4.3 Public Artist Profile Page

The public profile lives at `showly.vn/@username`. This is the **core shareable artifact** — what clients see when they click a link from TikTok or Instagram.

#### Page Layout (top to bottom):

1. **Hero section**: Cover photo, Avatar, Display name, Specialty badges, City/District, Social links
2. **Bio text**
3. **Stats row**: Number of photos, Average rating, Member since
4. **Portfolio grid**: Masonry/Pinterest-style photo grid — click any photo to open fullscreen lightbox
5. **Contact button**: Reveals phone number/Zalo ID on click, or links to Instagram DM
6. **Share button**: Copies `showly.vn/@username` to clipboard
7. **Reviews section**: Star rating summary + individual client reviews

> **UX Principle**: The public profile must load in under 2 seconds on a 4G mobile connection. Images are lazy-loaded. The page must work beautifully on a 375px wide phone screen — this is the primary viewing device for clients clicking from TikTok or Instagram.

---

### 4.4 Client Discovery — Browse & Search

Clients (logged in or not) can access the discovery page at `showly.vn/discover`.

#### 4.4.1 Homepage Featured Feed

- A curated grid of artist profile cards — visually beautiful, image-first layout
- Default sort: recently active artists with complete profiles
- Each card shows: Cover photo, Artist name, Specialty badges, City, Star rating
- Clicking a card goes to the artist's full public profile

#### 4.4.2 Search & Filter


| Filter                 | Behavior                                                            |
| ---------------------- | ------------------------------------------------------------------- |
| Keyword search         | Search by artist name — searches display name and username fields   |
| Specialty filter       | Nail Art / Makeup / Hair — single or multi-select chips             |
| City / Province filter | Dropdown of all Vietnamese provinces                                |
| District filter        | Appears after City is selected — dropdown of districts in that city |
| Sort by                | Newest profiles / Highest rated / Most photos                       |


Search results display in the same card grid format as the homepage. No-results state shows a friendly empty state with a suggestion to broaden filters.

---

### 4.5 Rating & Review System

- Clients can leave a **1–5 star rating** + optional short text review (max 150 chars)
- To leave a review, client must be **logged in** via Google or Facebook
- Each client can leave **only one review** per artist
- Artist's **average rating** displayed on their profile and discovery card
- Artist **cannot delete** reviews, but can flag any review for moderation
- Reviews displayed publicly in the Reviews section of the artist profile

---

### 4.6 Artist Dashboard

Private dashboard accessible only to the logged-in artist at `showly.vn/dashboard`.

- Edit all profile information
- Upload, reorder (drag-and-drop), tag, and delete portfolio photos
- View **profile analytics**: total profile views and total photo views
- Copy their profile URL to clipboard with one click
- Preview their public profile exactly as clients see it
- See all reviews received with dates

---

## 5. Out of Scope for MVP


| Feature                               | Rationale                                                               |
| ------------------------------------- | ----------------------------------------------------------------------- |
| In-app messaging / chat               | Phase 2 — clients contact artists via phone/Zalo/Instagram for now      |
| Booking / appointment system          | Phase 2 — complex scheduling is a separate product area                 |
| Video upload                          | Phase 2 — photos only at launch to control storage costs and complexity |
| Before/After slider                   | Phase 2                                                                 |
| Custom domain names                   | Phase 2 — artists get `showly.vn/@handle` at launch                     |
| Mobile app (iOS/Android)              | Phase 2 — web-first, fully responsive                                   |
| Paid/premium tiers                    | Phase 2 — free at launch to maximize artist adoption                    |
| Brand partnerships / ads              | Phase 3                                                                 |
| AI style matching                     | Phase 3                                                                 |
| Artist courses / content monetization | Phase 3                                                                 |


---

## 6. Information Architecture & URL Structure


| URL                             | Page                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `showly.vn/`                    | Homepage — featured artist grid + hero CTA to join or browse |
| `showly.vn/discover`            | Browse & search all artists with filters                     |
| `showly.vn/@username`           | Public artist profile page (the shareable link)              |
| `showly.vn/join`                | Artist signup / onboarding entry point                       |
| `showly.vn/login`               | Login page (Google / Facebook)                               |
| `showly.vn/dashboard`           | Artist private dashboard (auth required)                     |
| `showly.vn/dashboard/edit`      | Edit profile form                                            |
| `showly.vn/dashboard/portfolio` | Manage portfolio photos                                      |
| `showly.vn/dashboard/analytics` | Profile view stats                                           |
| `showly.vn/admin`               | Internal admin panel — not linked publicly                   |


---

## 7. Design System & Visual Direction

> **Aesthetic Goal**: Showly must feel as premium and aesthetic as the work it hosts. Think: editorial beauty magazine meets clean tech product. Every screen should make an artist proud to share their URL.

### 7.1 Visual Identity


| Element        | Specification                                                                  |
| -------------- | ------------------------------------------------------------------------------ |
| Primary Color  | Warm Gold `#C9A96E` — evokes luxury, beauty, craftsmanship                     |
| Background     | Soft Cream / Off-White `#FAFAF8` — clean without being clinical                |
| Text           | Near-Black `#1C1C1C` — readable and elegant                                    |
| Accent         | Soft Blush `#F2EDE8` — warm, feminine without being limiting                   |
| Font (Heading) | **Playfair Display** — editorial, elegant, full Vietnamese diacritic support   |
| Font (Body)    | **Be Vietnam Pro** — modern, highly legible on mobile, designed for Vietnamese |
| Photo display  | Full-bleed, no heavy borders — let the artwork speak                           |
| Border radius  | Rounded corners `8–16px` — soft and modern                                     |


### 7.2 Specialty Badge Colors

- **Nail Art** → Rose Gold pill `#E8C4B8` / text `#7A3F30`
- **Makeup** → Mauve pill `#D4B8D4` / text `#5A3060`
- **Hair** → Sage pill `#B8D4C0` / text `#2D5A3A`

### 7.3 Responsive Breakpoints


| Breakpoint       | Layout                                                |
| ---------------- | ----------------------------------------------------- |
| Mobile (primary) | 375px–767px — single column grid, large touch targets |
| Tablet           | 768px–1023px — 2-column grid                          |
| Desktop          | 1024px+ — 3 to 4 column masonry grid                  |


### 7.4 Key UI Components

- **Artist Card** — image-dominant card with name, specialty chips, and location. Hover state reveals rating.
- **Photo Lightbox** — fullscreen photo viewer with swipe gesture on mobile. Shows title, tags, and artist credit.
- **Specialty Badge** — colored pill chip per 7.2 above.
- **Onboarding Stepper** — 4-step progress indicator at the top of onboarding screens.
- **Empty State** — illustrated, friendly, Vietnamese-language message when no search results found.
- **Share Button** — copies `showly.vn/@username` to clipboard, shows "Copied!" toast.

---

## 8. Technical Architecture

> These are recommendations. Claude Code should choose the best tool within each category based on current best practices.

### 8.1 Frontend


| Layer                | Technology                                                                    |
| -------------------- | ----------------------------------------------------------------------------- |
| Framework            | **Next.js 14+** (App Router) — SSR for fast public profile loads + strong SEO |
| Styling              | **Tailwind CSS** — rapid development, responsive utilities                    |
| UI Components        | **shadcn/ui** — accessible, customizable component primitives                 |
| Internationalization | **next-intl** — Vietnamese (default) + English toggle                         |
| Image optimization   | Next.js `<Image>` component with CDN delivery                                 |
| Photo upload UX      | **react-dropzone** — drag-and-drop upload with preview                        |
| Masonry grid         | **react-masonry-css** — Pinterest-style photo grid layout                     |
| State management     | **Zustand** — lightweight, no Redux overhead needed                           |


### 8.2 Backend & Infrastructure


| Layer          | Technology                                                                  |
| -------------- | --------------------------------------------------------------------------- |
| Database       | **PostgreSQL via Supabase** — handles auth, storage, and DB in one platform |
| Authentication | **Supabase Auth** with Google and Facebook OAuth providers                  |
| Image storage  | **Supabase Storage** with CDN — resize images for thumbnails vs full-size   |
| API            | **Next.js API Routes** (or Supabase Edge Functions) — keeps stack unified   |
| Hosting        | **Vercel** — zero-config Next.js deployment, global CDN, generous free tier |
| Domain         | **showly.vn** — Vietnamese ccTLD builds local trust and SEO authority       |


### 8.3 Database Schema

```sql
-- Core identity
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  account_type TEXT CHECK (account_type IN ('artist', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Artist public profile
artist_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,           -- showly.vn/@username
  bio TEXT CHECK (char_length(bio) <= 300),
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  price_range TEXT,
  years_experience TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  contact_info TEXT,                       -- phone or Zalo, never exposed in raw HTML
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Artist specialties (one-to-many)
specialties (
  id UUID PRIMARY KEY,
  artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
  specialty TEXT CHECK (specialty IN ('nail', 'makeup', 'hair'))
)

-- Portfolio photos
portfolio_photos (
  id UUID PRIMARY KEY,
  artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,                 -- full size, max 1920px
  thumbnail_url TEXT NOT NULL,             -- 400px for grid cards
  title TEXT,
  description TEXT CHECK (char_length(description) <= 200),
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Style tags on photos
photo_tags (
  id UUID PRIMARY KEY,
  photo_id UUID REFERENCES portfolio_photos(id) ON DELETE CASCADE,
  tag_slug TEXT NOT NULL,
  specialty TEXT NOT NULL
)

-- Client reviews
reviews (
  id UUID PRIMARY KEY,
  artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT CHECK (char_length(review_text) <= 150),
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, reviewer_id)           -- one review per client per artist
)

-- Profile view analytics (privacy-safe)
profile_views (
  id UUID PRIMARY KEY,
  artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
  viewer_ip_hash TEXT NOT NULL,            -- hashed, never store raw IP
  viewed_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Required indexes:**

```sql
CREATE INDEX idx_artist_profiles_username ON artist_profiles(username);
CREATE INDEX idx_artist_profiles_city ON artist_profiles(city);
CREATE INDEX idx_artist_profiles_district ON artist_profiles(district);
CREATE INDEX idx_artist_profiles_published ON artist_profiles(is_published);
CREATE INDEX idx_specialties_artist_id ON specialties(artist_id);
CREATE INDEX idx_portfolio_photos_artist_id ON portfolio_photos(artist_id);
CREATE INDEX idx_portfolio_photos_sort ON portfolio_photos(artist_id, sort_order);
CREATE INDEX idx_reviews_artist_id ON reviews(artist_id);
CREATE INDEX idx_profile_views_artist_id ON profile_views(artist_id);
```

---

## 9. Bilingual Support (Vietnamese + English)

### 9.1 Translation Scope

- All **UI labels, navigation, buttons, error messages, and empty states** must be translated
- **Artist-generated content** (bio, photo descriptions) is NOT translated — artists write in their preferred language
- **Style tag taxonomy** must be translated — all tags appear in both Vietnamese and English
- **SEO meta tags** default to Vietnamese for the `.vn` domain

### 9.2 Language Toggle

- Language toggle in the top navigation bar: `VI | EN`
- Language preference stored in `localStorage` and persists across sessions
- URL structure does not change with language — no `/vi/` or `/en/` path prefixes at launch

### 9.3 Vietnamese Locale Notes

- Default locale: `vi-VN`
- Date format: `DD/MM/YYYY`
- Currency: Vietnamese Đồng (₫), formatted as `200.000₫`
- Phone numbers: Vietnam format `+84 xxx xxx xxx`

---

## 10. SEO & Discoverability Strategy

SEO is a primary growth lever — every artist profile is an individually indexable page. The platform's search footprint grows organically with every new artist who joins.

### 10.1 On-Page SEO Requirements

- Each artist profile has a unique `<title>`: `[Artist Name] — Nail Artist tại [City] | Showly`
- Meta description auto-generated from artist bio and specialty
- **Open Graph tags** on every profile: `og:image` = artist cover photo — makes sharing on Facebook and Zalo look beautiful and click-worthy
- **Structured data** (Schema.org `Person` or `LocalBusiness`) on all artist profile pages
- Artist profile pages **server-side rendered** (Next.js SSR) — Google indexes without JavaScript execution
- `**sitemap.xml`** auto-generated including all published artist profile URLs, updated on new profile publish
- `**robots.txt**` configured to allow all public pages, block `/dashboard` and `/admin`

### 10.2 Target Vietnamese Search Keywords

- `thợ nail [quận/thành phố]` — nail artist by district or city
- `tìm thợ trang điểm gần đây` — find nearby makeup artist
- `thợ làm tóc [phong cách]` — hair stylist by style
- `portfolio nail art đẹp` — beautiful nail art portfolio
- `showly.vn/@[username]` — direct artist profile searches

---

## 11. Go-to-Market Strategy

### 11.1 Pre-Launch — Artist Seeding

The platform is worthless without artists. Seed at least **100 high-quality artist profiles** before public launch.

- Identify 100–200 Vietnamese beauty artists on TikTok and Instagram with engaged followings in the 1k–50k follower range
- DM them personally: *"We built a portfolio platform for artists like you. Free forever. Here's your custom link: showly.vn/@yourname"*
- Offer a **Founding Artist badge** for the first 200 who join — permanent recognition on their profile
- Focus on **Ho Chi Minh City first**, then Hanoi. Two cities only at launch.

### 11.2 Launch Channels

- TikTok/Instagram campaign: *"Your work deserves its own home. Not a feed — a Showly."*
- Partner with 5–10 beauty KOLs to post about their Showly profile and link in bio
- Target beauty student communities at vocational schools (*trường dạy nghề làm đẹp*)
- Submit to Vietnamese startup communities: YBA, Startup Vietnam, relevant Facebook groups

### 11.3 Core Growth Loop

```
Artist joins Showly
       ↓
Shares showly.vn/@theirname on TikTok / Instagram bio
       ↓
Client clicks link → views artist's portfolio
       ↓
Client discovers other artists on Showly
       ↓
More clients = more value for artists
       ↓
More artists join → platform grows with every link shared
```

---

## 12. Future Monetization Paths (Post-Launch)

The platform launches **free**. Artist adoption comes first, revenue second.


| Option                              | Description                                                                                                                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Freemium — Pro Artist Plan** ⭐ | Free tier: 50 photos, basic analytics. Pro (~99k–199k VND/month): unlimited photos, advanced analytics (views by source, peak days), priority in search results, Pro badge, custom profile accent color. |
| **2. Verified Artist Badge**        | One-time or annual fee (~199k VND) for a blue checkmark — signals trust and quality to clients. Simple, low-friction first revenue.                                                                      |
| **3. Featured Placement**           | Artists pay to be featured on the homepage or top of search for their city. Pay-per-week model (~50k–200k VND/week). Very approachable for freelancers.                                                  |
| **4. Booking Commission (Phase 2)** | Once booking is added, take a small commission (5–10%) per confirmed booking. High potential but requires booking infrastructure first.                                                                  |
| **5. Beauty Brand Partnerships**    | Brands (nail polish, hair products) pay to run campaigns: "Create a look using [Brand X]" — artist submissions, brand gets exposure. Win-win for artists and brands.                                     |


> **Recommendation**: Start with **Freemium (Pro Plan)** as the first monetization move. It directly rewards the most active artists, and the value proposition — more photos, analytics, visibility — is easy to understand and justify for a freelance artist earning 5–20M VND/month.

---

## 13. Non-Functional Requirements


| Requirement   | Specification                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Performance   | Public profile pages load in < 2s on 4G mobile. Lighthouse mobile score > 80. Images lazy-load. CDN required.                          |
| Scalability   | Architecture supports 100k+ artist profiles without re-platforming. Database indexes and pagination from day one.                      |
| Security      | All API routes authenticated where required. Image uploads virus-scanned. Phone numbers/Zalo IDs never exposed in raw HTML source.     |
| Privacy       | Profile view analytics use hashed IPs — never store raw user identifiers. Compliant with Vietnamese data protection guidelines (PDPD). |
| Accessibility | WCAG 2.1 AA minimum. All images have alt text. Keyboard navigable.                                                                     |
| Uptime        | 99.5% uptime target. Vercel + Supabase both have strong SLAs on free/starter tiers.                                                    |
| Mobile-first  | All flows designed for 375px viewport first. Desktop is an enhancement, not the primary experience.                                    |


---

## 14. Phased Roadmap

### Phase 1 — MVP (Build Now)

- Artist sign-up with Google / Facebook OAuth
- Artist profile with custom URL (`showly.vn/@username`)
- 4-step artist onboarding flow
- Portfolio photo upload (up to 50 photos, with style tags)
- Drag-and-drop photo reorder
- Client discovery page with search + filters (specialty, city, district)
- Artist dashboard: edit profile, manage photos, view analytics
- Star rating + short review system
- Bilingual UI (Vietnamese default + English toggle)
- SEO-optimized public profile pages (SSR + OG tags + Schema.org)
- Sitemap.xml + robots.txt
- Fully mobile-responsive design
- Share button (copy profile URL to clipboard)
- Admin panel for content moderation (password-protected, not public)

### Phase 2 — Growth Features (3–6 months post-launch)

- Video upload support (short clips, max 60 seconds)
- Before/After photo slider on portfolio items
- In-app contact form / inquiry system
- Appointment booking integration
- Pro Artist subscription plan (first monetization)
- Browser push notifications for new reviews
- Artist collections — group photos into named albums (e.g., "Bridal Season 2026")

### Phase 3 — Scale (6–12 months post-launch)

- Mobile app (iOS + Android)
- AI style matching: "Find artists whose work looks like this photo"
- Beauty brand partnership campaigns
- Beauty school / academy institutional profiles
- Southeast Asia expansion — Thai, Indonesian localization

---

## 15. Open Questions for Founder


| Question                  | Context                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**                | Register `showly.vn` immediately. Also grab `showly.com` if available — important for future global expansion.                                    |
| **Content moderation**    | Who reviews flagged photos/reviews at launch? Define the moderation policy before going live. Manual review is fine early on.                     |
| **Artist verification**   | How to ensure real professionals, not fake profiles? Options: require social profile link, or manual approval for the first 200 founding artists. |
| **Contact info privacy**  | Should phone/Zalo be visible to anyone, or only to logged-in clients? Logged-in-only adds friction but reduces spam to artists.                   |
| **Geographic scope**      | Confirm: HCMC + Hanoi only at launch, or also include Da Nang from day one?                                                                       |
| **Founding Artist perks** | Define exactly what the Founding Artist badge gives permanently — does it include any future paid-tier benefits for free?                         |


---

## 16. Instructions for Claude Code

> **Read this section carefully before starting the build. Read all sections above first.**

### 16.1 What You're Building

A full-stack web application called **Showly** — a portfolio platform for Vietnamese beauty artists. Think Linktree meets Behance, built for nail artists, makeup artists, and hairstylists in Vietnam.

The most important page in the entire product is the **public artist profile** at `showly.vn/@username`. Every architectural and design decision should optimize for that page loading fast, looking stunning, and sharing beautifully on TikTok and Instagram.

### 16.2 Recommended Build Order

1. Set up **Next.js 14+** project with Tailwind CSS, shadcn/ui, and next-intl (Vietnamese default / English toggle)
2. Connect **Supabase**: implement the full database schema from Section 8.3, enable Google + Facebook OAuth
3. Build **authentication flow**: social login → account type selection → redirect to onboarding or dashboard
4. Build **4-step artist onboarding**: username → specialty → location → first photo upload
5. Build **artist dashboard**: profile editor + photo uploader with drag-and-drop reorder + view count analytics
6. Build **public artist profile page**: SSR, mobile-first layout, Open Graph meta tags, lightbox photo viewer
7. Build **discovery page**: masonry grid + search bar + filter chips (specialty, city, district) + sort options
8. Build **review and rating system**: star rating widget + review text submission + display on artist profile
9. Add **SEO layer**: sitemap.xml generation, robots.txt, Schema.org structured data on profile pages
10. Build **admin panel** at `/admin` (env-variable password protected, not linked publicly) for moderating flagged reviews
11. **Polish pass**: loading skeletons, empty states, error handling, 404 page, share button (copy URL + toast)
12. **Performance audit**: Lighthouse mobile score > 80, all images lazy-loaded, CDN delivery confirmed

### 16.3 Critical Implementation Notes

**Username validation**

- Enforce uniqueness at the database level (unique constraint on `artist_profiles.username`)
- Validate in real-time as the user types in onboarding — show green checkmark when available, red X when taken
- Rules: lowercase only, alphanumeric + underscores, 3–30 characters, no spaces

**SSR is mandatory for artist profile pages**

- Use Next.js dynamic SSR (`generateMetadata` + server components) for `showly.vn/@username` pages
- Client-side fetch only is NOT acceptable — Google must be able to index these pages without executing JavaScript
- Pre-render Open Graph tags server-side so TikTok/Instagram/Zalo link previews show the artist's cover photo

**Image pipeline**

- On upload: resize to max 1920px on longest side server-side before storing in Supabase Storage
- Generate a 400px wide thumbnail for grid cards — store both `image_url` and `thumbnail_url` in `portfolio_photos`
- Serve all images through Supabase CDN, use Next.js `<Image>` with `sizes` prop for responsive loading

**Discovery grid pagination**

- Load **24 artists per page** — never load all artists at once
- Implement infinite scroll or a "Tải thêm" (Load more) button
- Filter and sort changes reset to page 1

**Vietnamese font support**

- Use **Be Vietnam Pro** for body text — specifically designed for Vietnamese, available on Google Fonts
- Use **Playfair Display** for headings — verify it renders Vietnamese diacritics correctly
- Test with actual Vietnamese text containing: ắ ệ ươ ổ ỡ ặ ừ before launching

**Contact info protection**

- Phone numbers and Zalo IDs stored in DB must **NEVER** be rendered in raw HTML source
- Only reveal via a "Xem liên hệ" button click that injects the value via JavaScript
- This prevents scraper bots from harvesting contact info from the platform

**Cover photo logic**

- Only one photo per artist can be `is_cover = TRUE` at a time
- When artist marks a new cover photo, update the previous cover to `is_cover = FALSE` in the same transaction
- Cover photo = the photo shown on discovery grid cards

### 16.4 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# App
NEXT_PUBLIC_SITE_URL=https://showly.vn
ADMIN_PASSWORD=                           # for /admin route basic auth
```

### 16.5 Folder Structure (Recommended)

```
showly/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                      # Homepage — featured artists
│   │   ├── discover/page.tsx             # Browse & search
│   │   ├── join/page.tsx                 # Artist onboarding entry
│   │   ├── login/page.tsx                # Auth page
│   │   ├── dashboard/
│   │   │   ├── page.tsx                  # Dashboard home
│   │   │   ├── edit/page.tsx             # Edit profile
│   │   │   ├── portfolio/page.tsx        # Manage photos
│   │   │   └── analytics/page.tsx        # View stats
│   │   ├── admin/page.tsx                # Moderation panel
│   │   └── @[username]/page.tsx          # Public artist profile ⭐
├── components/
│   ├── artist-card.tsx                   # Discovery grid card
│   ├── photo-lightbox.tsx                # Fullscreen photo viewer
│   ├── specialty-badge.tsx               # Colored pill chip
│   ├── masonry-grid.tsx                  # Pinterest-style layout
│   ├── onboarding-stepper.tsx            # 4-step progress bar
│   ├── photo-uploader.tsx                # Drag-and-drop upload
│   └── star-rating.tsx                   # Rating input + display
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── schema.sql                    # Full schema from Section 8.3
│   ├── image-utils.ts                    # Resize + thumbnail generation
│   └── seo-utils.ts                      # generateMetadata helpers
├── messages/
│   ├── vi.json                           # Vietnamese strings
│   └── en.json                           # English strings
└── public/
    ├── robots.txt
    └── sitemap.xml                       # Auto-generated, see next-sitemap
```

---

*Showly — Product Requirements Document | v1.0 | June 2026 | Confidential*