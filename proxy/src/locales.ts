import { en } from '../../src/content/locales/en';
import { ru } from '../../src/content/locales/ru';
import type { LocaleBundle } from '../../src/content/locales/types';

/**
 * Languages the proxy can write in, with the language's name in English for
 * the instruction. The pseudo-locale is a dev aid and is not listed, so it
 * (like any unknown code) gets English.
 */
const SUPPORTED: readonly { bundle: LocaleBundle; language: string }[] = [
  { bundle: en, language: 'English' },
  { bundle: ru, language: 'Russian' },
];

/** "ru", "ru-RU" and "RU" are Russian; anything else is English. */
export function resolveLocale(code: string | undefined): {
  bundle: LocaleBundle;
  language: string;
} {
  const primary = (code ?? '').toLowerCase().split('-')[0];
  return SUPPORTED.find((l) => l.bundle.code === primary) ?? SUPPORTED[0]!;
}
