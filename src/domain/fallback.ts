import { compare } from './compare';
import {
  findCard,
  type Interpretation,
  type InterpretationProvider,
  type ReadingContext,
} from './interpretation';

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
      const meaning = ctx.meanings[p.cardId]?.[p.orientation];
      const name = card?.name ?? p.cardId;
      const where = position ? `${position.label} (${position.meaning})` : '';
      const text = meaning
        ? `${meaning.summary} Keywords: ${meaning.keywords.join(', ')}.`
        : 'No base meaning written for this card yet.';
      return {
        positionId: p.positionId,
        cardId: p.cardId,
        note: `${name}, ${p.orientation}, in ${where}: ${text}`,
      };
    });

    const cmp = compare(ctx);
    return {
      cards,
      relations: [...describeRelations(ctx), ...cmp.relations],
      ...(cmp.hingeCardId ? { hingeCardId: cmp.hingeCardId } : {}),
      summary: ctx.question
        ? `For the question "${ctx.question}", ${cards.length} card(s) were read.`
        : `${cards.length} card(s) were read.`,
      advice: 'Weigh each card against the position it landed in.',
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
  if (majors * 2 > cards.length)
    out.push('Mostly Major Arcana: weighty, fated themes.');

  const suitCounts = new Map<string, number>();
  for (const c of cards)
    if (c.suit) suitCounts.set(c.suit, (suitCounts.get(c.suit) ?? 0) + 1);
  for (const [suit, n] of suitCounts)
    if (n >= 2 && n * 2 > cards.length)
      out.push(`${suit} dominate (${n} of ${cards.length}).`);

  const reversed = ctx.placements.filter((p) => p.orientation === 'reversed');
  if (reversed.length * 2 > ctx.placements.length)
    out.push('Mostly reversed: blocked or internalised energy.');
  return out;
}
