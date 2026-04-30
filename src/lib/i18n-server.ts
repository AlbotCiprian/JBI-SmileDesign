import { isLocale, routing, type Locale } from "@/i18n/routing";
import type { Messages } from "@/i18n/messages";

export async function getMessagesForLocale(locale?: string): Promise<Messages> {
  const safeLocale: Locale = isLocale(locale) ? locale : routing.defaultLocale;
  return (await import(`../../messages/${safeLocale}.json`)).default;
}
