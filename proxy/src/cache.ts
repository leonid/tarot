import type { Env, Interpret } from './handler';
import { resolveLocale } from './locales';
import { systemPrompt } from './prompt';
import type { InterpretRequest } from './request';
import { MODEL } from './upstream';

/** How long an interpretation is reused. Short: it holds text from the question. */
export const CACHE_TTL_SECONDS = 24 * 60 * 60;

/** The slice of Cloudflare KV the cache needs; tests pass a Map-backed one. */
export interface CacheStore {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options: { expirationTtl: number },
  ): Promise<void>;
}

/**
 * Same reading, same key: SHA-256 over the question, deck, spread, locale and
 * placements (in position order), plus the model and the fixed prompt, so
 * changing either one starts a fresh cache. Only the hash is used as the key;
 * the question text is not stored as a name or logged.
 */
export async function readingHash(req: InterpretRequest): Promise<string> {
  const placements = [...req.placements]
    .sort((a, b) => a.positionId.localeCompare(b.positionId))
    .map((p) => [p.positionId, p.cardId, p.orientation]);
  const { language } = resolveLocale(req.locale);
  const material = JSON.stringify([
    MODEL,
    systemPrompt(language),
    req.question,
    req.deckId,
    req.spreadId,
    language,
    placements,
  ]);
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(material),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Wraps the upstream call: a hit returns the stored interpretation without a
 * paid call; only successful (200) answers are stored. Without a CACHE binding
 * it passes straight through. A store failure never fails the request.
 */
export function withCache(inner: Interpret): Interpret {
  return async (req: InterpretRequest, env: Env) => {
    const store = env.CACHE;
    if (!store) return inner(req, env);
    const key = `i:${await readingHash(req)}`;
    try {
      const hit = await store.get(key);
      if (hit)
        return new Response(hit, {
          status: 200,
          headers: { 'content-type': 'application/json', 'x-cache': 'hit' },
        });
    } catch {
      // A broken cache is a miss.
    }
    const res = await inner(req, env);
    if (res.status !== 200) return res;
    const body = await res.text();
    try {
      await store.put(key, body, { expirationTtl: CACHE_TTL_SECONDS });
    } catch {
      // Not caching is only a cost, not an error.
    }
    return new Response(body, {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-cache': 'miss' },
    });
  };
}
