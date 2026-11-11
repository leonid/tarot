// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { getDeck } from '../../src/content/decks';
import { getSpread } from '../../src/content/spreads';
import { deal } from '../../src/domain/deal';
import { parseRequest, type InterpretRequest } from './request';
import { makeInterpret, MAX_TOKENS, MODEL } from './upstream';

const reading = deal({
  question: 'q',
  deck: getDeck('rws-78')!,
  spread: getSpread('three-card')!,
  seed: 5,
  allowReversals: true,
});
const parsed = parseRequest({
  v: 1,
  question: 'q',
  deckId: 'rws-78',
  spreadId: 'three-card',
  placements: reading.placements,
});
if (!parsed.ok) throw new Error(parsed.error);
const req: InterpretRequest = parsed.request;
const env = { ANTHROPIC_API_KEY: 'test-key' };

const good = {
  cards: req.placements.map((p) => ({
    positionId: p.positionId,
    cardId: p.cardId,
    note: 'n',
  })),
  relations: ['r'],
  summary: 's',
  advice: 'a',
};
const message = (stop_reason: string, payload: unknown = good) => ({
  stop_reason,
  content: [{ type: 'text', text: JSON.stringify(payload) }],
});
const ok = (body: unknown) => async () =>
  new Response(JSON.stringify(body), { status: 200 });
const status =
  (code: number, headers: HeadersInit = {}) =>
  async () =>
    new Response('{"error":{"message":"secret upstream detail"}}', {
      status: code,
      headers,
    });

async function run(f: typeof fetch, e = env) {
  const res = await makeInterpret(f)(req, e);
  return { res, body: (await res.json()) as Record<string, unknown> };
}

describe('upstream call', () => {
  it('sends the key, model, token cap and output schema', async () => {
    const f = vi.fn(ok(message('end_turn')));
    await run(f as unknown as typeof fetch);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect((init.headers as Record<string, string>)['x-api-key']).toBe(
      'test-key',
    );
    const sent = JSON.parse(init.body as string);
    expect(sent.model).toBe(MODEL);
    expect(sent.max_tokens).toBe(MAX_TOKENS);
    expect(sent.output_config.format.type).toBe('json_schema');
    expect(sent.system).toMatch(/untrusted/);
    expect(sent.messages[0].content).toContain('<untrusted_question>');
  });

  it('end_turn: returns the validated interpretation', async () => {
    const { res, body } = await run(ok(message('end_turn')));
    expect(res.status).toBe(200);
    expect(body).toEqual(good);
  });

  it('drops a hinge that is not in the reading', async () => {
    const { body } = await run(
      ok(message('end_turn', { ...good, hingeCardId: 'nope' })),
    );
    expect(body.hingeCardId).toBeUndefined();
  });

  it('refusal: 422 refused', async () => {
    const { res, body } = await run(ok(message('refusal')));
    expect([res.status, body.error]).toEqual([422, 'refused']);
  });

  it('max_tokens: 502 truncated, partial text not used', async () => {
    const { res, body } = await run(ok(message('max_tokens')));
    expect([res.status, body.error]).toEqual([502, 'truncated']);
  });

  it('upstream 400: 502 and no upstream detail', async () => {
    const { res, body } = await run(status(400));
    expect([res.status, body.error]).toEqual([502, 'upstream-error']);
    expect(JSON.stringify(body)).not.toContain('secret');
  });

  it('429 with retry-after passes the header on', async () => {
    const { res, body } = await run(status(429, { 'retry-after': '17' }));
    expect([res.status, body.error]).toEqual([429, 'rate-limited']);
    expect(res.headers.get('retry-after')).toBe('17');
  });

  it('429 without retry-after sets none', async () => {
    const { res } = await run(status(429));
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBeNull();
  });

  it('5xx and 529: 502', async () => {
    for (const code of [500, 503, 529])
      expect((await run(status(code))).res.status).toBe(502);
  });

  it('network error and timeout: 502', async () => {
    const down = async () => {
      throw new TypeError('fetch failed');
    };
    expect((await run(down)).body.error).toBe('upstream-error');
  });

  it.each([
    [
      'not JSON text',
      { stop_reason: 'end_turn', content: [{ type: 'text', text: 'hi' }] },
    ],
    ['no text block', { stop_reason: 'end_turn', content: [] }],
    ['unknown stop reason', message('pause_turn')],
    ['schema mismatch', message('end_turn', { cards: 1 })],
    [
      'an invented card',
      message('end_turn', {
        ...good,
        cards: good.cards.map((c, i) =>
          i === 0 ? { ...c, cardId: 'major-99-invented' } : c,
        ),
      }),
    ],
    [
      'a missing card',
      message('end_turn', { ...good, cards: good.cards.slice(1) }),
    ],
    [
      'a repeated card',
      message('end_turn', {
        ...good,
        cards: [good.cards[0], good.cards[0], good.cards[2]],
      }),
    ],
  ])('bad reply (%s): 502 bad-reply', async (_n, body) => {
    const r = await run(ok(body));
    expect([r.res.status, r.body.error]).toEqual([502, 'bad-reply']);
  });

  it('answers 500 without calling upstream when no key is set', async () => {
    const f = vi.fn(ok(message('end_turn')));
    const r = await run(f as unknown as typeof fetch, {} as never);
    expect([r.res.status, r.body.error]).toEqual([500, 'not-configured']);
    expect(f).not.toHaveBeenCalled();
  });
});
