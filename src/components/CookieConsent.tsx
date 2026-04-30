"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { localizedHref, type Locale } from "@/i18n/routing";

const STORAGE_KEY = "jbi-cookie-consent-v2";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const rejectedConsent: Consent = { necessary: true, analytics: false, marketing: false };
const acceptedConsent: Consent = { necessary: true, analytics: true, marketing: true };

export function CookieConsent() {
  const t = useTranslations("cookie");
  const locale = useLocale() as Locale;
  const [consent, setConsent] = useState<Consent | null>(null);
  const [draft, setDraft] = useState<Consent>(rejectedConsent);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Consent;
        setConsent({ necessary: true, analytics: !!parsed.analytics, marketing: !!parsed.marketing });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const decide = (next: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("jbi-cookie-consent-change"));
    setConsent(next);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-lg lg:bottom-6"
        >
          <div className="rounded-2xl border border-jbi-navy/10 bg-white p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue">
                <Cookie className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-jbi-navy">{t("title")}</p>
                <p className="mt-1 text-sm text-jbi-navy/65">
                  {t("text")}
                  {" "}
                  <Link href={localizedHref(locale, "/cookie-policy")} className="text-jbi-blue underline">
                    {t("cookiePolicy")}
                  </Link>
                  {" / "}
                  <Link href={localizedHref(locale, "/privacy-policy")} className="text-jbi-blue underline">
                    {t("privacyPolicy")}
                  </Link>
                </p>

                <div className="mt-4 grid gap-2">
                  <ConsentRow title={t("necessary")} text={t("necessaryText")} checked disabled />
                  <ConsentRow
                    title={t("analytics")}
                    text={t("analyticsText")}
                    checked={draft.analytics}
                    onChange={(analytics) => setDraft((current) => ({ ...current, analytics }))}
                  />
                  <ConsentRow
                    title={t("marketing")}
                    text={t("marketingText")}
                    checked={draft.marketing}
                    onChange={(marketing) => setDraft((current) => ({ ...current, marketing }))}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => decide(acceptedConsent)} className="btn-primary">
                    {t("acceptAll")}
                  </button>
                  <button onClick={() => decide(draft)} className="btn-secondary">
                    {t("save")}
                  </button>
                  <button onClick={() => decide(rejectedConsent)} className="btn-secondary">
                    {t("reject")}
                  </button>
                </div>
              </div>
              <button
                onClick={() => decide(rejectedConsent)}
                aria-label={t("close")}
                className="text-jbi-navy/40 transition-colors hover:text-jbi-navy"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConsentRow({
  title,
  text,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-jbi-navy/5 bg-jbi-soft/30 px-3 py-2">
      <span>
        <span className="block text-sm font-semibold text-jbi-navy">{title}</span>
        <span className="block text-xs text-jbi-navy/60">{text}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="h-4 w-4 rounded border-jbi-navy/20 text-jbi-blue focus:ring-jbi-blue disabled:opacity-60"
      />
    </label>
  );
}
