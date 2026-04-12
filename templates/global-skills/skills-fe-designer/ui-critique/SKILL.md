---
name: ui-critique
description: Self-critique visual output before completion. Evaluates visual hierarchy, CTA clarity, cognitive load, spacing consistency, and layout priority. MUST run before attempt_completion in FE Designer mode.
risk: safe
source: self
tags: [design, critique, visual-hierarchy, ux, quality]
---

# UI Critique Skill

## When to Use

**Mandatory trigger**:
- Before EVERY `attempt_completion` in FE Designer mode (non-trivial tasks)
- After completing any styling or component design work

**Optional trigger**:
- User asks to review or critique a UI design
- User asks "does this look right?" or "review my design"

## Critique Process

### Step 1: Gather Context
Read the files that were created or modified in this task:
```
read_file(path="<modified-file>")
```
Identify:
- What type of UI element is this? (page, component, form, navigation, etc.)
- What is the primary user action? (read, input, navigate, purchase, etc.)
- What styling approach is used? (tokens, Tailwind, CSS Modules, etc.)

### Step 2: Visual Hierarchy Analysis
Check the CSS/styling output for:

**Font sizes** — Do they follow the type scale?
```
search_files(path="<scope>", regex="font-size:\\s*[^v]", file_pattern="*.{css,scss}")
```
Flag any `font-size` not using a token, variable, or rem value.

**Font weights** — Is there ≥200 weight difference between headings and body?
```
search_files(path="<scope>", regex="font-weight:\\s*\\d+", file_pattern="*.{css,scss}")
```

**Color contrast** — Are primary elements using the strongest colors?
- Primary CTA should use `--color-primary` or equivalent
- Secondary actions should use `outline`, `ghost`, or lower-contrast variants
- Disabled states should use reduced opacity

### Step 2.5: Reference Validation (sau Nielsen scan, trước UX Psychology)
Nếu component có reference file tương ứng:
1. Đọc reference file liên quan
2. So sánh output CSS với ĐÚNG ✅ patterns
3. Kiểm tra không vi phạm SAI ❌ anti-patterns
4. Nếu phát hiện anti-pattern → severity = MAJOR

### Step 3: CTA Clarity Check
For interactive elements in the output:
- Count primary-styled buttons per logical section
- If >1 primary CTA in a section → flag as "competing CTAs"
- Verify CTA text is action-oriented (verb + noun)
- Verify CTA has sufficient padding for touch targets

### Step 4: Cognitive Load Assessment
Analyze the component/page structure:
- Count distinct visual groups (cards, sections, form groups, etc.)
- If >9 groups visible at once → flag "high cognitive load"
- Check for progressive disclosure patterns (expand/collapse, tabs, etc.)
- Verify whitespace is used to create breathing room

### Step 5: Spacing Consistency
Scan all spacing values in modified files:
```
search_files(path="<scope>", regex="(margin|padding|gap):\\s*\\d+", file_pattern="*.{css,scss}")
```
- Every value should map to a token (space-1 through space-8)
- Intra-group spacing should be smaller than inter-group spacing
- Section gaps should be consistent (all space-6 or all space-7)

### Step 6: Layout Priority Check
- Is the most important content/action positioned prominently? (top, center, or start of reading flow)
- Are error states positioned near their trigger elements?
- Does mobile layout prioritize the primary task?

## Output Format

Produce a "Design Critique" section with three categories:

```markdown
## Design Critique

### ✅ Passed
- [Specific check]: [Evidence from code]
- [Specific check]: [Evidence from code]

### ⚠️ Warnings
- [Specific check]: [What was found] → [Suggestion]

### ❌ Issues (MUST FIX before completion)
- [Specific check]: [What was found] → [Required fix]
```

### Rules for categorization:
- **✅ Passed**: Check verified with evidence from code
- **⚠️ Warning**: Potential concern but acceptable — document reasoning
- **❌ Issue**: Violation of a HARD RULE from any rules-fe-designer file — MUST be fixed

## Decision Matrix

| Finding | Severity | Action |
|---------|----------|--------|
| Magic number in spacing | ❌ Issue | Replace with token |
| Missing focus styles | ❌ Issue | Add focus indicator |
| >1 primary CTA per section | ⚠️ Warning | Suggest demoting one |
| >9 visual groups | ⚠️ Warning | Suggest progressive disclosure |
| Heading not from type scale | ❌ Issue | Use correct scale level |
| No prefers-reduced-motion | ❌ Issue | Add motion query |
| Hardcoded color hex | ❌ Issue | Replace with semantic token |
| CTA text not action-oriented | ⚠️ Warning | Suggest better text |
| Inconsistent section spacing | ⚠️ Warning | Standardize to one token |

## After Critique

1. If ❌ Issues found → Fix ALL issues before proceeding
2. Re-run affected checks after fixes
3. Only proceed to `attempt_completion` when all checks are ✅ or ⚠️
4. Include the final Design Critique section in the completion response

## Reference

Critique checklist: `.roo/rules-fe-designer/ui-critique-discipline.md`
Visual standards: `.roo/rules-fe-designer/visual-design-standards.md`
Design discipline: `.roo/rules-fe-designer/fe-design-discipline.md`
