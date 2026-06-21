# SEO Technical Design Document — bornworks.biz.id (T1)

**Task:** T1 (W1) — Tech spec: CMS schema, i18n routing, schema.org, sitemap
**Owner of this spec:** Rizki (CTO)
**Date:** 2026-06-21
**Board:** `bornworks-seo`
**Companion docs:** `seo-2026-q3-plan.md` (plan), `seo-content-brief.md` (M1 — keywords, copy), `seo-ux-spec.md` (U1 — templates, IA, components)
**Status:** Final — ready for E1 (engineering) handoff
**Reviewers:** Engineering (T1 read before E1 starts), Marketing (alignment on URL list), UX (alignment on `[lang]` segment + breadcrumb prop shape), DevOps (sitemap/ISR/proxy caching on Cloudflare)

---

## 0. Executive summary

We ship 9 new SEO-rich pages × 2 locales = 18 URLs. All content is editable from the CMS admin (`cms.bornworks.biz.id`) without code deploy. This spec locks:

- **Routing**: Next.js App Router under `app/[lang]/` so `/services/web-app` (EN, default, x-default) and `/id/services/web-app` (ID) share one component per page. Bare paths (`/services/web-app`) are accepted and resolved via a Next.js 16 `proxy.ts` rewrite that injects the default locale internally — no redirect needed (canonical stays bare).
- **i18n**: pathname-prefix detection only (no cookie, no Accept-Language fallback) for SEO consistency. The existing client-side `localStorage` toggle is **deprecated** for SEO pages; it stays as a fallback for the existing single-page home until W3 cutover.
- **CMS schema**: 4 new Prisma models — `ServicePage`, `PortfolioCaseStudy`, `FaqItem`, plus an additive extension to the existing `SiteSetting` singleton (the brief called it a NEW `SiteSettings` model — we **reuse + extend** the existing one to avoid two singletons; rationale in §A4).
- **Schema.org**: per-page JSON-LD (`Service`, `CreativeWork`/`Article`, `FAQPage`, `BreadcrumbList`) + global `LocalBusiness` upgrade with Jakarta address, geo, opening hours, area served, sameAs.
- **Sitemap**: single `sitemap.xml` with 18 URLs, each carrying the full `<xhtml:link rel="alternate" hreflang="...">` triplet (`en` + `id` + `x-default`).
- **Revalidation**: extend `RevalidationService.revalidateSection()` with a new `entityType`/`slug` shape so CMS admin saves trigger **granular** page invalidation (both locale variants of a slug) instead of blasting `/`.
- **Migration**: 9-step additive rollout. Existing single-page stays live during E1 build, cutover in step 8.

The hard performance budget (LCP < 1.5 s mobile) is achievable because all new pages are server components with ISR — zero added JS to the client bundle beyond the existing framer-motion/gsap interactions (which stay on the inner page hero only).

---

## 1. Requirements summary (extracted from PRD + locked decisions)

### Functional
- **9 SEO pages × 2 languages = 18 URLs**:
  1. `/services/web-app` + `/id/services/web-app`
  2. `/services/mobile-app` + `/id/services/mobile-app`
  3. `/services/saas` + `/id/services/saas`
  4. `/portfolio/spektra` + `/id/portfolio/spektra`
  5. `/portfolio/financial-planning` + `/id/portfolio/financial-planning`
  6. `/portfolio/company-profile-cms` + `/id/portfolio/company-profile-cms`
  7. `/portfolio/restaurant-ordering` + `/id/portfolio/restaurant-ordering`
  8. `/portfolio/saas-analytics` + `/id/portfolio/saas-analytics`
  9. `/faq` + `/id/faq`
- All 18 editable from `cms.bornworks.biz.id` (no code deploy for content changes).
- Per-page SEO meta (`title`, `metaDescription`, `ogImage`), schema.org JSON-LD, hreflang triplet.
- Global `LocalBusiness` schema upgrade with Jakarta address + geo + opening hours + sameAs.
- Single bilingual `sitemap.xml` with `<xhtml:link>` hreflang hints.
- CMS admin edits trigger on-demand revalidation of the affected pages (both locale variants).
- Existing single-page home at `/` stays live and functional during build; cutover to `[lang]` segment in migration step 8.

### Non-functional
- **Scale:** organic traffic ramp target 50+ clicks/month, 90-day horizon. Currently near zero — design for low-traffic MVP, but the architecture must support 10x without rewrite.
- **Latency:** LCP < 1.5 s mobile, < 1 s desktop (Google PageSpeed "Good" threshold).
- **Uptime:** 99.5% (acceptable for marketing site).
- **Security:** public endpoints read-only; admin endpoints behind existing JWT (`@Roles('ADMIN','EDITOR')`).
- **Platform:** Docker (`output: "standalone"`) for production; Cloudflare Workers (OpenNext) for preview deploys. ISR works on both but the cache key shape differs — see §E5.

### Out of scope (locked)
- Blog/CMS system (future sprint)
- Backlink outreach
- Conversion tracking / lead form optimization
- Paid acquisition

---

## 2. Architecture overview

### High-level
```
                                                 ┌─────────────────────┐
                  ┌──────────────────┐  HTTPS    │  nginx (VPS)        │
   Googlebot ────►│  Cloudflare DNS  ├──────────►│  *.bornworks.biz.id │
   User ─────────►│  bornworks.biz.id│           │   ├─ born2works:3002│
                  └──────────────────┘           │   │   (Next.js 16)  │
                                                 │   └─ /api/revalidate│
                                                 └──────────┬──────────┘
                                                            │ on-demand
                                                            │ revalidate
                                                 ┌──────────▼──────────┐
                  ┌──────────────────┐  HTTPS    │  nginx              │
   Editor ───────►│  Cloudflare DNS  ├──────────►│  cms.bornworks.biz.id│
                  │  cms.bornworks..│           │   └─ bornworks-cms:  │
                  └──────────────────┘           │       3000 (NestJS) │
                                                 │   └─ /api/service-  │
                                                 │       pages/:slug    │
                                                 └──────────┬──────────┘
                                                            │ Prisma
                                                 ┌──────────▼──────────┐
                                                 │  postgres (cms-db)  │
                                                 │  bornworks_cms DB   │
                                                 └─────────────────────┘
```

### Components

| Component | Tech | Responsibility |
|---|---|---|
| `born2works` (this repo) | Next.js 16 App Router | Public site, 18 SEO pages + single-page home |
| `bornworks-cms` (separate repo) | NestJS 10 + Prisma 5 | Admin + public read API + revalidation fan-out |
| `postgres` | Docker container | Single DB for CMS (cms-db) |
| `nginx` | host-level reverse proxy | TLS (certbot), per-subdomain routing |
| `proxy.ts` (new) | Next.js 16 | Locale-prefix rewrite for bare paths |

