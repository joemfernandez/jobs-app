// tests/test-setup.js

// Nothing complicated for now; you can add DOM setup or global mocks here if needed.

// Polyfill TextEncoder / TextDecoder for jsdom in Node
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
