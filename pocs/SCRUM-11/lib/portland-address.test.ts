import { describe, expect, it } from "vitest";
import { VALID_PORTLAND_FIXTURE, validatePortlandAddress } from "./portland-address";

describe("validatePortlandAddress", () => {
  it("accepts valid Portland fixture", () => {
    expect(validatePortlandAddress(VALID_PORTLAND_FIXTURE).ok).toBe(true);
  });

  it("rejects non-Portland city", () => {
    const result = validatePortlandAddress({ ...VALID_PORTLAND_FIXTURE, city: "Beaverton" });
    expect(result.ok).toBe(false);
  });

  it("rejects ZIP outside Portland demo range", () => {
    const result = validatePortlandAddress({ ...VALID_PORTLAND_FIXTURE, zip: "10001" });
    expect(result.ok).toBe(false);
  });
});
