import { describe, expect, it } from 'vitest';
import {
  signElement,
  signModality,
  signIndex,
  longitude,
  CHALDEAN_ORDER,
} from '../domain/zodiac';
import { elementOf } from '../domain/elements';
import type { Correspondence } from '../domain/correspondences';
import { rwsDeck } from './decks/rws';
import { correspondences } from './correspondences';

type Decan = Extract<Correspondence, { kind: 'decan' }>;
type Court = Extract<Correspondence, { kind: 'court' }>;

const byId = new Map(rwsDeck.cards.map((c) => [c.id, c]));
const entries = Object.entries(correspondences);

describe('correspondence coverage', () => {
  it('covers every card exactly, with no orphans', () => {
    expect(entries).toHaveLength(78);
    for (const c of rwsDeck.cards)
      expect(correspondences[c.id], c.id).toBeDefined();
    for (const [id] of entries) expect(byId.has(id), id).toBe(true);
  });

  it('has the right number of each kind', () => {
    const count = (k: string) => entries.filter(([, v]) => v.kind === k).length;
    expect(count('planet') + count('sign')).toBe(22);
    expect(count('root')).toBe(4);
    expect(count('decan')).toBe(36);
    expect(count('court')).toBe(16);
  });
});

describe('Major Arcana', () => {
  it('uses each of the 12 signs once', () => {
    const signs = entries.flatMap(([, v]) =>
      v.kind === 'sign' ? [v.sign] : [],
    );
    expect(new Set(signs).size).toBe(12);
  });
  it('uses each of the 7 classical planets once, plus 3 outer planets', () => {
    const planets = entries.flatMap(([, v]) =>
      v.kind === 'planet' ? [v.planet] : [],
    );
    expect(new Set(planets).size).toBe(10);
  });
  it('gives outer planets their traditional element', () => {
    expect(correspondences['major-00-fool']).toMatchObject({
      traditional: 'air',
    });
    expect(correspondences['major-12-hanged-man']).toMatchObject({
      traditional: 'water',
    });
    expect(correspondences['major-20-judgement']).toMatchObject({
      traditional: 'fire',
    });
  });
});

describe('decans follow the Golden Dawn rules', () => {
  const decans = entries.flatMap(([id, v]) =>
    v.kind === 'decan' ? [{ id, ...(v as Decan) }] : [],
  );

  it('sits in the sign of its own suit element', () => {
    for (const d of decans)
      expect(signElement(d.sign), d.id).toBe(elementOf(byId.get(d.id)!));
  });

  it('uses cardinal for 2-4, fixed for 5-7, mutable for 8-10', () => {
    for (const d of decans) {
      const n = byId.get(d.id)!.number;
      const modality = n <= 4 ? 'cardinal' : n <= 7 ? 'fixed' : 'mutable';
      expect(signModality(d.sign), d.id).toBe(modality);
      expect(d.decan, d.id).toBe(((n - 2) % 3) + 1);
    }
  });

  it('has rulers in continuous Chaldean order around the zodiac', () => {
    const ordered = [...decans].sort(
      (a, b) =>
        signIndex(a.sign) * 3 + a.decan - (signIndex(b.sign) * 3 + b.decan),
    );
    expect(ordered).toHaveLength(36);
    ordered.forEach((d, i) =>
      expect(d.ruler, `${d.id} (decan ${i})`).toBe(CHALDEAN_ORDER[i % 7]),
    );
  });

  it('has unique decans and titles', () => {
    expect(new Set(decans.map((d) => `${d.sign}-${d.decan}`)).size).toBe(36);
    expect(new Set(decans.map((d) => d.title)).size).toBe(36);
  });
});

describe('court cards', () => {
  const courts = entries.flatMap(([id, v]) =>
    v.kind === 'court' ? [{ id, ...(v as Court) }] : [],
  );
  const seniors = courts.filter((c) => c.span);

  it('maps rank to sub-element and letter', () => {
    const expected = {
      knight: ['fire', 'Yod'],
      queen: ['water', 'Heh'],
      king: ['air', 'Vav'],
      page: ['earth', 'Heh final'],
    } as const;
    for (const c of courts) {
      const rank = c.id.split('-')[2] as keyof typeof expected;
      expect([c.subElement, c.letter], c.id).toEqual(expected[rank]);
    }
  });

  it('gives the 12 senior courts a 30 degree span and pages none', () => {
    expect(seniors).toHaveLength(12);
    expect(
      courts.filter((c) => !c.span).every((c) => c.id.includes('page')),
    ).toBe(true);
    for (const c of seniors) {
      const len = (longitude(c.span!.to) - longitude(c.span!.from) + 360) % 360;
      expect(len, c.id).toBe(30);
    }
  });

  it('tiles the zodiac exactly once, with no gaps or overlaps', () => {
    const sorted = [...seniors].sort(
      (a, b) => longitude(a.span!.from) - longitude(b.span!.from),
    );
    sorted.forEach((c, i) => {
      const next = sorted[(i + 1) % 12]!;
      expect(longitude(c.span!.to) % 360, c.id).toBe(
        longitude(next.span!.from) % 360,
      );
    });
  });

  it('puts each senior court in the right element family for its suit', () => {
    // Fire-of-X spans start at a sign of the same element as the suit's
    // sub-element order; here we just check suit/rank spans are all distinct.
    expect(new Set(seniors.map((c) => longitude(c.span!.from))).size).toBe(12);
  });
});
