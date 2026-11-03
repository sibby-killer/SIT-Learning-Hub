# SIT Learning Hub - Implementation Status

**Last updated:** 2026-11-02  
**Current phase:** Phase 2 - Curriculum management (implemented; live admin pending keys)  
**Application code:** Next.js scaffold, identity and curriculum schemas, auth and role guards, curriculum admin, published student catalog, tests, CI, and Mastra scaffold  
**Master specification:** [../SIT-Learning-Hub-Full-PRD-and-OpenCode-Instructions.txt](../SIT-Learning-Hub-Full-PRD-and-OpenCode-Instructions.txt)

---

## Status legend

| Status | Meaning |
| --- | --- |
| **Not started** | No implementation work has begun |
| **In progress** | Work has begun but the requirement is not complete |
| **Implemented** | The functionality exists and works, but has not been fully tested |
| **Tested** | Implemented and covered by relevant tests |
| **Verified** | Tested and manually confirmed against the PRD acceptance criteria |
| **Blocked** | Cannot proceed without a decision, source, access, or dependency |

A page or button existing does not count as Implemented. A feature is Implemented only when its actual behaviour works; Verified only after appropriate testing.

---

## Phase status

| Phase | Scope | Status | Gate / notes |
| --- | --- | --- | --- |
| 0 | Audit, checklist, architecture, setup, API-key guide, content-source record | **Implemented - approved** | Docs committed and pushed (`b480fb7`); user approved all recommended decisions |
| 1 | Foundation: scaffold, design system, env, DB, auth, roles, CI | **Implemented - live auth pending keys** | Scaffold, schema, migration, auth integration, tests, and CI are in place (`e75f2ae`); sign-in needs Clerk + Turso keys |
| 2 | Curriculum management | **Implemented - live admin pending keys** | Schema, migration, seed, services, admin CRUD/status workflow, prerequisites, outcome mapping, verification gate, and verified/published catalog are in place; MMUST seed remains draft/unverified |
| 3 | Learning experience | Not started | Pilot content needed |
| 4 | Assessment engine and progression | Not started | Groq key for live AI grading; fake provider for tests |
| 5 | Study calendar | Not started | Scheduling rules approval |
| 6A | Examination bank pipeline | Not started / **Blocked** | MMUST access, licensing, storage/OCR decisions |
| 6B | Practice/mock/final exam modes | Not started | Depends on 6A |
| 7 | Practical learning | Not started | Storage for evidence; practical content |
| 8 | Career development | Not started | Depends on practical evidence; privacy decisions |
| 9 | Persistent AI agent | Not started | Groq key; Mastra runtime; phases 3-8 data; safety review |
| 10 | Dashboard and gamification | Not started | Event data from earlier phases |
| 11 | Quality and deployment | Not started | All phases; deployment/privacy decisions |

---

## Phase 0 deliverables

| ID | Deliverable | Status | Evidence |
| --- | --- | --- | --- |
| P0-01 | Repository inspection and audit | Implemented | [AUDIT.md](AUDIT.md) |
| P0-02 | Requirements checklist | Implemented | This document |
| P0-03 | Architecture assessment | Implemented | [ARCHITECTURE.md](ARCHITECTURE.md) |
| P0-04 | Phased roadmap | Implemented | [AUDIT.md](AUDIT.md) section 10 |
| P0-05 | API-key acquisition guide | Implemented | [API-KEYS.md](API-KEYS.md) |
| P0-06 | Setup/development guide | Implemented | [SETUP.md](SETUP.md) |
| P0-07 | Content-source verification record | Implemented | [CONTENT-SOURCES.md](CONTENT-SOURCES.md) |
| P0-08 | Git repository initialized with remote | Implemented | Local `main`; `origin` configured |
| P0-09 | Phase 0 commit pushed to GitHub | Implemented | Commit `b480fb7` on `origin/main`; verified via `git ls-remote` and GitHub API |
| P0-10 | User approval of decisions | Implemented | Approved all recommended decisions on 2026-11-02; agent runtime changed to Mastra; D-08, D-09, D-10, D-12, D-13, and D-17 still need content/deployment input |

---

## Phase 1 verification record

