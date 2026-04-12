# Modals & Dialogs — Style Reference

> Nguồn: Radix UI, shadcn/ui
> Dùng khi: Agent cần tạo modal, dialog, drawer, tooltip, popover

## Anatomy
```
Overlay (backdrop) → Dialog Content → Header / Body / Footer
Drawer: slide from side | Tooltip: nhỏ, text-only | Popover: interactive content
```

## CSS Pattern — ĐÚNG ✅

```css
/* ✅ Pattern 1: Dialog overlay + content */
.dialog-overlay {
  position: fixed; inset: 0; z-index: 50;
  background: hsl(0 0% 0% / 0.5); backdrop-filter: blur(4px);
  animation: fade-in 200ms var(--easing-default);
}
.dialog-content {
  position: fixed; z-index: 50;
  left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: min(90vw, 32rem); max-height: 85vh; overflow-y: auto;
  background: hsl(var(--background)); border: 1px solid hsl(var(--border));
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
  padding: var(--space-5);
  animation: dialog-in 200ms var(--easing-default);
}
.dialog-header { display: flex; flex-direction: column; gap: var(--space-1); }
.dialog-title { font: var(--font-semibold) var(--text-lg)/var(--leading-tight) var(--font-sans); }
.dialog-description { font-size: var(--text-sm); color: hsl(var(--muted-foreground)); }
.dialog-footer { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-5); }

/* ✅ Pattern 2: Animations */
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes dialog-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/* ✅ Pattern 3: Drawer — slide from right */
.drawer-content {
  position: fixed; z-index: 50; top: 0; right: 0; bottom: 0;
  width: min(90vw, 24rem); background: hsl(var(--background));
  border-left: 1px solid hsl(var(--border)); box-shadow: var(--shadow-lg);
  padding: var(--space-5);
  animation: slide-right 300ms var(--easing-default);
}
@keyframes slide-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
```

## CSS Pattern — SAI ❌

```css
/* ❌ Sai 1: Không có overlay — user không biết context bị block */
.dialog { position: fixed; top: 50%; left: 50%; }

/* ❌ Sai 2: Hardcode size — bể trên mobile */
.dialog { width: 600px; height: 400px; } /* dùng min() + max-height + vh */
```

## Tooltip & Popover
```css
.tooltip {
  padding: var(--space-1) var(--space-2); font-size: var(--text-xs);
  background: hsl(var(--foreground)); color: hsl(var(--background));
  border-radius: var(--radius-sm); box-shadow: var(--shadow); max-width: 20rem;
  animation: fade-in 150ms var(--easing-default);
}
.popover {
  width: 18rem; padding: var(--space-4);
  background: hsl(var(--background)); border: 1px solid hsl(var(--border));
  border-radius: var(--radius-md); box-shadow: var(--shadow-md);
}
```

## Focus Trap (JS logic)
```
Mở → focus phần tử focusable đầu tiên
Tab cycle trong dialog | Shift+Tab ngược | Escape đóng
Đóng → trả focus về trigger element
```

## Accessibility Checklist
- [ ] Dialog: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- [ ] `aria-describedby` cho description (nếu có)
- [ ] Focus trap: Tab cycle, Escape đóng
- [ ] Close button: `aria-label="Đóng"`
- [ ] Tooltip: `role="tooltip"`, trigger có `aria-describedby`
- [ ] Popover: `aria-expanded` trên trigger

## Dark Mode
```css
.dark .dialog-overlay { background: hsl(0 0% 0% / 0.7); }
/* Content surface dùng tokens — tự chuyển */
```

## Responsive
```css
@media (max-width: 479px) {
  .dialog-content {
    width: 100vw; height: 100vh; max-height: 100vh;
    border-radius: 0; top: 0; left: 0; transform: none;
  }
}
@media (max-width: 639px) { .drawer-content { width: 100vw; } }
```

## Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .dialog-overlay, .dialog-content, .drawer-content,
  .tooltip, .popover { animation-duration: 0.01ms !important; }
}
```
