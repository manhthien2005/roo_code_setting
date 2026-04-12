# Component Design Patterns — FE Designer Mode

## Component API Design Principles

### 1. Props/API Design
- **Minimal surface area**: Only expose props users actually need
- **Sensible defaults**: Component should look good with zero configuration
- **Predictable naming**: Follow framework conventions
  - React: `onClick`, `onChange`, `isDisabled`, `variant`
  - Vue: `@click`, `@change`, `:disabled`, `variant`
  - General: boolean props start with `is/has/should/can`

### 2. Variant System
Prefer a `variant` prop over multiple boolean flags:

```
WRONG: <Button primary large rounded />
RIGHT: <Button variant="primary" size="lg" />
```

Standard variant names:
| Prop | Values | Purpose |
|------|--------|---------|
| `variant` | primary, secondary, outline, ghost, link | Visual style |
| `size` | sm, md, lg | Dimensions |
| `colorScheme` | neutral, brand, success, warning, error | Semantic color |

### 3. Composition over Configuration
```
WRONG: <Card title="..." subtitle="..." icon="..." footer="..." />
RIGHT:
<Card>
  <Card.Header>
    <Card.Title>...</Card.Title>
  </Card.Header>
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>
```
- Use compound components for complex layouts
- Use slots/children for flexible content
- Use render props/scoped slots for advanced customization

## Design Token Integration

### Token Hierarchy
```
Global tokens     → space-4: 16px (universal)
  ↓ aliases
Semantic tokens   → content-padding: var(--space-4) (contextual meaning)
  ↓ consumed by
Component tokens  → card-padding: var(--content-padding) (specific)
```

### Token Usage in Components
```css
/* WRONG — magic numbers */
.card {
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* RIGHT — token-based */
.card {
  padding: var(--card-padding, var(--space-4));
  border-radius: var(--card-radius, var(--radius-md));
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}
```

### When to Create New Tokens
- ✅ Value used in ≥3 places → extract to token
- ✅ Value has semantic meaning → name by meaning, not value
- ❌ One-off value → use existing nearest token, do NOT create token
- ❌ Calculated value → use calc() with existing tokens

## Naming Conventions

### CSS Classes
| Convention | Example | When to Use |
|-----------|---------|-------------|
| BEM | `.card__header--active` | Vanilla CSS, large codebases |
| Utility-first | `flex items-center gap-4` | Tailwind CSS projects |
| CSS Modules | `styles.cardHeader` | React/Vue with CSS Modules |
| Semantic | `.primary-action`, `.surface-elevated` | Design system foundations |

### Design Tokens
| Category | Pattern | Example |
|----------|---------|---------|
| Color | `color-{semantic}` | `--color-primary`, `--color-surface` |
| Spacing | `space-{scale}` | `--space-4`, `--space-6` |
| Typography | `text-{size}` | `--text-base`, `--text-xl` |
| Shadow | `shadow-{intensity}` | `--shadow-sm`, `--shadow-lg` |
| Radius | `radius-{size}` | `--radius-sm`, `--radius-full` |
| Z-index | `z-{layer}` | `--z-dropdown`, `--z-modal` |

## Component Structure Checklist

When designing a new component, verify:

### Visual
- [ ] Uses design tokens for all visual properties
- [ ] Follows spacing system — no magic numbers
- [ ] Has clear visual hierarchy within the component
- [ ] Consistent with existing components in the system
- [ ] States covered: default, hover, focus, active, disabled, loading, error

### Accessibility
- [ ] Correct semantic HTML element chosen
- [ ] ARIA attributes added where native semantics insufficient
- [ ] Keyboard interaction pattern defined and implemented
- [ ] Focus styles visible and meaningful
- [ ] Screen reader announcement makes sense

### Responsiveness
- [ ] Works at minimum 320px viewport width
- [ ] Content reflows — no horizontal scroll
- [ ] Touch targets ≥44x44px on mobile
- [ ] Font sizes readable on small screens

