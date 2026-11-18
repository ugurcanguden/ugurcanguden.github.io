import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  matchAcceptLanguage,
  type Locale,
} from "./i18n";
import { THEME_COOKIE, isTheme, type Theme } from "./theme";

/**
 * Dil sırası: URL (?lang=tr) > çerez > Accept-Language > İngilizce.
 * URL desteği mobil deep-link'lerin dili zorlayabilmesi için var.
 */
export async function resolveLocale(urlOverride?: string): Promise<Locale> {
  if (isLocale(urlOverride)) return urlOverride;

  const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;

  const fromHeader = matchAcceptLanguage(
    (await headers()).get("accept-language"),
  );
  return fromHeader ?? DEFAULT_LOCALE;
}

/** Çerez yoksa null döner; o zaman tema işletim sistemi tercihine bırakılır. */
export async function resolveTheme(): Promise<Theme | null> {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  return isTheme(value) ? value : null;
}

/** searchParams içinden ilk dolu değeri seçer (eş anlamlı anahtarlarla). */
export function pickParam(
  params: Record<string, string | string[] | undefined>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = params[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (first) return first.trim();
  }
  return "";
}
