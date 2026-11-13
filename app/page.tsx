import Link from "next/link";
import { APPS } from "@/lib/apps";

export const metadata = {
  title: "Uğurcan Güden — Software Developer",
  description:
    "Uğurcan Güden · Software Developer. .NET, React, Next.js ve yapay zeka ajan mimarileri üzerine çalışan bir yazılım geliştirici.",
};

const SKILLS = [
  ".NET / .NET Core",
  "React & React Native",
  "Next.js",
  "Angular",
  "Docker & CI/CD",
  "Redis",
  "MSSQL / NoSQL",
  "Microservices",
];

const TIMELINE = [
  {
    role: "Software Developer",
    company: "Obase",
    period: "Günümüz",
    desc: "air ai uygulamasını geliştiriyoruz. Microsoft Agent Framework üzerine kurulu, çok modüllü bir yapay zeka platformu; Task MCP, Notification MCP ve daha birçok MCP servisini yazıyoruz.",
    current: true,
  },
  {
    role: "Software Developer",
    company: "İntertech",
    period: "2023 – 2024",
    desc: "Ödeme sistemleri mikroservisleri (PaymentCommon, Directory Management), ortak NuGet/NPM paketleri ve altyapısal geliştirmeler.",
  },
  {
    role: "Software Developer",
    company: "Vakıfbank",
    period: "2021 – 2023",
    desc: "İnternet bankacılığı ekranları üzerinde çok sayıda geliştirme ve iyileştirme.",
  },
  {
    role: "Junior → Mid Developer",
    company: "Pixelsoft",
    period: "2019 – 2021",
    desc: "B2B web & mobil projeler: whindra, AyInvest, kontrat ve sipariş yönetim uygulamaları.",
  },
];

export default function Home() {
  return (
    <main className="page about">
      <div className="glow" aria-hidden />

      <section className="card">
        <header className="intro">
          <div className="avatar" aria-hidden>
            UG
          </div>
          <div>
            <span className="badge">Software Developer</span>
            <h1>Uğurcan Güden</h1>
            <p className="subtitle">
              7+ yıllık deneyime sahip bir yazılım geliştiriciyim. Bugün{" "}
              <strong>Obase</strong>&apos;de <strong>air ai</strong> adlı yapay
              zeka platformunu geliştiriyoruz — Microsoft Agent Framework ve
              birden fazla MCP servisiyle. İş saatleri dışında da açık kaynak
              paketler üretmeye ve yeni teknolojiler öğrenmeye devam ediyorum.
            </p>
            <div className="links">
              <a href="https://ugurcanguden.com/" target="_blank" rel="noreferrer">
                🌐 ugurcanguden.com
              </a>
              <a
                href="https://github.com/ugurcanguden"
                target="_blank"
                rel="noreferrer"
              >
                💻 GitHub
              </a>
              <a href="mailto:ugurcanguden@gmail.com">✉️ E-posta</a>
            </div>
          </div>
        </header>

        <div className="section">
          <h2>Yetenekler</h2>
          <ul className="chips">
            {SKILLS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Deneyim</h2>
          <ol className="timeline">
            {TIMELINE.map((t) => (
              <li key={t.company} className={t.current ? "now" : ""}>
                <div className="t-head">
                  <strong>{t.role}</strong>
                  <span className="muted">· {t.company}</span>
                  <span className="period">{t.period}</span>
                </div>
                <p>{t.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="section cta-box">
          <h2>Uygulamalarımız</h2>
          <p className="subtitle">
            Aşağıdaki uygulamalar için geri bildirimlerinizi bekliyoruz.
          </p>
          <ul className="apps">
            {APPS.filter((a) => a.value !== "general").map((a) => (
              <li key={a.value} style={{ ["--accent" as string]: a.accent }}>
                {a.label}
              </li>
            ))}
          </ul>
          <Link href="/feedback" className="submit as-link">
            Geri Bildirim Gönder →
          </Link>
        </div>
      </section>

      <footer className="foot">
        © {new Date().getFullYear()} Uğurcan Güden · Menteşe / Muğla
      </footer>
    </main>
  );
}
