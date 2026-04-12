---
name: accessibility-checker
description: Verify WCAG 2.1 AA compliance by analyzing HTML structure, ARIA usage, contrast, keyboard patterns, and semantic markup. Runs before completion in FE Designer mode.
risk: safe
source: self
tags: [accessibility, wcag, a11y, aria, compliance]
---

# Accessibility Checker Skill

## When to Use

Auto-trigger:
- Before `attempt_completion` in FE Designer mode
- When user asks to check or verify accessibility
- When creating forms, modals, navigation, or interactive widgets

## Check Process

### 1. Semantic HTML Audit
Read the component/page files and verify:
```
search_files(path="src", regex="<div\\s+(onClick|onKeyDown|role=\"button\")", file_pattern="*.{tsx,jsx,vue,svelte}")
```
Flag: `<div>` with click handlers → should be `<button>` or `<a>`

```
search_files(path="src", regex="<(img|svg)(?![^>]*alt=)(?![^>]*aria-label)", file_pattern="*.{tsx,jsx,vue,svelte}")
```
Flag: Images without alt text or aria-label

### 2. Heading Structure
```
search_files(path="src", regex="<h[1-6]", file_pattern="*.{tsx,jsx,vue,svelte}")
```
Verify:
- Only one `<h1>` per page/route
- No skipped heading levels
- Headings describe their section content

### 3. Form Accessibility
```
search_files(path="src", regex="<input(?![^>]*aria-label)(?![^>]*(id=\"[^\"]+\")).*>", file_pattern="*.{tsx,jsx,vue,svelte}")
```
Verify:
- Every `<input>` has an associated `<label>` (via `htmlFor`/`for`) or `aria-label`
- Required fields are indicated (not just by color)
- Error messages are associated via `aria-describedby`
- Submit buttons are descriptive

### 4. Keyboard Navigation
For interactive widgets, verify the expected keyboard pattern:

| Widget | Keys | Expected Behavior |
|--------|------|------------------|
| Button | Enter, Space | Activate |
| Link | Enter | Navigate |
| Menu | Arrow keys | Navigate items |
| Dialog | Tab trap, Escape | Cycle focus, close |
| Tabs | Arrow keys | Switch tabs |
| Combobox | Arrow keys, Enter, Escape | Navigate, select, close |
| Accordion | Enter, Space | Toggle panel |

### 5. Color Contrast Spot-Check
The agent cannot compute contrast automatically, but CAN:
- Identify text-color + background-color pairs from CSS
- Check if they use semantic tokens with known values
- Flag obviously low-contrast combinations (gray on light gray, etc.)
- Recommend user run axe-core or Lighthouse for automated checking

### 6. Focus Visibility
```
search_files(path="src", regex="outline:\\s*none|outline:\\s*0|:focus\\s*\\{[^}]*outline:\\s*(none|0)", file_pattern="*.{css,scss}")
```
Flag: Removed focus outlines without replacement

### 7. Motion Sensitivity
```
search_files(path="src", regex="animation|transition|@keyframes", file_pattern="*.{css,scss}")
```
For each file with animations, verify:
```
search_files(path="src", regex="prefers-reduced-motion", file_pattern="*.{css,scss}")
```
Flag: Files with animations but no `prefers-reduced-motion` check

### Output Report
```markdown
## Accessibility Audit Report

### Passed ✅
(List of checks that passed)

### Failed ❌
(Each failure with: what, where, why, how to fix)

### Warnings ⚠️
(Potential issues that need manual verification)

### Recommended Tools
- Run `npx axe-core` or browser Lighthouse for automated contrast/ARIA checking
- Test with keyboard-only navigation
- Test with screen reader (VoiceOver, NVDA, JAWS)
```

## Reference

Full WCAG checklist: `.roo/rules-fe-designer/accessibility-standards.md`
Component patterns: `.roo/rules-fe-designer/component-design-patterns.md`
