import { expect, test } from '@playwright/test';
import { SCREENS, tinyText } from './screens';

// No text under 12 px on a desktop screen either (R12). Phones are measured
// in touch.spec.ts, together with the size of what can be pressed.
for (const [name, open] of SCREENS) {
  test(`text size: ${name} has no text under 12 px`, async ({ page }) => {
    await open(page);
    await page.locator('.app-footer').waitFor();
    expect(await tinyText(page)).toEqual([]);
  });
}