### API
- [ ] Props have sensible defaults
- [ ] TypeScript types or PropTypes defined
- [ ] Required vs optional props clearly separated
- [ ] Event handlers follow framework conventions
- [ ] Component is composable — children/slots for flexible content

## Layout Patterns

### Container Queries over Media Queries
For component-level responsiveness, prefer container queries:
```css
.card-grid {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```
This makes components responsive to their container, not the viewport.

### Common Layout Recipes

| Pattern | Implementation | When to Use |
|---------|---------------|-------------|
| Stack | `display: flex; flex-direction: column; gap: var(--space-4)` | Vertical list of elements |
| Cluster | `display: flex; flex-wrap: wrap; gap: var(--space-3)` | Tags, badges, buttons |
| Sidebar | `display: grid; grid-template-columns: minmax(200px, 25%) 1fr` | Sidebar + content |
| Center | `display: grid; place-items: center` | Centering anything |
| Switcher | `flex-wrap: wrap` with `flex-basis: calc((threshold - 100%) * 999)` | Switch from row to column |

### CSS Logical Properties
Prefer logical properties for internationalization support:
```
PREFER: margin-inline-start → instead of margin-left
PREFER: padding-block → instead of padding-top/bottom
PREFER: inline-size → instead of width
PREFER: block-size → instead of height
```

## Visual States Matrix
Every interactive component MUST define these states:

| State | Visual Change | Required |
|-------|-------------|----------|
| Default | Base appearance | ✅ |
| Hover | Subtle highlight — background/border change | ✅ interactive |
| Focus | Visible outline or ring — 2px minimum | ✅ interactive |
| Active/Pressed | Slight scale or color change | ✅ buttons |
| Disabled | Reduced opacity (0.5-0.6) + cursor: not-allowed | ✅ if disableable |
| Loading | Skeleton or spinner, aria-busy | If applicable |
| Error | Error color border/text, error icon | If validatable |
| Selected | Checked/highlighted state | If selectable |

## Dark Mode Strategy
```css
/* Use semantic tokens — automatically switch */
:root {
  --color-surface: #ffffff;
  --color-on-surface: #1a1a1a;
}

[data-theme="dark"] {
  --color-surface: #1a1a1a;
  --color-on-surface: #f0f0f0;
}
```
- NEVER use `@media (prefers-color-scheme: dark)` in components — keep theme switching in one place
- All component styles reference semantic tokens → theme switch is automatic

## CVA (Class Variance Authority) Pattern

When using Tailwind CSS, use CVA for systematic variant management instead of conditional class strings.

### The `cn()` Utility — clsx + tailwind-merge

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`cn()` resolves Tailwind class conflicts: if a consumer passes `px-6`, it correctly overrides the component's default `px-4`.

### Canonical CVA Pattern (from shadcn/ui)

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base classes — always applied
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Golden Example — Variants

```tsx
// ❌ WRONG: Boolean prop explosion + string concatenation
interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  outline?: boolean;
  large?: boolean;
  small?: boolean;
}
<Button primary large />
className={`btn ${isPrimary ? 'btn-primary' : ''} ${isLarge ? 'btn-lg' : ''}`}

// ✅ RIGHT: CVA variant system + cn() utility
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "...", outline: "...", ghost: "..." },
    size: { default: "h-10 px-4", sm: "h-9 px-3", lg: "h-11 px-8" },
  },
  defaultVariants: { variant: "default", size: "default" },
})
<Button variant="destructive" size="lg" />
className={cn(buttonVariants({ variant, size, className }))}
```

### Golden Example — Class Merging

```tsx
// ❌ WRONG: String concatenation — conflicts not resolved
className={`rounded-md px-4 ${className}`}
// If className contains px-6, both px-4 AND px-6 apply → unpredictable

// ✅ RIGHT: cn() utility — clsx + tailwind-merge
className={cn("rounded-md px-4", className)}
// className="px-6" → only px-6 applies, px-4 correctly overridden
```

## Data-Attribute Styling Pattern

When using Radix UI primitives (or similar headless libraries), prefer data-attribute selectors over JS-controlled class toggling.

