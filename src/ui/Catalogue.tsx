import { useState } from 'react';
import { rwsDeck } from '../content/decks/rws';
import { CardImage } from './CardImage';
import {
  Button,
  Chip,
  ElementChip,
  Field,
  StatusNote,
  Tabs,
  Toggle,
} from './kit';

/** Dev-only page (#catalogue): every control in every state, for review. */
export function Catalogue() {
  const [tab, setTab] = useState<'one' | 'two'>('one');
  const [on, setOn] = useState(true);
  return (
    <main className="app">
      <h1>Catalogue</h1>
      <p>Toggle the OS colour scheme or set data-theme on the html element.</p>

      <h2>Button</h2>
      <p style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button variant="primary">Primary</Button>
        <Button>Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button disabled>Disabled</Button>
        <Button busy>Busy</Button>
      </p>

      <h2>Field</h2>
      <div className="controls">
        <Field label="Default">{(p) => <input {...p} />}</Field>
        <Field label="With hint" hint="Optional">
          {(p) => <input {...p} />}
        </Field>
        <Field label="Invalid" error="This is too long">
          {(p) => <input {...p} defaultValue="x" />}
        </Field>
        <Field label="Disabled">{(p) => <input {...p} disabled />}</Field>
        <Field label="Select">
          {(p) => (
            <select {...p}>
              <option>One</option>
              <option>Two</option>
            </select>
          )}
        </Field>
      </div>

      <h2>CardImage</h2>
      <p style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <span style={{ width: 'var(--card-w)' }}>
          <CardImage deckId="rws-78" card={rwsDeck.cards[0]!} />
        </span>
        <span style={{ width: 'var(--card-w)' }}>
          <CardImage
            deckId="rws-78"
            card={rwsDeck.cards[22]!}
            orientation="reversed"
          />
        </span>
        <span style={{ width: 'var(--card-w)' }}>
          <CardImage deckId="no-art" card={rwsDeck.cards[1]!} />
        </span>
      </p>

      <h2>Toggle</h2>
      <p>
        <Toggle
          label="On or off"
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
        />{' '}
        <Toggle label="Disabled" disabled />
      </p>

      <h2>Tabs</h2>
      <Tabs
        label="Example"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ]}
      />

      <h2>Chip</h2>
      <p style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Chip>Neutral</Chip>
        <Chip tone="hinge">Hinge</Chip>
        {(['fire', 'water', 'air', 'earth'] as const).map((e) => (
          <ElementChip key={e} element={e} />
        ))}
      </p>

      <h2>StatusNote</h2>
      <p>
        <StatusNote>Info</StatusNote>{' '}
        <StatusNote kind="success">Saved</StatusNote>{' '}
        <StatusNote kind="error">Something failed</StatusNote>
      </p>
    </main>
  );
}
