import { useReadingStore } from '../features/store';
import { Field, Toggle } from './kit';
import { useI18n } from './i18n';

export function Controls() {
  const s = useReadingStore();
  const { t, decks, spreads } = useI18n();
  return (
    <section className="controls">
      <Field label={t.question} className="question">
        {(p) => (
          <input
            {...p}
            value={s.question}
            onChange={(e) => s.setQuestion(e.target.value)}
            placeholder={t.questionPlaceholder}
          />
        )}
      </Field>
      <Field label={t.deck}>
        {(p) => (
          <select
            {...p}
            value={s.deckId}
            onChange={(e) => s.setDeck(e.target.value)}
          >
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label={t.spread}>
        {(p) => (
          <select
            {...p}
            value={s.spreadId}
            onChange={(e) => s.setSpread(e.target.value)}
          >
            {spreads.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.name}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Toggle
        label={t.reversals}
        checked={s.allowReversals}
        onChange={(e) => s.setAllowReversals(e.target.checked)}
      />
    </section>
  );
}
