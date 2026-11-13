import './test-locales';
import { beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { useReadingStore } from './features/store';

const initial = useReadingStore.getState();

afterEach(() => {
  cleanup();
  useReadingStore.setState(initial, true);
});

// Tests of the reading screens start on "Get a reading"; a test that needs
// the home screen or a share link sets its own address.
beforeEach(() => {
  // Some suites (the proxy) run without a browser environment.
  if (typeof history !== 'undefined')
    history.replaceState(null, '', '#/reading');
});
