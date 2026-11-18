"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, type Dictionary, type Locale } from "@/lib/i18n";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]!) : null;
}

/**
 * Dil ve tema anahtarı. Her ikisi de çerezde tutulur; sunucu ilk render'da
 * doğru dili ve temayı basar, böylece açılışta yanıp sönme olmaz.
 */
export default function PrefsBar({
  locale,
  theme,
  dict,
}: {
  locale: Locale;
  /** null: tema işletim sistemi tercihine bırakılmış. */
  theme: Theme | null;
  dict: Dictionary;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<Theme | null>(theme);
  const [resolved, setResolved] = useState<Theme>(theme ?? "dark");

  useEffect(() => {
    if (current) {
      setResolved(current);
      return;
    }
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setResolved(query.matches ? "light" : "dark");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [current]);

  // URL'den gelen ?lang değerini çereze yazar, sonraki gezinmeler de aynı dilde kalır.
  useEffect(() => {
    if (readCookie("lang") !== locale) writeCookie("lang", locale);
  }, [locale]);

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    writeCookie("lang", next);
    const params = new URLSearchParams(window.location.search);
    if (params.has("lang")) params.set("lang", next);
    const query = params.toString();
    router.replace(window.location.pathname + (query ? `?${query}` : ""));
    router.refresh();
  };

  const toggleTheme = () => {
    const next: Theme = resolved === "dark" ? "light" : "dark";
    writeCookie(THEME_COOKIE, next);
    document.documentElement.dataset.theme = next;
    setCurrent(next);
  };

  return (
    <div className="prefs">
      <div
        className="lang"
        role="group"
        aria-label={dict.nav.languageLabel}
      >
        {LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            className="lang-btn"
            aria-pressed={code === locale}
            onClick={() => switchLocale(code)}
          >
            {code === "en" ? "English" : "Türkçe"}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="theme-btn"
        onClick={toggleTheme}
        aria-label={
          resolved === "dark" ? dict.nav.themeToLight : dict.nav.themeToDark
        }
      >
        <span aria-hidden>{resolved === "dark" ? "☾" : "☀"}</span>
      </button>
    </div>
  );
}
