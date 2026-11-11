import { fallbackProvider } from './fallback';
import {
  interpretationSchema,
  type Interpretation,
  type InterpretationProvider,
  type ReadingContext,
} from './interpretation';

/** An interpretation plus which provider actually wrote it. */
export type Interpreted = Interpretation & { source: 'llm' | 'fallback' };

export interface LlmProviderOptions {
  /** Full URL of the proxy's interpret route. */
  url: string;
  /** Injectable for tests. */
  fetch?: typeof fetch;
  timeoutMs?: number;
}

/** The reply must cover exactly the reading's cards, once each. */
function covers(ctx: ReadingContext, reply: Interpretation): boolean {
  if (reply.cards.length !== ctx.placements.length) return false;
  const want = new Set(
    ctx.placements.map((p) => `${p.positionId}|${p.cardId}`),
  );
  return reply.cards.every((c) => want.delete(`${c.positionId}|${c.cardId}`));
}

/**
 * Interpretation by the LLM proxy. Never throws and never returns less than
 * the fallback would: a network error, a non-200 answer, a malformed or
 * mismatched reply all resolve to the deterministic provider's result. The
 * reply is checked here as well as on the proxy; the client does not trust it.
 * No key lives here: the proxy holds it.
 */
export function llmProvider(opts: LlmProviderOptions): InterpretationProvider {
  const doFetch = opts.fetch ?? ((...a) => fetch(...a));
  const fall = async (ctx: ReadingContext): Promise<Interpreted> => ({
    ...(await fallbackProvider.interpret(ctx)),
    source: 'fallback',
  });
  return {
    id: 'llm',
    async interpret(ctx: ReadingContext): Promise<Interpreted> {
      try {
        const res = await doFetch(opts.url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            v: 1,
            question: ctx.question,
            ...(ctx.locale ? { locale: ctx.locale } : {}),
            deckId: ctx.deck.id,
            spreadId: ctx.spread.id,
            placements: ctx.placements,
          }),
          signal: AbortSignal.timeout(opts.timeoutMs ?? 30_000),
        });
        if (!res.ok) return await fall(ctx);
        const parsed = interpretationSchema.safeParse(await res.json());
        if (!parsed.success || !covers(ctx, parsed.data))
          return await fall(ctx);
        const ids = new Set(ctx.placements.map((p) => p.cardId));
        const { hingeCardId, ...rest } = parsed.data;
        return {
          ...rest,
          ...(hingeCardId && ids.has(hingeCardId) ? { hingeCardId } : {}),
          source: 'llm',
        };
      } catch {
        return await fall(ctx);
      }
    },
  };
}
