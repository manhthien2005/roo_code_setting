# Definition of Done — All Modes

## Purpose
A single, authoritative checklist defining when a task can be considered COMPLETE across all modes. Individual modes add mode-specific checks on top of this baseline.

## Universal Checklist (all tasks, all modes)
- [ ] Task deliverable matches the original request — no more, no less
- [ ] No introduced regressions — existing functionality still works
- [ ] No TODO items left unresolved within the task scope
- [ ] No secrets, credentials, or PII in code, logs, or output
- [ ] Changes are within the agreed scope — no scope creep without user approval

## Mode-Specific Additions

### 💻 Code Mode
- [ ] Code compiles/builds without errors
- [ ] Lint passes with zero errors (`lint-and-validate` skill)
- [ ] Self-review checklist in `coding-standards.md` completed
- [ ] Error handling complete — no empty catch blocks
- [ ] No `console.log`, `debugger`, commented-out code, or `any` types left
- [ ] `verification-before-completion` skill passed with evidence

### 🏗️ Architect Mode
- [ ] ≥2 solution options presented with trade-offs
- [ ] Risk assessment table included
- [ ] Implementation plan is a structured, ordered checklist
- [ ] User has confirmed the recommended approach

### 🪲 Debug Mode
- [ ] Bug reproduced with documented steps
- [ ] Root cause identified (not just symptom)
- [ ] Fix is minimal — only changes needed to resolve root cause
- [ ] Original issue verified fixed with evidence
- [ ] No regressions introduced by the fix

### 🪃 Orchestrator Mode
- [ ] All subtask phases completed and verified
- [ ] `update_todo_list` shows all items checked
- [ ] Quality gates passed for each phase
- [ ] Deferred items documented for future work

### 🔍 Code Review Mode
- [ ] All 🔴 Critical and 🟠 Major findings resolved
- [ ] Every finding has severity tag, file:line, and concrete fix suggestion
- [ ] Good code patterns acknowledged (not 100% negative)

### 🧪 Testing Mode
- [ ] Tests follow AAA pattern (Arrange → Act → Assert)
- [ ] Coverage targets met (≥80% new code, ≥95% critical paths)
- [ ] Tests are independent — no shared mutable state
- [ ] Full test suite runs green

## HARD RULES
- MUST complete the Universal Checklist for EVERY task — no exceptions.
- MUST complete mode-specific additions when the mode is active.
- MUST have verification evidence — "should work" is not Done.
- MUST NOT claim Done with known unresolved issues — list them and ask user.
