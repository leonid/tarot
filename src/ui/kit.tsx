import {
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { Element } from '../domain/elements';
import { ElementIcon } from './ElementIcon';
import { useI18n } from './i18n';
import './kit.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/** A button. `busy` shows progress and blocks clicks; `disabled` dims it. */
export function Button({
  variant = 'secondary',
  busy = false,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      {...rest}
      className={`btn btn-${variant} ${className}`.trim()}
      disabled={rest.disabled || busy}
      aria-busy={busy || undefined}
    />
  );
}

/** What a Field hands to its control so label, error and state stay linked. */
export interface FieldControlProps {
  id: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
}

/** A label above a control, with optional hint and error text. */
export function Field({
  label,
  hint,
  error,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: FieldControlProps) => ReactNode;
}) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? hint;
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        ...(error ? { 'aria-invalid': true as const } : {}),
        ...(note ? { 'aria-describedby': noteId } : {}),
      })}
      {note && (
        <small id={noteId} className={error ? 'field-error' : 'field-hint'}>
          {note}
        </small>
      )}
    </div>
  );
}

/** A checkbox with its label on one line. The native input, restyled. */
export function Toggle({
  label,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string }) {
  return (
    <label className="toggle">
      <input type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

/** A tablist with roving focus: arrows, Home and End move between tabs. */
export function Tabs<T extends string>({
  label,
  tabs,
  value,
  onChange,
}: {
  label?: string;
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(e: KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    const tab = tabs[next];
    if (tab) onChange(tab.id);
    refs.current[next]?.focus();
  }
  return (
    <div role="tablist" aria-label={label} className="tabs">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          className="tab"
          aria-selected={value === tab.id}
          tabIndex={value === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export type NoteKind = 'info' | 'success' | 'error';

/** A live region. It stays in the DOM while empty so changes are announced. */
export function StatusNote({
  kind = 'info',
  children,
}: {
  kind?: NoteKind;
  children?: ReactNode;
}) {
  return (
    <small role="status" className={`note note-${kind}`}>
      {children}
    </small>
  );
}

/** An error or warning the user can close. role="alert" announces it when it appears. */
export function Alert({
  dismissLabel,
  onDismiss,
  children,
}: {
  dismissLabel: string;
  onDismiss: () => void;
  children: ReactNode;
}) {
  return (
    <div role="alert" className="alert note-error">
      <span>{children}</span>
      <Button onClick={onDismiss}>{dismissLabel}</Button>
    </div>
  );
}

/**
 * A notice with one action, usually Undo. role="status": it is announced
 * without interrupting, and it does not take focus.
 */
export function ActionNote({
  actionLabel,
  onAction,
  dismissLabel,
  onDismiss,
  children,
}: {
  actionLabel: string;
  onAction: () => void;
  dismissLabel: string;
  onDismiss: () => void;
  children: ReactNode;
}) {
  return (
    <div role="status" className="alert action-note">
      <span>{children}</span>
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
      <Button onClick={onDismiss}>{dismissLabel}</Button>
    </div>
  );
}

/** A screen's title and the one sentence that says what it is for. */
export function PageHead({
  title,
  purpose,
}: {
  title: string;
  purpose: string;
}) {
  return (
    <header className="page-head">
      <h2 tabIndex={-1}>{title}</h2>
      <p className="lead">{purpose}</p>
    </header>
  );
}

/** One numbered step of a screen. Use inside `<ol className="steps">`. */
export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="step">
      <h3>
        <span className="step-n" aria-hidden="true">
          {n}
        </span>
        {title}
      </h3>
      <div className="step-body">{children}</div>
    </li>
  );
}

/** A small label pill. Always carries a word; the colour only reinforces it. */
export function Chip({
  tone = 'neutral',
  icon,
  title,
  children,
}: {
  tone?: 'neutral' | 'hinge' | Element;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}) {
  return (
    <span className={`chip chip-${tone}`} title={title}>
      {icon}
      {children}
    </span>
  );
}

/** Element chip: triangle glyph plus the element's name, in the element's colour. */
export function ElementChip({ element }: { element: Element }) {
  const { t } = useI18n();
  return (
    <Chip tone={element} icon={<ElementIcon element={element} />}>
      {t.elements[element]}
    </Chip>
  );
}
