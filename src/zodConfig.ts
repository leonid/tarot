import { z } from 'zod';

// The page's Content-Security-Policy has no 'unsafe-eval'. Zod would probe for
// eval with a `Function` call, which the policy reports as a violation, so tell
// it up front to use its plain (not code-generated) parsers. This module must be
// imported before any module that builds a schema.
z.config({ jitless: true });
