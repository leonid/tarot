import { useReadingStore } from '../store';
import { ReadingView } from '../../ui/Layout';
import { useI18n } from '../../ui/i18n';

export function SimulateView() {
  const dealRandom = useReadingStore((s) => s.dealRandom);
  const seed = useReadingStore((s) => s.seed);
  const { t } = useI18n();
  return (
    <>
      <button onClick={() => dealRandom()}>{t.shuffleAndDeal}</button>
      {seed !== undefined && <small> {t.seed(seed)}</small>}
      <ReadingView />
    </>
  );
}
