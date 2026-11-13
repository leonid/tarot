import * as z from 'zod/mini';
import type { Interpretation } from './interpretation';

/**
 * The reading an interpreter returns, as a Zod schema. The proxy builds its
 * output format from it. The app checks replies with the plain
 * `parseInterpretation`, and a test holds the two to the same rules.
 */
export const interpretationSchema = z.object({
  cards: z.array(
    z.object({
      positionId: z.string(),
      cardId: z.string(),
      note: z.string(),
    }),
  ),
  relations: z.array(z.string()),
  /** The card that most changes the others' meanings (DCAS step 2). */
  hingeCardId: z.optional(z.string()),
  summary: z.string(),
  advice: z.string(),
});

// The two descriptions must agree about the type.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
export const sameType: Same<
  z.infer<typeof interpretationSchema>,
  Interpretation
> = true;
