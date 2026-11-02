# SIT Learning Hub - Phase 0 Audit

**Inspection date:** 2026-11-02  
**Specification:** `SIT-Learning-Hub-Full-PRD-and-OpenCode-Instructions.txt` (2,218 lines)  
**Repository:** https://github.com/sibby-killer/SIT-Learning-Hub  
**Auditor role:** product director / architect / full-stack engineer / AI engineer / QA lead

---

## 1. Executive summary

The repository is **greenfield**. At inspection time it contained only the master PRD. There is no application code, package manifest, database schema, migration, authentication, AI integration, test suite, CI pipeline, or deployment configuration.

This is not a case of auditing an existing product and preserving working features. The main Phase 0 finding is that **every product requirement is not started**, and several requirements are blocked on content, source access, provider accounts, or product decisions.

Recommended approach:

1. Approve the stack and the decisions in section 11.
2. Build a **vertical slice** in phases: foundation -> curriculum -> learning -> assessment -> calendar, using one pilot unit with clearly labelled draft content.
3. Add the examination bank, practical learning, career development, AI agent, and gamification in the PRD order, but gate the examination bank on verified source access and licensing.
4. Do not mass-produce curriculum or past-paper content. The platform can be built now; authoritative content and exam sources must be verified separately.

**Current product implementation score:** 0 of the 11 implementation phases (1-11) are implemented. Phase 0 documentation is the only deliverable completed; user approval is still pending.

---

## 2. Inspection evidence

| Check | Result |
| --- | --- |
| Local working directory | Only `SIT-Learning-Hub-Full-PRD-and-OpenCode-Instructions.txt` present before setup |
| GitHub API | Repository public, default branch `main`, `size: 0`, created 2026-11-02, no commits |
| `git ls-remote` | Succeeded with no refs (empty repository) |
| `package.json` / lockfile | Not present |
| Application source (`app/`, `src/`, `pages/`) | Not present |
| Database schema / migrations / seeds | Not present |
| Authentication / authorization | Not present |
| AI integration (Mastra / Groq / other) | Not present |
| Tests / CI / deployment config | Not present |
| Documentation | Only the PRD |
| Local toolchain | Node.js 24.15.0, npm 11.12.1, Git 2.54.0, GitHub CLI not installed |
| Git identity | `sibby-killer <sibby9531@gmail.com>` configured |

**Conclusion:** there is no existing implementation to compare feature-by-feature. The comparison is therefore PRD-to-zero, documented as a requirements checklist.

---

## 3. Current project overview

### 3.1 Existing technology stack

None. The repository has no stack yet.

### 3.2 Existing functionality

None. No user can register, sign in, view a unit, take an assessment, use an AI assistant, or access an admin area.

### 3.3 Existing working functionality that must be preserved

Only the master PRD and the Phase 0 documentation pack. There is no application behaviour to preserve. From Phase 1 onward, each phase must add regression tests so future work preserves working behaviour.

### 3.4 Non-code assets present

- Master PRD at the repository root.
- Phase 0 documentation under `docs/`.
- `.env.example` containing placeholders only.
- `.gitignore`, `.nvmrc`, `README.md`.

No API keys, curriculum content, past papers, student data, or proprietary assets are present.

---

## 4. Gap analysis against the PRD

Status legend: **Not started**, **In progress**, **Implemented**, **Tested**, **Verified**, **Blocked**.

### 4.1 Summary by PRD area

