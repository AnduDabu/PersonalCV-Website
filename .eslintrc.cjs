// .cjs, not .js: package.json sets "type": "module", so a .eslintrc.js would be parsed
// as an ES module and ESLint 8 would fail to load it.
module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        // Vite's automatic JSX transform means React does not need to be in scope, so
        // files without an `import React` are correct.
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    // Keeps ESLint out of build output and dependencies. Without this it walks into
    // dist/assets and fails looking for a config there.
    ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: 'detect' } },
    plugins: ['react-refresh'],
    rules: {
        // Context files that export both a provider component and its hook are idiomatic
        // React. This rule would have them split across files purely to help fast
        // refresh, which is not worth the indirection.
        'react-refresh/only-export-components': 'off',
        'no-unused-vars': [
            'error',
            {
                // The codebase mixes both styles: some files still `import React`, others
                // rely on the automatic JSX transform. Both compile fine, and ignoring the
                // React binding avoids rewriting every component to one style.
                varsIgnorePattern: '^React$',
                // `const { onMouseEnter, ...rest } = props` deliberately names props in
                // order to exclude them from the rest object. Those names are meant to be
                // unused.
                ignoreRestSiblings: true,
                // Conventional placeholder for a positional argument that has to be
                // present but is not needed, e.g. `map((_, i) => ...)`.
                argsIgnorePattern: '^_',
                // Same convention when skipping leading elements of an array, e.g.
                // `const [_, row, col] = id.split('-')`.
                destructuredArrayIgnorePattern: '^_',
            },
        ],
        // This codebase does not use PropTypes; TypeScript-style prop validation is not
        // part of the project, so the rule would only produce noise.
        'react/prop-types': 'off',
        // Apostrophes in prose render correctly in JSX. Escaping every one of them makes
        // the copy harder to read and edit for no practical gain.
        'react/no-unescaped-entities': 'off',
    },
};
