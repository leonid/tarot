import { fallbackProvider } from '../domain/fallback';
import type { InterpretationProvider } from '../domain/interpretation';
import { correspondences } from '../content/correspondences';
import { useReadingStore } from '../features/store';
import { SpreadBoard } from './SpreadBoard';
import { useI18n } from './i18n';
import { Button } from './kit';
import { useInterpretation } from './useInterpretation';

/** Renders the spread board with its cards and the interpretation. */
export function ReadingView({
  droppable = false,
  provider = fallbackProvider,
}: {
  droppable?: boolean;
  provider?: InterpretationProvider;
}) {
  const { deckId, spreadId, question, placements } = useReadingStore();
  const { t, locale, getDeck, getSpread, meanings } = useI18n();
  const deck = getDeck(deckId);
  const spread = getSpread(spreadId);
  const complete =
    !!deck && !!spread && placements.length === spread.positions.length;
  const { result, failed, loading, stale, run } = useInterpretation(
    provider,
    complete
      ? {
          question,
          deck,
          spread,
          placements,
          meanings,
          strings: locale.provider,
          correspondences,
        }
      : null,
    complete
      ? JSON.stringify([deck.id, spread.id, locale.code, placements])
      : '',
  );

  if (!deck || !spread) return null;
  return (
    <section className="reading">
      <SpreadBoard
        spread={spread}
        cards={deck.cards}
        placements={placements}
        droppable={droppable}
        hingeCardId={result?.hingeCardId}
      />
      {complete && (
        <aside className="interpretation" aria-label={t.interpretation}>
          <h2>{t.interpretation}</h2>
          <p role="status" className="meta">
            {loading ? t.interpreting : ''}
          </p>
          {failed && !loading && (
            <div className="interpretation-action">
              <p role="alert" className="note note-error">
                {t.interpretationFailed}
              </p>
              <Button onClick={run}>{t.tryAgain}</Button>
            </div>
          )}
          {result && stale && (
            <div className="interpretation-action">
              <Button onClick={run} disabled={loading}>
                {t.updateInterpretation}
              </Button>
            </div>
          )}
          {result && <p className="reading-summary">{result.summary}</p>}
          {result && (
            <>
              <ol className="notes">
                {result.cards.map((c) => {
                  const pos = spread.positions.find(
                    (p) => p.id === c.positionId,
                  );
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
                          <span className="note-reversed">
                            {t.slotReversed}
                          </span>
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
                      {
                        deck.cards.find((c) => c.id === result.hingeCardId)
                          ?.name
                      }
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
            </>
          )}
        </aside>
      )}
    </section>
  );
}
