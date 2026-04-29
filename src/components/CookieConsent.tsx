"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "jbi-cookie-consent";

type Choice = "accepted" | "rejected" | null;

export function CookieConsent() {
  const [choice, setChoice] = useState<Choice>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setChoice(stored as Choice);
    }
  }, []);

  const decide = (next: "accepted" | "rejected") => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setChoice(next);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {choice === null && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md lg:bottom-6"
        >
          <div className="rounded-2xl border border-jbi-navy/10 bg-white p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue">
                <Cookie className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-jbi-navy">Folosim cookie-uri</p>
                <p className="mt-1 text-sm text-jbi-navy/65">
                  Folosim cookie-uri pentru a îmbunătăți experiența ta pe site.
                  Vezi{" "}
                  <Link href="#" className="text-jbi-blue underline">
                    Politica Cookie
                  </Link>{" "}
                  și{" "}
                  <Link href="#" className="text-jbi-blue underline">
                    Politica de Confidențialitate
                  </Link>
                  .
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => decide("accepted")} className="btn-primary">
                    Acceptă
                  </button>
                  <button onClick={() => decide("rejected")} className="btn-secondary">
                    Refuză
                  </button>
                </div>
              </div>
              <button
                onClick={() => decide("rejected")}
                aria-label="Închide"
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
