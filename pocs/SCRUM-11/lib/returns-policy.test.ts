import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("returns policy (A2)", () => {
  it("exposes static policy route", () => {
    const page = readFileSync(resolve(__dirname, "../app/(storefront)/policy/returns/page.tsx"), "utf8");
    expect(page).toContain("RETURNS_POLICY_INTRO");
  });
});
