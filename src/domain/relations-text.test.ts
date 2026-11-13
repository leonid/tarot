import { describe, expect, it } from 'vitest';
import { fallbackProvider } from './fallback';
import { factWeight } from './facts';
import type { Orientation } from './types';
import { correspondences } from '../content/correspondences';
import { rwsDeck } from '../content/decks/rws';
import { localizeDeck, localizeMeanings } from '../content/locales';
import { en } from '../content/locales/en';
import { ru } from '../content/locales/ru';
import { meanings } from '../content/meanings';
import { celticCross, threeCard } from '../content/spreads';

/**
 * The relation sentences a reader sees, per locale, for fixed readings (the
 * last is a ten-card Celtic Cross). A snapshot failure means the wording
 * changed: check it is intended before updating.
 */
const CASES: string[][] = [
  ['major-16-tower', 'cups-05-five', 'wands-01-ace'],
  ['major-13-death', 'cups-06-six', 'swords-01-ace'],
  ['major-13-death', 'cups-01-ace', 'cups-02-two'],
  ['major-00-fool', 'major-13-death', 'cups-01-ace'],
  ['cups-01-ace', 'cups-02-two', 'cups-03-three'],
  ['wands-13-queen', 'cups-01-ace', 'swords-01-ace'],
  ['wands-12-knight', 'wands-01-ace', 'cups-01-ace'],
  ['wands-13-queen', 'cups-10-ten', 'wands-03-three'],
  ['wands-13-queen', 'cups-09-nine', 'wands-04-four'],
  ['major-21-world', 'pentacles-01-ace', 'swords-01-ace'],
  ['major-00-fool', 'major-01-magician', 'major-02-high-priestess'],
  [
    'major-00-fool',
    'major-13-death',
    'cups-01-ace',
    'wands-13-queen',
    'cups-10-ten',
    'wands-03-three',
    'swords-05-five',
    'pentacles-14-king',
    'major-16-tower',
    'cups-05-five',
  ],
];

describe.each([en, ru])('relation text, $code', (locale) => {
  it.each(CASES)('%s %s %s', async (...cardIds) => {
    const spread = cardIds.length > 3 ? celticCross : threeCard;
    const out = await fallbackProvider.interpret({
      question: '',
      deck: localizeDeck(rwsDeck, locale),
      spread,
      meanings: localizeMeanings(meanings, locale),
      strings: locale.provider,
      correspondences,
      placements: cardIds.map((cardId, i) => ({
        positionId: spread.positions[i]!.id,
        cardId,
        orientation: (i % 3 === 2 ? 'reversed' : 'upright') as Orientation,
      })),
    });
    expect(out.relations).toMatchSnapshot();
    expect({ summary: out.summary, advice: out.advice }).toMatchSnapshot(
      'composed',
    );
  });
});

describe('the strongest facts come first (R7)', () => {
  it('ranks a dominant element above a planet link and a friendship', () => {
    expect(
      factWeight({
        kind: 'element-dominates',
        element: 'water',
        count: 3,
        total: 3,
      } as never),
    ).toBeGreaterThan(
      factWeight({
        kind: 'planet-link',
        planet: 'mars',
        cardIds: ['a', 'b'],
      } as never),
    );
    expect(
      factWeight({
        kind: 'planet-link',
        planet: 'mars',
        cardIds: ['a', 'b'],
      } as never),
    ).toBeGreaterThan(
      factWeight({
        kind: 'element-friendship',
        elements: ['fire', 'air'],
        cardIds: [['a'], ['b']],
      } as never),
    );
  });

  it('counts the cards a fact involves, as a tie-break', () => {
    const link = (cardIds: string[]) =>
      factWeight({ kind: 'planet-link', planet: 'mars', cardIds } as never);
    expect(link(['a', 'b', 'c'])).toBeGreaterThan(link(['a', 'b']));
  });
});

describe('the composed reading (R6)', () => {
  const read = (locale: typeof en, question: string, ids: string[]) =>
    fallbackProvider.interpret({
      question,
      deck: localizeDeck(rwsDeck, locale),
      spread: celticCross,
      meanings: localizeMeanings(meanings, locale),
      strings: locale.provider,
      correspondences,
      placements: ids.map((cardId, i) => ({
        positionId: celticCross.positions[i]!.id,
        cardId,
        orientation: 'upright' as Orientation,
      })),
    });
  const TEN = CASES[CASES.length - 1]!;

  it.each([en, ru])(
    'names the centre, the obstacle and the outcome in $code',
    async (locale) => {
      const out = await read(locale, 'Should I move?', TEN);
      const deck = localizeDeck(rwsDeck, locale);
      const name = (id: string) => deck.cards.find((c) => c.id === id)!.name;
      const roleCard = (role: string) =>
        name(TEN[celticCross.positions.findIndex((p) => p.role === role)]!);
      expect(out.summary).toContain(roleCard('focus'));
      expect(out.summary).toContain(roleCard('obstacle'));
      expect(out.summary).toContain(roleCard('outcome'));
      expect(out.advice).toContain(roleCard('obstacle'));
    },
  );

  it('is different for different cards', async () => {
    const a = await read(en, '', TEN);
    const b = await read(en, '', [...TEN].reverse());
    expect(a.summary).not.toBe(b.summary);
    expect(a.advice).not.toBe(b.advice);
  });

  it('is the same for the same cards', async () => {
    expect(await read(en, 'q', TEN)).toEqual(await read(en, 'q', TEN));
  });

  it('says nothing about a position that has no card yet', async () => {
    const out = await read(en, '', TEN.slice(0, 1));
    expect(out.summary).not.toMatch(/stands in the way/);
  });
});
