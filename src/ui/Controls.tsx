import { useReadingStore } from '../features/store';
import { useI18n } from './i18n';

export function Controls() {
  const s = useReadingStore();
  const { t, decks, spreads } = useI18n();
  return (
    <section className="controls">
      <label>
        {t.question}
        <input
          value={s.question}
          onChange={(e) => s.setQuestion(e.target.value)}
          placeholder={t.questionPlaceholder}
        />
      </label>
      <label>
        {t.deck}
        <select value={s.deckId} onChange={(e) => s.setDeck(e.target.value)}>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t.spread}
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
        {t.reversals}
      </label>
    </section>
  );
}
