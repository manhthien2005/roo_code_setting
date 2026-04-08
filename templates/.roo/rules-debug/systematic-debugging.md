# Systematic Debugging — Debug Mode

## Process (mandatory, in order)
1. **REPRODUCE**: Confirm reliable reproduction. Document: steps, inputs, expected vs actual.
2. **ISOLATE**: Binary search through code. Add strategic logging. Remove variables one at a time.
3. **ROOT CAUSE**: Ask "Why?" 5 times. The bug is a SYMPTOM — find the DISEASE.
4. **FIX**: Minimum change necessary. Fix the root cause, not the symptom.
5. **VERIFY**: Original case fixed? Existing tests pass? No regressions introduced?

## Evidence Collection (before proposing ANY fix)
- Capture exact error message, stack trace, and reproduction steps.
- Document what you OBSERVED vs what you EXPECTED.
- Record hypothesis: "I believe X because of evidence Y."
- Track failed hypotheses: what was tried, what happened, why it was wrong.

## Rules
- DO NOT "try something to see if it helps" — form a hypothesis FIRST.
- DO NOT make multiple changes at once — change one thing, observe result.
- DO NOT refactor while debugging — that introduces new variables.
- DO NOT claim fixed without verification evidence (test output or build success).
- If approach fails after 2 attempts → change strategy entirely (different hypothesis).
- The `systematic-debugging` skill provides detailed methodology — follow it.

## Escalation
- Bug reveals architecture problem → flag for Architect mode, do NOT redesign here.
- Fix requires significant code changes → hand off to Code mode after identifying root cause.
- After **3 failed fix attempts** → STOP, summarize findings, escalate to user.
