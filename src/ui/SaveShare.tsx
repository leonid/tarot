import { useState } from 'react';
import { encodeShared, toShared } from '../domain/share';
import { isComplete, validateReading } from '../domain/validate';
import { useI18n } from './i18n';
import { ActionNote, Button, StatusNote } from './kit';
import {
  deleteReading,
  loadHistory,
  restoreReading,
  saveReading,
  type HistoryEntry,
} from '../features/history';
import { useReadingStore } from '../features/store';

export function SaveShare() {
  const s = useReadingStore();
  const [history, setHistory] = useState(loadHistory);
  const [notice, setNotice] = useState('');
  const [deleted, setDeleted] = useState<HistoryEntry | null>(null);
  const { t, locale, getDeck, getSpread } = useI18n();
  const deck = getDeck(s.deckId);
  const spread = getSpread(s.spreadId);
  if (!deck || !spread) return null;

  const reading = {
    question: s.question,
    deckId: s.deckId,
    spreadId: s.spreadId,
    placements: s.placements,
    seed: s.seed,
  };
  const ready =
    isComplete(reading, spread) &&
    validateReading(reading, deck, spread).length === 0;
  const shared = () => toShared(reading, s.mode);

  async function copyLink() {
    const url = `${location.origin}${location.pathname}#r=${encodeShared(shared())}`;
    try {
      await navigator.clipboard.writeText(url);
      setNotice(t.linkCopied);
    } catch {
      setNotice(url);
    }
  }

  return (
    <section className="save-share">
      <Button
        disabled={!ready}
        onClick={() => {
          setHistory(saveReading(shared()));
          setNotice(t.saved);
        }}
      >
        {t.saveReading}
      </Button>{' '}
      <Button disabled={!ready} onClick={copyLink}>
        {t.copyShareLink}
      </Button>{' '}
      <StatusNote>{notice}</StatusNote>
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
      {history.length > 0 && (
        <details>
          <summary>{t.savedReadings(history.length)}</summary>
          <ul>
            {history.map((e) => (
              <li key={e.id}>
                {new Date(e.savedAt).toLocaleString(locale.code)} —{' '}
                {e.reading.question || t.noQuestion} (
                {getSpread(e.reading.spreadId)?.name ?? e.reading.spreadId}){' '}
                <Button onClick={() => s.loadShared(e.reading)}>
                  {t.open}
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => {
                    setHistory(deleteReading(e.id));
                    setDeleted(e);
                  }}
                >
                  {t.delete}
                </Button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
