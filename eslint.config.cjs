// eslint.config.cjs
const js = require("@eslint/js");

module.exports = [
  // Ignore generated and external folders
  {
    ignores: ["build/", "lib/", "node_modules/"]
  },

  // Base recommended rules
  js.configs.recommended,

  // Browser ES5 code (SharePoint-safe)
  {
    files: ["src/**/*.js", "src/ui/**/*.js"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",
      globals: {
        ...require("globals").browser,
        jQuery: "readonly",
        $: "readonly"
        //JobsApp: "writable"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-var": "off",
      "prefer-const": "off",
      "no-console": "off"
    }
  },

  // Node/CommonJS code (build scripts)
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        console: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  },

  // Node/CommonJS code (tests scripts)
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        ...require("globals").node,
        ...require("globals").jest,
        global: "readonly"
      }
    },
    rules: {
      "no-undef": "off", // Jest defines globals dynamically
      "no-unused-vars": "warn"
    }
  },

  // Disable rules that conflict with Prettier
  {
    rules: {
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    }
  }
];
