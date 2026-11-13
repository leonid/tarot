// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import {
  withCache,
  readingHash,
  CACHE_TTL_SECONDS,
  type CacheStore,
} from './cache';
import { handle, type Env } from './handler';
import type { InterpretRequest } from './request';

const ORIGIN = 'https://owner.github.io';
const reading = {
  v: 1,
  question: 'What now?',
  deckId: 'rws-78',
  spreadId: 'three-card',
  placements: [
    { positionId: 'past', cardId: 'major-00-fool', orientation: 'upright' },
    {
      positionId: 'present',
      cardId: 'major-01-magician',
      orientation: 'reversed',
    },
    {
      positionId: 'future',
      cardId: 'major-02-high-priestess',
      orientation: 'upright',
    },
  ],
};
const post = (body: unknown = reading) =>
  new Request('https://proxy.test/', {
    method: 'POST',
    headers: {
      origin: ORIGIN,
      'content-type': 'application/json',
      'cf-connecting-ip': '1.2.3.4',
    },
    body: JSON.stringify(body),
  });

function mapStore() {
  const m = new Map<string, string>();
  const put = vi.fn<CacheStore['put']>(async (k, v) => {
    m.set(k, v);
  });
  const store: CacheStore = { get: async (k) => m.get(k) ?? null, put };
  return { m, put, store };
}
const answer = () =>
  vi.fn(
    async () =>
      new Response(JSON.stringify({ summary: 'fresh' }), { status: 200 }),
  );

describe('reading cache', () => {
  it('returns the cached result for the same reading, without a second upstream call', async () => {
    const { store, put } = mapStore();
    const upstream = answer();
    const env: Env = {
      ALLOWED_ORIGINS: ORIGIN,
      ALLOW_NO_RATE_LIMIT: 'true',
      CACHE: store,
    };
    const first = await handle(post(), env, withCache(upstream));
    expect(first.headers.get('x-cache')).toBe('miss');
    const second = await handle(post(), env, withCache(upstream));
    expect(second.headers.get('x-cache')).toBe('hit');
    expect(await second.json()).toEqual({ summary: 'fresh' });
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(put.mock.calls[0]![2]).toEqual({ expirationTtl: CACHE_TTL_SECONDS });
  });

  it('keys on the question, the cards and their orientation', async () => {
    const { store } = mapStore();
    const upstream = answer();
    const env: Env = {
      ALLOWED_ORIGINS: ORIGIN,
      ALLOW_NO_RATE_LIMIT: 'true',
      CACHE: store,
    };
    const run = (b: unknown) => handle(post(b), env, withCache(upstream));
    await run(reading);
    await run({ ...reading, question: 'Another?' });
    await run({
      ...reading,
      placements: reading.placements.map((p, i) =>
        i === 0 ? { ...p, orientation: 'reversed' } : p,
      ),
    });
    expect(upstream).toHaveBeenCalledTimes(3);
  });

  it('hashes placements in position order and never exposes the question', async () => {
    const a = reading as unknown as InterpretRequest;
    const b = {
      ...a,
      placements: [...a.placements].reverse(),
    } as InterpretRequest;
    expect(await readingHash(a)).toBe(await readingHash(b));
    expect(await readingHash(a)).toMatch(/^[0-9a-f]{64}$/);
    expect(await readingHash(a)).not.toContain('What');
  });

  it('keys on the resolved language: unknown locales share English, Russian differs', async () => {
    const a = reading as unknown as InterpretRequest;
    const h = (locale?: string) =>
      readingHash(locale ? ({ ...a, locale } as InterpretRequest) : a);
    expect(await h('xx')).toBe(await h());
    expect(await h('en-XA')).toBe(await h('en'));
    expect(await h('ru-RU')).toBe(await h('ru'));
    expect(await h('ru')).not.toBe(await h());
  });

  it('does not cache errors', async () => {
    const { store, m } = mapStore();
    const upstream = vi.fn(
      async () => new Response('{"error":"bad-reply"}', { status: 502 }),
    );
    const env: Env = {
      ALLOWED_ORIGINS: ORIGIN,
      ALLOW_NO_RATE_LIMIT: 'true',
      CACHE: store,
    };
    await handle(post(), env, withCache(upstream));
    await handle(post(), env, withCache(upstream));
    expect(m.size).toBe(0);
    expect(upstream).toHaveBeenCalledTimes(2);
  });

  it('survives a broken store, and works with none', async () => {
    const broken: CacheStore = {
      get: async () => {
        throw new Error('kv down');
      },
      put: async () => {
        throw new Error('kv down');
      },
    };
    const upstream = answer();
    const r1 = await handle(
      post(),
      { ALLOWED_ORIGINS: ORIGIN, ALLOW_NO_RATE_LIMIT: 'true', CACHE: broken },
      withCache(upstream),
    );
    const r2 = await handle(
      post(),
      { ALLOWED_ORIGINS: ORIGIN, ALLOW_NO_RATE_LIMIT: 'true' },
      withCache(upstream),
    );
    expect([r1.status, r2.status]).toEqual([200, 200]);
  });
});

describe('rate limit shield', () => {
  const limiter = (successes: boolean[]) => {
    const limit = vi.fn<(o: { key: string }) => Promise<{ success: boolean }>>(
      async () => ({ success: successes.shift() ?? false }),
    );
    return { limit };
  };

  it('answers 429 with retry-after and never reaches upstream when over the limit', async () => {
    const rl = limiter([true, false]);
    const upstream = answer();
    const env: Env = { ALLOWED_ORIGINS: ORIGIN, RATE_LIMITER: rl };
    expect((await handle(post(), env, upstream)).status).toBe(200);
    const over = await handle(post(), env, upstream);
    expect(over.status).toBe(429);
    expect(over.headers.get('retry-after')).toBe('60');
    expect(over.headers.get('access-control-allow-origin')).toBe(ORIGIN);
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(rl.limit.mock.calls[0]![0]).toEqual({ key: '1.2.3.4' });
  });

  it('does not count requests that fail validation', async () => {
    const rl = limiter([false]);
    const res = await handle(
      post({ nope: 1 }),
      { ALLOWED_ORIGINS: ORIGIN, RATE_LIMITER: rl },
      answer(),
    );
    expect(res.status).toBe(422);
    expect(rl.limit).not.toHaveBeenCalled();
  });

  it('refuses, rather than lets through, if the limiter itself fails (R14)', async () => {
    const rl = {
      limit: async () => {
        throw new Error('down');
      },
    };
    const res = await handle(
      post(),
      { ALLOWED_ORIGINS: ORIGIN, RATE_LIMITER: rl },
      answer(),
    );
    expect(res.status).toBe(503);
  });
});
