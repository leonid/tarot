import type { MeaningTable } from '../../domain/types';

/**
 * Swords (air): intellect, truth, conflict, communication. Original wording;
 * see docs/research/sources.md. Keys are card ids.
 */
export const swordsMeanings: MeaningTable = {
  'swords-01-ace': {
    upright: {
      keywords: ['clarity', 'truth', 'breakthrough', 'decisive idea'],
      summary: 'A clean cut through confusion: the facts become plain.',
    },
    reversed: {
      keywords: ['confusion', 'harsh words', 'clouded judgement'],
      summary: 'Thinking is muddled, or the truth is used as a blunt weapon.',
    },
  },
  'swords-02-two': {
    upright: {
      keywords: ['stalemate', 'difficult choice', 'avoidance', 'guarded'],
      summary: 'Held in balance by refusing to look at what must be decided.',
    },
    reversed: {
      keywords: ['information released', 'overwhelm', 'forced decision'],
      summary: 'The blindfold slips and the choice can no longer be put off.',
    },
  },
  'swords-03-three': {
    upright: {
      keywords: ['heartbreak', 'grief', 'painful truth', 'separation'],
      summary: 'A clean, sharp hurt that must be felt to be healed.',
    },
    reversed: {
      keywords: ['recovery', 'forgiveness', 'suppressed pain'],
      summary: 'The wound begins to close, or is buried and left to ache.',
    },
  },
  'swords-04-four': {
    upright: {
      keywords: ['rest', 'recovery', 'retreat', 'recuperation'],
      summary:
        'Stillness is needed before the next fight; withdraw and recover.',
    },
    reversed: {
      keywords: ['restlessness', 'burnout', 'returning too soon'],
      summary: 'Rest is refused or cut short, and exhaustion lingers.',
    },
  },
  'swords-05-five': {
    upright: {
      keywords: ['conflict', 'hollow victory', 'defeat', 'self-interest'],
      summary:
        'Winning costs more than it is worth, and someone walks away hurt.',
    },
    reversed: {
      keywords: ['reconciliation', 'regret', 'letting the fight go'],
      summary: 'Time to make peace, or to admit the cost of the quarrel.',
    },
  },
  'swords-06-six': {
    upright: {
      keywords: ['transition', 'moving on', 'calmer waters', 'leaving trouble'],
      summary: 'A slow, quiet passage away from difficulty toward relief.',
    },
    reversed: {
      keywords: ['resistance to change', 'baggage', 'unfinished journey'],
      summary: 'The move is stalled, or the trouble comes along with you.',
    },
  },
  'swords-07-seven': {
    upright: {
      keywords: ['stealth', 'strategy', 'deception', 'getting away with it'],
      summary:
        'Acting alone and quietly, which may be cunning or may be dishonest.',
    },
    reversed: {
      keywords: ['exposure', 'confession', 'conscience'],
      summary: 'The scheme is discovered, or you come clean.',
    },
  },
  'swords-08-eight': {
    upright: {
      keywords: ['restriction', 'feeling trapped', 'self-limiting beliefs'],
      summary:
        'The bonds are looser than they seem; the cage is mostly in the mind.',
    },
    reversed: {
      keywords: ['release', 'new perspective', 'taking back control'],
      summary: 'You see the way out and begin to take it.',
    },
  },
  'swords-09-nine': {
    upright: {
      keywords: ['anxiety', 'worry', 'sleepless nights', 'guilt'],
      summary: 'Fear loops in the dark, and it weighs more than the facts do.',
    },
    reversed: {
      keywords: ['hope returning', 'reaching out', 'deep-seated fear'],
      summary: 'Help or daylight arrives, or the worry has gone underground.',
    },
  },
  'swords-10-ten': {
    upright: {
      keywords: ['ending', 'rock bottom', 'betrayal', 'finality'],
      summary: 'The worst has happened, and the only way now is up.',
    },
    reversed: {
      keywords: ['recovery', 'refusing to let go', 'slow healing'],
      summary: 'Things begin to mend, or an ending is dragged out.',
    },
  },
  'swords-11-page': {
    upright: {
      keywords: ['curiosity', 'vigilance', 'sharp mind', 'new ideas'],
      summary: 'Alert and questioning, eager to learn what is true.',
    },
    reversed: {
      keywords: ['gossip', 'sharp tongue', 'scattered thinking'],
      summary:
        'Words are used carelessly, or attention jumps from idea to idea.',
    },
  },
  'swords-12-knight': {
    upright: {
      keywords: ['ambition', 'speed', 'directness', 'intensity'],
      summary: 'Charges at the problem with logic and nerve.',
    },
    reversed: {
      keywords: ['rashness', 'bluntness', 'aggression'],
      summary: 'Haste and sharp words do more harm than the problem did.',
    },
  },
  'swords-13-queen': {
    upright: {
      keywords: ['honesty', 'independence', 'perception', 'clear boundaries'],
      summary: 'Sees things as they are and says so without cruelty.',
    },
    reversed: {
      keywords: ['bitterness', 'coldness', 'cutting remarks'],
      summary: 'Clear sight hardens into judgement and distance.',
    },
  },
  'swords-14-king': {
    upright: {
      keywords: ['authority', 'intellect', 'fairness', 'reasoned judgement'],
      summary: 'Decides by evidence and principle, not by mood.',
    },
    reversed: {
      keywords: ['manipulation', 'cruelty', 'abuse of power'],
      summary: 'Intellect serves control and rules are bent to suit the ruler.',
    },
  },
};