### Available Data Attributes (Radix conventions)

| Attribute | Values | Usage |
|-----------|--------|-------|
| `[data-state]` | `"open"`, `"closed"`, `"active"`, `"inactive"` | Accordion, Dialog, Collapsible, Tabs |
| `[data-disabled]` | present/absent | Any disabled component |
| `[data-highlighted]` | present/absent | Focused menu item, listbox option |
| `[data-orientation]` | `"horizontal"`, `"vertical"` | Tabs, Separator, Slider |

### Golden Example — Data-Attribute Styling

```css
/* ❌ WRONG: JS-controlled class toggling */
.accordion-content { display: none; }
.accordion-content.is-open { display: block; }

/* ✅ RIGHT: Data-attribute styling — works with Radix */
[data-state="closed"] { display: none; }
[data-state="open"] { display: block; }

/* Even better: animate with grid trick */
[data-state="closed"] {
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms ease-out;
}
[data-state="open"] {
  grid-template-rows: 1fr;
}
```

## Component Extension Pattern

Every reusable component MUST support extension via `forwardRef`, `className` merging, and props spreading.

### The Pattern

```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"
```

**Checklist** — every component must:
1. Use `forwardRef` for DOM access
2. Accept `className` prop for style extension
3. Use `cn()` to merge default + custom classes (conflicts resolved)
4. Set `displayName` for DevTools
5. Spread remaining props with `...props`

### Golden Example — Component Extension

```tsx
// ❌ WRONG: No className merging, no ref forwarding
function Card({ title, children }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

// ✅ RIGHT: Full extension pattern
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

// Consumer can extend: <Card className="shadow-lg p-8" data-testid="profile-card" />
```

## Controlled / Uncontrolled Component Pattern

Components that manage form-like state (inputs, selects, toggles, accordions) MUST support both controlled and uncontrolled usage modes.

### Pattern

| Mode | Props | Behavior |
|------|-------|----------|
| **Controlled** | `value` + `onChange` | Parent owns state; component reflects props |
| **Uncontrolled** | `defaultValue` | Component owns internal state; optional `onChange` for observation |
| **Auto-detect** | If `value !== undefined` → controlled, else uncontrolled | Single implementation, dual mode |

### Implementation Strategy

```tsx
function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = isControlled ? controlledValue : internalValue;

  const setValue = useCallback((next: T) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [isControlled, onChange]);

  return [currentValue, setValue] as const;
}
```

### Golden Example — Controlled/Uncontrolled

```tsx
// ❌ WRONG: Only supports controlled mode — forces parent to manage state always
function Toggle({ isOn, onToggle }: { isOn: boolean; onToggle: (v: boolean) => void }) {
  return <button onClick={() => onToggle(!isOn)}>{isOn ? "On" : "Off"}</button>;
}
// Consumer MUST always provide state:
const [isOn, setIsOn] = useState(false);
<Toggle isOn={isOn} onToggle={setIsOn} />

// ✅ RIGHT: Supports both controlled and uncontrolled modes
function Toggle({ value, defaultValue = false, onChange }: {
  value?: boolean;        // Controlled
  defaultValue?: boolean; // Uncontrolled
  onChange?: (value: boolean) => void;
}) {
  const [isOn, setIsOn] = useControllableState({ value, defaultValue, onChange });
  return <button onClick={() => setIsOn(!isOn)}>{isOn ? "On" : "Off"}</button>;
}
// Uncontrolled — just works:
<Toggle defaultValue={false} />
// Controlled — parent manages:
<Toggle value={isOn} onChange={setIsOn} />
```

## CSS @layer Architecture

Use CSS `@layer` to establish a predictable specificity hierarchy, eliminating specificity wars and `!important` overrides.

### Layer Ordering

```css
/* Define layer order — FIRST declaration wins specificity priority (last = highest) */
@layer reset, base, tokens, components, utilities, overrides;
```

