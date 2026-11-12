import { useSyncExternalStore } from 'react';

/** The screens of the app. Each is one goal; the hash names it. */
export const PAGES = ['home', 'reading', 'record', 'journal'] as const;
export type Page = (typeof PAGES)[number];

/** `#/reading` and the like; home is the bare address. */
export const hrefOf = (page: Page): string =>
  page === 'home' ? '#/' : `#/${page}`;

/** The page a hash names, or null when it names none (a share link, junk). */
export function pageOf(hash: string): Page | null {
  if (hash === '' || hash === '#' || hash === '#/') return 'home';
  const m = /^#\/([a-z]+)$/.exec(hash);
  return PAGES.find((p) => p === m?.[1]) ?? null;
}

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
export function navigate(page: Page, { replace = false } = {}) {
  const url =
    page === 'home' ? location.pathname + location.search : hrefOf(page);
  if (replace) history.replaceState(null, '', url);
  else history.pushState(null, '', url);
  emit();
}

/** The address hash, kept current. */
export const useHash = (): string =>
  useSyncExternalStore(subscribe, () => location.hash);
