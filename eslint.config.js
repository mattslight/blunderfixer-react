import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import simpleSort from 'eslint-plugin-simple-import-sort';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist'] },

  // Flat presets that really *are* flat
  js.configs.recommended,
  reactPlugin.configs.flat?.['recommended'] ?? {},
  reactPlugin.configs.flat?.['jsx-runtime'] ?? {},

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        allowJs: true,
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'simple-import-sort': simpleSort,
      prettier: prettierPlugin,
    },
    rules: {
      /* --- TypeScript preset (flat) --- */
      ...tsPlugin.configs['recommended-type-checked'].rules,

      /* --- React-hooks (inline) --- */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* --- Prettier (inline) --- */
      'prettier/prettier': 'error',

      /* --- Other overrides --- */
      'react/prop-types': 'off', // TS handles props
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react-', '^@?\\w'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./', '^.+\\.?(css)$'],
          ],
        },
      ],
    },
    settings: { react: { version: 'detect' } },
  },
];
