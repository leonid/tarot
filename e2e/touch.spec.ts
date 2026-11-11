import { expect, test, type Page } from '@playwright/test';

async function openSetup(page: Page) {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Setup' }).click();
  await page.getByLabel('Spread').selectOption('three-card');
}

const centre = async (page: Page, selector: string) => {
  const b = (await page.locator(selector).first().boundingBox())!;
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
};

type Point = { x: number; y: number };

/**
 * Real touch input through the DevTools protocol. Only Chromium has it;
 * WebKit offers no way to send a held touch, so the drag test is skipped
 * there and covered by the real-device note in docs/research/touch.md.
 */
async function touchDrag(page: Page, from: Point, to: Point, holdMs: number) {
  const cdp = await page.context().newCDPSession(page);
  const send = (type: 'touchStart' | 'touchMove' | 'touchEnd', p?: Point) =>
    cdp.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: p ? [{ x: p.x, y: p.y }] : [],
    });
  await send('touchStart', from);
  await page.waitForTimeout(holdMs);
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await send('touchMove', {
      x: from.x + ((to.x - from.x) * i) / steps,
      y: from.y + ((to.y - from.y) * i) / steps,
    });
    await page.waitForTimeout(30);
  }
  return () => send('touchEnd');
}

test('touch: the palette does not block page scrolling', async ({ page }) => {
  await openSetup(page);
  const card = page.locator('.palette-card').first();
  const action = await card.evaluate((el) => getComputedStyle(el).touchAction);
  expect(action).not.toBe('none');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('touch: a quick swipe over a card scrolls and does not drag', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'needs real touch input (CDP)');
  await openSetup(page);
  const from = await centre(page, '.palette-card');
  // No hold: the finger moves at once, as in a scroll.
  const end = await touchDrag(page, from, { x: from.x, y: from.y - 120 }, 0);
  await end();
  await expect(page.locator('.board .slot.filled')).toHaveCount(0);
  await expect(page.locator('.palette-card')).toHaveCount(78);
});

test('touch: press and hold a card, drag it onto a position', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'needs real touch input (CDP)');
  await openSetup(page);
  const card = page.locator('.palette-card').first();
  const name = (await card.locator('.card-face-name').innerText()).trim();
  await page.locator('[data-position="present"]').scrollIntoViewIfNeeded();
  const from = await centre(page, '.palette-card');
  const to = await centre(page, '[data-position="present"]');
  const end = await touchDrag(page, from, to, 400); // hold > 250 ms
  await expect(page.locator('[id^="DndLiveRegion"]')).toContainText(
    `${name} is over Present`,
  );
  await end();
  await expect(page.locator('[data-position="present"]')).toHaveClass(/filled/);
  await expect(page.locator('.palette-card')).toHaveCount(77);
});
