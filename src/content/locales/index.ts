import { en } from './en';
import { pseudo } from './pseudo';
import { ru } from './ru';
import type { LocaleBundle } from './types';

export type { LocaleBundle, SpreadText, UiMessages } from './types';
export {
  cardAlt,
  localizeDeck,
  localizeMeanings,
  localizeSpread,
} from './localize';

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
