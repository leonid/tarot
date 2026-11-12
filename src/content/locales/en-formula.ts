import type { Element } from '../../domain/elements';
import type { CardFormula, CourtRank } from '../../domain/formula';
import type { Modality, Planet, Sign, Strength } from '../../domain/zodiac';

/**
 * English phrases for the card formula: a card read from its parts. Original
 * wording. The number and element themes are the common ground of the
 * numerological (Marseille) and Golden Dawn schools; the planet and sign
 * themes are plain astrological keywords. See docs/research/sources.md.
 */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const and = (items: readonly string[]) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]!}`;

/** "the Sun", "Mars". */
const planet = (p: Planet) =>
  p === 'sun' || p === 'moon' ? `the ${cap(p)}` : cap(p);

const NUMBER = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];
const PIPS = [
  'Aces and Tens',
  'Twos',
  'Threes',
  'Fours',
  'Fives',
  'Sixes',
  'Sevens',
  'Eights',
  'Nines',
];

/** What each number does, whatever the suit. */
const NUMBER_THEME = [
  'the seed, pure potential',
  'meeting and choice',
  'first growth and expression',
  'stability and pause',
  'disruption and contest',
  'balance restored and exchange',
  'testing and reassessment',
  'movement and mastery through effort',
  'fullness, close to completion',
  'completion, excess and the turn to a new cycle',
];

/** Where each element acts. */
const DOMAIN: Record<Element, string> = {
  fire: 'will, drive and enterprise',
  water: 'feeling and relationships',
  air: 'thought, words and conflict',
  earth: 'body, work and money',
};

const RANK_THEME: Record<CourtRank, string> = {
  page: 'the student, bringing news and first attempts',
  knight: 'the mover, in pursuit and action',
  queen: 'the keeper, with inner mastery and care',
  king: 'the ruler, with outer command and responsibility',
};

const PLANET_THEME: Record<Planet, string> = {
  sun: 'vitality and clarity',
  moon: 'mood, instinct and change',
  mercury: 'mind, speech and trade',
  venus: 'love, pleasure and worth',
  mars: 'drive and conflict',
  jupiter: 'growth and good fortune',
  saturn: 'limits, time and discipline',
  uranus: 'sudden freedom',
  neptune: 'surrender and dissolving',
  pluto: 'deep transformation',
};

const SIGN_THEME: Record<Sign, string> = {
  aries: 'initiative',
  taurus: 'steadiness and possession',
  gemini: 'duality and choice',
  cancer: 'protection and belonging',
  leo: 'courage and pride',
  virgo: 'discernment and service',
  libra: 'balance and fairness',
  scorpio: 'depth and endings',
  sagittarius: 'aim and meaning',
  capricorn: 'ambition and material ties',
  aquarius: 'vision and detachment',
  pisces: 'dream and dissolution',
};

const MODALITY_THEME: Record<Modality, string> = {
  cardinal: 'starts things',
  fixed: 'holds things in place',
  mutable: 'lets things change',
};

const STRENGTH: Record<Strength, string> = {
  domicile: 'is at home here and acts at full strength',
  exaltation: 'is exalted here and acts at its best',
  detriment: 'is ill at ease here and acts awkwardly',
  fall: 'is at its weakest here',
};

export function cardFormula(
  f: CardFormula,
  name: (cardId: string) => string,
): string {
  switch (f.kind) {
    case 'ace':
      return `Ace × ${cap(f.element)}: ${NUMBER_THEME[0]!} of ${DOMAIN[f.element]}. The root of the whole suit.`;
    case 'pip': {
      const head = `${cap(NUMBER[f.number - 1]!)} × ${cap(f.element)}: ${NUMBER_THEME[f.number - 1]!} in ${DOMAIN[f.element]}.`;
      const d = f.decan;
      if (!d) return head;
      const strength = d.strength
        ? ` ${cap(planet(d.planet))} ${STRENGTH[d.strength]}.`
        : '';
      const majors = d.majorIds.length
        ? ` It combines ${and(d.majorIds.map(name))}.`
        : '';
      return `${head} Its decan is ${planet(d.planet)} in ${cap(d.sign)}: ${PLANET_THEME[d.planet]}, in a ${d.modality} sign that ${MODALITY_THEME[d.modality]}.${strength}${majors}`;
    }
    case 'court': {
      const head = `${cap(f.rank)}: ${RANK_THEME[f.rank]}.`;
      if (!f.subElement)
        return `${head} Suit of ${cap(f.element)}: ${DOMAIN[f.element]}.`;
      return f.subElement === f.element
        ? `${head} ${cap(f.subElement)} of ${cap(f.element)}: ${DOMAIN[f.element]}, undiluted.`
        : `${head} ${cap(f.subElement)} of ${cap(f.element)}: ${DOMAIN[f.subElement]} at work within ${DOMAIN[f.element]}.`;
    }
    case 'major': {
      const parts: string[] = [];
      if (f.sign && f.modality)
        parts.push(
          `${cap(f.sign)}: ${SIGN_THEME[f.sign]}, a ${f.modality} ${f.element ?? ''} sign that ${MODALITY_THEME[f.modality]}.`,
        );
      else if (f.planet)
        parts.push(
          `${cap(planet(f.planet))}: ${PLANET_THEME[f.planet]}${f.element ? `; traditionally ${cap(f.element)}, ${DOMAIN[f.element]}` : ''}.`,
        );
      if (f.root) {
        const kin = [...f.kinIds.map(name), `the ${PIPS[f.root - 1]!}`];
        parts.push(
          f.number === f.root
            ? `Number ${f.number}: ${NUMBER_THEME[f.root - 1]!}. Kin to ${and(kin)}.`
            : `Number ${f.number} reduces to ${f.root}: ${NUMBER_THEME[f.root - 1]!}. Kin to ${and(kin)}.`,
        );
      } else
        parts.push(
          `Number ${f.number}: outside the count, free to enter anywhere.`,
        );
      return parts.join(' ');
    }
  }
}
