import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    setupFiles: ['jest-extended/all'],
  },
  resolve: {
    alias: {
      '#utils': path.resolve(__dirname, 'src', 'utils'),
    },
  },
});
