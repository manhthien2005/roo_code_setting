# Visual Design Standards — FE Designer Mode

## Spacing System — 8-Point Grid

All spacing values MUST be multiples of 8px (with 4px allowed for fine-tuning):

| Token Name | Value | Usage |
|------------|-------|-------|
| `space-1` | 4px | Icon padding, fine adjustments |
| `space-2` | 8px | Tight: inline elements, icon gaps |
| `space-3` | 12px | Compact: form field padding |
| `space-4` | 16px | Standard: component internal padding |
| `space-5` | 24px | Medium: between related elements |
| `space-6` | 32px | Large: between sections |
| `space-7` | 48px | XL: major section separation |
| `space-8` | 64px | XXL: page-level spacing |

**Enforcement**: If the agent detects a spacing value that is NOT in this scale (e.g., `margin: 13px`, `padding: 30px`), it MUST flag and suggest the nearest token.

## Typography Scale — Modular Scale

Use a consistent ratio. Recommended: Major Third (1.250) or Perfect Fourth (1.333).

| Level | Ratio 1.250 | Ratio 1.333 | Usage |
|-------|-------------|-------------|-------|
| `text-xs` | 12px | 12px | Captions, labels |
| `text-sm` | 14px | 14px | Secondary text |
| `text-base` | 16px | 16px | Body text (base) |
| `text-lg` | 20px | 21px | Large body, subheading |
| `text-xl` | 25px | 28px | Section heading |
| `text-2xl` | 31px | 38px | Page heading |
| `text-3xl` | 39px | 50px | Hero heading |

**Rules**:
- Base font size: 16px (1rem) — NEVER smaller for body text
- Line height: 1.5 for body text, 1.2-1.3 for headings
- Max line length: 65-75 characters (measure) for readability
- Font weight contrast: ≥200 difference between heading and body (e.g., 700 vs 400)

## Color System

### Structure
Colors MUST be organized in semantic layers:

```
Layer 1: Primitives    → blue-500, gray-200 (raw values)
Layer 2: Semantic      → color-primary, color-surface (meaning)
Layer 3: Component     → button-bg, card-border (specific usage)
```

### Contrast Requirements — WCAG 2.1 AA
| Element | Min Ratio | How to Check |
|---------|-----------|-------------|
| Normal text (<18px) | 4.5:1 | Foreground vs background |
| Large text (≥18px bold or ≥24px) | 3:1 | Foreground vs background |
| UI components, icons | 3:1 | Against adjacent colors |
| Focus indicator | 3:1 | Against surrounding area |

### Color Usage Rules
- **Never convey information by color alone** — add icons, text, or patterns
- **Semantic naming** — `color-error` not `color-red`
- **Dark mode ready** — use CSS custom properties, not hardcoded values
- **Limit palette**: 1 primary, 1 secondary, 1 accent, plus neutrals
- **State colors**: success=green family, warning=amber family, error=red family, info=blue family
- **60-30-10 rule**: 60% neutral, 30% primary, 10% accent

## Responsive Breakpoints

Standard breakpoint system (mobile-first):

| Name | Min-width | Target |
|------|-----------|--------|
| `sm` | 640px | Large phones landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

**Rules**:
- Write base styles for mobile (no media query)
- Add `min-width` media queries for larger screens
- Never use `max-width` media queries (breaks mobile-first)
- Container max-width: 1280px typical, centered with auto margins
- Use fluid typography: `clamp(min, preferred, max)` for headings

## Animation & Motion

### Principles
- **Purposeful**: Animation must communicate state change, not decorate
- **Fast**: 150-300ms for UI transitions, 300-500ms for page transitions
- **Respectful**: Honor `prefers-reduced-motion`

### Standard Durations
| Type | Duration | Easing |
|------|----------|--------|
| Micro: hover, focus | 150ms | ease-out |
| Small: toggle, expand | 200ms | ease-in-out |
| Medium: modal, slide | 300ms | ease-in-out |
| Large: page transition | 400-500ms | ease-in-out |

