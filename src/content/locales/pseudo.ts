import type { CardMeaning } from '../../domain/types';
import { decks } from '../decks';
import { altEnglish } from '../images/alt';
import { meanings } from '../meanings';
import { spreads } from '../spreads';
import { en } from './en';
import type { LocaleBundle, SpreadText } from './types';

const open = '⟦';
const close = '⟧';

/** Wraps text so untranslated or hardcoded English stands out on screen. */
export const wrap = (s: string): string => `${open}${s}${close}`;

/**
 * Applies `wrap` to every string a bundle part produces. Functions are
 * wrapped around their result; non-string arguments pass through unchanged.
 */
function wrapAll<T>(value: T): T {
  if (typeof value === 'string') return wrap(value) as T;
  if (typeof value === 'function') {
    const fn = value as unknown as (...a: unknown[]) => unknown;
    return ((...a: unknown[]) => wrapAll(fn(...a))) as T;
  }
  if (Array.isArray(value)) return value.map(wrapAll) as T;
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, wrapAll(v)]),
    ) as T;
  return value;
}

const cardNames = Object.fromEntries(
  decks.flatMap((d) => d.cards.map((c) => [c.id, wrap(c.name)] as const)),
);
const altText = Object.fromEntries(
  Object.entries(altEnglish).map(([id, t]) => [id, wrap(t)]),
);
const deckNames = Object.fromEntries(decks.map((d) => [d.id, wrap(d.name)]));

const spreadText = Object.fromEntries(
  spreads.map((s): [string, SpreadText] => [
    s.id,
    {
      name: wrap(s.name),
      description: wrap(s.description),
      positions: Object.fromEntries(
        s.positions.map((p) => [
          p.id,
          { label: wrap(p.label), meaning: wrap(p.meaning) },
        ]),
      ),
    },
  ]),
);

const meaningText = Object.fromEntries(
  Object.entries(meanings).map(([id, m]): [string, CardMeaning] => [
    id,
    wrapAll(m),
  ]),
);

/**
 * A development locale generated from English: every string wrapped in
 * brackets. Switching to it shows which text still bypasses the locale layer.
 */
export const pseudo: LocaleBundle = {
  code: 'en-XA',
  label: 'Pseudo-locale',
  ui: wrapAll(en.ui),
  provider: wrapAll(en.provider),
  decks: deckNames,
  cards: cardNames,
  alts: altText,
  spreads: spreadText,
  meanings: meaningText,
};
