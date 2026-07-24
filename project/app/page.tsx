'use client';

import * as React from 'react';
import { Bot, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { StudyInputPanel } from '@/components/study-input-panel';
import { QuizView } from '@/components/quiz-view';
import { TutorPanel } from '@/components/tutor-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateQuiz } from '@/lib/ai-quiz';
import { askTutor } from '@/lib/ai-tutor';
import type {
  ChatMessage,
  Difficulty,
  Quiz,
  QuizLength,
  QuizResult,
} from '@/lib/types';
import { useApiKey } from '@/hooks/use-api-key';

export default function Home() {
  // Study input state
  const [notes, setNotes] = React.useState('');
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
  const [count, setCount] = React.useState<QuizLength>(5);

  // Generation / quiz state
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [genError, setGenError] = React.useState<string | null>(null);

  // Tutor state
  const [tutorOpen, setTutorOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = React.useState(false);

  const { config } = useApiKey();

  const hasNotes = notes.trim().length > 0;
  const notesHint =
    notes.trim().length > 0
      ? `${notes.trim().split(/\s+/).filter(Boolean).slice(0, 6).join(' ')}…`
      : 'No notes yet';

  async function handleGenerate() {
    if (notes.trim().length <= 30) return;
    setIsGenerating(true);
    setGenError(null);
    setQuiz(null);

    try {
      const result = await generateQuiz({
        notes: notes.trim(),
        difficulty,
        count,
        apiKeyConfig: config,
      });
      setQuiz(result);
      toast.success(
        result.source === 'ai'
          ? 'Quiz generated with AI!'
          : 'Quiz generated in demo mode',
        {
          description:
            result.source === 'ai'
              ? undefined
              : 'Add an API key for AI-powered questions.',
        }
      );
      // scroll to quiz area
      setTimeout(() => {
        document
          .getElementById('quiz-area')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong.';
      setGenError(msg);
      // Fallback to mock so the app always works
      try {
        const fallback = await generateQuiz({
          notes: notes.trim(),
          difficulty,
          count,
          apiKeyConfig: null, // force mock
        });
        setQuiz(fallback);
        toast.error('AI request failed — using demo quiz instead', {
          description: msg.slice(0, 120),
        });
      } catch {
        toast.error('Could not generate a quiz', {
          description: msg.slice(0, 120),
        });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSubmitQuiz(answers: (number | null)[]): QuizResult {
    if (!quiz) {
      return { total: 0, correct: 0, percentage: 0, perQuestion: [] };
    }
    const perQuestion = quiz.questions.map((q, i) => {
      const selected = answers[i] ?? null;
      return {
        questionId: q.id,
        selected,
        correct: selected !== null && selected === q.correctIndex,
      };
    });
    const correct = perQuestion.filter((p) => p.correct).length;
    const total = quiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    const result: QuizResult = { total, correct, percentage, perQuestion };
    return result;
  }

  function handleRetake() {
    setQuiz(null);
    setTimeout(() => {
      document
        .getElementById('study-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  async function handleAskTutor(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTutorOpen(true);
    setIsThinking(true);

    try {
      const reply = await askTutor({
        question: text.trim(),
        notes: notes.trim() || '(no notes provided yet)',
        history: messages,
        apiKeyConfig: config,
      });
      const tutorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'tutor',
        content: reply,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Tutor error';
      // fallback to mock tutor
      const reply = await askTutor({
        question: text.trim(),
        notes: notes.trim() || '(no notes provided yet)',
        history: messages,
        apiKeyConfig: null,
      });
      const tutorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'tutor',
        content: reply,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, tutorMsg]);
      toast.error('AI tutor unavailable — using demo tutor', {
        description: msg.slice(0, 120),
      });
    } finally {
      setIsThinking(false);
    }
  }

  function handleClearChat() {
    setMessages([]);
  }

  function handleAskTutorFromQuiz(prompt: string) {
    handleAskTutor(prompt);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Study input */}
          <div id="study-panel" className="lg:col-span-2">
            <StudyInputPanel
              notes={notes}
              onNotesChange={setNotes}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              count={count}
              onCountChange={setCount}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />

            {/* Tutor launcher card */}
            <Card className="mt-6 overflow-hidden border-border/60 bg-gradient-to-br from-accent/60 to-background shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary/25">
                  <Bot className="h-6 w-6 text-white" strokeWidth={2.2} />
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold leading-tight">
                    Ask PrepIQ Tutor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ask follow-up questions about your notes
                  </p>
                </div>
                <Button
                  onClick={() => setTutorOpen(true)}
                  className="shrink-0 gap-2 rounded-xl bg-brand-gradient shadow-md shadow-primary/25"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Open tutor</span>
                  <span className="sm:hidden">Ask</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quiz area */}
          <div id="quiz-area" className="lg:col-span-3">
            {!quiz && !isGenerating && (
              <EmptyState hasError={!!genError} error={genError} />
            )}

            {isGenerating && <GeneratingState count={count} />}

            {quiz && !isGenerating && (
              <QuizView
                quiz={quiz}
                onSubmit={handleSubmitQuiz}
                onRetake={handleRetake}
                onAskTutor={handleAskTutorFromQuiz}
              />
            )}
          </div>
        </div>
      </main>

      {/* Floating tutor button on mobile */}
      <Button
        onClick={() => setTutorOpen(true)}
        className="fixed bottom-5 right-5 z-30 gap-2 rounded-full bg-brand-gradient shadow-xl shadow-primary/30 sm:hidden"
        size="lg"
      >
        <Bot className="h-5 w-5" />
        Tutor
      </Button>

      <TutorPanel
        open={tutorOpen}
        onOpenChange={setTutorOpen}
        messages={messages}
        onSend={handleAskTutor}
        onClear={handleClearChat}
        isThinking={isThinking}
        hasNotes={hasNotes}
        notesHint={notesHint}
      />
    </div>
  );
}

function EmptyState({
  hasError,
  error,
}: {
  hasError: boolean;
  error: string | null;
}) {
  return (
    <Card className="flex min-h-[420px] flex-col items-center justify-center border-dashed border-border/60 bg-muted/20 text-center shadow-sm">
      <CardContent className="max-w-sm p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
          <Sparkles className="h-8 w-8 text-accent-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Your quiz will appear here</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Paste your study notes on the left, pick a difficulty and length,
          then hit <span className="font-medium text-foreground">Generate Quiz</span>.
        </p>

        {hasError && error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-left text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            No API key needed
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            Works in demo mode
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function GeneratingState({ count }: { count: number }) {
  return (
    <Card className="flex min-h-[420px] flex-col items-center justify-center border-border/60 text-center shadow-sm">
      <CardContent className="p-8">
        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg shadow-primary/30">
            <Sparkles className="h-8 w-8 animate-pulse text-white" />
          </span>
        </div>
        <h3 className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
 Generating your quiz
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Crafting {count} multiple-choice questions from your notes...
        </p>

        <div className="mt-5 space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
