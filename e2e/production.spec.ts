import { expect, test } from '@playwright/test';

// The e2e suite runs against the production build, so this is what ships.

test('the pseudo-locale is not offered in a production build', async ({
  page,
}) => {
  await page.goto('/');
  const language = page.getByLabel('Language');
  await expect(language.locator('option')).toHaveText(['English', 'Русский']);
  await expect(language.locator('option[value="en-XA"]')).toHaveCount(0);
});

test('no script of the production build carries the pseudo-locale', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const scripts = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map((e) => e.name)
      .filter((url) => /\.js(\?|$)/.test(url)),
  );
  expect(scripts.length).toBeGreaterThan(0);
  for (const url of scripts) {
    const body = await (await request.get(url)).text();
    expect(body, url).not.toContain('⟦');
    expect(body, url).not.toContain('en-XA');
  }
});
