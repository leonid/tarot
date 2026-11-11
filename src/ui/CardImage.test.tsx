import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { rwsDeck } from '../content/decks/rws';
import { altEnglish } from '../content/images/alt';
import { useReadingStore } from '../features/store';
import { CardImage } from './CardImage';

const card = (id: string) => rwsDeck.cards.find((c) => c.id === id)!;
const fool = card('major-00-fool');

describe('CardImage', () => {
  it('draws the picture with alt text, sizes and lazy loading', () => {
    render(<CardImage deckId="rws-78" card={fool} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', `The Fool: ${altEnglish[fool.id]}`);
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img.getAttribute('src')).toMatch(
      /cards\/rws-1909\/major-00-fool-480\.webp$/,
    );
    expect(img.getAttribute('srcset')).toMatch(
      /-240\.webp 240w, .*-480\.webp 480w$/,
    );
    expect(img).toHaveAttribute('width', '480');
    expect(img).toHaveAttribute('height', '832');
  });

  it('shows no "reversed" word when upright', () => {
    const { container } = render(<CardImage deckId="rws-78" card={fool} />);
    expect(container.querySelector('.card-image.reversed')).toBeNull();
    expect(screen.queryByText('(reversed)')).toBeNull();
  });

  it('turns the picture over and says "reversed" in words', () => {
    const { container } = render(
      <CardImage deckId="rws-78" card={fool} orientation="reversed" />,
    );
    expect(container.querySelector('.card-image.reversed img')).not.toBeNull();
    expect(screen.getByText('(reversed)')).toBeInTheDocument();
    // The word is a sibling of the picture, not inside the rotated element.
    expect(screen.getByText('(reversed)').closest('img')).toBeNull();
  });

  it('falls back to the typographic face for a deck without art', () => {
    const { container } = render(<CardImage deckId="no-art" card={fool} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('.card-face')).not.toBeNull();
    expect(screen.getByText('The Fool')).toBeInTheDocument();
  });

  it('falls back to the typographic face when the file fails to load', () => {
    const { container } = render(
      <CardImage deckId="rws-78" card={fool} orientation="reversed" />,
    );
    fireEvent.error(screen.getByRole('img'));
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('.card-face.reversed')).not.toBeNull();
    expect(screen.getByText('(reversed)')).toBeInTheDocument();
  });

  it('uses the language of the interface for the alt text', () => {
    useReadingStore.setState({ locale: 'ru' });
    render(<CardImage deckId="rws-78" card={fool} />);
    expect(screen.getByRole('img').getAttribute('alt')).toMatch(/Шут|Дурак/);
    useReadingStore.setState({ locale: 'en' });
  });
});
