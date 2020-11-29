module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', '@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // off
    '@typescript-eslint/interface-name-prefix': 'off',

    // errors
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-misused-new': 'error',

    //warnings
    // '@typescript-eslint/no-unused-vars': 'warn',
    // '@typescript-eslint/consistent-type-assertions': 'warn',
    // '@typescript-eslint/explicit-function-return-type': 'warn',
    // '@typescript-eslint/no-empty-function': 'warn',
    // '@typescript-eslint/no-empty-interface': 'warn',
    // '@typescript-eslint/no-misused-promises': 'warn',
    // '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
    // '@typescript-eslint/no-useless-constructor': 'warn',
    // '@typescript-eslint/require-await': 'warn',
    // '@typescript-eslint/restrict-plus-operands': 'warn',

    // off
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    camelcase: 'off',
    'import/no-unresolved': 'off',
    'no-control-regex': 'off',
    'no-shadow': 'off',
    'import/no-cycle': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',

    // errors
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
  },
};
