# SIT Learning Hub

A university learning and career-development platform for the School of Information Technology at Masinde Muliro University of Science and Technology (MMUST).

The product combines structured academic learning, written-answer assessment, a verified past-paper bank, practical projects, career development, and a persistent AI teacher. It is not intended to be an examination-only LMS.

## Project status

**Phase 0 - Audit and specification: complete, awaiting approval.** The repository is currently greenfield: it contains the master PRD and the Phase 0 documentation pack. No application code, database, authentication, or AI integration exists yet. Implementation starts only after the plan is approved.

See [docs/IMPLEMENTATION-STATUS.md](docs/IMPLEMENTATION-STATUS.md) for the feature-by-feature checklist.

## Master specification

The source of truth is:

- [SIT-Learning-Hub-Full-PRD-and-OpenCode-Instructions.txt](SIT-Learning-Hub-Full-PRD-and-OpenCode-Instructions.txt)

## Documentation

| Document | Purpose |
| --- | --- |
| [docs/AUDIT.md](docs/AUDIT.md) | Phase 0 audit, gap analysis, risks, roadmap, approval decisions |
| [docs/IMPLEMENTATION-STATUS.md](docs/IMPLEMENTATION-STATUS.md) | Requirements checklist and phase status |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Proposed stack, layers, data model, security model |
| [docs/SETUP.md](docs/SETUP.md) | Local setup, commands, conventions, phase workflow |
| [docs/API-KEYS.md](docs/API-KEYS.md) | Every key/service needed, where to get it, which plan to pick |
| [docs/CONTENT-SOURCES.md](docs/CONTENT-SOURCES.md) | Curriculum and examination source verification record |

## Planned stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Turso (libSQL) + Drizzle ORM
- Clerk for authentication
- Mastra + Groq for the agent runtime, with tools, persistent memory, workflows, and a provider abstraction
- Vitest + Playwright for testing
- Vercel for deployment; Cloudflare R2 for document/evidence storage

## Working rules

1. Preserve working functionality; do not rewrite unnecessarily.
2. Implement in phases; do not start a phase on top of failing critical tests.
3. Every phase ends with typecheck, lint, tests, build, documentation update, commit, and push.
4. Never commit secrets. Use `.env.local` locally and provider dashboards in deployment.
5. Never fabricate curriculum content, examination papers, or test results.
6. Backend rules - not the AI and not the frontend - decide progression and permissions.

## License and content notice

No curriculum content, past papers, or third-party educational material is included in this repository yet. Source documents must be verified and used in line with their licences and repository terms before publication. See [docs/CONTENT-SOURCES.md](docs/CONTENT-SOURCES.md).
