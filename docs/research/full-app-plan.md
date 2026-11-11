# Full-app plan: features, milestones and tasks

Written 2026-11-10. Planning document only; no code was changed. Statements about the repo cite files read on this date. External facts cite a URL in section 7; anything not confirmed is marked **unverified**.

## 0. Status (revised 2026-11-10, after commit 1032b10)

This section is the current truth. Sections 1 to 5 below are the original plan and are kept for the reasoning; where they disagree with this section, this section wins. Section 2 in particular describes the repo **before** the work listed here.

### 0.1 Where each milestone stands

| Milestone        | State                 | Done                                                                                                                                                                                                                  | Still open                                                                                                                                                                             |
| ---------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1 Hardening     | Done (14 of 14)               | M1.1 to M1.5 (Playwright on three browsers, e2e for simulate, setup, save and share, run in CI), M1.6, M1.7 (id, order and seeded-deal snapshots), M1.8, M1.9 (per-entry history, migration chain), M1.10 (bad share link message), M1.11 (interpretation trigger, cache, loading and error state), M1.12 (error boundary with start over), M1.13 (audit decision in `dependency-audit.md`), M1.14 (share link leaves the address bar; pasted links open). | None                                      |
| M2 Text split    | Goal met another way  | M2.3 to M2.10: typed UI dictionary, locale in store, `<html lang>`, switcher, localized drag announcements, per-locale text tables, per-key fallback, coverage tests, ids-only share links                            | M2.1 (typed facts, `src/domain/facts.ts`) and M2.12 (dignities grouped by element pair) are done. Nothing remains                                                                                                                                |
| Design system    | 8 of 11               | D0 (decisions recorded in `DESIGN.md`), D1 to D7, and D9 (`src/ui/contrast.test.ts`)                                                                                                                                  | D8 (suit and element icons exist; close and check are still text glyphs), D10 (review at the end of M3)                                                                                |
| M3 Presentable   | Started through D4/D7 | M3.1 (image set chosen: the 1909 Roses & Lilies scans, see `sources.md`); M3.2 (manifest schema, `src/content/images/manifest.ts`); M3.3 (all 78 file pages checked by script, `rws-1909.json`); M3.4 (78 cards at 240 and 480 px, 6.84 MB of 8 MB, `npm run images`); M3.5 (image resolver, `src/content/images/resolve.ts`); M3.6 (alt text for all 78 cards in English and Russian); M3.7 (`CardImage`: lazy picture, reversed turned over plus the word, text face as fallback; shown on the catalogue page); M3.8 (board slots and palette use `CardImage`; names stay as text beside the pictures); M3.9 (click-to-place: click a card, then a position; a hint line and a status line say how); M3.13 (accessibility-tree review done, deal announcement added; the manual screen-reader pass is still to do, checklist in `screen-reader.md`); M3.12 (automated axe-core check in e2e on four main views in both themes, no violations after two fixes: palette is now a group of buttons, the scrolling interpretation panel is keyboard-focusable; focus-ring and reduced-motion checks); M3.11 (touch: press-and-hold drag, swipes scroll; emulated-phone e2e, real-device note in `touch.md`); M3.10 (keyboard drag: arrow keys jump from position to position and each move is announced; a whole three-card spread is placed by keyboard in e2e); the crossing-card label fix (half of M3.8); one keyboard-drag e2e (part of M3.10); contrast and focus tokens (part of M3.12)                                                                                          | Image work: none left, touch (M3.11), screen-reader pass (M3.13), deploy (M3.14)                                                                        |
| M4 LLM           | Not started           | Decisions taken (section 6)                                                                                                                                                                                           | Everything; blocked on choosing a proxy host                                                                                                                              |
| M5, M7, M8       | Not started           |                                                                                                                                                                                                                       |                                                                                                                                                                                        |
| M6 Content       | One item early        | Russian (M6.7, M6.8): UI, 78 cards, meanings, spreads, interpreter phrases, with full coverage tests. It is a **machine draft**                                                                                       | Review of the Russian text by a fluent reader; everything else in M6                                                                                                                   |

Evidence at this revision: 343 unit and component tests, 23 Playwright tests on Chromium, Firefox and WebKit (69 runs, green in CI), typecheck, lint and build all pass.

### 0.2 Where the build left the plan

1. **Localization came before hardening, and by a different design.** The plan had Compare return typed facts that a per-locale renderer turns into text (M2.1, M2.2). What was built instead: each locale supplies phrase templates (`ProviderStrings` in `src/domain/strings.ts`), and Compare calls them. `src/domain/` holds no English, the pseudo-locale tests prove no English reaches the screen, and plurals are each locale's own business, so a shared `Intl.PluralRules` helper (M2.3) and a lint rule (M2.11) were not needed.
2. **What that leaves undone.** Compare still returns finished sentences. Two things need the facts themselves:
   - the LLM prompt (M4.5), which should carry facts and not prose;
   - the interface: a Celtic Cross can produce one sentence listing 20 or more conflicting pairs, which cannot be grouped or shortened while it is a string.
3. **A second language shipped in M2, not M6.** Russian is complete by the coverage tests but unreviewed.
4. **The design system ran ahead of M3**, as section 5.3a intended, and the typographic card face means the app is presentable before any image exists.
5. **Card notes changed shape (1032b10).** A note is now the meaning only; the interface builds the heading (position, card, orientation) from the spread and deck. An LLM provider can therefore return plain notes and need not repeat names.

### 0.3 Changes to the task list

| Change            | Task                                  | Proposal                                                                                                                                                                                  |
| ----------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Close as done     | M2.4 to M2.10, D0, D9                 | Built and tested; issues #26 to #32, #48, #57                                                                                                                                             |
| Close as replaced | M2.3, M2.11                           | Locale-owned templates and the pseudo-locale leak tests cover the intent; issues #25, #33                                                                                                 |
| Rewrite           | M2.1 + M2.2 into one task             | "Compare returns typed facts; locale templates render them." Acceptance: no strings in `Comparison`; rendered text equal to today's for the existing test cases. Do it **before** M4.5    |
| Rewrite           | M6.7 + M6.8                           | "Russian: review by a fluent reader", since the text exists                                                                                                                               |
| Narrow            | M3.8, M3.10, D8                       | M3.8: images on board and palette only. M3.10: tune the keyboard sensor and place three cards. D8: close and check icons only                                                             |
| New               | Group or shorten long relation lists  | Depends on typed facts. A ten-card reading should not show one 25-pair sentence                                                                                                           |
| New               | Share link hygiene                    | Clear `#r=` from the address bar after opening or dismissing; react to `hashchange`                                                                                                       |
| New               | Element chips in the reading          | `ElementChip` exists (D5) but no screen uses it yet                                                                                                                                       |
| New               | Choose the LLM proxy host             | Open since decision #7; needed before M4.2                                                                                                                                                |
| Known limit       | History after a downgrade             | Entries from a newer version are dropped when an older build rewrites history. Record it; fix only if downgrades become real                                                              |

Applied to the GitHub issues on 2026-11-10. New issues: #119 (M2.12, group long relation lists), #120 (M1.14, share link hygiene), #121 (D11, element chips). The proxy host was not given a new issue: it is part of M4.1 (#59). M2.2 (#24) was merged into M2.1 (#23), and M6.8 (#87) was closed with the review tracked in M6.7 (#86).

### 0.4 Recommended order from here

1. **M1 is finished.** (M1.11 is done: the provider runs when the cards, deck, spread or language change, never while the question is typed; a changed question shows an update button. An LLM provider may want a fully manual trigger; decide in M4.8.)
2. **Typed facts are done** (M2.1: `compare()` returns `Fact[]`, `renderFact` applies the locale templates; the sentences are unchanged, pinned by `relations-text.test.ts`). **Grouping is done** (M2.12): dignities are one fact per pair of elements with the cards of each, so a ten-card reading has at most four conflict lines and two friendly ones and no pair is lost. `Interpretation.relations` is still a list of sentences; the facts do not reach the interface, which did not need them.
3. **M3:** images (M3.1 to M3.8), click-to-place, touch, deploy to GitHub Pages.
4. **M4** after the proxy host is chosen.
5. M5 to M8 as planned.

## 1. Summary

