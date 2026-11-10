import { describe, expect, it } from 'vitest';
import { compare } from './compare';
import { renderFact, type Fact } from './facts';
import { fallbackProvider } from './fallback';
import type { ReadingContext } from './interpretation';
import type { Orientation } from './types';
import { correspondences } from '../content/correspondences';
import { rwsDeck } from '../content/decks/rws';
import { en } from '../content/locales/en';
import { ru } from '../content/locales/ru';
import { meanings } from '../content/meanings';
import { threeCard } from '../content/spreads';

const ids = ['past', 'present', 'future'];
function ctx(cardIds: string[], withTable = true): ReadingContext {
  return {
    question: '',
    deck: rwsDeck,
    spread: threeCard,
    meanings,
    strings: en.provider,
    ...(withTable ? { correspondences } : {}),
    placements: cardIds.map((cardId, i) => ({
      positionId: ids[i]!,
      cardId,
      orientation: 'upright' as Orientation,
    })),
  };
}

const kinds = (cardIds: string[], withTable = true) =>
  compare(ctx(cardIds, withTable)).facts.map((f) => f.kind);

describe('compare (DCAS step 2)', () => {
  it('finds a shared planet across a major and a decan ruler', () => {
    // The Tower is Mars; the 5 of Cups is the Mars decan of Scorpio.
    const r = compare(ctx(['major-16-tower', 'cups-05-five', 'wands-01-ace']));
    expect(r.facts).toContainEqual({
      kind: 'planet-link',
      planet: 'mars',
      cardIds: ['major-16-tower', 'cups-05-five'],
    });
  });

  it('finds a shared sign across a major and a decan', () => {
    // Death is Scorpio; the 6 of Cups is Scorpio II.
    const r = compare(ctx(['major-13-death', 'cups-06-six', 'swords-01-ace']));
    expect(r.facts).toContainEqual({
      kind: 'sign-link',
      sign: 'scorpio',
      cardIds: ['major-13-death', 'cups-06-six'],
    });
  });

  it('gives majors an element through sign or traditional element', () => {
    // Death (Scorpio, water) and the Ace of Cups strengthen; they dominate.
    const r = compare(ctx(['major-13-death', 'cups-01-ace', 'cups-02-two']));
    expect(r.facts).toContainEqual({
      kind: 'element-dominates',
      element: 'water',
      count: 3,
      total: 3,
    });
  });

  it('reports conflicts and picks the card with the most ties as hinge', () => {
    // Fool (traditional air) conflicts with Death (water) and the Ace of Cups.
    const r = compare(ctx(['major-00-fool', 'major-13-death', 'cups-01-ace']));
    expect(r.facts).toContainEqual({
      kind: 'conflicts',
      pairs: [
        ['major-00-fool', 'major-13-death'],
        ['major-00-fool', 'cups-01-ace'],
      ],
    });
    expect(r.hingeCardId).toBe('major-00-fool');
  });

  it('names no hinge when ties are even or absent', () => {
    expect(
      compare(ctx(['cups-01-ace', 'cups-02-two', 'cups-03-three'])).hingeCardId,
    ).toBeUndefined();
  });

  it('without a correspondence table, majors yield only the count facts', () => {
    expect(
      kinds(['major-13-death', 'major-00-fool', 'major-16-tower'], false),
    ).toEqual(['mostly-majors']);
  });

  it('counts a dominant suit and a reversed majority', () => {
    const c = ctx(['cups-01-ace', 'cups-02-two', 'wands-01-ace']);
    const reversed = {
      ...c,
      placements: c.placements.map((p, i) => ({
        ...p,
        orientation: (i < 2 ? 'reversed' : 'upright') as Orientation,
      })),
    };
    const facts = compare(reversed).facts;
    expect(facts).toContainEqual({
      kind: 'suit-dominates',
      suit: 'cups',
      count: 2,
      total: 3,
    });
    expect(facts).toContainEqual({ kind: 'mostly-reversed' });
  });

  it('notes a court sub-element echoing another card', () => {
    // Queen of Wands is Water of Fire; the Ace of Cups is water.
    const r = compare(ctx(['wands-13-queen', 'cups-01-ace', 'swords-01-ace']));
    expect(r.facts).toContainEqual({
      kind: 'court-echo',
      courtId: 'wands-13-queen',
      sub: 'water',
      suit: 'fire',
      cardIds: ['cups-01-ace'],
    });
  });

  it('skips the echo when sub-element equals the suit element', () => {
    // Knight of Wands is Fire of Fire.
    expect(
      kinds(['wands-12-knight', 'wands-01-ace', 'cups-01-ace']),
    ).not.toContain('court-echo');
  });

  it('finds decans inside a court span, including across Pisces to Aries', () => {
    // Queen of Wands spans 20 Pisces to 20 Aries: Pisces III and Aries I-II.
    const inside = compare(
      ctx(['wands-13-queen', 'cups-10-ten', 'wands-03-three']),
    );
    expect(inside.facts).toContainEqual({
      kind: 'court-span',
      courtId: 'wands-13-queen',
      cardIds: ['cups-10-ten', 'wands-03-three'],
    });
    // Pisces II and Aries III lie outside it.
    expect(
      kinds(['wands-13-queen', 'cups-09-nine', 'wands-04-four']),
    ).not.toContain('court-span');
  });

  it('treats The World as earth through its Book T element', () => {
    // The World (Saturn and Earth) strengthens Pentacles and conflicts with Swords.
    const r = compare(
      ctx(['major-21-world', 'pentacles-01-ace', 'swords-01-ace']),
    );
    const conflicts = r.facts.find((f) => f.kind === 'conflicts');
    expect(conflicts?.pairs).toContainEqual([
      'major-21-world',
      'swords-01-ace',
    ]);
  });

  it('returns data only: no card name or other text in a fact', () => {
    const r = compare(ctx(['major-00-fool', 'major-13-death', 'cups-01-ace']));
    const names = rwsDeck.cards.map((c) => c.name);
    const json = JSON.stringify(r.facts.map((f) => Object.values(f)));
    expect(names.filter((n) => json.includes(n))).toEqual([]);
    // Every string in a fact is an id or an enum value: no spaces, no capitals.
    const strings = json.match(/"[^"]*"/g) ?? [];
    expect(strings.filter((x) => /[\sA-Z]/.test(x))).toEqual([]);
  });

  it('flows through the fallback provider as rendered sentences', async () => {
    const out = await fallbackProvider.interpret(
      ctx(['major-00-fool', 'major-13-death', 'cups-01-ace']),
    );
    expect(out.hingeCardId).toBe('major-00-fool');
    expect(out.relations).toContain(
      'Conflicting elements: The Fool and Death; The Fool and Ace of Cups.',
    );
  });
});

