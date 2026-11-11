import type { Element } from '../../domain/elements';
import type { ProviderStrings } from '../../domain/strings';
import type { Planet, Sign } from '../../domain/zodiac';
import type { LocaleBundle, UiMessages } from './types';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "A", "A and B", "A, B and C". */
const and = (items: readonly string[]) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]!}`;

const cardsRead = (n: number) =>
  n === 1 ? 'one card was read' : `${n} cards were read`;

const ui: UiMessages = {
  appTitle: 'Tarot',
  language: 'Language',
  theme: 'Theme',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',
  modeSimulate: 'Simulate',
  modeSetup: 'Setup',

  question: 'Question',
  questionPlaceholder: 'What do you want to ask?',
  deck: 'Deck',
  spread: 'Spread',
  reversals: 'Reversals',

  shuffleAndDeal: 'Shuffle and deal',
  seed: (seed) => `seed ${seed}`,

  placeWithMenus: 'Place with menus',
  chooseCard: '-- choose a card --',
  availableCards: 'Available cards',
  dragInstructions:
    'To pick up a card, press the space bar. While dragging, use the arrow keys to move it. Press space again to drop it on a position, or escape to cancel.',
  placeHint:
    'Click a card, then click a position to place it. You can also drag a card, or use the menus below.',
  dealt: (count) =>
    `Cards dealt: ${count}. The interpretation is below the board.`,
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
  savedReadings: (count) => `Saved readings (${count})`,
  noQuestion: 'no question',
  open: 'Open',
  delete: 'Delete',
};

const provider: ProviderStrings = {
  cardNote: ({ base }) =>
    base
      ? `${base.summary} Keywords: ${base.keywords.join(', ')}.`
      : 'No base meaning written for this card yet.',
  mostlyMajors: 'Mostly Major Arcana: weighty, fated themes.',
  suitDominates: (suit, count, total) =>
    `${suit} dominate (${count} of ${total}).`,
  mostlyReversed: 'Mostly reversed: blocked or internalised energy.',
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
