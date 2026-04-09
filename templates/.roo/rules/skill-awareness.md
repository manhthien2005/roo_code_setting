# Installed Skills Reference — All Modes

## Global Skills (installed to ~/.roo/ via `--global-skills`)

> Source: `templates/global-skills/` in the [roo_code_setting](https://github.com/manhthien2005/roo_code_setting) repo. Installed by `npx github:manhthien2005/roo_code_setting --global-skills`.

### Always Active (all modes)
| Skill | Trigger Condition | Mandatory? |
|-------|------------------|------------|
| `planning-with-files` | Complex multi-step tasks needing persistent progress | Optional |
| `concise-planning` | When user asks for a plan for a coding task | Optional |
| `lint-and-validate` | After EVERY code change (runs lint/type-check tools) | ✅ YES |
| `systematic-debugging` | When encountering bugs, errors, or test failures | ✅ YES |
| `verification-before-completion` | Before EVERY `attempt_completion` | ✅ YES |
| `windows-shell-reliability` | Auto-trigger on Windows for command execution | ✅ Auto |
| `find-skills` | When looking for new capabilities to install | Optional |

### Mode-Specific Global Skills
| Mode | Skill | Purpose |
|------|-------|---------|
| skill-writer | `writing-skills` | Create/update SKILL.md — Anthropic best practices |
| skill-writer | `skill-check` | Validate against agentskills spec |
| merge-resolver | `differential-review` | Security-focused PR/commit/diff review |
| merge-resolver | `finishing-a-development-branch` | Verify tests → merge/PR/keep/discard |
| documentation-writer | `api-documentation` | OpenAPI specs, developer guides |
| documentation-writer | `readme` | Comprehensive README writing |
| documentation-writer | `documentation-templates` | Structure + template reference |
| user-story-creator | `product-manager` | PM frameworks, 32 SaaS metrics |
| user-story-creator | `create-issue-gate` | Strict acceptance criteria gate |
| project-research | `wiki-qa` | Quick evidence-based Q&A from source |
| project-research | `wiki-researcher` | Deep 5-iteration architectural trace |
| security-review | `cc-skill-security-review` | OWASP checklist + TS examples |
| jest-test-engineer | `testing-patterns` | Jest factories, mocking strategies |
| jest-test-engineer | `test-driven-development` | TDD Iron Law |
| devops | `devops-troubleshooter` | Incident response, observability |
| devops | `cicd-automation-workflow-automate` | GitHub Actions, pipeline setup |
| devops | `secrets-management` | CI/CD secrets rotation, Vault |
| coding-teacher | `tutorial-engineer` | Progressive disclosure, Bloom's taxonomy |
| google-genai-developer | `gemini-api-dev` | Gemini API, SDK migration |
| google-genai-developer | `ai-agent-development` | Multi-agent orchestration patterns |

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