describe('renderFact', () => {
  const name = (id: string) => `<${id}>`;
  const all: Fact[] = [
    { kind: 'mostly-majors' },
    { kind: 'mostly-reversed' },
    { kind: 'suit-dominates', suit: 'cups', count: 2, total: 3 },
    { kind: 'element-dominates', element: 'water', count: 2, total: 3 },
    { kind: 'planet-link', planet: 'mars', cardIds: ['a', 'b'] },
    { kind: 'sign-link', sign: 'scorpio', cardIds: ['a', 'b'] },
    {
      kind: 'court-echo',
      courtId: 'q',
      sub: 'water',
      suit: 'fire',
      cardIds: ['a'],
    },
    { kind: 'court-span', courtId: 'q', cardIds: ['a', 'b'] },
    { kind: 'conflicts', pairs: [['a', 'b']] },
    { kind: 'friends', pairs: [['a', 'b']] },
  ];

  it.each([en, ru])('renders every kind of fact in $code', (locale) => {
    for (const fact of all) {
      const text = renderFact(fact, locale.provider, name);
      expect(text.length).toBeGreaterThan(0);
      // Card ids reach the sentence only through the name lookup.
      if ('cardIds' in fact)
        for (const id of fact.cardIds) expect(text).toContain(`<${id}>`);
      if ('courtId' in fact) expect(text).toContain('<q>');
      if ('pairs' in fact) expect(text).toContain('<a>');
    }
  });

  it('names the court card and the echoed cards in the right places', () => {
    expect(renderFact(all[6]!, en.provider, name)).toBe(
      '<q> (Water of Fire) echoes water in <a>.',
    );
    expect(renderFact(all[7]!, en.provider, name)).toBe(
      '<a> and <b> fall within the span of <q>.',
    );
  });
});
