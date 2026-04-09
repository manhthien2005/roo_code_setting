# Global Skills Integration & MCP Servers Plan

> **Ngày:** 2026-04-09  
> **Author:** Architect mode  
> **Status:** DRAFT — Chờ user approve trước khi chuyển Code mode  
> **Scope:** 26 global skills + 3 MCP servers  
> **References:**  
> - [`bin/install.js`](../bin/install.js) — current installer  
> - [`roocode-skills-deploy.md`](../roocode-skills-deploy.md) — skill map & rationale  
> - [`plans/global-skills-review.md`](global-skills-review.md) — previous review  
> - Source repo: https://github.com/nicholaschenai/awesome-ai-agent-skills

---

## Table of Contents

1. [Problem Analysis](#1-problem-analysis)
2. [Solution Options](#2-solution-options)
3. [Recommended Approach](#3-recommended-approach)
4. [Part A — Chiến Lược Chuyển Đổi](#4-part-a--chiến-lược-chuyển-đổi)
5. [Part B — Directory Structure](#5-part-b--directory-structure)
6. [Part C — Customization Checklist](#6-part-c--customization-checklist)
7. [Part D — Install Flow Mới](#7-part-d--install-flow-mới)
8. [Part E — Danh Sách 26 Skills](#8-part-e--danh-sách-26-skills)
9. [Part F — MCP Server Integration](#9-part-f--mcp-server-integration)
10. [Implementation Plan](#10-implementation-plan)
11. [Risk Assessment](#11-risk-assessment)
12. [Open Questions](#12-open-questions)

---

## 1. Problem Analysis

### Vấn đề thực tế (Actual Problem)

**Hiện trạng:** [`bin/install.js`](../bin/install.js:211) Phase 2 (`--global-skills`) clone **toàn bộ** `awesome-ai-agent-skills` repo vào temp dir → cherry-pick 26 skills → copy raw vào `~/.roo/skills*`. Vấn đề:

| # | Vấn đề | Impact |
|---|--------|--------|
| 1 | **Network dependency** — phải có internet + git khi install | Offline install không hoạt động |
| 2 | **Uncontrolled content** — skills gốc có thể thay đổi bất cứ lúc nào | Breaking changes không kiểm soát |
| 3 | **No customization** — skills raw từ awesome-skills chưa được optimize cho RooCode | Tool names, frontmatter, trigger conditions có thể sai |
| 4 | **Clone overhead** — clone toàn bộ repo (~50+ skills) chỉ để lấy 26 | Chậm, tốn bandwidth |
| 5 | **Git dependency** — [`isGitAvailable()`](../bin/install.js:103) check bắt buộc | Fail nếu không có git |
| 6 | **No MCP setup** — [`mcpEnabled: true`](../templates/roo-code-settings-optimized.json:235) nhưng không có MCP servers nào được configure | MCP tools không hoạt động |

### Hidden Assumptions

- Skills trong awesome-skills repo dùng tool names tương thích RooCode (chưa verify)
- Repo structure (`skills/` directory) sẽ không thay đổi
- Tất cả 26 skills đều có SKILL.md hợp lệ theo Agent Skills spec
- User có git installed và internet access

### Constraints

| Constraint | Detail |
|---|---|
| Cross-platform | Windows (`%USERPROFILE%`) + macOS/Linux (`$HOME`) |
| No git dependency | Install flow mới KHÔNG được yêu cầu git |
| Backward compatible | `--global-skills` flag vẫn hoạt động, chỉ thay đổi source |
| NPM package size | Templates tăng package size — cần giữ dưới ~2MB |
| Agent Skills spec | Frontmatter: name, description (<200 chars), risk, source, tags |
| Existing review findings | Áp dụng findings từ [`plans/global-skills-review.md`](global-skills-review.md) — đặc biệt C1 (deduplicate secrets-management) |

---

## 2. Solution Options

### Option A: Templates-in-Repo (Recommended)

Clone 26 skills vào `templates/global-skills/` **một lần**, customize, ship as part of NPM package.

| Pros | Cons |
|---|---|
| ✅ Zero network dependency khi install | ❌ NPM package size tăng (~500KB-1MB) |
| ✅ Full control over skill content | ❌ Manual sync khi upstream skills update |
| ✅ Customize cho RooCode compatibility | ❌ Phải maintain 26 SKILL.md files |
| ✅ Consistent behavior across installs | |
| ✅ Không cần git installed | |
| ✅ Idempotent — same content mỗi install | |

### Option B: Hybrid — Templates + Optional Git Sync

Ship customized templates nhưng thêm `--sync-upstream` flag để pull latest từ repo và merge changes.

| Pros | Cons |
|---|---|
| ✅ Tất cả lợi ích của Option A | ❌ Complexity cao — cần merge logic |
| ✅ Có thể update từ upstream khi cần | ❌ Merge conflicts giữa customized vs upstream |
| ✅ Best of both worlds | ❌ Vẫn cần git cho sync |
| | ❌ Over-engineering cho 26 static files |

### Option C: Git Submodule

Add awesome-skills repo as git submodule, reference skills from submodule path.

| Pros | Cons |
|---|---|
| ✅ Automatic upstream tracking | ❌ NPM package không ship submodules |
| ✅ Standard git workflow | ❌ User cần git + submodule init |
| | ❌ Không customize được — luôn raw |
| | ❌ Không giải quyết vấn đề chính |

---

## 3. Recommended Approach

**→ Option A: Templates-in-Repo**

**Justification:**
1. Giải quyết **tất cả 5 vấn đề** trong Problem Analysis
2. Complexity thấp — copy files, không cần merge logic
3. NPM package size tăng chấp nhận được (~500KB cho 26 SKILL.md files)
4. Upstream skills ít thay đổi (mature repo, semantic versioning)
5. Cho phép customize hoàn toàn cho RooCode ecosystem

**Khi nào reconsider:** Nếu upstream repo thay đổi >30% skills trong 6 tháng → xem xét Option B.

---

## 4. Part A — Chiến Lược Chuyển Đổi

### 4.1 Hiện trạng (AS-IS)

```
User runs: npx roo-code-setting --global-skills
  │
  ├── Phase 1: Copy templates/.roo/ → <workspace>/.roo/    (project skills)
  │
  └── Phase 2: --global-skills
       ├── Check git available → FAIL if not
       ├── git clone --depth 1 awesome-ai-agent-skills → /tmp/
       ├── For each of 26 skills in globalSkillMap:
       │   ├── Find skill in /tmp/skills/{name}/
       │   └── Copy to ~/.roo/{bucket}/{name}/
       └── Cleanup /tmp/
```

**Source:** [`bin/install.js`](../bin/install.js:211-312) Phase 2 logic.

### 4.2 Mục tiêu (TO-BE)

```
User runs: npx roo-code-setting --global-skills
  │
  ├── Phase 1: Copy templates/.roo/ → <workspace>/.roo/    (project skills) — UNCHANGED
  │
  └── Phase 2: --global-skills                              — CHANGED
       ├── NO git clone needed
       ├── Source: templates/global-skills/{bucket}/{name}/  (bundled in package)
       ├── For each of 26 skills in globalSkillMap:
       │   └── Copy to ~/.roo/{bucket}/{name}/
       └── Done — no cleanup needed
```

### 4.3 Migration Steps

```mermaid
graph TD
    A[Clone awesome-skills repo locally] --> B[Copy 26 skills to templates/global-skills/]
    B --> C[Customize each SKILL.md]
    C --> D[Update bin/install.js Phase 2]
    D --> E[Remove git clone logic]
    E --> F[Test on Windows + macOS]
    F --> G[Update package.json files array]
    G --> H[Publish updated NPM package]
```

### 4.4 Lợi ích

| Metric | Before | After |
|---|---|---|
| Install time (global skills) | ~30-60s (clone + copy) | ~2-5s (local copy only) |
| Network required | ✅ Yes | ❌ No |
| Git required | ✅ Yes | ❌ No |
| Skill content control | ❌ None | ✅ Full |
| Reproducibility | ⚠️ Depends on repo state | ✅ Deterministic |

---

## 5. Part B — Directory Structure

### 5.1 New Template Structure

```
templates/
  global-skills/
    skills/                                    # Bucket: global (6 skills, all modes)
      planning-with-files/SKILL.md
      concise-planning/SKILL.md
      lint-and-validate/SKILL.md
      systematic-debugging/SKILL.md
      verification-before-completion/SKILL.md
      windows-shell-reliability/SKILL.md
    skills-skill-writer/                       # Bucket: skill-writer (2 skills)
      writing-skills/SKILL.md
      skill-check/SKILL.md
    skills-merge-resolver/                     # Bucket: merge-resolver (2 skills)
      differential-review/SKILL.md
      finishing-a-development-branch/SKILL.md
    skills-documentation-writer/               # Bucket: documentation-writer (3 skills)
      api-documentation/SKILL.md
      readme/SKILL.md
      documentation-templates/SKILL.md
    skills-user-story-creator/                 # Bucket: user-story-creator (2 skills)
      product-manager/SKILL.md
      create-issue-gate/SKILL.md
    skills-project-research/                   # Bucket: project-research (2 skills)
      wiki-qa/SKILL.md
      wiki-researcher/SKILL.md
    skills-security-review/                    # Bucket: security-review (1 skill)
      cc-skill-security-review/SKILL.md
    skills-jest-test-engineer/                 # Bucket: jest-test-engineer (2 skills)
      testing-patterns/SKILL.md
      test-driven-development/SKILL.md
    skills-devops/                             # Bucket: devops (3 skills)
      devops-troubleshooter/SKILL.md
      cicd-automation-workflow-automate/SKILL.md
      secrets-management/SKILL.md
    skills-coding-teacher/                     # Bucket: coding-teacher (1 skill)
      tutorial-engineer/SKILL.md
    skills-google-genai-developer/             # Bucket: google-genai-developer (2 skills)
      gemini-api-dev/SKILL.md
      ai-agent-development/SKILL.md
```

**Total: 11 buckets, 26 unique skills.**

### 5.2 Mapping Rules

- Bucket name = target directory under `~/.roo/`
- `skills/` = global skills loaded for ALL modes
- `skills-{mode}/` = skills loaded only for that specific mode
- Each skill is a directory containing at minimum `SKILL.md`
- Some skills may include `references/`, `scripts/`, or `assets/` subdirectories

### 5.3 Notes on secrets-management

Per [`plans/global-skills-review.md`](global-skills-review.md) finding C1: `secrets-management` is placed **only** in `skills-devops/` (NOT duplicated to `skills-security-review/`). Cross-reference added in `cc-skill-security-review/SKILL.md`.

---

## 6. Part C — Customization Checklist

### 6.1 Per-Skill Checklist (apply to ALL 26 skills)

#### C1. Frontmatter Compliance (Agent Skills Spec)

```yaml
---
name: {must match directory name exactly}
description: {under 200 characters, clear trigger condition}
risk: {safe | moderate | dangerous}
source: self                        # Changed from "community" since we customized
tags: [{relevant-tags}]
---
```

- [ ] `name` matches directory name (e.g., `lint-and-validate` directory → `name: lint-and-validate`)
- [ ] `description` < 200 chars, includes when-to-use trigger
- [ ] `risk` level assessed (most should be `safe`, scripts = `moderate`)
- [ ] `source` changed to `self` (we own the customized version)
- [ ] `tags` relevant and non-empty

#### C2. Tool Name Compatibility

Verify all SKILL.md instructions reference **RooCode tool names**, not Claude Code or other platform tools:

| RooCode Tool | Common Wrong Names |
|---|---|
| `read_file` | `Read`, `file_read`, `cat` |
| `write_to_file` | `Write`, `file_write` |
| `apply_diff` | `Edit`, `patch`, `sed` |
| `codebase_search` | `Search`, `semantic_search` |
| `search_files` | `Grep`, `ripgrep`, `rg` |
| `execute_command` | `Bash`, `Shell`, `Terminal`, `run` |
| `list_files` | `LS`, `ListDir` |
| `ask_followup_question` | `ask_user`, `prompt` |
| `attempt_completion` | `complete`, `done` |
| `new_task` | `spawn`, `delegate` |
| `switch_mode` | `change_mode` |
| `update_todo_list` | `todo`, `checklist` |

- [ ] No references to Claude Code tools (`Bash`, `Read`, `Write`, `Edit`, `Grep`)
- [ ] No references to `TodoWrite`, `TodoRead` (Claude Code todo tools)
- [ ] All tool references use exact RooCode names

#### C3. External Dependencies

- [ ] Remove references to external plugins (e.g., Trail of Bits `plugin-dev`)
- [ ] Remove Python script dependencies (e.g., `product-manager-toolkit` patterns)
- [ ] Remove references to `~/.codex/` paths
- [ ] Remove references to Claude Code hooks system
- [ ] If skill references external URLs, verify they're still valid

#### C4. Trigger Differentiation

- [ ] `description` doesn't conflict with other skills in same scope
- [ ] `whenToUse` equivalent (in description) is specific enough for `mandatory_skill_check`
- [ ] No double-load risk with project skills (cross-check with [`.roo/skills/`](../templates/.roo/skills/))
- [ ] Verify against overlap matrix in [`plans/global-skills-review.md` §1](global-skills-review.md)

#### C5. Vietnamese Context (Optional)

- [ ] If skill has user-facing output instructions, add bilingual note: "Respond in user's configured language"
- [ ] Reference `language: "vi"` setting awareness where relevant
- [ ] Do NOT translate SKILL.md instructions themselves (keep English for portability)

#### C6. Content Quality

- [ ] Instructions are actionable (not just description/capability listing)
- [ ] Skill has clear entry point and exit criteria
- [ ] No placeholder text or TODO comments
- [ ] Appropriate length: 50-500 lines (flag if outside range)

### 6.2 Customization Priority per Skill

| Priority | Definition | Action |
|---|---|---|
| 🔴 **Must-Customize** | Known incompatibilities, wrong tool names, or missing frontmatter | Full rewrite of affected sections |
| 🟡 **Review-Only** | Likely compatible but needs verification | Read, verify checklist, minor edits |
| 🟢 **Use-As-Is** | Known good quality, already compatible | Copy, verify frontmatter only |

---

## 7. Part D — Install Flow Mới

### 7.1 Phase 2 Changes in `bin/install.js`

**Before (current):**
```
Phase 2:
  1. Check git available → exit(1) if not
  2. git clone --depth 1 repo → tempDir
  3. Verify skills/ directory exists
  4. Loop globalSkillMap → copy from tempDir/skills/{name} to ~/.roo/{bucket}/{name}
  5. Cleanup tempDir
```

**After (new):**
```
Phase 2:
  1. Resolve globalSkillsTemplateDir = path.join(__dirname, '..', 'templates', 'global-skills')
  2. Verify globalSkillsTemplateDir exists → exit(1) with helpful error if not
  3. Loop globalSkillMap → copy from templates/global-skills/{bucket}/{name} to ~/.roo/{bucket}/{name}
  4. No cleanup needed
```

### 7.2 Key Code Changes

```javascript
// REMOVE: git clone logic (lines 218-245 of current install.js)
// REMOVE: isGitAvailable() check for Phase 2
// REMOVE: tempDir creation and cleanup
// REMOVE: AWESOME_SKILLS_REPO constant (line 44)

// ADD: Template-based source
const globalSkillsTemplateDir = path.join(__dirname, '..', 'templates', 'global-skills');

// CHANGE: Source path in copy loop
// Before: path.join(tempDir, 'skills', skillName)
// After:  path.join(globalSkillsTemplateDir, bucket, skillName)
```

### 7.3 Target Path Logic (Cross-Platform)

```javascript
const homeRooDir = path.join(os.homedir(), '.roo');
// Windows: C:\Users\{user}\.roo\
// macOS:   /Users/{user}/.roo/
// Linux:   /home/{user}/.roo/
```

**No changes needed** — current [`os.homedir()`](../bin/install.js:249) usage is already cross-platform. ✅

### 7.4 Flag Behavior

| Flag | Before | After |
|---|---|---|
| `--global-skills` | Clone repo → copy skills | Copy from templates → ~/.roo/ |
| `--force` | Overwrite existing skills | **Unchanged** — same behavior |
| No flag | Skip Phase 2 | **Unchanged** |
| `--help` | Show help text | **Update** help text (remove "requires git" note) |

### 7.5 Removed Dependencies

- ❌ `git` — no longer required for global skills install
- ❌ Internet connection — no longer required
- ❌ `AWESOME_SKILLS_REPO` constant — removed
- ❌ `isGitAvailable()` function — can be removed entirely (not used elsewhere)
- ❌ `execSync` import — can be removed if `isGitAvailable()` is the only user

### 7.6 Error Handling

```javascript
// New error case: templates directory missing (corrupted package)
if (!fs.existsSync(globalSkillsTemplateDir)) {
  console.log(red('  ✗ Error: Global skills templates not found.'));
  console.log(yellow('  Package may be corrupted. Try: npm install roo-code-setting@latest'));
  process.exit(1);
}
```

---

## 8. Part E — Danh Sách 26 Skills

### 8.1 Complete Skill Inventory

#### Bucket 1: `skills` — Global (6 skills, all modes)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 1 | `planning-with-files` | `skills/planning-with-files/` | `skills` | 🟡 Review-Only | 30 min |
| 2 | `concise-planning` | `skills/concise-planning/` | `skills` | 🟡 Review-Only | 30 min |
| 3 | `lint-and-validate` | `skills/lint-and-validate/` | `skills` | 🔴 Must-Customize | 1 hr |
| 4 | `systematic-debugging` | `skills/systematic-debugging/` | `skills` | 🟡 Review-Only | 30 min |
| 5 | `verification-before-completion` | `skills/verification-before-completion/` | `skills` | 🟡 Review-Only | 30 min |
| 6 | `windows-shell-reliability` | `skills/windows-shell-reliability/` | `skills` | 🟡 Review-Only | 30 min |

**Notes:**
- `lint-and-validate` (🔴): May reference Claude Code `Bash` tool for running linters. Must verify and change to `execute_command`.
- All 6 must have clear trigger differentiation per [`global-skills-review.md` §4.3](global-skills-review.md).

#### Bucket 2: `skills-skill-writer` (2 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 7 | `writing-skills` | `skills/writing-skills/` | `skills-skill-writer` | 🔴 Must-Customize | 1 hr |
| 8 | `skill-check` | `skills/skill-check/` | `skills-skill-writer` | 🟡 Review-Only | 30 min |

**Notes:**
- `writing-skills` (🔴): Likely references Anthropic-specific patterns. Must align with RooCode's Agent Skills spec and tool permissions.

#### Bucket 3: `skills-merge-resolver` (2 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 9 | `differential-review` | `skills/differential-review/` | `skills-merge-resolver` | 🔴 Must-Customize | 1.5 hr |
| 10 | `finishing-a-development-branch` | `skills/finishing-a-development-branch/` | `skills-merge-resolver` | 🔴 Must-Customize | 1.5 hr |

**Notes:**
- Both likely reference `git` commands via `Bash` tool → must change to `execute_command`.
- `differential-review` may reference GitHub CLI (`gh`) → verify and add fallback instructions.

#### Bucket 4: `skills-documentation-writer` (3 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 11 | `api-documentation` | `skills/api-documentation/` | `skills-documentation-writer` | 🟡 Review-Only | 30 min |
| 12 | `readme` | `skills/readme/` | `skills-documentation-writer` | 🟡 Review-Only | 30 min |
| 13 | `documentation-templates` | `skills/documentation-templates/` | `skills-documentation-writer` | 🟡 Review-Only | 30 min |

#### Bucket 5: `skills-user-story-creator` (2 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 14 | `product-manager` | `skills/product-manager/` | `skills-user-story-creator` | 🟡 Review-Only | 45 min |
| 15 | `create-issue-gate` | `skills/create-issue-gate/` | `skills-user-story-creator` | 🟡 Review-Only | 30 min |

**Notes:**
- `product-manager`: Large skill (~30+ frameworks, 32 SaaS metrics). Verify no external Python deps.

#### Bucket 6: `skills-project-research` (2 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 16 | `wiki-qa` | `skills/wiki-qa/` | `skills-project-research` | 🔴 Must-Customize | 1 hr |
| 17 | `wiki-researcher` | `skills/wiki-researcher/` | `skills-project-research` | 🔴 Must-Customize | 1 hr |

**Notes:**
- Both reference code search tools heavily. Must verify `codebase_search` / `search_files` alignment.
- `wiki-researcher` has 5-iteration deep analysis — may reference `Grep` tool.

#### Bucket 7: `skills-security-review` (1 skill)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 18 | `cc-skill-security-review` | `skills/cc-skill-security-review/` | `skills-security-review` | 🔴 Must-Customize | 2 hr |

**Notes:**
- 500+ lines OWASP checklist with TypeScript examples. Likely has Claude Code tool references.
- Add cross-reference to `secrets-management` in devops bucket (per review C1).
- Name prefix `cc-` may indicate Claude Code origin → consider renaming.

#### Bucket 8: `skills-jest-test-engineer` (2 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 19 | `testing-patterns` | `skills/testing-patterns/` | `skills-jest-test-engineer` | 🟡 Review-Only | 30 min |
| 20 | `test-driven-development` | `skills/test-driven-development/` | `skills-jest-test-engineer` | 🟡 Review-Only | 30 min |

#### Bucket 9: `skills-devops` (3 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 21 | `devops-troubleshooter` | `skills/devops-troubleshooter/` | `skills-devops` | 🔴 Must-Customize | 1 hr |
| 22 | `cicd-automation-workflow-automate` | `skills/cicd-automation-workflow-automate/` | `skills-devops` | 🟡 Review-Only | 45 min |
| 23 | `secrets-management` | `skills/secrets-management/` | `skills-devops` | 🔴 Must-Customize | 1 hr |

**Notes:**
- `devops-troubleshooter`: Incident response likely references `Bash` tool.
- `secrets-management`: Only in devops bucket (NOT security-review). Must add note about deduplication.

#### Bucket 10: `skills-coding-teacher` (1 skill)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 24 | `tutorial-engineer` | `skills/tutorial-engineer/` | `skills-coding-teacher` | 🟡 Review-Only | 45 min |

**Notes:**
- 397 lines with progressive disclosure + Bloom's taxonomy. Review for compatibility.

#### Bucket 11: `skills-google-genai-developer` (2 skills)

| # | Skill Name | Source Repo Path | Target Bucket | Priority | Est. Effort |
|---|---|---|---|---|---|
| 25 | `gemini-api-dev` | `skills/gemini-api-dev/` | `skills-google-genai-developer` | 🟡 Review-Only | 30 min |
| 26 | `ai-agent-development` | `skills/ai-agent-development/` | `skills-google-genai-developer` | 🟡 Review-Only | 30 min |

### 8.2 Summary Statistics

| Category | Count | Est. Total Effort |
|---|---|---|
| 🔴 Must-Customize | 10 skills | ~12 hours |
| 🟡 Review-Only | 16 skills | ~9 hours |
| 🟢 Use-As-Is | 0 skills | 0 |
| **Total** | **26 skills** | **~21 hours** |

### 8.3 Customization Order (Risk-First)

Phase skills by risk: fix most-likely-to-break first.

| Phase | Skills | Rationale |
|---|---|---|
| **Phase 1** (Critical) | `lint-and-validate`, `cc-skill-security-review`, `differential-review`, `finishing-a-development-branch` | Highest tool-name incompatibility risk |
| **Phase 2** (Important) | `wiki-qa`, `wiki-researcher`, `writing-skills`, `devops-troubleshooter`, `secrets-management`, `systematic-debugging` | Search/command tool references |
| **Phase 3** (Standard) | Remaining 16 review-only skills | Lower risk, mainly frontmatter fixes |

---

## 9. Part F — MCP Server Integration

### 9.1 Overview

RooCode supports MCP (Model Context Protocol) servers configured via `.roo/mcp.json` at workspace level. Current state: [`mcpEnabled: true`](../templates/roo-code-settings-optimized.json:235) but no servers configured.

### 9.2 Three MCP Servers

#### Server 1: GitHub MCP

**Purpose:** Manage repos, PRs, issues, and code search directly from RooCode.

| Attribute | Value |
|---|---|
| **NPM Package** | `@modelcontextprotocol/server-github` |
| **Install** | `npx -y @modelcontextprotocol/server-github` (auto-download) |
| **Transport** | stdio |
| **Config Location** | `.roo/mcp.json` (workspace) OR global VS Code settings |
| **Required Env Vars** | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| **Capabilities** | Create/list repos, branches, PRs, issues; search code; read/write files |

**Config Template:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Security Considerations:**
- Token should have **minimal scopes**: `repo` (for private repos) or `public_repo` (for public only)
- Do NOT grant `admin:org`, `delete_repo`, or `write:packages` unless explicitly needed
- Token stored in environment variable, never hardcoded
- Consider using GitHub fine-grained personal access tokens (PATs) for per-repo access

**Environment Variable Setup:**
```bash
# Windows (PowerShell)
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'ghp_...', 'User')

# macOS/Linux
echo 'export GITHUB_TOKEN="ghp_..."' >> ~/.bashrc  # or ~/.zshrc
```

#### Server 2: PostgreSQL MCP

**Purpose:** Query database directly from RooCode — read-only for safety.

| Attribute | Value |
|---|---|
| **NPM Package** | `@modelcontextprotocol/server-postgres` |
| **Install** | `npx -y @modelcontextprotocol/server-postgres` (auto-download) |
| **Transport** | stdio |
| **Config Location** | `.roo/mcp.json` (workspace — database is project-specific) |
| **Required Env Vars** | `DATABASE_URL` (PostgreSQL connection string) |
| **Capabilities** | Execute read-only SQL queries, list tables, describe schema |

**Config Template:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "${DATABASE_URL}"
      ],
      "env": {}
    }
  }
}
```

**Security Considerations:**
- **CRITICAL: Use a read-only database user** — e.g., `CREATE ROLE roo_readonly WITH LOGIN PASSWORD '...' NOSUPERUSER NOCREATEDB NOCREATEROLE;`
- Grant `SELECT` only: `GRANT SELECT ON ALL TABLES IN SCHEMA public TO roo_readonly;`
- Connection string should use read replica if available
- Do NOT use admin/superuser credentials
- Consider `statement_timeout` to prevent long-running queries: `?options=-c%20statement_timeout%3D5000` (5s)
- Never expose production database — use staging or read replica

**Environment Variable Setup:**
```bash
# Format: postgresql://user:password@host:port/database
export DATABASE_URL="postgresql://roo_readonly:password@localhost:5432/mydb"
```

#### Server 3: FileSystem MCP

**Purpose:** Extended filesystem access beyond workspace — e.g., reading global configs, docs.

| Attribute | Value |
|---|---|
| **NPM Package** | `@modelcontextprotocol/server-filesystem` |
| **Install** | `npx -y @modelcontextprotocol/server-filesystem` (auto-download) |
| **Transport** | stdio |
| **Config Location** | `.roo/mcp.json` (workspace) OR global VS Code settings |
| **Required Env Vars** | None — paths passed as args |
| **Capabilities** | Read/write files, list directories, search within allowed paths |

**Config Template:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${ALLOWED_PATH_1}",
        "${ALLOWED_PATH_2}"
      ],
      "env": {}
    }
  }
}
```

**Security Considerations:**
- **Path restriction is the primary security control** — only listed directories are accessible
- Do NOT include `C:\` or `/` as allowed path (grants full disk access)
- Recommended paths: project directory, docs directory, specific config dirs
- Avoid: home directory root, system directories, other projects
- RooCode already has `alwaysAllowReadOnlyOutsideWorkspace: false` — FileSystem MCP **bypasses** this ⚠️
- Users must understand that FileSystem MCP extends agent's reach beyond normal workspace constraints

**Example with restricted paths:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "D:/LocketDiary",
        "D:/docs/api-specs"
      ],
      "env": {}
    }
  }
}
```

### 9.3 Combined MCP Config Template

File: `templates/mcp.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "${DATABASE_URL}"
      ],
      "env": {}
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/dir"
      ],
      "env": {}
    }
  }
}
```

### 9.4 Config Location Strategy

| Scope | Path | Use Case |
|---|---|---|
| **Workspace** | `<project>/.roo/mcp.json` | Project-specific servers (PostgreSQL for this project's DB) |
| **Global** | VS Code User Settings → `roo-code.mcpServers` | Shared servers (GitHub, common FileSystem paths) |

**Recommendation:** 
- **GitHub MCP** → Global (same token across projects)
- **PostgreSQL MCP** → Workspace (different DB per project)
- **FileSystem MCP** → Workspace (different paths per project)

### 9.5 Integration into `bin/install.js`

**New Phase 3: MCP Config Setup**

```
Phase 3: --mcp (new flag)
  1. Read templates/mcp.json
  2. Check if <workspace>/.roo/mcp.json exists
  3. If not exists OR --force:
     a. Copy template to <workspace>/.roo/mcp.json
     b. Print instructions for setting env vars
  4. Print reminder: "Set GITHUB_TOKEN, DATABASE_URL before using MCP servers"
```

**Alternatively:** Bundle MCP config as part of existing Phase 1 (always copy template, user enables/disables servers manually).

**Decision:** Use separate `--mcp` flag because:
1. MCP config contains sensitive env var references
2. Not all projects need all 3 servers
3. User should consciously opt-in to MCP setup

### 9.6 RooCode MCP Config Format Reference

RooCode reads MCP config from `.roo/mcp.json` in workspace root:

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "<executable>",          // Required: command to run
      "args": ["<arg1>", "<arg2>"],       // Required: command arguments
      "env": {                            // Optional: environment variables
        "<VAR_NAME>": "<value>"
      },
      "disabled": false,                  // Optional: disable without removing
      "alwaysAllow": ["tool1", "tool2"],  // Optional: auto-approve specific tools
      "timeout": 30                       // Optional: connection timeout in seconds
    }
  }
}
```

**Environment variable interpolation:** Use `${ENV_VAR_NAME}` syntax — RooCode resolves from process environment at runtime.

---

## 10. Implementation Plan

### Phase 1: Clone & Initial Setup (Architect → Code)

| # | Task | Owner | Effort | Dependencies |
|---|---|---|---|---|
| 1.1 | Clone awesome-ai-agent-skills repo locally | Code | 15 min | Internet access |
| 1.2 | Create `templates/global-skills/` directory structure (11 buckets) | Code | 15 min | 1.1 |
| 1.3 | Copy 26 skills from cloned repo into correct buckets | Code | 30 min | 1.2 |
| 1.4 | Verify all 26 SKILL.md files exist in correct locations | Code | 10 min | 1.3 |

**Gate:** `find templates/global-skills -name "SKILL.md" | wc -l` returns `26`

### Phase 2: Customize Skills — Critical (Code)

| # | Task | Owner | Effort | Dependencies |
|---|---|---|---|---|
| 2.1 | Customize `lint-and-validate` — fix tool names, verify instructions | Code | 1 hr | Phase 1 |
| 2.2 | Customize `cc-skill-security-review` — fix tools, add secrets-mgmt cross-ref | Code | 2 hr | Phase 1 |
| 2.3 | Customize `differential-review` — fix git/GitHub tool references | Code | 1.5 hr | Phase 1 |
| 2.4 | Customize `finishing-a-development-branch` — fix tool references | Code | 1.5 hr | Phase 1 |
| 2.5 | Customize `wiki-qa` + `wiki-researcher` — fix search tool names | Code | 2 hr | Phase 1 |
| 2.6 | Customize `writing-skills` — align with RooCode Agent Skills spec | Code | 1 hr | Phase 1 |
| 2.7 | Customize `devops-troubleshooter` + `secrets-management` — fix tools | Code | 2 hr | Phase 1 |
| 2.8 | Customize `systematic-debugging` — verify alignment with debug rule | Code | 30 min | Phase 1 |

**Gate:** All 10 must-customize skills pass checklist C1-C6

### Phase 3: Review Remaining Skills (Code)

| # | Task | Owner | Effort | Dependencies |
|---|---|---|---|---|
| 3.1 | Review and fix frontmatter for remaining 16 skills | Code | 4 hr | Phase 2 |
| 3.2 | Verify tool name compliance across all 26 | Code | 2 hr | 3.1 |
| 3.3 | Run quality check: no external deps, no TODO placeholders | Code | 1 hr | 3.2 |

**Gate:** All 26 skills pass checklist C1-C6

### Phase 4: Update Installer (Code)

| # | Task | Owner | Effort | Dependencies |
|---|---|---|---|---|
| 4.1 | Refactor `bin/install.js` Phase 2 — remove git clone, use templates | Code | 2 hr | Phase 3 |
| 4.2 | Add `--mcp` flag and Phase 3 MCP config logic | Code | 1.5 hr | 4.1 |
| 4.3 | Create `templates/mcp.json` with 3 server configs | Code | 30 min | 4.2 |
| 4.4 | Update `--help` text — remove git requirement, add --mcp | Code | 15 min | 4.2 |
| 4.5 | Update `package.json` — add `templates/global-skills/**` to files | Code | 15 min | 4.1 |

**Gate:** `node bin/install.js --global-skills` runs without git, copies 26 skills correctly

### Phase 5: Test & Verify (Code + DevOps)

| # | Task | Owner | Effort | Dependencies |
|---|---|---|---|---|
| 5.1 | Test on Windows — verify paths, permissions, all 26 skills copied | Code | 1 hr | Phase 4 |
| 5.2 | Test on macOS/Linux (if available) — verify cross-platform | DevOps | 1 hr | Phase 4 |
| 5.3 | Test `--force` flag — verify overwrite behavior | Code | 30 min | Phase 4 |
| 5.4 | Test `--mcp` flag — verify mcp.json created correctly | Code | 30 min | Phase 4 |
| 5.5 | Verify RooCode loads installed skills correctly | Code | 30 min | 5.1 |
| 5.6 | Verify MCP servers connect (requires env vars set) | Code | 30 min | 5.4 |

**Gate:** All tests pass, RooCode sees 26 global skills + 3 MCP servers

### Phase 6: Documentation & Publish (Documentation-Writer)

| # | Task | Owner | Effort | Dependencies |
|---|---|---|---|---|
| 6.1 | Update README.md — add global skills + MCP sections | Doc | 1 hr | Phase 5 |
| 6.2 | Update `docs/getting-started.md` — add MCP setup guide | Doc | 1 hr | Phase 5 |
| 6.3 | Update `skill-awareness.md` rule — reflect 26 global skills | Code | 30 min | Phase 5 |
| 6.4 | Bump package version, publish to npm | DevOps | 15 min | 6.1-6.3 |

### Total Estimated Effort

| Phase | Effort | Calendar (1 person) |
|---|---|---|
| Phase 1: Clone & Setup | 1 hr | Day 1 |
| Phase 2: Critical Customization | 12 hr | Day 1-2 |
| Phase 3: Review Remaining | 7 hr | Day 3 |
| Phase 4: Update Installer | 4.5 hr | Day 4 |
| Phase 5: Test & Verify | 4 hr | Day 4-5 |
| Phase 6: Documentation | 3 hr | Day 5 |
| **Total** | **~31.5 hr** | **~5 working days** |

---

## 11. Risk Assessment

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Upstream skills have Claude Code tool names** — many skills may use `Bash`, `Read`, `Write` instead of RooCode equivalents | High | High — skills won't work | Phase 2 explicitly audits and rewrites tool references. Checklist C2 is mandatory. |
| R2 | **NPM package size exceeds limit** — 26 SKILL.md files + references could be large | Low | Medium — slow install | Monitor: if >2MB, compress or trim verbose skills. Most SKILL.md are <20KB. |
| R3 | **Skills reference non-existent features** — e.g., Claude Code hooks, TodoWrite | Medium | Medium — confusing instructions | Checklist C3 removes external dependencies. Phase 2 catches this for critical skills. |
| R4 | **Cross-platform path issues** — `path.join()` for `~/.roo/` on Windows vs Unix | Low | High — skills install to wrong location | Already handled by `os.homedir()` + `path.join()` in current code. Add test on both platforms. |
| R5 | **Double-load risk with project skills** — global `lint-and-validate` + project `coding-standards` | Medium | Low — wasted tokens, minor confusion | Already documented in review. `skill-awareness.md` clarifies relationship. |
| R6 | **MCP server runtime failure** — missing env vars, wrong Node.js version | Medium | Medium — MCP tools unavailable | Template includes comments explaining required env vars. `--mcp` prints setup instructions. |
| R7 | **PostgreSQL MCP used with write access** — agent could modify data | Low | Critical — data loss | Template instructions emphasize read-only user. Config template uses `${DATABASE_URL}` — user controls credentials. |
| R8 | **FileSystem MCP path too broad** — user adds root path | Medium | High — agent accesses sensitive files | Template includes warning comments. Documentation warns against broad paths. |
| R9 | **Breaking change for existing users** — `--global-skills` behavior changes | Low | Medium — unexpected behavior | Same flag, same result (26 skills installed). Only source changes. Announce in changelog. |
| R10 | **Upstream repo reorganizes** — future sync impossible | Low | Low — we own templates now | Templates are a one-time copy. Future upstream changes don't affect us. Option B can be reconsidered later. |

---

## 12. Open Questions

| # | Question | Impact | Default If Not Answered |
|---|---|---|---|
| Q1 | Should `cc-skill-security-review` be renamed? The `cc-` prefix suggests Claude Code origin. | Low — name is functional | Keep original name for traceability |
| Q2 | Should some skills include `references/` or `scripts/` subdirectories, or only `SKILL.md`? | Medium — affects package size | Copy entire skill directory (SKILL.md + any subdirs) |
| Q3 | Should `--mcp` be a separate flag or bundled into `--global-skills`? | Low — UX preference | Separate flag (opt-in for security reasons) |
| Q4 | Should MCP template include all 3 servers or let user pick? | Low — template is a starting point | Include all 3 with comments; user removes what they don't need |
| Q5 | Should `find-skills` (community skill discovery) be added as 27th skill? | Medium — currently exists in user's `~/.roo/skills/` | Exclude — not from awesome-skills repo, different source |
| Q6 | Target Node.js version for `npx` MCP commands? | Medium — old Node may fail | Document: Node.js 18+ recommended |

---

## Appendix A: File Changes Summary

| File | Change Type | Description |
|---|---|---|
| `templates/global-skills/**` | **NEW** | 26 skill directories with SKILL.md files |
| `templates/mcp.json` | **NEW** | MCP server config template (3 servers) |
| `bin/install.js` | **MODIFY** | Refactor Phase 2 (remove git clone, use templates), add Phase 3 (--mcp) |
| `package.json` | **MODIFY** | Add `templates/global-skills/**` and `templates/mcp.json` to files |
| `README.md` | **MODIFY** | Add global skills + MCP documentation |
| `docs/getting-started.md` | **MODIFY** | Add MCP setup guide |
| `templates/.roo/rules/skill-awareness.md` | **MODIFY** | Update with full 26 global skills table |

## Appendix B: Verification Commands

```bash
# Count skills in templates
find templates/global-skills -name "SKILL.md" | wc -l
# Expected: 26

# Count buckets
ls -d templates/global-skills/skills* | wc -l
# Expected: 11

# Test install (dry run concept)
node bin/install.js --global-skills
# Expected: 26/26 installed, 0 missing

# Verify MCP template
cat templates/mcp.json | python3 -m json.tool
# Expected: valid JSON with 3 mcpServers entries

# Windows PowerShell verification
(Get-ChildItem "$env:USERPROFILE\.roo" -Recurse -Filter "SKILL.md").Count
# Expected: 26 (global) + 7 (project if installed) = 33
```
