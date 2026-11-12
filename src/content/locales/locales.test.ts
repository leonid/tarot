import { describe, expect, it } from 'vitest';
import { fallbackProvider } from '../../domain/fallback';
import { decks } from '../decks';
import { meanings } from '../meanings';
import { spreads, threeCard } from '../spreads';
import {
  DEFAULT_LOCALE,
  cardAlt,
  getLocale,
  localizeDeck,
  localizeMeanings,
  localizeSpread,
  locales,
} from '.';
import { altEnglish } from '../images/alt';
import { en } from './en';
import { makePseudo } from './pseudo';

const pseudo = makePseudo();

describe('locale registry', () => {
  it('has unique codes and English as the default', () => {
    const codes = locales.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(getLocale(DEFAULT_LOCALE)).toBe(en);
  });
  it('falls back to English for an unknown code', () => {
    expect(getLocale('xx')).toBe(en);
  });
});

describe('locale coverage', () => {
  // Every shipped bundle must provide every UI key English does, and may only
  // override ids that exist in the structural content.
  const cardIds = new Set(decks.flatMap((d) => d.cards.map((c) => c.id)));
  const deckIds = new Set(decks.map((d) => d.id));
  for (const l of locales) {
    it(`${l.code} has the same UI keys as English`, () => {
      expect(Object.keys(l.ui).sort()).toEqual(Object.keys(en.ui).sort());
      expect(Object.keys(l.provider).sort()).toEqual(
        Object.keys(en.provider).sort(),
      );
    });
    it(`${l.code} overrides only known ids`, () => {
      for (const id of Object.keys(l.cards ?? {}))
        expect(cardIds).toContain(id);
      for (const id of Object.keys(l.meanings ?? {}))
        expect(cardIds).toContain(id);
      for (const id of Object.keys(l.decks ?? {}))
        expect(deckIds).toContain(id);
      for (const [sid, t] of Object.entries(l.spreads ?? {})) {
        const s = spreads.find((x) => x.id === sid);
        expect(s).toBeDefined();
        const pids = new Set(s?.positions.map((p) => p.id));
        for (const pid of Object.keys(t.positions ?? {}))
          expect(pids).toContain(pid);
      }
    });
  }
});

describe('translation completeness', () => {
  // A translated locale covers every card, meaning and spread position.
  const cardIds = [...new Set(decks.flatMap((d) => d.cards.map((c) => c.id)))];
  for (const l of locales.filter((x) => x !== en)) {
    it(`${l.code} translates every card, meaning, deck and spread`, () => {
      expect(Object.keys(l.cards ?? {}).sort()).toEqual([...cardIds].sort());
      const rwsIds = decks[0]!.cards.map((c) => c.id).sort();
      expect(Object.keys(l.meanings ?? {}).sort()).toEqual(rwsIds);
      expect(Object.keys(l.decks ?? {}).sort()).toEqual(
        decks.map((d) => d.id).sort(),
      );
      for (const s of spreads) {
        const t = l.spreads?.[s.id];
        expect(t?.name).toBeTruthy();
        expect(t?.description).toBeTruthy();
        for (const p of s.positions) {
          expect(t?.positions?.[p.id]?.label).toBeTruthy();
          expect(t?.positions?.[p.id]?.meaning).toBeTruthy();
        }
      }
    });
    it(`${l.code} keeps the same keyword counts shape as English`, () => {
      for (const [id, en_] of Object.entries(meanings)) {
        const m = l.meanings?.[id];
        expect(m?.upright.keywords.length, id).toBeGreaterThan(0);
        expect(m?.reversed.keywords.length, id).toBeGreaterThan(0);
        expect(Boolean(m?.themes), id).toBe(Boolean(en_.themes));
      }
    });
  }
});

