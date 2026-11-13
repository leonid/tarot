import type { Element } from '../../domain/elements';
import type { KeyCard, ProviderStrings } from '../../domain/strings';
import type { Modality, Planet, Sign } from '../../domain/zodiac';
import { cardFormula } from './en-formula';
import type { LocaleBundle, UiMessages } from './types';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "A", "A and B", "A, B and C". */
const and = (items: readonly string[]) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]!}`;

const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

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
  openNote: (card) => `Read the note for ${card}`,
  openNoteHint: 'Read its note',
  toReading: 'Go to the interpretation',
  flipCard: (card) => `Turn ${card} over`,
  removeCard: (card) => `Take ${card} off the board`,
  partialReading: (placed, total) =>
    `${placed} of ${total} cards placed. Each card is read as you place it; how they connect appears when every position has a card.`,
  homeIntro:
    'Tarot as a way to think a question through. Each card is read in its position and against the other cards. For reflection, not prediction or advice.',
  homeDraw: 'Deal a reading now',
  homeDrawHint: (spread, cards) =>
    `One tap: ${spread}, ${cards} cards. You can add a question afterwards.`,
  homeContinue: 'Continue your reading',
  footerNote: 'For reflection, not prediction or advice.',
  footerLabel: 'About this app',
  aboutTitle: 'About',
  aboutWhatTitle: 'What this is',
  aboutWhat: [
    'A place to lay out tarot cards and read them: deal a spread, or enter the cards you drew yourself. Each card is read in its position and against the other cards, and the reading says how it got there.',
    'The reading is written by fixed rules in your browser. The same cards in the same positions always give the same text.',
    'Tarot here is a way to think a question through. It does not predict events, and it is not medical, legal, financial or psychological advice.',
  ],
  aboutSourcesTitle: 'Sources',
  aboutSources: [
    'Pictures: the 1909 Rider-Waite-Smith deck drawn by Pamela Colman Smith, from scans of a first-edition deck on Wikimedia Commons. They are in the public domain.',
    'Meanings: written for this app. The second set of meanings restates A. E. Waite, The Pictorial Key to the Tarot (1911), in our own words.',
    'Elements, planets, signs and decans follow the Golden Dawn attributions (Book T).',
  ],
  aboutPrivacyTitle: 'Your readings',
  aboutPrivacy: [
    'Saved readings stay in this browser, on this device. There is no account, and nothing is sent anywhere when you deal, record or save.',
    'A share link holds the whole reading, your question included, inside the link itself. Anyone with the link can read it.',
    'If the AI reader is offered and you switch it on, your question and cards are sent to our server and to Anthropic to write the text. It is off unless you turn it on.',
  ],
  aboutLicenceTitle: 'Licence',
  aboutLicence: [
    'The card pictures are in the public domain and free to reuse.',
    'No open licence has been chosen yet for the code and the texts of this app.',
  ],
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
  replayDeal: 'Replay this deal',
  replayExplain: (seed) =>
    `Every deal is made from a number. This one is ${seed}; dealing with the same number, spread and deck gives the same cards.`,
  connectionsExplain:
    'How the cards relate to each other: shared suits, numbers, elements and planets. The strongest come first.',
  hingeExplain:
    'The card the others lean on most: it has the most links to them, so reading it first helps the rest make sense.',
  moreConnections: (count) =>
    count === 1 ? 'One more connection' : `${count} more connections`,

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
  saved: 'Saved in your journal.',
  savedButton: 'Saved ✓',
  alreadySaved: 'This reading is already in your journal.',
  storageFull:
    'Not saved: this browser has no room left for the app. Delete some readings in the journal and try again.',
  storageBlocked:
    'Not saved: this browser does not let the app keep anything, for example in a private window or with site data blocked.',
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
  summary: (question, cards, parts) => {
    const opening = question
      ? `For the question "${question}", ${cardsRead(cards)}.`
      : `${cap(cardsRead(cards))}.`;
    const key = (k: KeyCard, lead: string) =>
      `${lead} ${k.card}${k.orientation === 'reversed' ? ' (reversed)' : ''}${k.keywords.length ? `, which speaks of ${and(k.keywords)}` : ''}.`;
    return [
      opening,
      parts.focus &&
        key(parts.focus, `At the centre (${parts.focus.position}) is`),
      parts.obstacle &&
        key(
          parts.obstacle,
          `What stands in the way (${parts.obstacle.position}) is`,
        ),
      parts.outcome &&
        key(parts.outcome, `It leads toward (${parts.outcome.position})`),
      parts.strongest && `The clearest pattern: ${lowerFirst(parts.strongest)}`,
    ]
      .filter(Boolean)
      .join(' ');
  },
  advice: (parts) => {
    const steps = [
      parts.hinge && `Start with ${parts.hinge}: the other cards lean on it.`,
      parts.obstacle &&
        `Name what ${parts.obstacle.card} points to before acting.`,
      parts.outcome &&
        `Ask whether where ${parts.outcome.card} leads is where you want to go.`,
    ].filter(Boolean);
    return steps.length
      ? steps.join(' ')
      : 'Weigh each card against the position it landed in.';
  },

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
