# Development Workflow — All Modes

## Mandatory Phases (from ECC)
Every non-trivial task MUST follow this pipeline. Do NOT skip phases.

### Phase 0: Research & Reuse
- Search existing codebase with `codebase_search` for similar implementations.
- Check `package.json` / dependency files for existing utilities.
- Look for ≥80% match solutions — adapt rather than recreate.
- Prefer proven, tested approaches over novel implementations.
- Document findings: "Searched [X] → Found [Y] / No match found."
- If `code-review-graph` MCP is available, also use `semantic_search_nodes_tool` for structural code discovery (see `code-graph-awareness.md`).
- **Quality gate**: Evidence of search performed before writing new code.

### Phase 1: Plan
- Restate requirements in your own words.
- Identify affected files, dependencies, and risks.
- Break into phases; each phase independently deliverable.
- **Quality gate**: User confirms plan before Phase 2 begins.

### Phase 2: Implement
- Search for existing solutions before writing new code (DRY).
- Write tests first when adding new behavior (RED → GREEN → REFACTOR).
- Make incremental changes — commit logical units, not bulk rewrites.
- **Quality gate**: Code compiles/builds without errors.

### Phase 3: Verify
- Run lint, type-check, and tests (`lint-and-validate` skill).
- Self-review using the checklist in `coding-standards.md`.
- Confirm no `console.log`, `debugger`, hardcoded secrets, or TODO without issue numbers.
- If `code-review-graph` MCP is available, run `detect_changes_tool` for impact verification (see `code-graph-awareness.md`).
- **Quality gate**: All checks pass, no CRITICAL/HIGH issues.

### Phase 4: Review & Commit
- Re-read your diff as if you are the reviewer, not the author.
- Write conventional commit: `type(scope): description`.
- Ensure PR description includes: what changed, why, how to test.
- **Quality gate**: Review checklist complete, no scope creep.

## When to Use Each Phase
| Task Size | Required Phases |
|-----------|----------------|
| Trivial (typo, config) | Phase 2 + 3 |
| Small (single file fix) | Phase 2 + 3 + 4 |
| Medium (feature, multi-file) | Phase 0 + All 4 phases |
| Large (architecture change) | Phase 0 + All 4 + Architect mode first |

## Phase Gate Enforcement (from spec-driven-development pattern)

Each phase has a **gate** that MUST pass before advancing. Do NOT skip gates — they exist to catch problems early.

```
Phase 0 → GATE: Evidence of search documented
              ↓ PASS
Phase 1 → GATE: User confirms plan
              ↓ PASS
Phase 2 → GATE: Code compiles, no new lint errors
              ↓ PASS
Phase 3 → GATE: All checks pass (lint + type-check + tests)
              ↓ PASS
Phase 4 → GATE: Self-review checklist complete, diff reviewed
              ↓ DONE
```

**Gate failure protocol:**
1. STOP — do not advance to next phase
2. Fix the issue in the current phase
3. Re-run the gate check
4. Only advance when gate passes

**Common gate-skipping rationalizations:**
| Rationalization | Reality |
|---|---|
| "I'll fix lint errors after all changes" | Errors compound. Fix per-phase, not at the end. |
| "User didn't explicitly confirm, but it's obvious" | Implicit approval ≠ confirmation. Ask. |
| "Tests pass so review isn't needed" | Tests check behavior, review checks quality. Both required. |
| "It's a small change, gates are overkill" | Small changes still follow Phase 2+3 gates minimum. |

## Performance Rules
- Avoid N+1 queries — batch database operations where possible.
- Prefer pagination for large datasets; never load unbounded collections.
- Cache expensive computations; invalidate on relevant state changes.
- Monitor bundle size — flag additions >50KB uncompressed.
- Lazy load modules, routes, and heavy dependencies when possible.
- Prefer targeted line ranges with `read_file` over full file reads for token efficiency.
- Minimize re-renders: memoize components, avoid inline object/function creation in JSX.

## HARD RULES
- MUST NOT skip Phase 3 (Verify) — every change gets validated, no exceptions.
- MUST NOT proceed to next phase if current quality gate fails — fix first, then advance.
- MUST ask before implementing when requirements are unclear — wrong assumptions cost more than questions.
- MUST use `update_todo_list` to track progress on multi-step tasks.
- MUST create checklist for every subtask/boomerang task — no task without tracking.
- MUST verify all todo items are `[x]` before calling `attempt_completion`.
- MUST search for existing solutions (Phase 0) before writing new code for medium+ tasks.
- MUST document search evidence: "Searched [X] → Found [Y] / No match found."
- MUST NOT bulk-rewrite files — make incremental, reviewable changes.
