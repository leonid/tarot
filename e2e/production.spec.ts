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

// R14: the built page carries a policy that allows only its own files, and
// every screen works under it (no blocked script, style, image or call).
import { SCREENS } from './screens';

test('the page declares a Content-Security-Policy that allows only itself', async ({
  page,
}) => {
  await page.goto('/');
  const csp = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute('content');
  expect(csp).toContain(`default-src 'self'`);
  expect(csp).not.toMatch(/script-src[^;]*unsafe/);
  expect(csp).not.toMatch(/https?:\/\//); // no proxy configured in the test build
});

for (const [name, open] of SCREENS) {
  test(`no screen breaks the policy: ${name}`, async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __csp: string[] }).__csp = [];
      document.addEventListener('securitypolicyviolation', (e) =>
        (window as unknown as { __csp: string[] }).__csp.push(
          `${e.violatedDirective} ${e.blockedURI}`,
        ),
      );
    });
    await open(page);
    // Theme: the inline script is allowed by its hash, so a saved choice applies.
    expect(
      await page.evaluate(
        () => (window as unknown as { __csp: string[] }).__csp,
      ),
    ).toEqual([]);
  });
}

test('the saved theme is applied before the app loads, under the policy', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('tarot.theme.v1', 'dark'),
  );
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
