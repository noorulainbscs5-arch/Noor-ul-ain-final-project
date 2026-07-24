'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  percentage: number;
  grade: { label: string; color: string };
}

export function ScoreBadge({ percentage, grade }: ScoreBadgeProps) {
  const [display, setDisplay] = React.useState(0);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;

  React.useEffect(() => {
    const start = performance.now();
    const duration = 1000;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * percentage));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percentage]);

  const color =
    percentage >= 80
      ? 'hsl(var(--success))'
      : percentage >= 50
      ? 'hsl(var(--primary))'
      : 'hsl(var(--error))';

  return (
    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
      <svg
        className="h-36 w-36 -rotate-90"
        viewBox="0 0 128 128"
        aria-hidden="true"
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="animate-pop-in text-3xl font-bold tabular-nums">
          {display}
          <span className="text-lg">%</span>
        </span>
        <span className={cn('text-[10px] font-semibold uppercase tracking-wide', grade.color)}>
          {grade.label}
        </span>
      </div>
    </div>
  );
}
