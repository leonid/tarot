import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { rwsDeck } from '../content/decks/rws';
import { threeCard } from '../content/spreads';
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
        spread={threeCard}
        cards={rwsDeck.cards}
        placements={placements}
      />,
    );
    expect(screen.queryByText('Hinge')).toBeNull();
  });
});
