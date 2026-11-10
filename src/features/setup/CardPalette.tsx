import { useDraggable } from '@dnd-kit/core';
import type { Card } from '../../domain/types';
import { CardFace } from '../../ui/CardFace';
import { useI18n } from '../../ui/i18n';

/** Unplaced cards. Each is draggable onto a spread slot. */
export function CardPalette({ cards }: { cards: readonly Card[] }) {
  const { t } = useI18n();
  return (
    <ul className="palette" aria-label={t.availableCards}>
      {cards.map((c) => (
        <PaletteCard key={c.id} card={c} />
      ))}
    </ul>
  );
}

function PaletteCard({ card }: { card: Card }) {
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
      <CardFace card={card} compact />
    </li>
  );
}
