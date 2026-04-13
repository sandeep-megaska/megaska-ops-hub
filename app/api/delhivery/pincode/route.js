import { NextResponse } from "next/server";

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

  return NextResponse.json({ ok: true, pincode });
}
  const token = process.env.DELHIVERY_API_TOKEN;
  const useStaging = process.env.DELHIVERY_ENV !== "production";

  const baseUrl = useStaging
    ? "https://staging-express.delhivery.com"
    : "https://track.delhivery.com";

  const serviceabilityUrl =
    `${baseUrl}/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pincode)}`;

  console.log("[DELHIVERY PINCODE] request start", {
    pincode,
    useStaging,
    baseUrl,
    hasToken: !!token,
    tokenPrefix: token ? token.slice(0, 6) : null,
  });

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Delhivery token missing" },
      { status: 500 }
    );
  }

  let res: Response;
  let raw = "";

  try {
    res = await fetch(serviceabilityUrl, {
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
      { ok: false, error: "Failed to connect to Delhivery" },
      { status: 502 }
    );
  }

  const contentType = res.headers.get("content-type") || "";

  try {
    raw = await res.text();
  } catch (err) {
    console.error("[DELHIVERY PINCODE] body read failed", err);
    return NextResponse.json(
      { ok: false, error: "Failed to read Delhivery response" },
      { status: 502 }
    );
  }

  console.log("[DELHIVERY PINCODE] raw response", {
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

  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("[DELHIVERY PINCODE] non-json response", {
      contentType,
      bodyPreview: safeSlice(raw, 500),
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected response from Delhivery",
        debug: {
          contentType,
          bodyPreview: safeSlice(raw, 300),
        },
      },
      { status: 502 }
    );
  }

  console.log("[DELHIVERY PINCODE] parsed response", {
    topLevelKeys: data && typeof data === "object" ? Object.keys(data) : null,
  });

  // TEMPORARY: return raw parsed structure first, until mapping is confirmed
  return NextResponse.json({
    ok: true,
    source: "delhivery",
    raw: data,
  });
}
