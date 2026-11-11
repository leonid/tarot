import { act, render, screen } from '@testing-library/react';
import { encodeShared } from './domain/share';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('deals a full spread in simulate mode', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Shuffle and deal'));
    expect(await screen.findByText('Interpretation')).toBeInTheDocument();
  });

  it('switches to setup mode', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: 'Setup' }));
    expect(screen.getAllByText('-- choose a card --').length).toBeGreaterThan(
      0,
    );
  });
});

describe('spread board', () => {
  it('shows one slot per position of the Celtic Cross', async () => {
    const { container } = render(<App />);
    await userEvent.selectOptions(
      screen.getByLabelText('Spread'),
      'celtic-cross',
    );
    expect(container.querySelectorAll('.slot')).toHaveLength(10);
  });
});

describe('shared links', () => {
  it('opens a reading from the URL hash', async () => {
    const hash = encodeShared({
      v: 1,
      mode: 'setup',
      question: 'shared question',
      deckId: 'rws-78',
      spreadId: 'single',
      placements: [
        { positionId: 'card', cardId: 'major-00-fool', orientation: 'upright' },
      ],
    });
    location.hash = `#r=${hash}`;
    const { container } = render(<App />);
    await screen.findByDisplayValue('shared question');
    expect(container.querySelector('[data-position="card"]')).toHaveTextContent(
      'The Fool',
    );
    location.hash = '';
  });

  const link = (o: unknown) =>
    btoa(JSON.stringify(o))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  const good = {
    v: 1,
    mode: 'setup',
    question: 'from a link',
    deckId: 'rws-78',
    spreadId: 'single',
    placements: [],
  };

  it.each([
    ['garbage', 'garbage', /could not be read/],
    ['a newer version', link({ ...good, v: 99 }), /newer version/],
    [
      'an unknown spread',
      link({ ...good, spreadId: 'nope' }),
      /deck or spread/,
    ],
  ])(
    'shows a dismissible message for %s and keeps the current reading',
    async (_n, hash, message) => {
      location.hash = `#r=${hash}`;
      render(<App />);
      await userEvent.type(screen.getByLabelText('Question'), 'mine');
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(message);
      expect(screen.getByLabelText('Question')).toHaveValue('mine');

      await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.getByLabelText('Question')).toHaveValue('mine');
      location.hash = '';
    },
  );

  it('removes an opened link from the address bar', async () => {
    location.hash = `#r=${link(good)}`;
    render(<App />);
    await screen.findByDisplayValue('from a link');
    expect(location.hash).toBe('');
  });

  it('keeps a bad link in the address bar until the message is dismissed', async () => {
    location.hash = '#r=garbage';
    render(<App />);
    expect(location.hash).toBe('#r=garbage');
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(location.hash).toBe('');
  });

  it('opens a link pasted into a page that is already loaded', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText('Question'), 'mine');
    act(() => {
      location.hash = `#r=${link(good)}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await screen.findByDisplayValue('from a link');
    expect(location.hash).toBe('');

    act(() => {
      location.hash = `#r=${link({ ...good, question: 'second' })}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await screen.findByDisplayValue('second');
  });

  it('ignores a hash that is not a share link', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText('Question'), 'mine');
    act(() => {
      location.hash = '#elsewhere';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByLabelText('Question')).toHaveValue('mine');
    expect(location.hash).toBe('#elsewhere');
    location.hash = '';
  });

  it('shows no message for a good link', () => {
    location.hash = `#r=${link(good)}`;
    render(<App />);
    expect(screen.queryByRole('alert')).toBeNull();
    location.hash = '';
  });
});

describe('click to place', () => {
  it('places a card by clicking it and then a position', async () => {
    const { container } = render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: 'Setup' }));
    const card = container.querySelector('.palette-card')!;
    await userEvent.click(card);
    expect(card).toHaveAttribute('aria-pressed', 'true');
    const slot = screen.getAllByRole('button', { name: /^Place .* in / })[0]!;
    await userEvent.click(slot);
    expect(container.querySelectorAll('.slot.filled')).toHaveLength(1);
    expect(
      screen.queryAllByRole('button', { name: /^Place .* in / }),
    ).toHaveLength(0);
  });

  it('offers no positions to click until a card is selected', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: 'Setup' }));
    expect(
      screen.queryAllByRole('button', { name: /^Place .* in / }),
    ).toHaveLength(0);
  });
});

describe('screen reader feedback', () => {
  it('announces a deal in a status region', async () => {
    render(<App />);
    const before = screen.getAllByRole('status');
    expect(before.some((s) => /Cards dealt/.test(s.textContent ?? ''))).toBe(
      false,
    );
    await userEvent.click(screen.getByText('Shuffle and deal'));
    const after = await screen.findAllByRole('status');
    expect(after.some((s) => /Cards dealt: 3/.test(s.textContent ?? ''))).toBe(
      true,
    );
  });
});
