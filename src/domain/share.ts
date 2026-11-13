import { type SharedReading } from './schema';
import type { MigrateError } from './migrate';
import { migrate } from './migrate';
import type { Reading } from './types';

export { type SharedReading };

export function toShared(
  reading: Reading,
  mode: SharedReading['mode'],
): SharedReading {
  return {
    v: 1,
    mode,
    question: reading.question,
    deckId: reading.deckId,
    spreadId: reading.spreadId,
    placements: [...reading.placements],
    ...(reading.seed !== undefined ? { seed: reading.seed } : {}),
  };
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function encodeShared(shared: SharedReading): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(shared)));
}

/**
 * Decodes a share link and runs it through the migration chain. Shared links
 * are untrusted input, so every failure is an explicit result, never a throw.
 */
export function decodeSharedResult(
  text: string,
): { ok: true; reading: SharedReading } | { ok: false; error: MigrateError } {
  let raw: unknown;
  try {
    raw = JSON.parse(new TextDecoder().decode(fromBase64Url(text)));
  } catch {
    return { ok: false, error: { kind: 'malformed' } };
  }
  return migrate(raw);
}

/** Returns null for anything unreadable; use decodeSharedResult to know why. */
export function decodeShared(text: string): SharedReading | null {
  const r = decodeSharedResult(text);
  return r.ok ? r.reading : null;
}
