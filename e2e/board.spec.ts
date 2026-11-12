import { expect, test } from '@playwright/test';

test('Celtic Cross: the crossing card lies across Present and both stay readable', async ({
  page,
}, testInfo) => {
  await page.goto('/#/reading');
  await page.getByLabel('Spread').selectOption('celtic-cross');
  const empty = (await page.locator('.board').boundingBox())!;
  // The grid is the same size empty and filled, whatever is dealt: nothing
  // moves on dealing.
  for (let i = 0; i < 6; i++) {
    await page.getByRole('button', { name: 'Shuffle and deal' }).click();
    await expect(page.locator('.board .slot.filled')).toHaveCount(10);
    await expect(page.locator('.interpretation .advice')).toBeVisible();
    const dealt = (await page.locator('.board').boundingBox())!;
    expect(dealt.width).toBeCloseTo(empty.width, 0);
    expect(dealt.height).toBeCloseTo(empty.height, 0);
  }

  const present = page.locator('[data-position="present"]');
  const challenge = page.locator('[data-position="challenge"]');
  await expect(challenge.locator('.slot-label')).toHaveText('Challenge');
  // The position and its text are not turned; only the picture lies sideways.
  expect(await challenge.evaluate((el) => getComputedStyle(el).transform)).toBe(
    'none',
  );
  const box = async (l: ReturnType<typeof page.locator>) =>
    (await l.boundingBox())!;
  const hit = (
    a: { x: number; y: number; width: number; height: number },
    b: typeof a,
  ) =>
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height;
  const b = await box(challenge);
  // It lies across the picture of Present, wider than tall...
  expect(hit(await box(present.locator('.card-image-img')), b)).toBe(true);
  const pic = await box(challenge.locator('.card-image-frame'));
  expect(pic.width).toBeGreaterThan(pic.height);
  // ...and covers neither the label nor the name of the card under it.
  expect(hit(await box(present.locator('.slot-label')), b)).toBe(false);
  expect(hit(await box(present.locator('.card-face-name')), b)).toBe(false);

  await page
    .locator('.board')
    .screenshot({ path: testInfo.outputPath('celtic.png') });
});

test('one scroll per page: the reading is not a scroll box of its own', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto('/#/reading');
  await page.getByLabel('Spread').selectOption('celtic-cross');
  await page.getByRole('button', { name: 'Shuffle and deal' }).click();
  await expect(page.locator('.interpretation .advice')).toBeVisible();
  const boxed = await page.evaluate(
    () =>
      [...document.querySelectorAll('.page *')].filter((e) => {
        const s = getComputedStyle(e);
        return (
          /(auto|scroll)/.test(s.overflowY) &&
          e.scrollHeight > e.clientHeight + 2
        );
      }).length,
  );
  expect(boxed).toBe(0);
});

test('record a spread: the board keeps its size as cards are placed', async ({
  page,
}) => {
  await page.goto('/#/record');
  await page.getByLabel('Spread').selectOption('celtic-cross');
  const before = (await page.locator('.board').boundingBox())!;
  // A long name too: it takes two lines on the card that lies sideways.
  await page.getByLabel('Find a card').fill('high priestess');
  await page.locator('.palette-card').first().click();
  await page.locator('[data-position="challenge"]').click();
  await page.getByLabel('Find a card').fill('');
  await page.locator('.palette-card').first().click();
  await page.locator('[data-position="present"]').click();
  const after = (await page.locator('.board').boundingBox())!;
  expect(after.height).toBeCloseTo(before.height, 0);
  expect(after.width).toBeCloseTo(before.width, 0);
});

test('a reversed card shows the word', async ({ page }) => {
  await page.goto('/#/reading');
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
    await page.goto('/#/reading');
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
  await page.goto('/#/reading');
  await page.getByRole('link', { name: 'Record a spread' }).click();
  const first = page.locator('.palette-card').first();
  await expect(first.locator('.card-face-name')).toBeVisible();
});
