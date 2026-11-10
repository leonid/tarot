import { describe, expect, it } from 'vitest';
import {
  commonsFileUrl,
  imageManifestSchema,
  type ImageEntry,
  type ImageManifest,
} from './manifest';

const fool: ImageEntry = {
  cardId: 'major-00-fool',
  file: 'RWS1909 - 00 Fool.jpeg',
  licence: 'PD-old-70-expired',
  author: 'Pamela Colman Smith',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:RWS1909_-_00_Fool.jpeg',
  checked: '2026-11-10',
  checkedBy: 'script',
};
const magician: ImageEntry = {
  ...fool,
  cardId: 'major-01-magician',
  file: 'RWS1909 - 01 Magician.jpeg',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:RWS1909_-_01_Magician.jpeg',
};
const manifest = (images: unknown[]): unknown => ({
  deckId: 'rws-78',
  set: 'Roses & Lilies (1909)',
  categoryUrl:
    'https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)',
  images,
});
/** Paths of the issues the schema reports, as "images.0.file". */
const issues = (value: unknown) => {
  const r = imageManifestSchema.safeParse(value);
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.'));
};

describe('image manifest schema', () => {
  it('accepts a well-formed manifest', () => {
    const parsed: ImageManifest = imageManifestSchema.parse(
      manifest([fool, magician]),
    );
    expect(parsed.images).toHaveLength(2);
  });

  it('accepts an empty image list (a deck with no art yet)', () => {
    expect(issues(manifest([]))).toEqual([]);
  });

  it.each([
    ['a missing licence', { licence: undefined }, 'images.0.licence'],
    [
      'a licence we do not accept',
      { licence: 'CC-BY-SA-4.0' },
      'images.0.licence',
    ],
    ['an empty author', { author: '' }, 'images.0.author'],
    [
      'a date that is not YYYY-MM-DD',
      { checked: '10.11.2026' },
      'images.0.checked',
    ],
    ['an impossible date', { checked: '2026-02-30' }, 'images.0.checked'],
    ['an unknown checker', { checkedBy: 'nobody' }, 'images.0.checkedBy'],
    [
      'a "File:" prefix in the name',
      { file: 'File:Fool.jpeg' },
      'images.0.file',
    ],
    ['a file that is not an image', { file: 'Fool.pdf' }, 'images.0.file'],
    [
      'a source page of a different file',
      { sourceUrl: magician.sourceUrl },
      'images.0.sourceUrl',
    ],
    [
      'a source outside Commons',
      { sourceUrl: 'https://example.com/File:RWS1909_-_00_Fool.jpeg' },
      'images.0.sourceUrl',
    ],
  ])('rejects %s', (_name, change, path) => {
    expect(issues(manifest([{ ...fool, ...change }]))).toContain(path);
  });

  it('rejects a field it does not know', () => {
    expect(issues(manifest([{ ...fool, note: 'x' }]))).toEqual(['images.0']);
  });

  it('rejects the same card or the same file twice', () => {
    expect(
      issues(manifest([fool, { ...magician, cardId: fool.cardId }])),
    ).toEqual(['images.1.cardId']);
    expect(
      issues(
        manifest([
          fool,
          { ...magician, file: fool.file, sourceUrl: fool.sourceUrl },
        ]),
      ),
    ).toEqual(['images.1.file']);
  });

  it('rejects a category that is not on Commons', () => {
    expect(
      issues({
        ...(manifest([]) as object),
        categoryUrl: 'https://example.com/x',
      }),
    ).toEqual(['categoryUrl']);
  });
});

describe('commonsFileUrl', () => {
  it('writes spaces as underscores and escapes the rest', () => {
    expect(commonsFileUrl('RWS1909 - 00 Fool.jpeg')).toBe(fool.sourceUrl);
    expect(commonsFileUrl('A & B.jpg')).toBe(
      'https://commons.wikimedia.org/wiki/File:A_%26_B.jpg',
    );
  });
});
