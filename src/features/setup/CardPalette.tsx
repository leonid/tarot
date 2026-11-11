import { useDraggable } from '@dnd-kit/core';
import type { Card } from '../../domain/types';
import { CardImage } from '../../ui/CardImage';
import { useI18n } from '../../ui/i18n';

/** Unplaced cards. Each is draggable onto a spread slot. */
export function CardPalette({
  deckId,
  cards,
}: {
  deckId: string;
  cards: readonly Card[];
}) {
  const { t } = useI18n();
  return (
    <section className="palette-box">
      <h2 aria-hidden="true">{t.availableCards}</h2>
      <ul className="palette" aria-label={t.availableCards}>
        {cards.map((c) => (
          <PaletteCard key={c.id} deckId={deckId} card={c} />
        ))}
      </ul>
    </section>
  );
}

function PaletteCard({ deckId, card }: { deckId: string; card: Card }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    data: { cardId: card.id },
  });
  return (
    <li
      ref={setNodeRef}
      className={`palette-card${isDragging ? ' dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <CardImage deckId={deckId} card={card} compact sizes="3em" />
    </li>
  );
}
