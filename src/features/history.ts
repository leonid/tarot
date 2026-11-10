import { z } from 'zod';
import { sharedReadingSchema, type SharedReading } from '../domain/share';

const KEY = 'tarot.history.v1';
const MAX = 50;

const entrySchema = z.object({
  id: z.string(),
  savedAt: z.number(),
  reading: sharedReadingSchema,
});
export type HistoryEntry = z.infer<typeof entrySchema>;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = z.array(entrySchema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
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
