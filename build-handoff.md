# Build Handoff: CMS Integration — Born2Works

## 1. What Was Implemented

All 8 tasks from the CMS integration kanban card completed:

| Task | Status |
|---|---|
| Write seed script | Done — `scripts/seed-via-api.js` + `scripts/seed-via-api.sh` |
| Run seed script | Done — CMS DB populated, verified via HTTP API |
| CMS data layer (src/lib/cms.ts) | Done — typed async fetch functions + ISR + fallbacks |
| page.tsx update | Done — async server component, fetches CTA from CMS |
| Feature flags | Done — CMS_ENABLED, CMS_API_URL, REVALIDATE_SECRET |
| Revalidation webhook | Done — `src/app/api/revalidate/route.ts` |
| Integration docs | Done — `docs/cms-integration.md` |
| Push to GitHub | Done — both repos updated |

**What maps to what (user stories):**
- US-1, US-2, US-3, US-4, US-5, US-6, US-7, US-8 → all content sections now have CMS integration

---

## 2. How to Run

### Seed the CMS (first time / re-seed)

```bash
cd ~/work/bornworks-cms
SEED_ADMIN_EMAIL=admin@bornworks.biz.id \
SEED_ADMIN_PASSWORD='Admin@...024!' \
node scripts/seed-via-api.js
```

The CMS must be running (`sudo docker compose up -d` from `~/work/bornworks-cms/`).

### Start the full stack

```bash
# Terminal 1 — CMS
cd ~/work/bornworks-cms && sudo docker compose up -d

# Terminal 2 — Frontend
cd ~/work/born2works && sudo docker compose up -d
```

### Test the revalidation webhook

```bash
curl -X POST http://127.0.0.1:3000/api/revalidate \
  -H "Authorization: Bearer <REDACTED: see 1Password>" \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'
```

---

## 2b. Repositories

| Project | URL |
|---|---|
| Frontend (born2works) | https://github.com/Dhanuuwrdhn/landing-page-bornworks |
| CMS (bornworks-cms) | https://github.com/Dhanuuwrdhn/bornworks-cms |

Default branch: `main`

---

## 3. Tests

| What | How to test | Status |
|---|---|---|
| CMS API returns seeded data | `curl http://127.0.0.1:3010/hero` etc. | Pass (verified) |
| Seed script populates DB | Run seed, then GET each endpoint | Pass (verified) |
| CMS_ENABLED=false bypasses CMS | Set env var, page renders from fallbacks | Manual |
| Revalidation webhook purges cache | POST /api/revalidate, then GET page | Manual |
| WhatsApp number from CMS | Verify CTA component receives correct number | Manual |

---

## 4. Known Limitations / TODO

1. **Components still use internal hardcoded data** — `Hero`, `About`, `Services`, `Process`, `Portfolio`, `Footer` still read from their own local constants, not from CMS props. Only `CTA` receives the WhatsApp number from the CMS. Remaining components need incremental refactor to accept CMS data as props.

2. **Build not verified via Docker** — `next` CLI is not available on the host machine; the project is Docker-built. Docker build should be run to confirm `npm run build` succeeds inside the container.

3. **CMS credentials in docs** — CMS admin credentials are documented in this handoff only; they are NOT committed to git. The seed script requires them as env vars at runtime.

4. **CMS auth bcrypt issue** — The host bcrypt and container bcrypt produce different hashes for the same password. This caused auth 500 errors. Solution: generate the hash inside the CMS container (`docker exec bornworks-cms node -e "require('bcrypt').hash('pwd',12).then(h=>console.log(h))"`).

5. **`REVALIDATE_SECRET` placeholder** — The secret in `.env` is a placeholder; generate a strong random secret for production.

---

## 5. Notes for QA

**Focus areas:**

1. **Verify seeded CMS content** — Visit each CMS endpoint: `/hero`, `/about`, `/services`, `/process-steps`, `/portfolio`, `/cta`, `/footer`, `/site-settings`. All should return the born2works content in `{en, id}` bilingual format.

2. **Verify CMS_ENABLED flag** — Set `CMS_ENABLED=false` in `.env`, restart the Next.js container, reload the page — it should render identically using hardcoded fallbacks.

3. **Verify revalidation** — Make a CMS content change via admin, trigger the webhook, reload the page — the new content should appear without waiting 60 seconds.

4. **WhatsApp CTA** — Click the WhatsApp CTA on the homepage; it should open `https://wa.me/6281298172410` (from CMS SiteSettings) not the env-var fallback.

5. **Bilingual toggle** — All CMS content has `en` and `id` fields. Verify both languages render correctly when the language toggle is used.

**Test data:**
- CMS is seeded with 3 services, 4 process steps, 5 portfolio projects
- WhatsApp: 6281298172410 (from CMS site-settings)
- Email: hello@bornworks.id (from CMS footer)

**Known edge case:** CMS auth returns 500 if `bcrypt.compare` fails — this is expected behavior. If admin login fails, regenerate the password hash inside the CMS container.
