# Getting Started

Quick start for installing and using the Roo Code Settings Optimization template in a new project.

## 1. Prerequisites

| Requirement | Why you need it | Notes |
|---|---|---|
| Node.js | Runs the installer and package command | Use a current LTS version |
| VS Code + Roo Code extension | Executes the modes, rules, and skills | Install Roo Code before importing settings |
| API key + endpoint | Powers the configured models | Set `openAiApiKey` and verify `openAiBaseUrl` in `roo-code-settings-optimized.json` |

## 2. Install in a project

Run from the target workspace:

```bash
npx github:manhthien2005/roo_code_setting                              # Project settings only
npx github:manhthien2005/roo_code_setting --global-skills               # + 26 global skills
npx github:manhthien2005/roo_code_setting --global-skills --mcp         # + MCP servers
npx github:manhthien2005/roo_code_setting --global-skills --mcp --force # Force overwrite
```

What the installer actually does, based on [`bin/install.js`](../bin/install.js):

- Uses `process.cwd()` as the target project directory.
- Copies files from [`templates/`](../templates/) into your workspace.
- Creates missing directories before copying files.
- Skips existing files by default.
- Overwrites existing files only with `--force` or `-f`.
- With `--global-skills`: copies 26 curated skills from `templates/global-skills/` to `~/.roo/`.
- With `--mcp`: copies `templates/mcp.json` to `.roo/mcp.json` in your workspace.
- Prints next steps: import settings, add API key, customize `.rooignore`, and edit `.roomodes` if needed.

## 3. What gets installed

The installer copies these main assets from [`templates/`](../templates/):

