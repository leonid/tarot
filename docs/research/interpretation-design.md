# Interpretation design

## Pipeline: DCAS

`The Structural Tarot Method` (this folder) defines a four-step synthesis. The
app follows it, splitting the work between deterministic code and, optionally,
an LLM.

| Step | What it is | Who does it |
|---|---|---|
| **1. Decompose** | Per-card dossier: symbols, formula (element x number), correspondences, a field of 3-5 candidate meanings | Static content (`CardMeaning`, later correspondence tables) |
| **2. Compare** | Relationships between cards: elemental dignities, dominant element or number, repeated numbers, the hinge card | Deterministic code (`domain/elements.ts`, `domain/fallback.ts`) |
| **3. Anchor** | Tie each card to its position and the question, weight cards, pick one meaning per card | LLM provider (or the fallback's simpler stitching) |
| **4. Synthesize** | One sentence per card, an integration paragraph, one actionable close, then the self-check rubric | LLM provider |

Doing Step 2 in code means the LLM receives verified structure, not a request
to find it, and the offline fallback still returns something useful.

## Contract

`InterpretationProvider.interpret(ReadingContext): Promise<Interpretation>`

- `ReadingContext`: question, deck, spread, placements (with orientation) and
  the base-meaning table.
- `Interpretation` (validated by Zod in `domain/interpretation.ts`):
  per-card notes, relations, optional `hingeCardId`, summary, advice.
- Providers: `fallbackProvider` (offline, deterministic) today; an LLM provider
  later.

## LLM provider, planned

- A browser must never hold the API key. Plan: a thin proxy (Cloudflare Pages
  Function or Vercel function) holds the key and forwards the structured
  request. The proxy is not part of v1.
- The prompt carries the pre-computed Step 1 and Step 2 output and asks for
  Steps 3 and 4. Ask for JSON matching `interpretationSchema` and validate the
  reply with Zod. On a parse failure, fall back to `fallbackProvider`.
- Model ids and parameters change, so confirm them against the current Claude
  API documentation when this is built.

## Gaps to close in content work

- Per-card dossiers beyond keywords: symbols, formula, correspondences.
- Book T tables as typed data (see `sources.md`).
- Visual axes (direction, figure count, and so on) as optional per-card tags,
  if the comparison step should use them.
