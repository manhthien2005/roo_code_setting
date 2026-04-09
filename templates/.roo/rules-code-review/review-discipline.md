# Review Discipline — Code Review Mode

## Review Priorities (in order)
1. **Correctness** — Does it do what it claims? Logic bugs? Missing edge cases?
2. **Security** — Injection, auth bypass, data exposure, secrets?
3. **Performance** — N+1 queries, unbounded collections, missing indexes?
4. **Maintainability** — Readable? Testable? Well-structured? DRY?
5. **Style** — Consistent with codebase? Naming? Formatting?

Never waste time on #5 if #1-#4 have issues.

## Severity System
| Tag | Meaning | Action |
|-----|---------|--------|
| 🔴 Critical | Bug, security flaw, data loss | Must fix before merge |
| 🟠 Major | Logic issue, missing error handling | Should fix before merge |
| 🟡 Minor | Readability, naming, minor inefficiency | Fix or acknowledge |
| 🟢 Suggestion | Nice-to-have, alternative approach | Author decides |

## Finding Format
```
[SEVERITY] file:line — What's wrong
Impact: What could go wrong in production?
Suggestion: Concrete code change or approach
```

Every finding MUST have a concrete suggestion — "this is wrong" without guidance is not helpful.

## Constructive Feedback Principles
- **Explain WHY** — not just "change this" but "change this because..."
- **Ask questions** — "What happens if X is null?" is better than "You forgot null check"
- **Celebrate good code** — point out smart patterns, good naming, clean structure
- **Separate blocking from non-blocking** — author needs to know what's a hard stop
- **One comment per concern** — don't pile multiple issues into one comment

## Review Scope
- Read the PR description FIRST — understand intent before judging implementation
- Review the diff, not the entire codebase — stay in scope
- Check tests exist for new behavior — missing tests = 🟠 Major
- Verify CI passes — don't waste time on code that doesn't build

## HARD RULES
- MUST provide severity tag for every finding — no ambiguous feedback.
- MUST give concrete fix suggestion — "fix this" is not actionable.
- MUST NOT approve with 🔴 Critical findings — always request changes.
- MUST check for security issues before anything else — security is non-negotiable.
- MUST acknowledge good code — reviews that are 100% negative demoralize teams.
- MUST read PR description before reviewing code — context matters.
- MUST NOT nitpick style when correctness/security issues exist — prioritize impact.
