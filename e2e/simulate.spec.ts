import { expect, test } from '@playwright/test';

const spreads = [
  { id: 'single', positions: 1 },
  { id: 'three-card', positions: 3 },
  { id: 'celtic-cross', positions: 10 },
];

for (const { id, positions } of spreads) {
  test(`simulate deals ${positions} card(s) for ${id}`, async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Spread').selectOption(id);
    await expect(page.locator('.board .slot')).toHaveCount(positions);
    await expect(page.locator('.board .slot.filled')).toHaveCount(0);

    await page.getByRole('button', { name: 'Shuffle and deal' }).click();

    await expect(page.locator('.board .slot.filled')).toHaveCount(positions);
    await expect(page.getByText(/seed \d+/)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Interpretation' }),
    ).toBeVisible();
    // One note per card, plus relations, summary and advice.
    await expect(page.locator('.interpretation p')).not.toHaveCount(0);
  });
}

test('a new deal changes the seed', async ({ page }) => {
  await page.goto('/');
  const deal = page.getByRole('button', { name: 'Shuffle and deal' });
  await deal.click();
  const first = await page.getByText(/seed \d+/).textContent();
  await deal.click();
  await expect(page.getByText(/seed \d+/)).not.toHaveText(first ?? '');
});

test('a bad share link shows a dismissible message and the app still works', async ({
  page,
}, testInfo) => {
  await page.goto('/#r=garbage');
  const alert = page.getByRole('alert');
  await expect(alert).toContainText('could not be read');
  await page.screenshot({ path: testInfo.outputPath('bad-link.png') });

  await page.getByRole('button', { name: 'Shuffle and deal' }).click();
  await expect(page.locator('.board .slot.filled').first()).toBeVisible();
  await expect(alert).toBeVisible();

  await alert.getByRole('button', { name: 'Dismiss' }).click();
  await expect(alert).toHaveCount(0);
});
