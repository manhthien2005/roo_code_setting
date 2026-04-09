# Global Skills Review Report

> **Ngày review:** 2026-04-09
> **Reviewer:** Architect mode
> **Input:** [`roocode-skills-deploy.md`](../roocode-skills-deploy.md), [`skills-registry.md`](../templates/.roo/skills-registry.md), [`skill-awareness.md`](../templates/.roo/rules/skill-awareness.md)

---

## Summary: ✅ APPROVE WITH CHANGES

Bộ 27 global skills được thiết kế tốt, phân bucket hợp lý, và quá trình chọn lọc từ ~50 → 27 có rationale rõ ràng. Tuy nhiên, cần **5 điều chỉnh** trước khi finalize:

1. **`secrets-management` double-install** — cần deduplicate (CRITICAL)
2. **`coding-standards` vs `lint-and-validate`** — cần document phân vai rõ (WARN)
3. **`systematic-debugging` skill+rule redundancy** — cần clarify relationship (WARN)
4. **`planning-with-files` vs `context-checkpoint`** — không conflict nhưng cần trigger differentiation (LOW)
5. **Skill-awareness table cần cập nhật** — hiện chỉ list 13 entries, thiếu 27 global entries (CRITICAL)

---

## 1. Overlap Analysis — Global (27) vs Project (7) Skills

### Overlap Matrix

| Project Skill | Global Skill(s) | Overlap Type | Risk Level | Action |
|---|---|---|---|---|
| `coding-standards` | `lint-and-validate` | **Partial overlap** — cùng trigger "after code change" | 🟡 MEDIUM | Document: coding-standards = WHAT to check, lint-and-validate = HOW to run tools |
| `context-budget` | *(none)* | No overlap | ✅ SAFE | — |
| `context-checkpoint` | `planning-with-files` | **Functional overlap** — cả hai lưu progress vào markdown files | 🟡 LOW | Triggers khác nhau: checkpoint = context overflow, planning = persistent task tracking |
| `search-first` | *(none)* | No overlap | ✅ SAFE | — |
| `project-context` | *(none)* | No overlap | ✅ SAFE | — |
| `continuous-learning` | *(none)* | No overlap | ✅ SAFE | — |
| `workspace-audit` | *(none)* | No overlap | ✅ SAFE | — |

### Double-Load Risk Analysis

| Scenario | Global Skill | Project Skill | Both Load? | Impact |
|---|---|---|---|---|
| Code change in Code mode | `lint-and-validate` | `coding-standards` | ⚠️ YES — cùng trigger "after code change" | ~400 tokens wasted + potential instruction conflict |
| Context overflow | `planning-with-files` | `context-checkpoint` | ❌ NO — trigger khác nhau | Safe — planning = proactive, checkpoint = reactive |
| Bug investigation | `systematic-debugging` | *(none, nhưng có rule)* | N/A | Skill + rule load cùng lúc = redundant content |

### Conflict Risk Assessment

| Pair | Conflict? | Analysis |
|---|---|---|
| `coding-standards` ↔ `lint-and-validate` | 🟡 Potential | `coding-standards` = static checklist (file size, naming, anti-patterns). `lint-and-validate` = run lint/type-check tools. **Complementary** nếu document rõ, nhưng hiện tại agent có thể confuse vì cùng trigger. |
| `context-checkpoint` ↔ `planning-with-files` | ✅ No | `context-checkpoint` saves state khi context >70%. `planning-with-files` tạo PLAN.md/PROGRESS.md từ đầu task. Khác purpose. |
| `verification-before-completion` ↔ `lint-and-validate` | ✅ No | `verification` = gate trước attempt_completion. `lint-and-validate` = after code change. Sequential, không overlap trigger. |

### Redundancy Risk

| Pair | Redundant? | Analysis |
|---|---|---|
| `systematic-debugging` (global skill) ↔ [`rules-debug/systematic-debugging.md`](../templates/.roo/rules-debug/systematic-debugging.md) | 🔴 YES | Rule file (28 lines) là summary; global skill (via awesome-skills) có detailed methodology. Rule line 22 nói "The skill provides detailed methodology — follow it." → Rule **delegates** to skill. Không conflict nhưng **redundant context load** khi ở debug mode. |

---

## 2. Per-Bucket Quality Review (11 Buckets)

### Bucket 1: `global` (6 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ Mỗi skill có trigger riêng biệt: code change, completion, bugs, planning, Windows, context |
| Scope fit | ✅ All-mode scope hợp lý — đây là behavioral guardrails |
| Count justified | ✅ 6 skills ngăn 6 lỗi kinh điển — đã rationalized trong deploy doc |
| Missing coverage | ⚠️ Không có `find-skills` trong global bucket (hiện ở home `~/.roo/skills/`) nhưng đã listed trong skill-awareness → OK |

