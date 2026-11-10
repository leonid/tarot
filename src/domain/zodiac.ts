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
