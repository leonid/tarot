import type { Env, Interpret } from './handler';
import type { InterpretRequest } from './request';

export const DEFAULT_DAILY_CEILING = 1000;

/** The UTC day a call is counted on: "2026-11-13". */
export const dayKey = (now: Date) => `n:${now.toISOString().slice(0, 10)}`;

/**
 * A ceiling on paid upstream calls per UTC day, kept in the same KV namespace
 * as the cache and placed inside the cache, so only misses (real spend) are
 * counted. KV has no atomic increment, so concurrent calls can overshoot a
 * little: like the rate limiter it is a shield, and the spend cap in the
 * Anthropic workspace is the hard bound. When it cannot count (no KV, or KV
 * failing) it refuses, unless ALLOW_NO_RATE_LIMIT is "true" for local work.
 */
export function withDailyCeiling(
  inner: Interpret,
  now: () => Date = () => new Date(),
): Interpret {
  return async (req: InterpretRequest, env: Env) => {
    const open = env.ALLOW_NO_RATE_LIMIT === 'true';
    const refuse = () =>
      new Response(JSON.stringify({ error: 'daily-limit' }), {
        status: 503,
        headers: { 'content-type': 'application/json', 'retry-after': '3600' },
      });
    const store = env.CACHE;
    if (!store) return open ? inner(req, env) : refuse();

    const limit = Number(env.DAILY_CEILING ?? DEFAULT_DAILY_CEILING);
    const key = dayKey(now());
    let used = 0;
    try {
      used = Number((await store.get(key)) ?? 0) || 0;
    } catch {
      return open ? inner(req, env) : refuse();
    }
    if (used >= limit) return refuse();

    try {
      // Two days is enough for the key to outlive its day.
      await store.put(key, String(used + 1), { expirationTtl: 2 * 86400 });
    } catch {
      if (!open) return refuse();
    }
    return inner(req, env);
  };
}
