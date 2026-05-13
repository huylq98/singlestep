import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    // React 18's scheduler uses `setImmediate` (available in Node.js) to drain its
    // work queue. Faking setImmediate prevents `act()` from flushing React updates,
    // causing userEvent interactions to hang. Exclude it so scheduler can run freely.
    fakeTimers: {
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
      ],
    },
  },
  resolve: {
    alias: {
      '@site': path.resolve(__dirname, '.'),
    },
  },
});
