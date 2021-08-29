// eslint-disable-next-line @typescript-eslint/no-var-requires
const readPkgUp = require('read-pkg-up')

let hasPrettier = false
let hasJestDom = false
let hasTestingLibrary = false
let hasEmotion = false
let hasReact = false

try {
  const { packageJson } = readPkgUp.sync({ normalize: true })
  const allDeps = Object.keys({
    ...packageJson.peerDependencies,
    ...packageJson.devDependencies,
    ...packageJson.dependencies
  })
  hasReact = allDeps.includes('react') || allDeps.includes('react-dom')

  hasPrettier = allDeps.includes('prettier')
  hasJestDom = allDeps.includes('@testing-library/jest-dom')
  hasTestingLibrary =
    allDeps.includes('@testing-library/react') ||
    allDeps.includes('@testing-library/react-hooks')
  hasEmotion =
    allDeps.includes('@emotion/react') ||
    allDeps.includes('@emotion/styled') ||
    allDeps.includes('@emotion/css')
} catch (error) {
  // ignore error
}

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: hasReact }
  },
  plugins: [
    '@typescript-eslint',
    'promise',
    'jest',
    hasReact && 'react-hooks',
    hasJestDom && 'jest-dom',
    hasTestingLibrary && 'testing-library',
    hasEmotion && '@emotion'
  ].filter(Boolean),
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:compat/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    hasReact && './react',
    hasJestDom && 'plugin:jest-dom/recommended',
    hasTestingLibrary && 'plugin:testing-library/react',
    hasPrettier && 'prettier'
  ].filter(Boolean),
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true
  },
  rules: {
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    ...(hasReact
      ? {
          'react/jsx-props-no-spreading': 'off',
          'react/jsx-filename-extension': [
            'error',
            {
              extensions: ['.js', 'jsx', '.ts', '.tsx']
            }
          ],
          // Enforce Rules of Hooks
          // https://github.com/facebook/react/blob/c11015ff4f610ac2924d1fc6d569a17657a404fd/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js
          'react-hooks/rules-of-hooks': 'error',

          // Verify the list of the dependencies for Hooks like useEffect and similar
          // https://github.com/facebook/react/blob/1204c789776cb01fbaf3e9f032e7e2ba85a44137/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js
          'react-hooks/exhaustive-deps': 'error'
        }
      : null),
    ...(hasEmotion
      ? {
          '@emotion/pkg-renaming': 'error'
        }
      : null)
  }
}
