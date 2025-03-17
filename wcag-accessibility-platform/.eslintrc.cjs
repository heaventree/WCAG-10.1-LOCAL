module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true 
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'jsx-a11y'
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-console': 'warn',
    'max-len': ['error', { 
      code: 120, 
      ignoreComments: true,
      ignoreUrls: true 
    }],
    'accessibility/alt-text': 'error',
    'jsx-a11y/no-static-element-interactions': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'error'
  }
}
