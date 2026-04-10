# Graph-Assisted Review — Code Review Mode

> **Conditional:** Only applies when `code-review-graph` MCP server is available. Skip all steps below if not configured.

## Enhanced Review Process (extends `review-discipline.md`)

When reviewing code with graph available, add these steps:

### Step 1: Graph-Powered Context
Before reviewing the diff, get structural context:
```
get_review_context_tool()
```
This returns: changed files, impacted nodes, blast radius, source snippets, and review guidance (test coverage gaps, wide-impact warnings, inheritance concerns).

### Step 2: Blast-Radius Assessment
For each changed file, assess impact:
- **d=1 callers** — Are they updated? If not, flag as 🔴 Critical.
- **d=2 dependents** — Are they tested? If not, flag as 🟠 Major.
- **Untested changes** — Flag as 🟠 Major per existing review standards.

### Step 3: Enhanced Findings
Enrich your review findings with graph data:
```
[SEVERITY] file:line — What's wrong
Impact: Blast radius shows N files affected at depth D
Suggestion: Concrete fix + list of files that need updating
```

## Graph-Specific Review Checks
- [ ] All d=1 callers updated for signature/behavior changes?
- [ ] Inheritance chain intact (Liskov substitution)?
- [ ] Test coverage for ALL changed symbols (use `query_graph_tool(pattern="tests_for")`)?
- [ ] No orphaned references (dead code from renames)?

## HARD RULES
- MUST use `get_review_context_tool()` for any review involving 3+ changed files when graph is available.
- MUST flag missing d=1 caller updates as 🔴 Critical — these WILL break at runtime.
- MUST check test coverage via graph — untested blast-radius is a risk.
