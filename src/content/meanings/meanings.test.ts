import { describe, expect, it } from 'vitest';
import { majorArcana } from '../decks/rws';
import { meanings } from '.';

describe('Major Arcana meanings', () => {
  it.each(majorArcana.map((c) => [c.name, c.id] as const))(
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

  it('has no orphan keys', () => {
    const ids = new Set(majorArcana.map((c) => c.id));
    for (const key of Object.keys(meanings))
      if (key.startsWith('major-')) expect(ids.has(key)).toBe(true);
  });
});
