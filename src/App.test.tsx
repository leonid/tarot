import { act, render, screen, within } from '@testing-library/react';
import { encodeShared } from './domain/share';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { useReadingStore } from './features/store';

describe('App', () => {
  it('deals a full spread in simulate mode', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Shuffle and deal'));
    expect(await screen.findByText('Interpretation')).toBeInTheDocument();
  });

  it('switches to setup mode', async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole('link', { name: 'Record a spread' }),
    );
    expect(location.hash).toBe('#/record');
    expect(
      (await screen.findAllByText('-- choose a card --')).length,
    ).toBeGreaterThan(0);
  });
});

describe('finding your way (R18)', () => {
  it('starts on a home screen that offers each goal by name', () => {
    history.replaceState(null, '', '#/');
    render(<App />);
    const goals = screen
      .getAllByRole('link')
      .filter((a) => a.classList.contains('goal'))
      .map((a) => a.getAttribute('href'));
    expect(goals).toEqual(['#/reading', '#/record', '#/cards', '#/journal']);
    expect(screen.queryByLabelText('Question')).toBeNull();
  });

  it('goes from a goal to its screen and marks it in the navigation', async () => {
    history.replaceState(null, '', '#/');
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(
      within(nav).getByRole('link', { current: 'page' }),
    ).toHaveTextContent('Home');
    await userEvent.click(screen.getByText(/Ask a question and let the app/));
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Get a reading' }),
    ).toHaveFocus();
    expect(
      within(nav).getByRole('link', { current: 'page' }),
    ).toHaveTextContent('Get a reading');
    expect(document.title).toBe('Get a reading · Tarot');
  });

  it('numbers the steps of a reading and keeps one primary action', () => {
    const { container } = render(<App />);
    expect(
      [...container.querySelectorAll('.step h3')].map((h) => h.textContent),
    ).toEqual(['1Your question', '2Choose a spread', '3Deal the cards']);
    expect(container.querySelectorAll('.btn-primary')).toHaveLength(1);
  });

  it('keeps a saved reading in the journal, where it can be opened', async () => {
    localStorage.clear();
    render(<App />);
    await userEvent.type(screen.getByLabelText('Question'), 'kept?');
    await userEvent.click(screen.getByText('Shuffle and deal'));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Save reading' }),
    );
    await userEvent.click(
      screen.getByRole('link', { name: 'Open the journal' }),
    );
    expect(
      await screen.findByRole('heading', { level: 3, name: 'kept?' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(location.hash).toBe('#/reading');
    expect(await screen.findByLabelText('Question')).toHaveValue('kept?');

    await userEvent.click(screen.getByRole('link', { name: 'Journal' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByRole('heading', { name: 'kept?' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByRole('heading', { name: 'kept?' })).toBeInTheDocument();
    localStorage.clear();
    useReadingStore.getState().setQuestion('');
  });
});

describe('learning the cards (R8)', () => {
  it('lists all 78 cards in groups and narrows them by name or keyword', async () => {
    history.replaceState(null, '', '#/cards');
    const { container } = render(<App />);
    expect(container.querySelectorAll('.card-link')).toHaveLength(78);
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent),
    ).toEqual(['Major Arcana', 'Wands', 'Cups', 'Swords', 'Pentacles']);

    const search = screen.getByLabelText('Find a card');
    await userEvent.type(search, 'queen');
    expect(container.querySelectorAll('.card-link')).toHaveLength(4);
    expect(screen.getByRole('status')).toHaveTextContent('4 of 78 cards');

    // A keyword of a meaning finds the card too.
    await userEvent.clear(search);
    await userEvent.type(search, 'beginnings');
    expect(
      container.querySelector('.card-link[href="#/cards/major-00-fool"]'),
    ).not.toBeNull();

    await userEvent.clear(search);
    await userEvent.type(search, 'zzzz');
    expect(container.querySelectorAll('.card-link')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent('No card matches');
    await userEvent.clear(search);
  });

  it('shows one card with both meanings, its parts and Waite', async () => {
    history.replaceState(null, '', '#/cards');
    const { container } = render(<App />);
    await userEvent.click(
      container.querySelector('.card-link[href="#/cards/cups-13-queen"]')!,
    );
    expect(location.hash).toBe('#/cards/cups-13-queen');
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Queen of Cups');
    expect(title).toHaveFocus();
    expect(document.title).toBe('Queen of Cups · Tarot');
    expect(container.querySelector('.card-page-art img')).not.toBeNull();
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent),
    ).toEqual(['Upright', 'Reversed', 'What it is built from', 'Waite, 1911']);
    expect(container.querySelector('.chip-water')).not.toBeNull();
    expect(container.querySelectorAll('.keywords li').length).toBeGreaterThan(
      3,
    );

    // Next and previous walk the deck; the list is one step away.
    await userEvent.click(screen.getByRole('link', { name: /King of Cups/ }));
    expect(location.hash).toBe('#/cards/cups-14-king');
    expect(screen.getByRole('heading', { level: 2 })).toHaveFocus();
    await userEvent.click(screen.getByRole('link', { name: 'All cards' }));
    expect(location.hash).toBe('#/cards');
    expect(
      screen.getByRole('link', { name: 'Learn the cards' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('says so when the address names no card', () => {
    history.replaceState(null, '', '#/cards/no-such-card');
    render(<App />);
    expect(screen.getByText(/There is no such card/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All cards' })).toBeVisible();
  });

  it('links each card of a reading to its page', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Shuffle and deal'));
    await screen.findByText('Interpretation');
    const more = screen.getAllByRole('link', { name: /^More about / });
    expect(more).toHaveLength(3);
    expect(more[0]!.getAttribute('href')).toMatch(/^#\/cards\/[a-z0-9-]+$/);
    // The reading is still there after a look at the card.
    await userEvent.click(more[0]!);
    await userEvent.click(screen.getByRole('link', { name: 'Get a reading' }));
    expect(await screen.findByText('Interpretation')).toBeInTheDocument();
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
    placements: [
      { positionId: 'card', cardId: 'major-00-fool', orientation: 'upright' },
    ],
  };
  const table = () => useReadingStore.getState();

  it('shows a shared reading in its own view, leaving the table alone', async () => {
    await act(() => table().setQuestion('mine'));
    location.hash = `#r=${encodeShared(good as never)}`;
    const { container } = render(<App />);
    expect(
      screen.getByRole('heading', { name: 'A reading shared with you' }),
    ).toBeInTheDocument();
    expect(screen.getByText('from a link')).toBeInTheDocument();
    expect(container.querySelector('[data-position="card"]')).toHaveTextContent(
      'The Fool',
    );
    expect(await screen.findByText('Interpretation')).toBeInTheDocument();
    // Read-only: nothing of the visitor's own changed, and the link stays.
    expect(table().question).toBe('mine');
    expect(location.hash).toMatch(/^#r=/);
    expect(screen.queryByRole('alert')).toBeNull();
    await act(() => table().setQuestion(''));
  });

  it('keeps a shared reading in the journal', async () => {
    localStorage.clear();
    location.hash = `#r=${link(good)}`;
    render(<App />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Keep it in my journal' }),
    );
    expect(screen.getByText('Kept in your journal.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Journal' }));
    expect(
      await screen.findByRole('heading', { name: 'from a link' }),
    ).toBeInTheDocument();
    localStorage.clear();
  });

  it('opens a shared reading on the table when asked', async () => {
    location.hash = `#r=${link(good)}`;
    render(<App />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Open it to change it' }),
    );
    expect(location.hash).toBe('#/record');
    expect(await screen.findByLabelText('Question')).toHaveValue('from a link');
    await act(() => table().setQuestion(''));
  });

  it('starts your own reading from a shared one', async () => {
    location.hash = `#r=${link(good)}`;
    render(<App />);
    await userEvent.click(
      screen.getByRole('link', { name: 'Start my own reading' }),
    );
    expect(location.hash).toBe('#/reading');
    expect(await screen.findByLabelText('Question')).toHaveValue('');
  });

  it.each([
    ['garbage', 'garbage', /could not be read/],
    ['a newer version', link({ ...good, v: 99 }), /newer version/],
    [
      'an unknown spread',
      link({ ...good, spreadId: 'nope' }),
      /deck or spread/,
    ],
  ])(
    'shows a dismissible message for %s and keeps the current screen',
    async (_n, hash, message) => {
      render(<App />);
      await userEvent.type(screen.getByLabelText('Question'), 'mine');
      act(() => {
        location.hash = `#r=${hash}`;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
      expect(screen.getByRole('alert')).toHaveTextContent(message);
      expect(screen.getByLabelText('Question')).toHaveValue('mine');

      await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.getByLabelText('Question')).toHaveValue('mine');
      expect(location.hash).toBe('#/reading');
      await act(() => table().setQuestion(''));
    },
  );

  it('shows the home screen under a bad link opened cold', async () => {
    location.hash = '#r=garbage';
    render(<App />);
    expect(location.hash).toBe('#r=garbage');
    expect(screen.getByText('What would you like to do?')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(location.hash).toBe('');
  });

  it('opens a link pasted into a page that is already loaded', async () => {
    render(<App />);
    act(() => {
      location.hash = `#r=${link(good)}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(await screen.findByText('from a link')).toBeInTheDocument();
    act(() => {
      location.hash = `#r=${link({ ...good, question: 'second' })}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(await screen.findByText('second')).toBeInTheDocument();
  });

  it('ignores a hash that names no screen', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText('Question'), 'mine');
    act(() => {
      location.hash = '#elsewhere';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByLabelText('Question')).toHaveValue('mine');
    expect(location.hash).toBe('#elsewhere');
    await act(() => table().setQuestion(''));
  });
});

describe('click to place', () => {
  it('places a card by clicking it and then a position', async () => {
    history.replaceState(null, '', '#/record');
    const { container } = render(<App />);
    await screen.findByText('Available cards');
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
    history.replaceState(null, '', '#/record');
    render(<App />);
    await screen.findByText('Available cards');
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
