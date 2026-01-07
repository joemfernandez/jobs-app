[← Back to README](../README.md)

# Development Guide

This document explains how to work with the development tooling for the Jobs App
project, including linting, formatting, testing, the ES5 namespace pattern, and
the SharePoint‑ready build process.

---

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
11. [Build & Deployment Workflow](#11-build--deployment-workflow)
    - [Build Script](#111-build-script-scriptsbuildjs)
    - [CEWP Generation](#112-cewp-generation-scriptsupdate-cewpjs)
    - [Full Build Workflow](#113-full-build--cewp-workflow)
    - [Deploying to SharePoint](#114-deploying-to-sharepoint)
    - [Notes & Best Practices](#115-notes--best-practices)

---

## 1. Overview

This project uses:

- **ESLint** for code quality
- **Prettier** for formatting
- **Jest** for unit testing
- **A simple build pipeline** for SharePoint deployment
- **ES5 modules** for SharePoint compatibility

The goal is to keep the codebase clean, maintainable, and predictable.

---

## 2. Linting & Formatting

### Available npm scripts

```bash
npm run lint        # Check for linting issues
npm run lint:fix    # Automatically fix issues when possible
npm run format      # Format all files using Prettier
```

### When to run them

- During development (VS Code will show issues live)
- Before committing
- Before a release

---

## 3. ESLint Configuration

The project uses ESLint’s **flat config** (`eslint.config.cjs`), which applies:

- ES5 browser rules to `src/`
- Node/CommonJS rules to `scripts/`
- Jest rules to `tests/`

### Browser (ES5) environment

All files under `src/` are treated as:

- ES5
- Browser-based
- SharePoint-safe

Browser globals (e.g., `window`, `document`, `console`) are automatically recognized.

---

## 4. Prettier Configuration

Prettier handles:

- Indentation
- Quotes
- Semicolons
- Line wrapping
- General formatting consistency

Enable in VS Code:

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

2. **Do NOT declare `JobsApp` in ESLint globals.**  
   This causes ESLint to treat it as read‑only.

3. **Do NOT include `/* global JobsApp */` in files that assign to it.**  
   This tells ESLint the variable already exists and should not be modified.

4. **You _may_ include `/* global JobsApp */` in files that only read from it.**

### Example module structure

```js
/* src/ui/jobs-ui.js */
var JobsApp = typeof JobsApp !== "undefined" ? JobsApp : {};

JobsApp.UI = (function () {
  // module code
})();
```

---

## 6. Test Environment

Tests run in a Node + Jest environment.

ESLint recognizes:

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
  sp/         # SharePoint data loader
  css/        # Styles
  data/       # Sample data
  index.html  # Local test harness

scripts/      # Build and CEWP scripts
tests/        # Jest tests
deploy/       # CEWP template
build/        # Generated SharePoint output
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

This is not an open-source project, but the development workflow is documented
here for consistency and future maintenance.

---

## 10. Troubleshooting

### “Read-only global JobsApp should not be modified”

Remove `JobsApp` from:

- ESLint globals
- `/* global */` comments in files that assign to it

### “JobsApp is already defined”

This is normal for ES5 namespace patterns.  
The current config handles this correctly.

### “console is not defined”

Ensure the file is under `src/` so it receives browser globals.

---

## 11. Build & Deployment Workflow

This project includes a lightweight build process designed for classic SharePoint.
It does **not** bundle or minify code. Instead, it:

1. Cleans the `/build` directory
2. Copies source files into `/build/JobBoard`
3. Applies versioned filenames for cache‑busting
4. Generates a CEWP HTML file from a template

---

### 11.1 Build Script (`scripts/build.js`)

The build script:

- Removes the entire `build/` folder
- Recreates `build/JobBoard`
- Copies specific files from `src/`
- Appends the version from `package.json` to each filename

Example output:

```
jobs-core.v1.2.3.js
jobs-ui.v1.2.3.js
jobs-sp.v1.2.3.js
jobs.v1.2.3.css
jobs.v1.2.3.txt
```

Run the build:

```bash
npm run build
```

---

### 11.2 CEWP Generation (`scripts/update-cewp.js`)

The CEWP HTML is generated from:

```
deploy/cewp-template.html
```

This template contains `<script>` and `<link>` tags with `{{version}}`
placeholders, for example:

```html
<script src="jobs-core.v{{version}}.js"></script>
```

The CEWP generator:

1. Loads the template
2. Replaces all `{{version}}` placeholders
3. Writes the final file to:

```
build/JobBoard/cewp.html
```

Run the generator:

```bash
npm run update-cewp
```

#### Updating the CEWP template

If you add new modules or assets, update:

```
deploy/cewp-template.html
```

The generator does **not** detect files automatically.

---

### 11.3 Full Build + CEWP Workflow

```bash
npm run build
npm run update-cewp
```

---

### 11.4 Deploying to SharePoint

1. Upload `/build/JobBoard` to SharePoint
2. Open `cewp.html`
3. Copy the contents
4. Paste into a Content Editor Web Part
5. Publish the page

---

### 11.5 Notes & Best Practices

- Always increment the version before a release
- Never edit files in `build/` manually
- Version stamping is essential for SharePoint caching
- The CEWP template is the source of truth
