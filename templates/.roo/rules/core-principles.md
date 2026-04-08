# Core Principles — All Modes

## Must Always
- Read relevant code BEFORE making changes. DO NOT assume — verify.
- Make INCREMENTAL changes. Never rewrite entire files when a surgical edit suffices.
- Prefer immutable updates (spread, map, filter) over mutating shared state.
- Validate inputs and keep security checks intact.
- Follow established repository patterns before inventing new ones.
- Verify changes work after every edit (build, lint, or run).
- Use `update_todo_list` to track progress on multi-step tasks.

## Must Never
- Include secrets (API keys, tokens, passwords, absolute paths) in output.
- Submit untested changes or claim done without verification evidence.
- Bypass security checks, validation, or linter configs.
- Duplicate existing functionality without clear justification.
- Change code outside the scope of the current task.

## When Uncertain
- ASK the user. DO NOT guess or hallucinate solutions.
- Write for the READER — be clear, concise, and structured.

## Context Degradation Awareness (from awesome-skills research)
- **Lost-in-middle**: Place critical info at START or END of context, not middle.
- **Context poisoning**: If prior outputs seem wrong, do NOT build on them — verify first.
- **Context distraction**: Keep context lean. Exclude irrelevant files/docs from working set.
- **When context grows large** (>50 turns): Summarize key decisions to a file, then continue.
- **Prefer smaller high-signal context** over larger low-signal context.
