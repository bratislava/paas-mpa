module.exports = {
  extends: ['auto'],
  ignorePatterns: ['*.config.*', '.eslintrc.js', '.expo'],
  // overrides: [
  //   {
  //     files: ['*.ts', '*.tsx', '*.d.ts'],
  //     parserOptions: {
  //       project: './tsconfig.json',
  //     },
  //   },
  // ],
  rules: {
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    /** We use this a lot with isDefined and hasAttributes */
    'unicorn/no-array-callback-reference': 'off',
    // Named export is easier to refactor automatically
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-shadow': ['error', { allow: ['event', 'value', 'key', 'error'] }],
    /** Too tedious to type every function return explicitly */
    '@typescript-eslint/explicit-function-return-type': 'off',
    /** We prefer arrow functions */
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    /** e.g. Keeps return statement in short arrow functions */
    'arrow-body-style': 'off',
    /** Links get confused for secrets */
    'no-secrets/no-secrets': ['error', { ignoreContent: '^http' }],
    /** Very hard to maintain, especially with other libs not respecting this */
    '@typescript-eslint/no-unsafe-assignment': 'off',
    /** Turned off in other repos, consider keeping here as we have clean slate to build upon */
    // "unicorn/prefer-spread": "off",
    /** To remove optional parameter warning e.g. { page?: number } */
    'react/require-default-props': 'off',
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'switch-case/newline-between-switch-case': 'off',
    // This rule disallows lexical declarations (let, const, function and class) in case/default clauses.
    // "no-case-declarations": "off",
    // Solve warning "Promise-returning function provided to attribute where a void return was expected."
    // '@typescript-eslint/no-misused-promises': [
    //   2,
    //   {
    //     checksVoidReturn: {
    //       attributes: false,
    //     },
    //   },
    // ],
    /** better to use empty function */
    // "lodash/prefer-noop": "off",
    /** if comparing values in cx function or creating translations, it"s overkill to create variables for that */
    'sonarjs/no-duplicate-string': 'warn',
    // quite annoying as it conflicts with VS Code"s auto import
    'lodash/import-scope': 'off',
    /* solves error with imports from files with no extension */
    'import/extensions': ['error', 'ignorePackages', { '': 'never' }],
    // 'no-process-env': 'error',
    'react/react-in-jsx-scope': 'off',
    // cumbersome when prototyping
    'react-native/no-color-literals': 'off',
  },
}