**Note:** `planning-with-files` + `concise-planning` cùng bucket. Trigger rõ: `concise-planning` = user asks for plan, `planning-with-files` = complex multi-step task. Agent chọn 1 based on `mandatory_skill_check` → "prefer most specific" rule. ✅

### Bucket 2: `skill-writer` (2 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `writing-skills` = create/update SKILL.md, `skill-check` = validate existing |
| Scope fit | ✅ Chỉ load cho skill-writer mode |
| Count justified | ✅ 2 skills, non-overlapping (author vs validate) |
| Missing coverage | ✅ Adequate |

### Bucket 3: `merge-resolver` (2 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `differential-review` = review diff, `finishing-a-development-branch` = decide merge/close |
| Scope fit | ✅ Merge workflow stages |
| Count justified | ✅ Sequential workflow (review → decide) |
| Missing coverage | ✅ Adequate |

### Bucket 4: `documentation-writer` (3 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `api-documentation` = OpenAPI/API docs, `readme` = README files, `documentation-templates` = structure/templates |
| Scope fit | ✅ 3 distinct doc types |
| Count justified | ✅ 3 ≤ threshold, each has specific trigger |
| Missing coverage | ⚠️ No changelog/release notes skill — minor gap |

### Bucket 5: `user-story-creator` (2 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `product-manager` = PM frameworks/analysis, `create-issue-gate` = acceptance criteria gate |
| Scope fit | ✅ PM core + execution validation |
| Count justified | ✅ Complementary pair |
| Missing coverage | ✅ Adequate |

### Bucket 6: `project-research` (2 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `wiki-qa` = quick Q&A, `wiki-researcher` = deep 5-iteration analysis |
| Scope fit | ✅ Quick vs deep research |
| Count justified | ✅ Clear differentiation (shallow vs deep) |
| Missing coverage | ✅ Adequate |

### Bucket 7: `security-review` (2 skills) — **WARN** ⚠️

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `cc-skill-security-review` = OWASP checklist, `secrets-management` = CI/CD secrets |
| Scope fit | ✅ App security + infrastructure secrets |
| Count justified | ✅ 2 skills, complementary |
| Missing coverage | ✅ Adequate |

**⚠️ WARNING:** `secrets-management` is ALSO in `devops` bucket → double-install issue. See §4.

### Bucket 8: `jest-test-engineer` (2 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `testing-patterns` = Jest patterns/mocking, `test-driven-development` = TDD Iron Law |
| Scope fit | ✅ Patterns vs methodology |
| Count justified | ✅ Complementary (how vs when) |
| Missing coverage | ✅ Adequate |

### Bucket 9: `devops` (3 skills) — **WARN** ⚠️

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `devops-troubleshooter` = incidents, `cicd-automation-workflow-automate` = pipelines, `secrets-management` = secrets |
| Scope fit | ✅ 3 distinct DevOps concerns |
| Count justified | ✅ 3 ≤ threshold |
| Missing coverage | ✅ Adequate |

**⚠️ WARNING:** `secrets-management` appears in BOTH security-review AND devops. Deploy script will copy it twice to 2 locations. Not a functional issue (skills are mode-scoped), but:
- Wastes disk space (minor)
- Creates maintenance burden (must update in 2 places if skill changes)
- 27 skill count is actually **26 unique** + 1 duplicate = misleading

### Bucket 10: `coding-teacher` (1 skill) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `tutorial-engineer` = the mode's primary skill |
| Scope fit | ✅ Single skill IS the mode's methodology |
| Count justified | ✅ Minimal — 1 skill covers pedagogical framework |
| Missing coverage | ✅ Adequate for scope |

### Bucket 11: `google-genai-developer` (2 skills) — **PASS** ✅

| Criteria | Assessment |
|---|---|
| Trigger clarity | ✅ `gemini-api-dev` = API reference, `ai-agent-development` = agent orchestration |
| Scope fit | ✅ API usage vs architecture patterns |
| Count justified | ✅ Complementary |
| Missing coverage | ✅ Adequate |

### Bucket Summary

