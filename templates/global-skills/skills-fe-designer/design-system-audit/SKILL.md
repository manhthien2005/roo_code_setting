---
name: design-system-audit
description: Audit design system consistency — check tokens, spacing, colors, typography usage across the codebase. Triggers when modifying shared styles or on user request.
risk: safe
source: self
tags: [design-system, audit, consistency, tokens]
---

# Design System Audit Skill

## When to Use

Trigger when:
- User asks to audit or review design consistency
- Modifying shared style files (tokens, theme, globals)
- Before adding new design tokens
- Periodically on large frontend codebases

## Audit Process

### 1. Token Inventory
Search and catalog all design tokens:
```
search_files(path=".", regex="--[a-z]+-[a-z0-9-]+\\s*:", file_pattern="*.css")
search_files(path=".", regex="--[a-z]+-[a-z0-9-]+\\s*:", file_pattern="*.scss")
search_files(path=".", regex="(tokens|theme)\\s*[:=]", file_pattern="*.{ts,js,json}")
```

Report:
- Total tokens defined
- Token categories: color, spacing, typography, shadow, radius, z-index
- Unused tokens (defined but never referenced)
- Missing tokens (values that should be tokens)

### 1.5. Preset Comparison (Phase 2 — Token Audit)
So sánh tokens hiện tại của project với preset phù hợp:
- Đọc preset tương ứng từ `presets/` (minimalist.md | corporate.md | creative.md)
- Liệt kê tokens THIẾU so với preset
- Liệt kê tokens THỪA (custom, không trong preset)
- Đánh giá consistency score (% tokens khớp preset)

Nếu project chưa có design system → recommend bắt đầu từ minimalist preset (default).

### 2. Magic Number Detection
Search for hardcoded values that should use tokens:
```
search_files(path="src", regex="(margin|padding|gap|width|height):\\s*\\d+px", file_pattern="*.{css,scss}")
search_files(path="src", regex="#[0-9a-fA-F]{3,8}", file_pattern="*.{css,scss,tsx,jsx}")
```

Flag:
- 🔴 Hardcoded color hex values in component files
- 🟠 Hardcoded pixel values not on 8pt grid
- 🟡 Hardcoded values used in ≥3 places (should be tokens)

### 3. Spacing Consistency Check
- All components use the same spacing scale?
- All text follows the type scale?
- All colors from the defined palette?
- Border radius consistent?
- Shadow system consistent?
- z-index follows a defined scale?

### 4. Framework Detection
Before auditing, detect the styling approach:
```
search_files(path=".", regex="tailwind\\.config", file_pattern="*.{js,ts,mjs,cjs}")
search_files(path=".", regex="\\.module\\.(css|scss)", file_pattern="*.{tsx,jsx,vue}")
search_files(path=".", regex="styled\\.", file_pattern="*.{ts,tsx,js,jsx}")
```

Adapt audit rules based on detected framework:
- **Tailwind**: Check for arbitrary values `[13px]`, custom utilities vs config
- **CSS Modules**: Check for shared vs local tokens
- **styled-components**: Check for theme usage vs hardcoded values
- **Vanilla CSS**: Check custom properties usage

### 5. Output Report Format
```markdown
## Design System Audit Report

### Summary
- Tokens defined: X
- Hardcoded values found: Y
- Consistency score: Z/10

### 🔴 Critical Issues
(Hardcoded colors, broken token references)

### 🟠 Improvements
(Magic numbers, missing tokens)

### 🟡 Suggestions
(Token consolidation, naming improvements)

### ✅ Good Practices Found
(Consistent patterns, proper token usage)

### Recommendations
1. [Specific actionable recommendation]
2. [Specific actionable recommendation]
```

## Token Naming Validation

When auditing tokens, verify naming follows conventions:
| Category | Pattern | Example |
|----------|---------|---------|
| Color | `--color-{semantic}` | `--color-primary`, `--color-error` |
| Spacing | `--space-{scale}` | `--space-4`, `--space-6` |
| Typography | `--text-{size}` | `--text-base`, `--text-xl` |
| Shadow | `--shadow-{intensity}` | `--shadow-sm`, `--shadow-lg` |
| Radius | `--radius-{size}` | `--radius-sm`, `--radius-full` |

Flag tokens that do not follow semantic naming (e.g., `--blue-500` used directly in components instead of `--color-primary`).

## Reference

Token standards: `.roo/rules-fe-designer/visual-design-standards.md`
Component patterns: `.roo/rules-fe-designer/component-design-patterns.md`
