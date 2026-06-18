# QA Report: CMS Migration — Born2Works Landing Page

**QA Engineer:** Nadia
**Date:** 2026-06-19
**Task:** t_f0b604f9
**Build:** Live at https://bornworks.biz.id (Docker container `born2works`)
**CMS:** https://cms.bornworks.biz.id (Docker container `bornworks-cms`)
**Test duration:** ~60 min

---

## 1. Scope Tested

| Area | Status |
|------|--------|
| Pixel-identical / visual regression | Tested (no pre-CMS baseline available) |
| CMS revalidation (on-demand ISR) | Blocked — route not deployed |
| Bilingual EN/ID toggle | Tested |
| Fallback when CMS is down | Tested |
| Performance baseline | Tested |
| Bilingual i18n in CMS data | Tested |
| Security smoke test | Partial |
| Backup/restore smoke test | Tested |

---

## 2. Test Results Summary

| Acceptance criterion | Test case | Result |
|----------------------|-----------|--------|
| Editing CMS updates live site within revalidation window | CMS content edit + hard refresh | **FAIL** — only CTA reads from CMS; other components use hardcoded data; revalidation endpoint not deployed |
| No code deploy needed for content changes | CMS edit propagation | **FAIL** — components not yet integrated with CMS data layer |
| No visual regression | Layout, colors, fonts, spacing check | **PASS** (with note: no pixel-diff baseline available; manual browser inspection passes) |
| Site still SSRs content | view-source check | **PASS** — full HTML in view-source, 76KB response |
| Lighthouse perf not worse than ~273KB gzipped | Bundle size measurement | **INCONCLUSIVE** — 862KB raw JS (no pre-CMS gzip baseline to compare); gzip estimate ~250-280KB |
| Existing GH Actions deploy still works | GH Actions workflow inspection | **PASS** — workflow file present, SSH deploy to host |
| All content EN/ID bilingual | Language toggle test | **PASS** — all sections switch correctly, no mixing |
| CMS bilingual fields independently editable | CMS API data check | **PASS** — all endpoints return `{en, id}` bilingual fields |

**Pass:** 5 / **Fail:** 2 / **Inconclusive:** 1

---

## 3. Defects

### DEF-001 — CRITICAL (S1)

**Title:** `/api/revalidate` endpoint not deployed — on-demand ISR broken

**Severity:** S1 — blocks core CMS value proposition

**Location:** `born2works` Docker container (image `born2works`)

**Steps to reproduce:**
1. `curl https://bornworks.biz.id/api/revalidate` → returns 404 (page HTML)
2. `curl -X POST https://bornworks.biz.id/api/revalidate -H "Content-Type: application/json" -d '{"path":"/"}'` → returns 404
3. Inspect running container: `sudo docker exec born2works ls /app/.next/server/app/api/` → only `contact` directory exists; `revalidate` is absent

**Expected:** `GET /api/revalidate` returns `{ok: true, message: "..."}`, `POST` with valid secret returns `{revalidated: true, path: "/"}`

**Actual:** 404 Not Found — route not in deployed build

**Evidence:** The route file exists at `src/app/api/revalidate/route.ts` on the host but the running container's `.next` build predates this file. The container was built before the revalidation feature was added and has not been rebuilt/redeployed.

---

### DEF-002 — CRITICAL (S1)

**Title:** Only CTA component reads from CMS; all other sections use hardcoded fallbacks

**Severity:** S1 — negates the entire CMS integration value

**Location:** `src/app/page.tsx` + all component files

**Steps to reproduce:**
1. Inspect `src/app/page.tsx` — only `getCta()` is called from `@/lib/cms`
2. `Hero`, `About`, `Services`, `Process`, `Portfolio`, `Footer` are all imported and rendered as-is with no CMS props
3. Verify by checking CMS API: `curl http://127.0.0.1:3010/hero` returns bilingual data, but `curl https://bornworks.biz.id | grep "Kami Membangun"` (ID-specific text) shows the hardcoded ID text even in EN mode — wait, actually the bilingual toggle works because the components have their own i18n state, NOT from CMS

**Expected:** All content sections read from CMS data layer (`@/lib/cms.ts` functions like `getHero()`, `getAbout()`, etc.)

**Actual:** Only `CTA` (WhatsApp number) is CMS-driven. All other sections render from hardcoded component-level constants. CMS content is seeded but unused by the frontend.

