import { useReadingStore } from './features/store';
import { Home } from './ui/Home';
import { navigate, pageOf, subOf, useHash, type Page } from './ui/route';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { decodeSharedResult, type SharedReading } from './domain/share';
import { LOCALE_CHOICES } from './content/locales';
import { useI18n } from './ui/i18n';
import { ActionNote, Alert, Field } from './ui/kit';
import { Nav, PageLink } from './ui/Nav';
import { applyTheme, THEMES, type Theme } from './ui/theme';

// Screens that are not the first one load when they are opened, so the first
// download is the home and reading screens only (R15).
const SimulateView = lazy(() =>
  import('./features/simulate/SimulateView').then((m) => ({
    default: m.SimulateView,
  })),
);
const SetupView = lazy(() =>
  import('./features/setup/SetupView').then((m) => ({ default: m.SetupView })),
);
const Journal = lazy(() =>
  import('./ui/Journal').then((m) => ({ default: m.Journal })),
);
const SharedView = lazy(() =>
  import('./ui/SharedView').then((m) => ({ default: m.SharedView })),
);
const Cards = lazy(() =>
  import('./ui/Cards').then((m) => ({ default: m.Cards })),
);
const About = lazy(() =>
  import('./ui/About').then((m) => ({ default: m.About })),
);

type Link =
  { reading: SharedReading } | { error: 'malformed' | 'newer' | 'unknown' };

/** The screen each mode lives on. */
const pageOfMode = (mode: 'simulate' | 'setup'): Page =>
  mode === 'setup' ? 'record' : 'reading';

