import { beforeEach, describe, expect, it } from 'vitest';
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
});
