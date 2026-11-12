import { useState } from 'react';
import {
  deleteReading,
  loadHistory,
  restoreReading,
  type HistoryEntry,
} from '../features/history';
import { useReadingStore } from '../features/store';
import { useI18n } from './i18n';
import { ActionNote, Button, PageHead } from './kit';
import { PageLink } from './Nav';
import { navigate } from './route';

/** Saved readings, newest first: open one on the table, or delete it. */
export function Journal() {
  const loadShared = useReadingStore((s) => s.loadShared);
  const [history, setHistory] = useState(loadHistory);
  const [deleted, setDeleted] = useState<HistoryEntry | null>(null);
  const { t, locale, getDeck, getSpread } = useI18n();
  return (
    <>
      <PageHead title={t.goalJournal} purpose={t.journalPurpose} />
      {deleted && (
        <ActionNote
          actionLabel={t.undo}
          onAction={() => {
            setHistory(restoreReading(deleted));
            setDeleted(null);
          }}
          dismissLabel={t.dismiss}
          onDismiss={() => setDeleted(null)}
        >
          {t.savedDeleted}
        </ActionNote>
      )}
      {history.length === 0 ? (
        <div className="empty">
          <p>{t.journalEmpty}</p>
          <PageLink page="reading" className="btn btn-primary">
            {t.goalReading}
          </PageLink>
        </div>
      ) : (
        <ul className="journal">
          {history.map((e) => {
            const deck = getDeck(e.reading.deckId);
            const names = e.reading.placements.map(
              (p) => deck?.cards.find((c) => c.id === p.cardId)?.name ?? '',
            );
            return (
              <li key={e.id} className="entry">
                <div className="entry-text">
                  <h3>{e.reading.question || t.noQuestion}</h3>
                  <p className="meta">
                    {new Date(e.savedAt).toLocaleString(locale.code)} ·{' '}
                    {getSpread(e.reading.spreadId)?.name ?? e.reading.spreadId}
                  </p>
                  <p className="entry-cards">{names.join(', ')}</p>
                </div>
                <div className="actions">
                  <Button
                    variant="primary"
                    onClick={() => {
                      loadShared(e.reading);
                      navigate(
                        e.reading.mode === 'setup' ? 'record' : 'reading',
                      );
                    }}
                  >
                    {t.open}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setHistory(deleteReading(e.id));
                      setDeleted(e);
                    }}
                  >
                    {t.delete}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
