# Architecture

System view of how this template shapes Roo Code behavior after installation.

## 1. Layer model

```mermaid
flowchart LR
    A[Settings\nroo-code-settings-optimized.json]
    B[Modes\n.roomodes]
    C[Rules\n.roo/rules and mode-specific rule folders]
    D[Skills\n.roo/skills]
    M[MCP Tools\nmcp.json]
    E[Agent Behavior]

    A --> B --> C --> D --> E
    M --> E
    C -.->|graph-awareness rules| M
```

### What each layer controls

| Layer | Primary responsibility | Source |
|---|---|---|
| Settings | Model routing, approvals, limits, command policy, context behavior | [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json) |
| Modes | Role definition, scope, tool groups, escalation paths | [`templates/.roomodes`](../templates/.roomodes) |
| Rules | Always-on operating constraints and workflows | [`templates/.roo/rules/`](../templates/.roo/) |
| Skills | Situational instructions triggered when a matching need is detected | [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md) |
| MCP Tools | External tool servers providing specialized capabilities (graph, DB, filesystem) | [`templates/mcp.json`](../templates/mcp.json) |

## 2. Override precedence

Use this order when the same concept exists in multiple places:

1. **Workspace files** in `.roo/` and `.roomodes`
2. **Global files** in `~/.roo/`
3. **Roo Code defaults**

Practical result:

- A workspace rule or mode override wins over a global one.
- A missing workspace asset falls back to the global asset.
- If neither exists, Roo Code uses its built-in default behavior.

## 3. Skill triggering mechanism

This template is designed around a mandatory skill selection step documented by the installed skill guidance.

```text
Request arrives
→ check installed skills
→ compare request to skill descriptions / trigger conditions
→ load exactly one matching skill when applicable
→ continue with that skill's workflow
```

Key files involved:

- [`templates/.roo/rules/skill-awareness.md`](../templates/.roo/rules/skill-awareness.md) lists which skills are mandatory or optional.
- [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md) lists installed project skills, locations, and descriptions.
- The skill description is the matching surface; clearer descriptions trigger more reliably.

## 4. Mode routing and model selection

Model selection is controlled by `modeApiConfigs` in [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json).

| Mode | Routed config | Model |
|---|---|---|
| `architect` | `dx4cni8c3lp` | `claude-opus-4.6` |
| `code` | `dx4cni8c3lp` | `claude-opus-4.6` |
| `debug` | `dx4cni8c3lp` | `claude-opus-4.6` |
| `orchestrator` | `dx4cni8c3lp` | `claude-opus-4.6` |
| `ask` | `izbhd5y1o5` | `gpt-5.4` |
| `documentation-writer` | `izbhd5y1o5` | `gpt-5.4` |
| `coding-teacher` | `izbhd5y1o5` | `gpt-5.4` |
| `user-story-creator` | `izbhd5y1o5` | `gpt-5.4` |

Interpretation:

- Heavy reasoning modes route to Opus.
- Lighter explanation/documentation modes route to GPT-5.4.
- Changing one mapping changes the model used by that mode without editing the mode definition itself.

## 5. Command and context controls

Important runtime controls from [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json):

| Setting | Current optimized value | Effect |
|---|---|---|
| `allowedCommands` | `[*]` | Broad execution allowed unless blocked by deny list |
| `deniedCommands` | 29 blocked patterns | Prevents destructive or risky commands |
| `autoCondenseContext` | `true` | Shrinks context automatically |
| `autoCondenseContextPercent` | `70` | Starts condensing before the window is too full |
| `enableCheckpoints` | `true` | Enables restore points for long sessions |
| `maxOpenTabsContext` | `10` | Limits open-tab noise |
| `maxWorkspaceFiles` | `150` | Limits workspace file listing volume |

## 6. Installed file structure

