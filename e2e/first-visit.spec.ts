import { expect, test } from '@playwright/test';

test('first visit: one tap from the home screen to a dealt reading', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.home-intro')).toContainText(
    'For reflection, not prediction or advice.',
  );
  await page.getByRole('button', { name: 'Deal a reading now' }).click();
  await expect(page).toHaveURL(/#\/reading$/);
  await expect(page.locator('.board .slot.filled')).toHaveCount(3);
  await expect(page.locator('.interpretation .advice')).toBeVisible();
  // Back home, the reading is offered again, not dealt over.
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(
    page.getByRole('button', { name: 'Continue your reading' }),
  ).toBeVisible();
});

test('the footer leads to about, sources and licence', async ({ page }) => {
  await page.goto('/#/journal');
  const footer = page.getByRole('contentinfo');
  await footer.getByRole('link', { name: 'Licence' }).click();
  await expect(page).toHaveURL(/#\/about\/licence$/);
  await expect(page.getByRole('heading', { name: 'Licence' })).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Sources' })).toBeVisible();
});

test('the page describes itself to browsers and link previews', async ({
  page,
}) => {
  await page.goto('/');
  for (const sel of [
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
  ])
    expect(
      (await page.locator(sel).getAttribute('content'))!.length,
    ).toBeGreaterThan(4);
  const icon = await page.locator('link[rel="icon"]').getAttribute('href');
  const res = await page.request.get(new URL(icon!, page.url()).href);
  expect(res.ok()).toBe(true);
  expect(res.headers()['content-type']).toContain('svg');
});

test.describe('card-turn reveal', () => {
  const turn = (page: import('@playwright/test').Page) =>
    page
      .locator('.board .slot .card-face')
      .last()
      .evaluate((el) => {
        const s = getComputedStyle(el);
        return [s.animationName, s.animationDuration, s.animationDelay];
      });

  test.describe('with motion', () => {
    test.use({ contextOptions: { reducedMotion: 'no-preference' } });
    test('dealt cards turn over one after another', async ({ page }) => {
      await page.goto('/#/reading');
      await page.getByRole('button', { name: 'Shuffle and deal' }).click();
      const [name, duration, delay] = await turn(page);
      expect(name).toBe('card-turn');
      expect(parseFloat(duration!)).toBeGreaterThan(0);
      expect(parseFloat(delay!)).toBeGreaterThan(0);
    });
  });

  test('with reduced motion the cards simply appear', async ({ page }) => {
    await page.goto('/#/reading');
    await page.getByRole('button', { name: 'Shuffle and deal' }).click();
    const [, duration, delay] = await turn(page);
    expect(parseFloat(duration!)).toBe(0);
    expect(parseFloat(delay!)).toBe(0);
  });
});
