import { getDeck } from '../../content/decks';
import { getSpread } from '../../content/spreads';
import { ReadingView } from '../../ui/Layout';
import { useReadingStore } from '../store';

/**
 * Setup mode. Click/select placement is the accessible baseline; drag and
 * drop (dnd-kit) is layered on top later.
 */
export function SetupView() {
  const { deckId, spreadId, placements, allowReversals, place, clearPosition } =
    useReadingStore();
  const deck = getDeck(deckId);
  const spread = getSpread(spreadId);
  if (!deck || !spread) return null;

  return (
    <>
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
                    disabled={
                      placements.some((p) => p.cardId === c.id) &&
                      placed?.cardId !== c.id
                    }
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
      <ReadingView />
    </>
  );
}
