module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'no-restricted-imports': ['error', { patterns: ['./', '../', '.'] }],
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': ['error'],
    '@next/next/no-img-element': 'off'
  },
}
