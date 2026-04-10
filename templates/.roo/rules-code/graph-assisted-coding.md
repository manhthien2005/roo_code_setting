# Graph-Assisted Coding — Code Mode

> **Conditional:** Only applies when `code-review-graph` MCP server is available. Skip all steps below if not configured.

## Enhanced Pre-Coding (extends `coding-standards.md` Pre-Coding)

Before writing code, if the graph is available:

1. **Structural search** — Use `semantic_search_nodes_tool(query="<what you need>")` to find existing implementations. This is faster and more precise than `codebase_search` for finding functions/classes by behavior.

2. **Impact preview** — Before modifying an existing function or class:
   ```
   get_impact_radius_tool(changed_files=["path/to/file"])
   ```
   Know who depends on your change BEFORE you make it.

3. **Test coverage check** — Verify tests exist for what you're changing:
   ```
   query_graph_tool(pattern="tests_for", target="<function_name>", detail_level="minimal")
   ```

## During Coding

- After making significant changes to a function/class, run `detect_changes_tool()` to verify your changes only affect the expected blast radius.
- If `detect_changes` shows unexpected impact, STOP and reassess.

## Enhanced Self-Review (extends `coding-standards.md` checklist)

Add these graph-powered checks:
- [ ] Blast-radius checked for all modified functions/classes?
- [ ] No unexpected d=1 (WILL BREAK) callers left unupdated?
- [ ] Test coverage exists for changed symbols?

## HARD RULES
- MUST check impact radius before modifying any exported/public function when graph is available.
- MUST NOT ignore unexpected blast-radius — reassess your approach if scope expands.
