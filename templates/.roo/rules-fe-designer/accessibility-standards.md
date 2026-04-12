# Accessibility Standards — FE Designer Mode

## WCAG 2.1 AA Compliance Checklist

This checklist MUST be verified for every component and page the agent designs.

### Perceivable

#### 1.1 Text Alternatives
- [ ] Every `<img>` has meaningful `alt` text (or `alt=""` for decorative)
- [ ] Icon-only buttons have `aria-label` or visually hidden text
- [ ] SVG icons have `role="img"` + `aria-label` or `<title>`
- [ ] Complex images have long descriptions

#### 1.3 Adaptable
- [ ] Content structure conveyed through semantic HTML, not visual styling alone
- [ ] Heading hierarchy is correct: h1 → h2 → h3, no skipped levels
- [ ] Lists use `<ul>`, `<ol>`, `<dl>` — not styled divs
- [ ] Tables have `<thead>`, `<th>`, `scope` attributes
- [ ] Form fields have associated `<label>` elements (not just placeholder)

#### 1.4 Distinguishable
- [ ] Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large)
- [ ] No information conveyed by color alone
- [ ] Text can be resized to 200% without loss of content
- [ ] Spacing: line-height ≥ 1.5, paragraph spacing ≥ 2x font size, letter-spacing ≥ 0.12em, word-spacing ≥ 0.16em (when user overrides)

### Operable

#### 2.1 Keyboard Accessible
- [ ] All interactive elements reachable via Tab key
- [ ] Tab order follows visual/logical order
- [ ] No keyboard traps — user can always Tab away
- [ ] Custom widgets implement expected keyboard patterns:
  - Buttons: Enter/Space to activate
  - Links: Enter to activate
  - Dropdowns: Arrow keys to navigate, Enter to select, Escape to close
  - Modals: Tab trapped inside, Escape to close, focus restored on close
  - Tabs: Arrow keys between tabs, Tab into panel content

#### 2.4 Navigable
- [ ] Skip-to-main-content link exists
- [ ] Page has descriptive `<title>`
- [ ] Focus order is logical and predictable
- [ ] Link text is descriptive — no "click here" or "read more" alone
- [ ] Headings describe the section they introduce

#### 2.5 Input Modalities
- [ ] Touch targets ≥ 44x44px (CSS pixels)
- [ ] No functionality requires multi-point or path-based gestures only
- [ ] Drag-and-drop has keyboard alternative

### Understandable

#### 3.1 Readable
- [ ] Page language declared: `<html lang="...">`
- [ ] Language changes marked: `<span lang="...">`

#### 3.2 Predictable
- [ ] No unexpected context changes on focus or input
- [ ] Navigation consistent across pages
- [ ] Consistent identification of repeated components

#### 3.3 Input Assistance
- [ ] Error messages identify the field and describe the error
- [ ] Required fields indicated before form submission
- [ ] Error suggestions provided when possible
- [ ] Form submissions are reversible, confirmed, or checked

### Robust

#### 4.1 Compatible
- [ ] Valid HTML — proper nesting, unique IDs
- [ ] ARIA roles, states, properties used correctly
- [ ] Custom components have appropriate ARIA patterns

## ARIA Usage Rules

### Golden Rule: Prefer Native HTML
```
WRONG: <div role="button" tabindex="0" onclick="...">Click</div>
RIGHT: <button onclick="...">Click</button>

WRONG: <div role="checkbox" aria-checked="true">
RIGHT: <input type="checkbox" checked>

WRONG: <span role="link" onclick="navigate(...)">Home</span>
RIGHT: <a href="/home">Home</a>
```

### When ARIA IS Needed
- Live regions: `aria-live="polite"` for dynamic content updates
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Combobox: `role="combobox"`, `aria-expanded`, `aria-activedescendant`
- Loading states: `aria-busy="true"`, `aria-live="polite"`
- Toggle buttons: `aria-pressed="true/false"`

### ARIA Anti-Patterns to Flag
- `role="presentation"` on focusable elements
- `aria-hidden="true"` on visible, interactive elements
- Missing `aria-label` on icon-only buttons
- `aria-expanded` without matching collapsible content
- Duplicate IDs referenced by `aria-labelledby` or `aria-describedby`

## Focus Management Patterns

### Modal/Dialog
```
Open: Move focus to first focusable element inside modal
Trap: Tab cycles within modal only
Close: Return focus to trigger element
```

### Route Change — SPA
```
Navigate: Move focus to main content area or h1
Announce: aria-live region or document.title update
```

### Dynamic Content
```
Added: aria-live="polite" announces additions
Removed: Move focus to logical next element
Loading: aria-busy="true" on container, announce completion
```

## Screen Reader Considerations

- Use visually hidden text for context that is only visual:
  ```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  ```
