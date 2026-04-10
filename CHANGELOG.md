# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-04-10

### Added
- **Code Knowledge Graph integration** via [code-review-graph](https://github.com/tirth8205/code-review-graph) MCP server
- MCP config entry for `code-review-graph` in `templates/mcp.json` (4 MCP servers total)
- Global rule: `code-graph-awareness.md` — conditional graph tool usage, token-efficient workflow, blast-radius protocol
- Mode-specific rules: `graph-assisted-coding.md`, `graph-assisted-review.md`, `graph-assisted-debugging.md`, `graph-assisted-architecture.md`
- 3 new global skills: `code-graph-build`, `code-graph-review`, `code-graph-impact` (29 skills total)
- Analysis report: `docs/analysis-code-graph-tools.md` comparing code-review-graph vs GitNexus

### Changed
- `skill-awareness.md` updated with graph skills and related rules references
- `bin/install.js` fileMap extended with 5 graph rule entries
- `lib/installer.js` GLOBAL_SKILL_MAP extended with 3 graph skills
- `README.md` updated: skills 26→29, MCP servers 3→4, rules 19→24
- `docs/architecture.md` updated with graph layer diagram, MCP tools layer, and section 7

## [2.0.0] - 2025-04-09

### Breaking Changes
- MCP config (`templates/mcp.json`) now uses placeholder strings instead of `${VAR}` syntax
  - `${GITHUB_PERSONAL_ACCESS_TOKEN}` → `"paste-your-github-token-here"`
  - `${DATABASE_URL}` → `"postgresql://user:password@localhost:5432/dbname"`
  - `${WORKSPACE_PATH}` → `"/path/to/your/workspace"`

### Added
- `--version` / `-v` flag to print package version
- `--clean` flag to detect and remove orphan global skills from `~/.roo/`
- Error handling with user-friendly messages for permission errors (EACCES/EPERM)
- `lib/installer.js` — extracted reusable functions for testability
- Unit tests (`tests/installer.test.js`) and integration tests (`tests/cli.test.js`)
- `CHANGELOG.md` (this file)
- `CONTRIBUTING.md` with development workflow and PR guidelines
- `docs/migration-from-ps1.md` migration guide from PowerShell v1 to Node.js v2
- GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`) — tests on Node 14/18/20, lint rules & skills
- `engines` field in package.json requiring Node >= 14.14.0

### Fixed
- MCP config `${VAR}` syntax was not expanded by RooCode — replaced with placeholder strings
- Env var name mismatch between installer output and mcp.json
- README incorrectly stated "8 global rules" (actually 9) and "11 rule files" (actually 13)
- Installer now gracefully handles file permission errors instead of crashing

### Changed
- Version bumped from 1.0.0 to 2.0.0 (breaking MCP config format)
- Refactored installer: helper functions extracted to `lib/installer.js`

## [1.0.0] - 2025-03-15

### Added
- Initial release
- Project settings installer (rules, modes, skills, .rooignore)
- `--global-skills` flag for 26 curated global skills
- `--mcp` flag for MCP server config
- `--force` flag to overwrite existing files
- 9 global rules, 4 mode-specific rules, 7 project skills
- 13 custom modes with optimized settings
