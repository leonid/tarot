import type { Element } from './elements';
import type { ProviderStrings } from './strings';
import type { Suit } from './types';
import type { Planet, Sign } from './zodiac';

/** Two card ids. */
export type CardPair = readonly [string, string];

/**
 * One structural observation about a reading, as data: ids and enum values,
 * never text. A locale's templates turn it into a sentence (renderFact); an
 * LLM prompt or the interface can use the fact itself.
 */
export type Fact =
  /** More than half the cards are Major Arcana. */
  | { kind: 'mostly-majors' }
  /** More than half the cards are reversed. */
  | { kind: 'mostly-reversed' }
  /** One suit holds more than half the cards. */
  | { kind: 'suit-dominates'; suit: Suit; count: number; total: number }
  /** One element holds more than half the cards that have an element. */
  | {
      kind: 'element-dominates';
      element: Element;
      count: number;
      total: number;
    }
  /** Cards that share a planet (a decan ruler counts). */
  | { kind: 'planet-link'; planet: Planet; cardIds: readonly string[] }
  /** Cards that sit in the same sign. */
  | { kind: 'sign-link'; sign: Sign; cardIds: readonly string[] }
  /** A court card's sub-element matches the element of other cards. */
  | {
      kind: 'court-echo';
      courtId: string;
      sub: Element;
      suit: Element;
      cardIds: readonly string[];
    }
  /** Decan cards that fall inside a court card's zodiac span. */
  | { kind: 'court-span'; courtId: string; cardIds: readonly string[] }
  /** Pairs whose elements are enemies. */
  | { kind: 'conflicts'; pairs: readonly CardPair[] }
  /** Pairs whose elements are friends. */
  | { kind: 'friends'; pairs: readonly CardPair[] };

/**
 * Turns a fact into a sentence with a locale's templates. `name` gives the
 * card's name in that locale.
 */
export function renderFact(
  fact: Fact,
  strings: ProviderStrings,
  name: (cardId: string) => string,
): string {
  const names = (ids: readonly string[]) => ids.map(name);
  const pairs = (list: readonly CardPair[]) =>
    list.map(([a, b]) => [name(a), name(b)] as const);
  switch (fact.kind) {
    case 'mostly-majors':
      return strings.mostlyMajors;
    case 'mostly-reversed':
      return strings.mostlyReversed;
    case 'suit-dominates':
      return strings.suitDominates(fact.suit, fact.count, fact.total);
    case 'element-dominates':
      return strings.elementDominates(fact.element, fact.count, fact.total);
    case 'planet-link':
      return strings.planetLinks(fact.planet, names(fact.cardIds));
    case 'sign-link':
      return strings.signLinks(fact.sign, names(fact.cardIds));
    case 'court-echo':
      return strings.courtEcho(
        name(fact.courtId),
        fact.sub,
        fact.suit,
        names(fact.cardIds),
      );
    case 'court-span':
      return strings.courtSpan(names(fact.cardIds), name(fact.courtId));
    case 'conflicts':
      return strings.conflicts(pairs(fact.pairs));
    case 'friends':
      return strings.friends(pairs(fact.pairs));
  }
}
