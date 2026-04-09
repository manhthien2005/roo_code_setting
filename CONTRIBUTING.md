# Contributing to roo_code_setting

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Prerequisites

- Node.js >= 14.14.0
- npm or npx
- Basic understanding of [RooCode](https://github.com/RooVetGit/Roo-Code) modes, rules, and skills

## 🚀 Quick Setup

```bash
git clone https://github.com/manhthien2005/roo_code_setting.git
cd roo_code_setting
npm install
npm test   # verify everything works
```

## 📁 Project Structure

```
roo_code_setting/
├── bin/install.js          # CLI installer (thin runner)
├── lib/installer.js        # Extracted helper functions (testable)
├── templates/              # All installable content
│   ├── .roo/               # Project-level rules & skills
│   │   ├── rules/          # Global rules (all modes)
│   │   ├── rules-*/        # Mode-specific rules
│   │   └── skills/         # Project skills
│   ├── global-skills/      # Global skills (~/.roo/)
│   ├── mcp.json            # MCP server config template
│   └── roo-code-settings-optimized.json
├── tests/                  # Jest test suites
│   ├── installer.test.js   # Unit tests for lib/installer.js
│   └── cli.test.js         # Integration tests for CLI
├── docs/                   # Documentation
└── plans/                  # Architecture plans (internal)
```

## 🔧 Development Workflow

### Making Changes

1. **Create a branch**: `git checkout -b type/description` (e.g., `feat/new-rule`, `fix/installer-bug`)
2. **Make changes** following the patterns below
3. **Run tests**: `npm test`
4. **Commit**: `type(scope): description` (conventional commits)
5. **Push & create PR**

### Commit Types

| Type | Use For |
|------|---------|
| `feat` | New feature (rule, skill, mode, flag) |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Maintenance (deps, CI, tooling) |

### What to Change Where

| I want to... | Edit |
|--------------|------|
| Add a global rule | `templates/.roo/rules/your-rule.md` + update `bin/install.js` fileMap |
| Add a mode-specific rule | `templates/.roo/rules-{mode}/your-rule.md` + update `bin/install.js` fileMap |
| Add a project skill | `templates/.roo/skills/your-skill/SKILL.md` + update `bin/install.js` fileMap |
| Add a global skill | `templates/global-skills/skills-{mode}/your-skill/SKILL.md` + update `lib/installer.js` GLOBAL_SKILL_MAP |
| Add a CLI flag | `bin/install.js` (arg parsing + logic) |
| Fix installer logic | `lib/installer.js` (helpers) or `bin/install.js` (CLI) |
| Update settings | `templates/roo-code-settings-optimized.json` |
| Update MCP config | `templates/mcp.json` |

### Writing Rules

Rules are `.md` files loaded by RooCode as system instructions. Follow this pattern:

```markdown
# Rule Title — Scope (e.g., "All Modes" or "Code Mode")

## Section Name
- Actionable instruction
- Another instruction

## HARD RULES
- MUST do X — consequence if not done.
- MUST NOT do Y — why this matters.
```

Key principles:
- Use `MUST` / `MUST NOT` in HARD RULES (strong enforcement language)
- Place critical rules at START or END (lost-in-middle prevention)
- Keep rules ≤50 lines — shorter rules get better compliance
- Every rule file MUST have a `## HARD RULES` section

### Writing Skills

Skills follow the [Agent Skills spec](https://docs.roocode.com/features/agent-skills):

```markdown
---
name: skill-name
description: "One-line description of what this skill does"
risk: safe|cautious|dangerous
source: self
tags: [tag1, tag2]
---

# Skill Title

## When to Use
- Trigger condition 1

## Instructions
1. Step 1
2. Step 2
```

Key principles:
- `name` must match the directory name
- `description` ≤ 120 characters
- Use progressive disclosure — SKILL.md is the entry point, link to reference files
- Skills are loaded on-demand — keep SKILL.md lean

## 🧪 Testing

```bash
npm test              # run all tests
npm test -- --verbose # detailed output
```

### Adding Tests

- Unit tests for `lib/installer.js` → `tests/installer.test.js`
- Integration tests for CLI → `tests/cli.test.js`
- Use temp directories (`fs.mkdtempSync`) for file system tests
- Clean up in `afterEach` — no leftover files

## 📝 Checklist Before Submitting PR

- [ ] `npm test` passes (all tests green)
- [ ] New rules have `## HARD RULES` section
- [ ] New skills have proper frontmatter (name, description, risk, source, tags)
- [ ] `bin/install.js` fileMap updated if adding new template files
- [ ] README.md updated if counts/tree changed
- [ ] CHANGELOG.md updated with your changes
- [ ] Commit messages follow conventional format

## 🐛 Reporting Issues

When reporting bugs, include:
- Node.js version (`node --version`)
- OS and shell
- Full command run
- Full error output
- Expected vs actual behavior

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
