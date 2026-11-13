import type { Correspondence } from './correspondences';
import type { ProviderStrings } from './strings';
import type { Card, CardMeaning, Deck, PlacedCard, Spread } from './types';

/** Everything an interpreter needs, with ids already resolved. */
export interface ReadingContext {
  question: string;
  /** Language code of the reading's text, sent to the LLM proxy. */
  locale?: string;
  deck: Deck;
  spread: Spread;
  placements: readonly PlacedCard[];
  meanings: Readonly<Record<string, CardMeaning>>;
  /** Phrases the deterministic provider writes, in the reading's language. */
  strings: ProviderStrings;
  /** Book T attributions by card id; enables the Compare step. */
  correspondences?: Readonly<Record<string, Correspondence>>;
}

export interface Interpretation {
  cards: { positionId: string; cardId: string; note: string }[];
  relations: string[];
  /** The card that most changes the others' meanings (DCAS step 2). */
  hingeCardId?: string | undefined;
  summary: string;
  advice: string;
}

const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

/**
 * Checks an untrusted reply and returns a clean copy (unknown fields dropped),
 * or undefined. Plain code, so the first download carries no schema library;
 * interpretationSchema.ts holds the same rules as a schema (the proxy builds
 * its output format from it) and a test keeps the two in step.
 */
export function parseInterpretation(x: unknown): Interpretation | undefined {
  if (!isObject(x)) return undefined;
  const { cards, relations, hingeCardId, summary, advice } = x;
  if (!Array.isArray(cards) || !Array.isArray(relations)) return undefined;
  if (typeof summary !== 'string' || typeof advice !== 'string')
    return undefined;
  if (hingeCardId !== undefined && typeof hingeCardId !== 'string')
    return undefined;
  const notes: Interpretation['cards'] = [];
  for (const c of cards) {
    if (!isObject(c)) return undefined;
    const { positionId, cardId, note } = c;
    if (
      typeof positionId !== 'string' ||
      typeof cardId !== 'string' ||
      typeof note !== 'string'
    )
      return undefined;
    notes.push({ positionId, cardId, note });
  }
  if (!relations.every((r): r is string => typeof r === 'string'))
    return undefined;
  return {
    cards: notes,
    relations,
    ...(hingeCardId === undefined ? {} : { hingeCardId }),
    summary,
    advice,
  };
}

/**
 * Pluggable interpreter. Implementations: the deterministic fallback
 * (src/domain/fallback.ts) and, later, an LLM provider behind a proxy.
 */
export interface InterpretationProvider {
  readonly id: string;
  interpret(context: ReadingContext): Promise<Interpretation>;
}

export function findCard(deck: Deck, cardId: string): Card | undefined {
  return deck.cards.find((c) => c.id === cardId);
}