| Check | Result (2026-11-02) |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | 3 test files, 9 tests passed |
| `npm run build` | Passed; 27 routes generated |
| `npm run test:e2e` | 2 Playwright smoke tests passed |
| Drizzle migration | `drizzle/0000_chemical_fixer.sql` generated |
| Local database | Migration applied to `file:./.data/local.db`; 5 system settings seeded |
| Live Clerk/Turso sign-in | Not yet verified; keys are not configured |

---

## Phase 2 verification record

| Check | Result (2026-11-02) |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | 5 test files, 22 tests passed |
| `npm run build` | Passed; 28 pages generated |
| `npm run test:e2e` | 4 Playwright tests passed with a seeded local database; curriculum tests skip without `TURSO_DATABASE_URL` |
| Drizzle migration | `drizzle/0001_fearless_deadpool.sql` generated and applied |
| Local seed | 1 institution, 1 programme, 2 academic years, 3 semesters, 7 draft units |
| Cycle prevention | Unit-tested and integration-tested; direct and indirect cycles rejected |
| Published catalog | Integration-tested: unit stays hidden until programme, year, semester, and unit are published and programme/unit are verified |
| Verification gate | Integration-tested: publishing unverified content is rejected; removing unit verification unpublishes it |
| Admin browser mutations | Not live-verified; requires Clerk + Turso keys |

---

## 1. Foundation and identity

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| FND-01 | Next.js + TypeScript application scaffold | 1 | Tested | Next.js 16.4.3, React 19.3, Tailwind 4; production build passes |
| FND-02 | Responsive application shell and student navigation | 1 | Tested | `AppShell`, landing page, and E2E smoke test |
| FND-03 | Admin/reviewer navigation separated from student area | 1 | Tested | Separate admin navigation and route area |
| FND-04 | Design tokens, typography, spacing, accessible contrast | 1 | Implemented | Academic teal/amber palette, serif headings, CSS tokens |
| FND-05 | Environment validation and `.env.example` contract | 1 | Tested | Zod validation plus setup tests; no secret values exposed |
| FND-06 | User registration and sign-in | 1 | Implemented - live test pending | Clerk pages, provider, proxy, and webhook; needs Clerk keys |
| FND-07 | User profile and programme/year selection | 1/2 | Not started | Profile page is a placeholder; curriculum data needed |
| FND-08 | Roles: student, reviewer, administrator | 1 | Tested | Drizzle role enum and permission matrix tests |
| FND-09 | Permission checks enforced server-side | 1 | Implemented | `requirePermission` guards admin page; broader route/service coverage arrives with features |
| FND-10 | First administrator bootstrap (no public admin signup) | 1 | Implemented | `ADMIN_EMAILS` allowlist; no admin option in sign-up |
| FND-11 | Audit log for administrative actions | 1+ | Implemented | Curriculum create/update/status/prerequisite/mapping actions write `audit_logs` rows with actor and metadata |
| FND-12 | CI: typecheck, lint, tests, build | 1 | Tested | `.github/workflows/ci.yml` includes quality and E2E jobs |

---

## 2. Curriculum management

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| CUR-01 | Institution records | 2 | Tested | CRUD service, admin form, audit log, seed MMUST record |
| CUR-02 | Programme records | 2 | Tested | Programme hierarchy, draft default, unverified label, parent status workflow |
| CUR-03 | Academic year and semester records | 2 | Tested | Year/semester records, current flag, statuses, parent status workflow |
| CUR-04 | Unit records with code, title, description, credits, requirements, career connections | 2 | Tested | Unit editor and versioned updates; official MMUST content still pending |
| CUR-05 | Learning outcomes per unit | 2 | Tested | Create/edit outcomes; publication requires at least one |
| CUR-06 | Topics, subtopics, sequencing | 2 | Tested | Parent-topic hierarchy, sort order, create/edit topic metadata |
| CUR-07 | Topic prerequisites with cycle prevention | 2/3 | Tested | Service rejects self, cross-unit, duplicate, direct, and indirect cycles; backend rules are unit-tested |
| CUR-08 | Topic-to-outcome and assessment-to-outcome mapping | 2/4 | Implemented | Topic-outcome mapping works; assessment mapping waits for Phase 4 |
| CUR-09 | Admin create/edit/save draft/preview/publish/unpublish/archive | 2 | Implemented | Admin tree, unit/content editor, status/verification controls, readiness checks, audit log; parent metadata edit screens and live browser mutation pending |
| CUR-10 | Student catalog shows only published curriculum | 2 | Tested | `/learning` queries verified units through verified/published parents; integration and E2E tested |
| CUR-11 | Seed MMUST institution/programme and draft units clearly labelled unverified | 2 | Implemented | Seeded records are draft/unverified; publishing unverified content is rejected |
| CUR-12 | Content author/reviewer/version/publication metadata | 2 | Implemented | Unit version/createdBy/reviewedBy/publishedAt, verification status/audit, topic/outcome versions |

