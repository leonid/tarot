import type { Element } from '../../domain/elements';
import type { Planet, Sign } from '../../domain/zodiac';

/** Russian names and helpers shared by the Russian locale files. */

/** «А», «А и Б», «А, Б и В». */
export const and = (items: readonly string[]) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} и ${items[items.length - 1]!}`;

export const elementNom: Record<Element, string> = {
  fire: 'Огонь',
  water: 'Вода',
  air: 'Воздух',
  earth: 'Земля',
};
export const elementGen: Record<Element, string> = {
  fire: 'огня',
  water: 'воды',
  air: 'воздуха',
  earth: 'земли',
};
export const planetName: Record<Planet, string> = {
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
};
export const signName: Record<Sign, string> = {
  aries: 'Овен',
  taurus: 'Телец',
  gemini: 'Близнецы',
  cancer: 'Рак',
  leo: 'Лев',
  virgo: 'Дева',
  libra: 'Весы',
  scorpio: 'Скорпион',
  sagittarius: 'Стрелец',
  capricorn: 'Козерог',
  aquarius: 'Водолей',
  pisces: 'Рыбы',
};
