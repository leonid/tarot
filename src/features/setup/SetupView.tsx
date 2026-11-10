import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { getDeck } from '../../content/decks';
import { getSpread } from '../../content/spreads';
import { ReadingView } from '../../ui/Layout';
import { useReadingStore } from '../store';
import { CardPalette } from './CardPalette';

/**
 * Setup mode. Drag a card from the palette onto a slot; the select list under
 * "Place with menus" does the same without a pointer (keyboard, screen reader).
 */
export function SetupView() {
  const { deckId, spreadId, placements, allowReversals, place, clearPosition } =
    useReadingStore();
  const deck = getDeck(deckId);
  const spread = getSpread(spreadId);
  if (!deck || !spread) return null;

  const placedIds = new Set(placements.map((p) => p.cardId));
  const unplaced = deck.cards.filter((c) => !placedIds.has(c.id));

  function onDragEnd({ active, over }: DragEndEvent) {
    const positionId = over?.data.current?.positionId as string | undefined;
    const cardId = active.data.current?.cardId as string | undefined;
    if (positionId && cardId) place(positionId, cardId);
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <ReadingView droppable />
      <CardPalette cards={unplaced} />
      <details className="slot-menus">
        <summary>Place with menus</summary>
        {spread.positions.map((pos) => {
          const placed = placements.find((p) => p.positionId === pos.id);
          return (
            <div key={pos.id} className="slot-editor">
              <label>
                {pos.label}
                <select
                  value={placed?.cardId ?? ''}
                  onChange={(e) =>
                    e.target.value
                      ? place(pos.id, e.target.value, placed?.orientation)
                      : clearPosition(pos.id)
                  }
                >
                  <option value="">-- choose a card --</option>
                  {deck.cards.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      disabled={placedIds.has(c.id) && placed?.cardId !== c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              {allowReversals && placed && (
                <label>
                  <input
                    type="checkbox"
                    checked={placed.orientation === 'reversed'}
                    onChange={(e) =>
                      place(
                        pos.id,
                        placed.cardId,
                        e.target.checked ? 'reversed' : 'upright',
                      )
                    }
                  />
                  Reversed
                </label>
              )}
            </div>
          );
        })}
      </details>
    </DndContext>
  );
}
