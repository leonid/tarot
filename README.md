# Tarot

A React app for interpreting tarot readings.

- **Simulate:** ask a question, pick a deck and a spread, then shuffle and deal.
- **Setup:** pick a deck and a spread, then place specific cards in specific positions to analyse a reading.
- Each card is interpreted by its meaning, its position, and the other cards in the reading.

Status: scaffold. Readings can be saved locally and shared as a link (`#r=...`). The domain model, three spreads, two decks, a deterministic interpreter and a minimal UI exist. Only three cards have written meanings so far.

## Develop

Requires Node 20.19+ (or 22.12+); `nvm use` reads `.nvmrc`.

```
npm install
npm run dev
npm test
```

Other scripts: `typecheck`, `lint`, `build`, `format`. CI runs typecheck, lint, test and build.

## Docs

- `docs/research/`: sources and licensing, deck and spread structure, interpretation design, and the Structural Tarot Method guide.
- `GLOSSARY.md`: terms. `CLAUDE.md`: working conventions.

## Roadmap

1. Write base meanings for all 78 cards.
2. Polish drag and drop (keyboard sensor, touch testing, card images on the board).
3. Public-domain card images.
4. LLM interpretation behind a small proxy.
