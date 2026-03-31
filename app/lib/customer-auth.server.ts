import { createHash, randomBytes } from "crypto";
import type { MegaskaCustomerAuthSession, MegaskaCustomerProfile } from "@prisma/client";
import { prisma } from "./prisma.server";

export const MEGASKA_AUTH_TOKEN_TTL_DAYS = 30;
export const MEGASKA_AUTH_TOKEN_LOCALSTORAGE_KEY = "megaska_customer_auth_token";

type AuthSessionWithProfile = MegaskaCustomerAuthSession & {
  customerProfile: MegaskaCustomerProfile | null;
};

export function generateRawAuthToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashAuthToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function computeAuthExpiry(fromDate = new Date()): Date {
  const expiry = new Date(fromDate);
  expiry.setDate(expiry.getDate() + MEGASKA_AUTH_TOKEN_TTL_DAYS);
  return expiry;
}

export async function createAuthSession(params: {
  phoneE164: string;
  customerProfileId?: string | null;
}): Promise<{ authToken: string; session: AuthSessionWithProfile }> {
  const authToken = generateRawAuthToken();
  const sessionTokenHash = hashAuthToken(authToken);

  const session = await prisma.megaskaCustomerAuthSession.create({
    data: {
      sessionTokenHash,
      phoneE164: params.phoneE164,
      customerProfileId: params.customerProfileId ?? null,
      expiresAt: computeAuthExpiry(),
      lastSeenAt: new Date(),
    },
    include: {
      customerProfile: true,
    },
  });

  return { authToken, session };
}

export async function getAuthSessionByRawToken(authToken: string): Promise<AuthSessionWithProfile | null> {
  const trimmedToken = authToken.trim();
  if (!trimmedToken) {
    return null;
  }

  const sessionTokenHash = hashAuthToken(trimmedToken);
  return prisma.megaskaCustomerAuthSession.findUnique({
    where: { sessionTokenHash },
    include: {
      customerProfile: true,
    },
  });
}

export async function validateAuthSession(
  authToken: string,
): Promise<{ ok: boolean; reason?: "missing" | "not_found" | "revoked" | "expired"; session?: AuthSessionWithProfile }> {
  if (!authToken?.trim()) {
    return { ok: false, reason: "missing" };
  }

  const session = await getAuthSessionByRawToken(authToken);
  if (!session) {
    return { ok: false, reason: "not_found" };
  }

  if (session.revokedAt) {
    return { ok: false, reason: "revoked" };
  }

  if (session.expiresAt <= new Date()) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true, session };
}

export async function touchAuthSession(authToken: string): Promise<void> {
  const validation = await validateAuthSession(authToken);
  if (!validation.ok || !validation.session) {
    return;
  }

  await prisma.megaskaCustomerAuthSession.update({
    where: { id: validation.session.id },
    data: { lastSeenAt: new Date() },
  });
}

export async function revokeAuthSession(authToken: string): Promise<void> {
  const session = await getAuthSessionByRawToken(authToken);
  if (!session || session.revokedAt) {
    return;
  }

  await prisma.megaskaCustomerAuthSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });
}

export async function bindProfileToAuthSession(params: {
  authToken: string;
  customerProfileId: string;
}): Promise<AuthSessionWithProfile | null> {
  const validation = await validateAuthSession(params.authToken);
  if (!validation.ok || !validation.session) {
    return null;
  }

  return prisma.megaskaCustomerAuthSession.update({
    where: { id: validation.session.id },
    data: { customerProfileId: params.customerProfileId, lastSeenAt: new Date() },
    include: { customerProfile: true },
  });
}

export async function findActiveProfileByPhone(phoneE164: string): Promise<MegaskaCustomerProfile | null> {
  return prisma.megaskaCustomerProfile.findUnique({
    where: { phoneE164 },
  });
}
