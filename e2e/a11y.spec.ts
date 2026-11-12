import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const views: [string, (page: Page) => Promise<void>][] = [
  [
    'home',
    async (page) => {
      await page.getByRole('link', { name: 'Home' }).click();
    },
  ],
  [
    'journal, one saved reading',
    async (page) => {
      await page.getByRole('button', { name: 'Shuffle and deal' }).click();
      await page.getByRole('button', { name: 'Save reading' }).click();
      await page.getByRole('link', { name: 'Open the journal' }).click();
      await page.getByRole('button', { name: 'Delete' }).waitFor();
    },
  ],
  [
    'a shared reading',
    async (page) => {
      await page.getByRole('button', { name: 'Shuffle and deal' }).click();
      await page.getByRole('button', { name: 'Save reading' }).click();
      const hash = await page.evaluate(() => {
        const [e] = JSON.parse(localStorage.getItem('tarot.history.v1')!);
        return btoa(JSON.stringify(e.reading))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      });
      await page.goto(`/#r=${hash}`);
      await page
        .getByRole('button', { name: 'Keep it in my journal' })
        .waitFor();
    },
  ],
  ['simulate, before dealing', async () => {}],
  [
    'simulate, dealt (Celtic Cross)',
    async (page) => {
      await page.getByLabel('Spread').selectOption('celtic-cross');
      await page.getByRole('button', { name: 'Shuffle and deal' }).click();
      await page.locator('.board .slot.filled').first().waitFor();
    },
  ],
  [
    'setup, empty',
    async (page) => {
      await page.getByRole('link', { name: 'Record a spread' }).click();
    },
  ],
  [
    'setup, card picked',
    async (page) => {
      await page.getByRole('link', { name: 'Record a spread' }).click();
      await page.locator('.palette-card').first().click();
    },
  ],
];

for (const scheme of ['light', 'dark'] as const) {
  for (const [name, setup] of views) {
    test(`a11y: ${name}, ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/#/reading');
      await setup(page);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`,
        ),
      ).toEqual([]);
    });
  }
}

test('a11y: every control shows a focus ring when tabbed to', async ({
  page,
}) => {
  await page.goto('/#/reading');
  const bad: string[] = [];
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        id: `${el.tagName.toLowerCase()}.${el.className}`,
        ring: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2,
      };
    });
    if (r && !r.ring) bad.push(r.id);
  }
  expect(bad).toEqual([]);
});

test('a11y: reduced motion turns transitions off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/reading');
  const long = await page.evaluate(
    () =>
      [...document.querySelectorAll('*')].filter((el) => {
        const d = getComputedStyle(el).transitionDuration.split(',');
        return d.some((x) => parseFloat(x) > 0.01);
      }).length,
  );
  expect(long).toBe(0);
});
