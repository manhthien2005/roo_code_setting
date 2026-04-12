# Navigation — Style Reference

> Nguồn: Radix UI, W3C ARIA Practices
> Dùng khi: Agent cần tạo hoặc review navigation components

## Anatomy
```
Navbar: [Logo] [Links...] [Actions] — horizontal, sticky
Sidebar: [Logo] [Items...] — vertical, collapsible
Breadcrumb: Home > Category > Current | Tabs: [Tab1] [Tab2*] | Pagination: [<] [1] [2*] [>]
```

## CSS Pattern — ĐÚNG ✅

```css
/* ✅ Pattern 1: Navbar — sticky, backdrop blur */
.navbar {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  height: 4rem; padding-inline: var(--space-5);
  background: hsl(var(--background) / 0.95); backdrop-filter: blur(8px);
  border-bottom: 1px solid hsl(var(--border));
}
.nav-links { display: flex; align-items: center; gap: var(--space-1); }
.nav-link {
  padding: var(--space-2) var(--space-3);
  font: var(--font-medium) var(--text-sm)/var(--leading-normal) var(--font-sans);
  color: hsl(var(--muted-foreground)); border-radius: var(--radius);
  transition: color var(--duration-fast) var(--easing-default); text-decoration: none;
}
.nav-link:hover { color: hsl(var(--foreground)); background: hsl(var(--accent)); }
.nav-link[data-active] { color: hsl(var(--foreground)); }

/* ✅ Pattern 2: Sidebar collapsible */
.sidebar {
  width: 16rem; border-right: 1px solid hsl(var(--border));
  background: hsl(var(--background)); display: flex; flex-direction: column;
  transition: width var(--duration-normal) var(--easing-default); overflow: hidden;
}
.sidebar[data-collapsed] { width: 4rem; }
.sidebar-item {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-2) var(--space-3); border-radius: var(--radius);
  color: hsl(var(--muted-foreground)); font-size: var(--text-sm); text-decoration: none;
}
.sidebar-item:hover { background: hsl(var(--accent)); color: hsl(var(--foreground)); }
.sidebar-item[data-active] { background: hsl(var(--accent)); color: hsl(var(--foreground)); font-weight: var(--font-medium); }

/* ✅ Pattern 3: Tabs — Radix data-state */
.tabs-list {
  display: inline-flex; align-items: center;
  background: hsl(var(--muted)); border-radius: var(--radius); padding: var(--space-1); gap: var(--space-1);
}
.tab-trigger {
  padding: var(--space-2) var(--space-3);
  font: var(--font-medium) var(--text-sm)/var(--leading-normal) var(--font-sans);
  color: hsl(var(--muted-foreground)); border-radius: var(--radius-sm);
  background: transparent; border: none; cursor: pointer;
}
.tab-trigger[data-state="active"] {
  background: hsl(var(--background)); color: hsl(var(--foreground)); box-shadow: var(--shadow-sm);
}
```

## CSS Pattern — SAI ❌

```css
/* ❌ Sai 1: Fixed navbar không backdrop — nội dung xuyên qua */
.navbar { position: fixed; background: white; } /* thiếu blur, z-index */
/* ❌ Sai 2: Active chỉ bằng color — thiếu indicator rõ ràng */
.nav-link.active { color: blue; } /* cần background hoặc border indicator */
```

## Breadcrumb & Pagination
```css
.breadcrumb { display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-sm); }
.breadcrumb-link { color: hsl(var(--muted-foreground)); text-decoration: none; }
.breadcrumb-link:hover { color: hsl(var(--foreground)); }
.breadcrumb-current { color: hsl(var(--foreground)); font-weight: var(--font-medium); }

.pagination { display: flex; align-items: center; gap: var(--space-1); }
.page-btn {
  height: 2.5rem; min-width: 2.5rem;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid hsl(var(--border)); border-radius: var(--radius);
  font-size: var(--text-sm); background: transparent;
}
.page-btn[data-active] { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
.page-btn:disabled { opacity: 0.5; pointer-events: none; }
```

## Accessibility Checklist
- [ ] Navbar: `<nav role="navigation" aria-label="Main">`
- [ ] Breadcrumb: `<nav aria-label="Breadcrumb">`, current: `aria-current="page"`
- [ ] Tabs: `role="tablist"` → `role="tab"` + `aria-selected` → `role="tabpanel"`
- [ ] Sidebar: `<nav aria-label="Sidebar">`, toggle: `aria-expanded`
- [ ] Pagination: `<nav aria-label="Pagination">`, current: `aria-current="page"`
- [ ] Keyboard: Tab giữa nav items, Arrow keys trong tabs

## Dark Mode
```css
.dark .navbar { background: hsl(var(--background) / 0.9); }
```

## Responsive
```css
@media (max-width: 767px) {
  .nav-links { display: none; }
  .nav-links[data-open] {
    display: flex; flex-direction: column; position: absolute; top: 4rem; left: 0; right: 0;
    background: hsl(var(--background)); border-bottom: 1px solid hsl(var(--border)); padding: var(--space-4);
  }
  .sidebar { position: fixed; z-index: 50; transform: translateX(-100%); }
  .sidebar[data-open] { transform: translateX(0); }
}
```

## Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .sidebar, .nav-link, .tab-trigger { transition-duration: 0.01ms !important; }
}
```
