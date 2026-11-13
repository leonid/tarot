import type { Orientation } from './types';

/** The current shared-reading format (version 1). See migrate.ts to change it. */
export interface SharedReading {
  v: 1;
  mode: 'simulate' | 'setup';
  question: string;
  deckId: string;
  spreadId: string;
  placements: {
    positionId: string;
    cardId: string;
    orientation: Orientation;
  }[];
  seed?: number | undefined;
}

const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

/**
 * Checks an untrusted value and returns a clean copy of it (unknown fields
 * dropped), or undefined if it does not fit. Written by hand, not with a
 * schema library, so the first download stays small; schema.zod.ts holds the
 * same rules as a schema, and a test keeps the two in step.
 */
export function parseSharedReading(x: unknown): SharedReading | undefined {
  if (!isObject(x) || x.v !== 1) return undefined;
  const { mode, question, deckId, spreadId, placements, seed } = x;
  if (mode !== 'simulate' && mode !== 'setup') return undefined;
  if (typeof question !== 'string' || question.length > 500) return undefined;
  if (typeof deckId !== 'string' || typeof spreadId !== 'string')
    return undefined;
  if (!Array.isArray(placements)) return undefined;
  const cards: SharedReading['placements'] = [];
  for (const p of placements) {
    if (!isObject(p)) return undefined;
    const { positionId, cardId, orientation } = p;
    if (typeof positionId !== 'string' || typeof cardId !== 'string')
      return undefined;
    if (orientation !== 'upright' && orientation !== 'reversed')
      return undefined;
    cards.push({ positionId, cardId, orientation });
  }
  if (seed !== undefined && !Number.isSafeInteger(seed)) return undefined;
  return {
    v: 1,
    mode,
    question,
    deckId,
    spreadId,
    placements: cards,
    ...(seed === undefined ? {} : { seed: seed as number }),
  };
}
