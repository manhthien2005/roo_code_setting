# Installed Skills Reference — All Modes

These skills are installed and auto-trigger via `mandatory_skill_check`. Know when each applies:

| Skill | Trigger Condition | Mandatory? |
|-------|------------------|------------|
| `lint-and-validate` | After EVERY code change | ✅ YES |
| `verification-before-completion` | Before EVERY `attempt_completion` | ✅ YES |
| `systematic-debugging` | When encountering bugs, errors, or test failures | ✅ YES |
| `concise-planning` | When user asks for a plan for a coding task | Optional |
| `planning-with-files` | For complex multi-step tasks needing persistent progress | Optional |
| `windows-shell-reliability` | Auto-trigger on Windows for command execution | ✅ Auto |
| `find-skills` | When looking for new capabilities to install | Optional |

## Rules
- DO NOT skip mandatory skills. They exist to prevent errors.
- If a skill applies, follow its instructions COMPLETELY before proceeding.
- When multiple skills could match, prefer the most specific one.
