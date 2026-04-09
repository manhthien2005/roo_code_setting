# Troubleshooting

Common onboarding issues and the fastest checks to run.

## 1. Agent is ignoring my rules

**Checks**
- Confirm the file is inside `.roo/rules/` for global behavior.
- Confirm mode-specific guidance is in `.roo/rules-code/`, `.roo/rules-architect/`, or `.roo/rules-debug/`.
- Confirm file names are stable and descriptive, matching the installed pattern from [`bin/install.js`](../bin/install.js).
- Reopen the workspace if rules were added after Roo Code started.

**Why this happens**
- The rule is in the wrong folder.
- You expected a mode-specific rule to apply globally.
- The workspace file was never installed or was overwritten incorrectly.

## 2. Context overflow or the agent loses track

**Checks**
- Verify `context-budget` is available in [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md).
- Verify `autoCondenseContext` is `true` and `autoCondenseContextPercent` is `70` in [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json).
- Verify `enableCheckpoints` is `true`.
- Lower `maxWorkspaceFiles` if your repo is unusually large.

**Recovery actions**
- Ask the agent to summarize state before continuing.
- Use a checkpoint file for long sessions.
- Reduce noisy files with `.rooignore`.

## 3. A mode is not switching properly

**Checks**
- Make sure the requested slug exactly matches the mode slug in [`templates/.roomodes`](../templates/.roomodes), such as `architect` or `debug`.
- Verify the target mode exists in `modeApiConfigs` inside [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json).
- Check the mode `groups` definition if behavior looks too restricted or too permissive.

**Why this happens**
- Slug mismatch.
- The mode exists but has no intended model mapping.
- A workspace override conflicts with an older global definition.

## 4. A skill is not triggering

**Checks**
- Confirm the skill appears in [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md).
- Confirm trigger expectations in [`templates/.roo/rules/skill-awareness.md`](../templates/.roo/rules/skill-awareness.md).
- Make the request wording closer to the skill description.
- Verify the skill lives at `.roo/skills/<skill-name>/SKILL.md`.

**Why this happens**
- Description matching is too weak or too generic.
- Another, more specific skill matched first.
- The skill exists locally but was not registered or documented.

## 5. A command is blocked unexpectedly

**Checks**
- Review `deniedCommands` in [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json).
- Review `allowedCommands`; broad allow is still filtered by deny rules.
- Check whether the command string accidentally matches a blocked pattern.

**Examples of blocked categories**
- Force deletes
- Registry and permission changes
- Destructive database commands
- Force pushes and risky container / cluster deletes

## 6. Responses are too slow or too expensive

**Checks**
- Review `modeApiConfigs` to see whether a heavy mode is routing to `claude-opus-4.6`.
- Review `reasoningEffort` for the selected API config.
- Review [`templates/.roo/rules/performance-optimization.md`](../templates/.roo/rules/performance-optimization.md) for context and output-budget guidance.

**Tuning options**
- Route lightweight work to `gpt-5.4`.
- Keep prompts narrower and outputs shorter.
- Reduce workspace noise with `.rooignore` and lower `maxWorkspaceFiles` if needed.

## 7. Installer did not copy what I expected

**Checks**
- Run `node bin/install.js --force` if files already existed.
- Read the `fileMap` in [`bin/install.js`](../bin/install.js) to see the exact copy list.
- Confirm you ran the installer from the project root, because it writes to `process.cwd()`.

**Expected behavior**
- Existing files are skipped by default.
- Missing directories are created automatically.
- The installer only copies files listed in `fileMap`.

## Fast triage checklist

| Symptom | First file to inspect |
|---|---|
| Rules not applied | [`.roomodes`](../templates/.roomodes) and `.roo/rules/` |
| Skill not firing | [`templates/.roo/skills-registry.md`](../templates/.roo/skills-registry.md) |
| Wrong model | [`templates/roo-code-settings-optimized.json`](../templates/roo-code-settings-optimized.json) |
| Wrong files installed | [`bin/install.js`](../bin/install.js) |
| Too much context noise | `.rooignore` and performance settings |
