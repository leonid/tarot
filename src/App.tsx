import { useReadingStore } from './features/store';
import { SimulateView } from './features/simulate/SimulateView';
import { SetupView } from './features/setup/SetupView';
import { Controls } from './ui/Controls';
import { SaveShare } from './ui/SaveShare';
import { useEffect } from 'react';
import { decodeShared } from './domain/share';

export function App() {
  const mode = useReadingStore((s) => s.mode);
  const setMode = useReadingStore((s) => s.setMode);
  const loadShared = useReadingStore((s) => s.loadShared);

  // Open a shared link (#r=...) once on load.
  useEffect(() => {
    const m = /^#r=(.+)$/.exec(location.hash);
    const shared = m?.[1] ? decodeShared(m[1]) : null;
    if (shared) loadShared(shared);
  }, [loadShared]);
  return (
    <main className="app">
      <h1>Tarot</h1>
      <div role="tablist" className="modes">
        {(['simulate', 'setup'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
          >
            {m === 'simulate' ? 'Simulate' : 'Setup'}
          </button>
        ))}
      </div>
      <Controls />
      {mode === 'simulate' ? <SimulateView /> : <SetupView />}
      <SaveShare />
    </main>
  );
}
