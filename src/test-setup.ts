import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { useReadingStore } from './features/store';

const initial = useReadingStore.getState();

afterEach(() => {
  cleanup();
  useReadingStore.setState(initial, true);
});
