import type { Deck } from '../../domain/types';
import { majorOnlyDeck, rwsDeck } from './rws';

export const decks: readonly Deck[] = [rwsDeck, majorOnlyDeck];
export const getDeck = (id: string) => decks.find((d) => d.id === id);
