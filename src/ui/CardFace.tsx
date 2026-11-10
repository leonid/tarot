import type { Card, PlacedCard } from '../domain/types';
import { SuitIcon } from './SuitIcon';
import { useI18n } from './i18n';

const ROMAN: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** 0-21 as a numeral: 0 stays "0", the rest are Roman. */
export function romanNumeral(n: number): string {
  if (n === 0) return '0';
  let out = '';
  let rest = n;
  for (const [value, glyph] of ROMAN) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}

/** Number shown on the face: Roman for majors, the pip count for 1-10, none for courts. */
export function faceNumber(card: Card): string {
  if (card.arcana === 'major') return romanNumeral(card.number);
  return card.number <= 10 ? String(card.number) : '';
}

/**
 * The typographic card face: numeral, suit mark and name, with the word
 * "reversed" when reversed (the mark is also turned over, but the word carries
 * the meaning). Text never rotates. Images will replace the inside of this
 * component later.
 */
export function CardFace({
  card,
  orientation = 'upright',
  compact = false,
}: {
  card: Card;
  orientation?: PlacedCard['orientation'];
  /** One line (numeral, mark, name), for the palette. */
  compact?: boolean;
}) {
  const { t } = useI18n();
  const reversed = orientation === 'reversed';
  const num = faceNumber(card);
  return (
    <span
      className={`card-face${reversed ? ' reversed' : ''}${compact ? ' compact' : ''}`}
    >
      <span className="card-face-top">
        {num && <span className="card-face-num">{num}</span>}
        {card.suit && <SuitIcon suit={card.suit} />}
      </span>
      <span className="card-face-name">{card.name}</span>
      {reversed && <span className="card-face-rev">{t.slotReversed}</span>}
    </span>
  );
}
