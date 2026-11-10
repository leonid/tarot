import { expect, test } from '@playwright/test';

for (const scheme of ['light', 'dark'] as const) {
  test(`the ${scheme} theme follows the OS and renders the board`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');
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
  await page.goto('/');
  await page.evaluate(() =>
    document.documentElement.setAttribute('data-theme', 'light'),
  );
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).toBe('rgb(246, 240, 228)');
});
