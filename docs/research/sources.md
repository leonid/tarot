# Sources and licensing

Written 2026-11-10. Decisions on where card content and imagery come from.

## Card meanings (text)

- **Policy:** all meaning text in `src/content/meanings/` is original wording.
  Never paste from books or websites.
- **Reference material that is safe to read and paraphrase:**
  - A. E. Waite, *The Pictorial Key to the Tarot* (1911). Public domain.
  - Traditional keywords and the Golden Dawn attributions (*Book T*), which are
    a system of facts rather than expression.
- **Waite's own meanings as a second school:** `src/content/meanings/waite.ts`
  restates the divinatory meanings of the *Pictorial Key*, Part III (sections
  2 and 3), card by card, in our own words. Text checked on 2026-11-11 against
  Project Gutenberg eBook #43548 (*The Illustrated Key to the Tarot*, the 1918
  US reprint of Waite's text, public domain). Waite gives no reversed meaning
  for the Two of Cups, and the entry says so. Waite calls trump 8 Fortitude and
  trump 20 The Last Judgment; the table uses our card ids.
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

### Chosen image set (M3.1, decided 2026-11-10)

**Set:** the 1909 "Roses & Lilies" first edition, Wikimedia Commons category
[Rider-Waite tarot deck (Roses & Lilies)](https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)).

The owner confirmed this set "for now" on 2026-11-10; the Geldard set below
stays the alternative if the look is revisited.

Read from the Commons API on 2026-11-10:

- 80 files: the cards, named `RWS1909 - 00 Fool.jpeg` to
  `RWS1909 - Wands 14.jpeg`, plus two photographs of the whole deck that we
  do not use.
- All 80 report the licence "Public domain". The one file page read in full
  carries `{{PD-old-70-expired}}`, artist Pamela Colman Smith, date 1909.
- JPEG, 812 to 860 px wide, 23 MB in total before optimising.
- Described as scans of an original 1909 deck from a private collection; the
  source is a collector's blog post.

Why this set:

1. **Simplest provenance.** A direct scan of the first printing: one artist
   (died 1951), published 1909, nobody else's work in the file.
2. **Uniform.** One scanner, one naming pattern that maps to our card ids by
   number and suit, near-equal sizes.
3. **Small.** 840 px is enough for a card shown at up to about 400 CSS px on
   a 2x screen, and 23 MB of originals is easy to keep out of the repository
   history if we store only optimised files.

Sets considered and not chosen (same date, same API):

| Set (Commons category suffix) | Files | Format | Why not |
| --- | --- | --- | --- |
| Geldard | 78 | PNG, 2100 px, about 1 GB | The best looking: cleaned, even colour, transparent corners. But each file is an uploader's cleaned version of another scan ("source: Wikimedia Commons") tagged only `{{PD-old-70}}`, with no statement about the cleaning work. Faithful restoration probably adds no copyright, but that is a judgement, not a recorded fact. Fallback if the chosen scans look too worn in the interface. |
| TaionWC | 78 | JPEG, 1100 px, 70 MB | The 1910 "Pam-A" printing. Fine, and the licence tag is more detailed. Older file names (`Cups01.jpg`), and a later printing than the first edition, with no advantage for us. |
| Yale University | 10 | JPEG, 1840 px | Best provenance (Beinecke Library), but only 10 cards. |

Known limits of this decision:

- All 78 file pages were read by script on 2026-11-10 UTC (M3.3, see "Licence
  check" below). The script reads the licence template; it does not judge
  whether the template is right.
- "Public domain" here rests on the artist's death in 1951 (life plus 70) and
  1909 publication (US). A few countries have longer terms. A plain scan of a
  flat work adds no copyright in the US and, since 2019, in the EU.
- The scans show wear, a cream tone and a sliver of scanner background at the
  rounded corners. M3.4 should crop to the card and M3.7 clips the corners.

### Licence check (M3.3, 2026-11-10 UTC)

`node scripts/check-image-licences.mjs` reads the Commons file page of every
card in the set and writes `src/content/images/rws-1909.json`: one row per
card with the file, the licence template, the author, the page address and
the check date (the UTC day).

- Result: 78 of 78 pages carry `{{PD-old-70-expired}}` and no other
  public-domain template; author Pamela Colman Smith on all.
- The script writes nothing if any page has no accepted template, more than
  one, or no author. Accepted templates are listed in
  `src/content/images/manifest.ts`.
- `src/content/images/manifest.test.ts` fails if a card has no row, a row is
  malformed, or a card is paired with the wrong file.
- Rerun the script before a release that changes the images, or if Commons
  flags a file. It makes three API requests a few seconds apart.
- Optimised copies are made by M3.4 (see "Image files" below).

### Image files (M3.4, 2026-11-11)

`npm run images` (`node scripts/optimise-images.mjs`, Node 22.18+) downloads
each original named in the manifest into `.cache/card-images/` (ignored by
git, about 21 MB, one request at a time; Commons may ask for waits of ten
minutes, which the script obeys), trims the scanner background, stretches each
card to one shape (the scans differ from it by under 3%) and writes
`public/cards/rws-1909/<cardId>-<width>.webp` at 240 and 480 px wide.

- Total: 6.84 MB for 156 files, budget 8 MB (`src/content/images/files.ts`).
  The script and `files.test.ts` both enforce the budget.
- Settings: WebP quality 65 (240 px) and 60 (480 px). The scans are grainy;
  quality 78 at the same widths came to 9.3 MB.
- The 480 px size is for large cards and sharp screens; the 240 px size serves
  a board card at 2x. Other widths can be added to `IMAGE_WIDTHS`.
- The files are the licence-checked originals, resized. Attribution still
  follows the manifest.

## Open items

- [x] Verify the licence of each Wikimedia scan chosen for bundling (M3.3, 2026-11-10 UTC; see "Licence check").
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
