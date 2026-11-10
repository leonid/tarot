import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('deals a full spread in simulate mode', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Shuffle and deal'));
    expect(await screen.findByText('Interpretation')).toBeInTheDocument();
  });

  it('switches to setup mode', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: 'Setup' }));
    expect(screen.getAllByText('-- choose a card --').length).toBeGreaterThan(
      0,
    );
  });
});

describe('spread board', () => {
  it('shows one slot per position of the Celtic Cross', async () => {
    const { container } = render(<App />);
    await userEvent.selectOptions(
      screen.getByLabelText('Spread'),
      'celtic-cross',
    );
    expect(container.querySelectorAll('.slot')).toHaveLength(10);
  });
});
