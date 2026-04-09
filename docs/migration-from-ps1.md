# Migration Guide: PowerShell Script → NPM Package

This guide helps users migrate from the old PowerShell-based installer to the new `roo-code-setting` npm package (v2.0.0+).

## What Changed

| Aspect | Old (PS1 Script) | New (NPM Package) |
|--------|-------------------|-------------------|
| Installation | `.\install-roo-settings.ps1` | `npx roo-code-setting` |
| Platform | Windows only (PowerShell) | Cross-platform (Node.js) |
| Global skills | Manually placed in `~/.roo/` | `npx roo-code-setting --global-skills` |
| MCP config | Manual copy | `npx roo-code-setting --mcp` |
| Idempotent | No (overwrites always) | Yes (skip existing, `--force` to overwrite) |
| Cleanup | Manual | `npx roo-code-setting --clean` |
| Preview | Not available | `npx roo-code-setting --dry-run` |

## Step-by-Step Migration

### 1. Check Current State

Before migrating, note what you currently have:

```powershell
# Check existing project rules
ls .roo/rules/
ls .roo/rules-*/

# Check existing global skills
ls $HOME/.roo/skills*/
```

### 2. Install the NPM Package

The installer is idempotent — it won't overwrite existing files unless you use `--force`.

```bash
# Preview what will be installed (no changes made)
npx roo-code-setting --dry-run

# Install project settings (rules, skills, modes)
npx roo-code-setting

# Install global skills
npx roo-code-setting --global-skills

# Install MCP config
npx roo-code-setting --mcp
```

### 3. Clean Up Orphan Skills

The old PS1 script may have installed skills that are no longer maintained or have been reorganized. Use `--clean` to detect orphans:

```bash
# Detect orphan skills (preview only)
npx roo-code-setting --clean

# Remove orphan skills
npx roo-code-setting --clean --force
```

Common orphans from the PS1 era:
- `~/.roo/skills-security-review/secrets-management` (now in `skills-devops/`)
- Skills installed to wrong bucket directories

### 4. Handle MCP Config

**Important breaking change in v2.0.0**: The MCP config (`mcp.json`) now uses placeholder strings instead of `${VAR}` syntax.

Old format (broken — RooCode doesn't expand env vars):
```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
  }
}
```

New format (v2.0.0):
```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "paste-your-github-token-here"
  }
}
```

After installing with `--mcp`, edit `.roo/mcp.json` and replace placeholder values with your actual credentials.

### 5. Import RooCode Settings

The optimized settings file needs to be imported through the RooCode UI:

1. Open RooCode in VS Code
2. Go to ⚙️ Settings → Import
3. Select `roo-code-settings-optimized.json`
4. Restart VS Code

### 6. Remove Old PS1 Script

Once everything is working:

```powershell
# Remove old installer script
Remove-Item install-roo-settings.ps1

# Remove any old backup files
Remove-Item *.ps1.bak
```

## What's New in v2.0.0

Features not available in the PS1 script:

- **`--dry-run`**: Preview all changes before installing
- **`--clean`**: Detect and remove orphan global skills
- **`--version`**: Check installed version
- **Error handling**: Permission errors get user-friendly messages instead of crashes
- **5 new mode-specific rules**: security-review, testing, code-review, orchestrator, devops
- **HARD RULES enforcement**: All 9 global rules now have explicit MUST/MUST NOT sections
- **Self-improvement loop**: Agent auto-reads learnings from previous sessions
- **Context poisoning defense**: 3-strike rule + contradiction detection

## Troubleshooting

### "Permission denied" errors

```bash
# On Unix/macOS: check ~/.roo/ permissions
ls -la ~/.roo/

# Fix permissions if needed
chmod -R u+rw ~/.roo/
```

### Existing files not updated

The installer skips existing files by default. Use `--force` to overwrite:

```bash
npx roo-code-setting --force --global-skills --mcp
```

### MCP servers not connecting

1. Verify `.roo/mcp.json` exists in your project root
2. Check placeholder values were replaced with real credentials
3. Ensure MCP servers (GitHub, PostgreSQL, filesystem) are installed:
   ```bash
   npx -y @modelcontextprotocol/server-github --help
   npx -y @modelcontextprotocol/server-postgres --help
   npx -y @anthropic/mcp-filesystem --help
   ```

### Global skills not detected by RooCode

Skills must be in the correct directory structure:
```
~/.roo/
├── skills/                    # Generic skills (all modes)
│   ├── planning-with-files/
│   │   └── SKILL.md
│   └── ...
├── skills-devops/             # Mode-specific skills
│   ├── devops-troubleshooter/
│   │   └── SKILL.md
│   └── ...
└── ...
```

If RooCode doesn't detect skills, restart VS Code.
