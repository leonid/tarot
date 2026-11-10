import type { Element } from '../../domain/elements';
import type { ProviderStrings } from '../../domain/strings';
import type { Planet, Sign } from '../../domain/zodiac';
import type { LocaleBundle, UiMessages } from './types';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const and = (items: readonly string[]) => items.join(' and ');
const pairs = (list: readonly (readonly [string, string])[]) =>
  list.map(([a, b]) => `${a} and ${b}`).join('; ');

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
  conflicts: (list) => `Conflicting elements: ${pairs(list)}.`,
  friends: (list) => `Friendly elements: ${pairs(list)}.`,
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
