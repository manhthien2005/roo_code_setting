# Cards & Containers — Style Reference

> Nguồn: shadcn/ui, Open Props
> Dùng khi: Agent cần tạo card components hoặc container layouts

## Anatomy
```
┌─ Card ─────────────────────────┐
│  Header: Title + Description   │
│  Media (optional): img/video   │
│  Content: main content area    │
│  Footer: [Button] [Button]     │
└────────────────────────────────┘
```

## CSS Pattern — ĐÚNG ✅

```css
/* ✅ Pattern 1: Card base dùng tokens — compound component */
.card {
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-lg);
  overflow: hidden; /* clip media */
}
.card-header { padding: var(--space-5); padding-bottom: 0; }
.card-title {
  font: var(--font-semibold) var(--text-lg)/var(--leading-tight) var(--font-sans);
}
.card-description {
  font-size: var(--text-sm); color: hsl(var(--muted-foreground));
  margin-top: var(--space-1);
}
.card-content { padding: var(--space-5); }
.card-footer {
  padding: var(--space-5); padding-top: 0;
  display: flex; align-items: center; gap: var(--space-2);
}

/* ✅ Pattern 2: Elevation levels */
.card[data-elevation="flat"]     { box-shadow: none; }
.card[data-elevation="raised"]   { box-shadow: var(--shadow); }
.card[data-elevation="floating"] { box-shadow: var(--shadow-lg); }

/* ✅ Pattern 3: Card grid responsive — auto-fill */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: var(--space-5);
}
```

## CSS Pattern — SAI ❌

```css
/* ❌ Sai 1: Hardcode colors và magic numbers */
.card { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,.1); padding: 20px; }

/* ❌ Sai 2: Fixed grid — không responsive */
.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
/* → Bể layout trên mobile, phải dùng auto-fill + minmax */

/* ❌ Sai 3: Card có toàn bộ padding trong .card thay vì sub-components */
.card { padding: 24px; } /* → Media (img) không edge-to-edge được */
```

## Interactive Card

```css
/* Card clickable — hover lift effect */
.card[data-interactive] {
  cursor: pointer;
  transition: transform var(--duration-fast) var(--easing-default),
              box-shadow var(--duration-fast) var(--easing-default);
}
.card[data-interactive]:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.card[data-interactive]:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
.card[data-interactive]:active { transform: translateY(0); }
```

## Container Max-Widths

```css
/* Container system — centered, responsive padding */
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--space-4);
}
.container[data-size="sm"]  { max-width: 640px; }
.container[data-size="md"]  { max-width: 768px; }
.container[data-size="lg"]  { max-width: 1024px; }
.container[data-size="xl"]  { max-width: 1280px; }
.container[data-size="2xl"] { max-width: 1536px; }
```

## Accessibility Checklist
- [ ] Interactive card: dùng `<a>` hoặc `<button>` wrapper, KHÔNG dùng `<div onclick>`
- [ ] Card có `aria-label` hoặc heading mô tả nội dung
- [ ] Media trong card: `<img alt="mô tả">` hoặc `alt=""` nếu decorative
- [ ] Card group: dùng `<ul><li>` cho danh sách cards
- [ ] Focus ring: visible khi `:focus-visible` cho interactive cards

## Dark Mode

```css
/* Tokens tự chuyển — card surface tối hơn background */
/* Có thể cần tăng border visibility trong dark mode */
.dark .card { border-color: hsl(var(--border)); }
/* Elevation: shadow nhẹ hơn trong dark, dùng border thay thế */
.dark .card[data-elevation="raised"] {
  box-shadow: var(--shadow-sm);
  border-color: hsl(var(--border));
}
```

## Responsive

```css
/* Card padding giảm trên mobile */
@media (max-width: 639px) {
  .card-header, .card-content, .card-footer { padding: var(--space-4); }
  .card-footer { flex-direction: column; }
}
/* Container padding tăng trên desktop */
@media (min-width: 1024px) {
  .container { padding-inline: var(--space-6); }
}
```

## Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .card[data-interactive] { transition-duration: 0.01ms !important; }
}
```
