# SIT Learning Hub - Architecture

**Status:** Approved. Phase 1 foundation is implemented; later-phase architecture is specified but not yet built.  
**Last updated:** 2026-11-02

---

## 1. System context

SIT Learning Hub is a multi-user web platform with four main actors:

- **Student** - learns, practises, is assessed, builds practical/career evidence.
- **Reviewer** - verifies extracted exam questions, diagrams, marks, and curriculum mappings.
- **Administrator** - manages curriculum, content, users, exam sources, and platform settings.
- **AI teacher/mentor** - a constrained agent that reads permitted learner context and approved content; it never owns progression or permissions.

External systems:

- Clerk (identity).
- Turso/libSQL (data).
- Groq (inference); Mastra observability and optional Sentry (tracing).
- Cloudflare R2 or compatible object storage (documents/evidence).
- MMUST and other institutional repositories (exam sources).
- Vercel (hosting).

---

## 2. Technology decisions

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 App Router | Server Components, Route Handlers, Server Actions; `proxy.ts` replaces `middleware.ts` in Next.js 16 |
| Language | TypeScript strict | No `any` in domain/service boundaries without justification |
| UI | Tailwind CSS 4 + shadcn/ui (Radix) + lucide-react | Accessible primitives; design tokens via CSS variables |
| Forms/validation | React Hook Form + Zod | Same schemas on client and server; server always re-validates |
| Database | Turso (libSQL) | Local `file:` database for development; remote for deployed environments |
| ORM | Drizzle ORM + drizzle-kit | Committed SQL migrations |
| Auth | Clerk (`@clerk/nextjs`) | Proposed; DB is source of truth for app roles |
| AI | Mastra + `@mastra/libsql` + Groq | Tool-using agent runtime with durable memory, workflows, guardrails, evals, and configurable model IDs |
| Testing | Vitest + Testing Library + Playwright | Unit, integration, E2E, security, AI fixtures |
| Object storage | Cloudflare R2 (S3-compatible) | Private bucket; local driver in development |
| Deployment | Vercel | Region `jnb1` preferred; self-host fallback |
| CI/CD | GitHub Actions | Typecheck, lint, test, build on push/PR |

---

## 3. Layered architecture

```text
Presentation        app/, components/
    |
Application         services/ (business rules, orchestration)
    |
Data access         db/queries/, db/schema.ts
    |
Infrastructure      Turso/libSQL, Clerk, Groq, R2, repository adapters
```

Rules:

1. Page components do not contain business rules.
2. Services never read request headers directly; callers pass an authenticated actor.
3. Data-access functions receive filters explicitly and never trust client-supplied ownership.
4. Agent orchestration lives in `src/mastra/`; agents and tools call services, not raw SQL.
5. Long-running work lives in `jobs/` and records status in the database.

### 3.1 Proposed directory layout

```text
src/
  app/
    (public)/                 landing, sign-in/up, legal
    (student)/                dashboard, learning, calendar, exams, practical, career, portfolio
    (admin)/                  admin dashboard, curriculum, users, content, exam review, settings
    api/                      webhooks, streaming AI, uploads, internal jobs
  components/
    ui/                       shadcn primitives
    layout/                   app shell, nav, breadcrumbs
    learning/                 unit cards, topic nav, notes renderer
    assessment/               question renderer, answer editor, feedback
    calendar/                 task list, schedule controls
    exam/                     source/question review, exam runner
    practical/                project cards, milestones, evidence
    career/                   skill map, portfolio, readiness
    ai/                       assistant button, panel, message stream, tool status
  lib/
    auth.ts                   current user, requireUser, requireRole
    permissions.ts            permission matrix and checks
    env.ts                    validated environment
    errors.ts                 typed errors and safe messages
    dates.ts                  Africa/Nairobi date helpers
    rate-limit.ts             optional Upstash/DB limiter
  db/
    schema.ts                 Drizzle tables and relations
    client.ts                 libSQL client and db
    queries/                  composable read/write functions by domain
    seed.ts                   idempotent development seed
  services/
    identity/ curriculum/ learning/ assessment/ scheduling/
    exams/ practical/ career/ ai/ gamification/ analytics/ admin/
  mastra/
    index.ts                  Mastra instance, storage, agents, workflows
    agents/                   teacher, assessor, career-mentor, planner
    tools/                    allowlisted application tools
    workflows/                deterministic grading, exam generation, planning
    memory/                   learner memory schema and retrieval policy
    prompts/                  versioned instructions
    guardrails/               injection filters, exam-mode restrictions
  ai/
    provider.ts               model-provider boundary and model IDs
    context.ts                learner context builder
    retrieval.ts              FTS + structured retrieval
    safety.ts                 tool and output policy shared by Mastra
  validation/                 Zod schemas by domain
  jobs/                       import-exam-bank, ocr, extract, dedupe, verify-links
tests/
  unit/ integration/ e2e/ security/ ai/
```

