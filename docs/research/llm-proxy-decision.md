# LLM proxy: host, model, privacy, rate limits (M4.1)

Decided 2026-11-11. Builds on decisions #4 to #7, #15 and #16 in `full-app-plan.md` section 6.

## Decision

| Question      | Decision                                                                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host          | **Cloudflare Workers**, a standalone Worker separate from the GitHub Pages site. Secret in the Worker's encrypted secret store; CORS and an `Origin` allow-list limited to the app origin; one POST route.                                |
| Model tier    | **`claude-haiku-5-5`**, held in one server-side constant (not client-chosen), with a server-side `max_tokens`. Move to `claude-sonnet-5-5` only if the fixture evaluation (plan P4) shows the prose is not good enough. Confirm ids and prices at build time. |
| Privacy       | Opt-in "Use AI interpretation", off by default, with a visible off switch and an in-app notice. The question and the reading leave the device. Say "up to 30 days" retention until confirmed with Anthropic. No question text in logs. No analytics. |
| Rate limiting | Layered, as in decision #5: a monthly spend cap on a dedicated non-default Anthropic workspace (hard backstop, owner sets and records it); small model and `max_tokens`; server-side cache keyed by a hash of the reading (M4.9); a per-session token issued by the proxy; Cloudflare's rate-limit binding only as an approximate soft shield (it is per location and advises against IP keys). |

## Why

- **Cloudflare Workers:** the plan's candidate, with free-tier headroom (100,000 requests per day), secrets kept out of the client bundle, and a rate-limit binding. Using a Worker alone avoids moving the static site off GitHub Pages (decision #7).
- **Haiku:** the plan estimates well under a cent per reading against about $0.014 on Sonnet. Start cheap and let measured quality decide.
- **Opt-in:** questions are personal (decision #4).

## Consequences and follow-ups

- M4.2 creates the Worker skeleton (Zod validation, size cap, origin check) in a new `proxy/` folder; it must not import React or the app's UI.
- M4.3 documents secret handling and local dev (`wrangler dev`, `.dev.vars` gitignored); CI greps `dist/` for key-like strings.
- The owner creates the Cloudflare account and the Anthropic workspace with its spend cap before M4.6; record the cap in that PR.
- Not verified here: Cloudflare free-tier limits and Haiku prices at the time of building.
