import { describe, expect, it } from 'vitest';
import { decodeShared, encodeShared, toShared } from './share';

const reading = {
  question: 'Será que vai dar certo? ✨',
  deckId: 'rws-78',
  spreadId: 'three-card',
  placements: [
    { positionId: 'past', cardId: 'major-00-fool', orientation: 'upright' },
    { positionId: 'present', cardId: 'cups-01-ace', orientation: 'reversed' },
  ] as const,
  seed: 123,
};

describe('share links', () => {
  it('round-trips, including non-ASCII questions', () => {
    const shared = toShared(reading, 'simulate');
    expect(decodeShared(encodeShared(shared))).toEqual(shared);
  });

  it('is URL-safe', () => {
    expect(encodeShared(toShared(reading, 'setup'))).toMatch(
      /^[A-Za-z0-9_-]+$/,
    );
  });

  it.each(['', 'not base64!!', 'e30', encodeShared({ v: 1 } as never)])(
    'rejects malformed input %j',
    (bad) => {
      expect(decodeShared(bad)).toBeNull();
    },
  );
});
