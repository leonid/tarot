# Tarot

A React app for interpreting tarot readings.

- **Simulate:** ask a question, pick a deck and a spread, then shuffle and deal.
- **Setup:** pick a deck and a spread, then place specific cards in specific positions to analyse a reading.
- Each card is interpreted by its meaning, its position, and the other cards in the reading.

Status: working app, not yet deployed. Both modes work with 2 decks, 3 spreads, base meanings for all 78 cards and Golden Dawn (Book T) correspondences. A deterministic interpreter reads each card in its position and compares the cards. The interface is in English and Russian (the Russian text is machine-written and awaits native review), with light and dark themes and public-domain card images (1909 Roses & Lilies scans) with a typographic fallback. Readings can be saved locally and shared as a link (`#r=...`).

## Develop

Requires Node 20.19+ (or 22.12+); `nvm use` reads `.nvmrc`.

```
npm install
npm run dev
npm test
```

Other scripts: `typecheck`, `lint`, `build`, `format`, `e2e`, and `images` (rebuilds the optimised card images from Wikimedia Commons; see `docs/research/sources.md`). CI runs typecheck, lint, test and build (then a secrets check and a size check: the first download, gzipped, must stay under 100 kB; the Russian text, Setup, the journal, the card library and the reading screen load on demand, so new code for them does not count, but new code in the shared shell does), and the end-to-end tests on all three browsers (the Playwright report is attached to a failed run).

End-to-end tests (Playwright, Chromium, Firefox and WebKit) build the app and serve it on port 4391. First run: `npx playwright install chromium firefox webkit`. Run one browser with `npm run e2e -- --project=chromium`.

## AI reader (optional)

The app writes readings itself, offline. If `VITE_PROXY_URL` is set at build time to the LLM proxy's interpret URL (see `proxy/README.md`), a "Write the reading with AI" switch appears. It is off by default, says what is sent and to whom, and every failure falls back to the built-in reader. Without the variable the switch is not shown.

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main` and publishes to GitHub Pages (`https://<owner>.github.io/tarot/`), then smoke-tests the live URL. The build reads `BASE_PATH` (the workflow sets `/tarot/`); locally the base is `/`. One-time setup: repo Settings > Pages > Source: "GitHub Actions". GitHub Pages on a private repository needs a paid plan, and the published site is public.

## Docs

- `docs/research/`: sources and licensing, deck and spread structure, interpretation design, and the Structural Tarot Method guide.
- `docs/research/dependency-audit.md`: the one accepted `npm audit` advisory (dev only), why it is not fixed, and the re-check date.
- `GLOSSARY.md`: terms. `CLAUDE.md`: working conventions.

## Roadmap

The plan, with current status at the top, is `docs/research/full-app-plan.md`; tasks are issues in the GitHub repo. In short:

1. Done: hardening (M1) and the text and structure split (M2).
2. Public-domain card images and click-to-place are done; first deploy is set up (needs Pages enabled) (M3); touch drag is press-and-hold.
3. LLM interpretation behind a small proxy (M4): code merged, proxy not deployed.
4. Next, from the review of 2026-11-11 (plan section 0.5): fix the dignity table and Setup card order, stop losing a reading on mode or spread change, merge the pending M6 work, first deploy.
5. Then the reading itself: a built-in reader that answers the question, card detail and library, Setup controls on the board, Celtic Cross layout, first-visit and phone polish.
6. Journal, more spreads, daily card (M5); more content and locales (M6); PWA (M7).
