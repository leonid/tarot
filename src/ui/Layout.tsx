import { useEffect, useState } from 'react';
import { fallbackProvider } from '../domain/fallback';
import type { Interpretation } from '../domain/interpretation';
import { correspondences } from '../content/correspondences';
import { useReadingStore } from '../features/store';
import { SpreadBoard } from './SpreadBoard';
import { useI18n } from './i18n';

/** Renders the spread board with its cards and the interpretation. */
export function ReadingView({ droppable = false }: { droppable?: boolean }) {
  const { deckId, spreadId, question, placements } = useReadingStore();
  const { t, locale, getDeck, getSpread, meanings } = useI18n();
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
        strings: locale.provider,
        correspondences,
      })
      .then((r) => live && setResult(r));
    return () => {
      live = false;
    };
  }, [deck, spread, placements, question, meanings, locale]);

  if (!deck || !spread) return null;
  const complete = placements.length === spread.positions.length;
  return (
    <section className="reading">
      <SpreadBoard
        spread={spread}
        cards={deck.cards}
        placements={placements}
        droppable={droppable}
        hingeCardId={complete ? result?.hingeCardId : undefined}
      />
      {result && complete && (
        <aside className="interpretation" aria-label={t.interpretation}>
          <h2>{t.interpretation}</h2>
          <p className="reading-summary">{result.summary}</p>
          <ol className="notes">
            {result.cards.map((c) => {
              const pos = spread.positions.find((p) => p.id === c.positionId);
              const placed = placements.find(
                (p) => p.positionId === c.positionId,
              );
              return (
                <li key={c.positionId} className="note-card">
                  <h3>
                    <span className="note-position">{pos?.label}</span>
                    <span className="note-name">
                      {deck.cards.find((d) => d.id === c.cardId)?.name}
                    </span>
                    {placed?.orientation === 'reversed' && (
                      <span className="note-reversed">{t.slotReversed}</span>
                    )}
                  </h3>
                  {pos && <p className="note-meaning">{pos.meaning}</p>}
                  <p>{c.note}</p>
                </li>
              );
            })}
          </ol>
          {(result.relations.length > 0 || result.hingeCardId) && (
            <section className="connections">
              <h3>{t.connections}</h3>
              {result.hingeCardId && (
                <p>
                  <strong>{t.hingeLabel}</strong>{' '}
                  {deck.cards.find((c) => c.id === result.hingeCardId)?.name}
                </p>
              )}
              <ul>
                {result.relations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          )}
          <p className="advice">{result.advice}</p>
        </aside>
      )}
    </section>
  );
}
