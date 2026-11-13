// @vitest-environment node
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildCsp } from './csp';

const page = (script: string) =>
  `<head><script>${script}</script><script type="module" src="/a.js"></script></head>`;

describe('the Content-Security-Policy', () => {
  it('allows an inline script only by its hash, and a file script by self', () => {
    const csp = buildCsp(page('var a = 1;'));
    const hash = createHash('sha256').update('var a = 1;').digest('base64');
    expect(csp).toContain(`script-src 'self' 'sha256-${hash}'`);
    expect(csp).not.toContain('unsafe-inline; ');
    expect(csp).not.toMatch(/script-src[^;]*unsafe/);
  });

  it('allows connections to itself and to the proxy origin only', () => {
    expect(buildCsp(page(''))).toContain(`connect-src 'self'`);
    expect(buildCsp(page(''))).not.toMatch(/connect-src[^;]*https/);
    const csp = buildCsp(
      page(''),
      'https://proxy.example.workers.dev/interpret',
    );
    expect(csp).toContain(
      `connect-src 'self' https://proxy.example.workers.dev;`,
    );
  });

  it('ignores a proxy URL that is not a URL', () => {
    expect(buildCsp(page(''), 'not a url')).toContain(`connect-src 'self';`);
  });

  it('forbids plugins, a changed base and form posts', () => {
    const csp = buildCsp(page(''));
    for (const d of [
      `object-src 'none'`,
      `base-uri 'none'`,
      `form-action 'none'`,
    ])
      expect(csp).toContain(d);
  });
});
