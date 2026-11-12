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
  /** Record a spread: each placed card carries its own turn and remove buttons. */
  onFlip?: (positionId: string) => void;
  onRemove?: (positionId: string) => void;
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
  onFlip,
  onRemove,
}: Props) {
  const cols = Math.max(...spread.positions.map((p) => p.x)) + 1;
  // Positions that share a grid cell (the Celtic Cross crossing card): on a
  // board that is only read, the crossing card lies across the lower part of
  // the card under it, as on a table. While cards are being placed each
  // position must stay a separate target, so there they are stacked.
  const cells = new Map<string, SpreadPosition[]>();
  for (const pos of spread.positions) {
    const key = `${pos.x},${pos.y}`;
    cells.set(key, [...(cells.get(key) ?? []), pos]);
  }
  return (
    <div
      className={`board${droppable ? ' stacked' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, var(--card-w)))`,
      }}
    >
      {[...cells.values()].map((group) => {
        const first = group[0]!;
        return (
          <div
            key={`${first.x},${first.y}`}
            className={`cell${group.length > 1 ? ' crossed' : ''}`}
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
                // The order the cards are turned in when a reading is dealt.
                index: spread.positions.indexOf(pos),
                onFlip,
                onRemove,
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
  index?: number;
  armedCard?: Card;
  onSlotClick?: (positionId: string) => void;
  onFlip?: (positionId: string) => void;
  onRemove?: (positionId: string) => void;
}

function Slot({
  deckId,
  pos,
  card,
  orientation,
  setRef,
  over,
  hinge,
  index = 0,
  armedCard,
  onSlotClick,
  onFlip,
  onRemove,
}: SlotProps) {
  const { t } = useI18n();
  const press = () => onSlotClick?.(pos.id);
  return (
    <div
      ref={setRef}
      className={`slot${card ? ' filled' : ''}${over ? ' over' : ''}${pos.rotated ? ' crossing' : ''}${hinge ? ' hinge' : ''}${armedCard ? ' armed' : ''}`}
      data-position={pos.id}
      style={{ '--i': index } as React.CSSProperties}
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
        // Keyed by card, so a newly dealt card is turned over afresh.
        <CardImage
          key={card.id}
          deckId={deckId}
          card={card}
          orientation={orientation}
        />
      ) : (
        <span className="slot-empty">{t.slotEmpty}</span>
      )}
      {hinge && (
        <Chip tone="hinge" title={t.hingeTitle}>
          {t.hinge}
        </Chip>
      )}
      {/* While a card is selected the whole slot is one button, so its own
          buttons step aside. */}
      {card && !armedCard && (onFlip || onRemove) && (
        <span className="slot-actions">
          {onFlip && (
            <button
              type="button"
              className="slot-action"
              aria-label={t.flipCard(card.name)}
              title={t.flipCard(card.name)}
              aria-pressed={orientation === 'reversed'}
              onClick={() => onFlip(pos.id)}
            >
              <span aria-hidden="true">↻</span>
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              className="slot-action"
              aria-label={t.removeCard(card.name)}
              title={t.removeCard(card.name)}
              onClick={() => onRemove(pos.id)}
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </span>
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