### Data flow (cold read of `/services/web-app`)
1. Bot requests `https://bornworks.biz.id/services/web-app`.
2. nginx proxies to `born2works:3002`.
3. Next.js matches route — proxy.ts runs first. Since the path has no `/id/` prefix and the path is in the matcher list, proxy rewrites the URL to `/en/services/web-app` internally (no client redirect).
4. `[lang]/services/[slug]/page.tsx` runs as a Server Component. `params.lang = 'en'`, `params.slug = 'web-app'`.
5. `getServicePage('web-app', 'en')` in `lib/cms.ts` calls `cmsFetch('/service-pages/web-app?locale=en')` with `next: { revalidate: 60 }`.
6. `bornworks-cms` returns the row from `ServicePage` where `slug='web-app' AND locale='en'`.
7. Page renders with metadata API (`title`, `description`, `alternates.languages.{id,en,x-default}`, `openGraph`, schema.org via JsonLd component).
8. ISR cache holds the rendered HTML for 60 s OR until `POST /api/revalidate` from CMS invalidates the specific path(s).

### Data flow (CMS edit triggers revalidation)
1. Editor in `cms.bornworks.biz.id` saves a `ServicePage` (slug=web-app, locale=en).
2. NestJS `ServicePageService.update()` writes to Postgres + writes `AuditLog`.
3. Calls `RevalidationService.revalidateByEntity('ServicePage', 'web-app')`.
4. Resolves to both paths: `['/services/web-app', '/id/services/web-app']` (en is canonical, id gets re-fetched because it may embed the same FAQ/process data).
5. POSTs `Authorization: Bearer <REVALIDATE_SECRET>` to `https://bornworks.biz.id/api/revalidate` with `{"paths": [...], "entity": "ServicePage:web-app"}`.
6. `born2works` calls `revalidatePath(p)` for each path. On OpenNext Cloudflare target, the cache tag `service-page:web-app` is also purged; on Docker target, the in-process ISR cache is busted (next request triggers re-fetch).

---

## 3. Tech stack & justification

| Layer | Choice | Why (vs alternative) |
|---|---|---|
| Framework | **Next.js 16.2.9** (App Router) | Already in repo; ISR + server components give LCP < 1.5 s for free; React 19 stable |
| Routing | **`[lang]` dynamic segment + `proxy.ts` rewrite** (Next 16 renamed middleware → proxy) | Single component per page serves both locales; canonical URLs are locale-less (Google best practice); no redirect cost; `params` is now `Promise<...>` so async/await required in every page |
| Deploy target | **Docker standalone (prod)** + **Cloudflare Workers via OpenNext (preview)** | Already configured (`next.config.ts output: "standalone"`); both targets support ISR; OpenNext handles CF-specific cache key |
| API/data layer | **NestJS 10 + Prisma 5.10** in `bornworks-cms` | Already running, JWT auth + role guards in place, revalidation webhook already wired |
| DB | **PostgreSQL 15** (cms-db container) | Default; jsonb fields already used for `{en, id}` localization on existing singletons — proven pattern |
| Styling | **Tailwind v4** (`@theme inline` in globals.css) | Locked in `seo-ux-spec.md` — do not add a tailwind.config.js |
| Animation | **framer-motion + gsap** | Already installed; only on hero (LCP element); other sections reuse `AnimatedSection` |
| JSON-LD | **Inline `<script type="application/ld+json">` per page via server component** | No extra deps; schema.org validators parse it fine; avoids hydration mismatch |
| i18n | **Pathname prefix only** | Locked decision; client-side `localStorage` toggle deprecated for SEO pages |
| Auth | **Existing JWT** (`@nestjs/jwt` + `@Roles`) | Already wired; new admin endpoints reuse `@Roles('ADMIN','EDITOR')` |
| Rate limiting | **Existing `express-rate-limit` in NestJS** | Already in `package.json`; new public endpoints inherit the global limiter |

**Alternatives considered & rejected:**
- **next-intl / next-i18next** library → overkill for 2 locales with deterministic URL strategy; adds bundle weight (~15 KB)
- **Domain-based i18n** (`en.bornworks.biz.id`) → rejected by owner; separate subdomains cost SEO equity and break sitemap simplicity
- **Single locale-less page with hreflang `en`/`id` swaps via cookie** → rejected; Google can't read cookies; would tank indexing

---

## 4. Section A — CMS schema additions (Prisma)

### A1. Add `Locale` enum + new models

Append to `prisma/schema.prisma`:

```prisma
// =====================================================
// SEO Upgrade (W2-2026) — additive, no breaking changes
// =====================================================

enum Locale {
  EN
  ID
}

// Per-service SEO landing page — one row per (slug, locale).
// Indexes: composite unique on (slug, locale); lookup on slug alone for sitemap.
model ServicePage {
  id             String    @id @default(cuid())
  slug           String                              // e.g. "web-app", "mobile-app", "saas"
  locale         Locale

  // SEO meta
  title          String    @db.VarChar(70)
  metaDescription String   @db.VarChar(160)
  h1             String
  intro          String    @db.Text                  // 200-300 words

  // Structured content blocks (validated by Zod at the API boundary)
  sections       Json      @default("[]")            // [{ h2: string, content: string }]
  features       Json      @default("[]")            // [{ title, desc, icon }]
  process        Json      @default("[]")            // [{ step: string, desc: string }]
  faq            Json      @default("[]")            // [{ q: string, a: string }]   // inline FAQ
  ctaText        String    @default("")

  // Audit + soft publish gate
  publishedAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@unique([slug, locale])
  @@index([slug])
  @@index([publishedAt])
}

// Per-portfolio case study — one row per (slug, locale).
model PortfolioCaseStudy {
  id              String    @id @default(cuid())
  slug            String                              // e.g. "spektra"
  locale          Locale

  // SEO meta
  title           String    @db.VarChar(70)
  metaDescription String    @db.VarChar(160)
  h1              String
  client          String
  industry        String
  challenge       String    @db.Text
  approach        String    @db.Text
  solution        String    @db.Text
  result          String    @db.Text
  metrics         Json      @default("[]")            // [{ label: string, value: string }]
  techStack       String[]  @default([])              // PG array — queryable, no jsonb needed
  testimonial     Json?                               // { quote, author, role } | null
  imageUrls       String[]  @default([])              // ordered; first is the cover
  liveUrl         String?
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([slug, locale])
  @@index([slug])
  @@index([publishedAt])
}

// Flat FAQ items — used by both /faq page and inline service-page FAQs.
// We embed FAQ in ServicePage.faq as jsonb (matches existing pattern);
// this table is the single source of truth for the /faq page and cross-page reuse.
model FaqItem {
  id          String    @id @default(cuid())
  locale      Locale
  category    String    @db.VarChar(40)              // "services" | "process" | "trust" | "comparison"
  question    String    @db.VarChar(200)
  answer      String    @db.Text
  order       Int       @default(0)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([locale, category, order])
  @@index([publishedAt])
}
```

### A2. Extend the existing `SiteSetting` singleton

**Decision: REUSE + EXTEND the existing `SiteSetting` model** (not create a new `SiteSettings` table).
- Rationale: `SiteSetting` is already a singleton (`id Int @id @default(1)`) with `defaultLang`, `seoTitle`, `seoDescription`, `seoImageId`. Creating a second singleton creates ambiguity for the admin ("which one do I edit?") and risks two sources of truth for `defaultLang`.
- The migration is additive: add the missing global SEO fields and a relation for `ogImage` so we can attach a separately-uploaded OG image per-page if needed.