---

## 4. Route map (initial)

### Public

- `/` - product landing, sign-in/up entry.
- `/sign-in`, `/sign-up` - Clerk components or hosted pages.
- `/legal/privacy`, `/legal/terms`, `/legal/content-sources`.

### Student

- `/dashboard`
- `/learning` - active units, continue learning.
- `/learning/[unitSlug]` - unit overview and topic list.
- `/learning/[unitSlug]/[topicSlug]` - learning screen.
- `/calendar`
- `/exams` - exam bank browse.
- `/exams/practice`, `/exams/mock`, `/exams/final/[attemptId]`
- `/practical`, `/practical/[activitySlug]`, `/projects/[projectId]`
- `/career`, `/portfolio`
- `/assistant` - full-page AI teacher (plus floating panel).
- `/leaderboard`
- `/profile`, `/settings`

### Admin/reviewer

- `/admin` - overview.
- `/admin/curriculum/...`
- `/admin/content/...`
- `/admin/exams/sources`, `/admin/exams/documents`, `/admin/exams/questions`, `/admin/exams/duplicates`
- `/admin/users`
- `/admin/analytics`
- `/admin/settings`

Route groups enforce coarse access; services enforce fine-grained permissions.

---

## 5. Data model

The schema is built in phase-gated slices. IDs are server-generated text (ULID/UUID). Timestamps are UTC. Calendar dates are date-only strings interpreted in `Africa/Nairobi`.

### 5.1 Identity

```text
users(id, clerk_id UK, email UK, display_name, avatar_url, status, created_at, updated_at, deleted_at)
roles(id, key UK, name, description)
permissions(id, key UK, description)
user_roles(user_id FK, role_id FK, granted_by, granted_at, PK(user_id, role_id))
role_permissions(role_id FK, permission_id FK, PK(role_id, permission_id))
user_profiles(user_id PK FK, bio, programme_id FK, academic_year_id FK, semester_id FK, timezone, leaderboard_opt_in, portfolio_visibility, created_at, updated_at)
audit_logs(id, actor_user_id FK, action, entity_type, entity_id, before_json, after_json, ip_hash, created_at)
```

### 5.2 Curriculum

```text
institutions(id, name, slug UK, country, created_at, updated_at)
programmes(id, institution_id FK, code, title, level, description, duration_years, status, ...)
academic_years(id, programme_id FK, label, start_date, end_date, is_current, status, ...)
semesters(id, academic_year_id FK, number, label, start_date, end_date, status, ...)
units(id, semester_id FK, code, title, slug UK per semester, description, credits,
      recommended_hours, academic_requirements, practical_requirements, career_connections,
      status(draft|published|archived), version, created_by, reviewed_by, published_at, ...)
learning_outcomes(id, unit_id FK, code, statement, sort_order)
topics(id, unit_id FK, code, title, slug, introduction, objectives_json, content_md,
       visual_explanation, simple_examples, worked_examples, advanced_examples,
       real_world_application, common_mistakes, estimated_minutes, complexity,
       sort_order, status, version, ...)
topic_prerequisites(topic_id FK, prerequisite_topic_id FK, PK(...))
topic_outcomes(topic_id FK, learning_outcome_id FK, PK(...))
resources(id, unit_id FK, topic_id FK nullable, type, title, description, url, storage_key,
          source, license, duration_seconds, status, review_status, created_by, reviewed_by, ...)
```

