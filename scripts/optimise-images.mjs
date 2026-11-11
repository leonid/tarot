// Downloads the card scans named in the image manifest and writes optimised
// copies for the app.
//
//   node scripts/optimise-images.mjs
//
// Originals go to .cache/card-images/ (not committed) and are downloaded only
// once, one at a time with a pause; Commons may ask for long waits, which the
// script obeys. Output: public/cards/rws-1909/<cardId>-<width>.webp for each
// width, all in one shape (settings in src/content/images/files.ts). The total
// size is checked against the budget here and in files.test.ts.
// Needs Node 22.18+ (it imports settings from a TypeScript file).
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  IMAGE_BUDGET_BYTES as BUDGET_BYTES,
  IMAGE_WIDTHS as WIDTHS,
  imageFile,
  imageHeight,
} from '../src/content/images/files.ts';

/** WebP quality per width. The scans are grainy, so higher costs a lot. */
const QUALITY = { 240: 65, 480: 60 };
const PAUSE_MS = 1500;

const root = new URL('..', import.meta.url);
const manifest = JSON.parse(
  readFileSync(new URL('src/content/images/rws-1909.json', root), 'utf8'),
);
const cache = new URL('.cache/card-images/', root);
const publicDir = new URL('public/', root);
mkdirSync(cache, { recursive: true });
mkdirSync(new URL('.', new URL(imageFile('x', WIDTHS[0]), publicDir)), {
  recursive: true,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function original(file) {
  const path = new URL(encodeURIComponent(file), cache);
  if (existsSync(path)) return path;
  const url =
    'https://commons.wikimedia.org/wiki/Special:FilePath/' +
    encodeURIComponent(file.replace(/ /g, '_'));
  for (let attempt = 0; ; attempt++) {
    await sleep(PAUSE_MS);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'tarot-image-fetch/1.0 (one-off script)' },
    });
    if (res.ok) {
      writeFileSync(path, Buffer.from(await res.arrayBuffer()));
      return path;
    }
    if (res.status !== 429 || attempt >= 4)
      throw new Error(`${file}: HTTP ${res.status}`);
    const wait =
      Number(res.headers.get('retry-after') ?? 0) * 1000 ||
      30000 * (attempt + 1);
    console.error(`Rate limited; waiting ${wait / 1000}s`);
    await sleep(wait);
  }
}

let total = 0;
const report = [];
for (const image of manifest.images) {
  const src = await original(image.file);
  // Drop the scanner background around the card, then bring every card to
  // the common shape. The scans differ from it by under 3%, so stretching is
  // invisible and, unlike cropping, never cuts the printed border.
  const trimmed = await sharp(fileURLToPath(src))
    .trim({ threshold: 40 })
    .toBuffer({ resolveWithObject: true });
  report.push(
    `${image.cardId} ${trimmed.info.width}x${trimmed.info.height} ` +
      (trimmed.info.width / trimmed.info.height).toFixed(3),
  );
  for (const width of WIDTHS) {
    const file = new URL(imageFile(image.cardId, width), publicDir);
    await sharp(trimmed.data)
      .resize({ width, height: imageHeight(width), fit: 'fill' })
      .webp({ quality: QUALITY[width] })
      .toFile(fileURLToPath(file));
    total += statSync(file).size;
  }
}
if (process.argv.includes('--report')) console.log(report.join('\n'));
console.error(
  `${manifest.images.length} cards, widths ${WIDTHS.join(' and ')}: ` +
    `${(total / 1024 / 1024).toFixed(2)} MB of ${BUDGET_BYTES / 1024 / 1024} MB`,
);
if (total > BUDGET_BYTES) {
  console.error('Over budget.');
  process.exit(1);
}
