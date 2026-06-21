# Build Handoff: born2works CMS-driven refactor (DEF-001 + DEF-002 fix)

## 1. What Was Implemented

**DEF-001** (stale content after CMS publish) and **DEF-002** (no i18n fallbacks) are fixed via a full CMS-driven architecture.

### Architecture
- `page.tsx` is now an **async Server Component** that fetches all CMS data in parallel via `getCmsPageData()`
- Each section component (`Hero`, `About`, `Services`, `Process`, `Portfolio`, `Footer`) receives typed CMS props
- All components remain `"use client"` (no SSR conversion); the Server Component page fetches and passes data down
- When CMS is unreachable (`CMS_ENABLED=false` or timeout), hardcoded fallback data is used — page never breaks
- ISR with 60-second revalidation (`next: { revalidate: 60 }`) + on-demand webhook via `POST /api/revalidate`

### Features implemented (mapped to user stories)
- **US-1, US-2, US-3**: Hero, About, Services, Process, Portfolio, Footer — all driven by CMS props
- **US-4**: Navbar language toggle persists via `localStorage` + `useSyncExternalStore`
- **US-5**: `POST /api/revalidate` triggers `revalidatePath` / `revalidateTag` on-demand (ISR fix)
- **US-6**: Hardcoded fallbacks ensure page renders even if CMS is down (i18n safety net)

## 2. How to Run

### Local development
```bash
cd ~/work/born2works
npm install
npm run dev          # Next.js dev server on :3000
```

### Docker (production-like)
```bash
cd ~/work/born2works
sudo docker compose build
sudo docker compose up -d
# App runs on http://127.0.0.1:3002
```

### Environment variables
```bash
CMS_ENABLED=true              # Set to "false" to force fallback data
CMS_API_URL=http://bornworks-cms:3000   # NestJS CMS API — use container network alias, NOT 127.0.0.1
REVALIDATE_SECRET=<REDACTED: see 1Password>   # Bearer token for /api/revalidate
WHATSAPP_NO=6281298172410      # WhatsApp contact number
```

### Key routes
| Route | Purpose |
|-------|---------|
| `GET /` | Home page (ISR, 60s revalidation) |
| `POST /api/revalidate` | On-demand ISR webhook |
| `POST /api/contact` | Contact form submission |

## 2b. Repository
- **URL**: https://github.com/Dhanuuwrdhn/landing-page-bornworks
- **Default branch**: `main`
- **Last commit**: `d272993` — `feat(cms): replace all hardcoded content with typed CMS props + fallbacks`

## 3. Tests

### TypeScript type check
```bash
npm run build
# Exit 0 — passes TypeScript check + Turbopack build + static generation (12/12 pages)
```

### Revalidate endpoint
```bash
curl -X POST http://127.0.0.1:3002/api/revalidate \
  -H "Authorization: Bearer <REDACTED: see 1Password>" \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'
# Returns: {"revalidated":true,"path":"/"}

curl -X POST http://127.0.0.1:3002/api/revalidate \
  -H "Authorization: Bearer <REDACTED: see 1Password>" \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/", "/about"]}'
# Returns: {"revalidated":true,"paths":["/","/about"]}
```

### Home page HTTP check
```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3002/
# Returns: 200
```

## 4. Known Limitations / TODO

- **CMS must be reachable at build time for static generation** — if NestJS CMS is down during `npm run build`, the fallback data is used (acceptable per DEF-001 behavior)
- **No `generateStaticParams`** — all pages are statically generated at build time; ISR handles live updates
- **Navbar/ScrollProgress** are client-only (static content, no CMS data)
- **Contact form** (`/api/contact`) stores submissions in memory; swap for a DB/email integration

## 5. Notes for QA

### Areas to focus
1. **Home page renders correctly** — verify all 6 sections (Hero, About, Services, Process, Portfolio, CTA, Footer) display with content
2. **Language toggle** — switch EN/ID, verify all text changes correctly on every section; refresh page, language persists
3. **CMS bypass** — set `CMS_ENABLED=false` in `.env`, restart container; verify all content still renders from fallback data
4. **Revalidate webhook** — call `POST /api/revalidate` with the Bearer token and `{"path": "/"}`; next page load should show fresh data
5. **404 pages** — verify `/about`, `/contact`, non-existent paths return appropriate pages

