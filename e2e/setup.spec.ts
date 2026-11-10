import { expect, test, type Page } from '@playwright/test';

async function openSetup(page: Page, spread = 'three-card') {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Setup' }).click();
  await page.getByLabel('Spread').selectOption(spread);
}

const slot = (page: Page, id: string) =>
  page.locator(`[data-position="${id}"]`);

test('setup: place cards with the menus, flip one, clear one', async ({
  page,
}) => {
  await openSetup(page);
  await page.getByText('Place with menus').click();

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
  await card.dragTo(slot(page, 'present'));
  await expect(slot(page, 'present')).toContainText(name);
  await expect(page.locator('.palette-card')).toHaveCount(77);
});

test('setup: place a card by keyboard drag', async ({ page }) => {
  await openSetup(page);
  const card = page.locator('.palette-card').first();
  const name = (await card.locator('.card-face-name').innerText()).trim();
  await card.focus();
  await page.keyboard.press('Space'); // pick up
  // Keyboard sensor moves 25px per arrow press; walk toward the Present slot.
  const from = (await card.boundingBox())!;
  const to = (await slot(page, 'present').boundingBox())!;
  const dx = to.x + to.width / 2 - (from.x + from.width / 2);
  const dy = to.y + to.height / 2 - (from.y + from.height / 2);
  for (let i = 0; i < Math.ceil(Math.abs(dy) / 25); i++)
    await page.keyboard.press(dy > 0 ? 'ArrowDown' : 'ArrowUp');
  for (let i = 0; i < Math.ceil(Math.abs(dx) / 25); i++)
    await page.keyboard.press(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
  await page.keyboard.press('Space'); // drop
  await expect(slot(page, 'present')).toContainText(name);
});
