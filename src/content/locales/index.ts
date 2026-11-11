import type {
  Card,
  CardMeaning,
  Deck,
  MeaningTable,
  Spread,
} from '../../domain/types';
import { altEnglish } from '../images/alt';
import { en } from './en';
import { pseudo } from './pseudo';
import { ru } from './ru';
import type { LocaleBundle } from './types';

export type { LocaleBundle, SpreadText, UiMessages } from './types';

/**
 * Shipped languages. Add a bundle here and it appears in the picker. The
 * pseudo-locale is a development aid, so production builds leave it out.
 */
export const locales: readonly LocaleBundle[] = import.meta.env.DEV
  ? [en, ru, pseudo]
  : [en, ru];
export const DEFAULT_LOCALE = en.code;

export const getLocale = (code: string): LocaleBundle =>
  locales.find((l) => l.code === code) ?? en;

/** The deck with card and deck names in the locale; English where missing. */
export function localizeDeck(deck: Deck, locale: LocaleBundle): Deck {
  if (!locale.cards && !locale.decks) return deck;
  return {
    ...deck,
    name: locale.decks?.[deck.id] ?? deck.name,
    cards: deck.cards.map((c) => {
      const name = locale.cards?.[c.id];
      return name ? { ...c, name } : c;
    }),
  };
}

/**
 * Alt text for a card's picture: the (localized) card name and what the
 * picture shows. English description where the locale has none. `card` should
 * already carry the localized name (see `localizeDeck`).
 */
export function cardAlt(card: Card, locale: LocaleBundle): string {
  const scene = locale.alts?.[card.id] ?? altEnglish[card.id];
  return scene ? `${card.name}: ${scene}` : card.name;
}

/** The spread with text in the locale; positions keep their coordinates. */
export function localizeSpread(spread: Spread, locale: LocaleBundle): Spread {
  const t = locale.spreads?.[spread.id];
  if (!t) return spread;
  return {
    ...spread,
    name: t.name ?? spread.name,
    description: t.description ?? spread.description,
    positions: spread.positions.map((p) => ({
      ...p,
      label: t.positions?.[p.id]?.label ?? p.label,
      meaning: t.positions?.[p.id]?.meaning ?? p.meaning,
    })),
  };
}

/** Base meanings with the locale's entries replacing English card by card. */
export function localizeMeanings(
  base: MeaningTable,
  locale: LocaleBundle,
): MeaningTable {
  if (!locale.meanings) return base;
  const merged: Record<string, CardMeaning> = { ...base };
  for (const [id, m] of Object.entries(locale.meanings)) merged[id] = m;
  return merged;
}
