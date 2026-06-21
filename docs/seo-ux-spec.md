# SEO UX Specification: bornworks.biz.id — 9 New Pages x 2 Languages

**Version:** 1.0
**Author:** UI/UX Designer (Dian)
**Date:** 2026-06-21
**Status:** Ready for Engineering Handoff
**Brand:** bornworks — Where Products Are Born
**Stack:** Next.js (App Router), Tailwind CSS v4, framer-motion, lucide-react

---

## Brand Token Summary (Source of Truth)

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--color-brand-amber` | `#F59E0B` | same |
| `--color-brand-amber-light` | `#FEF3C7` | same |
| `--color-brand-amber-dark` | `#D97706` | same |
| `--color-brand-dark` | `#111827` | `#0a0e1a` |
| `--color-brand-light` | `#F9FAFB` | same |
| `--color-brand-muted` | `#6B7280` | `rgba(255,255,255,0.5)` |
| `--font-sans` | Inter | same |
| `--font-mono` | JetBrains Mono | same |

Glass utilities (`glass`, `glass-card`, `glass-strong`) defined in globals.css — reuse them.

---

## Section A — Information Architecture

### A1. URL Tree (Locked)

```
bornworks.biz.id/
  /services              (NEW — services index page)
    /services/web-app
    /services/mobile-app
    /services/saas
  /portfolio             (EXISTING — refactor as index page)
    /portfolio/spektra
    /portfolio/financial-planning
    /portfolio/company-profile-cms
    /portfolio/restaurant-ordering
    /portfolio/saas-analytics
  /faq                  (NEW)
  /id/...               (all ID counterparts, identical structure)
```

### A2. Navigation Architecture

**Top Navbar (Desktop):**
- Logo (left) → `/` (EN) or `/id` (ID)
- Services (dropdown): Web App Dev → `/services/web-app`, Mobile App → `/services/mobile-app`, SaaS → `/services/saas`
- Portfolio (dropdown): 5 portfolio item links
- FAQ → `/faq` (single link)
- Language toggle: EN | ID (preserves current path)
- CTA button (right)

**Dropdown behavior:** 150ms ease-out fade + 8px upward translate. Portal-rendered, z-50. Keyboard accessible (ArrowDown/Escape).

**Mobile:** Full-height right-side drawer with accordion sections for Services/Portfolio.

**Footer (new columns):**
- Services column: Web App, Mobile App, SaaS, Portfolio, FAQ
- Resources column: FAQ, Blog (future — disabled)

### A3. Breadcrumb Specification

Format: `Home › Services › Web App Development`

- First item links to `/` (EN) or `/id` (ID)
- Separator: `›` in amber color, aria-hidden
- Last item: non-link, muted color, aria-current="page"
- Per-page JSON-LD BreadcrumbList schema

---

## Section B — Page Template Specifications

### Template 1: Service Page (`/services/[slug]`)

**Desktop layout (≥1024px):**
```
[Breadcrumb]
[Hero — two-col: text left, geometric visual right]
[Features Grid — 3-4 glass-card columns]
[Process Timeline — horizontal 4-step]
[Why Bornworks — two-col with amber accent]
[FAQ Accordion — 3-5 collapsible Q&A]
[Case Studies Carousel — 2-3 portfolio cards]
[CTA Block — dark bg + blobs]
[Footer]
```

**Hero:**
- H1: `text-4xl md:text-5xl lg:text-6xl font-extrabold`
- Subtitle: `text-lg text-brand-muted max-w-xl`
- CTA: amber button with shadow
- Background: `#fafafa` light / `#070911` dark

**Features Grid:** `glass-card` with icon (amber/10 bg), title, description. 4-col desktop, 2-col tablet, 1-col mobile.

**Process Timeline:** 4 steps (horizontal desktop / vertical mobile), amber connector line, GSAP scroll animation (same as Process.tsx pattern).

**FAQ Accordion:** Single-open mode, chevron rotates 180deg, 200ms height animation.

**Case Studies Carousel:** Horizontal scroll, dot navigation, `glass-card` portfolio items.

**Mobile sticky CTA:** `fixed bottom-0 glass-strong p-4` with "Start a Project" button. Hidden after scrolling past hero.

### Template 2: Case Study Page (`/portfolio/[slug]`)

