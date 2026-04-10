---
name: code-graph-build
description: Build or update the code knowledge graph for the current project. Use when first setting up graph, after major refactoring, or when graph seems stale. Requires code-review-graph MCP server.
risk: safe
source: adapted from code-review-graph/skills/build-graph
tags: [code-graph, knowledge-graph, setup, indexing]
---

# Build Code Knowledge Graph

## When to Use

- First time setting up the graph for a repository
- After major refactoring or branch switches
- When graph tools return stale/empty results
- User explicitly asks to "build graph", "index codebase", or "update graph"

**Prerequisite:** `code-review-graph` MCP server must be configured and running.

## Instructions

### Step 1: Check Current Graph Status
```
list_graph_stats_tool()
```
Assess the response:
- If `last_updated` is null → Graph never built, proceed with full build
- If `last_updated` exists → Graph exists, proceed with incremental update
- If tool is not available → Inform user: "code-review-graph MCP server is not configured. Install with: `pip install code-review-graph`"

### Step 2: Build the Graph
For **first-time setup** (no existing graph):
```
build_or_update_graph_tool(full_rebuild=true)
```

For **incremental update** (graph exists):
```
build_or_update_graph_tool()
```

### Step 3: Verify Build Success
```
list_graph_stats_tool()
```

Report to user:
```
Graph Build Complete:
- Files parsed: [count]
- Nodes created: [count] (functions, classes, imports)
- Edges created: [count] (calls, inheritance, tests)
- Languages detected: [list]
- Errors: [count or "none"]
- Last updated: [timestamp]
```

### Step 4: Quick Architecture Preview (optional)
If this is a first-time build, give the user a quick overview:
```
get_architecture_overview_tool()
```

## Error Handling

| Error | Resolution |
|-------|-----------|
| "MCP server not available" | Guide user: `pip install code-review-graph` then restart editor |
| "No files found" | Check `.code-review-graphignore`, ensure repo has supported language files |
| "Permission error on .code-review-graph/" | Check directory permissions, ensure not in read-only filesystem |
| Build succeeds but 0 nodes | Check if all files are in `.gitignore` or ignore patterns |