| PRD area | Current status | Phase | Main gap / dependency |
| --- | --- | --- | --- |
| Identity, auth, roles, profiles | Not started | 1 | Auth provider decision and keys |
| Application shell, navigation, design system | Not started | 1 | Design direction approval |
| Curriculum data model and admin | Not started | 2 | Official MMUST curriculum verification |
| Unit overview, topics, notes, resources | Not started | 3 | Authoritative content; content authoring workflow |
| Personal notes | Not started | 3 | None beyond foundation |
| Written assessment engine and feedback | Not started | 4 | Groq key for AI grading; rubric design |
| Topic pass rule and backend unlocking | Not started | 4 | None; must be server-enforced |
| Unit assessment | Not started | 4 | Question bank/content |
| Study duration and unit calendar | Not started | 5 | Scheduling rules approval |
| Dashboard aggregation | Not started | 5/10 | Depends on earlier data |
| Examination source inventory | Not started / **Blocked** | 6 | MMUST exam bank unreachable from this network on inspection date; licensing/access |
| PDF import, OCR, extraction, review | Not started | 6 | Storage choice; OCR quality; human review workflow |
| Curriculum mapping and confidence | Not started | 6 | Verified learning outcomes |
| Duplicate detection and clusters | Not started | 6 | None technical; needs real questions to tune |
| Practice / mock / final exam modes | Not started | 6 | Exam bank and server-side restrictions |
| Practical activities and projects | Not started | 7 | Content authoring; storage for evidence |
| Career profile, skills, portfolio | Not started | 8 | Privacy controls |
| Persistent AI teacher / career mentor | Not started | 9 | Groq key; Mastra agent design; context/tools |
| AI safety, permissions, audit | Not started | 9 | Must be designed before tools are exposed |
| XP, streaks, achievements, leaderboard | Not started | 10 | XP rules and privacy decisions |
| Admin content management and analytics | Not started | 2+ | Grows with each phase |
| Multi-student isolation and security | Not started | 1+ | Must be built into queries and tests |
| Testing, accessibility, deployment | Not started | 1+ / 11 | CI and provider accounts |

### 4.2 Detailed requirements checklist

The full checklist with requirement IDs, phase, status, and blockers is maintained in [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md). It covers:

- Foundation and identity (8 requirements)
- Curriculum (10)
- Learning experience (12)
- Assessment and progression (10)
- Study calendar (8)
- Examination bank (14)
- Practical learning (8)
- Career development (8)
- AI teacher and mentor (14)
- Dashboard and gamification (10)
- Administration, security, privacy, quality (20+)

No product requirement is marked Implemented, Tested, or Verified. Documentation-only items are marked Implemented where genuinely complete.

---

## 5. Existing bugs and technical risks

There are no code bugs because there is no code. The risks below are specification, delivery, and dependency risks.

| ID | Risk | Severity | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| R-01 | The PRD assumes an existing project, but the repository is empty | High | The "preserve existing functionality" instruction has no baseline; all estimates assume greenfield | Confirm this is the intended repository and approve greenfield build |
| R-02 | Curriculum unit list is explicitly unverified | High | Publishing wrong units/semesters would mislead students | Store as draft; verify against official MMUST documents; require admin publish |
| R-03 | No authoritative notes/topics content supplied | High | The platform can be technically complete but educationally empty | Pilot one unit; author draft content labelled as unverified; build authoring/review workflow |
| R-04 | MMUST examination bank unreachable on 2026-11-02 (`exambank.mmust.ac.ke` resolves but TCP 80/443 timed out) | High | Phase 6 primary source blocked | Try campus network/VPN; request user-supplied PDFs; use other repositories only as labelled supplementary sources |
| R-05 | Past-paper copyright/licensing unclear | High | Republishing PDFs or large extracts may breach terms | Store source references; restrict access; seek permission; publish only approved metadata/extracts |
| R-06 | OCR/diagram extraction quality | Medium | Scanned papers, equations, circuits and tables may be corrupted | Text layer first; Tesseract fallback; page images; mandatory human review; never silently drop diagrams |
| R-07 | AI grading treated as truth | High | Wrong pass/fail decisions damage trust | Rubrics, deterministic numeric checks, confidence, human review, backend authority for progression |
| R-08 | AI prompt injection via notes/PDFs/user text | High | Tool misuse or data leakage | Treat retrieved content as untrusted; fixed tool allowlist; server-side permission checks; no arbitrary SQL/tools |
| R-09 | Scope is very large (11 phases) | High | Partial features and burnout | Phase gates, vertical slice, explicit acceptance criteria, no phase skipping |
| R-10 | Auth vendor choice and cost | Medium | Clerk Hobby has limits (e.g. fixed 7-day session, no MFA on Hobby); Pro costs $25/mo | Approve Clerk or choose self-hosted auth; design role checks in DB regardless |
| R-11 | Vercel Hobby is for personal/non-commercial use | Medium | A university deployment may require Pro | Decide deployment model and budget; self-hosting is possible |
| R-12 | Turso is a single-writer SQLite-compatible system | Medium | Write contention under heavy concurrent assessment traffic | Keep writes short; index; avoid long transactions; monitor quotas; plan for scale |
| R-13 | Groq model catalogue changes | Medium | Hardcoded model IDs can break | Configurable `GROQ_MODEL`; provider abstraction; startup health check |
| R-14 | Exam final-mode integrity | High | Users could bypass restrictions via API or assistant | Server-side attempt state, mode checks, timestamping, answer locking, no AI tools in final mode |
| R-15 | Student data privacy (Kenya DPA 2019, institutional policy) | High | Reputational/legal exposure | Privacy notice, data minimisation, access control, retention policy, export/delete workflow |
| R-16 | Windows development vs Linux deployment | Low/Medium | OCR binaries and file paths may differ | Prefer pure JS libraries or scripts run in CI/Linux; test build in production-like environment |
| R-17 | Next.js 16 / React 19 / Tailwind 4 / Clerk proxy changes | Medium | Ecosystem examples may be outdated | Pin versions; follow current official docs; test early |
| R-18 | Date/time semantics for calendars | Medium | Tasks may appear on wrong day | Store date-only tasks in `Africa/Nairobi`; define week boundaries; test DST-free assumptions |
| R-19 | Leaderboard privacy and fairness | Medium | Leaking private records or incentivising gaming | Opt-in, minimal public fields, XP only for verified milestones, duplicate-XP constraints |
| R-20 | No background job system chosen for OCR/import | Medium | Long jobs may exceed serverless limits | Use CLI/offline pipeline with DB job records first; add queue only if needed |

