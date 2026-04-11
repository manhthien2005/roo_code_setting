# Core Principles — All Modes

## Must Always
- Read relevant code BEFORE making changes. DO NOT assume — verify.
- Make INCREMENTAL changes. Never rewrite entire files when a surgical edit suffices.
- Prefer immutable updates (spread, map, filter) over mutating shared state.
- Validate inputs and keep security checks intact.
- Follow established repository patterns before inventing new ones.
- Verify changes work after every edit (build, lint, or run).
- Use `update_todo_list` to track progress on multi-step tasks.
- Log key decisions and their reasoning when task complexity ≥ Medium.
- Record error context (what failed, what was tried) before switching approach.

## Must Never
- Include secrets (API keys, tokens, passwords, absolute paths) in output.
- Submit untested changes or claim done without verification evidence.
- Bypass security checks, validation, or linter configs.
- Duplicate existing functionality without clear justification.
- Change code outside the scope of the current task.

## Scope Discipline (from incremental-implementation)
Touch only what the task requires. Do NOT:
- "Clean up" code adjacent to your change
- Refactor imports in files you're not modifying
- Remove comments you don't fully understand
- Add features not in the spec because they "seem useful"
- Modernize syntax in files you're only reading

If you notice something worth improving outside your task scope, note it — don't fix it:
```
NOTICED BUT NOT TOUCHING:
- src/utils/format.ts has an unused import (unrelated to this task)
- The auth middleware could use better error messages (separate task)
→ Want me to create tasks for these?
```

## When Uncertain
- ASK the user. DO NOT guess or hallucinate solutions.
- Write for the READER — be clear, concise, and structured.

## Session Initialization
- At session start, if `.roo/learnings/patterns.md` exists in the project, read the first 50 lines to recall patterns and user preferences from previous sessions.
- DO NOT skip this step for complex tasks (medium+ size per reasoning-optimization.md).
- If file doesn't exist, proceed normally — do NOT create it proactively.

## Context Degradation Awareness (from awesome-skills research)
- **Lost-in-middle**: Place critical info at START or END of context, not middle.
- **Context poisoning**: If prior outputs seem wrong, do NOT build on them — verify first.
- **Output contradiction detection**: If your output contradicts a known fact or file content you just read, STOP — re-read the source file before continuing.
- **3-strike rule**: If 3 consecutive outputs seem wrong or inconsistent, trigger `context-checkpoint` skill — save progress and start fresh context.
- **Stale context**: After >30 tool calls, re-read critical files before making claims about their content.
- **Context distraction**: Keep context lean. Exclude irrelevant files/docs from working set.
- **When context grows large** (>50 turns): Summarize key decisions to a file, then continue.
- **Prefer smaller high-signal context** over larger low-signal context.

## HARD RULES
- MUST read relevant code before editing — editing blind = guaranteed bugs.
- MUST verify changes work (build/lint/test) before claiming done.
- MUST NOT include secrets in any output — no exceptions, no "just for debugging".
- MUST use `update_todo_list` for tasks with 3+ steps.
- MUST create a todo list (`update_todo_list`) within the first response when receiving any non-trivial task.
- MUST NOT use `attempt_completion` while any todo item is still open (`[ ]` or `[-]`) — finish or explicitly remove with justification first.
- MUST check `.roo/learnings/patterns.md` at session start if it exists.
- MUST NOT build on outputs that contradict known facts — verify first.
- MUST NOT touch code outside the current task scope — note it, don't fix it.
