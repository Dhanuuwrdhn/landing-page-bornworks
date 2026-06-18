# CMS Integration — Born2Works Frontend

## Overview

The Next.js frontend (`born2works`) fetches content from the NestJS CMS (`bornworks-cms`) instead of relying solely on hardcoded React component data. The integration uses **ISR (Incremental Static Regeneration)** with a 60-second revalidation window, plus an **on-demand revalidation webhook** so the CMS can push updates instantly.

---

## Architecture

```
born2works (Next.js, :3000)          bornworks-cms (NestJS, :3010)
┌──────────────────────────┐          ┌──────────────────────────┐
│  Server Component        │          │  REST API                 │
│  src/app/page.tsx       │──fetch──▶│  /hero  /about /services  │
│                          │          │  /process-steps /portfolio │
│  src/lib/cms.ts         │          │  /cta  /footer            │
│  (typed fetch + fallback)│          │  /site-settings           │
└──────────┬───────────────┘          └──────────────────────────┘
           │
           │  POST /api/revalidate
           └────── webhook ──────────▶ triggered by CMS on content publish
```

---

## Feature Flags

| Variable | Default | Description |
|---|---|---|
| `CMS_ENABLED` | `true` | Set to `"false"` to bypass CMS and use hardcoded fallbacks |
| `CMS_API_URL` | `http://127.0.0.1:3010` | Base URL of the NestJS CMS API |
| `REVALIDATE_SECRET` | _(empty)_ | Shared secret for the on-demand revalidation webhook |

When `CMS_ENABLED=false`, every `get*()` function in `src/lib/cms.ts` returns the hardcoded fallback immediately, with no network requests.

---

## CMS API Endpoints (Public)

| Method | Path | Description |
|---|---|---|
| GET | `/hero` | Hero section content |
| GET | `/about` | About section content |
| GET | `/services` | Services list (ordered) |
| GET | `/process-steps` | Process steps list (ordered) |
| GET | `/portfolio` | Portfolio projects (ordered) |
| GET | `/cta` | Call-to-action section |
| GET | `/footer` | Footer section |
| GET | `/site-settings` | Global site settings (WhatsApp, emails, etc.) |

All public endpoints require no authentication.

### Authenticated Endpoints (Admin/Editor only)

| Method | Path | Description |
|---|---|---|
| PUT | `/hero` | Update hero |
| PUT | `/about` | Update about |
| POST | `/services` | Create service |
| PATCH | `/services/:id` | Update service |
| DELETE | `/services/:id` | Delete service |
| POST | `/process-steps` | Create process step |
| PATCH | `/process-steps/:id` | Update process step |
| DELETE | `/process-steps/:id` | Delete process step |
| POST | `/portfolio` | Create project |
| PATCH | `/portfolio/:id` | Update project |
| DELETE | `/portfolio/:id` | Delete project |
| PUT | `/cta` | Update CTA |
| PUT | `/footer` | Update footer |
| PUT | `/site-settings` | Update site settings |
| POST | `/auth/login` | Get JWT access + refresh tokens |

---

## On-Demand ISR Revalidation

When CMS content is updated via the admin panel, the CMS calls the Next.js revalidation webhook to immediately purge the ISR cache:

```
POST /api/revalidate
Authorization: Bearer <REVALIDATE_SECRET>
Content-Type: application/json

{ "path": "/" }          # revalidate single path
{ "paths": ["/"] }      # revalidate multiple paths
{ "tag": "cms-data" }    # revalidate by cache tag (future)
```

The Next.js `GET /api/revalidate` endpoint returns a health-check response (no auth required).

### Setting up the webhook in CMS

In the CMS admin panel or via API after any content mutation:

```bash
curl -X POST http://127.0.0.1:3010/api/webhooks/revalidate \
  -H "Content-Type: application/json" \
  -d '{"frontendUrl": "http://host.docker.internal:3000", "secret": "<REVALIDATE_SECRET>"}'
```

Or call directly (from a process that has access to both CMS and Next.js):

```bash
curl -X POST http://host.docker.internal:3000/api/revalidate \
  -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'
```

---

## Data Layer (`src/lib/cms.ts`)

All functions are async and always return data — if the CMS is unreachable, the hardcoded fallback is returned so the page never breaks.

```typescript
import { getHero, getAbout, getServices, getProcessSteps,
         getPortfolio, getCta, getFooter, getCmsPageData }
  from '@/lib/cms';

// Fetch all page data in parallel
const data = await getCmsPageData();

// Fetch individual sections
const hero = await getHero();
const cta  = await getCta();
```

### Fallback data

Hardcoded fallback data lives in `src/lib/cms.ts` as `fallbackHero`, `fallbackAbout`, etc. These are identical to the hardcoded content that was previously embedded in the React components, so toggling `CMS_ENABLED=false` should produce an identical page.

---

## Types (`src/types/cms.ts`)

TypeScript types mirror the NestJS Prisma schema. All localized strings use the `{ en: string; id: string }` shape.

---

## Docker Deployment

When both services run in Docker Compose, use `host.docker.internal` to reach the CMS from the Next.js container:

```yaml
# docker-compose.yml (born2works service)
environment:
  CMS_API_URL: http://host.docker.internal:3010
  CMS_ENABLED: "true"
  REVALIDATE_SECRET: ${REVALIDATE_SECRET:-}
```

For local development with `next dev`, `CMS_API_URL=http://127.0.0.1:3010` works directly (host networking).

---

## CMS Admin Credentials

```
URL:      http://127.0.0.1:3010/admin
Email:    admin@bornworks.biz.id
Password: Admin@...024!
```

Credentials are set in the CMS database. To reset the password, generate a new bcrypt hash inside the CMS container:

```bash
docker exec bornworks-cms node -e "const b=require('bcrypt'); b.hash('YourPassword',12).then(h=>console.log(h))"
# Then UPDATE the User table in the database
```

---

## Seed Script

To re-populate the CMS with content extracted from the hardcoded React components:

```bash
# From the bornworks-cms directory
node scripts/seed-via-api.js

# Or from anywhere
CMS_URL=http://127.0.0.1:3010 \
SEED_ADMIN_EMAIL=admin@bornworks.biz.id \
SEED_ADMIN_PASSWORD=Admin@...024! \
node ~/work/bornworks-cms/scripts/seed-via-api.js
```

The seed script:
1. Logs in via `POST /auth/login`
2. Upserts Hero, About, CTA, Footer via `PUT`
3. Deletes and recreates Services, Process Steps, Portfolio via `POST`
4. Updates Site Settings via `PUT`

---

## Current Integration Status

- `page.tsx` — async server component, fetches CTA from CMS and passes WhatsApp number to `<CTA>`
- `src/lib/cms.ts` — typed data layer with ISR (60s) + fallbacks
- `src/types/cms.ts` — TypeScript types matching the CMS Prisma schema
- `src/app/api/revalidate/route.ts` — ISR webhook endpoint
- Feature flags in `.env` and `docker-compose.yml`

**Remaining**: refactor `Hero`, `About`, `Services`, `Process`, `Portfolio`, `Footer` components to accept CMS data as props (they currently use internal hardcoded data). This can be done incrementally per component.
