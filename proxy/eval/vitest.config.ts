import { defineConfig } from 'vitest/config';

/** Manual evaluation only: never part of `npm test` or CI (it spends money). */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['proxy/eval/**/*.eval.ts'],
    testTimeout: 60_000,
    // Gentle on rate limits: one reading at a time.
    fileParallelism: false,
    sequence: { concurrent: false },
  },
});
