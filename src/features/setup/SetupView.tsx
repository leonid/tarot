import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { useI18n } from '../../ui/i18n';
import { QuestionField, SpreadControls } from '../../ui/Controls';
import { Field, PageHead, Step, Toggle } from '../../ui/kit';
import { SaveShare } from '../../ui/SaveShare';
import { ReadingView } from '../../ui/Layout';
import { useReadingStore } from '../store';
import { DropSlotContext } from '../../ui/SpreadBoard';
import { CardPalette } from './CardPalette';
import { DroppableSlot } from './DroppableSlot';
import { slotKeyboardCoordinates } from './keyboardCoordinates';

/**
 * "Record a spread". Click or drag a card from the palette onto a position;
 * the lists under the palette do the same without a pointer.
 */
export function SetupView() {
  const { deckId, spreadId, placements, allowReversals, place, clearPosition } =
    useReadingStore();
  const { t, getDeck, getSpread } = useI18n();
  const [picked, setPicked] = useState<string>();
  // Mouse: a few pixels of movement start a drag; a plain click selects.
  // Touch: a short press-and-hold starts it, so a swipe still scrolls the page.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: slotKeyboardCoordinates }),
  );
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

  const armed = unplaced.find((c) => c.id === picked);

  function onDragEnd({ active, over }: DragEndEvent) {
    const positionId = over?.data.current?.positionId as string | undefined;
    const cardId = active.data.current?.cardId as string | undefined;
    if (positionId && cardId) place(positionId, cardId);
  }

  return (
    <>
      <PageHead title={t.goalRecord} purpose={t.recordPurpose} />
      <ol className="steps">
        <Step n={1} title={t.stepQuestion}>
          <QuestionField />
        </Step>
        <Step n={2} title={t.stepSpread}>
          <SpreadControls />
        </Step>
        <Step n={3} title={t.stepPlace}>
          <p className="hint">{t.placeHint}</p>
          <p role="status" className="meta">
            {armed ? t.cardSelected(armed.name) : ''}
          </p>
        </Step>
      </ol>
      <DropSlotContext.Provider value={DroppableSlot}>
        <DndContext
          sensors={sensors}
          onDragEnd={onDragEnd}
          accessibility={accessibility}
        >
          <div
            className={`record-table${placements.length < spread.positions.length ? ' placing' : ''}`}
          >
            <ReadingView
              droppable
              armedCard={armed}
              onSlotClick={(positionId) => {
                if (!armed) return;
                place(positionId, armed.id);
                setPicked(undefined);
              }}
              onRemove={clearPosition}
              onFlip={
                allowReversals
                  ? (positionId) => {
                      const placed = placements.find(
                        (p) => p.positionId === positionId,
                      );
                      if (placed)
                        place(
                          positionId,
                          placed.cardId,
                          placed.orientation === 'reversed'
                            ? 'upright'
                            : 'reversed',
                        );
                    }
                  : undefined
              }
            />
            <CardPalette
              deckId={deck.id}
              cards={unplaced}
              pickedId={armed?.id}
              onPick={(id) => setPicked((cur) => (cur === id ? undefined : id))}
            />
          </div>
          <section className="slot-menus">
            <h3>{t.placeWithMenus}</h3>
            <div className="slot-menus-grid">
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
                              ? place(
                                  pos.id,
                                  e.target.value,
                                  placed?.orientation,
                                )
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
            </div>
          </section>
        </DndContext>
      </DropSlotContext.Provider>
      <SaveShare />
    </>
  );
}