---

## 6. Architecture assessment

### 6.1 Assessment of the current architecture

There is no architecture to assess. The PRD's preferred direction is sound and appropriate for a greenfield build:

- Next.js + TypeScript for a single full-stack application.
- Turso + Drizzle for a relational, SQLite-compatible schema.
- Clerk for authentication if approved.
- Mastra + Groq behind a provider boundary, with tools, persistent memory, and workflows.
- Vercel for deployment.
- GitHub for source control.

### 6.2 Recommended architecture

Use a layered modular monolith, not a collection of page-level scripts:

```text
src/
  app/                    Next.js routes, layouts, server actions, route handlers
  components/             reusable UI and domain components
  lib/                    env, auth, permissions, errors, dates, formatting
  db/                     Drizzle schema, client, migrations, seeds, queries
  services/               business logic by domain
  ai/                     provider abstraction, context builder, graphs, tools
  validation/             Zod schemas shared by server and forms
  jobs/                   CLI pipelines for exam import/OCR/extraction
  types/                  shared domain types
tests/
  unit/ integration/ e2e/ security/ ai/
docs/
```

Rules:

- Server Components read; Server Actions/Route Handlers mutate.
- Page components compose; services decide; repositories query.
- Every mutation validates with Zod server-side and checks ownership/role.
- AI calls go through `AIProvider`; no page imports a vendor SDK directly.
- Long-running OCR/import work runs in `jobs/` or a worker, not inside a normal request.
- Database migrations are committed; no `db push` in production.

### 6.3 Database strategy

Create the schema in phase-gated slices, not all at once:

1. Phase 1: users, roles, user_roles, permissions, role_permissions, profiles, audit_logs.
2. Phase 2: institutions, programmes, academic_years, semesters, units, learning_outcomes, topics, topic_prerequisites, topic_outcomes, resources.
3. Phase 3: personal_notes, resource_progress, topic_progress, unit_progress, outcome_progress.
4. Phase 4: questions, exercises, assessments, assessment_questions, attempts, attempt_answers, rubrics (JSON initially).
5. Phase 5: study_plans, calendar_tasks, task_reschedules.
6. Phase 6: source_repositories, source_documents, exam_questions, question_mappings, duplicate_clusters, duplicate_members, review_records, exam_attempts.
7. Phase 7: skills, practical_activities, unit_skills, projects, project_milestones, project_deliverables, project_reviews, skill_evidence.
8. Phase 8: career_profiles, career_skills, career_milestones, portfolio_items.
9. Phase 9: ai_threads, ai_messages, ai_thread_state, ai_tool_logs.
10. Phase 10: xp_transactions, streaks, achievements, user_achievements, leaderboard_snapshots.
11. Phase 11: system_settings, content_reviews, retention/cleanup records if not already added.

