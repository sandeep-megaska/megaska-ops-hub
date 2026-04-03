export type PhoneMatchStatus =
  | "match"
  | "mismatch"
  | "missing_checkout_phone"
  | "missing_verified_phone";

export function normalizeIndianPhone(input: string | null | undefined) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  return null;
}

export function compareMegaskaPhoneIdentity(input: {
  verifiedPhone: string | null | undefined;
  checkoutPhone: string | null | undefined;
}): {
  verifiedPhoneNormalized: string;
  checkoutPhoneNormalized: string;
  status: PhoneMatchStatus;
  mismatchDetected: boolean;
} {
  const verifiedPhoneNormalized = normalizeIndianPhone(input.verifiedPhone) || "";
  const checkoutPhoneNormalized = normalizeIndianPhone(input.checkoutPhone) || "";

  if (!verifiedPhoneNormalized) {
    return {
      verifiedPhoneNormalized,
      checkoutPhoneNormalized,
      status: "missing_verified_phone",
      mismatchDetected: true,
    };
  }

  if (!checkoutPhoneNormalized) {
    return {
      verifiedPhoneNormalized,
      checkoutPhoneNormalized,
      status: "missing_checkout_phone",
      mismatchDetected: true,
    };
  }

  const isMatch = verifiedPhoneNormalized === checkoutPhoneNormalized;

  return {
    verifiedPhoneNormalized,
    checkoutPhoneNormalized,
    status: isMatch ? "match" : "mismatch",
    mismatchDetected: !isMatch,
  };
}
