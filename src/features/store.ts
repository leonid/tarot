import { create } from 'zustand';
import { deal } from '../domain/deal';
import { randomSeed } from '../domain/rng';
import type { Orientation, PlacedCard } from '../domain/types';
import type { SharedReading } from '../domain/share';
import { getDeck, decks } from '../content/decks';
import { getSpread, spreads } from '../content/spreads';

import { DEFAULT_LOCALE, locales } from '../content/locales';

export type Mode = 'simulate' | 'setup';

import { applyTheme, readTheme, saveTheme, type Theme } from '../ui/theme';

const LOCALE_KEY = 'tarot.locale.v1';
const AI_KEY = 'tarot.ai.v1';

/** The AI reader is opt-in: only an explicit saved "on" turns it on. */
function initialUseAi(): boolean {
  try {
    return localStorage.getItem(AI_KEY) === 'on';
  } catch {
    return false;
  }
}

function initialLocale(): string {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved && locales.some((l) => l.code === saved)) return saved;
  } catch {
    // Storage can be blocked; the language falls back to the default.
  }
  // First visit: follow the browser language when we ship it.
  const browser = (typeof navigator === 'undefined' ? '' : navigator.language)
    .slice(0, 2)
    .toLowerCase();
  return locales.find((l) => l.code === browser)?.code ?? DEFAULT_LOCALE;
}

/**
 * Placements in the order of the spread's positions, whatever order the cards
 * were placed in: the reading, a saved entry and a share link all list the
 * cards the way the spread does.
 */
function inSpreadOrder(
  placements: readonly PlacedCard[],
  spreadId: string,
): PlacedCard[] {
  const order = getSpread(spreadId)?.positions.map((p) => p.id) ?? [];
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i < 0 ? order.length : i;
  };
  return [...placements].sort(
    (a, b) => rank(a.positionId) - rank(b.positionId),
  );
}

interface State {
  mode: Mode;
  locale: string;
  theme: Theme;
  useAi: boolean;
  deckId: string;
  spreadId: string;
  question: string;
  allowReversals: boolean;
  placements: PlacedCard[];
  seed?: number;
  setMode: (m: Mode) => void;
  setLocale: (code: string) => void;
  setTheme: (theme: Theme) => void;
  setUseAi: (on: boolean) => void;
  setDeck: (id: string) => void;
  setSpread: (id: string) => void;
  setQuestion: (q: string) => void;
  setAllowReversals: (v: boolean) => void;
  dealRandom: (seed?: number) => void;
  place: (positionId: string, cardId: string, o?: Orientation) => void;
  clearPosition: (positionId: string) => void;
  reset: () => void;
  loadShared: (r: SharedReading) => void;
}

export const useReadingStore = create<State>((set, get) => ({
  mode: 'simulate',
  locale: initialLocale(),
  theme: readTheme(),
  useAi: initialUseAi(),
  deckId: decks[0]!.id,
  spreadId: spreads[1]!.id,
  question: '',
  allowReversals: true,
  placements: [],
  setLocale: (locale) => {
    if (!locales.some((l) => l.code === locale)) return;
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      // Not persisting the choice is harmless.
    }
    set({ locale });
  },
  setTheme: (theme) => {
    saveTheme(theme);
    applyTheme(theme);
    set({ theme });
  },
  setUseAi: (useAi) => {
    try {
      localStorage.setItem(AI_KEY, useAi ? 'on' : 'off');
    } catch {
      // Not persisting the choice is harmless; it then defaults to off.
    }
    set({ useAi });
  },
  setMode: (mode) => set({ mode, placements: [], seed: undefined }),
  setDeck: (deckId) => set({ deckId, placements: [], seed: undefined }),
  setSpread: (spreadId) => set({ spreadId, placements: [], seed: undefined }),
  setQuestion: (question) => set({ question }),
  setAllowReversals: (allowReversals) => set({ allowReversals }),
  dealRandom: (seed = randomSeed()) => {
    const { deckId, spreadId, question, allowReversals } = get();
    const deck = getDeck(deckId);
    const spread = getSpread(spreadId);
    if (!deck || !spread) return;
    const reading = deal({ question, deck, spread, seed, allowReversals });
    set({ placements: [...reading.placements], seed });
  },
  place: (positionId, cardId, orientation = 'upright') =>
    set((s) => ({
      placements: inSpreadOrder(
        [
          // A card can only be in one place; a position holds one card.
          ...s.placements.filter(
            (p) => p.positionId !== positionId && p.cardId !== cardId,
          ),
          { positionId, cardId, orientation },
        ],
        s.spreadId,
      ),
    })),
  clearPosition: (positionId) =>
    set((s) => ({
      placements: s.placements.filter((p) => p.positionId !== positionId),
    })),
  reset: () => set({ placements: [], seed: undefined }),
  loadShared: (r) => {
    // Ignore readings that point at decks or spreads we no longer ship.
    if (!getDeck(r.deckId) || !getSpread(r.spreadId)) return;
    set({
      mode: r.mode,
      deckId: r.deckId,
      spreadId: r.spreadId,
      question: r.question,
      placements: inSpreadOrder(r.placements, r.spreadId),
      seed: r.seed,
    });
  },
}));
