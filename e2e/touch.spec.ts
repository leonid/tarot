import { expect, test, type Page } from '@playwright/test';

async function openSetup(page: Page) {
  await page.goto('/#/reading');
  await page.getByRole('link', { name: 'Record a spread' }).click();
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
  await expect(page.locator('.palette-card')).toHaveCount(22);
});

test('touch: press and hold a card, drag it onto a position', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'needs real touch input (CDP)');
  await openSetup(page);
  const card = page.locator('.palette-card').first();
  const name = (await card.locator('.card-face-name').innerText()).trim();
  // The cards sit under the board on a phone, so both fit on one screen.
  // Keep them clear of the screen edges, where a drag scrolls the page.
  await page.locator('.board').evaluate((el) => {
    el.scrollIntoView();
    window.scrollBy(0, -160);
  });
  await expect(card).toBeInViewport({ ratio: 1 });
  const from = await centre(page, '.palette-card');
  const to = await centre(page, '[data-position="present"]');
  const end = await touchDrag(page, from, to, 400); // hold > 250 ms
  await expect(page.locator('[id^="DndLiveRegion"]')).toContainText(
    `${name} is over Present`,
  );
  await end();
  await expect(page.locator('[data-position="present"]')).toHaveClass(/filled/);
  await expect(page.locator('.palette-card')).toHaveCount(21);
});

// What a finger and an eye need, measured on every screen (R12).
const SCREENS: [
  string,
  (page: import('@playwright/test').Page) => Promise<void>,
][] = [
  ['home', async (page) => void (await page.goto('/'))],
  [
    'reading',
    async (page) => {
      await page.goto('/#/reading');
      await page.getByLabel('Spread').selectOption('celtic-cross');
      await page.getByRole('button', { name: 'Shuffle and deal' }).click();
      await page.locator('.interpretation .advice').waitFor();
    },
  ],
  [
    'record',
    async (page) => {
      await page.goto('/#/record');
      await page.locator('.palette-card').first().click();
      await page.locator('[data-position="past"]').click();
    },
  ],
  ['cards', async (page) => void (await page.goto('/#/cards'))],
  [
    'one card',
    async (page) => void (await page.goto('/#/cards/major-00-fool')),
  ],
  ['journal', async (page) => void (await page.goto('/#/journal'))],
  ['about', async (page) => void (await page.goto('/#/about'))],
];
for (const [name, open] of SCREENS) {
  test(`touch: ${name} has 44 px targets and no text under 12 px`, async ({
    page,
  }) => {
    await open(page);
    await page.locator('.app-footer').waitFor();
    const found = await page.evaluate(() => {
      const seen = (el: Element) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const say = (el: Element) =>
        `${el.tagName.toLowerCase()}.${el.className} "${(el.textContent ?? '').trim().slice(0, 30)}"`;
      const small: string[] = [];
      for (const el of document.querySelectorAll(
        'a, button, select, summary, input, [role="button"], [aria-pressed]',
      )) {
        if (!seen(el)) continue;
        // A link inside a sentence is exempt; its line is the target.
        if (el.tagName === 'A' && getComputedStyle(el).display === 'inline')
          continue;
        // A checkbox or radio is pressed through its label.
        const box =
          el instanceof HTMLInputElement &&
          (el.type === 'checkbox' || el.type === 'radio')
            ? (el.closest('label') ?? el)
            : el;
        const r = box.getBoundingClientRect();
        if (r.height < 43.5 || r.width < 43.5)
          small.push(
            `${say(el)} ${Math.round(r.width)}x${Math.round(r.height)}`,
          );
      }
      const tiny: string[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement!;
        if (!n.textContent?.trim() || !seen(el)) continue;
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < 12) tiny.push(`${say(el)} ${size}px`);
      }
      return { small: [...new Set(small)], tiny: [...new Set(tiny)] };
    });
    expect(found).toEqual({ small: [], tiny: [] });
  });
}
