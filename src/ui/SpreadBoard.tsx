import { useDroppable } from '@dnd-kit/core';
import type { Card, PlacedCard, Spread, SpreadPosition } from '../domain/types';

interface Props {
  spread: Spread;
  cards: readonly Card[];
  placements: readonly PlacedCard[];
  /** When true, slots accept dragged cards (must be inside a DndContext). */
  droppable?: boolean;
}

/** Lays positions out on a grid using their x/y coordinates. */
export function SpreadBoard({
  spread,
  cards,
  placements,
  droppable = false,
}: Props) {
  const cols = Math.max(...spread.positions.map((p) => p.x)) + 1;
  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 7rem))` }}
    >
      {spread.positions.map((pos) => {
        const placed = placements.find((p) => p.positionId === pos.id);
        const card = cards.find((c) => c.id === placed?.cardId);
        const props = { pos, card, orientation: placed?.orientation };
        return droppable ? (
          <DroppableSlot key={pos.id} {...props} />
        ) : (
          <Slot key={pos.id} {...props} />
        );
      })}
    </div>
  );
}

interface SlotProps {
  pos: SpreadPosition;
  card?: Card;
  orientation?: PlacedCard['orientation'];
  setRef?: (el: HTMLElement | null) => void;
  over?: boolean;
}

function Slot({ pos, card, orientation, setRef, over }: SlotProps) {
  return (
    <div
      ref={setRef}
      className={`slot${card ? ' filled' : ''}${over ? ' over' : ''}${pos.rotated ? ' rotated' : ''}`}
      style={{ gridColumn: pos.x + 1, gridRow: pos.y + 1 }}
      data-position={pos.id}
    >
      <span className="slot-label">{pos.label}</span>
      <span className="slot-card">
        {card ? card.name : 'empty'}
        {card && orientation === 'reversed' ? ' (reversed)' : ''}
      </span>
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
