import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "scripts",
      "eslint.config.js",
      "coney-collection.json",
      "package.json",
      "README.md",
      "docker-compose.yml",
      ".docker/",
      ".env-example",
      ".env",
      "package-lock.json",
      "logs/",
      "jest.config.js",
      "LICENSE",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error", 
      "quotes": ["error", "single", { "avoidEscape": true }],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": "error",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "off",
    },
  },
];
