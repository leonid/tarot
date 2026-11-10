import { beforeEach, describe, expect, it } from 'vitest';
import v1 from '../domain/fixtures/share-v1.json';
import { toShared } from '../domain/share';
import { deleteReading, loadHistory, saveReading } from './history';

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
    const two = saveReading({ ...shared, question: 'second' });
    expect(two[0]?.reading.question).toBe('second');
    expect(deleteReading(two[0]!.id)).toHaveLength(1);
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
});
