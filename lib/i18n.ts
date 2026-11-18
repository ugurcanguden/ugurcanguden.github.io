/** Dil sözlükleri. Varsayılan dil İngilizce; Türkçe ikinci dil. */

export const LOCALES = ["en", "tr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "lang";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALES.includes(value as Locale);
}

/** "tr-TR,tr;q=0.9,en;q=0.8" gibi bir başlıktan desteklenen ilk dili seçer. */
export function matchAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      return {
        tag: (tag ?? "").trim().toLowerCase(),
        q: q ? Number(q.slice(2)) : 1,
      };
    })
    .filter((entry) => entry.tag !== "")
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

interface ExperienceEntry {
  years: string;
  role: string;
  company: string;
  desc: string;
  current?: boolean;
}

interface SkillGroup {
  area: string;
  items: string;
}

interface AppBlurb {
  value: string;
  tagline: string;
}

export interface Dictionary {
  meta: {
    homeTitle: string;
    homeDescription: string;
    feedbackTitle: string;
    feedbackDescription: string;
  };
  nav: {
    languageLabel: string;
    themeLabel: string;
    themeToLight: string;
    themeToDark: string;
    skipToContent: string;
    home: string;
  };
  home: {
    role: string;
    nameFirst: string;
    nameLast: string;
    intro: string;
    based: string;
    emailLabel: string;
    githubLabel: string;
    siteLabel: string;
    experienceHeading: string;
    present: string;
    stackHeading: string;
    appsHeading: string;
    appsIntro: string;
    appFeedbackLink: string;
    experience: ExperienceEntry[];
    stack: SkillGroup[];
    apps: AppBlurb[];
  };
  feedback: {
    heading: string;
    intro: string;
    prefilled: string;
    appField: string;
    typeField: string;
    platformField: string;
    versionField: string;
    versionOptional: string;
    versionPlaceholder: string;
    messageField: string;
    messagePlaceholder: string;
    emailField: string;
    emailHint: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    types: Record<string, string>;
    platforms: Record<string, string>;
    appGeneral: string;
  };
  result: {
    success: string;
    invalidApp: string;
    tooShort: string;
    tooLong: string;
    failed: string;
  };
  footer: string;
}

