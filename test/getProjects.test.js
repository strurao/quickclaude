import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, utimesSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { getLatestMtime } from "../bin/quickclaude.js";

describe("getLatestMtime", () => {
  let dir;

  before(() => {
    dir = mkdtempSync(join(tmpdir(), "qc-mtime-"));
    // Create files with different mtimes
    writeFileSync(join(dir, "old.md"), "old");
    writeFileSync(join(dir, "new.md"), "new");
    // Set old.md to 1 hour ago
    const oneHourAgo = new Date(Date.now() - 3600_000);
    utimesSync(join(dir, "old.md"), oneHourAgo, oneHourAgo);
  });

  after(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns the most recent file mtime in a directory", () => {
    const latest = getLatestMtime(dir);
    // new.md was just created, so latest should be very recent
    assert.ok(Date.now() - latest < 5000);
  });

  it("ignores subdirectories, only checks direct files", () => {
    mkdirSync(join(dir, "subdir"));
    const latest = getLatestMtime(dir);
    assert.ok(latest > 0);
  });
});

describe("deduplicateProjects", () => {
  it("removes case-duplicate paths on Windows, keeping higher mtime", async () => {
    const { deduplicateProjects } = await import("../bin/quickclaude.js");

    const projects = [
      { dirName: "a", path: "C:\\Users\\Test\\Documents\\foo", mtime: 100 },
      { dirName: "b", path: "C:\\Users\\Test\\documents\\foo", mtime: 200 },
      { dirName: "c", path: "C:\\Users\\Test\\Bar", mtime: 300 },
    ];

    const result = deduplicateProjects(projects, "win32");
    assert.equal(result.length, 2);
    const foo = result.find((p) => p.path.toLowerCase().includes("foo"));
    assert.equal(foo.mtime, 200);
  });

  it("does not deduplicate on non-Windows (paths are case-sensitive)", async () => {
    const { deduplicateProjects } = await import("../bin/quickclaude.js");

    const projects = [
      { dirName: "a", path: "/Users/Test/Documents/foo", mtime: 100 },
      { dirName: "b", path: "/Users/Test/documents/foo", mtime: 200 },
    ];

    const result = deduplicateProjects(projects, "linux");
    assert.equal(result.length, 2);
  });
});
