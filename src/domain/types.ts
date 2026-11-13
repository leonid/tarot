export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type Orientation = 'upright' | 'reversed';
export type Theme = 'love' | 'career' | 'spirit' | 'advice';

export interface Card {
  /** Stable id, e.g. "major-00-fool", "cups-12-queen". */
  id: string;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  /** Major: 0-21. Minor: 1-10 pips, 11 page, 12 knight, 13 queen, 14 king. */
  number: number;
}

export interface Deck {
  id: string;
  name: string;
  cards: readonly Card[];
}

/** Base meaning of one card, independent of any reading. */
export interface CardMeaning {
  upright: { keywords: string[]; summary: string };
  reversed: { keywords: string[]; summary: string };
  themes?: Partial<Record<Theme, string>>;
}

export type MeaningTable = Readonly<Record<string, CardMeaning>>;

/**
 * Another school's reading of each card, shown beside the base meaning:
 * one sentence per orientation, by card id.
 */
export type SchoolTable = Readonly<
  Record<string, { upright: string; reversed: string }>
>;

export interface SpreadPosition {
  id: string;
  label: string;
  /** What this position asks of the card, used in interpretation. */
  meaning: string;
  /**
   * What the position is for, so a reading can be composed from it:
   * the core of the matter, what stands in the way, or where it leads.
   */
  role?: 'focus' | 'obstacle' | 'outcome';
  /** Layout coordinates on an abstract grid (1 unit = one card slot). */
  x: number;
  y: number;
  /** Rotated 90 degrees (Celtic Cross "crossing" card). */
  rotated?: boolean;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  positions: readonly SpreadPosition[];
}

export interface PlacedCard {
  positionId: string;
  cardId: string;
  orientation: Orientation;
}

export interface Reading {
  question: string;
  deckId: string;
  spreadId: string;
  placements: readonly PlacedCard[];
  /** Set in simulate mode so the deal can be replayed. */
  seed?: number;
}