Data integrity requirements:

- Foreign keys enabled; unique constraints on natural keys.
- Indexes on ownership, unit/topic, status, and date columns.
- Soft deletion (`deleted_at`) for user content and published content.
- Transactions for progression, attempts, XP, and rescheduling.
- Audit logs for admin/reviewer actions and AI tool calls.
- No client-supplied scores, pass flags, roles, or ownership IDs.

Detailed tables and relationships are in [ARCHITECTURE.md](ARCHITECTURE.md).

### 6.4 Authentication and authorization

Recommended: Clerk, with the application database as the source of truth for roles and permissions.

- Clerk owns identity, sessions, email verification, and password reset.
- `users` maps `clerk_id` to an application user.
- Roles: `student`, `reviewer`, `admin`; model as roles + `user_roles` for future expansion.
- Bootstrap the first admin via a one-time seed script restricted by `ADMIN_EMAILS`, not by a public signup checkbox.
- Middleware/proxy protects route groups; every server action and service re-checks authorization (defence in depth).
- Never trust Clerk metadata alone for sensitive operations; read roles from the database.

Alternative if Clerk is rejected: Better Auth or Auth.js with a credentials/OAuth provider. This adds implementation time and operational responsibility.

### 6.5 AI architecture

- Mastra agent orchestration; Groq as initial inference provider.
- `AIProvider` interface with `chat`, `stream`, `structured`, and model configuration.
- Context builder composes only the current learner's permitted data: profile, programme, unit, topic, outcomes, approved notes, resources, recent attempts, weak outcomes, calendar, practical evidence, career interests.
- Retrieval: structured SQL filters plus SQLite FTS5 over approved content initially. Add embeddings/vector search only if evaluation shows it is needed.
- Persistence: `ai_threads`, `ai_messages`, `ai_thread_state`; build context from structured data rather than a single long prompt.
- Tools: read-only first (`get_unit`, `get_topic`, `get_progress`, `get_calendar`, `get_attempts`, `get_skills`). Any write tool requires explicit scope, validation, and confirmation.
- Safety: no role changes, no direct result changes, no topic unlocking, no cross-student access, no arbitrary SQL, no exam assistance in final mode, no secrets.
- Observability: tool logs, latency/token metrics, optional LangSmith.

### 6.6 Examination pipeline architecture

Treat it as an offline, reviewable pipeline:

1. Source inventory (institution, repository, collection, unit, year, session, URL, access, format).
2. Fetch/preserve original document unchanged; checksum; private storage.
3. Extract text layer; OCR only where needed; render page images.
4. Segment questions and subquestions; preserve marks, numbering, page references, diagrams, tables, equations.
5. LLM-assisted extraction produces *draft* records with confidence; humans correct and verify.
6. Map to verified learning outcomes with HIGH/MEDIUM/LOW confidence; only approved HIGH and reviewed MEDIUM enter the main bank.
7. Duplicate detection: normalisation, SHA-256 exact hash, string similarity, optional embeddings; keep every occurrence; cluster, never delete.
8. Review workflow with audit history; publish only verified records.
9. Exam modes enforced server-side; practice/mock/final have different tool and feedback permissions.

### 6.7 Storage architecture

- Local filesystem driver for development.
- Cloudflare R2 for production documents and evidence (10 GB free, free egress) or Vercel Blob if simplicity matters more than capacity.
- Private buckets; signed/streamed access; no public original PDFs unless licensing explicitly permits.
- Store metadata and checksums in the database, not only in object keys.

---

## 7. Database changes required

There is no existing database, so this is a new schema. Do not create all tables at once. The phase-gated plan above is the required change sequence.

Key schema decisions:

