import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/pocketbase";
import { isValidApp } from "@/lib/apps";

/**
 * Server-side REST endpoint — mobil uygulamalar da buraya POST atabilir.
 * PocketBase çağrısı yalnızca sunucuda yapılır.
 *
 * POST /api/feedback
 * body: { category, message, app_version, platform }
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz JSON gövdesi." },
      { status: 400 },
    );
  }

  const category = String(body.category ?? "").trim();
  const message = String(body.message ?? "").trim();
  const app_version = String(body.app_version ?? "").trim() || "belirtilmedi";
  const platform = String(body.platform ?? "other").trim();

  if (!isValidApp(category)) {
    return NextResponse.json(
      { ok: false, error: "Geçersiz uygulama (category)." },
      { status: 422 },
    );
  }
  if (message.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Mesaj çok kısa." },
      { status: 422 },
    );
  }

  try {
    const { id } = await createFeedback({
      category,
      message,
      app_version,
      platform,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("[api/feedback] PocketBase hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Kayıt oluşturulamadı." },
      { status: 502 },
    );
  }
}
