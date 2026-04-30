import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomePageContent } from "@/components/HomePageContent";
import { isLocale, routing, type Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const path = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    alternates: {
      canonical: path,
      languages: {
        ro: "/",
        en: "/en",
        ru: "/ru",
        "x-default": "/",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      url: path,
      siteName: "JBI Smile Design",
      locale: locale === "ro" ? "ro_RO" : locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/jbi-logo.png",
          width: 1200,
          height: 630,
          alt: "JBI Smile Design",
        },
      ],
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  setRequestLocale(locale);

  return <HomePageContent />;
}
