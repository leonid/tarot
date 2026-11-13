/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cspPlugin } from './csp.ts';

export default defineConfig({
  // GitHub Pages serves a project site from /<repo>/; the deploy workflow sets this.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), cspPlugin(process.env.VITE_PROXY_URL)],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: false,
    css: true,
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
