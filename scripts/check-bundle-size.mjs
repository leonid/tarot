// Fails if the first download is over budget. "First download" is what
// dist/index.html loads before the page can show anything: the entry script,
// the scripts it preloads and the stylesheets. Screens and languages that load
// on demand do not count (see src/App.tsx and src/content/locales/index.ts).
//
// Usage: node scripts/check-bundle-size.mjs [dist]   (after `npm run build`)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 100; // gzip, kilobytes of 1000 bytes (as `vite build` prints them)

const dist = process.argv[2] ?? 'dist';
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

const urls = new Set();
for (const m of html.matchAll(
  /<(?:script|link)\b[^>]*?(?:src|href)="([^"]+\.(?:js|css))"[^>]*>/g,
)) {
  if (/rel="(?:icon|prefetch)"/.test(m[0])) continue;
  urls.add(m[1]);
}

let total = 0;
for (const url of urls) {
  const file = join(dist, url.startsWith(base) ? url.slice(base.length) : url);
  const kb = gzipSync(readFileSync(file)).length / 1000;
  total += kb;
  console.log(`${kb.toFixed(1).padStart(7)} kB  ${url}`);
}
console.log(
  `${total.toFixed(1).padStart(7)} kB  first download (budget ${BUDGET_KB} kB)`,
);

if (urls.size === 0) {
  console.error('No scripts found in index.html: is the build in', dist, '?');
  process.exit(1);
}
if (total > BUDGET_KB) {
  console.error(
    `Over budget by ${(total - BUDGET_KB).toFixed(1)} kB. Load the new code on demand ` +
      '(React.lazy / dynamic import) or raise the budget on purpose in scripts/check-bundle-size.mjs.',
  );
  process.exit(1);
}