const en: Dictionary = {
  meta: {
    homeTitle: "Uğurcan Güden — Software Developer",
    homeDescription:
      "Uğurcan Güden, software developer. AI agent platforms, .NET microservices, React and React Native apps.",
    feedbackTitle: "Send feedback — CurioBox Apps",
    feedbackDescription:
      "Report a bug or suggest an improvement for CenterHit, CurioBox or FinBuddy.",
  },
  nav: {
    languageLabel: "Language",
    themeLabel: "Theme",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    skipToContent: "Skip to content",
    home: "Home",
  },
  home: {
    role: "Software developer",
    nameFirst: "Uğurcan",
    nameLast: "Güden",
    intro:
      "I have been building software for more than seven years. At Obase I work on air ai, an AI platform built on the Microsoft Agent Framework, where we write the Task MCP, Notification MCP and several other MCP services. Before that I spent six years on banking systems — payment microservices and internet banking screens. Outside work I ship open-source packages and small mobile apps.",
    based: "Menteşe, Muğla · Türkiye",
    emailLabel: "ugurcanguden@gmail.com",
    githubLabel: "github.com/ugurcanguden",
    siteLabel: "ugurcanguden.com",
    experienceHeading: "Experience",
    present: "now",
    stackHeading: "Stack",
    appsHeading: "Apps",
    appsIntro:
      "Three apps are in people's hands right now. Tell me what breaks and what you want next.",
    appFeedbackLink: "Send feedback",
    experience: [
      {
        years: "2024",
        role: "Software Developer",
        company: "Obase",
        desc: "air ai — a multi-module AI platform on the Microsoft Agent Framework. I build the MCP service layer: Task MCP, Notification MCP and the shared tooling around them.",
        current: true,
      },
      {
        years: "2023",
        role: "Software Developer",
        company: "İntertech",
        desc: "Payment microservices (PaymentCommon, Directory Management), plus the shared NuGet and NPM packages the other teams built on.",
      },
      {
        years: "2021",
        role: "Software Developer",
        company: "Vakıfbank",
        desc: "Internet banking screens — new flows, rewrites and performance work on a product used by millions.",
      },
      {
        years: "2019",
        role: "Junior to Mid Developer",
        company: "Pixelsoft",
        desc: "B2B web and mobile projects: whindra, AyInvest, contract and order management apps.",
      },
    ],
    stack: [
      { area: "Backend", items: ".NET, .NET Core, microservices, Redis, MSSQL, NoSQL" },
      { area: "Frontend", items: "React, Next.js, Angular, TypeScript" },
      { area: "Mobile", items: "React Native, Expo" },
      { area: "Platform", items: "Docker, CI/CD, MCP services, agent frameworks" },
    ],
    apps: [
      { value: "centerhit", tagline: "Reaction and aim training" },
      { value: "curiobox", tagline: "Daily curiosities, one box at a time" },
      { value: "finbuddy", tagline: "Personal finance, kept simple" },
    ],
  },
  feedback: {
    heading: "Send feedback",
    intro:
      "A bug, an idea, or something you liked — it all lands with me directly.",
    prefilled: "App and device details came from the app. You can change them.",
    appField: "App",
    typeField: "Kind of feedback",
    platformField: "Platform",
    versionField: "App version",
    versionOptional: "optional",
    versionPlaceholder: "e.g. 1.4.2",
    messageField: "Your message",
    messagePlaceholder:
      "What happened, what you expected, and how to see it again.",
    emailField: "Email",
    emailHint: "optional, only so I can reply",
    emailPlaceholder: "you@example.com",
    submit: "Send feedback",
    submitting: "Sending",
    types: {
      bug: "Bug",
      feature: "Feature request",
      improvement: "Improvement",
      other: "Something else",
    },
    platforms: {
      ios: "iOS",
      android: "Android",
      web: "Web",
      other: "Other",
    },
    appGeneral: "General",
  },
  result: {
    success: "Thanks — your feedback is in.",
    invalidApp: "Pick one of the apps.",
    tooShort: "Your message needs at least 5 characters.",
    tooLong: "Your message is over the 4000 character limit.",
    failed: "That did not send. Try again in a moment.",
  },
  footer: "Uğurcan Güden",
};

