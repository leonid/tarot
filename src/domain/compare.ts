import type { Correspondence } from './correspondences';
import { dignity, elementOf, type Element } from './elements';
import { findCard, type ReadingContext } from './interpretation';
import { signElement, type Planet, type Sign } from './zodiac';
import type { Card } from './types';

export interface Comparison {
  relations: string[];
  /** Card with the most elemental ties to the others, if any stands out. */
  hingeCardId?: string;
}

/** Element a card works in: suit, sign, or an outer planet's traditional element. */
export function effectiveElement(
  card: Card,
  c: Correspondence | undefined,
): Element | undefined {
  const suit = elementOf(card);
  if (suit) return suit;
  if (c?.kind === 'sign') return signElement(c.sign);
  if (c?.kind === 'planet') return c.traditional;
  return undefined;
}

/** Planet a card carries: a major's planet, or a decan's ruler. */
function planetOf(c: Correspondence | undefined): Planet | undefined {
  if (c?.kind === 'planet') return c.planet;
  if (c?.kind === 'decan') return c.ruler;
  return undefined;
}

/** Sign a card sits in: a major's sign or a decan's sign. */
function signOf(c: Correspondence | undefined): Sign | undefined {
  if (c?.kind === 'sign' || c?.kind === 'decan') return c.sign;
  return undefined;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * DCAS step 2 (Compare): deterministic structure drawn from the Golden Dawn
 * correspondences. Returns plain-language relations and a hinge card.
 */
export function compare(ctx: ReadingContext): Comparison {
  const table = ctx.correspondences ?? {};
  const items = ctx.placements.flatMap((p) => {
    const card = findCard(ctx.deck, p.cardId);
    if (!card) return [];
    const c = table[card.id];
    return [{ card, c, element: effectiveElement(card, c) }];
  });
  const relations: string[] = [];

  // Dominant element.
  const counts = new Map<Element, number>();
  for (const i of items)
    if (i.element) counts.set(i.element, (counts.get(i.element) ?? 0) + 1);
  const withElement = [...counts.values()].reduce((a, b) => a + b, 0);
  for (const [el, n] of counts)
    if (n >= 2 && n * 2 > withElement)
      relations.push(
        `${cap(el)} dominates (${n} of ${withElement} cards with an element).`,
      );

  // Shared planets and signs (a decan ruler counts as that planet).
  const group = (
    pick: (c: Correspondence | undefined) => string | undefined,
  ) => {
    const m = new Map<string, string[]>();
    for (const i of items) {
      const k = pick(i.c);
      if (k) m.set(k, [...(m.get(k) ?? []), i.card.name]);
    }
    return [...m].filter(([, names]) => names.length >= 2);
  };
  for (const [planet, names] of group(planetOf))
    relations.push(`${cap(planet)} links ${names.join(' and ')}.`);
  for (const [s, names] of group(signOf))
    relations.push(`${cap(s)} links ${names.join(' and ')}.`);

  // Pairwise elemental dignities; tally ties per card for the hinge.
  const ties = new Map<string, number>();
  const conflicts: string[] = [];
  const friends: string[] = [];
  for (let a = 0; a < items.length; a++) {
    for (let b = a + 1; b < items.length; b++) {
      const x = items[a]!;
      const y = items[b]!;
      if (!x.element || !y.element) continue;
      const d = dignity(x.element, y.element);
      if (d === 'strengthened') continue;
      for (const i of [x, y])
        ties.set(i.card.id, (ties.get(i.card.id) ?? 0) + 1);
      const text = `${x.card.name} and ${y.card.name}`;
      (d === 'conflicted' ? conflicts : friends).push(text);
    }
  }
  if (conflicts.length)
    relations.push(`Conflicting elements: ${conflicts.join('; ')}.`);
  if (friends.length)
    relations.push(`Friendly elements: ${friends.join('; ')}.`);

  // Hinge: the single card with the most non-neutral ties, if it is unique and
  // has at least two.
  const ranked = [...ties].sort((a, b) => b[1] - a[1]);
  const top = ranked[0];
  const hingeCardId =
    top && top[1] >= 2 && top[1] > (ranked[1]?.[1] ?? 0) ? top[0] : undefined;

  return { relations, ...(hingeCardId ? { hingeCardId } : {}) };
}
