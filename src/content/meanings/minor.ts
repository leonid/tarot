import type { MeaningTable } from '../../domain/types';

/**
 * Minor Arcana base meanings, keyed by card id. Original wording, written with the
 * public-domain Waite text as a reference (see docs/research/sources.md).
 * Only one sample card exists so far; the rest is a content follow-up.
 */
export const minorMeanings: MeaningTable = {
  'cups-01-ace': {
    upright: {
      keywords: ['new feeling', 'compassion', 'openness'],
      summary: 'An emotional beginning: affection, creativity or renewed care.',
    },
    reversed: {
      keywords: ['blocked emotion', 'emptiness', 'withholding'],
      summary: 'Feelings are present but held back or poorly received.',
    },
  },
};
