import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  { ignores: ['dist'] },
  // core + React + Hooks + Prettier
  js.configs.recommended,
  reactPlugin.configs.recommended,
  reactHooks.configs.recommended,
  prettierPlugin.configs.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleSort,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/no-unknown-property': ['error', { ignore: [] }],
      'no-undef': 'error',
      'react/jsx-no-undef': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react-', '^@?\\w'], // react, then, other externals
            [
              '^\\.\\.(?!/?$)', // parent imports
              '^\\.\\./?$', // parent index
              '^\\./', // relative imports
              '^.+\\.?(css)$', // styles
            ],
          ],
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
