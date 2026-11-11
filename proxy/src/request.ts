import { z } from 'zod';
import { getDeck } from '../../src/content/decks';
import { getSpread } from '../../src/content/spreads';
import { validateReading } from '../../src/domain/validate';

/** Largest request body the proxy reads, in bytes. A full reading is well under 2 KB. */
export const MAX_BODY_BYTES = 8 * 1024;

const id = z.string().min(1).max(64);

/** What the client may send. Strict: unknown keys are rejected, not ignored. */
export const interpretRequestSchema = z
  .object({
    v: z.literal(1),
    question: z.string().max(500),
    deckId: id,
    spreadId: id,
    locale: z.string().max(16).optional(),
    placements: z
      .array(
        z
          .object({
            positionId: id,
            cardId: id,
            orientation: z.enum(['upright', 'reversed']),
          })
          .strict(),
      )
      .min(1)
      .max(20),
  })
  .strict();

export type InterpretRequest = z.infer<typeof interpretRequestSchema>;

export type Parsed =
  { ok: true; request: InterpretRequest } | { ok: false; error: string };

/** Shape check, then the same consistency check the app uses (known deck, spread, cards, no repeats, complete). */
export function parseRequest(raw: unknown): Parsed {
  const shape = interpretRequestSchema.safeParse(raw);
  if (!shape.success) return { ok: false, error: 'Invalid request body.' };
  const r = shape.data;
  const deck = getDeck(r.deckId);
  const spread = getSpread(r.spreadId);
  if (!deck || !spread) return { ok: false, error: 'Unknown deck or spread.' };
  if (validateReading(r, deck, spread).length > 0)
    return { ok: false, error: 'Inconsistent reading.' };
  if (r.placements.length !== spread.positions.length)
    return { ok: false, error: 'Reading is not complete.' };
  return { ok: true, request: r };
}