**Desktop layout (≥1024px):**
```
[Breadcrumb: Home › Portfolio › SPEKTRA]
[Hero: project name, meta row (industry, year, client, tags)]
[Cover Image — full-width, max-h-[560px], rounded-b-3xl]
[Challenge — text left, image right]
[Approach — image left, text right]
[Solution — text + screenshot gallery]
[Results — 3-4 MetricCards in a row]
[Tech Stack — badge grid (font-mono pills)]
[Testimonial block — if available]
[Related Case Studies — 2-3 cards]
[CTA Block — dark bg]
[Footer]
```

**MetricCard:** `glass-card p-6 text-center`. Metric value: `text-3xl font-black text-brand-amber`. Label: `text-sm text-brand-muted`.

**TechStackBadge:** `font-mono text-xs px-3 py-1.5 rounded-lg bg-brand-dark/5 dark:bg-white/10`.

### Template 3: FAQ Page (`/faq`)

**Desktop layout (≥1024px):**
```
[Breadcrumb: Home › FAQ]
[Hero — centered H1 + subtitle]
[Category Filter — horizontal pill tabs: All / Services / Process / Trust / Comparison]
[FAQ Accordion — 8-10 items, single-open, category tags]
[CTA Form — dark section, name + email + textarea + submit]
[Footer]
```

**Tab behavior:** Client-side filtering, no page reload. Horizontal scroll on mobile (hide scrollbar). Active tab: amber background, white text.

**FAQ Accordion:** Single-open. Category tag (amber pill) on each question. Smooth height animation.

**CTA Form:** Dark background. Inputs: `bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-amber`.

---

## Section C — Visual Component Inventory

### New Components

| Component | Description | Accessibility |
|---|---|---|
| `Breadcrumb` | nav/ol/li, aria-label="Breadcrumb", JSON-LD schema | aria-current="page" on current |
| `ServiceHero` | Two-col hero, no typewriter, based on Hero.tsx | H1 + descriptive CTA label |
| `FeaturesGrid` | glass-card grid, icon + title + desc | icons aria-hidden |
| `ProcessTimeline` | Horizontal/vertical 4-step, GSAP scroll | role="list" |
| `FaqAccordion` | Single-open, chevron, height animation | aria-expanded, aria-controls, keyboard nav |
| `CaseStudyCarousel` | CSS scroll-snap, dot nav | aria-label on region |
| `MetricCard` | Amber number + muted label | aria-label="{value} {label}" |
| `TechStackBadge` | font-mono pill | aria-label="Technology: {label}" |
| `CategoryFilter` | Horizontal pill tabs | role="tablist", aria-selected |
| `RelatedContent` | Grid of cards | aria-label="Related content" |
| `MobileDrawer` | Right-side drawer, accordion sections | aria-modal, focus trap |

### Reused Components

| Component | Source |
|---|---|
| `Navbar` | Extend existing Navbar.tsx with dropdowns + ARIA menu |
| `Footer` | Extend existing Footer.tsx with Services + Resources columns |
| `CTA` | Reuse existing CTA.tsx as-is |
| `ContactModal` | Reuse existing ContactModal.tsx |
| `glass`, `glass-card`, `glass-strong` | globals.css utilities |
| `MotionProvider`, `AnimatedSection` | Existing animation wrappers |

---

## Section D — Internal Linking Map

### Per-Page Link Summary

| Page | Key Outbound Links | Inbound From |
|---|---|---|
| `/services/web-app` | /portfolio ("View our work"), /faq, /#contact | Home (#services), Spektra, FAQ (Services) |
| `/services/mobile-app` | /portfolio, /faq, /#contact | Home (#services), Spektra, FAQ |
| `/services/saas` | /portfolio, /faq, /#contact | Home (#services), FAQ |
| `/portfolio/spektra` | /services/web-app, /services/mobile-app, /#contact | Home (#portfolio), WebApp carousel |
| `/portfolio/financial-planning` | /services/saas, /#contact | Home (#portfolio) |
| `/portfolio/company-profile-cms` | /services/web-app, /#contact | Home (#portfolio) |
| `/portfolio/restaurant-ordering` | /services/mobile-app, /services/saas, /#contact | Home (#portfolio) |
| `/portfolio/saas-analytics` | /services/saas, /#contact | Home (#portfolio) |
| `/faq` | All 3 service pages, /portfolio | All service + portfolio pages |

### Cross-Section Links
Every inner page links back to relevant homepage anchor sections:
- Service pages → `/#services`
- Portfolio pages → `/#portfolio`
- FAQ → `/#contact`

---

## Section E — Navigation Update Specification

