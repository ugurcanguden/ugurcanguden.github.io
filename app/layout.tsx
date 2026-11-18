import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale, resolveTheme } from "@/lib/prefs";
import "./globals.css";

const display = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale());
  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9ebef" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2030" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, theme] = await Promise.all([resolveLocale(), resolveTheme()]);

  return (
    <html
      lang={locale}
      data-theme={theme ?? undefined}
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
