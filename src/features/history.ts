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

function write(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
  } catch {
    // Storage can be blocked or full; history is a convenience only.
  }
}

export function saveReading(reading: SharedReading): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    savedAt: Date.now(),
    reading,
  };
  const next = [entry, ...loadHistory()];
  write(next);
  return next.slice(0, MAX);
}

export function deleteReading(id: string): HistoryEntry[] {
  const next = loadHistory().filter((e) => e.id !== id);
  write(next);
  return next;
}
