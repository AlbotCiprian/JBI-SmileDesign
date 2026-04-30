import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { LegalPageContent } from "@/components/LegalPageContent";
import messages from "../../../messages/ro.json";

const page = messages.legal.pages["termeni-conditii"];

export const metadata: Metadata = {
  title: `${page.title} | JBI Smile Design`,
  description: page.description,
  alternates: {
    canonical: "/termeni-conditii",
    languages: {
      ro: "/termeni-conditii",
      en: "/en/termeni-conditii",
      ru: "/ru/termeni-conditii",
      "x-default": "/termeni-conditii",
    },
  },
};

export default function TermsPage() {
  return (
    <NextIntlClientProvider locale="ro" messages={messages}>
      <LegalPageContent locale="ro" legalSlug="termeni-conditii" />
    </NextIntlClientProvider>
  );
}
