import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { rwsDeck } from '../content/decks/rws';
import { celticCross } from '../content/spreads';
import { CardFace, faceNumber, romanNumeral } from './CardFace';
import { SpreadBoard } from './SpreadBoard';

const card = (id: string) => rwsDeck.cards.find((c) => c.id === id)!;

describe('numerals', () => {
  it('writes majors in Roman, with 0 for the Fool', () => {
    expect([0, 4, 9, 14, 19, 21].map(romanNumeral)).toEqual([
      '0',
      'IV',
      'IX',
      'XIV',
      'XIX',
      'XXI',
    ]);
  });

  it('shows pips as digits and leaves court cards without a number', () => {
    expect(faceNumber(card('cups-01-ace'))).toBe('1');
    expect(faceNumber(card('wands-10-ten'))).toBe('10');
    expect(faceNumber(card('wands-13-queen'))).toBe('');
    expect(faceNumber(card('major-13-death'))).toBe('XIII');
  });
});

describe('CardFace', () => {
  it('shows name, numeral and a suit mark for a minor card', () => {
    const { container } = render(<CardFace card={card('cups-03-three')} />);
    expect(screen.getByText('Three of Cups')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(container.querySelector('svg.suit-cups')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('has no suit mark for a major card', () => {
    const { container } = render(<CardFace card={card('major-00-fool')} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('says "reversed" in words, not only by turning the mark', () => {
    const { container } = render(
      <CardFace card={card('cups-03-three')} orientation="reversed" />,
    );
    expect(screen.getByText('(reversed)')).toBeInTheDocument();
    expect(container.querySelector('.card-face')).toHaveClass('reversed');
  });

  it('does not say reversed when upright', () => {
    render(<CardFace card={card('cups-03-three')} />);
    expect(screen.queryByText('(reversed)')).toBeNull();
  });
});

describe('Celtic Cross crossing card', () => {
  it('is stacked with Present in one cell and keeps a readable label', () => {
    const { container } = render(
      <SpreadBoard
        spread={celticCross}
        cards={rwsDeck.cards}
        placements={[
          {
            positionId: 'present',
            cardId: 'major-00-fool',
            orientation: 'upright',
          },
          {
            positionId: 'challenge',
            cardId: 'major-13-death',
            orientation: 'reversed',
          },
        ]}
      />,
    );
    const cell = container.querySelector(
      '[data-position="present"]',
    )?.parentElement;
    expect(cell).toHaveClass('cell');
    expect(cell?.querySelector('[data-position="challenge"]')).toHaveClass(
      'crossing',
    );
    const challenge = container.querySelector('[data-position="challenge"]')!;
    expect(challenge.textContent).toContain('Challenge');
    expect(challenge.textContent).toContain('Death');
    expect(challenge.textContent).toContain('(reversed)');
    expect(container.querySelectorAll('.slot')).toHaveLength(10);
  });
});
