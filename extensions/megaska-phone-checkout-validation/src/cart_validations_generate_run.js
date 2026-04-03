const PHONE_FIELD_TARGET = "$.cart.deliveryGroups[0].deliveryAddress.phone";

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

  if (digits.length === 14 && /^0091[6-9]\d{9}$/.test(digits)) {
    return `+91${digits.slice(4)}`;
  }

  if (raw.startsWith("+") && /^\+91[6-9]\d{9}$/.test(raw)) {
    return raw;
  }

  return "";
}

function maskPhone(phone) {
  const normalized = normalizeIndianPhone(phone);
  if (!normalized) return "";

  const visibleTail = normalized.slice(-3);
  return `+91 ********${visibleTail}`;
}

function getTrustedPhone(input) {
  return String(input?.cart?.trustedPhone?.value || "").trim();
}

function getTrustedPhoneVerifiedFlag(input) {
  const raw = String(input?.cart?.trustedPhoneVerified?.value || "").trim().toLowerCase();
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
  const trustedPhone = getTrustedPhone(input);
  const trustedPhoneNormalized = normalizeIndianPhone(trustedPhone);
  const trustedPhoneVerified = getTrustedPhoneVerifiedFlag(input);

  if (!trustedPhoneNormalized || !trustedPhoneVerified) {
    return validationResult([
      validationError(
        "Megaska verification is missing for this cart. Please verify your mobile number and try again.",
        "cart"
      ),
    ]);
  }

  const checkoutPhone = getCheckoutPhone(input);
  const checkoutPhoneNormalized = normalizeIndianPhone(checkoutPhone);

  if (!checkoutPhoneNormalized) {
    return validationResult([
      validationError(
        "Please enter your Megaska verified mobile number to continue checkout."
      ),
    ]);
  }

  if (checkoutPhoneNormalized !== trustedPhoneNormalized) {
    const maskedTrustedPhone = maskPhone(trustedPhoneNormalized);
    const message = maskedTrustedPhone
      ? `This phone number is not verified by Megaska. Please use your verified mobile number ${maskedTrustedPhone}.`
      : "This phone number is not verified by Megaska. Please use your verified mobile number.";

    return validationResult([validationError(message)]);
  }

  return validationResult([]);
}
