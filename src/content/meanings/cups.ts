import type { MeaningTable } from '../../domain/types';

/**
 * Cups (water): emotion, relationships, intuition, imagination. Original
 * wording; see docs/research/sources.md. Keys are card ids.
 */
export const cupsMeanings: MeaningTable = {
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
  'cups-02-two': {
    upright: {
      keywords: ['partnership', 'mutual attraction', 'harmony', 'exchange'],
      summary: 'Two sides meet as equals, with real give and take.',
    },
    reversed: {
      keywords: ['imbalance', 'miscommunication', 'break in trust'],
      summary: 'The bond tilts: one side gives more, or the link frays.',
    },
  },
  'cups-03-three': {
    upright: {
      keywords: ['celebration', 'friendship', 'community', 'shared joy'],
      summary: 'Good company and a reason to mark something together.',
    },
    reversed: {
      keywords: ['overindulgence', 'gossip', 'exclusion'],
      summary: 'The group turns cliquey or the party goes too far.',
    },
  },
  'cups-04-four': {
    upright: {
      keywords: ['apathy', 'contemplation', 'discontent', 'missed offer'],
      summary:
        'Absorbed in dissatisfaction, you overlook what is being offered.',
    },
    reversed: {
      keywords: ['renewed interest', 'acceptance', 'ending withdrawal'],
      summary: 'Attention returns outward and a new offer is finally seen.',
    },
  },
  'cups-05-five': {
    upright: {
      keywords: ['loss', 'grief', 'regret', 'fixation on what is gone'],
      summary: 'Mourning what spilled, with what remains still unseen.',
    },
    reversed: {
      keywords: ['recovery', 'moving on', 'lingering sorrow'],
      summary: 'The turn toward what is left begins, or grief refuses to lift.',
    },
  },
  'cups-06-six': {
    upright: {
      keywords: ['nostalgia', 'innocence', 'kindness', 'old connections'],
      summary:
        'A gentle return to the past, with simple gifts and old friends.',
    },
    reversed: {
      keywords: ['stuck in the past', 'idealised memory', 'growing up'],
      summary: 'The past is clung to, or finally left behind for the present.',
    },
  },
  'cups-07-seven': {
    upright: {
      keywords: ['choices', 'fantasy', 'wishful thinking', 'temptation'],
      summary: 'Many tempting options, and not all of them are real.',
    },
    reversed: {
      keywords: ['clarity', 'decision', 'disillusionment'],
      summary: 'The fog clears and one option is chosen, or the dream pops.',
    },
  },
  'cups-08-eight': {
    upright: {
      keywords: ['walking away', 'seeking more', 'disillusion', 'letting go'],
      summary:
        'You leave something that looks full because it no longer feeds you.',
    },
    reversed: {
      keywords: ['fear of leaving', 'drifting', 'returning'],
      summary: 'Staying out of fear, or leaving without knowing the goal.',
    },
  },
  'cups-09-nine': {
    upright: {
      keywords: ['contentment', 'wish fulfilled', 'satisfaction', 'pleasure'],
      summary: 'What you hoped for has arrived, and you may enjoy it.',
    },
    reversed: {
      keywords: ['smugness', 'hollow satisfaction', 'greed'],
      summary: 'Having it all still leaves something missing.',
    },
  },
  'cups-10-ten': {
    upright: {
      keywords: ['emotional fulfilment', 'family', 'harmony', 'belonging'],
      summary: 'Heartfelt peace shared with the people who matter.',
    },
    reversed: {
      keywords: ['family strain', 'broken ideal', 'misaligned values'],
      summary: 'The picture of happiness cracks, or does not match reality.',
    },
  },
  'cups-11-page': {
    upright: {
      keywords: ['sensitivity', 'creative spark', 'sweet message', 'curiosity'],
      summary: 'A tender, imaginative beginning, often carrying good news.',
    },
    reversed: {
      keywords: ['immaturity', 'emotional escape', 'creative block'],
      summary: 'Feelings are childish or avoided, and ideas stay unexpressed.',
    },
  },
  'cups-12-knight': {
    upright: {
      keywords: ['romance', 'charm', 'invitation', 'idealism'],
      summary:
        'An offer arrives, led by the heart and a dream of something better.',
    },
    reversed: {
      keywords: ['moodiness', 'unrealistic promises', 'disappointment'],
      summary: 'The charm hides inconsistency, and promises go unmet.',
    },
  },
  'cups-13-queen': {
    upright: {
      keywords: ['compassion', 'intuition', 'emotional depth', 'care'],
      summary: 'Deeply attuned to feeling, she listens and soothes.',
    },
    reversed: {
      keywords: ['overwhelm', 'dependence', 'emotional manipulation'],
      summary: 'Empathy tips into drowning in feeling or using it as leverage.',
    },
  },
  'cups-14-king': {
    upright: {
      keywords: ['emotional balance', 'diplomacy', 'wisdom', 'generosity'],
      summary: 'Feels deeply yet stays steady, and guides others with calm.',
    },
    reversed: {
      keywords: ['suppression', 'volatility', 'coldness'],
      summary: 'Control over emotion becomes bottling up, or it bursts out.',
    },
  },
};
