import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fallbackProvider } from '../domain/fallback';
import type { InterpretationProvider } from '../domain/interpretation';
import { useReadingStore } from '../features/store';
import { ReadingView } from './Layout';

const initial = useReadingStore.getState();
const store = () => useReadingStore.getState();

function spy(fail = () => false) {
  const interpret = vi.fn<InterpretationProvider['interpret']>((ctx) =>
    fail()
      ? Promise.reject(new Error('down'))
      : fallbackProvider.interpret(ctx),
  );
  return { id: 'spy', interpret };
}

beforeEach(() => {
  useReadingStore.setState({ ...initial, locale: 'en' }, true);
});

describe('interpretation trigger (M1.11)', () => {
  it('makes no provider call while the question is typed', async () => {
    const provider = spy();
    render(<ReadingView provider={provider} />);
    act(() => store().dealRandom(1));
    expect(await screen.findByText(/3 cards were read/)).toBeInTheDocument();
    expect(provider.interpret).toHaveBeenCalledTimes(1);

    for (const q of ['S', 'Sh', 'Sho', 'Should I go?'])
      act(() => store().setQuestion(q));
    expect(provider.interpret).toHaveBeenCalledTimes(1);

    await userEvent.click(
      screen.getByRole('button', { name: 'Update for the new question' }),
    );
    expect(await screen.findByText(/"Should I go\?"/)).toBeInTheDocument();
    expect(provider.interpret).toHaveBeenCalledTimes(2);
    expect(
      screen.queryByRole('button', { name: 'Update for the new question' }),
    ).toBeNull();
  });

  it('interprets again when the reading changes, and caches by reading', async () => {
    const provider = spy();
    render(<ReadingView provider={provider} />);
    act(() => store().dealRandom(1));
    const first = (await screen.findAllByRole('listitem'))[0]!.textContent;
    act(() => store().dealRandom(2));
    await vi.waitFor(() =>
      expect(screen.getAllByRole('listitem')[0]!.textContent).not.toBe(first),
    );
    expect(provider.interpret).toHaveBeenCalledTimes(2);

    act(() => store().dealRandom(1));
    await vi.waitFor(() =>
      expect(screen.getAllByRole('listitem')[0]!.textContent).toBe(first),
    );
    expect(provider.interpret).toHaveBeenCalledTimes(2);
  });

  it('shows nothing for an incomplete spread', () => {
    const provider = spy();
    render(<ReadingView provider={provider} />);
    act(() => store().place('past', 'major-00-fool'));
    expect(screen.queryByText('Interpretation')).toBeNull();
    expect(provider.interpret).not.toHaveBeenCalled();
  });

  it('shows a message when the provider fails, and retries', async () => {
    let down = true;
    const provider = spy(() => down);
    render(<ReadingView provider={provider} />);
    act(() => store().dealRandom(1));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The interpretation could not be made.',
    );

    down = false;
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText(/3 cards were read/)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
