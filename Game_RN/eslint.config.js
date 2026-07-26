// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Node-basierte Build-/Datenpflege-Skripte, keine App-Laufzeit
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: { __dirname: "readonly", module: "readonly", require: "readonly", process: "readonly" },
    },
  },
]);
