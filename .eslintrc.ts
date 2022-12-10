import { Linter } from 'eslint';

export default {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    'react',
    'prettier',
    'react-hooks',
    '@typescript-eslint',
    'simple-import-sort',
  ],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.vite.json'],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

    // ignore unused prefixed with _
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    'simple-import-sort/exports': 2,
    'simple-import-sort/imports': [
      2,
      {
        groups: [
          ['^\\u0000'],
          [
            '^(?!components|constants|containers|hooks|images|mocks|translations|utils)@?\\w',
          ],
          ['^'],
          ['^\\.'],
        ],
      },
    ],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
} as Linter.Config;
