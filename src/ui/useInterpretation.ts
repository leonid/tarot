import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  Interpretation,
  InterpretationProvider,
  ReadingContext,
} from '../domain/interpretation';

interface Outcome {
  readingKey: string;
  key: string;
  /** null when the provider failed. */
  result: Interpretation | null;
}

/**
 * Runs the provider when the reading itself changes (cards, deck, spread,
 * language) and never because the question was typed in: a changed question
 * marks the result stale and `run` refreshes it. Results are cached by reading
 * and question, so going back to an earlier state costs no provider call.
 *
 * `context` is null and `readingKey` is '' while the spread is incomplete.
 */
export function useInterpretation(
  provider: InterpretationProvider,
  context: ReadingContext | null,
  readingKey: string,
) {
  const key = `${readingKey}\n${context?.question ?? ''}`;
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [busy, setBusy] = useState(false);
  const cache = useRef(new Map<string, Interpretation>());
  const latest = useRef({ context, readingKey, key });
  const seq = useRef(0);

  useEffect(() => {
    latest.current = { context, readingKey, key };
  });

  const start = useCallback(() => {
    const { context: ctx, readingKey: rk, key: k } = latest.current;
    if (!ctx) return;
    const id = ++seq.current;
    const hit = cache.current.get(k);
    // The provider is called inside the chain so a synchronous throw is a
    // failure like any other.
    Promise.resolve()
      .then(() => hit ?? provider.interpret(ctx))
      .then(
        (result) => {
          cache.current.set(k, result);
          return result;
        },
        () => null,
      )
      .then((result) => {
        if (seq.current !== id) return;
        setOutcome({ readingKey: rk, key: k, result });
        setBusy(false);
      });
  }, [provider]);

  useEffect(() => {
    if (readingKey) start();
  }, [readingKey, start]);

  const run = useCallback(() => {
    setBusy(true);
    start();
  }, [start]);

  const current =
    readingKey && outcome?.readingKey === readingKey ? outcome : null;
  return {
    result: current?.result ?? null,
    failed: current !== null && current.result === null,
    loading: readingKey !== '' && (current === null || busy),
    /** The shown result was made for a different question. */
    stale: current !== null && current.key !== key,
    run,
  };
}
