import { describe, expect, it } from 'vitest';
import { compare } from './compare';
import { fallbackProvider } from './fallback';
import type { ReadingContext } from './interpretation';
import type { Orientation } from './types';
import { correspondences } from '../content/correspondences';
import { rwsDeck } from '../content/decks/rws';
import { meanings } from '../content/meanings';
import { threeCard } from '../content/spreads';

const ids = ['past', 'present', 'future'];
function ctx(cardIds: string[], withTable = true): ReadingContext {
  return {
    question: '',
    deck: rwsDeck,
    spread: threeCard,
    meanings,
    ...(withTable ? { correspondences } : {}),
    placements: cardIds.map((cardId, i) => ({
      positionId: ids[i]!,
      cardId,
      orientation: 'upright' as Orientation,
    })),
  };
}

describe('compare (DCAS step 2)', () => {
  it('finds a shared planet across a major and a decan ruler', () => {
    // The Tower is Mars; the 5 of Cups is the Mars decan of Scorpio.
    const r = compare(ctx(['major-16-tower', 'cups-05-five', 'wands-01-ace']));
    expect(r.relations).toContain('Mars links The Tower and Five of Cups.');
  });

  it('finds a shared sign across a major and a decan', () => {
    // Death is Scorpio; the 6 of Cups is Scorpio II.
    const r = compare(ctx(['major-13-death', 'cups-06-six', 'swords-01-ace']));
    expect(r.relations).toContain('Scorpio links Death and Six of Cups.');
  });

  it('gives majors an element through sign or traditional element', () => {
    // Death (Scorpio, water) and the Ace of Cups strengthen; they dominate.
    const r = compare(ctx(['major-13-death', 'cups-01-ace', 'cups-02-two']));
    expect(r.relations.some((x) => x.startsWith('Water dominates'))).toBe(true);
  });

  it('reports conflicts and picks the card with the most ties as hinge', () => {
    // Fool (traditional air) conflicts with Death (water) and the Ace of Cups.
    const r = compare(ctx(['major-00-fool', 'major-13-death', 'cups-01-ace']));
    expect(r.relations.some((x) => x.startsWith('Conflicting elements'))).toBe(
      true,
    );
    expect(r.hingeCardId).toBe('major-00-fool');
  });

  it('names no hinge when ties are even or absent', () => {
    expect(
      compare(ctx(['cups-01-ace', 'cups-02-two', 'cups-03-three'])).hingeCardId,
    ).toBeUndefined();
  });

  it('does nothing without a correspondence table for majors', () => {
    const r = compare(
      ctx(['major-13-death', 'major-00-fool', 'major-16-tower'], false),
    );
    expect(r.relations).toEqual([]);
  });

  it('notes a court sub-element echoing another card', () => {
    // Queen of Wands is Water of Fire; the Ace of Cups is water.
    const r = compare(ctx(['wands-13-queen', 'cups-01-ace', 'swords-01-ace']));
    expect(r.relations).toContain(
      'Queen of Wands (Water of Fire) echoes water in Ace of Cups.',
    );
  });

  it('skips the echo when sub-element equals the suit element', () => {
    // Knight of Wands is Fire of Fire.
    const r = compare(ctx(['wands-12-knight', 'wands-01-ace', 'cups-01-ace']));
    expect(r.relations.some((x) => x.includes('echoes'))).toBe(false);
  });

  it('finds decans inside a court span, including across Pisces to Aries', () => {
    // Queen of Wands spans 20 Pisces to 20 Aries: Pisces III and Aries I-II.
    const inside = compare(
      ctx(['wands-13-queen', 'cups-10-ten', 'wands-03-three']),
    );
    expect(inside.relations).toContain(
      'Ten of Cups and Three of Wands fall within the span of Queen of Wands.',
    );
    // Pisces II and Aries III lie outside it.
    const outside = compare(
      ctx(['wands-13-queen', 'cups-09-nine', 'wands-04-four']),
    );
    expect(outside.relations.some((x) => x.includes('span'))).toBe(false);
  });

  it('treats The World as earth through its Book T element', () => {
    // The World (Saturn and Earth) strengthens Pentacles and conflicts with Swords.
    const r = compare(
      ctx(['major-21-world', 'pentacles-01-ace', 'swords-01-ace']),
    );
    expect(r.relations.some((x) => x.startsWith('Conflicting elements'))).toBe(
      true,
    );
    expect(r.relations.join(' ')).toContain('The World and Ace of Swords');
  });

  it('flows through the fallback provider', async () => {
    const out = await fallbackProvider.interpret(
      ctx(['major-00-fool', 'major-13-death', 'cups-01-ace']),
    );
    expect(out.hingeCardId).toBe('major-00-fool');
    expect(out.relations.some((x) => x.startsWith('Conflicting'))).toBe(true);
  });
});
