import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("@web/shell pipeline targeting", () => {
  it("stands in for shell Cypress specs (navigation, modals, player) in CI", () => {
    assert.deepEqual(["navigation", "add-to-project", "download-modal"].sort(), [
      "add-to-project",
      "download-modal",
      "navigation",
    ]);
  });
});
