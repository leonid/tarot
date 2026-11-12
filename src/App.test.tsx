import { act, render, screen, waitFor, within } from '@testing-library/react';
import { encodeShared } from './domain/share';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('the first visit (R11)', () => {
  const home = () => {
    history.replaceState(null, '', '#/');
    return render(<App />);
  };

  it('says what the app is and deals a reading in one tap', async () => {
    const { container } = home();
    expect(
      screen.getByText(/For reflection, not prediction or advice\.$/, {
        selector: '.home-intro',
      }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Deal a reading now' }),
    );
    expect(location.hash).toBe('#/reading');
    expect(container.querySelectorAll('.slot.filled')).toHaveLength(3);
    expect(useReadingStore.getState().mode).toBe('simulate');
  });

  it('offers to continue a reading that is on the table, and keeps it', async () => {
    useReadingStore.getState().dealRandom(7);
    const dealt = useReadingStore.getState().placements;
    home();
    expect(
      screen.queryByRole('button', { name: 'Deal a reading now' }),
    ).toBeNull();
    await userEvent.click(
      screen.getByRole('button', { name: 'Continue your reading' }),
    );
    expect(location.hash).toBe('#/reading');
    expect(useReadingStore.getState().placements).toEqual(dealt);
  });

  it('has a footer on every screen that leads to about, sources and licence', async () => {
    home();
    const footer = within(screen.getByRole('contentinfo'));
    expect(
      footer.getByText('For reflection, not prediction or advice.'),
    ).toBeInTheDocument();
    expect(
      footer.getAllByRole('link').map((a) => a.getAttribute('href')),
    ).toEqual([
      '#/about',
      '#/about/sources',
      '#/about/privacy',
      '#/about/licence',
    ]);
    await userEvent.click(footer.getByRole('link', { name: 'Sources' }));
    expect(document.title).toBe('About · Tarot');
    const heading = screen.getByRole('heading', { name: 'Sources' });
    expect(heading).toHaveFocus();
    expect(screen.getByText(/Pamela Colman Smith/)).toBeInTheDocument();
    expect(
      screen.getByText(/public domain and free to reuse/),
    ).toBeInTheDocument();
    expect(screen.getByText(/stay in this browser/)).toBeInTheDocument();
  });

  it('gives each dealt card its turn in the reveal', async () => {
    history.replaceState(null, '', '#/reading');
    const { container } = render(<App />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Shuffle and deal' }),
    );
    expect(
      [...container.querySelectorAll<HTMLElement>('.slot')].map((el) =>
        el.style.getPropertyValue('--i'),
      ),
    ).toEqual(['0', '1', '2']);
  });
});

describe('recording a spread (R9)', () => {
  const start = () => {
    history.replaceState(null, '', '#/record');
    return render(<App />);
  };

  it('reads each card as it is placed and the connections at the end', async () => {
    const { container } = start();
    const slots = () => container.querySelectorAll<HTMLElement>('.slot');
    for (let i = 0; i < 3; i++) {
      await userEvent.click(container.querySelector('.palette-card')!);
      await userEvent.click(slots()[i]!);
      expect(container.querySelectorAll('.note-card')).toHaveLength(i + 1);
      if (i < 2) {
        expect(
          screen.getByText(new RegExp(`${i + 1} of 3 cards placed`)),
        ).toBeInTheDocument();
        expect(container.querySelector('.advice')).toBeNull();
      }
    }
    await waitFor(() =>
      expect(container.querySelector('.advice')).not.toBeNull(),
    );
    expect(screen.queryByText(/of 3 cards placed/)).toBeNull();
  });

  it('turns a placed card over and takes it off with its own buttons', async () => {
    const { container } = start();
    await userEvent.click(container.querySelector('.palette-card')!);
    await userEvent.click(container.querySelector('.slot')!);
    const turn = screen.getByRole('button', { name: 'Turn The Fool over' });
    expect(turn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(turn);
    expect(useReadingStore.getState().placements[0]!.orientation).toBe(
      'reversed',
    );
    expect(
      screen.getByRole('button', { name: 'Turn The Fool over' }),
    ).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(
      screen.getByRole('button', { name: 'Take The Fool off the board' }),
    );
    expect(useReadingStore.getState().placements).toEqual([]);
  });

  it('offers no turn button when reversals are off', async () => {
    const { container } = start();
    await userEvent.click(screen.getByLabelText('Reversals'));
    await userEvent.click(container.querySelector('.palette-card')!);
    await userEvent.click(container.querySelector('.slot')!);
    expect(screen.queryByRole('button', { name: /^Turn / })).toBeNull();
    expect(
      screen.getByRole('button', { name: /off the board$/ }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Reversals'));
  });

  it('shows the deck in parts, with a search across all of it', async () => {
    const { container } = start();
    const count = () => container.querySelectorAll('.palette-card').length;
    expect(count()).toBe(22);
    await userEvent.click(screen.getByRole('button', { name: /^Swords/ }));
    expect(count()).toBe(14);
    await userEvent.type(screen.getByLabelText('Find a card'), 'ace');
    expect(count()).toBe(4);
    await userEvent.click(screen.getByRole('button', { name: /^All/ }));
    expect(count()).toBe(78);
    expect(screen.getByLabelText('Find a card')).toHaveValue('');
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

describe('the board leads to the reading (R12)', () => {
  const reading = () => {
    useReadingStore.getState().dealRandom(7);
    history.replaceState(null, '', '#/reading');
    return render(<App />);
  };

  it('pressing a card on the board brings its note into focus', async () => {
    const { container } = reading();
    await screen.findByText(/./, { selector: '.reading-summary' });
    const first = useReadingStore.getState().placements[0]!;
    const card = container.querySelector<HTMLButtonElement>(
      `[data-position="${first.positionId}"] .slot-card`,
    )!;
    expect(card).not.toBeNull();
    await userEvent.click(card);
    expect(document.activeElement).toBe(
      container.querySelector(`.note-card[data-note="${first.positionId}"]`),
    );
  });

  it('links from the board to the interpretation', async () => {
    reading();
    await screen.findByText(/./, { selector: '.reading-summary' });
    await userEvent.click(
      screen.getByRole('link', { name: 'Go to the interpretation' }),
    );
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { level: 2, name: 'Interpretation' }),
    );
  });

  it('shows no link and no card buttons before anything is read', () => {
    history.replaceState(null, '', '#/reading');
    const { container } = render(<App />);
    expect(
      screen.queryByRole('link', { name: 'Go to the interpretation' }),
    ).toBeNull();
    expect(container.querySelector('.slot-card')).toBeNull();
  });
});

describe('saving a reading (R13)', () => {
  beforeEach(() => localStorage.removeItem('tarot.history.v1'));
  const dealt = () => {
    useReadingStore.getState().dealRandom(11);
    history.replaceState(null, '', '#/reading');
    return render(<App />);
  };

  it('shows the reading is saved, and does not save it twice', async () => {
    dealt();
    await userEvent.click(
      await screen.findByRole('button', { name: 'Save reading' }),
    );
    expect(screen.getByText('Saved in your journal.')).toBeInTheDocument();
    const saved = screen.getByRole('button', { name: 'Saved ✓' });
    expect(saved).toBeDisabled();
    expect(
      screen.getByRole('link', { name: 'Open the journal' }),
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('tarot.history.v1')!)).toHaveLength(
      1,
    );
  });

  it('can save again once the reading has changed', async () => {
    dealt();
    await userEvent.click(
      await screen.findByRole('button', { name: 'Save reading' }),
    );
    act(() => useReadingStore.getState().dealRandom(12));
    expect(
      await screen.findByRole('button', { name: 'Save reading' }),
    ).toBeEnabled();
  });

  it('says so when storage is full', async () => {
    dealt();
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('no', 'QuotaExceededError');
      });
    try {
      await userEvent.click(
        await screen.findByRole('button', { name: 'Save reading' }),
      );
      expect(screen.getByRole('alert')).toHaveTextContent(
        /no room left for the app/,
      );
      expect(
        screen.getByRole('button', { name: 'Save reading' }),
      ).toBeEnabled();
    } finally {
      spy.mockRestore();
    }
  });
});