**Where we are.** Simulate and setup modes work, with 3 spreads, 2 decks, base meanings for all 78 cards, Book T correspondences, a deterministic interpreter with a Compare step, saved readings and share links. Nothing has been run in a real browser, there are no card images, there is no LLM provider, and most UI strings are hardcoded English.

**Recommended order.**

1. **M1 Hardening:** real-browser check, freeze card ids, safe history and share versioning, fix the interpretation trigger.
2. **M2 Text and structure split:** Compare returns typed facts; i18n scaffold with English only.
3. **M3 Usable and presentable:** accessibility, touch, card images, first public static deploy.
4. **M4 LLM interpretation** behind a proxy.
5. **M5 Journal, more spreads, daily card.**
6. **M6 More decks, content depth, more locales.**
7. **M7 PWA and offline.**
8. **M8 Revisit accounts and sync.**

**Biggest risks.**

- Image and content licensing (only one Wikimedia file page was checked).
- LLM cost and privacy with no accounts, so no stable key to rate-limit on.
- English prose built inside `src/domain/`, which makes localization and the LLM prompt harder than they look.
- Browser storage is the only copy of a user's readings.
- Content volume for deck variants and translations.

## 2. Current state and known gaps

### 2.1 What exists (verified in the repo)

| Area                | State                                                                                                                                                                                                            | Evidence                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Stack               | React 19, Zustand 5, Zod 4, `@dnd-kit/core` 6, Vite 8, Vitest 4, TypeScript 6                                                                                                                                    | `package.json`                                                                            |
| Domain              | Pure TS: types, seeded RNG, deal, validation, elements, zodiac, compare, fallback provider, share codec. ESLint forbids React/Zustand/dnd-kit imports here                                                       | `CLAUDE.md`, `src/domain/`                                                                |
| Decks               | `rws-78` and `major-22`. Card ids are generated from English names and numbers                                                                                                                                   | `src/content/decks/rws.ts:46-68`                                                          |
| Spreads             | Single card, Past/Present/Future, Celtic Cross, as data with grid coordinates and a `rotated` flag                                                                                                               | `src/content/spreads/index.ts`, `src/domain/types.ts:31-48`                               |
| Meanings            | Upright and reversed keywords plus summary for all 78 cards, checked by a completeness test                                                                                                                      | `src/content/meanings/meanings.test.ts`                                                   |
| Themes              | Optional `themes` field exists, but only The Fool has one, and only `advice`. Nothing reads it                                                                                                                   | `src/content/meanings/major.ts:17-19`, `src/domain/types.ts:26`, `src/domain/fallback.ts` |
| Correspondences     | Book T majors, 36 decans, court spans, cross-checked 2026-11-10. Decan date ranges unverified; The Fool's attribution unread                                                                                     | `docs/research/sources.md:34-68`                                                          |
| Compare step        | Dominant element, shared planet or sign, court sub-element echoes and spans, pairwise dignities, hinge card                                                                                                      | `src/domain/compare.ts:50-144`                                                            |
| Not in Compare      | Dominant or repeated number, isolated card, future-facing card, visual axes. The design doc lists "repeated numbers" and the guide lists these                                                                   | `docs/research/interpretation-design.md:12`, guide Part V, Step 2                         |
| Interpreter         | Stitches summary and keywords to the position; summary only echoes the question; advice is a fixed sentence                                                                                                      | `src/domain/fallback.ts:22-41`                                                            |
| Provider contract   | `InterpretationProvider.interpret(ctx): Promise<Interpretation>`, Zod `interpretationSchema`                                                                                                                     | `src/domain/interpretation.ts:16-40`                                                      |
| Setup UI            | dnd-kit `DndContext` with no `sensors` prop; palette cards are draggable; a "Place with menus" select list is the non-drag path                                                                                  | `src/features/setup/SetupView.tsx:29-79`, `src/features/setup/CardPalette.tsx`            |
| Persistence         | Saved readings in `localStorage` key `tarot.history.v1`, max 50; share link `#r=` base64url JSON with `v: 1`                                                                                                     | `src/features/history.ts:4-5`, `src/domain/share.ts:4-18`                                 |
| CI                  | GitHub Actions: typecheck, lint, test, build on Node 22                                                                                                                                                          | `.github/workflows/ci.yml`                                                                |
| Tests               | Vitest + jsdom unit and component tests only; no browser or e2e test                                                                                                                                             | `vite.config.ts:7-11`, `package.json` scripts                                             |
| Imagery             | None. `Card` has no image field; slots show the card name as text                                                                                                                                                | `src/domain/types.ts:6-14`, `src/ui/SpreadBoard.tsx:64-68`                                |
| Language            | `<html lang="en">` hardcoded; UI strings inline in components                                                                                                                                                    | `index.html:2`, `src/ui/Controls.tsx`, `src/App.tsx`, `src/ui/SaveShare.tsx`              |
| Dependency advisory | `npm audit` (run 2026-11-10): one moderate advisory, `minimatch` (GHSA-g3hv-75wg-m249), reached through `typescript-eslint`, dev only. The offered fix is `--force` and downgrades `typescript-eslint` to 8.36.0 | local `npm audit` output                                                                  |

### 2.2 Known gaps that change the plan

These are findings from reading the code, not in the original brief. Several are prerequisites for later features.

1. **The interpreter re-runs on every keystroke.** `ReadingView` has `question` in its effect dependencies, has no `.catch`, and keeps the stale result on screen while a new one resolves (`src/ui/Layout.tsx:18-35`). Harmless with a local function; with an LLM it means one billed request per keystroke. Must be fixed before M4.
2. **Domain code builds English prose.** `compare.ts` (lines 68, 96, 109) and `fallback.ts` (lines 28, 38, 64) interpolate English sentences, including a hand-rolled plural (`fall${inside.length === 1 ? 's' : ''}`). This blocks localization, and it also means the LLM prompt would carry English strings instead of facts.
3. **One bad history entry wipes all of them.** `loadHistory` parses the whole array with one Zod call and returns `[]` on any failure (`src/features/history.ts:14-23`). A future share schema v2 would erase every saved reading for returning users.
4. **Unknown spread ids are dropped silently.** `loadShared` returns early if the deck or spread is not shipped (`src/features/store.ts:66-68`). User-made spreads would need the spread definition inside the share payload.
5. **Seed replay depends on deck order.** `deal` shuffles `deck.cards` with the seeded RNG (`src/domain/deal.ts:23-24`). Reordering or adding cards to a deck changes every stored seed's result.
6. **Card ids carry RWS numbering and English names** (for example `major-08-strength`). Other decks number some trumps differently, so per-deck numbering has to be an overlay on a canonical id, never a new id scheme. Which numbering Marseille and Thoth use is **unverified** here; check a primary source before encoding.
7. **Keyboard dragging is already on, but weak.** dnd-kit enables the Keyboard sensor by default when no sensors are set; keys are Space/Enter to pick up and drop, Escape to cancel, arrows move 25 px by default; default instructions and announcements are English only (sources S4, S5). Real gaps: moving into a slot by keyboard is awkward at 25 px steps, and announcements are not localized. The select menus are the single-pointer alternative required by WCAG 2.5.7 (S6).
8. **Rotated slots use CSS `rotate` on the whole slot**, which also rotates the label text (`src/styles.css:52-55`). Needs a visual check once there are images.
9. **No error boundary, no loading or error state for interpretation, no `lang` handling.**
10. **Browser storage is the only copy.** MDN documents that best-effort storage can be evicted, and that Safari deletes script-created data after 7 days without interaction when cross-site tracking prevention is on (S11). A saved reading is therefore not durable.

## 3. Feature list by area

Size key: S is under a day, M is one to three days, L is a week or more of focused work (rough, for one developer).

### 3.1 Foundations (hardening, versioning, structure)

**F1. Real-browser verification and e2e smoke tests.**

- Why: nothing has been run in a browser; jsdom does not test drag and drop, layout or touch.
- Scope: Playwright suite on Chromium, Firefox and WebKit covering simulate, setup (menus and keyboard drag), save, reload, share link round trip; a CI job; screenshots at phone and desktop width.
- Out: visual regression baselines (add after images land).
- Depends on: none. Risk: low. Size: M.

