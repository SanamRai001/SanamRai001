# PROJECT_STATE

## Goal
Align the public GitHub profile with Sanam's current 2026 positioning: full-stack development first, with strong backend/system-design and AI/LLM interests.

## Branch
`profile/2026-linkedin-alignment`

Base: `master`

## Progress
- Audited the existing profile README, branding lockup, toolkit card, selected-project cards, repository visibility, and recent profile-signal commits.
- Identified a positioning mismatch: the profile described Sanam as backend-first while the current public positioning is full-stack with backend/system depth.
- Identified outdated featured projects: Krishi Bazar and YakTalk were taking two of four premium slots while newer public work better represents current engineering depth.

## Changes in this phase
- Reframed the profile introduction around full-stack development.
- Kept backend architecture, systems, databases, security, and AI/LLMs as areas of deeper interest.
- Replaced outdated selected-project emphasis with RepoScout and MaybeBoudha.
- Kept Knowledge AI and RAG from Scratch because they demonstrate AI-system depth and first-principles learning.
- Updated toolkit emphasis to TypeScript/React + Node/Express + PostgreSQL/MySQL/MongoDB + RAG/retrieval.
- Updated the main brand lockup from “Backend · Systems · AI” to “Full-Stack · Systems · AI”.
- Aligned the signature with “Build · Scale · Solve”.

## Verification
Lightweight verification still required after the branch writes:
- Confirm README paths resolve.
- Confirm new SVG files render as valid XML.
- Confirm no existing automated profile-signal paths were renamed or removed.

No production application tests are required for this profile-only change.

## Risks
- GitHub's SVG rendering and fallback fonts may vary slightly by platform.
- Profile repository automation continues to commit refreshed signal assets on `master`; this branch may need a small refresh/rebase if master changes before merge.
- GitHub profile metadata (bio, location, website, pinned repositories) is account-level and is not changed by the README.

## Next phase
1. Review rendered branch changes.
2. If approved, merge to `master`.
3. Manually align account-level GitHub bio and pinned repositories if needed.
