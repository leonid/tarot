import { useState } from 'react';
import type { SharedReading } from '../domain/share';
import { saveReading } from '../features/history';
import { useReadingStore } from '../features/store';
import { useI18n } from './i18n';
import { Button, PageHead, StatusNote } from './kit';
import { ReadingView } from './Layout';
import { PageLink } from './Nav';
import { navigate } from './route';

/**
 * A reading opened from a share link. It is shown as it was sent and touches
 * nothing of the visitor's own until they keep it or open it on their table.
 */
export function SharedView({ reading }: { reading: SharedReading }) {
  const loadShared = useReadingStore((s) => s.loadShared);
  const [kept, setKept] = useState(false);
  const { t } = useI18n();
  return (
    <>
      <PageHead title={t.sharedTitle} purpose={t.sharedPurpose} />
      {reading.question && (
        <p className="shared-question">
          <span className="meta">{t.question}</span> {reading.question}
        </p>
      )}
      <div className="actions">
        <Button
          variant="primary"
          disabled={kept}
          onClick={() => {
            saveReading(reading);
            setKept(true);
          }}
        >
          {t.sharedKeep}
        </Button>
        <Button
          onClick={() => {
            loadShared(reading);
            navigate(reading.mode === 'setup' ? 'record' : 'reading');
          }}
        >
          {t.sharedOpen}
        </Button>
        <PageLink page="reading" className="btn btn-secondary">
          {t.sharedOwn}
        </PageLink>
      </div>
      <StatusNote>{kept ? t.sharedKept : ''}</StatusNote>
      <ReadingView reading={reading} />
    </>
  );
}
