import type { Element } from '../../domain/elements';
import type { CardFormula, CourtRank } from '../../domain/formula';
import type { Modality, Planet, Sign, Strength } from '../../domain/zodiac';
import { and, elementGen, elementNom, planetName, signName } from './ru-terms';

/**
 * Russian phrases for the card formula (see en-formula.ts). Original wording;
 * needs the same review as the rest of the Russian locale.
 */

const PIP = [
  'Туз',
  'Двойка',
  'Тройка',
  'Четвёрка',
  'Пятёрка',
  'Шестёрка',
  'Семёрка',
  'Восьмёрка',
  'Девятка',
  'Десятка',
];
const PIPS = [
  'все Тузы и Десятки',
  'все Двойки',
  'все Тройки',
  'все Четвёрки',
  'все Пятёрки',
  'все Шестёрки',
  'все Семёрки',
  'все Восьмёрки',
  'все Девятки',
];

const NUMBER_THEME = [
  'зерно, чистая возможность',
  'встреча и выбор',
  'первый рост и выражение',
  'устойчивость и пауза',
  'разлад и состязание',
  'восстановленное равновесие и обмен',
  'испытание и переоценка',
  'движение и мастерство через усилие',
  'полнота, почти завершение',
  'завершение, избыток и поворот к новому циклу',
];

/** Genitive, after «в сфере». */
const DOMAIN: Record<Element, string> = {
  fire: 'воли, порыва и начинаний',
  water: 'чувств и отношений',
  air: 'мысли, слова и спора',
  earth: 'тела, труда и денег',
};

const RANK: Record<CourtRank, string> = {
  page: 'Паж',
  knight: 'Рыцарь',
  queen: 'Королева',
  king: 'Король',
};
const RANK_THEME: Record<CourtRank, string> = {
  page: 'ученик, вести и первые попытки',
  knight: 'деятель, стремление и действие',
  queen: 'хранительница, внутреннее владение и забота',
  king: 'правитель, внешняя власть и ответственность',
};

const PLANET_THEME: Record<Planet, string> = {
  sun: 'жизненная сила и ясность',
  moon: 'настроение, чутьё и перемены',
  mercury: 'ум, речь и обмен',
  venus: 'любовь, удовольствие и ценность',
  mars: 'напор и борьба',
  jupiter: 'рост и удача',
  saturn: 'границы, время и дисциплина',
  uranus: 'внезапная свобода',
  neptune: 'отдача и растворение',
  pluto: 'глубокое преображение',
};

const SIGN_THEME: Record<Sign, string> = {
  aries: 'инициатива',
  taurus: 'постоянство и обладание',
  gemini: 'двойственность и выбор',
  cancer: 'защита и принадлежность',
  leo: 'смелость и гордость',
  virgo: 'разборчивость и служение',
  libra: 'равновесие и справедливость',
  scorpio: 'глубина и завершение',
  sagittarius: 'цель и смысл',
  capricorn: 'честолюбие и привязанность к материальному',
  aquarius: 'видение и отстранённость',
  pisces: 'грёза и растворение',
};

/** Prepositional, after «в». */
const SIGN_IN: Record<Sign, string> = {
  aries: 'Овне',
  taurus: 'Тельце',
  gemini: 'Близнецах',
  cancer: 'Раке',
  leo: 'Льве',
  virgo: 'Деве',
  libra: 'Весах',
  scorpio: 'Скорпионе',
  sagittarius: 'Стрельце',
  capricorn: 'Козероге',
  aquarius: 'Водолее',
  pisces: 'Рыбах',
};

const MODALITY: Record<Modality, string> = {
  cardinal: 'кардинальный знак, который начинает',
  fixed: 'фиксированный знак, который удерживает',
  mutable: 'мутабельный знак, который меняет',
};

const STRENGTH: Record<Strength, string> = {
  domicile: 'Планета здесь в обители и действует в полную силу.',
  exaltation: 'Планета здесь в экзальтации и действует лучшим образом.',
  detriment: 'Планета здесь в изгнании и действует неловко.',
  fall: 'Планета здесь в падении и действует слабее всего.',
};

export function cardFormula(
  f: CardFormula,
  name: (cardId: string) => string,
): string {
  switch (f.kind) {
    case 'ace':
      return `Туз × ${elementNom[f.element]}: ${NUMBER_THEME[0]!} в сфере ${DOMAIN[f.element]}. Корень всей масти.`;
    case 'pip': {
      const head = `${PIP[f.number - 1]!} × ${elementNom[f.element]}: ${NUMBER_THEME[f.number - 1]!} в сфере ${DOMAIN[f.element]}.`;
      const d = f.decan;
      if (!d) return head;
      const strength = d.strength ? ` ${STRENGTH[d.strength]}` : '';
      const majors = d.majorIds.length
        ? ` Соединяет карты: ${and(d.majorIds.map(name))}.`
        : '';
      return `${head} Декан: ${planetName[d.planet]} в ${SIGN_IN[d.sign]}, то есть ${PLANET_THEME[d.planet]}; это ${MODALITY[d.modality]}.${strength}${majors}`;
    }
    case 'court': {
      const head = `${RANK[f.rank]}: ${RANK_THEME[f.rank]}.`;
      if (!f.subElement)
        return `${head} Масть стихии ${elementGen[f.element]}: сфера ${DOMAIN[f.element]}.`;
      return f.subElement === f.element
        ? `${head} ${elementNom[f.subElement]} ${elementGen[f.element]}: сфера ${DOMAIN[f.element]} в чистом виде.`
        : `${head} ${elementNom[f.subElement]} ${elementGen[f.element]}: сфера ${DOMAIN[f.subElement]} внутри сферы ${DOMAIN[f.element]}.`;
    }
    case 'major': {
      const parts: string[] = [];
      if (f.sign && f.modality)
        parts.push(
          `${signName[f.sign]}: ${SIGN_THEME[f.sign]}; ${MODALITY[f.modality]}${f.element ? `, стихия ${elementGen[f.element]}` : ''}.`,
        );
      else if (f.planet)
        parts.push(
          `${planetName[f.planet]}: ${PLANET_THEME[f.planet]}${f.element ? `; по традиции ${elementNom[f.element]}, сфера ${DOMAIN[f.element]}` : ''}.`,
        );
      if (f.root) {
        const kin = [...f.kinIds.map(name), PIPS[f.root - 1]!];
        parts.push(
          f.number === f.root
            ? `Число ${f.number}: ${NUMBER_THEME[f.root - 1]!}. В родстве: ${and(kin)}.`
            : `Число ${f.number} сводится к ${f.root}: ${NUMBER_THEME[f.root - 1]!}. В родстве: ${and(kin)}.`,
        );
      } else
        parts.push(`Число ${f.number}: вне счёта, может войти куда угодно.`);
      return parts.join(' ');
    }
  }
}
