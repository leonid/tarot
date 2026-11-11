import type { CacheStore } from './cache';
import { MAX_BODY_BYTES, parseRequest, type InterpretRequest } from './request';

export interface Env {
  /** Comma-separated origins allowed to call the proxy, e.g. "https://owner.github.io". */
  ALLOWED_ORIGINS?: string;
  /** Secret. Set with `wrangler secret put`; never in the repo or the client. */
  ANTHROPIC_API_KEY?: string;
  /** Cloudflare KV namespace for the reading cache (optional). */
  CACHE?: CacheStore;
  /**
   * Cloudflare rate-limit binding (optional). Counts are per Cloudflare
   * location and eventually consistent, so this is a soft shield against
   * bursts, not a hard quota: the spend cap in the Anthropic workspace is the
   * real limit.
   */
  RATE_LIMITER?: { limit(o: { key: string }): Promise<{ success: boolean }> };
}

/** The upstream call (M4.6). Only ever reached with a validated request. */
export type Interpret = (
  request: InterpretRequest,
  env: Env,
) => Promise<Response>;

const notImplemented: Interpret = async () =>
  json(501, { error: 'Interpretation is not implemented yet.' });

function json(status: number, body: unknown, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

/** Reads at most MAX_BODY_BYTES; returns null when the body is larger. */
async function readCapped(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get('content-length'));
  if (declared > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    all.set(c, at);
    at += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

/**
 * One POST route. Order matters: origin, method, content type, size, JSON,
 * schema. Every rejection happens before `interpret` (the paid upstream call).
 */
export async function handle(
  request: Request,
  env: Env,
  interpret: Interpret = notImplemented,
): Promise<Response> {
  const origin = request.headers.get('origin');
  const allowed = allowedOrigins(env);
  const originOk = origin !== null && allowed.includes(origin);
  const cors: Record<string, string> = originOk
    ? { 'access-control-allow-origin': origin, vary: 'origin' }
    : { vary: 'origin' };

  if (!originOk) return json(403, { error: 'Origin not allowed.' }, cors);

  if (request.method === 'OPTIONS')
    return new Response(null, {
      status: 204,
      headers: {
        ...cors,
        'access-control-allow-methods': 'POST',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
      },
    });

  if (request.method !== 'POST')
    return json(405, { error: 'Use POST.' }, { ...cors, allow: 'POST' });

  if (
    !(request.headers.get('content-type') ?? '').startsWith('application/json')
  )
    return json(415, { error: 'Send application/json.' }, cors);

  const text = await readCapped(request);
  if (text === null) return json(413, { error: 'Request too large.' }, cors);

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return json(400, { error: 'Body is not valid JSON.' }, cors);
  }

  const parsed = parseRequest(raw);
  if (!parsed.ok) return json(422, { error: parsed.error }, cors);

  if (env.RATE_LIMITER) {
    const key = request.headers.get('cf-connecting-ip') ?? origin;
    let ok = true;
    try {
      ok = (await env.RATE_LIMITER.limit({ key })).success;
    } catch {
      // If the limiter itself fails, let the request through: the spend cap
      // still bounds cost, and a broken shield should not take the app down.
    }
    if (!ok)
      return json(
        429,
        { error: 'rate-limited' },
        { ...cors, 'retry-after': '60' },
      );
  }

  const res = await interpret(parsed.request, env);
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
  return out;
}
