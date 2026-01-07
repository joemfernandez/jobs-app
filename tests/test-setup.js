/* eslint no-redeclare: "off" */
// tests/test-setup.js

// Nothing complicated for now; you can add DOM setup or global mocks here if needed.

// Polyfill TextEncoder / TextDecoder for jsdom in Node
const { TextEncoder, TextDecoder } = require("util");

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