### Mandatory Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
Every file with animations MUST include a `prefers-reduced-motion` check.

## Whitespace as a Design Tool

```
WRONG: Pack content tightly, minimize whitespace → cluttered
RIGHT: Generous whitespace → premium, professional feel

Rule: When in doubt, add more space — prefer space-6 over space-4
Breathing room > visual density (except dashboard/data-heavy UI)
```

## Foreground Color Pairing Convention

Every semantic background color token MUST have a corresponding `-foreground` token for text/icon color. This ensures text always has proper contrast against its background, especially across themes.

### Pattern

```
--primary            → background color
--primary-foreground → text/icon color on that background

--secondary            → background color
--secondary-foreground → text/icon color

--destructive            → background color
--destructive-foreground → text/icon color

--muted            → background color
--muted-foreground → text/icon color

--accent            → background color
--accent-foreground → text/icon color

--card            → background color
--card-foreground → text/icon color
```

### Golden Example — Foreground Pairing

```css
/* ❌ WRONG: Unrelated color names — no guaranteed contrast pairing */
:root {
  --btn-bg: #3b82f6;
  --btn-text: #ffffff;
}

/* ✅ RIGHT: Semantic foreground pairing — always paired, always accessible */
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}
/* Usage: bg-primary text-primary-foreground — always paired */
```

**Rules**:
- Every `--{name}` background token MUST have a `--{name}-foreground` counterpart
- Foreground tokens MUST meet WCAG contrast ratio against their paired background
- When adding a new semantic color, ALWAYS add both background and foreground tokens together
- Use HSL values for color tokens to enable easy lightness/alpha adjustments

## Fluid Responsive Tokens

Use `clamp(min, preferred, max)` for responsive values that scale smoothly without media queries.

### Pattern

```css
/* Static token — fixed value */
--size-3: 1rem;

/* Fluid equivalent — responsive without media queries */
--size-fluid-3: clamp(.75rem, 2vw, 1.5rem);
```

### Apply To

| Category | Static Token | Fluid Token |
|----------|-------------|-------------|
| Font sizes | `--text-xl: 1.25rem` | `--text-fluid-xl: clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)` |
| Spacing | `--space-6: 2rem` | `--space-fluid-6: clamp(1.5rem, 3vw, 3rem)` |
| Container widths | `--container: 80rem` | `--container-fluid: clamp(20rem, 90vw, 80rem)` |
| Headings | `--heading-size: 2rem` | `--heading-fluid: clamp(1.5rem, 2.5vw + 1rem, 2.5rem)` |

### Golden Example — Fluid Tokens

```css
/* ❌ WRONG: Fixed tokens + multiple media queries */
:root { --heading-size: 24px; }
@media (min-width: 768px) { :root { --heading-size: 32px; } }
@media (min-width: 1024px) { :root { --heading-size: 40px; } }

/* ✅ RIGHT: Fluid token with clamp — single declaration, smooth scaling */
:root { --heading-size: clamp(1.5rem, 2.5vw + 1rem, 2.5rem); }
/* Smoothly scales between 24px and 40px based on viewport */
```

**When to use fluid tokens**:
- Headings and display text that should scale with viewport
- Section spacing that should compress on mobile
- Container widths that need fluid max-width behavior
- Any value that currently needs 3+ media query overrides

**When NOT to use**:
- Component internal padding (keep consistent with static tokens)
- Icon sizes (should be fixed for pixel-perfect rendering)
- Border widths and radii (too small to benefit from scaling)

## Extended Spacing Scale — Half-Steps for Fine-Tuning

The primary 8pt grid covers most use cases. For precise optical adjustments, these half-step values are available:

