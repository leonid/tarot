import { useEffect, useMemo, useState } from 'react';
import { correspondences } from '../content/correspondences';
import { localizeSchool } from '../content/locales';
import type { Card, Deck } from '../domain/types';
import { useI18n } from './i18n';

type Study = typeof import('./studyContent');

let loaded: Study | undefined;
let pending: Promise<void> | undefined;

/** Marks the study material as already loaded (tests use this to stay synchronous). */
export function registerStudy(study: Study) {
  loaded = study;
}

/**
 * Waite's meanings and a card's formula, in the active language. They arrive a
 * moment after first use (see studyContent.ts); until then there is no Waite
 * text and no formula, which the screens already treat as "not available".
 */
export function useStudy() {
  const { locale } = useI18n();
  const [, again] = useState(0);
  useEffect(() => {
    if (loaded) return;
    let live = true;
    pending ??= import('./studyContent').then((m) => {
      loaded = m;
    });
    void pending.then(() => live && again((n) => n + 1));
    return () => {
      live = false;
    };
  }, []);
  const study = loaded;
  return useMemo(
    () => ({
      /** Waite's 1911 meanings, by card id. */
      waite: study ? localizeSchool(study.waiteMeanings, locale.waite) : {},
      /** A card read from its parts; pass a localized deck for the names. */
      formula: (card: Card, deck: Deck) =>
        study
          ? locale.provider.cardFormula(
              study.formula(card, deck, correspondences),
              (id) => deck.cards.find((c) => c.id === id)?.name ?? id,
            )
          : '',
    }),
    [locale, study],
  );
}
