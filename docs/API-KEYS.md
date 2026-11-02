# SIT Learning Hub - API Keys and External Services

**Purpose:** a single checklist of every external service, the environment variables it needs, where to obtain it, and which plan to pick.  
**Last updated:** 2026-11-02  
**Rule:** never paste real keys into chat, code, docs, commits, screenshots, or issue trackers. Put them in `.env.local` locally and in the Vercel dashboard for deployments.

---

## 1. Acquisition order

Start with these three before Phase 1 live verification:

| Order | Service | Why now | Time needed |
| --- | --- | --- | --- |
| 1 | Turso | Database for Phase 1 | 5-10 minutes |
| 2 | Clerk | Authentication for Phase 1 | 10-15 minutes |
| 3 | Groq | AI grading/assistant from Phase 4/9 | 5 minutes |
| 4 | Cloudflare R2 | Exam PDFs/evidence from Phase 6 | 15 minutes (can wait) |
| 5 | Vercel | Deployment/previews | 10 minutes (can wait) |

Optional later: Upstash Redis, Sentry, a paid OCR provider. Mastra tracing and Studio need no hosted key.

---

## 2. Key matrix

| Service | Priority | Recommended plan | Environment variables | Secret? |
| --- | --- | --- | --- | --- |
| Turso | Required Phase 1 | Free | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | URL is not secret; token is |
| Clerk | Required Phase 1 | Hobby (free) | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, optional `CLERK_WEBHOOK_SIGNING_SECRET` | Secret key and webhook secret |
| Groq | Required Phase 4/9 | Free tier / pay-as-you-go | `GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_FAST_MODEL` | Yes |
| Cloudflare R2 | Required Phase 6 | Free (10 GB) | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT` | Access keys are secret |
| Vercel | Deployment | Hobby for personal; Pro for institutional/commercial | Set in dashboard; `NEXT_PUBLIC_APP_URL` | Project tokens are secret |
| Mastra observability | Built in | Local Studio / OpenTelemetry | No additional key required | No |
| Upstash Redis | Optional Phase 11 | Free | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Token is secret |
| Sentry | Optional Phase 11 | Free/developer | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` | Auth token is secret; DSN is public |
| OCR provider | Optional Phase 6 | Prefer local first | `OCR_PROVIDER`, `OCR_SPACE_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Yes |
| MMUST/MUT repositories | Content source | No API key | Configuration/URLs only | N/A |

---

## 3. Turso (database) - required Phase 1

**Use for:** the application database (users, curriculum, attempts, calendar, exam bank, AI state).

**Plan to pick:** **Free** ($0). Current limits: 100 databases, 5 GB storage, 500M rows read/month, 10M rows written/month. This is more than enough for development and an early pilot.

**Where:** https://app.turso.tech/signup

### Steps

1. Sign up with GitHub or email.
2. Install the CLI (or use the dashboard):
   - Windows PowerShell: follow the current instructions at https://docs.turso.tech/cli/installation
3. Authenticate:
   ```powershell
   turso auth signup
   ```
4. Check locations and pick the closest to Kenya:
   ```powershell
   turso db locations
   ```
5. Create the database (Johannesburg if available; otherwise the lowest-latency location):
   ```powershell
   turso db create sit-learning-hub --location jnb
   ```
   Turso's CLI has changed over time. If your CLI version uses groups, create a group in the chosen location first and then create the database in that group. Use the current instructions at https://docs.turso.tech/quickstart if the command is rejected.
6. Get the URL:
   ```powershell
   turso db show sit-learning-hub --url
   ```
7. Create a token:
   ```powershell
   turso db tokens create sit-learning-hub
   ```
8. Put both values in `.env.local`:
   ```dotenv
   TURSO_DATABASE_URL=libsql://...
   TURSO_AUTH_TOKEN=...
   ```

**Local development alternative:** use `TURSO_DATABASE_URL=file:./.data/local.db` and leave the token empty. This avoids network latency and quota use during development.

**Notes:**

- Never commit the token.
- Use separate databases (or at least separate tokens) for development and production.
- The free plan has no automated long-term backup guarantee beyond the documented restore window; export important data before risky migrations.
- Turso is SQLite-compatible with a single writer. Keep transactions short.

**Status:** [ ] account created  [ ] database created  [ ] token stored locally  [ ] production token stored in Vercel

---

## 4. Clerk (authentication) - required Phase 1

**Use for:** sign-up, sign-in, email verification, password reset, sessions, optional Google sign-in.

**Plan to pick:** **Hobby (free)**. It includes 50,000 monthly retained users per app, email/password, email codes/links, and up to 3 social connections. Upgrade to **Pro ($25/month)** only if you need MFA, passkeys, custom session lifetime, or removal of Clerk branding.

**Where:** https://dashboard.clerk.com

### Steps

1. Create a Clerk account and a new application named **SIT Learning Hub**.
2. Choose sign-in options:
   - Enable **Email + Password** first.
   - Add **Google** later if students should use Google accounts.
3. Open **API keys** and copy:
   - Publishable key (`pk_test_...` in development).
   - Secret key (`sk_test_...` in development).
4. Add to `.env.local`:
   ```dotenv
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
5. Configure allowed origins/redirect URLs:
   - `http://localhost:3000`
   - Your Vercel preview/production domains.
