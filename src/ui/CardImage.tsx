import { useState } from 'react';
import { resolveCardImage, srcSet } from '../content/images/resolve';
import type { Card, PlacedCard } from '../domain/types';
import { CardFace } from './CardFace';
import { useI18n } from './i18n';

/**
 * A card's picture, or the typographic face when the deck has no art or the
 * file fails to load (offline, blocked). The picture loads lazily and keeps
 * its shape while loading, so the board does not jump.
 *
 * Reversed turns the picture upside down and adds the word "reversed" as
 * text beside it, so the state is not carried by rotation alone. The word
 * never rotates.
 */
export function CardImage({
  deckId,
  card,
  orientation = 'upright',
  sizes = '25vw',
}: {
  deckId: string;
  card: Card;
  orientation?: PlacedCard['orientation'];
  /** The `sizes` attribute: how wide the picture is drawn (browser picks a file). */
  sizes?: string;
}) {
  const { t, alt, getDeck } = useI18n();
  const [failed, setFailed] = useState<string>();
  const image = resolveCardImage(deckId, card.id);
  if (!image || failed === card.id)
    return <CardFace card={card} orientation={orientation} />;

  const reversed = orientation === 'reversed';
  const base = import.meta.env.BASE_URL;
  const fallback = image.sources[image.sources.length - 1]!;
  return (
    <span className={`card-image${reversed ? ' reversed' : ''}`}>
      <img
        className="card-image-img"
        src={`${base}${fallback.path}`}
        srcSet={srcSet(image, base)}
        sizes={sizes}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        alt={alt(getDeck(deckId)?.cards.find((c) => c.id === card.id) ?? card)}
        onError={() => setFailed(card.id)}
      />
      {reversed && <span className="card-face-rev">{t.slotReversed}</span>}
    </span>
  );
}
