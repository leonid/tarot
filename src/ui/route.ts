import { useSyncExternalStore } from 'react';

/** The screens of the app. Each is one goal; the hash names it. */
export const PAGES = [
  'home',
  'reading',
  'record',
  'journal',
  'cards',
  'about',
] as const;
export type Page = (typeof PAGES)[number];

/**
 * `#/reading` and the like; home is the bare address. `sub` names one thing
 * on the page: `#/cards/cups-12-queen` is one card of the library,
 * `#/about/sources` one section of the about page.
 */
export const hrefOf = (page: Page, sub?: string): string =>
  page === 'home' ? '#/' : sub ? `#/${page}/${sub}` : `#/${page}`;

const ROUTE = /^#\/([a-z]+)(?:\/([a-z0-9-]+))?$/;

/** The page a hash names, or null when it names none (a share link, junk). */
export function pageOf(hash: string): Page | null {
  if (hash === '' || hash === '#' || hash === '#/') return 'home';
  const m = ROUTE.exec(hash);
  if (m?.[2] && m[1] !== 'cards' && m[1] !== 'about') return null;
  return PAGES.find((p) => p === m?.[1]) ?? null;
}

/** The thing a hash names on its page (a card id), if any. */
export const subOf = (hash: string): string | undefined =>
  pageOf(hash) ? ROUTE.exec(hash)?.[2] : undefined;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('hashchange', listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('hashchange', listener);
    window.removeEventListener('popstate', listener);
  };
}

/** Goes to a page. `replace` leaves no entry in the browser history. */
export function navigate(
  page: Page,
  { replace = false, sub }: { replace?: boolean; sub?: string } = {},
) {
  const url =
    page === 'home' ? location.pathname + location.search : hrefOf(page, sub);
  if (replace) history.replaceState(null, '', url);
  else history.pushState(null, '', url);
  emit();
}

/** The address hash, kept current. */
export const useHash = (): string =>
  useSyncExternalStore(subscribe, () => location.hash);