### Edge cases to probe
- CMS API returns partial data (some fields missing) — fallback data fills gaps
- `revalidateTag` called without second arg — **fixed**: now calls `revalidateTag(b.tag, 'max')` per Next.js 16 signature
- Optional `icon` field missing in ProcessStep — **fixed**: `iconMap[step.icon ?? '']` with `?? Search` fallback
- Portfolio/Service item `tags`/`features` undefined — **fixed**: defensive `?.` guards with `.en` fallback

### Test data
- All fallback content is in `src/lib/cms.ts` (`fallbackHero`, `fallbackAbout`, `fallbackServices`, etc.)
- WhatsApp test number: `6281298172410`
- Revalidate secret: `<REDACTED: see 1Password>`

---

## DEF-NETWORK-1 Fix (S1 — inter-container networking)

**Problem:** `CMS_API_URL=http://127.0.0.1:3010` in `.env` pointed to the born2works container's own loopback — the NestJS CMS API was never reachable from inside the container. All 6 sections fell back to hardcoded data.

**Root cause:** `127.0.0.1` inside the born2works Docker container is the container's loopback, not the host or another container. `host.docker.internal` also does not resolve on this host's Docker bridge.

**Fix applied:**
1. `.env` — changed `CMS_API_URL=http://127.0.0.1:3010` → `CMS_API_URL=http://bornworks-cms:3000`
2. `docker-compose.yml` — changed fallback from `http://host.docker.internal:3010` → `http://bornworks-cms:3000`
3. `docker network connect born2works_default bornworks-cms` — joined bornworks-cms to the born2works bridge network
4. born2works container rebuilt and redeployed

**Verification:**
```bash
# From inside born2works container:
sudo docker exec born2works wget -qO- http://bornworks-cms:3000/health
# Returns: {"status":"ok","db":"up"}

# Live site footer now shows CMS data (not truncated fallback):
curl -sS https://bornworks.biz.id | grep -oE 'We craft digital products[^"<]{0,50}'
# Returns: We craft digital products — web apps, mobile apps, and SaaS platforms — tha

# HTTP 200 on home page:
curl -sS -o /dev/null -w '%{http_code}' https://bornworks.biz.id
# Returns: 200
```

**Network note:** born2works and bornworks-cms must be on the same Docker bridge network. The `docker network connect born2works_default bornworks-cms` command (run manually or via a compose file that defines a shared network) makes the CMS reachable at `bornworks-cms:3000` from the born2works container. This connection persists across container restarts but NOT across `docker compose down && up` for bornworks-cms (the container must be re-connected after recreation). A permanent fix is to add `born2works_default` as an external network to bornworks-cms's docker-compose.yml.

---

## SEO Sprint Handoff (M1 — Marketing)

### What was delivered
- **File:** `docs/seo-content-brief.md` — 57KB, ~2,300 lines, all 5 sections complete
- **Status:** Committed at `7f8a685` on `main`

### Content brief summary
| Section | Coverage |
|---------|----------|
| Section A: Keyword Universe | 3 service clusters (S1/S2/S3) + 5 portfolio clusters + FAQ cluster; quick-win vs long-term keywords identified |
| Section B: Per-Page Briefs | All 9 pages briefed in both EN + ID (18 URL variants); title, meta, H1, H2/H3 outline, word count, content sections, visuals, schema, internal links, external links, CTA |
| Section C: FAQ Brief | 8 Q&A per language; natural ID (not translation); FAQPage schema included |
| Section D: Content Roadmap | Writer assignments (engineer, Dhanu, Bagas); 18 content pieces; ~20,400 total words; priority order + schedule |
| Section E: Measurement Plan | 90-day KPIs; baseline=0; quick-win keyword tracking; GSC + Bing setup |

