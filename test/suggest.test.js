import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getSearchKey, fuzzyMatch } from "../bin/quickclaude.js";

describe("getSearchKey", () => {
  it("returns last 2 segments for deep paths", () => {
    const result = getSearchKey("C:\\Users\\Test\\Documents\\projects\\doccu");
    assert.equal(result, "projects/doccu");
  });

  it("returns last 2 segments for unix paths", () => {
    const result = getSearchKey("/Users/test/Documents/projects/doccu");
    assert.equal(result, "projects/doccu");
  });

  it("returns full path when only 1 segment", () => {
    const result = getSearchKey("doccu");
    assert.equal(result, "doccu");
  });

  it("returns last 2 segments for monorepo sub-paths", () => {
    const result = getSearchKey("C:\\Users\\Test\\PochitaBot\\packages\\pochita");
    assert.equal(result, "packages/pochita");
  });

  it("returns 2 segments when path has exactly 2", () => {
    const result = getSearchKey("/projects/foo");
    assert.equal(result, "projects/foo");
  });
});

describe("fuzzyMatch", () => {
  it("matches subsequence in searchKey", () => {
    assert.equal(fuzzyMatch("doccu", "projects/doccu"), true);
  });

  it("does not match when chars are not present", () => {
    assert.equal(fuzzyMatch("doccu", "projects/foo"), false);
  });

  it("is case-insensitive", () => {
    assert.equal(fuzzyMatch("POCHITA", "projects/pochita"), true);
  });

  it("matches monorepo paths by parent", () => {
    assert.equal(fuzzyMatch("pochitabot", "PochitaBot/pochita"), true);
    assert.equal(fuzzyMatch("bot/poch", "PochitaBot/pochita"), true);
  });
});
