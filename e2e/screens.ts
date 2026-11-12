import type { Page } from '@playwright/test';

/** Every screen, opened in a state where its controls are showing. */
export const SCREENS: [string, (page: Page) => Promise<void>][] = [
  ['home', async (page) => void (await page.goto('/'))],
  [
    'reading',
    async (page) => {
      await page.goto('/#/reading');
      await page.getByLabel('Spread').selectOption('celtic-cross');
      await page.getByRole('button', { name: 'Shuffle and deal' }).click();
      await page.locator('.interpretation .advice').waitFor();
    },
  ],
  [
    'record',
    async (page) => {
      await page.goto('/#/record');
      await page.locator('.palette-card').first().click();
      await page.locator('[data-position="past"]').click();
    },
  ],
  ['cards', async (page) => void (await page.goto('/#/cards'))],
  [
    'one card',
    async (page) => void (await page.goto('/#/cards/major-00-fool')),
  ],
  ['journal', async (page) => void (await page.goto('/#/journal'))],
  ['about', async (page) => void (await page.goto('/#/about'))],
];

/** Controls smaller than 44 by 44 px; a link inside a sentence is exempt. */
export function smallTargets(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const label = (el: Element) =>
      `${el.tagName.toLowerCase()}.${el.className} "${(el.textContent ?? '').trim().slice(0, 30)}"`;
    const small = new Set<string>();
    for (const el of document.querySelectorAll(
      'a, button, select, summary, input, [role="button"], [aria-pressed]',
    )) {
      const seen = el.getBoundingClientRect();
      if (seen.width === 0 || seen.height === 0) continue;
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline')
        continue;
      // A checkbox or radio is pressed through its label.
      const box =
        el instanceof HTMLInputElement &&
        (el.type === 'checkbox' || el.type === 'radio')
          ? (el.closest('label') ?? el)
          : el;
      const r = box.getBoundingClientRect();
      if (r.height < 43.5 || r.width < 43.5)
        small.add(
          `${label(el)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        );
    }
    return [...small];
  });
}

/** Visible text set smaller than 12 px. */
export function tinyText(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const label = (el: Element) =>
      `${el.tagName.toLowerCase()}.${el.className} "${(el.textContent ?? '').trim().slice(0, 30)}"`;
    const tiny = new Set<string>();
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement!;
      const r = el.getBoundingClientRect();
      if (!n.textContent?.trim() || r.width === 0 || r.height === 0) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 12) tiny.add(`${label(el)} ${size}px`);
    }
    return [...tiny];
  });
}
