import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import { hashSessionToken } from "../../../../services/auth/session";
import { withCors, handleOptions } from "../../_lib/cors";
import {
  findOrCreateShopifyCustomer,
  isShopifyAdminConfigured,
} from "../../../../services/shopify/admin";

function normalizeEmail(emailRaw: string) {
  return emailRaw.trim().toLowerCase();
}

function normalizeFullName(fullNameRaw: string) {
  return fullNameRaw.replace(/\s+/g, " ").trim();
}

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const fullName = normalizeFullName(String(body?.fullName ?? ""));
    const email = normalizeEmail(String(body?.email ?? ""));

    if (!fullName) {
      return withCors(
        req,
        NextResponse.json({ success: false, error: "Full name is required" }, { status: 400 })
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      return withCors(
        req,
        NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
      );
    }

    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!bearerToken) {
      return withCors(
        req,
        NextResponse.json(
          { success: false, error: "Session token required" },
          { status: 401 }
        )
      );
    }

    const now = new Date();
    const sessionTokenHash = hashSessionToken(bearerToken);

    const session = await prisma.authSession.findFirst({
      where: {
        sessionTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!session) {
      return withCors(
        req,
        NextResponse.json(
          { success: false, error: "Invalid or expired session" },
          { status: 401 }
        )
      );
    }

    let updatedCustomer = await prisma.customerProfile.update({
      where: {
        id: session.customer.id,
      },
      data: {
        fullName,
        email,
        profileCompletedAt: now,
      },
    });

    let shopifySync:
      | {
          ok: boolean;
          status:
            | "skipped-already-linked"
            | "skipped-not-configured"
            | "linked-existing"
            | "created-new"
            | "failed";
          matchedBy?: "email" | "phone";
          message?: string;
        }
      | undefined;

    if (updatedCustomer.shopifyCustomerId) {
      console.log("[SHOPIFY SYNC] skipped because already linked", {
        customerProfileId: updatedCustomer.id,
        shopifyCustomerId: updatedCustomer.shopifyCustomerId,
      });
      shopifySync = { ok: true, status: "skipped-already-linked" };
    } else if (!isShopifyAdminConfigured()) {
      console.warn("[SHOPIFY SYNC] skipped because Shopify admin config is missing", {
        customerProfileId: updatedCustomer.id,
      });
      shopifySync = { ok: false, status: "skipped-not-configured" };
    } else {
      try {
        const syncResult = await findOrCreateShopifyCustomer({
          fullName: updatedCustomer.fullName,
          email: updatedCustomer.email,
          phoneE164: updatedCustomer.phoneE164,
        });

        updatedCustomer = await prisma.customerProfile.update({
          where: { id: updatedCustomer.id },
          data: { shopifyCustomerId: syncResult.shopifyCustomerId },
        });

        if (syncResult.source === "existing") {
          console.log("[SHOPIFY SYNC] existing Shopify customer linked", {
            customerProfileId: updatedCustomer.id,
            shopifyCustomerId: syncResult.shopifyCustomerId,
            matchedBy: syncResult.matchedBy,
          });
          shopifySync = {
            ok: true,
            status: "linked-existing",
            matchedBy: syncResult.matchedBy,
          };
        } else {
          console.log("[SHOPIFY SYNC] new Shopify customer created", {
            customerProfileId: updatedCustomer.id,
            shopifyCustomerId: syncResult.shopifyCustomerId,
          });
          shopifySync = { ok: true, status: "created-new" };
        }
      } catch (syncError) {
        const message =
          syncError instanceof Error ? syncError.message : "Shopify sync failed";
        console.error("[SHOPIFY SYNC] failed", {
          customerProfileId: updatedCustomer.id,
          message,
        });
        shopifySync = {
          ok: false,
          status: "failed",
          message,
        };
      }
    }

    await prisma.authSession.update({
      where: {
        id: session.id,
      },
      data: {
        lastSeenAt: now,
      },
    });

    return withCors(
      req,
      NextResponse.json({
        success: true,
        customer: {
          id: updatedCustomer.id,
          phoneE164: updatedCustomer.phoneE164,
          fullName: updatedCustomer.fullName,
          firstName: updatedCustomer.firstName,
          email: updatedCustomer.email,
          profileCompletedAt: updatedCustomer.profileCompletedAt,
          phoneVerifiedAt: updatedCustomer.phoneVerifiedAt,
          shopifyCustomerId: updatedCustomer.shopifyCustomerId,
        },
        profileComplete: Boolean(updatedCustomer.fullName?.trim() && updatedCustomer.email?.trim()),
        shopifyCustomerId: updatedCustomer.shopifyCustomerId,
        shopifySync,
      })
    );
  } catch (error) {
    console.error("[PROFILE COMPLETE ERROR]", error);

    return withCors(
      req,
      NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      )
    );
  }
}
