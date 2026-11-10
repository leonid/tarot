import { describe, expect, it } from 'vitest';
import tokens from './tokens.css?raw';

/** WCAG 2.x relative luminance and contrast ratio. */
function lum(hex: string): number {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

/** Reads `--name: #hex` pairs from one block of tokens.css. */
function colours(block: string): Record<string, string> {
  return Object.fromEntries(
    [...block.matchAll(/(--[a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((m) => [
      m[1]!,
      m[2]!,
    ]),
  );
}

const darkStart = tokens.indexOf('@media (prefers-color-scheme');
const themes = {
  light: colours(tokens.slice(0, darkStart)),
  dark: colours(tokens.slice(tokens.indexOf("[data-theme='dark']"))),
};

// Chip text sits on --surface; the page text sits on --bg.
const chipText = ['--gold', '--fire', '--water', '--air', '--earth'];

describe('chip and text contrast (WCAG AA)', () => {
  for (const [name, t] of Object.entries(themes)) {
    for (const fg of chipText)
      it(`${name}: ${fg} on --surface is at least 4.5:1`, () => {
        expect(ratio(t[fg]!, t['--surface']!)).toBeGreaterThanOrEqual(4.5);
      });
    it(`${name}: muted and body text on --surface are at least 4.5:1`, () => {
      expect(ratio(t['--text-muted']!, t['--surface']!)).toBeGreaterThanOrEqual(
        4.5,
      );
      expect(ratio(t['--text']!, t['--surface']!)).toBeGreaterThanOrEqual(4.5);
    });
    it(`${name}: borders reach 3:1 on --bg`, () => {
      expect(ratio(t['--border']!, t['--bg']!)).toBeGreaterThanOrEqual(3);
    });
  }

  it('parses real colours (guards against a vacuous pass)', () => {
    expect(Object.keys(themes.light)).toContain('--fire');
    expect(Object.keys(themes.dark)).toContain('--fire');
    expect(ratio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });
});