- IDs: `text` ULIDs/UUIDs generated server-side, not auto-increment integers exposed to clients.
- Timestamps: UTC ISO strings plus date-only fields for calendar tasks.
- JSON columns only for flexible rubric/state/metadata, not for core relationships.
- Enums: SQLite text with CHECK constraints or Drizzle `text({ enum: [...] })`.
- Money/credits: none in the initial product.
- Soft delete: `deleted_at` on user content and curriculum/admin records; hard delete only for retracted drafts with audit.
- Versioning: unit/topic/resource versions or revision records; published snapshots where needed.
- FTS: personal notes and approved learning content; add triggers or maintain indexes in service code.

---

## 8. AI infrastructure requirements

| Requirement | Recommendation | Status |
| --- | --- | --- |
| Orchestration | Mastra (`@mastra/core`, `@mastra/libsql`, `@mastra/memory`) | Not started |
| Model provider | Groq through Mastra's model router | Key required |
| Primary model | `groq/openai/gpt-oss-120b` (configurable) | Verify availability/rate limits at setup |
| Fast model | `groq/openai/gpt-oss-20b` | Verify availability/rate limits |
| Structured output | Zod schemas; validate every model response | Not started |
| Persistence | Database messages/thread state; no reliance on in-memory saver | Not started |
| Retrieval | Structured SQL + FTS5 over approved content | Not started |
| Tools | Allowlisted, permission-checked server functions | Not started |
| Safety | Prompt-injection defences, exam-mode restrictions, audit logs | Not started |
| Evaluation | Fixture-based tests with a fake provider; human review samples | Not started |
| Observability | Logs; optional LangSmith tracing | Not started |

**Important model note:** provider catalogues change. As of 2026-11-02, Groq's model page lists `openai/gpt-oss-120b` and `openai/gpt-oss-20b` as production models, while Llama 3.3 70B is shown under enterprise/contact-sales. Hardcode nothing; use environment configuration and a health check.

---

## 9. Required environment variables and external services

Immediate (Phase 1):

- Turso: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- App: `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAILS`

Phase 4 / 9:

- Groq: `GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_FAST_MODEL`
- Optional observability: Sentry; Mastra tracing is built in

Phase 6-8:

