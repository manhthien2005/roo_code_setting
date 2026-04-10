---
name: code-graph-impact
description: Run blast-radius impact analysis before making code changes. Shows all callers, dependents, and tests affected by a change. Requires code-review-graph MCP server.
risk: safe
source: inspired by GitNexus impact-analysis skill + code-review-graph tools
tags: [code-graph, impact-analysis, blast-radius, safety]
---

# Impact Analysis Before Changes

## When to Use

- Before modifying a shared function, class, or module
- When planning a refactoring that touches multiple files
- User asks "what will break if I change X?"
- User asks "show me the impact of changing X"

**Prerequisite:** `code-review-graph` MCP server must be configured and graph must be built.

## Instructions

### Step 1: Get Minimal Context
```
get_minimal_context_tool(task="impact analysis for <target>")
```
This costs ~100 tokens and gives you the structural overview.

### Step 2: Run Impact Analysis
```
get_impact_radius_tool(changed_files=["<path/to/file>"])
```
Or if analyzing a specific function:
```
query_graph_tool(pattern="callers_of", target="<function_name>", detail_level="minimal")
```

### Step 3: Classify Impact by Depth

Present results using the risk depth model:

```
## Impact Analysis: <target>

### d=1 — WILL BREAK (direct callers/importers)
These files/functions directly call or import the target.
MUST be updated if the target's signature or behavior changes.

| File | Function | Relationship |
|------|----------|-------------|
| ... | ... | calls / imports / extends |

### d=2 — LIKELY AFFECTED (indirect dependents)
These depend on d=1 callers. Should be tested after changes.

| File | Function | Through |
|------|----------|---------|
| ... | ... | via <d=1 function> |

### d=3 — MAY NEED TESTING (transitive)
Transitive dependencies. Test if they're on a critical path.

### Test Coverage
| Changed Symbol | Has Tests? | Test File |
|---------------|-----------|-----------|
| ... | ✅/❌ | ... |

### Risk Summary
- **Total blast radius**: [count] files
- **Critical (d=1)**: [count] direct dependents
- **Risk level**: Low / Medium / High / Critical
- **Recommendation**: [proceed / proceed with caution / warn user first]
```

### Step 4: Decision Gate
- If **d=1 count > 10** or risk is **High/Critical**: Warn user before proceeding
- If any d=1 callers are in **critical execution flows**: Flag explicitly
- Provide concrete next steps: which files need updating, which tests need running

## Error Handling

| Situation | Resolution |
|-----------|-----------|
| Graph returns empty results | Graph may be stale: run `build_or_update_graph_tool()` first |
| Target not found in graph | Check spelling, or the file may not be parsed (check supported languages) |
| Very large blast radius (>50 files) | Suggest breaking the change into smaller, incremental steps |
