import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import type { Card, Suit } from '../../domain/types';
import { CardImage } from '../../ui/CardImage';
import { useI18n } from '../../ui/i18n';
import { Field } from '../../ui/kit';

type Group = 'major' | Suit | 'all';
const GROUPS: readonly Group[] = [
  'major',
  'wands',
  'cups',
  'swords',
  'pentacles',
  'all',
];
const inGroup = (card: Card, group: Group) =>
  group === 'all' ||
  (group === 'major' ? card.arcana === 'major' : card.suit === group);

/**
 * The cards not placed yet, one part of the deck at a time (the Major Arcana
 * first, then each suit), so the list is short enough to see whole. Typing a
 * name searches the whole deck. Each card can be clicked or dragged.
 */
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
  const [group, setGroup] = useState<Group>('major');
  const [query, setQuery] = useState('');
  const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  // A search looks through every card, whatever part of the deck is open.
  const shown = cards.filter((c) =>
    words.length > 0
      ? words.every((w) => c.name.toLocaleLowerCase().includes(w))
      : inGroup(c, group),
  );
  const label = (g: Group) =>
    g === 'all' ? t.groupAll : g === 'major' ? t.groupMajor : t.suits[g];
  return (
    <section className="palette-box">
      <h2 aria-hidden="true">{t.availableCards}</h2>
      <Field label={t.cardsSearch} className="palette-search">
        {(p) => (
          <input
            {...p}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
      </Field>
      <div className="palette-groups" role="group" aria-label={t.paletteGroups}>
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            className="palette-group"
            aria-pressed={words.length === 0 && g === group}
            onClick={() => {
              setGroup(g);
              setQuery('');
            }}
          >
            {label(g)}{' '}
            <span className="palette-count">
              {cards.filter((c) => inGroup(c, g)).length}
            </span>
          </button>
        ))}
      </div>
      <div className="palette" role="group" aria-label={t.availableCards}>
        {shown.map((c) => (
          <PaletteCard
            key={c.id}
            deckId={deckId}
            card={c}
            picked={c.id === pickedId}
            onPick={onPick}
          />
        ))}
        {shown.length === 0 && (
          <p className="meta palette-none">
            {words.length > 0 ? t.cardsNone : t.paletteGroupEmpty}
          </p>
        )}
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