**F2. Id and seed stability guards.**

- Why: gaps 5 and 6 above.
- Scope: a snapshot test of all 78 card ids and of the card order of each deck; a snapshot of one seeded deal per spread; a rule in `CLAUDE.md` that changing either needs a deliberate migration.
- Out: any change to ids. Depends on: none. Risk: low. Size: S.

**F3. Robust history and schema versioning.**

- Why: gaps 3 and 4.
- Scope: parse history per entry and keep the valid ones; a `migrate(v)` chain for share payloads and history entries (`v: 1` to `v: 2`); share codec that rejects unknown future versions with a visible message instead of silent nothing; a visible "this link could not be opened" state; storage key versioning.
- Out: sync. Depends on: none. Risk: medium (migration mistakes lose data; mitigate with fixtures of v1 payloads). Size: M.

**F4. Interpretation trigger, cache and states.**

- Why: gap 1.
- Scope: interpret only when the reading is complete and the user presses "Interpret" (or on completion, but never on question edits); cache results by a hash of `{deckId, spreadId, placements, question, providerId, locale}`; loading, error and "stale" states; `.catch` to fallback; cancel in-flight on change.
- Out: streaming. Depends on: none. Risk: low. Size: S to M.

**F5. Error boundary, reset and defensive rendering.** App-level boundary with a "reset reading" action; guard against missing cards or positions. Size: S.

### 3.2 Localization and text structure

**L1. Typed facts from Compare.**

- Why: gap 2; the single shared prerequisite of localization and the LLM prompt.
- Scope: `compare()` returns structured facts (for example `{kind: 'dominant-element', element, count, total}`, `{kind: 'shared-planet', planet, cardIds}`, `{kind: 'court-echo', ...}`, `{kind: 'dignity', pair, relation}`) plus the hinge id; a separate renderer turns facts into sentences per locale; the fallback provider uses the renderer.
- Out: new Compare rules (number checks come later, M6). Depends on: F2. Risk: medium (touches the interpreter and its tests, which must pass unchanged in meaning). Size: M.

**L2. i18n scaffold.**

- Why: about 20 UI strings today, so now is the cheapest moment; adding it later touches every component.
- Scope: a typed UI dictionary (`Record<Locale, Dict>` with the key set derived from English), a `t()` helper plus `Intl.PluralRules`-based plural helper (S12), locale in the store and in the share payload, `<html lang>` updated when the locale changes (WCAG 3.1.1, S13), localized dnd-kit `screenReaderInstructions` and `announcements` (S5), per-locale fallback templates, English fallback when a key is missing.
- Out: a third-party i18n library (decide in the task; a small typed helper is likely enough for the domain; a library is only worth it if locales with complex plurals or message formatting arrive). Depends on: L1. Risk: medium. Size: M.

**L3. Content text tables per locale.**

- Why: cards, spreads and meanings embed English text next to structure.
- Scope: keep ids and structure in `src/content/`; move names, spread labels, spread position meanings, base meanings and themes into per-locale text tables keyed by canonical id; a coverage test per locale (every id has every field, or the locale declares itself partial and falls back to English per key).
- Out: translating all 78 cards (a content task per locale, see M6). Depends on: L2. Risk: medium (largest refactor of content files). Size: L.

**L4. LLM reply language.** The proxy request carries the locale; the prompt asks for that language; the Zod validation is language-independent; a test checks that fallback and LLM both return text in the locale or the English fallback. Depends on: L2, P1. Size: S.

**L5. Locale-aware share links and history.** Locale is not part of a reading's identity: a link opens in the viewer's locale; only the question text is user content. Size: S.

### 3.3 Decks and meanings

**D1. Layered meaning tables.**

- Why: different decks give some cards different titles and emphasis.
- Scope: `base` table plus optional per-deck override table; lookup `override ?? base`; tests that override keys exist in the deck and that each override differs from the base.
- Out: new decks. Depends on: L3 (the text-table shape must be settled first). Risk: medium. Size: M.

**D2. Theme notes for all 78 cards.**

- Why: the `themes` field exists, but only The Fool has one entry and nothing reads it.
- Scope: write love, career, spirit and advice notes in original wording per `docs/research/sources.md`; let the interpreter and LLM prompt use the theme matching the question (a theme selector or an inferred one); test that every card has all four, once the policy is "required".
- Out: translation. Depends on: L3 for the table shape. Risk: low technically, high effort (312 notes). Size: L.

**D3. Thoth and Marseille decks.**

- Why: requested candidate area; the data model already allows more decks.
- Scope: own card lists, names, numbering and correspondences; Marseille pip cards have no scenes, so imagery and visual-axis comparisons differ; each deck declares which Compare rules apply.
- Licensing: Thoth art is still under copyright (`docs/research/sources.md:25-26`); ship names and meanings only, no art. Public-domain status of any Marseille scans is **unverified**; the card text and structure are not the problem, the specific scans are.
- Depends on: D1, L3. Risk: high (content accuracy, numbering, licensing). Size: L each.

**D4. Decan date ranges verified.** Book T gives none; ours are modern conversions from the owner's guide (`docs/research/sources.md:63-65`). Either find a primary source for the convention, or label the dates in the UI as a modern convention. Size: S to M (research).

### 3.4 Card imagery

**I1. Public-domain RWS images.**

- Why: the largest visible gap.
- Scope: choose one scan set on Wikimedia Commons; record, per file, the licence template, author and source URL in a manifest; optimise (resize to about 2 or 3 widths, WebP or AVIF with a JPEG fallback); lazy load; alt text per card (short, factual, localized); an optional `image` field on a card overlay, not in the canonical `Card` unless reviewed (CLAUDE.md and `docs/research/sources.md:27-29` call this a deliberate change); rotated and reversed rendering.
- Evidence so far: the Commons category lists several 78-file sets (Geldard, TaionWC, others) and warns that some colorized versions may still be copyrighted (S9). The one file page checked (The Fool) is marked with a public-domain template citing the author's death in 1942 and US publication before 1931 (S10). Licences for the other 77 files are **unverified**; each needs the same check.
- Out: Thoth or modern art. Depends on: none technically; sources.md open item. Risk: medium (licence per file; file size, since the Fool scan is about 1.1 MB at full size, S10). Size: L.

**I2. Image-aware board and palette.** Thumbnails in the palette, image in slot with name caption, reversed shown by 180 degree rotation with a text label (not rotation alone), Celtic Cross crossing card handled without rotating the label. Depends on: I1, F1. Size: M.

### 3.5 LLM interpretation

**P1. Proxy.**

- Why: a browser must never hold the key (`CLAUDE.md`, `docs/research/interpretation-design.md:32-34`).
- Scope: one POST endpoint on a small serverless function; secret kept in the host's encrypted secret store; allow-list of origin; request-size cap; server-side validation of the incoming reading with the same Zod schemas; fixed model and `max_tokens` on the server, not client-chosen; no logging of question text; CORS limited to the app origin.
- Candidate host: Cloudflare Pages Functions, which run on Workers, read secrets from `context.env`, and bill as Workers requests; free plan shares 100,000 requests per day with Workers; static asset requests are free and unlimited (S15, S16). Vercel is a plausible alternative but its docs were not fetched here: **unverified**.
- Depends on: F4. Risk: medium. Size: M.

**P2. LLM provider.**

- Prompt carries the output of Steps 1 and 2 (card dossiers and the typed Compare facts, L1) and asks for Steps 3 and 4 per the guide: positional roles, weights, one sentence per card, an integration paragraph, one actionable close, and the guide's self-check (every sentence tied to the question, every card used, one dominant theme, would the reading survive swapping adjacent cards, actionable close). Guide Part V, Steps 3 and 4.
- Request uses the Messages API `POST /v1/messages` with `model`, `max_tokens`, `messages`, top-level `system` (S2) and structured output via `output_config.format` with a JSON schema (S3, GA).
- Structured-output constraints that affect our schema: every object needs `additionalProperties: false`; `minLength`, `maxLength`, `minimum` and `maximum` are not supported; `minItems` only 0 or 1 (S3). Our Zod schema has none of the unsupported keywords, but conversion needs a test. Zod stays the final validator on the server and on the client.
- Failure routes to the fallback: `stop_reason: "refusal"` (output may not match the schema, tokens still billed), `max_tokens` truncation, HTTP 400, 429 (including the spend-cap 429 that has no `retry-after`), network error, Zod parse failure (S3, S7).
- Model choice: confirm at build time. The current overview lists `claude-haiku-5-5` (fastest, "from" $0.10 input / $0.50 output per million tokens, exact price unverified), `claude-sonnet-5-5` ($2 / $10) and `claude-opus-5-5` ($4 / $20) (S1). Start with a small model behind a server-side constant; evaluate quality against fixtures before choosing.
- Depends on: P1, L1, F4. Risk: high (cost, quality, privacy). Size: L.

