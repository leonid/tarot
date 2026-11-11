import { useDraggable } from '@dnd-kit/core';
import type { Card } from '../../domain/types';
import { CardImage } from '../../ui/CardImage';
import { useI18n } from '../../ui/i18n';

/** Unplaced cards. Each is draggable onto a spread slot. */
export function CardPalette({
  deckId,
  cards,
  pickedId,
  onPick,
}: {
  deckId: string;
  cards: readonly Card[];
  /** The card selected by clicking, if any. */
  pickedId?: string;
  onPick?: (cardId: string) => void;
}) {
  const { t } = useI18n();
  return (
    <section className="palette-box">
      <h2 aria-hidden="true">{t.availableCards}</h2>
      <div className="palette" role="group" aria-label={t.availableCards}>
        {cards.map((c) => (
          <PaletteCard
            key={c.id}
            deckId={deckId}
            card={c}
            picked={c.id === pickedId}
            onPick={onPick}
          />
        ))}
      </div>
    </section>
  );
}

function PaletteCard({
  deckId,
  card,
  picked,
  onPick,
}: {
  deckId: string;
  card: Card;
  picked: boolean;
  onPick?: (cardId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    data: { cardId: card.id },
  });
  return (
    <div
      ref={setNodeRef}
      className={`palette-card${isDragging ? ' dragging' : ''}${picked ? ' picked' : ''}`}
      {...listeners}
      {...attributes}
      aria-pressed={picked}
      onClick={() => onPick?.(card.id)}
    >
      <CardImage deckId={deckId} card={card} compact sizes="3em" />
    </div>
  );
}
