'use client';

import * as React from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  MessageSquarePlus,
  Lightbulb,
  Loader2,
  PanelRightClose,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TutorPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClear: () => void;
  isThinking: boolean;
  hasNotes: boolean;
  notesHint: string;
}

const SUGGESTIONS = [
  'Summarize my notes in 5 bullet points',
  'What are the key terms I should memorize?',
  'Explain the hardest concept simply',
  'Give me a quick analogy for the main idea',
];

export function TutorPanel({
  open,
  onOpenChange,
  messages,
  onSend,
  onClear,
  isThinking,
  hasNotes,
  notesHint,
}: TutorPanelProps) {
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, open]);

  function handleSend() {
    const text = input.trim();
    if (!text || isThinking) return;
    onSend(text);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary/25">
                <Bot className="h-5 w-5 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <SheetTitle className="flex items-center gap-2 text-base">
                  Ask PrepIQ Tutor
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {hasNotes
                    ? `Reading: ${notesHint}`
                    : 'Add notes so I can answer from them'}
                </SheetDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-5" >
          <div ref={scrollRef} className="space-y-4 py-4">
            {messages.length === 0 && !isThinking && (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                  <Lightbulb className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">Ask me anything about your notes</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    I&apos;ll explain concepts, compare ideas, and give examples
                    grounded in your study material.
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() => onSend(s)}
                      disabled={!hasNotes}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {isThinking && (
              <div className="flex items-start gap-2.5">
                <Avatar role="tutor" />
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Tutor is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border/60 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Press Enter to send · Shift+Enter for new line
            </span>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
                onClick={onClear}
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                Clear chat
              </Button>
            )}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasNotes
                  ? 'Ask about your notes...'
                  : 'Paste notes first, then ask away...'
              }
              className="min-h-[44px] max-h-32 resize-none border-border/60 bg-muted/20"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl bg-brand-gradient shadow-md shadow-primary/25"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 animate-float-up',
        isUser && 'flex-row-reverse'
      )}
    >
      <Avatar role={message.role} />
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted text-foreground'
        )}
      >
        <FormattedContent content={message.content} />
      </div>
    </div>
  );
}

function Avatar({ role }: { role: 'user' | 'tutor' }) {
  if (role === 'user') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient shadow-sm">
      <Sparkles className="h-4 w-4 text-white" />
    </div>
  );
}

// Lightweight markdown-ish formatter: bold **x**, bullet lines, numbered lines.
function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const bullet = /^\s*[-•]\s+/.test(line);
        const numbered = /^\s*\d+\.\s+/.test(line);
        const cleaned = line.replace(/^\s*[-•]\s+/, '').replace(/^\s*\d+\.\s+/, '');
        const parts = renderInlineBold(cleaned);
        if (bullet) {
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
              <span>{parts}</span>
            </div>
          );
        }
        if (numbered) {
          const num = line.match(/^\s*(\d+)\./)?.[1] ?? '';
          return (
            <div key={i} className="flex gap-2">
              <span className="shrink-0 font-semibold opacity-70">{num}.</span>
              <span>{parts}</span>
            </div>
          );
        }
        return <p key={i}>{parts}</p>;
      })}
    </div>
  );
}

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}
