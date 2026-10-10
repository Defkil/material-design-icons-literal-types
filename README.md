# Material Design Icons Literal Types

This package provides TypeScript literal types for the icon names from
the [Google Material Design Icons](https://github.com/google/material-design-icons) repository.
It allows you to use the icon names with type safety in your TypeScript projects.

## Installation

> Install the package

```bash
npm install -D material-design-icons-literal-types
```

```bash
pnpm add -D material-design-icons-literal-types
```

```bash
yarn add -D material-design-icons-literal-types
```

## Usage

> Import the desired icon type from the package

```typescript
import type {MaterialSymbols} from 'material-design-icons-literal-types'

const mySymbol: MaterialSymbols = 'home'
```

```typescript
import type {MaterialIcons} from 'material-design-icons-literal-types'

const myIcon: MaterialIcons = 'home'
```

The package provides the following literal types:

- `MaterialSymbols`: Icon names for the Material Symbols icon set.
- `MaterialIcons`: Icon names for the Material Icons icon set.

Using these literal types ensures that you are using valid icon names and helps catch typos during development.

## Updating Icon Types

Every Monday, Wednesday, and Friday at midnight (UTC) a GitHub Actions workflow builds the types from the Material Design
Icons repository and publishes a new patch version to npm if the package differs from the latest release.
Releases are published with npm trusted publishing and carry a provenance attestation.

`pnpm build` writes the types to `dist/`; `npm pack` and `npm publish` run it automatically.

## License

This project is licensed under the ISC License - see the [LICENSE](./LICENSE) file for details.
