import { useMemo } from 'react';
import { meanings } from '../content/meanings';
import { decks } from '../content/decks';
import { spreads } from '../content/spreads';
import {
  cardAlt,
  getLocale,
  localizeDeck,
  localizeMeanings,
  localizeSpread,
} from '../content/locales';
import type { Card } from '../domain/types';
import { useReadingStore } from '../features/store';

/** The active language's strings and localized content, in one place. */
export function useI18n() {
  const code = useReadingStore((s) => s.locale);
  return useMemo(() => {
    const locale = getLocale(code);
    const localDecks = decks.map((d) => localizeDeck(d, locale));
    const localSpreads = spreads.map((s) => localizeSpread(s, locale));
    return {
      locale,
      t: locale.ui,
      decks: localDecks,
      spreads: localSpreads,
      getDeck: (id: string) => localDecks.find((d) => d.id === id),
      getSpread: (id: string) => localSpreads.find((s) => s.id === id),
      meanings: localizeMeanings(meanings, locale),
      /** Alt text for a card picture; pass a card from a localized deck. */
      alt: (card: Card) => cardAlt(card, locale),
    };
  }, [code]);
}
