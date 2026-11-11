import { describe, expect, it } from 'vitest';
import { formula } from './formula';
import { essentialDignity, SIGNS, type Planet } from './zodiac';
import { correspondences } from '../content/correspondences';
import { rwsDeck } from '../content/decks/rws';
import { en } from '../content/locales/en';
import { ru } from '../content/locales/ru';

const card = (id: string) => rwsDeck.cards.find((c) => c.id === id)!;
const f = (id: string) => formula(card(id), rwsDeck, correspondences);
const name = (id: string) => card(id).name;

describe('essential dignity', () => {
  it('knows home, exaltation, detriment and fall', () => {
    expect(essentialDignity('jupiter', 'pisces')).toBe('domicile');
    expect(essentialDignity('saturn', 'libra')).toBe('exaltation');
    expect(essentialDignity('saturn', 'leo')).toBe('detriment');
    expect(essentialDignity('mars', 'cancer')).toBe('fall');
    expect(essentialDignity('sun', 'gemini')).toBeUndefined();
    expect(essentialDignity('uranus', 'aquarius')).toBeUndefined();
  });

  it('puts detriment and fall opposite home and exaltation', () => {
    const classical: Planet[] = [
      'sun',
      'moon',
      'mercury',
      'venus',
      'mars',
      'jupiter',
      'saturn',
    ];
    for (const p of classical)
      SIGNS.forEach((s, i) => {
        const here = essentialDignity(p, s);
        const across = essentialDignity(p, SIGNS[(i + 6) % 12]!);
        if (here === 'domicile') expect(across).toBe('detriment');
        // Mercury is at home and exalted in Virgo; home wins there.
        if (here === 'exaltation') expect(across).toBe('fall');
      });
  });
});

describe('card formula (M6.12)', () => {
  it('reads a pip as number x element plus its decan and two Majors', () => {
    expect(f('wands-02-two')).toEqual({
      kind: 'pip',
      number: 2,
      element: 'fire',
      decan: {
        planet: 'mars',
        sign: 'aries',
        modality: 'cardinal',
        strength: 'domicile',
        majorIds: ['major-16-tower', 'major-04-emperor'],
      },
    });
  });

  it('reads an Ace as the root of its element', () => {
    expect(f('cups-01-ace')).toEqual({ kind: 'ace', element: 'water' });
  });

  it('reads a court as one element within another', () => {
    expect(f('wands-13-queen')).toEqual({
      kind: 'court',
      rank: 'queen',
      element: 'fire',
      subElement: 'water',
    });
  });

  it('gives a Major its sign or planet and its number family', () => {
    expect(f('major-15-devil')).toEqual({
      kind: 'major',
      number: 15,
      root: 6,
      kinIds: ['major-06-lovers'],
      sign: 'capricorn',
      element: 'earth',
      modality: 'cardinal',
    });
    expect(f('major-00-fool')).toEqual({
      kind: 'major',
      number: 0,
      kinIds: [],
      planet: 'uranus',
      element: 'air',
    });
    expect(f('major-19-sun')).toMatchObject({
      root: 1,
      kinIds: ['major-01-magician', 'major-10-wheel-of-fortune'],
      planet: 'sun',
    });
  });

  it('works without a correspondence table', () => {
    expect(formula(card('wands-02-two'), rwsDeck)).toEqual({
      kind: 'pip',
      number: 2,
      element: 'fire',
    });
    expect(formula(card('wands-13-queen'), rwsDeck)).toEqual({
      kind: 'court',
      rank: 'queen',
      element: 'fire',
    });
  });

  it('every card renders in English and Russian', () => {
    for (const c of rwsDeck.cards) {
      const x = formula(c, rwsDeck, correspondences);
      expect(en.provider.cardFormula(x, name).length).toBeGreaterThan(20);
      expect(ru.provider.cardFormula(x, name)).toMatch(/[а-я]{4}/);
      for (const l of [en, ru])
        expect(l.provider.cardFormula(x, name)).not.toMatch(
          /undefined|\[object/,
        );
    }
  });

  it('names the planet, sign and Majors of the 2 of Wands', () => {
    const text = en.provider.cardFormula(f('wands-02-two'), name);
    expect(text).toContain('Mars in Aries');
    expect(text).toContain('The Tower and The Emperor');
  });
});
