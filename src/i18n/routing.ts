import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ro", "en", "ru"],
  defaultLocale: "ro",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export function isLocale(value: string | undefined): value is Locale {
  return routing.locales.includes(value as Locale);
}

export function localePrefix(locale: Locale) {
  return locale === routing.defaultLocale ? "" : `/${locale}`;
}

export function localizedHref(locale: Locale, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  if (href.startsWith("#")) {
    return `${localePrefix(locale) || "/"}${href}`;
  }

  return `${localePrefix(locale)}${href}`;
}
