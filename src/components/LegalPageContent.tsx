import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { getMessagesForLocale } from "@/lib/i18n-server";
import type { Locale } from "@/i18n/routing";

export const legalSlugs = ["privacy-policy", "cookie-policy", "termeni-conditii"] as const;
export type LegalSlug = (typeof legalSlugs)[number];

type LegalPage = {
  title: string;
  description: string;
  sections: Array<{ title: string; body: string }>;
};

export function isLegalSlug(value: string): value is LegalSlug {
  return legalSlugs.includes(value as LegalSlug);
}

export async function LegalPageContent({
  locale,
  legalSlug,
}: {
  locale: Locale;
  legalSlug: string;
}) {
  if (!isLegalSlug(legalSlug)) notFound();
  setRequestLocale(locale);

  const messages = await getMessagesForLocale(locale);
  const page = messages.legal.pages[legalSlug] as LegalPage;

  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-jbi-soft/50 to-white pb-20 pt-28 sm:pt-36">
        <article className="container-x max-w-4xl">
          <p className="eyebrow">{messages.clinic.name}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-jbi-navy sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-jbi-navy/70 sm:text-lg">
            {page.description}
          </p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {messages.legal.notice}
          </div>

          <div className="mt-10 space-y-6">
            {page.sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-jbi-navy/5 bg-white p-6 shadow-soft">
                <h2 className="font-display text-2xl font-semibold text-jbi-navy">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-jbi-navy/70">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-8 text-sm text-jbi-navy/50">{messages.legal.lastUpdated}</p>
        </article>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