**P3. Cost, abuse and privacy controls.**

- Hard backstop: a monthly spend limit on a dedicated non-default workspace (limits cannot be set on the default workspace; hitting a self-set limit returns HTTP 400 `invalid_request_error`) (S7).
- Soft limits: Cloudflare's rate-limit binding takes a string key, advises against IP addresses, applies per location and is approximate, so use it only as a shield (S17). With no accounts there is no stable identity; options are a per-session token issued by the proxy, a daily client counter (bypassable), or an opt-in "bring your own key" mode that never touches our proxy. Pick in the open decisions.
- Cache identical requests server-side by reading hash to avoid paying twice; consider prompt caching for the static system prompt (cache reads cost a fraction of input price; cached reads do not count toward input-tokens-per-minute) (S1, S7).
- Rough cost, my estimate with stated assumptions, not a sourced figure: about 3,000 input and 800 output tokens per reading gives roughly $0.014 on Sonnet 5.5 pricing and well under a cent on the small tier. At 10,000 readings a month that is on the order of $140 or $7 respectively.
- Privacy: the reading and question leave the device. Default retention is described differently on two official pages: the platform data-retention page says conversation content is not retained by default except for specific cases, while the commercial retention article says API inputs and outputs are deleted within 30 days (S8, S8b). Treat as "up to 30 days" until confirmed; whether API data trains models by default was not stated on the page read (**unverified**). Needs an in-app notice and an opt-in toggle ("Use AI interpretation"), default off or clearly explained.
- Depends on: P1. Size: M.

**P4. Prompt evaluation set.** A small fixture set of readings with expected properties (all cards mentioned, no invented cards, stays within schema, respects locale, no medical or legal advice, refuses nothing benign); run on demand, not in CI by default (cost). Size: M.

### 3.6 Spreads, journal, daily card

**S1. More built-in spreads.** Data only: for example three-card variants, relationship, decision, year ahead. Each needs position meanings (localizable) and a layout test (no overlapping coordinates). Size: S each.

**S2. Custom spread editor.** Grid editor to add, move, label and delete positions; saved spreads in local storage; share payload v2 embeds the spread definition so a link works on another device (gap 4); validation rules (unique ids, coordinates on a grid, max positions, label lengths). Out: sharing a spread library between users. Depends on: F3, L2. Risk: medium (needs keyboard-accessible layout editing; see A1). Size: L.

**S3. Reading journal.** Notes and tags per saved reading, search and filter, edit after saving, export and import as a versioned JSON file (also the answer to storage durability, gap 10), optional "how did it turn out" follow-up field. Out: sync. Depends on: F3. Risk: low to medium. Size: L.

**S4. Daily card.** One card per local calendar day, deterministic from date and a locally stored random salt (so it is stable on reload but not guessable), single-card interpretation, optional reminder only if a PWA with notifications is added (not v1). Depends on: none. Risk: low. Size: S to M.

### 3.7 Accessibility, mobile, PWA

**A1. Accessible placement.**

- Keep the select menus as the documented single-pointer alternative (S6) and make them prominent rather than inside a collapsed `details`.
- Tune the keyboard sensor: larger or slot-snapping steps via `getNextCoordinates`; custom position-based announcements ("Past, position 1 of 3") (S4, S5); an on-screen "place" button flow (click a card, click a slot) as a second pointer alternative.
- Roving focus or labelled landmarks for board slots; each slot reachable and described by label, meaning and current card.
- Test with a real screen reader pass (VoiceOver and one other); this cannot be proven by jsdom tests.
- Size: M.

**A2. Visual accessibility.** Contrast checks on text over images and for the hinge badge (it currently relies on a border and a word, which is good, but check colour contrast); focus outlines; `prefers-reduced-motion` handling for any drag or flip animation; reversal never conveyed by rotation alone. Target size: WCAG 2.5.8 sets a 24 by 24 CSS pixel minimum at AA, but the page text I fetched was truncated, so treat the figure as **unverified** and re-check on w3.org (S6b). Size: M.

**A3. Mobile and touch.** The palette uses `touch-action: none` on cards (`src/styles.css:85`), which blocks scrolling when a finger starts on a card; test a drag-handle or long-press activation; board scaling for Celtic Cross on 360 px width; test on a real phone. Size: M.

**A4. PWA and offline.**

- Installability needs a web app manifest and HTTPS; a service worker is not required for installability, but is how offline works (S14, S18). Chromium needs 192 and 512 px icons, `name`, `start_url`, `display` (S14).
- Offline scope: app shell, fonts, card images and meanings are static, so cache them; the LLM path simply falls back to the deterministic interpreter when offline.
- Risks: stale service worker serving old content after a release (new workers wait until old pages close unless `skipWaiting` is used) (S18); cache size with images. Use a tested plugin or a minimal hand-written worker; decide in the task. Depends on: I1, F1. Size: M.

### 3.8 Quality, security, release

**Q1. CI extension.** Add Playwright job, a markdown/link check for docs if wanted, a bundle size budget, and a scheduled `npm audit` that reports but does not fail. Size: S.

**Q2. Dependency audit decision.** The only advisory is dev-only and the suggested fix downgrades `typescript-eslint`. Recommend: record it, do not run `npm audit fix --force`, re-check monthly or when `typescript-eslint` ships a release that depends on a patched `minimatch`. Size: S.

**Q3. Performance.** Code-split the Celtic Cross and the setup palette if bundle size grows; image lazy loading; measure with the production build. Size: S to M.

**Q4. Content review.** Read-through of all 78 meanings for tone and consistency, theme notes, decan dates, the owner's guide Table 2 titles (already updated per git history, commit `66989f1`). Size: M, ongoing.

**Q5. Security review of the proxy and share links.** Share links are untrusted input (already parsed through Zod in `src/domain/share.ts:53-62`); the question text is untrusted input to the LLM (prompt injection: the model should be told the question is data, and the output is validated and rendered as plain text, never as HTML). Size: S to M.

### 3.9 Hosting and release

**H1. Static hosting.** Vite's guide documents static deployment to GitHub Pages, Cloudflare Pages, Netlify and Vercel, and the `base` setting for subpath deployments (S19). GitHub Pages has a 1 GB site cap, a soft 100 GB per month bandwidth cap, and its terms say it is not meant to host a commercial online business (S20). Because the proxy likely lives on Cloudflare anyway, Cloudflare Pages for both static site and function is the simplest single deployment; GitHub Pages is fine for a free non-commercial static v1 without the LLM. Size: S.

**H2. Domain, analytics, versioning.**

- Domain: owner choice.
- Analytics: default to none; if wanted, a cookieless, self-hosted or privacy-respecting option, decided by the owner. Never log questions.
- App version shown in the UI, and a changelog; storage and share schema versions (F3).
- Size: S.

### 3.10 Accounts and sync (out of v1)

Out of scope per `docs/research/tarot-structure.md:39-41`. Revisit after M5, using these triggers: users ask for cross-device history, journal export is not enough, or the proxy needs real identity for cost control.

| Option                                         | Pros                                                    | Cons                                                                         |
| ---------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Stay local, rely on export/import              | No server data, no privacy duty, nothing to breach      | No sync; user must remember to export                                        |
| End-to-end encrypted blob sync (key on device) | Server cannot read readings; small server               | Lost key means lost data; more crypto and recovery UX; real build cost       |
| Conventional accounts (email or OAuth)         | Familiar; gives a rate-limit identity; account recovery | Stores sensitive personal questions; GDPR duties; login, abuse, support work |
| Share-link only                                | Already built                                           | Not a sync; links carry the question in the URL fragment                     |

