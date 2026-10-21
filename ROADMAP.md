# Engineering Roadmap

A public plan for measurable engineering growth, in priority order.

**How to read this**

- Three priorities only: **Current** (actively working on), **Next** (queued), **Later** (intentional, not scheduled).
- Every item must produce evidence: a tested feature, a merged change, a benchmark, a design document, or a write-up.
- Finished items move to **Done** with a link to their evidence. Nothing is marked done without one.
- Updated as part of the weekly log in [PROGRESS.md](./PROGRESS.md).

## Done

- [x] **RepoScout — delivery baseline**: CI workflow, lint gate with `--max-warnings=0`, typecheck, API and web test suites, OCI deployment smoke workflow. — [workflows](https://github.com/SanamRai001/reposcout/tree/main/.github/workflows)
- [x] **StateScout — research freeze**: 30+ tests, 20 experiment scripts, benchmarks and reproducibility docs frozen at a reference commit with a one-command reproduction suite. — [docs/RESEARCH_FREEZE](https://github.com/SanamRai001/StateScout/blob/main/docs/RESEARCH_FREEZE.md)
- [x] **DevFoundation — generator with checks built in**: `npm run check` (lint + typecheck + test + build), CLI covered by `node --test`, generated projects include GitHub Actions checks. — [ci.yml](https://github.com/SanamRai001/DevFoundation/blob/main/.github/workflows/ci.yml)
- [x] **MaybeBoudha — architecture decision with measured proof**: renderer/scene-format ADR, quantified asset-pipeline proof, deployed prototype with production smoke coverage. — [ADR-001](https://github.com/SanamRai001/MaybeBoudha/blob/main/docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md)
- [x] **KrishiBazar — shipped a full product**: MERN marketplace with JWT auth, roles, cart and orders, live on Vercel + Render. — [README](https://github.com/SanamRai001/KrishiBazar/blob/master/README.md)
- [x] **Profile system**: concise README, this roadmap, and a weekly progress log — [PROGRESS.md](./PROGRESS.md)

## Current

**TypeScript & full-stack product engineering**
- [ ] Ship one RepoScout feature end to end (API + UI + tests + migration) behind a single reviewable change. — evidence: merged PR with green CI
- [ ] Write a short architecture note for RepoScout's ingestion/search boundary. — evidence: `docs/` ADR

**SQL, data modelling & database performance**
- [ ] Capture `EXPLAIN ANALYZE` before/after for RepoScout's main discovery query and document the indexes or query changes made. — evidence: benchmark note with numbers
- [ ] Add PostgreSQL integration tests for one API's write path, wired into CI. — evidence: passing CI job against a real database

**Testing, debugging & code quality**
- [ ] Add a `tests.yml` workflow to StateScout (typecheck + `node --test`) so every push is verified automatically. — evidence: green workflow run
- [ ] KrishiBazar: remove committed `node_modules`, add a minimal API test suite and a CI workflow, or archive the repo honestly if it will not be maintained. — evidence: green CI or archive notice in README

**Portfolio quality & technical communication**
- [ ] Keep README claims equal to what the repositories actually show (no feature described that has no code behind it). — evidence: quarterly claim audit in PROGRESS.md
- [ ] Publish one technical write-up. — evidence: linked post or `docs/` note

## Next

**Authentication, authorization, security & reliability**
- [ ] Write a threat-model note for one real project covering token storage, roles, tenancy, rate limiting and failure modes. — evidence: security doc linked from the repo
- [ ] Work a PortSwigger path beyond SQL injection (IDOR and JWT) and apply one finding to a personal project. — evidence: lab completion + code change
- [ ] Enable and act on `npm audit --omit=dev` in RepoScout and DevFoundation as part of CI. — evidence: audit job in workflow

**Deployment, CI/CD & production operations**
- [ ] Give one deployed service health checks plus a documented rollback path. — evidence: runbook in `docs/` and a successful smoke run
- [ ] Add coverage reporting with an agreed floor to one project. — evidence: coverage number in CI

**System design & architectural trade-offs**
- [ ] Write three design notes derived from my own systems (RepoScout ingestion, StateScout state abstraction, MaybeBoudha delivery pipeline), each stating alternatives considered and why. — evidence: three ADRs

**Technical communication**
- [ ] Two more write-ups grounded in measurements: a query-optimization note and a failure-handling note. — evidence: linked posts

## Later

**AI application engineering, evaluation & reliability**
- [ ] Build an evaluation harness for one RAG feature: golden question set, retrieval metrics, groundedness/abstention checks, and a baseline vs. candidate comparison. — evidence: eval report with numbers
- [ ] Add a failure mode analysis (hallucination, stale retrieval, tool errors) for one AI-facing feature. — evidence: `docs/` reliability note

**Interview readiness**
- [ ] Prepare systems-design explanations from the three design notes above and rehearse them out loud. — evidence: recorded self-review notes, not public

## Explicitly not committing to

- Daily activity targets, streaks, or profile-view metrics.
- Badges, animated cards, or long technology lists that make claims I cannot back.
- Adopting a new framework or database without a project that needs it.
- Publishing a new repository every month — depth over count.