Curriculum constraints:

- Unique `(semester_id, code)` for units; unique `(unit_id, code)` for topics/outcomes.
- Cannot publish a unit without at least one outcome and one topic (service rule).
- Prerequisites must belong to the same unit; no cycles (service + optional trigger).
- Student queries filter `status = 'published'` unless the actor is admin/reviewer with preview rights.

### 5.3 Learning and progress

```text
personal_notes(id, user_id FK, unit_id FK, topic_id FK nullable, title, content_md,
               is_pinned, created_at, updated_at, deleted_at)
resource_progress(id, user_id FK, resource_id FK, status, position_seconds, completed_at, ...)
topic_progress(id, user_id FK, topic_id FK, status(locked|available|in_progress|completed|passed|failed),
               best_score, attempt_count, passed_at, completed_at, last_activity_at,
               UNIQUE(user_id, topic_id))
unit_progress(id, user_id FK, unit_id FK, status, academic_score, practical_score,
              started_at, completed_at, UNIQUE(user_id, unit_id))
outcome_progress(id, user_id FK, learning_outcome_id FK, mastery_score, evidence_count,
                 last_assessed_at, UNIQUE(user_id, learning_outcome_id))
```

Important separation:

- `completed` = learner finished the learning material.
- `passed` = learner met the 60% assessment threshold.
- Watching a video or reading notes must never set `passed`.
- `unit_progress.practical_score` is independent of `academic_score`.

### 5.4 Assessment

```text
questions(id, unit_id FK, topic_id FK nullable, type, prompt_md, answer_guide_md, rubric_json,
          marks, difficulty, source_type(original|past_paper|supplementary), status,
          created_by, reviewed_by, created_at, updated_at)
exercises(id, topic_id FK, question_id FK, type, prompt_md, rubric_json, expected_answer,
          numeric_answer, tolerance, difficulty, marks, status, ...)
assessments(id, unit_id FK nullable, topic_id FK nullable, type(topic|unit|final|mock|practice),
            title, instructions_md, duration_minutes, pass_mark, status, created_by, reviewed_by, ...)
assessment_questions(assessment_id FK, question_id FK, marks, sort_order, PK(...))
attempts(id, user_id FK, assessment_id FK nullable, mode, status(in_progress|submitted|graded|expired),
         attempt_number, started_at, submitted_at, time_taken_seconds, score, max_score,
         passed, feedback_json, graded_by(auto|ai|human), ai_confidence, locked, ...)
attempt_answers(id, attempt_id FK, question_id FK, answer_text, answer_json, score,
                feedback_json, ai_raw_json, created_at)
```

Progression rule (server transaction):

1. Load the topic, its prerequisites, the assessment, and the latest attempt.
2. Verify the attempt belongs to the user and is submitted/graded.
3. Compute the score server-side from verified answers; never accept a client score.
4. If score >= 60 and prerequisites are passed: set `topic_progress.passed`, unlock eligible next topics.
5. If score < 60: record failure, recommend revision, keep next topics locked.
6. AI feedback is stored as feedback only; it cannot write `passed`.

### 5.5 Scheduling

```text
study_plans(id, user_id FK, unit_id FK, target_duration_days, start_date, target_end_date,
            status(active|paused|completed|archived), created_at, updated_at,
            UNIQUE(user_id, unit_id) for active plan)
calendar_tasks(id, study_plan_id FK, user_id FK, unit_id FK, topic_id FK nullable,
               task_type(learn|watch|read|practice|revision|practical|assessment),
               title, planned_date, estimated_minutes,
               status(pending|in_progress|completed|missed|rescheduled),
               completed_at, sort_order, created_at, updated_at)
task_reschedules(id, task_id FK, previous_date, new_date, reason, created_by, created_at)
```

Scheduling engine inputs: topic count, complexity, estimated minutes, assessment dates, available days, target duration, and existing tasks. Output: one unit-level plan. Rescheduling preserves completed tasks and avoids overloading a day. Dashboard aggregates tasks across active plans.

### 5.6 Examination bank

