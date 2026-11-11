import { describe, expect, it } from 'vitest';
import { nextSlotCentre } from './keyboardCoordinates';

// Three in a row, one row of two below (like a small spread).
const row = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 500, y: 100 },
];
const below = [
  { x: 200, y: 300 },
  { x: 400, y: 300 },
];

describe('nextSlotCentre', () => {
  it('moves to the neighbour in a row, and stops at the ends', () => {
    expect(nextSlotCentre('ArrowRight', row[0]!, row)).toEqual(row[1]);
    expect(nextSlotCentre('ArrowLeft', row[1]!, row)).toEqual(row[0]);
    expect(nextSlotCentre('ArrowRight', row[2]!, row)).toBeUndefined();
    expect(nextSlotCentre('ArrowLeft', row[0]!, row)).toBeUndefined();
  });

  it('stays in the row when moving sideways', () => {
    const all = [...row, ...below];
    expect(nextSlotCentre('ArrowRight', row[0]!, all)).toEqual(row[1]);
    expect(nextSlotCentre('ArrowRight', below[0]!, all)).toEqual(below[1]);
  });

  it('moves up and down to the nearest slot in that direction', () => {
    const all = [...row, ...below];
    expect(nextSlotCentre('ArrowDown', row[0]!, all)).toEqual(below[0]);
    expect(nextSlotCentre('ArrowUp', below[1]!, all)).toEqual(row[1]);
  });

  it('starts from a card below the board and goes up to the nearest slot', () => {
    expect(nextSlotCentre('ArrowUp', { x: 310, y: 600 }, row)).toEqual(row[1]);
  });

  it('has nowhere to go with no slots', () => {
    expect(nextSlotCentre('ArrowUp', { x: 0, y: 0 }, [])).toBeUndefined();
  });
});
