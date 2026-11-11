import { describe, expect, it, vi } from 'vitest';
import { getDeck } from '../content/decks';
import { meanings } from '../content/meanings';
import { en } from '../content/locales/en';
import { getSpread } from '../content/spreads';
import { deal } from './deal';
import { fallbackProvider } from './fallback';
import type { ReadingContext } from './interpretation';
import { llmProvider } from './llmProvider';

const deck = getDeck('rws-78')!;
const spread = getSpread('three-card')!;
const r = deal({ question: 'q', deck, spread, seed: 3, allowReversals: true });
const ctx: ReadingContext = {
  question: 'q',
  deck,
  spread,
  placements: r.placements,
  meanings,
  strings: en.provider,
};
const good = {
  cards: ctx.placements.map((p) => ({
    positionId: p.positionId,
    cardId: p.cardId,
    note: 'llm note',
  })),
  relations: ['rel'],
  summary: 'llm summary',
  advice: 'llm advice',
};
const reply = (body: unknown, status = 200) =>
  vi.fn<typeof fetch>(
    async () => new Response(JSON.stringify(body), { status }),
  );
const make = (f: ReturnType<typeof reply>) =>
  llmProvider({
    url: 'https://proxy.test/interpret',
    fetch: f as typeof fetch,
  });

describe('llmProvider', () => {
  it('posts the reading ids and question, and parses a valid reply', async () => {
    const f = reply(good);
    const out = await make(f).interpret(ctx);
    expect(out).toEqual({ ...good, source: 'llm' });
    const [url, init] = f.mock.calls[0]!;
    expect(url).toBe('https://proxy.test/interpret');
    expect(JSON.parse(init!.body as string)).toEqual({
      v: 1,
      question: 'q',
      deckId: 'rws-78',
      spreadId: 'three-card',
      placements: ctx.placements,
    });
  });

  it('sends the reading language when the context has one', async () => {
    const f = reply(good);
    await make(f).interpret({ ...ctx, locale: 'ru' });
    expect(JSON.parse(f.mock.calls[0]![1]!.body as string).locale).toBe('ru');
    const g = reply(good);
    await make(g).interpret(ctx);
    expect(JSON.parse(g.mock.calls[0]![1]!.body as string)).not.toHaveProperty(
      'locale',
    );
  });

  it('sends no key and no card text', async () => {
    const f = reply(good);
    await make(f).interpret(ctx);
    const init = f.mock.calls[0]![1]!;
    expect(JSON.stringify(init)).not.toMatch(/api-key|sk-/i);
  });

  it('drops a hinge that is not in the reading', async () => {
    const out = await make(reply({ ...good, hingeCardId: 'nope' })).interpret(
      ctx,
    );
    expect(out.hingeCardId).toBeUndefined();
    expect((out as unknown as { source: string }).source).toBe('llm');
  });

  it.each([
    ['429', reply({ error: 'rate-limited' }, 429)],
    ['422 refused', reply({ error: 'refused' }, 422)],
    ['502', reply({ error: 'upstream-error' }, 502)],
    ['schema mismatch', reply({ cards: 1 })],
    [
      'an invented card',
      reply({
        ...good,
        cards: [{ ...good.cards[0], cardId: 'x' }, ...good.cards.slice(1)],
      }),
    ],
    ['a missing card', reply({ ...good, cards: good.cards.slice(1) })],
    ['not JSON', vi.fn(async () => new Response('<html>', { status: 200 }))],
    [
      'a network error',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      }),
    ],
  ])('falls back on %s', async (_n, f) => {
    const out = await make(f as ReturnType<typeof reply>).interpret(ctx);
    const expected = await fallbackProvider.interpret(ctx);
    expect(out).toEqual({ ...expected, source: 'fallback' });
  });
});
