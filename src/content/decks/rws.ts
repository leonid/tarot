import type { Card, Deck, Suit } from '../../domain/types';

const MAJORS = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
] as const;

const SUITS: readonly Suit[] = ['wands', 'cups', 'swords', 'pentacles'];
const RANKS = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Page',
  'Knight',
  'Queen',
  'King',
] as const;

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/^the /, '')
    .replace(/[^a-z0-9]+/g, '-');
const pad = (n: number) => String(n).padStart(2, '0');
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

export const majorArcana: readonly Card[] = MAJORS.map((name, number) => ({
  id: `major-${pad(number)}-${slug(name)}`,
  name,
  arcana: 'major',
  number,
}));

export const minorArcana: readonly Card[] = SUITS.flatMap((suit) =>
  RANKS.map((rank, i): Card => ({
    id: `${suit}-${pad(i + 1)}-${rank.toLowerCase()}`,
    name: `${rank} of ${titleCase(suit)}`,
    arcana: 'minor',
    suit,
    number: i + 1,
  })),
);

export const rwsDeck: Deck = {
  id: 'rws-78',
  name: 'Rider-Waite-Smith (78 cards)',
  cards: [...majorArcana, ...minorArcana],
};

export const majorOnlyDeck: Deck = {
  id: 'major-22',
  name: 'Major Arcana only (22 cards)',
  cards: majorArcana,
};