describe('card alt text', () => {
  const cards = decks[0]!.cards;

  it('has an English description for every card and nothing else', () => {
    expect(Object.keys(altEnglish).sort()).toEqual(
      cards.map((c) => c.id).sort(),
    );
    for (const c of cards)
      expect(altEnglish[c.id]!.trim().length).toBeGreaterThan(20);
  });

  it('leaves the card name out of the description (it is added in front)', () => {
    for (const c of cards)
      expect(altEnglish[c.id]!.startsWith(c.name), c.id).toBe(false);
  });

  it('gives every card a different description', () => {
    expect(new Set(Object.values(altEnglish)).size).toBe(cards.length);
  });

  for (const l of locales.filter((x) => x !== en)) {
    it(`${l.code} describes every card`, () => {
      expect(Object.keys(l.alts ?? {}).sort()).toEqual(
        cards.map((c) => c.id).sort(),
      );
      for (const c of cards) expect(l.alts![c.id]!.trim(), c.id).not.toBe('');
    });
  }

  it('puts the localized name first and falls back to English', () => {
    const fool = cards[0]!;
    expect(cardAlt(fool, en)).toBe(`The Fool: ${altEnglish[fool.id]}`);
    const ru = getLocale('ru');
    const ruFool = localizeDeck(decks[0]!, ru).cards[0]!;
    expect(cardAlt(ruFool, ru)).toBe(`${ruFool.name}: ${ru.alts![fool.id]}`);
    const partial = { ...en, alts: {} };
    expect(cardAlt(fool, partial)).toBe(cardAlt(fool, en));
  });

  it('is never empty even for an unknown card', () => {
    expect(
      cardAlt({ id: 'x', name: 'Nameless', arcana: 'major', number: 0 }, en),
    ).toBe('Nameless');
  });
});

describe('localization', () => {
  it('returns the same object when a locale overrides nothing', () => {
    expect(localizeDeck(decks[0]!, en)).toBe(decks[0]);
    expect(localizeSpread(threeCard, en)).toBe(threeCard);
    expect(localizeMeanings(meanings, en)).toBe(meanings);
  });
  it('replaces names and falls back to English per item', () => {
    const partial = {
      ...en,
      cards: { 'major-00-fool': 'Le Fou' },
      spreads: { 'three-card': { positions: { past: { label: 'Passé' } } } },
    };
    const deck = localizeDeck(decks[0]!, partial);
    expect(deck.cards.find((c) => c.id === 'major-00-fool')?.name).toBe(
      'Le Fou',
    );
    expect(deck.cards.find((c) => c.id === 'major-01-magician')?.name).toBe(
      'The Magician',
    );
    const spread = localizeSpread(threeCard, partial);
    expect(spread.name).toBe(threeCard.name);
    expect(spread.positions.find((p) => p.id === 'past')?.label).toBe('Passé');
    expect(spread.positions.find((p) => p.id === 'past')?.meaning).toBe(
      threeCard.positions.find((p) => p.id === 'past')?.meaning,
    );
    // Structure is untouched.
    expect(spread.positions.map((p) => [p.x, p.y])).toEqual(
      threeCard.positions.map((p) => [p.x, p.y]),
    );
  });
  it('keeps card ids stable so saved readings and links stay valid', () => {
    const localized = localizeDeck(decks[0]!, pseudo);
    expect(localized.cards.map((c) => c.id)).toEqual(
      decks[0]!.cards.map((c) => c.id),
    );
  });
});

describe('pseudo-locale', () => {
  it('wraps every card name', () => {
    const d = localizeDeck(decks[0]!, pseudo);
    expect(d.cards.every((c) => c.name.startsWith('⟦'))).toBe(true);
  });
  it('makes the interpreter output wrapped, proving no English bypasses it', async () => {
    const deck = localizeDeck(decks[0]!, pseudo);
    const spread = localizeSpread(threeCard, pseudo);
    const r = await fallbackProvider.interpret({
      question: 'q',
      deck,
      spread,
      meanings: localizeMeanings(meanings, pseudo),
      strings: pseudo.provider,
      placements: [
        { positionId: 'past', cardId: 'major-00-fool', orientation: 'upright' },
        {
          positionId: 'present',
          cardId: 'major-01-magician',
          orientation: 'upright',
        },
        {
          positionId: 'future',
          cardId: 'major-02-high-priestess',
          orientation: 'reversed',
        },
      ],
    });
    for (const text of [r.summary, r.advice, ...r.cards.map((c) => c.note)])
      expect(text.startsWith('⟦')).toBe(true);
    expect(r.cards[0]?.note).toContain(
      localizeMeanings(meanings, pseudo)['major-00-fool']!.upright.summary,
    );
    expect(r.cards[0]?.note).toContain('Keywords');
  });
});
