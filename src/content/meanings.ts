import type { MeaningTable } from '../domain/types';

/**
 * Base meanings, keyed by card id. Original wording, written with the
 * public-domain Waite text as a reference (see docs/research/sources.md).
 * Only a few sample cards exist so far; the rest is a content follow-up.
 */
export const meanings: MeaningTable = {
  'major-00-fool': {
    upright: {
      keywords: ['beginnings', 'trust', 'spontaneity'],
      summary: 'A leap into the unknown, taken with open-hearted trust.',
    },
    reversed: {
      keywords: ['recklessness', 'hesitation', 'naivety'],
      summary: 'Either a careless jump or a fear that keeps you at the edge.',
    },
    themes: {
      advice: 'Start before you feel fully ready, but look where you step.',
    },
  },
  'major-13-death': {
    upright: {
      keywords: ['ending', 'transformation', 'release'],
      summary: 'A chapter closes so that something new can take its place.',
    },
    reversed: {
      keywords: ['resistance', 'stagnation', 'clinging'],
      summary: 'A necessary ending is being delayed, and change stalls.',
    },
  },
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
