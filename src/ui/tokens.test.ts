import { describe, expect, it } from 'vitest';

// Raw colour, px and rem values belong in tokens.css only (DESIGN.md, D1).
const RAW = /#[0-9a-fA-F]{3,8}\b|\b\d*\.?\d+(px|rem)\b/;

const files = import.meta.glob<string>('../**/*.{css,ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const entries = Object.entries(files);
const tokens =
  entries.find(([path]) => path.endsWith('/tokens.css'))?.[1] ?? '';

describe('design tokens', () => {
  it('scans the stylesheets and components', () => {
    const paths = entries.map(([path]) => path);
    expect(paths.some((p) => p.endsWith('styles.css'))).toBe(true);
    expect(paths.some((p) => p.endsWith('SpreadBoard.tsx'))).toBe(true);
    expect(tokens).toContain('--bg:');
  });

  it('keeps raw colour, px and rem literals out of everything but tokens.css', () => {
    const offenders = entries
      .filter(
        ([path]) => !/\.test\.tsx?$/.test(path) && !path.endsWith('tokens.css'),
      )
      .flatMap(([path, source]) =>
        source
          .split('\n')
          .map((text, i) => ({ text, at: `${path}:${i + 1}` }))
          .filter(
            ({ text }) => RAW.test(text) && !text.trimStart().startsWith('//'),
          )
          .map(({ at, text }) => `${at}: ${text.trim()}`),
      );
    expect(offenders).toEqual([]);
  });

  it('has a dark override for every colour token', () => {
    const names = (block: string) =>
      [...block.matchAll(/(--[a-z0-9-]+):/g)].map((m) => m[1]);
    const light = tokens.slice(
      0,
      tokens.indexOf('@media (prefers-color-scheme'),
    );
    const dark = tokens.slice(tokens.indexOf("[data-theme='dark']"));
    const colours = names(light).filter((n) =>
      /^--(bg|surface|text|text-muted|border|accent|accent-contrast|gold|danger|fire|water|air|earth|lift)$/.test(
        n ?? '',
      ),
    );
    expect(colours).toHaveLength(14);
    for (const n of colours) expect(names(dark)).toContain(n);
  });
});
