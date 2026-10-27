import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("@web/projects pipeline targeting", () => {
  it("stands in for packages/domains/projects/e2e/projects.spec.ts in CI", () => {
    assert.match("coastal-studies", /studies/);
  });
});
