import { describe, expect, it } from 'vitest';
import { majorArcana, rwsDeck } from '../decks/rws';
import { meanings } from '.';

/** Suits and groups whose meanings are fully written. */
const complete = [
  { group: 'major', cards: majorArcana },
  { group: 'wands', cards: rwsDeck.cards.filter((c) => c.suit === 'wands') },
  { group: 'cups', cards: rwsDeck.cards.filter((c) => c.suit === 'cups') },
  { group: 'swords', cards: rwsDeck.cards.filter((c) => c.suit === 'swords') },
];

describe.each(complete)('$group meanings', ({ cards }) => {
  it.each(cards.map((c) => [c.name, c.id] as const))(
    '%s is complete',
    (_name, id) => {
      const m = meanings[id];
      expect(m, `missing meaning for ${id}`).toBeDefined();
      for (const o of ['upright', 'reversed'] as const) {
        expect(m![o].keywords.length).toBeGreaterThanOrEqual(3);
        expect(m![o].summary.trim().length).toBeGreaterThan(10);
      }
      expect(m!.reversed.summary).not.toBe(m!.upright.summary);
    },
  );
});

describe('meanings table', () => {
  it('has no orphan keys', () => {
    const ids = new Set(rwsDeck.cards.map((c) => c.id));
    for (const key of Object.keys(meanings)) expect(ids.has(key)).toBe(true);
  });
});
