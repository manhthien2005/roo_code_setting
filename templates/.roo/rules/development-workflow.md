# Development Workflow — All Modes

## Mandatory Phases (from ECC)
Every non-trivial task MUST follow this pipeline. Do NOT skip phases.

### Phase 0: Research & Reuse
- Search existing codebase with `codebase_search` for similar implementations.
- Check `package.json` / dependency files for existing utilities.
- Look for ≥80% match solutions — adapt rather than recreate.
- Prefer proven, tested approaches over novel implementations.
- Document findings: "Searched [X] → Found [Y] / No match found."
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

## Performance Rules
- Avoid N+1 queries — batch database operations where possible.
- Prefer pagination for large datasets; never load unbounded collections.
- Cache expensive computations; invalidate on relevant state changes.
- Monitor bundle size — flag additions >50KB uncompressed.
- Lazy load modules, routes, and heavy dependencies when possible.
- Prefer `read_file` with `mode: "indentation"` over full file reads for token efficiency.
- Minimize re-renders: memoize components, avoid inline object/function creation in JSX.

## Hard Rules
- NEVER skip Phase 3 (Verify). Every change gets validated.
- NEVER proceed to next phase if current gate fails.
- If requirements are unclear, ASK before implementing (not after).
- Use `update_todo_list` to track progress on multi-step tasks.
