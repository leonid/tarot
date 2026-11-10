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

import v1 from './fixtures/share-v1.json';
import future from './fixtures/share-future.json';
import { CURRENT_VERSION, migrate } from './migrate';
import { decodeSharedResult } from './share';

const link = (o: unknown) =>
  btoa(JSON.stringify(o))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

describe('migration chain', () => {
  it('opens a v1 fixture through migrate, unchanged', () => {
    const r = migrate(v1);
    expect(r).toEqual({ ok: true, reading: v1 });
    expect(CURRENT_VERSION).toBe(1);
  });

  it('opens a v1 fixture from a share link', () => {
    const r = decodeSharedResult(link(v1));
    expect(r.ok && r.reading.placements).toHaveLength(3);
  });

  it('returns an explicit error for a newer version', () => {
    expect(migrate(future)).toEqual({
      ok: false,
      error: { kind: 'future-version', version: 99 },
    });
    expect(decodeSharedResult(link(future))).toEqual({
      ok: false,
      error: { kind: 'future-version', version: 99 },
    });
  });

  it.each([null, 'x', 7, [], {}, { v: 'one' }, { v: 0 }, { v: 1.5 }, { v: 1 }])(
    'calls %j malformed',
    (bad) => {
      expect(migrate(bad)).toEqual({ ok: false, error: { kind: 'malformed' } });
    },
  );

  it('runs each step once, oldest first, up to the current version', () => {
    const seen: number[] = [];
    // The schema only knows v1, so a made-up v3 ends as malformed; the point
    // here is the order in which the steps ran.
    migrate(
      v1,
      { 1: (p) => (seen.push(1), p), 2: (p) => (seen.push(2), p) },
      3,
    );
    expect(seen).toEqual([1, 2]);
  });

  it('reports a gap in the chain', () => {
    expect(migrate(v1, { 2: (p) => p }, 3)).toEqual({
      ok: false,
      error: { kind: 'no-migration', version: 1 },
    });
  });
});
