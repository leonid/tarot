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
- [x] Cross-check `correspondences.ts` against independent sources
      (2026-11-10).
  - **Primary source:** an archive.org OCR copy of *Book T - The Tarot*
    (Mathers and Felkin; manuscripts N, O, P, Q, R), identifier
    `mathers-and-felkin-golden-dawn-book-t-the-tarot-1888`. The OCR has errors
    and the card-to-title pairing was read from column order, so treat it as
    strong but not flawless evidence. A second archive.org item
    (`book-t-the-tarot`) was not read.
  - **Confirmed against Book T:** all 12 senior court spans and the Page
    quadrant thrones; the court naming (Book T King = RWS Knight, Prince = RWS
    King, Princess = Page); Death = Scorpio; Hanged Man = Water; Judgement =
    Spirit and Fire; The World = Saturn (Book T adds Earth); 30 of the 36
    titles.
  - **Corrected to Book T (the owner's guide differs):** 10 of Cups "Perfected
    Success" (guide: Happiness), 2 of Swords "Peace Restored", 6 of Swords
    "Earned Success" (guide: Science, a Thoth title), 8 of Swords "Shortened
    Force" (guide: Interference, Thoth), 9 of Swords "Despair and Cruelty",
    4 of Pentacles "Earthly Power". The guide's Table 2 still carries the old
    wording.
  - **Confirmed by two web pages:** all 36 decan signs and rulers and the
    2-3-4 / 5-6-7 / 8-9-10 rule ([Kerykeion](https://www.kerykeion.net/content/learn-tarots/guides/Minor_Arcana_Decans),
    [Astrologers' Co-Op](https://astrologerscoop.substack.com/p/mystical-echoes-the-connection-between)),
    plus the Co-Op page's major planets and signs. Its "Saturn: Death" line
    does not contradict Book T, which gives World = Saturn.
  - **Still unverified:** the decan date ranges (Book T gives none; ours come
    from the guide and are modern conversions). The Fool's attribution was not
    readable in the OCR (we keep Uranus, traditionally Air).
  - **Decided 2026-11-10:** The World is encoded as Saturn with traditional
    element Earth (Book T: "Earth and Saturn"), so the Compare step treats it
    as earth. Judgement stays Fire; Book T's "Spirit" has no element here.
