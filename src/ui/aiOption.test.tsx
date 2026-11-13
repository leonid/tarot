import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useReadingStore } from '../features/store';
import { SpreadControls as Controls } from './Controls';
import { ReadingView } from './Layout';

const initial = useReadingStore.getState();
const store = () => useReadingStore.getState();

function Page() {
  return (
    <>
      <Controls />
      <ReadingView />
    </>
  );
}

/** A proxy that answers with a valid reply for whatever reading it is sent. */
const proxyOk = vi.fn(async (_url: unknown, init?: RequestInit) => {
  const req = JSON.parse(init!.body as string) as {
    placements: { positionId: string; cardId: string }[];
  };
  return new Response(
    JSON.stringify({
      cards: req.placements.map((p) => ({ ...p, note: 'note from the model' })),
      relations: [],
      summary: 'Summary from the model.',
      advice: 'Advice from the model.',
    }),
  );
});

beforeEach(() => {
  localStorage.clear();
  useReadingStore.setState({ ...initial, locale: 'en', useAi: false }, true);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  proxyOk.mockClear();
});

describe('AI reader option (M4.8)', () => {
  it('is not offered when no proxy is configured', () => {
    vi.stubEnv('VITE_PROXY_URL', '');
    render(<Page />);
    expect(screen.queryByLabelText('Write the reading with AI')).toBeNull();
  });

  it('is off by default and explains what is sent', () => {
    vi.stubEnv('VITE_PROXY_URL', 'https://proxy.test/interpret');
    render(<Page />);
    const box = screen.getByLabelText('Write the reading with AI');
    expect(box).not.toBeChecked();
    expect(box).toHaveAccessibleDescription(
      /Anthropic.*up to 30 days.*24 hours/,
    );
    expect(box).toHaveAccessibleDescription(/Off by default/);
  });

  it('makes no request and labels the built-in reader while off', async () => {
    vi.stubEnv('VITE_PROXY_URL', 'https://proxy.test/interpret');
    vi.stubGlobal('fetch', proxyOk);
    render(<Page />);
    act(() => store().dealRandom(1));
    expect(
      await screen.findByText('Written by the built-in reader'),
    ).toBeInTheDocument();
    expect(proxyOk).not.toHaveBeenCalled();
  });

  it('turns on with a click, is remembered, and labels the AI reading', async () => {
    vi.stubEnv('VITE_PROXY_URL', 'https://proxy.test/interpret');
    vi.stubGlobal('fetch', proxyOk);
    render(<Page />);
    act(() => store().dealRandom(1));
    await screen.findByText('Written by the built-in reader');

    await userEvent.click(screen.getByLabelText('Write the reading with AI'));
    expect(
      await screen.findByText('Written by AI (Claude)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Summary from the model.')).toBeInTheDocument();
    expect(proxyOk).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('tarot.ai.v1')).toBe('on');
  });

  it('says so when the AI is on but the service is down', async () => {
    vi.stubEnv('VITE_PROXY_URL', 'https://proxy.test/interpret');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      }),
    );
    useReadingStore.setState({ useAi: true });
    render(<Page />);
    act(() => store().dealRandom(1));
    expect(
      await screen.findByText(/The AI service did not answer/),
    ).toBeInTheDocument();
    expect(screen.queryByText('Written by AI (Claude)')).toBeNull();
    // The reading itself is still shown.
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('turning it off again goes back to the built-in reader', async () => {
    vi.stubEnv('VITE_PROXY_URL', 'https://proxy.test/interpret');
    vi.stubGlobal('fetch', proxyOk);
    useReadingStore.setState({ useAi: true });
    render(<Page />);
    act(() => store().dealRandom(1));
    await screen.findByText('Written by AI (Claude)');
    await userEvent.click(screen.getByLabelText('Write the reading with AI'));
    expect(
      await screen.findByText('Written by the built-in reader'),
    ).toBeInTheDocument();
    expect(localStorage.getItem('tarot.ai.v1')).toBe('off');
  });
});
