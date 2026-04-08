# Code Review Before Done — Code Mode

## Before calling `attempt_completion`, ALWAYS:

1. Re-read the code you changed — as if you are a reviewer, not the author.
2. Run through the Self-Review Checklist in `coding-standards.md`.
3. Verify build/compile passes (no syntax errors, no missing imports).
4. Confirm the change does EXACTLY what was asked — no more, no less.
5. The `verification-before-completion` skill will enforce evidence of verification.

## DO NOT claim completion if:
- You have not tested or verified the change works.
- There are TODO items left unfinished.
- You introduced changes outside the requested scope.
- Lint or build errors remain unresolved.
