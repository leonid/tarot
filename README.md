# Tarot

A React app for interpreting tarot readings.

- **Simulate:** ask a question, pick a deck and a spread, then shuffle and deal.
- **Setup:** pick a deck and a spread, then place specific cards in specific positions to analyse a reading.
- Each card is interpreted by its meaning, its position, and the other cards in the reading.

Status: scaffold. The domain model, three spreads, two decks, a deterministic interpreter and a minimal UI exist. Only three cards have written meanings so far.

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
2. Drag and drop in setup mode, on top of the existing select-based placement.
3. Public-domain card images.
4. Save readings (localStorage) and share a layout by URL.
5. LLM interpretation behind a small proxy.
