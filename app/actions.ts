"use server";

import { createFeedback } from "@/lib/pocketbase";
import { isValidApp } from "@/lib/apps";
import { getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

export interface FeedbackState {
  status: "idle" | "success" | "error";
  message: string;
}

/**
 * Formdan gelen veriyi doğrular ve PocketBase'e SERVER-SIDE olarak yazar.
 * Client hiçbir zaman PocketBase'e doğrudan bağlanmaz.
 * Dönen mesajlar formla birlikte gelen `lang` alanına göre çevrilir.
 */
export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const rawLang = String(formData.get("lang") ?? "");
  const dict = getDictionary(isLocale(rawLang) ? rawLang : DEFAULT_LOCALE);

  const category = String(formData.get("category") ?? "").trim();
  const type = String(formData.get("type") ?? "other").trim();
  const rawMessage = String(formData.get("message") ?? "").trim();
  const appVersion = String(formData.get("app_version") ?? "").trim();
  const platform = String(formData.get("platform") ?? "other").trim();
  const email = String(formData.get("email") ?? "").trim();

  // --- Doğrulama ---
  if (!isValidApp(category)) {
    return { status: "error", message: dict.result.invalidApp };
  }
  if (rawMessage.length < 5) {
    return { status: "error", message: dict.result.tooShort };
  }
  if (rawMessage.length > 4000) {
    return { status: "error", message: dict.result.tooLong };
  }

  // Koleksiyon 4 alanlı olduğu için tür, dil ve iletişim bilgisi mesaja eklenir.
  const parts = [`[Tür: ${type}]`, `[Dil: ${rawLang || DEFAULT_LOCALE}]`];
  if (email) parts.push(`[İletişim: ${email}]`);
  const message = `${parts.join(" ")}\n\n${rawMessage}`;

  try {
    await createFeedback({
      category,
      message,
      app_version: appVersion || "belirtilmedi",
      platform,
    });

    return { status: "success", message: dict.result.success };
  } catch (err) {
    console.error("[submitFeedback] PocketBase hatası:", err);
    return { status: "error", message: dict.result.failed };
  }
}
