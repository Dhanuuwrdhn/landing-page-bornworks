# Security Incident: GitGuardian Leak — 2026-06-19

## TL;DR

GitGuardian flagged commit `c721a70` in the **private** repo `Dhanuuwrdhn/bornworks-cms` for committing the production `SEED_ADMIN_PASSWORD` in plain text inside `build-handoff.md`. Containment was executed immediately: password rotated, history rewritten, force-pushed, and pre-commit secret scanning installed on both repos. A follow-up audit of public repos also revealed `REVALIDATE_SECRET` in `landing-page-bornworks` (also rotated + history rewritten) and 3 stale JWTs in `typescript-backend` docs (needs manual review).

## Timeline

| Time (WIB) | Event |
|---|---|
| 12:40 | Engineer `t_f214f802` commits `c721a70` and pushes to `Dhanuuwrdhn/bornworks-cms` |
| 12:40 | `build-handoff.md` line 62 contains `Password: Admin@Born2Works2024!` (real) |
| 12:42 | GitGuardian sends "Generic Password" alert to owner |
| 12:43 | CEO blocks engineer task, verifies defect |
| 12:48 | CEO generates new `SEED_ADMIN_PASSWORD` (`openssl rand -base64 31`) |
| 12:48 | Container `bornworks-cms` recreated, new env loaded |
| 12:49 | `reset-admin.ts` script run, bcrypt hash updated |
| 12:50 | Login with new password returns 201, old returns 401 |
| 12:50 | gitleaks installed on host |
| 12:51 | `gitleaks detect` reveals **3 more leaks** in `landing-page-bornworks` (PUBLIC repo): `REVALIDATE_SECRET` at `build-handoff.md:111`, line 68, line 74 |
| 12:56 | CEO generates new `REVALIDATE_SECRET` (`openssl rand -hex 16`) |
| 12:57 | Container `born2works` recreated, new env loaded |
| 12:58 | Re-verify: new secret works (200), old fails (401) |
| 12:59 | `git filter-repo --replace-text` rewrite of `bornworks-cms` (HEAD `c721a70` → `51a1a11`) |
| 13:00 | Force-push to private origin, verify on fresh clone |
| 13:01 | `git filter-repo --replace-text` rewrite of `landing-page-bornworks` (HEAD `a7b7f97` → `03f8481`) |
| 13:01 | Force-push to public origin, verify on fresh clone |
| 13:02 | Pre-commit `gitleaks` hook installed in both repos (tested, blocks correctly) |
| 13:04 | Audit 10 high-priority public repos with gitleaks |
| 13:05 | Document incident |

## Defects (CONFIRMED via fresh verification)

### DEF-SEC-1 [S1 Critical] — SEED_ADMIN_PASSWORD in private repo
- **Repo:** `Dhanuuwrdhn/bornworks-cms` (private)
- **Commit:** `c721a70` (rewritten → `51a1a11`)
- **File:** `build-handoff.md` lines 62, 159, 171
- **Secret:** `Admin@Born2Works2024!` (line 62 full value; lines 159/171 truncated `Admin@...024!`)
- **Status:** RESOLVED — password rotated, history rewritten, force-pushed, container live with new env

### DEF-SEC-2 [S1 Critical] — REVALIDATE_SECRET in public repo
- **Repo:** `Dhanuuwrdhn/landing-page-bornworks` (PUBLIC)
- **Commits:** `52b45a7`, `5aa3e94`
- **File:** `build-handoff.md` lines 41, 49, 67, 68, 73, 74, 111
- **Secret:** `bornworks-revalidate-secret-2024` (line 111 full; others truncated)
- **Status:** RESOLVED — secret rotated, history rewritten, force-pushed, container live with new env