---

## 3. Learning experience

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| LRN-01 | Unit overview with code/title/description/outcomes/progress/actions | 3 | Not started | Pilot unit |
| LRN-02 | Topic sequence navigation with prerequisite locking | 3 | Not started | Backend unlock checks |
| LRN-03 | Detailed learning notes with WHAT/WHY/HOW/behind-the-scenes/examples/real-world/common mistakes | 3 | Not started | Content standard; authoring |
| LRN-04 | Visual explanations/diagrams where appropriate | 3 | Not started | Subject-specific content |
| LRN-05 | Videos and external resources | 3 | Not started | Validated links |
| LRN-06 | Subject-specific exercise structures (code, circuits, accounting, maths, etc.) | 3/4 | Not started | Depends on unit |
| LRN-07 | Personal notes CRUD, organisation, pin, search | 3 | Not started | FTS |
| LRN-08 | Notes separated from official learning material | 3 | Not started | Data/UI distinction |
| LRN-09 | Topic completion distinct from topic pass | 3/4 | Not started | Progress model |
| LRN-10 | Learning activity tracking (without equating viewing with mastery) | 3 | Not started | Analytics |
| LRN-11 | Unit progress and academic/practical progress shown independently | 3/10 | Not started | Dashboard |
| LRN-12 | Accessible, focused learning screen with next action | 3 | Not started | Design review |

---

## 4. Assessment and progression

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| ASM-01 | Written question types: short/long/calculation/problem/code/diagram/case study/structured/multi-part | 4 | Not started | Question model |
| ASM-02 | Selective MCQ support, not dominant | 4 | Not started | Optional type |
| ASM-03 | Typed answer submission | 4 | Not started | Server validation |
| ASM-04 | Rubrics for subjective answers | 4 | Not started | Human-reviewed rubrics |
| ASM-05 | Deterministic validation for numerical/code answers where possible | 4 | Not started | Unit tests |
| ASM-06 | AI-assisted evaluation with correctness/understanding/completeness/reasoning/method/terminology/calculation feedback | 4 | Not started | Groq key; provider abstraction |
| ASM-07 | Feedback includes score, correct, missing, incorrect, why, correction, concept to revisit, next action | 4 | Not started | Zod schema |
| ASM-08 | Attempt history and attempt numbers | 4 | Not started | Retakes |
| ASM-09 | 60% topic pass mark, configurable | 4 | Not started | Backend authority |
| ASM-10 | Failed attempt keeps topic locked and recommends revision | 4 | Not started | Transaction + tests |
| ASM-11 | Passed attempt unlocks next eligible topic server-side | 4 | Not started | Prerequisite checks |
| ASM-12 | AI cannot solely determine or write pass/unlock | 4 | Not started | Safety test |
| ASM-13 | Unit assessment covering outcomes, written/calculation/application/past-paper/supplementary questions | 4 | Not started | Exam bank dependency for past-paper items |
| ASM-14 | Unit assessment tracks score, attempt, time, questions, outcomes, weak areas | 4 | Not started | Analytics |

---

