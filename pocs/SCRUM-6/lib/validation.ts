import type { DeliveryAddress } from "./store";
import { isEgyptShipping } from "./store";

export function validateCheckoutAddress(
  address: Partial<DeliveryAddress>,
): string | null {
  if (!address.fullName?.trim()) {
    return "Full name is required";
  }
  if (!address.email?.trim()) {
    return "Email is required";
  }
  if (!address.street?.trim()) {
    return "Street address is required";
  }
  if (!address.city?.trim()) {
    return "City is required";
  }
  if (!address.governorate?.trim()) {
    return "Governorate is required";
  }
  if (!address.country?.trim()) {
    return "Country is required";
  }
  if (!isEgyptShipping(address.country)) {
    return "Shipping is available to Egypt only";
  }
  return null;
}
