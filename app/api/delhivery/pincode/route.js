import { NextResponse } from "next/server";

export const runtime = "nodejs";

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pin = String(searchParams.get("pin") || "").trim();

  if (!pin || pin.length < 4) {
    return json({ ok: false, error: "Invalid pincode" }, 400);
  }

  try {
    const token = process.env.DELHIVERY_API_TOKEN;
    const baseUrl =
      process.env.DELHIVERY_PINCODE_URL ||
      "https://track.delhivery.com/c/api/pin-codes/json/";
    const originPin = process.env.DELHIVERY_ORIGIN_PIN;
    const tatBaseUrl =
      process.env.DELHIVERY_TAT_URL ||
      "https://track.delhivery.com/api/dc/expected_tat";

    if (!token) {
      return json({ ok: false, error: "Delhivery token not configured" }, 500);
    }

    const svcUrl =
      `${baseUrl}?token=${encodeURIComponent(token)}` +
      `&filter_codes=${encodeURIComponent(pin)}`;

    const dlRes = await fetch(svcUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Token ${token}`,
      },
      cache: "no-store",
    });

    const svcText = await dlRes.text();
    let raw;
    try {
      raw = JSON.parse(svcText);
    } catch (_e) {
      console.error("[DELHIVERY PINCODE NON-JSON]", svcText);
      return json({ ok: false, error: "Unexpected response from Delhivery" }, 500);
    }

    const codes = raw.delivery_codes || [];
    const postal = codes[0]?.postal_code || {};

    const isServiceable = codes.length > 0;
    const isCod = postal.cod === "Y" || postal.cash === "Y";
    const isPrepaid = postal.pre_paid === "Y";

    const city = postal.city || null;
    const district = postal.district || city || null;
    const stateCode = postal.state_code || null;
    const inc = postal.inc || null;

    if (!isServiceable) {
      return json({
        ok: true,
        pin,
        isServiceable: false,
        isCod,
        isPrepaid,
        city,
        district,
        stateCode,
        inc,
        tatDays: null,
        estimatedDate: null,
      });
    }

    let tatDays = null;
    let estimatedDate = null;

    try {
      if (tatBaseUrl && originPin) {
        const mot = "E";
        const pdt = "B2C";

        const tatUrl =
          tatBaseUrl +
          `?origin_pin=${encodeURIComponent(originPin)}` +
          `&destination_pin=${encodeURIComponent(pin)}` +
          `&mot=${encodeURIComponent(mot)}` +
          `&pdt=${encodeURIComponent(pdt)}`;

        const tatRes = await fetch(tatUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
          cache: "no-store",
        });

        const tatText = await tatRes.text();
        let tatJson;
        try {
          tatJson = JSON.parse(tatText);
        } catch (_e) {
          console.error("[DELHIVERY TAT NON-JSON]", tatText);
          tatJson = null;
        }

        if (tatJson) {
          tatDays =
            tatJson.tat ||
            tatJson.days ||
            tatJson.expected_tat ||
            tatJson.tat_days ||
            (tatJson.data && (tatJson.data.tat || tatJson.data.expected_tat)) ||
            null;

          estimatedDate =
            tatJson.expected_delivery_date ||
            tatJson.delivery_date ||
            (tatJson.data &&
              (tatJson.data.expected_delivery_date ||
                tatJson.data.delivery_date)) ||
            null;

          if (tatDays && !estimatedDate) {
            const d = new Date();
            d.setDate(d.getDate() + Number(tatDays));
            estimatedDate = d.toISOString().slice(0, 10);
          }
        }
      }
    } catch (tatErr) {
      console.error("[DELHIVERY TAT ERROR]", tatErr);
    }

    return json({
      ok: true,
      pin,
      isServiceable,
      isCod,
      isPrepaid,
      city,
      district,
      stateCode,
      inc,
      tatDays: tatDays != null ? Number(tatDays) : null,
      estimatedDate,
    });
  } catch (error) {
    console.error("[DELHIVERY PINCODE ERROR]", error);
    return json({ ok: false, error: "Failed to fetch serviceability" }, 500);
  }
}
