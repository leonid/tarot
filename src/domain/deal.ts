import type { Deck, Orientation, PlacedCard, Reading, Spread } from './types';
import { createRng, shuffle } from './rng';

export interface DealOptions {
  question: string;
  deck: Deck;
  spread: Spread;
  seed: number;
  allowReversals: boolean;
}

/** Simulate mode: shuffle the deck and deal one card per spread position. */
export function deal({
  question,
  deck,
  spread,
  seed,
  allowReversals,
}: DealOptions): Reading {
  if (spread.positions.length > deck.cards.length) {
    throw new Error(`Spread "${spread.id}" needs more cards than the deck has`);
  }
  const rng = createRng(seed);
  const shuffled = shuffle(deck.cards, rng);
  const placements: PlacedCard[] = spread.positions.map((position, i) => {
    const orientation: Orientation =
      allowReversals && rng() < 0.5 ? 'reversed' : 'upright';
    return {
      positionId: position.id,
      cardId: (shuffled[i] as (typeof shuffled)[number]).id,
      orientation,
    };
  });
  return { question, deckId: deck.id, spreadId: spread.id, placements, seed };
}
