# 🚀 RooCode Optimized Settings

> Turn RooCode + Claude Opus into a **senior developer** with one command.

Production-grade settings, rules, modes & skills for [RooCode](https://github.com/RooVetGit/Roo-Code) — optimized through research of [ECC Workflow](https://github.com/zueai/ecc) and [Awesome AI Agent Skills](https://github.com/nicholaschenai/awesome-ai-agent-skills).

## ⚡ Quick Install

```bash
npx github:manhthien2005/roo_code_setting
```

That's it. One command installs everything into your project.

> Use `--force` to overwrite existing files: `npx github:manhthien2005/roo_code_setting --force`

## 📦 What Gets Installed

```
your-project/
├── .roomodes                          # Override 5 built-in modes
├── .rooignore                         # Filter noise from AI context
├── .roo/
│   ├── rules/                         # 7 global rules (all modes)
│   │   ├── core-principles.md
│   │   ├── development-workflow.md
│   │   ├── error-recovery.md
│   │   ├── git-workflow.md
│   │   ├── mode-collaboration.md
│   │   ├── security-first.md
│   │   └── skill-awareness.md
│   ├── rules-architect/               # Architect mode rules
│   │   └── planning-discipline.md
│   ├── rules-code/                    # Code mode rules
│   │   ├── coding-standards.md
│   │   └── code-review-before-done.md
│   ├── rules-debug/                   # Debug mode rules
│   │   └── systematic-debugging.md
│   └── skills/                        # Project-specific skills
│       └── context-checkpoint/
│           └── SKILL.md
└── roo-code-settings-optimized.json   # Import-ready settings
```

## 🎯 What's Optimized

### 1. Settings (`roo-code-settings-optimized.json`)

Import via: **RooCode → ⚙️ → Import Settings**

| Setting | Value | Why |
|---------|-------|-----|
| `maxTokens` | 32,000 | Prevent output truncation |
| `autoCondenseContext` | 75% | Auto-compress before overflow |
| `enableCheckpoints` | true | Restore points for long tasks |
| `deniedCommands` | 16 blocked | Prevent `rm -rf`, `DROP TABLE`, etc. |
| `maxOpenTabsContext` | 10 | Reduce noise in context |
| `consecutiveMistakeLimit` | 3 | Stop infinite error loops |
| `writeDelayMs` | 1000 | Review time before file writes |

> ⚠️ **You MUST customize**: Add your API key to `openAiApiKey` and adjust `openAiBaseUrl` to your provider.

### 2. Rules (`.roo/rules/`)

11 rule files auto-inject into every AI message (~3.4K tokens = 1.4% of context):

| Rule | What It Enforces |
|------|-----------------|
| **Core Principles** | Read-before-write, incremental changes, no secrets |
| **Development Workflow** | 4-phase pipeline: Plan → Implement → Verify → Review |
| **Error Recovery** | 3-attempt rule, escalation triggers, conflict resolution |
| **Git Workflow** | Conventional commits, branch naming, PR discipline |
| **Mode Collaboration** | When/how to switch modes, handoff format |
| **Security First** | No SQL injection, XSS, hardcoded credentials |
| **Skill Awareness** | Which skills trigger when |
| **Planning Discipline** | ≥2 alternatives, risk assessment (Architect mode) |
| **Coding Standards** | TypeScript rules, size limits, self-review checklist (Code mode) |
| **Code Review Before Done** | Mandatory verification before completion (Code mode) |
| **Systematic Debugging** | 5-phase scientific method (Debug mode) |

### 3. Mode Overrides (`.roomodes`)

5 built-in modes enhanced with lean, focused prompts:

| Mode | Enhancement |
|------|-------------|
| 🏗️ **Architect** | Mandatory 2+ alternatives, structured output format |
| 💻 **Code** | Read-first coding, DRY/SOLID/KISS/YAGNI enforcement |
| ❓ **Ask** | Structured answers, read-only, suggest next actions |
| 🪲 **Debug** | 5-phase scientific debugging, 2-attempt strategy pivot |
| 🪃 **Orchestrator** | Quality gates, delegation matrix, progress tracking |

### 4. Context Filtering (`.rooignore`)

Excludes noise from AI context window:
- `node_modules/`, `dist/`, `build/`, `.git/`
- Lock files, binary assets, logs
- OS files (`.DS_Store`, `Thumbs.db`)

### 5. Skills (`.roo/skills/`)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| **context-checkpoint** | Context >70% or >30 tool calls | Save progress for session continuity |

## 🔧 Files You Should Customize

| File | What to Change | Priority |
|------|---------------|----------|
| `roo-code-settings-optimized.json` | API keys, model endpoints, provider config | 🔴 Required |
| `.rooignore` | Add project-specific ignores (e.g., `data/`, `migrations/`) | 🟡 Recommended |
| `.roomodes` | Adjust roleDefinitions for your tech stack | 🟢 Optional |
| `.roo/rules-code/coding-standards.md` | Modify TypeScript rules if using different language | 🟢 Optional |
| `.roo/rules/skill-awareness.md` | Update if you install new global skills | 🟢 Optional |

## 📊 Token Cost

| Component | Tokens/message | % of 244K context |
|-----------|---------------|-------------------|
| Rules (all modes) | ~3,400 | 1.4% |
| .roomodes roleDefinition | ~1,000 | 0.4% |
| customInstructions | ~500 | 0.2% |
| **Total overhead** | **~5,000** | **2.0%** |

## 🏗️ Architecture

Based on RooCode's 7-layer system:

```
Layer 7: MCP Servers           → External tool integrations
Layer 6: Codebase Indexing     → Semantic search (optional)
Layer 5: Skills (auto-trigger) → Task-specific instructions  ✅
Layer 4: .roomodes             → Override built-in prompts   ✅
Layer 3: customInstructions    → Per-mode instructions       ✅
Layer 2: .roo/rules/           → Auto-inject rules           ✅
Layer 1: Settings/Config       → Model params, safety        ✅
```

## 🔍 Inspired By

- [ECC Workflow](https://github.com/zueai/ecc) — CLAUDE.md rules, agent specialization, security-first patterns
- [Awesome AI Agent Skills](https://github.com/nicholaschenai/awesome-ai-agent-skills) — Context degradation research, skill architecture

## 📄 License

MIT © [manhthien2005](https://github.com/manhthien2005)
