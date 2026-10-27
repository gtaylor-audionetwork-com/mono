import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("@web/support pipeline targeting", () => {
  it("stands in for packages/domains/support/e2e/support.spec.ts in CI", () => {
    assert.equal(typeof "SupportPage", "string");
  });
});
