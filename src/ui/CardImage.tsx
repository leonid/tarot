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
 *
 * The wrapper also carries `card-face`, and the name and word use the face's
 * classes, so code and tests that look for a card on the board find either.
 */
export function CardImage({
  deckId,
  card,
  orientation = 'upright',
  sizes = '(max-width: 40em) 5.5em, 7em',
  compact = false,
}: {
  deckId: string;
  card: Card;
  orientation?: PlacedCard['orientation'];
  /** The `sizes` attribute: how wide the picture is drawn (browser picks a file). */
  sizes?: string;
  /** Small thumbnail with the name beside it, for the palette. */
  compact?: boolean;
}) {
  const { t, alt, getDeck } = useI18n();
  const named = getDeck(deckId)?.cards.find((c) => c.id === card.id) ?? card;
  const [failed, setFailed] = useState<string>();
  const image = resolveCardImage(deckId, card.id);
  if (!image || failed === card.id)
    return <CardFace card={card} orientation={orientation} compact={compact} />;

  const reversed = orientation === 'reversed';
  const base = import.meta.env.BASE_URL;
  const fallback = image.sources[image.sources.length - 1]!;
  return (
    <span
      className={`card-face card-image${reversed ? ' reversed' : ''}${compact ? ' compact' : ''}`}
    >
      <img
        className="card-image-img"
        src={`${base}${fallback.path}`}
        srcSet={srcSet(image, base)}
        sizes={sizes}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        alt={compact ? '' : alt(named)}
        onError={() => setFailed(card.id)}
      />
      <span className="card-face-name">{named.name}</span>
      {reversed && <span className="card-face-rev">{t.slotReversed}</span>}
    </span>
  );
}
