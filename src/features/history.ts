import { z } from 'zod';
import { migrate } from '../domain/migrate';
import type { SharedReading } from '../domain/share';

const KEY = 'tarot.history.v1';
const MAX = 50;

const envelopeSchema = z.object({
  id: z.string(),
  savedAt: z.number(),
  reading: z.unknown(),
});
export interface HistoryEntry {
  id: string;
  savedAt: number;
  reading: SharedReading;
}

/**
 * Each entry is checked and migrated on its own, so one corrupt or
 * unreadable entry (including one from a newer version) is skipped while the
 * rest still load.
 */
export function loadHistory(): HistoryEntry[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((item): HistoryEntry[] => {
      const env = envelopeSchema.safeParse(item);
      if (!env.success) return [];
      const m = migrate(env.data.reading);
      return m.ok
        ? [{ id: env.data.id, savedAt: env.data.savedAt, reading: m.reading }]
        : [];
    });
  } catch {
    return [];
  }
}

/** Why the journal could not be written: storage is full, or not allowed. */
export type StorageProblem = 'full' | 'blocked';

function problemOf(error: unknown): StorageProblem {
  const name = error instanceof DOMException ? error.name : '';
  return name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ? 'full'
    : 'blocked';
}

function write(entries: HistoryEntry[]): StorageProblem | undefined {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
    return undefined;
  } catch (error) {
    return problemOf(error);
  }
}

/** The same reading: same cards in the same places, question and mode. */
const sameReading = (a: SharedReading, b: SharedReading): boolean =>
  a.mode === b.mode &&
  a.question === b.question &&
  a.deckId === b.deckId &&
  a.spreadId === b.spreadId &&
  a.seed === b.seed &&
  JSON.stringify(a.placements) === JSON.stringify(b.placements);

/** Whether this reading is already in the journal, unchanged. */
export const isSaved = (reading: SharedReading): boolean =>
  loadHistory().some((e) => sameReading(e.reading, reading));

export interface HistoryChange {
  entries: HistoryEntry[];
  /** Set when the change could not be stored; `entries` is then unchanged. */
  problem?: StorageProblem;
}

export type SaveResult = HistoryChange & { status: 'saved' | 'already' };

/** Saves a reading; one already in the journal, unchanged, is not added again. */
export function saveReading(reading: SharedReading): SaveResult {
  const current = loadHistory();
  if (current.some((e) => sameReading(e.reading, reading)))
    return { status: 'already', entries: current };
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    savedAt: Date.now(),
    reading,
  };
  const next = [entry, ...current].slice(0, MAX);
  const problem = write(next);
  return problem
    ? { status: 'saved', entries: current, problem }
    : { status: 'saved', entries: next };
}

export function deleteReading(id: string): HistoryChange {
  const current = loadHistory();
  const next = current.filter((e) => e.id !== id);
  const problem = write(next);
  return problem ? { entries: current, problem } : { entries: next };
}

/** Puts back an entry that was just deleted, in its place by date. */
export function restoreReading(entry: HistoryEntry): HistoryChange {
  const current = loadHistory();
  const rest = current.filter((e) => e.id !== entry.id);
  const next = [...rest, entry]
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, MAX);
  const problem = write(next);
  return problem ? { entries: current, problem } : { entries: next };
}