| Token Name | Value | Type | Usage |
|------------|-------|------|-------|
| `space-0.5` | 2px | Half-step | Hairline gaps, border offsets |
| `space-1` | 4px | Full-step | Icon padding, fine adjustments |
| `space-1.5` | 6px | Half-step | Tight icon + text gaps |
| `space-2` | 8px | Full-step | Tight: inline elements, icon gaps |
| `space-2.5` | 10px | Half-step | Compact button padding (vertical) |
| `space-3` | 12px | Full-step | Compact: form field padding |
| `space-3.5` | 14px | Half-step | Fine-tuned card padding |
| `space-4` | 16px | Full-step | Standard: component internal padding |
| `space-5` | 24px | Full-step | Medium: between related elements |
| `space-6` | 32px | Full-step | Large: between sections |
| `space-7` | 48px | Full-step | XL: major section separation |
| `space-8` | 64px | Full-step | XXL: page-level spacing |

### When to Use Half-Steps vs Full-Steps

| Use | Step Type | Example |
|-----|-----------|---------|
| **Component internal padding** | Full-step (`space-2`, `space-4`) | Card padding, button padding |
| **Spacing between components** | Full-step (`space-4`, `space-5`, `space-6`) | Form field gaps, section spacing |
| **Icon-to-text gaps** | Half-step (`space-1.5`, `space-2.5`) | Icon button internal gap |
| **Optical alignment adjustments** | Half-step (`space-0.5`, `space-1.5`) | Aligning text baseline with icon center |
| **Border/outline offsets** | Half-step (`space-0.5`) | Focus ring offset |

### Optical Alignment Adjustments

Sometimes mathematically equal spacing looks visually unequal due to character shapes, icon weight, or negative space within elements. In these cases:

1. **Measure from the optical edge**, not the bounding box
2. Use half-step tokens for the adjustment — never arbitrary values
3. Document the adjustment with a CSS comment: `/* optical: text-icon alignment */`

```css
/* Full-step for general spacing */
.button { padding: var(--space-2) var(--space-4); }

/* Half-step for optical alignment between icon and text */
.button-icon {
  margin-inline-end: var(--space-1.5); /* optical: icon-text alignment */
}
```

## Animation Tokens System

Standardize animation timing with token-based duration and easing values. All animations MUST use these tokens.

### Duration Tokens

```css
:root {
  --duration-instant: 0ms;       /* No animation (reduced motion fallback) */
  --duration-fast: 100ms;        /* Micro: opacity, color change */
  --duration-normal: 200ms;      /* Standard: hover, focus, toggle */
  --duration-slow: 300ms;        /* Moderate: expand, collapse, slide */
  --duration-slower: 500ms;      /* Large: page transitions, complex reveals */
}
```

### Easing Tokens

```css
:root {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);    /* General purpose */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);             /* Entering viewport */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);            /* Leaving viewport */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);      /* Symmetrical transitions */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy, playful */
}
```

### Usage Matrix

| Interaction | Duration Token | Easing Token | Example |
|-------------|---------------|-------------|---------|
| Hover background | `--duration-fast` | `--ease-out` | Button hover state |
| Focus ring | `--duration-fast` | `--ease-out` | Input focus outline |
| Toggle/switch | `--duration-normal` | `--ease-in-out` | Checkbox, accordion |
| Dropdown open | `--duration-normal` | `--ease-out` | Menu appear |
| Dropdown close | `--duration-fast` | `--ease-in` | Menu disappear |
| Modal enter | `--duration-slow` | `--ease-out` | Dialog fade + scale |
| Modal exit | `--duration-normal` | `--ease-in` | Dialog fade out |
| Page transition | `--duration-slower` | `--ease-in-out` | Route change |

