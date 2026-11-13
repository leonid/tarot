import { useDroppable } from '@dnd-kit/core';
import { Slot, type SlotProps } from '../../ui/SpreadBoard';

/** A board position that accepts a dragged card. Provided to the board by Setup. */
export function DroppableSlot(props: SlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: props.pos.id,
    data: { positionId: props.pos.id },
  });
  return <Slot {...props} setRef={setNodeRef} over={isOver} />;
}
