import jseslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

import 'eslint-plugin-only-warn';

export default defineConfig([
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },
  globalIgnores(['dist']),
  jseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