| Installed item | Purpose |
|---|---|
| [`.roomodes`](../templates/.roomodes) | Workspace custom mode definitions |
| `.rooignore` | Filters noisy files from agent context |
| [`.roo/rules/`](../templates/.roo/) | Global rules applied across modes |
| [`.roo/rules-code/`](../templates/.roo/rules-code/coding-standards.md) | Code-mode-only guidance |
| [`.roo/rules-architect/`](../templates/.roo/rules-architect/planning-discipline.md) | Architect-mode-only guidance |
| [`.roo/rules-debug/`](../templates/.roo/rules-debug/systematic-debugging.md) | Debug-mode-only guidance |
| [`.roo/skills/`](../templates/.roo/skills-registry.md) | Project-level skills |
| [`roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json) | Import-ready Roo Code settings |

### Global rules installed

The installer copies 8 global rules from [`bin/install.js`](../bin/install.js):

1. `core-principles.md`
2. `development-workflow.md`
3. `error-recovery.md`
4. `git-workflow.md`
5. `mode-collaboration.md`
6. `security-first.md`
7. `skill-awareness.md`
8. `performance-optimization.md`

### Mode-specific rules installed

- Architect: `planning-discipline.md`
- Code: `coding-standards.md`, `code-review-before-done.md`
- Debug: `systematic-debugging.md`

### Skills installed

The project registry lists 6 skills in [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md):

| Skill | Mandatory | Description |
|---|---|---|
| `coding-standards` | Yes (Code mode) | Auto-enforce coding standards after every code change in Code mode. Checks file size, nesting, naming, error handling, and anti-patterns. |
| `context-budget` | Yes | Monitor and manage context window usage to prevent overflow and optimize token efficiency. |
| `context-checkpoint` | No | Save progress to a markdown file when context grows large or after many tool calls, preserving key decisions and state for continuity. |
| `search-first` | Yes (Code mode) | Enforce research-before-implementation workflow to reduce duplication and hallucination. Mandatory before creating new files or functions in Code mode. |
| `project-context` | No | Auto-detect project type, language, framework and generate `.roo/project-context.md` for context-aware agent behavior. |
| `continuous-learning` | No | Capture lessons learned, patterns, and user preferences after complex sessions to improve agent behavior over time. |

## Global Skills (Optional)

**Project skills** live in `<workspace>/.roo/skills/` and are specific to each project.

**Global skills** live in `~/.roo/` and provide cross-project capabilities for specialist modes like `security-review`, `devops`, `documentation-writer`, and others.

```bash
# Install with the main installer
npx github:manhthien2005/roo_code_setting --global-skills
```

This installs 26 skills across 11 buckets:

| Bucket | Target Mode | Skills Installed |
|--------|-------------|-----------------|
| Core (all modes) | All | `planning-with-files`, `concise-planning`, `lint-and-validate`, `systematic-debugging`, `verification-before-completion`, `windows-shell-reliability` |
| Skill Writer | `skill-writer` | `writing-skills`, `skill-check` |
| Merge Resolver | `merge-resolver` | `differential-review`, `finishing-a-development-branch` |
| Documentation | `documentation-writer` | `api-documentation`, `readme`, `documentation-templates` |
| User Stories | `user-story-creator` | `product-manager`, `create-issue-gate` |
| Research | `project-research` | `wiki-qa`, `wiki-researcher` |
| Security | `security-review` | `cc-skill-security-review` |
| Testing | `jest-test-engineer` | `testing-patterns`, `test-driven-development` |
| DevOps | `devops` | `devops-troubleshooter`, `cicd-automation-workflow-automate`, `secrets-management` |
| Teaching | `coding-teacher` | `tutorial-engineer` |
| GenAI | `google-genai-developer` | `gemini-api-dev`, `ai-agent-development` |

### Verify global skills are installed

Check that the skill directories exist under your home directory:

```bash
# Linux/macOS
ls ~/.roo/skills/
ls ~/.roo/skills-devops/

# Windows (PowerShell)
ls $HOME\.roo\skills\
ls $HOME\.roo\skills-devops\
```

Each bucket directory should contain subdirectories with a `SKILL.md` file. RooCode auto-discovers skills at startup — no restart needed if the extension is already running.

## MCP Setup

The `--mcp` flag installs a pre-configured MCP server config to `.roo/mcp.json`:

```bash
npx github:manhthien2005/roo_code_setting --mcp
```

### Pre-configured servers

| Server | Package | What It Provides |
|--------|---------|-----------------|
| **GitHub** | `@modelcontextprotocol/server-github` | Create repos, issues, PRs, read files, search code |
| **PostgreSQL** | `@modelcontextprotocol/server-postgres` | Query databases, inspect schemas |
| **FileSystem** | `@modelcontextprotocol/server-filesystem` | Read/write files outside workspace |

### Required environment variables

Set these **before** launching VS Code / RooCode:

| Env Var | Server | How to Get |
|---------|--------|-----------|
| `GITHUB_TOKEN` | GitHub | [Create a Personal Access Token](https://github.com/settings/tokens) with `repo` scope |
| `DATABASE_URL` | PostgreSQL | Connection string, e.g. `postgresql://user:pass@localhost:5432/mydb` |
| `WORKSPACE_PATH` | FileSystem | Absolute path to the directory you want the agent to access |

> **Tip**: Only set the env vars for servers you actually use. Servers without valid credentials will fail to start but won't break others.

### Verify MCP is working

1. Open RooCode in VS Code.
2. Check the MCP status indicator — connected servers show a green dot.
3. Test with a prompt like: _"Use GitHub MCP to list my repositories"_.

## 4. Core modes overview

Installed workspace modes from [`.roomodes`](../templates/.roomodes):

| Mode | Purpose | Use it when |
|---|---|---|
| `architect` | Planning, analysis, design | You need options, trade-offs, risks, and an implementation plan |
| `code` | Production implementation | You are ready to make code changes and validate them |
| `ask` | Read-only explanation | You need guidance, explanation, or recommendations without changes |
| `debug` | Root-cause investigation | You have a bug, failure, or unexpected behavior to isolate |
| `orchestrator` | Task decomposition and delegation | The task spans multiple phases or specialist modes |

## 5. Typical workflow

A common flow for non-trivial work looks like this:

1. **User request** → define the goal and constraints.
2. **Orchestrator** → breaks the work into phases and assigns specialists.
3. **Architect** → proposes options, risks, and a plan.
4. **Code** → implements the approved plan and verifies it.
5. **Review / testing** → check correctness, security, and maintainability before finishing.

## 6. First-run checklist

- Run the installer.
- Import [`roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json) into Roo Code.
- Add your `openAiApiKey`.
- Confirm your `openAiBaseUrl` and model IDs match your provider.
- Reopen the workspace if Roo Code has not picked up workspace files yet.
- Start with `orchestrator` for multi-step tasks.

## 7. Customization primer

Use these extension points after the base install works:

| Customize | Where | Notes |
|---|---|---|
| Rules | `.roo/rules/` or `.roo/rules-<mode>/` | Put shared guidance in global rules; put specialist guidance in mode-specific folders |
| Skills | `.roo/skills/<skill-name>/SKILL.md` | Add the skill and update the registry and skill-awareness rule if needed |
| Modes | `.roomodes` | Add or edit workspace mode definitions |
| Settings | `roo-code-settings-optimized.json` | Adjust API providers, model routing, approvals, and limits |

For the deeper model, precedence, and routing details, continue with [Architecture](./architecture.md) and keep [Quick Reference](./quick-reference.md) open while customizing.
