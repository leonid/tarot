import { expect, test } from '@playwright/test';

test('learn the cards: find a card, read it, walk to the next', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('a.goal', { hasText: 'Learn the cards' }).click();
  await expect(page.locator('.card-link')).toHaveCount(78);

  await page.getByLabel('Find a card').fill('tower');
  await expect(page.locator('.card-link')).toHaveCount(1);
  await page.locator('.card-link').click();

  await expect(page).toHaveURL(/#\/cards\/major-16-tower$/);
  await expect(page.getByRole('heading', { name: 'The Tower' })).toBeFocused();
  await expect(page).toHaveTitle(/The Tower/);
  for (const part of [
    'Upright',
    'Reversed',
    'What it is built from',
    'Waite, 1911',
  ])
    await expect(page.getByRole('heading', { name: part })).toBeVisible();
  // The picture is the large one, not the board thumbnail.
  const art = (await page.locator('.card-page-art img').boundingBox())!;
  expect(art.width).toBeGreaterThan(200);

  await page.getByRole('link', { name: /The Star/ }).click();
  await expect(page).toHaveURL(/#\/cards\/major-17-star$/);

  // Back is the browser's: the search is still there.
  await page.goBack();
  await page.goBack();
  await expect(page.getByLabel('Find a card')).toHaveValue('tower');
});

for (const width of [390, 1280])
  test(`a card page has no sideways scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/#/cards/pentacles-10-ten');
    await expect(page.locator('.card-page-art img')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
  });
