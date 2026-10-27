import base from "@web/eslint-config";

export default [
  ...base,
  {
    files: ["tests/e2e/**/*.ts"],
    languageOptions: {
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
      },
    },
  },
];
