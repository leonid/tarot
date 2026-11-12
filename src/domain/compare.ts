import type { Correspondence } from './correspondences';
import { dignity, elementOf, ELEMENTS, type Element } from './elements';
import type { Fact } from './facts';
import { findCard, type ReadingContext } from './interpretation';
import {
  longitude,
  signElement,
  signIndex,
  signModality,
  SIGNS,
  type Modality,
  type Planet,
  type Sign,
} from './zodiac';
import type { Card, Suit } from './types';

export interface Comparison {
  /** What the cards have in common or against each other, as data. */
  facts: Fact[];
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

/**
 * DCAS step 2 (Compare): deterministic structure drawn from the Golden Dawn
 * correspondences. Returns typed facts (no text) and a hinge card; a locale's
 * templates render the facts (see renderFact).
 */
export function compare(ctx: ReadingContext): Comparison {
  const table = ctx.correspondences ?? {};
  const items = ctx.placements.flatMap((p) => {
    const card = findCard(ctx.deck, p.cardId);
    if (!card) return [];
    const c = table[card.id];
    return [{ card, c, element: effectiveElement(card, c) }];
  });
  const facts: Fact[] = structure(ctx);

  // Dominant element.
  const counts = new Map<Element, number>();
  for (const i of items)
    if (i.element) counts.set(i.element, (counts.get(i.element) ?? 0) + 1);
  const withElement = [...counts.values()].reduce((a, b) => a + b, 0);
  for (const [el, n] of counts)
    if (n >= 2 && n * 2 > withElement)
      facts.push({
        kind: 'element-dominates',
        element: el,
        count: n,
        total: withElement,
      });

  // Shared planets and signs (a decan ruler counts as that planet).
  const group = <K extends string>(
    pick: (c: Correspondence | undefined) => K | undefined,
  ) => {
    const m = new Map<K, string[]>();
    for (const i of items) {
      const k = pick(i.c);
      if (k) m.set(k, [...(m.get(k) ?? []), i.card.id]);
    }
    return [...m].filter(([, ids]) => ids.length >= 2);
  };
  for (const [planet, cardIds] of group(planetOf))
    facts.push({ kind: 'planet-link', planet, cardIds });
  for (const [sign, cardIds] of group(signOf))
    facts.push({ kind: 'sign-link', sign, cardIds });

  // Modality and oppositions among cards that sit in a sign.
  const bySign = new Map<Sign, string[]>();
  for (const i of items) {
    const s = signOf(i.c);
    if (s) bySign.set(s, [...(bySign.get(s) ?? []), i.card.id]);
  }
  const inSign = [...bySign.values()].reduce((n, ids) => n + ids.length, 0);
  // One sign alone is already a sign-link, so a modality needs two signs.
  const modalities = new Map<Modality, { count: number; signs: number }>();
  for (const [s, ids] of bySign) {
    const m = modalities.get(signModality(s)) ?? { count: 0, signs: 0 };
    modalities.set(signModality(s), {
      count: m.count + ids.length,
      signs: m.signs + 1,
    });
  }
  for (const [modality, { count, signs }] of modalities)
    if (signs >= 2 && count * 2 > inSign)
      facts.push({
        kind: 'modality-dominates',
        modality,
        count,
        total: inSign,
      });
  for (let a = 0; a < 6; a++) {
    const [x, y] = [SIGNS[a]!, SIGNS[a + 6]!];
    const [xs, ys] = [bySign.get(x), bySign.get(y)];
    if (xs && ys)
      facts.push({ kind: 'sign-opposition', signs: [x, y], cardIds: [xs, ys] });
  }

  // Court cards: sub-element echoes and zodiac spans.
  for (const court of items) {
    if (court.c?.kind !== 'court') continue;
    const sub = court.c.subElement;
    const suitEl = court.element;
    if (suitEl && sub !== suitEl) {
      const echoes = items.filter((o) => o !== court && o.element === sub);
      if (echoes.length)
        facts.push({
          kind: 'court-echo',
          courtId: court.card.id,
          sub,
          suit: suitEl,
          cardIds: echoes.map((o) => o.card.id),
        });
    }
    const span = court.c.span;
    if (span) {
      const from = longitude(span.from);
      const inside = items.filter((o) => {
        if (o.c?.kind !== 'decan') return false;
        const start = signIndex(o.c.sign) * 30 + (o.c.decan - 1) * 10;
        return (start - from + 360) % 360 <= 20;
      });
      if (inside.length)
        facts.push({
          kind: 'court-span',
          courtId: court.card.id,
          cardIds: inside.map((o) => o.card.id),
        });
    }
  }

  // Elemental dignities, grouped by element pair: every card of one element
  // stands in the same relation to every card of the other, so two groups say
  // what a list of pairs would, in far fewer words. Ties per card (the number
  // of cards in a friendly or opposed element) pick the hinge.
  const byElement = ELEMENTS.map(
    (element) =>
      [
        element,
        items.filter((i) => i.element === element).map((i) => i.card.id),
      ] as const,
  ).filter(([, ids]) => ids.length > 0);
  const ties = new Map<string, number>();
  const clashes: Fact[] = [];
  const alliances: Fact[] = [];
  for (let a = 0; a < byElement.length; a++)
    for (let b = a + 1; b < byElement.length; b++) {
      const [x, xs] = byElement[a]!;
      const [y, ys] = byElement[b]!;
      const d = dignity(x, y);
      // Neutral pairs (fire with earth, air with water) say nothing.
      if (d === 'neutral') continue;
      const conflicted = d === 'conflicted';
      (conflicted ? clashes : alliances).push({
        kind: conflicted ? 'element-conflict' : 'element-friendship',
        elements: [x, y],
        cardIds: [xs, ys],
      });
      for (const [mine, theirs] of [
        [xs, ys],
        [ys, xs],
      ] as const)
        for (const id of mine)
          ties.set(id, (ties.get(id) ?? 0) + theirs.length);
    }
  facts.push(...clashes, ...alliances);

  // Hinge: the single card with the most non-neutral ties, if it is unique and
  // has at least two.
  const ranked = [...ties].sort((a, b) => b[1] - a[1]);
  const top = ranked[0];
  const hingeCardId =
    top && top[1] >= 2 && top[1] > (ranked[1]?.[1] ?? 0) ? top[0] : undefined;

  return { facts, ...(hingeCardId ? { hingeCardId } : {}) };
}

/**
 * The single digit a card's number reduces to by adding its digits: 15 gives
 * 6, 19 gives 10 and then 1. The Fool (0) and court cards have none.
 */
export function numberRoot(card: Card): number | undefined {
  if (card.number < 1 || (card.arcana === 'minor' && card.number > 10))
    return undefined;
  return ((card.number - 1) % 9) + 1;
}

/** Facts that need no correspondences: arcana, suit, number and orientation. */
function structure(ctx: ReadingContext): Fact[] {
  const out: Fact[] = [];
  const cards = ctx.placements
    .map((p) => findCard(ctx.deck, p.cardId))
    .filter((c) => c !== undefined);
  if (cards.length === 0) return out;

  const majors = cards.filter((c) => c.arcana === 'major').length;
  if (majors * 2 > cards.length) out.push({ kind: 'mostly-majors' });

  const suitCounts = new Map<Suit, number>();
  for (const c of cards)
    if (c.suit) suitCounts.set(c.suit, (suitCounts.get(c.suit) ?? 0) + 1);
  for (const [suit, count] of suitCounts)
    if (count >= 2 && count * 2 > cards.length)
      out.push({ kind: 'suit-dominates', suit, count, total: cards.length });

  // Repeated numbers among the Minors, then the families a Major joins.
  const byNumber = new Map<number, string[]>();
  const byRoot = new Map<number, { ids: string[]; major: boolean }>();
  for (const c of cards) {
    if (c.arcana === 'minor')
      byNumber.set(c.number, [...(byNumber.get(c.number) ?? []), c.id]);
    const root = numberRoot(c);
    if (root === undefined) continue;
    const group = byRoot.get(root) ?? { ids: [], major: false };
    group.ids.push(c.id);
    group.major ||= c.arcana === 'major';
    byRoot.set(root, group);
  }
  for (const [number, cardIds] of byNumber)
    if (cardIds.length >= 2)
      out.push({ kind: 'number-repeats', number, cardIds });
  for (const [root, { ids, major }] of byRoot)
    if (major && ids.length >= 2)
      out.push({ kind: 'number-family', root, cardIds: ids });

  // Runs: three or more consecutive pips of one suit.
  for (const suit of suitCounts.keys()) {
    const pips = cards
      .filter((c) => c.suit === suit && c.number <= 10)
      .sort((a, b) => a.number - b.number);
    let run: Card[] = [];
    const flush = () => {
      if (run.length >= 3)
        out.push({ kind: 'suit-run', suit, cardIds: run.map((c) => c.id) });
    };
    for (const c of pips) {
      if (run.length && c.number !== run[run.length - 1]!.number + 1) {
        flush();
        run = [];
      }
      run.push(c);
    }
    flush();
  }

  const reversed = ctx.placements.filter((p) => p.orientation === 'reversed');
  if (reversed.length * 2 > ctx.placements.length)
    out.push({ kind: 'mostly-reversed' });
  return out;
}
