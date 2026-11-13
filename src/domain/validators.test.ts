import { describe, expect, it } from 'vitest';
import { parseInterpretation } from './interpretation';
import { interpretationSchema } from './interpretationSchema';
import { parseSharedReading } from './schema';
import { sharedReadingSchema } from './schema.zod';

/**
 * The app validates with plain functions (no schema library in the first
 * download); the Zod schemas are the reference. Both must accept and reject
 * the same values and return the same clean copy.
 */
const reading = {
  v: 1,
  mode: 'simulate',
  question: 'q',
  deckId: 'rws-78',
  spreadId: 'three-card',
  placements: [
    { positionId: 'past', cardId: 'major-00-fool', orientation: 'upright' },
  ],
};
const interpretation = {
  cards: [{ positionId: 'past', cardId: 'major-00-fool', note: 'n' }],
  relations: ['r'],
  summary: 's',
  advice: 'a',
};

const SHARED: unknown[] = [
  reading,
  { ...reading, seed: 7 },
  { ...reading, seed: 1.5 },
  { ...reading, seed: '7' },
  { ...reading, extra: true },
  { ...reading, v: 2 },
  { ...reading, mode: 'x' },
  { ...reading, question: 'x'.repeat(500) },
  { ...reading, question: 'x'.repeat(501) },
  { ...reading, placements: [] },
  { ...reading, placements: [{ positionId: 'p' }] },
  { ...reading, placements: [{ ...reading.placements[0], orientation: 'up' }] },
  { ...reading, placements: [{ ...reading.placements[0], junk: 1 }] },
  { ...reading, placements: 'no' },
  { ...reading, deckId: 3 },
  [],
  null,
  'text',
  7,
];

const INTERPRETED: unknown[] = [
  interpretation,
  { ...interpretation, hingeCardId: 'major-00-fool' },
  { ...interpretation, hingeCardId: 4 },
  { ...interpretation, extra: 1 },
  { ...interpretation, cards: [{ positionId: 'p', cardId: 'c' }] },
  {
    ...interpretation,
    cards: [{ positionId: 'p', cardId: 'c', note: 'n', x: 1 }],
  },
  { ...interpretation, cards: 'no' },
  { ...interpretation, relations: [1] },
  { ...interpretation, relations: [] },
  { ...interpretation, summary: undefined },
  { ...interpretation, advice: 3 },
  [],
  null,
  'text',
];

describe('plain validators match the Zod schemas', () => {
  it.each(SHARED.map((v, i) => [i, v]))('shared reading %i', (_i, value) => {
    const z = sharedReadingSchema.safeParse(value);
    const plain = parseSharedReading(value);
    expect(plain !== undefined).toBe(z.success);
    if (z.success) expect(plain).toEqual(z.data);
  });

  it.each(INTERPRETED.map((v, i) => [i, v]))(
    'interpretation %i',
    (_i, value) => {
      const z = interpretationSchema.safeParse(value);
      const plain = parseInterpretation(value);
      expect(plain !== undefined).toBe(z.success);
      if (z.success) expect(plain).toEqual(z.data);
    },
  );
});