### Reduced Motion Pattern

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: var(--duration-instant) !important;
    animation-iteration-count: 1 !important;
    transition-duration: var(--duration-instant) !important;
    scroll-behavior: auto !important;
  }
}
```

### Golden Example — Animation Tokens

```css
/* ❌ WRONG: Magic numbers, inconsistent timing, no reduced motion */
.dropdown {
  transition: opacity 0.15s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal {
  transition: all 0.35s ease-in-out;
}
.button {
  transition: background 120ms linear;
}

/* ✅ RIGHT: Token-based, consistent, reduced-motion aware */
.dropdown {
  transition:
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}
.modal {
  transition:
    opacity var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}
.button {
  transition: background-color var(--duration-fast) var(--ease-out);
}

/* Reduced motion handled globally via the media query above */
```

## Shadow System

Systematic elevation shadows create visual depth hierarchy. Each shadow level uses multiple layers for photorealistic rendering.

### Shadow Scale

```css
:root {
  --shadow-xs:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm:  0 1px 3px 0 rgb(0 0 0 / 0.1),
                0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1),
                0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1),
                0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1),
                0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-none: 0 0 0 0 transparent;
}
```

### Semantic Shadow Aliases

Map shadow scale to UI component contexts:

```css
:root {
  --shadow-card:      var(--shadow-sm);    /* Default card elevation */
  --shadow-card-hover: var(--shadow-md);   /* Card on hover — lifts up */
  --shadow-dropdown:  var(--shadow-lg);    /* Floating menus, selects */
  --shadow-modal:     var(--shadow-xl);    /* Dialogs, modals, drawers */
  --shadow-toast:     var(--shadow-lg);    /* Toast notifications */
  --shadow-popover:   var(--shadow-lg);    /* Popovers, tooltips */
  --shadow-sticky:    var(--shadow-md);    /* Sticky headers, toolbars */
}
```

### Elevation Hierarchy

| Level | Shadow Token | Z-Index | UI Element |
|-------|-------------|---------|------------|
| 0 | `--shadow-none` | `auto` | Flat elements (text, inline) |
| 1 | `--shadow-xs` | `auto` | Subtle borders, dividers |
| 2 | `--shadow-sm` | `auto` | Cards, tiles |
| 3 | `--shadow-md` | `var(--z-sticky)` | Sticky headers, elevated cards |
| 4 | `--shadow-lg` | `var(--z-dropdown)` | Dropdowns, popovers, toasts |
| 5 | `--shadow-xl` | `var(--z-modal)` | Modals, dialogs, drawers |
| 6 | `--shadow-2xl` | `var(--z-modal)` | Full-screen overlays |

### Golden Example — Shadow System

```css
/* ❌ WRONG: Random shadow values, no system */
.card { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
.dropdown { box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.modal { box-shadow: 0 0 30px rgba(0,0,0,0.3); }
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

/* ✅ RIGHT: Systematic shadow scale with semantic aliases */
.card {
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration-normal) var(--ease-out);
}
.card:hover {
  box-shadow: var(--shadow-card-hover); /* Lifts one level */
}
.dropdown {
  box-shadow: var(--shadow-dropdown);
}
.modal {
  box-shadow: var(--shadow-modal);
}
```

## Color Lightness Index

Organize each color family into a numbered lightness scale for systematic palette generation and accessible color pairing.

### Scale Convention

| Index | Lightness | Typical Usage |
|-------|-----------|---------------|
| `50` | Lightest (~97%) | Subtle backgrounds, hover states |
| `100` | Very light (~95%) | Light backgrounds |
| `200` | Light (~90%) | Borders, dividers on light backgrounds |
| `300` | Medium-light (~80%) | Disabled text on dark, secondary borders |
| `400` | Medium (~65%) | Placeholder text, icons on light |
| `500` | **Base** (~50%) | Primary brand color, default state |
| `600` | Medium-dark (~40%) | Hover state for 500 |
| `700` | Dark (~30%) | Active/pressed state for 500 |
| `800` | Very dark (~20%) | Text on light backgrounds |
| `900` | Darkest (~15%) | Headings, high-contrast text |
| `950` | Near-black (~5%) | Maximum contrast, dark mode surfaces |

### Semantic Mapping

```css
:root {
  /* Primitive: Full lightness scale */
  --blue-50: oklch(0.97 0.02 250);
  --blue-100: oklch(0.93 0.04 250);
  --blue-200: oklch(0.87 0.08 250);
  --blue-300: oklch(0.75 0.12 250);
  --blue-400: oklch(0.63 0.16 250);
  --blue-500: oklch(0.55 0.20 250);
  --blue-600: oklch(0.47 0.20 250);
  --blue-700: oklch(0.38 0.18 250);
  --blue-800: oklch(0.30 0.14 250);
  --blue-900: oklch(0.23 0.10 250);
  --blue-950: oklch(0.15 0.06 250);

  /* Semantic: Map scale to meaning */
  --color-primary: var(--blue-500);
  --color-primary-hover: var(--blue-600);
  --color-primary-active: var(--blue-700);
  --color-primary-bg: var(--blue-50);
  --color-primary-border: var(--blue-200);
  --color-primary-fg: var(--blue-950);  /* Text on primary-bg */
}
```

### Accessible Combinations Table

| Background | Foreground | Contrast | WCAG AA |
|-----------|-----------|---------|---------|
| `50` | `700` | ~7:1 | ✅ Normal text |
| `50` | `600` | ~5:1 | ✅ Large text |
| `100` | `800` | ~8:1 | ✅ Normal text |
| `500` | `white` | ~4.5:1 | ✅ Normal text (verify per hue) |
| `900` | `100` | ~9:1 | ✅ Normal text |
| `950` | `200` | ~8:1 | ✅ Normal text |
| `50` | `400` | ~3:1 | ⚠️ Large text only |
| `50` | `300` | ~2:1 | ❌ Fails — do not use for text |

### Golden Example — Color Lightness Index

```css
/* ❌ WRONG: Ad-hoc color values, no scale, unpredictable contrast */
:root {
  --brand: #3b82f6;
  --brand-light: #93c5fd;
  --brand-dark: #1e40af;
  --brand-bg: #eff6ff;
  /* No system — is brand-light accessible on brand-bg? Unknown. */
}

/* ✅ RIGHT: Numbered scale, systematic, verifiable contrast */
:root {
  --blue-50:  oklch(0.97 0.02 250);
  --blue-100: oklch(0.93 0.04 250);
  --blue-500: oklch(0.55 0.20 250);
  --blue-600: oklch(0.47 0.20 250);
  --blue-700: oklch(0.38 0.18 250);
  --blue-900: oklch(0.23 0.10 250);

  /* Semantic mapping with guaranteed contrast */
  --color-primary: var(--blue-500);           /* Base */
  --color-primary-hover: var(--blue-600);     /* Darker on hover */
  --color-primary-bg: var(--blue-50);         /* Light background */
  --color-primary-on-bg: var(--blue-900);     /* Text on blue-50: ~9:1 contrast ✅ */
}
```

## Interaction Feedback Patterns

Every interactive element MUST provide clear visual feedback for each interaction state. Feedback creates affordance and confirms user actions.

### State-by-State Guidelines

#### Hover States
- Subtle background color change: `color-mix(in oklch, var(--color-bg) 90%, black)` or `var(--color-bg-hover)`
- Optional: slight `scale(1.02)` for cards/tiles
- Optional: shadow elevation increase (e.g., `--shadow-sm` → `--shadow-md`)
- Transition: `var(--duration-fast)` with `var(--ease-out)`
- **Do NOT** use hover as the only way to reveal information (fails on touch devices)

#### Active/Pressed States
- Slight scale down: `scale(0.98)` for buttons
- Deeper shadow or inset shadow: `var(--shadow-inner)`
- Darker background than hover state
- Transition: `var(--duration-fast)` with `var(--ease-out)`

#### Focus States
- Visible focus ring: `outline: 2px solid var(--color-ring); outline-offset: 2px`
- **NEVER** `outline: none` without a visible replacement
- Use `:focus-visible` (not `:focus`) to avoid showing outlines on mouse click
- Focus ring must have ≥3:1 contrast against surrounding colors
- Inner focus: `box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-ring)` (double ring pattern)

#### Disabled States
- Reduced opacity: `opacity: 0.5` or `0.6`
- `pointer-events: none` to prevent interaction
- `cursor: not-allowed` for visual feedback (when pointer-events allowed on wrapper)
- Use `aria-disabled="true"` instead of `disabled` attribute for custom components
- **Do NOT** rely on gray color alone — also reduce opacity for universal recognition

#### Loading States

| Pattern | Use When | Example |
|---------|----------|---------|
| **Skeleton** | Content layout is known, waiting for data | Card placeholder, list items |
| **Spinner** | Action submitted, waiting for response | Button submit, save action |
| **Progress bar** | Process duration is known/estimatable | File upload, data migration |
| **Shimmer** | Content is loading, length unknown | Feed items, search results |

- Always set `aria-busy="true"` on the loading container
- Always provide fallback text for screen readers: `aria-label="Loading content"`
- Spinners: use `animation` (not transition), respect `prefers-reduced-motion`

### Golden Example — Interaction Feedback

```css
/* ❌ WRONG: Missing states, inconsistent feedback, outline removed */
.button {
  background: var(--color-primary);
  outline: none; /* ← NEVER do this */
}
.button:hover {
  background: blue; /* magic color */
}
/* No active state, no disabled state, no loading state */

