import { handle, type Env } from './handler';
import { withCache } from './cache';
import { withDailyCeiling } from './ceiling';
import { makeInterpret } from './upstream';

const interpret = withCache(withDailyCeiling(makeInterpret()));

/** Cloudflare Worker entry. Deploy config and secrets: see proxy/README.md. */
export default {
  fetch: (request: Request, env: Env) => handle(request, env, interpret),
};
