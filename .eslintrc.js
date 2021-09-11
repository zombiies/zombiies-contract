module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'no-await-in-loop': 'off',
  },
};
