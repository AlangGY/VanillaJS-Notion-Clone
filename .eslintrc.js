module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always']
  }
};
