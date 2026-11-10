import { render, screen } from '@testing-library/react';
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

  it('shows no message for a good link', () => {
    location.hash = `#r=${link(good)}`;
    render(<App />);
    expect(screen.queryByRole('alert')).toBeNull();
    location.hash = '';
  });
});
