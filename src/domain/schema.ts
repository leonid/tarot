import { z } from 'zod';

/** The current shared-reading format (version 1). See migrate.ts to change it. */
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
