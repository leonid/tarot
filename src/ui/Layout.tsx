import { useEffect, useState } from 'react';
import { fallbackProvider } from '../domain/fallback';
import type { Interpretation } from '../domain/interpretation';
import { correspondences } from '../content/correspondences';
import { meanings } from '../content/meanings';
import { getDeck } from '../content/decks';
import { getSpread } from '../content/spreads';
import { useReadingStore } from '../features/store';
import { SpreadBoard } from './SpreadBoard';

/** Renders the spread board with its cards and the interpretation. */
export function ReadingView({ droppable = false }: { droppable?: boolean }) {
  const { deckId, spreadId, question, placements } = useReadingStore();
  const deck = getDeck(deckId);
  const spread = getSpread(spreadId);
  const [result, setResult] = useState<Interpretation | null>(null);

  useEffect(() => {
    if (!deck || !spread || placements.length !== spread.positions.length)
      return;
    let live = true;
    fallbackProvider
      .interpret({
        question,
        deck,
        spread,
        placements,
        meanings,
        correspondences,
      })
      .then((r) => live && setResult(r));
    return () => {
      live = false;
    };
  }, [deck, spread, placements, question]);

  if (!deck || !spread) return null;
  const complete = placements.length === spread.positions.length;
  return (
    <section>
      <SpreadBoard
        spread={spread}
        cards={deck.cards}
        placements={placements}
        droppable={droppable}
        hingeCardId={complete ? result?.hingeCardId : undefined}
      />
      {result && complete && (
        <article className="interpretation">
          <h2>Interpretation</h2>
          {result.cards.map((c) => (
            <p key={c.positionId}>{c.note}</p>
          ))}
          {result.relations.map((r) => (
            <p key={r}>
              <em>{r}</em>
            </p>
          ))}
          {result.hingeCardId && (
            <p>
              <strong>Hinge:</strong>{' '}
              {deck.cards.find((c) => c.id === result.hingeCardId)?.name}
            </p>
          )}
          <p>{result.summary}</p>
          <p>{result.advice}</p>
        </article>
      )}
    </section>
  );
}
