import { useRef } from 'react';
import type { InterpretationProvider } from '../domain/interpretation';
import type { Interpreted } from '../domain/llmProvider';
import { correspondences } from '../content/correspondences';
import { useReadingStore } from '../features/store';
import type { Card } from '../domain/types';
import type { SharedReading } from '../domain/share';
import { SpreadBoard } from './SpreadBoard';
import { useI18n } from './i18n';
import { Button } from './kit';
import { PageLink } from './Nav';
import { useInterpretation } from './useInterpretation';
import { useProvider } from './useProvider';

/** How many connections show at once; the rest are folded away. */
const TOP_CONNECTIONS = 3;

/** Renders the spread board with its cards and the interpretation. */
export function ReadingView({
  droppable = false,
  provider: given,
  armedCard,
  onSlotClick,
  onFlip,
  onRemove,
  reading,
}: {
  droppable?: boolean;
  /** Setup: the card picked by clicking; slots then accept a click. */
  armedCard?: Card;
  onSlotClick?: (positionId: string) => void;
  /** Record a spread: turn or remove a placed card, on the card itself. */
  onFlip?: (positionId: string) => void;
  onRemove?: (positionId: string) => void;
  provider?: InterpretationProvider;
  /** A reading to show instead of the one on the table (a shared link). */
  reading?: Pick<
    SharedReading,
    'deckId' | 'spreadId' | 'question' | 'placements'
  >;
}) {
  const chosen = useProvider();
  const provider = given ?? chosen;
  const table = useReadingStore();
  const { deckId, spreadId, question, placements } = reading ?? table;
  const { t, locale, getDeck, getSpread, meanings, formula, waite } = useI18n();
  const deck = getDeck(deckId);
  const spread = getSpread(spreadId);
  const complete =
    !!deck && !!spread && placements.length === spread.positions.length;
  const { result, failed, loading, stale, run } = useInterpretation(
    provider,
    complete
      ? {
          question,
          locale: locale.code,
          deck,
          spread,
          placements,
          meanings,
          strings: locale.provider,
          correspondences,
        }
      : null,
    complete
      ? JSON.stringify([
          deck.id,
          spread.id,
          locale.code,
          placements,
          provider.id,
        ])
      : '',
  );

  // A card on the board leads to its note, and the board to the reading, so
  // a long spread does not have to be scrolled past to be read.
  const root = useRef<HTMLElement>(null);
  const hasNotes = complete || (droppable && placements.length > 0);
  const focusIn = (selector: string) =>
    root.current?.querySelector<HTMLElement>(selector)?.focus();

  if (!deck || !spread) return null;
  return (
    <section className="reading" ref={root}>
      <div className="board-wrap">
        {hasNotes && (
          <p className="to-reading">
            <a
              href="#interpretation"
              onClick={(e) => {
                e.preventDefault();
                focusIn('.interpretation h2');
              }}
            >
              {t.toReading}
            </a>
          </p>
        )}
        <SpreadBoard
          deckId={deck.id}
          spread={spread}
          cards={deck.cards}
          placements={placements}
          droppable={droppable}
          armedCard={armedCard}
          onSlotClick={onSlotClick}
          hingeCardId={result?.hingeCardId}
          onFlip={onFlip}
          onRemove={onRemove}
          onCardClick={
            hasNotes
              ? (positionId) => focusIn(`.note-card[data-note="${positionId}"]`)
              : undefined
          }
        />
      </div>
      {/* Record a spread: each card is read as soon as it is placed. The
          connections need every card, so they wait for the last one. */}
      {!complete && droppable && placements.length > 0 && (
        <aside className="interpretation" aria-label={t.interpretation}>
          <h2 tabIndex={-1}>{t.interpretation}</h2>
          <p role="status" className="meta">
            {t.partialReading(placements.length, spread.positions.length)}
          </p>
          <ol className="notes">
            {placements.map((placed) => {
              const pos = spread.positions.find(
                (p) => p.id === placed.positionId,
              );
              const card = deck.cards.find((d) => d.id === placed.cardId);
              const base = meanings[placed.cardId]?.[placed.orientation];
              if (!card) return null;
              return (
                <li
                  key={placed.positionId}
                  className="note-card"
                  data-note={placed.positionId}
                  tabIndex={-1}
                >
                  <h3>
                    <span className="note-position">{pos?.label}</span>
                    <span className="note-name">{card.name}</span>
                    {placed.orientation === 'reversed' && (
                      <span className="note-reversed">{t.slotReversed}</span>
                    )}
                  </h3>
                  {pos && <p className="note-meaning">{pos.meaning}</p>}
                  <p>
                    {locale.provider.cardNote({
                      card: card.name,
                      orientation: placed.orientation,
                      ...(pos
                        ? {
                            position: {
                              label: pos.label,
                              meaning: pos.meaning,
                            },
                          }
                        : {}),
                      ...(base ? { base } : {}),
                    })}
                  </p>
                  <p className="note-more">
                    <PageLink page="cards" sub={card.id}>
                      {t.cardAbout(card.name)}
                    </PageLink>
                  </p>
                </li>
              );
            })}
          </ol>
        </aside>
      )}
      {complete && (
        <aside className="interpretation" aria-label={t.interpretation}>
          <h2 tabIndex={-1}>{t.interpretation}</h2>
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
          {result && (
            <p className="meta source" data-source={sourceOf(result)}>
              {sourceOf(result) === 'llm'
                ? t.sourceAi
                : provider.id === 'llm'
                  ? t.sourceFellBack
                  : t.sourceBuiltIn}
            </p>
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
                  const card = deck.cards.find((d) => d.id === c.cardId);
                  return (
                    <li
                      key={c.positionId}
                      className="note-card"
                      data-note={c.positionId}
                      tabIndex={-1}
                    >
                      <h3>
                        <span className="note-position">{pos?.label}</span>
                        <span className="note-name">{card?.name}</span>
                        {placed?.orientation === 'reversed' && (
                          <span className="note-reversed">
                            {t.slotReversed}
                          </span>
                        )}
                      </h3>
                      {pos && <p className="note-meaning">{pos.meaning}</p>}
                      <p>{c.note}</p>
                      {card && (
                        <details className="schools">
                          <summary>{t.otherSchools}</summary>
                          <dl>
                            <div>
                              <dt>{t.schoolStructure}</dt>
                              <dd>{formula(card, deck)}</dd>
                            </div>
                            {waite[card.id] && (
                              <div>
                                <dt>{t.schoolWaite}</dt>
                                <dd>
                                  {
                                    waite[card.id]![
                                      placed?.orientation ?? 'upright'
                                    ]
                                  }
                                </dd>
                              </div>
                            )}
                          </dl>
                        </details>
                      )}
                      {card && (
                        <p className="note-more">
                          <PageLink page="cards" sub={card.id}>
                            {t.cardAbout(card.name)}
                          </PageLink>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
              {(result.relations.length > 0 || result.hingeCardId) && (
                <section className="connections">
                  <h3>{t.connections}</h3>
                  <p className="meta">{t.connectionsExplain}</p>
                  {result.hingeCardId && (
                    <p>
                      <strong>{t.hingeLabel}</strong>{' '}
                      {
                        deck.cards.find((c) => c.id === result.hingeCardId)
                          ?.name
                      }
                      <span className="meta hinge-explain">
                        {t.hingeExplain}
                      </span>
                    </p>
                  )}
                  <ul>
                    {result.relations.slice(0, TOP_CONNECTIONS).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  {result.relations.length > TOP_CONNECTIONS && (
                    <details className="more-connections">
                      <summary>
                        {t.moreConnections(
                          result.relations.length - TOP_CONNECTIONS,
                        )}
                      </summary>
                      <ul>
                        {result.relations.slice(TOP_CONNECTIONS).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </details>
                  )}
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

/** Who wrote the result: only the LLM provider tags it; anything else is built in. */
function sourceOf(result: object): 'llm' | 'fallback' {
  return (result as Partial<Interpreted>).source === 'llm' ? 'llm' : 'fallback';
}
