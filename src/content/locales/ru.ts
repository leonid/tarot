import type { Element } from '../../domain/elements';
import type { ProviderStrings } from '../../domain/strings';
import type { Suit } from '../../domain/types';
import type { Planet, Sign } from '../../domain/zodiac';
import { decks } from '../decks';
import { ruMeanings } from './ru-meanings';
import type { LocaleBundle, SpreadText, UiMessages } from './types';

/**
 * Russian. Original wording; card names follow common Russian tarot usage
 * (Старшие и Младшие арканы). Needs review by a native speaker who reads tarot.
 */

const and = (items: readonly string[]) => items.join(' и ');
const pairs = (list: readonly (readonly [string, string])[]) =>
  list.map(([a, b]) => `${a} и ${b}`).join('; ');

const elementNom: Record<Element, string> = {
  fire: 'Огонь',
  water: 'Вода',
  air: 'Воздух',
  earth: 'Земля',
};
const elementGen: Record<Element, string> = {
  fire: 'огня',
  water: 'воды',
  air: 'воздуха',
  earth: 'земли',
};
const planetName: Record<Planet, string> = {
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
const signName: Record<Sign, string> = {
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
const suitPlural: Record<Suit, string> = {
  wands: 'Жезлы',
  cups: 'Кубки',
  swords: 'Мечи',
  pentacles: 'Пентакли',
};
const suitGen: Record<Suit, string> = {
  wands: 'Жезлов',
  cups: 'Кубков',
  swords: 'Мечей',
  pentacles: 'Пентаклей',
};
const ui: UiMessages = {
  appTitle: 'Таро',
  language: 'Язык',
  theme: 'Тема',
  themeSystem: 'Как в системе',
  themeLight: 'Светлая',
  themeDark: 'Тёмная',
  modeSimulate: 'Симуляция',
  modeSetup: 'Расклад вручную',

  question: 'Вопрос',
  questionPlaceholder: 'О чём вы хотите спросить?',
  deck: 'Колода',
  spread: 'Расклад',
  reversals: 'Перевёрнутые карты',

  shuffleAndDeal: 'Перемешать и раскинуть',
  seed: (seed) => `зерно ${seed}`,

  placeWithMenus: 'Выбрать карты из списков',
  chooseCard: '-- выберите карту --',
  availableCards: 'Доступные карты',
  dragInstructions:
    'Чтобы взять карту, нажмите пробел. Во время перетаскивания двигайте её стрелками. Нажмите пробел ещё раз, чтобы положить её в позицию, или Escape для отмены.',
  dragPickedUp: (card) => `Карта «${card}» взята.`,
  dragOver: (card, position) => `Карта «${card}» над позицией «${position}».`,
  dragDropped: (card, position) =>
    `Карта «${card}» положена в позицию «${position}».`,
  dragDroppedOutside: (card) => `Карта «${card}» брошена вне позиций.`,
  dragCancelled: (card) => `Перетаскивание карты «${card}» отменено.`,
  reversed: 'Перевёрнута',

  interpretation: 'Толкование',
  connections: 'Связи',
  hinge: 'Ось',
  hingeTitle: 'Больше всего связана с остальными картами',
  hingeLabel: 'Ось:',
  elements: { fire: 'Огонь', water: 'Вода', air: 'Воздух', earth: 'Земля' },

  slotEmpty: 'пусто',
  slotReversed: '(перевёрнута)',

  saveReading: 'Сохранить расклад',
  copyShareLink: 'Скопировать ссылку',
  linkCopied: 'Ссылка скопирована.',
  dismiss: 'Закрыть',
  shareLinkMalformed:
    'Не удалось прочитать эту ссылку: она могла обрезаться или повредиться. Текущий расклад не изменён.',
  shareLinkNewer:
    'Эта ссылка создана более новой версией приложения и здесь не открывается. Текущий расклад не изменён.',
  shareLinkUnknown:
    'В ссылке указана колода или расклад, которых нет в этой версии. Текущий расклад не изменён.',
  saved: 'Сохранено.',
  savedReadings: (count) => `Сохранённые расклады (${count})`,
  noQuestion: 'без вопроса',
  open: 'Открыть',
  delete: 'Удалить',
};

const provider: ProviderStrings = {
  cardNote: ({ base }) =>
    base
      ? `${base.summary} Ключевые слова: ${base.keywords.join(', ')}.`
      : 'Для этой карты пока нет базового значения.',
  mostlyMajors: 'Преимущественно Старшие арканы: весомые, судьбоносные темы.',
  suitDominates: (suit, count, total) =>
    `Преобладают ${suitPlural[suit]} (${count} из ${total}).`,
  mostlyReversed:
    'Преимущественно перевёрнутые карты: заблокированная или обращённая внутрь энергия.',
  summary: (question, cards) =>
    question
      ? `По вопросу «${question}» прочитано карт: ${cards}.`
      : `Прочитано карт: ${cards}.`,
  advice: 'Соотносите каждую карту с позицией, в которую она выпала.',

  elementDominates: (element, count, total) =>
    `Преобладает стихия ${elementGen[element]} (${count} из ${total} карт со стихией).`,
  planetLinks: (planet, cards) =>
    `Планета ${planetName[planet]} связывает карты: ${and(cards)}.`,
  signLinks: (sign, cards) =>
    `Знак ${signName[sign]} связывает карты: ${and(cards)}.`,
  courtEcho: (court, sub, suit, cards) =>
    `${court} (${elementNom[sub]} ${elementGen[suit]}) перекликается со стихией ${elementGen[sub]} в картах: ${and(cards)}.`,
  courtSpan: (cards, court) =>
    `${and(cards)} ${cards.length === 1 ? 'попадает' : 'попадают'} в зодиакальный диапазон карты «${court}».`,
  conflicts: (list) => `Конфликт стихий: ${pairs(list)}.`,
  friends: (list) => `Дружественные стихии: ${pairs(list)}.`,
};

const majors = [
  'Шут',
  'Маг',
  'Верховная Жрица',
  'Императрица',
  'Император',
  'Иерофант',
  'Влюблённые',
  'Колесница',
  'Сила',
  'Отшельник',
  'Колесо Фортуны',
  'Справедливость',
  'Повешенный',
  'Смерть',
  'Умеренность',
  'Дьявол',
  'Башня',
  'Звезда',
  'Луна',
  'Солнце',
  'Суд',
  'Мир',
];
const ranks = [
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
  'Паж',
  'Рыцарь',
  'Королева',
  'Король',
];

const cards: Record<string, string> = {};
for (const card of decks.flatMap((d) => d.cards)) {
  cards[card.id] =
    card.arcana === 'major'
      ? majors[card.number]!
      : `${ranks[card.number - 1]!} ${suitGen[card.suit!]}`;
}

const spreads: Record<string, SpreadText> = {
  single: {
    name: 'Одна карта',
    description: 'Одна карта для быстрого ответа или темы дня.',
    positions: { card: { label: 'Карта', meaning: 'Суть вопроса' } },
  },
  'three-card': {
    name: 'Прошлое / Настоящее / Будущее',
    description: 'Простой расклад по времени.',
    positions: {
      past: { label: 'Прошлое', meaning: 'Что привело к этому' },
      present: { label: 'Настоящее', meaning: 'Текущая ситуация' },
      future: { label: 'Будущее', meaning: 'Куда всё движется' },
    },
  },
  'celtic-cross': {
    name: 'Кельтский крест',
    description: 'Классический расклад из десяти карт.',
    positions: {
      present: { label: 'Настоящее', meaning: 'Сердцевина вопроса' },
      challenge: { label: 'Препятствие', meaning: 'Что пересекает ваш путь' },
      foundation: { label: 'Основа', meaning: 'Корень или причина' },
      'recent-past': { label: 'Недавнее прошлое', meaning: 'Что уходит' },
      crown: {
        label: 'Венец',
        meaning: 'Осознанная цель или лучший исход',
      },
      'near-future': {
        label: 'Ближайшее будущее',
        meaning: 'Что будет дальше',
      },
      self: { label: 'Вы сами', meaning: 'Ваша позиция в этой ситуации' },
      environment: { label: 'Окружение', meaning: 'Влияния вокруг вас' },
      'hopes-fears': {
        label: 'Надежды и страхи',
        meaning: 'Чего вы желаете или боитесь',
      },
      outcome: { label: 'Итог', meaning: 'Куда ведёт путь' },
    },
  },
};

export const ru: LocaleBundle = {
  code: 'ru',
  label: 'Русский',
  ui,
  provider,
  decks: {
    'rws-78': 'Райдер-Уэйт-Смит (78 карт)',
    'major-22': 'Только Старшие арканы (22 карты)',
  },
  cards,
  spreads,
  meanings: ruMeanings,
};