6. Optional later: create a webhook endpoint and set `CLERK_WEBHOOK_SIGNING_SECRET`. Phase 1 can use lazy user sync instead of webhooks, so this is not required initially.
7. Create your own account after the app runs. Set `ADMIN_EMAILS` to that email and run the admin bootstrap script.

**Do not:**

- Put `CLERK_SECRET_KEY` in client code or any `NEXT_PUBLIC_` variable.
- Add an "admin" role selector to public signup.
- Use production keys in development.

**Status:** [ ] application created  [ ] email/password enabled  [ ] keys stored locally  [ ] production instance/keys created

---

## 5. Groq (AI inference) - required Phase 4/9

**Use for:** rubric-based answer feedback (Phase 4) and the persistent AI teacher/mentor (Phase 9).

**Plan to pick:** start on the **free tier**; move to pay-as-you-go only if rate limits are hit. As of 2026-11-02, Groq lists these production models:

| Model ID | Use | Notes |
| --- | --- | --- |
| `openai/gpt-oss-120b` | Primary reasoning/teaching/grading | Recommended default; 131k context |
| `openai/gpt-oss-20b` | Fast/cheap classification, summaries, simple feedback | Recommended fallback |
| `llama-3.1-8b-instant` | Possible fast option | Check current availability/pricing; may be enterprise |
| `llama-3.3-70b-versatile` | Possible alternative | Listed as enterprise/contact-sales on inspection date; do not hardcode |

**Where:** https://console.groq.com/keys

### Steps

1. Sign up at https://console.groq.com.
2. Open **API Keys** -> **Create API Key**.
3. Name it `sit-learning-hub-dev`.
4. Copy the key once (it is not shown again).
5. Add to `.env.local`:
   ```dotenv
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_...
   GROQ_MODEL=openai/gpt-oss-120b
   GROQ_FAST_MODEL=openai/gpt-oss-20b
   ```
6. Check the current model catalogue before changing model IDs:
   ```powershell
   curl.exe https://api.groq.com/openai/v1/models -H "Authorization: Bearer $env:GROQ_API_KEY"
   ```

**Notes:**

- Groq's catalogue and pricing change. Model IDs are configuration, not constants.
- Use a separate key for development and production.
- Set spend/rate alerts in the Groq console if available.
- AI output is never authoritative for progression; backend rules decide pass/fail.

**Status:** [ ] account created  [ ] dev key stored locally  [ ] model IDs verified  [ ] production key stored in Vercel

---

## 6. Cloudflare R2 (document and evidence storage) - Phase 6/7

**Use for:** original exam PDFs, page images, diagrams, project evidence, portfolio files.

**Plan to pick:** **R2 Standard, free tier** (10 GB storage, 1M Class A operations, 10M Class B operations, free egress). This is a better fit than Vercel Blob Hobby (1 GB) for exam archives.

**Where:** https://dash.cloudflare.com -> R2

### Steps

1. Create a Cloudflare account.
2. Open **R2** -> **Create bucket**.
3. Name it `sit-learning-hub-documents`; keep it **private**.
4. Create an API token:
   - R2 -> **Manage R2 API Tokens** -> **Create API token**.
   - Permissions: **Object Read & Write** for this bucket only.
5. Copy:
   - Account ID (R2 overview).
   - Access key ID.
   - Secret access key.
   - Endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.
6. Add to `.env.local`:
   ```dotenv
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET=sit-learning-hub-documents
   R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   ```

**Notes:**

- Keep originals private unless the licence explicitly permits public distribution.
- Use signed URLs or server streaming; never expose the secret key to the browser.
- Do not upload student data or copyrighted papers until the privacy/licensing decisions are approved.

**Status:** [ ] bucket created  [ ] API token created  [ ] credentials stored locally  [ ] production credentials stored in Vercel

---

## 7. Vercel (deployment)

**Use for:** preview and production hosting, environment variables, cron jobs, logs.

**Plan to pick:** **Hobby** for development and personal previews. **Pro ($20/month)** if this is an institutional/commercial deployment or you need team roles; Hobby is for personal, non-commercial use.

**Where:** https://vercel.com/new

### Steps

1. Sign in with GitHub.
2. Import `sibby-killer/SIT-Learning-Hub`.
3. Add environment variables for **Production** and **Preview** separately.
4. Set the function region to **`jnb1` (Johannesburg)** if available, to be closer to Kenya.
5. Deploy a preview after Phase 1.
6. Add the production domain and update Clerk allowed origins.

**Notes:**

- Do not put secrets in `vercel.json` or repository files.
- Preview deployments should use a separate Clerk instance or allowed preview origins.
- Vercel serverless filesystems are ephemeral; use R2 for uploads.

**Status:** [ ] account created  [ ] project imported  [ ] preview env vars set  [ ] production env vars set

---

## 8. Mastra observability - Phase 9

