import type { ProviderStrings } from '../../domain/strings';
import type { Suit } from '../../domain/types';
import type { Modality } from '../../domain/zodiac';
import { decks } from '../decks';
import { ruAlts } from './ru-alts';
import { cardFormula } from './ru-formula';
import { ruWaite } from './ru-waite';
import { ruMeanings } from './ru-meanings';
import { and, elementGen, elementNom, planetName, signName } from './ru-terms';
import type { LocaleBundle, SpreadText, UiMessages } from './types';

/**
 * Russian. Original wording; card names follow common Russian tarot usage
 * (Старшие и Младшие арканы). Needs review by a native speaker who reads tarot.
 */

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
const modalityAdj: Record<Modality, string> = {
  cardinal: 'кардинальные',
  fixed: 'фиксированные',
  mutable: 'мутабельные',
};
const modalitySense: Record<Modality, string> = {
  cardinal: 'что-то начинается',
  fixed: 'что-то удерживается',
  mutable: 'что-то меняется',
};
const courtRank = ['Паж', 'Рыцарь', 'Королева', 'Король'];
const ui: UiMessages = {
  appTitle: 'Таро',
  language: 'Язык',
  theme: 'Тема',
  themeSystem: 'Как в системе',
  themeLight: 'Светлая',
  themeDark: 'Тёмная',
  navLabel: 'Разделы',
  navHome: 'Главная',
  goalReading: 'Получить расклад',
  goalRecord: 'Записать свой расклад',
  goalJournal: 'Дневник',
  goalCards: 'Изучить карты',
  goalCardsText:
    'Все 78 карт: что значит каждая в прямом и перевёрнутом положении и из чего она складывается.',
  cardsPurpose:
    'Все карты колоды. Выберите карту, чтобы прочитать её значение.',
  cardsSearch: 'Найти карту',
  cardsSearchHint:
    'Название или ключевое слово, например «луна» или «смелость».',
  cardsNone: 'Ни одна карта не подходит. Попробуйте слово короче.',
  cardsShown: (shown, total) => `Карт: ${shown} из ${total}`,
  groupMajor: 'Старшие арканы',
  suits: suitPlural,
  upright: 'Прямое положение',
  cardParts: 'Из чего она складывается',
  cardAllCards: 'Все карты',
  cardPrevious: 'Предыдущая карта',
  cardNext: 'Следующая карта',
  cardAbout: (card) => `Подробнее: ${card}`,
  cardUnknown: 'Такой карты нет. Выберите карту из списка.',
  paletteGroups: 'Какие карты показать',
  groupAll: 'Все',
  paletteGroupEmpty: 'Все карты этой части уже на столе.',
  openNote: (card) => `Читать толкование: ${card}`,
  openNoteHint: 'Читать толкование карты',
  toReading: 'Перейти к толкованию',
  flipCard: (card) => `Перевернуть: ${card}`,
  removeCard: (card) => `Убрать со стола: ${card}`,
  partialReading: (placed, total) =>
    `Карт на столе: ${placed} из ${total}. Каждая карта читается сразу; связи между картами появятся, когда заполнены все позиции.`,
  homeIntro:
    'Таро как способ обдумать вопрос. Каждая карта читается в своей позиции и в связи с остальными. Для размышления, а не для предсказаний и советов.',
  homeDraw: 'Разложить карты сейчас',
  homeDrawHint: (spread, cards) =>
    `Одно нажатие: ${spread}, карт: ${cards}. Вопрос можно добавить потом.`,
  homeContinue: 'Вернуться к раскладу',
  footerNote: 'Для размышления, а не для предсказаний или советов.',
  footerLabel: 'О приложении',
  aboutTitle: 'О приложении',
  aboutWhatTitle: 'Что это',
  aboutWhat: [
    'Здесь можно разложить карты Таро и прочитать их: сделать расклад или ввести карты, которые вы вытянули сами. Каждая карта читается в своей позиции и в связи с остальными, и толкование объясняет, как оно получено.',
    'Толкование составляется по неизменным правилам прямо в браузере. Одни и те же карты в тех же позициях всегда дают один и тот же текст.',
    'Таро здесь — способ обдумать вопрос. Оно не предсказывает события и не заменяет совет врача, юриста, финансиста или психолога.',
  ],
  aboutSourcesTitle: 'Источники',
  aboutSources: [
    'Изображения: колода Райдера — Уэйта — Смит 1909 года, художница Памела Колман Смит; сканы первого издания с Викисклада. Они находятся в общественном достоянии.',
    'Значения написаны для этого приложения. Второй набор значений пересказывает своими словами книгу А. Э. Уэйта «Иллюстрированный ключ к Таро» (1911).',
    'Стихии, планеты, знаки и деканы даны по системе Золотой Зари (Book T).',
  ],
  aboutPrivacyTitle: 'Ваши расклады',
  aboutPrivacy: [
    'Сохранённые расклады остаются в этом браузере, на этом устройстве. Учётной записи нет; при раскладе, записи и сохранении ничего никуда не отправляется.',
    'Ссылка на расклад содержит его целиком, вместе с вопросом. Прочитать его может любой, у кого есть ссылка.',
    'Если предложено толкование с ИИ и вы его включили, вопрос и карты отправляются на наш сервер и в Anthropic для написания текста. Оно выключено, пока вы сами его не включите.',
  ],
  aboutLicenceTitle: 'Лицензия',
  aboutLicence: [
    'Изображения карт находятся в общественном достоянии, их можно свободно использовать.',
    'Открытая лицензия для кода и текстов приложения пока не выбрана.',
  ],
  homeChoose: 'Что вы хотите сделать?',
  goalReadingText:
    'Задайте вопрос, и приложение перетасует и разложит карты. Вы получите толкование каждой карты на её месте.',
  goalRecordText:
    'Разложили настоящие карты? Введите их по позициям и прочитайте расклад.',
  goalJournalText: (count) =>
    count === 0
      ? 'Сохранённые расклады хранятся здесь, на этом устройстве.'
      : `Вернитесь к сохранённым раскладам (${count}).`,
  readingPurpose:
    'Спросите, разложите карты и прочитайте, что говорит каждая в своей позиции. Три шага.',
  recordPurpose:
    'Введите карты, которые вытянули сами, и прочитайте их здесь. Три шага.',
  journalPurpose:
    'Сохранённые расклады, сначала новые. Они хранятся только на этом устройстве.',
  stepQuestion: 'Ваш вопрос',
  stepQuestionHint:
    'Необязательно. Лучше работают открытые вопросы: «Что мне стоит учесть в…?»',
  stepSpread: 'Выберите расклад',
  stepDeal: 'Разложите карты',
  stepPlace: 'Положите свои карты',
  cardCount: (count) => `карт: ${count}`,
  journalEmpty:
    'Пока ничего не сохранено. Закончите расклад и нажмите «Сохранить расклад».',
  openJournal: 'Открыть дневник',
  sharedTitle: 'Расклад, которым с вами поделились',
  sharedPurpose:
    'Кто-то прислал вам этот расклад. Он не сохранён и не меняет ваши карты.',
  sharedKeep: 'Сохранить в дневник',
  sharedKept: 'Сохранено в дневнике.',
  sharedOpen: 'Открыть и изменить',
  sharedOwn: 'Начать свой расклад',

  question: 'Вопрос',
  questionPlaceholder: 'О чём вы хотите спросить?',
  deck: 'Колода',
  spread: 'Расклад',
  reversals: 'Перевёрнутые карты',

  shuffleAndDeal: 'Перемешать и раскинуть',
  replayDeal: 'Повторить этот расклад',
  replayExplain: (seed) =>
    `Каждый расклад делается из числа. Здесь это ${seed}; с тем же числом, раскладом и колодой выпадут те же карты.`,
  connectionsExplain:
    'Как карты связаны между собой: общие масти, числа, стихии и планеты. Самые сильные связи идут первыми.',
  hingeExplain:
    'Карта, на которую опираются остальные: у неё больше всего связей с ними, поэтому с неё проще начать чтение.',
  moreConnections: (count) => `Ещё связей: ${count}`,

  placeWithMenus: 'Или выберите каждую карту из списка',
  chooseCard: '-- выберите карту --',
  availableCards: 'Доступные карты',
  dragInstructions:
    'Чтобы взять карту, нажмите пробел. Во время перетаскивания двигайте её стрелками. Нажмите пробел ещё раз, чтобы положить её в позицию, или Escape для отмены.',
  placeHint:
    'Нажмите на карту, затем на позицию, чтобы положить её. Можно также перетащить карту или выбрать её в списках ниже. На положенной карте есть кнопки: перевернуть и убрать.',
  dealt: (count) => `Карт выложено: ${count}. Толкование идёт после расклада.`,
  cardSelected: (card) =>
    `Карта «${card}» выбрана. Нажмите на позицию, чтобы положить её, или нажмите на карту ещё раз, чтобы отменить выбор.`,
  placeIn: (card, position) => `Положить «${card}» в позицию «${position}»`,
  dragPickedUp: (card) => `Карта «${card}» взята.`,
  dragOver: (card, position) => `Карта «${card}» над позицией «${position}».`,
  dragDropped: (card, position) =>
    `Карта «${card}» положена в позицию «${position}».`,
  dragDroppedOutside: (card) => `Карта «${card}» брошена вне позиций.`,
  dragCancelled: (card) => `Перетаскивание карты «${card}» отменено.`,
  reversed: 'Перевёрнута',

  interpretation: 'Толкование',
  connections: 'Связи',
  interpreting: 'Читаю карты…',
  interpretationFailed: 'Не удалось составить толкование.',
  tryAgain: 'Повторить',
  updateInterpretation: 'Обновить для нового вопроса',
  aiToggle: 'Составить толкование с помощью ИИ',
  aiNote:
    'По умолчанию выключено. Если включить, ваш вопрос и карты отправляются на наш сервер и обрабатываются Anthropic (Claude), который может хранить их до 30 дней. Для размышления и развлечения, не совет. Если сервис недоступен, толкование составит встроенный алгоритм.',
  sourceAi: 'Составлено ИИ (Claude)',
  sourceBuiltIn: 'Составлено встроенным алгоритмом',
  sourceFellBack:
    'ИИ-сервис не ответил, поэтому толкование составил встроенный алгоритм.',
  otherSchools: 'Другие прочтения этой карты',
  schoolStructure: 'По структуре',
  schoolWaite: 'Уэйт, 1911',
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
  undo: 'Вернуть',
  readingCleared: 'Карты убраны: выбрана другая колода или расклад.',
  readingReplaced: 'Прежний расклад заменён открытым.',
  savedDeleted: 'Сохранённый расклад удалён.',
  errorTitle: 'Что-то пошло не так',
  errorBody:
    'Не удалось показать расклад. «Начать заново» очистит текущий расклад. Сохранённые расклады, язык и тема останутся.',
  errorStartOver: 'Начать заново',
  shareLinkMalformed:
    'Не удалось прочитать эту ссылку: она могла обрезаться или повредиться. Текущий расклад не изменён.',
  shareLinkNewer:
    'Эта ссылка создана более новой версией приложения и здесь не открывается. Текущий расклад не изменён.',
  shareLinkUnknown:
    'В ссылке указана колода или расклад, которых нет в этой версии. Текущий расклад не изменён.',
  saved: 'Сохранено в дневнике.',
  savedButton: 'Сохранено ✓',
  alreadySaved: 'Этот расклад уже есть в дневнике.',
  storageFull:
    'Не сохранено: в браузере не осталось места для приложения. Удалите несколько раскладов в дневнике и попробуйте снова.',
  storageBlocked:
    'Не сохранено: браузер не разрешает приложению ничего хранить, например в приватном окне или при запрете данных сайтов.',
  noQuestion: 'без вопроса',
  open: 'Открыть',
  delete: 'Удалить',
};

