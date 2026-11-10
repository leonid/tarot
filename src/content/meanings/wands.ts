import type { MeaningTable } from '../../domain/types';

/**
 * Wands (fire): will, drive, ambition, creativity. Original wording; see
 * docs/research/sources.md. Keys are card ids.
 */
export const wandsMeanings: MeaningTable = {
  'wands-01-ace': {
    upright: {
      keywords: ['spark', 'inspiration', 'new venture', 'raw energy'],
      summary: 'A fresh burst of drive and possibility, ready to be acted on.',
    },
    reversed: {
      keywords: ['false start', 'lack of drive', 'delay'],
      summary: 'The spark is there but fizzles, or the timing is wrong.',
    },
  },
  'wands-02-two': {
    upright: {
      keywords: ['planning', 'choosing a direction', 'ambition', 'foresight'],
      summary: 'You hold a first success and must decide where to aim next.',
    },
    reversed: {
      keywords: ['indecision', 'fear of the unknown', 'staying small'],
      summary: 'The plan stays on paper because the next step feels too big.',
    },
  },
  'wands-03-three': {
    upright: {
      keywords: ['expansion', 'progress', 'looking ahead', 'early results'],
      summary: 'Efforts are underway and the first returns are on the horizon.',
    },
    reversed: {
      keywords: ['obstacles', 'delays', 'poor planning'],
      summary: 'Expected results arrive late or fall short of the plan.',
    },
  },
  'wands-04-four': {
    upright: {
      keywords: ['celebration', 'stability', 'homecoming', 'milestone'],
      summary: 'A good foundation is reached and worth marking with others.',
    },
    reversed: {
      keywords: ['unease at home', 'unstable footing', 'cancelled plans'],
      summary: 'The foundation is shakier than it looks, or the party is off.',
    },
  },
  'wands-05-five': {
    upright: {
      keywords: ['competition', 'conflict', 'friction', 'jostling'],
      summary: 'Many wills collide, with plenty of noise and no clear winner.',
    },
    reversed: {
      keywords: ['avoiding conflict', 'truce', 'inner tension'],
      summary: 'The clash is dodged or settled, or it simmers unspoken.',
    },
  },
  'wands-06-six': {
    upright: {
      keywords: ['victory', 'recognition', 'public success', 'confidence'],
      summary: 'Effort is acknowledged and you are seen to have won.',
    },
    reversed: {
      keywords: ['hollow win', 'fall from favour', 'ego'],
      summary:
        'Credit goes elsewhere, or success feeds pride more than progress.',
    },
  },
  'wands-07-seven': {
    upright: {
      keywords: ['defence', 'perseverance', 'standing ground', 'challenge'],
      summary: 'You hold the higher position but must keep defending it.',
    },
    reversed: {
      keywords: ['overwhelm', 'giving way', 'exhaustion'],
      summary: 'Under pressure the stance weakens, or you yield too soon.',
    },
  },
  'wands-08-eight': {
    upright: {
      keywords: ['speed', 'momentum', 'swift news', 'movement'],
      summary: 'Things accelerate; messages and events arrive all at once.',
    },
    reversed: {
      keywords: ['delays', 'frustration', 'scattered pace'],
      summary: 'Momentum stalls or runs in too many directions at once.',
    },
  },
  'wands-09-nine': {
    upright: {
      keywords: ['resilience', 'wariness', 'last stand', 'persistence'],
      summary: 'Battered but standing; one more push remains.',
    },
    reversed: {
      keywords: ['burnout', 'defensiveness', 'giving up near the end'],
      summary: 'Fatigue and suspicion sap what strength is left.',
    },
  },
  'wands-10-ten': {
    upright: {
      keywords: ['burden', 'overcommitment', 'responsibility', 'strain'],
      summary: 'You carry more than is yours to carry, almost to the finish.',
    },
    reversed: {
      keywords: ['letting go', 'delegating', 'collapse under load'],
      summary: 'Either the weight is finally set down or it overwhelms you.',
    },
  },
  'wands-11-page': {
    upright: {
      keywords: ['enthusiasm', 'curiosity', 'discovery', 'fresh ideas'],
      summary: 'An eager messenger of new interests and energetic first steps.',
    },
    reversed: {
      keywords: ['restlessness', 'half-formed ideas', 'bad news'],
      summary: 'Excitement without follow-through, or disappointing word.',
    },
  },
  'wands-12-knight': {
    upright: {
      keywords: ['passion', 'adventure', 'boldness', 'haste'],
      summary: 'Charges toward the goal with energy and little caution.',
    },
    reversed: {
      keywords: ['recklessness', 'impatience', 'burning out'],
      summary: 'Drive turns into impulsiveness, or stalls before arriving.',
    },
  },
  'wands-13-queen': {
    upright: {
      keywords: ['confidence', 'warmth', 'charisma', 'determination'],
      summary: 'Self-assured and magnetic, she leads by drawing people in.',
    },
    reversed: {
      keywords: ['jealousy', 'insecurity', 'domineering'],
      summary: 'Confidence curdles into demanding attention or self-doubt.',
    },
  },
  'wands-14-king': {
    upright: {
      keywords: ['vision', 'leadership', 'enterprise', 'decisiveness'],
      summary: 'A natural leader who turns bold ideas into lasting results.',
    },
    reversed: {
      keywords: ['tyranny', 'impulsiveness', 'unrealistic expectations'],
      summary: 'Vision slips into ego, harsh demands or careless promises.',
    },
  },
};