| Layer | Purpose | Example |
|-------|---------|---------|
| `reset` | Normalize browser defaults | `*, *::before, *::after { box-sizing: border-box; margin: 0; }` |
| `base` | Element defaults, typography | `body { font-family: var(--font-sans); }` |
| `tokens` | CSS custom properties | `:root { --color-primary: ...; }` |
| `components` | Component styles | `.card { padding: var(--space-4); }` |
| `utilities` | Single-purpose overrides | `.sr-only { ... }`, `.truncate { ... }` |
| `overrides` | Escape hatch (rare, documented) | Third-party library fixes |

### Benefits
- **Predictable specificity**: Layer order, not selector complexity, determines which style wins
- **No `!important`**: Utilities layer naturally wins over components layer
- **Team scalability**: New developers can't accidentally break specificity order
- **Third-party safety**: Vendor styles isolated in their own layer

### Golden Example — CSS @layer

```css
/* ❌ WRONG: Specificity wars — increasingly specific selectors, !important creep */
.card { padding: 16px; }
.sidebar .card { padding: 12px; }
.sidebar .card.compact { padding: 8px; }
.sidebar .card.compact.highlighted { padding: 8px !important; } /* desperation */

/* ✅ RIGHT: @layer architecture — predictable, maintainable */
@layer reset, base, tokens, components, utilities;

@layer tokens {
  :root {
    --card-padding: var(--space-4);
    --card-padding-compact: var(--space-2);
  }
}

@layer components {
  .card { padding: var(--card-padding); }
  .card[data-compact] { padding: var(--card-padding-compact); }
}

@layer utilities {
  .p-2 { padding: var(--space-2); } /* Always wins over components — by layer order */
}
```

## Modern CSS Features Guide

Leverage modern CSS capabilities for cleaner, more maintainable component styles. Check browser support before using in production.

### `:has()` — Parent Selector

Select a parent based on its children. Enables styling patterns previously impossible without JavaScript.

```css
/* Style form group when its input has focus */
.form-group:has(input:focus) {
  border-color: var(--color-primary);
}

/* Style card differently when it contains an image */
.card:has(> img) {
  padding-top: 0;
}

/* Hide label when sibling input is empty (progressive enhancement) */
.field:has(input:placeholder-shown) .floating-label {
  transform: translateY(0);
}
```
**Support**: Chrome 105+, Safari 15.4+, Firefox 121+

### CSS Nesting (Native)

Write nested selectors without a preprocessor. Reduces repetition and improves readability.

```css
.card {
  padding: var(--space-4);
  border: 1px solid var(--color-border);

  & .card-header {
    font-weight: 600;
  }

  &:hover {
    border-color: var(--color-primary);
  }

  @media (width >= 768px) {
    padding: var(--space-6);
  }
}
```
**Support**: Chrome 120+, Safari 17.2+, Firefox 117+

### `color-mix()` — Dynamic Color Variations

Create color variations without preprocessor functions. Ideal for hover/active states.

```css
.button {
  background: var(--color-primary);
}
.button:hover {
  /* 20% lighter by mixing with white */
  background: color-mix(in oklch, var(--color-primary) 80%, white);
}
.button:active {
  /* 20% darker by mixing with black */
  background: color-mix(in oklch, var(--color-primary) 80%, black);
}
```
**Support**: Chrome 111+, Safari 16.2+, Firefox 113+

### `@container` Queries (Extended)

Container queries make components responsive to their container, not the viewport. Use `container-type` and `@container`.

```css
.widget-wrapper {
  container-type: inline-size;
  container-name: widget;
}

@container widget (width < 300px) {
  .widget { flex-direction: column; }
  .widget-title { font-size: var(--text-sm); }
}

@container widget (width >= 300px) {
  .widget { flex-direction: row; }
}

/* Style container queries — query computed styles */
@container style(--theme: dark) {
  .widget { background: var(--color-surface-dark); }
}
```
**Support**: Size queries: Chrome 105+, Safari 16+, Firefox 110+. Style queries: Chrome 111+ (limited).

### `light-dark()` Function

A native function for theme-aware values without media queries or class selectors on every property.