```text
source_repositories(id, institution, name, base_url, repository_type, access_status, notes)
source_documents(id, repository_id FK, unit_id FK nullable, title, academic_year, exam_session,
                 document_url, repository_identifier, file_format, checksum, storage_key,
                 page_count, access_status, import_status, review_status, license_notes, metadata_json)
exam_questions(id, source_document_id FK, question_id FK nullable, page_number, question_number,
               subquestion_label, text_md, diagram_storage_key, marks, ocr_confidence,
               verification_status, copyright_notes, duplicate_cluster_id, metadata_json)
question_mappings(id, exam_question_id FK, learning_outcome_id FK, topic_id FK nullable,
                  confidence(high|medium|low), reviewed_by, reviewed_at)
duplicate_clusters(id, canonical_exam_question_id FK, similarity_score, explanation, created_at)
duplicate_members(cluster_id FK, exam_question_id FK, similarity, method, PK(...))
review_records(id, entity_type, entity_id, reviewer_user_id FK, action, notes, created_at)
exam_attempts(id, user_id FK, mode(practice|mock|final), status, started_at, submitted_at,
              expires_at, score, max_score, locked, ...)
exam_attempt_questions(exam_attempt_id FK, exam_question_id FK, marks, sort_order, PK(...))
exam_attempt_answers(id, exam_attempt_id FK, exam_question_id FK, answer_text, score, feedback_json, ...)
```

Rules:

- Keep every original occurrence; duplicate clusters link, never delete.
- Publish only approved HIGH-confidence and reviewed MEDIUM-confidence mappings.
- LOW-confidence questions stay in a separate review queue.
- Source provenance is mandatory before publication.
- Final mode has server-enforced restrictions; practice/mock/final share the attempt model but differ in permissions.

### 5.7 Practical learning

```text
skills(id, key UK, name, category, description)
unit_skills(unit_id FK, skill_id FK, PK(...))
practical_activities(id, unit_id FK, topic_id FK nullable, title, slug, level,
                     problem_statement, background, objectives_json, requirements_json,
                     tools_json, prerequisite_knowledge, instructions_md, expected_output,
                     acceptance_criteria_json, testing_procedure, common_mistakes_json,
                     reflection_prompts_json, documentation_requirements, portfolio_suitable,
                     status, ...)
projects(id, user_id FK, practical_activity_id FK, title, status, started_at, completed_at,
         repo_url, notes, ...)
project_milestones(id, project_id FK, title, description, sort_order, status, completed_at)
project_deliverables(id, project_id FK, title, type, storage_key, url, submitted_at, status)
project_reviews(id, project_id FK, reviewer_user_id FK, score, feedback, status, reviewed_at)
skill_evidence(id, user_id FK, skill_id FK, evidence_type, entity_type, entity_id,
               evidence_url, description, verified_by, verified_at, level)
```

### 5.8 Career

```text
career_profiles(id, user_id FK UK, headline, summary, interests_json, target_roles_json,
                goals_json, visibility(private|unlisted|public), updated_at)
career_skills(id, user_id FK, skill_id FK, current_level, target_level, evidence_summary,
              UNIQUE(user_id, skill_id))
career_milestones(id, user_id FK, title, description, target_date, status, completed_at)
portfolio_items(id, user_id FK, title, description, type(project|certificate|experience|other),
                url, storage_key, skills_json, visibility, featured, created_at, updated_at)
```

Career readiness is evidence-based. No opaque AI score. Private by default; public portfolio requires explicit opt-in.

### 5.9 AI

```text
ai_threads(id, user_id FK, unit_id FK nullable, topic_id FK nullable, title,
           mode(teacher|career|review), status, created_at, updated_at, last_message_at)
ai_messages(id, thread_id FK, role(system|user|assistant|tool), content, tool_calls_json,
            tool_results_json, token_count, created_at)
ai_thread_state(thread_id PK FK, state_json, summary, updated_at)
ai_tool_logs(id, thread_id FK, user_id FK, tool_name, input_json, output_json,
             allowed, error, created_at)
```

### 5.10 Gamification

