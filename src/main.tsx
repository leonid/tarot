import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './ui/ErrorBoundary';
import './ui/tokens.css';
import './ui/fonts.css';
import './styles.css';

// Dev only: #catalogue shows every shared control. Vite removes this branch
// (and the page) from production builds.
const Catalogue = import.meta.env.DEV
  ? lazy(() => import('./ui/Catalogue').then((m) => ({ default: m.Catalogue })))
  : null;
const showCatalogue = import.meta.env.DEV && location.hash === '#catalogue';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {showCatalogue && Catalogue ? (
      <Suspense>
        <Catalogue />
      </Suspense>
    ) : (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )}
  </StrictMode>,
);
