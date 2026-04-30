import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { LegalPageContent } from "@/components/LegalPageContent";
import messages from "../../../messages/ro.json";

const page = messages.legal.pages["privacy-policy"];

export const metadata: Metadata = {
  title: `${page.title} | JBI Smile Design`,
  description: page.description,
  alternates: {
    canonical: "/privacy-policy",
    languages: {
      ro: "/privacy-policy",
      en: "/en/privacy-policy",
      ru: "/ru/privacy-policy",
      "x-default": "/privacy-policy",
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <NextIntlClientProvider locale="ro" messages={messages}>
      <LegalPageContent locale="ro" legalSlug="privacy-policy" />
    </NextIntlClientProvider>
  );
}
