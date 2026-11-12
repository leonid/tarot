import { useReadingStore } from '../features/store';
import { Field, Toggle } from './kit';
import { useI18n } from './i18n';
import { proxyUrl } from './useProvider';

/** Step 1 of a reading: the question. Optional, so it never blocks. */
export function QuestionField() {
  const question = useReadingStore((s) => s.question);
  const setQuestion = useReadingStore((s) => s.setQuestion);
  const { t } = useI18n();
  return (
    <Field
      label={t.question}
      hint={t.stepQuestionHint}
      className="question label-hidden"
    >
      {(p) => (
        <input
          {...p}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.questionPlaceholder}
        />
      )}
    </Field>
  );
}

/** Step 2: the spread, with what it is for, then deck and options. */
export function SpreadControls() {
  const s = useReadingStore();
  const { t, decks, spreads, getSpread } = useI18n();
  const spread = getSpread(s.spreadId);
  return (
    <>
      <div className="controls">
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
        <Toggle
          label={t.reversals}
          checked={s.allowReversals}
          onChange={(e) => s.setAllowReversals(e.target.checked)}
        />
      </div>
      {spread && (
        <p className="spread-about">
          <span>{spread.description}</span>{' '}
          <span className="spread-count">
            {t.cardCount(spread.positions.length)}
          </span>
        </p>
      )}
      {proxyUrl() && (
        <div className="ai-option">
          <Toggle
            label={t.aiToggle}
            checked={s.useAi}
            aria-describedby="ai-note"
            onChange={(e) => s.setUseAi(e.target.checked)}
          />
          <p id="ai-note" className="meta">
            {t.aiNote}
          </p>
        </div>
      )}
    </>
  );
}
