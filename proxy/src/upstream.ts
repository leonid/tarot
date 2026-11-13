import { interpretationSchema } from '../../src/domain/interpretationSchema';
import type { Env, Interpret } from './handler';
import { outputSchema } from './outputSchema';
import { buildPrompt } from './prompt';
import type { InterpretRequest } from './request';

/** Held on the server only; changing it needs no client release. */
export const MODEL = 'claude-haiku-5-5';
export const MAX_TOKENS = 2000;
const URL = 'https://api.anthropic.com/v1/messages';
const TIMEOUT_MS = 25_000;

/** Error codes the client can branch on; all of them mean "use the fallback". */
export type ErrorCode =
  | 'not-configured'
  | 'refused'
  | 'truncated'
  | 'rate-limited'
  | 'upstream-error'
  | 'bad-reply';

function fail(status: number, code: ErrorCode, headers: HeadersInit = {}) {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

/** The reply must cover exactly the reading's cards and positions, once each. */
export function replyMatches(
  req: InterpretRequest,
  reply: { cards: { positionId: string; cardId: string }[] },
): boolean {
  if (reply.cards.length !== req.placements.length) return false;
  const want = new Set(
    req.placements.map((p) => `${p.positionId}|${p.cardId}`),
  );
  const got = new Set(reply.cards.map((c) => `${c.positionId}|${c.cardId}`));
  return got.size === want.size && [...want].every((k) => got.has(k));
}

interface Block {
  type: string;
  text?: string;
}

/**
 * Calls the Messages API and turns every outcome into a small, fixed response:
 * 200 with the interpretation, or an error code. Upstream error text is never
 * passed on. `fetchFn` is injectable so tests never reach the network.
 */
export function makeInterpret(fetchFn: typeof fetch = fetch): Interpret {
  return async (req: InterpretRequest, env: Env) => {
    if (!env.ANTHROPIC_API_KEY) return fail(500, 'not-configured');
    const { system, user } = buildPrompt(req);

    let res: Response;
    try {
      res = await fetchFn(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
          messages: [{ role: 'user', content: user }],
          output_config: {
            format: { type: 'json_schema', schema: outputSchema },
          },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      return fail(502, 'upstream-error');
    }

    if (res.status === 429) {
      const retry = res.headers.get('retry-after');
      return fail(429, 'rate-limited', retry ? { 'retry-after': retry } : {});
    }
    // 400 means our own request was wrong and 5xx/529 mean Anthropic is down:
    // neither is the caller's doing, and neither is worth echoing.
    if (!res.ok) return fail(502, 'upstream-error');

    let body: { stop_reason?: string; content?: Block[] };
    try {
      body = (await res.json()) as typeof body;
    } catch {
      return fail(502, 'bad-reply');
    }
    if (body.stop_reason === 'refusal') return fail(422, 'refused');
    if (body.stop_reason === 'max_tokens') return fail(502, 'truncated');
    if (body.stop_reason !== 'end_turn') return fail(502, 'bad-reply');

    const text = body.content?.find((b) => b.type === 'text')?.text;
    if (!text) return fail(502, 'bad-reply');
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return fail(502, 'bad-reply');
    }
    const parsed = interpretationSchema.safeParse(data);
    if (!parsed.success || !replyMatches(req, parsed.data))
      return fail(502, 'bad-reply');
    const known = new Set(req.placements.map((p) => p.cardId));
    const reply = parsed.data;
    if (reply.hingeCardId && !known.has(reply.hingeCardId))
      delete reply.hingeCardId;

    return new Response(JSON.stringify(reply), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
}
