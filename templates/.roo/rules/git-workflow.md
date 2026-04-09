# Git Workflow Rules — All Modes

## Commit Messages
- Format: `type(scope): description` (lowercase, imperative mood)
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`
- Example: `feat(auth): add JWT token refresh endpoint`
- Keep subject line ≤ 72 characters. Add body for complex changes.

## Branch Naming
- Format: `type/brief-description`
- Examples: `feat/user-auth`, `fix/login-redirect`, `refactor/api-client`

## Before Committing
- Run lint and tests (lint-and-validate skill handles this).
- Review staged changes: `git diff --staged`
- DO NOT commit: `console.log`, `debugger`, TODO without issue number, commented-out code.
- DO NOT commit files unrelated to the current task.

## PR Discipline
- One PR = one logical change. DO NOT bundle unrelated changes.
- PR description must include: what changed, why, and how to test.
- Keep changes modular — explain user-facing impact in the summary.

## HARD RULES
- MUST use conventional commit format (`type(scope): description`) — no exceptions.
- MUST run lint and tests before committing — `lint-and-validate` skill handles this.
- MUST NOT commit `console.log`, `debugger`, TODO without issue number, or commented-out code.
- MUST NOT commit files unrelated to the current task — check `git diff --staged`.
- MUST NOT push without reviewing your own diff first.
