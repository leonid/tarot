import { z } from 'zod';
import type { Correspondence } from './correspondences';
import type { ProviderStrings } from './strings';
import type { Card, CardMeaning, Deck, PlacedCard, Spread } from './types';

/** Everything an interpreter needs, with ids already resolved. */
export interface ReadingContext {
  question: string;
  deck: Deck;
  spread: Spread;
  placements: readonly PlacedCard[];
  meanings: Readonly<Record<string, CardMeaning>>;
  /** Phrases the deterministic provider writes, in the reading's language. */
  strings: ProviderStrings;
  /** Book T attributions by card id; enables the Compare step. */
  correspondences?: Readonly<Record<string, Correspondence>>;
}

export const interpretationSchema = z.object({
  cards: z.array(
    z.object({
      positionId: z.string(),
      cardId: z.string(),
      note: z.string(),
    }),
  ),
  relations: z.array(z.string()),
  /** The card that most changes the others' meanings (DCAS step 2). */
  hingeCardId: z.string().optional(),
  summary: z.string(),
  advice: z.string(),
});

export type Interpretation = z.infer<typeof interpretationSchema>;

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
