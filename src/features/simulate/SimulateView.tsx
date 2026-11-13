import { useReadingStore } from '../store';
import { QuestionField, SpreadControls } from '../../ui/Controls';
import { ReadingView } from '../../ui/Layout';
import { SaveShare } from '../../ui/SaveShare';
import { useI18n } from '../../ui/i18n';
import { Button, PageHead, Step } from '../../ui/kit';

/** "Get a reading": question, spread, deal, then the reading itself. */
export function SimulateView() {
  const dealRandom = useReadingStore((s) => s.dealRandom);
  const seed = useReadingStore((s) => s.seed);
  const dealtCount = useReadingStore((s) => s.placements.length);
  const { t } = useI18n();
  return (
    <>
      <PageHead title={t.goalReading} purpose={t.readingPurpose} />
      <ol className="steps">
        <Step n={1} title={t.stepQuestion}>
          <QuestionField />
        </Step>
        <Step n={2} title={t.stepSpread}>
          <SpreadControls />
        </Step>
        <Step n={3} title={t.stepDeal}>
          <div className="deal">
            <Button variant="primary" onClick={() => dealRandom()}>
              {t.shuffleAndDeal}
            </Button>
          </div>
          {/* Always present, so a screen reader announces the text when a deal fills it. */}
          <p role="status" className="meta">
            {seed !== undefined && dealtCount > 0 ? t.dealt(dealtCount) : ''}
          </p>
        </Step>
      </ol>
      <ReadingView />
      {seed !== undefined && dealtCount > 0 && (
        <details className="replay">
          <summary>{t.replayDeal}</summary>
          <p>{t.replayExplain(seed)}</p>
        </details>
      )}
      <SaveShare />
    </>
  );
}
