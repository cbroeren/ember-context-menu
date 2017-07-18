module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    "array-bracket-spacing": "off",
    "object-curly-spacing":  ["error", "always"],

    "no-console":  ["error", { allow: ["error"] }],
    "quotes":      ["error", "single", { allowTemplateLiterals: true }],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "indent":      ["error", 2, { FunctionExpression: { body: 1 },
                                  CallExpression: { arguments: "off" } }],
    "key-spacing": ["error", { multiLine: { beforeColon: false },
                               align:     { beforeColon: false, on: "value" } }],
    "max-len":     ["error", { code: 85 }],

    "max-statements-per-line": "off",
    "new-cap":                 "off",
    "operator-linebreak":      "off"
  }
};