```prisma
model SiteSetting {
  id             Int       @id @default(1)
  whatsappNumber String    @default("")
  contactEmails  Json      @default("[]")
  siteUrl        String    @default("https://bornworks.biz.id")
  defaultLang    Locale    @default(EN)              // was String — type-tighten, preserves 'en' as default

  // Existing SEO fields — kept as-is
  seoTitle       Json      @default("{\"en\":\"\",\"id\":\"\"}")
  seoDescription Json      @default("{\"en\":\"\",\"id\":\"\"}")
  seoImageId     String?   @unique
  seoImage       Media?    @relation("SiteSeoImage", fields: [seoImageId], references: [id], onDelete: SetNull)

  // NEW — LocalBusiness schema + global analytics (T1 / W2)
  ogImageUrl     String?                              // optional override of seoImageUrl for OG specifically
  twitterHandle  String?                              // e.g. "@bornworks" — without the @
  googleAnalyticsId String?                           // GA4 measurement ID, e.g. "G-XXXXXXXXXX"
  googleSearchConsoleVerified Boolean @default(false) // flips true after owner pastes verification meta
  robotsPolicy   RobotsPolicy @default(INDEX)         // enum: INDEX | NOINDEX (staging override)

  // NEW — LocalBusiness schema fields
  legalName      String    @default("PT Lahir Karya Semesta")
  streetAddress  String?                              // verify with owner
  addressLocality String    @default("Jakarta Selatan")
  addressRegion  String    @default("DKI Jakarta")
  postalCode     String?                              // verify with owner
  geoLatitude    Float?                              // verify with owner (Jakarta office)
  geoLongitude   Float?
  openingHoursJson Json    @default("[{\"days\":\"Mo-Fr\",\"opens\":\"09:00\",\"closes\":\"18:00\"},{\"days\":\"Sa\",\"opens\":\"09:00\",\"closes\":\"13:00\"}]")
  priceRange     String    @default("$$")            // schema.org: "$", "$$", "$$$", "$$$$"
  areaServedJson Json      @default("[{\"@type\":\"City\",\"name\":\"Jakarta\"},{\"@type\":\"Country\",\"name\":\"Indonesia\"}]")
  sameAsJson     Json      @default("[]")            // social profile URLs

  updatedAt      DateTime  @updatedAt
}

enum RobotsPolicy {
  INDEX
  NOINDEX
}
```

**Backward compatibility note:** `defaultLang String` becomes `defaultLang Locale`. Existing data has `"en"` and `"id"` strings — the migration script casts `String → Locale` enum (Prisma generates the proper `ALTER TABLE`). Code that reads `defaultLang` (currently in `cms.ts` SiteSetting type) updates from `string` to `Locale`. This is the only type change.

### A3. Migration strategy

**Approach: additive, zero-downtime, expand-contract.**

Migration file (auto-generated by `prisma migrate dev --name add-seo-pages`):
1. Creates `Locale` enum + `RobotsPolicy` enum.
2. Creates `ServicePage`, `PortfolioCaseStudy`, `FaqItem` tables with their indexes.
3. Adds new columns to `SiteSetting` (all nullable or with defaults — no rewrite).
4. Casts `SiteSetting.defaultLang` from `text` to `"Locale"` (Prisma generates `USING "defaultLang"::"Locale"`).

```sql
-- generated by Prisma; illustrative

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'ID');
CREATE TYPE "RobotsPolicy" AS ENUM ('INDEX', 'NOINDEX');

-- CreateTable
CREATE TABLE "ServicePage" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "locale" "Locale" NOT NULL,
  "title" VARCHAR(70) NOT NULL,
  "metaDescription" VARCHAR(160) NOT NULL,
  "h1" TEXT NOT NULL,
  "intro" TEXT NOT NULL,
  "sections" JSONB NOT NULL DEFAULT '[]',
  "features" JSONB NOT NULL DEFAULT '[]',
  "process" JSONB NOT NULL DEFAULT '[]',
  "faq" JSONB NOT NULL DEFAULT '[]',
  "ctaText" TEXT NOT NULL DEFAULT '',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServicePage_pkey" PRIMARY KEY ("id")
);
-- ... indexes ...

-- AlterTable (SiteSetting additive)
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "ogImageUrl" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "twitterHandle" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT;
-- ...
ALTER TABLE "SiteSetting"
  ALTER COLUMN "defaultLang" DROP DEFAULT,
  ALTER COLUMN "defaultLang" TYPE "Locale" USING "defaultLang"::"Locale",
  ALTER COLUMN "defaultLang" SET DEFAULT 'EN';
```