export function App() {
  const mode = useReadingStore((s) => s.mode);
  const setMode = useReadingStore((s) => s.setMode);
  const setLocale = useReadingStore((s) => s.setLocale);
  const theme = useReadingStore((s) => s.theme);
  const setTheme = useReadingStore((s) => s.setTheme);
  const undo = useReadingStore((s) => s.undo);
  const undoLast = useReadingStore((s) => s.undoLast);
  const dismissUndo = useReadingStore((s) => s.dismissUndo);
  const deckId = useReadingStore((s) => s.deckId);
  const { locale, t, getDeck, getSpread } = useI18n();

  // The hash names the screen. A hash that names none (a share link, or
  // anything else) leaves the visitor on the screen they were on.
  const hash = useHash();
  const named = pageOf(hash);
  const [last, setLast] = useState<Page>(named ?? 'home');
  if (named && named !== last) setLast(named);
  const page = named ?? last;
  const cardId = page === 'cards' && named ? subOf(hash) : undefined;
  const section = page === 'about' && named ? subOf(hash) : undefined;

  // A share link (#r=...) is shown in its own read-only view and stays in the
  // address bar, so it can be reloaded or passed on. A link that cannot be
  // shown leaves the current screen in place under a dismissible message.
  const link = useMemo((): Link | null => {
    const m = /^#r=(.+)$/.exec(hash);
    if (!m?.[1]) return null;
    const r = decodeSharedResult(m[1]);
    if (!r.ok)
      return {
        error: r.error.kind === 'future-version' ? 'newer' : 'malformed',
      };
    if (!getDeck(r.reading.deckId) || !getSpread(r.reading.spreadId))
      return { error: 'unknown' };
    return { reading: r.reading };
  }, [hash, getDeck, getSpread]);
  const shared = link && 'reading' in link ? link.reading : null;

  // The two reading screens share one table; each shows its own mode's board.
  const wanted =
    shared || (page !== 'reading' && page !== 'record')
      ? null
      : page === 'record'
        ? 'setup'
        : 'simulate';
  useEffect(() => {
    if (wanted && wanted !== mode) setMode(wanted);
  }, [wanted, mode, setMode]);

  const title = shared
    ? t.sharedTitle
    : {
        home: '',
        reading: t.goalReading,
        record: t.goalRecord,
        journal: t.goalJournal,
        about: t.aboutTitle,
        cards:
          getDeck(deckId)?.cards.find((c) => c.id === cardId)?.name ??
          t.goalCards,
      }[page];
  useEffect(() => {
    document.documentElement.lang = locale.code;
    document.title = title ? `${title} · ${t.appTitle}` : t.appTitle;
  }, [locale, t, title]);

  useEffect(() => applyTheme(theme), [theme]);

  // After a move to another screen, focus goes to its heading, so keyboard
  // and screen reader users start where the new content starts.
  const screen = shared ? 'shared' : `${page}/${cardId ?? section ?? ''}`;
  const shown = useRef(screen);
  useEffect(() => {
    if (screen === shown.current) return;
    shown.current = screen;
    const target = () =>
      document.querySelector<HTMLElement>('.page [data-focus]') ??
      document.querySelector<HTMLElement>('.page h2');
    // The previous screen can stay in the page, hidden, while a new one loads,
    // so a heading inside hidden content does not count.
    const ready = () => {
      const el = target();
      return el && !el.closest('[style*="display: none"]') ? el : null;
    };
    const page = document.querySelector('.page');
    if (!page) return;
    const now = ready();
    if (now) return now.focus();
    const watch = new MutationObserver(() => {
      const el = ready();
      if (!el) return;
      watch.disconnect();
      el.focus();
    });
    watch.observe(page, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, [screen]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <PageLink page="home">{t.appTitle}</PageLink>
        </h1>
        <div className="prefs">
          {LOCALE_CHOICES.length > 1 && (
            <Field label={t.language} className="language">
              {(p) => (
                <select
                  {...p}
                  value={locale.code}
                  onChange={(e) => setLocale(e.target.value)}
                >
                  {LOCALE_CHOICES.map((l) => (
                    <option key={l.code} value={l.code} lang={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          )}
          <Field label={t.theme} className="theme">
            {(p) => (
              <select
                {...p}
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
              >
                {THEMES.map((v) => (
                  <option key={v} value={v}>
                    {
                      {
                        system: t.themeSystem,
                        light: t.themeLight,
                        dark: t.themeDark,
                      }[v]
                    }
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
      </header>
      <Nav page={shared ? null : page} />
      <main>
        {link && 'error' in link && (
          <Alert
            dismissLabel={t.dismiss}
            onDismiss={() => navigate(last, { replace: true })}
          >
            {
              {
                malformed: t.shareLinkMalformed,
                newer: t.shareLinkNewer,
                unknown: t.shareLinkUnknown,
              }[link.error]
            }
          </Alert>
        )}
        {undo && (
          <ActionNote
            actionLabel={t.undo}
            onAction={() => {
              navigate(pageOfMode(undo.mode), { replace: true });
              undoLast();
            }}
            dismissLabel={t.dismiss}
            onDismiss={dismissUndo}
          >
            {undo.kind === 'cleared' ? t.readingCleared : t.readingReplaced}
          </ActionNote>
        )}
        <div className="page">
          <Suspense
            fallback={
              <p role="status" className="meta">
                {t.loading}
              </p>
            }
          >
            {shared ? (
              <SharedView key={hash} reading={shared} />
            ) : page === 'home' ? (
              <Home />
            ) : page === 'journal' ? (
              <Journal />
            ) : page === 'cards' ? (
              <Cards cardId={cardId} />
            ) : page === 'about' ? (
              <About section={section} />
            ) : mode !== wanted ? null : page === 'record' ? (
              <SetupView />
            ) : (
              <SimulateView />
            )}
          </Suspense>
        </div>
      </main>
      <footer className="app-footer">
        <p>{t.footerNote}</p>
        <nav aria-label={t.footerLabel}>
          <ul>
            <li>
              <PageLink page="about">{t.aboutTitle}</PageLink>
            </li>
            <li>
              <PageLink page="about" sub="sources">
                {t.aboutSourcesTitle}
              </PageLink>
            </li>
            <li>
              <PageLink page="about" sub="privacy">
                {t.aboutPrivacyTitle}
              </PageLink>
            </li>
            <li>
              <PageLink page="about" sub="licence">
                {t.aboutLicenceTitle}
              </PageLink>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}
