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
