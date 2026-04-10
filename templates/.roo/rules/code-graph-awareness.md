# Code Knowledge Graph Awareness — All Modes

## When This Rule Applies

This rule applies **only when** the `code-review-graph` MCP server is available (configured in MCP settings). If the server is not configured or not responding, skip all graph-related steps — do NOT error out or block the workflow.

**Detection:** At the start of a session or when encountering a new project, check if `build_or_update_graph_tool`, `get_minimal_context_tool`, or `list_graph_stats_tool` are available in the MCP tools list. If yes, this rule is active.

## What code-review-graph Provides

A persistent, incrementally-updated knowledge graph of the codebase. It parses source code with Tree-sitter, builds a structural graph (functions, classes, imports, calls, inheritance, tests) in SQLite, and exposes it via 22 MCP tools.

**Key value:** Reduces token usage by 5-8x by giving you precise context instead of reading entire files.

## Token-Efficient Workflow (MUST follow this order)

### Step 1: Minimal Context First (~100 tokens)
```
get_minimal_context_tool(task="<what you are doing>")
```
This returns the full structural picture at minimal token cost. It also provides `next_tool_suggestions` telling you the optimal next step.

### Step 2: Targeted Queries (use `detail_level="minimal"` by default)
```
query_graph_tool(pattern="<specific query>", target="<symbol>", detail_level="minimal")
```
Only escalate to `detail_level="full"` when you genuinely need source code snippets.

### Step 3: Token Budget
- Target: **≤5 tool calls** per task for graph context
- Target: **≤800 total tokens** of graph context per task
- Prefer `query_graph` with a specific target over broad `list_*` calls

## Before Editing Code (Blast-Radius Protocol)

When modifying functions, classes, or methods in a project with an active graph:

1. **Check impact** before editing:
   ```
   get_impact_radius_tool(changed_files=["path/to/file.py"])
   ```
   This returns all callers, dependents, and tests that could be affected.

2. **Assess risk level** (borrowed from GitNexus model):
   | Depth | Meaning | Action Required |
   |-------|---------|-----------------|
   | d=1 | **WILL BREAK** — direct callers/importers | MUST update these |
   | d=2 | **LIKELY AFFECTED** — indirect dependents | Should test |
   | d=3 | **MAY NEED TESTING** — transitive | Test if critical path |

3. **If high-risk** (>10 impacted files or d=1 callers in critical paths): Warn the user before proceeding.

## Before Committing (Change Detection)

When the graph is active, run change detection before commits:
```
detect_changes_tool()
```
This provides risk-scored analysis of your changes, helping catch unintended side effects.

## Architecture Exploration

When onboarding to a new project or exploring unfamiliar code:
```
get_architecture_overview_tool()     → High-level structure
list_communities_tool()              → Functional areas/modules
list_flows_tool()                    → Execution flows by criticality
```

## When NOT to Use Graph Tools

- Trivial changes (typos, config, comments) — graph overhead not worth it
- Files not parsed by Tree-sitter (binary, images, generated files)
- When the graph is stale and cannot be updated (inform user instead)

## Integration with Other Rules

- `development-workflow.md` Phase 0 (Research) → Use `semantic_search_nodes_tool` for code discovery
- `development-workflow.md` Phase 3 (Verify) → Use `detect_changes_tool` for impact verification
- `code-review-before-done.md` → Use `get_review_context_tool` for graph-assisted review

## HARD RULES
- MUST call `get_minimal_context_tool` FIRST when graph is available — never start with expensive queries.
- MUST check blast-radius before editing functions/classes when graph is available.
- MUST use `detail_level="minimal"` by default — only escalate when needed.
- MUST NOT block workflow if code-review-graph server is unavailable — gracefully skip graph steps.
- MUST NOT exceed 5 graph tool calls per task unless the task explicitly requires deep analysis.
- MUST warn user when blast-radius shows >10 impacted files at d=1 depth.
