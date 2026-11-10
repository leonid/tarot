import type { Suit } from '../domain/types';

const shapes: Record<Suit, React.ReactNode> = {
  wands: (
    <>
      <path d="M12 22V4" />
      <path d="M12 10c-4 0-5.500-3-5.500-5.500 4 0 5.500 2.500 5.500 5.500Z" />
      <path d="M12 15c4 0 5.500-3 5.500-5.500-4 0-5.500 2.500-5.500 5.500Z" />
    </>
  ),
  cups: (
    <>
      <path d="M5 4h14l-1 6a6 6 0 0 1-12 0Z" />
      <path d="M12 16v4M8 21h8" />
    </>
  ),
  swords: (
    <>
      <path d="M12 2v14M7 13h10M12 16v6" />
    </>
  ),
  pentacles: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 5l4.110 12.660L5.340 9.840h13.320L7.890 17.660Z" />
    </>
  ),
};

/** Decorative suit mark; the suit's name is always printed next to it. */
export function SuitIcon({ suit }: { suit: Suit }) {
  return (
    <svg
      className={`suit-icon suit-${suit}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[suit]}
    </svg>
  );
}
