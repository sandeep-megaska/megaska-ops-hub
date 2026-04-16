import { NextRequest, NextResponse } from "next/server";
import { getTemplateById, updateTemplate } from "../../../../../services/gst/template";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await getTemplateById(id);

  if (!result.ok || !result.data) {
    const status = result.error === "Template not found" ? 404 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, template: result.data }, { status: 200 });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const { id } = await context.params;
  const result = await updateTemplate(id, {
    templateName: body.templateName !== undefined ? String(body.templateName || "") : undefined,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    isDefault: body.isDefault !== undefined ? Boolean(body.isDefault) : undefined,
    headerText: body.headerText !== undefined ? (body.headerText ? String(body.headerText) : null) : undefined,
    footerText: body.footerText !== undefined ? (body.footerText ? String(body.footerText) : null) : undefined,
    declarationText:
      body.declarationText !== undefined ? (body.declarationText ? String(body.declarationText) : null) : undefined,
    notesText: body.notesText !== undefined ? (body.notesText ? String(body.notesText) : null) : undefined,
    logoFileUrl: body.logoFileUrl !== undefined ? (body.logoFileUrl ? String(body.logoFileUrl) : null) : undefined,
    themeConfig:
      body.themeConfig !== undefined
        ? body.themeConfig && typeof body.themeConfig === "object" && !Array.isArray(body.themeConfig)
          ? (body.themeConfig as Record<string, unknown>)
          : null
        : undefined,
  });

  if (!result.ok || !result.data) {
    const status = result.error === "Template not found" ? 404 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, template: result.data }, { status: 200 });
}
