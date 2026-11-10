import { describe, expect, it } from 'vitest';
import { useReadingStore } from './store';

const s = () => useReadingStore.getState();

describe('setup placement rules', () => {
  it('moves a card instead of duplicating it', () => {
    s().place('past', 'major-00-fool');
    s().place('present', 'major-00-fool');
    expect(s().placements).toEqual([
      {
        positionId: 'present',
        cardId: 'major-00-fool',
        orientation: 'upright',
      },
    ]);
  });

  it('replaces the card in an occupied position', () => {
    s().place('past', 'major-00-fool');
    s().place('past', 'major-13-death', 'reversed');
    expect(s().placements).toEqual([
      { positionId: 'past', cardId: 'major-13-death', orientation: 'reversed' },
    ]);
  });

  it('clears all placements when the spread changes', () => {
    s().place('past', 'major-00-fool');
    s().setSpread('celtic-cross');
    expect(s().placements).toEqual([]);
  });
});
