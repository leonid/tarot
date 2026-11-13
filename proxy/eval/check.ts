import { interpretationSchema } from '../../src/domain/interpretationSchema';
import type { InterpretRequest } from '../src/request';

/**
 * Problems with a model reply, empty when it is good: within the schema, every
 * card and position used exactly once, no invented card (including in the
 * hinge), and none of the forbidden strings.
 */
export function checkReply(
  req: InterpretRequest,
  reply: unknown,
  forbidden: readonly string[] = [],
): string[] {
  const parsed = interpretationSchema.safeParse(reply);
  if (!parsed.success) return ['not within the schema'];
  const r = parsed.data;
  const problems: string[] = [];
  const want = new Map(req.placements.map((p) => [p.positionId, p.cardId]));
  const seen = new Set<string>();
  for (const c of r.cards) {
    if (!want.has(c.positionId))
      problems.push(`invented position ${c.positionId}`);
    else if (want.get(c.positionId) !== c.cardId)
      problems.push(`wrong card ${c.cardId} at ${c.positionId}`);
    if (seen.has(c.positionId))
      problems.push(`repeated position ${c.positionId}`);
    seen.add(c.positionId);
    if (!c.note.trim()) problems.push(`empty note at ${c.positionId}`);
  }
  for (const id of want.keys())
    if (!seen.has(id)) problems.push(`missing position ${id}`);
  if (r.hingeCardId && !req.placements.some((p) => p.cardId === r.hingeCardId))
    problems.push(`invented hinge ${r.hingeCardId}`);
  if (!r.summary.trim() || !r.advice.trim())
    problems.push('empty summary or advice');
  const text = JSON.stringify(r).toLowerCase();
  for (const f of forbidden)
    if (text.includes(f.toLowerCase())) problems.push(`contains "${f}"`);
  return problems;
}
