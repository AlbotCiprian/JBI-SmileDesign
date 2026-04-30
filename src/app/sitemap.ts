import type { MetadataRoute } from "next";

const BASE_URL = "https://jbismiledesign.md";
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

function localizedUrl(locale: string, path: string) {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path || ""}` || `${BASE_URL}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: now,
      changeFrequency,
      priority: locale === DEFAULT_LOCALE ? priority : Math.max(0.3, priority - 0.1),
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((alt) => [alt, localizedUrl(alt, path)]),
          ),
          "x-default": localizedUrl(DEFAULT_LOCALE, path),
        },
      },
    })),
  );
}
