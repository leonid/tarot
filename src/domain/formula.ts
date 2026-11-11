import type { Correspondence } from './correspondences';
import { numberRoot } from './compare';
import { elementOf, type Element } from './elements';
import type { Card, Deck } from './types';
import {
  essentialDignity,
  signElement,
  signModality,
  type Modality,
  type Planet,
  type Sign,
  type Strength,
} from './zodiac';

export type CourtRank = 'page' | 'knight' | 'queen' | 'king';
const COURT_RANKS: readonly CourtRank[] = ['page', 'knight', 'queen', 'king'];

/** A pip's ten degrees of the zodiac: a planet in a sign. */
export interface DecanFormula {
  planet: Planet;
  sign: Sign;
  modality: Modality;
  /** How well the planet sits in the sign, if it is notable. */
  strength?: Strength;
  /** The planet's Major, then the sign's Major. */
  majorIds: readonly string[];
}

/**
 * What a card is made of, as data: the parts every school of reading starts
 * from. A locale renders it (ProviderStrings.cardFormula), so one small set of
 * phrases covers all 78 cards.
 */
export type CardFormula =
  | {
      kind: 'major';
      number: number;
      /** The digit the number reduces to (15 gives 6); the Fool has none. */
      root?: number;
      /** Other Majors of the same root, in deck order. */
      kinIds: readonly string[];
      planet?: Planet;
      sign?: Sign;
      element?: Element;
      modality?: Modality;
    }
  | { kind: 'ace'; element: Element }
  | { kind: 'pip'; number: number; element: Element; decan?: DecanFormula }
  | {
      kind: 'court';
      rank: CourtRank;
      /** The suit's element. */
      element: Element;
      /** The rank's element, at work inside the suit's. */
      subElement?: Element;
    };

type Table = Readonly<Record<string, Correspondence>>;

/** The Major a table attributes to a planet or a sign. */
function majorOf(table: Table, key: Planet | Sign): string | undefined {
  return Object.entries(table).find(
    ([, c]) =>
      (c.kind === 'planet' && c.planet === key) ||
      (c.kind === 'sign' && c.sign === key),
  )?.[0];
}

/** DCAS step 1 (Decompose) for one card. `deck` supplies a Major's kin. */
export function formula(
  card: Card,
  deck: Deck,
  table: Table = {},
): CardFormula {
  const c = table[card.id];
  if (card.arcana === 'major') {
    const root = numberRoot(card);
    const sign = c?.kind === 'sign' ? c.sign : undefined;
    const element = sign
      ? signElement(sign)
      : c?.kind === 'planet'
        ? c.traditional
        : undefined;
    return {
      kind: 'major',
      number: card.number,
      ...(root ? { root } : {}),
      kinIds: root
        ? deck.cards
            .filter(
              (o) =>
                o.arcana === 'major' &&
                o.id !== card.id &&
                numberRoot(o) === root,
            )
            .map((o) => o.id)
        : [],
      ...(c?.kind === 'planet' ? { planet: c.planet } : {}),
      ...(sign ? { sign, modality: signModality(sign) } : {}),
      ...(element ? { element } : {}),
    };
  }
  // Minors always have a suit, so an element.
  const element = elementOf(card) as Element;
  if (card.number === 1) return { kind: 'ace', element };
  if (card.number > 10)
    return {
      kind: 'court',
      rank: COURT_RANKS[card.number - 11] as CourtRank,
      element,
      ...(c?.kind === 'court' ? { subElement: c.subElement } : {}),
    };
  if (c?.kind !== 'decan') return { kind: 'pip', number: card.number, element };
  const strength = essentialDignity(c.ruler, c.sign);
  return {
    kind: 'pip',
    number: card.number,
    element,
    decan: {
      planet: c.ruler,
      sign: c.sign,
      modality: signModality(c.sign),
      ...(strength ? { strength } : {}),
      majorIds: [majorOf(table, c.ruler), majorOf(table, c.sign)].filter(
        (id) => id !== undefined,
      ),
    },
  };
}
