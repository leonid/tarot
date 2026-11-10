import { expect, test } from '@playwright/test';

test('the app loads and shows its title', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');

  await expect(page).toHaveTitle(/tarot/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});
