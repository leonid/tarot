import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { useReadingStore } from '../features/store';
import { ErrorBoundary } from './ErrorBoundary';

const initial = useReadingStore.getState();

/** Throws while the reading holds a card, as a broken view would. */
function Fragile() {
  const placements = useReadingStore((s) => s.placements);
  if (placements.length > 0) throw new Error('boom');
  return <p>working</p>;
}

beforeEach(() => {
  useReadingStore.setState({ ...initial, locale: 'en' }, true);
  // React reports the caught error on the console; keep the test output clean.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState(null, '', location.pathname);
});

describe('ErrorBoundary (M1.12)', () => {
  it('shows a start-over button for a render error and recovers', async () => {
    history.replaceState(null, '', '#r=broken');
    render(
      <ErrorBoundary>
        <Fragile />
      </ErrorBoundary>,
    );
    expect(screen.getByText('working')).toBeInTheDocument();

    act(() => useReadingStore.getState().place('past', 'major-00-fool'));
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.queryByText('working')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Start over' }));
    expect(screen.getByText('working')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(useReadingStore.getState().placements).toEqual([]);
    expect(location.hash).toBe('');
  });

  it('keeps language and theme when starting over', async () => {
    useReadingStore.setState({ locale: 'ru', theme: 'dark' });
    render(
      <ErrorBoundary>
        <Fragile />
      </ErrorBoundary>,
    );
    act(() => useReadingStore.getState().place('past', 'major-00-fool'));
    await userEvent.click(
      screen.getByRole('button', { name: 'Начать заново' }),
    );
    expect(useReadingStore.getState()).toMatchObject({
      locale: 'ru',
      theme: 'dark',
    });
  });

  it('leaves a working app after starting over', async () => {
    let broken = true;
    function Sometimes() {
      if (broken) throw new Error('boom');
      return <App />;
    }
    render(
      <ErrorBoundary>
        <Sometimes />
      </ErrorBoundary>,
    );
    broken = false;
    await userEvent.click(screen.getByRole('button', { name: 'Start over' }));
    // Starting over lands on the home screen.
    await userEvent.click(screen.getByRole('link', { name: 'Get a reading' }));
    await userEvent.click(await screen.findByText('Shuffle and deal'));
    expect(await screen.findByText('Interpretation')).toBeInTheDocument();
  });
});
