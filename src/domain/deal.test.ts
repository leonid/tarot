import { describe, expect, it } from 'vitest';
import { decks } from '../content/decks';
import { spreads } from '../content/spreads';
import { deal } from './deal';

const SEEDS = [1, 42, 2024];

/** One line per position: "position card orientation". */
const lines = (r: ReturnType<typeof deal>) =>
  r.placements.map((p) => `${p.positionId} ${p.cardId} ${p.orientation}`);

/**
 * "Same seed, same cards forever": share links and history store the seed,
 * so the RNG, the shuffle and the draw order must never change silently. If a
 * snapshot fails, existing seeded readings would change; do not just update
 * it (see the note in content/decks/decks.test.ts).
 */
describe('seeded deal (snapshot per spread and deck)', () => {
  for (const deck of decks)
    for (const spread of spreads) {
      if (spread.positions.length > deck.cards.length) continue;
      for (const seed of SEEDS)
        it(`${deck.id} / ${spread.id} / seed ${seed}`, () => {
          const r = deal({
            question: '',
            deck,
            spread,
            seed,
            allowReversals: true,
          });
          expect(lines(r)).toMatchSnapshot();
        });
    }

  it('deals the same cards twice, and without reversals leaves all upright', () => {
    const opts = {
      question: '',
      deck: decks[0]!,
      spread: spreads[2]!,
      seed: 7,
    };
    const a = deal({ ...opts, allowReversals: false });
    expect(lines(a)).toEqual(lines(deal({ ...opts, allowReversals: false })));
    expect(a.placements.every((p) => p.orientation === 'upright')).toBe(true);
  });
});
