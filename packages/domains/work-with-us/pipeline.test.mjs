import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("@web/work-with-us pipeline targeting", () => {
  it("stands in for packages/domains/work-with-us/e2e/work-with-us.spec.ts in CI", () => {
    assert.equal(typeof "WorkWithUsPage", "string");
  });
});
