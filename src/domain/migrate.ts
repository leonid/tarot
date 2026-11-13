import { parseSharedReading, type SharedReading } from './schema';

/** The payload version this build writes and understands natively. */
export const CURRENT_VERSION = 1;

/**
 * One step per old version: `steps[n]` turns a version-n payload into a
 * version-(n+1) payload. Empty today (v1 is current). To change the format,
 * bump CURRENT_VERSION and the schema, and add `steps[oldVersion]` here; add
 * a fixture of the old shape under `fixtures/`.
 */
export type Migration = (
  payload: Record<string, unknown>,
) => Record<string, unknown>;
export const steps: Record<number, Migration> = {};

export type MigrateError =
  /** Not an object, no integer `v`, or the fields do not fit the schema. */
  | { kind: 'malformed' }
  /** Written by a newer build than this one; we cannot read it safely. */
  | { kind: 'future-version'; version: number }
  /** An old version with no migration step (a gap in the chain). */
  | { kind: 'no-migration'; version: number };

export type MigrateResult =
  | { ok: true; reading: SharedReading; migratedFrom?: number }
  | { ok: false; error: MigrateError };

const fail = (error: MigrateError): MigrateResult => ({ ok: false, error });

/** Brings any stored or shared payload up to the current version and validates it. */
export function migrate(
  raw: unknown,
  chain: Record<number, Migration> = steps,
  current: number = CURRENT_VERSION,
): MigrateResult {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw))
    return fail({ kind: 'malformed' });
  let payload = raw as Record<string, unknown>;
  const from = payload.v;
  if (typeof from !== 'number' || !Number.isInteger(from) || from < 1)
    return fail({ kind: 'malformed' });
  if (from > current) return fail({ kind: 'future-version', version: from });

  for (let v = from; v < current; v++) {
    const step = chain[v];
    if (!step) return fail({ kind: 'no-migration', version: v });
    payload = { ...step(payload), v: v + 1 };
  }
  const reading = parseSharedReading(payload);
  if (!reading) return fail({ kind: 'malformed' });
  return {
    ok: true,
    reading,
    ...(from < current ? { migratedFrom: from } : {}),
  };
}
