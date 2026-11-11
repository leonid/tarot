// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs script without types
import { scan } from '../../scripts/check-no-secrets.mjs';

const ignored = (path: string) => {
  try {
    execFileSync('git', ['check-ignore', '-q', path]);
    return true;
  } catch {
    return false;
  }
};

describe('secret handling', () => {
  it('git-ignores the local secrets file', () => {
    expect(ignored('proxy/.dev.vars')).toBe(true);
    expect(ignored('proxy/.dev.vars.example')).toBe(false);
  });

  it('keeps the key out of wrangler.toml and the example file', async () => {
    const { readFileSync } = await import('node:fs');
    for (const f of ['proxy/wrangler.toml', 'proxy/.dev.vars.example'])
      expect(readFileSync(f, 'utf8')).not.toMatch(/sk-/);
  });

  it('flags key-like strings in a built bundle and passes a clean one', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dist-'));
    writeFileSync(join(dir, 'ok.js'), 'console.log("hello")');
    expect(scan(dir)).toEqual([]);
    writeFileSync(join(dir, 'bad.js'), 'const k="sk-ant-api03-abcdefgh1234"');
    expect(scan(dir)).toHaveLength(1);
    writeFileSync(join(dir, 'name.js'), 'process.env.ANTHROPIC_API_KEY');
    expect(scan(dir)).toHaveLength(2);
  });
});
