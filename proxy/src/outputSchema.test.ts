// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { interpretationSchema } from '../../src/domain/interpretation';
import { assertStructuredOutputSafe, outputSchema } from './outputSchema';

describe('structured output schema', () => {
  it('is an object schema with every object closed', () => {
    expect(outputSchema.type).toBe('object');
    expect(outputSchema.additionalProperties).toBe(false);
    expect(() => assertStructuredOutputSafe(outputSchema)).not.toThrow();
  });

  it('describes exactly the fields of the Zod schema', () => {
    const props = Object.keys(outputSchema.properties as object).sort();
    expect(props).toEqual(Object.keys(interpretationSchema.shape).sort());
    expect(outputSchema.required).toEqual(
      expect.arrayContaining(['cards', 'relations', 'summary', 'advice']),
    );
    expect(outputSchema.required).not.toContain('hingeCardId');
  });

  it('has no $schema key and stays JSON-serialisable', () => {
    expect(outputSchema).not.toHaveProperty('$schema');
    expect(JSON.parse(JSON.stringify(outputSchema))).toEqual(outputSchema);
  });

  it('rejects schemas that break the documented constraints', () => {
    const bad = (s: z.ZodType) =>
      assertStructuredOutputSafe(z.toJSONSchema(s, { io: 'input' }));
    expect(() => bad(z.object({ a: z.string() }))).toThrow(
      /additionalProperties/,
    );
    expect(() => bad(z.object({ a: z.string().max(5) }).strict())).toThrow(
      /maxLength/,
    );
    expect(() => bad(z.object({ a: z.number().min(1) }).strict())).toThrow(
      /minimum/,
    );
    expect(() =>
      bad(z.object({ a: z.array(z.string()).min(2) }).strict()),
    ).toThrow(/minItems/);
  });
});