| Bucket | Skills | Verdict | Notes |
|---|---|---|---|
| global | 6 | ✅ PASS | Core behavioral guardrails |
| skill-writer | 2 | ✅ PASS | Author + validate |
| merge-resolver | 2 | ✅ PASS | Review + decide |
| documentation-writer | 3 | ✅ PASS | 3 doc types |
| user-story-creator | 2 | ✅ PASS | PM + gate |
| project-research | 2 | ✅ PASS | Quick + deep |
| security-review | 2 | ⚠️ WARN | `secrets-management` double-install |
| jest-test-engineer | 2 | ✅ PASS | Patterns + TDD |
| devops | 3 | ⚠️ WARN | `secrets-management` double-install |
| coding-teacher | 1 | ✅ PASS | Single skill mode |
| google-genai-developer | 2 | ✅ PASS | API + agents |

---

## 3. Architecture Assessment

### A. 2-Layer System — Global + Project Skills

**Current architecture:**

```
~/.roo/skills/              ← 6 global skills (all modes)
~/.roo/skills-{mode}/       ← 21 mode-specific skills (11 buckets)
<workspace>/.roo/skills/    ← 7 project skills
```

**Conflict resolution mechanism:** Roo Code's `mandatory_skill_check` evaluates ALL available skills (global + project) every turn. The system prompt states:

> "Prefer the most specific skill when multiple skills match."

This means **project skills take precedence over global skills** by specificity. ✅ Adequate resolution.

**Potential issue:** When both global AND project skills match (e.g., code change triggers both `lint-and-validate` and `coding-standards`), the agent must choose ONE. The "most specific" heuristic may not always be clear → agent could flip between sessions. **Recommendation:** Add explicit priority rule in `skill-awareness.md`.

### B. Context Budget Impact

**Token overhead estimation:**

| Component | Count | ~Tokens per description | Total |
|---|---|---|---|
| Global skills (all modes) | 6 | ~40 words = ~55 tokens | ~330 |
| Mode-specific skills | 2-3 per mode | ~40 words = ~55 tokens | ~165 |
| Project skills | 7 | ~30 words = ~40 tokens | ~280 |
| **Total per turn** | **15-16** | | **~775 tokens** |

**Analysis:** ~775 tokens overhead per turn for `mandatory_skill_check` scan. NOT 34 skills per turn — agent only sees global (6) + current mode's bucket (2-3) + project (7) = **15-16 skills max per turn**. This is well within acceptable range (~0.5% of 200k context).

**Original estimate of ~2000 tokens was too high** because it assumed all 27 global load simultaneously. In reality, mode-specific skills only load for their mode.

**Verdict:** ✅ Context budget impact is acceptable.

### C. Deploy Mechanism

**Current:** PowerShell script sourcing from `$env:USERPROFILE\.codex\skills` → copying to `$env:USERPROFILE\.roo\skills*`

**Assessment:**

| Aspect | Status | Notes |
|---|---|---|
| Windows compatibility | ✅ Good | PowerShell native, proper path handling |
| Idempotent | ✅ Good | Removes existing before copy |
| Error handling | ✅ Good | `Set-StrictMode`, `$ErrorActionPreference = "Stop"` |
| Cross-platform | ❌ Missing | No bash/sh equivalent for macOS/Linux |
| Source path assumption | ⚠️ Fragile | Assumes `.codex/skills` exists — no validation message if source dir missing |
| Integration with repo installer | ❌ Missing | `bin/install.js` doesn't invoke skills deploy |

**Recommendation:** 
1. Add cross-platform alternative (bash script or integrate into `bin/install.js`)
2. Add source directory validation with clear error message
3. Consider making skill source a config parameter rather than hardcoded path

---

## 4. Specific Concerns Investigation

### Concern 1: `secrets-management` double-install 🔴 CRITICAL

**Finding:** `secrets-management` appears in BOTH:
- `skills-security-review` (line 88-89 in deploy doc)
- `skills-devops` (line 101 in deploy doc)

**Impact:**
- Disk: 2 copies of same skill → minor waste
- Maintenance: Update one, forget the other → drift risk
- Count: 27 claimed but only **26 unique** skills

**Recommendation:** Keep in `skills-devops` only (CI/CD secrets rotation is more DevOps scope). In `skills-security-review`, the OWASP skill (`cc-skill-security-review`) already covers secret detection. If security-review needs secrets guidance, add a cross-reference in that skill's SKILL.md rather than duplicating.

### Concern 2: `systematic-debugging` global skill + `rules-debug/` rule 🟡 WARN

**Finding:** 
- Global skill: `~/.roo/skills/systematic-debugging/SKILL.md` — detailed methodology (from awesome-skills)
- Project rule: [`templates/.roo/rules-debug/systematic-debugging.md`](../templates/.roo/rules-debug/systematic-debugging.md) — 28-line summary that **delegates to the skill** (line 22: "The skill provides detailed methodology — follow it.")