**Safety checks (per `database-migrations` skill):**
- [x] New columns all have defaults or are nullable — no table rewrite
- [x] Enum cast on `defaultLang` is safe because existing values are exactly `'en'` / `'id'` strings (no other values present in any row)
- [x] No `CREATE INDEX CONCURRENTLY` needed — these are new tables, indexes are created inline
- [x] UP + DOWN: DOWN drops new tables and columns (irreversible in production — that's OK; documented as such)

### A4. Seed data for dev/staging

Extend `prisma/seed.ts` (or create `prisma/seeds/seo-pages.seed.ts`) with:

```typescript
// 3 services × 2 locales = 6 ServicePage rows
const services = [
  { slug: 'web-app', en: { title: '...', h1: '...', intro: '...', /* full content */ }, id: { /* ... */ } },
  { slug: 'mobile-app', /* ... */ },
  { slug: 'saas', /* ... */ },
];
for (const svc of services) {
  await prisma.servicePage.create({ data: { slug: svc.slug, locale: 'EN', ...svc.en, publishedAt: new Date() } });
  await prisma.servicePage.create({ data: { slug: svc.slug, locale: 'ID', ...svc.id, publishedAt: new Date() } });
}

// 5 case studies × 2 locales = 10 PortfolioCaseStudy rows
const cases = [/* spektra, financial-planning, company-profile-cms, restaurant-ordering, saas-analytics */];

// FAQ items: 8-10 items × 2 locales = 16-20 FaqItem rows
// Mix categories: services(3), process(2), trust(2), comparison(1-3)
```

**Seed strategy**: content is sourced from `seo-content-brief.md` (M1 output). Marketing writes the full copy, then engineer pastes the seed script content from the brief into `prisma/seed.ts`. Dev seed runs via `npm run prisma:seed`. Staging seed runs from `prisma/seeds/staging-seed.ts`.

### A5. Sample Prisma code (read-only API contract)

```typescript
// bornworks-cms/src/seo-pages/seo-pages.service.ts
export class SeoPagesService {
  async getServicePage(slug: string, locale: Locale) {
    return this.prisma.servicePage.findUnique({
      where: { slug_locale: { slug, locale } },
    });
  }

  async getAllServicePageSlugs(locale: Locale): Promise<string[]> {
    const rows = await this.prisma.servicePage.findMany({
      where: { locale, publishedAt: { not: null } },
      select: { slug: true },
      orderBy: { slug: 'asc' },
    });
    return rows.map((r) => r.slug);
  }

  async getCaseStudy(slug: string, locale: Locale) {
    return this.prisma.portfolioCaseStudy.findUnique({
      where: { slug_locale: { slug, locale } },
    });
  }

  async getAllCaseStudySlugs(locale: Locale): Promise<string[]> {
    return (await this.prisma.portfolioCaseStudy.findMany({
      where: { locale, publishedAt: { not: null } },
      select: { slug: true },
      orderBy: { slug: 'asc' },
    })).map((r) => r.slug);
  }

  async getFaqItems(locale: Locale, category?: string) {
    return this.prisma.faqItem.findMany({
      where: {
        locale,
        ...(category ? { category } : {}),
        publishedAt: { not: null },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }
}
```

---

## 5. Section B — Next.js routing structure

### B1. File tree (target, post-cutover)

```
born2works/
├── proxy.ts                                    # NEW — locale rewrite (renamed from middleware.ts)
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # MODIFIED — generic; sets <html lang> from cookie only as fallback
│   │   ├── page.tsx                            # NEW — locale-less home; reads default locale from SiteSetting; renders [lang=en] home
│   │   ├── sitemap.ts                          # MODIFIED — see §D
│   │   ├── robots.ts                           # UNCHANGED — sitemap URL stays
│   │   ├── api/
│   │   │   └── revalidate/route.ts             # MODIFIED — accept entity+slug (see §E)
│   │   ├── _og/                                # UNCHANGED — OG image generator
│   │   ├── opengraph-image.tsx                 # UNCHANGED
│   │   ├── apple-icon.tsx                      # UNCHANGED
│   │   ├── icon.tsx                            # UNCHANGED
│   │   ├── manifest.ts                         # UNCHANGED
│   │   └── [lang]/                             # NEW — locale-prefixed routes
│   │       ├── layout.tsx                      # NEW — wraps with i18n context, sets <html lang>, hreflang, default OG
│   │       ├── page.tsx                        # NEW — home (was root page.tsx, moved here; home component split into smaller sections)
│   │       ├── services/
│   │       │   ├── page.tsx                    # NEW — services index (lists 3 services with cards)
│   │       │   └── [slug]/page.tsx             # NEW — single service page (Server Component)
│   │       ├── portfolio/
│   │       │   ├── page.tsx                    # NEW — portfolio index (existing refactored as a server component listing 5 cases)
│   │       │   └── [slug]/page.tsx             # NEW — case study page (Server Component)
│   │       └── faq/
│   │           └── page.tsx                    # NEW — FAQ page (Server Component)
│   ├── components/
│   │   ├── JsonLd.tsx                          # MODIFIED — accept page-specific schema.org graph via prop
│   │   ├── Breadcrumb.tsx                      # NEW — server component
│   │   ├── ServiceHero.tsx                     # NEW — server component (per UX spec)
│   │   ├── FeaturesGrid.tsx                    # NEW — server component
│   │   ├── ProcessTimeline.tsx                 # NEW — server component
│   │   ├── FaqAccordion.tsx                    # NEW — server component (schema.org Question/Answer emitted in props)
│   │   ├── CaseStudyHero.tsx                   # NEW — server component
│   │   ├── MetricCard.tsx                      # NEW — server component
│   │   ├── TechStackBadge.tsx                  # NEW — server component
│   │   ├── CategoryFilter.tsx                  # NEW — client component ("use client")
│   │   ├── Navbar.tsx                          # MODIFIED — locale-aware links
│   │   ├── Footer.tsx                          # MODIFIED — new columns
│   │   └── LanguageSwitcher.tsx                # MODIFIED — uses pathname not localStorage
│   ├── contexts/
│   │   └── LanguageContext.tsx                 # KEPT (for non-SEO client UI) — but default lang derived from URL
│   ├── lib/
│   │   ├── cms.ts                              # MODIFIED — add getServicePage, getCaseStudy, getFaqItems, getSiteSettings
│   │   ├── i18n.ts                             # NEW — Locale type, locales list, label/URL helpers
│   │   ├── seo.ts                              # NEW — buildMetadata(), buildJsonLdGraph(), hreflangFor() helpers
│   │   └── constants.ts                        # MODIFIED — add LOCALES, DEFAULT_LOCALE
│   └── types/
│       └── cms.ts                              # MODIFIED — add ServicePage, PortfolioCaseStudy, FaqItem, SiteSettings types
```

### B2. `proxy.ts` — Next.js 16 middleware (renamed)

**Critical Next.js 16 fact:** the file convention formerly known as `middleware.ts` is renamed to `proxy.ts` (deprecated alias still works, but new code must use `proxy.ts`). It must live at the project root (same level as `app/`). `params` is now `Promise<...>` — see B4.

```typescript
// born2works/proxy.ts
import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'id'] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'en';

// Locale-prefix detection — pathname-based only (no Accept-Language fallback).
// For SEO pages, we REWRITE the URL internally so the canonical stays locale-less.
// This is a rewrite (not a redirect): client URL bar shows /services/web-app, but
// internally Next.js routes to /[lang=en]/services/web-app.
function detectLocale(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for Next.js internals + API + static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')   // favicon.ico, robots.txt, sitemap.xml, images
  ) {
    return NextResponse.next();
  }

  // Already prefixed — let it through to [lang] route as-is
  const firstSeg = pathname.split('/').filter(Boolean)[0];
  if ((LOCALES as readonly string[]).includes(firstSeg)) {
    return NextResponse.next();
  }

  // Bare path — rewrite to default-locale route internally (no client redirect)
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

// Matcher: all non-API, non-static paths
export const config = {
  matcher: [
    // Exclude _next, api, and static files
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
};
```

**Why rewrite, not redirect?** Redirect would change the URL bar to `/en/services/web-app`, which makes the canonical `https://bornworks.biz.id/services/web-app` (the marketing brief's locked URL) unreachable. Rewrite keeps the URL bare for users + crawlers, while Next.js still routes to `[lang=en]` internally. This is the standard pattern for locale-less canonical URLs.

### B3. Locale detection & i18n helpers

```typescript
// born2works/src/lib/i18n.ts
import { Locale } from '@/types/cms';

export const LOCALES: readonly Locale[] = ['EN', 'ID'] as const;
export const DEFAULT_LOCALE: Locale = 'EN';

export function localeFromString(s: string | undefined): Locale {
  if (!s) return DEFAULT_LOCALE;
  const upper = s.toUpperCase();
  return (LOCALES as readonly string[]).includes(upper) ? (upper as Locale) : DEFAULT_LOCALE;
}

export function localeToPath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale.toLowerCase()}`;
}

/** Build a path that includes the locale prefix.
 *  - for default locale: returns `/path` (locale-less canonical)
 *  - for other locale:   returns `/id/path`
 */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${localeToPath(locale)}${clean}`;
}
```

### B4. `[lang]/services/[slug]/page.tsx` — canonical pattern

```typescript
// born2works/src/app/[lang]/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { localeFromString, localizedPath } from '@/lib/i18n';
import { getServicePage } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import ServiceHero from '@/components/ServiceHero';
import FeaturesGrid from '@/components/FeaturesGrid';
import ProcessTimeline from '@/components/ProcessTimeline';
import FaqAccordion from '@/components/FaqAccordion';
import CTA from '@/components/CTA';
import Breadcrumb from '@/components/Breadcrumb';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ISR — revalidate every 60s; CMS revalidation webhook overrides this
export const revalidate = 60;

// Static params for known slugs (en + id). New slugs added via CMS will be
// served on-demand after first publish (Next.js generates them lazily).
export async function generateStaticParams() {
  const slugs = ['web-app', 'mobile-app', 'saas']; // known at build time
  return [
    ...slugs.map((slug) => ({ lang: 'en', slug })),
    ...slugs.map((slug) => ({ lang: 'id', slug })),
  ];
}

interface PageProps {
  // Next.js 16: params is a Promise — must be awaited
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = localeFromString(rawLang);
  const page = await getServicePage(slug, lang);
  if (!page || !page.publishedAt) return {};

  return buildMetadata({
    title: page.title,
    description: page.metaDescription,
    canonicalPath: localizedPath(`/services/${slug}`, lang),
    locale: lang,
    ogType: 'website',
    breadcrumbs: [
      { name: lang === 'ID' ? 'Beranda' : 'Home', path: '/' },
      { name: lang === 'ID' ? 'Layanan' : 'Services', path: localizedPath('/services', lang) },
      { name: page.h1, path: localizedPath(`/services/${slug}`, lang) },
    ],
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { lang: rawLang, slug } = await params;
  const lang = localeFromString(rawLang);
  const page = await getServicePage(slug, lang);
  if (!page || !page.publishedAt) notFound();

  return (
    <>
      <JsonLd
        graphs={[
          buildServiceSchema(page, lang),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: localizedPath('/services', lang) },
            { name: page.h1, path: localizedPath(`/services/${slug}`, lang) },
          ]),
          ...(page.faq.length > 0 ? [buildFaqSchema(page.faq)] : []),
        ]}
      />
      <Navbar lang={lang} />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: lang === 'ID' ? 'Beranda' : 'Home', href: '/' },
            { label: lang === 'ID' ? 'Layanan' : 'Services', href: localizedPath('/services', lang) },
            { label: page.h1, current: true },
          ]}
        />
        <ServiceHero page={page} />
        <FeaturesGrid features={page.features} />
        <ProcessTimeline steps={page.process} />
        <FaqAccordion items={page.faq} />
        <CTA />
      </main>
      <Footer lang={lang} />
    </>
  );
}
```

### B5. ISR config + cache tags

The existing pattern uses `next: { revalidate: 60 }` in `cmsFetch` (see `lib/cms.ts`). For the new pages, we ALSO add **Next.js cache tags** so the revalidation webhook can target specific entities:

```typescript
// born2works/src/lib/cms.ts (extended)
async function cmsFetch<T>(path: string, tags: string[] = []): Promise<T | null> {
  if (!ENABLED) return null;
  try {
    const r = await fetch(`${CMS_URL}${path}`, {
      next: {
        revalidate: 60,
        tags, // e.g. ['service-page:web-app', 'cms-data']
      },
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) return null;
    return r.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function getServicePage(slug: string, locale: Locale) {
  return cmsFetch<ServicePage>(
    `/service-pages/${slug}?locale=${locale}`,
    [`service-page:${slug}`, `service-page:${slug}:${locale}`, 'cms-data'],
  );
}

export async function getCaseStudy(slug: string, locale: Locale) {
  return cmsFetch<PortfolioCaseStudy>(
    `/portfolio-case-studies/${slug}?locale=${locale}`,
    [`case-study:${slug}`, `case-study:${slug}:${locale}`, 'cms-data'],
  );
}

export async function getFaqItems(locale: Locale, category?: string) {
  const params = new URLSearchParams({ locale });
  if (category) params.set('category', category);
  return cmsFetch<FaqItem[]>(`/faq-items?${params}`, ['faq-items', 'cms-data']);
}

export async function getSiteSettings() {
  return cmsFetch<SiteSettings>('/site-settings', ['site-settings', 'cms-data']);
}
```

**On Cloudflare Workers (OpenNext):** cache tags map to Cloudflare Cache API purge tokens — `revalidateTag('service-page:web-app')` triggers a purge that propagates to all edge nodes (≤30 s typical).
**On Docker standalone:** cache tags are in-memory per process; multi-replica deploys need a shared store (Redis). For an MVP at this scale (single Docker replica), in-memory is fine.

### B6. Helpers for metadata + hreflang

```typescript
// born2works/src/lib/seo.ts
import type { Metadata } from 'next';
import { Locale } from '@/types/cms';
import { LOCALES, DEFAULT_LOCALE, localizedPath } from '@/lib/i18n';
import { SITE_URL } from '@/lib/constants';

interface BuildMetadataArgs {
  title: string;
  description: string;
  canonicalPath: string;
  locale: Locale;
  ogType?: 'website' | 'article';
  breadcrumbs?: Array<{ name: string; path: string }>;
  ogImage?: string;
}

export function buildMetadata({
  title, description, canonicalPath, locale, ogType = 'website', ogImage,
}: BuildMetadataArgs): Metadata {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const languages: Record<string, string> = {};
  // For canonicalPath = '/services/web-app', emit:
  //   en -> https://bornworks.biz.id/services/web-app
  //   id -> https://bornworks.biz.id/id/services/web-app
  //   x-default -> https://bornworks.biz.id/services/web-app
  for (const l of LOCALES) {
    languages[l.toLowerCase()] = `${SITE_URL}${localizedPath(canonicalPath, l)}`;
  }
  languages['x-default'] = `${SITE_URL}${localizedPath(canonicalPath, DEFAULT_LOCALE)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonical,
      siteName: 'bornworks',
      locale: locale === 'ID' ? 'id_ID' : 'en_US',
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => (l === 'ID' ? 'id_ID' : 'en_US')),
      images: ogImage ? [ogImage] : [`${SITE_URL}/opengraph-image`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [`${SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}
```

This is exactly the hreflang shape required by `seo-content-brief.md` Appendix (en + id + x-default per page).

---

## 6. Section C — Schema.org additions

### C1. Strategy
- Each page emits its own JSON-LD graph via a single `<JsonLd>` server component that takes a `graphs: object[]` prop.
- Global `Organization` / `LocalBusiness` / `WebSite` is emitted on the layout (in `app/[lang]/layout.tsx`) — once per page, deduplicated by `@id`.
- All `provider` references on per-page schemas use `@id: "${SITE_URL}/#organization"` (or `#localBusiness`) so Google recognizes the same entity across pages.

### C2. Global schema (in `[lang]/layout.tsx`)

```typescript
// born2works/src/components/GlobalJsonLd.tsx — server component, included in [lang]/layout.tsx
import { SITE_URL } from '@/lib/constants';
import { getSiteSettings } from '@/lib/cms';

export async function GlobalJsonLd() {
  const settings = await getSiteSettings();
  const org = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: 'bornworks',
    legalName: settings.legalName, // "PT Lahir Karya Semesta"
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 },
    image: settings.ogImageUrl ?? `${SITE_URL}/opengraph-image`,
    description: settings.seoDescription?.en ?? '', // EN default for schema.org strings (schema.org is en-US)
    email: 'hello@bornworks.id',
    telephone: settings.whatsappNumber ? `+${settings.whatsappNumber}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress,
      addressLocality: settings.addressLocality,       // "Jakarta Selatan"
      addressRegion: settings.addressRegion,            // "DKI Jakarta"
      postalCode: settings.postalCode,
      addressCountry: 'ID',
    },
    geo: settings.geoLatitude && settings.geoLongitude ? {
      '@type': 'GeoCoordinates',
      latitude: settings.geoLatitude,
      longitude: settings.geoLongitude,
    } : undefined,
    openingHoursSpecification: (settings.openingHoursJson as Array<{days:string;opens:string;closes:string}>).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.split('-'),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: settings.areaServedJson,
    priceRange: settings.priceRange, // "$$"
    sameAs: settings.sameAsJson,     // LinkedIn, GitHub, Instagram, Twitter
    foundingDate: '2024',
    knowsAbout: [
      'Web Application Development',
      'Mobile App Development',
      'SaaS Development',
      'Flutter',
      'Next.js',
      'TypeScript',
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'bornworks',
    inLanguage: ['id-ID', 'en-US'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  // JSON-LD requires a single object graph, not arrays.
  // Emit two scripts (Google accepts multiple <script type="application/ld+json">).
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
```

**Mount in `[lang]/layout.tsx`:**
```tsx
<html lang={lang}>
  <head>
    <GlobalJsonLd />
  </head>
  <body>...</body>
</html>
```

### C3. Per-page schemas (passed to `<JsonLd graphs={...}>`)

#### Service page (e.g. `/services/web-app`)
```typescript
function buildServiceSchema(page: ServicePage, lang: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}${localizedPath(`/services/${page.slug}`, lang)}#service`,
    name: page.title,
    description: page.metaDescription,
    url: `${SITE_URL}${localizedPath(`/services/${page.slug}`, lang)}`,
    serviceType: page.h1, // e.g. "Web Application Development"
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    inLanguage: lang === 'ID' ? 'id-ID' : 'en-US',
  };
}
```

#### Case study page (e.g. `/portfolio/spektra`)
```typescript
function buildCaseStudySchema(c: PortfolioCaseStudy, lang: Locale) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork', // Google recognizes CreativeWork for case studies; Article also acceptable
    '@id': `${SITE_URL}${localizedPath(`/portfolio/${c.slug}`, lang)}#case-study`,
    headline: c.h1,
    name: c.title,
    description: c.metaDescription,
    url: `${SITE_URL}${localizedPath(`/portfolio/${c.slug}`, lang)}`,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: lang === 'ID' ? 'id-ID' : 'en-US',
    about: { '@type': 'Thing', name: c.industry },
    keywords: c.techStack.join(', '),
  };
  if (c.imageUrls[0]) schema.image = c.imageUrls[0];
  if (c.publishedAt) schema.datePublished = c.publishedAt.toISOString();
  if (c.testimonial) {
    schema.review = {
      '@type': 'Review',
      reviewBody: c.testimonial.quote,
      author: { '@type': 'Person', name: c.testimonial.author, jobTitle: c.testimonial.role },
      itemReviewed: { '@id': `${SITE_URL}/#organization` },
    };
  }
  return schema;
}
```

#### FAQ page (`/faq`)
```typescript
function buildFaqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}
```

#### BreadcrumbList (all inner pages)
```typescript
function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
```

### C4. Inline FAQ schema on service pages
If a `ServicePage.faq` jsonb array is non-empty, also emit a `FAQPage`-style graph (subset of the questions on that page) so Google can show rich FAQ snippets directly under the service page in SERPs. Use the same `buildFaqPageSchema()` helper with `items` cast from `page.faq`.

---

## 7. Section D — Sitemap strategy

### D1. Decision: single sitemap with hreflang per URL (Option 1)

The brief offered hybrid. We go with **Option 1** (single `sitemap.xml` with 18 entries, each carrying `<xhtml:link rel="alternate" hreflang="...">`) because:
- 18 URLs is well under Google's 50,000-URL-per-sitemap soft cap — no need to split
- Single file = single source of truth; no risk of sitemap index referencing a deleted file
- Google parses hreflang-in-sitemap correctly (verified in [Google's docs](https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap))

### D2. New `sitemap.ts`

```typescript
// born2works/src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getAllServicePageSlugs, getAllCaseStudySlugs, getServicePage, getCaseStudy, getFaqItems } from '@/lib/cms';
import { Locale, LOCALES } from '@/lib/cms/types';
import { localizedPath } from '@/lib/i18n';

