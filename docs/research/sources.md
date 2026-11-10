# Sources and licensing

Written 2026-11-10. Decisions on where card content and imagery come from.

## Card meanings (text)

- **Policy:** all meaning text in `src/content/meanings/` is original wording.
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
- [x] Encode Book T tables (Major signs and planets, 36 decans, court spans) as
      typed data in `src/content/correspondences.ts`. Transcribed from Part IV
      of the owner's guide. Cross-check status is in the next item; structural tests check the decan rulers (Chaldean order), the
      2-3-4 / 5-6-7 / 8-9-10 sign rule and that the 12 court spans tile the
      zodiac, which catches transcription slips but not a wrong source.
- [~] Cross-check `correspondences.ts` against independent sources, done
      2026-11-10 with two web pages, **partly**:
  - Confirmed by both [Kerykeion](https://www.kerykeion.net/content/learn-tarots/guides/Minor_Arcana_Decans)
    and [Astrologers' Co-Op](https://astrologerscoop.substack.com/p/mystical-echoes-the-connection-between):
    all 36 decan signs and planetary rulers, and the suit-to-sign mapping
    (2-4 cardinal, 5-7 fixed, 8-10 mutable). No discrepancies.
  - Confirmed by the Co-Op page only: the Major Arcana planets and signs it
    lists (Magician, Priestess, Empress, Wheel, Tower, Sun, and the 12 signs).
    It also reads "Saturn: Death", which does not match our World = Saturn;
    unresolved, probably a heading about decans, to check against a primary
    source. Not checked at all: The World, Fool, Hanged Man, Judgement.
  - Court spans: [Creekside](https://creeksideastro.substack.com/p/court-cards-and-decans)
    gives only the pattern, not per-card spans. Its Queen rule (last decan of
    a mutable sign plus first two of a cardinal) matches ours, as does its
    Queen of Swords example. Its Knight and King patterns look swapped
    against ours only because it uses a different naming convention (its
    King is the fire court, our Knight). The structure agrees; the
    per-card degrees are still single-sourced (the owner's guide).
  - **Not confirmed:** the Book T titles ("Lord of ...") and the decan date
    ranges. Kerykeion gives Thoth-style titles (for example Debauch, Indolence,
    Truce), which match ours for 22 cards and differ for the rest; that is a
    different title set, not evidence of an error. A primary Book T text is
    needed for titles.
  - Court-name convention matters: which RWS court (Knight or King) is fire
    varies between authors. We follow the owner's guide (Knight fire, Queen
    water, King air, Page earth).