- Announce state changes via `aria-live` regions
- Ensure reading order matches visual order (CSS order/flexbox does not change DOM order)
- Test landmark structure: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`

## The 5 Rules of ARIA Use (W3C)

These are the official W3C rules for ARIA usage. Memorize and apply them in order:

1. **If you can use native HTML, do so** — Don't add ARIA unnecessarily. `<button>` is always better than `<div role="button" tabindex="0">`.
2. **Don't change native semantics unless you really have to** — Don't do `<h2 role="tab">`. Use `<div role="tab"><h2>...</h2></div>` instead.
3. **All interactive ARIA controls must be keyboard accessible** — If you add `role="button"`, you MUST also handle Enter and Space key events.
4. **Don't use `role="presentation"` or `aria-hidden="true"` on focusable elements** — This hides the element from assistive tech while it remains keyboard-focusable, creating a trap.
5. **All interactive elements must have an accessible name** — Via content, `aria-label`, `aria-labelledby`, or associated `<label>`.

### Golden Example — Native vs ARIA

```html
<!-- ❌ WRONG: Reinventing native semantics (violates Rule #1) -->
<div role="button" tabindex="0" onkeydown="handleKeyDown(e)">
  Submit
</div>

<!-- ✅ RIGHT: Native HTML -->
<button type="submit">Submit</button>
```

```html
<!-- ❌ WRONG: aria-hidden on focusable element (violates Rule #4) -->
<button aria-hidden="true">Close</button>

<!-- ✅ RIGHT: Visible to all users, icon hidden from AT -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>
```

## Per-Component ARIA Reference Table

Quick reference for implementing accessible components. Based on Radix UI primitives and W3C ARIA Authoring Practices.

| Component | Role | Key ARIA | Keyboard |
|-----------|------|----------|----------|
| Dialog | `dialog`, `aria-modal="true"` | `aria-labelledby`, `aria-describedby` | Esc close, Tab trap, focus first element |
| AlertDialog | `alertdialog` | Same as Dialog + auto-focus cancel/close | Same as Dialog |
| DropdownMenu | `menu`, `menuitem` | `aria-expanded`, `aria-haspopup` | Arrow keys, Enter/Space, Esc, typeahead |
| Select | `listbox`, `option` | `aria-selected`, `aria-expanded` | Arrow keys, Enter, Esc, typeahead, Home/End |
| Tabs | `tablist`, `tab`, `tabpanel` | `aria-selected`, `aria-controls` | Arrow keys (horizontal), Home/End |
| Accordion | `button` + region | `aria-expanded`, `aria-controls` | Enter/Space toggle, Arrow between headers |
| Tooltip | `tooltip` | `aria-describedby` | Esc dismiss, focus trigger shows |
| Switch | `switch` | `aria-checked` | Space toggle |
| Checkbox | `checkbox` | `aria-checked` (true/false/mixed) | Space toggle |
| RadioGroup | `radiogroup`, `radio` | `aria-checked` | Arrow keys, no Tab between radios |
| Slider | `slider` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation` | Arrow keys, Home/End, Page Up/Down |
| Toast | `status` or `alert` | `aria-live="polite"` or `"assertive"` | F6 to focus toast region, Esc dismiss |
| Popover | none (generic) | `aria-expanded` on trigger | Esc close, Tab trap optional |
| NavigationMenu | `navigation` | `aria-expanded`, `aria-current` | Arrow keys, Enter, Esc |
| ContextMenu | `menu` | Same as DropdownMenu | Same + right-click trigger |

## Advanced Keyboard Patterns

Beyond basic Tab/Enter/Space, these advanced keyboard patterns are frequently missed:

| Widget | Required Keyboard | Often Missed |
|--------|-------------------|--------------|
| Combobox | Arrow down opens, Arrow up/down navigates, Enter selects, Esc closes | Typeahead, Alt+Down to open |
| Menu (with submenu) | Arrow keys navigate, Enter/Space activate, Esc close, first-letter jump | Submenu: Arrow right to open, Arrow left to close |
| Tree | Arrow up/down between items, Arrow right expand, Arrow left collapse | Home/End, `*` (asterisk) expand all siblings |
| Listbox (multi-select) | Arrow keys, Home/End, typeahead | Shift+Arrow for range select, Ctrl+Space for toggle |
| Toolbar | Arrow keys between items, Tab to/from toolbar | Wrapping: Arrow past last item → first item |

## Focus Management Patterns

### Dialog / AlertDialog
```
Open  → Focus first focusable element (or [autofocus] element)
Tab   → Cycle within dialog only — focus trap
Shift+Tab → Reverse cycle within dialog
Close → Return focus to the trigger element that opened it
```

### Dropdown / Select
```
Open  → Focus first item, or currently selected item
Arrow → Move between items
Close → Return focus to trigger
```

### Tooltip
```
Focus trigger → Show tooltip after delay
Blur trigger  → Hide tooltip after delay
Esc           → Immediate dismiss (no delay)
```

### Tabs
```
Arrow      → Move between tabs (activate immediately or on Enter depending on activationMode)
Home       → First tab
End        → Last tab
Tab (key)  → Move focus into the active panel content
```

### Golden Example — Focus Management

```tsx
// ❌ WRONG: No focus management on dialog
function Dialog({ isOpen, children }) {
  if (!isOpen) return null;
  return <div className="dialog">{children}</div>;
}

// ✅ RIGHT: Focus trap + restore
function Dialog({ isOpen, onClose, children }) {
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save trigger, move focus into dialog
      triggerRef.current = document.activeElement;
      dialogRef.current?.querySelector('[autofocus], button, [href], input')?.focus();
    }
    return () => {
      // Restore focus to trigger on close
      triggerRef.current?.focus();
    };
  }, [isOpen]);
  // + focus trap logic (cycle Tab within dialog)
}
```

## Landmark Roles & Constraints

HTML landmark elements create a navigable structure for screen reader users. They are the "table of contents" for assistive technology.

### Required Landmarks

Every page MUST include these landmark elements:

| Element | Role | Constraint | Purpose |
|---------|------|-----------|---------|
| `<main>` | `main` | **Exactly one** per page | Primary content area |
| `<header>` | `banner` | One per page (top-level), or scoped within `<article>`/`<section>` | Site/section header |
| `<nav>` | `navigation` | Label each with `aria-label` when multiple exist | Navigation regions |
| `<footer>` | `contentinfo` | One per page (top-level), or scoped within `<article>`/`<section>` | Site/section footer |
| `<aside>` | `complementary` | Should be related to surrounding content | Sidebar, related content |

### Landmark Rules

1. **One `<main>` per page** — Never nest `<main>` inside another `<main>`. If using SPA with multiple views, only one should be rendered at a time.
2. **Label multiple `<nav>` elements** — When a page has more than one `<nav>`, each MUST have a unique `aria-label`:
   ```html
   <nav aria-label="Primary">...</nav>
   <nav aria-label="Breadcrumb">...</nav>
   <nav aria-label="Footer">...</nav>
   ```
3. **Don't abuse `<section>`** — `<section>` is not a generic container. It MUST have a heading. If it doesn't have a heading, use `<div>`.
4. **Landmark nesting** — `<header>` and `<footer>` inside `<article>` or `<section>` do NOT become `banner`/`contentinfo` landmarks — they are scoped.

### Skip Navigation Link Pattern

Provide a skip link as the **first focusable element** on the page, allowing keyboard users to bypass repetitive navigation.

```html
<!-- First element in <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<header>
  <nav aria-label="Primary"><!-- repetitive nav links --></nav>
</header>

<main id="main-content" tabindex="-1">
  <!-- Main content starts here -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: var(--z-tooltip);
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg-primary);
  color: var(--color-fg-primary);
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--radius-md);
}

.skip-link:focus {
  top: var(--space-2);
  left: var(--space-2);
}
```

### Golden Example — Landmark Structure

```html
<!-- ❌ WRONG: No landmarks — screen readers see flat content -->
<div class="page">
  <div class="top-bar">
    <div class="logo">MyApp</div>
    <div class="links">
      <a href="/">Home</a>
      <a href="/about">About</a>
    </div>
  </div>
  <div class="content">
    <h1>Welcome</h1>
    <p>Main content here...</p>
  </div>
  <div class="sidebar">Related links...</div>
  <div class="bottom">© 2024</div>
</div>

<!-- ✅ RIGHT: Proper landmarks — screen readers navigate by region -->
<a href="#main" class="skip-link">Skip to main content</a>

<header>
  <nav aria-label="Primary">
    <a href="/" aria-current="page">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main id="main" tabindex="-1">
  <h1>Welcome</h1>
  <p>Main content here...</p>
</main>

<aside aria-label="Related links">
  Related links...
</aside>

<footer>
  <p>© 2024</p>
  <nav aria-label="Footer">
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</footer>
```

## HARD RULES
- MUST use semantic HTML before ARIA — `<button>` not `<div role="button">`
- MUST verify contrast ratios for EVERY text element and UI component
- MUST ensure keyboard navigation works for ALL interactive elements
- MUST include focus management for modals, drawers, and route changes
- MUST provide text alternatives for all non-text content
- MUST include `prefers-reduced-motion` when using animations
- MUST NOT use ARIA roles that duplicate native HTML semantics
- MUST NOT skip heading levels — h1 → h2 → h3, never h1 → h3
- MUST NOT use placeholder as the only label for form fields
- MUST NOT remove focus outlines without providing a visible alternative
- MUST prefer native HTML over ARIA — Rule #1 of ARIA Use
- MUST ensure all interactive ARIA controls are keyboard accessible — Rule #3 of ARIA Use
- MUST NOT use `aria-hidden="true"` on focusable elements — Rule #4 of ARIA Use
- MUST include exactly one `<main>` landmark per page
- MUST label multiple `<nav>` elements with unique `aria-label`
- MUST include a skip navigation link as the first focusable element on every page
- MUST NOT use `<section>` without a heading — use `<div>` for generic containers