### Quick-win keywords (for early ranking wins)
1. `Next.js developer Indonesia` — EN — /services/web-app — target top 10
2. `jasa bikin aplikasi Android` — ID — /id/services/mobile-app — target top 5
3. `jasa pengembangan SaaS` — ID — /id/services/saas — target top 5
4. `Flutter developer Indonesia` — EN — /services/mobile-app — target top 10
5. `QR restaurant ordering system` — EN — /portfolio/restaurant-ordering — target top 10
6. `jasa company profile + CMS` — ID — /id/portfolio/company-profile-cms — target top 5

### Handoff notes for engineer (E1)
1. **Schema.org** — Each service page needs individual `Service` schema (currently only `ItemList` exists). Portfolio pages need `Article` schema. FAQ page needs `FAQPage` schema. All pages need `BreadcrumbList`. See Appendix in seo-content-brief.md for JSON-LD examples.
2. **Hreflang** — All 18 pages need correct hreflang tags. EN page (`/path`) gets `hreflang="id"` (pointing to ID version) + `hreflang="x-default"` (pointing to EN default). ID page (`/id/path`) gets `hreflang="en"` + `hreflang="id"` (self) + `hreflang="x-default"`. See Appendix in seo-content-brief.md.
3. **Sitemap** — Submit 18 URLs to GSC. Single sitemap with hreflang annotations per entry.
4. **Internal links** — Implement the cross-linking map (Section B). Add a "Related Services" or "You might also like" component at bottom of each page that renders these cross-links.
5. **FAQ page** — Implement `/faq` and `/id/faq` with FAQPage schema. 8 Q&A per language. Short answers (40-80 words each). Schema.org FAQPage markup required for featured snippet eligibility.

### Handoff notes for UX (U1)
1. Each service page needs a template with: hero section, content sections (5-8), FAQ section, CTA section, sidebar/related content
2. Each portfolio page needs: case study layout (Challenge → Approach → Solution → Results → Tech stack → CTA)
3. FAQ page needs: accordion-style Q&A with schema-ready markup
4. All pages need: breadcrumb navigation, language toggle persistence, mobile-responsive layout
5. See Section B for visual suggestions per page (screenshots, diagrams, code snippets)

### Repo
- **URL:** https://github.com/Dhanuuwrdhn/landing-page-bornworks
- **Last commit:** `7f8a685` — `docs: add seo-content-brief.md — M1 W1 deliverable`

---

## SEO Sprint Handoff (U1 — UI/UX Design)

### What was delivered
- **File:** `docs/seo-ux-spec.md` — comprehensive UX design specification covering all 7 sections
- **Mockup:** `mockup.html` in task workspace — visual mockup of all 3 page templates (desktop + mobile views)
- **Status:** Committed at `05165f6` on `main`

### UX Spec summary

#### Information Architecture
- 9 pages total: 3 services + 5 portfolio + 1 FAQ (each x2 for EN/ID)
- Bilingual URL strategy: `/services/web-app` (EN) ↔ `/id/services/web-app` (ID)
- New footer columns: Services (linking to 3 service pages) + Resources (FAQ + future blog)
- Language switcher: preserves current path when switching locale (no page reload)

#### Page Templates (3 types)

**Template 1 — Service Page** (`/services/[slug]`):
- Hero: two-column (text left, geometric visual right), H1 + subtitle + CTA
- Features grid: 3–4 `glass-card` icon + title + description cards
- Process timeline: horizontal 4-step (vertical on mobile), amber connector line
- Why Bornworks: two-column with amber accent stat block
- FAQ accordion: 3–5 collapsible Q&A (single-open mode)
- Case studies carousel: 2–3 related portfolio cards, horizontal scroll
- CTA block: dark bg with animated blobs (mirrors existing `CTA.tsx`)

**Template 2 — Case Study Page** (`/portfolio/[slug]`):
- Hero: project name, meta row (industry, year, client, tags)
- Full-width cover image
- Alternating left/right content sections: Challenge → Approach → Solution
- Results: 3–4 `MetricCard` components (amber number + muted label)
- Tech stack badge grid: `font-mono` pills
- Testimonial block (if available)
- Related case studies (2–3 cards)

