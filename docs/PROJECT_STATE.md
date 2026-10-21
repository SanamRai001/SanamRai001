# PROJECT_STATE

## Goal
Align the public GitHub profile with Sanam's current 2026 positioning: full-stack development first, with strong backend/system-design and AI/LLM interests.

## Branch
`profile/2026-linkedin-alignment`

Base/default branch: `master`

## Progress
- Audited the existing profile README, branding lockup, toolkit card, selected-project cards, repository visibility, and recent profile-signal commits.
- Identified a positioning mismatch: the profile described Sanam as backend-first while the current public positioning is full-stack with backend/system depth.
- Identified outdated featured projects: Krishi Bazar and YakTalk were taking two of four premium slots while newer public work better represents current engineering depth.
- User approved merging this profile refresh so the default-branch GitHub profile can render it.

## Changes in this phase
- Reframed the profile introduction around full-stack development.
- Kept backend architecture, systems, databases, security, and AI/LLMs as areas of deeper interest.
- Replaced outdated selected-project emphasis with RepoScout and MaybeBoudha.
- Kept Knowledge AI and RAG from Scratch because they demonstrate AI-system depth and first-principles learning.
- Updated toolkit emphasis to TypeScript/React + Node/Express + PostgreSQL/MySQL/MongoDB + RAG/retrieval.
- Updated the main brand lockup from “Backend · Systems · AI” to “Full-Stack · Systems · AI”.
- Aligned the signature with “Build · Scale · Solve”.

## Verification
Completed before merge:
- PR #7 is mergeable.
- Branch is 6 commits ahead and 0 commits behind `master` before this documentation update.
- README and all changed/new profile assets resolve from the branch.
- New RepoScout and MaybeBoudha SVG files are present with complete SVG source.
- Existing automated `build-signal.svg` and `live-signal.svg` paths were not renamed or removed.
- No pull-request workflow runs are configured for this profile-only change.

No production application tests are required for this profile-only repository.

## Risks
- GitHub's SVG rendering and fallback fonts may vary slightly by platform.
- Profile repository automation continues to refresh signal assets on `master`.
- GitHub account-level metadata (bio, location, website, pinned repositories) is separate from the README and is not changed here.

## Next phase
1. Merge PR #7 into the repository default branch (`master`).
2. Verify the default-branch README and profile assets resolve after merge.
3. Review account-level GitHub bio, website/location, and pinned repositories.

---

## Update — 2026-10-21 (evidence-based profile system)

### Goal
Replace the card/badge-driven profile with a concise, evidence-first README, a checkable engineering roadmap, and a weekly progress log.

### Changes
- PR #8 (squash `1c83bde`) rebuilt `README.md`, and added `ROADMAP.md` and `PROGRESS.md`.
- Selected work is now a four-row evidence table: RepoScout, StateScout, DevFoundation, MaybeBoudha. KrishiBazar is retained as honest earlier work.
- Excluded by owner decision: `knowledge-ai` (a fork of `dev-arch-sudo/knowledge-ai`) and `FMS` (owned by another account). Neither may be presented as personal work without explicit authorization.
- Removed from the README: streak/visitor/view-counter badges, typing and capsule-render headers, the status table, and the image-only Build Loop, Toolkit and Signal sections. Branding assets remain in `assets/`.

### Superseded statements
- The verification note above ("signal paths were not renamed or removed") and the risk note ("automation continues to refresh signal assets on `master`") described their own phase. They no longer hold after the change below.

### This change (`chore/retire-signal-automation`)
- The rewritten README displays no generated signal images, so the daily job only produced two invisible files. Retired:
  - `.github/workflows/build-signal.yml` (daily 00:17 UTC commit loop)
  - `scripts/generate-contributions.mjs` (verified to write only the two SVGs below)
  - `assets/profile/build-signal.svg`, `assets/profile/live-signal.svg`
- No remaining file references either SVG. Recoverable from git history if the signals are ever shown again.

### Follow-up (outside this repository)
- Account bio and four pinned repositories are set manually on GitHub; the API does not support pinned repositories.
