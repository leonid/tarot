import { useReadingStore } from '../store';
import { ReadingView } from '../../ui/Layout';
import { useI18n } from '../../ui/i18n';
import { Button } from '../../ui/kit';

export function SimulateView() {
  const dealRandom = useReadingStore((s) => s.dealRandom);
  const seed = useReadingStore((s) => s.seed);
  const dealtCount = useReadingStore((s) => s.placements.length);
  const { t } = useI18n();
  return (
    <>
      <div className="deal">
        <Button variant="primary" onClick={() => dealRandom()}>
          {t.shuffleAndDeal}
        </Button>
        {seed !== undefined && <small className="meta">{t.seed(seed)}</small>}
      </div>
      {/* Always present, so a screen reader announces the text when a deal fills it. */}
      <p role="status" className="meta">
        {seed !== undefined && dealtCount > 0 ? t.dealt(dealtCount) : ''}
      </p>
      <ReadingView />
    </>
  );
}
