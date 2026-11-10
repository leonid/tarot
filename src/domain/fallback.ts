import { compare } from './compare';
import { renderFact } from './facts';
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
    return {
      cards,
      relations: cmp.facts.map((f) =>
        renderFact(f, ctx.strings, (id) => findCard(ctx.deck, id)?.name ?? id),
      ),
      ...(cmp.hingeCardId ? { hingeCardId: cmp.hingeCardId } : {}),
      summary: ctx.strings.summary(ctx.question, cards.length),
      advice: ctx.strings.advice,
    };
  },
};
