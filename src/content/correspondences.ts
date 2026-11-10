import type { Correspondence } from '../domain/correspondences';
import type { Element } from '../domain/elements';
import type { Planet, Sign, ZodiacPoint } from '../domain/zodiac';

/**
 * Book T attributions for all 78 RWS cards, transcribed from Part IV of
 * docs/research/The Structural Tarot Method, then checked against an OCR
 * copy of Book T itself (see docs/research/sources.md). Where the guide's
 * titles differ from Book T, Book T wins. Structural tests
 * (correspondences.test.ts) guard the decan rulers, the 2-3-4 / 5-6-7 / 8-9-10
 * sign rule and the court spans.
 *
 * Strength/Justice follow the RWS numbering (VIII / XI); the attributions
 * (Strength-Leo, Justice-Libra) are the same in the Golden Dawn order.
 */

type D = 1 | 2 | 3;

const planet = (p: Planet, traditional?: Element): Correspondence => ({
  kind: 'planet',
  planet: p,
  ...(traditional ? { traditional } : {}),
});
const sign = (s: Sign): Correspondence => ({ kind: 'sign', sign: s });

const majors: Record<string, Correspondence> = {
  'major-00-fool': planet('uranus', 'air'),
  'major-01-magician': planet('mercury'),
  'major-02-high-priestess': planet('moon'),
  'major-03-empress': planet('venus'),
  'major-04-emperor': sign('aries'),
  'major-05-hierophant': sign('taurus'),
  'major-06-lovers': sign('gemini'),
  'major-07-chariot': sign('cancer'),
  'major-08-strength': sign('leo'),
  'major-09-hermit': sign('virgo'),
  'major-10-wheel-of-fortune': planet('jupiter'),
  'major-11-justice': sign('libra'),
  'major-12-hanged-man': planet('neptune', 'water'),
  'major-13-death': sign('scorpio'),
  'major-14-temperance': sign('sagittarius'),
  'major-15-devil': sign('capricorn'),
  'major-16-tower': planet('mars'),
  'major-17-star': sign('aquarius'),
  'major-18-moon': sign('pisces'),
  'major-19-sun': planet('sun'),
  'major-20-judgement': planet('pluto', 'fire'),
  'major-21-world': planet('saturn', 'earth'),
};

/** [card id, sign, decan, ruler, approx dates, Book T title] */
type DecanRow = readonly [string, Sign, D, Planet, string, string];

const decanRows: readonly DecanRow[] = [
  // Wands (fire)
  ['wands-02-two', 'aries', 1, 'mars', 'Mar 21-30', 'Lord of Dominion'],
  [
    'wands-03-three',
    'aries',
    2,
    'sun',
    'Mar 31-Apr 9',
    'Lord of Established Strength',
  ],
  ['wands-04-four', 'aries', 3, 'venus', 'Apr 10-19', 'Lord of Perfected Work'],
  ['wands-05-five', 'leo', 1, 'saturn', 'Jul 22-31', 'Lord of Strife'],
  ['wands-06-six', 'leo', 2, 'jupiter', 'Aug 1-10', 'Lord of Victory'],
  ['wands-07-seven', 'leo', 3, 'mars', 'Aug 11-21', 'Lord of Valour'],
  [
    'wands-08-eight',
    'sagittarius',
    1,
    'mercury',
    'Nov 22-Dec 1',
    'Lord of Swiftness',
  ],
  [
    'wands-09-nine',
    'sagittarius',
    2,
    'moon',
    'Dec 2-11',
    'Lord of Great Strength',
  ],
  [
    'wands-10-ten',
    'sagittarius',
    3,
    'saturn',
    'Dec 12-21',
    'Lord of Oppression',
  ],
  // Cups (water)
  ['cups-02-two', 'cancer', 1, 'venus', 'Jun 21-30', 'Lord of Love'],
  ['cups-03-three', 'cancer', 2, 'mercury', 'Jul 1-10', 'Lord of Abundance'],
  [
    'cups-04-four',
    'cancer',
    3,
    'moon',
    'Jul 11-21',
    'Lord of Blended Pleasure',
  ],
  [
    'cups-05-five',
    'scorpio',
    1,
    'mars',
    'Oct 23-Nov 1',
    'Lord of Loss in Pleasure',
  ],
  ['cups-06-six', 'scorpio', 2, 'sun', 'Nov 2-11', 'Lord of Pleasure'],
  [
    'cups-07-seven',
    'scorpio',
    3,
    'venus',
    'Nov 12-21',
    'Lord of Illusionary Success',
  ],
  [
    'cups-08-eight',
    'pisces',
    1,
    'saturn',
    'Feb 19-28',
    'Lord of Abandoned Success',
  ],
  [
    'cups-09-nine',
    'pisces',
    2,
    'jupiter',
    'Mar 1-9',
    'Lord of Material Happiness',
  ],
  [
    'cups-10-ten',
    'pisces',
    3,
    'mars',
    'Mar 10-19',
    'Lord of Perfected Success',
  ],
  // Swords (air)
  [
    'swords-02-two',
    'libra',
    1,
    'moon',
    'Sep 23-Oct 2',
    'Lord of Peace Restored',
  ],
  ['swords-03-three', 'libra', 2, 'saturn', 'Oct 3-12', 'Lord of Sorrow'],
  [
    'swords-04-four',
    'libra',
    3,
    'jupiter',
    'Oct 13-22',
    'Lord of Rest from Strife',
  ],
  ['swords-05-five', 'aquarius', 1, 'venus', 'Jan 20-29', 'Lord of Defeat'],
  [
    'swords-06-six',
    'aquarius',
    2,
    'mercury',
    'Jan 30-Feb 8',
    'Lord of Earned Success',
  ],
  [
    'swords-07-seven',
    'aquarius',
    3,
    'moon',
    'Feb 9-18',
    'Lord of Unstable Effort',
  ],
  [
    'swords-08-eight',
    'gemini',
    1,
    'jupiter',
    'May 21-30',
    'Lord of Shortened Force',
  ],
  [
    'swords-09-nine',
    'gemini',
    2,
    'mars',
    'May 31-Jun 9',
    'Lord of Despair and Cruelty',
  ],
  ['swords-10-ten', 'gemini', 3, 'sun', 'Jun 10-20', 'Lord of Ruin'],
  // Pentacles (earth)
  [
    'pentacles-02-two',
    'capricorn',
    1,
    'jupiter',
    'Dec 22-31',
    'Lord of Harmonious Change',
  ],
  [
    'pentacles-03-three',
    'capricorn',
    2,
    'mars',
    'Jan 1-10',
    'Lord of Material Works',
  ],
  [
    'pentacles-04-four',
    'capricorn',
    3,
    'sun',
    'Jan 11-19',
    'Lord of Earthly Power',
  ],
  [
    'pentacles-05-five',
    'taurus',
    1,
    'mercury',
    'Apr 20-29',
    'Lord of Material Trouble',
  ],
  [
    'pentacles-06-six',
    'taurus',
    2,
    'moon',
    'Apr 30-May 9',
    'Lord of Material Success',
  ],
  [
    'pentacles-07-seven',
    'taurus',
    3,
    'saturn',
    'May 10-19',
    'Lord of Success Unfulfilled',
  ],
  ['pentacles-08-eight', 'virgo', 1, 'sun', 'Aug 22-31', 'Lord of Prudence'],
  [
    'pentacles-09-nine',
    'virgo',
    2,
    'venus',
    'Sep 1-10',
    'Lord of Material Gain',
  ],
  ['pentacles-10-ten', 'virgo', 3, 'mercury', 'Sep 11-22', 'Lord of Wealth'],
];

