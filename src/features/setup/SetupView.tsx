import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useI18n } from '../../ui/i18n';
import { Field, Toggle } from '../../ui/kit';
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
  const { t, getDeck, getSpread } = useI18n();
  const deck = getDeck(deckId);
  const spread = getSpread(spreadId);
  if (!deck || !spread) return null;

  const cardName = (id: string | number) =>
    deck.cards.find((c) => c.id === id)?.name ?? String(id);
  const positionLabel = (id: string | number) =>
    spread.positions.find((p) => p.id === id)?.label ?? String(id);
  const accessibility = {
    screenReaderInstructions: { draggable: t.dragInstructions },
    announcements: {
      onDragStart: ({ active }: { active: { id: string | number } }) =>
        t.dragPickedUp(cardName(active.id)),
      onDragOver: ({
        active,
        over,
      }: {
        active: { id: string | number };
        over: { id: string | number } | null;
      }) =>
        over
          ? t.dragOver(cardName(active.id), positionLabel(over.id))
          : undefined,
      onDragEnd: ({
        active,
        over,
      }: {
        active: { id: string | number };
        over: { id: string | number } | null;
      }) =>
        over
          ? t.dragDropped(cardName(active.id), positionLabel(over.id))
          : t.dragDroppedOutside(cardName(active.id)),
      onDragCancel: ({ active }: { active: { id: string | number } }) =>
        t.dragCancelled(cardName(active.id)),
    },
  };

  const placedIds = new Set(placements.map((p) => p.cardId));
  const unplaced = deck.cards.filter((c) => !placedIds.has(c.id));

  function onDragEnd({ active, over }: DragEndEvent) {
    const positionId = over?.data.current?.positionId as string | undefined;
    const cardId = active.data.current?.cardId as string | undefined;
    if (positionId && cardId) place(positionId, cardId);
  }

  return (
    <DndContext onDragEnd={onDragEnd} accessibility={accessibility}>
      <ReadingView droppable />
      <CardPalette cards={unplaced} />
      <details className="slot-menus">
        <summary>{t.placeWithMenus}</summary>
        {spread.positions.map((pos) => {
          const placed = placements.find((p) => p.positionId === pos.id);
          return (
            <div key={pos.id} className="slot-editor">
              <Field label={pos.label}>
                {(p) => (
                  <select
                    {...p}
                    value={placed?.cardId ?? ''}
                    onChange={(e) =>
                      e.target.value
                        ? place(pos.id, e.target.value, placed?.orientation)
                        : clearPosition(pos.id)
                    }
                  >
                    <option value="">{t.chooseCard}</option>
                    {deck.cards.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        disabled={
                          placedIds.has(c.id) && placed?.cardId !== c.id
                        }
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              {allowReversals && placed && (
                <Toggle
                  label={t.reversed}
                  checked={placed.orientation === 'reversed'}
                  onChange={(e) =>
                    place(
                      pos.id,
                      placed.cardId,
                      e.target.checked ? 'reversed' : 'upright',
                    )
                  }
                />
              )}
            </div>
          );
        })}
      </details>
    </DndContext>
  );
}
