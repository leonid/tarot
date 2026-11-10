import { expect, test, type Page } from '@playwright/test';

/** Everything a reading shows that must survive saving and sharing. */
async function readingState(page: Page) {
  return {
    mode: await page.getByRole('tab', { selected: true }).textContent(),
    question: await page.getByLabel('Question').inputValue(),
    deck: await page.getByLabel('Deck').inputValue(),
    spread: await page.getByLabel('Spread').inputValue(),
    // Position, card and "(reversed)" for each slot, in order.
    slots: await page.locator('.board .slot').allTextContents(),
    reversed: await page.locator('.board .card-face.reversed').count(),
    interpretation: await page.locator('.interpretation').textContent(),
  };
}

test('a saved reading survives a reload and opens as it was', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Question').fill('Should I move?');
  await page.getByLabel('Spread').selectOption('celtic-cross');
  await page.getByRole('button', { name: 'Shuffle and deal' }).click();
  await expect(page.locator('.board .slot.filled')).toHaveCount(10);
  const seed = await page.getByText(/seed \d+/).textContent();
  const original = await readingState(page);

  await page.getByRole('button', { name: 'Save reading' }).click();
  await expect(page.getByText('Saved.')).toBeVisible();

  await page.reload();
  // A reload starts a fresh reading; only the saved list is kept.
  await expect(page.locator('.board .slot.filled')).toHaveCount(0);
  await expect(page.getByLabel('Question')).toHaveValue('');

  await page.getByText('Saved readings (1)').click();
  await expect(
    page.getByText(/Should I move\? \(Celtic Cross\)/),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open', exact: true }).click();

  await expect(page.locator('.board .slot.filled')).toHaveCount(10);
  await expect(page.getByText(/seed \d+/)).toHaveText(seed ?? '');
  expect(await readingState(page)).toEqual(original);
});

test('a copied share link opens the same reading in a fresh browser', async ({
  page,
  browser,
}) => {
  // Capture the copied text: reading the real clipboard needs a permission
  // that WebKit and Firefox do not grant to tests.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: (text: string) => {
          (window as unknown as { copied: string }).copied = text;
          return Promise.resolve();
        },
      },
    });
  });

  await page.goto('/');
  await page.getByRole('tab', { name: 'Setup' }).click();
  await page.getByLabel('Question').fill('What about "this" & that?');
  await page.getByText('Place with menus').click();
  await page.getByLabel('Past').selectOption({ label: 'The Fool' });
  await page.getByLabel('Present').selectOption({ label: 'The Tower' });
  await page.getByLabel('Future').selectOption({ label: 'Queen of Cups' });
  await page.getByLabel('Reversed').nth(1).check();
  await expect(page.locator('.board .card-face.reversed')).toHaveCount(1);
  const original = await readingState(page);

  await page.getByRole('button', { name: 'Copy share link' }).click();
  await expect(page.getByText('Link copied.')).toBeVisible();
  const url = await page.evaluate(
    () => (window as unknown as { copied: string }).copied,
  );
  expect(url).toMatch(/#r=.+/);

  // A new context has no storage in common with the first one.
  const other = await browser.newContext();
  const fresh = await other.newPage();
  await fresh.goto(url);
  await expect(fresh.locator('.board .slot.filled')).toHaveCount(3);
  await expect(fresh.getByRole('alert')).toHaveCount(0);
  expect(await readingState(fresh)).toEqual(original);

  // The opened link leaves the address bar, so a reload starts fresh and does
  // not bring the shared reading back over later work.
  await expect(fresh).not.toHaveURL(/#r=/);
  await fresh.reload();
  await expect(fresh.locator('.board .slot.filled')).toHaveCount(0);

  // Pasting the link into the loaded page opens it without a reload.
  await fresh.goto(url);
  await expect(fresh.locator('.board .slot.filled')).toHaveCount(3);
  await expect(fresh).not.toHaveURL(/#r=/);
  expect(await readingState(fresh)).toEqual(original);
  await other.close();
});
