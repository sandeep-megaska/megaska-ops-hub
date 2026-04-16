import { NextRequest, NextResponse } from "next/server";
import { createTemplate, listTemplates } from "../../../../services/gst/template";
import { getActiveGstSettings } from "../../../../services/gst/settings";

export const runtime = "nodejs";

async function resolveSettingsId(explicitId?: string | null): Promise<{ id?: string; error?: string }> {
  if (explicitId && explicitId.trim()) {
    return { id: explicitId.trim() };
  }

  const active = await getActiveGstSettings();
  if (!active.ok || !active.data) {
    return { error: active.error || "No active GST settings configured" };
  }

  return { id: active.data.id };
}

export async function GET(req: NextRequest) {
  const settings = await resolveSettingsId(req.nextUrl.searchParams.get("gstSettingsId"));
  if (!settings.id) {
    return NextResponse.json({ ok: false, error: settings.error }, { status: 400 });
  }

  const result = await listTemplates(settings.id);
  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, templates: result.data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const settings = await resolveSettingsId(
    body.gstSettingsId ? String(body.gstSettingsId) : req.nextUrl.searchParams.get("gstSettingsId"),
  );
  if (!settings.id) {
    return NextResponse.json({ ok: false, error: settings.error }, { status: 400 });
  }

  const result = await createTemplate({
    gstSettingsId: settings.id,
    templateName: String(body.templateName || ""),
    isDefault: body.isDefault === true,
    headerText: body.headerText ? String(body.headerText) : null,
    footerText: body.footerText ? String(body.footerText) : null,
    declarationText: body.declarationText ? String(body.declarationText) : null,
    notesText: body.notesText ? String(body.notesText) : null,
    logoFileUrl: body.logoFileUrl ? String(body.logoFileUrl) : null,
    themeConfig:
      body.themeConfig && typeof body.themeConfig === "object" && !Array.isArray(body.themeConfig)
        ? (body.themeConfig as Record<string, unknown>)
        : null,
  });

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, template: result.data }, { status: 201 });
}