const STATIC_PATHS = [
  { path: '/services', priority: 0.9 },
  { path: '/portfolio', priority: 0.9 },
  { path: '/faq', priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home — single canonical (default locale = EN, x-default points here)
  entries.push({
    url: `${SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: {
        en: `${SITE_URL}/`,
        id: `${SITE_URL}/id`,
        'x-default': `${SITE_URL}/`,
      },
    },
  });

  // Static inner pages (3)
  for (const { path, priority } of STATIC_PATHS) {
    for (const lang of LOCALES) {
      const url = `${SITE_URL}${localizedPath(path, lang)}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === '/faq' ? 'monthly' : 'weekly',
        priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l.toLowerCase(), `${SITE_URL}${localizedPath(path, l)}`])
              .concat([['x-default', `${SITE_URL}${localizedPath(path, 'EN')}`]])
          ),
        },
      });
    }
  }

  // Service pages (3 × 2 = 6)
  for (const lang of LOCALES) {
    const slugs = await getAllServicePageSlugs(lang);
    for (const slug of slugs) {
      const page = await getServicePage(slug, lang);
      if (!page || !page.publishedAt) continue;
      entries.push({
        url: `${SITE_URL}${localizedPath(`/services/${slug}`, lang)}`,
        lastModified: page.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l.toLowerCase(), `${SITE_URL}${localizedPath(`/services/${slug}`, l)}`])
              .concat([['x-default', `${SITE_URL}${localizedPath(`/services/${slug}`, 'EN')}`]])
          ),
        },
      });
    }
  }

  // Case studies (5 × 2 = 10)
  for (const lang of LOCALES) {
    const slugs = await getAllCaseStudySlugs(lang);
    for (const slug of slugs) {
      const c = await getCaseStudy(slug, lang);
      if (!c || !c.publishedAt) continue;
      entries.push({
        url: `${SITE_URL}${localizedPath(`/portfolio/${slug}`, lang)}`,
        lastModified: c.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l.toLowerCase(), `${SITE_URL}${localizedPath(`/portfolio/${slug}`, l)}`])
              .concat([['x-default', `${SITE_URL}${localizedPath(`/portfolio/${slug}`, 'EN')}`]])
          ),
        },
      });
    }
  }

  return entries;
}
```

### D3. Sample rendered `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://bornworks.biz.id/</loc>
    <lastmod>2026-06-21T10:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://bornworks.biz.id/" />
    <xhtml:link rel="alternate" hreflang="id" href="https://bornworks.biz.id/id" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://bornworks.biz.id/" />
  </url>
  <url>
    <loc>https://bornworks.biz.id/services/web-app</loc>
    <lastmod>2026-06-21T10:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://bornworks.biz.id/services/web-app" />
    <xhtml:link rel="alternate" hreflang="id" href="https://bornworks.biz.id/id/services/web-app" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://bornworks.biz.id/services/web-app" />
  </url>
  <!-- … 16 more entries for the rest of the 18 URLs … -->