```css
:root {
  color-scheme: light dark;
}

.card {
  background: light-dark(#ffffff, #1a1a1a);
  color: light-dark(#1a1a1a, #f0f0f0);
  border-color: light-dark(#e5e5e5, #333333);
}
```
**Support**: Chrome 123+, Safari 17.5+, Firefox 120+

### When to Use Each Feature

| Feature | Use When | Avoid When |
|---------|----------|------------|
| `:has()` | Parent needs to react to child state | Simple child-only styling |
| CSS Nesting | Component has predictable nested structure | Deep nesting >3 levels |
| `color-mix()` | Need hover/active shade variations | Static color values |
| `@container` | Component reused in different-width containers | Page-level layout only |
| `light-dark()` | Simple light/dark token switching | Complex multi-theme systems |

## Design Token Governance

Manage design tokens as a shared contract between design and engineering. Tokens are the single source of truth for visual properties.

### Token Lifecycle

```
Propose → Review → Implement → Document → Deprecate
   │         │         │           │          │
   └─ RFC    └─ Team   └─ Code +   └─ Update  └─ Mark deprecated,
     with      review    tests      docs +      add migration
     rationale            ↓         changelog    guide, remove
                       Publish                   after 2 releases
```

### Naming Convention

Pattern: `{category}-{property}-{variant}-{state}-{scale}`

| Segment | Values | Example |
|---------|--------|---------|
| `category` | `color`, `space`, `text`, `shadow`, `radius`, `z`, `duration`, `ease` | `color-` |
| `property` | `bg`, `fg`, `border`, `outline`, `ring` | `color-bg-` |
| `variant` | `primary`, `secondary`, `success`, `warning`, `error`, `muted` | `color-bg-primary` |
| `state` | `default` (omitted), `hover`, `active`, `disabled`, `focus` | `color-bg-primary-hover` |
| `scale` | numeric scale for graduated values | `space-4`, `shadow-md` |

Examples:
```
--color-bg-primary           → Primary background (default state)
--color-bg-primary-hover     → Primary background on hover
--color-fg-muted             → Muted foreground/text color
--space-4                    → 16px spacing
--shadow-md                  → Medium elevation shadow
--radius-lg                  → Large border radius
--duration-normal            → 200ms transition
```

### Token Aliasing Strategy — Three-Tier System

```
Tier 1: Primitive Tokens    → Raw values, never used directly in components
  --blue-500: #3b82f6;
  --gray-200: #e5e7eb;

Tier 2: Semantic Tokens     → Meaning-based, theme-switchable
  --color-primary: var(--blue-500);
  --color-surface: var(--gray-200);

Tier 3: Component Tokens    → Scoped to specific components
  --button-bg: var(--color-primary);
  --card-bg: var(--color-surface);
```

### When to Create a New Token vs Reuse

| Scenario | Action |
|----------|--------|
| Value used in 1 place | Use nearest existing token |
| Value used in 2 places | Use nearest existing token, note potential pattern |
| Value used in ≥3 places with same semantic meaning | Create new semantic token |
| Value is theme-dependent | MUST be a token (not hardcoded) |
| Value is truly one-off (e.g., illustration positioning) | Use `calc()` with existing tokens or raw value with comment |

### Golden Example — Token Governance

```css
/* ❌ WRONG: Ad-hoc tokens, inconsistent naming, no tiers */
:root {
  --btn-blue: #3b82f6;
  --card-bg-color: white;
  --bigShadow: 0 4px 12px rgba(0,0,0,0.15);
  --small_space: 8px;
  --HEADER_HEIGHT: 64px;
}

/* ✅ RIGHT: Three-tier system, consistent naming convention */
/* Tier 1: Primitives (rarely referenced directly) */
:root {
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --white: #ffffff;
  --gray-900: #111827;
}

/* Tier 2: Semantic (used by components, theme-switchable) */
:root {
  --color-bg-primary: var(--blue-500);
  --color-bg-primary-hover: var(--blue-600);
  --color-bg-surface: var(--white);
  --color-fg-default: var(--gray-900);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --space-2: 0.5rem;
}

/* Tier 3: Component (scoped, references semantic tokens) */
:root {
  --button-bg: var(--color-bg-primary);
  --button-bg-hover: var(--color-bg-primary-hover);
  --card-bg: var(--color-bg-surface);
  --card-shadow: var(--shadow-md);
}
```

