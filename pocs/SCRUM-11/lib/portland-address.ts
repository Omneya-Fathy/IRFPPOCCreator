import type { PortlandAddress } from "./types";

const ZIP_RE = /^\d{5}(-\d{4})?$/;

export type AddressValidationResult =
  | { ok: true }
  | { ok: false; message: string };

/** Portland city limits — demo validator (city + OR + ZIP range used in fixtures). */
export function validatePortlandAddress(address: PortlandAddress): AddressValidationResult {
  if (!address.name.trim() || !address.street.trim() || !address.city.trim()) {
    return { ok: false, message: "Name, street, and city are required." };
  }
  const city = address.city.trim().toLowerCase();
  if (city !== "portland") {
    return { ok: false, message: "Mail order is available within Portland city limits only." };
  }
  const state = address.state.trim().toUpperCase();
  if (state !== "OR") {
    return { ok: false, message: "Enter Oregon (OR) for Portland delivery." };
  }
  if (!ZIP_RE.test(address.zip.trim())) {
    return { ok: false, message: "Enter a valid ZIP code (12345 or 12345-6789)." };
  }
  const zip = address.zip.trim().slice(0, 5);
  const zipNum = Number.parseInt(zip, 10);
  if (zipNum < 97201 || zipNum > 97299) {
    return { ok: false, message: "This address is outside our Portland delivery area." };
  }
  return { ok: true };
}

export const VALID_PORTLAND_FIXTURE: PortlandAddress = {
  name: "Maya Chen",
  street: "421 SE Hawthorne Blvd",
  city: "Portland",
  state: "OR",
  zip: "97214",
};
