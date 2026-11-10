import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { useReadingStore } from '../features/store';
import { THEME_KEY, readTheme } from './theme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  useReadingStore.setState({ theme: 'system', locale: 'en' });
});

describe('theme picker', () => {
  it('sets data-theme, saves the choice, and "System" clears the override', async () => {
    render(<App />);
    const picker = screen.getByLabelText('Theme');
    expect(picker).toHaveValue('system');

    await userEvent.selectOptions(picker, 'dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');

    await userEvent.selectOptions(picker, 'light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await userEvent.selectOptions(picker, 'system');
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem(THEME_KEY)).toBe('system');
  });

  it('reads a saved choice and ignores junk', () => {
    localStorage.setItem(THEME_KEY, 'dark');
    expect(readTheme()).toBe('dark');
    localStorage.setItem(THEME_KEY, 'purple');
    expect(readTheme()).toBe('system');
  });

  it('applies the saved theme when the app mounts', () => {
    useReadingStore.setState({ theme: 'dark' });
    render(<App />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('is labelled in Russian', () => {
    useReadingStore.setState({ locale: 'ru' });
    render(<App />);
    expect(screen.getByLabelText('Тема')).toBeInTheDocument();
  });
});
