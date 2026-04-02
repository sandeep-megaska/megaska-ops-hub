import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../_lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function GET(req: NextRequest) {
  return withCors(req, NextResponse.json({ ok: true }));
}
