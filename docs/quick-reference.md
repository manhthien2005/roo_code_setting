# Quick Reference

Compact lookup for the most important modes, skills, settings, and file locations.

## Modes

Core workspace modes installed by [`.roomodes`](../templates/.roomodes):

| Slug | Purpose | Model | Trigger keywords |
|---|---|---|---|
| `architect` | Planning, options, risk analysis | `claude-opus-4.6` | plan, architecture, design, trade-offs |
| `code` | Implementation and validation | `claude-opus-4.6` | implement, build, fix, refactor |
| `ask` | Read-only explanation and recommendations | `gpt-5.4` | explain, compare, how, why |
| `debug` | Root-cause analysis | `claude-opus-4.6` | bug, failing, error, reproduce |
| `orchestrator` | Multi-step coordination and delegation | `claude-opus-4.6` | break down, coordinate, phase, delegate |

## Skills

Installed project skills from [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md):

| Name | Mandatory? | Trigger | Location |
|---|---|---|---|
| `coding-standards` | Yes (Code mode) | After code changes in Code mode | `.roo/skills/coding-standards/` |
| `context-budget` | Yes | Long conversations or high context usage | `.roo/skills/context-budget/` |
| `context-checkpoint` | No | Save progress when context grows large | `.roo/skills/context-checkpoint/` |
| `search-first` | Yes (Code mode) | Before creating new files or functions in Code mode | `.roo/skills/search-first/` |
| `project-context` | No | New project or explicit context-detection request | `.roo/skills/project-context/` |
| `continuous-learning` | No | End of complex sessions or explicit request | `.roo/skills/continuous-learning/` |

## Key settings

Selected values from [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json):

| Setting | Impact | Default / base config | Current optimized value |
|---|---|---|---|
| `currentApiConfigName` | Default profile selection | — | `Opus 4.6` |
| `openAiBaseUrl` | API endpoint | Provider-specific | `https://aitokens.io.vn/v1` |
| `openAiApiKey` | Authentication | empty until user sets it | `""` |
| `maxTokens` | Max output size | Provider-specific | `32000` |
| `reasoningEffort` | Depth vs speed/cost | Provider-specific | `high` for Opus, `medium` for GPT-5.4 |
| `autoCondenseContext` | Prevent context overflow | often off in defaults | `true` |
| `autoCondenseContextPercent` | Condense threshold | provider/UI default | `70` |
| `enableCheckpoints` | Save recovery state | provider/UI default | `true` |
| `writeDelayMs` | Delay before file writes | provider/UI default | `500` |
| `maxOpenTabsContext` | Open-tab noise limit | provider/UI default | `10` |
| `maxWorkspaceFiles` | Workspace listing volume | provider/UI default | `150` |
| `consecutiveMistakeLimit` | Stop repeated failures | provider/UI default | `3` |
| `allowedCommands` | Execution policy | provider/UI default | `[*]` |
| `deniedCommands` | Safety filter | provider/UI default | `29` blocked patterns |

## File locations

| What | Where | Purpose |
|---|---|---|
| Workspace modes | [`.roomodes`](../templates/.roomodes) | Defines custom mode roles and permissions |
| Global rules | `.roo/rules/` | Shared behavior across modes |
| Architect rules | `.roo/rules-architect/` | Planning-specific guidance |
| Code rules | `.roo/rules-code/` | Implementation and verification guidance |
| Debug rules | `.roo/rules-debug/` | Root-cause workflow |
| Skills registry | [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md) | Skill inventory and metadata |
| Project skills | `.roo/skills/<skill-name>/SKILL.md` | Task-specific workflows |
| Settings profile | [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json) | Model routing, approvals, and limits |
| Installer | [`bin/install.js`](../bin/install.js) | Copies templates into a workspace |
| Templates root | [`templates/`](../templates/) | Source of all installable assets |

## Daily workflow shortcut

1. Start in `orchestrator` for multi-step work.
2. Use `architect` before large implementation.
3. Use `code` for actual changes.
4. Use `debug` only after reproducing an issue.
5. Use `ask` when you need explanation without edits.