## 5. Study calendar

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| CAL-01 | Choose 7/14/21/custom day duration per unit | 5 | Not started | Unit-level plan |
| CAL-02 | One calendar for the whole unit, not per topic | 5 | Not started | Schema constraint |
| CAL-03 | Scheduling engine distributes topics, videos, notes, exercises, revision, practical, assessment | 5 | Not started | Deterministic tests |
| CAL-04 | Scheduling considers topic count/complexity/time/assessment dates/availability/target duration | 5 | Not started | Inputs validation |
| CAL-05 | Task statuses: pending/in progress/completed/missed/rescheduled | 5 | Not started | State machine |
| CAL-06 | Reschedule missed tasks; change deadline; pause/resume | 5 | Not started | History records |
| CAL-07 | Completed and upcoming tasks visible | 5 | Not started | UI |
| CAL-08 | Dashboard combines tasks from all active unit calendars | 5/10 | Not started | Aggregation query |
| CAL-09 | Time zone/date handling in Africa/Nairobi | 5 | Not started | Date tests |

---

## 6. Examination bank

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| EXM-01 | Source inventory with institution/repository/collection/unit/year/session/metadata | 6A | Not started | **Blocked:** MMUST access |
| EXM-02 | MMUST primary; other universities supplementary and labelled | 6A | Not started | Licensing |
| EXM-03 | Last three completed academic years by default; configurable | 6A | Not started | Verify sessions |
| EXM-04 | Preserve original PDFs unchanged with checksums | 6A | Not started | R2/local storage |
| EXM-05 | Text extraction and OCR for scanned papers | 6A | Not started | OCR decision |
| EXM-06 | Question/subquestion/mark/numbering extraction | 6A | Not started | LLM-assisted draft |
| EXM-07 | Preserve diagrams, tables, equations, circuits, page references | 6A | Not started | Page images |
| EXM-08 | OCR confidence and manual review flags | 6A | Not started | Review queue |
| EXM-09 | Question record with full provenance and copyright notes | 6A | Not started | Schema |
| EXM-10 | Curriculum mapping with HIGH/MEDIUM/LOW confidence | 6A | Not started | Verified outcomes |
| EXM-11 | Only approved HIGH/reviewed MEDIUM in main bank; LOW separate | 6A | Not started | Service rule |
| EXM-12 | Duplicate detection: exact, near-verbatim, concept, related, false-positive | 6A | Not started | Multiple techniques |
| EXM-13 | Duplicate clusters show occurrences/institutions/years/pages/similarity/explanation | 6A | Not started | Never delete |
| EXM-14 | Admin review workflow: import/OCR/correct/map/duplicate/approve/reject/edit/reprocess/audit | 6A | Not started | Audit log |
| EXM-15 | Practice mode with explanations/hints/worked examples | 6B | Not started | Mode permissions |
| EXM-16 | Mock mode with limited hints, results after submission | 6B | Not started | Mode permissions |
| EXM-17 | Final mode with no assistance, backend restrictions, timestamps, locking | 6B | Not started | Security tests |
| EXM-18 | Final unit exam covers outcomes, balanced, no repetition, duration, post-exam feedback | 6B | Not started | Assembly rules |

---

## 7. Practical learning

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| PRC-01 | Beginner/intermediate/applied/portfolio activity levels | 7 | Not started | Content |
| PRC-02 | Practical activities with problem/background/objectives/requirements/tools/prereqs/instructions | 7 | Not started | Content |
| PRC-03 | Milestones, expected output, acceptance criteria, testing, common mistakes, reflection, deliverables | 7 | Not started | Content model |
| PRC-04 | Projects owned by students with status and documentation | 7 | Not started | Ownership checks |
| PRC-05 | Evidence submission (files/links) | 7 | Not started | R2 + validation |
| PRC-06 | Reviewer feedback and review records | 7 | Not started | Reviewer role |
| PRC-07 | Skill evidence from practical work, not passive viewing | 7/8 | Not started | Evidence model |
| PRC-08 | Portfolio-suitable projects linked to outcomes/skills | 7/8 | Not started | Portfolio |
| PRC-09 | AI guides rather than completes the project | 7/9 | Not started | AI safety |

---