/* ✅ RIGHT: Complete interaction feedback system */
.button {
  background: var(--color-bg-primary);
  color: var(--color-fg-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

/* Hover: subtle lift */
.button:hover:not(:disabled) {
  background: var(--color-bg-primary-hover);
  box-shadow: var(--shadow-sm);
}

/* Active/Pressed: push down */
.button:active:not(:disabled) {
  transform: scale(0.98);
  background: var(--color-bg-primary-active);
  box-shadow: var(--shadow-inner);
}

/* Focus: visible ring (keyboard only) */
.button:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

/* Disabled: muted appearance */
.button:disabled,
.button[aria-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}

/* Loading: spinner inside button */
.button[data-loading="true"] {
  position: relative;
  color: transparent; /* Hide text */
  pointer-events: none;
}
.button[data-loading="true"]::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin var(--duration-slower) linear infinite;
}
```

## HARD RULES
- MUST use 8-point grid spacing — no arbitrary pixel values
- MUST use modular type scale — no random font sizes
- MUST organize colors in semantic layers — never use raw hex in components
- MUST meet WCAG contrast ratios — 4.5:1 normal text, 3:1 large text
- MUST use mobile-first responsive approach
- MUST respect prefers-reduced-motion for all animations
- MUST limit line length to 65-75 characters for body text
- MUST NOT use px for font-size in CSS — use rem or em
- MUST follow 60-30-10 color distribution rule
- MUST use CSS custom properties for all theme-able values
- MUST define a `-foreground` token for every semantic background color token
- SHOULD prefer fluid tokens (`clamp()`) over media-query-based responsive tokens where appropriate
- MUST use half-step spacing tokens (2, 6, 10, 14px) only for optical alignment — not as primary spacing
- MUST use animation token system (`--duration-*`, `--ease-*`) for all transitions and animations
- MUST use systematic shadow scale (`--shadow-xs` through `--shadow-2xl`) — never ad-hoc shadow values
- MUST map shadow tokens to semantic aliases (`--shadow-card`, `--shadow-modal`) for component usage
- MUST organize color families in numbered lightness scale (50–950) with consistent intervals
- MUST verify contrast ratios using the accessible combinations table before pairing lightness indices
- MUST provide visible feedback for ALL interaction states: hover, active, focus, disabled, loading
- MUST use `:focus-visible` (not `:focus`) for keyboard-only focus rings
- MUST NOT use `outline: none` without providing a visible focus replacement
- MUST set `aria-busy="true"` and provide screen reader text for all loading states

## Design Token Presets
Khi project chưa có design tokens, áp dụng preset phù hợp:

| Preset | File | Phong cách |
|--------|------|------------|
| Minimalist (default) | `presets/minimalist.md` | shadcn/ui, Vercel, Linear |
| Corporate | `presets/corporate.md` | Enterprise, dashboard, admin |
| Creative | `presets/creative.md` | Portfolio, agency, landing page |

### HARD RULES
- MUST chọn 1 preset trước khi bắt đầu styling nếu project chưa có design system.
- MUST dùng tokens từ preset đã chọn — KHÔNG tự nghĩ ra magic numbers.
- MUST NOT mix tokens từ nhiều presets trong cùng 1 project.
