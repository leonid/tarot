import type { KeyboardCoordinateGetter } from '@dnd-kit/core';

type Arrow = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
const ARROWS: readonly string[] = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];

interface Point {
  x: number;
  y: number;
}

/**
 * The slot centre to jump to from `from` when `key` is pressed: the nearest
 * slot in that direction, counting sideways distance double so a move along a
 * row stays in the row. `undefined` when no slot lies that way.
 */
export function nextSlotCentre(
  key: Arrow,
  from: Point,
  centres: readonly Point[],
): Point | undefined {
  const EPS = 1;
  let best: { p: Point; score: number } | undefined;
  for (const p of centres) {
    const dx = p.x - from.x;
    const dy = p.y - from.y;
    const [along, across] =
      key === 'ArrowRight'
        ? [dx, dy]
        : key === 'ArrowLeft'
          ? [-dx, dy]
          : key === 'ArrowDown'
            ? [dy, dx]
            : [-dy, dx];
    if (along <= EPS) continue;
    const score = along + 2 * Math.abs(across);
    if (!best || score < best.score) best = { p, score };
  }
  return best?.p;
}

/**
 * Keyboard sensor coordinates for the setup board: an arrow key moves the
 * dragged card to the next position in that direction instead of a fixed
 * number of pixels, so every move lands on a slot and is announced with its
 * name ("The Fool is over Present").
 */
export const slotKeyboardCoordinates: KeyboardCoordinateGetter = (
  event,
  { context: { droppableContainers, droppableRects, collisionRect } },
) => {
  if (!ARROWS.includes(event.code) || !collisionRect) return undefined;
  event.preventDefault();
  const centres: Point[] = [];
  for (const c of droppableContainers.getEnabled()) {
    const r = droppableRects.get(c.id);
    if (r) centres.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }
  const from = {
    x: collisionRect.left + collisionRect.width / 2,
    y: collisionRect.top + collisionRect.height / 2,
  };
  const to = nextSlotCentre(event.code as Arrow, from, centres);
  // Top-left of the dragged card when its centre sits on the slot centre.
  return to
    ? {
        x: to.x - collisionRect.width / 2,
        y: to.y - collisionRect.height / 2,
      }
    : undefined;
};
