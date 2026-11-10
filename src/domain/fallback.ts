import { compare } from './compare';
import {
  findCard,
  type Interpretation,
  type InterpretationProvider,
  type ReadingContext,
} from './interpretation';
import type { Suit } from './types';

/**
 * Deterministic, offline interpreter: stitches base meanings to the position
 * and adds simple structural observations. No network, no LLM.
 */
export const fallbackProvider: InterpretationProvider = {
  id: 'fallback',
  async interpret(ctx: ReadingContext): Promise<Interpretation> {
    const cards = ctx.placements.map((p) => {
      const card = findCard(ctx.deck, p.cardId);
      const position = ctx.spread.positions.find((x) => x.id === p.positionId);
      const base = ctx.meanings[p.cardId]?.[p.orientation];
      return {
        positionId: p.positionId,
        cardId: p.cardId,
        note: ctx.strings.cardNote({
          card: card?.name ?? p.cardId,
          orientation: p.orientation,
          ...(position
            ? { position: { label: position.label, meaning: position.meaning } }
            : {}),
          ...(base ? { base } : {}),
        }),
      };
    });

    const cmp = compare(ctx);
    return {
      cards,
      relations: [...describeRelations(ctx), ...cmp.relations],
      ...(cmp.hingeCardId ? { hingeCardId: cmp.hingeCardId } : {}),
      summary: ctx.strings.summary(ctx.question, cards.length),
      advice: ctx.strings.advice,
    };
  },
};

function describeRelations(ctx: ReadingContext): string[] {
  const out: string[] = [];
  const cards = ctx.placements
    .map((p) => findCard(ctx.deck, p.cardId))
    .filter((c) => c !== undefined);
  if (cards.length === 0) return out;

  const majors = cards.filter((c) => c.arcana === 'major').length;
  if (majors * 2 > cards.length) out.push(ctx.strings.mostlyMajors);

  const suitCounts = new Map<Suit, number>();
  for (const c of cards)
    if (c.suit) suitCounts.set(c.suit, (suitCounts.get(c.suit) ?? 0) + 1);
  for (const [suit, n] of suitCounts)
    if (n >= 2 && n * 2 > cards.length)
      out.push(ctx.strings.suitDominates(suit, n, cards.length));

  const reversed = ctx.placements.filter((p) => p.orientation === 'reversed');
  if (reversed.length * 2 > ctx.placements.length)
    out.push(ctx.strings.mostlyReversed);
  return out;
}
