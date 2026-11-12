import type { Element } from '../../domain/elements';
import type { ProviderStrings } from '../../domain/strings';
import type { Modality, Planet, Sign } from '../../domain/zodiac';
import { cardFormula } from './en-formula';
import type { LocaleBundle, UiMessages } from './types';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "A", "A and B", "A, B and C". */
const and = (items: readonly string[]) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]!}`;

const cardsRead = (n: number) =>
  n === 1 ? 'one card was read' : `${n} cards were read`;

const NUMBER_WORDS = [
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
const COURT_RANKS = ['Page', 'Knight', 'Queen', 'King'];

const MODALITY_SENSE: Record<Modality, string> = {
  cardinal: 'things are starting',
  fixed: 'things are holding',
  mutable: 'things are changing',
};

const ui: UiMessages = {
  appTitle: 'Tarot',
  language: 'Language',
  theme: 'Theme',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',
  navLabel: 'Main',
  navHome: 'Home',
  goalReading: 'Get a reading',
  goalRecord: 'Record a spread',
  goalJournal: 'Journal',
  goalCards: 'Learn the cards',
  goalCardsText:
    'All 78 cards: what each means upright and reversed, and what it is built from.',
  cardsPurpose: 'Every card of the deck. Choose one to read what it means.',
  cardsSearch: 'Find a card',
  cardsSearchHint: 'A name or a keyword, like "moon" or "courage".',
  cardsNone: 'No card matches. Try a shorter word.',
  cardsShown: (shown, total) => `${shown} of ${total} cards`,
  groupMajor: 'Major Arcana',
  suits: {
    wands: 'Wands',
    cups: 'Cups',
    swords: 'Swords',
    pentacles: 'Pentacles',
  },
  upright: 'Upright',
  cardParts: 'What it is built from',
  cardAllCards: 'All cards',
  cardPrevious: 'Previous card',
  cardNext: 'Next card',
  cardAbout: (card) => `More about ${card}`,
  cardUnknown: 'There is no such card. Choose one from the list.',
  paletteGroups: 'Which cards to show',
  groupAll: 'All',
  paletteGroupEmpty: 'Every card of this part is on the board.',
  flipCard: (card) => `Turn ${card} over`,
  removeCard: (card) => `Take ${card} off the board`,
  partialReading: (placed, total) =>
    `${placed} of ${total} cards placed. Each card is read as you place it; how they connect appears when every position has a card.`,
  homeIntro:
    'Tarot as a way to think a question through. Each card is read in its position and against the other cards. For reflection, not prediction or advice.',
  homeChoose: 'What would you like to do?',
  goalReadingText:
    'Ask a question and let the app shuffle and deal. You get a reading of every card in its place.',
  goalRecordText:
    'Laid out real cards? Enter them position by position and read the spread.',
  goalJournalText: (count) =>
    count === 0
      ? 'Readings you save are kept here, on this device.'
      : `Come back to your saved readings (${count}).`,
  readingPurpose:
    'Ask, deal, and read what each card says in its position. Three steps.',
  recordPurpose:
    'Enter the cards you drew yourself, then read them here. Three steps.',
  journalPurpose:
    'Readings you saved, newest first. They are kept on this device only.',
  stepQuestion: 'Your question',
  stepQuestionHint:
    'Optional. Open questions work best: "What should I keep in mind about…?"',
  stepSpread: 'Choose a spread',
  stepDeal: 'Deal the cards',
  stepPlace: 'Place your cards',
  cardCount: (count) => (count === 1 ? '1 card' : `${count} cards`),
  journalEmpty:
    'Nothing saved yet. Finish a reading and press "Save reading" to keep it here.',
  openJournal: 'Open the journal',
  sharedTitle: 'A reading shared with you',
  sharedPurpose:
    'Someone sent you this reading. It is not saved, and it does not change your own cards.',
  sharedKeep: 'Keep it in my journal',
  sharedKept: 'Kept in your journal.',
  sharedOpen: 'Open it to change it',
  sharedOwn: 'Start my own reading',

  question: 'Question',
  questionPlaceholder: 'What do you want to ask?',
  deck: 'Deck',
  spread: 'Spread',
  reversals: 'Reversals',

  shuffleAndDeal: 'Shuffle and deal',
  seed: (seed) => `seed ${seed}`,

  placeWithMenus: 'Or choose each card from a list',
  chooseCard: '-- choose a card --',
  availableCards: 'Available cards',
  dragInstructions:
    'To pick up a card, press the space bar. While dragging, use the arrow keys to move it. Press space again to drop it on a position, or escape to cancel.',
  placeHint:
    'Click a card, then click a position to place it. You can also drag a card, or use the lists below. A placed card has buttons to turn it over or take it off.',
  dealt: (count) =>
    `Cards dealt: ${count}. The interpretation follows the board.`,
  cardSelected: (card) =>
    `${card} is selected. Click a position to place it, or click the card again to put it back.`,
  placeIn: (card, position) => `Place ${card} in ${position}`,
  dragPickedUp: (card) => `Picked up ${card}.`,
  dragOver: (card, position) => `${card} is over ${position}.`,
  dragDropped: (card, position) => `${card} was placed in ${position}.`,
  dragDroppedOutside: (card) => `${card} was dropped outside any position.`,
  dragCancelled: (card) => `Dragging ${card} was cancelled.`,
  reversed: 'Reversed',

  interpretation: 'Interpretation',
  connections: 'Connections',
  interpreting: 'Reading the cards…',
  interpretationFailed: 'The interpretation could not be made.',
  tryAgain: 'Try again',
  updateInterpretation: 'Update for the new question',
  aiToggle: 'Write the reading with AI',
  aiNote:
    'Off by default. When on, your question and the cards are sent to our server and processed by Anthropic (Claude), which may keep them for up to 30 days. For reflection and entertainment, not advice. If the service is unavailable the built-in reader writes the reading instead.',
  sourceAi: 'Written by AI (Claude)',
  sourceBuiltIn: 'Written by the built-in reader',
  sourceFellBack:
    'The AI service did not answer, so the built-in reader wrote this.',
  otherSchools: 'Other readings of this card',
  schoolStructure: 'By structure',
  schoolWaite: 'Waite, 1911',
  hinge: 'Hinge',
  hingeTitle: 'Most connected to the other cards',
  hingeLabel: 'Hinge:',
  elements: { fire: 'Fire', water: 'Water', air: 'Air', earth: 'Earth' },

  slotEmpty: 'empty',
  slotReversed: '(reversed)',

  saveReading: 'Save reading',
  copyShareLink: 'Copy share link',
  linkCopied: 'Link copied.',
  dismiss: 'Dismiss',
  undo: 'Undo',
  readingCleared: 'The cards were cleared for the new deck or spread.',
  readingReplaced: 'Your previous reading was replaced by the one you opened.',
  savedDeleted: 'Saved reading deleted.',
  errorTitle: 'Something went wrong',
  errorBody:
    'The reading could not be shown. Starting over clears the current reading. Your saved readings, language and theme are kept.',
  errorStartOver: 'Start over',
  shareLinkMalformed:
    'This share link could not be read. It may be cut off or damaged. Your current reading is unchanged.',
  shareLinkNewer:
    'This share link was made by a newer version of the app and cannot be opened here. Your current reading is unchanged.',
  shareLinkUnknown:
    'This share link uses a deck or spread this version does not have. Your current reading is unchanged.',
  saved: 'Saved.',
  noQuestion: 'no question',
  open: 'Open',
  delete: 'Delete',
};

const provider: ProviderStrings = {
  cardNote: ({ base }) =>
    base
      ? `${base.summary} Keywords: ${base.keywords.join(', ')}.`
      : 'No base meaning written for this card yet.',
  cardFormula,
  mostlyMajors: 'Mostly Major Arcana: weighty, fated themes.',
  suitDominates: (suit, count, total) =>
    `${suit} dominate (${count} of ${total}).`,
  mostlyReversed: 'Mostly reversed: blocked or internalised energy.',
  suitRun: (suit, cards) => `A run in ${suit}: ${and(cards)}.`,
  modalityDominates: (modality, count, total) =>
    `${cap(modality)} signs dominate (${count} of ${total} cards in a sign): ${MODALITY_SENSE[modality]}.`,
  signOpposition: (a, aCards, b, bCards) =>
    `${cap(a)} opposes ${cap(b)}: ${and(aCards)} face${aCards.length === 1 ? 's' : ''} ${and(bCards)}.`,
  numberRepeats: (number, cards) =>
    number > 10
      ? `The rank of ${COURT_RANKS[number - 11] ?? number} repeats: ${and(cards)}.`
      : number === 1
        ? `The Aces repeat: ${and(cards)}.`
        : `The number ${NUMBER_WORDS[number - 1] ?? number} repeats: ${and(cards)}.`,
  numberFamily: (root, cards) =>
    `${and(cards)} share the number ${NUMBER_WORDS[root - 1] ?? root}.`,
  summary: (question, cards) =>
    question
      ? `For the question "${question}", ${cardsRead(cards)}.`
      : `${cap(cardsRead(cards))}.`,
  advice: 'Weigh each card against the position it landed in.',

  elementDominates: (element: Element, count, total) =>
    `${cap(element)} dominates (${count} of ${total} cards with an element).`,
  planetLinks: (planet: Planet, cards) => `${cap(planet)} links ${and(cards)}.`,
  signLinks: (sign: Sign, cards) => `${cap(sign)} links ${and(cards)}.`,
  courtEcho: (court, sub, suit, cards) =>
    `${court} (${cap(sub)} of ${cap(suit)}) echoes ${sub} in ${and(cards)}.`,
  courtSpan: (cards, court) =>
    `${and(cards)} fall${cards.length === 1 ? 's' : ''} within the span of ${court}.`,
  elementConflict: (a, aCards, b, bCards) =>
    `${cap(a)} against ${b}: ${and(aCards)} conflict${aCards.length === 1 ? 's' : ''} with ${and(bCards)}.`,
  elementFriendship: (a, aCards, b, bCards) =>
    `${cap(a)} with ${b}: ${and(aCards)} support${aCards.length === 1 ? 's' : ''} ${and(bCards)}.`,
};

/**
 * English. Card, deck and spread names and the card meanings live in the
 * structural content and are the fallback for every locale, so this bundle
 * overrides none of them.
 */
export const en: LocaleBundle = {
  code: 'en',
  label: 'English',
  ui,
  provider,
};
