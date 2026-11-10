import { useReadingStore } from '../store';
import { ReadingView } from '../../ui/Layout';

export function SimulateView() {
  const dealRandom = useReadingStore((s) => s.dealRandom);
  const seed = useReadingStore((s) => s.seed);
  return (
    <>
      <button onClick={() => dealRandom()}>Shuffle and deal</button>
      {seed !== undefined && <small> seed {seed}</small>}
      <ReadingView />
    </>
  );
}
