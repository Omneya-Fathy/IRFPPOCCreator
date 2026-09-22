import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("staff access (A3)", () => {
  it("staff layout has no auth gate", () => {
    const layout = readFileSync(resolve(__dirname, "../app/staff/layout.tsx"), "utf8");
    expect(layout.toLowerCase()).not.toContain("password");
    expect(layout.toLowerCase()).not.toContain("authenticate");
    expect(layout).toContain("no authentication");
  });

  it("staff inventory route module exists for demo access", () => {
    const page = readFileSync(resolve(__dirname, "../app/staff/inventory/page.tsx"), "utf8");
    expect(page).toContain("InventoryEditor");
  });
});
