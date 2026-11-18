import Link from "next/link";
import type { Metadata } from "next";
import PrefsBar from "./components/PrefsBar";
import { APPS } from "@/lib/apps";
import { getDictionary } from "@/lib/i18n";
import { pickParam, resolveLocale, resolveTheme } from "@/lib/prefs";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const dict = getDictionary(
    await resolveLocale(pickParam(await searchParams, "lang", "locale")),
  );
  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const locale = await resolveLocale(pickParam(sp, "lang", "locale"));
  const theme = await resolveTheme();
  const dict = getDictionary(locale);
  const t = dict.home;

  const accentOf = (value: string) =>
    APPS.find((app) => app.value === value)?.accent ?? "var(--signal)";
  const nameOf = (value: string) =>
    APPS.find((app) => app.value === value)?.label ?? value;

  return (
    <div className="shell">
      <a className="skip" href="#main">
        {dict.nav.skipToContent}
      </a>

      <PrefsBar locale={locale} theme={theme} dict={dict} />

      <main id="main">
        <header className="masthead">
          <p className="role">{t.role}</p>
          <h1 className="name">
            <span>{t.nameFirst}</span>
            <span>{t.nameLast}</span>
          </h1>
          <hr />
          <p className="intro">{t.intro}</p>
          <p className="where">{t.based}</p>
          <ul className="contact">
            <li>
              <a href="mailto:ugurcanguden@gmail.com">{t.emailLabel}</a>
            </li>
            <li>
              <a
                href="https://github.com/ugurcanguden"
                target="_blank"
                rel="noreferrer"
              >
                {t.githubLabel}
              </a>
            </li>
            <li>
              <a href="https://ugurcanguden.com/" target="_blank" rel="noreferrer">
                {t.siteLabel}
              </a>
            </li>
          </ul>
        </header>

        <section className="block">
          <h2>{t.experienceHeading}</h2>
          <ol className="record">
            {t.experience.map((entry) => (
              <li key={entry.company} className={entry.current ? "live" : ""}>
                <div className="year">
                  {entry.years}
                  {entry.current && <span className="now">{t.present}</span>}
                </div>
                <div>
                  <h3 className="job">
                    {entry.role} <span className="at">{entry.company}</span>
                  </h3>
                  <p>{entry.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="block">
          <h2>{t.stackHeading}</h2>
          <dl className="stack">
            {t.stack.map((group) => (
              <div key={group.area} style={{ display: "contents" }}>
                <dt>{group.area}</dt>
                <dd>{group.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="block">
          <h2>{t.appsHeading}</h2>
          <p className="lede">{t.appsIntro}</p>
          <ul className="apps">
            {t.apps.map((app) => (
              <li key={app.value}>
                <span
                  className="mark"
                  style={{ ["--accent" as string]: accentOf(app.value) }}
                  aria-hidden
                />
                <strong>{nameOf(app.value)}</strong>
                <span className="tag">{app.tagline}</span>
                <Link href={`/feedback?app=${app.value}&lang=${locale}`}>
                  {t.appFeedbackLink}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="foot">
        {new Date().getFullYear()} {dict.footer}
      </footer>
    </div>
  );
}
