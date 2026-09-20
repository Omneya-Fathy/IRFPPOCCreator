import { describe, expect, it } from "vitest";
import { getItem, listItems } from "./store";

describe("local store", () => {
  it("returns fake items", () => {
    expect(listItems().length).toBeGreaterThan(0);
  });

  it("finds an item by id", () => {
    expect(getItem("demo-1")?.label).toBe("Fake sample");
  });
});
