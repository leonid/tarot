import { useReadingStore } from '../store';
import { ReadingView } from '../../ui/Layout';
import { useI18n } from '../../ui/i18n';
import { Button } from '../../ui/kit';

export function SimulateView() {
  const dealRandom = useReadingStore((s) => s.dealRandom);
  const seed = useReadingStore((s) => s.seed);
  const { t } = useI18n();
  return (
    <>
      <Button variant="primary" onClick={() => dealRandom()}>
        {t.shuffleAndDeal}
      </Button>
      {seed !== undefined && <small> {t.seed(seed)}</small>}
      <ReadingView />
    </>
  );
}
