# SharePoint Job Board (jQuery + DataTables)

A modular, testable, SharePoint‑compatible job board built with:

- jQuery
- DataTables
- ES5 modules (SharePoint‑safe)
- Jest for unit testing
- A local dev server for fast iteration
- Version‑stamped builds for cache‑busting in SharePoint

---

## 📁 Project Structure

```
src/
  core/        → Pure logic (JobsCore)
  ui/          → UI wiring (JobsUI)
  sp/          → SharePoint data loader
  css/         → Styles
  data/        → Sample JSON data
  index.html   → Local test harness

tests/
  *.test.js    → Jest unit tests
  test-setup.js

deploy/
  cewp-template.html → CEWP HTML with {{version}} placeholders

scripts/
  build.js          → Build automation
  update-cewp.js    → CEWP version injection

build/
  JobBoard/         → SharePoint-ready output (generated)

lib/
  jquery-3.7.0.min.js
  jquery.dataTables.min.js
```

---

## ▶️ Local Development

Start a local web server:

```
npm start
```

Then open:

```
http://localhost:8080/index.html
```

This loads the job board using local sample data.

---

## 🧪 Running Tests

Run all tests:

```
npm test
```

Watch mode:

```
npm run test:watch
```

### Debugging tests in VS Code

Use the included launch configuration:

```
Run → Debug Jest Tests
```

You can set breakpoints in both test files and source files.

---

## 🏗️ Building for SharePoint (with version stamping)

To generate SharePoint‑ready files:

```
npm run build
```

This:

1. Cleans `/build`
2. Copies required files into `/build/JobBoard`
3. Appends version numbers to filenames (e.g., `jobs-core.v1.0.0.js`)
4. Generates a CEWP HTML file with the correct version numbers

Output example:

```
build/
  JobBoard/
    jobs-core.v1.0.0.js
    jobs-ui.v1.0.0.js
    jobs-sp.v1.0.0.js
    jobs.v1.0.0.css
    jobs.v1.0.0.txt
    cewp.html
```

---

## 🚀 Release Workflow (recommended)

1. **Update version**

   ```
   npm version patch
   ```

   or

   ```
   npm version minor
   npm version major
   ```

2. **Build**

   ```
   npm run build
   ```

3. **Upload `/build/JobBoard` to SharePoint**

   - Drag and drop into:  
     `/Style Library/JobBoard/`

4. **Open `build/JobBoard/cewp.html`**

   - Copy the contents
   - Paste into your CEWP (Content Editor Web Part) HTML source

5. **Publish the page**

SharePoint will load the new versioned files and bypass all caching.