Recommendation: ship export/import in M5, then reconsider; if sync is built, prefer the encrypted-blob option because question text is personal. This is a recommendation, not a researched legal conclusion; privacy law applicability is **unverified**.

## 4. Milestones

### 4.1 Ordering review: localization, per-deck meanings, images, LLM

The working recommendation in the brief was "localization scaffold first". After reading the code I would adjust it slightly.

**Challenge 1: a short hardening step comes before localization.** Localization changes card text tables and share/history shape; doing it before ids, seeds and history parsing are frozen risks silent data loss and broken replays (gaps 3, 5, 6). The hardening work is small (M1) and also gives the first real-browser evidence, which the later refactors rely on.

**Challenge 2: the real prerequisite is "typed facts out of Compare", not translation.** The English prose in `compare.ts` and `fallback.ts` blocks both localization and a clean LLM prompt (gap 2). So M2 starts with L1, then the scaffold. The scaffold itself is cheap now because only about 20 UI strings exist.

**Resulting order and reasons.**

| Order                                 | Reason                                                                                                                                                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Hardening (M1)                     | Cheap, removes data-loss and replay risks, gives browser evidence. Fixes the keystroke-per-request trigger that would otherwise cost money later.                                                                                |
| 2. Text and structure (M2)            | Typed facts serve both i18n and the LLM prompt. Cheapest while the UI is tiny. Settles the text-table shape that per-deck meanings need.                                                                                         |
| 3. Imagery + accessibility (M3)       | Independent of M2 technically (can run in parallel with a second developer), but placed here so the first public deploy has a real look and passes basic accessibility. Images and A1 share the board code, so do them together. |
| 4. LLM (M4)                           | Needs F4, L1 and L2 (reply language), plus owner decisions on cost and privacy. Highest unknowns, so it comes after the app is presentable and measurable.                                                                       |
| 5. Journal, spreads, daily (M5)       | Needs the versioned schema (F3). Journal export is the durability answer.                                                                                                                                                        |
| 6. Decks, content depth, locales (M6) | Per-deck meanings need the L3 shape; Thoth and Marseille carry the most content and licence risk, so last among content.                                                                                                         |
| 7. PWA (M7)                           | Needs images (cache size) and e2e tests (service worker regressions).                                                                                                                                                            |
| 8. Accounts decision (M8)             | Only after real use shows the need.                                                                                                                                                                                              |

**When to deviate.** If the owner wants a public demo with AI as the headline, M4 can move before M3, but only after the F4 fix and a spend limit are in place, and the demo would look text-only. If a second language is needed at launch, pull a single locale's L3 and translation into M3.

### 4.2 M1 Hardening

- **Goal:** the existing app is verified in real browsers, its stored data is safe to evolve, and it cannot send a request per keystroke.
- **Exit criteria (checkable):**
  - `npx playwright test` passes on Chromium, Firefox and WebKit in CI.
  - A snapshot test fails if any of the 78 card ids, either deck's card order, or the seeded deal for each spread changes.
  - A history list with one corrupt entry still shows the other entries (test).
  - A `v: 1` fixture opens through the migration chain; a payload with an unknown future `v` shows an error message.
  - Editing the question never triggers an interpret call (test with a spy provider).
  - Screenshots at 360 px and 1280 px are attached to the PR for review.
- **Unblocks:** M2, M3, M4.

### 4.3 M2 Text and structure split

- **Goal:** structure and text are separate; the app runs in English through the new scaffold; Compare output is typed data.
- **Exit criteria:**
  - `compare()` returns typed facts and no English strings; `src/domain/` contains no user-facing English literals (lint rule or test that greps).
  - All UI strings come from the typed dictionary; adding a key to English without a value in a declared-complete locale fails typecheck.
  - `<html lang>` follows the locale.
  - Card, spread and meaning text read from per-locale tables; an English-only locale passes the coverage test; a stub second locale with partial coverage falls back to English per key (test).
  - All pre-existing tests pass with unchanged expectations about meaning.
- **Unblocks:** M4 (prompt facts, reply language), M6 (per-deck tables, translations).

### 4.4 M3 Usable and presentable

- **Goal:** the app works by keyboard, touch and screen reader, shows real card images with documented licences, and is deployed publicly as a static site.
- **Exit criteria:**
  - Every one of the 78 cards has an image file with a manifest row (licence template, author, source URL, checked date) and alt text; a test fails if any row is missing.
  - A keyboard-only Playwright test completes a three-card setup; a click-to-place flow test completes one without dragging.
  - A manual pass with VoiceOver and one other screen reader is recorded in the PR.
  - Lighthouse or an equivalent accessibility check reports no contrast failures on main views (tool choice **unverified** here).
  - A production build deploys to the chosen host from CI; a smoke test hits the deployed URL.
- **Unblocks:** M4 (an interpretable, demonstrable UI), M7.

### 4.5 M4 LLM interpretation

- **Goal:** an optional AI interpretation of a completed reading, validated, rate-limited, with a safe fallback.
- **Exit criteria:**
  - The key exists only in the host's secret store; a CI grep finds no key-like strings in `dist/`.
  - The proxy rejects malformed or oversized input, and answers a 429 with a user-visible message.
  - A contract test with a recorded or mocked reply passes `interpretationSchema`; tests prove each failure case (refusal, truncation, schema failure, 429, network error) returns the fallback interpretation.
  - The UI labels which provider produced the text, and has an off switch.
  - A spend limit is set on a dedicated workspace (checked by the owner, recorded in the PR).
  - The privacy notice is in the app.
- **Unblocks:** M6 theme-aware prompts; later evaluation work.

### 4.6 M5 Journal, spreads, daily card

- **Goal:** the app is useful repeatedly: notes, tags, search, export/import, more spreads, a daily card.
- **Exit criteria:**
  - Export then import round trips a journal byte for byte in structure (test); an import of invalid data changes nothing.
  - At least 6 built-in spreads, each passing a layout test.
  - A custom spread can be made, saved, shared by link (definition embedded) and opened on a clean browser profile (Playwright test).
  - The daily card is stable across reloads on the same date and changes the next day (test with a fake clock).
- **Unblocks:** M8 decision input.

### 4.7 M6 Decks, content depth, locales

- **Goal:** richer content and reach.
- **Exit criteria:**
  - Theme notes exist for all 78 cards and the completeness test requires them.
  - Per-deck override layer in use by at least one deck variant.
  - Compare includes dominant number and repeated number checks (the design doc already lists them).
  - Decan dates either verified from a cited source or labelled as a modern convention in the UI.
  - Each added locale passes coverage or declares partial coverage.
  - Thoth and Marseille: only if the numbering and licensing open decisions are closed; names, numbering and correspondences are cited to a primary source in `docs/research/sources.md`.
- **Unblocks:** wider release.

### 4.8 M7 PWA and offline

- **Goal:** installable, works offline, updates safely.
- **Exit criteria:** valid manifest with 192 and 512 px icons; offline Playwright test loads the app and a deal with the network disabled; release test proves an old service worker updates (new version appears after reload); cache size budget documented.
- **Unblocks:** notifications for the daily card (not planned).

### 4.9 M8 Accounts and sync decision

- **Goal:** a written decision, not code.
- **Exit criteria:** decision record based on journal usage, the options table in 3.10 and privacy review; if yes, a separate plan.

## 5. Task breakdown per milestone

Each task should fit one commit. Convention: write the failing test first, keep `npm run typecheck`, `lint`, `test` and `build` green. "Proof" names the test that shows the task is done.

### 5.1 M1 Hardening

