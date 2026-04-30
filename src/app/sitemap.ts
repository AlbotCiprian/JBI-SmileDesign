import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const LOCALES = ["ro", "en", "ru"] as const;
const DEFAULT_LOCALE = "ro";
const LEGAL_SLUGS = ["privacy-policy", "cookie-policy", "termeni-conditii"];

type LocalizedRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: LocalizedRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  ...LEGAL_SLUGS.map((slug) => ({
    path: `/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  })),
];

function localizedUrl(baseUrl: string, locale: string, path: string) {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${baseUrl}${prefix}${path || ""}` || `${baseUrl}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return ROUTES.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(baseUrl, locale, path),
      lastModified: now,
      changeFrequency,
      priority: locale === DEFAULT_LOCALE ? priority : Math.max(0.3, priority - 0.1),
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((alt) => [alt, localizedUrl(baseUrl, alt, path)]),
          ),
          "x-default": localizedUrl(baseUrl, DEFAULT_LOCALE, path),
        },
      },
    })),
  );
}
