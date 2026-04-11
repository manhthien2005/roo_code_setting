---
name: lint-and-validate
description: "MANDATORY: Run validation tools after EVERY code change. Do not finish until code is error-free."
risk: moderate
source: self
tags: [linting, validation, quality, mandatory]
---

# Lint and Validate Skill

> **MANDATORY:** Run appropriate validation tools after EVERY code change. Do not finish a task until the code is error-free.

### Procedures by Ecosystem

#### Node.js / TypeScript
1. **Lint/Fix:** `npm run lint` or `npx eslint "path" --fix`
2. **Types:** `npx tsc --noEmit`
3. **Security:** `npm audit --audit-level=high`

#### Python
1. **Linter (Ruff):** `ruff check "path" --fix` (Fast & Modern)
2. **Security (Bandit):** `bandit -r "path" -ll`
3. **Types (MyPy):** `mypy "path"`

## The Quality Loop
1. **Write/Edit Code**
2. **Run Audit:** `npm run lint && npx tsc --noEmit`
3. **Analyze Report:** Check the "FINAL AUDIT REPORT" section.
4. **Fix & Repeat:** Submitting code with "FINAL AUDIT" failures is NOT allowed.

## Error Handling
- If `lint` fails: Fix the style or syntax issues immediately.
- If `tsc` fails: Correct type mismatches before proceeding.
- If no tool is configured: Check the project root for `.eslintrc`, `tsconfig.json`, `pyproject.toml` and suggest creating one.

---
**Strict Rule:** No code should be committed or reported as "done" without passing these checks.

---

## RooCode Integration

Use the `execute_command` tool to run all lint and type-check commands directly. Do NOT rely on external wrapper scripts.

**Workflow:**
1. Detect project type by checking for `package.json`, `tsconfig.json`, `pyproject.toml` using `read_file` or `list_files`
2. Run the appropriate commands via `execute_command` (e.g., `npm run lint`, `npx tsc --noEmit`)
3. Parse the output and fix any issues found
4. Re-run until all checks pass

> **Note:** Respond in the user's configured language when reporting lint results.

## When to Use

- **MANDATORY** after every code change (write, edit, refactor)
- Before calling `attempt_completion` to confirm code compiles cleanly
- When user asks to validate or check code quality

## Common Rationalizations (Anti-Rationalization)

These are excuses agents use to skip validation. All are incorrect.

| Rationalization | Reality |
|---|---|
| "The change is too small to lint" | Small changes cause big breaks. A missing import or type error takes seconds to catch now, hours to debug later. |
| "I'll run lint at the end after all changes" | Errors compound. Fixing 10 issues at once is harder than fixing 1 at a time. Run after EACH change. |
| "The project doesn't have lint configured" | Check for config files first. If none exist, suggest creating one. Never assume no config = no validation. |
| "Lint is passing in my head — I wrote clean code" | Confidence is not evidence. Run the tools. Even senior engineers make typos. |
| "The user didn't ask me to lint" | This skill is MANDATORY. The user doesn't need to ask. Run validation automatically. |
| "I'll fix the warnings later" | Warnings become errors. Fix them now or document why they're acceptable. |

## Red Flags

Signs this skill is being skipped or misapplied:
- Calling `attempt_completion` without any `execute_command` for lint/type-check
- Saying "the code looks correct" without running validation tools
- Fixing one error but not re-running to check for cascading issues
- Ignoring warnings because "they're just warnings"
