import { useState } from 'react';
import { loadHistory } from '../features/history';
import { useI18n } from './i18n';
import { PageLink } from './Nav';
import type { Page } from './route';

/** The first screen: what the app is, and the goals by name. */
export function Home() {
  const { t } = useI18n();
  const [saved] = useState(() => loadHistory().length);
  const goals: [Page, string, string][] = [
    ['reading', t.goalReading, t.goalReadingText],
    ['record', t.goalRecord, t.goalRecordText],
    ['cards', t.goalCards, t.goalCardsText],
    ['journal', t.goalJournal, t.goalJournalText(saved)],
  ];
  return (
    <>
      <p className="lead home-intro">{t.homeIntro}</p>
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
