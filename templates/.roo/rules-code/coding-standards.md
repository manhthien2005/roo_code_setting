# Coding Standards — Code Mode

## Pre-Coding (before writing ANY code)
1. Read existing relevant files first (`codebase_search` or `read_file`).
2. Identify patterns, conventions, and style already in use.
3. Check if a similar solution already exists (DRY).
4. Clarify scope: what is IN vs OUT of scope.

## Size Limits
- **Functions**: ≤50 lines. Split larger functions into focused helpers.
- **Files**: 200–400 lines typical, 800 max. Extract modules by responsibility.
- **Nesting**: ≤4 levels deep. Use early returns and extract helpers.
- **DO NOT weaken linter/formatter configs** to suppress warnings — fix the code instead.

## TypeScript Rules (from ECC)
- **Types on public APIs**: Add parameter + return types to all exported functions. Let TS infer local variables.
- **`interface` vs `type`**: Use `interface` for object shapes that may be extended. Use `type` for unions, intersections, mapped types.
- **No `any`**: Use `unknown` for untrusted input, then narrow safely. Use generics when type depends on caller.
- **Prefer `const`** over `let`. Never use `var`.
- **Naming**: `camelCase` for variables/functions, `PascalCase` for types/interfaces/components, `UPPER_SNAKE_CASE` for constants, `is/has/should` prefix for booleans.
- **Immutability**: Use spread (`{...obj}`) for updates. Never mutate parameters.
- **Error handling**: Always `catch (error: unknown)`, narrow with `instanceof Error` before accessing `.message`.
- **No `console.log`** in production code — use proper logging libraries.

## Self-Review Checklist (mandatory before every submission)
- [ ] Does this code do what was asked?
- [ ] Are null/undefined checks in place where needed?
- [ ] Is error handling complete (no empty catch blocks)?
- [ ] No `console.log` / `debugger` / commented-out code left behind?
- [ ] Imports and dependencies correct?
- [ ] Follows existing codebase patterns?
- [ ] Am I changing more than was asked? (scope creep)
- [ ] Build/compile passes without errors?

## HARD RULES
- DO NOT refactor outside the scope of the current task.
- DO NOT introduce new dependencies without explicit approval.
- DO NOT skip error handling to "keep it simple."
- Make INCREMENTAL changes — verify after each step.
- After code changes, the `lint-and-validate` skill will auto-verify.
