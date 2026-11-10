import { Component, type ReactNode } from 'react';
import { getLocale } from '../content/locales';
import { useReadingStore } from '../features/store';
import { Button } from './kit';

/**
 * Catches a render error anywhere below and offers to start over. Starting
 * over puts the current reading back to its first-visit state (language,
 * theme and saved readings are kept) and drops a share link from the address
 * bar, since a bad reading is the likeliest cause.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  private startOver = () => {
    const first = useReadingStore.getInitialState();
    useReadingStore.setState({
      mode: first.mode,
      deckId: first.deckId,
      spreadId: first.spreadId,
      question: first.question,
      allowReversals: first.allowReversals,
      placements: first.placements,
      seed: first.seed,
    });
    if (location.hash)
      history.replaceState(null, '', location.pathname + location.search);
    this.setState({ failed: false });
  };

  override render() {
    if (!this.state.failed) return this.props.children;
    // Read without hooks: the fallback must not depend on what just broke.
    const t = getLocale(useReadingStore.getState().locale).ui;
    return (
      <main className="app">
        <header className="app-header">
          <h1>{t.appTitle}</h1>
        </header>
        <div role="alert" className="app-error">
          <h2>{t.errorTitle}</h2>
          <p>{t.errorBody}</p>
          <Button variant="primary" onClick={this.startOver}>
            {t.errorStartOver}
          </Button>
        </div>
      </main>
    );
  }
}