**Impact:** In Debug mode, agent loads:
1. The rule (auto-loaded for debug mode) — ~200 tokens
2. The skill (triggered by mandatory_skill_check) — ~500+ tokens

Both say the same thing. The rule is a summary → skill is the detailed version. Not conflicting, but **redundant**.

**Recommendation:** This is actually **good architecture** — rule is the "always loaded" lightweight reminder, skill is the "load on demand" detailed methodology. The delegation pattern (rule → skill) is intentional. **Keep as-is.** The ~200 token overhead is worth the reliability of having debugging methodology always visible in debug mode context.

### Concern 3: `planning-with-files` vs `concise-planning` 🟢 NO CONFLICT

**Finding:**
- `planning-with-files`: Creates persistent PLAN.md, PROGRESS.md, NOTES.md for complex multi-step tasks
- `concise-planning`: Generates atomic 6-10 step checklist with Scope In/Out guard

**Trigger differentiation:**
- `concise-planning` → "user asks for a plan for a coding task"
- `planning-with-files` → "complex multi-step tasks needing persistent progress"

**Analysis:** These are **complementary approaches** for different task sizes:
- Quick task → `concise-planning` (ephemeral checklist)
- Complex task → `planning-with-files` (persistent files)

The `mandatory_skill_check` "prefer most specific" rule handles selection correctly. ✅ No conflict.

### Concern 4: `verification-before-completion` vs project `lint-and-validate` 🟢 NO OVERLAP

**Finding:**
- `verification-before-completion`: Trigger = "Before EVERY `attempt_completion`" — anti-hallucination gate
- `lint-and-validate`: Trigger = "After EVERY code change" — run lint/type-check tools

**Analysis:** Different triggers, different purposes, sequential in workflow:
1. Code change → `lint-and-validate` runs
2. Task complete → `verification-before-completion` runs

No double-load risk. ✅

### Concern 5: Loại bỏ 18 skills — rationale review 🟢 SOUND

| Loại Skill | Lý do | Sound? |
|---|---|---|
| `skill-improver` | Needs Trail of Bits plugin dependency | ✅ Yes — external dep = fragile |
| `top-web-vulnerabilities` | 100% overlap với `cc-skill-security-review` | ✅ Yes — pure duplicate |
| `audit-context-building` | Sai scope cho project-research | ✅ Yes — security audit ≠ project research |
| `tdd-orchestrator` | Persona listing, no workflow (A=4/10) | ✅ Yes — low quality |
| `security-auditor` | Capability list, not actionable | ✅ Yes — replaced by better skill |
| `receiving-code-review` | Trigger quá mơ hồ (T=5/10) | ✅ Yes — unclear when to use |
| `product-manager-toolkit` | 358 lines, Python deps, overlap | ✅ Yes — heavy + dependent |
| `javascript-testing-patterns` | Double-load với `testing-patterns` | ✅ Yes — trigger collision |
| `code-review-checklist` | Double-load với `differential-review` | ✅ Yes — trigger collision |
| `requesting-code-review` | Subset của `finishing-a-development-branch` | ✅ Yes — redundant |
| `documentation` | Superset gây double-load | ✅ Yes — too broad trigger |
| `writing-plans` | Scope creep | ✅ Yes — doesn't fit any mode cleanly |
| `api-security-best-practices` | Covered by `cc-skill-security-review` | ✅ Yes — subset |
| `k8s-manifest-generator` | Không relevant với project stack | ✅ Yes — project-specific exclusion |
| `brainstorming` | Covered by `product-manager` frameworks | ✅ Yes — subset |
| `unit-testing-test-generate` | Triple-trigger risk | ✅ Yes — collision |
| `documentation-templates` *(mode-writer)* | Scope fit yếu | ✅ Yes — wrong mode |
| `systematic-debugging` *(coding-teacher)* | Already in global | ✅ Yes — exact duplicate |

**Verdict:** All 18 exclusions have **sound rationale**. No skills should be reinstated.

**One consideration:** `brainstorming` could be useful if `product-manager` doesn't explicitly cover ideation workflows. But since `product-manager` includes 30+ frameworks including ideation → exclusion is justified.

---

## 5. Recommended Changes

### CRITICAL (must fix before deploy)

| # | Action | Details |
|---|---|---|
| C1 | **Deduplicate `secrets-management`** | Remove from `skills-security-review` bucket. Keep only in `skills-devops`. Add cross-reference in `cc-skill-security-review` SKILL.md pointing to devops secrets skill. Update count: 27 → **26 unique skills**. |
| C2 | **Update `skill-awareness.md`** | Current table has 13 entries (project skills + 6 global). Needs to reflect full 26 unique global + 7 project = 33 entries. Or split into 2 tables: "Global Skills" + "Project Skills". |

