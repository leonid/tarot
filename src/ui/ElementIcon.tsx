import type { Element } from '../domain/elements';

/** Alchemical triangles: up for fire and air, down for water and earth; a bar marks air and earth. */
const shapes: Record<Element, React.ReactNode> = {
  fire: <path d="M12 4 21 19H3Z" />,
  water: <path d="M12 20 3 5h18Z" />,
  air: (
    <>
      <path d="M12 4 21 19H3Z" />
      <path d="M7 13h10" />
    </>
  ),
  earth: (
    <>
      <path d="M12 20 3 5h18Z" />
      <path d="M7 11h10" />
    </>
  ),
};

/** Decorative element mark; the element's name is always printed beside it. */
export function ElementIcon({ element }: { element: Element }) {
  return (
    <svg
      className="element-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[element]}
    </svg>
  );
}
