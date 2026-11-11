# Screen reader pass (M3.13)

Two parts: a review of the accessibility tree the app exposes (done, by script), and a manual pass with a real screen reader (checklist below, **not yet done**; it needs a person with VoiceOver, NVDA or TalkBack).

## Part 1: accessibility tree review (done)

Method: Playwright `ariaSnapshot()` of the simulate view (before and after a deal) and the setup view with a card picked, read for what a screen reader would announce, in order.

| Finding | Status |
| ------- | ------ |
| Landmarks and headings are sound: one `main`, h1 "Tarot", the interpretation is a labelled `complementary` with h2 and h3 per card. | ok |
| Tabs, form controls and buttons all have names; the palette is a labelled group of buttons with pressed state. | ok (palette fixed in M3.12) |
| Click-to-place: the selection is announced through a status region, and each position becomes a button named "Place X in Y". | ok |
| Keyboard drag announces pick-up, each position it is over, and the drop (M3.10). | ok |
| **Dealing in simulate mode announced nothing**: the interpretation appeared with no status change. | fixed here: a status region says "Cards dealt: N. The interpretation is below the board." (en, ru) |
| Each placed card is read twice: the image alt ("Eight of Cups: A cloaked figure...") then the visible name ("Eight of Cups (reversed)"). The reversed state is only in the visible text, not in the alt. | open, issue filed |

## Part 2: manual pass (to do)

Record the tool, browser, OS and the result of each step.

- [ ] Simulate: tab to Shuffle and deal, press it. The deal is announced; the interpretation can be reached and read heading by heading.
- [ ] Each position and card is read with its position name, and reversed cards are identifiable.
- [ ] Setup: pick a card (announced), click a position (placement announced), repeat to fill the spread.
- [ ] Setup by keyboard drag: pick up with Space, move with arrows, each position is announced, drop with Space.
- [ ] Switch language to Russian: text and announcements are read in Russian (machine-written text, expect awkward phrasing).
- [ ] Save reading and Copy share link: the result is announced.

| Date | Tool | Browser / OS | Result |
| ---- | ---- | ------------ | ------ |
|      |      |              | not yet done |