```text
xp_transactions(id, user_id FK, amount, reason, entity_type, entity_id, created_at,
                UNIQUE(user_id, reason, entity_type, entity_id))
streaks(user_id PK FK, current_streak, longest_streak, last_activity_date, updated_at)
achievements(id, key UK, name, description, criteria_json, xp_reward)
user_achievements(user_id FK, achievement_id FK, awarded_at, PK(...))
leaderboard_snapshots(id, period, generated_at, data_json)
```

XP is awarded only for verified milestones; duplicate transactions are prevented by the unique constraint. Leaderboard fields are opt-in and minimal.

---

## 6. Authentication and authorization

### 6.1 Sign-in flow

1. Clerk authenticates the user.
2. Server helper resolves `clerk_id` to an application `users` row.
3. If missing, create a `student` user and profile (lazy sync); a Clerk webhook may be added later for lifecycle events.
4. Load roles/permissions from the database.
5. Route guards redirect unauthenticated users; role guards return 403 or redirect.

### 6.2 Permission model

Permissions are explicit keys, e.g.:

- `curriculum.read`, `curriculum.write`, `curriculum.publish`
- `content.review`, `content.publish`
- `exam.review`, `exam.publish`
- `users.read`, `users.manage`
- `analytics.read`
- `settings.manage`

Roles map to permissions. Admin has all; reviewer has review/publish-limited content and exam permissions; student has learning/assessment/portfolio permissions. Check permissions server-side in services.

### 6.3 Ownership

- Every user-owned query includes `user_id = actor.id`.
- Admin/reviewer access is explicit and logged.
- API responses never include another user's notes, attempts, conversations, or career data.
- Public portfolio/leaderboard queries select only fields marked public.

---

## 7. Assessment and progression architecture

### 7.1 Question types

Support short/long explanation, calculation, problem solving, code writing, diagram interpretation, case study, scenario, structured, and multi-part questions. MCQs are optional and must not dominate.

### 7.2 Grading pipeline

```text
submitted answer
  -> server validation (attempt ownership, mode, time window, question)
  -> deterministic checks where possible (numeric tolerance, exact code tests, required keywords)
  -> rubric-based AI evaluation for subjective parts (structured JSON)
  -> score aggregation server-side
  -> feedback object stored
  -> progression service applies pass/fail rules in a transaction
```

Feedback schema:

```json
{
  "score": 0,
  "maxScore": 0,
  "correct": [],
  "missing": [],
  "incorrect": [],
  "why": "",
  "suggestedCorrection": "",
  "conceptToRevisit": "",
  "nextAction": ""
}
```

AI output is validated with Zod. Invalid output is retried once, then surfaced as "feedback unavailable" without changing the score. A human reviewer can override important assessments; overrides are audited.

### 7.3 Exam integrity

- Attempt state, start/expiry timestamps, and answers are server-owned.
- Final mode disallows AI assistance, hints, and answer lookup.
- AI tools receive a mode flag and refuse restricted actions.
- Submitted final attempts lock according to settings.
- Late submissions are rejected or flagged server-side.

---

## 8. Scheduling architecture

- One active study plan per user/unit.
- Deterministic, testable scheduling function; no AI decides dates.
- Inputs: topics, complexity, estimated minutes, resources, exercises, assessments, practical tasks, target duration, start date, availability.
- Algorithm: topologically order topics by prerequisites; allocate learning/practice/revision blocks; reserve assessment/practical days; spread workload; avoid exceeding a daily cap.
- Rescheduling: identify missed tasks, propose a new plan, preserve completed tasks, allow manual edits, record history.
- Dashboard: union of tasks across active plans for the user, grouped by date.

---

## 9. AI architecture

### 9.1 Agent runtime

The AI layer is a **real agent**, not a chat-completion wrapper. The chosen runtime is **Mastra**:

- `Agent` provides a bounded tool-calling loop with `generate()` and `stream()`.
- `createTool()` defines typed, allowlisted capabilities with Zod input/output schemas.
- `Memory` provides thread history, working memory, and optional recall backed by Turso.
- `Workflow` handles deterministic multi-step jobs (study plans, exam generation, grading).
- Guardrails, processors, evals, tracing, and Studio support testing and production debugging.
- `LibSQLStore` works directly with the same Turso database, so agent state does not need a second database.

