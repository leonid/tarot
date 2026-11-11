import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { makeInterpret, MODEL } from '../src/upstream';
import { checkReply } from './check';
import { fixtures } from './fixtures';

/** ANTHROPIC_API_KEY from the environment, else from proxy/.dev.vars. */
function apiKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    const m = /^ANTHROPIC_API_KEY=(.+)$/m.exec(
      readFileSync('proxy/.dev.vars', 'utf8'),
    );
    if (m?.[1]) return m[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    // No .dev.vars; fall through to the message below.
  }
  throw new Error(
    'Set ANTHROPIC_API_KEY (or put it in proxy/.dev.vars). Use the key from the capped workspace.',
  );
}

describe(`evaluation against ${MODEL}`, () => {
  const env = { ANTHROPIC_API_KEY: apiKey() };
  const interpret = makeInterpret();

  it.each(fixtures.map((f) => [f.name, f] as const))('%s', async (_n, f) => {
    const res = await interpret(f.request, env);
    const body = await res.json();
    expect(res.status, `proxy answered ${JSON.stringify(body)}`).toBe(200);
    expect(checkReply(f.request, body, f.forbidden)).toEqual([]);
    console.log(
      `${f.name}: ${f.request.placements.length} cards, summary ${(body as { summary: string }).summary.length} chars`,
    );
  });
});
