import { expect, test } from '@playwright/test';

const loaded = (page: import('@playwright/test').Page) =>
  page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((f) => f.status === 'loaded')
      .map((f) => `${f.family} ${f.weight} ${f.unicodeRange}`);
  });

test('headings and card names use the self-hosted serif in English and Russian', async ({
  page,
}, testInfo) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(new URL(r.url()).host));

  await page.goto('/');
  await page.getByLabel('Spread').selectOption('three-card');
  await page.getByRole('button', { name: 'Shuffle and deal' }).click();

  const family = (sel: string) =>
    page
      .locator(sel)
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(await family('h1')).toContain('EB Garamond');
  expect(await family('.card-face-name')).toContain('EB Garamond');
  expect(await family('body')).toContain('JetBrains Sans');
  expect(
    (await loaded(page)).some((f) => /^EB Garamond 600 .*20AC/i.test(f)),
  ).toBe(true);

  await page.getByLabel('Language').selectOption('ru');
  await page.getByRole('button', { name: /./ }).first().waitFor();
  const slot = page.locator('.card-face-name').first();
  await expect(slot).toHaveText(/[А-Яа-яЁё]/);
  const faces = await loaded(page);
  expect(faces.some((f) => /^EB Garamond 600 .*45F/i.test(f))).toBe(true);
  expect(faces.some((f) => f.startsWith('JetBrains Sans'))).toBe(true);

  await page.screenshot({
    path: testInfo.outputPath('fonts-ru.png'),
    fullPage: true,
  });
  // Nothing may come from a font CDN.
  expect(requests.filter((h) => /gstatic|googleapis|fonts\./.test(h))).toEqual(
    [],
  );
});
