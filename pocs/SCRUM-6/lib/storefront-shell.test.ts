import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("storefront shell", () => {
  it("includes browse, search, and cart in nav", () => {
    const nav = readFileSync(resolve(__dirname, "../components/storefront/store-nav.tsx"), "utf8");
    expect(nav).toContain("/browse/genre");
    expect(nav).toContain("/search");
    expect(nav).toContain("/cart");
  });

  it("home page uses staff picks and book cards", () => {
    const home = readFileSync(resolve(__dirname, "../app/(storefront)/page.tsx"), "utf8");
    expect(home).toContain("getStaffPicks");
    expect(home).toContain("BookCard");
  });
});
