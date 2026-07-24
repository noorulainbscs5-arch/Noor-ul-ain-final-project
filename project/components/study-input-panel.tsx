'use client';

import * as React from 'react';
import {
  FileText,
  Sparkles,
  Wand2,
  Gauge,
  ListOrdered,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DIFFICULTY_DESCRIPTIONS,
  DIFFICULTY_LABELS,
  type Difficulty,
  type QuizLength,
} from '@/lib/types';
import { SAMPLE_NOTES } from '@/lib/sample-notes';

interface StudyInputPanelProps {
  notes: string;
  onNotesChange: (v: string) => void;
  difficulty: Difficulty;
  onDifficultyChange: (v: Difficulty) => void;
  count: QuizLength;
  onCountChange: (v: QuizLength) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const LENGTHS: QuizLength[] = [3, 5, 10];

export function StudyInputPanel({
  notes,
  onNotesChange,
  difficulty,
  onDifficultyChange,
  count,
  onCountChange,
  onGenerate,
  isGenerating,
  disabled,
}: StudyInputPanelProps) {
  const charCount = notes.length;
  const wordCount = notes.trim()
    ? notes.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const canGenerate = notes.trim().length > 30 && !isGenerating && !disabled;

  function loadSample(content: string) {
    onNotesChange(content);
  }

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Study Material
              </h2>
              <p className="text-xs text-muted-foreground">
                Paste what you want to be quizzed on
              </p>
            </div>
          </div>
          <span
            className={cn(
              'text-xs tabular-nums transition-colors',
              charCount > 30 ? 'text-muted-foreground' : 'text-muted-foreground/60'
            )}
          >
            {wordCount} words · {charCount} chars
          </span>
        </div>

        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Paste your lecture notes, slides text, or textbook summaries here..."
          className="min-h-[180px] resize-y border-border/60 bg-muted/20 text-sm leading-relaxed focus-visible:bg-background"
        />

        {/* Sample notes */}
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5" />
            Quick-load sample notes
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_NOTES.map((s) => (
              <Button
                key={s.id}
                variant="outline"
                size="sm"
                onClick={() => loadSample(s.content)}
                className="gap-2 rounded-full border-border/60 bg-background text-xs hover:border-primary/50 hover:bg-accent/40"
              >
                <span className="text-sm leading-none">{s.emoji}</span>
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Difficulty + length */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" />
              Difficulty level
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDifficultyChange(d)}
                  className={cn(
                    'rounded-lg border px-2 py-2.5 text-center transition-all',
                    difficulty === d
                      ? d === 'easy'
                        ? 'border-success/60 bg-success/10 text-success'
                        : d === 'medium'
                        ? 'border-warning/60 bg-warning/10 text-warning'
                        : 'border-error/60 bg-error/10 text-error'
                      : 'border-border/60 bg-background hover:bg-accent/30'
                  )}
                >
                  <div className="text-sm font-semibold">
                    {DIFFICULTY_LABELS[d]}
                  </div>
                  <div className="mt-0.5 hidden text-[10px] leading-tight text-muted-foreground sm:block">
                    {DIFFICULTY_DESCRIPTIONS[d]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ListOrdered className="h-3.5 w-3.5" />
              Quiz length
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onCountChange(n)}
                  className={cn(
                    'rounded-lg border px-2 py-2.5 text-center transition-all',
                    count === n
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border/60 bg-background hover:bg-accent/30'
                  )}
                >
                  <div className="text-lg font-bold leading-none">{n}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    questions
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate */}
        <Button
          onClick={onGenerate}
          disabled={!canGenerate}
          size="lg"
          className="mt-5 w-full gap-2 rounded-xl bg-brand-gradient text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:shadow-none"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 animate-pulse" />
              Generating your quiz...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              Generate Quiz
            </>
          )}
        </Button>
        {!canGenerate && !isGenerating && notes.trim().length <= 30 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Paste at least a few sentences, or load a sample above, to enable
            generation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