- Cloudflare R2: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`
- Optional OCR: `OCR_PROVIDER`, `OCR_SPACE_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS_JSON`

Phase 10-11:

- Optional Upstash Redis: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Optional Sentry: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- `CRON_SECRET`

Exact acquisition steps and recommended plans are in [API-KEYS.md](API-KEYS.md).

---

## 10. Phased implementation roadmap

Each phase ends with: typecheck, lint, unit/integration tests, production build where appropriate, documentation update, commit, and push. A phase is not complete while critical tests fail.

| Phase | Scope | Key deliverables | Acceptance gate | Size | Dependencies / blockers |
| --- | --- | --- | --- | --- | --- |
| 0 | Audit and decisions | Audit, checklist, architecture, setup, API-key guide, content-source record | Plan approved | S | User approval |
| 1 | Foundation | Next.js scaffold, design tokens, env validation, Drizzle/Turso, Clerk, users/roles, route groups, CI, tests | User signs in; student/admin areas separated; migrations and checks pass | M | Clerk + Turso keys; stack approval |
| 2 | Curriculum management | Institution/programme/year/semester/unit/outcome/topic/prerequisite schema; admin CRUD; publish workflow; student catalog | Admin creates curriculum; student sees only published units; no hardcoded curriculum | M | Verified curriculum for real data; pilot unit can be draft |
| 3 | Learning experience | Unit overview, topic sequence, structured notes, resources/videos, personal notes, exercises, completion/progress | Student completes a full topic flow; notes CRUD; prerequisites enforced server-side | L | Pilot content; resource links |
| 4 | Assessment engine | Written questions, rubrics, attempts, typed answers, deterministic checks, AI-assisted feedback, 60% pass rule, backend unlocking, unit assessment | Backend enforces progression; retakes recorded; feedback is structured; frontend cannot unlock | L | Groq key for subjective grading; rubric review |
| 5 | Study calendar | Unit-level plans, 7/14/21/custom durations, scheduling engine, task statuses, reschedule/pause/resume, dashboard aggregation | Multiple unit calendars generate and reschedule correctly; dashboard combines tasks | M | Scheduling rules approval |
| 6A | Exam bank pipeline | Source inventory, DSpace/OAI adapters, document import, storage, text/OCR, question extraction, marks/diagram review, mapping, duplicate clusters, audit | Questions traceable to source; only verified HIGH/reviewed MEDIUM publish; all occurrences preserved | XL | **Blocked on MMUST access/licensing; storage choice; OCR scope** |
| 6B | Exam modes | Practice/mock/final modes, attempt restrictions, timers, answer locking, post-submission feedback | Final-mode restrictions enforced server-side; AI unavailable for answer assistance | L | 6A; exam content |
| 7 | Practical learning | Activities by level, projects, milestones, deliverables, evidence upload, reviews, documentation | Student completes a project with milestones/evidence/review; portfolio-ready output | L | Storage; practical content |
| 8 | Career development | Career profile, interests, target roles, skill map, evidence, portfolio, readiness dashboard, privacy | Skills linked to evidence; gaps shown; no unexplained employability score | M | Phase 7 evidence |
| 9 | Persistent AI agent | Mastra, Groq, context builder, retrieval, threads/messages/state, floating UI, tools, exam restrictions, audit, evaluations | Contextual help across sessions; refuses unauthorized actions; no rule bypass | XL | Groq key; phases 3-8 data; safety review |
| 10 | Dashboard and gamification | Analytics, progress visualisations, XP, streaks, achievements, leaderboard, public-profile controls | Meaningful progress; private data not exposed; XP not awarded for passive activity | M | Event data from earlier phases |
| 11 | Quality and deployment | Full test suite, security review, accessibility, performance, docs, migrations, Vercel deploy, monitoring | Release checklist passes; no critical failures; deployment verified | L | All phases; Vercel/optional services |

### 10.1 Recommended delivery strategy: pilot vertical slice

Rather than authoring three semesters before proving the product, build one complete vertical slice:

- Institution: MMUST (verified).
- Programme: School of Information Technology programme record (title/code to verify).
- Semester: Year 1 Semester 1 (to verify).
- Pilot unit: **BCS 111 - Introduction to Programming** (unit code/title from the PRD's unverified list).
- Content: a small number of topics written as clearly labelled **draft/unverified** educational content, reviewed before publish.
- Flow: sign in -> unit overview -> topic learning -> personal notes -> exercise -> assessment -> 60% pass -> unlock next topic -> calendar -> progress.

This proves the architecture, UX, assessment rules, and AI context before scaling content and the exam bank.

---

## 11. Decisions that require approval

Please approve or change each item. Recommended option is listed first.

| ID | Decision | Recommendation | Why / impact |
| --- | --- | --- | --- |
| D-01 | Confirm this is the correct, intentionally empty repository | Yes, build greenfield in `sibby-killer/SIT-Learning-Hub` | Avoids building in the wrong repo |
| D-02 | Core stack | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, Drizzle + Turso, Clerk, Mastra + Groq, Vitest + Playwright, Vercel | Matches PRD preferences except the agent runtime, where Mastra is the better TypeScript/Turso fit |
| D-03 | Authentication | Clerk Hobby initially; Pro only if MFA/branding/custom sessions needed | Fastest secure start; 50k MRU free; DB remains role source of truth |
| D-04 | Database hosting and region | Turso Free; primary closest to Kenya (verify `turso db locations`; Johannesburg if available); Vercel `jnb1` | Low latency, generous free tier |
| D-05 | AI runtime and models | Mastra agent runtime; `groq/openai/gpt-oss-120b` primary, `groq/openai/gpt-oss-20b` fast; configurable | Real tool-using agent with Turso memory; avoids a generic chatbot; model IDs stay in env |
| D-06 | Document storage | Cloudflare R2 private bucket; local filesystem driver in dev | 10 GB free, free egress, better for PDFs than Vercel Blob Hobby (1 GB) |
| D-07 | OCR approach | Local text extraction + Tesseract fallback + mandatory human review; add paid OCR only if quality fails | No key/cost initially; keeps originals and review trail |
| D-08 | Exam source access | User provides MMUST PDFs or campus/VPN access; no indiscriminate scraping; other universities clearly labelled supplementary | MMUST bank unreachable on inspection date; licensing risk |
| D-09 | Curriculum data | Seed only verified official data as published; the PRD's unit list may be seeded as clearly labelled draft | PRD explicitly says the list is unverified |
| D-10 | Content strategy | Pilot one unit with draft content before full semester authoring | Reduces rework and proves the learning/assessment loop |
| D-11 | First administrator | Seed/promote via `ADMIN_EMAILS`; no public admin signup | Prevents privilege escalation |
| D-12 | Deployment | Vercel Hobby for development/preview; decide Pro/self-host for institutional production | Hobby is personal/non-commercial |
| D-13 | Privacy/compliance | Publish privacy notice, data minimisation, retention, export/delete; align with Kenya DPA 2019 and MMUST policy | Required before real student data |
| D-14 | Design direction | Professional academic palette (deep teal/navy, warm accent), high readability, restrained motion | Matches PRD's anti-template, focused-learning direction |
| D-15 | Scope order | Follow phases 1-11, but ship a pilot vertical slice first | Avoids a large, unproven build |
| D-16 | Background processing | CLI/offline job pipeline first; add queue/worker only if needed | Avoids premature infrastructure |
| D-17 | Access to MMUST curriculum documents | Please supply official programme structure/unit outlines if available | Required for authoritative curriculum; otherwise only draft content is possible |

**Approval status (2026-11-02):** the user approved all recommended decisions and asked for a real agent rather than a chatbot. The agent runtime was therefore changed from LangGraph to Mastra (ADR-004); D-05 was updated accordingly. D-08, D-09, D-10, D-12, D-13, and D-17 still need the user's content/access/deployment input.

---

## 12. What can start immediately vs what is blocked

### Can start immediately after approval

- Phase 1 foundation (needs Clerk + Turso keys).
- Phase 2 schema and admin CRUD (real content can wait).
- Phase 3 learning UI and personal notes (pilot content).
- Phase 4 assessment engine (AI grading can use a fake provider in tests; Groq needed for real feedback).
- Phase 5 calendar.
- Phase 7 practical and Phase 8 career shells.
- Phase 9 AI framework with read-only tools and test fixtures (Groq needed for live responses).
- Phase 10 analytics/gamification on generated data.

### Blocked or partially blocked

- Authoritative curriculum publication: blocked on official MMUST documents.
- MMUST exam bank import: blocked on source access and licensing.
- Scanned-paper/diagram extraction quality: blocked on real sample papers for evaluation.
- Production deployment with real students: blocked on privacy/compliance and deployment plan.
- Full AI tool suite: blocked on data from earlier phases and safety review.

---

## 13. Quality gates for every phase

1. `npm run typecheck` passes.
2. `npm run lint` passes.
3. `npm run test` passes; new business rules have unit tests.
4. Database migrations apply cleanly to a fresh local database.
5. `npm run build` passes for phases that change routing/config.
6. Authorization tests cover at least one cross-user and one role-escalation case.
7. No secrets in the diff; `.env.example` updated if variables change.
8. `docs/IMPLEMENTATION-STATUS.md` updated with honest status.
9. Phase summary includes what changed, how it works, files, DB changes, tests, limitations, next step.
10. Commit and push before starting the next phase.

---

## 14. Phase 0 deliverables

| Deliverable | Status |
| --- | --- |
| Repository audit | Implemented |
| Requirements checklist | Implemented |
| Architecture assessment | Implemented |
| Phased roadmap | Implemented |
| API-key acquisition guide | Implemented |
| Setup documentation | Implemented |
| Content-source verification record | Implemented |
| Implementation-status document | Implemented |
| Git repository initialized and remote configured | Implemented |
| Phase 0 commit pushed | Implemented - `b480fb7` on `origin/main` |

---

## 15. Next step

Awaiting approval of section 11. On approval, Phase 1 will:

1. Scaffold the Next.js application with the approved stack.
2. Add environment validation and CI.
3. Add Turso/Drizzle with the identity schema and migrations.
4. Add Clerk authentication and role-based route groups.
5. Build the application shell and design tokens.
6. Add the first tests, run all quality gates, commit, and push.
