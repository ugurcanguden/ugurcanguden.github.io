/** Geri bildirim toplanan uygulamalar ve ortak seçenekler (client+server paylaşımlı). */

export interface AppOption {
  value: string;
  label: string;
  accent: string;
}

export const APPS: AppOption[] = [
  { value: "centerhit", label: "CenterHit", accent: "#f97316" },
  { value: "curiobox", label: "CurioBox", accent: "#6366f1" },
  { value: "finbuddy", label: "FinBuddy", accent: "#10b981" },
  { value: "general", label: "Genel / Diğer", accent: "#64748b" },
];

export const FEEDBACK_TYPES = [
  { value: "bug", label: "Hata Bildirimi" },
  { value: "feature", label: "Özellik İsteği" },
  { value: "improvement", label: "İyileştirme" },
  { value: "other", label: "Diğer" },
] as const;

export const PLATFORMS = [
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "web", label: "Web" },
  { value: "other", label: "Diğer" },
] as const;

/** Uygulama adını seçili dile göre verir (marka adları çevrilmez, "general" çevrilir). */
export function appLabel(app: AppOption, generalLabel: string): string {
  return app.value === "general" ? generalLabel : app.label;
}

export function isValidApp(value: string): boolean {
  return APPS.some((a) => a.value === value);
}

export function isValidPlatform(value: string): boolean {
  return PLATFORMS.some((p) => p.value === value);
}

export function isValidType(value: string): boolean {
  return FEEDBACK_TYPES.some((t) => t.value === value);
}

/** Query string'den gelebilecek ham değeri bilinen bir platform değerine eşler. */
export function normalizePlatform(raw?: string | null): string {
  const v = (raw ?? "").trim().toLowerCase();
  if (!v) return "ios";
  if (["ios", "iphone", "ipad", "apple"].includes(v)) return "ios";
  if (["android", "google"].includes(v)) return "android";
  if (["web", "www", "browser", "pwa"].includes(v)) return "web";
  return isValidPlatform(v) ? v : "other";
}
