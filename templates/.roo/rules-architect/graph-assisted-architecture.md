# Graph-Assisted Architecture — Architect Mode

> **Conditional:** Only applies when `code-review-graph` MCP server is available. Skip all steps below if not configured.

## Enhanced Architecture Analysis (extends `planning-discipline.md`)

The graph provides data-driven architecture insights instead of guesswork.

### Before ANY Architecture Response
When the graph is available, gather structural data first:

1. **Architecture overview** — Get the big picture:
   ```
   get_architecture_overview_tool()
   ```
   This returns community structure, module boundaries, and key coupling points.

2. **Module inventory** — Understand functional areas:
   ```
   list_communities_tool()
   ```
   Each community represents a cohesive code cluster.

3. **Execution flows** — Understand critical paths:
   ```
   list_flows_tool()
   ```
   Flows sorted by criticality — shows which code paths matter most.

### Enhanced Solution Options
When proposing architecture changes:
- Use `get_impact_radius_tool` to quantify the blast radius of each option.
- Compare options by: **number of affected files**, **depth of impact**, **criticality of affected flows**.
- This turns "I think option A is safer" into "Option A affects 12 files at d=2, Option B affects 47 files at d=1."

### Enhanced Risk Assessment
Add graph-powered data to risk tables:

| Risk | Likelihood | Impact | Evidence (from graph) | Mitigation |
|------|-----------|--------|----------------------|------------|
| Breaking API consumers | High | High | 23 d=1 callers found | Migration guide + deprecation period |

### For Refactoring Proposals
- Use `refactor_tool(action="suggestions")` to get automated refactoring suggestions.
- Use `refactor_tool(action="dead_code")` to identify unused code for removal.
- Use `refactor_tool(action="rename_preview")` to preview rename impact.

## HARD RULES
- MUST use graph data to quantify impact in architecture proposals when available — "I think" is weaker than "graph shows."
- MUST include blast-radius data in risk assessment tables.
- MUST check execution flows for criticality before proposing changes to shared modules.