## 8. Career development

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| CAR-01 | Optional career profile: interests, dream roles, goals | 8 | Not started | No forced career choice at registration |
| CAR-02 | Skills with current level and evidence | 8 | Not started | Skill model |
| CAR-03 | Tools used, projects, portfolio links, internships, work experience, certifications | 8 | Not started | Portfolio model |
| CAR-04 | Areas requiring improvement and milestones | 8 | Not started | Evidence-based |
| CAR-05 | Career connections per unit | 8 | Not started | Curriculum content |
| CAR-06 | Career readiness dashboard: practised skills, tools, activities, projects, evidence, gaps, next steps | 8/10 | Not started | No opaque AI score |
| CAR-07 | Public/private controls for career and portfolio data | 8 | Not started | Privacy |
| CAR-08 | No promises of jobs/qualifications | 8 | Not started | Copy review |

---

## 9. Persistent AI teacher and mentor

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| AI-01 | Floating assistant icon/side panel throughout learning | 9 | Not started | UI |
| AI-02 | Preserve current page and show current unit/topic | 9 | Not started | Context |
| AI-03 | Conversation interface with continuation of previous threads | 9 | Not started | Persistence |
| AI-04 | Access permitted learner context (profile/programme/unit/topic/outcomes/notes/resources/attempts/progress/calendar/practical/career) | 9 | Not started | Context builder |
| AI-05 | Retrieve only relevant info for the request | 9 | Not started | Token budget |
| AI-06 | Teach/simplify/question/assess/revise/plan/troubleshoot/project guide/review/career mentor/reflect/remember | 9 | Not started | Mastra agent tools/workflows |
| AI-07 | Use approved curriculum/notes for retrieval | 9 | Not started | FTS + filters |
| AI-08 | Persistent memory from structured data, not a long prompt | 9 | Not started | Thread state + summaries |
| AI-09 | Encourage independent reasoning; admit uncertainty; label official vs general explanation | 9 | Not started | Prompt/eval |
| AI-10 | Refuse unauthorized actions (role/result changes, unlocking, cross-student access, exam bypass, secrets, arbitrary DB) | 9 | Not started | Allowlisted tools |
| AI-11 | Server-side permission validation for every tool | 9 | Not started | Security tests |
| AI-12 | Respect practice/mock/final exam restrictions | 9 | Not started | Mode-aware tools |
| AI-13 | Log tool execution and important actions | 9 | Not started | `ai_tool_logs` |
| AI-14 | Prompt-injection defence for retrieved documents/user content | 9 | Not started | Eval fixtures |
| AI-15 | Provider abstraction; Mastra + Groq initial; configurable models | 9 | Not started | Env config |
| AI-16 | No fine-tuning for first release | 9 | Not started | - |
| AI-17 | AI never fabricates mastery/progress; backend confirms | 9 | Not started | Safety rule |

---

## 10. Dashboard and gamification

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| DSH-01 | Welcome, programme, semester, active units | 10 | Not started | Profile/curriculum |
| DSH-02 | Today's tasks and upcoming assessments | 10 | Not started | Calendar |
| DSH-03 | Unit progress, academic performance, practical progress | 10 | Not started | Progress data |
| DSH-04 | Career skills and recent activities | 10 | Not started | Career data |
| DSH-05 | Study streak and next recommended action | 10 | Not started | Events |
| DSH-06 | AI assistant access | 10 | Not started | Phase 9 |
| DSH-07 | Configurable XP rules (topic 10, pass 20, unit 50, 80% 20 bonus, streak 5/day) | 10 | Not started | Avoid unlimited XP |
| DSH-08 | XP transactions with duplicate prevention | 10 | Not started | Unique constraint |
| DSH-09 | Achievements and leaderboard fields (rank/name/XP/units/avg/streak) | 10 | Not started | Privacy |
| DSH-10 | Leaderboard/public profile privacy controls | 10 | Not started | Opt-in |
| DSH-11 | Learning analytics: failed topics, revision needs, poor completion, time, trends, outcome progress | 10 | Not started | Queries |
| DSH-12 | Do not equate time-on-page with understanding | 10 | Not started | Metric definitions |

---

## 11. Administration, security, privacy, quality

