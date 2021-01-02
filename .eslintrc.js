module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    es6: true,
    jest: true,
  },
  extends: [
    // react-native-community
    '@react-native-community',
    // airbnb-typescript
    'airbnb-typescript',

    // prettier
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',

    // eslint
    'eslint:recommended',

    // plugin
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  globals: {
    __DEV__: true,
  },
  rules: {
    // prettier
    'prettier/prettier': ['error'],

    // react
    'react/jsx-filename-extension': [2, { extensions: ['.ts', '.tsx'] }],
    'react-hooks/rules-of-hooks': 'error', // hooks
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useDeepMemo|useComposeStyle)',
      },
    ], // hooks
    'react/display-name': 0,
    'react/jsx-props-no-spreading': 0,
    'react/state-in-constructor': 0,
    'react/static-property-placement': 0,
    'react/prop-types': 0,

    // import
    'import/no-extraneous-dependencies': 0,
    'import/newline-after-import': 2,
    'import/prefer-default-export': 0,
    'import/imports-first': 2,
    'import/order': [
      2,
      {
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    // @typescript
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    // '@typescript-eslint/interface-name-prefix': [2, 'always'],
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-redeclare': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-expressions': [2, { allowShortCircuit: true }],
    '@typescript-eslint/no-use-before-define': [
      2,
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    '@typescript-eslint/naming-convention': [
      2,
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        types: ['string', 'number', 'array'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [1, { varsIgnorePattern: 'global' }],
    '@typescript-eslint/no-loop-func': 0,
    // eslint
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
  },
};
