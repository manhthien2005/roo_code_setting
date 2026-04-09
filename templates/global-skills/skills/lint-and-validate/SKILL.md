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
