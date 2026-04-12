# Corporate Design Tokens

> Phong cách: Chuyên nghiệp, đáng tin cậy, rõ ràng, có cấu trúc
> Nguồn cảm hứng: Salesforce Lightning, IBM Carbon, Microsoft Fluent, ngân hàng số
> Khi nào dùng: Admin panel, dashboard doanh nghiệp, ứng dụng tài chính, CRM

## Colors
```css
:root {
  /* Primitives — Blue + Gray */
  --blue-50: 214 100% 97%; --blue-100: 214 95% 93%; --blue-200: 213 97% 87%; --blue-300: 212 96% 78%;
  --blue-400: 213 94% 68%; --blue-500: 217 91% 60%; --blue-600: 221 83% 53%; --blue-700: 224 76% 48%;
  --blue-800: 226 71% 40%; --blue-900: 224 64% 33%; --blue-950: 226 57% 21%;
  --gray-50: 210 20% 98%; --gray-100: 220 15% 96%; --gray-200: 220 13% 91%; --gray-300: 216 12% 84%;
  --gray-400: 218 11% 65%; --gray-500: 220 9% 46%; --gray-600: 215 14% 34%;
  --gray-700: 217 19% 27%; --gray-800: 215 28% 17%; --gray-900: 221 39% 11%;
  /* Semantic */
  --background: 0 0% 100%;          --foreground: var(--gray-900);
  --muted: var(--gray-100);          --muted-foreground: var(--gray-500);
  --card: 0 0% 100%;                 --card-foreground: var(--gray-900);
  --border: var(--gray-200);         --input: var(--gray-300);  --ring: var(--blue-500);
  --primary: var(--blue-700);        --primary-foreground: 0 0% 100%;
  --secondary: var(--gray-100);      --secondary-foreground: var(--gray-800);
  --accent: var(--blue-50);          --accent-foreground: var(--blue-900);
  --destructive: 0 72% 51%;         --destructive-foreground: 0 0% 100%;
  --success: 142 71% 29%; --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%;  --warning-foreground: 38 92% 14%;
  --error: 0 72% 51%;     --error-foreground: 0 0% 100%;
  --info: var(--blue-500); --info-foreground: 0 0% 100%;
}
```

## Typography
```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'Cascadia Code', ui-monospace, monospace;
  /* Tỷ lệ 1.200 — Minor Third */
  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.2rem;  --text-xl: 1.44rem;  --text-2xl: 1.728rem; --text-3xl: 2.074rem;
  --leading-tight: 1.3; --leading-normal: 1.5; --leading-relaxed: 1.6;
  --font-normal: 400; --font-semibold: 600; --font-bold: 700;
}
```

## Spacing & Border Radius
```css
:root {
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem;  --space-6: 2rem;    --space-7: 3rem;    --space-8: 4rem;
  --radius-sm: 2px; --radius: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 9999px;
}
```

## Shadows
```css
:root {
  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.06);
  --shadow: 0 1px 3px hsl(0 0% 0% / 0.1), 0 1px 2px hsl(0 0% 0% / 0.06);
  --shadow-md: 0 4px 8px hsl(0 0% 0% / 0.1), 0 2px 4px hsl(0 0% 0% / 0.06);
  --shadow-lg: 0 12px 24px hsl(0 0% 0% / 0.12), 0 4px 8px hsl(0 0% 0% / 0.06);
  --shadow-xl: 0 20px 40px hsl(0 0% 0% / 0.15), 0 8px 16px hsl(0 0% 0% / 0.08);
}
```

## Animations
```css
:root {
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
  :root { --duration-fast: 0.01ms; --duration-normal: 0.01ms; --duration-slow: 0.01ms; }
}
```

## Dark Mode Tokens
```css
/* Tuỳ chọn — doanh nghiệp thường chỉ dùng light mode */
.dark, [data-theme="dark"] {
  --background: var(--gray-900); --foreground: var(--gray-50);
  --muted: var(--gray-800);      --muted-foreground: var(--gray-400);
  --card: var(--gray-800);       --card-foreground: var(--gray-50);
  --border: var(--gray-700);     --input: var(--gray-700);
  --primary: var(--blue-400);    --primary-foreground: var(--gray-900);
}
```

## Usage Example
```css
.btn-primary {
  font: var(--font-semibold) var(--text-sm)/var(--leading-tight) var(--font-sans);
  padding: var(--space-3) var(--space-6); /* py-3 px-6 rộng rãi */
  background: hsl(var(--primary)); color: hsl(var(--primary-foreground));
  border: 1px solid transparent; border-radius: var(--radius); box-shadow: var(--shadow-sm);
  transition: background var(--duration-normal) var(--easing-default);
}
.btn-primary:hover { background: hsl(var(--blue-800)); }