| ID | Requirement | Phase | Status | Notes / blocker |
| --- | --- | --- | --- | --- |
| ADM-01 | Admin dashboard for students/programmes/semesters/units/topics/outcomes/resources/notes/videos/exercises/assessments/exam papers/extracted questions/duplicates/projects/skills/career/analytics | 2+ | Not started | Incremental |
| ADM-02 | Content lifecycle: create/edit/draft/preview/publish/unpublish/archive/version | 2 | Not started | Workflow |
| ADM-03 | Reviewer role and review records | 2/6 | Not started | RBAC |
| ADM-04 | Content quality metadata: author/reviewer/version/status/updated/source | 2 | Not started | Content review |
| ADM-05 | Distinguish AI-generated explanations from verified official content | 2/3 | Not started | Labels |
| ADM-06 | Platform analytics | 10 | Not started | Admin |
| ADM-07 | System settings | 11 | Not started | Admin |
| ADM-08 | Soft deletion and archive behavior | 2+ | Not started | Data integrity |
| SEC-01 | Authentication and secure sessions | 1 | Not started | Clerk |
| SEC-02 | Role-based authorization | 1 | Not started | DB roles |
| SEC-03 | Server-side validation for all mutations | 1+ | Not started | Zod |
| SEC-04 | Rate limiting on sensitive/AI endpoints | 9/11 | Not started | Upstash optional |
| SEC-05 | Safe file uploads (type/size/magic bytes/private storage) | 6/7 | Not started | R2 |
| SEC-06 | Secrets never exposed to client or git | 1 | Not started | `server-only` |
| SEC-07 | Error handling without leaking secrets | 1 | Not started | Typed errors |
| SEC-08 | Multi-student query scoping and IDOR protection | 1+ | Not started | Security tests |
| SEC-09 | Private notes/conversations/attempts not public | 3/9 | Not started | Privacy |
| SEC-10 | Exam-mode restrictions enforced server-side | 6B | Not started | Security tests |
| SEC-11 | AI prompt-injection and tool-abuse protection | 9 | Not started | Evals |
| SEC-12 | Audit logs for important actions | 1+ | Not started | Admin/reviewer/AI |
| SEC-13 | Privacy notice, consent, retention, export/delete | 11 | Not started / **Blocked** | MMUST/Kenya DPA review |
| QLT-01 | Unit tests for business rules | 1+ | Not started | Vitest |
| QLT-02 | Integration tests with local libSQL | 1+ | Not started | Migrations |
| QLT-03 | E2E tests for student/admin flows | 1+ | Not started | Playwright |
| QLT-04 | Security tests (authz/data isolation) | 1+ | Not started | CI |
| QLT-05 | AI tests (context/tool permissions/grading) | 9 | Not started | Fake provider |
| QLT-06 | Accessibility review (WCAG 2.2 AA target) | 11 | Not started | axe + manual |
| QLT-07 | Performance review | 11 | Not started | Budgets |
| QLT-08 | Production build and deployment verification | 11 | Not started | Vercel |
| QLT-09 | Documentation maintained every phase | 0+ | Implemented | Phase 0 docs and Phase 1 status/verification updates |
| QLT-10 | Monitoring/backups/runbook | 11 | Not started | Optional Sentry |

---

## Critical workflows test matrix (PRD section 75)

Domain workflows are **Not started**. Phase 1 has a landing-page/health smoke test and unit tests for env, permissions, and utility behaviour; the workflow matrix below tracks later phases.

### Student

| ID | Workflow | Status |
| --- | --- | --- |
| T-STU-01 | Register and sign in | Not started |
| T-STU-02 | Select programme/semester | Not started |
| T-STU-03 | Open a unit and select study duration | Not started |
| T-STU-04 | Generate a calendar | Not started |
| T-STU-05 | Open a topic and view learning content | Not started |
| T-STU-06 | Create/edit/delete/search personal notes | Not started |
| T-STU-07 | Submit an answer and receive structured feedback | Not started |
| T-STU-08 | Pass a topic and unlock the next topic | Not started |
| T-STU-09 | Complete a unit assessment and view progress | Not started |

### Examination