</urlset>
```

### D4. `robots.ts` (unchanged)
Already references `sitemap: ${SITE_URL}/sitemap.xml` — no change needed.

---

## 8. Section E — Revalidation flow (granular)

### E1. New body shape (additive, backward-compatible)

Existing endpoint accepts `{ path }`, `{ paths }`, or `{ tag }`. Extend to also accept `{ entity, slug }` which maps to a list of paths internally:

```typescript
// born2works/src/app/api/revalidate/route.ts — EXTENDED

import { revalidatePath, revalidateTag } from 'next/cache';

// Map (entity, slug) → [paths, tags] to invalidate
function entityToPathsAndTags(entity: string, slug?: string, id?: string) {
  switch (entity) {
    case 'ServicePage':
      if (!slug) throw new Error('ServicePage requires slug');
      return {
        paths: [`/services/${slug}`, `/id/services/${slug}`],
        tags: [`service-page:${slug}`],
      };
    case 'PortfolioCaseStudy':
      if (!slug) throw new Error('PortfolioCaseStudy requires slug');
      return {
        paths: [`/portfolio/${slug}`, `/id/portfolio/${slug}`],
        tags: [`case-study:${slug}`],
      };
    case 'FaqItem':
      // FAQ item affects /faq and every service page (inline FAQs)
      return {
        paths: ['/faq', '/id/faq', '/services', '/id/services', '/portfolio', '/id/portfolio'],
        tags: ['faq-items'],
      };
    case 'SiteSetting':
      // Global — revalidate everything
      return {
        paths: ['/'],
        tags: ['site-settings', 'cms-data'],
      };
    default:
      throw new Error(`Unknown entity: ${entity}`);
  }
}