### Navbar Desktop (Current → New)
```
# Current:
[Logo]  Services  Portfolio  About  Contact  [Lang] [CTA]

# New:
[Logo]  [Services ▾]  [Portfolio ▾]  FAQ  [Lang] [CTA]
```
Dropdown panel: `absolute top-full left-0 mt-2 w-56 glass-strong rounded-2xl shadow-xl p-2`. Items: hover shows amber left border + amber text.

### Footer (Current → New)
Current 4 columns → New 5 columns:
1. Brand (unchanged)
2. Company (unchanged)
3. Services (NEW: Web App, Mobile App, SaaS, Portfolio, FAQ)
4. Resources (NEW: FAQ, Blog [future])
5. Social (unchanged)

### Language Switcher
- Label: `EN` / `ID` (no flag icons)
- Behavior: swaps locale prefix, preserves path
- No full-page reload (client-side navigation)

---

## Section F — Component Reuse Audit

### Existing Components
- `Navbar.tsx`: scroll glass detection, language toggle, mobile menu → extend with dropdowns
- `Footer.tsx`: column layout, link groups → extend with 2 new columns
- `Hero.tsx`: dark gradient blobs, typewriter → reuse geometric pattern for ServiceHero
- `Services.tsx`: glass-card pattern, icon + number → reuse for FeaturesGrid
- `Portfolio.tsx`: film variants, GSAP ScrollTrigger → simplify for CaseStudyCarousel
- `CTA.tsx`: dark bg + animated blobs → reuse on all inner pages
- `Process.tsx`: timeline connector + ScrollTrigger → reuse for ProcessTimeline
- `ContactModal.tsx`: form inputs, submit → reuse for FAQ form

### Tailwind v4 Note
This project uses Tailwind v4 with `@theme inline` in globals.css. Do NOT create tailwind.config.js. New tokens go directly into `@theme inline`.

---

## Section G — Accessibility Checklist

### Global (All 9 Pages)
- [ ] All interactive elements keyboard navigable (no div[onclick])
- [ ] Visible focus ring: `focus-visible:ring-2 focus-visible:ring-brand-amber`
- [ ] Color contrast 4.5:1+ for all text
- [ ] Heading hierarchy: H1 → H2 → H3 (no skips)
- [ ] `<html lang="en">` / `<html lang="id">` per locale
- [ ] Page title: `{Page Name} | bornworks` (EN) or `{Nama Halaman} | bornworks` (ID)
- [ ] Meta description per page
- [ ] All images have alt text; decorative images alt=""
- [ ] Touch targets ≥44×44px on mobile
- [ ] Pinch zoom enabled (no maximum-scale=1)

### Breadcrumb
- [ ] `aria-label="Breadcrumb"` on `<nav>`
- [ ] `<ol>` + `<li>` structure
- [ ] `aria-current="page"` on current item
- [ ] Separator `›` is `aria-hidden`

### Accordion
- [ ] Trigger is `<button>` (not `<div>`)
- [ ] `aria-expanded` on trigger
- [ ] `aria-controls` pointing to answer `id`
- [ ] Answer: `role="region"` with `aria-labelledby`
- [ ] Keyboard: ArrowDown/ArrowUp between items

### Dropdown / Drawer
- [ ] Dropdown: `aria-haspopup="menu"`, `aria-expanded`, `role="menu"`, `role="menuitem"`
- [ ] Mobile drawer: `aria-modal="true"`, focus trap, Escape closes, return focus to trigger

### Forms
- [ ] Labels linked (`<label htmlFor>` or `aria-label`)
- [ ] Error announcements via `aria-live="polite"`
- [ ] Required fields marked with `required` attribute

---

## Engineering Handoff Notes

1. **No new color tokens** — use existing `@theme inline` tokens from globals.css only
2. **Tailwind v4** — no tailwind.config.js; tokens go in globals.css `@theme inline`
3. **Dark mode** — `.dark` class selector; all components need light + dark color values
4. **shadcn/ui** — NOT installed. Run `npx shadcn@latest init` before adding `accordion` or `tabs` if desired
5. **framer-motion** — already installed; `whileInView` with `viewport={{ once: true }}`
6. **LCP < 1.5s** — hero/cover images: WebP, lazy-loaded, max 200KB. No full-bleed video.
7. **ID text overflow** — ID text ~15-20% longer than EN. Test all containers with ID content.
8. **hreflang tags** — every page `<head>`: en + id + x-default
9. **JSON-LD** — BreadcrumbList (all), Service (service pages), Article (case study pages), FAQPage (FAQ)
10. **ISR** — all new pages: `next: { revalidate: 60 }` in fetch calls

---

*Spec produced by UI/UX Designer (Dian). Questions: comment on kanban card t_17d51ddb.*
