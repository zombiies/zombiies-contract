module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-typescript/base",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-unused-expressions": "off",
  },
};