ADR-004 records the change from the PRD's preferred LangGraph to Mastra. LangGraph is a valid orchestration graph, but it is lower-level, and remote Turso checkpointing would require custom infrastructure. Mastra is TypeScript-native and covers the memory, tools, workflows, and Turso integration this project needs.

### 9.2 Agent design

```text
request -> authenticate -> load permitted learner context -> build retrieval query
        -> agent loop (reason -> choose tool or answer -> observe -> repeat, bounded)
        -> validate output and citations -> persist messages/state -> stream response
```

The agent can:

- Teach, explain, quiz, evaluate answers against rubrics, and plan study.
- Read only the current learner's permitted profile, progress, notes, calendar, and evidence.
- Call allowlisted tools such as `getLearnerContext`, `retrieveApprovedContent`, `createStudyTask`, `startPracticeQuiz`, and `getExamSource`.
- Ask for confirmation before a state-changing action, and never perform direct result/role/unlock changes.
- Stop on a step limit, a token budget, a safety refusal, or an exam-mode restriction.

The floating UI is only the interface. The agent's behaviour comes from the tool graph, memory, retrieval, and server-side policy.

### 9.3 Context builder

Only include what the request needs:

- Current user profile and programme/semester.
- Current unit/topic and outcomes.
- Approved notes/resources for the topic.
- Recent attempts and weak outcomes.
- Current calendar tasks.
- Practical evidence and career interests (when relevant).
- Conversation summary + recent messages.

Never include another student's data. Never include secrets or internal prompts. Prioritise official/verified content and label AI-generated explanations.

### 9.4 Retrieval

- SQL filters by unit/topic/status.
- SQLite FTS5 over approved content and personal notes (personal notes only for the owner).
- Optional embeddings later, only after evaluation.
- Token budget and source attribution; do not dump entire units.

### 9.5 Safety

- Treat notes, PDFs, web content, and user messages as untrusted.
- Delimit retrieved content and instruct the model not to follow embedded instructions.
- Allowlist tools; validate inputs; check permissions server-side.
- No SQL execution, shell, file deletion, role changes, result changes, or topic unlocking.
- Exam-mode restrictions are enforced before the model is called and inside tools.
- Log tool actions; redact secrets and private data.

---

## 10. Examination pipeline

### 10.1 Source inventory

Record institution, repository, collection, unit, academic year, session, title, URL/identifier, access status, file format, import status, review status. Do not claim coverage until checked.

### 10.2 Import and preservation

- Fetch original document; store unchanged in private object storage.
- Compute SHA-256; record source URL/identifier, retrieval date, licence/access notes.
- Extract text layer; render page images; OCR only pages without text.
- Never overwrite the original.

### 10.3 Extraction

- Detect question boundaries, subquestions, marks, numbering, tables, equations, diagrams.
- Store page references and raw OCR text for audit.
- LLM-assisted extraction is draft-only; confidence and reviewer status are stored.
- Uncertain or diagram-dependent items go to manual review.

### 10.4 Mapping and duplicate detection

- Map to verified learning outcomes, not just similar unit titles.
- HIGH/MEDIUM/LOW confidence; only approved HIGH and reviewed MEDIUM publish.
- Duplicate methods: normalisation, SHA-256, trigram/Jaccard or Levenshtein, optional embeddings; human confirmation.
- Keep all occurrences; clusters show institutions, years, documents, pages, confidence, explanation.

### 10.5 Review and audit

Reviewers can correct OCR, marks, diagrams, mappings, duplicates, approve/reject, edit, reprocess, and view history. Every action creates a `review_records`/`audit_logs` entry.

---

## 11. Security architecture

