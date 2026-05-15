# AGENTS.md

## Cursor Cloud specific instructions

### Overview

A retro-themed ("Weyland-Yutani Nostromo") browser-based calculator with arithmetic operations, percentage, sign toggle, square root, and keyboard input. Pure vanilla HTML/CSS/JS with zero npm dependencies.

### Running the app

Serve the static files with any HTTP server:
```
python3 -m http.server 8000
```
Then open http://localhost:8000. There is also a `compass.html` page at http://localhost:8000/compass.html.

### Testing

```
npm test
```
Uses Node.js built-in `node:test` runner — no `npm install` needed. Tests live in `test/calculator.test.js` and exercise the `Calculator` class exported from `calculator.js`.

### Key notes

- Zero npm dependencies. The `package.json` only declares the test script.
- No build step required — the app is plain static HTML/CSS/JS served directly.
- Node.js v22+ is required for the built-in test runner features used.
