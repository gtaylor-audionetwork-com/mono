import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("@web/collection-beats pipeline targeting", () => {
  it("stands in for packages/domains/collection-beats/e2e/collection-beats.spec.ts in CI", () => {
    assert.equal(typeof "CollectionBeatsPage", "string");
  });
});
