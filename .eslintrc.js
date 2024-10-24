module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:import/recommended',
  ],
  plugins: ['prettier', 'react', 'react-hooks', '@typescript-eslint', 'unused-imports'],
  rules: {
    quotes: ['error', 'single'],
    'no-return-await': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'func-names': 'off',
    'spaced-comment': 'off',
    'no-promise-executor-return': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'unused-imports/no-unused-imports': 'error',
  },
  globals: {
    it: 'readonly',
    describe: 'readonly',
    beforeEach: 'writable',
    afterEach: 'writable',
  },
};
