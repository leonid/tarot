export type Theme = 'system' | 'light' | 'dark';
export const THEMES: readonly Theme[] = ['system', 'light', 'dark'];

/** Also read by the inline script in index.html, which runs before first paint. */
export const THEME_KEY = 'tarot.theme.v1';

export function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (THEMES.includes(saved as Theme)) return saved as Theme;
  } catch {
    // Storage can be blocked; follow the OS.
  }
  return 'system';
}

/** "system" removes the override so the OS setting decides (see tokens.css). */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Not persisting the choice is harmless.
  }
}
