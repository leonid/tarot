# Tarot

React + TypeScript SPA for tarot readings. Simulate mode deals random cards; setup mode lets the user place chosen cards in a chosen spread. Both end in a contextual interpretation. See `GLOSSARY.md` for terms and `docs/research/` for the design background.

## Commands

Needs Node >= 20.19 (`.nvmrc` says 22); Vite 8 will not install its native binding on older Node.

- `npm run dev`, `npm run build`
- `npm run typecheck`, `npm run lint`, `npm test`
- `npm run format`

## Layout

- `src/domain/`: pure TypeScript (types, seeded RNG, deal, validation, elements, interpretation contract, fallback provider). **No React, Zustand or dnd-kit imports**; ESLint enforces this. Same for `src/content/`.
- `src/content/`: decks, spreads, base meanings, all as typed data.
- `src/features/`: `simulate/`, `setup/`, and the Zustand store.
- `src/ui/`: shared components.

## Conventions

- Spreads, decks and meanings are data; do not hard-code them in components.
- Shuffling takes a seeded RNG so readings replay and tests are deterministic.
- A card appears at most once per reading.
- Card meaning text is original wording; see `docs/research/sources.md` before adding content or images.
- All user-facing strings live in typed content files, to keep i18n possible.
- Interpretation goes through `InterpretationProvider`. Never put an API key in client code.
- Install quirk: `@testing-library/dom` is an explicit dependency on purpose. Without it, `npm install` crashed with an arborist `edgesOut` error.
