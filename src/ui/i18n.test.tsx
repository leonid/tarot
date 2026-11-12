import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import { locales } from '../content/locales';
import { useReadingStore } from '../features/store';

const labels = new Set(locales.map((l) => l.label));

/** Text nodes shown to the reader that are not wrapped by the pseudo-locale. */
function leaks(root: HTMLElement): string[] {
  const out: string[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent?.trim();
    // Language names are endonyms on purpose: each shows in its own language.
    if (!text || text.includes('⟦') || labels.has(text)) continue;
    out.push(text);
  }
  return out;
}

describe('locale switching', () => {
  it('switches the interface language and the document language', async () => {
    render(<App />);
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'en-XA');
    expect(
      screen.getByRole('link', { name: '⟦Record a spread⟧' }),
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en-XA');
    expect(useReadingStore.getState().locale).toBe('en-XA');
  });

  it('leaves no English on screen after a full simulated reading', async () => {
    useReadingStore.setState({ locale: 'en-XA' });
    const { container } = render(<App />);
    await userEvent.click(screen.getByText(/Shuffle and deal/));
    await screen.findByText(/Interpretation/);
    // Seed digits, card numerals (digits, Roman) and the option lists' own
    // text are data, not copy.
    const found = leaks(container).filter((t) => !/^(\d+|[IVX]+)$/.test(t));
    expect(found).toEqual([]);
  });

  it('leaves no English on screen in setup mode', async () => {
    useReadingStore.setState({ locale: 'en-XA' });
    history.replaceState(null, '', '#/record');
    const { container } = render(<App />);
    await screen.findByText(/Available cards/);
    const found = leaks(container).filter((t) => !/^(\d+|[IVX]+)$/.test(t));
    expect(found).toEqual([]);
  });

  it.each(['#/', '#/journal', '#/cards', '#/cards/cups-13-queen', '#/about'])(
    'leaves no English on screen at %s',
    (hash) => {
      useReadingStore.setState({ locale: 'en-XA' });
      history.replaceState(null, '', hash);
      const { container } = render(<App />);
      const found = leaks(container).filter((t) => !/^(\d+|[IVX]+)$/.test(t));
      expect(found).toEqual([]);
    },
  );

  it('ignores an unknown locale code', () => {
    useReadingStore.getState().setLocale('xx');
    expect(useReadingStore.getState().locale).toBe('en');
  });
});

describe('Russian', () => {
  it('shows the interface and a reading in Russian', async () => {
    useReadingStore.setState({ locale: 'ru' });
    render(<App />);
    expect(
      screen.getByRole('link', { name: 'Записать свой расклад' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByText('Перемешать и раскинуть'));
    expect(await screen.findByText('Толкование')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('ru');
  });
});
