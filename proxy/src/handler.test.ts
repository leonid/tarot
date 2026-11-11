// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { handle, type Env } from './handler';
import type { InterpretRequest } from './request';
import { MAX_BODY_BYTES } from './request';

const ORIGIN = 'https://owner.github.io';
const env: Env = { ALLOWED_ORIGINS: `${ORIGIN}, http://localhost:5173` };

const good = {
  v: 1,
  question: 'What now?',
  deckId: 'rws-78',
  spreadId: 'single',
  placements: [
    { positionId: 'card', cardId: 'major-00-fool', orientation: 'upright' },
  ],
};

const post = (body: unknown, init: RequestInit = {}) =>
  new Request('https://proxy.test/', {
    method: 'POST',
    headers: { origin: ORIGIN, 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...init,
  });

/** Runs a request and returns the status plus whether the upstream was reached. */
async function run(req: Request, e: Env = env) {
  const upstream = vi.fn(
    async (r: InterpretRequest) => new Response(JSON.stringify({ ok: !!r })),
  );
  const res = await handle(req, e, upstream);
  return { res, reached: upstream.mock.calls.length > 0, upstream };
}

describe('proxy handler', () => {
  it('passes a valid reading to the upstream once', async () => {
    const { res, upstream } = await run(post(good));
    expect(res.status).toBe(200);
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(upstream.mock.calls[0]![0]).toMatchObject({ deckId: 'rws-78' });
    expect(res.headers.get('access-control-allow-origin')).toBe(ORIGIN);
  });

  it('answers 501 without an upstream wired in', async () => {
    const res = await handle(post(good), env);
    expect(res.status).toBe(501);
  });

  describe('rejects before the upstream', () => {
    const cases: [string, Request, number][] = [
      [
        'a missing origin',
        post(good, { headers: { 'content-type': 'application/json' } }),
        403,
      ],
      [
        'a foreign origin',
        post(good, {
          headers: {
            origin: 'https://evil.test',
            'content-type': 'application/json',
          },
        }),
        403,
      ],
      [
        'GET',
        new Request('https://proxy.test/', {
          headers: { origin: ORIGIN },
        }),
        405,
      ],
      [
        'a wrong content type',
        post(good, {
          headers: { origin: ORIGIN, 'content-type': 'text/plain' },
        }),
        415,
      ],
      [
        'an oversized body',
        post({ ...good, question: 'x'.repeat(MAX_BODY_BYTES) }),
        413,
      ],
      ['invalid JSON', post('{nope'), 400],
      ['a non-object body', post('[]'), 422],
      ['an extra field', post({ ...good, apiKey: 'x' }), 422],
      ['a wrong version', post({ ...good, v: 2 }), 422],
      [
        'a question over 500 characters',
        post({ ...good, question: 'x'.repeat(501) }),
        422,
      ],
      ['an unknown deck', post({ ...good, deckId: 'nope' }), 422],
      ['an unknown spread', post({ ...good, spreadId: 'nope' }), 422],
      [
        'an unknown card',
        post({
          ...good,
          placements: [
            { positionId: 'card', cardId: 'nope', orientation: 'upright' },
          ],
        }),
        422,
      ],
      ['no placements', post({ ...good, placements: [] }), 422],
      ['an incomplete reading', post({ ...good, spreadId: 'three-card' }), 422],
    ];
    it.each(cases)('%s', async (_n, req, status) => {
      const { res, reached } = await run(req);
      expect(res.status).toBe(status);
      expect(reached).toBe(false);
    });

    it('a body that lies about content-length', async () => {
      const big = JSON.stringify({
        ...good,
        question: 'x'.repeat(MAX_BODY_BYTES),
      });
      const { res, reached } = await run(
        post(big, {
          headers: {
            origin: ORIGIN,
            'content-type': 'application/json',
            'content-length': '10',
          },
        }),
      );
      expect(res.status).toBe(413);
      expect(reached).toBe(false);
    });

    it('everything when no origin is configured', async () => {
      const { res, reached } = await run(post(good), {});
      expect(res.status).toBe(403);
      expect(reached).toBe(false);
    });
  });

  it('answers a preflight from an allowed origin only', async () => {
    const ok = await handle(
      new Request('https://proxy.test/', {
        method: 'OPTIONS',
        headers: { origin: ORIGIN },
      }),
      env,
    );
    expect(ok.status).toBe(204);
    expect(ok.headers.get('access-control-allow-methods')).toBe('POST');
    const bad = await handle(
      new Request('https://proxy.test/', {
        method: 'OPTIONS',
        headers: { origin: 'https://evil.test' },
      }),
      env,
    );
    expect(bad.status).toBe(403);
    expect(bad.headers.get('access-control-allow-origin')).toBeNull();
  });
});
