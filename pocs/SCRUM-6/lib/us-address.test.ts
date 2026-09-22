import { describe, expect, it } from "vitest";
import { VALID_US_FIXTURE, validateUsAddress } from "./us-address";

describe("validateUsAddress (A1)", () => {
  it("accepts valid US domestic fixture", () => {
    expect(validateUsAddress(VALID_US_FIXTURE)).toEqual({ ok: true });
  });

  it("rejects non-US country", () => {
    expect(
      validateUsAddress({ ...VALID_US_FIXTURE, country: "CA" }).ok,
    ).toBe(false);
  });

  it("rejects invalid ZIP", () => {
    expect(
      validateUsAddress({ ...VALID_US_FIXTURE, zip: "ABC" }).ok,
    ).toBe(false);
  });
});
