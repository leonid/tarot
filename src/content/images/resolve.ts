import type { ImageEntry, ImageManifest } from './manifest';
import { IMAGE_ASPECT, IMAGE_WIDTHS, imageFile, imageHeight } from './files';
import rws1909 from './rws-1909.json';

/**
 * Art is an overlay on the decks, not part of them: a deck knows nothing
 * about pictures, and this table says which decks use which set. A deck that
 * is not listed has no art (resolve returns undefined) and the interface
 * shows the typographic face instead.
 */
const SETS = [
  {
    // Checked against the schema by manifest.test.ts and the images script, so
    // the browser does not carry a validator for a file that ships with it.
    manifest: rws1909 as ImageManifest,
    /** The 22-card deck reuses the first 22 pictures of the full deck. */
    deckIds: ['rws-78', 'major-22'],
  },
];

/** What a component needs to draw and credit one card. */
export interface CardImage {
  /** Site-relative paths, one per width, smallest first. No leading slash. */
  sources: readonly { width: number; path: string }[];
  /** Width and height of the largest file; every card has the same shape. */
  width: number;
  height: number;
  /** Width to height, the same for every card. */
  aspect: number;
  credit: Pick<ImageEntry, 'author' | 'licence' | 'sourceUrl'>;
}

/** The picture of a card in a deck, or undefined if the deck has no art. */
export function resolveCardImage(
  deckId: string,
  cardId: string,
): CardImage | undefined {
  for (const set of SETS) {
    if (!set.deckIds.includes(deckId)) continue;
    const entry = set.manifest.images.find((i) => i.cardId === cardId);
    if (!entry) return undefined;
    const widths = [...IMAGE_WIDTHS].sort((a, b) => a - b);
    const largest = widths[widths.length - 1]!;
    return {
      sources: widths.map((width) => ({
        width,
        path: imageFile(cardId, width),
      })),
      width: largest,
      height: imageHeight(largest),
      aspect: IMAGE_ASPECT,
      credit: {
        author: entry.author,
        licence: entry.licence,
        sourceUrl: entry.sourceUrl,
      },
    };
  }
  return undefined;
}

/** `srcset` text for an <img>; `base` is the site base, e.g. "/" or "/tarot/". */
export function srcSet(image: CardImage, base = '/'): string {
  return image.sources.map((s) => `${base}${s.path} ${s.width}w`).join(', ');
}
