import type { Metadata } from "next";
import { LegalPageContent, isLegalSlug, legalSlugs, type LegalSlug } from "@/components/LegalPageContent";
import { getMessagesForLocale } from "@/lib/i18n-server";
import { isLocale, routing, type Locale } from "@/i18n/routing";

type LegalPage = {
  title: string;
  description: string;
};

type PageProps = {
  params: Promise<{ locale: string; legalSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    legalSlugs.map((legalSlug) => ({ locale, legalSlug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, legalSlug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  if (!isLegalSlug(legalSlug)) return {};
  const messages = await getMessagesForLocale(locale);
  const page = messages.legal.pages[legalSlug as LegalSlug] as LegalPage;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  return {
    title: `${page.title} | JBI Smile Design`,
    description: page.description,
    alternates: {
      canonical: `${prefix}/${legalSlug}`,
      languages: {
        ro: `/${legalSlug}`,
        en: `/en/${legalSlug}`,
        ru: `/ru/${legalSlug}`,
        "x-default": `/${legalSlug}`,
      },
    },
  };
}

export default async function LocalizedLegalPage({ params }: PageProps) {
  const { locale: rawLocale, legalSlug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  return <LegalPageContent locale={locale} legalSlug={legalSlug} />;
}