| ID    | Task                                                                      | Acceptance                                                                                              | Proof                                    |
| ----- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| M1.1  | Add Playwright, config, `npm run e2e`, one smoke test (page loads)        | Test passes locally on three browsers                                                                   | `e2e/smoke.spec.ts`                      |
| M1.2  | e2e: simulate deal, interpretation visible, seed shown                    | Deal produces N cards for each spread                                                                   | `e2e/simulate.spec.ts`                   |
| M1.3  | e2e: setup via menus and via keyboard drag; log what fails                | Test passes, or failures recorded as issues with screenshots                                            | `e2e/setup.spec.ts`                      |
| M1.4  | e2e: save, reload, open saved; copy share link, open in new context       | State restored equal to original                                                                        | `e2e/persist.spec.ts`                    |
| M1.5  | CI job for Playwright (cache browsers, upload report on failure)          | PR run shows the job                                                                                    | Green CI run                             |
| M1.6  | Snapshot test of 78 card ids and both decks' order                        | Test fails when an id or order changes                                                                  | `src/content/decks/decks.test.ts`        |
| M1.7  | Snapshot of a seeded deal per spread                                      | Same seed, same cards forever                                                                           | `src/domain/deal.test.ts` addition       |
| M1.8  | Per-entry history parsing                                                 | One invalid entry is skipped, others load                                                               | `src/features/history.test.ts`           |
| M1.9  | Versioned migration chain for shared payloads and history                 | `v: 1` fixtures load through migrate; unknown `v` returns an explicit error                             | `src/domain/share.test.ts`, fixtures     |
| M1.10 | Visible error for bad share link                                          | Opening `#r=garbage` shows a dismissible message and keeps current state                                | Component test in `src/App.test.tsx`     |
| M1.11 | Interpretation trigger: explicit run, hash cache, loading and error state | Typing in the question box makes zero provider calls; reading change invalidates; failure shows message | `src/ui/Layout` test with a spy provider |
| M1.12 | App error boundary with reset                                             | A thrown render error shows a reset button; reset restores a working app                                | Component test                           |
| M1.13 | Record the `npm audit` decision                                           | `docs/research/` note or README line: advisory, why unfixed, re-check date                              | Reviewed diff (no automated test)        |

### 5.2 M2 Text and structure split

| ID    | Task                                                                   | Acceptance                                                                                  | Proof                                          |
| ----- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| M2.1  | Define `Fact` union types and make `compare()` return facts + hinge    | `compare()` returns no strings; same facts as the old relations for each existing test case | Rewritten `src/domain/compare.test.ts`         |
| M2.2  | English fact renderer and fallback uses it                             | Fallback output text equals pre-change text for existing fixtures                           | `src/domain/fallback.test.ts` (golden strings) |
| M2.3  | Plural and list helpers on `Intl.PluralRules`                          | "falls" vs "fall" and similar produced by the helper                                        | Unit tests for the helper                      |
| M2.4  | UI dictionary type, `t()`, locale in store                             | Missing English key fails typecheck                                                         | Typecheck + store test                         |
| M2.5  | Move hardcoded UI strings to the dictionary                            | No visible string literals in `src/ui` and `src/features` (lint or grep test)               | Grep test; component tests still pass          |
| M2.6  | `<html lang>` and a locale switcher (English only, stub second locale) | Switching sets `document.documentElement.lang`                                              | `src/App.test.tsx`                             |
| M2.7  | Localized dnd-kit instructions and announcements                       | Announcements use dictionary strings and position-based wording                             | Component test on live region                  |
| M2.8  | Split card names, spread text and meanings into per-locale text tables | Structure files hold ids only; English table complete                                       | Existing completeness test, retargeted         |
| M2.9  | Locale fallback and per-locale coverage test                           | Partial locale falls back per key to English; a declared-complete locale must be complete   | `src/content/coverage.test.ts`                 |
| M2.10 | Share payload carries no locale; history stores none                   | Link opens in the viewer's locale                                                           | `src/domain/share.test.ts`                     |
| M2.11 | Lint rule: no user-facing string literals in `src/domain`              | Rule fails on a sample violation                                                            | ESLint rule test or CI step                    |

### 5.3 M3 Usable and presentable

| ID    | Task                                                                        | Acceptance                                                                            | Proof                                             |
| ----- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- |
| M3.1  | Pick one Wikimedia scan set; record decision in `sources.md`                | Set named with category URL and reason                                                | Reviewed diff                                     |
| M3.2  | Image manifest schema (file, licence template, author, source URL, checked) | Zod schema validates the manifest                                                     | `src/content/images/manifest.test.ts`             |
| M3.3  | Check and record licences for all 78 files                                  | 78 rows; each row's page was opened by a person or script and recorded                | Manifest completeness test                        |
| M3.4  | Optimise images (script, sizes, formats); document the command              | Total size under a stated budget; widths generated                                    | Script check + size test                          |
| M3.5  | Add `image` data through an overlay (reviewed model change if canonical)    | Cards resolve to an image path or `undefined` for decks without art                   | Unit test on resolver                             |
| M3.6  | Alt text per card (localizable)                                             | Every image has non-empty alt; alt is in the text table                               | Coverage test                                     |
| M3.7  | Card image component with lazy load and reversed state                      | Reversed shows rotation and a text label                                              | Component test                                    |
| M3.8  | Board and palette use images; fix rotated slot label                        | Celtic Cross crossing card keeps readable label                                       | Component test + screenshot                       |
| M3.9  | Make menu placement prominent and add click-to-place flow                   | A card can be placed with clicks only                                                 | e2e test                                          |
| M3.10 | Keyboard sensor tuning (`getNextCoordinates`, position announcements)       | Keyboard-only e2e places three cards                                                  | `e2e/keyboard.spec.ts`                            |
| M3.11 | Touch: handle or long-press activation, page scrolls normally               | On an emulated phone, scrolling over the palette works and drag works from the handle | e2e with mobile emulation; real-device note       |
| M3.12 | Contrast, focus and reduced-motion pass                                     | No contrast failures on main views; focus visible                                     | Automated a11y check in e2e (tool **unverified**) |
| M3.13 | Screen reader manual pass, recorded                                         | Notes and any issues filed                                                            | PR checklist                                      |
| M3.14 | Static deploy workflow (host chosen in open decisions)                      | Push to `main` deploys; `base` configured if on a subpath                             | CI run plus smoke test of deployed URL            |

### 5.3a Design system (runs alongside M3; proposal in `DESIGN.md`)

All values in `DESIGN.md` are provisional until D1 lands. Do D1 to D5 before M3.7 and M3.8 (card image component and board), so images drop into a finished frame.

| ID  | Task                                                                                                         | Acceptance                                                                                       | Proof                                          |
| --- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| D0  | Owner decides the 8 open decisions in `DESIGN.md`                                                            | Each row marked accepted or changed in the file                                                  | Reviewed diff                                  |
| D1  | `src/ui/tokens.css`: colour, space, radius, motion tokens, light and dark; replace raw values in `styles.css` | No hex or px literal outside the tokens file; both themes render                                 | grep check in CI plus a screenshot per theme   |
| D2  | Fonts: add `@font-face`, check Cyrillic coverage of the bundled JetBrains subset, choose a display serif     | Russian and English card names render without fallback glyphs; licences recorded in `sources.md` | Test page with all 78 names in both locales    |
| D3  | Shared controls: Button, Field, Toggle, Tabs (selected state not weight alone), StatusNote                   | Each has all states from `DESIGN.md`; focus ring and 44 px touch target                          | Component tests plus a dev-only catalogue page |
| D4  | Slot and CardFace (typographic face, upright and reversed, hinge); fix the rotated-slot label               | Celtic Cross crossing card keeps a horizontal readable label; reversed shows the word            | Component test plus screenshot                 |
| D5  | Chip and Badge: hinge, four element chips with glyph and word                                                | Colour never the only cue; contrast at least 4.5:1                                               | Unit test on contrast tokens                   |
| D6  | Theme: follow the OS, plus a manual toggle stored locally                                                    | `data-theme` override works; no flash on load                                                    | Component test                                 |
| D7  | Responsive layout: one column below 56rem, board plus sticky interpretation above; Celtic Cross fits 360 px  | No horizontal page scroll at 360 px                                                              | Playwright viewport test (with M3.11)          |
| D8  | Inline SVG icon set (four suits, four elements, close, check)                                                | Each icon has an accessible name or is `aria-hidden` beside text                                 | Component test                                 |
| D9  | Contrast test for tokens                                                                                     | Computes the WCAG ratio for every text and border pair in both themes; fails under 4.5 or 3      | `src/ui/tokens.test.ts`                        |
| D10 | `/design-review` pass at the end of M3, then reconcile `DESIGN.md` with the built values                     | `DESIGN.md` no longer says "provisional"                                                         | Reviewed diff                                  |

