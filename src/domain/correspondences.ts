import type { Element } from './elements';
import type { Planet, Sign, ZodiacPoint } from './zodiac';

export type CourtLetter = 'Yod' | 'Heh' | 'Vav' | 'Heh final';

/**
 * Golden Dawn (Book T) attribution of one card. Source and policy:
 * docs/research/The Structural Tarot Method, Part IV.
 */
export type Correspondence =
  /** Major Arcana attributed to a planet. `traditional` is the Book T element:
   *  the older element where modern decks substitute an outer planet, or Earth
   *  alongside Saturn for The World. */
  | { kind: 'planet'; planet: Planet; traditional?: Element }
  /** Major Arcana attributed to a zodiac sign. */
  | { kind: 'sign'; sign: Sign }
  /** Ace: root of the whole element, no single decan. */
  | { kind: 'root'; element: Element }
  /** Numbered Minor 2-10: one ten-degree decan of the zodiac. */
  | {
      kind: 'decan';
      sign: Sign;
      decan: 1 | 2 | 3;
      ruler: Planet;
      /** Approximate sun dates, shift by a day either side. */
      dates: string;
      /** Book T title, e.g. "Lord of Dominion". */
      title: string;
    }
  /** Court card: a sub-element of its suit and, for senior courts, a 30 degree
   *  zodiac span. Pages hold a Kerub throne instead, so have no span. */
  | {
      kind: 'court';
      subElement: Element;
      letter: CourtLetter;
      span?: { from: ZodiacPoint; to: ZodiacPoint };
    };
