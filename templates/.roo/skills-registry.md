# Skills Registry

Index of all installed skills. Updated manually when skills are added or removed.

## Installed Skills

| Name | Location | Mandatory | Risk | Description |
|------|----------|-----------|------|-------------|
| coding-standards | .roo/skills/coding-standards/ | Yes (Code mode) | safe | Auto-enforce coding standards after every code change in Code mode. Checks file size, nesting, naming, error handling, and anti-patterns. |
| context-budget | .roo/skills/context-budget/ | Yes | safe | Monitor and manage context window usage to prevent overflow and optimize token efficiency. |
| context-checkpoint | .roo/skills/context-checkpoint/ | No | safe | Save progress to a markdown file when context grows large or after many tool calls, preserving key decisions and state for continuity. |
| search-first | .roo/skills/search-first/ | Yes (Code mode) | safe | Enforce research-before-implementation workflow to reduce duplication and hallucination. Mandatory before creating new files or functions in Code mode. |
| project-context | .roo/skills/project-context/ | No | safe | Auto-detect project type, language, framework and generate .roo/project-context.md for context-aware agent behavior. |
| continuous-learning | .roo/skills/continuous-learning/ | No | safe | Capture lessons learned, patterns, and user preferences after complex sessions to improve agent behavior over time. |
| workspace-audit | .roo/skills/workspace-audit/ | No | safe | Self-audit workspace configuration for consistency — verify modes, rules, skills alignment and detect issues. |

## Adding a New Skill

1. Create a directory under `.roo/skills/{skill-name}/`
2. Add a `SKILL.md` file following the [skill template](../skill-template/SKILL.md)
3. Update this registry table with the new skill's metadata
4. If mandatory, add to `.roo/rules/skill-awareness.md` trigger table
