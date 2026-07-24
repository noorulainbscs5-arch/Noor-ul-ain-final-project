'use client';

import { Brain, Zap, Target, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  { icon: Zap, label: 'Instant quizzes from your notes' },
  { icon: Target, label: 'Detailed explanations for every question' },
  { icon: MessageSquareText, label: 'Ask a tutor about anything' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 bg-mesh dark:bg-mesh-dark" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-blob rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-32 h-72 w-72 animate-blob rounded-full bg-chart-5/15 blur-3xl [animation-delay:3s]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20 lg:px-8 lg:pb-16 lg:pt-24">
        <Badge
          variant="outline"
          className="mx-auto mb-5 gap-1.5 rounded-full border-primary/30 bg-background/70 py-1.5 text-xs backdrop-blur"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary" />
          AI-powered study companion
        </Badge>

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Turn your notes into{' '}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            instant quizzes
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Paste your lecture notes, slides, or textbook summaries. PrepIQ
          generates a personalized multiple-choice quiz, scores it instantly,
          and explains every answer — with an AI tutor on standby.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <f.icon className="h-4 w-4 text-primary" />
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
