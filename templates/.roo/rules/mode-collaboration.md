# Mode Collaboration Patterns — All Modes

## When to Switch Modes
| From | To | Trigger |
|------|----|---------|
| Any | Architect | Task needs planning before implementation |
| Architect | Code | Plan approved, ready to implement |
| Code | Debug | Bug encountered, root cause unclear |
| Any | Ask | Need clarification from user |
| Code | Orchestrator | Task spans multiple domains or modes |

## Handoff Format
When switching modes via `new_task` or `switch_mode`, pass structured context:
## Context / ## Task / ## Constraints / ## Expected Output

## Mode-Specific Responsibilities
- **Orchestrator → Architect**: Pass full requirements, scope, constraints. Expect: plan with phases and risks.
- **Architect → Code**: Pass approved plan, affected files, implementation order. Expect: working code.
- **Code → Debug**: Pass error message, stack trace, steps to reproduce, what was tried. Expect: root cause.
- **Any → Ask**: Pass specific question with 2-4 suggested answers. Expect: user's decision.

## HARD RULES
- NEVER switch modes without passing context. The target mode needs information.
- ALWAYS include what was already tried when switching to Debug mode.
- Architect mode MUST wait for user confirmation before passing to Code mode.
- When in doubt about which mode to use, stay in current mode and ASK the user.
