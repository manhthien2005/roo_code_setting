# Learnings & Patterns
> Auto-maintained by continuous-learning skill. User may edit.
> Entries older than 20 are archived to archive.md.

<!-- Agent: Read this file at the start of complex tasks for context -->

## Top Patterns (auto-read at session start)
1. **Search before creating**: Always run `codebase_search` before writing new files/functions — existing ≥80% match solutions save hours of duplication.
2. **Read before editing**: Read the target file AND its imports before making changes — blind edits cause cascading bugs.
3. **Verify before claiming**: Run the actual verification command (test, lint, build) and check output before claiming anything passes — "should work" is not evidence.
4. **Incremental over bulk**: Make small, verifiable changes instead of rewriting entire files — smaller diffs are easier to review and less likely to introduce regressions.
5. **Ask when uncertain**: If confidence is MEDIUM or LOW, ask the user rather than guessing — wrong assumptions cost more time than one question.
6. **Context checkpoint early**: Save progress to a checkpoint file after 25+ tool calls — context overflow causes lost work.
7. **Escalate mode correctly**: Architecture problems → Architect mode, bugs → Debug mode, code changes → Code mode. Wrong mode = wrong approach = wasted effort.
8. **Follow existing patterns**: Match the codebase's existing style, naming, and structure rather than introducing new conventions — consistency > personal preference.
