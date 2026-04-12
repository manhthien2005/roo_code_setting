# Layout & Grid — Style Reference

> Nguồn: Open Props, Every Layout
> Dùng khi: Agent cần tạo page layouts, grid systems, flex patterns

## Anatomy
```
Page Layout: [Header] [Sidebar | Main] [Footer]  — Holy Grail
Grid:        Auto-fill responsive cards/items
Flex:        Stack, cluster, center, space-between
```

## CSS Pattern — ĐÚNG ✅

```css
/* ✅ Pattern 1: Holy Grail — sidebar + main */
.page-layout {
  display: grid;
  grid-template: "header header" auto "sidebar main" 1fr "footer footer" auto
               / minmax(200px, 16rem) 1fr;
  min-height: 100dvh;
}
.page-header { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main { grid-area: main; padding: var(--space-5); overflow-y: auto; }
.page-footer { grid-area: footer; }

/* ✅ Pattern 2: CSS Grid auto-fill responsive */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--space-5);
}

/* ✅ Pattern 3: Stack — vertical spacing với gap */
.stack { display: flex; flex-direction: column; gap: var(--space-4); }
.stack[data-gap="sm"] { gap: var(--space-2); }
.stack[data-gap="lg"] { gap: var(--space-6); }
```

## CSS Pattern — SAI ❌

```css
/* ❌ Sai 1: Fixed columns — bể trên mobile */
.grid { display: grid; grid-template-columns: repeat(4, 250px); }
/* → Dùng auto-fill + minmax + fr units */

/* ❌ Sai 2: Margin thay gap — phức tạp, dễ lỗi */
.stack > * { margin-bottom: 16px; }
.stack > *:last-child { margin-bottom: 0; }
/* → Dùng gap thay — gọn, không cần :last-child override */
```

## Flex Patterns

```css
/* Center cả 2 trục */
.flex-center { display: flex; align-items: center; justify-content: center; }
/* Space-between — header/footer layout */
.flex-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
/* Cluster — wrap tags, badges */
.cluster { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
```

## Container Queries

```css
/* Component responsive theo container, không viewport */
.card-wrapper { container-type: inline-size; }
@container (min-width: 400px) {
  .card-inner { display: flex; flex-direction: row; }
  .card-media { flex: 0 0 40%; }
}
@container (max-width: 399px) {
  .card-inner { flex-direction: column; }
}
```

## Responsive Breakpoints

```css
/* Mobile-first: base → sm(640) → md(768) → lg(1024) → xl(1280) → 2xl(1536) */
@media (min-width: 640px)  { /* sm: phones landscape */ }
@media (min-width: 768px)  { /* md: tablets */ }
@media (min-width: 1024px) { /* lg: laptops */ }
@media (min-width: 1280px) { /* xl: desktops */ }
/* Sidebar layout responsive */
@media (max-width: 767px) {
  .page-layout { grid-template-columns: 1fr; }
  .page-sidebar { display: none; }
}
```

## Accessibility Checklist
- [ ] Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- [ ] Skip-to-main: `<a href="#main" class="sr-only focus:not-sr-only">`
- [ ] DOM order = visual order (CSS order không thay đổi tab order)
- [ ] `<main>` chỉ 1 per page, `<aside aria-label="Sidebar">`
- [ ] Min viewport 320px — không horizontal scroll

## Dark Mode
```css
/* Layout tokens tự chuyển — đảm bảo borders visible */
.dark .page-sidebar { border-color: hsl(var(--border)); }
```

## Responsive Summary

| Pattern | Mobile (<640) | Tablet (768+) | Desktop (1024+) |
|---------|--------------|---------------|-----------------|
| Page layout | 1 col | Sidebar overlay | Sidebar + Main |
| Card grid | 1 col | 2 cols | 3-4 cols auto-fill |
| Stack gap | `--space-3` | `--space-4` | `--space-5` |

## Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .page-sidebar { transition-duration: 0.01ms !important; }
}
```
