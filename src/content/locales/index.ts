import { en } from './en';
import type { LocaleBundle } from './types';

export type { LocaleBundle, SpreadText, UiMessages } from './types';
export {
  cardAlt,
  localizeDeck,
  localizeMeanings,
  localizeSchool,
  localizeSpread,
} from './localize';

/**
 * The languages the picker offers, by code and the name each is written in.
 * Only English is in the first download; the others load when chosen (see
 * `loadLocale`). The pseudo-locale is a development aid, so production builds
 * leave it out, code and all.
 */
export const LOCALE_CHOICES: readonly { code: string; label: string }[] = [
  { code: en.code, label: en.label },
  { code: 'ru', label: 'Русский' },
  ...(import.meta.env.DEV ? [{ code: 'en-XA', label: 'Pseudo-locale' }] : []),
];

const loaders: Record<string, () => Promise<LocaleBundle>> = {
  ru: () => import('./ru').then((m) => m.ru),
  ...(import.meta.env.DEV
    ? {
        'en-XA': () => import('./pseudo').then((m) => m.makePseudo()),
      }
    : {}),
};

/** The bundles that are loaded now, in picker order. English is always first. */
export const locales: LocaleBundle[] = [en];
export const DEFAULT_LOCALE = en.code;

const order = (code: string) =>
  LOCALE_CHOICES.findIndex((c) => c.code === code);

/** Adds a bundle to the loaded ones (used by `loadLocale`, and by tests that want them all). */
export function registerLocale(bundle: LocaleBundle) {
  if (locales.some((l) => l.code === bundle.code)) return;
  locales.push(bundle);
  locales.sort((a, b) => order(a.code) - order(b.code));
}

export const isKnownLocale = (code: string) => order(code) >= 0;
export const isLoaded = (code: string) => locales.some((l) => l.code === code);

/** Fetches a language's text (one request, cached after). Resolves once it is usable. */
export async function loadLocale(code: string): Promise<boolean> {
  if (isLoaded(code)) return true;
  const load = loaders[code];
  if (!load) return false;
  try {
    registerLocale(await load());
    return true;
  } catch {
    // Offline or a failed request: the reader stays in the language they had.
    return false;
  }
}

/** A loaded language; English while the one asked for is still loading. */
export const getLocale = (code: string): LocaleBundle =>
  locales.find((l) => l.code === code) ?? en;
