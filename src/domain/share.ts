import { z } from 'zod';
import type { Reading } from './types';

export const sharedReadingSchema = z.object({
  v: z.literal(1),
  mode: z.enum(['simulate', 'setup']),
  question: z.string().max(500),
  deckId: z.string(),
  spreadId: z.string(),
  placements: z.array(
    z.object({
      positionId: z.string(),
      cardId: z.string(),
      orientation: z.enum(['upright', 'reversed']),
    }),
  ),
  seed: z.number().int().optional(),
});

export type SharedReading = z.infer<typeof sharedReadingSchema>;

export function toShared(
  reading: Reading,
  mode: SharedReading['mode'],
): SharedReading {
  return {
    v: 1,
    mode,
    question: reading.question,
    deckId: reading.deckId,
    spreadId: reading.spreadId,
    placements: [...reading.placements],
    ...(reading.seed !== undefined ? { seed: reading.seed } : {}),
  };
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function encodeShared(shared: SharedReading): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(shared)));
}

/** Returns null for anything malformed; shared links are untrusted input. */
export function decodeShared(text: string): SharedReading | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(text));
    const parsed = sharedReadingSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
