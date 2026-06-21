# SEO Upgrade Plan — bornworks.biz.id (Q3 2026)

**Status:** W1 in progress (3 parallel tasks: Marketing/SEO, CTO, UX)
**Owner:** Dhanu (Bagas on Telegram)
**Last updated:** 2026-06-21

---

## 1. Goal

Make bornworks.biz.id rank on Google for high-intent queries like "jasa pembuatan web app Indonesia", "software house Indonesia", "mobile app development agency", and "SaaS development company". Currently the site is a single page with limited indexable content — no service pages, no case study pages, no FAQ. This plan adds 9 SEO-rich pages × 2 languages = 18 URLs, all editable from CMS.

## 2. Target outcomes (90 days after launch)

- 9 priority keywords ranking in top 50
- 3 priority keywords ranking in top 10
- 50+ organic clicks/month
- All 18 URLs indexed in Google
- Hreflang validated (no EN/ID duplication penalties)
- Schema.org validated (rich results eligible)
- Page speed: < 2s LCP mobile, < 1s LCP desktop

## 3. Decisions (locked)

| Q | Decision | Why |
|---|----------|-----|
| Approach | **B (Service Pages + Portfolio Detail, 4-6 weeks)** | Sweet spot effort/results |
| Content writer | **B (team: engineer + Bagas ghostwrite)** | Owner-led, authentic founder voice |
| Geo + language | **B (Indonesia + global EN, dual track)** | ID for local, EN for diaspora/expats/SEA |
| URL strategy | **a (separate URLs with locale prefix)** | Best practice Google, hreflang clean, analytics per bahasa |

## 4. Information Architecture — 9 pages × 2 languages = 18 URLs

| # | URL (EN default) | URL (ID) | Type | Primary keyword (ID) | Primary keyword (EN) |
|---|------------------|----------|------|---------------------|---------------------|
| 1 | `/services/web-app` | `/id/services/web-app` | Service | jasa pembuatan web app Indonesia | custom web app development agency |
| 2 | `/services/mobile-app` | `/id/services/mobile-app` | Service | jasa bikin aplikasi Android | mobile app development Indonesia |
| 3 | `/services/saas` | `/id/services/saas` | Service | jasa pengembangan SaaS | SaaS development company |
| 4 | `/portfolio/spektra` | `/id/portfolio/spektra` | Case study | SPEKTRA PLN tower monitoring | (low volume EN) |
| 5 | `/portfolio/financial-planning` | `/id/portfolio/financial-planning` | Case study | aplikasi perencanaan keuangan | personal finance app Indonesia |
| 6 | `/portfolio/company-profile-cms` | `/id/portfolio/company-profile-cms` | Case study | jasa company profile + CMS | company profile website with CMS |
| 7 | `/portfolio/restaurant-ordering` | `/id/portfolio/restaurant-ordering` | Case study | sistem pemesanan restoran QR | QR-based restaurant ordering system |
| 8 | `/portfolio/saas-analytics` | `/id/portfolio/saas-analytics` | Case study | dashboard analytics SaaS | SaaS analytics dashboard |
| 9 | `/faq` | `/id/faq` | FAQ | (multi-keyword) | (multi-keyword) |

Plus global upgrades:
- Organization → LocalBusiness schema (Jakarta, hours, area served, priceRange, sameAs)
- BreadcrumbList on all inner pages
- Hreflang on every page (`hreflang="id"`, `hreflang="en"`, `hreflang="x-default"`)
- Sitemap.xml extended to 18 URLs (single sitemap with hreflang per entry)
- Google Search Console verified + sitemap submitted

## 5. Timeline

| Week | Streams (parallel where possible) |
|------|----------------------------------|
| W1 | Marketing: SEO research + content brief for 9 pages. CTO: tech spec (CMS schema, i18n URL, schema.org, sitemap). UX: page templates + IA + components. |
| W2 | Engineer: implement CMS schema + Next.js routes + page templates. Marketing + Bagas: ghostwrite 8 pages (8 × 1000 words = ~8,000 words ID + 8,000 EN). |
| W3 | Engineer: integrate content into CMS + redeploy. QA: schema.org validator, page speed, mobile-friendly test, hreflang validation. |
| W4 | DevOps: submit sitemap to Google Search Console + Bing Webmaster. Monitor initial indexing. Polish from QA feedback. |
| W5-6 | Buffer: content iteration, additional FAQ, technical fixes based on Search Console data. |

## 6. Kanban decomposition (board: `bornworks-seo`)

```
W1 (parallel) ─┬─ M1 (Marketing/SEO) → seo-content-brief.md
               ├─ T1 (CTO) → seo-tech-spec.md
               └─ U1 (UX) → seo-ux-spec.md
                         ↓
                  E1 (Engineer) — implement CMS + pages + deploy (W2-W3)
                         ↓
                  Q1 (QA) — SEO verification (W3-W4)
                         ↓
                  D1 (DevOps) — Search Console + monitor (W4)
```

## 7. Active tasks (W1)

| Task ID | Role | Title | Status |
|---------|------|-------|--------|
| `t_fcb5f92c` | Marketing (SEO) | M1 — SEO research + content brief | running |
| `t_6d591428` | CTO | T1 — Tech spec (CMS, i18n, schema.org, sitemap) | running |
| `t_17d51ddb` | UX | U1 — UX spec (templates, IA, components, internal linking) | running |

## 8. Success criteria

- [ ] 9 pages × 2 bahasa = 18 URL live at bornworks.biz.id, all HTTP 200
- [ ] Schema.org valid for all 18 pages (Google Rich Results Test)
- [ ] Hreflang correct on all 18 pages (Google Search Console validation)
- [ ] Sitemap.xml includes 18 pages with hreflang hints
- [ ] robots.txt doesn't block anything important
- [ ] Mobile-friendly test pass on all pages
- [ ] Page speed: < 2s LCP mobile, < 1s LCP desktop
- [ ] Google Search Console verified + sitemap submitted
- [ ] 1 week post-launch: 5+ pages indexed (`site:bornworks.biz.id`)
- [ ] 90 days post-launch: 9 keywords top 50, 3 keywords top 10, 50+ organic clicks/month

## 9. Open decisions for owner (during execution)

- LocalBusiness address detail: city = Jakarta? Address line? Hours?
- sameAs social profiles: LinkedIn, GitHub, Twitter, Instagram — provide URLs
- Google Analytics 4 ID: install fresh or use existing?
- Brand photo / founder photo for About / local SEO?
- Logo file (high-res PNG) for schema.org `logo` field?
- Translation approach: write ID first, translate to EN, or write both from scratch?

## 10. Out of scope (this sprint)

- Blog system (Opsi C — separate sprint later)
- Backlink outreach (separate sprint)
- Conversion tracking / lead form optimization (separate sprint)
- Performance marketing (separate sprint)

## 11. Reference artifacts (will be linked as completed)

- `seo-content-brief.md` — from M1 (W1)
- `seo-tech-spec.md` — from T1 (W1)
- `seo-ux-spec.md` — from U1 (W1)
- `seo-build-handoff.md` — from E1 (W2-W3)
- `seo-qa-report.md` — from Q1 (W3-W4)
- `seo-deploy-report.md` — from D1 (W4)
