import { decks } from '../content/decks';
import { spreads } from '../content/spreads';
import { useReadingStore } from '../features/store';

export function Controls() {
  const s = useReadingStore();
  return (
    <section className="controls">
      <label>
        Question
        <input
          value={s.question}
          onChange={(e) => s.setQuestion(e.target.value)}
          placeholder="What do you want to ask?"
        />
      </label>
      <label>
        Deck
        <select value={s.deckId} onChange={(e) => s.setDeck(e.target.value)}>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Spread
        <select
          value={s.spreadId}
          onChange={(e) => s.setSpread(e.target.value)}
        >
          {spreads.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={s.allowReversals}
          onChange={(e) => s.setAllowReversals(e.target.checked)}
        />
        Reversals
      </label>
    </section>
  );
}
