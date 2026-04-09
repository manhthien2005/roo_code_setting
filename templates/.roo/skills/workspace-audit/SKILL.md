---
name: workspace-audit
description: Self-audit workspace configuration for consistency — verify modes, rules, skills alignment and detect issues.
risk: safe
source: self
tags: [audit, configuration, consistency]
---
# Workspace Audit

## When to Use
- When user requests "audit workspace" or "check configuration"
- After adding/modifying modes, rules, or skills
- Periodically (recommend monthly) to catch drift

## Instructions

### Step 1: Modes Audit
- List all modes from `.roomodes` and settings `customModes`
- Verify each mode has: `roleDefinition`, `whenToUse`, `groups`
- Check `groups` restrict file access appropriately per mode purpose
- Flag: modes without `whenToUse`, modes with overly permissive groups

### Step 2: Rules Audit
- List all rules from `.roo/rules/` (global) and `.roo/rules-{mode}/` (mode-specific)
- Check for conflicts (rule A says "always X", rule B says "never X")
- Check total rule content size — warn if >2000 lines (context bloat risk)
- Flag: duplicate rules, empty rule files, rules that contradict each other

### Step 3: Skills Audit
- List all skills from `.roo/skills/`
- Verify each has YAML frontmatter with `name`, `description`
- Cross-check with `skills-registry.md` — all skills listed?
- Cross-check with `skill-awareness.md` — all skills in awareness table?
- Flag: skills not in registry, registry entries without matching skill files

### Step 4: Settings Audit
- Check `modeApiConfigs` — all modes have model assignment?
- Check `deniedCommands` — reasonable security posture?
- Check `maxWorkspaceFiles`, `maxOpenTabsContext` — reasonable for project size?
- Flag: permissive settings without justification

### Step 5: Generate Report
Output a markdown report:
```
## Workspace Audit Report — {date}
### Summary: {PASS|WARN|FAIL} ({N} issues)
### Modes: {count} modes, {issues}
### Rules: {count} rules, {issues}
### Skills: {count} skills, {issues}
### Settings: {issues}
### Recommendations: {actionable items}
```

## Important
- This is a READ-ONLY audit — do NOT modify any files
- Report findings objectively — let user decide what to fix
- Prioritize findings: CRITICAL > WARN > INFO
