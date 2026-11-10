import { expect, test } from '@playwright/test';

test('Celtic Cross: the crossing card is readable and does not cover Present', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.getByLabel('Spread').selectOption('celtic-cross');
  await page.getByRole('button', { name: 'Shuffle and deal' }).click();
  await expect(page.locator('.board .slot.filled')).toHaveCount(10);

  const present = page.locator('[data-position="present"]');
  const challenge = page.locator('[data-position="challenge"]');
  await expect(challenge.locator('.slot-label')).toHaveText('Challenge');
  expect(await challenge.evaluate((el) => getComputedStyle(el).transform)).toBe(
    'none',
  );

  const a = (await present.boundingBox())!;
  const b = (await challenge.boundingBox())!;
  const overlap =
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height;
  expect(overlap).toBe(false);

  await page
    .locator('.board')
    .screenshot({ path: testInfo.outputPath('celtic.png') });
});

test('a reversed card shows the word', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Spread').selectOption('celtic-cross');
  // Deal until some card is reversed (about half are).
  for (let i = 0; i < 20; i++) {
    await page.getByRole('button', { name: 'Shuffle and deal' }).click();
    if (await page.locator('.card-face.reversed').count()) break;
  }
  await expect(
    page.locator('.card-face.reversed .card-face-rev').first(),
  ).toHaveText('(reversed)');
});

for (const width of [360, 600, 1280]) {
  test(`no horizontal page scroll at ${width}px, Celtic Cross included`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByLabel('Spread').selectOption('celtic-cross');
    await page.getByRole('button', { name: 'Shuffle and deal' }).click();
    await expect(page.locator('.board .slot.filled')).toHaveCount(10);
    const m = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      board: document.querySelector('.board')!.getBoundingClientRect().right,
      aside: document.querySelector('.interpretation')!.getBoundingClientRect(),
      boardRect: document.querySelector('.board')!.getBoundingClientRect(),
    }));
    expect(m.scroll).toBeLessThanOrEqual(m.client);
    expect(m.board).toBeLessThanOrEqual(m.client);
    // Two columns from 56em (896px), one column below.
    const sideBySide = m.aside.left >= m.boardRect.right;
    expect(sideBySide).toBe(width >= 900);
    await page.screenshot({ path: testInfo.outputPath(`w${width}.png`) });
  });
}

test('setup palette cards use the card face', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Setup' }).click();
  const first = page.locator('.palette-card').first();
  await expect(first.locator('.card-face-name')).toBeVisible();
});
