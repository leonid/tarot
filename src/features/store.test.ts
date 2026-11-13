import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReadingStore } from './store';

const s = () => useReadingStore.getState();

describe('setup placement rules', () => {
  it('moves a card instead of duplicating it', () => {
    s().place('past', 'major-00-fool');
    s().place('present', 'major-00-fool');
    expect(s().placements).toEqual([
      {
        positionId: 'present',
        cardId: 'major-00-fool',
        orientation: 'upright',
      },
    ]);
  });

  it('replaces the card in an occupied position', () => {
    s().place('past', 'major-00-fool');
    s().place('past', 'major-13-death', 'reversed');
    expect(s().placements).toEqual([
      { positionId: 'past', cardId: 'major-13-death', orientation: 'reversed' },
    ]);
  });

  it('keeps cards in spread order, whatever order they were placed in (R2)', () => {
    s().reset();
    s().setSpread('three-card');
    s().place('future', 'cups-01-ace');
    s().place('past', 'major-00-fool');
    s().place('present', 'major-13-death');
    // Turning the first card over places it again; it must not move.
    s().place('past', 'major-00-fool', 'reversed');
    expect(s().placements.map((p) => p.positionId)).toEqual([
      'past',
      'present',
      'future',
    ]);
    expect(s().placements[0]!.orientation).toBe('reversed');
  });

  it('clears all placements when the spread changes', () => {
    s().place('past', 'major-00-fool');
    s().setSpread('celtic-cross');
    expect(s().placements).toEqual([]);
  });

  describe('keeping a reading (R3)', () => {
    const fill = () => {
      s().reset();
      s().setMode('simulate');
      s().setSpread('three-card');
      s().dismissUndo();
      s().dealRandom(7);
      return s().placements;
    };

    it('each mode keeps its own board', () => {
      const dealt = fill();
      s().setMode('setup');
      expect(s().placements).toEqual([]);
      s().place('past', 'major-00-fool');
      s().setMode('simulate');
      expect(s().placements).toEqual(dealt);
      expect(s().seed).toBe(7);
      s().setMode('setup');
      expect(s().placements.map((p) => p.cardId)).toEqual(['major-00-fool']);
      s().reset();
      s().setMode('simulate');
    });

    it('a spread change can be undone', () => {
      const dealt = fill();
      s().setSpread('celtic-cross');
      expect(s().undo?.kind).toBe('cleared');
      s().undoLast();
      expect(s().spreadId).toBe('three-card');
      expect(s().placements).toEqual(dealt);
      expect(s().seed).toBe(7);
      expect(s().undo).toBeUndefined();
    });

    it('offers no undo when the board was empty', () => {
      s().reset();
      s().setSpread('single');
      expect(s().undo).toBeUndefined();
      s().setSpread('three-card');
    });

    it('opening another reading can be undone', () => {
      const dealt = fill();
      s().setQuestion('mine');
      s().loadShared({
        v: 1,
        mode: 'setup',
        question: 'theirs',
        deckId: s().deckId,
        spreadId: 'single',
        placements: [
          { positionId: 'card', cardId: 'cups-01-ace', orientation: 'upright' },
        ],
      });
      expect(s().undo?.kind).toBe('replaced');
      s().undoLast();
      expect(s().mode).toBe('simulate');
      expect(s().question).toBe('mine');
      expect(s().placements).toEqual(dealt);
      s().setQuestion('');
    });
  });
});

describe('the first language (R17)', () => {
  const open = async (browserLanguage: string, saved?: string) => {
    vi.resetModules();
    localStorage.clear();
    if (saved) localStorage.setItem('tarot.locale.v1', saved);
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(browserLanguage);
    const { useReadingStore } = await import('./store');
    return useReadingStore;
  };
  afterEach(() => vi.restoreAllMocks());

  it('is English for a Russian browser: the Russian text is not reviewed', async () => {
    expect((await open('ru-RU')).getState().locale).toBe('en');
  });
  it('is English for any other browser', async () => {
    expect((await open('de-DE')).getState().locale).toBe('en');
  });
  it('is still Russian when the visitor chose it, once its text has loaded', async () => {
    const store = await open('en-US', 'ru');
    // Until the Russian text arrives the page reads in English, not blank.
    expect(store.getState().locale).toBe('en');
    await vi.waitFor(() => expect(store.getState().locale).toBe('ru'));
  });
});

describe('languages load on demand (R15)', () => {
  const fresh = async () => {
    vi.resetModules();
    localStorage.clear();
    const locales = await import('../content/locales');
    const { useReadingStore } = await import('./store');
    return { locales, store: useReadingStore };
  };

  it('has only English loaded at start, and Russian after it is chosen', async () => {
    const { locales, store } = await fresh();
    expect(locales.locales.map((l) => l.code)).toEqual(['en']);
    store.getState().setLocale('ru');
    expect(store.getState().locale).toBe('en');
    await vi.waitFor(() => expect(store.getState().locale).toBe('ru'));
    expect(locales.locales.map((l) => l.code)).toEqual(['en', 'ru']);
  });

  it('lists Russian in the picker before it is loaded', async () => {
    const { locales } = await fresh();
    expect(locales.LOCALE_CHOICES.map((c) => c.code)).toContain('ru');
  });

  it('a later choice wins over a slower earlier one', async () => {
    const { store } = await fresh();
    store.getState().setLocale('ru');
    store.getState().setLocale('en');
    await new Promise((r) => setTimeout(r, 50));
    expect(store.getState().locale).toBe('en');
  });

  it('ignores a language that is not shipped', async () => {
    const { store } = await fresh();
    store.getState().setLocale('xx');
    expect(store.getState().locale).toBe('en');
    expect(localStorage.getItem('tarot.locale.v1')).toBeNull();
  });
});
