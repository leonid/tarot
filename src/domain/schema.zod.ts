import * as z from 'zod/mini';
import type { SharedReading } from './schema';

/**
 * The shared-reading format as a Zod schema. The app checks readings with the
 * plain `parseSharedReading` in schema.ts, so the first download carries no
 * validation library; this schema is the reference the tests hold it to.
 */
export const sharedReadingSchema = z.object({
  v: z.literal(1),
  mode: z.enum(['simulate', 'setup']),
  question: z.string().check(z.maxLength(500)),
  deckId: z.string(),
  spreadId: z.string(),
  placements: z.array(
    z.object({
      positionId: z.string(),
      cardId: z.string(),
      orientation: z.enum(['upright', 'reversed']),
    }),
  ),
  seed: z.optional(z.int()),
});

// The two descriptions must agree about the type.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
export const sameType: Same<
  z.infer<typeof sharedReadingSchema>,
  SharedReading
> = true;
