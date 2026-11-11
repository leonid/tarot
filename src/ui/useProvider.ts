import { useMemo } from 'react';
import { fallbackProvider } from '../domain/fallback';
import type { InterpretationProvider } from '../domain/interpretation';
import { llmProvider } from '../domain/llmProvider';
import { useReadingStore } from '../features/store';

/** URL of the LLM proxy, set at build time. Absent: the AI option is hidden. */
export function proxyUrl(): string | undefined {
  const url = import.meta.env.VITE_PROXY_URL;
  return typeof url === 'string' && url ? url : undefined;
}

/** The AI provider only when the reader opted in and a proxy is configured. */
export function useProvider(): InterpretationProvider {
  const useAi = useReadingStore((s) => s.useAi);
  const url = proxyUrl();
  return useMemo(
    () => (useAi && url ? llmProvider({ url }) : fallbackProvider),
    [useAi, url],
  );
}
