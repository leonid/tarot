import type { Element } from './elements';

export const SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;
export type Sign = (typeof SIGNS)[number];

export type Modality = 'cardinal' | 'fixed' | 'mutable';

export type Planet =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

/** Chaldean order of the seven classical planets, used for decan rulers. */
export const CHALDEAN_ORDER: readonly Planet[] = [
  'mars',
  'sun',
  'venus',
  'mercury',
  'moon',
  'saturn',
  'jupiter',
];

const ELEMENT_CYCLE: readonly Element[] = ['fire', 'earth', 'air', 'water'];
const MODALITY_CYCLE: readonly Modality[] = ['cardinal', 'fixed', 'mutable'];

export function signIndex(sign: Sign): number {
  return SIGNS.indexOf(sign);
}
export function signElement(sign: Sign): Element {
  return ELEMENT_CYCLE[signIndex(sign) % 4] as Element;
}
export function signModality(sign: Sign): Modality {
  return MODALITY_CYCLE[signIndex(sign) % 3] as Modality;
}

export interface ZodiacPoint {
  sign: Sign;
  /** Degrees into the sign, 0-30. */
  degree: number;
}

/** Ecliptic longitude, 0-360. */
export function longitude(p: ZodiacPoint): number {
  return signIndex(p.sign) * 30 + p.degree;
}

/** How a classical planet sits in a sign (traditional essential dignities). */
export type Strength = 'domicile' | 'exaltation' | 'detriment' | 'fall';

const DOMICILE: Partial<Record<Planet, readonly Sign[]>> = {
  sun: ['leo'],
  moon: ['cancer'],
  mercury: ['gemini', 'virgo'],
  venus: ['taurus', 'libra'],
  mars: ['aries', 'scorpio'],
  jupiter: ['sagittarius', 'pisces'],
  saturn: ['capricorn', 'aquarius'],
};
const EXALTATION: Partial<Record<Planet, Sign>> = {
  sun: 'aries',
  moon: 'taurus',
  mercury: 'virgo',
  venus: 'pisces',
  mars: 'capricorn',
  jupiter: 'cancer',
  saturn: 'libra',
};
const opposite = (sign: Sign): Sign =>
  SIGNS[(signIndex(sign) + 6) % 12] as Sign;

/**
 * Home and detriment come before exaltation and fall, so Mercury is at home
 * in Virgo and in detriment in Pisces. The outer planets have none.
 */
export function essentialDignity(
  planet: Planet,
  sign: Sign,
): Strength | undefined {
  const homes = DOMICILE[planet];
  if (!homes) return undefined;
  if (homes.includes(sign)) return 'domicile';
  if (homes.includes(opposite(sign))) return 'detriment';
  const exalted = EXALTATION[planet];
  if (exalted === sign) return 'exaltation';
  if (exalted && opposite(exalted) === sign) return 'fall';
  return undefined;
}
