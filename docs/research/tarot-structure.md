# Tarot structure (what the data model encodes)

## The deck

- **78 cards** in the Rider-Waite-Smith (RWS) tradition.
  - **Major Arcana, 22 cards,** numbered 0 (The Fool) to 21 (The World).
  - **Minor Arcana, 56 cards,** in four suits: Wands, Cups, Swords, Pentacles.
    Each suit has Ace to Ten (1-10) plus Page, Knight, Queen, King (11-14).
- Card ids are stable and sortable: `major-00-fool`, `cups-12-queen`,
  `pentacles-01-ace`.
- **Orientation:** a card is upright or reversed. Reversals are optional and
  on by default in the app.
- **Elements by suit:** Wands = fire, Cups = water, Swords = air,
  Pentacles = earth. Major Arcana take planet or sign attributions instead.
  `src/domain/elements.ts` implements the suit mapping and the Golden Dawn
  dignities (same element strengthens; fire+air and water+earth are friendly;
  the rest conflict).

## Spreads

A spread is a set of named positions, each with a question it asks of its card.

| Spread | Positions | Notes |
|---|---|---|
| Single card | 1 | Quick answer or theme |
| Past / Present / Future | 3 | Timeline |
| Celtic Cross | 10 | Cross of six plus a staff of four; position 2 lies across position 1 |

Positions carry grid coordinates (`x`, `y`) and a `rotated` flag, so any layout,
including a user-made one later, is just data.

## Two modes

- **Simulate:** question, spread and deck, then a seeded shuffle and deal.
  The seed is stored so a deal can be replayed.
- **Setup:** the user puts chosen cards into chosen positions, either to
  analyse a physical reading or to explore. A card can appear once only.

## Out of scope for v1

Thoth and Marseille decks, a custom layout editor, accounts, and i18n.
The models do not preclude any of them.
