import { waiteMeanings } from '../content/meanings/waite';
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

describe('other schools on a card (M6.12)', () => {
  it('shows each card read by its structure beside its note', async () => {
    render(<ReadingView provider={fallbackProvider} />);
    act(() => store().dealRandom(1));
    await screen.findByText(/3 cards were read/);
    const labels = screen.getAllByText('By structure');
    expect(labels).toHaveLength(3);
    for (const dt of labels) {
      const item = dt.closest('li')!;
      expect(item.querySelector('details summary')).toHaveTextContent(
        'Other readings of this card',
      );
      expect(dt.nextElementSibling?.textContent).toMatch(/Number|×|:/);
    }
  });
});

describe('Waite 1911 beside the modern meaning (M6.13)', () => {
  it("gives each card Waite's meaning for the way it fell", async () => {
    render(<ReadingView provider={fallbackProvider} />);
    act(() => store().dealRandom(1));
    await screen.findByText(/3 cards were read/);
    const labels = screen.getAllByText('Waite, 1911');
    expect(labels).toHaveLength(3);
    const { placements } = store();
    labels.forEach((dt, i) => {
      const p = placements[i]!;
      expect(dt.nextElementSibling).toHaveTextContent(
        waiteMeanings[p.cardId]![p.orientation],
      );
    });
  });
});
