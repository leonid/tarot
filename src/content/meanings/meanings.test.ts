import { describe, expect, it } from 'vitest';
import { rwsDeck } from '../decks/rws';
import { ruWaite } from '../locales/ru-waite';
import { meanings } from '.';
import { waiteMeanings } from './waite';

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

describe.each([
  ['Waite 1911 (en)', waiteMeanings],
  ['Waite 1911 (ru)', ruWaite],
])('%s', (_label, table) => {
  it('covers exactly the 78 cards, upright and reversed', () => {
    expect(Object.keys(table).sort()).toEqual(
      rwsDeck.cards.map((c) => c.id).sort(),
    );
    for (const m of Object.values(table)) {
      expect(m.upright.trim().length).toBeGreaterThan(10);
      expect(m.reversed.trim().length).toBeGreaterThan(10);
      expect(m.reversed).not.toBe(m.upright);
    }
  });
});
