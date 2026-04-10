# Installed Skills Reference — All Modes

## Global Skills (installed to ~/.roo/ via `--global-skills`)

> Source: `templates/global-skills/` in the [roo_code_setting](https://github.com/manhthien2005/roo_code_setting) repo. Installed by `npx github:manhthien2005/roo_code_setting --global-skills`.

### Always Active (all modes)
| Skill | Trigger Condition | Mandatory? |
|-------|------------------|------------|
| `lint-and-validate` | After EVERY code change (runs lint/type-check tools) | ✅ YES |
| `systematic-debugging` | When encountering bugs, errors, or test failures | ✅ YES |
| `verification-before-completion` | Before EVERY `attempt_completion` | ✅ YES |
| `windows-shell-reliability` | Auto-trigger on Windows for command execution | ✅ Auto |
| `planning-with-files` | Complex multi-step tasks needing persistent progress | Optional |
| `concise-planning` | When user asks for a plan for a coding task | Optional |
| `code-graph-build` | When user asks to build/index/update knowledge graph (requires code-review-graph MCP) | Optional |
| `code-graph-review` | When user asks for graph-assisted code review with blast-radius (requires code-review-graph MCP) | Optional |
| `code-graph-impact` | When user asks for impact analysis before changes (requires code-review-graph MCP) | Optional |

### Mode-Specific Global Skills
> 20 additional mode-specific skills are installed to `~/.roo/skills-{mode}/`. The agent discovers them automatically via SKILL.md frontmatter when the matching mode is active. See `skills-registry.md` or `.roo/rules/skill-awareness.md` in the project root for the full inventory.

## Project Skills (installed to <workspace>/.roo/)

| Skill | Trigger Condition | Mandatory? |
|-------|------------------|------------|
| `coding-standards` | After every code change in Code mode (checks WHAT) | ✅ YES |
| `context-budget` | When conversation grows long (>20 tool calls) | ✅ YES |
| `context-checkpoint` | When context >70%, save progress to file | Optional |
| `search-first` | Before creating new files or functions in Code mode | ✅ YES |
| `project-context` | When opening new project or user requests | Optional |
| `continuous-learning` | End of complex sessions (>50 tool calls) | Optional |
| `workspace-audit` | When user requests audit or after config changes | Optional |

## Overlap Notes
- `coding-standards` (project, WHAT to check) + `lint-and-validate` (global, HOW to run tools) = complementary, both trigger on code change
- `context-checkpoint` (project, reactive) ≠ `planning-with-files` (global, proactive) = different triggers
- `systematic-debugging` (global skill) delegates from `rules-debug/systematic-debugging.md` (rule)

## Related Rules
- `reasoning-optimization.md` — extended thinking & reasoning effort guidance (not a skill, always loaded as rule)
- `code-graph-awareness.md` — conditional rule for code-review-graph MCP integration (active only when MCP server available)

## Session Learning Integration
- At session start, if `.roo/learnings/patterns.md` exists, the agent should read the first 50 lines (triggered by `core-principles.md` Session Initialization rule).
- The `continuous-learning` skill captures patterns at session end; this file closes the loop by making them available at session start.
- Keep learnings file lean — top 20 entries max (older entries archived by the skill).

## HARD RULES
- MUST NOT skip mandatory skills — they exist to prevent errors.
- MUST follow skill instructions COMPLETELY before proceeding when a skill applies.
- MUST prefer the most specific skill when multiple skills could match.
- MUST respect skill trigger conditions — do not invoke skills for unrelated tasks.
- MUST check `.roo/learnings/patterns.md` at session start per `core-principles.md` Session Initialization.
