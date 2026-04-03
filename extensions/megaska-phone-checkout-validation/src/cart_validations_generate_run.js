const PHONE_FIELD_TARGET = "$.cart.deliveryGroups[0].deliveryAddress.phone";
const VALIDATION_MESSAGE = "MEGASKA TEST BLOCK 123";

function normalizeIndianPhone(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return `+91${digits}`;
  }

  if (digits.length === 11 && /^0[6-9]\d{9}$/.test(digits)) {
    return `+91${digits.slice(1)}`;
  }

  if (digits.length === 12 && /^91[6-9]\d{9}$/.test(digits)) {
    return `+${digits}`;
  }

  if (digits.length === 13 && /^091[6-9]\d{9}$/.test(digits)) {
    return `+91${digits.slice(3)}`;
  }

  if (digits.length === 14 && /^0091[6-9]\d{9}$/.test(digits)) {
    return `+91${digits.slice(4)}`;
  }

  return "";
}

function getTrustedPhone(input) {
  return String(input?.cart?.trustedPhone?.value || "").trim();
}

function getTrustedPhoneVerifiedFlag(input) {
  const raw = String(input?.cart?.trustedPhoneVerified?.value || "")
    .trim()
    .toLowerCase();
  return raw === "true";
}

function getCheckoutPhone(input) {
  const groups = Array.isArray(input?.cart?.deliveryGroups) ? input.cart.deliveryGroups : [];

  for (const group of groups) {
    const phone = String(group?.deliveryAddress?.phone || "").trim();
    if (phone) return phone;
  }

  return String(input?.cart?.buyerIdentity?.phone || "").trim();
}

function validationResult(errors) {
  return {
    operations: [
      {
        validationAdd: {
          errors,
        },
      },
    ],
  };
}

function validationError(message, target = PHONE_FIELD_TARGET) {
  return { message, target };
}

/**
 * @param {unknown} input
 * @returns {{operations: Array<{validationAdd: {errors: Array<{message: string; target?: string}>}}>} }
 */
export function cartValidationsGenerateRun(input) {
  return validationResult([validationError(VALIDATION_MESSAGE)]);
}
