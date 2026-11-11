import { useDroppable } from '@dnd-kit/core';
import type { Card, PlacedCard, Spread, SpreadPosition } from '../domain/types';
import { Chip } from './kit';
import { CardImage } from './CardImage';
import { useI18n } from './i18n';

interface Props {
  deckId: string;
  spread: Spread;
  cards: readonly Card[];
  placements: readonly PlacedCard[];
  /** When true, slots accept dragged cards (must be inside a DndContext). */
  droppable?: boolean;
  /** A card picked by click: every slot becomes a button that places it. */
  armedCard?: Card;
  onSlotClick?: (positionId: string) => void;
  /** Card the Compare step found most connected to the others. */
  hingeCardId?: string;
}

/** Lays positions out on a grid using their x/y coordinates. */
export function SpreadBoard({
  deckId,
  spread,
  cards,
  placements,
  droppable = false,
  armedCard,
  onSlotClick,
  hingeCardId,
}: Props) {
  const cols = Math.max(...spread.positions.map((p) => p.x)) + 1;
  // Positions that share a grid cell (the Celtic Cross crossing card) are
  // stacked in that cell, never rotated or overlapped, so every label stays
  // horizontal and readable.
  const cells = new Map<string, SpreadPosition[]>();
  for (const pos of spread.positions) {
    const key = `${pos.x},${pos.y}`;
    cells.set(key, [...(cells.get(key) ?? []), pos]);
  }
  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, var(--card-w)))`,
      }}
    >
      {[...cells.values()].map((group) => {
        const first = group[0]!;
        return (
          <div
            key={`${first.x},${first.y}`}
            className="cell"
            style={{ gridColumn: first.x + 1, gridRow: first.y + 1 }}
          >
            {group.map((pos) => {
              const placed = placements.find((p) => p.positionId === pos.id);
              const card = cards.find((c) => c.id === placed?.cardId);
              const props = {
                deckId,
                pos,
                armedCard: onSlotClick ? armedCard : undefined,
                onSlotClick,
                card,
                orientation: placed?.orientation,
                hinge: !!card && card.id === hingeCardId,
              };
              return droppable ? (
                <DroppableSlot key={pos.id} {...props} />
              ) : (
                <Slot key={pos.id} {...props} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

interface SlotProps {
  deckId: string;
  pos: SpreadPosition;
  card?: Card;
  orientation?: PlacedCard['orientation'];
  setRef?: (el: HTMLElement | null) => void;
  over?: boolean;
  hinge?: boolean;
  armedCard?: Card;
  onSlotClick?: (positionId: string) => void;
}

function Slot({
  deckId,
  pos,
  card,
  orientation,
  setRef,
  over,
  hinge,
  armedCard,
  onSlotClick,
}: SlotProps) {
  const { t } = useI18n();
  const press = () => onSlotClick?.(pos.id);
  return (
    <div
      ref={setRef}
      className={`slot${card ? ' filled' : ''}${over ? ' over' : ''}${pos.rotated ? ' crossing' : ''}${hinge ? ' hinge' : ''}${armedCard ? ' armed' : ''}`}
      data-position={pos.id}
      {...(armedCard
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': t.placeIn(armedCard.name, pos.label),
            onClick: press,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                press();
              }
            },
          }
        : {})}
    >
      <span className="slot-label">{pos.label}</span>
      {card ? (
        <CardImage deckId={deckId} card={card} orientation={orientation} />
      ) : (
        <span className="slot-empty">{t.slotEmpty}</span>
      )}
      {hinge && (
        <Chip tone="hinge" title={t.hingeTitle}>
          {t.hinge}
        </Chip>
      )}
    </div>
  );
}

function DroppableSlot(props: SlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: props.pos.id,
    data: { positionId: props.pos.id },
  });
  return <Slot {...props} setRef={setNodeRef} over={isOver} />;
}
