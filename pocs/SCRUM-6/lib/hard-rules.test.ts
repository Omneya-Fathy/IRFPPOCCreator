import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..");

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next") {
      continue;
    }
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (/\.(tsx?|css|md)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("hard rules", () => {
  it("does not include clickable external http or https links in UI source", () => {
    const uiDirs = ["app", "components"].map((dir) => join(ROOT, dir));
    const offenders: string[] = [];

    for (const dir of uiDirs) {
      for (const file of walk(dir)) {
        const content = readFileSync(file, "utf8");
        const hrefMatches = content.match(/href=["']https?:\/\/[^"']+["']/g);
        if (hrefMatches?.length) {
          offenders.push(`${file}: ${hrefMatches.join(", ")}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
