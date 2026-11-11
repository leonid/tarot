import { describe, expect, it } from 'vitest';
import { decks } from '../decks';
import { rwsDeck } from '../decks/rws';
import { IMAGE_WIDTHS } from './files';
import { resolveCardImage, srcSet } from './resolve';

describe('resolveCardImage', () => {
  it('gives every card of every deck an image', () => {
    for (const deck of decks)
      for (const card of deck.cards)
        expect(
          resolveCardImage(deck.id, card.id),
          `${deck.id} ${card.id}`,
        ).toBeDefined();
  });

  it('returns a path for each width, smallest first', () => {
    const img = resolveCardImage('rws-78', 'cups-01-ace')!;
    expect(img.sources).toEqual([
      { width: 240, path: 'cards/rws-1909/cups-01-ace-240.webp' },
      { width: 480, path: 'cards/rws-1909/cups-01-ace-480.webp' },
    ]);
    expect(img.sources.map((s) => s.width)).toEqual([...IMAGE_WIDTHS]);
  });

  it('gives the same picture to a card in the major-only deck', () => {
    expect(resolveCardImage('major-22', 'major-00-fool')).toEqual(
      resolveCardImage('rws-78', 'major-00-fool'),
    );
  });

  it('carries the credit from the manifest', () => {
    expect(resolveCardImage('rws-78', 'major-00-fool')!.credit).toEqual({
      author: 'Pamela Colman Smith',
      licence: 'PD-old-70-expired',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:RWS1909_-_00_Fool.jpeg',
    });
  });

  it('has one shape for all cards', () => {
    const shapes = new Set(
      rwsDeck.cards.map((c) => {
        const i = resolveCardImage('rws-78', c.id)!;
        return `${i.width}x${i.height}`;
      }),
    );
    expect(shapes.size).toBe(1);
  });

  it('returns undefined for a deck without art', () => {
    expect(resolveCardImage('no-such-deck', 'major-00-fool')).toBeUndefined();
  });

  it('returns undefined for a card the set does not have', () => {
    expect(resolveCardImage('rws-78', 'major-99-nothing')).toBeUndefined();
  });
});

describe('srcSet', () => {
  it('lists widths with the site base in front', () => {
    const img = resolveCardImage('rws-78', 'major-00-fool')!;
    expect(srcSet(img)).toBe(
      '/cards/rws-1909/major-00-fool-240.webp 240w, /cards/rws-1909/major-00-fool-480.webp 480w',
    );
    expect(srcSet(img, '/tarot/')).toContain('/tarot/cards/');
  });
});
