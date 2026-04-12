# Creative Design Tokens

> Phong cách: Táo bạo, biểu cảm, sáng tạo, ấn tượng thị giác
> Nguồn cảm hứng: Framer, Awwwards winners, Dribbble, portfolio sáng tạo
> Khi nào dùng: Portfolio, agency website, landing page sáng tạo, studio thiết kế

## Colors
```css
:root {
  /* Primitives — Violet + Neutral */
  --violet-50: 250 100% 98%; --violet-100: 251 91% 95%; --violet-200: 251 95% 92%; --violet-300: 252 95% 85%;
  --violet-400: 255 92% 76%; --violet-500: 258 90% 66%; --violet-600: 262 83% 58%; --violet-700: 263 70% 50%;
  --violet-800: 263 69% 42%; --violet-900: 264 67% 35%; --violet-950: 261 73% 23%;
  --neutral-50: 0 0% 98%; --neutral-100: 0 0% 96%; --neutral-200: 0 0% 90%; --neutral-400: 0 0% 64%;
  --neutral-500: 0 0% 45%; --neutral-700: 0 0% 25%; --neutral-800: 0 0% 15%;
  --neutral-900: 0 0% 9%; --neutral-950: 0 0% 4%;
  /* Semantic */
  --background: var(--neutral-50);    --foreground: var(--neutral-950);
  --muted: var(--neutral-100);        --muted-foreground: var(--neutral-500);
  --card: 0 0% 100%;                  --card-foreground: var(--neutral-950);
  --border: var(--neutral-200);       --input: var(--neutral-200); --ring: var(--violet-500);
  --primary: var(--violet-600);       --primary-foreground: 0 0% 100%;
  --secondary: 330 81% 60%;          --secondary-foreground: 0 0% 100%; /* Fuchsia */
  --accent: 25 95% 53%;              --accent-foreground: 0 0% 100%;   /* Cam */
  --destructive: 0 84% 60%;          --destructive-foreground: 0 0% 100%;
  --success: 142 76% 36%; --warning: 38 92% 50%; --error: 0 84% 60%; --info: 217 91% 60%;
  --gradient-primary: linear-gradient(135deg, hsl(var(--violet-500)), hsl(var(--secondary)));
  --gradient-accent: linear-gradient(135deg, hsl(var(--accent)), hsl(330 81% 60%));
}
```

## Typography
```css
:root {
  --font-display: 'Plus Jakarta Sans', 'Inter', sans-serif;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Fira Code', ui-monospace, monospace;
  /* Tỷ lệ 1.333 — Perfect Fourth */
  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.333rem; --text-xl: 1.777rem; --text-2xl: 2.369rem; --text-3xl: 3.157rem;
  --leading-tight: 1.15; --leading-normal: 1.5; --leading-relaxed: 1.7;
  --font-light: 300; --font-normal: 400; --font-bold: 700; --font-black: 900;
}
```

## Spacing & Border Radius
```css
:root {
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem;  --space-6: 2rem;    --space-7: 3rem;    --space-8: 4rem;
  --space-9: 6rem;    --space-10: 8rem;
  --radius-sm: 8px; --radius: 12px; --radius-md: 16px; --radius-lg: 24px; --radius-full: 9999px;
}
```

## Shadows
```css
:root {
  --shadow-sm: 0 2px 8px hsl(var(--violet-500) / 0.08);
  --shadow: 0 4px 12px hsl(var(--violet-500) / 0.12);
  --shadow-md: 0 8px 24px hsl(var(--violet-500) / 0.15), 0 2px 8px hsl(0 0% 0% / 0.06);
  --shadow-lg: 0 16px 48px hsl(var(--violet-500) / 0.2), 0 4px 12px hsl(0 0% 0% / 0.08);
  --shadow-glow: 0 0 40px hsl(var(--violet-500) / 0.3);
}
```
## Animations
```css
:root {
  --duration-fast: 200ms; --duration-normal: 300ms; --duration-slow: 500ms;
  --easing-default: cubic-bezier(0.16, 1, 0.3, 1);
  --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --easing-dramatic: cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  :root { --duration-fast: 0.01ms; --duration-normal: 0.01ms; --duration-slow: 0.01ms; }
}
```
## Dark Mode Tokens
```css
.dark, [data-theme="dark"] {
  --background: var(--neutral-950); --foreground: var(--neutral-50);
  --muted: var(--neutral-800);      --muted-foreground: var(--neutral-400);
  --card: var(--neutral-900);       --card-foreground: var(--neutral-50);
  --border: var(--neutral-700);     --input: var(--neutral-700);
  --primary: var(--violet-400);     --primary-foreground: var(--neutral-950);
  --secondary: 330 81% 70%;        --shadow-glow: 0 0 60px hsl(var(--violet-400) / 0.4);
}
```
## Usage Example
```css
.btn-primary {
  font: var(--font-bold) var(--text-base)/var(--leading-tight) var(--font-display);
  padding: var(--space-4) var(--space-8); /* py-4 px-8 rộng rãi */
  background: var(--gradient-primary); color: hsl(var(--primary-foreground));
  border: none; border-radius: var(--radius); box-shadow: var(--shadow);
  transition: transform var(--duration-fast) var(--easing-spring), box-shadow var(--duration-fast) var(--easing-default);
}
.btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: var(--shadow-lg); }
```
