# Dark Mode Setup Guide

next-themes + Tailwind CSS v4 implementation.

---

## 1. Install Dependencies

```bash
pnpm add next-themes
```

---

## 2. Theme Provider

```tsx
// components/providers.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"           // Adds .dark class to html
      defaultTheme="system"       // Use system preference by default
      enableSystem                // Enable system preference detection
      disableTransitionOnChange   // Prevent flash on theme change
      enableColorScheme           // Set color-scheme CSS property
    >
      {children}
    </NextThemesProvider>
  );
}
```

---

## 3. Root Layout

```tsx
// app/layout.tsx
import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Important:** Add `suppressHydrationWarning` to `<html>` and `<body>` to prevent hydration mismatch warnings.

---

## 4. Theme Toggle Component

```tsx
// components/theme-toggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 5. CSS Variables (Tailwind v4)

```css
/* globals.css */
@import "tailwindcss";

/* Enable dark variant */
@custom-variant dark (&:is(.dark *));

/* Light theme (default) */
:root {
  --background: oklch(0.98 0.01 56);
  --foreground: oklch(0.33 0.01 3);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.33 0.01 3);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.33 0.01 3);
  --primary: oklch(0.73 0.16 35);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.96 0.02 29);
  --secondary-foreground: oklch(0.56 0.13 33);
  --muted: oklch(0.97 0.02 39);
  --muted-foreground: oklch(0.55 0.01 58);
  --accent: oklch(0.83 0.11 58);
  --accent-foreground: oklch(0.33 0.01 3);
  --destructive: oklch(0.61 0.21 22);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.93 0.04 39);
  --input: oklch(0.93 0.04 39);
  --ring: oklch(0.73 0.16 35);
  --radius: 0.625rem;
}

/* Dark theme */
.dark {
  --background: oklch(0.26 0.02 352);
  --foreground: oklch(0.94 0.01 51);
  --card: oklch(0.32 0.02 341);
  --card-foreground: oklch(0.94 0.01 51);
  --popover: oklch(0.32 0.02 341);
  --popover-foreground: oklch(0.94 0.01 51);
  --primary: oklch(0.73 0.16 35);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.36 0.02 342);
  --secondary-foreground: oklch(0.94 0.01 51);
  --muted: oklch(0.28 0.02 344);
  --muted-foreground: oklch(0.84 0.02 53);
  --accent: oklch(0.83 0.11 58);
  --accent-foreground: oklch(0.26 0.02 352);
  --destructive: oklch(0.61 0.21 22);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.36 0.02 342);
  --input: oklch(0.36 0.02 342);
  --ring: oklch(0.73 0.16 35);
}
```

---

## 6. Using Theme Colors

### In Tailwind Classes

```tsx
// Uses CSS variables automatically
<div className="bg-background text-foreground">
  <div className="bg-card border-border">
    <p className="text-muted-foreground">Muted text</p>
    <button className="bg-primary text-primary-foreground">
      Primary Button
    </button>
  </div>
</div>
```

### Dark Mode Specific Styles

```tsx
// Override specific styles in dark mode
<Sun className="scale-100 dark:scale-0" />
<Moon className="scale-0 dark:scale-100" />

<div className="bg-white dark:bg-gray-900">
  Different background in dark mode
</div>
```

---

## 7. Accessing Theme in Components

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeAwareComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("system")}>Set System</button>
    </div>
  );
}
```

---

## 8. Theme-Aware Images

```tsx
"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export function Logo() {
  const { resolvedTheme } = useTheme();

  return (
    <Image
      src={resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Logo"
      width={100}
      height={40}
    />
  );
}
```

---

## CSS Variable Reference

| Variable | Usage |
|----------|-------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--card` | Card backgrounds |
| `--card-foreground` | Card text |
| `--popover` | Dropdown/popover backgrounds |
| `--popover-foreground` | Dropdown/popover text |
| `--primary` | Primary brand color |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary backgrounds |
| `--secondary-foreground` | Secondary text |
| `--muted` | Muted backgrounds |
| `--muted-foreground` | Muted/subtle text |
| `--accent` | Accent highlights |
| `--accent-foreground` | Text on accent |
| `--destructive` | Error/danger color |
| `--destructive-foreground` | Text on destructive |
| `--border` | Border color |
| `--input` | Input borders |
| `--ring` | Focus ring color |

---

## Checklist

- [ ] Install `next-themes`
- [ ] Create ThemeProvider in providers.tsx
- [ ] Add `suppressHydrationWarning` to html/body
- [ ] Add `@custom-variant dark` to globals.css
- [ ] Define `:root` and `.dark` CSS variables
- [ ] Create ModeToggle component
- [ ] Add toggle to layout/sidebar
