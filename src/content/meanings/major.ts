import type { MeaningTable } from '../../domain/types';

/**
 * Major Arcana base meanings, in original wording. Reference material and
 * licensing policy: docs/research/sources.md. Keys are card ids.
 */
export const majorMeanings: MeaningTable = {
  'major-00-fool': {
    upright: {
      keywords: ['beginnings', 'trust', 'spontaneity', 'open-mindedness'],
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
  'major-01-magician': {
    upright: {
      keywords: ['skill', 'will', 'resourcefulness', 'focus'],
      summary:
        'You already hold the tools you need; act with intent to use them.',
    },
    reversed: {
      keywords: ['manipulation', 'scattered effort', 'untapped talent'],
      summary: 'Ability is wasted, misdirected, or used to mislead.',
    },
  },
  'major-02-high-priestess': {
    upright: {
      keywords: ['intuition', 'stillness', 'mystery', 'inner knowing'],
      summary: 'Answers sit below the surface; listen before you speak.',
    },
    reversed: {
      keywords: ['secrets', 'ignored instinct', 'surface noise'],
      summary: 'Inner signals are being drowned out or kept hidden.',
    },
  },
  'major-03-empress': {
    upright: {
      keywords: ['abundance', 'nurture', 'creativity', 'sensuality'],
      summary: 'Growth through care, comfort and generous making.',
    },
    reversed: {
      keywords: ['smothering', 'neglect', 'creative block', 'dependence'],
      summary: 'Care turns into control, or is withheld from oneself.',
    },
  },
  'major-04-emperor': {
    upright: {
      keywords: ['structure', 'authority', 'stability', 'discipline'],
      summary:
        'Order, boundaries and firm leadership give things a foundation.',
    },
    reversed: {
      keywords: ['rigidity', 'domination', 'chaos', 'weak boundaries'],
      summary: 'Control grows brittle, or authority is missing altogether.',
    },
  },
  'major-05-hierophant': {
    upright: {
      keywords: ['tradition', 'teaching', 'shared belief', 'conformity'],
      summary: 'Wisdom passed through established institutions and mentors.',
    },
    reversed: {
      keywords: ['rebellion', 'dogma', 'personal path', 'unorthodoxy'],
      summary: 'Inherited rules are questioned, for better or worse.',
    },
  },
  'major-06-lovers': {
    upright: {
      keywords: ['union', 'choice', 'alignment', 'values'],
      summary:
        'A meaningful bond or a decision that must match what you value.',
    },
    reversed: {
      keywords: ['disharmony', 'misalignment', 'avoided choice'],
      summary: 'Values and actions pull apart, and a decision stays unmade.',
    },
  },
  'major-07-chariot': {
    upright: {
      keywords: ['drive', 'victory', 'self-mastery', 'momentum'],
      summary: 'Opposing forces are steered together toward a goal.',
    },
    reversed: {
      keywords: ['loss of direction', 'aggression', 'stalling'],
      summary: 'The reins slip, so effort scatters or turns into force.',
    },
  },
  'major-08-strength': {
    upright: {
      keywords: ['courage', 'patience', 'compassion', 'gentle control'],
      summary: 'Real power is calm; it tames fear by meeting it kindly.',
    },
    reversed: {
      keywords: ['self-doubt', 'raw impulse', 'depleted resolve'],
      summary: 'Confidence wavers and instinct runs ahead of judgement.',
    },
  },
  'major-09-hermit': {
    upright: {
      keywords: ['solitude', 'reflection', 'guidance', 'search for truth'],
      summary: 'Step back from the crowd to find your own light.',
    },
    reversed: {
      keywords: ['isolation', 'withdrawal', 'refusing advice'],
      summary: 'Solitude hardens into loneliness or avoidance.',
    },
  },
  'major-10-wheel-of-fortune': {
    upright: {
      keywords: ['cycles', 'change', 'turning point', 'fate'],
      summary:
        'The situation is turning; what rises will also come round again.',
    },
    reversed: {
      keywords: ['resisting change', 'bad timing', 'repeating patterns'],
      summary: 'A cycle is stuck or fought against rather than ridden.',
    },
  },
  'major-11-justice': {
    upright: {
      keywords: ['fairness', 'truth', 'cause and effect', 'accountability'],
      summary: 'Choices carry consequences, and an honest weighing is due.',
    },
    reversed: {
      keywords: ['bias', 'evasion', 'unfairness'],
      summary: 'Facts are skewed or responsibility is dodged.',
    },
  },
  'major-12-hanged-man': {
    upright: {
      keywords: ['pause', 'surrender', 'new perspective', 'suspension'],
      summary: 'Waiting on purpose lets you see the matter from another side.',
    },
    reversed: {
      keywords: ['stalling', 'needless sacrifice', 'resistance to pause'],
      summary: 'Stuck without learning anything, or refusing to let go.',
    },
  },
  'major-13-death': {
    upright: {
      keywords: ['ending', 'transformation', 'release', 'transition'],
      summary: 'A chapter closes so that something new can take its place.',
    },
    reversed: {
      keywords: ['resistance', 'stagnation', 'clinging'],
      summary: 'A necessary ending is being delayed, and change stalls.',
    },
  },
  'major-14-temperance': {
    upright: {
      keywords: ['balance', 'moderation', 'blending', 'patience'],
      summary: 'Opposites are combined slowly until they work together.',
    },
    reversed: {
      keywords: ['excess', 'imbalance', 'impatience'],
      summary: 'The mix is off: too much of one thing, too fast.',
    },
  },
  'major-15-devil': {
    upright: {
      keywords: ['attachment', 'temptation', 'shadow', 'bondage'],
      summary: 'Something holds you that you have, in part, agreed to.',
    },
    reversed: {
      keywords: ['release', 'breaking free', 'reclaiming power'],
      summary: 'The chain is loosening as the hold is recognised.',
    },
  },
  'major-16-tower': {
    upright: {
      keywords: ['upheaval', 'revelation', 'collapse', 'shock'],
      summary: 'A false structure falls suddenly, and truth comes with it.',
    },
    reversed: {
      keywords: ['averted disaster', 'fear of change', 'slow breakdown'],
      summary: 'The collapse is avoided, delayed, or happens quietly inside.',
    },
  },
  'major-17-star': {
    upright: {
      keywords: ['hope', 'renewal', 'serenity', 'inspiration'],
      summary: 'Calm and faith return after hardship, and healing begins.',
    },
    reversed: {
      keywords: ['discouragement', 'disconnection', 'lost faith'],
      summary: 'Hope feels out of reach, though it has not gone.',
    },
  },
  'major-18-moon': {
    upright: {
      keywords: ['illusion', 'dreams', 'uncertainty', 'subconscious'],
      summary: 'Things are not what they seem; move carefully by instinct.',
    },
    reversed: {
      keywords: ['clarity emerging', 'confusion', 'repressed fear'],
      summary: 'Fog begins to lift, or fear stays buried and distorts things.',
    },
  },
  'major-19-sun': {
    upright: {
      keywords: ['joy', 'success', 'vitality', 'clarity'],
      summary: 'Plain, open good fortune: things are visible and going well.',
    },
    reversed: {
      keywords: ['dimmed joy', 'delay', 'overconfidence'],
      summary: 'The good is there but clouded, late, or taken for granted.',
    },
  },
  'major-20-judgement': {
    upright: {
      keywords: ['reckoning', 'calling', 'forgiveness', 'rebirth'],
      summary: 'A moment to answer an inner call and settle the past.',
    },
    reversed: {
      keywords: ['self-doubt', 'avoidance', 'harsh self-judgement'],
      summary: 'The call goes unanswered, or old guilt drowns it out.',
    },
  },
  'major-21-world': {
    upright: {
      keywords: ['completion', 'wholeness', 'achievement', 'integration'],
      summary: 'A cycle comes to a satisfying close, with everything in place.',
    },
    reversed: {
      keywords: ['unfinished business', 'loose ends', 'delayed closure'],
      summary: 'Almost done, but one last step stands between you and the end.',
    },
  },
};
