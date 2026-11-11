import { z } from 'zod';
import { interpretationSchema } from '../../src/domain/interpretation';

/** Keywords the structured-output feature does not support (plan S3). */
export const UNSUPPORTED_KEYWORDS = [
  'minLength',
  'maxLength',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  'maxItems',
  'uniqueItems',
  'pattern',
  'format',
] as const;

type Json = Record<string, unknown>;

/** Walks the schema, enforcing the documented constraints. Throws on a violation. */
export function assertStructuredOutputSafe(node: unknown, path = '#'): void {
  if (Array.isArray(node)) {
    node.forEach((n, i) => assertStructuredOutputSafe(n, `${path}/${i}`));
    return;
  }
  if (typeof node !== 'object' || node === null) return;
  const o = node as Json;
  if (o.type === 'object' && o.additionalProperties !== false)
    throw new Error(`${path}: object must set additionalProperties: false`);
  for (const k of UNSUPPORTED_KEYWORDS)
    if (k in o) throw new Error(`${path}: unsupported keyword "${k}"`);
  if ('minItems' in o && o.minItems !== 0 && o.minItems !== 1)
    throw new Error(`${path}: minItems may only be 0 or 1`);
  for (const [k, v] of Object.entries(o))
    assertStructuredOutputSafe(v, `${path}/${k}`);
}

/**
 * The JSON schema sent as `output_config.format` (M4.6), derived from the same
 * Zod schema that validates the reply, so the two cannot drift apart.
 */
export function buildOutputSchema(): Json {
  const schema = z.toJSONSchema(interpretationSchema, { io: 'output' }) as Json;
  delete schema.$schema;
  assertStructuredOutputSafe(schema);
  return schema;
}

export const outputSchema = buildOutputSchema();
