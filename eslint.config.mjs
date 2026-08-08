import jseslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },
  globalIgnores(['dist']),
  jseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'require-await': 'warn',
    },
  },
  {
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/require-await': 'warn',
    },
  },
]);
