// Reads the Wikimedia Commons file page of every card image in the chosen
// set and writes the image manifest (src/content/images/rws-1909.json).
//
//   node scripts/check-image-licences.mjs
//
// A row is written only if the page carries exactly one public-domain
// template and it is one we accept (LICENCE_TEMPLATES in manifest.ts).
// Otherwise the script lists the problem files, writes nothing and exits 1.
// It makes three API requests, several seconds apart, and backs off on 429.
// Needs Node 22.18+ (it imports the deck from a TypeScript file).
import { writeFileSync } from 'node:fs';
import { rwsDeck } from '../src/content/decks/rws.ts';

const API = 'https://commons.wikimedia.org/w/api.php';
const CATEGORY = 'Rider-Waite tarot deck (Roses & Lilies)';
const OUT = new URL('../src/content/images/rws-1909.json', import.meta.url);
const ACCEPTED = ['PD-old-70-expired', 'PD-old-auto-expired'];
const PAUSE_MS = 6000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'tarot-licence-check/1.0 (one-off script)' },
    });
    if (res.ok) return res.json();
    if (res.status !== 429 || attempt >= 4)
      throw new Error(`Commons API: HTTP ${res.status}`);
    const wait =
      Number(res.headers.get('retry-after') ?? 0) * 1000 ||
      30000 * (attempt + 1);
    console.error(`Rate limited; waiting ${wait / 1000}s`);
    await sleep(wait);
  }
}

/** "RWS1909 - 00 Fool.jpeg" or "RWS1909 - Wands 14.jpeg" to a card id. */
function cardIdOf(file) {
  const major = /^RWS1909 - (\d\d) /.exec(file);
  const minor = /^RWS1909 - (Wands|Cups|Swords|Pentacles) (\d\d)\./.exec(file);
  const card = major
    ? rwsDeck.cards.find(
        (c) => c.arcana === 'major' && c.number === Number(major[1]),
      )
    : minor
      ? rwsDeck.cards.find(
          (c) =>
            c.suit === minor[1].toLowerCase() && c.number === Number(minor[2]),
        )
      : undefined;
  return card?.id;
}

const commonsFileUrl = (file) =>
  'https://commons.wikimedia.org/wiki/File:' +
  encodeURIComponent(file.replace(/ /g, '_'));

const members = await api({
  action: 'query',
  list: 'categorymembers',
  cmtitle: `Category:${CATEGORY}`,
  cmtype: 'file',
  cmlimit: '500',
});
const files = members.query.categorymembers
  .map((m) => m.title.replace(/^File:/, ''))
  .filter((f) => cardIdOf(f));
console.error(`${files.length} card files in the category`);

const today = new Date().toISOString().slice(0, 10);
const rows = [];
const problems = [];
for (let i = 0; i < files.length; i += 40) {
  await sleep(PAUSE_MS);
  const batch = files.slice(i, i + 40);
  const pages = await api({
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    titles: batch.map((f) => `File:${f}`).join('|'),
  });
  for (const page of pages.query.pages) {
    const file = page.title.replace(/^File:/, '');
    const text = page.revisions?.[0]?.slots?.main?.content;
    if (!text) {
      problems.push(`${file}: page text not returned`);
      continue;
    }
    const licences = [
      ...new Set(
        [...text.matchAll(/\{\{\s*(PD-[^|}\n]+?)\s*[|}]/g)].map((m) => m[1]),
      ),
    ];
    const author = /\|\s*author\s*=\s*(?:\{\{Creator:)?([^}\n|]+)/i
      .exec(text)?.[1]
      ?.trim();
    if (licences.length !== 1 || !ACCEPTED.includes(licences[0])) {
      problems.push(
        `${file}: licence templates found: ${licences.join(', ') || 'none'}`,
      );
      continue;
    }
    if (!author) {
      problems.push(`${file}: no author`);
      continue;
    }
    rows.push({
      cardId: cardIdOf(file),
      file,
      licence: licences[0],
      author,
      sourceUrl: commonsFileUrl(file),
      checked: today,
      checkedBy: 'script',
    });
  }
}

const order = new Map(rwsDeck.cards.map((c, i) => [c.id, i]));
rows.sort((a, b) => order.get(a.cardId) - order.get(b.cardId));
const missing = rwsDeck.cards.filter(
  (c) => !rows.some((r) => r.cardId === c.id),
);
for (const c of missing) problems.push(`${c.id}: no accepted file`);

if (problems.length) {
  console.error(
    `Not written. ${problems.length} problem(s):\n` + problems.join('\n'),
  );
  process.exit(1);
}
writeFileSync(
  OUT,
  JSON.stringify(
    {
      deckId: rwsDeck.id,
      set: 'Roses & Lilies (1909 first edition)',
      categoryUrl:
        'https://commons.wikimedia.org/wiki/Category:' +
        encodeURIComponent(CATEGORY.replace(/ /g, '_'))
          .replace(/%28/g, '(')
          .replace(/%29/g, ')'),
      images: rows,
    },
    null,
    2,
  ) + '\n',
);
console.error(`Wrote ${rows.length} rows to ${OUT.pathname}`);
