# LLM proxy (Cloudflare Worker)

The browser never holds the Anthropic key; it calls this Worker, which validates the request and (from M4.6) calls the API. Decisions: `docs/research/llm-proxy-decision.md`.

## Where the key lives

- **Production:** only in the Worker's encrypted secret store. Set it once:
  `cd proxy && npx wrangler secret put ANTHROPIC_API_KEY` (paste the key at the prompt). Use a key from a dedicated Anthropic workspace with a monthly spend cap.
- **Local:** `proxy/.dev.vars` (git-ignored). Copy `.dev.vars.example` and fill it in, then `cd proxy && npx wrangler dev`.
- **Never** in `wrangler.toml`, the repo, CI logs, or any `VITE_*` variable (Vite would inline it into the client bundle).

## Guards

- `.gitignore` ignores `.dev.vars` (checked by `proxy/src/secrets.test.ts`).
- `npm run check:secrets` scans `dist/` for key-like strings and the key's variable name; CI runs it after the build.
- If a key is ever committed or pasted somewhere public, revoke it in the Anthropic console first, then clean up.

## Config

`ALLOWED_ORIGINS` (a plain variable in `wrangler.toml`) lists the origins that may call the Worker: the GitHub Pages origin, and `http://localhost:5173` in `.dev.vars` for local work.

## Evaluation (M4.11)

`npm run eval` sends 15 fixture readings (every spread, reversals, no question, Russian, injection and tag break-out attempts, a medical and a financial question) to the real model through the same code the Worker runs, and checks each reply: within the schema, every card and position used exactly once, no invented card or hinge, no injection canary in the text. It needs `ANTHROPIC_API_KEY` in the environment or in `proxy/.dev.vars`, **spends real (small) money**, and is manual: it is not part of `npm test` or CI. The fixtures and the checker are unit-tested in CI (`proxy/eval/eval.test.ts`); read the replies themselves to judge the prose, and move `MODEL` to `claude-sonnet-5-5` only if Haiku's prose is poor.

## Cache, rate limit and daily ceiling (M4.9, R14)

- **Cache:** with a KV namespace bound as `CACHE`, the same reading (same question, deck, spread, locale, cards and orientations, model and prompt) is answered from the cache for **24 hours** without a paid call. The key is a SHA-256 hash; the stored value is the interpretation, which contains text derived from the question, hence the short lifetime. Responses carry `x-cache: hit` or `miss`. The app's AI note tells the reader about this 24 hour copy.
- **Rate limit (required):** the `RATE_LIMITER` binding is on in `wrangler.toml`. A client (by `cf-connecting-ip`) over the limit gets `429` with `retry-after: 60`, before any upstream call. **The Worker fails closed**: with no limiter bound, or one that errors, every request gets `503`. For local work only, set `ALLOW_NO_RATE_LIMIT=true` in `proxy/.dev.vars`. The limiter is approximate (per Cloudflare location, eventually consistent): a shield, not a quota.
- **Daily ceiling (required):** at most `DAILY_CEILING` (default 1000) paid upstream calls per UTC day, counted in the `CACHE` namespace inside the cache, so only real spend counts. Past it, `503`. KV has no atomic increment, so a burst can overshoot a little. Without KV the Worker refuses too (unless `ALLOW_NO_RATE_LIMIT=true`).
- The hard bound on cost is still the monthly spend cap on the Anthropic workspace.
- **Origin check:** `ALLOWED_ORIGINS` keeps other websites from using the proxy from a browser. It does not stop a script that sends the header itself: the limiter, the ceiling and the spend cap are what do.

## Content-Security-Policy

The production build adds a `<meta http-equiv="Content-Security-Policy">` (`csp.ts`, a build-only Vite plugin): scripts and styles from the site itself, the one inline theme script by hash, calls only to the site and to the origin of `VITE_PROXY_URL` when that is set, no plugins, no changed base, no form posts. `e2e/production.spec.ts` opens every screen and fails on any `securitypolicyviolation`. A header would be stronger (it can also set `frame-ancestors`); GitHub Pages cannot send one, so put the same policy in a header if the site moves to a host that can.
