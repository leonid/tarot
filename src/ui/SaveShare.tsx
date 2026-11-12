import { useState } from 'react';
import { encodeShared, toShared } from '../domain/share';
import { isComplete, validateReading } from '../domain/validate';
import { useI18n } from './i18n';
import { Button, StatusNote } from './kit';
import { PageLink } from './Nav';
import { saveReading } from '../features/history';
import { useReadingStore } from '../features/store';

/** Keep the finished reading in the journal, or copy a link to it. */
export function SaveShare() {
  const s = useReadingStore();
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState(false);
  const { t, getDeck, getSpread } = useI18n();
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
    setSaved(false);
    try {
      await navigator.clipboard.writeText(url);
      setNotice(t.linkCopied);
    } catch {
      setNotice(url);
    }
  }

  return (
    <section className="save-share">
      <div className="actions">
        <Button
          disabled={!ready}
          onClick={() => {
            saveReading(shared());
            setNotice(t.saved);
            setSaved(true);
          }}
        >
          {t.saveReading}
        </Button>
        <Button disabled={!ready} onClick={copyLink}>
          {t.copyShareLink}
        </Button>
      </div>
      <StatusNote>{notice}</StatusNote>
      {saved && <PageLink page="journal">{t.openJournal}</PageLink>}
    </section>
  );
}
