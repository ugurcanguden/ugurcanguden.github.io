import Link from "next/link";
import type { Metadata } from "next";
import FeedbackForm, { type FeedbackDefaults } from "../FeedbackForm";
import PrefsBar from "../components/PrefsBar";
import { APPS, appLabel, isValidApp, isValidType, normalizePlatform } from "@/lib/apps";
import { getDictionary } from "@/lib/i18n";
import { pickParam, resolveLocale, resolveTheme } from "@/lib/prefs";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const dict = getDictionary(
    await resolveLocale(pickParam(await searchParams, "lang", "locale", "dil")),
  );
  return {
    title: dict.meta.feedbackTitle,
    description: dict.meta.feedbackDescription,
  };
}

/**
 * Query ile otomatik doldurma (mobil deep-link) — mevcut anahtarlar korunur:
 *   /feedback?app=centerhit&platform=ios&version=1.4.2&type=bug&lang=tr
 *   app | category | uygulama -> uygulama
 *   platform | os             -> platform
 *   version | app_version | v | surum -> sürüm
 *   type | tur                -> geri bildirim türü
 *   lang | locale | dil       -> arayüz dili (yoksa çerez, sonra Accept-Language, sonra en)
 */
export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const locale = await resolveLocale(pickParam(sp, "lang", "locale", "dil"));
  const theme = await resolveTheme();
  const dict = getDictionary(locale);

  const rawApp = pickParam(sp, "app", "category", "uygulama").toLowerCase();
  const rawType = pickParam(sp, "type", "tur").toLowerCase();
  const rawPlatform = pickParam(sp, "platform", "os");
  const rawVersion = pickParam(sp, "version", "app_version", "v", "surum");

  const appPassed = isValidApp(rawApp);

  const defaults: FeedbackDefaults = {
    category: appPassed ? rawApp : "centerhit",
    type: isValidType(rawType) ? rawType : "bug",
    platform: normalizePlatform(rawPlatform),
    app_version: rawVersion,
    locked: appPassed || rawPlatform !== "" || rawVersion !== "",
  };

  const activeApp = APPS.find((app) => app.value === defaults.category) ?? APPS[0]!;

  return (
    <div className="shell">
      <a className="skip" href="#main">
        {dict.nav.skipToContent}
      </a>

      <PrefsBar locale={locale} theme={theme} dict={dict} />

      <main id="main">
        <header className="form-head">
          <Link href={`/?lang=${locale}`} className="back">
            {dict.nav.home}
          </Link>
          <p
            className="subject"
            style={{ ["--accent" as string]: activeApp.accent }}
          >
            <span className="mark" style={{ ["--accent" as string]: activeApp.accent }} aria-hidden />
            {appLabel(activeApp, dict.feedback.appGeneral)}
          </p>
          <h1>{dict.feedback.heading}</h1>
          <p>{dict.feedback.intro}</p>
          <hr />
        </header>

        <FeedbackForm defaults={defaults} locale={locale} dict={dict} />
      </main>

      <footer className="foot">
        {new Date().getFullYear()} {dict.footer}
      </footer>
    </div>
  );
}
