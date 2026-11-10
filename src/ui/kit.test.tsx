import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, Field, StatusNote, Tabs, Toggle } from './kit';

describe('Button', () => {
  it('clicks, and defaults to type=button so it never submits a form', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    const b = screen.getByRole('button', { name: 'Go' });
    expect(b).toHaveAttribute('type', 'button');
    await userEvent.click(b);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has primary, secondary and danger variants', () => {
    render(
      <>
        <Button variant="primary">p</Button>
        <Button>s</Button>
        <Button variant="danger">d</Button>
      </>,
    );
    expect(screen.getByText('p')).toHaveClass('btn-primary');
    expect(screen.getByText('s')).toHaveClass('btn-secondary');
    expect(screen.getByText('d')).toHaveClass('btn-danger');
  });

  it('does not click when disabled or busy, and marks busy', async () => {
    const onClick = vi.fn();
    render(
      <>
        <Button disabled onClick={onClick}>
          off
        </Button>
        <Button busy onClick={onClick}>
          wait
        </Button>
      </>,
    );
    await userEvent.click(screen.getByText('off'));
    await userEvent.click(screen.getByText('wait'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('wait')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('off')).not.toHaveAttribute('aria-busy');
  });
});

describe('Field', () => {
  it('links the label to the control', () => {
    render(<Field label="Deck">{(p) => <input {...p} />}</Field>);
    expect(screen.getByLabelText('Deck')).toBeInTheDocument();
  });

  it('describes the control with a hint', () => {
    render(
      <Field label="Q" hint="Optional">
        {(p) => <input {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText('Q');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription('Optional');
  });

  it('marks the control invalid and describes it with the error', () => {
    render(
      <Field label="Q" hint="Optional" error="Too long">
        {(p) => <input {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText('Q');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Too long');
  });

  it('supports a disabled control', () => {
    render(<Field label="D">{(p) => <select {...p} disabled />}</Field>);
    expect(screen.getByLabelText('D')).toBeDisabled();
  });
});

describe('Toggle', () => {
  it('toggles and is labelled by its text', async () => {
    const onChange = vi.fn();
    render(<Toggle label="Reversals" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Reversals'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    render(<Toggle label="X" disabled readOnly checked />);
    expect(screen.getByLabelText('X')).toBeDisabled();
  });
});

describe('Tabs', () => {
  function Harness() {
    const [v, setV] = useState<'a' | 'b' | 'c'>('a');
    return (
      <Tabs
        label="Mode"
        value={v}
        onChange={setV}
        tabs={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ]}
      />
    );
  }

  it('marks the selected tab and gives only it a tab stop', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Mode' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('moves with arrows, wraps, and supports Home and End', async () => {
    render(<Harness />);
    screen.getByRole('tab', { name: 'A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus();
  });

  it('selects on click', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('tab', { name: 'C' }));
    expect(screen.getByRole('tab', { name: 'C' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

describe('StatusNote', () => {
  it('is a live region even when empty, so later text is announced', () => {
    render(<StatusNote />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('carries its kind as a class for the glyph and colour', () => {
    render(<StatusNote kind="error">Failed</StatusNote>);
    expect(screen.getByRole('status')).toHaveClass('note-error');
    expect(screen.getByRole('status')).toHaveTextContent('Failed');
  });
});
