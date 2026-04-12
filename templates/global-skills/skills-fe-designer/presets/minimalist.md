# Minimalist Design Tokens

> Phong cách: Tinh giản, tập trung nội dung, tối ưu công năng
> Nguồn cảm hứng: shadcn/ui, Vercel, Linear, Stripe
> Khi nào dùng: SaaS dashboard, developer tools, productivity apps

## Colors
```css
:root {
  /* Primitives — Zinc neutrals */
  --zinc-50: 0 0% 98%;   --zinc-100: 0 0% 96%;  --zinc-200: 0 0% 90%;
  --zinc-300: 0 0% 83%;  --zinc-400: 0 0% 64%;  --zinc-500: 0 0% 45%;
  --zinc-600: 0 0% 32%;  --zinc-700: 0 0% 25%;  --zinc-800: 0 0% 15%;
  --zinc-900: 0 0% 9%;   --zinc-950: 0 0% 4%;
  /* Semantic */
  --background: var(--zinc-50);  --foreground: var(--zinc-950);
  --muted: var(--zinc-100);      --muted-foreground: var(--zinc-500);
  --card: 0 0% 100%;             --card-foreground: var(--zinc-950);
  --border: var(--zinc-200);     --input: var(--zinc-200);  --ring: 250 50% 50%;
  --primary: 250 50% 50%;       --primary-foreground: 0 0% 100%;  /* Violet tinh tế */
  --secondary: var(--zinc-100); --secondary-foreground: var(--zinc-900);
  --accent: var(--zinc-100);    --accent-foreground: var(--zinc-900);
  --destructive: 0 84% 60%;    --destructive-foreground: 0 0% 100%;
  --success: 142 76% 36%;  --warning: 38 92% 50%;
  --error: 0 84% 60%;      --info: 217 91% 60%;
}
```

## Typography
```css
:root {
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  /* Tỷ lệ 1.250 — Major Third */
  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.25rem;  --text-xl: 1.563rem; --text-2xl: 1.953rem; --text-3xl: 2.441rem;
  --leading-tight: 1.25; --leading-normal: 1.5; --leading-relaxed: 1.625;
  --font-normal: 400; --font-medium: 500; --font-semibold: 600; --font-bold: 700;
}
```

## Spacing & Border Radius
```css
:root {
  /* Lưới 8pt nghiêm ngặt, compact */
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem;  --space-6: 2rem;    --space-7: 3rem;    --space-8: 4rem;
  --radius-sm: 4px; --radius: 6px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 9999px;
}
```

## Shadows
```css
:root {
  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.05);
  --shadow: 0 1px 3px hsl(0 0% 0% / 0.1), 0 1px 2px hsl(0 0% 0% / 0.06);
  --shadow-md: 0 4px 6px hsl(0 0% 0% / 0.07), 0 2px 4px hsl(0 0% 0% / 0.06);
  --shadow-lg: 0 10px 15px hsl(0 0% 0% / 0.1), 0 4px 6px hsl(0 0% 0% / 0.05);
}
```

## Animations
```css
:root {
  --duration-fast: 150ms; --duration-normal: 200ms; /* Hover / Toggle */
  --easing-default: cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  :root { --duration-fast: 0.01ms; --duration-normal: 0.01ms; }
}
```

## Dark Mode Tokens
```css
.dark, [data-theme="dark"] {
  --background: var(--zinc-950); --foreground: var(--zinc-50);
  --muted: var(--zinc-800);      --muted-foreground: var(--zinc-400);
  --card: var(--zinc-900);       --card-foreground: var(--zinc-50);
  --border: var(--zinc-800);     --input: var(--zinc-800);
  --primary: 250 50% 60%;       --primary-foreground: 0 0% 100%;
  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.3);
}
```

## Usage Example
```css
.btn-primary {
  font: var(--font-medium) var(--text-sm)/var(--leading-tight) var(--font-sans);
  padding: var(--space-2) var(--space-4); /* py-2 px-4 compact */
  background: hsl(var(--primary)); color: hsl(var(--primary-foreground));
  border: none; border-radius: var(--radius); box-shadow: var(--shadow-sm);
  transition: opacity var(--duration-fast) var(--easing-default);
}
.btn-primary:hover { opacity: 0.9; }
```