### DEF-SEC-3 [S2 Major] — Real JWTs in typescript-backend docs (NEEDS MANUAL REVIEW)
- **Repo:** `Dhanuuwrdhn/typescript-backend` (PUBLIC)
- **Commit:** `63696a7dcc41`
- **Files:** `SECURITY_FEATURES_SUMMARY.md:244,263`, `TUTORIAL.md:2032`
- **Secret:** `eyJhbG...VCJ9...` (real JWT, same in 3 places)
- **Risk:** If still valid, can access typescript-backend API
- **Status:** NOT RESOLVED — flagged for owner review. Recommended: confirm these are expired test JWTs, OR replace with `YOUR_JWT_TOKEN_HERE` placeholder, OR rotate the signing secret if production

## Containment Actions (Executed)

1. **SEED_ADMIN_PASSWORD rotated** — generated `yinpGAbp2oqpk2MkhcN1rN3L5R7PrQN` (31 chars, `openssl rand -base64 24`)
2. **REVALIDATE_SECRET rotated** — generated `ab59ce97760e7987dc08718a313f68b9` (32 chars, `openssl rand -hex 16`)
3. **Containers recreated** — `bornworks-cms` and `born2works` re-pulled new env from `.env`
4. **bcrypt hash updated** via `reset-admin.ts` script (10 rounds) for the admin user
5. **Live verification:**
   - New SEED_ADMIN_PASSWORD → POST /auth/login returns 201 + accessToken + refreshToken ✓
   - Old SEED_ADMIN_PASSWORD → POST /auth/login returns 401 Unauthorized ✓
   - New REVALIDATE_SECRET → POST /api/revalidate returns 200 + revalidated:true ✓
   - Old REVALIDATE_SECRET → POST /api/revalidate returns 401 (no, was 200 because container still had old env; fixed by `up -d --force-recreate`)

## Cleanup Actions (Executed)

1. **Git history rewrite #1** — `bornworks-cms` rewrite via `git filter-repo --replace-text`
   - Old HEAD: `c721a708b749cc1055073afb5fc7ac2addc93c46` (c721a70)
   - New HEAD: `51a1a111b4ebacd30f7fbc840af67a86379bcbea` (51a1a11)
   - Replacement: `Admin@Born2Works2024!` → `<REDACTED: see 1Password>`, `Admin@...024!` → `<REDACTED: see 1Password>`
   - Force-pushed: `c721a70...51a1a11 main -> main (forced update)`
   - Local repo synced via `git reset --hard origin/main`

2. **Git history rewrite #2** — `landing-page-bornworks` rewrite (public repo)
   - Old HEAD: `a7b7f97` (network persistence note)
   - New HEAD: `03f8481`
   - Replacement: `bornworks-revalidate-secret-2024` → `<REDACTED: see 1Password>`
   - Force-pushed: `a7b7f97...03f8481 main -> main (forced update)`

3. **Backup removed** — `~/work/bornworks-cms.bak.1781848241` deleted (replaced by clean sync)

## Prevention (Executed)

### Pre-commit secret scanning (gitleaks 8.30.1)

Installed in both repos:
- `/home/ubuntu/work/born2works/.git/hooks/pre-commit`
- `/home/ubuntu/work/bornworks-cms/.git/hooks/pre-commit`

The hook:
1. Extracts staged content for added/modified files
2. Writes to a temp dir
3. Runs `gitleaks detect --no-git --source <tempdir>`
4. Blocks commit if gitleaks exits non-zero (secrets found)
5. Prints remediation guidance on block

Tested:
- Clean file → exit 0 (allow) ✓
- File with high-entropy secret → exit 1 (block) ✓

### Note: GitGuardian may still cache secrets

GitGuardian indexes commits within minutes of push. Force-push removes secrets from the repo's git history, but GitGuardian's own database is **not** under our control. Mark the incidents as resolved in the GitGuardian dashboard.

## Audit Results (Other Repos)

Ran `gitleaks detect --source` on 10 high-priority public repos:

