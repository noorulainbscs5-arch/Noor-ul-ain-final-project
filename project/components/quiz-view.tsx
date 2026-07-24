'use client';

import * as React from 'react';
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Rows3,
  Send,
  RotateCcw,
  Trophy,
  Lightbulb,
  Download,
  Copy,
  FileText,
  Sparkles,
  Bot,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Quiz, QuizResult } from '@/lib/types';
import { LETTERS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScoreBadge } from '@/components/score-badge';
import {
  copyToClipboard,
  downloadFile,
  quizToMarkdown,
  quizToPlainText,
} from '@/lib/export';
import { toast } from 'sonner';

interface QuizViewProps {
  quiz: Quiz;
  onSubmit: (answers: (number | null)[]) => QuizResult;
  onRetake: () => void;
  onAskTutor: (prompt: string) => void;
}

type ViewMode = 'one' | 'all';

export function QuizView({ quiz, onSubmit, onRetake, onAskTutor }: QuizViewProps) {
  const [mode, setMode] = React.useState<ViewMode>('one');
  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | null)[]>(
    () => quiz.questions.map(() => null)
  );
  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [confirmSubmit, setConfirmSubmit] = React.useState(false);

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === quiz.questions.length;

  function selectAnswer(qIndex: number, optionIndex: number) {
    if (result) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }

  function handleSubmit() {
    const r = onSubmit(answers);
    setResult(r);
    setConfirmSubmit(false);
    // scroll to top so the score badge is visible
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleRetake() {
    setAnswers(quiz.questions.map(() => null));
    setResult(null);
    setCurrent(0);
  }

  async function handleCopy() {
    const ok = await copyToClipboard(quizToMarkdown(quiz, result ?? undefined));
    if (ok) toast.success('Quiz copied to clipboard');
    else toast.error('Could not copy to clipboard');
  }

  function handleDownloadMarkdown() {
    downloadFile(
      `${quiz.topic.toLowerCase().replace(/\s+/g, '-')}-quiz.md`,
      quizToMarkdown(quiz, result ?? undefined),
      'text/markdown'
    );
    toast.success('Markdown file downloaded');
  }

  function handleDownloadText() {
    downloadFile(
      `${quiz.topic.toLowerCase().replace(/\s+/g, '-')}-quiz.txt`,
      quizToPlainText(quiz, result ?? undefined),
      'text/plain'
    );
    toast.success('Text file downloaded');
  }

  if (result) {
    return (
      <ResultsView
        quiz={quiz}
        result={result}
        onRetake={handleRetake}
        onCopy={handleCopy}
        onDownloadMarkdown={handleDownloadMarkdown}
        onDownloadText={handleDownloadText}
        onAskTutor={onAskTutor}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <Card className="overflow-hidden border-border/60">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold leading-tight">
                  {quiz.title}
                </h2>
                <Badge variant="secondary" className="capitalize">
                  {quiz.difficulty}
                </Badge>
                {quiz.source === 'mock' && (
                  <Badge
                    variant="outline"
                    className="border-warning/40 text-warning"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Demo
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {quiz.topic} · {quiz.questions.length} questions
              </p>
            </div>

            <TooltipProvider delayDuration={200}>
              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as ViewMode)}
              >
                <TabsList className="h-9">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value="one" className="gap-1.5">
                        <ListChecks className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">One by one</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Question-by-question</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value="all" className="gap-1.5">
                        <Rows3 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">All at once</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Scrollable list</TooltipContent>
                  </Tooltip>
                </TabsList>
              </Tabs>
            </TooltipProvider>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {answeredCount} of {quiz.questions.length} answered
              </span>
              <span className="tabular-nums">
                {Math.round((answeredCount / quiz.questions.length) * 100)}%
              </span>
            </div>
            <Progress
              value={(answeredCount / quiz.questions.length) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {mode === 'one' ? (
        <OneByOne
          quiz={quiz}
          current={current}
          answers={answers}
          onSelect={selectAnswer}
          onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
          onNext={() =>
            setCurrent((c) => Math.min(quiz.questions.length - 1, c + 1))
          }
          onJump={(i) => setCurrent(i)}
          onSubmit={() => setConfirmSubmit(true)}
          allAnswered={allAnswered}
        />
      ) : (
        <AllAtOnce
          quiz={quiz}
          answers={answers}
          onSelect={selectAnswer}
          onSubmit={() => setConfirmSubmit(true)}
          allAnswered={allAnswered}
        />
      )}

      {/* Confirm submit dialog */}
      <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit quiz?
            </DialogTitle>
            <DialogDescription>
              {allAnswered
                ? `You've answered all ${quiz.questions.length} questions. Your score will be calculated instantly.`
                : `You've answered ${answeredCount} of ${quiz.questions.length} questions. Unanswered questions count as incorrect.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmSubmit(false)}>
              Keep going
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Submit & score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- One by one ---------------- */

interface OneByOneProps {
  quiz: Quiz;
  current: number;
  answers: (number | null)[];
  onSelect: (q: number, o: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
  onSubmit: () => void;
  allAnswered: boolean;
}

function OneByOne({
  quiz,
  current,
  answers,
  onSelect,
  onPrev,
  onNext,
  onJump,
  onSubmit,
  allAnswered,
}: OneByOneProps) {
  const q = quiz.questions[current];
  const selected = answers[current];
  const isLast = current === quiz.questions.length - 1;

  return (
    <div className="space-y-4">
      <Card
        key={current}
        className="animate-float-up overflow-hidden border-border/60 shadow-sm"
      >
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="secondary" className="rounded-full">
              Question {current + 1} of {quiz.questions.length}
            </Badge>
            {selected !== null && (
              <Badge
                variant="outline"
                className="border-success/40 text-success"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Answered
              </Badge>
            )}
          </div>

          <h3 className="text-balance text-lg font-semibold leading-snug">
            {q.question}
          </h3>

          <div className="mt-4 grid gap-2.5">
            {q.options.map((opt, oi) => {
              const isSel = selected === oi;
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => onSelect(current, oi)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                    isSel
                      ? 'border-primary bg-accent shadow-sm'
                      : 'border-border/60 bg-background hover:border-primary/40 hover:bg-accent/40'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors',
                      isSel
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-accent-foreground/10'
                    )}
                  >
                    {LETTERS[oi]}
                  </span>
                  <span className="text-sm leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={current === 0}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Question dots */}
        <div className="hidden flex-wrap items-center justify-center gap-1.5 sm:flex">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-all',
                i === current
                  ? 'scale-125 bg-primary'
                  : answers[i] !== null
                  ? 'bg-primary/50'
                  : 'bg-muted-foreground/25'
              )}
              aria-label={`Go to question ${i + 1}`}
            />
          ))}
        </div>

        {isLast ? (
          <Button onClick={onSubmit} className="gap-2">
            <Send className="h-4 w-4" />
            Submit
          </Button>
        ) : (
          <Button onClick={onNext} className="gap-1.5">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------------- All at once ---------------- */

interface AllAtOnceProps {
  quiz: Quiz;
  answers: (number | null)[];
  onSelect: (q: number, o: number) => void;
  onSubmit: () => void;
  allAnswered: boolean;
}

function AllAtOnce({
  quiz,
  answers,
  onSelect,
  onSubmit,
  allAnswered,
}: AllAtOnceProps) {
  return (
    <div className="space-y-4">
      {quiz.questions.map((q, qi) => {
        const selected = answers[qi];
        return (
          <Card
            key={q.id}
            className="animate-float-up overflow-hidden border-border/60 shadow-sm"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {qi + 1}
                </span>
                <h3 className="text-balance pt-1 text-base font-semibold leading-snug">
                  {q.question}
                </h3>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const isSel = selected === oi;
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => onSelect(qi, oi)}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                        isSel
                          ? 'border-primary bg-accent shadow-sm'
                          : 'border-border/60 bg-background hover:border-primary/40 hover:bg-accent/40'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                          isSel
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground group-hover:bg-accent-foreground/10'
                        )}
                      >
                        {LETTERS[oi]}
                      </span>
                      <span className="text-sm leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button
        onClick={onSubmit}
        size="lg"
        className="w-full gap-2 rounded-xl bg-brand-gradient font-semibold shadow-lg shadow-primary/25"
      >
        <Send className="h-5 w-5" />
        Submit Quiz ·{' '}
        {answers.filter((a) => a !== null).length}/{quiz.questions.length} answered
      </Button>
    </div>
  );
}

/* ---------------- Results ---------------- */

interface ResultsViewProps {
  quiz: Quiz;
  result: QuizResult;
  onRetake: () => void;
  onCopy: () => void;
  onDownloadMarkdown: () => void;
  onDownloadText: () => void;
  onAskTutor: (prompt: string) => void;
}

function ResultsView({
  quiz,
  result,
  onRetake,
  onCopy,
  onDownloadMarkdown,
  onDownloadText,
  onAskTutor,
}: ResultsViewProps) {
  const grade = getGrade(result.percentage);

  return (
    <div className="space-y-5">
      {/* Score hero */}
      <Card className="animate-float-up overflow-hidden border-border/60">
        <CardContent className="flex flex-col items-center gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-8">
          <ScoreBadge percentage={result.percentage} grade={grade} />

          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <Trophy
                className={cn(
                  'h-6 w-6',
                  result.percentage >= 80
                    ? 'text-warning'
                    : result.percentage >= 50
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              />
              <h2 className="text-2xl font-bold tracking-tight">
                {grade.label}
              </h2>
            </div>
            <p className="mt-1 text-muted-foreground">
              You scored{' '}
              <span className="font-semibold text-foreground">
                {result.correct}
              </span>{' '}
              out of{' '}
              <span className="font-semibold text-foreground">
                {result.total}
              </span>{' '}
              on the {quiz.topic} quiz.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <Button onClick={onRetake} variant="default" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake quiz
              </Button>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={onCopy} variant="outline" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy quiz as Markdown</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onDownloadMarkdown}
                      variant="outline"
                      size="icon"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download as Markdown</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onDownloadText}
                      variant="outline"
                      size="icon"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download as text</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-question review */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-warning" />
          Review & explanations
        </h3>

        {quiz.questions.map((q, qi) => {
          const sel = result.perQuestion.find((p) => p.questionId === q.id);
          const selected = sel?.selected ?? null;
          const isCorrect = sel?.correct ?? false;
          return (
            <Card
              key={q.id}
              className="animate-float-up overflow-hidden border-border/60 shadow-sm"
              style={{ animationDelay: `${qi * 60}ms` }}
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      isCorrect
                        ? 'bg-success/15 text-success'
                        : 'bg-error/15 text-error'
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-balance font-semibold leading-snug">
                      {qi + 1}. {q.question}
                    </h4>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => {
                        const isCorrectOpt = oi === q.correctIndex;
                        const isSelOpt = selected === oi;
                        return (
                          <div
                            key={oi}
                            className={cn(
                              'flex items-center gap-2.5 rounded-lg border p-2.5 text-sm',
                              isCorrectOpt
                                ? 'border-success/50 bg-success/10'
                                : isSelOpt
                                ? 'border-error/50 bg-error/10'
                                : 'border-border/60 bg-background'
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                                isCorrectOpt
                                  ? 'bg-success text-white'
                                  : isSelOpt
                                  ? 'bg-error text-white'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {LETTERS[oi]}
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                            {isCorrectOpt && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                            )}
                            {isSelOpt && !isCorrectOpt && (
                              <XCircle className="h-4 w-4 shrink-0 text-error" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent/50 p-3">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-accent-foreground">
                          Why this is correct
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
                          {q.explanation}
                        </p>
                        <button
                          onClick={() =>
                            onAskTutor(
                              `Explain question ${qi + 1} in more detail: "${q.question}"`
                            )
                          }
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <Bot className="h-3.5 w-3.5" />
                          Ask tutor for more detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function getGrade(pct: number): { label: string; color: string } {
  if (pct >= 90) return { label: 'Outstanding!', color: 'text-success' };
  if (pct >= 80) return { label: 'Great work!', color: 'text-success' };
  if (pct >= 70) return { label: 'Good job!', color: 'text-primary' };
  if (pct >= 50) return { label: 'Keep practicing', color: 'text-warning' };
  return { label: 'Review & retry', color: 'text-error' };
}
