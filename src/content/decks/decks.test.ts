import { describe, expect, it } from 'vitest';
import { decks } from './index';
import { majorOnlyDeck, rwsDeck } from './rws';

/**
 * Saved readings and share links store card ids and replay seeded deals, so
 * ids and deck order are a compatibility contract. If a snapshot here fails,
 * existing links and history change meaning: do not just update it. Either
 * revert, or add a migration (src/domain/migrate.ts) and then update.
 */
describe('deck contract', () => {
  it('has the 78 card ids in order (snapshot)', () => {
    expect(rwsDeck.cards.map((c) => c.id)).toMatchSnapshot();
  });

  it('has the major-only deck as the first 22 cards of the full deck', () => {
    expect(majorOnlyDeck.cards.map((c) => c.id)).toMatchSnapshot();
    expect(majorOnlyDeck.cards.map((c) => c.id)).toEqual(
      rwsDeck.cards.slice(0, 22).map((c) => c.id),
    );
  });

  it('lists the decks in a fixed order with fixed ids', () => {
    expect(decks.map((d) => [d.id, d.cards.length])).toEqual([
      ['rws-78', 78],
      ['major-22', 22],
    ]);
  });

  it('keeps ids unique and shaped like <suit-or-major>-<nn>-<slug>', () => {
    const ids = rwsDeck.cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(78);
    for (const id of ids)
      expect(id).toMatch(/^(major|wands|cups|swords|pentacles)-\d{2}-[a-z-]+$/);
  });
});