| ID | Workflow | Status |
| --- | --- | --- |
| T-EXM-01 | Import a source document | Not started |
| T-EXM-02 | Extract questions and review OCR | Not started |
| T-EXM-03 | Verify marks and diagrams | Not started |
| T-EXM-04 | Map questions to outcomes | Not started |
| T-EXM-05 | Review and resolve duplicates | Not started |
| T-EXM-06 | Approve questions | Not started |
| T-EXM-07 | Start practice mode | Not started |
| T-EXM-08 | Start mock mode | Not started |
| T-EXM-09 | Complete final mode and receive post-submission feedback | Not started |

### Practical

| ID | Workflow | Status |
| --- | --- | --- |
| T-PRC-01 | Open a practical activity | Not started |
| T-PRC-02 | Start a project and complete milestones | Not started |
| T-PRC-03 | Submit evidence and receive review | Not started |
| T-PRC-04 | Add a portfolio item | Not started |

### AI

| ID | Workflow | Status |
| --- | --- | --- |
| T-AI-01 | Open assistant and ask a contextual question | Not started |
| T-AI-02 | Retrieve approved learning content | Not started |
| T-AI-03 | Recall relevant learner context | Not started |
| T-AI-04 | Guide a practical task | Not started |
| T-AI-05 | Respect examination restrictions | Not started |
| T-AI-06 | Refuse unauthorized actions | Not started |

### Admin

| ID | Workflow | Status |
| --- | --- | --- |
| T-ADM-01 | Create a unit and add topics | Not started |
| T-ADM-02 | Add learning resources and publish content | Not started |
| T-ADM-03 | Import examination papers and review extracted questions | Not started |
| T-ADM-04 | Manage users and roles | Not started |

---

## Phase completion log

| Phase | Completed on | Commit | Tests | Notes |
| --- | --- | --- | --- | --- |
| 0 | 2026-11-02 | `b480fb7` | Documentation/link check; no application tests (no app code) | Pushed to `origin/main`; user approved all recommended decisions |
| 1 | 2026-11-02 | `e75f2ae` | Typecheck, lint, 9 unit tests, production build, 2 Playwright smoke tests | Live sign-in pending Turso/Clerk keys; tagged `phase-1` |
| 2 | 2026-11-02 | `340f7db` | Typecheck, lint, 22 unit/integration tests, production build, 4 Playwright tests | Curriculum admin, verification gate, and verified/published catalog implemented; live admin mutations pending keys; seed is draft/unverified |

---

## Known issues and blockers

| ID | Issue | Severity | Action needed |
| --- | --- | --- | --- |
| B-01 | Repository was greenfield at audit time; Phases 1-2 now exist | Informational | Preserve working behaviour and keep tests passing |
| B-02 | Official MMUST curriculum not supplied | High | Provide programme structure/unit outlines |
| B-03 | MMUST Exam Bank unreachable from this network (2026-11-02) | High | User provides campus/VPN access or PDFs |
| B-04 | Past-paper licensing/permission unclear | High | Confirm permission; do not publish until resolved |
| B-05 | No provider keys yet | Medium | Create Turso, Clerk, Groq keys per [API-KEYS.md](API-KEYS.md) |
| B-11 | Curriculum admin mutations are service-tested but not live-verified in the browser | Medium | Configure Clerk/Turso, sign in as an allowlisted admin, and exercise create/publish flows |
| B-12 | Institution/programme/year/semester metadata edit screens are not exposed yet | Low | Add edit forms if correcting parent records becomes necessary before Phase 3 |
| B-06 | Deployment/compliance decisions pending | Medium | Approve Vercel plan, privacy approach |
| B-07 | PRD repository URLs are malformed | Low | Use corrected URLs in [CONTENT-SOURCES.md](CONTENT-SOURCES.md) |
| B-08 | Groq model catalogue may change | Low | Keep model IDs configurable |
| B-09 | Resolved: CI added in Phase 1 | Low | Keep `.github/workflows/ci.yml` green |
| B-10 | Resolved: design direction approved and implemented | Low | Preserve the approved academic palette and accessibility checks |

---

## How to update this document

At the end of every phase:

1. Change the phase status and completion log.
2. Update each requirement honestly: do not mark Implemented without working behaviour, or Verified without tests/manual confirmation.
3. Add tests performed and results.
4. Add new blockers/known issues.
5. Link the phase commit and any migration files.
6. Keep the "Last updated" date current.
