import type { Card, Suit } from './types';

export type Element = 'fire' | 'water' | 'air' | 'earth';
/** Fixed order, so grouped output is stable. */
export const ELEMENTS: readonly Element[] = ['fire', 'water', 'air', 'earth'];
export type Dignity = 'strengthened' | 'friendly' | 'conflicted';

const SUIT_ELEMENT: Record<Suit, Element> = {
  wands: 'fire',
  cups: 'water',
  swords: 'air',
  pentacles: 'earth',
};

/**
 * Element of a Minor Arcana card via its suit. Major Arcana have planetary or
 * zodiac attributions instead (see docs/research), so they return undefined.
 */
export function elementOf(card: Card): Element | undefined {
  return card.suit ? SUIT_ELEMENT[card.suit] : undefined;
}

/** Golden Dawn elemental dignities (docs/research, Part IV). */
export function dignity(a: Element, b: Element): Dignity {
  if (a === b) return 'strengthened';
  const pair = [a, b].sort().join('+');
  return pair === 'air+fire' || pair === 'earth+water'
    ? 'friendly'
    : 'conflicted';
}
