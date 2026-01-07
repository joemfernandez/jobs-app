# Development Guide

This document explains how to work with the development tooling for the Jobs App
project, including linting, formatting, and the ES5 module/namespace pattern used
throughout the codebase.

[← Back to README](../README.md)

## Table of Contents

1. [Overview](#1-overview)
2. [Linting & Formatting](#2-linting--formatting)
   - [Available npm scripts](#available-npm-scripts)
   - [When to run them](#when-to-run-them)
3. [ESLint Configuration](#3-eslint-configuration)
   - [Browser (ES5) environment](#browser-es5-environment)
4. [Prettier Configuration](#4-prettier-configuration)
5. [ES5 Namespace Pattern](#5-es5-namespace-pattern-important)
   - [Key rules](#key-rules-for-this-project)
   - [Example module structure](#example-module-structure)
6. [Test Environment](#6-test-environment)
7. [Folder Structure](#7-folder-structure)
8. [Recommended VS Code Extensions](#8-recommended-vs-code-extensions)
9. [Contributing](#9-contributing)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview

This project uses:

- **ESLint** for code quality and static analysis
- **Prettier** for automatic code formatting
- **Node-based scripts** to ensure consistent behavior across machines
- **VS Code extensions** (optional but recommended) for real-time feedback

The goal is to keep the codebase clean, consistent, and easy to maintain while
preserving compatibility with SharePoint’s ES5 environment.

---

## 2. Linting & Formatting

### Available npm scripts

```bash
npm run lint        # Check for linting issues
npm run lint:fix    # Automatically fix linting issues when possible
npm run format      # Format all files using Prettier
```

### When to run them

- **During development:**  
  VS Code will show ESLint warnings/errors as you type (if the extension is installed).

- **Before committing:**  
  Run:

  ```bash
  npm run lint
  npm run format
  ```

- **Before a release:**  
  It’s good practice to run:

  ```bash
  npm run lint
  npm test
  npm run build
  ```

---

## 3. ESLint Configuration

The project uses ESLint’s **flat config** (`eslint.config.cjs`), which:

- Applies ES5 browser rules to all files in `src/`
- Applies Node/CommonJS rules to build scripts in `scripts/`
- Applies Jest rules to test files in `tests/`
- Ignores generated output (`build/`, `lib/`, etc.)

### Browser (ES5) environment

All files under `src/` are treated as:

- ES5
- Browser-based
- SharePoint-safe
- Using the classic ES5 namespace pattern

Standard browser globals (e.g., `window`, `document`, `console`, `alert`) are
automatically recognized.

---

## 4. Prettier Configuration

Prettier handles:

- Indentation
- Line length
- Quotes
- Semicolons
- Trailing commas
- General formatting consistency

The configuration lives in `.prettierrc`.

VS Code users should enable:

```json
"editor.formatOnSave": true
```

---

## 5. ES5 Namespace Pattern (Important)

This project uses the classic ES5 namespace pattern:

```js
var JobsApp = typeof JobsApp !== "undefined" ? JobsApp : {};
```

### Key rules for this project

1. **Each module may include the namespace initializer.**  
   This is normal for ES5 and ensures modules work regardless of script order.

2. **Do NOT declare `JobsApp` as a global in ESLint config.**  
   This causes ESLint to treat it as a read-only global and will trigger errors.

3. **Do NOT include `/* global JobsApp */` in files that assign to it.**  
   This tells ESLint the variable already exists and should not be modified.

4. **You _may_ include `/* global JobsApp */` in files that only _read_ from it.**

### Example module structure

```js
/* src/ui/jobs-ui.js */
var JobsApp = typeof JobsApp !== "undefined" ? JobsApp : {};

JobsApp.UI = (function () {
  // module code
})();
```

This pattern is safe, SharePoint-compatible, and ESLint-friendly under the current configuration.

---

## 6. Test Environment

Tests run in a Node + Jest environment.

ESLint automatically recognizes:

- `describe`, `test`, `expect`
- `beforeEach`, `afterEach`
- `global`

The test setup file (`tests/test-setup.js`) may polyfill APIs if needed.

---

## 7. Folder Structure

```
src/
  core/       # Core logic
  ui/         # UI logic
  sp/         # SharePoint-specific logic

scripts/      # Build and deployment scripts
tests/        # Jest tests
build/        # Generated output (ignored by ESLint)
```

---

## 8. Recommended VS Code Extensions

- **ESLint**
- **Prettier – Code Formatter**

Recommended workspace settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript"]
}
```

---

## 9. Contributing

Before submitting changes:

1. Run `npm run lint`
2. Run `npm run format`
3. Ensure tests pass
4. Ensure build scripts still work

This keeps the codebase consistent and predictable.

---

## 10. Troubleshooting

### “Read-only global JobsApp should not be modified”

Remove `JobsApp` from:

- ESLint globals
- `/* global */` comments in files that assign to it

### “JobsApp is already defined”

This is normal for ES5 namespace patterns.  
The current config handles this correctly.

### “console is not defined” or “alert is not defined”

Ensure the file is under `src/` so it receives browser globals.

Happy coding!
