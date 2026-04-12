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

### 🎨 FE Designer Mode
- [ ] Design system analyzed (existing tokens, spacing, colors detected)
- [ ] Visual design follows 8-point grid and typography scale
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 large text)
- [ ] Responsive breakpoints implemented (mobile-first)
- [ ] No magic numbers — all values use design tokens or documented scale
- [ ] Self-critique completed (visual hierarchy, CTA clarity, cognitive load, spacing consistency)
- [ ] Accessibility checked (semantic HTML, ARIA patterns, keyboard nav, focus management)
- [ ] Component styling uses composition over inheritance
- [ ] Handoff notes prepared for Code mode if component logic changes needed

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
