import { create } from 'zustand';
import { deal } from '../domain/deal';
import { randomSeed } from '../domain/rng';
import type { Orientation, PlacedCard } from '../domain/types';
import { getDeck, decks } from '../content/decks';
import { getSpread, spreads } from '../content/spreads';

export type Mode = 'simulate' | 'setup';

interface State {
  mode: Mode;
  deckId: string;
  spreadId: string;
  question: string;
  allowReversals: boolean;
  placements: PlacedCard[];
  seed?: number;
  setMode: (m: Mode) => void;
  setDeck: (id: string) => void;
  setSpread: (id: string) => void;
  setQuestion: (q: string) => void;
  setAllowReversals: (v: boolean) => void;
  dealRandom: (seed?: number) => void;
  place: (positionId: string, cardId: string, o?: Orientation) => void;
  clearPosition: (positionId: string) => void;
  reset: () => void;
}

export const useReadingStore = create<State>((set, get) => ({
  mode: 'simulate',
  deckId: decks[0]!.id,
  spreadId: spreads[1]!.id,
  question: '',
  allowReversals: true,
  placements: [],
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
      placements: [
        // A card can only be in one place; a position holds one card.
        ...s.placements.filter(
          (p) => p.positionId !== positionId && p.cardId !== cardId,
        ),
        { positionId, cardId, orientation },
      ],
    })),
  clearPosition: (positionId) =>
    set((s) => ({
      placements: s.placements.filter((p) => p.positionId !== positionId),
    })),
  reset: () => set({ placements: [], seed: undefined }),
}));
