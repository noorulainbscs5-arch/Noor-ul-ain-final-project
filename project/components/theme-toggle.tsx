'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="relative overflow-hidden rounded-full border border-border/60"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
          mounted && isDark
            ? '-rotate-90 scale-0'
            : 'rotate-0 scale-100'
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
          mounted && isDark
            ? 'rotate-0 scale-100'
            : 'rotate-90 scale-0'
        }`}
      />
    </Button>
  );
}
