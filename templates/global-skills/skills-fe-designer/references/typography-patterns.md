# Typography Patterns — Style Reference

> Nguồn: Open Props, shadcn/ui
> Dùng khi: Agent cần tạo hoặc review typography, prose, text styles

## Anatomy
```
Headings: h1→h6 semantic hierarchy    Prose: paragraph, list, blockquote, code
Utilities: truncation, fluid sizing, links
```

## CSS Pattern — ĐÚNG ✅

```css
/* ✅ Pattern 1: Heading hierarchy dùng tokens */
h1, .h1 { font: var(--font-bold) var(--text-3xl)/var(--leading-tight) var(--font-sans); letter-spacing: -0.02em; }
h2, .h2 { font: var(--font-semibold) var(--text-2xl)/var(--leading-tight) var(--font-sans); letter-spacing: -0.01em; }
h3, .h3 { font: var(--font-semibold) var(--text-xl)/var(--leading-tight) var(--font-sans); }
h4, .h4 { font: var(--font-semibold) var(--text-lg)/var(--leading-tight) var(--font-sans); }
h5, .h5 { font: var(--font-medium) var(--text-base)/var(--leading-tight) var(--font-sans); }
h6, .h6 { font: var(--font-medium) var(--text-sm)/var(--leading-tight) var(--font-sans); }

/* ✅ Pattern 2: Prose / article — tối ưu readability */
.prose {
  font: var(--font-normal) var(--text-base)/var(--leading-relaxed) var(--font-sans);
  color: hsl(var(--foreground)); max-width: 65ch; /* 65-75ch tối ưu */
}
.prose p { margin-bottom: var(--space-4); }
.prose h2 { margin-top: var(--space-7); margin-bottom: var(--space-3); }
.prose h3 { margin-top: var(--space-6); margin-bottom: var(--space-2); }
.prose blockquote {
  border-left: 3px solid hsl(var(--border)); padding-left: var(--space-4);
  color: hsl(var(--muted-foreground)); font-style: italic;
}

/* ✅ Pattern 3: Fluid typography dùng clamp() */
.heading-fluid { font-size: clamp(var(--text-2xl), 4vw + 0.5rem, var(--text-3xl)); }
```

## CSS Pattern — SAI ❌

```css
/* ❌ Sai 1: Hardcode font-size, không dùng tokens */
h1 { font-size: 36px; font-weight: bold; line-height: 1.1; font-family: Arial; }

/* ❌ Sai 2: Body text quá rộng — mất readability */
.article { max-width: 100%; } /* phải có max-width 65-75ch */

/* ❌ Sai 3: Skip heading levels — h1 rồi h3 */
/* <h1>Title</h1><h3>Section</h3> — screen reader bị confused */
```

## Text Truncation
```css
/* Một dòng ellipsis */
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Nhiều dòng clamp */
.line-clamp-2 {
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
```

## Link Styles
```css
.link {
  color: hsl(var(--primary)); text-decoration: underline;
  text-underline-offset: 4px; text-decoration-thickness: 1px;
  transition: color var(--duration-fast) var(--easing-default);
}
.link:hover { color: hsl(var(--primary) / 0.8); }
.link:visited { color: hsl(var(--primary) / 0.7); }
.link-external::after { content: " ↗"; font-size: 0.8em; } /* icon cho link ngoài */
```

## Code & Monospace
```css
/* Inline code */
code:not(pre code) {
  font: var(--font-normal) 0.875em/inherit var(--font-mono);
  background: hsl(var(--muted)); padding: 0.2em 0.4em; border-radius: var(--radius-sm);
}
/* Code block */
pre {
  background: hsl(var(--muted)); border: 1px solid hsl(var(--border));
  border-radius: var(--radius); padding: var(--space-4); overflow-x: auto;
  font: var(--font-normal) var(--text-sm)/var(--leading-normal) var(--font-mono);
}
```

## List Styling
```css
.prose ul { list-style: disc; padding-left: var(--space-5); }
.prose ol { list-style: decimal; padding-left: var(--space-5); }
.prose li { margin-bottom: var(--space-1); }
.prose li::marker { color: hsl(var(--muted-foreground)); }
/* Description list */
.prose dl { display: grid; grid-template-columns: auto 1fr; gap: var(--space-2) var(--space-4); }
.prose dt { font-weight: var(--font-medium); }
.prose dd { color: hsl(var(--muted-foreground)); }
```

## Accessibility Checklist
- [ ] Heading hierarchy: h1→h2→h3, KHÔNG skip levels
- [ ] `lang` attribute trên `<html>` và inline language changes
- [ ] Link text mô tả rõ — KHÔNG "click here" alone
- [ ] Line-height body ≥1.5, heading ≥1.2; contrast ≥4.5:1 normal, ≥3:1 large
- [ ] Text resize 200% không bị cắt; truncated text có `title` hoặc tooltip

## Dark Mode
```css
/* Text tokens tự chuyển — đảm bảo code blocks contrast đủ */
.dark code:not(pre code) { background: hsl(var(--muted)); }
.dark .prose blockquote { border-color: hsl(var(--border)); }
```

## Responsive
```css
/* Fluid headings scale theo viewport */
h1, .h1 { font-size: clamp(1.953rem, 3vw + 0.5rem, 2.441rem); }
h2, .h2 { font-size: clamp(1.563rem, 2.5vw + 0.3rem, 1.953rem); }
.prose { padding-inline: var(--space-4); }
@media (max-width: 639px) { pre { font-size: var(--text-xs); } }
```

## Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .link { transition-duration: 0.01ms !important; }
}
```
