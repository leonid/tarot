import { useState } from 'react';
import { encodeShared, toShared } from '../domain/share';
import { isComplete, validateReading } from '../domain/validate';
import { getDeck } from '../content/decks';
import { getSpread } from '../content/spreads';
import { deleteReading, loadHistory, saveReading } from '../features/history';
import { useReadingStore } from '../features/store';

export function SaveShare() {
  const s = useReadingStore();
  const [history, setHistory] = useState(loadHistory);
  const [notice, setNotice] = useState('');
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
      setNotice('Link copied.');
    } catch {
      setNotice(url);
    }
  }

  return (
    <section className="save-share">
      <button
        disabled={!ready}
        onClick={() => {
          setHistory(saveReading(shared()));
          setNotice('Saved.');
        }}
      >
        Save reading
      </button>{' '}
      <button disabled={!ready} onClick={copyLink}>
        Copy share link
      </button>{' '}
      <small role="status">{notice}</small>
      {history.length > 0 && (
        <details>
          <summary>Saved readings ({history.length})</summary>
          <ul>
            {history.map((e) => (
              <li key={e.id}>
                {new Date(e.savedAt).toLocaleString()} —{' '}
                {e.reading.question || 'no question'} ({e.reading.spreadId}){' '}
                <button onClick={() => s.loadShared(e.reading)}>Open</button>{' '}
                <button onClick={() => setHistory(deleteReading(e.id))}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
