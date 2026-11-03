# SIT Learning Hub - Setup and Development Guide

**Status:** Phases 1-2 implemented. The scaffold, identity and curriculum schemas, migrations, seed, auth integration, admin curriculum workflow, published catalog, tests, CI, and Mastra scaffold exist. Live sign-in and browser admin mutations require the Turso and Clerk keys.

---

## 1. Prerequisites

| Tool | Version used/required | Notes |
| --- | --- | --- |
| Node.js | 24.x (`.nvmrc` pins 24) | Mastra requires Node 22.13+; use 24 |
| npm | 11.x | Lockfile is committed |
| Git | 2.54+ | Remote already configured |
| Turso CLI | Latest | Install when creating the remote database |
| Playwright browsers | Latest | Installed in Phase 1 |
| GitHub account | `sibby-killer` | Repository write access required |

Optional during development:

- Vercel CLI for preview deployments.
- Cloudflare dashboard access for R2 (Phase 6+).
- A code editor with ESLint/Prettier integration.

Check:

```powershell
node --version
npm --version
git --version
```

---

## 2. Current repository state (Phase 2)

The repository contains:

```text
README.md
.gitignore
.nvmrc
.env.example
package.json / package-lock.json
next.config.ts / tsconfig.json / eslint.config.mjs
drizzle.config.ts
drizzle/
  0000_chemical_fixer.sql
  0001_fearless_deadpool.sql
e2e/
  smoke.spec.ts
  curriculum.spec.ts
src/
  app/                      pages, auth routes, health, Clerk webhook, curriculum admin
  components/               brand, layout, providers, admin, UI primitives
  db/                       identity + curriculum schema, client, seed
  lib/                      env, auth, permissions, curriculum services/rules, setup, utils
  mastra/                   lazy Mastra instance and teacher agent
  test/                     Vitest setup
docs/
  AUDIT.md
  ARCHITECTURE.md
  API-KEYS.md
  CONTENT-SOURCES.md
  IMPLEMENTATION-STATUS.md
  SETUP.md
.github/workflows/ci.yml
```

Without keys the app runs in preview mode: public pages, setup status, student/admin previews, and the health endpoint work; sign-in and persisted data do not.

---

## 3. Installed scaffold and dependencies

The scaffold uses Next.js 16.4.3, React 19.3, TypeScript, and Tailwind CSS 4 with Turbopack. Core dependencies:

```powershell
npm install @clerk/nextjs @libsql/client @mastra/core @mastra/libsql @mastra/memory drizzle-orm zod server-only
npm install @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge
npm install -D drizzle-kit vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test tsx
```

Mastra is installed in Phase 1 so the agent boundary and Turso-backed memory are part of the foundation. Agent tools, workflows, and evaluations are implemented in Phases 4 and 9.

Storage dependencies are added in Phase 6/7:

```powershell
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Do not install optional packages before the phase that uses them.

---

## 4. Environment setup

1. Copy the template:

```powershell
Copy-Item .env.example .env.local
```

2. Fill in the required values. See [API-KEYS.md](API-KEYS.md) for acquisition steps.

Current minimum (Phases 1-2):

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
TURSO_DATABASE_URL=file:./.data/local.db
TURSO_AUTH_TOKEN=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
ADMIN_EMAILS=your-email@example.com
```

Phase 4/9 minimum:

```dotenv
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=groq/openai/gpt-oss-120b
GROQ_FAST_MODEL=groq/openai/gpt-oss-20b
```

Rules:

- Never commit `.env.local` or any real key.
- Never expose a secret with `NEXT_PUBLIC_`.
- Use separate Clerk/Turso projects or tokens for development, preview, and production.
- Rotate any key that has been pasted into chat, logs, or a commit.

---

## 5. Database setup

### 5.1 Local development (no cloud dependency)

```dotenv
TURSO_DATABASE_URL=file:./.data/local.db
TURSO_AUTH_TOKEN=
```

Create the `.data` directory; it is git-ignored.

### 5.2 Remote Turso database

```powershell
turso auth signup
turso db create sit-learning-hub
turso db show sit-learning-hub --url
turso db tokens create sit-learning-hub
```

Put the URL and token in `.env.local`. Choose the region closest to Kenya; verify with:

```powershell
turso db locations
```

### 5.3 Migrations

Scripts:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/db/seed.ts"
  }
}
```

Workflow:

```powershell
npm run db:generate
npm run db:migrate
npm run db:seed
```

- Commit generated migrations.
- Test migrations against a fresh local database before applying to a remote database.
- Prefer `db:migrate`; `db:push` is for disposable local databases only. Never use `drizzle-kit push` against production.
- The Phase 1 migration is `drizzle/0000_chemical_fixer.sql`; Phase 2 adds `drizzle/0001_fearless_deadpool.sql`.
- The local seed writes five `system_settings` rows plus one MMUST institution, one draft BIT programme, two academic years, three semesters, and seven draft/unverified units. Seeded curriculum is not published and cannot be published until an administrator marks the programme and unit verified; nothing is presented as official by default.

---

## 6. Authentication setup (Clerk, implemented)

1. Create a Clerk application.
2. Enable Email + Password; optionally enable Google later.
3. Copy the publishable and secret keys into `.env.local`.
4. Configure allowed redirect URLs for local and deployed origins:
   - `http://localhost:3000`
   - `https://<production-domain>`
   - Vercel preview URLs as needed.
