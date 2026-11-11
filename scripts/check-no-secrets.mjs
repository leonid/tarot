// Fails if the built client bundle contains anything that looks like an API key.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PATTERNS = [
  [/sk-ant-[A-Za-z0-9_-]{8,}/, 'Anthropic key'],
  [/ANTHROPIC_API_KEY/, 'key variable name'],
  [/\bsk-[A-Za-z0-9]{20,}/, 'secret-looking sk- token'],
];

export function scan(dir) {
  const hits = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) hits.push(...scan(path));
    else if (/\.(js|css|html|map|json|txt)$/.test(name)) {
      const text = readFileSync(path, 'utf8');
      for (const [re, label] of PATTERNS)
        if (re.test(text)) hits.push(`${path}: ${label}`);
    }
  }
  return hits;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const hits = scan(process.argv[2] ?? 'dist');
  if (hits.length) {
    console.error('Possible secret in the client bundle:\n' + hits.join('\n'));
    process.exit(1);
  }
  console.log('No key-like strings in the client bundle.');
}
