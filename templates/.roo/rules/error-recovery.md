# Error Recovery & Edge Cases — All Modes

## When Uncertain About Requirements
- **DO**: Ask a specific question with 2-4 suggested answers.
- **DO NOT**: Guess and implement. Wrong assumptions waste more time than asking.
- **Template**: "I need clarification on X. Options: (A) ..., (B) ..., (C) ..."

## When Requirements Conflict
- STOP implementation immediately.
- List each conflicting requirement explicitly.
- Ask user to prioritize: "Requirement A says X, but Requirement B says Y. Which takes priority?"
- DO NOT silently pick one — the user must decide.

## When Codebase Is Too Large
- Focus on the module/feature relevant to the task.
- Use `codebase_search` and `search_files` to find relevant code — do NOT read everything.
- Start with entry points (routes, exports, main files), then trace dependencies.
- If still unclear after 3 search attempts, ASK the user for guidance on where to look.

## When a Fix Fails Repeatedly
- After **3 failed attempts** at the same fix, STOP and reassess.
- Switch to `systematic-debugging` skill: gather evidence before proposing another fix.
- Consider: "Am I fixing the symptom or the root cause?"
- If root cause is unclear, escalate to user with: what you tried, what happened, what you suspect.

## When to Escalate to User
Escalate immediately when:
- **Security concern**: Potential vulnerability, exposed secrets, auth bypass.
- **Breaking change**: Change affects public API, database schema, or shared contracts.
- **Ambiguous scope**: Task could be interpreted multiple ways with different effort levels.
- **3 failed attempts**: Same approach failed 3 times — need human judgment.
- **Outside expertise**: Task requires domain knowledge you don't have.

## When Context Window Is Getting Full
- Summarize key decisions and progress to a markdown file in `plans/`.
- Reference the file instead of repeating information.
- Focus on the immediate next step, not the entire remaining work.
- Use `update_todo_list` to track what's done vs. remaining.

## Uncertainty Calibration
- When making claims about code behavior, assess your confidence level:
  - **HIGH**: You read the code and verified the behavior with a tool call → proceed.
  - **MEDIUM**: You inferred from patterns but didn't verify → verify with `read_file` or `search_files` before proceeding.
  - **LOW**: You're guessing or relying on memory → STOP, gather evidence first.
- If confidence < HIGH and you cannot verify, say: "I'm not certain about X. Let me check." Then check.
- NEVER present MEDIUM/LOW confidence claims as facts — qualify with evidence level.

## HARD RULES
- MUST ask when uncertain — guessing wastes more time than asking.
- MUST STOP after 3 failed fix attempts — switch to `systematic-debugging` skill.
- MUST escalate security concerns immediately — never silently fix auth/secret issues.
- MUST NOT silently pick one interpretation when requirements conflict — ask user to prioritize.
- MUST state confidence level when making claims about code you haven't directly read.
