import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../_lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  return withCors(
    NextResponse.json({ ok: true }),
    req.headers.get("origin")
  );
}