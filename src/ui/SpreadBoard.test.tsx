import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { rwsDeck } from '../content/decks/rws';
import { threeCard } from '../content/spreads';
import type { PlacedCard } from '../domain/types';
import { SpreadBoard } from './SpreadBoard';

const placements = [
  { positionId: 'past', cardId: 'major-00-fool', orientation: 'upright' },
  { positionId: 'present', cardId: 'major-13-death', orientation: 'upright' },
  { positionId: 'future', cardId: 'cups-01-ace', orientation: 'upright' },
] as const;

describe('SpreadBoard hinge', () => {
  it('marks only the hinge card', () => {
    const { container } = render(
      <SpreadBoard
        deckId="rws-78"
        spread={threeCard}
        cards={rwsDeck.cards}
        placements={placements}
        hingeCardId="major-13-death"
      />,
    );
    expect(screen.getAllByText('Hinge')).toHaveLength(1);
    const slot = container.querySelector('[data-position="present"]');
    expect(slot?.classList.contains('hinge')).toBe(true);
    expect(
      container
        .querySelector('[data-position="past"]')
        ?.classList.contains('hinge'),
    ).toBe(false);
  });

  it('marks nothing without a hinge', () => {
    render(
      <SpreadBoard
        deckId="rws-78"
        spread={threeCard}
        cards={rwsDeck.cards}
        placements={placements}
      />,
    );
    expect(screen.queryByText('Hinge')).toBeNull();
  });
});

describe('SpreadBoard pictures', () => {
  const board = (deckId: string, p: readonly PlacedCard[]) =>
    render(
      <SpreadBoard
        deckId={deckId}
        spread={threeCard}
        cards={rwsDeck.cards}
        placements={p}
      />,
    );

  it('shows a picture and the name for each placed card of a deck with art', () => {
    const { container } = board('rws-78', placements);
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(container.querySelector('[data-position="past"]')).toHaveTextContent(
      'The Fool',
    );
  });

  it('shows the typographic face for a deck without art', () => {
    board('no-art', placements);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('The Fool')).toBeInTheDocument();
  });

  it('turns a reversed picture over and says so in words', () => {
    const { container } = board('rws-78', [
      { positionId: 'past', cardId: 'major-00-fool', orientation: 'reversed' },
    ]);
    expect(container.querySelectorAll('.card-image.reversed')).toHaveLength(1);
    expect(screen.getByText('(reversed)')).toBeInTheDocument();
  });
});
