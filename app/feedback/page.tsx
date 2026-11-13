import Link from "next/link";
import FeedbackForm, { type FeedbackDefaults } from "../FeedbackForm";
import {
  APPS,
  isValidApp,
  isValidType,
  normalizePlatform,
} from "@/lib/apps";

export const metadata = {
  title: "Geri Bildirim | CurioBox Apps",
};

/**
 * Query ile otomatik doldurma (mobil deep-link):
 *   /feedback?app=centerhit&platform=ios&version=1.4.2&type=bug
 * Desteklenen anahtarlar (eş anlamlılarıyla):
 *   app | category        -> uygulama
 *   platform | os          -> platform
 *   version | app_version | v -> sürüm
 *   type                   -> geri bildirim türü
 */
export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (...keys: string[]): string => {
    for (const k of keys) {
      const val = sp[k];
      const s = Array.isArray(val) ? val[0] : val;
      if (s) return s.trim();
    }
    return "";
  };

  const rawApp = pick("app", "category", "uygulama").toLowerCase();
  const rawType = pick("type", "tur").toLowerCase();
  const rawPlatform = pick("platform", "os");
  const rawVersion = pick("version", "app_version", "v", "surum");

  const appPassed = isValidApp(rawApp);
  const platformPassed = rawPlatform !== "";

  const defaults: FeedbackDefaults = {
    category: appPassed ? rawApp : "centerhit",
    type: isValidType(rawType) ? rawType : "bug",
    platform: normalizePlatform(rawPlatform),
    app_version: rawVersion,
    locked: appPassed || platformPassed || rawVersion !== "",
  };

  const activeApp =
    APPS.find((a) => a.value === defaults.category) ?? APPS[0];

  return (
    <main className="page">
      <div
        className="glow"
        aria-hidden
        style={{ ["--glow" as string]: activeApp.accent }}
      />
      <section className="card">
        <header className="hero">
          <Link href="/" className="back">
            ← Ana sayfa
          </Link>
          <span className="badge" style={{ color: activeApp.accent }}>
            {activeApp.label}
          </span>
          <h1>Geri Bildirim</h1>
          <p className="subtitle">
            Yaşadığınız bir sorunu, bir öneriyi ya da beğendiğiniz bir şeyi
            bizimle paylaşın. Her mesaj doğrudan ekibimize ulaşır.
          </p>
        </header>

        <FeedbackForm defaults={defaults} />
      </section>

      <footer className="foot">© {new Date().getFullYear()} CurioBox Apps</footer>
    </main>
  );
}
