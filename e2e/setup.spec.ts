import { expect, test, type Page } from '@playwright/test';

async function openSetup(page: Page, spread = 'three-card') {
  await page.goto('/#/reading');
  await page.getByRole('link', { name: 'Record a spread' }).click();
  await page.getByLabel('Spread').selectOption(spread);
}

const slot = (page: Page, id: string) =>
  page.locator(`[data-position="${id}"]`);

test('setup: place cards with the menus, flip one, clear one', async ({
  page,
}) => {
  await openSetup(page);

  await page.getByLabel('Past').selectOption({ label: 'The Fool' });
  await page.getByLabel('Present').selectOption({ label: 'The Tower' });
  await expect(page.locator('.board .slot.filled')).toHaveCount(2);
  await expect(slot(page, 'past')).toContainText('The Fool');

  // A placed card is disabled in the other menus (a card appears once).
  await expect(
    page.getByLabel('Future').locator('option', { hasText: 'The Fool' }),
  ).toBeDisabled();

  await page.getByLabel('Reversed').first().check();
  await expect(slot(page, 'past').locator('.card-face.reversed')).toHaveCount(
    1,
  );

  await page.getByLabel('Present').selectOption('');
  await expect(page.locator('.board .slot.filled')).toHaveCount(1);
});

test('setup: drag a card onto a slot with the mouse', async ({ page }) => {
  await openSetup(page);
  const card = page.locator('.palette-card').first();
  const name = (await card.locator('.card-face-name').innerText()).trim();
  // Board and cards on screen together, as a person would have them.
  await page.locator('.board').evaluate((el) => el.scrollIntoView());
  await expect(card).toBeInViewport({ ratio: 1 });
  // Explicit pointer steps: a single jump (dragTo) is sometimes missed by the
  // pointer sensor on WebKit, which then never sees the card over the slot.
  const from = (await card.boundingBox())!;
  const to = (await slot(page, 'present').boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
  await expect(slot(page, 'present')).toContainText(name);
  await expect(page.locator('.palette-card')).toHaveCount(21);
});

const live = (page: Page) => page.locator('[id^="DndLiveRegion"]');

/** Picks up the first palette card, moves with arrows, drops it. */
async function keyboardPlace(page: Page, keys: string[], slotId: string) {
  const card = page.locator('.palette-card').first();
  const name = (await card.locator('.card-face-name').innerText()).trim();
  await card.focus();
  await page.keyboard.press('Space'); // pick up
  await expect(live(page)).toContainText(`Picked up ${name}`);
  await page.waitForTimeout(50); // let the sensor attach its key listener
  for (const k of keys) await page.keyboard.press(k);
  const label = (
    await slot(page, slotId).locator('.slot-label').innerText()
  ).trim();
  // Each move is announced with the name of the position it is over.
  await expect(live(page)).toContainText(`${name} is over ${label}`);
  await page.keyboard.press('Space'); // drop
  await expect(slot(page, slotId)).toContainText(name);
  await expect(live(page)).toContainText(`${name} was placed in ${label}`);
  return name;
}

test('setup: place a card by keyboard drag', async ({ page }) => {
  await openSetup(page);
  const name = await keyboardPlace(page, ['ArrowUp', 'ArrowRight'], 'present');
  await expect(page.locator('.palette-card')).toHaveCount(21);
  expect(name).not.toBe('');
});

test('setup: fill a whole three-card spread with the keyboard only', async ({
  page,
}) => {
  await openSetup(page);
  // The first arrow takes the card to the spread's first position (Past);
  // after that the arrows jump from position to position.
  await keyboardPlace(page, ['ArrowUp'], 'past');
  await keyboardPlace(page, ['ArrowUp', 'ArrowRight'], 'present');
  await keyboardPlace(page, ['ArrowUp', 'ArrowRight', 'ArrowRight'], 'future');
  await expect(page.locator('.board .slot.filled')).toHaveCount(3);
  await expect(page.locator('.palette-card')).toHaveCount(19);
  await expect(page.getByText('Interpretation')).toBeVisible();
});

test('setup: place a card with clicks only', async ({ page }) => {
  await openSetup(page);
  const card = page.locator('.palette-card').first();
  const name = (await card.locator('.card-face-name').innerText()).trim();

  await card.click();
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('status').filter({ hasText: name }),
  ).toBeVisible();

  await slot(page, 'present').click();
  await expect(slot(page, 'present')).toContainText(name);
  await expect(page.locator('.palette-card')).toHaveCount(21);
  // The selection is spent: slots are plain again.
  await expect(page.locator('.slot.armed')).toHaveCount(0);

  // Clicking a selected card again puts it back.
  const next = page.locator('.palette-card').first();
  await next.click();
  await expect(page.locator('.slot.armed')).toHaveCount(3);
  await next.click();
  await expect(page.locator('.slot.armed')).toHaveCount(0);
});

test('setup: a placed card is turned over and taken off on the card itself', async ({
  page,
}) => {
  await openSetup(page);
  await page.locator('.palette-card').first().click();
  await slot(page, 'past').click();
  const past = slot(page, 'past');
  // One card is read as soon as it is placed; connections wait for the rest.
  await expect(page.getByText(/1 of 3 cards placed/)).toBeVisible();
  await expect(page.locator('.note-card')).toHaveCount(1);
  await expect(page.locator('.connections')).toHaveCount(0);

  await past.getByRole('button', { name: /^Turn .* over$/ }).click();
  await expect(past).toContainText('reversed');
  await expect(page.locator('.note-card')).toContainText('reversed');
  await past.getByRole('button', { name: /^Turn .* over$/ }).click();
  await expect(past).not.toContainText('reversed');

  await past.getByRole('button', { name: /^Take .* off the board$/ }).click();
  await expect(past).not.toHaveClass(/filled/);
  await expect(page.locator('.palette-card')).toHaveCount(22);
});

test('setup: the deck is shown in parts and searched by name', async ({
  page,
}) => {
  await openSetup(page);
  await expect(page.locator('.palette-card')).toHaveCount(22);
  await page.getByRole('button', { name: /^Cups/ }).click();
  await expect(page.locator('.palette-card')).toHaveCount(14);
  await page.getByRole('button', { name: /^All/ }).click();
  await expect(page.locator('.palette-card')).toHaveCount(78);
  // A search looks through the whole deck, whatever part is open.
  await page.getByRole('button', { name: /^Major Arcana/ }).click();
  await page.getByLabel('Find a card').fill('queen');
  await expect(page.locator('.palette-card')).toHaveCount(4);
  // Nothing on the screen scrolls inside a box of its own.
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
