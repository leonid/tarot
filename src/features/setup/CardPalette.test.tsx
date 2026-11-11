import { DndContext } from '@dnd-kit/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { rwsDeck } from '../../content/decks/rws';
import { CardPalette } from './CardPalette';

const cards = rwsDeck.cards.slice(0, 3);
const palette = (deckId: string) =>
  render(
    <DndContext>
      <CardPalette deckId={deckId} cards={cards} />
    </DndContext>,
  );

describe('CardPalette', () => {
  it('shows a small picture and the name for each card', () => {
    const { container } = palette('rws-78');
    expect(container.querySelectorAll('.palette-card img')).toHaveLength(3);
    expect(screen.getByText('The Fool')).toBeInTheDocument();
  });

  it('marks the thumbnails decorative, as the name is beside them', () => {
    const { container } = palette('rws-78');
    for (const img of container.querySelectorAll('img'))
      expect(img).toHaveAttribute('alt', '');
  });

  it('shows names only for a deck without art', () => {
    const { container } = palette('no-art');
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('The Fool')).toBeInTheDocument();
  });
});
