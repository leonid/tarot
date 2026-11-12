import type { CardMeaning, SchoolTable, Spread } from '../../domain/types';
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
  modeSimulate: string;
  modeSetup: string;

  question: string;
  questionPlaceholder: string;
  deck: string;
  spread: string;
  reversals: string;

  shuffleAndDeal: string;
  seed(seed: number): string;

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
  savedReadings(count: number): string;
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