**Use for:** tracing agent runs, prompts, tool calls, latency, and token usage.

**Plan to pick:** no hosted key is required for the initial build. Use Mastra Studio locally and OpenTelemetry/Sentry later if production tracing is needed.

**Privacy:** traces may contain prompts and learner context. Do not enable production tracing with real student data until the privacy decision is approved; redact or disable it if required.

**Status:** [x] built in - no key needed for Phase 1

---

## 9. Upstash Redis (optional rate limiting) - Phase 11

**Use for:** distributed rate limiting on AI/upload endpoints in serverless deployments.

**Plan to pick:** Free.

**Where:** https://console.upstash.com

```dotenv
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Status:** [ ] optional - only if needed after load testing

---

## 10. Sentry (optional error monitoring) - Phase 11

**Use for:** error tracking and performance monitoring.

**Plan to pick:** Free/developer.

**Where:** https://sentry.io

```dotenv
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
```

**Status:** [ ] optional

---

## 11. OCR providers (optional) - Phase 6

**Default:** no paid key. Use:

- `pdfjs-dist` for PDF text layers.
- Page rendering for visual inspection.
- `tesseract.js` for scanned pages.
- Mandatory human review.

If OCR quality is insufficient for scanned MMUST papers, evaluate:

| Provider | Where | Notes |
| --- | --- | --- |
| OCR.Space | https://ocr.space/ocrapi | Free tier; simple API; check data retention terms |
| Google Cloud Vision / Document AI | https://cloud.google.com/document-ai | Strong OCR; paid; configure service account JSON |
| Mistral OCR / other document AI | Provider site | Evaluate on real sample papers; check cost and data terms |

```dotenv
OCR_PROVIDER=local
OCR_SPACE_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS_JSON=
```

Do not send unpublished or copyrighted exam papers to a third-party OCR service without checking its data-retention and confidentiality terms.

**Status:** [ ] local pipeline first  [ ] paid provider only if quality requires it

---

## 12. MMUST / MUT examination repositories

No API key is required for public repository pages, but access and licensing must be verified.

| Source | URL | Inspection result (2026-11-02) |
| --- | --- | --- |
| MMUST Exam Bank | https://exambank.mmust.ac.ke/ | DNS resolves; TCP 80/443 timed out from this network. May require campus network/VPN or may be temporarily down. |
| MMUST Library | https://library.mmust.ac.ke | Reachable; links to the exam bank |
| Meru University Exam Papers | https://exampapers.must.ac.ke | Transport error from this network |
| Murang'a University Exams Bank | https://exambank.mut.ac.ke/xmlui | Reachable DSpace repository (supplementary source only) |

See [CONTENT-SOURCES.md](CONTENT-SOURCES.md) for rules. Do not scrape indiscriminately, do not bypass access controls, and do not label another institution's paper as MMUST.

**Status:** [ ] MMUST access confirmed  [ ] permission/licence clarified  [ ] sample PDFs provided

---

## 13. Non-key configuration

| Variable | Purpose | How to set |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Absolute app URL for links/webhooks | `http://localhost:3000` locally; production domain in Vercel |
| `ADMIN_EMAILS` | Bootstrap first administrator(s) | Comma-separated emails; one-time seed/promotion |
| `CRON_SECRET` | Protect scheduled/internal endpoints | Generate with `openssl rand -hex 32` or PowerShell random bytes |
| `AI_PROVIDER` | Select provider implementation | `groq` initially |
| `OCR_PROVIDER` | Select OCR pipeline | `local` initially |

Generate a cron secret on Windows PowerShell:

```powershell
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object { [char]$_ })
```

Use a cryptographically secure generator for production.

---

## 14. Security rules for keys

1. **Never** commit `.env.local`, `.env`, tokens, service-account JSON, or screenshots containing keys.
2. **Never** put secrets in `NEXT_PUBLIC_*` variables. Those are embedded in the browser bundle.
3. Use separate development, preview, and production credentials.
4. Rotate a key immediately if it appears in a commit, log, chat, or screenshot.
5. Restrict provider keys where possible (R2 bucket scope, Clerk instance, Groq project).
6. Store production secrets only in the hosting provider's encrypted environment settings.
7. Do not let the AI agent read `.env` files or secrets; the agent has no secret access.
8. Review `git diff` before every commit for accidental secrets.
9. Enable MFA on the GitHub, Clerk, Turso, Cloudflare, Groq, and Vercel accounts.
10. Do not send student data or copyrighted exam papers to external AI/OCR providers until the privacy/licensing review is complete.

---

## 15. What to do right now

Create these three accounts and keys, then place them in `.env.local` (do not send them in chat):

1. **Turso** - create `sit-learning-hub`, choose the closest region, create a token.
2. **Clerk** - create the app, enable email/password, copy both keys.
3. **Groq** - create a dev key; keep the default model `openai/gpt-oss-120b`.

Optional now: create the Cloudflare R2 bucket if you already have exam PDFs to store later.

When the keys are in `.env.local`, tell me only **"keys are set"** - never the values. I will verify the app can read them without printing them.
