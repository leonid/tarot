import { useReadingStore } from './features/store';
import { SimulateView } from './features/simulate/SimulateView';
import { SetupView } from './features/setup/SetupView';
import { Controls } from './ui/Controls';
import { SaveShare } from './ui/SaveShare';
import { useCallback, useEffect, useState } from 'react';
import { decodeSharedResult, type SharedReading } from './domain/share';
import { locales } from './content/locales';
import { useI18n } from './ui/i18n';
import { ActionNote, Alert, Field, Tabs } from './ui/kit';
import { applyTheme, THEMES, type Theme } from './ui/theme';

type Link =
  { reading: SharedReading } | { error: 'malformed' | 'newer' | 'unknown' };

/** Drops the share payload from the address bar without a navigation. */
function clearShareHash() {
  if (location.hash.startsWith('#r='))
    history.replaceState(null, '', location.pathname + location.search);
}

export function App() {
  const mode = useReadingStore((s) => s.mode);
  const setMode = useReadingStore((s) => s.setMode);
  const loadShared = useReadingStore((s) => s.loadShared);
  const setLocale = useReadingStore((s) => s.setLocale);
  const theme = useReadingStore((s) => s.theme);
  const setTheme = useReadingStore((s) => s.setTheme);
  const undo = useReadingStore((s) => s.undo);
  const undoLast = useReadingStore((s) => s.undoLast);
  const dismissUndo = useReadingStore((s) => s.dismissUndo);
  const { locale, t, getDeck, getSpread } = useI18n();

  // A share link (#r=...) is read at load and whenever the hash changes. Only
  // a readable link we can show is opened; otherwise the current reading
  // stays and a dismissible message says why.
  const readLink = useCallback((): Link | null => {
    const m = /^#r=(.+)$/.exec(location.hash);
    if (!m?.[1]) return null;
    const r = decodeSharedResult(m[1]);
    if (!r.ok)
      return {
        error: r.error.kind === 'future-version' ? 'newer' : 'malformed',
      };
    if (!getDeck(r.reading.deckId) || !getSpread(r.reading.spreadId))
      return { error: 'unknown' };
    return { reading: r.reading };
  }, [getDeck, getSpread]);
  const [link, setLink] = useState(readLink);

  useEffect(() => {
    const onHashChange = () => {
      const next = readLink();
      if (next) setLink(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [readLink]);

  useEffect(() => {
    document.documentElement.lang = locale.code;
    document.title = t.appTitle;
  }, [locale, t]);

  useEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    if (!link || !('reading' in link)) return;
    loadShared(link.reading);
    // The link has done its job: left in place, a reload would open it again
    // over whatever the reader did since.
    clearShareHash();
  }, [link, loadShared]);
  return (
    <main className="app">
      <header className="app-header">
        <h1>{t.appTitle}</h1>
        <div className="prefs">
          {locales.length > 1 && (
            <Field label={t.language} className="language">
              {(p) => (
                <select
                  {...p}
                  value={locale.code}
                  onChange={(e) => setLocale(e.target.value)}
                >
                  {locales.map((l) => (
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
      {link && 'error' in link && (
        <Alert
          dismissLabel={t.dismiss}
          onDismiss={() => {
            clearShareHash();
            setLink(null);
          }}
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
          onAction={undoLast}
          dismissLabel={t.dismiss}
          onDismiss={dismissUndo}
        >
          {undo.kind === 'cleared' ? t.readingCleared : t.readingReplaced}
        </ActionNote>
      )}
      <Tabs
        tabs={[
          { id: 'simulate', label: t.modeSimulate },
          { id: 'setup', label: t.modeSetup },
        ]}
        value={mode}
        onChange={setMode}
      />
      <Controls />
      {mode === 'simulate' ? <SimulateView /> : <SetupView />}
      <SaveShare />
    </main>
  );
}
