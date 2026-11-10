import type { Element } from './elements';
import type { ProviderStrings } from './strings';
import type { Suit } from './types';
import type { Planet, Sign } from './zodiac';

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
  /**
   * Two elements that are enemies, with the cards of each: every card in the
   * first group conflicts with every card in the second.
   */
  | ElementPairFact<'element-conflict'>
  /** Two friendly elements, with the cards of each. */
  | ElementPairFact<'element-friendship'>;

interface ElementPairFact<K extends string> {
  kind: K;
  elements: readonly [Element, Element];
  /** Card ids per element, in the order of `elements`. */
  cardIds: readonly [readonly string[], readonly string[]];
}

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
    case 'element-conflict':
    case 'element-friendship':
      return (
        fact.kind === 'element-conflict'
          ? strings.elementConflict
          : strings.elementFriendship
      )(
        fact.elements[0],
        names(fact.cardIds[0]),
        fact.elements[1],
        names(fact.cardIds[1]),
      );
  }
}
