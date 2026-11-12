import { expect, test } from '@playwright/test';

for (const scheme of ['light', 'dark'] as const) {
  test(`the ${scheme} theme follows the OS and renders the board`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/reading');
    await page.getByLabel('Spread').selectOption('three-card');
    await page.getByRole('button', { name: 'Shuffle and deal' }).click();
    await expect(page.locator('.board .slot.filled')).toHaveCount(3);

    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(bg).toBe(
      scheme === 'light' ? 'rgb(246, 240, 228)' : 'rgb(20, 16, 28)',
    );

    await page.screenshot({
      path: testInfo.outputPath(`theme-${scheme}.png`),
      fullPage: true,
    });
  });
}

test('data-theme overrides the OS setting', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/#/reading');
  await page.evaluate(() =>
    document.documentElement.setAttribute('data-theme', 'light'),
  );
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).toBe('rgb(246, 240, 228)');
});

const LIGHT_BG = 'rgb(246, 240, 228)';
const DARK_BG = 'rgb(20, 16, 28)';
const bgOf = (page: import('@playwright/test').Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test('the theme picker overrides the OS and survives a reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/#/reading');
  expect(await bgOf(page)).toBe(DARK_BG);

  await page.getByLabel('Theme').selectOption('light');
  expect(await bgOf(page)).toBe(LIGHT_BG);
  await page.reload();
  await expect(page.getByLabel('Theme')).toHaveValue('light');
  expect(await bgOf(page)).toBe(LIGHT_BG);

  await page.getByLabel('Theme').selectOption('system');
  expect(await bgOf(page)).toBe(DARK_BG);
});

test('a saved theme is applied before any script bundle runs (no flash)', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() =>
    localStorage.setItem('tarot.theme.v1', 'light'),
  );
  // Without the app bundle, only the inline script in index.html can set it.
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto('/#/reading');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await bgOf(page)).toBe(LIGHT_BG);
});
