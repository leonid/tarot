import type {
  CardMeaning,
  SchoolTable,
  Spread,
  Suit,
} from '../../domain/types';
import type { Element } from '../../domain/elements';
import type { ProviderStrings } from '../../domain/strings';

/** Every string the interface shows. English is the source of truth. */
export interface UiMessages {
  appTitle: string;
  language: string;
  theme: string;
  themeSystem: string;
  themeLight: string;
  themeDark: string;
  /** Accessible name of the main navigation. */
  navLabel: string;
  navHome: string;
  /** The four goals: names for the navigation, the home screen and page titles. */
  goalReading: string;
  goalRecord: string;
  goalJournal: string;
  goalCards: string;
  goalCardsText: string;
  /** The card library and a card's own page. */
  cardsPurpose: string;
  cardsSearch: string;
  cardsSearchHint: string;
  cardsNone: string;
  cardsShown(shown: number, total: number): string;
  groupMajor: string;
  suits: Record<Suit, string>;
  upright: string;
  /** Heading over the card read from its number, element, planet and sign. */
  cardParts: string;
  cardAllCards: string;
  cardPrevious: string;
  cardNext: string;
  /** Link from a card's note in a reading to the card's own page. */
  cardAbout(card: string): string;
  cardUnknown: string;
  /** Record a spread: the parts of the deck the list of cards can show. */
  paletteGroups: string;
  groupAll: string;
  paletteGroupEmpty: string;
  /** A card on the board is a button that shows its note; the board links to the reading. */
  openNote(card: string): string;
  openNoteHint: string;
  toReading: string;
  /** Buttons on a placed card. */
  flipCard(card: string): string;
  removeCard(card: string): string;
  /** Over the notes while the spread is still being filled. */
  partialReading(placed: number, total: number): string;
  /** Home: what the app is, then one sentence per goal. */
  homeIntro: string;
  /** Home: one tap to a dealt reading. */
  homeDraw: string;
  homeDrawHint(spread: string, cards: number): string;
  homeContinue: string;
  /** Footer and the about page. */
  footerNote: string;
  footerLabel: string;
  aboutTitle: string;
  aboutWhatTitle: string;
  aboutWhat: readonly string[];
  aboutSourcesTitle: string;
  aboutSources: readonly string[];
  aboutPrivacyTitle: string;
  aboutPrivacy: readonly string[];
  aboutLicenceTitle: string;
  aboutLicence: readonly string[];
  homeChoose: string;
  goalReadingText: string;
  goalRecordText: string;
  goalJournalText(count: number): string;
  /** One sentence of purpose under each page title. */
  readingPurpose: string;
  recordPurpose: string;
  journalPurpose: string;
  /** Numbered steps on the reading screens. */
  stepQuestion: string;
  stepQuestionHint: string;
  stepSpread: string;
  stepDeal: string;
  stepPlace: string;
  /** How many cards a spread takes. */
  cardCount(count: number): string;
  journalEmpty: string;
  openJournal: string;
  /** A reading opened from a share link: read-only until kept or opened. */
  sharedTitle: string;
  sharedPurpose: string;
  sharedKeep: string;
  sharedKept: string;
  sharedOpen: string;
  sharedOwn: string;

  question: string;
  questionPlaceholder: string;
  deck: string;
  spread: string;
  reversals: string;

  shuffleAndDeal: string;
  /** The number a deal is made from, shown in a "replay this deal" detail. */
  replayDeal: string;
  replayExplain(seed: number): string;
  connectionsExplain: string;
  hingeExplain: string;
  /** The folded rest of the connections: "5 more". */
  moreConnections(count: number): string;

  placeWithMenus: string;
  chooseCard: string;
  availableCards: string;
  /** Read by screen readers on a draggable card. */
  dragInstructions: string;
  /** One line above the palette: the three ways to place a card. */
  placeHint: string;
  /** Status once a card is selected by clicking it. */
  cardSelected(card: string): string;
  dealt(count: number): string;
  /** Accessible name of a position that will take the selected card. */
  placeIn(card: string, position: string): string;
  dragPickedUp(card: string): string;
  dragOver(card: string, position: string): string;
  dragDropped(card: string, position: string): string;
  dragDroppedOutside(card: string): string;
  dragCancelled(card: string): string;
  reversed: string;

  interpretation: string;
  /** Heading over the relations between cards. */
  connections: string;
  interpreting: string;
  interpretationFailed: string;
  tryAgain: string;
  updateInterpretation: string;
  /** Opt-in to the AI reader; off by default. */
  aiToggle: string;
  /** What is sent, who processes it and for how long. Shown beside the toggle. */
  aiNote: string;
  /** Label over a reading written by the AI. */
  sourceAi: string;
  /** Label over a reading written by the built-in reader. */
  sourceBuiltIn: string;
  /** Label when the AI was on but could not answer. */
  sourceFellBack: string;
  /** Opens the other schools' readings under a card's note. */
  otherSchools: string;
  /** Label of the reading built from the card's parts (the card formula). */
  schoolStructure: string;
  /** Label of Waite's own 1911 divinatory meaning. */
  schoolWaite: string;
  hinge: string;
  hingeTitle: string;
  hingeLabel: string;
  /** Element names as shown on chips. */
  elements: Record<Element, string>;

  slotEmpty: string;
  slotReversed: string;

  saveReading: string;
  copyShareLink: string;
  linkCopied: string;
  saved: string;
  /** The Save button once the reading on the table is in the journal. */
  savedButton: string;
  alreadySaved: string;
  /** The journal could not be written: storage full, or not allowed. */
  storageFull: string;
  storageBlocked: string;
  noQuestion: string;
  open: string;
  delete: string;
  dismiss: string;
  undo: string;
  /** The board was cleared by a deck or spread change. */
  readingCleared: string;
  /** The board was replaced by an opened or shared reading. */
  readingReplaced: string;
  /** A saved reading was deleted from the list. */
  savedDeleted: string;
  errorTitle: string;
  errorBody: string;
  errorStartOver: string;
  /** Shown when a share link cannot be opened; the current reading is kept. */
  shareLinkMalformed: string;
  shareLinkNewer: string;
  shareLinkUnknown: string;
}

/** Spread text that can be translated; structure (ids, x, y) stays shared. */
export interface SpreadText {
  name?: string;
  description?: string;
  positions?: Record<string, { label?: string; meaning?: string }>;
}

/**
 * One language. Card, deck, spread and meaning text are overrides of the
 * English in the structural data: anything missing falls back to English.
 */
export interface LocaleBundle {
  /** BCP 47 tag, also used for date formatting and the html lang attribute. */
  code: string;
  /** The language's own name, shown in the language picker. */
  label: string;
  ui: UiMessages;
  provider: ProviderStrings;
  decks?: Record<string, string>;
  cards?: Record<string, string>;
  /** What each card's picture shows, by card id (see src/content/images/alt.ts). */
  alts?: Record<string, string>;
  spreads?: Record<string, SpreadText>;
  meanings?: Record<string, CardMeaning>;
  /** Waite's 1911 meanings in this language (base: content/meanings/waite.ts). */
  waite?: SchoolTable;
}

export type SpreadLike = Pick<Spread, 'id'>;
