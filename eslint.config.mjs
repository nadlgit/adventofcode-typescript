import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist'],
  },
  jseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'require-await': 'warn',
    },
  },
  ...tseslint
    .config(tseslint.configs.strictTypeChecked, {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-unused-expressions': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/require-await': 'warn',
      },
    })
    .map((config) => ({
      ...config,
      files: ['src/**/*.ts'],
    })),
];