| Control | Implementation |
| --- | --- |
| Authentication | Clerk; server-side session verification |
| Authorization | DB roles/permissions; service-level checks; route guards |
| Input validation | Zod on every mutation; reject unknown fields |
| SQL injection | Drizzle parameterised queries; no string-concatenated SQL |
| IDOR | Ownership predicates; tests for cross-user access |
| File upload | MIME allowlist, size limits, magic-byte check, random keys, private storage |
| Rate limiting | AI/upload endpoints; optional Upstash Redis; serverless-safe |
| Secrets | `.env.local`; `server-only`; env validation; never `NEXT_PUBLIC_` for secrets |
| Error handling | Typed errors; generic messages to clients; detailed server logs |
| Audit | Admin actions, reviews, AI tool calls, role changes |
| Exam integrity | Server-owned state/timestamps; mode checks; answer locking |
| AI | Untrusted context, allowlisted tools, permission checks, no arbitrary execution |
| Privacy | Opt-in public data; private notes/conversations/attempts; retention/export/delete |
| Dependencies | Lockfile; `npm audit` in CI; review updates |

Threats explicitly considered: privilege escalation, IDOR, prompt injection, exam-answer leakage, cross-student AI context leakage, malicious PDFs, spam/abuse of AI endpoints, and secret exposure.

---

## 12. Testing architecture

| Level | Tool | Scope |
| --- | --- | --- |
| Unit | Vitest | Scheduling, progression, scoring, duplicate similarity, permission matrix, formatting |
| Integration | Vitest + local libSQL | Migrations, queries, transactions, ownership, service flows |
| E2E | Playwright | Student learning/assessment/calendar, admin curriculum, exam review, AI assistant |
| Security | Vitest/Playwright | Cross-user access, role escalation, exam restrictions, upload validation |
| AI | Vitest with fake provider | Context selection, tool permissions, structured output validation, prompt injection |
| Accessibility | axe-core in Playwright | Key pages and flows |

Critical workflow tests are listed in [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md). No phase is complete while its critical tests fail.

---

## 13. Deployment and operations

- Environments: local, preview (Vercel), production.
- Local DB: `file:./.data/local.db`; production: Turso remote.
- Migrations run in CI/predeploy against the target database; never `db push` in production.
- Region: Vercel `jnb1`; Turso primary closest to Kenya (verify available locations).
- Environment variables set in Vercel per environment; `.env.example` is the contract.
- Object storage: private R2 bucket; CORS/signed URLs configured per environment.
- Monitoring: structured logs, Vercel runtime logs, optional Sentry; AI/tool metrics.
- Backups: Turso point-in-time restore (plan-dependent); export runbook; R2 versioning if available.
- Rollback: Vercel instant rollback; database migrations must be backward-compatible for one release.
- Release checklist: tests, typecheck, lint, build, migrations, auth, protected routes, AI health, storage access, error handling.

---

## 14. Architecture decision records (summary)

| ADR | Decision | Status |
| --- | --- | --- |
| ADR-001 | Greenfield modular monolith on Next.js | Accepted |
| ADR-002 | Turso + Drizzle, phase-gated schema | Accepted |
| ADR-003 | Clerk for identity; DB roles for authorization | Accepted |
| ADR-004 | Mastra + Groq behind a provider boundary; agent tools, memory, and workflows | Accepted (replaces LangGraph preference) |
| ADR-005 | Structured retrieval + FTS before embeddings | Accepted |
| ADR-006 | Offline exam pipeline with human review | Accepted, implementation blocked on source access |
| ADR-007 | R2 private storage for documents/evidence | Accepted |
| ADR-008 | Server-authoritative progression and exam integrity | Mandatory |
| ADR-009 | Evidence-based career readiness, no opaque AI score | Mandatory |
| ADR-010 | Pilot one unit before full curriculum authoring | Accepted |
| ADR-011 | The AI is a tool-using, stateful agent with server-enforced permissions; not a generic chatbot | Mandatory |

---

## 15. Open architecture questions

1. Clerk vs self-hosted auth for institutional deployment.
2. Whether MFA is required before real student data.
3. Turso primary region and whether read replicas are needed.
4. Whether exam PDFs may be stored at all, or only metadata/extracts.
5. Whether diagrams need a dedicated vision model or human-only transcription.
6. Whether AI grading requires human review for every unit assessment or only samples.
7. Whether the institution wants SSO (Google Workspace/Microsoft) later.
8. Data retention period for AI conversations, attempts, and uploaded evidence.
