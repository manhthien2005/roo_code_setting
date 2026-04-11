---
name: coding-standards
description: Auto-enforce coding standards after every code change in Code mode. Checks file size, nesting, naming, error handling, and anti-patterns.
risk: safe
source: self
tags: [coding-standards, quality, enforcement]
---

# Coding Standards Enforcement

## When to Use

Trigger after EVERY code change in Code mode — automatically verify standards compliance.

## Quick Checks (run mentally after each edit)

### 1. Size Limits
- **Functions**: ≤50 lines. If larger → split into focused helpers.
- **Files**: 200-400 lines typical, 800 max. If larger → extract modules.
- **Nesting**: ≤4 levels deep. Use early returns and extract helpers.

### 2. Naming Conventions
- `camelCase` for variables/functions
- `PascalCase` for types/interfaces/components
- `UPPER_SNAKE_CASE` for constants
- `is/has/should` prefix for booleans
- File names: match primary export name

### 3. Error Handling
- ✅ PASS: `catch (error: unknown) { if (error instanceof Error) { ... } }`
- ❌ FAIL: `catch (e) { console.log(e) }` — empty/generic catch
- ❌ FAIL: `catch (error: any)` — never use `any`
- Always handle Promise rejections — no floating promises

### 4. Anti-patterns to Flag
- `console.log` in production code → use proper logger
- `debugger` statements left behind
- `any` type usage → use `unknown` + narrowing
- `var` keyword → use `const` (prefer) or `let`
- Commented-out code blocks → remove or add TODO with issue number
- Mutation of function parameters → use spread/copy

### 5. Import & Dependency Hygiene
- No circular imports
- No unused imports
- Group: external deps → internal modules → relative paths
- Prefer named exports over default exports

### 6. Simplicity First (from incremental-implementation)

Before writing any code, ask: **"What is the simplest thing that could work?"**

After writing code, review against these checks:
- Can this be done in fewer lines?
- Are these abstractions earning their complexity?
- Would a staff engineer say "why didn't you just..."?
- Am I building for hypothetical future requirements, or the current task?

```
SIMPLICITY CHECK:
✗ Generic EventBus with middleware pipeline for one notification
✓ Simple function call

✗ Abstract factory pattern for two similar components
✓ Two straightforward components with shared utilities

✗ Config-driven form builder for three forms
✓ Three form components
```

Three similar lines of code is better than a premature abstraction. Implement the naive, obviously-correct version first. Optimize only after correctness is proven with tests.

## Reference

For full TypeScript rules, pre-coding checklist, and self-review process, see `.roo/rules-code/coding-standards.md`.
