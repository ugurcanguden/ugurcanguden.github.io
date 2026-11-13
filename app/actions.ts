"use server";

import { createFeedback } from "@/lib/pocketbase";
import { isValidApp } from "@/lib/apps";

export interface FeedbackState {
  status: "idle" | "success" | "error";
  message: string;
}

/**
 * Formdan gelen veriyi doğrular ve PocketBase'e SERVER-SIDE olarak yazar.
 * Client hiçbir zaman PocketBase'e doğrudan bağlanmaz.
 */
export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const category = String(formData.get("category") ?? "").trim();
  const type = String(formData.get("type") ?? "other").trim();
  const rawMessage = String(formData.get("message") ?? "").trim();
  const appVersion = String(formData.get("app_version") ?? "").trim();
  const platform = String(formData.get("platform") ?? "other").trim();
  const email = String(formData.get("email") ?? "").trim();

  // --- Doğrulama ---
  if (!isValidApp(category)) {
    return { status: "error", message: "Lütfen geçerli bir uygulama seçin." };
  }
  if (rawMessage.length < 5) {
    return {
      status: "error",
      message: "Mesaj en az 5 karakter olmalıdır.",
    };
  }
  if (rawMessage.length > 4000) {
    return {
      status: "error",
      message: "Mesaj 4000 karakteri aşamaz.",
    };
  }

  // Tür ve iletişim bilgisini mesaja ekleyelim (koleksiyon 4 alanlı olduğu için)
  const parts = [`[Tür: ${type}]`];
  if (email) parts.push(`[İletişim: ${email}]`);
  const message = `${parts.join(" ")}\n\n${rawMessage}`;

  try {
    await createFeedback({
      category,
      message,
      app_version: appVersion || "belirtilmedi",
      platform,
    });

    return {
      status: "success",
      message: "Teşekkürler! Geri bildiriminiz başarıyla iletildi.",
    };
  } catch (err) {
    console.error("[submitFeedback] PocketBase hatası:", err);
    return {
      status: "error",
      message:
        "Geri bildirim gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    };
  }
}
