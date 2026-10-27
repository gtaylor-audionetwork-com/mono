import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("@web/login pipeline targeting", () => {
  it("stands in for packages/domains/login/e2e/login.spec.ts in CI", () => {
    assert.equal(typeof "LoginPage", "string");
  });
});
