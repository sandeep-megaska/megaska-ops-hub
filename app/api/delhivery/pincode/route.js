import { NextResponse } from "next/server";

function safeSlice(value, len = 500) {
  if (!value) return "";
  return value.length > len ? value.slice(0, len) + "...[truncated]" : value;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const pincode =
    (searchParams.get("pin") || searchParams.get("pincode") || "").trim();

  console.log("[DELHIVERY PINCODE] incoming query", {
    url: req.url,
    pin: searchParams.get("pin"),
    pincodeParam: searchParams.get("pincode"),
    resolvedPincode: pincode,
  });

  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid pincode",
        received: pincode || null,
      },
      { status: 400 }
    );
  }

  const token = process.env.DELHIVERY_API_TOKEN;
  const env = process.env.DELHIVERY_ENV || "staging";

  const baseUrl =
    env === "production"
      ? "https://track.delhivery.com"
      : "https://staging-express.delhivery.com";

  const url = `${baseUrl}/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(
    pincode
  )}`;

  console.log("[DELHIVERY PINCODE] request config", {
    env,
    baseUrl,
    hasToken: !!token,
    tokenPrefix: token ? token.slice(0, 6) : null,
    requestUrl: url,
  });

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        error: "Delhivery token missing",
      },
      { status: 500 }
    );
  }

  let res;
  try {
    console.log("[DELHIVERY PINCODE] auth check", {
  hasToken: !!token,
  tokenLength: token ? token.length : 0,
  tokenPrefix: token ? token.slice(0, 4) : null,
  tokenSuffix: token ? token.slice(-4) : null,
});
    res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      cache: "no-store",
    });
  } catch (err) {
    console.error("[DELHIVERY PINCODE] fetch failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to connect to Delhivery",
      },
      { status: 502 }
    );
  }

  const contentType = res.headers.get("content-type") || "";
  let raw = "";

  try {
    raw = await res.text();
  } catch (err) {
    console.error("[DELHIVERY PINCODE] body read failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to read Delhivery response",
      },
      { status: 502 }
    );
  }

  console.log("[DELHIVERY PINCODE] upstream response", {
    status: res.status,
    ok: res.ok,
    contentType,
    bodyPreview: safeSlice(raw, 500),
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Delhivery HTTP ${res.status}`,
        debug: {
          contentType,
          bodyPreview: safeSlice(raw, 300),
        },
      },
      { status: 502 }
    );
  }

  let data;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("[DELHIVERY PINCODE] non-json body", {
      status: res.status,
      contentType,
      bodyPreview: safeSlice(raw, 500),
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected response from Delhivery",
        debug: {
          status: res.status,
          contentType,
          bodyPreview: safeSlice(raw, 300),
        },
      },
      { status: 502 }
    );
  }

  console.log("[DELHIVERY PINCODE] parsed json", {
    topLevelKeys:
      data && typeof data === "object" && !Array.isArray(data)
        ? Object.keys(data)
        : null,
    isArray: Array.isArray(data),
  });

  return NextResponse.json({
    ok: true,
    raw: data,
  });
}
