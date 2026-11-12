import { useState } from 'react';
import { elementOf } from '../domain/elements';
import type { Card, Deck } from '../domain/types';
import { useReadingStore } from '../features/store';
import { CardImage } from './CardImage';
import { useI18n } from './i18n';
import { Chip, ElementChip, Field, PageHead } from './kit';
import { PageLink } from './Nav';

/** What was typed in the search box, kept while the visitor reads a card. */
let lastQuery = '';

/**
 * "Learn the cards": the whole deck to browse and search, and one page per
 * card with its picture, both meanings, its parts and Waite's 1911 text.
 */
export function Cards({ cardId }: { cardId?: string }) {
  const deckId = useReadingStore((s) => s.deckId);
  const { decks, getDeck } = useI18n();
  const deck = getDeck(deckId) ?? decks[0]!;
  return cardId === undefined ? (
    <Library deck={deck} />
  ) : (
    <CardPage deck={deck} cardId={cardId} />
  );
}

function Library({ deck }: { deck: Deck }) {
  const { t, meanings } = useI18n();
  const [query, setQuery] = useState(lastQuery);
  const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = (card: Card) => {
    const m = meanings[card.id];
    const text = [
      card.name,
      ...(m ? [...m.upright.keywords, ...m.reversed.keywords] : []),
    ]
      .join(' ')
      .toLocaleLowerCase();
    return words.every((w) => text.includes(w));
  };
  const found = deck.cards.filter(matches);
  const groups: [string, Card[]][] = (
    [
      [t.groupMajor, found.filter((c) => c.arcana === 'major')],
      ...(['wands', 'cups', 'swords', 'pentacles'] as const).map(
        (suit): [string, Card[]] => [
          t.suits[suit],
          found.filter((c) => c.suit === suit),
        ],
      ),
    ] satisfies [string, Card[]][]
  ).filter(([, cards]) => cards.length > 0);

  return (
    <>
      <PageHead title={t.goalCards} purpose={t.cardsPurpose} />
      <Field
        label={t.cardsSearch}
        hint={t.cardsSearchHint}
        className="cards-search"
      >
        {(p) => (
          <input
            {...p}
            type="search"
            value={query}
            onChange={(e) => {
              lastQuery = e.target.value;
              setQuery(e.target.value);
            }}
          />
        )}
      </Field>
      <p role="status" className="meta">
        {found.length === 0
          ? t.cardsNone
          : t.cardsShown(found.length, deck.cards.length)}
      </p>
      {groups.map(([title, cards]) => (
        <section key={title} className="card-group">
          <h3>{title}</h3>
          <ul className="card-grid">
            {cards.map((card) => (
              <li key={card.id}>
                <PageLink page="cards" sub={card.id} className="card-link">
                  <CardImage deckId={deck.id} card={card} />
                </PageLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function CardPage({ deck, cardId }: { deck: Deck; cardId: string }) {
  const { t, meanings, waite, formula } = useI18n();
  const index = deck.cards.findIndex((c) => c.id === cardId);
  const card = deck.cards[index];
  const all = (
    <PageLink page="cards" className="btn btn-secondary">
      {t.cardAllCards}
    </PageLink>
  );
  if (!card)
    return (
      <>
        <PageHead title={t.goalCards} purpose={t.cardUnknown} />
        <p className="actions">{all}</p>
      </>
    );
  const meaning = meanings[card.id];
  const old = waite[card.id];
  const element = elementOf(card);
  const previous = deck.cards[index - 1];
  const next = deck.cards[index + 1];
  return (
    <article className="card-page">
      <div className="card-page-art">
        <CardImage
          deckId={deck.id}
          card={card}
          sizes="(max-width: 40em) 60vw, 18em"
        />
      </div>
      <div className="card-page-text">
        <header className="page-head">
          <h2 tabIndex={-1}>{card.name}</h2>
          <p className="chips">
            <Chip>{card.suit ? t.suits[card.suit] : t.groupMajor}</Chip>
            {element && <ElementChip element={element} />}
          </p>
        </header>
        {meaning &&
          (
            [
              [t.upright, meaning.upright],
              [t.reversed, meaning.reversed],
            ] as const
          ).map(([title, side]) => (
            <section key={title} className="card-side">
              <h3>{title}</h3>
              <p>{side.summary}</p>
              <ul className="keywords">
                {side.keywords.map((k) => (
                  <li key={k}>
                    <Chip>{k}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        <section className="card-side">
          <h3>{t.cardParts}</h3>
          <p>{formula(card, deck)}</p>
        </section>
        {old && (
          <section className="card-side">
            <h3>{t.schoolWaite}</h3>
            <dl className="card-waite">
              <div>
                <dt>{t.upright}</dt>
                <dd>{old.upright}</dd>
              </div>
              <div>
                <dt>{t.reversed}</dt>
                <dd>{old.reversed}</dd>
              </div>
            </dl>
          </section>
        )}
        <nav className="card-nav" aria-label={t.goalCards}>
          {previous && (
            <PageLink
              page="cards"
              sub={previous.id}
              className="btn btn-secondary card-prev"
            >
              <span className="visually-hidden">{t.cardPrevious}</span>
              <span>{previous.name}</span>
            </PageLink>
          )}
          {all}
          {next && (
            <PageLink
              page="cards"
              sub={next.id}
              className="btn btn-secondary card-next"
            >
              <span className="visually-hidden">{t.cardNext}</span>
              <span>{next.name}</span>
            </PageLink>
          )}
        </nav>
      </div>
    </article>
  );
}
