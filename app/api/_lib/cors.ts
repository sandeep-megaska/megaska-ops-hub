import { NextResponse } from "next/server";

export function withCors(res: NextResponse, origin?: string | null) {
  res.headers.set("Access-Control-Allow-Origin", origin || "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export function handleOptions(origin?: string | null) {
  return withCors(new NextResponse(null, { status: 204 }), origin);
}