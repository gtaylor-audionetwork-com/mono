import { defineConfig } from "cypress";

const baseUrl = process.env.CYPRESS_BASE_URL ?? "http://localhost:9000";

export default defineConfig({
  e2e: {
    baseUrl,
    specPattern: [
      "../../packages/domains/*/e2e/**/*.spec.ts",
      "../../packages/shell/e2e/**/*.spec.ts",
    ],
    supportFile: "../../tooling/cypress/support/e2e.ts",
    fixturesFolder: "../../tooling/cypress/fixtures",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 15_000,
    pageLoadTimeout: 60_000,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(_on, config) {
      return config;
    },
  },
});
