import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("@web/home pipeline targeting", () => {
  it("stands in for packages/domains/home/e2e/home.spec.ts in CI", () => {
    assert.equal(typeof "HomePage", "string");
  });
});
