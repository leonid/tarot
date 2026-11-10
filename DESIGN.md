# Design system

Status: **proposal, provisional.** The project had no design language before this file (maturity L0: no `DESIGN.md`, no `.ds-context.md`; today's `src/styles.css` is 100 lines of unthemed defaults). Every value below was chosen here, not extracted from an existing system, and is meant to be reconciled once it is built in code (task D1). Contrast ratios were computed, not eyeballed (see Colour).

Direction in one line: **a quiet reading room, not a fortune-teller's shop.** The app is a reasoning tool (decompose, compare, interpret) with a contemplative mood. So: calm surfaces, high legibility, one accent, and the card art, once it exists, carries the mystery. No stars, moons or gradients as decoration.

## Principles (from the design-superpowers core set, applied)

1. **Useful and minimal.** Chrome stays out of the way of the spread and the text. Nothing decorative that does not help read a layout or a sentence.
2. **Understandable.** A reading is a spatial thing: the board shows positions by label and place; the interpretation names them again, in the same words.
3. **Honest.** The app shows which provider wrote a text (offline rules or AI) and never presents a card's meaning as a prediction. Disclaimer wording is a content task (open decision 15 of the plan).
4. **Equitable.** WCAG 2.2 AA is the floor. Nothing is conveyed by colour or rotation alone: reversed cards say "reversed", elements say their name, the hinge says "Hinge".
5. **Durable.** System-first behaviour (light, dark and `prefers-reduced-motion` follow the OS); no trend effects.

## Tokens

All tokens are CSS custom properties on `:root`, redefined for dark under `@media (prefers-color-scheme: dark)` and for an explicit override on `:root[data-theme]` (a manual toggle is task D6). Components reference **semantic** tokens only; raw hex lives in one file.

### Colour (provisional)

| Token               | Light     | Dark      | Use                                              |
| ------------------- | --------- | --------- | ------------------------------------------------ |
| `--bg`              | `#f6f0e4` | `#14101c` | Page                                             |
| `--surface`         | `#fffaf0` | `#1d1829` | Slots, panels, inputs                            |
| `--text`            | `#231b2e` | `#efe8f7` | Body                                             |
| `--text-muted`      | `#5c5367` | `#b3a8c2` | Labels, meta                                     |
| `--border`          | `#8f8272` | `#7d7390` | Control and slot outlines (non-text, needs 3:1)  |
| `--accent`          | `#4b2a7b` | `#c9b3f0` | Primary action, selected tab, focus ring         |
| `--accent-contrast` | `#ffffff` | `#14101c` | Text on `--accent`                               |
| `--gold`            | `#7a5200` | `#e0bd6a` | Hinge, the one "this matters" mark               |
| `--danger`          | `#a3202e` | `#ff8a93` | Delete, errors                                   |
| `--fire`            | `#a83a1a` | `#ff8a65` | Element chips (always with the word and a glyph) |
| `--water`           | `#1d5a94` | `#7ab8f0` |                                                  |
| `--air`             | `#6b5700` | `#e6cf6a` |                                                  |
| `--earth`           | `#3a6429` | `#8fcf7a` |                                                  |

Computed contrast (WCAG formula), foreground on `--surface`:

- Light: text 15.9, muted 7.0, accent 10.5, gold 6.7, danger 7.2, fire 6.1, water 6.9, air 6.8, earth 6.7; border on `--bg` 3.3; white on accent 11.0.
- Dark: text 14.5, muted 7.7, accent 9.2, gold 9.6, danger 7.7, fire 7.5, water 8.2, air 11.1, earth 9.4; border on `--bg` 4.2; dark on accent 10.0.

All text pairs clear 4.5:1 and the border clears 3:1 in both themes. These do not cover text drawn **over card images**; that needs its own check once images exist (M3.12).

### Type

- **UI and body:** `JetBrains Sans` is already named in `src/styles.css` and the files sit in `public/fonts/`, but **no `@font-face` loads them**, so today everything renders in `system-ui`. **Unverified:** whether that 34 KB subset contains Cyrillic; Russian is a shipped locale, so check before relying on it (D2).
- **Display (card names, headings):** a serif with Latin and Cyrillic, self-hosted so the future PWA works offline and no request leaks to a font CDN. Candidates: EB Garamond, Cormorant Garamond, PT Serif (licences and Cyrillic coverage **unverified**). Pick one in D2 by rendering the 78 English and 78 Russian card names.
- Scale (rem, base 1rem = 16px): 0.8125 meta, 0.875 small, 1 body, 1.125 lead, 1.375 h2, 1.75 h1. Body line-height 1.55; interpretation text max 68ch.
- Never set text smaller than 0.8125rem; Russian strings run roughly 20 to 30 percent longer than English, so no fixed-width labels.

### Space, shape, elevation

- Space scale (rem): 0.25, 0.5, 0.75, 1, 1.5, 2, 3. Page gutter 1rem on phones (spec: 16px side gutter), content max width 52rem as now.
- Radius: 6px controls and slots, 999px chips. Borders over shadows; a single soft shadow token `--lift` only for a card being dragged.
- Target size: interactive controls at least 44 by 44 CSS px on touch layouts (the WCAG 2.5.8 AA minimum is 24 by 24; the plan marks that figure unverified, re-check on w3.org). 44 is the stricter comfort target.
- Focus: 3px `--accent` outline with 2px offset on every interactive element; never removed.

### Motion

Two durations (120ms state changes, 240ms card flip or move), one easing. All motion off under `prefers-reduced-motion`. Reversal is shown by rotation **and** the word "reversed", so a user without animation or with a screen reader gets the same information.

## Component inventory

Derived from what is in `src/` today; names are the proposed shared components in `src/ui/`.

| Component           | Exists as                           | States and variants                                               | Notes                                                                |
| ------------------- | ----------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| Button              | bare `<button>`                     | primary, secondary, danger; default, hover, focus, disabled, busy | "Shuffle and deal" is primary; "Delete" danger                       |
| Field               | label + input/select (`Controls`)   | default, focus, disabled, invalid                                 | Label above; no placeholder-as-label                                 |
| Toggle              | checkbox (Reversals, Reversed)      | on, off, disabled                                                 | Native input restyled, not replaced                                  |
| Tabs                | `role="tablist"` (mode)             | selected, focus                                                   | Selected is bold today; needs an indicator that is not weight alone  |
| Slot                | `ui/SpreadBoard.tsx`                | empty, filled, drag-over, rotated, hinge                          | The rotated slot rotates its label too (plan gap 8); fix in D4       |
| CardFace            | text only                           | image or typographic fallback; upright, reversed; loading         | One component for slot, palette and history; image optional per deck |
| PaletteCard         | `features/setup/CardPalette.tsx`    | idle, dragging, placed (hidden)                                   | Drag handle on touch (M3.11)                                         |
| Chip / Badge        | `.slot-hinge`                       | hinge, element (fire/water/air/earth), provider (rules / AI)      | Colour never alone                                                   |
| InterpretationPanel | `ui/Layout.tsx`                     | loading, ready, error with fallback                               | Shows provider label (M4)                                            |
| StatusNote          | `<small role="status">`             | info, success, error                                              | Live region                                                          |
| Disclosure          | `<details>` (menus, saved readings) | open, closed                                                      | Keep native                                                          |
| LanguagePicker      | `<select>` in `App.tsx`             | n locales                                                         | Own-language names, hidden when only one locale                      |

Gap analysis: there is no DS library to compare against, so nothing needs a Gap Detector request. Everything above is new shared UI to build (D3 to D5). `CardFace` is the only component whose design depends on an unresolved decision (images, below).

## Layout

- **Simulate and Setup share one page** with the board as the focal point, controls above, interpretation below. Pattern: single column on phones; from about 56rem, board left and interpretation right (sticky) so a long Celtic Cross reading stays visible next to its text.
- Board: the grid from the spread's `x`/`y` stays; card size is a token (`--card-w`), scaled by viewport so the 10-card Celtic Cross fits at 360px width (plan A3).
- Setup: palette below the board on phones, as a side drawer on wide screens; "Place with menus" becomes a visible alternative, not a collapsed `details` (plan M3.9).

| Breakpoint   | Change                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| below 40rem  | one column, card width ~4.25rem, palette as a scroll strip with drag handle |
| 40 to 56rem  | one column, larger cards                                                    |
| 56rem and up | two columns: board and sticky interpretation                                |

## Imagery rule

Card art arrives in M3 (public-domain Rider-Waite-Smith scans, per-file licence manifest). The system treats art as **content in a frame**: a fixed 2:3 frame, `--surface` mat, 1px `--border`, caption (card name) always rendered as real text under or over a scrim, never baked in. Decks without art use a typographic face (numeral, suit glyph, name). Imagery in this repo is never AI-generated and labelled as final.

## Decisions to clarify

Recommendation first in each row. Nothing here is built yet, so each is cheap to change.

| #   | Decision                    | Options                                                                                                                                                                             | Recommendation and reason                                                                                                                                                      |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Mood                        | **A. Reading room** (parchment light, midnight dark, one violet accent, gold for emphasis). B. Mystic (deep indigo, gold, stars, gradients). C. Neutral utility (grey, blue accent) | A. B dates fast and fights the card art; C is safe but gives the app no identity                                                                                               |
| 2   | Theme behaviour             | **A. Follow the OS, plus a manual toggle.** B. Dark only. C. Light only                                                                                                             | A. Readings are often at night, and the OS setting is the default expectation                                                                                                  |
| 3   | Display font                | **A. A self-hosted serif with Cyrillic for card names and headings.** B. One sans everywhere                                                                                        | A, if a licence-clean serif with full Cyrillic is found (D2); otherwise B                                                                                                      |
| 4   | Card face before art exists | **A. Typographic face (numeral, suit glyph, name).** B. Plain text slot as today                                                                                                    | A, so the board looks intended and the swap to images is a component-internal change                                                                                           |
| 5   | Element colours             | **A. Four tokens, always paired with word and glyph.** B. No element colour                                                                                                         | A, for scanning a reading's dominant element; the pairing keeps it accessible                                                                                                  |
| 6   | Styling technology          | **A. Plain CSS custom properties and CSS modules, no new dependency.** B. Tailwind. C. A component library (Radix, shadcn)                                                          | A. The UI is small, tokens are the whole system, and no new dependency keeps the bundle and the supply-chain surface small. Reconsider only if the component count grows a lot |
| 7   | Where the system lives      | **A. `DESIGN.md` (this file) plus `src/ui/tokens.css` and `src/ui/` components; a `/design-review` pass per milestone.** B. A separate Storybook                                    | A for now. A catalogue page in the app (dev only) is cheaper than Storybook; revisit when there are over 15 components                                                         |
| 8   | Icon set                    | **A. A tiny inline SVG set (suits, elements, close, check) drawn here.** B. An icon library                                                                                         | A. About 10 glyphs, and no dependency                                                                                                                                          |

## What this does not cover

Marketing or landing pages, print styles for readings, animation of the shuffle, and any Thoth or Marseille visual identity. Each would extend this file when it is real.