const decans: Record<string, Correspondence> = Object.fromEntries(
  decanRows.map(([id, s, decan, ruler, dates, title]) => [
    id,
    { kind: 'decan', sign: s, decan, ruler, dates, title } as Correspondence,
  ]),
);

const aces: Record<string, Correspondence> = {
  'wands-01-ace': { kind: 'root', element: 'fire' },
  'cups-01-ace': { kind: 'root', element: 'water' },
  'swords-01-ace': { kind: 'root', element: 'air' },
  'pentacles-01-ace': { kind: 'root', element: 'earth' },
};

const pt = (s: Sign, degree: number): ZodiacPoint => ({ sign: s, degree });

/** Senior court spans, [from, to], per suit and RWS rank. */
const SPANS: Record<
  string,
  Record<'knight' | 'queen' | 'king', [ZodiacPoint, ZodiacPoint]>
> = {
  wands: {
    knight: [pt('scorpio', 20), pt('sagittarius', 20)],
    queen: [pt('pisces', 20), pt('aries', 20)],
    king: [pt('cancer', 20), pt('leo', 20)],
  },
  cups: {
    knight: [pt('aquarius', 20), pt('pisces', 20)],
    queen: [pt('gemini', 20), pt('cancer', 20)],
    king: [pt('libra', 20), pt('scorpio', 20)],
  },
  swords: {
    knight: [pt('taurus', 20), pt('gemini', 20)],
    queen: [pt('virgo', 20), pt('libra', 20)],
    king: [pt('capricorn', 20), pt('aquarius', 20)],
  },
  pentacles: {
    knight: [pt('leo', 20), pt('virgo', 20)],
    queen: [pt('sagittarius', 20), pt('capricorn', 20)],
    king: [pt('aries', 20), pt('taurus', 20)],
  },
};

const courts: Record<string, Correspondence> = {};
for (const suit of ['wands', 'cups', 'swords', 'pentacles']) {
  const spans = SPANS[suit]!;
  courts[`${suit}-11-page`] = {
    kind: 'court',
    subElement: 'earth',
    letter: 'Heh final',
  };
  courts[`${suit}-12-knight`] = {
    kind: 'court',
    subElement: 'fire',
    letter: 'Yod',
    span: { from: spans.knight[0], to: spans.knight[1] },
  };
  courts[`${suit}-13-queen`] = {
    kind: 'court',
    subElement: 'water',
    letter: 'Heh',
    span: { from: spans.queen[0], to: spans.queen[1] },
  };
  courts[`${suit}-14-king`] = {
    kind: 'court',
    subElement: 'air',
    letter: 'Vav',
    span: { from: spans.king[0], to: spans.king[1] },
  };
}

export const correspondences: Readonly<Record<string, Correspondence>> = {
  ...majors,
  ...aces,
  ...decans,
  ...courts,
};
