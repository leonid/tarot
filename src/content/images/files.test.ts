// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  IMAGE_BUDGET_BYTES,
  IMAGE_DIR,
  IMAGE_WIDTHS,
  imageFile,
  imageHeight,
} from './files';
import rws1909 from './rws-1909.json';

/**
 * The optimised files written by scripts/optimise-images.mjs. If this fails
 * after a change to the manifest or the settings, rerun the script.
 */
const dir = `public/${IMAGE_DIR}`;

/** Width and height from a lossy WebP header (VP8 chunk). */
function webpSize(path: string): { width: number; height: number } {
  const b = readFileSync(path);
  expect(b.toString('ascii', 0, 4)).toBe('RIFF');
  expect(b.toString('ascii', 8, 16)).toBe('WEBPVP8 ');
  return {
    width: b.readUInt16LE(26) & 0x3fff,
    height: b.readUInt16LE(28) & 0x3fff,
  };
}

describe('optimised card images', () => {
  const expected = rws1909.images.flatMap((i) =>
    IMAGE_WIDTHS.map((w) => imageFile(i.cardId, w)),
  );

  it('has every width of every card in the manifest', () => {
    for (const file of expected)
      expect(existsSync(`public/${file}`), file).toBe(true);
  });

  it('has no file the manifest does not account for', () => {
    expect(readdirSync(dir).sort()).toEqual(
      expected.map((f) => f.slice(IMAGE_DIR.length + 1)).sort(),
    );
  });

  it('stays under the size budget', () => {
    const total = readdirSync(dir).reduce(
      (sum, f) => sum + statSync(`${dir}/${f}`).size,
      0,
    );
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThanOrEqual(IMAGE_BUDGET_BYTES);
  });

  it('gives every file its stated width and the common shape', () => {
    for (const image of rws1909.images)
      for (const width of IMAGE_WIDTHS)
        expect(webpSize(`public/${imageFile(image.cardId, width)}`)).toEqual({
          width,
          height: imageHeight(width),
        });
  });
});