5. First admin: set `ADMIN_EMAILS` to your email, then run the seed/promotion script. Do not add an "admin" option to public signup.
6. Next.js 16 uses `src/proxy.ts` for Clerk middleware. The integration stays inactive until both Clerk keys are present.
7. Optional: create a Clerk webhook pointing at `/api/webhooks/clerk` and set `CLERK_WEBHOOK_SIGNING_SECRET`.

---

## 7. Running the app

```powershell
npm run dev
```

Open http://localhost:3000.

Quality commands:

```powershell
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/db/seed.ts"
  }
}
```

---

## 8. Phase workflow

Every phase follows the same loop:

1. Confirm the phase scope and acceptance criteria.
2. Check for new required keys/services; update `.env.example` and [API-KEYS.md](API-KEYS.md).
3. Implement in small vertical increments.
4. Add/update tests with the code.
5. Run typecheck, lint, tests, and build.
6. Fix failures before proceeding.
7. Update [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md) and, if relevant, [ARCHITECTURE.md](ARCHITECTURE.md), [CONTENT-SOURCES.md](CONTENT-SOURCES.md), and [SETUP.md](SETUP.md).
8. Commit with a phase-scoped message.
9. Push to `origin/main`.
10. Report: implemented, how it works, files, DB changes, tests/results, limitations, next step.

Do not start the next phase if critical tests fail.

---

## 9. Git and GitHub workflow

Current remote:

```powershell
git remote -v
# origin  https://github.com/sibby-killer/SIT-Learning-Hub.git (fetch)
# origin  https://github.com/sibby-killer/SIT-Learning-Hub.git (push)
```

Commit style:

```text
feat(phase-1): scaffold foundation, auth, and role guards
feat(phase-2): add curriculum schema and admin management
fix(phase-4): enforce topic pass rule in transaction
docs(phase-0): add audit and implementation plan
```

Before committing:

```powershell
git status
git diff --stat
git diff
```

Never commit `.env.local`, keys, generated databases, uploaded PDFs, or student data.

Push:

```powershell
git push -u origin main
```

If authentication fails, sign in through Git Credential Manager or a personal access token with repository write access. Do not paste tokens into the repository or chat.

---

## 10. Deployment (Phase 11, previews earlier)

1. Import the GitHub repository into Vercel.
2. Set the project root to the repository root.
3. Add environment variables for Production and Preview separately.
4. Set the function region to `jnb1` (Johannesburg) if available.
5. Configure the Turso production database and run migrations before the first deploy.
6. Configure Clerk production keys and allowed origins.
7. Configure R2 CORS/signed URL access when storage is added.
8. Deploy a preview and test the full auth/learning flow.
9. Verify production build, protected routes, migrations, AI health, and storage access before declaring success.

Vercel Hobby is intended for personal, non-commercial use. Confirm the deployment model for an institutional launch.

---

## 11. Troubleshooting

| Problem | Likely cause / action |
| --- | --- |
| App loads but sign-in shows "not configured" | Add both Clerk keys to `.env.local` and restart |
| Vercel build fails on `/sign-in` with `usePathname()` outside `<Suspense>` | Keep `export const instant = false` and the `<Suspense>` wrapper around `<SignIn />` / `<SignUp />`; Clerk reads runtime path data |
| Dashboard/admin shows preview mode | Add Turso + Clerk keys; preview mode is intentional without them |
| Clerk redirect loop | Check allowed origins/redirect URLs and `src/proxy.ts` matcher |
| Turso `AUTH_TOKEN` error | Remote URL used without a valid token; use `file:` for local dev |
| Migrations target the wrong DB | Check `.env.local`; keep a separate production env file |
| `SQLITE_BUSY` / write contention | Shorten transactions; avoid concurrent schema changes; retry with backoff |
| AI model 404/deprecated | Update `GROQ_MODEL` after checking the provider catalogue |
| Upload fails in production | Local filesystem is ephemeral on Vercel; use R2 |
| Dates off by one day | Use date-only strings and `Africa/Nairobi` helpers; avoid UTC midnight conversions |

---

## 12. Security checklist before real users

- [ ] All secrets are server-only and absent from git history.
- [ ] Clerk production instance configured with correct origins.
- [ ] Role checks tested server-side, not only in UI.
- [ ] Cross-user access tests pass.
- [ ] Exam final-mode restrictions tested.
- [ ] Upload MIME/size/magic-byte validation tested.
- [ ] Rate limiting enabled on AI/upload endpoints.
- [ ] Audit logging enabled for admin/reviewer actions.
- [ ] Privacy notice, retention, export/delete paths defined.
- [ ] Backups/restore tested.
