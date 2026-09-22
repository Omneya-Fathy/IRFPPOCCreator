import type { UsAddress } from "./types";

const US_STATES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
]);

const ZIP_RE = /^\d{5}(-\d{4})?$/;

export type AddressValidationResult =
  | { ok: true }
  | { ok: false; message: string };

/** A1 — US domestic delivery addresses only. */
export function validateUsAddress(address: UsAddress): AddressValidationResult {
  const country = address.country.trim().toUpperCase();
  if (country !== "US" && country !== "USA" && country !== "UNITED STATES") {
    return { ok: false, message: "Shipping is limited to US domestic addresses." };
  }
  if (!address.name.trim() || !address.street.trim() || !address.city.trim()) {
    return { ok: false, message: "Name, street, and city are required." };
  }
  const state = address.state.trim().toUpperCase();
  if (!US_STATES.has(state)) {
    return { ok: false, message: "Enter a valid two-letter US state code." };
  }
  if (!ZIP_RE.test(address.zip.trim())) {
    return { ok: false, message: "Enter a valid US ZIP code (12345 or 12345-6789)." };
  }
  return { ok: true };
}

export const VALID_US_FIXTURE: UsAddress = {
  name: "Maya Chen",
  street: "421 Oak Street",
  city: "Portland",
  state: "OR",
  zip: "97214",
  country: "US",
};
