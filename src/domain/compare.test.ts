import { describe, expect, it } from 'vitest';
import { compare, effectiveElement } from './compare';
import { dignity } from './elements';
import { renderFact, type Fact } from './facts';
import { fallbackProvider } from './fallback';
import { findCard, type ReadingContext } from './interpretation';
import type { Orientation } from './types';
import { correspondences } from '../content/correspondences';
import { rwsDeck } from '../content/decks/rws';
import { en } from '../content/locales/en';
import { ru } from '../content/locales/ru';
import { meanings } from '../content/meanings';
import { celticCross, threeCard } from '../content/spreads';

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
      kind: 'element-conflict',
      elements: ['water', 'air'],
      cardIds: [['major-13-death', 'cups-01-ace'], ['major-00-fool']],
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
    expect(r.facts).toContainEqual({
      kind: 'element-conflict',
      elements: ['air', 'earth'],
      cardIds: [['swords-01-ace'], ['major-21-world', 'pentacles-01-ace']],
    });
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

  describe('a ten-card reading', () => {
    const TEN = [
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
    ];
    const c: ReadingContext = {
      ...ctx([]),
      spread: celticCross,
      placements: TEN.map((cardId, i) => ({
        positionId: celticCross.positions[i]!.id,
        cardId,
        orientation: 'upright' as Orientation,
      })),
    };
    const facts = compare(c).facts;
    const element = (id: string) =>
      effectiveElement(findCard(rwsDeck, id)!, correspondences[id]);
    const pairsOf = (kind: 'element-conflict' | 'element-friendship') =>
      facts
        .flatMap((f) =>
          f.kind === kind
            ? f.cardIds[0].flatMap((a) => f.cardIds[1].map((b) => [a, b]))
            : [],
        )
        .map((p) => p.sort().join(' + '))
        .sort();

    it('loses no pair: the groups cover every conflicting and friendly pair', () => {
      const want = { conflicted: [] as string[], friendly: [] as string[] };
      for (let a = 0; a < TEN.length; a++)
        for (let b = a + 1; b < TEN.length; b++) {
          const x = element(TEN[a]!);
          const y = element(TEN[b]!);
          if (!x || !y) continue;
          const d = dignity(x, y);
          if (d !== 'strengthened')
            want[d].push([TEN[a]!, TEN[b]!].sort().join(' + '));
        }
      expect(want.conflicted.length).toBe(20);
      expect(pairsOf('element-conflict')).toEqual(want.conflicted.sort());
      expect(pairsOf('element-friendship')).toEqual(want.friendly.sort());
    });

    it('names each card at most once per line and keeps lines short', () => {
      const lines = facts.map((f) =>
        renderFact(f, en.provider, (id) => findCard(rwsDeck, id)!.name),
      );
      for (const line of lines) {
        for (const id of TEN) {
          const name = findCard(rwsDeck, id)!.name;
          expect(line.split(name).length - 1).toBeLessThanOrEqual(1);
        }
        expect(line.length).toBeLessThan(160);
      }
      // At most four enemy pairs of elements and two friendly ones exist.
      expect(
        facts.filter((f) => f.kind === 'element-conflict').length,
      ).toBeLessThanOrEqual(4);
    });
  });

  it('flows through the fallback provider as rendered sentences', async () => {
    const out = await fallbackProvider.interpret(
      ctx(['major-00-fool', 'major-13-death', 'cups-01-ace']),
    );
    expect(out.hingeCardId).toBe('major-00-fool');
    expect(out.relations).toContain(
      'Water against air: Death and Ace of Cups conflict with The Fool.',
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
    {
      kind: 'element-conflict',
      elements: ['fire', 'water'],
      cardIds: [['a'], ['b']],
    },
    {
      kind: 'element-friendship',
      elements: ['fire', 'air'],
      cardIds: [['a'], ['b']],
    },
  ];

  it.each([en, ru])('renders every kind of fact in $code', (locale) => {
    for (const fact of all) {
      const text = renderFact(fact, locale.provider, name);
      expect(text.length).toBeGreaterThan(0);
      // Card ids reach the sentence only through the name lookup.
      if ('cardIds' in fact)
        for (const id of fact.cardIds.flat()) expect(text).toContain(`<${id}>`);
      if ('courtId' in fact) expect(text).toContain('<q>');
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

describe('compare: number facts (M6.5)', () => {
  it('two 5s yield a repeated-number fact', () => {
    const r = compare(ctx(['cups-05-five', 'swords-05-five', 'wands-01-ace']));
    expect(r.facts).toContainEqual({
      kind: 'number-repeats',
      number: 5,
      cardIds: ['cups-05-five', 'swords-05-five'],
    });
  });

  it('two courts of one rank repeat too', () => {
    const r = compare(ctx(['cups-13-queen', 'wands-13-queen', 'wands-01-ace']));
    expect(r.facts).toContainEqual({
      kind: 'number-repeats',
      number: 13,
      cardIds: ['cups-13-queen', 'wands-13-queen'],
    });
  });

  it('ties a Major to the pips of the number it reduces to', () => {
    // The Devil is 15, and 1 + 5 = 6: the Lovers and the Sixes are its family.
    const r = compare(ctx(['major-15-devil', 'cups-06-six', 'wands-01-ace']));
    expect(r.facts).toContainEqual({
      kind: 'number-family',
      root: 6,
      cardIds: ['major-15-devil', 'cups-06-six'],
    });
  });

  it('reduces twice where needed and counts Tens with the Aces', () => {
    // The Sun is 19: 1 + 9 = 10, 1 + 0 = 1.
    const r = compare(
      ctx(['major-19-sun', 'major-01-magician', 'pentacles-10-ten']),
    );
    expect(r.facts).toContainEqual({
      kind: 'number-family',
      root: 1,
      cardIds: ['major-19-sun', 'major-01-magician', 'pentacles-10-ten'],
    });
  });

  it('leaves the Fool, courts and pip-only groups out of families', () => {
    expect(
      kinds(['major-00-fool', 'wands-01-ace', 'cups-10-ten'], false),
    ).not.toContain('number-family');
    expect(
      kinds(['major-04-emperor', 'cups-13-queen', 'wands-02-two'], false),
    ).not.toContain('number-family');
  });

  it('a lone number is not a repeat', () => {
    expect(
      kinds(['cups-05-five', 'swords-06-six', 'wands-01-ace']),
    ).not.toContain('number-repeats');
  });

  it('renders both in English and Russian', () => {
    const name = (id: string) => findCard(rwsDeck, id)?.name ?? id;
    const repeat: Fact = {
      kind: 'number-repeats',
      number: 5,
      cardIds: ['cups-05-five', 'swords-05-five'],
    };
    const family: Fact = {
      kind: 'number-family',
      root: 6,
      cardIds: ['major-15-devil', 'cups-06-six'],
    };
    expect(renderFact(repeat, en.provider, name)).toBe(
      'The number five repeats: Five of Cups and Five of Swords.',
    );
    expect(renderFact(family, en.provider, name)).toBe(
      'The Devil and Six of Cups share the number six.',
    );
    for (const f of [repeat, family])
      expect(renderFact(f, ru.provider, name)).toMatch(/[а-я]/);
  });
});
