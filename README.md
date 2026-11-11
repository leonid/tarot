# Tarot

A React app for interpreting tarot readings.

- **Simulate:** ask a question, pick a deck and a spread, then shuffle and deal.
- **Setup:** pick a deck and a spread, then place specific cards in specific positions to analyse a reading.
- Each card is interpreted by its meaning, its position, and the other cards in the reading.

Status: working app, not yet deployed. Both modes work with 2 decks, 3 spreads, base meanings for all 78 cards and Golden Dawn (Book T) correspondences. A deterministic interpreter reads each card in its position and compares the cards. The interface is in English and Russian (the Russian text is machine-written and awaits native review), with light and dark themes and typographic card faces (no card images yet). Readings can be saved locally and shared as a link (`#r=...`).

## Develop

Requires Node 20.19+ (or 22.12+); `nvm use` reads `.nvmrc`.

```
npm install
npm run dev
npm test
```

Other scripts: `typecheck`, `lint`, `build`, `format`, `e2e`, and `images` (rebuilds the optimised card images from Wikimedia Commons; see `docs/research/sources.md`). CI runs typecheck, lint, test and build, and the end-to-end tests on all three browsers (the Playwright report is attached to a failed run).

End-to-end tests (Playwright, Chromium, Firefox and WebKit) build the app and serve it on port 4391. First run: `npx playwright install chromium firefox webkit`. Run one browser with `npm run e2e -- --project=chromium`.

## Docs

- `docs/research/`: sources and licensing, deck and spread structure, interpretation design, and the Structural Tarot Method guide.
- `docs/research/dependency-audit.md`: the one accepted `npm audit` advisory (dev only), why it is not fixed, and the re-check date.
- `GLOSSARY.md`: terms. `CLAUDE.md`: working conventions.

## Roadmap

The plan, with current status at the top, is `docs/research/full-app-plan.md`; tasks are issues in the GitHub repo. In short:

1. Done: hardening (M1) and the text and structure split (M2).
2. Public-domain card images, click-to-place, touch, first deploy (M3).
3. LLM interpretation behind a small proxy (M4).
4. Journal, more spreads, daily card (M5); more content and locales (M6); PWA (M7).
