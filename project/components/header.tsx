'use client';

import * as React from 'react';
import {
  Brain,
  KeyRound,
  Sparkles,
  ShieldCheck,
  Trash2,
  Check,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { ThemeToggle } from '@/components/theme-toggle';
import { useApiKey } from '@/hooks/use-api-key';
import type { ApiProvider } from '@/lib/types';
import { cn } from '@/lib/utils';

const PROVIDER_INFO: Record<
  ApiProvider,
  { label: string; keyUrl: string; placeholder: string }
> = {
  gemini: {
    label: 'Google Gemini',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIza…',
  },
  openai: {
    label: 'OpenAI',
    keyUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-…',
  },
};

export function Header() {
  const { config, loaded, save, clear } = useApiKey();
  const [open, setOpen] = React.useState(false);
  const [provider, setProvider] = React.useState<ApiProvider>('gemini');
  const [keyInput, setKeyInput] = React.useState('');
  const [justSaved, setJustSaved] = React.useState(false);

  React.useEffect(() => {
    if (config) {
      setProvider(config.provider);
      setKeyInput(config.key);
    } else {
      setKeyInput('');
    }
  }, [config]);

  function handleSave() {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    save(provider, trimmed);
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setOpen(false);
    }, 700);
  }

  function handleClear() {
    clear();
    setKeyInput('');
  }

  const hasKey = !!config?.key;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary/30">
            <Brain className="h-5 w-5 text-white" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                Prep<span className="text-primary">IQ</span>
              </span>
              <Badge
                variant="secondary"
                className="hidden bg-accent/80 text-accent-foreground sm:inline-flex"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                AI Study Companion
              </Badge>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Turn notes into instant quizzes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant={hasKey ? 'outline' : 'default'}
                size="sm"
                className={cn(
                  'gap-2 rounded-full',
                  hasKey &&
                    'border-success/40 text-success hover:bg-success/10'
                )}
              >
                <KeyRound className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {loaded && hasKey ? 'API Key Set' : 'Enter API Key'}
                </span>
                <span className="sm:hidden">API</span>
                {hasKey && <Check className="h-3.5 w-3.5 text-success" />}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  API Key Settings
                </DialogTitle>
                <DialogDescription>
                  Optionally connect your own AI key for smarter quizzes and a
                  deeper tutor. Without a key the app runs in demo mode with
                  built-in quizzes.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <RadioGroup
                    value={provider}
                    onValueChange={(v) => setProvider(v as ApiProvider)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {(Object.keys(PROVIDER_INFO) as ApiProvider[]).map((p) => (
                      <label
                        key={p}
                        htmlFor={`prov-${p}`}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors',
                          provider === p
                            ? 'border-primary bg-accent/60 text-accent-foreground'
                            : 'border-border hover:bg-accent/30'
                        )}
                      >
                        <RadioGroupItem value={p} id={`prov-${p}`} />
                        <span className="font-medium">
                          {PROVIDER_INFO[p].label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key-input">API Key</Label>
                  <Input
                    id="api-key-input"
                    type="password"
                    autoComplete="off"
                    placeholder={PROVIDER_INFO[provider].placeholder}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                  />
                  <a
                    href={PROVIDER_INFO[provider].keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Get a {PROVIDER_INFO[provider].label} key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>
                    Your key is stored only in this browser&apos;s
                    localStorage and sent directly to {PROVIDER_INFO[provider].label}.
                    It never touches PrepIQ servers.
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                {hasKey && (
                  <Button
                    variant="ghost"
                    onClick={handleClear}
                    className="mr-auto gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove key
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={!keyInput.trim() || justSaved}
                  className="gap-2"
                >
                  {justSaved ? (
                    <>
                      <Check className="h-4 w-4" /> Saved
                    </>
                  ) : (
                    'Save key'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
