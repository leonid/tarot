import { handle, type Env } from './handler';

/** Cloudflare Worker entry. Deploy config and secrets come in M4.3. */
export default {
  fetch: (request: Request, env: Env) => handle(request, env),
};