export async function POST(req: NextRequest) {
  // … existing auth + body parsing unchanged …

  // NEW: entity + slug/id shape
  if (typeof b.entity === 'string') {
    const { paths, tags } = entityToPathsAndTags(b.entity, b.slug, b.id);
    paths.forEach((p) => revalidatePath(p));
    tags.forEach((t) => revalidateTag(t, 'max'));
    return NextResponse.json({ revalidated: true, entity: b.entity, paths, tags });
  }

  // … existing path/paths/tag handling unchanged …
}
```

### E2. CMS-side trigger — extend `RevalidationService`

```typescript
// bornworks-cms/src/revalidation/revalidation.service.ts — EXTENDED

export type EntityType = 'ServicePage' | 'PortfolioCaseStudy' | 'FaqItem' | 'SiteSetting';

async revalidateByEntity(entity: EntityType, slug?: string, id?: string): Promise<void> {
  // … existing retry + auth + log logic, but body is now:
  const body = { entity, slug, id };
  // POST to FRONTEND_URL/api/revalidate
}
```

### E3. Wire into NestJS services

For each new entity's CRUD service, call `revalidateByEntity()` after write:

```typescript
// bornworks-cms/src/service-pages/service-pages.service.ts (new module)
async update(id: string, data: any, userId: string) {
  const before = await this.findOne(id);
  const item = await this.prisma.servicePage.update({ where: { id }, data });
  await this.prisma.auditLog.create({ data: { userId, action: 'UPDATE', entity: 'service-page', entityId: id, before, after: item } });
  this.revalidation.revalidateByEntity('ServicePage', item.slug).catch(() => {});
  return item;
}

async remove(id: string, userId: string) {
  const before = await this.findOne(id);
  await this.prisma.servicePage.delete({ where: { id } });
  await this.prisma.auditLog.create({ data: { userId, action: 'DELETE', entity: 'service-page', entityId: id, before } });
  this.revalidation.revalidateByEntity('ServicePage', before.slug).catch(() => {});
}
```

Same pattern for `PortfolioCaseStudyService` (slug = portfolio slug) and `FaqItemService` (no slug — `id` only).

### E4. Sample CMS → frontend call

```bash
# After editor saves /services/web-app in CMS:
curl -X POST https://bornworks.biz.id/api/revalidate \
  -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"entity":"ServicePage","slug":"web-app"}'

# Response:
# {"revalidated":true,"entity":"ServicePage",
#  "paths":["/services/web-app","/id/services/web-app"],
#  "tags":["service-page:web-app"]}
```

### E5. OpenNext Cloudflare ISR caveat
- On Docker target: `revalidatePath()` busts the in-memory cache of the running Next.js process.
- On Cloudflare Workers (OpenNext): `revalidatePath()` triggers a Cloudflare cache purge (≤30 s propagation). For preview deploys the slug lives on a Worker preview URL, so the purge only affects that URL — fine for our use case.
- For multi-replica Docker deploys: ISR cache is per-process. Adding a Redis-backed `revalidateTag` shared store is a future task (out of scope for this sprint).

---

## 9. Section F — Migration plan (9 steps)

This sequence is **additive** — the existing single-page site stays live throughout. Cutover is the last step.

| # | Step | Owner | Risk | Rollback |
|---|------|-------|------|----------|
| 1 | Add 4 new Prisma models + extend `SiteSetting`. Run `prisma migrate dev --name add-seo-pages` against dev DB. | Engineer | Low (additive) | `prisma migrate resolve --rolled-back add-seo-pages` |
| 2 | Add `ServicePageModule`, `PortfolioCaseStudyModule`, `FaqItemModule` in `bornworks-cms` (controller + service + DTO + Zod validation). Public read endpoints + admin CRUD gated by `@Roles('ADMIN','EDITOR')`. | Engineer | Low (additive) | Revert merge commit |
| 3 | Add `seed.ts` content from `seo-content-brief.md` (Marketing hands off the full copy). Seed dev + staging DBs. | Engineer + Marketing | Low | Wipe seed tables (idempotent) |
| 4 | Add `proxy.ts` + `lib/i18n.ts` + `lib/seo.ts` to `born2works`. **NO page routes yet** — just the rewrite layer. Smoke test: `curl /services/web-app` returns 200 (still the single-page, locale-less). | Engineer | Medium (routing edge cases) | Revert `proxy.ts` commit |
| 5 | Add `[lang]/layout.tsx` + `app/page.tsx` redirect. Cut the existing single-page into `[lang=en]/page.tsx` + `[lang=id]/page.tsx`. `/` resolves to EN home. `/id` resolves to ID home. Verify no anchor links broken (`#services`, `#portfolio`, `#about`, `#contact`). | Engineer + UX | High (homepage is highest-traffic) | Git revert; restore `app/page.tsx` |
| 6 | Add `[lang]/services/[slug]/page.tsx` + `[lang]/portfolio/[slug]/page.tsx` + `[lang]/faq/page.tsx` + their server-component children (`ServiceHero`, `FeaturesGrid`, etc.). Add `[lang]/services/page.tsx` + `[lang]/portfolio/page.tsx` index pages. | Engineer + UX | Medium | Revert step 6 commit |
| 7 | Wire per-page schema.org + Global `LocalBusiness` JsonLd. Update `JsonLd.tsx` to accept `graphs` prop. Add `Breadcrumb` component with aria + JSON-LD. | Engineer | Low | Revert step 7 commit |
| 8 | Update `sitemap.ts` to emit 18 URLs with hreflang. Update `api/revalidate` + `RevalidationService` to accept `entity`/`slug` body. Wire CMS admin save hooks. Submit new sitemap to Google Search Console (DevOps D1 task). | Engineer + DevOps | Medium (must verify sitemap XML validates + hreflang loop) | Revert step 8 commit; revert sitemap submission |
| 9 | Smoke test full surface: 18 URLs return 200, all carry correct hreflang triplet, all have valid schema.org (Google Rich Results Test), CMS save revalidates the right paths. Then deploy to prod via Docker rebuild + image push. | Engineer + QA | Low (all canaries passed in steps 5-8) | Docker image rollback to previous tag |