const tr: Dictionary = {
  meta: {
    homeTitle: "Uğurcan Güden — Yazılım Geliştirici",
    homeDescription:
      "Uğurcan Güden, yazılım geliştirici. Yapay zeka ajan platformları, .NET mikroservisler, React ve React Native uygulamaları.",
    feedbackTitle: "Geri bildirim — CurioBox Apps",
    feedbackDescription:
      "CenterHit, CurioBox ve FinBuddy için hata bildirin ya da öneri gönderin.",
  },
  nav: {
    languageLabel: "Dil",
    themeLabel: "Tema",
    themeToLight: "Açık temaya geç",
    themeToDark: "Koyu temaya geç",
    skipToContent: "İçeriğe geç",
    home: "Ana sayfa",
  },
  home: {
    role: "Yazılım geliştirici",
    nameFirst: "Uğurcan",
    nameLast: "Güden",
    intro:
      "Yedi yılı aşkın süredir yazılım geliştiriyorum. Obase'de air ai üzerinde çalışıyorum: Microsoft Agent Framework üzerine kurulu bir yapay zeka platformu; Task MCP, Notification MCP ve diğer MCP servislerini biz yazıyoruz. Öncesinde altı yıl bankacılık tarafındaydım — ödeme mikroservisleri ve internet bankacılığı ekranları. İş dışında açık kaynak paketler ve küçük mobil uygulamalar çıkarıyorum.",
    based: "Menteşe, Muğla · Türkiye",
    emailLabel: "ugurcanguden@gmail.com",
    githubLabel: "github.com/ugurcanguden",
    siteLabel: "ugurcanguden.com",
    experienceHeading: "Deneyim",
    present: "şimdi",
    stackHeading: "Teknolojiler",
    appsHeading: "Uygulamalar",
    appsIntro:
      "Üç uygulama şu anda kullanımda. Nerede tıkandığını ve sırada ne görmek istediğini yaz.",
    appFeedbackLink: "Geri bildirim gönder",
    experience: [
      {
        years: "2024",
        role: "Yazılım Geliştirici",
        company: "Obase",
        desc: "air ai — Microsoft Agent Framework üzerine kurulu çok modüllü bir yapay zeka platformu. MCP servis katmanını geliştiriyorum: Task MCP, Notification MCP ve çevresindeki ortak araçlar.",
        current: true,
      },
      {
        years: "2023",
        role: "Yazılım Geliştirici",
        company: "İntertech",
        desc: "Ödeme mikroservisleri (PaymentCommon, Directory Management) ve diğer ekiplerin üzerine geliştirdiği ortak NuGet / NPM paketleri.",
      },
      {
        years: "2021",
        role: "Yazılım Geliştirici",
        company: "Vakıfbank",
        desc: "İnternet bankacılığı ekranları — milyonlarca kullanıcılı bir üründe yeni akışlar, yeniden yazımlar ve performans iyileştirmeleri.",
      },
      {
        years: "2019",
        role: "Junior'dan Mid Geliştiriciye",
        company: "Pixelsoft",
        desc: "B2B web ve mobil projeler: whindra, AyInvest, kontrat ve sipariş yönetim uygulamaları.",
      },
    ],
    stack: [
      { area: "Backend", items: ".NET, .NET Core, mikroservisler, Redis, MSSQL, NoSQL" },
      { area: "Frontend", items: "React, Next.js, Angular, TypeScript" },
      { area: "Mobil", items: "React Native, Expo" },
      { area: "Platform", items: "Docker, CI/CD, MCP servisleri, ajan mimarileri" },
    ],
    apps: [
      { value: "centerhit", tagline: "Refleks ve nişan antrenmanı" },
      { value: "curiobox", tagline: "Her gün bir kutu merak" },
      { value: "finbuddy", tagline: "Kişisel finans, sade haliyle" },
    ],
  },
  feedback: {
    heading: "Geri bildirim",
    intro:
      "Bir hata, bir fikir ya da hoşuna giden bir şey — hepsi doğrudan bana ulaşıyor.",
    prefilled:
      "Uygulama ve cihaz bilgileri uygulamadan geldi. İstersen değiştir.",
    appField: "Uygulama",
    typeField: "Geri bildirim türü",
    platformField: "Platform",
    versionField: "Uygulama sürümü",
    versionOptional: "opsiyonel",
    versionPlaceholder: "örn. 1.4.2",
    messageField: "Mesajın",
    messagePlaceholder: "Ne oldu, ne beklemiştin ve tekrar nasıl görülebilir?",
    emailField: "E-posta",
    emailHint: "opsiyonel, yalnızca dönüş yapabilmem için",
    emailPlaceholder: "sen@ornek.com",
    submit: "Geri bildirimi gönder",
    submitting: "Gönderiliyor",
    types: {
      bug: "Hata",
      feature: "Özellik isteği",
      improvement: "İyileştirme",
      other: "Başka bir şey",
    },
    platforms: {
      ios: "iOS",
      android: "Android",
      web: "Web",
      other: "Diğer",
    },
    appGeneral: "Genel",
  },
  result: {
    success: "Teşekkürler — geri bildirimin bana ulaştı.",
    invalidApp: "Uygulamalardan birini seç.",
    tooShort: "Mesajın en az 5 karakter olmalı.",
    tooLong: "Mesajın 4000 karakter sınırını aşıyor.",
    failed: "Gönderilemedi. Birazdan tekrar dene.",
  },
  footer: "Uğurcan Güden",
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, tr };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
