import type { Card, Suit } from './types';

export type Element = 'fire' | 'water' | 'air' | 'earth';
/** Fixed order, so grouped output is stable. */
export const ELEMENTS: readonly Element[] = ['fire', 'water', 'air', 'earth'];
export type Dignity = 'strengthened' | 'friendly' | 'conflicted' | 'neutral';

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

/**
 * Golden Dawn elemental dignities (docs/research, Part IV). Fire and air are
 * friends, as are water and earth. Fire opposes water and air opposes earth.
 * The two pairs left over, fire with earth and air with water, are neutral:
 * neither helps nor hinders the other.
 */
const DIGNITY: Record<string, Dignity> = {
  'air+fire': 'friendly',
  'earth+water': 'friendly',
  'fire+water': 'conflicted',
  'air+earth': 'conflicted',
  'earth+fire': 'neutral',
  'air+water': 'neutral',
};

export function dignity(a: Element, b: Element): Dignity {
  if (a === b) return 'strengthened';
  return DIGNITY[[a, b].sort().join('+')]!;
}
