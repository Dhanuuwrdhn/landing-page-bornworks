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
