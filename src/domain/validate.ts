import type { Deck, Reading, Spread } from './types';

/** Returns a list of problems; empty means the reading is consistent. */
export function validateReading(
  reading: Reading,
  deck: Deck,
  spread: Spread,
): string[] {
  const problems: string[] = [];
  const cardIds = new Set(deck.cards.map((c) => c.id));
  const positionIds = new Set(spread.positions.map((p) => p.id));
  const seenCards = new Set<string>();
  const seenPositions = new Set<string>();

  for (const p of reading.placements) {
    if (!positionIds.has(p.positionId))
      problems.push(`Unknown position "${p.positionId}"`);
    if (!cardIds.has(p.cardId)) problems.push(`Unknown card "${p.cardId}"`);
    if (seenCards.has(p.cardId))
      problems.push(`Card "${p.cardId}" is placed more than once`);
    if (seenPositions.has(p.positionId))
      problems.push(`Position "${p.positionId}" is filled more than once`);
    seenCards.add(p.cardId);
    seenPositions.add(p.positionId);
  }
  return problems;
}

export function isComplete(reading: Reading, spread: Spread): boolean {
  return reading.placements.length === spread.positions.length;
}