## Polymorphic Components — `asChild` and `as` Patterns

Enable components to render as different HTML elements or other components while preserving styles and behavior.

### `asChild` Pattern (Radix Approach — Recommended)

The child element becomes the rendered element, receiving all props and styles from the parent component.

```tsx
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, variant = "primary", className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

// Usage:
<Button>Regular button</Button>
<Button asChild><a href="/home">Link styled as button</a></Button>
<Button asChild><Link to="/home">Router link styled as button</Link></Button>
```

### `as` Prop Pattern (Legacy but Common)

The component renders as the specified element type. Simpler but has TypeScript complexity.

```tsx
type AsProp<C extends React.ElementType> = { as?: C };
type PolymorphicProps<C extends React.ElementType, Props = {}> =
  Props & AsProp<C> & Omit<React.ComponentPropsWithoutRef<C>, keyof Props | "as">;

function Box<C extends React.ElementType = "div">({
  as, className, ...props
}: PolymorphicProps<C, { className?: string }>) {
  const Component = as || "div";
  return <Component className={cn("box", className)} {...props} />;
}

// Usage:
<Box>Default div</Box>
<Box as="section">Renders as section</Box>
<Box as="a" href="/home">Renders as anchor</Box>
```

### When to Use Which Pattern

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| `asChild` (Slot) | Building a design system; need full type safety; Radix-based project | Simple utility components |
| `as` prop | Quick polymorphism; legacy codebase; no Radix dependency | Complex type inference needed; many element types |
| Composition (children) | Component is a wrapper/layout; doesn't need to change element | Styling must transfer to child element |

### Golden Example — Polymorphic Component

```tsx
// ❌ WRONG: Separate components for each element type — duplicated logic
const ButtonLink = ({ href, ...props }) => <a href={href} className="btn" {...props} />;
const ButtonButton = (props) => <button className="btn" {...props} />;
const ButtonDiv = (props) => <div className="btn" role="button" tabindex="0" {...props} />;

// ✅ RIGHT: Single polymorphic component with asChild
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, variant, size, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

// All these render correctly with full type safety:
<Button>Click me</Button>
<Button asChild><a href="/docs">Read docs</a></Button>
<Button asChild><Link to="/dashboard">Dashboard</Link></Button>
```

## HARD RULES
- MUST use design tokens in components — never hardcoded values
- MUST define all interactive states: default, hover, focus, active, disabled
- MUST use semantic HTML elements as component base
- MUST use composition pattern for complex components
- MUST use variant prop instead of multiple boolean style props
- MUST prefer container queries for component-level responsiveness
- MUST prefer CSS logical properties for internationalization
- MUST provide TypeScript types or equivalent for component API
- MUST NOT create components that only work at one viewport size
- MUST NOT use inline styles for anything other than truly dynamic values
- MUST use `cn()` (clsx + twMerge) for className merging in Tailwind projects — never string concatenation
- MUST use CVA for variant management when project uses Tailwind CSS
- MUST use `forwardRef` + `className` + `...props` spread for all reusable components
- MUST prefer data-attribute selectors over JS-controlled class toggling for Radix-based components
- MUST support both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) modes for stateful components
- MUST use `@layer` for CSS architecture when project supports it — define layer order explicitly
- MUST NOT use `!important` — use `@layer` ordering or specificity management instead
- MUST follow three-tier token aliasing: primitive → semantic → component
- MUST follow token naming convention: `{category}-{property}-{variant}-{state}-{scale}`
- MUST use `asChild` (Slot) pattern for polymorphic components in Radix-based projects
- MUST prefer `asChild` over `as` prop for new components — better type safety and composition