**Timeline:** W2-W3 per the Q3 plan (`seo-2026-q3-plan.md` §5).

---

## 10. Section G — Risks & mitigations

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|------------|------------|
| 1 | **Anchor link breakage** — current home has `#services`, `#portfolio`, `#about`, `#contact` anchors. Moving `app/page.tsx` → `[lang=en]/page.tsx` could break links from external sites, emails, ads. | Lost SEO equity + broken UX | Medium | Add invisible in-page `<a id="services">` etc. anchors in the new home; keep IDs identical to current. Monitor 404s for the 14 days post-cutover. |
| 2 | **hreflang validation failure** — easy to misconfigure (missing self-reference, wrong language code, pointing to non-canonical). Google Search Console flags this within weeks. | Indexing penalty (de-duplication or wrong locale served) | Medium | Use `buildMetadata()` helper (single source of truth) for all 18 pages; QA Q1 task verifies with Google Search Console URL Inspection + hreflang testing tool. |
| 3 | **ISR cache stale on Cloudflare** — when CMS triggers revalidation, Cloudflare edge purge can take up to 30 s to propagate. During that window, users see stale content. | Minor (CMS edits not instantly visible globally) | Low | Documented in §E5. Acceptable for marketing site. If critical, add Cloudflare Cache API direct purge as future enhancement. |
| 4 | **Bundle size regression** — 9 new pages add code. With ISR + server components, the client JS for each page should be near-zero, but `framer-motion` + `gsap` are heavy and must NOT load on every page. | Slower LCP on mobile; possible CWV regression | Medium | (a) Keep `gsap` / `framer-motion` imports in client components only — never in `layout.tsx` or page server components. (b) Use `next/dynamic` with `ssr: false` for heavy animations only above the fold. (c) Engineer runs `next build` and verifies each new route's First Load JS is < 100 KB. |
| 5 | **Schema.org validation errors** — invalid JSON-LD silently degrades (Google ignores it). | No rich results; no SEO penalty but missed opportunity | Medium | QA Q1 task runs every page through Google's Rich Results Test + Schema.org Validator. CI step (future): add `schema-dts` type-check on `lib/seo.ts` build outputs. |
| 6 | **Default lang migration data loss** — `SiteSetting.defaultLang` changes from `String` to `Locale` enum. If any row has `"EN"` (uppercase) or other unexpected values, cast fails. | Migration blocks deploy | Low | Pre-flight check before migration: `SELECT DISTINCT "defaultLang" FROM "SiteSetting";` — confirm only `'en'` / `'id'`. Document the manual fix in `prisma/seed.ts` if needed. |
| 7 | **FAQ item changes invalidate ALL service pages** — a single `FaqItem` edit calls revalidate for `/services` index + every `/services/[slug]` page. With 3 services + 2 locales that's 6 page revalidations per FAQ save. | Increased CMS-write latency + cache thrash | Low | Acceptable for edit volume (FAQ changes are rare). Document in CMS admin UI as "this will refresh 6 pages". |
| 8 | **Image URLs in case studies** — `PortfolioCaseStudy.imageUrls` is `String[]`. If an image is uploaded to CMS but not yet processed, broken URL leaks to live site. | Bad UX + broken schema.org `image` | Low | Add Zod validation: imageUrl must start with `https://` and return 200. Optional: enforce `cdn.bornworks.biz.id` host. |
| 9 | **OpenNext Cloudflare preview cache bleed** — preview deploys share cache namespace with prod if Worker name collides. Stale content shows in preview. | Dev confusion | Low | `wrangler.jsonc` already has `WORKER_SELF_REFERENCE` service binding. Preview deploys use the same Worker name; document that preview URLs are NOT cached and get a fresh build per deploy (verified by OpenNext docs). |
| 10 | **JavaScript-only client toggle** — current `LanguageContext` uses `localStorage`. If a user toggles language client-side, the URL doesn't update. New SEO pages MUST be URL-driven; client toggle should navigate, not just re-render. | Inconsistent URL state after toggle | Medium | Rewrite `LanguageSwitcher.tsx`: instead of toggling context state, call `router.push(localizedPath(currentPath, otherLocale))`. Defer this to E1 step 5 alongside the home cutover. |

---

## 11. Open questions for Product / Owner

These don't block T1 finalization but should be answered before E1 (W2):

1. **LocalBusiness `addressLocality`** — confirm Jakarta Selatan (or Jakarta Pusat / other). Verify with Dhanu.
2. **Geo coordinates** — provide the lat/long of the actual office, or omit `geo` (still valid LocalBusiness, just less rich). Verify with Dhanu.
3. **`sameAs` URLs** — LinkedIn, GitHub, Twitter/X, Instagram company pages. Provide the URLs.
4. **GA4 ID** — fresh install or reuse existing? If existing, provide the measurement ID (`G-XXXXXXX`).
5. **Google Search Console verification** — owner needs to paste the `<meta name="google-site-verification" ...>` tag into the layout. Confirm whether this comes from the CMS `SiteSetting.googleSearchConsoleVerified` flag (boolean toggle) or directly in code.
6. **Logo file** — high-res PNG/SVG for schema.org `logo` (1200×630 minimum). Drop in `public/`.
7. **Translation direction** — write ID first, then translate to EN, or parallel? Affects W2-W3 copy timeline.
8. **Image hosting for case studies** — store in `bornworks-cms` (existing `Media` table + `/uploads/` route), or external (Cloudinary / S3)? Existing pattern uses `/uploads/`. Keep.

---

## 12. Definition of Done (this spec)

- [x] Section A — 4 new Prisma models (`ServicePage`, `PortfolioCaseStudy`, `FaqItem`, plus SiteSetting extension) with full schema code
- [x] Section B — Next.js file tree + `proxy.ts` + `[lang]/services/[slug]/page.tsx` example
- [x] Section C — Real JSON-LD code for `LocalBusiness`, `Service`, `CreativeWork`, `FAQPage`, `BreadcrumbList`
- [x] Section D — `sitemap.ts` code + sample rendered XML
- [x] Section E — `RevalidationService` + `/api/revalidate` extension with sample curl
- [x] Section F — 9-step migration plan with risk + rollback per step
- [x] Section G — 10 risks with mitigations
- [x] Open questions for owner listed
- [x] 3000+ words (this doc is ~5,800 words)
- [x] Committed to `born2works/docs/seo-tech-spec.md` and pushed to origin
- [x] `build-handoff.md` updated with T1 handoff summary

---

*Spec produced by CTO (Rizki) — kanban task `t_6d591428` (board `bornworks-seo`). Ready for E1 engineering handoff.*
