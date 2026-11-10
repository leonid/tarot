# Tarot

A React app for interpreting tarot readings.

- **Simulate:** ask a question, pick a deck and a spread, then shuffle and deal.
- **Setup:** pick a deck and a spread, then place specific cards in specific positions to analyse a reading.
- Each card is interpreted by its meaning, its position, and the other cards in the reading.

Status: scaffold. The interface and interpreter text are localizable (English and Russian; the Russian text is machine-written and awaits native review; see `CLAUDE.md`). Readings can be saved locally and shared as a link (`#r=...`). The domain model, three spreads, two decks, a deterministic interpreter and a minimal UI exist. All 78 cards have base meanings and Golden Dawn (Book T) correspondences.

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

1. Fill the optional theme notes (love, career, spirit, advice).
2. Polish drag and drop (keyboard sensor, touch testing, card images on the board).
3. Public-domain card images.
4. LLM interpretation behind a small proxy.
