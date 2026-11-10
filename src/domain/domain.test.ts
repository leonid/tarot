import { describe, expect, it } from 'vitest';
import { deal } from './deal';
import { createRng, shuffle } from './rng';
import { validateReading } from './validate';
import { fallbackProvider } from './fallback';
import { dignity, elementOf } from './elements';
import { majorOnlyDeck, rwsDeck } from '../content/decks/rws';
import { celticCross, spreads, threeCard } from '../content/spreads';
import { en } from '../content/locales/en';
import { meanings } from '../content/meanings';

describe('decks', () => {
  it('RWS has 78 unique cards: 22 major, 56 minor', () => {
    expect(rwsDeck.cards).toHaveLength(78);
    expect(new Set(rwsDeck.cards.map((c) => c.id)).size).toBe(78);
    expect(rwsDeck.cards.filter((c) => c.arcana === 'major')).toHaveLength(22);
    expect(majorOnlyDeck.cards).toHaveLength(22);
  });

  it('every meaning key refers to a real card', () => {
    const ids = new Set(rwsDeck.cards.map((c) => c.id));
    for (const key of Object.keys(meanings)) expect(ids.has(key)).toBe(true);
  });
});

describe('spreads', () => {
  it('have unique position ids', () => {
    for (const s of spreads)
      expect(new Set(s.positions.map((p) => p.id)).size).toBe(
        s.positions.length,
      );
  });
  it('Celtic Cross has 10 positions', () => {
    expect(celticCross.positions).toHaveLength(10);
  });
});

describe('shuffle and deal', () => {
  it('is deterministic for a given seed', () => {
    const a = shuffle([1, 2, 3, 4, 5, 6], createRng(42));
    const b = shuffle([1, 2, 3, 4, 5, 6], createRng(42));
    expect(a).toEqual(b);
  });

  it('deals one distinct card per position and validates', () => {
    const reading = deal({
      question: 'q',
      deck: rwsDeck,
      spread: celticCross,
      seed: 7,
      allowReversals: true,
    });
    expect(reading.placements).toHaveLength(10);
    expect(validateReading(reading, rwsDeck, celticCross)).toEqual([]);
  });

  it('never reverses when reversals are off', () => {
    const r = deal({
      question: '',
      deck: rwsDeck,
      spread: celticCross,
      seed: 1,
      allowReversals: false,
    });
    expect(r.placements.every((p) => p.orientation === 'upright')).toBe(true);
  });

  it('rejects duplicate cards in validation', () => {
    const problems = validateReading(
      {
        question: '',
        deckId: rwsDeck.id,
        spreadId: threeCard.id,
        placements: [
          {
            positionId: 'past',
            cardId: 'major-00-fool',
            orientation: 'upright',
          },
          {
            positionId: 'present',
            cardId: 'major-00-fool',
            orientation: 'upright',
          },
        ],
      },
      rwsDeck,
      threeCard,
    );
    expect(problems.length).toBeGreaterThan(0);
  });
});

describe('fallback provider', () => {
  it('produces a note per placed card', async () => {
    const r = await fallbackProvider.interpret({
      question: 'Will it work?',
      deck: rwsDeck,
      spread: threeCard,
      meanings,
      strings: en.provider,
      placements: [
        { positionId: 'past', cardId: 'major-00-fool', orientation: 'upright' },
        {
          positionId: 'present',
          cardId: 'major-13-death',
          orientation: 'reversed',
        },
        { positionId: 'future', cardId: 'cups-01-ace', orientation: 'upright' },
      ],
    });
    expect(r.cards).toHaveLength(3);
    expect(r.cards[0]?.note).toContain('The Fool');
  });
});

describe('elemental dignities', () => {
  it('follows the Golden Dawn pairings', () => {
    expect(dignity('fire', 'fire')).toBe('strengthened');
    expect(dignity('fire', 'air')).toBe('friendly');
    expect(dignity('water', 'earth')).toBe('friendly');
    expect(dignity('fire', 'water')).toBe('conflicted');
    expect(dignity('air', 'earth')).toBe('conflicted');
  });
  it('maps suits to elements; majors have none', () => {
    const wands = rwsDeck.cards.find((c) => c.id === 'wands-01-ace')!;
    const fool = rwsDeck.cards.find((c) => c.id === 'major-00-fool')!;
    expect(elementOf(wands)).toBe('fire');
    expect(elementOf(fool)).toBeUndefined();
  });
});
