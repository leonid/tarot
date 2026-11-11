# Touch

Palette cards drag by press-and-hold (250 ms, up to 8 px of wobble allowed), so a swipe over the palette scrolls the page. Mouse drags start after 5 px. Click-to-place and the keyboard work as before.

## Automated

`e2e/touch.spec.ts` runs on emulated phones (Pixel 7 in Chromium, iPhone 14 in WebKit): the palette allows scrolling (`touch-action` is not `none`), a swipe does not start a drag, and a hold-then-drag places a card. The last two need real touch input, which only Chromium offers (DevTools protocol), so they are skipped in WebKit.

## Real-device check (manual)

On a phone, in setup mode: swipe up and down over the card list (page scrolls, no card lifts); press and hold a card for about a quarter second, then drag it to a position and release (card lands); tap a card then a position (also places). Record device, OS and browser here when done:

| Date | Device | OS / browser | Result |
| ---- | ------ | ------------ | ------ |
|      |        |              | not yet checked |