### 5.4 M4 LLM interpretation

| ID    | Task                                                                          | Acceptance                                                                                            | Proof                                            |
| ----- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| M4.1  | Decide and record: host, model tier, privacy stance, rate-limit approach      | Decision section filled in this doc or an ADR                                                         | Reviewed diff                                    |
| M4.2  | Proxy skeleton: POST route, input Zod validation, size cap, origin check      | Bad input gets 4xx, never reaches the API                                                             | Function unit tests                              |
| M4.3  | Secret handling and local dev setup                                           | Key only in host secret store and an ignored local file; documented                                   | CI grep of `dist/`; `.gitignore` check           |
| M4.4  | JSON schema for structured output derived from the Zod schema                 | Passes the documented constraints (`additionalProperties: false`, no length keywords)                 | Schema conversion test                           |
| M4.5  | Prompt builder from Steps 1 and 2 data (typed facts, correspondences, themes) | Snapshot of the prompt for fixture readings; question marked as untrusted data                        | Prompt snapshot tests                            |
| M4.6  | Upstream call and response handling                                           | Handles `end_turn`, `refusal`, `max_tokens`, 400, 429 (with and without `retry-after`), network error | Mock-upstream tests                              |
| M4.7  | Client `llmProvider` implementing `InterpretationProvider`                    | Valid reply parses; every failure resolves to `fallbackProvider`                                      | Provider tests with mock fetch                   |
| M4.8  | UI: provider toggle, source label, loading, error, privacy note               | Off by default or clearly explained; label shows which provider wrote it                              | Component tests                                  |
| M4.9  | Server cache and rate limit shield                                            | Same reading hash returns cached result; excess requests get 429                                      | Function tests; note rate limiter is approximate |
| M4.10 | Locale in request and prompt                                                  | Reply language follows locale; unknown locale falls back to English                                   | Prompt snapshot per locale                       |
| M4.11 | Evaluation fixtures and runner                                                | 10 or more fixture readings checked for: all cards used, no invented cards, within schema             | `npm run eval` (manual, not CI)                  |
| M4.12 | Spend limit and monitoring checklist                                          | Owner confirms workspace limit and an alert                                                           | PR checklist                                     |

### 5.5 M5 Journal, spreads, daily card

| ID   | Task                                                            | Acceptance                                                          | Proof                                 |
| ---- | --------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| M5.1 | Journal schema v2: notes, tags, edited-at, migration from v1    | v1 entries migrate without loss                                     | Migration fixtures                    |
| M5.2 | Notes and tags UI; edit and delete                              | Changes persist across reload                                       | Component + e2e                       |
| M5.3 | Search and filter by text, tag, spread, date                    | Filters combine correctly                                           | Unit tests on filter function         |
| M5.4 | Export and import JSON with a version field                     | Round trip equal; invalid file changes nothing; shows a clear error | Unit tests, e2e with file upload      |
| M5.5 | Ask for persistent storage on first save, report quota errors   | Quota error shown to user (try/catch on write)                      | Unit test with throwing storage       |
| M5.6 | Add 3 or more built-in spreads with localizable position text   | Each passes the layout test                                         | `src/content/spreads/spreads.test.ts` |
| M5.7 | Custom spread editor (data model and validation first, then UI) | Invalid spreads rejected with reasons; editor usable by keyboard    | Unit tests, then e2e                  |
| M5.8 | Share payload v2 embeds a custom spread                         | Link opens on a clean profile                                       | e2e in two browser contexts           |
| M5.9 | Daily card                                                      | Stable per local date; changes at midnight; interpretation works    | Unit test with fake timers            |

### 5.6 M6 Decks, content, locales

| ID    | Task                                                                                            | Acceptance                                                                                                | Proof                        |
| ----- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------- |
| M6.1  | Layered meaning tables with per-deck overrides                                                  | Lookup is `override ?? base`; orphan overrides fail                                                       | `src/content/meanings` tests |
| M6.2  | Theme notes: Major Arcana (22 cards x 4)                                                        | Original wording, passes completeness test for majors                                                     | Completeness test            |
| M6.3  | Theme notes: four suits, one PR per suit                                                        | As above                                                                                                  | Completeness test            |
| M6.4  | Interpreter and prompt use the matching theme                                                   | Theme selector changes the output; no theme falls back to base                                            | Unit tests                   |
| M6.5  | Compare: dominant and repeated number facts                                                     | Two 5s yields a repeated-number fact                                                                      | `compare.test.ts`            |
| M6.6  | Decan dates: source or label                                                                    | Either citation added in `sources.md` or UI text says "modern convention"                                 | Reviewed diff + content test |
| M6.7  | First extra locale: UI dictionary                                                               | Declared-complete; reviewed by a fluent reader                                                            | Coverage test + review       |
| M6.8  | First extra locale: card names, spreads, meanings                                               | Declared complete or partial with fallback                                                                | Coverage test                |
| M6.9  | Marseille and Thoth research note: numbering, names, correspondences, licences, primary sources | Note in `docs/research/` with cited sources; owner go or no-go                                            | Reviewed diff                |
| M6.10 | Implement one extra deck if go                                                                  | Card list, text and correspondences present; deal and Compare tests pass; deck declares which rules apply | Deck tests                   |

### 5.7 M7 and M8

| ID   | Task                                                             | Acceptance                                                           | Proof                        |
| ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------- |
| M7.1 | Web app manifest and icons (192 and 512 px)                      | Installable in Chromium                                              | Manual check + manifest test |
| M7.2 | Service worker: precache shell, runtime cache images, versioning | App loads offline                                                    | e2e with network off         |
| M7.3 | Update flow: new version prompts or applies on next load         | Old worker replaced after a release                                  | e2e simulating two versions  |
| M7.4 | Offline LLM path degrades to fallback with a clear note          | No uncaught errors offline                                           | Component test               |
| M8.1 | Write a sync decision record                                     | Options 3.10 evaluated against real journal usage and privacy review | Reviewed doc                 |

## 6. Risks and open decisions for the owner

| #   | Decision or risk                            | Why it matters                                                                                                                    | Suggested default                                                                                      |
| --- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Image licences                              | Public-domain status is per file; the Commons category warns that colorized versions may be copyrighted. 77 of 78 pages unchecked | One chosen set, manifest with a checked date, no colorized sets                                        |
| 2   | Content licensing and wording               | `docs/research/sources.md` requires original wording; theme notes are 312 new pieces of text                                      | Write from structure and Waite (public domain), review for originality                                 |
| 3   | Thoth and Marseille                         | Copyright on Thoth art; numbering and card names unverified; Marseille modern restorations unverified                             | Names and meanings only, no art; research note first (M6.9)                                            |
| 4   | LLM on or off, and default                  | Questions are personal; reading and question go to a third party                                                                  | Opt-in, clear notice, fallback always available                                                        |
| 5   | LLM cost control                            | No accounts means no stable key to limit on; Cloudflare limiter is approximate and per location                                   | Dedicated workspace spend cap, small model, `max_tokens`, server cache, session token                  |
| 6   | Data retention wording                      | Two official pages describe default retention differently (not retained by default vs deleted within 30 days)                     | Tell users "up to 30 days" until the owner confirms with Anthropic, and whether zero retention applies |
| 7   | Proxy hosting                               | Cloudflare Pages Functions fits (secrets, free tier, static free); Vercel not evaluated here                                      | Cloudflare Pages for site and function                                                                 |
| 8   | Schema versioning                           | Share links and history are public contracts once users have them                                                                 | Do F3 in M1, never remove a migration                                                                  |
| 9   | Translation quality                         | Machine drafts of tarot text can be wrong in subtle ways; a fluent reviewer is needed per locale                                  | One locale at a time, reviewer named per locale, partial locale allowed with English fallback          |
| 10  | Which locales and in what order             | Drives M6 content effort                                                                                                          | Owner picks; start with one                                                                            |
| 11  | Analytics                                   | Privacy-respecting expectations for a divination journal                                                                          | None in v1                                                                                             |
| 12  | `npm audit` advisory                        | Fix is a breaking downgrade of a dev tool                                                                                         | Accept and track (M1.13)                                                                               |
| 13  | Accessibility target                        | WCAG 2.2 AA is the sensible bar (2.5.7 dragging, 3.1.1 language)                                                                  | Adopt AA and record exceptions                                                                         |
| 14  | Storage durability                          | Local only, evictable, Safari 7-day rule                                                                                          | Export/import in M5; sync only after M8 decision                                                       |
| 15  | Content tone and disclaimers                | Readings can touch health, money and relationships; the LLM may drift into advice                                                 | Entertainment and reflection disclaimer; prompt rule against medical, legal and financial instructions |
| 16  | Prompt injection through the question field | The question is user text inside an LLM prompt                                                                                    | Mark as data, validate output, render as plain text                                                    |

