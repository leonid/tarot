import { describe, expect, it } from 'vitest';
import { fallbackProvider } from './fallback';
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
  });
});
