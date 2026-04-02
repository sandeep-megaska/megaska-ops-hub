import { NextRequest, NextResponse } from "next/server";

export function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin") || "*";

  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Vary", "Origin");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return res;
}

export function handleOptions(req: NextRequest) {
  return withCors(req, new NextResponse(null, { status: 204 }));
}
