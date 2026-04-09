# Performance Optimization — All Modes

## Token & Context Optimization
- Prefer RooCode's built-in `read_file` with line range parameters over full file reads for token efficiency.
- Use `limit` parameter — read ≤200 lines/call for exploration, full only when necessary.
- Prefer `codebase_search` over `search_files` for semantic queries.
- When output is long: summarize key points, don't repeat full context already known.
- After 20+ tool calls: consider if `context-checkpoint` skill is needed.

## Context Management
- Place critical info at START or END of responses (lost-in-middle prevention).
- When condensing: preserve decisions and file paths, drop verbose explanations.
- Keep working set lean — exclude irrelevant files from context.
- If prior outputs seem wrong, verify first — do NOT build on poisoned context.

## Application Performance Rules

### General
- Lazy load modules, routes, and heavy dependencies when possible.
- Prefer pagination for large datasets; never load unbounded collections.
- Cache expensive computations; invalidate on relevant state changes.
- Monitor bundle size — flag additions >50KB uncompressed.

### Database
- Avoid N+1 queries — batch database operations where possible.
- Use indexes for frequently queried columns.
- Prefer batch inserts/updates over individual operations.
- Use connection pooling; never open/close connections per request.

### Frontend
- Minimize re-renders: memoize components, avoid inline object/function creation in JSX.
- Use code splitting — lazy load routes and heavy components.
- Optimize images: use appropriate formats (WebP), lazy load below-the-fold.
- Debounce/throttle expensive event handlers (scroll, resize, input).

## Response Efficiency
- Answer scope: minimum necessary to complete the task.
- Avoid defensive verbosity — be precise, not wordy.
- Code blocks: show only changed sections + context, not entire files (unless using `write_to_file`).

## HARD RULES
- MUST use targeted line ranges with `read_file` when you have a target area — never read full file blindly.
- MUST use `limit` parameter ≤200 for exploratory reads.
- MUST trigger `context-checkpoint` skill after 30+ tool calls.
- MUST NOT repeat full context already known — summarize, reference, move forward.
- MUST place critical info at START or END of context — avoid burying it in the middle.
