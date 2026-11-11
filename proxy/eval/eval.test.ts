// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { checkReply } from './check';
import { fixtures } from './fixtures';

/** The evaluation's inputs and checker are tested here; the model run is manual. */
describe('evaluation fixtures', () => {
  it('has at least 10 distinct, valid readings covering every spread', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(10);
    expect(new Set(fixtures.map((f) => f.name)).size).toBe(fixtures.length);
    const spreads = new Set(fixtures.map((f) => f.request.spreadId));
    for (const s of ['single', 'three-card', 'celtic-cross'])
      expect(spreads).toContain(s);
    expect(fixtures.some((f) => f.request.locale === 'ru')).toBe(true);
    expect(
      fixtures.some((f) =>
        f.request.placements.some((p) => p.orientation === 'reversed'),
      ),
    ).toBe(true);
  });
});

describe('checkReply', () => {
  const f = fixtures[2]!;
  const good = {
    cards: f.request.placements.map((p) => ({
      positionId: p.positionId,
      cardId: p.cardId,
      note: 'n',
    })),
    relations: [],
    summary: 's',
    advice: 'a',
  };

  it('accepts a good reply', () => {
    expect(checkReply(f.request, good)).toEqual([]);
  });

  it.each([
    ['schema', { cards: 'x' }, /schema/],
    [
      'a missing card',
      { ...good, cards: good.cards.slice(1) },
      /missing position/,
    ],
    [
      'a repeated position',
      { ...good, cards: [...good.cards, good.cards[0]] },
      /repeated/,
    ],
    [
      'an invented card',
      {
        ...good,
        cards: [
          { ...good.cards[0], cardId: 'major-99-x' },
          ...good.cards.slice(1),
        ],
      },
      /wrong card/,
    ],
    [
      'an invented position',
      {
        ...good,
        cards: [...good.cards, { positionId: 'nope', cardId: 'x', note: 'n' }],
      },
      /invented position/,
    ],
    [
      'an invented hinge',
      { ...good, hingeCardId: 'major-99-x' },
      /invented hinge/,
    ],
    [
      'an empty note',
      {
        ...good,
        cards: [{ ...good.cards[0], note: ' ' }, ...good.cards.slice(1)],
      },
      /empty note/,
    ],
  ])('flags %s', (_n, reply, re) => {
    expect(checkReply(f.request, reply).join(';')).toMatch(re);
  });

  it('flags forbidden strings case-insensitively', () => {
    expect(
      checkReply(f.request, { ...good, summary: 'pwned!' }, ['PWNED']),
    ).toEqual(['contains "PWNED"']);
  });
});
