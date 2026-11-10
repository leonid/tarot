import { useReadingStore } from './features/store';
import { SimulateView } from './features/simulate/SimulateView';
import { SetupView } from './features/setup/SetupView';
import { Controls } from './ui/Controls';
import { SaveShare } from './ui/SaveShare';
import { useEffect } from 'react';
import { decodeShared } from './domain/share';
import { locales } from './content/locales';
import { useI18n } from './ui/i18n';
import { Field, Tabs } from './ui/kit';
import { applyTheme, THEMES, type Theme } from './ui/theme';

export function App() {
  const mode = useReadingStore((s) => s.mode);
  const setMode = useReadingStore((s) => s.setMode);
  const loadShared = useReadingStore((s) => s.loadShared);
  const setLocale = useReadingStore((s) => s.setLocale);
  const theme = useReadingStore((s) => s.theme);
  const setTheme = useReadingStore((s) => s.setTheme);
  const { locale, t } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale.code;
    document.title = t.appTitle;
  }, [locale, t]);

  useEffect(() => applyTheme(theme), [theme]);

  // Open a shared link (#r=...) once on load.
  useEffect(() => {
    const m = /^#r=(.+)$/.exec(location.hash);
    const shared = m?.[1] ? decodeShared(m[1]) : null;
    if (shared) loadShared(shared);
  }, [loadShared]);
  return (
    <main className="app">
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