const provider: ProviderStrings = {
  cardNote: ({ base }) =>
    base
      ? `${base.summary} Ключевые слова: ${base.keywords.join(', ')}.`
      : 'Для этой карты пока нет базового значения.',
  cardFormula,
  mostlyMajors: 'Преимущественно Старшие арканы: весомые, судьбоносные темы.',
  suitDominates: (suit, count, total) =>
    `Преобладают ${suitPlural[suit]} (${count} из ${total}).`,
  mostlyReversed:
    'Преимущественно перевёрнутые карты: заблокированная или обращённая внутрь энергия.',
  suitRun: (suit, cards) =>
    `Последовательность в масти ${suitGen[suit]}: ${and(cards)}.`,
  modalityDominates: (modality, count, total) =>
    `Преобладают ${modalityAdj[modality]} знаки (${count} из ${total} карт со знаком): ${modalitySense[modality]}.`,
  signOpposition: (a, aCards, b, bCards) =>
    `Знаки ${signName[a]} и ${signName[b]} противоположны. ${signName[a]}: ${and(aCards)}. ${signName[b]}: ${and(bCards)}.`,
  numberRepeats: (number, cards) =>
    number > 10
      ? `Повторяется ранг «${courtRank[number - 11] ?? number}»: ${and(cards)}.`
      : number === 1
        ? `Повторяются Тузы: ${and(cards)}.`
        : `Повторяется число ${number}: ${and(cards)}.`,
  numberFamily: (root, cards) =>
    `Число ${root} объединяет карты: ${and(cards)}.`,
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
  // Card names stay in the nominative: each group is a labelled list.
  elementConflict: (a, aCards, b, bCards) =>
    `${elementNom[a]} и ${elementNom[b]} конфликтуют. ${elementNom[a]}: ${and(aCards)}. ${elementNom[b]}: ${and(bCards)}.`,
  elementFriendship: (a, aCards, b, bCards) =>
    `${elementNom[a]} и ${elementNom[b]} дружественны. ${elementNom[a]}: ${and(aCards)}. ${elementNom[b]}: ${and(bCards)}.`,
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
  alts: ruAlts,
  spreads,
  meanings: ruMeanings,
  waite: ruWaite,
};