### Decisions taken (2026-11-10)

Numbers match the table above; each is a closed `decision` issue. Fifteen of sixteen follow the suggested default.

- **#1.** One Wikimedia Commons scan set plus a per-file manifest (licence, author, source URL, checked date); no colourized sets; a test fails on any missing row.
- **#2.** Write from structure and Waite (public domain) in original wording; review each batch for originality; split PRs per suit.
- **#3.** Thoth and Marseille: names and meanings only, no art; research note first (M6.9).
- **#4.** LLM is opt-in with a clear notice, a visible off switch, and the offline interpreter always available.
- **#5.** Layered caps: dedicated workspace with a hard spend cap, small model, `max_tokens`, server-side cache, session token; Cloudflare limiter only as a soft extra.
- **#6.** Tell users "up to 30 days" until retention is confirmed with Anthropic.
- **#7.** GitHub Pages for the static site plus a SEPARATE proxy host for the LLM function. Follow-up: choose the proxy host (open), and set Vite `base` for the repo subpath (M3.14).
- **#8.** Migration chain now: add a `v` field and a chain of migrate functions (M1.9); never delete a migration.
- **#9.** One locale at a time with a named reviewer; partial locales allowed with English fallback.
- **#10.** Get Russian reviewed first, then add one locale at a time.
- **#11.** No analytics in v1.
- **#12.** Accept and track: dev-only advisory; record the reason and a re-check date (M1.13).
- **#13.** WCAG 2.2 AA; record exceptions.
- **#14.** Export/import in M5; decide on sync only at M8.
- **#15.** Entertainment-and-reflection disclaimer in the app plus an LLM prompt rule against medical, legal and financial instructions.
- **#16.** Mark the question as untrusted data in the prompt, validate the reply with the Zod schema, render output as plain text.

**Deviation:** #7 chose GitHub Pages instead of Cloudflare Pages, so the LLM proxy needs its own host. That host is not chosen yet; decide it before M4. Design decisions 1 to 8 are recorded in `DESIGN.md`.

Other risks: model ids and prices change (confirm at build time, as `docs/research/interpretation-design.md:38-39` already says); a service worker can serve stale code; big content PRs are hard to review (split per suit or per locale).

## 7. Sources

All fetched 2026-11-10 unless noted. Paraphrased, not copied.

| Id  | URL                                                                                                                        | Supported                                                                                                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | https://platform.claude.com/docs/en/about-claude/models/overview                                                           | Model ids `claude-haiku-5-5`, `claude-sonnet-5-5`, `claude-opus-5-5`, prices per million tokens (Haiku shown as "from"), cache-read discount, max output 128K, retirement dates         |
| S2  | https://platform.claude.com/docs/en/api/messages                                                                           | `POST /v1/messages`; required `model`, `max_tokens`, `messages`; optional top-level `system`. Page was truncated; header list and `x-api-key` not confirmed from this page (unverified) |
| S3  | https://platform.claude.com/docs/en/build-with-claude/structured-outputs                                                   | GA structured outputs via `output_config.format` JSON schema; supported and unsupported schema keywords; refusal and `max_tokens` failure modes (last 6,003 characters not read)        |
| S4  | https://dndkit.com/api-documentation/sensors/keyboard (redirected from docs.dndkit.com)                                    | Keyboard sensor is a default sensor; Space/Enter start and end, Escape cancel; 25 px arrow step; `getNextCoordinates`                                                                   |
| S5  | https://dndkit.com/guides/accessibility (redirected from docs.dndkit.com)                                                  | Default `role`, `aria-roledescription`, instructions, live-region announcements; English only; customizable via `screenReaderInstructions` and `announcements`                          |
| S6  | https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html                                                        | SC 2.5.7 Dragging Movements (AA): a single-pointer alternative is needed; keyboard support alone does not satisfy it                                                                    |
| S6b | https://www.w3.org/TR/WCAG22/ (fetched; page truncated)                                                                    | Confirmed 2.5.7 and 2.5.8 are AA. The 24 by 24 CSS px figure for 2.5.8 came from the fetch tool's own recall, **unverified**                                                            |
| S7  | https://platform.claude.com/docs/en/api/rate-limits                                                                        | Spend limits, workspace limits (not on default workspace), 400 on self-set limit, 429 on tier cap without `retry-after`, ITPM excludes cache reads, token bucket                        |
| S8  | https://platform.claude.com/docs/en/manage-claude/api-and-data-retention                                                   | Retained data not used for training without permission; says conversation content is not retained by default except covered cases; ZDR and HIPAA arrangements                           |
| S8b | https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data                                | API inputs and outputs deleted within 30 days by default, with exceptions; training use by default not stated on the page. Conflicts in wording with S8; owner to confirm               |
| S9  | https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck                                                         | Several 78-file scan sets; public domain in US and UK for the original deck; some colorized versions may remain copyrighted; per-file licences apply                                    |
| S10 | https://commons.wikimedia.org/wiki/File:RWS_Tarot_00_Fool.jpg                                                              | Only file checked: public-domain mark, author Pamela Colman Smith, death-year and pre-1931 publication rationale, 1,144 x 1,919 px, about 1.1 MB                                        |
| S11 | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria                          | localStorage limits (5 to 10 MiB), best-effort vs persistent eviction, Safari 7-day rule, `navigator.storage.persist()`                                                                 |
| S12 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules                          | Locale-aware plural categories                                                                                                                                                          |
| S13 | https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html                                                          | SC 3.1.1 Language of Page (A); 3.1.2 Language of Parts (AA)                                                                                                                             |
| S14 | https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable                           | Manifest members, HTTPS, service worker not required for installability, browser differences                                                                                            |
| S15 | https://developers.cloudflare.com/pages/functions/                                                                         | Pages Functions run on Workers                                                                                                                                                          |
| S16 | https://developers.cloudflare.com/pages/functions/pricing/ and https://developers.cloudflare.com/pages/functions/bindings/ | Billing as Workers requests, 100,000 per day shared on free plan, static requests free; secrets via `context.env`, encrypted in dashboard, `.dev.vars` locally                          |
| S17 | https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/                                                | Rate-limit binding: key choice, 10 or 60 second periods, per location, approximate and eventually consistent                                                                            |
| S18 | https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API                                                        | Service worker lifecycle, secure context, offline caching pattern, update timing                                                                                                        |
| S19 | https://vite.dev/guide/static-deploy                                                                                       | Static hosts covered; `base` for subpath deploys                                                                                                                                        |
| S20 | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits                                     | 1 GB site, soft 100 GB per month, no commercial online business use                                                                                                                     |
| S21 | https://playwright.dev/docs/intro                                                                                          | Install, run, Chromium/Firefox/WebKit, mobile emulation. The `webServer` option was not covered on this page                                                                            |

### Unverified or not done

- WCAG 2.5.8 target size figure (S6b).
- Vercel as a proxy host (not fetched).
- Playwright `webServer` configuration, Vitest browser features, and accessibility tooling choice (not fetched).
- Haiku 5.5 exact price ("from" only on S1).
- Licences of 77 of 78 Wikimedia files; public-domain status of any Marseille scans; Thoth copyright term (kept as "still copyrighted" per `docs/research/sources.md`).
- Marseille and Thoth card numbering and names (needs primary source).
- Whether API data trains models by default; which of S8 and S8b describes the default retention.
- Legal duties for storing user questions (privacy law), cost figures in 3.5 (my estimate).
- No WAI-ARIA Authoring Practices page was fetched; the drag-and-drop alternative guidance here rests on WCAG 2.5.7 (S6) and the dnd-kit docs only.
