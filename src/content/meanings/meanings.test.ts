import { describe, expect, it } from 'vitest';
import { rwsDeck } from '../decks/rws';
import { meanings } from '.';

describe('every card has base meanings', () => {
  it.each(rwsDeck.cards.map((c) => [c.name, c.id] as const))(
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
