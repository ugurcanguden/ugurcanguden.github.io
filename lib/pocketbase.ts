import "server-only";
import PocketBase from "pocketbase";

/**
 * Bu modül SADECE sunucu tarafında çalışır (server-only).
 * PocketBase istemcisi burada oluşturulur, böylece tarayıcıya hiçbir
 * kimlik bilgisi veya doğrudan istek sızmaz.
 */

const POCKETBASE_URL =
  process.env.POCKETBASE_URL ?? "https://pocketbase.curioboxapp.info";

const FEEDBACK_COLLECTION =
  process.env.POCKETBASE_FEEDBACK_COLLECTION ?? "app_feedback";

export function getPocketBase(): PocketBase {
  // Her istek için taze bir client (serverless ortamlarda auth paylaşımını önler)
  return new PocketBase(POCKETBASE_URL);
}

/**
 * Admin kimlik bilgileri tanımlıysa koleksiyona yazma için giriş yapar.
 * Koleksiyonun create kuralı herkese açıksa bu adım atlanır.
 */
async function authenticateIfConfigured(pb: PocketBase): Promise<void> {
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!email || !password) return;

  try {
    // PocketBase v0.23+ superuser auth
    await pb
      .collection("_superusers")
      .authWithPassword(email, password);
  } catch {
    // Eski sürüm uyumluluğu için admin API'ye düş
    await pb.admins.authWithPassword(email, password);
  }
}

export interface FeedbackInput {
  category: string;
  message: string;
  app_version: string;
  platform: string;
}

export async function createFeedback(
  data: FeedbackInput,
): Promise<{ id: string }> {
  const pb = getPocketBase();
  await authenticateIfConfigured(pb);

  const record = await pb.collection(FEEDBACK_COLLECTION).create(data);

  return { id: record.id };
}
