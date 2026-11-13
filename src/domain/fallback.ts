import { compare } from './compare';
import type { ReadingParts, KeyCard } from './strings';
import { factWeight, renderFact } from './facts';
import {
  findCard,
  type Interpretation,
  type InterpretationProvider,
  type ReadingContext,
} from './interpretation';

/**
 * Deterministic, offline interpreter: stitches base meanings to the position
 * and renders the Compare step's facts with the locale's templates. No
 * network, no LLM.
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
    const relations = [...cmp.facts]
      .map((f, i) => ({ f, i }))
      .sort((a, b) => factWeight(b.f) - factWeight(a.f) || a.i - b.i)
      .map(({ f }) =>
        renderFact(f, ctx.strings, (id) => findCard(ctx.deck, id)?.name ?? id),
      );
    const parts = readingParts(ctx, relations[0], cmp.hingeCardId);
    return {
      cards,
      // Strongest first, so the page can show the top few.
      relations,
      ...(cmp.hingeCardId ? { hingeCardId: cmp.hingeCardId } : {}),
      summary: ctx.strings.summary(ctx.question, cards.length, parts),
      advice: ctx.strings.advice(parts),
    };
  },
};

/**
 * Picks the cards that carry the reading (by the role each position has in the
 * spread) and the connection that says the most.
 */
function readingParts(
  ctx: ReadingContext,
  strongest: string | undefined,
  hingeCardId: string | undefined,
): ReadingParts {
  const keyCard = (
    role: 'focus' | 'obstacle' | 'outcome',
  ): KeyCard | undefined => {
    const position = ctx.spread.positions.find((p) => p.role === role);
    const placed = ctx.placements.find((p) => p.positionId === position?.id);
    const card = placed && findCard(ctx.deck, placed.cardId);
    if (!position || !placed || !card) return undefined;
    const meaning = ctx.meanings[placed.cardId];
    return {
      position: position.label,
      card: card.name,
      orientation: placed.orientation,
      keywords: meaning?.[placed.orientation]?.keywords.slice(0, 3) ?? [],
    };
  };
  const focus = keyCard('focus');
  const obstacle = keyCard('obstacle');
  const outcome = keyCard('outcome');
  const hinge = hingeCardId && findCard(ctx.deck, hingeCardId)?.name;
  return {
    ...(focus ? { focus } : {}),
    ...(obstacle ? { obstacle } : {}),
    ...(outcome ? { outcome } : {}),
    ...(strongest ? { strongest } : {}),
    ...(hinge ? { hinge } : {}),
  };
}
