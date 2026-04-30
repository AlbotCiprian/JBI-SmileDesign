import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { LegalPageContent } from "@/components/LegalPageContent";
import messages from "../../../messages/ro.json";

const page = messages.legal.pages["cookie-policy"];

export const metadata: Metadata = {
  title: `${page.title} | JBI Smile Design`,
  description: page.description,
  alternates: {
    canonical: "/cookie-policy",
    languages: {
      ro: "/cookie-policy",
      en: "/en/cookie-policy",
      ru: "/ru/cookie-policy",
      "x-default": "/cookie-policy",
    },
  },
};

export default function CookiePolicyPage() {
  return (
    <NextIntlClientProvider locale="ro" messages={messages}>
      <LegalPageContent locale="ro" legalSlug="cookie-policy" />
    </NextIntlClientProvider>
  );
}
