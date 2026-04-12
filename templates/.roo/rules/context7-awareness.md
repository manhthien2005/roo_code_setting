# Context7 Documentation Awareness — All Modes

## When This Rule Applies

This rule applies **only when** the `context7` MCP server is available (configured in MCP settings). If the server is not configured or not responding, skip all Context7 steps — do NOT error out or block the workflow.

**Detection:** At the start of a task, check if `resolve-library-id` and `get-library-docs` tools are available in the MCP tools list. If yes, this rule is active.

## What Context7 Provides

An MCP server that pulls **up-to-date, version-specific documentation** for 9000+ libraries directly into your context. This prevents hallucination caused by outdated training data.

**Key value:** Instead of guessing API syntax from training data, you get the **real, current docs** for the exact library version.

## When to Use Context7

### MUST use Context7 when:
- Writing code that uses a **third-party library** (React, Next.js, Express, Prisma, etc.)
- The user asks about a **specific library API** or syntax
- You are **unsure** about the current API of a library
- The library has had **breaking changes** recently (major version upgrades)
- Writing **configuration files** for frameworks (next.config.js, tailwind.config.ts, etc.)

### DO NOT use Context7 when:
- Writing pure logic (algorithms, business rules) that doesn't depend on library APIs
- Working with standard language features (JavaScript builtins, Node.js core modules)
- Making trivial changes (typos, comments, variable renames)
- The library docs are already in context from a previous call in the same session

## How to Use Context7

### Step 1: Resolve the library ID
```
resolve-library-id(libraryName="<library name>")
```
Example: `resolve-library-id(libraryName="nextjs")`

### Step 2: Get the docs
```
get-library-docs(context7CompatibleLibraryID="<id from step 1>", topic="<specific topic>")
```
Example: `get-library-docs(context7CompatibleLibraryID="/vercel/next.js", topic="app router middleware")`

### Tips for effective use:
- **Be specific with `topic`** — "middleware" is better than no topic at all
- **Cache mentally** — if you already fetched React docs in this session, don't fetch again
- **One library at a time** — don't bulk-fetch docs for 5 libraries upfront

## Token Budget

- Target: **≤2 Context7 tool calls** per task (1 resolve + 1 get-docs)
- Only fetch docs for the **primary library** being used, not every dependency
- Use the `topic` parameter to narrow results and save tokens

## Integration with Other Rules

- `development-workflow.md` Phase 0 (Research) → Use Context7 to verify library APIs before coding
- `coding-standards.md` Pre-Coding → Context7 helps identify correct patterns and conventions
- `error-recovery.md` → When a library API call fails, use Context7 to check if the API changed

## HARD RULES
- MUST use Context7 before writing code that depends on third-party library APIs — when available.
- MUST NOT fetch docs for libraries not relevant to the current task.
- MUST NOT fetch the same library docs multiple times in one session — cache the result.
- MUST NOT block workflow if Context7 server is unavailable — gracefully skip and use best knowledge.
- MUST use the `topic` parameter to narrow docs and save tokens.
- MUST NOT exceed 4 Context7 tool calls per task unless explicitly needed.
