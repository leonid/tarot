import type { Element } from './elements';
import type { CardFormula } from './formula';
import type { Orientation, Suit } from './types';
import type { Modality, Planet, Sign } from './zodiac';

/**
 * The phrases the deterministic interpreter writes itself, per locale.
 * Templates are functions so a locale controls word order, plurals and the
 * names it uses for elements, planets and signs. Card, position and meaning
 * text arrives already localized in the ReadingContext.
 */
export interface ProviderStrings {
  /**
   * One card's note: what it means here. The interface shows the card and
   * position as a heading, so the note need not repeat them.
   */
  cardNote(a: {
    card: string;
    orientation: Orientation;
    position?: { label: string; meaning: string };
    base?: { summary: string; keywords: readonly string[] };
  }): string;
  /**
   * A card read from its parts alone (number, element, planet, sign), whatever
   * its orientation. `name` gives a card's name in this locale.
   */
  cardFormula(formula: CardFormula, name: (cardId: string) => string): string;
  mostlyMajors: string;
  suitDominates(suit: Suit, count: number, total: number): string;
  mostlyReversed: string;
  /** Consecutive pips of one suit, in number order. */
  suitRun(suit: Suit, cards: readonly string[]): string;
  modalityDominates(modality: Modality, count: number, total: number): string;
  /** Cards in sign `a` face cards in the opposite sign `b`. */
  signOpposition(
    a: Sign,
    aCards: readonly string[],
    b: Sign,
    bCards: readonly string[],
  ): string;
  /** Minor cards of one number: 1-10 pips, 11 page to 14 king. */
  numberRepeats(number: number, cards: readonly string[]): string;
  /** Cards whose numbers reduce to `root` (1-9), a Major among them. */
  numberFamily(root: number, cards: readonly string[]): string;
  summary(question: string, cards: number): string;
  advice: string;

  elementDominates(element: Element, count: number, total: number): string;
  planetLinks(planet: Planet, cards: readonly string[]): string;
  signLinks(sign: Sign, cards: readonly string[]): string;
  courtEcho(
    court: string,
    sub: Element,
    suit: Element,
    cards: readonly string[],
  ): string;
  courtSpan(cards: readonly string[], court: string): string;
  /** Every card of element `a` conflicts with every card of element `b`. */
  elementConflict(
    a: Element,
    aCards: readonly string[],
    b: Element,
    bCards: readonly string[],
  ): string;
  /** Every card of element `a` is friendly to every card of element `b`. */
  elementFriendship(
    a: Element,
    aCards: readonly string[],
    b: Element,
    bCards: readonly string[],
  ): string;
}
