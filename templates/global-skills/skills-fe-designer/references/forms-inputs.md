# Forms & Inputs — Style Reference

> Nguồn: shadcn/ui, Radix UI, W3C ARIA Practices
> Dùng khi: Agent cần tạo hoặc review form elements

## Anatomy
```
Form Field: <label> → <input/select/textarea> → <error/helper text>
Layout: .form-stack (vertical) | .form-inline (horizontal)
```

## CSS Pattern — ĐÚNG ✅

```css
/* ✅ Pattern 1: Text input base dùng tokens */
.input {
  display: flex; width: 100%; height: 2.5rem;
  padding: var(--space-2) var(--space-3);
  font: var(--font-normal) var(--text-sm)/var(--leading-normal) var(--font-sans);
  color: hsl(var(--foreground)); background: transparent;
  border: 1px solid hsl(var(--input)); border-radius: var(--radius);
  transition: border-color var(--duration-fast) var(--easing-default),
              box-shadow var(--duration-fast) var(--easing-default);
}
.input::placeholder { color: hsl(var(--muted-foreground)); }
.input:focus-visible {
  outline: none; border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.3);
}
/* ✅ Pattern 2: Label + error */
.label { font: var(--font-medium) var(--text-sm)/var(--leading-normal) var(--font-sans); color: hsl(var(--foreground)); }
.field-error .input { border-color: hsl(var(--error)); }
.field-error .input:focus-visible { box-shadow: 0 0 0 2px hsl(var(--error) / 0.3); }
.error-message { font-size: var(--text-xs); color: hsl(var(--error)); margin-top: var(--space-1); }
/* ✅ Pattern 3: Form layout */
.form-stack { display: flex; flex-direction: column; gap: var(--space-4); }
.form-inline { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: flex-end; }
```

## CSS Pattern — SAI ❌

```css
/* ❌ Sai 1: Magic numbers, hardcode colors */
input { padding: 7px 11px; border: 1px solid #ccc; border-radius: 3px; font-size: 13px; }
/* ❌ Sai 2: Chỉ placeholder thay label — không accessible */
/* <input placeholder="Email"> mà không có <label> */
/* ❌ Sai 3: Outline none không thay thế — mất focus indicator */
input:focus { outline: none; } /* PHẢI có box-shadow/border thay thế */
```

## Variants — Textarea, Select, Checkbox, Switch
```css
.textarea {
  min-height: 5rem; resize: vertical;
  padding: var(--space-2) var(--space-3);
  font: var(--font-normal) var(--text-sm)/var(--leading-normal) var(--font-sans);
  border: 1px solid hsl(var(--input)); border-radius: var(--radius);
}
.select { appearance: none; padding-right: var(--space-8); /* chừa chevron */ }
.checkbox {
  height: 1rem; width: 1rem; flex-shrink: 0;
  border: 1px solid hsl(var(--primary)); border-radius: var(--radius-sm);
  accent-color: hsl(var(--primary));
}
.switch {
  width: 2.75rem; height: 1.5rem; border-radius: var(--radius-full);
  background: hsl(var(--input));
  transition: background var(--duration-fast) var(--easing-default);
}
.switch[data-state="checked"] { background: hsl(var(--primary)); }
```

## States
```css
.input:disabled, .textarea:disabled, .select:disabled {
  opacity: 0.5; cursor: not-allowed; background: hsl(var(--muted));
}
.input:read-only { background: hsl(var(--muted) / 0.5); cursor: default; }
```

## Accessibility Checklist
- [ ] Mỗi input PHẢI có `<label>` liên kết qua `for`/`id`
- [ ] Error: `aria-describedby="error-id"` + `aria-invalid="true"`
- [ ] Required: `aria-required="true"` hoặc `required`
- [ ] Checkbox/Radio group: `role="group"` + `aria-labelledby`
- [ ] Focus ring: ≥2px, contrast ≥3:1

## HTML — Đúng Semantic
```html
<div class="form-stack">
  <label for="email" class="label">Email</label>
  <input id="email" type="email" class="input" aria-describedby="email-err" aria-invalid="true">
  <p id="email-err" class="error-message">Email không hợp lệ</p>
</div>
```

## Dark Mode
```css
.dark .input { border-color: hsl(var(--border)); }
```

## Responsive
```css
@media (max-width: 639px) { .form-inline { flex-direction: column; } }
@media (pointer: coarse) { .checkbox, .switch { min-height: 44px; min-width: 44px; } }
```

## Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .input, .textarea, .select, .switch { transition-duration: 0.01ms !important; }
}
```
