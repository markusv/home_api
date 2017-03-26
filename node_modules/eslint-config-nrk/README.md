# eslint-config-nrk [![Build Status](https://travis-ci.org/nrkno/eslint-config-nrk.svg?branch=master)](https://travis-ci.org/nrkno/eslint-config-nrk) [![Coverage Status](https://img.shields.io/coveralls/nrkno/eslint-config-nrk/master.svg?style=flat)](https://coveralls.io/github/nrkno/eslint-config-nrk?branch=master) [![npm version](https://img.shields.io/npm/v/eslint-config-nrk.svg?style=flat)](https://www.npmjs.com/package/eslint-config-nrk)

A shared [ESLint](http://eslint.org/) configuration for and by JavaScript developers at NRK.

## Installation

Get started by running this command in the root of your project (`npm` is also supported):

```sh
yarn add eslint eslint-config-nrk --dev
```

Then add an `.eslintrc.json` file to the root of your project (see *Documentation* below) before running the `eslint` command, with the following:

```json
{
  "extends": [
    "nrk"
  ]
}
```

NOTE: `eslint` plugins are available for most modern text editors, like Atom, emacs, vim, Sublime Text, etc.

## Documentation

### Basic configuration

`eslint` is configured by adding an `.eslintrc.json` file to the root of a project where `env` and `extends` are specified. Refer to the [`eslint` documentation](http://eslint.org/docs/user-guide/configuring) for more configuration options.

The following example shows a typical setup for linting both browser and Node.js (CommonJS) code:

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "nrk"
  ]
}
```

### React configuration

For supporting React projects, also add the `nrk/rules/react` extension:

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "nrk",
    "nrk/rules/react"
  ]
}
```

Then install [`eslint-plugin-react`](https://github.com/yannickcr/eslint-plugin-react):

```sh
yarn add eslint-plugin-react --dev
```

#### JSX

For supporting [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html), also add the `nrk/rules/jsx` extension:

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "nrk",
    "nrk/rules/react",
    "nrk/rules/jsx"
  ]
}
```

It is necessary to configure `eslint` to lint files matching the `.jsx` extension:

```sh
eslint . --ext=.js,.jsx
```

Please note that the `nrk/rules/jsx` configuration is always using the latest version of React. When using an older version, please refer to the [`eslint-plugin-react` documentation](https://github.com/yannickcr/eslint-plugin-react#configuration).

### Legacy ES5 projects

This configuration is available as a way of migrating to a more modern codebase (recommended).

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "nrk/es5"
  ]
}
```
