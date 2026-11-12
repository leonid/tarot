import { useMemo } from 'react';
import { correspondences } from '../content/correspondences';
import { meanings } from '../content/meanings';
import { waiteMeanings } from '../content/meanings/waite';
import { decks } from '../content/decks';
import { spreads } from '../content/spreads';
import {
  cardAlt,
  getLocale,
  localizeDeck,
  localizeMeanings,
  localizeSchool,
  localizeSpread,
} from '../content/locales';
import { formula } from '../domain/formula';
import type { Card, Deck } from '../domain/types';
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
      /** Waite's 1911 meanings, by card id. */
      waite: localizeSchool(waiteMeanings, locale.waite),
      /** Alt text for a card picture; pass a card from a localized deck. */
      alt: (card: Card) => cardAlt(card, locale),
      /** A card read from its parts; pass a localized deck for the names. */
      formula: (card: Card, deck: Deck) =>
        locale.provider.cardFormula(
          formula(card, deck, correspondences),
          (id) => deck.cards.find((c) => c.id === id)?.name ?? id,
        ),
    };
  }, [code]);
}