**Evidence:** Build handoff section 4, item 1 explicitly states: "Components still use internal hardcoded data — Hero, About, Services, Process, Portfolio, Footer still read from their own local constants, not from CMS props."

---

### DEF-003 — MAJOR (S2)

**Title:** JS bundle significantly larger than pre-CMS baseline claim

**Severity:** S2 — performance regression concern

**Steps to reproduce:**
1. `curl -sI https://bornworks.biz.id/_next/static/chunks/{chunk}.js` for all chunks
2. Sum sizes → 862KB raw JS

**Expected:** ~273KB gzipped per brief acceptance criteria

**Actual:** 862KB raw (~250-280KB gzipped estimated). No pre-CMS gzipped measurement available to confirm whether this is a regression or the stated baseline was inaccurate.

**Note:** The 273KB figure may have been gzipped; the true comparison requires running Lighthouse on pre-CMS deployment. Without that baseline, this is flagged as **INCONCLUSIVE** rather than a confirmed regression.

---

## 4. Edge / Negative Cases Probed

| Case | Result | Notes |
|------|--------|-------|
| CMS container stopped, site still loads | **PASS** | Site returns 200 with hardcoded fallback content |
| CMS container restarted, site recovers | **PASS** | CMS reconnects automatically via ISR polling |
| Language toggle EN→ID→EN | **PASS** | All sections update correctly, no mixing |
| Anonymous GET to undefined `/api/hero` | **PASS** | Returns 404 (route doesn't exist — this is fine) |
| Anonymous POST to undefined `/api/hero` | **PASS** | Returns 404 (nginx blocks before route) |
| GET /api/revalidate (no auth) | **FAIL** | Returns 404 — route not deployed |
| POST /api/revalidate (no auth) | **FAIL** | Returns 404 — route not deployed |
| Backup script runs successfully | **PASS** | Creates `cms-db-YYYYMMDD-HHMMSS.sql.gz` in `~/work/bornworks-cms/backups/` |

---

## 5. Regression Notes

**Areas checked:**
- Home page layout and sections: all render (Hero, About, Services, Process, Portfolio, CTA, Footer)
- Bilingual toggle: works correctly
- SSR: full HTML in view-source
- GH Actions deploy workflow: present and valid
- CMS DB: seeded with 3 services, 4 process steps, 5 portfolio projects
- CMS bilingual data: all endpoints return `{en, id}` format

**Not regression-tested (no pre-CMS baseline):**
- Exact pixel layout comparison
- Lighthouse scores
- gzipped JS bundle size

---

## 6. Sign-off

**Decision:** FAIL

**Rationale:** Two S1 defects block the core CMS value proposition:
1. The `/api/revalidate` endpoint is not deployed, making on-demand ISR impossible
2. Only the CTA component reads from CMS; all other content sections use hardcoded data

Both defects require a code change and redeploy — they cannot be resolved without Engineering.

**Conditions to flip FAIL to PASS:**
1. Rebuild the `born2works` Docker image to include the `src/app/api/revalidate/` route
2. Update `page.tsx` to pass CMS data as props to `Hero`, `About`, `Services`, `Process`, `Portfolio`, and `Footer` components (using `getHero()`, `getAbout()`, etc. from `@/lib/cms`)
3. Re-test revalidation end-to-end: edit Hero subtitle in CMS admin, trigger webhook, verify change appears on live site within 30 seconds
4. Confirm JS bundle gzip size with Lighthouse (target: comparable to pre-CMS ~273KB gzipped)

---

## Appendix: CMS API Verification

All CMS endpoints return correct bilingual data:

```
GET /hero     → { eyebrow: {en, id}, titleLines: [{en, id}], subtitle: {en, id}, ... }  PASS
GET /services → [ { title: {en, id}, description: {en, id}, icon, order }, ... ]         PASS (3 items)
GET /about    → { heading: {en, id}, sub: {en, id}, badge: {en, id}, values: {en, id} }  PASS
GET /process-steps → [ { title: {en, id}, desc: {en, id} }, ... ]                       PASS (4 items)
GET /portfolio → [ { title: {en, id}, description: {en, id} }, ... ]                    PASS (5 items)
GET /footer   → { desc: {en, id}, email, location, copyrightName }                      PASS
GET /cta      → { whatsappNumber, email }                                               PASS
```

**CMS admin UI:** https://cms.bornworks.biz.id — accessible (HTTP 200)

**Backup verification:**
```
~/work/bornworks-cms/backups/cms-db-20260619-005147.sql.gz  (11KB, recent)
```