```text
templates/
├── .roomodes                         # Workspace mode definitions copied by installer
├── .rooignore                        # Context filtering rules copied by installer
├── mcp.json                          # MCP server configuration (4 servers)
├── .roo/
│   ├── skills-registry.md            # Installed skill inventory
│   ├── rules/                        # 9 global rules (incl. code-graph-awareness)
│   ├── rules-architect/              # Architect-only rules (incl. graph-assisted)
│   ├── rules-code/                   # Code-only rules (incl. graph-assisted)
│   ├── rules-code-review/            # Code-review-only rules (incl. graph-assisted)
│   ├── rules-debug/                  # Debug-only rules (incl. graph-assisted)
│   ├── skills/                       # Project skills shipped by this template
│   └── learnings/                    # Captured patterns / long-term notes
├── roo-code-settings-optimized.json  # Import-ready settings profile
├── mode-template.json                # Reference for creating new modes
├── rule-template.md                  # Reference for creating new rules
├── rules/                            # Optional project-language rules
└── skill-template/                   # Starter template for a new skill

global-skills/skills/
├── code-graph-build/SKILL.md         # Build/update knowledge graph
├── code-graph-review/SKILL.md        # Graph-assisted code review
├── code-graph-impact/SKILL.md        # Impact analysis before changes
├── concise-planning/SKILL.md
├── lint-and-validate/SKILL.md
├── planning-with-files/SKILL.md
├── systematic-debugging/SKILL.md
├── verification-before-completion/SKILL.md
└── windows-shell-reliability/SKILL.md
```

## 7. Code Knowledge Graph integration

The template optionally integrates with [code-review-graph](https://github.com/tirth8205/code-review-graph), an MCP server that builds a structural knowledge graph from source code using Tree-sitter. When active, it provides 22 tools for blast-radius analysis, architecture exploration, and token-efficient code context.

### How the graph layer activates

1. **Detection** — [`code-graph-awareness.md`](../templates/.roo/rules/code-graph-awareness.md) checks if graph MCP tools are available at session start.
2. **If available** — Rules inject graph-powered steps into existing workflows (research → impact check → review).
3. **If unavailable** — All graph steps are gracefully skipped. No workflow breaks.

### Token-efficient workflow

```text
get_minimal_context_tool(task="...")     → ~100 tokens, structural overview
  ↓
query_graph_tool(detail_level="minimal") → targeted queries
  ↓
get_impact_radius_tool(changed_files=[]) → blast-radius before editing
```

Target: **≤5 graph tool calls** and **≤800 tokens** of graph context per task.

### Risk depth model (from blast-radius)

| Depth | Meaning | Required action |
|-------|---------|-----------------|
| d=1 | **WILL BREAK** — direct callers/importers | Must update |
| d=2 | **LIKELY AFFECTED** — indirect dependents | Should test |
| d=3 | **MAY NEED TESTING** — transitive | Test if critical path |

### Mode-specific graph rules

| Mode | Rule file | Key capability |
|------|-----------|---------------|
| Code | [`graph-assisted-coding.md`](../templates/.roo/rules-code/graph-assisted-coding.md) | Structural search, impact preview, test coverage check |
| Code Review | [`graph-assisted-review.md`](../templates/.roo/rules-code-review/graph-assisted-review.md) | Review context, blast-radius findings, risk scoring |
| Debug | [`graph-assisted-debugging.md`](../templates/.roo/rules-debug/graph-assisted-debugging.md) | Flow tracing, caller/callee analysis, change detection |
| Architect | [`graph-assisted-architecture.md`](../templates/.roo/rules-architect/graph-assisted-architecture.md) | Architecture overview, community detection, quantified impact |

## 8. How the pieces work together

- The installer copies template assets into a workspace.
- Settings decide **which model** and **which permissions** each mode gets.
- Modes define **who the agent is** and **what tools it may use**.
- Rules define **guardrails and workflow**.
- Skills inject **task-specific playbooks** only when relevant.
- MCP tools extend the agent's capabilities with **external servers** (knowledge graph, database, filesystem, GitHub).
- Graph-awareness rules teach the agent **when and how** to leverage the knowledge graph — conditionally, only when available.

Use [Getting Started](./getting-started.md) for setup, [Troubleshooting](./troubleshooting.md) when behavior is off, and [Quick Reference](./quick-reference.md) for daily lookup.

## 9. Source-of-Truth Separation

### User-owned files (COMMIT to version control)
| File/Directory | Purpose | Who edits |
|---|---|---|
| `templates/.roo/rules/` | Operating rules | Template maintainer |
| `templates/.roo/skills/` | Skill definitions | Template maintainer |
| `templates/.roomodes` | Mode definitions | Template maintainer |
| `docs/` | Documentation | Template maintainer |
| `.roo/learnings/patterns.md` | Session learnings | Agent (curated by user) |
| `plans/` | Task plans | Agent + user |

### Generated artifacts (DO NOT commit / .gitignore)
| File/Directory | Purpose | Generated by |
|---|---|---|
| Workspace `.roo/` (after install) | Installed rules/skills | Installer |
| Workspace `.roomodes` (after install) | Installed modes | Installer |
| `.roo/learnings/archive.md` | Archived old learnings | continuous-learning skill |

