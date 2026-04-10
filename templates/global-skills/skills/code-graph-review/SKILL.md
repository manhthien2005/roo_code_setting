---
name: code-graph-review
description: Perform a graph-assisted code review using blast-radius analysis. Token-efficient delta review that only reads changed code and its impact zone. Requires code-review-graph MCP server.
risk: safe
source: adapted from code-review-graph/skills/review-delta + review-pr
tags: [code-graph, code-review, blast-radius, token-efficient]
---

# Graph-Assisted Code Review

## When to Use

- User asks to "review changes", "review my code", "review this PR"
- Before merging a branch or submitting code
- When you need to understand the full impact of recent changes

**Prerequisite:** `code-review-graph` MCP server must be configured and graph must be built.

## Instructions

### Step 1: Ensure Graph is Current
```
build_or_update_graph_tool()
```
This runs an incremental update (fast, <2 seconds for most projects).

### Step 2: Get Review Context
```
get_review_context_tool()
```
This auto-detects changed files from git diff and returns:
- Changed files and nodes
- Impacted files and nodes (blast radius)
- Source code snippets for changed areas
- Review guidance (test gaps, wide-impact warnings, inheritance concerns)

### Step 3: Assess Risk Level
From the review context, categorize:

| Risk Level | Criteria | Action |
|------------|----------|--------|
| **Low** | ≤3 files changed, blast radius ≤5 files, no d=1 critical callers | Standard review |
| **Medium** | 4-10 files changed, blast radius 6-20, some d=1 callers | Detailed review + test check |
| **High** | >10 files changed, blast radius >20, or d=1 callers in critical flows | Full review + warn user |

### Step 4: Review Each Changed File
For each changed file from the context:

1. **Review the source snippet** for correctness, style, and bugs
2. **Check impacted callers** — do d=1 callers need signature updates?
   ```
   query_graph_tool(pattern="callers_of", target="<changed_function>", detail_level="minimal")
   ```
3. **Verify test coverage**:
   ```
   query_graph_tool(pattern="tests_for", target="<changed_function>", detail_level="minimal")
   ```
4. **Flag untested changed functions** as 🟠 Major findings

### Step 5: Generate Structured Review

```
## Code Review Summary

### Overview
<1-3 sentence summary of changes>

### Risk Assessment
- **Overall risk**: Low / Medium / High
- **Changed files**: [count]
- **Blast radius**: [count] files, [count] functions impacted
- **Test coverage**: [covered]/[total] changed functions tested

### Findings
[SEVERITY] file:line — Description
Impact: [blast radius data]
Suggestion: [concrete fix]

### Missing Tests
- <function_name> in <file> — no test coverage found

### Recommendations
1. <actionable suggestion>
2. <actionable suggestion>
```

## Token Efficiency Notes
- This workflow uses ~5x fewer tokens than reading all changed files manually
- The graph provides structural context (who calls what) without reading source
- Only read full source for files flagged as high-risk in the blast radius
