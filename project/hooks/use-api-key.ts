'use client';

import * as React from 'react';
import type { ApiKeyConfig, ApiProvider } from '@/lib/types';

const STORAGE_KEY = 'prepiq.apiKey';

function readConfig(): ApiKeyConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApiKeyConfig;
    if (parsed && (parsed.provider === 'gemini' || parsed.provider === 'openai') && parsed.key) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeConfig(config: ApiKeyConfig | null) {
  if (typeof window === 'undefined') return;
  try {
    if (config) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function useApiKey() {
  const [config, setConfig] = React.useState<ApiKeyConfig | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setConfig(readConfig());
    setLoaded(true);
  }, []);

  const save = React.useCallback((provider: ApiProvider, key: string) => {
    const next = { provider, key: key.trim() };
    writeConfig(next);
    setConfig(next);
  }, []);

  const clear = React.useCallback(() => {
    writeConfig(null);
    setConfig(null);
  }, []);

  return { config, loaded, save, clear };
}
