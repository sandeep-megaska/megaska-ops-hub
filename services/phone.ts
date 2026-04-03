export type PhoneMatchStatus =
  | "match"
  | "mismatch"
  | "missing_order_phone"
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
  orderPhone: string | null | undefined;
}): {
  verifiedPhoneNormalized: string;
  orderPhoneNormalized: string;
  status: PhoneMatchStatus;
  mismatchDetected: boolean;
} {
  const verifiedPhoneNormalized = normalizeIndianPhone(input.verifiedPhone) || "";
  const orderPhoneNormalized = normalizeIndianPhone(input.orderPhone) || "";

  if (!verifiedPhoneNormalized) {
    return {
      verifiedPhoneNormalized,
      orderPhoneNormalized,
      status: "missing_verified_phone",
      mismatchDetected: true,
    };
  }

  if (!orderPhoneNormalized) {
    return {
      verifiedPhoneNormalized,
      orderPhoneNormalized,
      status: "missing_order_phone",
      mismatchDetected: true,
    };
  }

  const isMatch = verifiedPhoneNormalized === orderPhoneNormalized;

  return {
    verifiedPhoneNormalized,
    orderPhoneNormalized,
    status: isMatch ? "match" : "mismatch",
    mismatchDetected: !isMatch,
  };
}
