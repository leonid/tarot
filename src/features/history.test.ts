import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import v1 from '../domain/fixtures/share-v1.json';
import { toShared } from '../domain/share';
import {
  deleteReading,
  isSaved,
  loadHistory,
  restoreReading,
  saveReading,
} from './history';

const shared = toShared(
  {
    question: 'q',
    deckId: 'rws-78',
    spreadId: 'single',
    placements: [
      { positionId: 'card', cardId: 'major-00-fool', orientation: 'upright' },
    ],
  },
  'setup',
);

describe('history', () => {
  beforeEach(() => localStorage.clear());

  it('saves newest first and deletes by id', () => {
    saveReading(shared);
    const two = saveReading({ ...shared, question: 'second' }).entries;
    expect(two[0]?.reading.question).toBe('second');
    expect(deleteReading(two[0]!.id).entries).toHaveLength(1);
    expect(loadHistory()).toHaveLength(1);
  });

  it('ignores corrupt stored data', () => {
    localStorage.setItem('tarot.history.v1', '{broken');
    expect(loadHistory()).toEqual([]);
  });

  it('keeps the good entries when one is corrupt or from a newer version', () => {
    const good = { id: 'a', savedAt: 1, reading: shared };
    localStorage.setItem(
      'tarot.history.v1',
      JSON.stringify([
        good,
        { id: 'b', savedAt: 2, reading: { v: 99 } },
        { id: 'c', savedAt: 3, reading: { v: 1, mode: 'nope' } },
        'junk',
        { id: 'd', savedAt: 4, reading: { ...shared, question: 'kept' } },
      ]),
    );
    expect(loadHistory().map((e) => e.id)).toEqual(['a', 'd']);
  });

  it('loads a v1 fixture entry', () => {
    localStorage.setItem(
      'tarot.history.v1',
      JSON.stringify([{ id: 'f', savedAt: 5, reading: v1 }]),
    );
    expect(loadHistory()[0]?.reading.seed).toBe(42);
  });

  it('puts a deleted entry back in its place by date (R3)', () => {
    const entry = (id: string, savedAt: number) => ({
      id,
      savedAt,
      reading: shared,
    });
    localStorage.setItem(
      'tarot.history.v1',
      JSON.stringify([entry('c', 3), entry('b', 2), entry('a', 1)]),
    );
    const b = loadHistory()[1]!;
    expect(deleteReading('b').entries.map((e) => e.id)).toEqual(['c', 'a']);
    expect(restoreReading(b).entries.map((e) => e.id)).toEqual(['c', 'b', 'a']);
    expect(loadHistory().map((e) => e.id)).toEqual(['c', 'b', 'a']);
  });

  it('does not save an unchanged reading twice (R13)', () => {
    expect(isSaved(shared)).toBe(false);
    expect(saveReading(shared).status).toBe('saved');
    expect(isSaved(shared)).toBe(true);
    const again = saveReading({
      ...shared,
      placements: [...shared.placements],
    });
    expect(again.status).toBe('already');
    expect(again.problem).toBeUndefined();
    expect(loadHistory()).toHaveLength(1);
    // Turned over, it is a different reading.
    const turned = {
      ...shared,
      placements: [
        { ...shared.placements[0]!, orientation: 'reversed' as const },
      ],
    };
    expect(saveReading(turned).status).toBe('saved');
    expect(loadHistory()).toHaveLength(2);
  });

  describe('when storage cannot be written (R13)', () => {
    afterEach(() => vi.restoreAllMocks());
    const failWith = (name: string) =>
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('no', name);
      });

    it('says storage is full', () => {
      failWith('QuotaExceededError');
      const r = saveReading(shared);
      expect(r.problem).toBe('full');
      expect(r.entries).toEqual([]);
    });

    it('says storage is blocked', () => {
      failWith('SecurityError');
      expect(saveReading(shared).problem).toBe('blocked');
    });

    it('keeps the list as it was when a delete cannot be stored', () => {
      saveReading(shared);
      const id = loadHistory()[0]!.id;
      failWith('QuotaExceededError');
      const r = deleteReading(id);
      expect(r.problem).toBe('full');
      expect(r.entries.map((e) => e.id)).toEqual([id]);
    });
  });
});