**Template 3 — FAQ Page** (`/faq`):
- Centered hero: H1 + subtitle
- Category filter: horizontal pill tabs (All / Services / Process / Trust / Comparison)
- FAQ accordion: 8–10 items, single-open, category tags, smooth height animation
- CTA form: dark section, name + email + textarea + submit

#### Component Inventory

| Component | Type | Source |
|---|---|---|
| `Breadcrumb` | New | `aria-label="Breadcrumb"`, ol/li, JSON-LD schema |
| `ServiceHero` | New | Based on `Hero.tsx` (no typewriter) |
| `FeaturesGrid` | New | Maps over `glass-card` pattern |
| `ProcessTimeline` | New | Based on `Process.tsx` GSAP ScrollTrigger |
| `FaqAccordion` | New | shadcn/ui Accordion + single-open logic |
| `CaseStudyCarousel` | New | CSS scroll-snap, dot nav, simplified `Portfolio.tsx` |
| `MetricCard` | New | Amber number + muted label in `glass-card` |
| `TechStackBadge` | New | `font-mono text-xs` pill |
| `CategoryFilter` | New | shadcn/ui Tabs, horizontal pill style |
| `RelatedContent` | New | Grid of cards, reusable |
| `MobileDrawer` | New | Drawer with accordion sections, focus trap |
| `Navbar` | Extend | Existing `Navbar.tsx` + dropdown menus + ARIA menu |
| `Footer` | Extend | Existing `Footer.tsx` + two new link columns |
| `CTA` | Reuse | Existing `CTA.tsx` as-is for all page CTAs |

#### Navigation Update
- Desktop navbar: dropdown menus for Services (3 items) and Portfolio (5 items)
- Mobile: full-height right-side drawer with accordion sections
- Footer: Services column (3 service links) + Resources column (FAQ, future blog)
- Language switcher: `EN | ID` toggle, preserves path prefix, no page reload

#### Key Design Tokens (from `globals.css`)
```
--color-brand-amber: #F59E0B
--color-brand-amber-light: #FEF3C7
--color-brand-amber-dark: #D97706
--color-brand-dark: #111827 (light) / #0a0e1a (dark)
--color-brand-light: #F9FAFB
--color-brand-muted: #6B7280 (light) / rgba(255,255,255,0.5) (dark)
--font-sans: Inter
--font-mono: JetBrains Mono
```
Glass utilities (`glass`, `glass-card`, `glass-strong`) already defined in globals.css — reuse them.

### Engineering Handoff Notes (from UX)

1. **No new color tokens** — all components use existing `@theme inline` tokens from globals.css
2. **Tailwind v4** — this project uses Tailwind v4 with `@theme inline` in globals.css (no tailwind.config.js). Do NOT create a tailwind.config.js — add any new tokens directly to `@theme inline` in globals.css
3. **Dark mode** — all components use `.dark` class selector on `<html>`; all colors must have light and dark values
4. **shadcn/ui** — NOT yet installed. If Engineer chooses to use it, run `npx shadcn@latest init` first, then `npx shadcn@latest add accordion tabs` for FAQ components. Otherwise build from raw Tailwind
5. **framer-motion** — already installed; use `whileInView` with `viewport={{ once: true }}` for scroll animations (same pattern as existing components)
6. **Icons** — `lucide-react` already in use; import from there
7. **LCP constraint** — all hero/cover images must be WebP, lazy-loaded, max 200KB. No full-bleed video.
8. **ID text overflow** — ID text is ~15–20% longer than EN. Test all text containers with ID content; use `text-balance` on headings, allow wrapping at all breakpoints
9. **hreflang** — must be on every page `<head>`: `<link rel="alternate" hreflang="en">` + `<link rel="alternate" hreflang="id">` + `<link rel="alternate" hreflang="x-default">`
10. **JSON-LD schemas** — add per page: `BreadcrumbList` (all pages), `Service` (service pages), `Article` (case study pages), `FAQPage` (FAQ page)

### Repo
- **URL:** https://github.com/Dhanuuwrdhn/landing-page-bornworks
- **Spec file:** `docs/seo-ux-spec.md` — committed at `<commit-sha>`
- **Mockup:** `mockup.html` (task workspace, not committed to repo)
