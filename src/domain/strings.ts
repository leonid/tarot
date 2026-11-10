import type { Element } from './elements';
import type { Orientation, Suit } from './types';
import type { Planet, Sign } from './zodiac';

/**
 * The phrases the deterministic interpreter writes itself, per locale.
 * Templates are functions so a locale controls word order, plurals and the
 * names it uses for elements, planets and signs. Card, position and meaning
 * text arrives already localized in the ReadingContext.
 */
export interface ProviderStrings {
  /** One card's note: the card, where it landed and what it means. */
  cardNote(a: {
    card: string;
    orientation: Orientation;
    position?: { label: string; meaning: string };
    base?: { summary: string; keywords: readonly string[] };
  }): string;
  mostlyMajors: string;
  suitDominates(suit: Suit, count: number, total: number): string;
  mostlyReversed: string;
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
  conflicts(pairs: readonly (readonly [string, string])[]): string;
  friends(pairs: readonly (readonly [string, string])[]): string;
}
