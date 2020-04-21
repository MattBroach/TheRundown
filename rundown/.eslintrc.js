module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.prod.js'
      }
    }
  },
  rules: {
    semi: [2, 'never'],
    'comma-dangle': [2, 'always-multiline'],
    'no-confusing-arrow': 0,
    'object-curly-newline': 0,
  },
};
