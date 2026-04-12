---
name: component-design
description: Guide the design of beautiful, accessible, systematic UI components. Auto-triggers when creating or restyling components in FE Designer mode.
risk: safe
source: self
tags: [design, components, ui, accessibility, tokens]
---

# Component Design Skill

## When to Use

Auto-trigger when:
- User asks to create a new UI component
- User asks to restyle or redesign an existing component
- User asks to add variants or states to a component

## Process

### Phase 1: Discovery
1. **Detect design system**: Search for tokens, theme, existing components
   ```
   codebase_search("design tokens OR theme OR --color- OR --space-")
   codebase_search("component OR Button OR Card OR Modal")
   ```
2. **Detect styling approach**: Tailwind? CSS Modules? styled-components?
3. **Document**: "Found: [styling approach] with [X tokens defined / no tokens]"

### Phase 1.5: Reference Loading (sau Analyze, trước System)
Khi styling một component, KIỂM TRA xem có reference file phù hợp không:
- Buttons → đọc `references/buttons.md`
- Forms/Inputs → đọc `references/forms-inputs.md`
- Cards → đọc `references/cards-containers.md`
- Navigation → đọc `references/navigation.md`
- Modals/Dialogs → đọc `references/modals-dialogs.md`
- Typography → đọc `references/typography-patterns.md`
- Layout → đọc `references/layout-grid.md`

CHỈ đọc reference file liên quan (1-2 files tối đa). KHÔNG đọc tất cả.
Dùng ĐÚNG ✅ patterns từ reference. Tránh SAI ❌ patterns.

### Phase 2: Design Specification
Before writing code, produce a brief spec:
1. **Component purpose**: What problem does it solve?
2. **Variants**: List all variants — size, color, state
3. **Props/API**: Define the interface with defaults
4. **States**: Default, hover, focus, active, disabled, loading, error
5. **Responsive**: How does it change across breakpoints?
6. **Accessibility**: Semantic element, ARIA needs, keyboard pattern

### Phase 3: Implementation
Apply in this order:
1. Semantic HTML structure (document as styling hooks for Code mode handoff)
2. Design token-based styles (spacing, color, typography)
3. Interactive states (hover, focus, active, disabled)
4. Responsive adjustments (mobile-first)
5. Animation (with prefers-reduced-motion)
6. ARIA attributes and keyboard handling notes

### Phase 4: Verification Checklist
- [ ] All spacing uses tokens or 8pt grid
- [ ] All colors reference semantic tokens
- [ ] Typography follows the type scale
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Keyboard navigation works
- [ ] Focus indicator visible (≥2px, ≥3:1 contrast)
- [ ] Touch target ≥44x44px on mobile
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] prefers-reduced-motion respected if animated
- [ ] Component API is minimal and has sensible defaults

### Phase 5: Self-Critique
Run the UI Critique checklist from `ui-critique-discipline.md`:
- [ ] Visual hierarchy clear — primary element most prominent
- [ ] CTA clarity — max 1 primary per section
- [ ] Spacing consistency — all from token scale
- [ ] Cognitive load appropriate — not overwhelming

## Handoff to Code Mode

When component needs logic beyond styling:
1. Document the **design spec** in the response
2. List **styling hooks**: CSS classes, custom properties, data-attributes
3. Specify **expected behavior** per state
4. Use `switch_mode` or `new_task` with context:
   ```
   ## Context
   Design spec for [ComponentName] completed in FE Designer mode.
   
   ## Task
   Implement component logic: [specific logic needed]
   
   ## Constraints
   - Use provided styling hooks (CSS classes / custom properties listed above)
   - Do not modify token values or styling approach
   - Maintain semantic HTML structure as specified
   
   ## Expected Output
   Working component with business logic integrated into the design spec
   ```

## Reference

Detailed rules: `.roo/rules-fe-designer/component-design-patterns.md`
Visual standards: `.roo/rules-fe-designer/visual-design-standards.md`
Accessibility: `.roo/rules-fe-designer/accessibility-standards.md`
Self-critique: `.roo/rules-fe-designer/ui-critique-discipline.md`
