import type { MeaningTable } from '../../domain/types';

/**
 * Pentacles (earth): work, money, body, the material world. Original wording;
 * see docs/research/sources.md. Keys are card ids.
 */
export const pentaclesMeanings: MeaningTable = {
  'pentacles-01-ace': {
    upright: {
      keywords: ['opportunity', 'prosperity', 'new venture', 'solid start'],
      summary: 'A tangible chance appears, with real resources behind it.',
    },
    reversed: {
      keywords: ['missed chance', 'poor planning', 'scarcity'],
      summary:
        'The offer is squandered, or it was never as solid as it looked.',
    },
  },
  'pentacles-02-two': {
    upright: {
      keywords: ['juggling', 'adaptability', 'balance', 'priorities'],
      summary: 'Keeping several demands in the air with easy, flexible rhythm.',
    },
    reversed: {
      keywords: ['overextension', 'disorganisation', 'dropped balls'],
      summary: 'Too much at once, and something starts to slip.',
    },
  },
  'pentacles-03-three': {
    upright: {
      keywords: ['teamwork', 'craft', 'collaboration', 'skilled work'],
      summary: 'Quality comes from different skills building the same thing.',
    },
    reversed: {
      keywords: ['poor teamwork', 'shoddy work', 'lack of vision'],
      summary:
        'Parts do not fit: people work at cross purposes or cut corners.',
    },
  },
  'pentacles-04-four': {
    upright: {
      keywords: ['security', 'saving', 'control', 'possessiveness'],
      summary: 'Holding tight to what you have, for safety or out of fear.',
    },
    reversed: {
      keywords: ['letting go', 'generosity', 'reckless spending'],
      summary: 'The grip loosens, wisely or too far.',
    },
  },
  'pentacles-05-five': {
    upright: {
      keywords: ['hardship', 'poverty', 'exclusion', 'feeling out in the cold'],
      summary: 'Struggle and isolation, with help closer than it seems.',
    },
    reversed: {
      keywords: ['recovery', 'accepting help', 'lingering worry'],
      summary:
        'The worst passes and support is found, or shame keeps you away.',
    },
  },
  'pentacles-06-six': {
    upright: {
      keywords: ['generosity', 'fair exchange', 'charity', 'sharing'],
      summary: 'Resources move between those who have and those who need.',
    },
    reversed: {
      keywords: ['strings attached', 'debt', 'unequal give and take'],
      summary: 'Giving is used for power, or the exchange is lopsided.',
    },
  },
  'pentacles-07-seven': {
    upright: {
      keywords: ['patience', 'long-term effort', 'assessment', 'growth'],
      summary: 'The crop is growing but not ready; stop and take stock.',
    },
    reversed: {
      keywords: ['impatience', 'poor returns', 'wasted effort'],
      summary:
        'Results disappoint, or you pull up the plant to check its roots.',
    },
  },
  'pentacles-08-eight': {
    upright: {
      keywords: ['diligence', 'apprenticeship', 'mastery', 'focus'],
      summary: 'Steady, repeated effort refines a skill into excellence.',
    },
    reversed: {
      keywords: ['perfectionism', 'boredom', 'cutting corners'],
      summary:
        'The craft turns into drudgery, or care slips for the sake of speed.',
    },
  },
  'pentacles-09-nine': {
    upright: {
      keywords: ['self-sufficiency', 'comfort', 'refinement', 'reward'],
      summary: 'Independent success, enjoyed with quiet satisfaction.',
    },
    reversed: {
      keywords: ['overworking', 'dependence on wealth', 'insecurity'],
      summary: 'Comfort rests on shaky ground, or is not enjoyed at all.',
    },
  },
  'pentacles-10-ten': {
    upright: {
      keywords: ['legacy', 'lasting wealth', 'family', 'stability'],
      summary: 'Security built to last and passed on through generations.',
    },
    reversed: {
      keywords: ['financial strain', 'family disputes', 'fragile foundation'],
      summary: 'What was meant to endure is shaky, contested or lost.',
    },
  },
  'pentacles-11-page': {
    upright: {
      keywords: ['study', 'practicality', 'ambition', 'new skill'],
      summary: 'A careful student with a real goal and a plan to reach it.',
    },
    reversed: {
      keywords: ['procrastination', 'lack of focus', 'impractical dreams'],
      summary: 'Good intentions without the groundwork to back them.',
    },
  },
  'pentacles-12-knight': {
    upright: {
      keywords: ['reliability', 'diligence', 'routine', 'patience'],
      summary: 'Slow and sure: steady progress by doing the work thoroughly.',
    },
    reversed: {
      keywords: ['stubbornness', 'stagnation', 'boredom'],
      summary: 'Routine hardens into a rut, and caution into refusal to move.',
    },
  },
  'pentacles-13-queen': {
    upright: {
      keywords: ['nurturing', 'practicality', 'resourcefulness', 'comfort'],
      summary: 'Makes a home and a living out of care and good sense.',
    },
    reversed: {
      keywords: ['self-neglect', 'work-life imbalance', 'smothering'],
      summary:
        'Looking after everything but oneself, or caring becomes control.',
    },
  },
  'pentacles-14-king': {
    upright: {
      keywords: ['wealth', 'stability', 'security', 'generous provider'],
      summary: 'Master of the material world, building lasting prosperity.',
    },
    reversed: {
      keywords: ['greed', 'materialism', 'stubborn control'],
      summary: 'Wealth becomes the goal and the owner its prisoner.',
    },
  },
};
