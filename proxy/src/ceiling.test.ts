// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { dayKey, withDailyCeiling } from './ceiling';
import type { Env } from './handler';
import type { InterpretRequest } from './request';

const req = {} as InterpretRequest;
const day = (d: string) => () => new Date(`${d}T12:00:00Z`);

function store() {
  const m = new Map<string, string>();
  return {
    m,
    get: async (k: string) => m.get(k) ?? null,
    put: async (k: string, v: string) => void m.set(k, v),
  };
}
const ok = () => vi.fn(async () => new Response('{}', { status: 200 }));

describe('daily ceiling', () => {
  it('lets calls through up to the ceiling and then refuses', async () => {
    const inner = ok();
    const env: Env = { CACHE: store(), DAILY_CEILING: '2' };
    const call = withDailyCeiling(inner, day('2026-11-13'));
    expect((await call(req, env)).status).toBe(200);
    expect((await call(req, env)).status).toBe(200);
    const third = await call(req, env);
    expect(third.status).toBe(503);
    expect(inner).toHaveBeenCalledTimes(2);
  });

  it('starts a new count on a new UTC day', async () => {
    const kv = store();
    const env: Env = { CACHE: kv, DAILY_CEILING: '1' };
    const inner = ok();
    await withDailyCeiling(inner, day('2026-11-13'))(req, env);
    expect(
      (await withDailyCeiling(inner, day('2026-11-13'))(req, env)).status,
    ).toBe(503);
    expect(
      (await withDailyCeiling(inner, day('2026-11-14'))(req, env)).status,
    ).toBe(200);
    expect(kv.m.has(dayKey(new Date('2026-11-14T00:00:00Z')))).toBe(true);
  });

  it('refuses without a counter store unless switched off for local work', async () => {
    const inner = ok();
    const closed = await withDailyCeiling(inner)(req, {});
    expect(closed.status).toBe(503);
    expect(inner).not.toHaveBeenCalled();
    const open = await withDailyCeiling(inner)(req, {
      ALLOW_NO_RATE_LIMIT: 'true',
    });
    expect(open.status).toBe(200);
  });

  it('refuses when the store fails', async () => {
    const inner = ok();
    const broken = {
      get: async () => {
        throw new Error('kv down');
      },
      put: async () => {},
    };
    expect((await withDailyCeiling(inner)(req, { CACHE: broken })).status).toBe(
      503,
    );
    expect(inner).not.toHaveBeenCalled();
  });
});