### RECOMMENDED (should fix)

| # | Action | Details |
|---|---|---|
| R1 | **Document `coding-standards` vs `lint-and-validate` relationship** | In `skill-awareness.md`, add note: "`coding-standards` = static code review checklist (what). `lint-and-validate` = run tooling (how). Both trigger on code change — agent should run `lint-and-validate` first, then `coding-standards` review." |
| R2 | **Add cross-platform deploy script** | Create `bin/deploy-skills.sh` (bash) alongside PowerShell. Or better: integrate into `bin/install.js` with a `--skills` flag. |
| R3 | **Add source dir validation** | In PowerShell script, add check: `if (-not (Test-Path $SkillsSourcePath)) { Write-Error "Source not found: $SkillsSourcePath"; exit 1 }` |

### OPTIONAL (nice to have)

| # | Action | Details |
|---|---|---|
| O1 | **Add skill version/hash tracking** | Deploy script could generate `~/.roo/skills-manifest.json` with skill names + last-modified dates for drift detection |
| O2 | **Add `code-review` mode skill** | Currently code-review mode has no dedicated skills. Consider adding `differential-review` to `skills-code-review` as well. |

---

## 6. Integration Recommendations

### Deploy Integration Path

```
bin/install.js (existing)
  ├── copies templates/.roo/ → <workspace>/.roo/  (project layer)
  └── NEW: invokes skills deploy script              (global layer)
       ├── Windows: PowerShell roocode-skills-deploy.ps1
       └── Unix: bin/deploy-skills.sh
```

### Skill-Awareness Table Update

Recommended restructure for [`skill-awareness.md`](../templates/.roo/rules/skill-awareness.md):

```markdown
## Global Skills (loaded for ALL modes)
| Skill | Trigger | Mandatory? |
|-------|---------|------------|
| planning-with-files | Complex multi-step tasks | Optional |
| concise-planning | User asks for plan | Optional |
| lint-and-validate | After EVERY code change | ✅ YES |
| systematic-debugging | Bugs, errors, test failures | ✅ YES |
| verification-before-completion | Before attempt_completion | ✅ YES |
| windows-shell-reliability | Windows command execution | ✅ Auto |

## Project Skills (loaded for ALL modes, project-scoped)
| Skill | Trigger | Mandatory? |
|-------|---------|------------|
| coding-standards | After code change (Code mode) | ✅ YES |
| context-budget | Context >50% or >20 tool calls | ✅ YES |
| context-checkpoint | Context >70% | Optional |
| search-first | Before creating files (Code mode) | ✅ YES |
| project-context | New project or user request | Optional |
| continuous-learning | End of complex sessions | Optional |
| workspace-audit | User requests audit | Optional |

## Mode-Specific Skills (loaded only for their mode)
See `roocode-skills-deploy.md` for full listing per mode.
```

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Double-load `coding-standards` + `lint-and-validate` | Medium | Low — wasted tokens, minor confusion | Document relationship in skill-awareness |
| `secrets-management` drift (2 copies) | High | Medium — security skill out of date | Deduplicate (C1) |
| Agent ignores skill-awareness table (too many entries) | Low | Medium — skips mandatory skills | Keep table concise, split by layer |
| Cross-platform deploy failure | Medium | High — skills missing on macOS/Linux | Add bash script (R2) |
| Context bloat from 33 skill descriptions | Low | Low — ~775 tokens ≈ 0.5% of context | Already within budget |
| Future skill count growth beyond 40 | Medium | Medium — context budget pressure | Establish hard cap: max 8 global + 3 per mode |

---

## 8. Final Verdict

| Category | Score | Notes |
|---|---|---|
| **Skill Selection Quality** | 9/10 | Excellent curation, sound exclusion rationale |
| **Bucket Organization** | 8.5/10 | Clean mode mapping, 1 duplicate issue |
| **Trigger Clarity** | 8/10 | Good overall, `coding-standards`/`lint-and-validate` needs clarification |
| **Architecture** | 8/10 | 2-layer system works, needs conflict priority documentation |
| **Deploy Mechanism** | 7/10 | Windows-only, needs cross-platform + integration |
| **Documentation** | 7.5/10 | `skill-awareness.md` needs update for full skill set |
| **Overall** | **8.0/10** | **APPROVE WITH CHANGES** — fix C1, C2 before finalize |
