import { useReadingStore } from './features/store';
import { SimulateView } from './features/simulate/SimulateView';
import { SetupView } from './features/setup/SetupView';
import { Controls } from './ui/Controls';

export function App() {
  const mode = useReadingStore((s) => s.mode);
  const setMode = useReadingStore((s) => s.setMode);
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
    </main>
  );
}
