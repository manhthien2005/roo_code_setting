# Buttons — Style Reference

> Nguồn: shadcn/ui, Radix UI
> Dùng khi: Agent cần tạo hoặc review button components

## Anatomy
```
┌──────────────────────┐
│ [icon?] Label [icon?]│  ← inline-flex, gap, align-center
└──────────────────────┘
Sizes: sm=32px, md=40px, lg=48px, icon-only=aspect-ratio:1
```

## CSS Pattern — ĐÚNG ✅

```css
/* ✅ Pattern 1: Base button dùng design tokens */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  font: var(--font-medium) var(--text-sm)/var(--leading-tight) var(--font-sans);
  border-radius: var(--radius); cursor: pointer; border: none;
  height: 2.5rem; padding: var(--space-2) var(--space-4); /* md mặc định */
  transition: background var(--duration-fast) var(--easing-default),
              box-shadow var(--duration-fast) var(--easing-default);
}
/* ✅ Pattern 2: Variants dùng data-attributes (Radix style) */
.btn[data-variant="primary"] { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
.btn[data-variant="secondary"] { background: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); }
.btn[data-variant="destructive"] { background: hsl(var(--destructive)); color: hsl(var(--destructive-foreground)); }
.btn[data-variant="outline"] { background: transparent; color: hsl(var(--foreground)); border: 1px solid hsl(var(--border)); }
.btn[data-variant="ghost"] { background: transparent; color: hsl(var(--foreground)); }
.btn[data-variant="link"] { background: transparent; color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 4px; height: auto; padding: 0; }
/* ✅ Pattern 3: Sizes */
.btn[data-size="sm"] { height: 2rem; padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }
.btn[data-size="lg"] { height: 3rem; padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
.btn[data-size="icon"] { height: 2.5rem; width: 2.5rem; aspect-ratio: 1; padding: 0; }
```

## CSS Pattern — SAI ❌

```css
/* ❌ Sai 1: Magic numbers, không dùng tokens */
.btn { padding: 10px 18px; border-radius: 5px; background: #3b82f6; color: white; font-size: 13px; }
/* ❌ Sai 2: Boolean class thay vì variant system */
.btn.primary.large.rounded { /* quá nhiều class kết hợp */ }
/* ❌ Sai 3: Dùng div thay vì button — thiếu keyboard support */
div.btn { /* KHÔNG semantic */ }
```

## States
```css
.btn[data-variant="primary"]:hover { opacity: 0.9; }
.btn[data-variant="outline"]:hover, .btn[data-variant="ghost"]:hover { background: hsl(var(--accent)); }
.btn:focus-visible { outline: 2px solid hsl(var(--ring)); outline-offset: 2px; }
.btn:active { transform: scale(0.98); }
.btn:disabled, .btn[data-disabled] { opacity: 0.5; pointer-events: none; cursor: not-allowed; }
/* Loading — spinner + ẩn text */
.btn[data-loading] { position: relative; color: transparent; pointer-events: none; }
.btn[data-loading]::after {
  content: ""; position: absolute; width: 1rem; height: 1rem;
  border: 2px solid currentColor; border-right-color: transparent;
  border-radius: var(--radius-full); animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

## CVA Pattern Example
```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
  { variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4", lg: "h-12 px-6 text-base", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
```

## Accessibility Checklist
- [ ] Dùng `<button>` — KHÔNG `<div>` hoặc `<a>` cho actions
- [ ] Icon-only: `aria-label="Mô tả"` | Loading: `aria-busy="true"`
- [ ] Disabled: attribute `disabled` (không chỉ CSS)
- [ ] Focus ring: ≥2px, contrast ≥3:1 | Touch target: ≥44×44px

## Dark Mode
```css
/* Tokens tự chuyển khi .dark / [data-theme="dark"] — không hardcode màu */
.dark .btn { box-shadow: var(--shadow-sm); }
```

## Responsive
```css
@media (max-width: 639px) { .btn-block-mobile { width: 100%; } }
@media (pointer: coarse) { .btn[data-size="sm"] { min-height: 44px; } }
```

## Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .btn { transition-duration: 0.01ms !important; }
  .btn[data-loading]::after { animation-duration: 0.01ms !important; }
}
```
