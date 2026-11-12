import { useState } from 'react';
import { loadHistory } from '../features/history';
import { useReadingStore } from '../features/store';
import { Button } from './kit';
import { navigate } from './route';
import { useI18n } from './i18n';
import { PageLink } from './Nav';
import type { Page } from './route';

/** The first screen: what the app is, and the goals by name. */
export function Home() {
  const { t, getSpread } = useI18n();
  const [saved] = useState(() => loadHistory().length);
  const goals: [Page, string, string][] = [
    ['reading', t.goalReading, t.goalReadingText],
    ['record', t.goalRecord, t.goalRecordText],
    ['cards', t.goalCards, t.goalCardsText],
    ['journal', t.goalJournal, t.goalJournalText(saved)],
  ];
  // The table of the "Get a reading" screen, whichever screen was last open.
  const table = useReadingStore((s) =>
    s.mode === 'simulate' ? s : s.boards.simulate,
  );
  const spread = getSpread(
    table?.spreadId ?? useReadingStore.getState().spreadId,
  );
  const onTable = (table?.placements.length ?? 0) > 0;
  /** One tap from the first screen to a dealt reading. */
  function start() {
    const store = useReadingStore.getState();
    store.setMode('simulate');
    // A reading already on the table is kept, not dealt over.
    if (!onTable) useReadingStore.getState().dealRandom();
    navigate('reading');
  }
  return (
    <>
      <p className="lead home-intro">{t.homeIntro}</p>
      <div className="home-start">
        <Button variant="primary" onClick={start}>
          {onTable ? t.homeContinue : t.homeDraw}
        </Button>
        {!onTable && spread && (
          <p className="meta">
            {t.homeDrawHint(spread.name, spread.positions.length)}
          </p>
        )}
      </div>
      <h2 tabIndex={-1}>{t.homeChoose}</h2>
      <ul className="goals">
        {goals.map(([page, title, text]) => (
          <li key={page}>
            <PageLink page={page} className="goal">
              <span className="goal-title">{title}</span>
              <span className="goal-text">{text}</span>
            </PageLink>
          </li>
        ))}
      </ul>
    </>
  );
}
