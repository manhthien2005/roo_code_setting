# Graph-Assisted Debugging — Debug Mode

> **Conditional:** Only applies when `code-review-graph` MCP server is available. Skip all steps below if not configured.

## Enhanced Debugging Process (extends `systematic-debugging.md`)

The graph provides structural context that accelerates root-cause analysis.

### During ISOLATE Phase
Use graph to trace dependencies instead of manual code reading:

1. **Find execution flows** related to the bug:
   ```
   list_flows_tool()
   ```
   Then get details of the relevant flow:
   ```
   get_flow_tool(flow_name="<suspected flow>")
   ```

2. **Trace callers/callees** of the suspect function:
   ```
   query_graph_tool(pattern="callers_of", target="<function_name>", detail_level="minimal")
   query_graph_tool(pattern="callees_of", target="<function_name>", detail_level="minimal")
   ```

3. **Check what changed** if this is a regression:
   ```
   detect_changes_tool()
   ```
   Compare changed files against the execution flow to pinpoint the breaking change.

### During ROOT CAUSE Phase
- Use `get_impact_radius_tool` to understand the full chain from suspect to symptom.
- Trace backwards: symptom → caller → caller → root cause (graph makes this 3-5x faster).

### During VERIFY Phase
- After fixing, run `detect_changes_tool()` to confirm your fix only touches expected files.
- Verify no d=1 callers are left broken by your fix.

## HARD RULES
- MUST use graph for dependency tracing when available — manual grep is slower and misses indirect dependencies.
- MUST NOT skip verify phase — use `detect_changes_tool()` to confirm fix scope.