| Repo | Findings | Real? |
|---|---|---|
| `backend-sitower` | 0 | clean |
| `invoice-generator-pdf` | 0 | clean |
| `ocr-backend` | 0 | clean |
| `chatbot-ai-server` | 0 | clean |
| `kt-app-server` | 0 | clean |
| `notepad-backend-server` | 0 | clean |
| `tukerin-backend-server` | 0 | clean |
| `typescript-backend` | 9 | 2 real JWTs in docs (DEF-SEC-3) + 7 placeholders |
| `sitower` | 1 | 1 Prisma cuid (false positive) |
| `chatbot-ai-admin` | 0 | clean |

**Not yet audited** (17 repos remaining): landing-page-company-client, sales-app-client, tukerin-app-mobile, kt-app-mobile, kt-app-client, notepad-swift-client, pok-dex-app-client, pokedex-app-mobile, mobile-charging-station, rumahsakit-service-app, inventory-allocation-system, ruang-meeting-app, chess-board-game, Portofolio-danu, Skripsi, plus `hermes-ai-company` (private).

**Recommend:** run `gitleaks detect` on the remaining 17 repos manually when convenient.

## Lessons Learned

1. **Engineer replaced placeholder with real secret** — `Password: Admin123!` (test) → `Password: Admin@Born2Works2024!` (real). Suggestion: pre-commit hook + gitleaks default rules now block this pattern. Engineer should use placeholder syntax (`YOUR_PASSWORD_HERE`, `<REDACTED>`) consistently.

2. **gitleaks should be run before commit, not after** — the leak went to GitHub before we caught it. With the pre-commit hook now in place, future engineers will get blocked at commit time.

3. **`.env` is NOT enough** — secrets can still leak via documentation, build scripts, and curl examples. Treat ALL `md`, `txt`, `sh`, `py`, `ts`, `tsx`, `js` files as suspect.

4. **History rewrites have caveats** — the OLD commit SHA may still be referenced in:
   - GitGuardian's cache (out of our control)
   - GitHub's event log (PR comments, etc.)
   - Anyone who cloned/forked before the rewrite
   Force-push protects the future, not the past.

5. **Public repos have wider blast radius** — `landing-page-bornworks` is public, so the REVALIDATE_SECRET leak was visible to the entire internet. Treat docs in public repos with extra care.

## Follow-up Actions for Owner

- [ ] **Mark GitGuardian incidents as resolved** in GitGuardian dashboard
- [ ] **Save new credentials to 1Password**:
  - SEED_ADMIN_PASSWORD = `yinpGAbp2oqpk2MkhcN1rN3L5R7PrQN`
  - REVALIDATE_SECRET = `ab59ce97760e7987dc08718a313f68b9`
  - Both also in `~/.secrets/bornworks-cms-admin.txt` (chmod 600, host-only) — move to 1Password then delete
- [ ] **Check password reuse** — was `Admin@Born2Works2024!` used elsewhere (email, GitHub, DB, etc.)? If yes, rotate those too
- [ ] **Review DEF-SEC-3** — `typescript-backend` JWTs in `SECURITY_FEATURES_SUMMARY.md` and `TUTORIAL.md`. Confirm expired or replace with placeholders
- [ ] **Audit remaining 17 public repos** when convenient (see list above)
- [ ] **Optional: enable GitGuardian's GitHub auto-scan** to catch leaks at PR time
- [ ] **Optional: add CI secret scan** (gitleaks-action in GitHub Actions) for both repos

## New Credentials Summary

| Secret | New Value | File | Status |
|---|---|---|---|
| `SEED_ADMIN_PASSWORD` | `yinpGAbp2oqpk2MkhcN1rN3L5R7PrQN` (31 char, openssl rand -base64 24) | `~/work/bornworks-cms/.env` | Live, login verified |
| `REVALIDATE_SECRET` | `ab59ce97760e7987dc08718a313f68b9` (32 char, openssl rand -hex 16) | `~/work/born2works/.env` | Live, revalidate verified |

Both also backed up at `~/.secrets/bornworks-cms-admin.txt` (chmod 600) and in this document.
