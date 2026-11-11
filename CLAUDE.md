# Tarot

React + TypeScript SPA for tarot readings. Simulate mode deals random cards; setup mode lets the user place chosen cards in a chosen spread. Both end in a contextual interpretation. See `GLOSSARY.md` for terms and `docs/research/` for the design background.

## Commands

Needs Node >= 20.19 (`.nvmrc` says 22); Vite 8 will not install its native binding on older Node.

- `npm run dev`, `npm run build`
- `npm run typecheck`, `npm run lint`, `npm test`
- `npm run format`

## Workflow (dev rule)

- One GitHub issue = one new branch off `main` (`m3.11-touch` style) = one pull request. Never commit to `main` directly.
- The PR body says `Closes #N`, so merging marks the issue resolved. Merge only after CI is green.
- When an issue is done, make sure it is closed as completed (resolved) with a comment saying what was proved.
- Pushes and merges happen only when the user says so ("push", "go").

## Layout

- `src/domain/`: pure TypeScript (types, seeded RNG, deal, validation, elements, interpretation contract, fallback provider). **No React, Zustand or dnd-kit imports**; ESLint enforces this. Same for `src/content/`.
- `src/content/`: decks, spreads, base meanings, all as typed data.
- `src/features/`: `simulate/`, `setup/`, and the Zustand store.
- `src/ui/`: shared components.
- `proxy/`: the LLM proxy (Cloudflare Worker, M4). A pure `handle(request, env, interpret)` that rejects bad input before any upstream call. May import `src/domain/` and `src/content/`, never React or `src/ui/`.

## Conventions

- Spreads, decks and meanings are data; do not hard-code them in components.
- Shuffling takes a seeded RNG so readings replay and tests are deterministic.
- A card appears at most once per reading.
- Card meaning text is original wording; see `docs/research/sources.md` before adding content or images.
- All user-facing strings live in typed content files, to keep i18n possible.
- Localization: structure (ids, coordinates) stays in `src/content/`; text is per locale in `src/content/locales/<code>.ts` (UI strings, interpreter phrase templates, optional card, deck and spread names and meaning overrides). Anything a locale omits falls back to English. Read text through `useI18n()` in `src/ui/i18n.ts`, never import English content straight into a component. `en-XA` is a dev-only pseudo-locale that wraps every string in ⟦⟧; `src/ui/i18n.test.tsx` fails if English leaks past it. Saved readings and share links hold ids only, so they are language-independent.
- Interpretation goes through `InterpretationProvider`. Never put an API key in client code.
- Install quirk: `@testing-library/dom` is an explicit dependency on purpose. Without it, `npm install` crashed with an arborist `edgesOut` error.
