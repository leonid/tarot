import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';

/**
 * The Content-Security-Policy for the built page: the app's own files, plus
 * calls to the proxy (when one is configured) and nothing else. Inline scripts
 * are allowed only by hash. React sets style attributes, so those (and only
 * those) may be inline.
 */
export function buildCsp(html: string, proxyUrl?: string): string {
  const hashes = [
    ...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g),
  ].map(
    (m) => `'sha256-${createHash('sha256').update(m[1]!).digest('base64')}'`,
  );
  let proxyOrigin = '';
  try {
    if (proxyUrl) proxyOrigin = new URL(proxyUrl).origin;
  } catch {
    // An unparseable URL adds nothing to the policy; the AI option fails closed.
  }
  return [
    `default-src 'self'`,
    `script-src 'self' ${hashes.join(' ')}`.trim(),
    `style-src 'self'`,
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `connect-src 'self'${proxyOrigin ? ` ${proxyOrigin}` : ''}`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `form-action 'none'`,
  ].join('; ');
}

/** Adds the policy as a <meta> tag in the production build only: dev needs inline scripts. */
export function cspPlugin(proxyUrl: string | undefined): Plugin {
  return {
    name: 'tarot-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const tag = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(html, proxyUrl)}" />`;
        return html.replace('<head>', `<head>\n    ${tag}`);
      },
    },
  };
}
