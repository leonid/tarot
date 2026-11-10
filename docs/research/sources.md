# Sources and licensing

Written 2026-11-10. Decisions on where card content and imagery come from.

## Card meanings (text)

- **Policy:** all meaning text in `src/content/meanings.ts` is original wording.
  Never paste from books or websites.
- **Reference material that is safe to read and paraphrase:**
  - A. E. Waite, *The Pictorial Key to the Tarot* (1911). Public domain.
  - Traditional keywords and the Golden Dawn attributions (*Book T*), which are
    a system of facts rather than expression.
- **Project methodology:** `The Structural Tarot Method` in this folder (the
  owner's own guide). It defines the interpretation pipeline (see
  `interpretation-design.md`) and the astrological correspondence tables
  (Part IV) that future content work should encode as data.
- **Do not copy:** modern commercial guidebooks and the text of websites. Facts
  (a card's suit, number or decan) are fine; their prose is not.

## Card imagery

- The 1909 Rider-Waite-Smith art by Pamela Colman Smith is public domain in the
  US and in most of the world. Wikimedia Commons hosts scans, so check each
  file's licence page before bundling it.
- Modern decks (Thoth/Crowley-Harris, most contemporary decks) are still under
  copyright. Do not bundle their art.
- **v1 plan:** typographic placeholders (name, number, suit glyph), then
  swap in verified public-domain RWS scans. The `Card` model carries no image
  path yet, so adding one will be a deliberate, reviewed change.

## Open items

- [ ] Verify the licence of each Wikimedia scan chosen for bundling.
- [ ] Encode Book T tables (Major signs and planets, 36 decans, court spans) as
      typed data, cross-checked against two independent sources.
